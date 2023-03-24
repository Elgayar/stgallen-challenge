const express = require("express");

const app = express();
const vision = require("@google-cloud/vision");

const cors = require("cors");
app.listen(8080, () => console.log("Server running"));

app.use(cors());

async function quickstart() {
  // Creates a client
  const client = new vision.ImageAnnotatorClient({
    keyFilename: "apiKey.json",
  });

  // Performs label detection on the image file
  const [result] = await client.labelDetection(
    "https://firebasestorage.googleapis.com/v0/b/stgallenstart.appspot.com/o/image-1679551122928.jpg?alt=media"
  );
  const labels = result.labelAnnotations;
  console.log("Labels:");
  labels.forEach((label) => console.log(label.description));
}
quickstart();
