import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";

export default function SidebarCard({ platform, name, status, amountspend, reach, startdate, id, onCardClick, atc, click }) {
  const [Status, setStatus] = useState("");
  const t = useTranslations("sidebar");

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
    <div 
      className="text-sm text-black dark:text-slate-300 border-b-2 border-gray-300 dark:border-slate-600 hover:cursor-pointer hover:bg-gray-200 dark:hover:bg-slate-600 active:bg-gray-300 dark:active:bg-slate-700 p-5 transition-all duration-300 ease-in-out shadow-sm hover:shadow-md active:shadow-lg transform"
      onClick={() => { onCardClick(id, name, platform, amountspend, atc); click() }}
    >
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-3">
          <Image 
            src={`/assets/${platform === 1 ? 'meta.svg' : platform === 2 ? 'google.svg' : platform === 3 ? 'tiktok.svg' : ''}`} 
            className=""
            width={23}
            height={23} 
            alt={`${name} logo`} 
          />
          <p className="font-medium text-md text-gray-600 dark:text-slate-200">{name}</p>
        </div>
        <p className={`${Status} w-3 h-3 rounded-full`} title={`${status == 1 ? "active" : status == 2 ? "draft" : status == 3 ? "finsih" : "unknown"}`}></p>
      </div>
      <div className="flex flex-col text-xs gap-1 mt-3">
        <p className="text-gray-500 dark:text-slate-300"><b className="text-gray-600 dark:text-slate-200 font-medium">{t('amount-spent')}:</b> <span className="font-semibold">{amountspend}</span></p>
        <p className="text-gray-500 dark:text-slate-300"><b className="text-gray-600 dark:text-slate-200 font-medium">{t('reach')}:</b> <span className="font-semibold">{reach}</span></p>
        <p className="text-gray-500 dark:text-slate-300"><b className="text-gray-600 dark:text-slate-200 font-medium">{t('start-date')}:</b> <span className="font-semibold">{startdate}</span></p>
      </div>
    </div>
  );
}
