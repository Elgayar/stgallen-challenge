const functions = require("firebase-functions");
const { Storage } = require("@google-cloud/storage");
const cors = require("cors")({ origin: true });
const busboy = require("busboy");
const path = require("path");
const os = require("os");
const fs = require("fs");
const vision = require("@google-cloud/vision");

const gcsConfig = {
  projectId: "stgallenstart",
  keyFileName: "adminsdk.json",
};

const storage = new Storage(gcsConfig);
const visionClient = new vision.ImageAnnotatorClient({
  keyFilename: "apiKey.json",
});

exports.uploadFile = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    if (req.method !== "POST") {
      return res.status(500).json({
        message: "Not allowed",
      });
    }

    const bb = busboy({ headers: req.headers });
    let uploadData = null;
    let nameOfFile = "";

    bb.on("file", (name, file, filename, encoding, mimetype) => {
      let parts = filename.filename.split(".");
      let extension = parts[parts.length - 1];
      nameOfFile = `image-${Date.now()}.${extension}`;
      const filepath = path.join(os.tmpdir(), nameOfFile);
      uploadData = { file: filepath, type: mimetype };
      file.pipe(fs.createWriteStream(filepath));
    });

    bb.on("finish", () => {
      const bucket = storage.bucket("stgallenstart.appspot.com");
      bucket
        .upload(uploadData.file, {
          uploadType: "media",
          metadata: {
            metadata: {
              contentType: uploadData.type,
            },
          },
        })
        .then(() => {
          const imgUrl = `https://firebasestorage.googleapis.com/v0/b/stgallenstart.appspot.com/o/${nameOfFile}?alt=media`;
          visionClient
            .labelDetection(imgUrl)
            .then((result) => {
              res.status(200).json({
                message: "It worked",
                result,
                imgUrl,
              });
            })
            .catch((err) => {
              res.status(500).json({
                error: err,
              });
            });
        })
        .catch((err) => {
          res.status(500).json({
            error: err,
          });
        });
    });
    bb.end(req.rawBody);
  });
});
