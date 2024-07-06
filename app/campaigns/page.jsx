"use client";

import TableLoading from "@/components/Loading/TableLoading";
import Navbar from "@/components/Navbar";
import CampaignTable from "@/components/Table/CampaignTable";
import { Suspense, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

const page = () => {
    const Card = useRef(null);
    const router = useRouter();
    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
        Swal.fire('You Must Login First', 'Nice Try!', 'error').then(() => {
            router.push('/');
        });
        }
    }, [router]);

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
