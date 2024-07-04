'use client'

export default function CountCard({color, title, value}){
    return (
        <>
            <div className={`w-[300px] h-[100px] bg-${color}-200 border border-${color}-500 text-${color}-500 shadow-lg rounded-lg flex justify-center items-center`}>
                <div className="flex flex-col items-center">
                    <h1 className="text-3xl font-bold">{value}</h1>
                    <p>{title}</p>
                </div>
            </div>
        </>
    )
}