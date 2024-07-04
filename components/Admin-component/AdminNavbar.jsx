'use client'
import { useEffect, useState } from "react"

export default function AdminNavbar({userData}){

    return (
        <>
            <nav className="w-full fixed z-20 h-14 bg-slate-100 shadow-md flex justify-between items-center">
                <div className="flex gap-5 h-full">
                    <div className="w-[300px] h-full bg-slate-200 flex justify-center items-center">
                        <img src="assets/logo.png" alt="Logo"/>
                    </div>
                    <button>=</button>
                </div>

                <div className="me-10 text-xs flex gap-3">
                    <div>
                        <img  src={`data:image/png;base64, ${userData.image}`} alt="profile" className="w-7 h-7 bg-slate-200 rounded-full" />
                    </div>
                    <div>
                        <h1 className="font-bold">{userData.name}</h1>
                        <p>{userData.roles}</p>
                    </div>
                </div>
            </nav>
        </>
    )
}