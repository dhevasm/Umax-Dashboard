"use client";

import Navbar from "@/components/Navbar";
import CampaignTable from "@/components/Table/CampaignTable";
import { useRef } from "react";

const page = () => {
    const Card = useRef(null);

  return (
    <div className="w-full h-screen bg-white">
      <Navbar />
      <div className="w-full mt-16 h-fit">
        <div className="w-full h-full md:p-10 p-5 bg-white">
          <CampaignTable/>
        </div>
      </div>
    </div>
  );
};

export default page;
