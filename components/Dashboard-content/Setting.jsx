'use client'
import axios from "axios";
import { useState, useEffect, useRef } from "react";

const Setting = ({ campaign_id }) => {
  const [data, setData] = useState([]);

  async function getData() {
    await axios
      .get(
        `https://umaxxnew-1-d6861606.deta.app/side-cart?campaign_id=${campaign_id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        setData(res.data.Data);
        // console.log(res.data.Data)
      })
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {
    getData();
  }, [campaign_id]);

  return (
    <>
      {data.length !== 0 ? (
        <div className="w-full md:w-1/2">
          <div className="ms-16 mt-7 flex flex-col md:flex-row md:justify-between gap-2">
            <div>
              <label htmlFor="rar">React Amount Ratio (RAR)</label>
              <p className="font-thin">
                {"Recomended value " + data[0].rar.target}
              </p>
            </div>
            <div className="w-2/3 md:w-1/5 flex items-center rounded">
              <input
                type="text"
                className="border border-gray-400  py-2 px-4 rounded-s-lg"
                value={data[0].rar.value}
              />
              <h1 className=" text-xl bg-blue-500 text-white px-3 py-2 rounded-e-lg">
                %
              </h1>
            </div>
          </div>
          <div className="ms-16 mt-7 flex flex-col md:flex-row md:justify-between gap-2">
            <div>
              <label htmlFor="rar">Click Throught Rate (CTR)</label>
              <p className="font-thin">
                {"Recomended value " + data[5].ctr.target}
              </p>
            </div>
            <div className="w-2/3 md:w-1/5 flex items-center rounded">
              <input
                type="text"
                className="border border-gray-400  py-2 px-4 rounded-s-lg"
                value={data[5].ctr.value}
              />
              <h1 className=" text-xl bg-blue-500 text-white px-3 py-2 rounded-e-lg">
                %
              </h1>
            </div>
          </div>
          <div className="ms-16 mt-7 flex flex-col md:flex-row md:justify-between gap-2">
            <div>
              <label htmlFor="rar">Outbont Click Landing Page (OCLP)</label>
              <p className="font-thin">
                {"Recomended value " + data[1].oclp.target}
              </p>
            </div>
            <div className="w-2/3 md:w-1/5 flex items-center rounded">
              <input
                type="text"
                className="border border-gray-400  py-2 px-4 rounded-s-lg"
                value={data[1].oclp.value}
              />
              <h1 className=" text-xl bg-blue-500 text-white px-3 py-2 rounded-e-lg">
                %
              </h1>
            </div>
          </div>
          <div className="ms-16 mt-7 flex flex-col md:flex-row md:justify-between gap-2">
            <div>
              <label htmlFor="rar">Return on AD Spent (ROAS)</label>
              <p className="font-thin">
                {"Recomended value " + data[4].roas.target}
              </p>
            </div>
            <div className="w-2/3 md:w-1/5 flex items-center rounded">
              <input
                type="text"
                className="border border-gray-400  py-2 px-4 rounded-s-lg"
                value={data[4].roas.value}
              />
              <h1 className=" text-xl bg-blue-500 text-white px-3 py-2 rounded-e-lg">
                %
              </h1>
            </div>
          </div>
          <div className="ms-16 mt-7 flex flex-col md:flex-row md:justify-between gap-2">
            <div>
              <label htmlFor="rar">Cost per Result (CPR)</label>
              <p className="font-thin">
                {"Recomended value " + data[2].cpr.target}
              </p>
            </div>
            <div className="w-2/3 md:w-1/5 flex items-center rounded">
              <h1 className=" text-xl bg-blue-500 text-white px-3 py-2 rounded-s-lg">
                Rp
              </h1>
              <input
                type="text"
                className="border border-gray-400  py-2 px-4 rounded-e-lg"
                value={data[2].cpr.value}
              />
            </div>
          </div>
          <div className="ms-16 mt-7 flex flex-col md:flex-row md:justify-between gap-2">
            <div>
              <label htmlFor="rar">Cost per Click (CPC)</label>
              <p className="font-thin">
                {"Recomended value " + data[3].cpc.target}
              </p>
            </div>
            <div className="w-2/3 md:w-1/5 flex items-center rounded">
              <h1 className=" text-xl bg-blue-500 text-white px-3 py-2 rounded-s-lg">
                Rp
              </h1>
              <input
                type="text"
                className="border border-gray-400  py-2 px-4 rounded-e-lg"
                value={data[3].cpc.value}
              />
            </div>
          </div>

          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded absolute right-0 bottom-5 mt-5 me-20">
            Save
          </button>
        </div>
      ) : (
        "Pilih Campaign Terlebih Dahulu"
      )}
    </>
  );
};

export default Setting;
