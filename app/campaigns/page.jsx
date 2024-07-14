"use client";

import TableLoading from "@/components/Loading/TableLoading";
import Navbar from "@/components/Navbar";
import dynamic from "next/dynamic";
import { Suspense, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
const CampaignTable = dynamic(() => import("@/components/Table/CampaignTable"), {ssr: false,});

const Page = () => {
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
    <div className='w-full h-screen bg-white dark:bg-slate-900'>
      <Navbar />
      <div className="w-full mt-20 h-fit">
        <div className="w-full h-full md:p-10 p-5 bg-white dark:bg-slate-900">
          <Suspense fallback={<TableLoading/>}>
            <CampaignTable/>
          </Suspense>
        </div>
      </div>
    </div> 
  );
};

export default Page;
