"use client";

import Navbar from "@/components/Navbar";
import CampaignTable from "@/components/Table/CampaignTable";
import { useRef } from "react";

const page = () => {
    const Card = useRef(null);

  return (
    <>
      <Navbar />
      <div className="w-full mt-16 h-screen pb-10">
        <div className="w-full h-full p-10 bg-white">
          <CampaignTable/>
        </div>
      </div>
    </>
  );
};

export default page;
