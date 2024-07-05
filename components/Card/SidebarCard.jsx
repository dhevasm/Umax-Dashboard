import { useState, useEffect } from "react";

export default function SidebarCard({ platform, name, status, amountspend, reach, startdate, id, onCardClick }) {
  const [Status, setStatus] = useState("");

  useEffect(() => {
    if (status == "active") {
      setStatus("bg-green-500");
    } else if (status == "complete") {
      setStatus("bg-yellow-500");
    } else {
      setStatus("bg-gray-500");
    }
  }, [status]);

  return (
    <>
      <div className="text-sm text-black border-b-2 border-gray-300 hover:cursor-pointer hover:bg-cyan-300 p-5" onClick={() => onCardClick(id)}>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src={`../assets/${platform == 1 ? 'meta.svg' : platform == 2 ? 'google.svg' : platform == 3 ? 'tiktok.svg' : null}`} className="w-[25px]" alt="" />
            <p>{name}</p>
          </div>
          <p className={`${Status} w-3 h-3 rounded-full`}></p>
        </div>
        <div className="flex flex-col text-xs gap-1 mt-3">
          <p><b>Amountspent :</b> {amountspend}</p>
          <p><b>Reach : </b>{reach}</p>
          <p><b>Start Date : </b>{startdate}</p>
        </div>
      </div>
    </>
  );
}
