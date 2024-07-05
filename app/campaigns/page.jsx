"use client";

import TableLoading from "@/components/Loading/TableLoading";
import Navbar from "@/components/Navbar";
import CampaignTable from "@/components/Table/CampaignTable";
import { Suspense, useRef } from "react";

const page = () => {
    const Card = useRef(null);

  return (
    <div className="w-full h-full bg-white">
      <Navbar />
      <div className="w-full mt-16 h-full">
        <div className="w-full h-[60%] md:p-10 p-5 bg-white">
          <Suspense fallback={<TableLoading/>}>
            <CampaignTable/>
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default page;
