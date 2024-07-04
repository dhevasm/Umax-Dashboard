'use client'

import MetricCard from "../Card/MetricCard"

export default function Metrics(){

    return (    
        <>
        <div className="w-full">
            {/* Content */}
            <div className="w-full">
                <p>Metrics</p>

            {/* Metrics */}
            <div className="flex flex-wrap gap-10">
                <MetricCard Title="Total Users" Value="1000"/>  
                <MetricCard Title="Total Users" Value="1000"/>
                <MetricCard Title="Total Users" Value="1000"/>
                <MetricCard Title="Total Users" Value="1000"/>
                <MetricCard Title="Total Users" Value="1000"/>
                <MetricCard Title="Total Users" Value="1000"/>
                <MetricCard Title="Total Users" Value="1000"/>
                <MetricCard Title="Total Users" Value="1000"/>
                <MetricCard Title="Total Users" Value="1000"/>
                <MetricCard Title="Total Users" Value="1000"/>
                <MetricCard Title="Total Users" Value="1000"/>
                <MetricCard Title="Total Users" Value="1000"/>
            </div>

            </div>
        </div>
        </>
    )
}