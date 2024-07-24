'use client'

import axios from "axios"
import { useState,useEffect, useRef, useContext } from "react"
import { AdminDashboardContext } from "@/app/[locale]/admin-dashboard/page"
import Swal from "sweetalert2"
import { useDownloadExcel } from "react-export-table-to-excel"
import jsPDF from "jspdf"
import 'jspdf-autotable'
import { IconContext } from "react-icons"
import { AiOutlineFilePdf } from "react-icons/ai"
import { FaTable } from "react-icons/fa"
import { FaTrash } from "react-icons/fa"
import { FaTimes } from "react-icons/fa"
import { RiFileExcel2Line, RiMegaphoneLine } from "react-icons/ri"
import CountCard from "./CountCard"
import { BiPlus } from "react-icons/bi"
import { date } from "yup"
import { useTranslations } from "next-intl"

export default function CampaignTable() {

    const [campaigns, setCampaigns] = useState([])
    const [campaignMemo, setCampaignMemo] = useState([])
    const [EditCampaignId, setEditCampaignId] = useState(null)
    const [selectedPlatform, setSelectedPlatform] = useState("");
    const [selectedObjective, setSelectedObjective] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [dataPerPage, setDataPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");
    const t = useTranslations("admin-campaigns");
    const tfile = useTranslations("swal-file");
    const tdel = useTranslations("swal-delete");

    const {sidebarHide, setSidebarHide, updateCard, setUpdateCard, changeTable, setChangeTable,  userData, dataDashboard} = useContext(AdminDashboardContext)

    const addModal = useRef(null)
    const [modeModal, setModeModal] = useState("add")

    // validasi form
    const [values, setValues] = useState({name: '', start_date: '', end_date: ''})
    const [error, setError] = useState({
        name: '',
        start_date: '',
        end_date: '',
        account : '',
        objective: '',
        status : ''
    })
    const [isvalid, setIsvalid] = useState(false)

    function validateForm(){
        let errors = {}
        if(values.name == ''){
            errors.name = t('name-error')
        }
        if(values.start_date == ''){
            errors.start_date = t('start-date-error')
        }
        if(values.end_date == ''){
            errors.end_date = t('end-date-error')
        }
        if(values.account == ''){
            errors.account = t('account-error')
        }
        if(values.objective == ''){
            errors.objective = t('objective-error')
        }
        if(values.status == ''){
            errors.status = t('status-error')
        }
        setError(errors)
        setIsvalid(Object.keys(errors).length === 0)
    }

    useEffect(() => {
        validateForm()
    }, [values])

    function showModal(mode, campaign_id = null ){
        setModeModal(mode)
        if(mode == "Edit"){
            const filteredCampaign = campaigns.filter(campaign => campaign._id === campaign_id);
            if(filteredCampaign.length > 0){
                setValues({name: filteredCampaign[0].name, start_date: filteredCampaign[0].start_date, end_date: filteredCampaign[0].end_date, account: filteredCampaign[0].account_id, objective: filteredCampaign[0].objective, status: filteredCampaign[0].status})
                setError({name: '', start_date: '', end_date: '', account: '', objective: '', status: ''})
                // console.log(filteredCampaign[0])
                setEditCampaignId(campaign_id)
                dateconvert(filteredCampaign[0].start_date)
                document.getElementById('name').value = filteredCampaign[0].name
                document.getElementById('tenant').value = filteredCampaign[0].tenant_id
                document.getElementById('account').value = filteredCampaign[0].account_id
                document.getElementById('objective').value = filteredCampaign[0].objective
                document.getElementById('start_date').value = dateconvert(filteredCampaign[0].start_date)
                filteredCampaign[0].end_date ? document.getElementById('end_date').value = dateconvert(filteredCampaign[0].end_date) : 
                filteredCampaign[0].end_date ? document.getElementById('end_date').value = dateconvert(filteredCampaign[0].end_date) : ""
                document.getElementById('status').value = filteredCampaign[0].status 
                
            } else{
                Swal.fire("Campaign not found");
            }
        }else if(mode == "Create") {
            setValues({name: '', start_date: '', end_date: '', account: '', objective: '', status: ''})
            setError({name: '', start_date: '', end_date: '', account: '', objective: '', status: ''})
            document.getElementById('account').value = ""
            document.getElementById('objective').value = ""
            document.getElementById('status').value = ""
            document.getElementById('name').value = ""
            document.getElementById('start_date').value = ""
            document.getElementById('end_date').value = ""
        }
        addModal.current.classList.remove("hidden")
    }
    function closeModal(){
        addModal.current.classList.add("hidden")
    }
    
    function handleDelete(campaign_id){
        Swal.fire({
            title: tdel('warn'),
            text: tdel('msg'),
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: tdel('yes'),
            cancelButtonText: tdel('no'),
          }).then((result) => {
            if (result.isConfirmed) {
            deleteCampaign(campaign_id)
            Swal.fire({
                title: tdel('success'),
                text: tdel('suc-msg'),
                icon: "success"
            })
            }
          });
    }

    const deleteCampaign = async (campaing_id) => {
        closeModal()
        try {
            const response = await axios.delete(`https://umaxxxxx-1-r8435045.deta.app/campaign-delete?campaign_id=${campaing_id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
                }
            })
            getCampaign()
            setUpdateCard(true)
            
        } catch (error) {
            console.log(error)
        }
    }

    const tableRef = useRef(null);

    function generateExcel(){
        Swal.fire({
            title: `${tfile('warn')}`,
            text: `${tfile('msg2')}`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: `${tfile('yes')}`,
            cancelButtonText: `${tfile('no')}`,
          }).then((result) => {
            if (result.isConfirmed) {
                onDownload();
              Swal.fire({
                title: `${tfile('success')}`,
                text: `${tfile('suc-msg')}`,
                icon: "success"
              });
            }
          });
        
    }

    const { onDownload } = useDownloadExcel({
        currentTableRef: tableRef.current,
        filename: "DataCampaign",
        sheet: "DataCampaign",
      });

    const generatePDF = () => {
        Swal.fire({
            title: `${tfile('warn')}`,
            text: `${tfile('msg1')}`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: `${tfile('yes')}`,
            cancelButtonText: `${tfile('no')}`,
          }).then((result) => {
            if (result.isConfirmed) {
                const doc = new jsPDF();
                doc.text('Data Campaign Umax Dashboard', 10, 10);
                doc.autoTable({
                    head: [['Name', 'Client', 'Account', 'Platorm', "Objective", "Status", "Company"]],
                    body: campaigns.map((campaign) => [campaign.name, campaign.client_name, campaign.account_name, campaign.platform, campaign.objective, campaign.status, campaign.company_name]),
                });
                doc.save('DataCampaign.pdf');
              Swal.fire({
                title: `${tfile('success')}`,
                text: `${tfile('suc-msg')}`,
                icon: "success"
              });
            }
          });
    };

    function handleDetail(campaign_id){
        const filteredCampaign = campaigns.filter(campaign => campaign._id === campaign_id);
        if(filteredCampaign.length > 0) {
            const [campaign] = filteredCampaign
            Swal.fire(`<p>
                ${campaign.name}\n ${campaign.client_name} \n ${campaign.account_name} \n ${campaign.company_name}
                </p>`);
        } else {
            Swal.fire("Campaign not found");
        }
    }

    async function getCampaign(){
        const response = await axios.get('https://umaxxxxx-1-r8435045.deta.app/campaign-by-tenant', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
            }
        })
        setCampaigns(response.data.Data)
        setCampaignMemo(response.data.Data)
    }

    useEffect(() => {
        getCampaign()
    }, [])

    useEffect(() => {
    }, [campaigns])

    async function createCampaing(){

        if(isvalid){
            const name = document.getElementById('name').value
            const account = document.getElementById('account').value
            const tenant = document.getElementById('tenant').value
            const objective = document.getElementById('objective').value
            const status = document.getElementById('status').value
            const start_date = document.getElementById('start_date').value
            const end_date = document.getElementById('end_date').value
    
            console.log(tenant)
    
            const formData = new FormData();
            formData.append('name', name);
            formData.append('account_id', account);
            formData.append('objective', objective)
            formData.append('status', status)
            formData.append('start_date', start_date)
            formData.append('end_date', end_date)
            formData.append('notes', "notes")
            
    
            let url = ""
    
            if(userData.roles == "sadmin"){
                url = `https://umaxxxxx-1-r8435045.deta.app/campaign-create?tenantId=${tenant}`
            }else if(userData.roles == "admin"){
                url = `https://umaxxxxx-1-r8435045.deta.app/campaign-create`
            }
    
            const response = await axios.post(url, formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
                }
            })
    
            if(response.data.Output == "Create Campaign Successfully"){
                getCampaign()
                closeModal()
                setUpdateCard(true)
                document.getElementById('name').value = null
                Swal.fire("Success", "Campaing created successfully", "success")
            }else{
                Swal.fire("Error", response.detail, "error")
            }
        }else{
            Swal.fire({
                title: "Failed!",
                text: "Please Fill The Blank!",
                icon: "error"
              });
        }
    }

    async function updateCampaing(){
        if(EditCampaignId !== null) {
            if(isvalid){
                const name = document.getElementById('name').value
                const account = document.getElementById('account').value
                const tenant = document.getElementById('tenant').value
                const objective = document.getElementById('objective').value
                const status = document.getElementById('status').value
                const start_date = document.getElementById('start_date').value
                const end_date = document.getElementById('end_date').value
                console.log(account)
                console.log(EditCampaignId)
    
                const formData = new FormData();
                formData.append('name', name);
                formData.append('account_id', account);
                formData.append('objective', objective)
                formData.append('status', status)
                formData.append('start_date', start_date)
                formData.append('end_date', end_date)
                formData.append('notes', "notes")
        
                const response = await axios.put(`https://umaxxxxx-1-r8435045.deta.app/campaign-edit?campaign_id=${EditCampaignId}`, formData, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
                    }
                })
        
                if(response.data.Output == "Campaign Successfully edited"){
                    getCampaign()
                    closeModal()
                    document.getElementById('name').value = null
                    Swal.fire("Success", "Campaign Updated", "success")
                }else{
                    Swal.fire("Error", response.detail.ErrMsg, "error")
                }
            }else{
                Swal.fire({
                    title: "Failed!",
                    text: "Please Fill The Blank!",
                    icon: "error"
                  });
            }
        }
    }

    const [timezone, setTimezone] = useState([])
    const [currency, setCurrency] = useState([])
    const [culture, setCulture] = useState([])
    const [account, setAccount] = useState([])
    const [tenant, setTenant] = useState([])

    async function getSelectFrontend(){
        await axios.get('https://umaxxxxx-1-r8435045.deta.app/timezone').then((response) => {
            setTimezone(response.data)
        })

        await axios.get('https://umaxxxxx-1-r8435045.deta.app/currency').then((response) => {
            setCurrency(response.data)
        })

        await axios.get('https://umaxxxxx-1-r8435045.deta.app/culture').then((response) => {
            setCulture(response.data)
        })

        await axios.get('https://umaxxxxx-1-r8435045.deta.app/account-by-tenant', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
            }
        }).then((response) => {
            setAccount(response.data.Data)
        })

        if(userData.roles == "sadmin"){
            await axios.get('https://umaxxxxx-1-r8435045.deta.app/tenant-get-all', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
                }
            }).then((response) => {
                setTenant(response.data.Data)
            })
        }

    }

    const tenantInput = useRef(null)

    useEffect(() => {
        getSelectFrontend()
        if(userData.roles == "sadmin"){
            tenantInput.current.classList.remove("hidden")
        }
        if(userData.roles == "admin"){
            tenantInput.current.classList.add("hidden")
        }
    }, [])

    const handlePlatformChange = (event) => {
        setSelectedPlatform(event.target.value);
    };

    function LoadingCircle() {
        return (
          <div className="flex justify-center items-center h-20">
            <div className="relative">
              <div className="w-10 h-10 border-4 border-[#1C2434] dark:border-white rounded-full border-t-transparent dark:border-t-transparent animate-spin"></div>
            </div>
          </div>
        );
    };

    const handleStatusChange = (event) => {
        setSelectedStatus(event.target.value);
        setCurrentPage(1);
    };

    const handleObjectiveChange = (event) => {
        setSelectedObjective(event.target.value);
        setCurrentPage(1);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1);
    };

    const filteredData = campaigns.filter((data) => {
        return (
            (!selectedPlatform || data.platform === Number(selectedPlatform)) &&
            (!selectedObjective || data.objective === Number(selectedObjective)) &&
            (!selectedStatus || data.status === Number(selectedStatus)) &&
            (!searchTerm ||
                data.name.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    });

    // Calculate total number of pages
    const totalPages = Math.ceil(filteredData.length / dataPerPage);

    // Function to change current page
    const goToPage = (page) => {
        setCurrentPage(page);
    };

    const renderPagination = () => {
        const pageButtons = [];
        const maxButtons = 3; // Maximum number of buttons to show
    
        // First page button
        pageButtons.push(
            <button
                key="first"
                className={`px-1 sm:px-3 md:px-3 lg:px-3 xl:px-3 py-1 dark:text-white ${
                    currentPage === 1 ? "cursor-not-allowed" : ""
                } rounded-md`}
                onClick={() => goToPage(1)}
                disabled={currentPage === 1}
            >
                {'<<'}
            </button>
        );
    
        // Previous page button
        pageButtons.push(
            <button
                key="prev"
                className={`px-1 sm:px-3 md:px-3 lg:px-3 xl:px-3 py-1 dark:text-white ${
                    currentPage === 1 ? "cursor-not-allowed" : ""
                } rounded-md`}
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
            >
                {'<'}
            </button>
        );
    
        // Info page
        pageButtons.push(
            <span key="info" className="px-1 sm:px-3 md:px-3 lg:px-3 xl:px-3 py-1 dark:text-white rounded-md">
                {`${t('page')} ${currentPage} / ${totalPages}`}
            </span>
        );
    
        // Next page button
        pageButtons.push(
            <button
                key="next"
                className={`px-1 sm:px-3 md:px-3 lg:px-3 xl:px-3 py-1 dark:text-white ${
                    currentPage === totalPages ? "cursor-not-allowed" : ""
                } rounded-md`}
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                {'>'}
            </button>
        );
    
        // Last page button
        pageButtons.push(
            <button
                key="last"
                className={`px-1 sm:px-3 md:px-3 lg:px-3 xl:px-3 py-1 dark:text-white ${
                    currentPage === totalPages ? "cursor-not-allowed" : ""
                } rounded-md`}
                onClick={() => goToPage(totalPages)}
                disabled={currentPage === totalPages}
            >
                {'>>'}
            </button>
        );
    
        return (
            <div className="flex justify-center gap-2 mt-4">
                {pageButtons}
            </div>
        );
    };
       
    const indexOfLastcampaign = currentPage * dataPerPage;
    const indexOfFirstcampaign = indexOfLastcampaign - dataPerPage;
    const currentcampaigns = filteredData.slice(indexOfFirstcampaign, indexOfLastcampaign);

    function dateconvert(date){
        let [day, month, year, hour] = date.split(" ");
        let months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
        let monthIndex = months.indexOf(month) + 1;
        if(monthIndex < 10){
            monthIndex = "0" + monthIndex;
        }
        if(day < 10){
            day = "0" + day
        }
        hour = hour.slice(0, -3);
        hour = hour.replace(".", ":");
        return `${year}-${monthIndex}-${day}`;
    }

    return (
        <>
            <div className="w-full">
                <div className="flex flex-col md:flex-row justify-between items-center mb-10">
                    <h1 className="text-3xl font-bold dark:text-white uppercase flex gap-2"> <RiMegaphoneLine size={35}/> {t('title')}</h1>
                    <p className="dark:text-white"><a className="hover:cursor-pointer dark:text-white hover:text-blue-400 hover:underline" href="#" onClick={() => setChangeTable("dashboard")}>{t('dashboard')}</a>  / {t('campaigns')}</p>
                </div>

                <div className="w-full h-fit mb-5 rounded-md shadow-md">
                    {/* Header */}
                    <div className="w-full h-12 bg-[#3c50e0] flex items-center rounded-t-md">
                        <h1 className="flex gap-2 p-4 items-center text">
                            <FaTable  className="text-blue-200" size={18}/><p className="text-white text-md font-semibold"></p>
                        </h1>
                    </div>
                    {/* Header end */}

                    {/* Body */}
                    <div className="w-full h-fit bg-white dark:bg-slate-800 dark:text-white rounded-b-md p-4">
                        <div className="flex flex-col-reverse md:flex-row justify-between items-center w-full ">
                            <div className="w-full flex justify-start flex-col sm:flex-col md:flex-col lg:flex-row xl:flex-row">
                                <div className="flex mb-4 lg:mb-0 xl:mb-0">
                                    {/* Button */}
                                    <button className="bg-white dark:bg-slate-800 py-2 sm:py-2 md:py-2 lg:mb-4 xl:mb-4 border hover:bg-gray-100 dark:hover:bg-slate-500 font-bold px-3 rounded-s-md" onClick={generatePDF}>
                                        <IconContext.Provider value={{ className: "text-xl" }}>
                                            <AiOutlineFilePdf />
                                        </IconContext.Provider>
                                    </button>
                                    <button className="bg-white dark:bg-slate-800 py-2 sm:py-2 md:py-2 lg:mb-4 xl:mb-4 border-b border-t hover:bg-gray-100 dark:hover:bg-slate-500 font-bold px-3" onClick={generateExcel}>
                                        <IconContext.Provider value={{ className: "text-xl" }}>
                                            <RiFileExcel2Line />
                                        </IconContext.Provider>
                                    </button>
                                    <button className="bg-white dark:bg-slate-800 py-2 sm:py-2 md:py-2 lg:mb-4 xl:mb-4 border hover:bg-gray-100 rounded-e-md sm:rounded-e-md md:rounded-e-md lg:rounded-e-none xl:rounded-e-none dark:hover:bg-slate-500 font-bold px-3 " onClick={() => showModal("Create")} >
                                        <IconContext.Provider value={{ className: "text-xl" }}>
                                            <BiPlus className="text-thin"/>
                                        </IconContext.Provider>
                                    </button>
                                    {/* Button end */}
                                </div>

                                <div className="flex">
                                    {/* Filter by select */}
                                    <div className="mb-4">
                                        <label htmlFor="rolefilter" className="text-sm font-medium  hidden">Role</label>
                                        <select id="rolefilter" className="md:w-[150px] h-10 bg-white dark:bg-slate-800 border-t border-b border-s sm:border-s md:border-s lg:border-s-0 xl:border-s-0 rounded-s-md sm:rounded-s-md md:rounded-s-md lg:rounded-s-none xl:rounded-s-none text-sm block w-full px-3 py-2 select-no-arrow" defaultValue={0}
                                        value={selectedStatus} onChange={handleStatusChange}
                                        >
                                            <option value="">Status</option>
                                            <option value="2">{t('draft')}</option>
                                            <option value="1">{t('active')}</option>
                                            <option value="3">{t('complete')}</option>
                                        </select>  
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="rolefilter" className="text-sm font-medium  hidden">Role</label>
                                        <select id="rolefilter" className="md:w-[150px] h-10 bg-white dark:bg-slate-800 border text-sm block w-full px-3 py-2 select-no-arrow" defaultValue={0}
                                            value={selectedPlatform}
                                            onChange={handlePlatformChange}
                                        >
                                            <option value="" disabled hidden>Platform</option>
                                            <option value="">{t('all-platform')}</option>
                                            <option value="1">Meta Ads</option>
                                            <option value="2">Google Ads</option>
                                            <option value="3">Tiktok Ads</option>
                                        </select>  
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="tenantfilter" className="text-sm font-medium  hidden">Tenant</label>
                                        <select id="tenantfilter" className="md:w-[150px] h-10 bg-white dark:bg-slate-800 border-b border-t border-e  text-sm rounded-e-md block w-full px-3 py-2 select-no-arrow" defaultValue={0}
                                            value={selectedObjective}
                                            onChange={handleObjectiveChange}
                                        >
                                            <option value="">{t('objective')}</option>
                                            <option value="1">Awareness</option>
                                            <option value="2">Concervation</option>
                                            <option value="3">Consideration</option>
                                        </select>
                                    </div>
                                    {/* Filter by select end */}
                                </div>
                            </div>

                            {/* Search */}
                            <div className="flex gap-5">
                                <div className="relative mb-4 ">
                                    <label htmlFor="search" className="hidden"></label>
                                    <input type="text" id="search" name="search" className= "w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-800" placeholder={t('search')}
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    onFocus={() => setCurrentPage(1)}
                                    />
                                    <span className="absolute inset-y-0 right-0 flex items-center pr-3">
                                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                                    </span>
                                </div>
                            </div>
                            {/* Search */}
                        </div>

                        <div className="bg-white h-fit overflow-auto">
                            <table className="w-full text-sm text-left" ref={tableRef}>
                                <thead className="text-md text-left uppercase bg-white dark:bg-slate-700">
                                    <tr>
                                        <th scope="col" className="px-5 border dark:border-gray-500 py-3">{t('name')}</th>
                                        <th scope="col" className="px-5 border dark:border-gray-500 py-3">{t('client')}</th>
                                        <th scope="col" className="px-5 border dark:border-gray-500 py-3">{t('account')}</th>
                                        <th scope="col" className="px-5 border dark:border-gray-500 py-3">Platform</th>
                                        <th scope="col" className="px-5 border dark:border-gray-500 py-3">{t('objective')}</th>
                                        <th scope="col" className="px-5 border dark:border-gray-500 py-3">Status</th>
                                        <th scope="col" className="px-5 border dark:border-gray-500 py-3">{t('company')}</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-slate-800">
                                    {
                                        currentcampaigns.length > 0 ? currentcampaigns.map((campaign, index) => {
                                            return (
                                                <tr key={index} className="hover:bg-gray-100 dark:hover:bg-slate-400 dark:odd:bg-slate-600 dark:even:bg-slate-700 hover:cursor-pointer transition-colors duration-300" onClick={() => showModal("Edit", campaign._id)}>
                                                    <td scope="row" className="px-5 py-3 border dark:border-gray-500 font-medium  whitespace-nowrap">{campaign.name}</td>
                                                    <td scope="row" className="px-5 py-3 border dark:border-gray-500 font-medium  whitespace-nowrap">{campaign.client_name}</td>
                                                    <td scope="row" className="px-5 py-3 border dark:border-gray-500 font-medium  whitespace-nowrap">{campaign.account_name}</td>
                                                    <td scope="row" className="px-5 py-3 border dark:border-gray-500 font-medium  whitespace-nowrap">{campaign.platform == 1 ? "Meta Ads" : campaign.platform == 2 ? "Google Ads" : "Tiktok Ads"}</td>
                                                    <td scope="row" className="px-5 py-3 border dark:border-gray-500 font-medium  whitespace-nowrap">{campaign.objective == 1 ? "Awareness" : campaign.objective == 2 ? "Conversion" : "Consideration"}</td>
                                                    <td scope="row" className="px-5 py-3 border dark:border-gray-500 font-medium  whitespace-nowrap">{campaign.status == 1 ? t('active') : campaign.status == 3 ? t('complete') : t('draft')}</td>
                                                    <td scope="row" className="px-5 py-3 border dark:border-gray-500 font-medium  whitespace-nowrap">{campaign.company_name}</td>
                                                </tr>
                                            )
                                    }) : (
                                        // Check user yang sudah difilter
                                        campaigns.length > 0 ? (
                                            // Jika data tida ditemukan
                                            <tr className="text-center border dark:border-gray-500">
                                                <td colSpan={8} className=" py-4">
                                                    {t('not-found')}
                                                </td>
                                            </tr>
                                        ) :
                                        (
                                            // Jika data ditemukan tapi masih loading
                                            <tr className="text-center py-3 border dark:border-gray-500">
                                                <td colSpan={8}>
                                                    <LoadingCircle />
                                                </td>
                                            </tr>
                                        )
                                    )
                                    }
                                </tbody>
                            </table>
                        </div>

                        <div className="flex justify-center sm:justify-end md:justify-end lg:justify-end xl:justify-end items-center">
                            {renderPagination()}
                        </div>
                    </div>
                    {/* Body end */}

                </div>
                {/* Main Card end */}
            </div>

            {/* <!-- Main modal --> */}
            <div id="crud-modal" ref={addModal} className="fixed inset-0 flex hidden items-center justify-center bg-gray-500 bg-opacity-75 z-50">

                <div className="relative p-4 w-full max-w-2xl max-h-full ">
                    {/* <!-- Modal content --> */}
                    <div className="relative bg-white dark:text-white dark:bg-slate-900 rounded-lg shadow">
                        {/* <!-- Modal header --> */}
                        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t bg-[#3c50e0] dark:bg-slate-800 text-white">
                            <h3 className="text-lg font-semibold ">
                                {`${modeModal} ${t('campaigns')}`}
                            </h3>
                            <button type="button" className="text-xl bg-transparent hover:bg-blue-400 rounded-lg  w-8 h-8 ms-auto inline-flex justify-center items-center " data-modal-toggle="crud-modal" onClick={closeModal}>
                                <FaTimes />
                            </button>
                        </div>
                        {/* <!-- Modal body --> */}
                        <div className="p-4 md:p-5">
                            <div className="grid gap-4 mb-4 grid-cols-2">
                                <div className={` ${userData.roles == "sadmin" ? "col-span-2" : "col-span-1"}`}>
                                    <label htmlFor="name" className="mb-2 text-sm font-medium  flex">{t('campaign_name')} <div className="text-red-500 dark:text-red-600">*</div></label>
                                    <input type="text" name="name" id="name" className="bg-gray-50 border dark:bg-slate-800 dark:border-none border-gray-300  text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 " placeholder={t('holder-name')}
                                    required onChange={(e) => setValues({...values, name: e.target.value})}/>
                                    {
                                        error.name ? <div className="text-red-500 dark:text-red-600 text-sm">{error.name}</div> : ""
                                    }
                                </div>
                                <div className="col-span-1">
                                    <label htmlFor="account" className="flex mb-2 text-sm font-medium ">{t('account')} <div className="text-red-500 dark:text-red-600">*</div></label>
                                    <select id="account" className="bg-gray-50 border dark:bg-slate-800 dark:border-none border-gray-300  text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5" defaultValue={""} onChange={(e) =>setValues({...values, account: e.target.value})}>
                                        <option value="" disabled hidden>{t('select-account')}</option>
                                        {
                                            account.length > 0 ? account.map((account, index) => {
                                                return <option key={index} value={account._id}>{account.username}</option>
                                            }) : <option key={0} value={0}>Loading...</option>
                                        }
                                    </select>
                                    {
                                        error.account ? <div className="text-red-500 dark:text-red-600 text-sm">{error.account}</div> : ""
                                    }
                                </div>
                                <div className="col-span-1" ref={tenantInput}>
                                    <label htmlFor="tenant" className="block mb-2 text-sm font-medium ">Tenant</label>
                                    <select id="tenant" className="bg-gray-50 border dark:bg-slate-800 dark:border-none border-gray-300  text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5  ">
                                        {
                                            tenant.length > 0 ? tenant.map((tenant, index) => {
                                                return <option key={index} value={tenant._id}>{tenant.company}</option>
                                            }) : <option key={0} value={0}>Loading...</option>
                                        }
                                    </select>
                                </div>

                                
                                <div className="col-span-1">
                                <label htmlFor="objective" className="flex mb-2 text-sm font-medium ">{t('objective')} <div className="text-red-500 dark:text-red-600">*</div></label>
                                    <select id="objective" className="bg-gray-50 border dark:bg-slate-800 dark:border-none border-gray-300  text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5  "  defaultValue={""} onChange={(e) =>setValues({...values, objective: e.target.value})}>
                                        <option value="" disabled hidden>{t('select-objective')}</option>
                                        <option value="1">Awareness</option>
                                        <option value="2">Conversion</option>
                                        <option value="3">Consideration</option>
                                    </select>
                                    {
                                        error.objective ? <div className="text-red-500 dark:text-red-600 text-sm">{error.objective}</div> : ""
                                    }
                                </div>
                                
                                <div className="col-span-1">
                                <label htmlFor="status" className="flex mb-2 text-sm font-medium ">status <div className="text-red-500 dark:text-red-600">*</div></label>
                                    <select id="status" className="bg-gray-50 border dark:bg-slate-800 dark:border-none border-gray-300  text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5  " defaultValue={""} onChange={(e) => setValues({...values, status: e.target.value})}>
                                        <option value="" disabled hidden>{t('select-status')}</option>
                                        <option value="1">{t('active')}</option>
                                        <option value="2">{t('draft')}</option>
                                        <option value="3">{t('complete')}</option>
                                    </select>
                                    {
                                        error.status ? <div className="text-red-500 dark:text-red-600 text-sm">{error.status}</div> : ""
                                    }
                                </div>

                                <div className="col-span-1">
                                <label htmlFor="start_date" className="flex mb-2 text-sm font-medium ">{t('start-date')} <div className="text-red-500 dark:text-red-600">*</div></label>
                                <input type="date" name="start_date" id="start_date" className="bg-gray-50 border dark:bg-slate-800 dark:border-none border-gray-300  text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 " placeholder="Type Campaign name here"
                                    required onChange={(e) => setValues({...values, start_date: e.target.value})}/>
                                    {
                                        error.start_date ? <div className="text-red-500 dark:text-red-600 text-sm">{error.start_date}</div> : ""
                                    }
                                </div>
                                

                                <div className="col-span-1">
                                <label htmlFor="end_date" className="flex mb-2 text-sm font-medium ">{t('end-date')} <div className="text-red-500 dark:text-red-600">*</div></label>
                                <input type="date" name="end_date" id="end_date" className="bg-gray-50 border dark:bg-slate-800 dark:border-none border-gray-300  text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 " placeholder="Type Campaign name here"
                                    required onChange={(e) => setValues({...values, end_date: e.target.value})}/>
                                    {
                                        error.end_date ? <div className="text-red-500 dark:text-red-600 text-sm">{error.end_date}</div> : ""
                                    }
                                </div>
                                
                                
                                
                            </div>
                                <div className="flex justify-between items-end">
                                    <div></div>
                                        {
                                            modeModal === 'Edit' ? <div className="flex gap-2">
                                                <button className="bg-blue-500 hover:bg-blue-700 mt-5 text-white font-bold py-2 px-4 rounded text-nowrap" onClick={updateCampaing}>{t('save')}</button> 
                                                <button className="bg-red-500 hover:bg-red-700 mt-5 text-white font-bold py-2 px-4 rounded text-nowrap" onClick={() => handleDelete(EditCampaignId)}><FaTrash/>
                                                </button> 
                                            </div> 
                                                : <button className="bg-blue-500 hover:bg-blue-700 mt-5 text-white font-bold py-2 px-4 rounded" onClick={createCampaing}>{t('submit')}</button>
                                        }
                                        
                                </div>  
                        </div>
                    </div>
                </div>
            </div> 

        </>
    )
}