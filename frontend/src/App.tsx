import './App.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { trash } from './data';
import Navbar from './Components/Navbar';
import BottomNavbar from './Components/BottomNavbar';
import UploadImage from './Components/UploadImage';
import PaymentType from './Components/PaymentType';
import InputField from './Components/InputField';
import CalendarSection from './Components/CalendarSection';

function App() {
  const [result, setResult] = useState<any>([]);
  const [imgUrl, setImgUrl] = useState<string>('');
  const [error, setError] = useState<boolean>(false);
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const [searchValue, setSearchValue] = useState<string | undefined>('');
  const [searchMatch, setSearchMatch] = useState<any>('');
  const [receipt, setReceipt] = useState<any>([]);

  useEffect(() => {}, [result, searchValue]);

  const onImageSelect = (event: any) => {
    const fd = new FormData();
    fd.append(`image-${Date.now()}`, event.target.files[0], event.target.files[0].name);

    axios
      .post('https://us-central1-stgallenstart.cloudfunctions.net/uploadFile', fd, {
        onUploadProgress: (progressEvent) =>
          setLoadingProgress(Math.round((progressEvent?.loaded / progressEvent.total!) * 100)),
      })
      .then((response) => {
        setResult(response.data.result[0].labelAnnotations);
        setImgUrl(response.data.imgUrl);
        setSearchValue(
          trash.find((element) =>
            response.data.result[0].labelAnnotations.map((item: any) => item.description).includes(element.Item),
          )?.Item,
        );
      });
  };

  const onInputChange = (event: any) => {
    setSearchValue(event.target.value);
    setSearchMatch(trash.find((element) => element.Item.toLowerCase() === searchValue?.toLowerCase()));
  };

  const onSubmit = () => {
    const searchResult = trash.find((element) => element.Item.toLowerCase() === searchValue?.toLowerCase());
    if (searchResult) {
      setSearchMatch(trash.find((element) => element.Item.toLowerCase() === searchValue?.toLowerCase()));
      setReceipt((prev: any) => [...prev, searchResult]);
      setError(false);
      setSearchValue('');
    } else {
      setError(true);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto mb-24">
        <h1 className="text-4xl font-bold mb-2">Hello, Anna!</h1>
        <h1 className="text-xl font-medium mb-12">
          Upload the item you would like to dispose here and finish the process in less than a minute!
        </h1>
        <div className="grid grid-cols-5 gap-12">
          <div className="flex flex-col w-full col-span-2">
            <h1 className="text-2xl font-bold mb-4">Step 1: Upload your disposal</h1>
            <div className="flex flex-col bg-stone-100 p-8 rounded-2xl">
              {!result || result.length < 1 ? (
                <UploadImage onImageSelect={onImageSelect} />
              ) : (
                <>
                  <img src={imgUrl} alt="" />
                </>
              )}
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div className="bg-red-600 h-2.5 rounded-full" style={{ width: `${loadingProgress}%` }}></div>
              </div>
              <form className="my-4 w-full">
                <label
                  htmlFor="default-search"
                  className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
                >
                  Search
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg
                      aria-hidden="true"
                      className="w-5 h-5 text-gray-500 dark:text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      ></path>
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="default-search"
                    value={searchValue}
                    onChange={onInputChange}
                    className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-red-500 dark:focus:border-red-500"
                    placeholder="Search for furniture, bikes, electronics, etc..."
                    required
                  />
                  <button
                    type="submit"
                    onClick={onSubmit}
                    className="text-white absolute right-2.5 bottom-2.5 bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                  >
                    Add to list
                  </button>
                </div>
                <div className="grid gap-3 mb-6 md:grid-cols-2 mt-4">
                  <InputField
                    label="Weight (kg)"
                    field="weight"
                    value={searchMatch?.Weight}
                    placeholder={'125 (kg)'}
                    type="number"
                  />
                  <InputField
                    label="Volume (m³)"
                    field="volume"
                    value={searchMatch?.Volume ? searchMatch?.Volume * 10 : undefined}
                    placeholder={'1.2 (m³)'}
                    type="number"
                  />
                </div>
              </form>
              {error && <span className="mb-4">We haven't heard of this item before :(</span>}
            </div>
            <h1 className="text-2xl font-bold my-4">Step 2: Address information</h1>
            <form className="mb-4 w-full bg-stone-100 p-8 rounded-2xl">
              <InputField label="Last name" field="lastName" placeholder="Egger" type="text" />
              <div className="grid gap-3 mb-6 md:grid-cols-2 mt-4">
                <InputField label="Street name" field="streetName" placeholder="Lämmlisbrunnenstr." type="text" />
                <InputField label="PLZ" field="plz" placeholder="9000" type="text" />
                <InputField label="City" field="city" placeholder="St. Gallen" type="text" />
                <InputField label="Country" field="country" placeholder="Switzerland" type="text" />
              </div>
            </form>
          </div>
          <div className="flex flex-col col-span-3 ">
            <h1 className="text-2xl font-bold mb-4">Step 3: Payment & pick-up information</h1>
            <div className="w-full bg-stone-100 p-8 rounded-2xl">
              <div className="flex flex-row justify-center">
                <div>
                  <div className="flex flex-row  justify-center">
                    <img src="tickets.png" height="80px" width="80px" className="mb-8" />
                  </div>
                  <div className="flex flex-col flex-start w-full">
                    {receipt.map((item: any) => (
                      <h1 key={item.Item} className="text-xl font-medium">
                        <div className="flex flex-row justify-between">
                          <span className="w-24 text-right mr-2">{item.Item}</span>
                          <span className="w-64">..........................................</span>
                          <span className="w-24">{item.Points} stamps</span>
                        </div>
                      </h1>
                    ))}
                    <div className="border my-8" />
                    {receipt.length > 0 && (
                      <div className="flex flex-col">
                        <h1 className="text-lg text-gray-700">
                          <div className="flex flex-row justify-between">
                            <span className="w-36 text-right mr-2"> Total Stamps</span>
                            <span className="w-26">
                              {receipt.reduce((partialSum: any, a: any) => partialSum + a.Points, 0)} stamps
                            </span>
                          </div>
                        </h1>{' '}
                      </div>
                    )}
                    {receipt.length > 0 && (
                      <div className="flex flex-col mt-6">
                        <h1 className="text-lg font-medium">
                          <div className="flex flex-row justify-between">
                            <span className="w-36 text-right font-bold mr-2"> Total Sum</span>
                            <span className="w-26 font-bold">
                              {(receipt.reduce((partialSum: any, a: any) => partialSum + a.Points, 0) * 7).toFixed(2)}{' '}
                              CHF
                            </span>
                          </div>
                        </h1>{' '}
                        <span className="text-right text-gray-400 text-xs">Price per Stamp 1 x CHF 7</span>
                        <ul className="grid w-full gap-4 md:grid-cols-2 mt-8">
                          <PaymentType name="Credit/Debit">
                            <img src="credit.png" width="70px" height="20px" alt="" />
                          </PaymentType>
                          <PaymentType name="PostFinance">
                            <img src="post.png" width="55px" height="20px" alt="" />
                          </PaymentType>
                          <PaymentType name="Twint">
                            <img src="twint.png" width="70px" height="20px" alt="" />
                          </PaymentType>
                          <PaymentType name="Reka">
                            <img src="reka.png" width="100px" height="20px" alt="" />
                          </PaymentType>
                        </ul>
                        <button
                          type="submit"
                          onClick={onSubmit}
                          className="text-white mt-8 bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                        >
                          Purchase now
                        </button>
                      </div>
                    )}

                    {receipt.length === 0 && (
                      <h1 className="block text-xl font-medium">You currently have no disposals.</h1>
                    )}
                  </div>
                  <div className="flex flex-row flex-end w-full"></div>
                </div>
              </div>
            </div>

            <CalendarSection />
          </div>
        </div>
      </div>

      <BottomNavbar />
    </>
  );
}

export default App;
