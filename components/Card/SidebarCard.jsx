import { useState, useEffect } from "react";

export default function SidebarCard({ platform, name, status, amountspend, reach, startdate, id, onCardClick }) {
  const [Status, setStatus] = useState("");

  useEffect(() => {
    if (status == 1) {
      setStatus("bg-green-500");
    } else if (status == 3 ) {
      setStatus("bg-yellow-500");
    } else {
      setStatus("bg-gray-500");
    }
  }, [status]);

  return (
    <>
      <div 
      className="text-sm text-black border-b-2 border-gray-300 hover:cursor-pointer hover:bg-blue-100 active:bg-blue-200 p-5 rounded-lg transition-all duration-300 ease-in-out shadow-sm hover:shadow-md active:shadow-lg transform"
      onClick={() => onCardClick(id, name, platform)}
    >
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-3">
          <img 
            src={`../assets/${platform === 1 ? 'meta.svg' : platform === 2 ? 'google.svg' : platform === 3 ? 'tiktok.svg' : ''}`} 
            className="w-6 h-6" 
            alt={`${name} logo`} 
          />
          <p className="font-semibold text-md text-gray-600">{name}</p>
        </div>
        <p className={`${Status} w-3 h-3 rounded-full`}></p>
      </div>
      <div className="flex flex-col text-xs gap-1 mt-3">
        <p className="text-gray-500"><b className="text-gray-600">Amount spent:</b> <span className="font-semibold">{amountspend}</span></p>
        <p className="text-gray-500"><b className="text-gray-600">Reach:</b> <span className="font-semibold">{reach}</span></p>
        <p className="text-gray-500"><b className="text-gray-600">Start Date:</b> <span className="font-semibold">{startdate}</span></p>
      </div>
    </div>

    </>
  );
}
