'use client'

import axios from "axios"
import { useState,useEffect, useRef, useContext } from "react"
import { AdminDashboardContext } from "@/app/admin-dashboard/page"
import Swal from "sweetalert2"
import { useDownloadExcel } from "react-export-table-to-excel"
import jsPDF from "jspdf"
import 'jspdf-autotable'
import { IconContext } from "react-icons"
import { AiOutlineFilePdf } from "react-icons/ai"
import { FaArrowLeft, FaArrowRight, FaFileExcel } from "react-icons/fa"
import { FaPlus } from "react-icons/fa"
import { FaPen } from "react-icons/fa"
import { FaTrash } from "react-icons/fa"
import { FaEye } from "react-icons/fa"
import { FaTimes } from "react-icons/fa"
import { IoMdEye } from "react-icons/io"
import { IoMdEyeOff } from "react-icons/io"
import { RiIdCardLine } from "react-icons/ri"
export default function AccountTable() {

    const [account, setaccount] = useState([])
    const [accountMemo, setaccountMemo] = useState([])
    const [EditaccountId, setEditaccountId] = useState(null)
    const [showPassword, setShowPassword] = useState(false)
    const passwordInput = useRef(null)
    const passwordverifyInput = useRef(null)

    function handleShowPassword() {
        setShowPassword(!showPassword)
    }

    const [sidebarHide, setSidebarHide, updateCard, setUpdateCard, changeTable, setChangeTable,  userData] = useContext(AdminDashboardContext)

    const addModal = useRef(null)
    const [modeModal, setModeModal] = useState("add")

    function showModal(mode, account_id = null ){
        setModeModal(mode)
        if(mode == "Edit"){
            const filteredaccount = account.filter(account => account._id === account_id);
            if(filteredaccount.length > 0){
                // console.log(filteredCampaing[0])
                setEditaccountId(account_id)
                document.getElementById('name').value = filteredaccount[0].username
                document.getElementById('client').value = filteredaccount[0].client_id
                document.getElementById('platform').value = filteredaccount[0].platform
                document.getElementById('email').value = filteredaccount[0].email
                document.getElementById('status').value = filteredaccount[0].status
                passwordInput.current.classList.add("hidden")
                passwordverifyInput.current.classList.add("hidden")
            } else{
                Swal.fire("Campaing not found");
            }
        }else if(mode == "Create") {
            document.getElementById('name').value = null
            document.getElementById('email').value = null
            document.getElementById('password').value = null
            document.getElementById('passwordverify').value = null
            passwordInput.current.classList.remove("hidden")
            passwordverifyInput.current.classList.remove("hidden")
        }
        addModal.current.classList.remove("hidden")
    }
    function closeModal(){
        addModal.current.classList.add("hidden")
    }
    
    function handleDelete(account_id){
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
          }).then((result) => {
            if (result.isConfirmed) {
            deleteaccount(account_id)
            Swal.fire({
                title: "Deleted!",
                text: "Your file has been deleted.",
                icon: "success"
            })
            }
          });
    }

    const deleteaccount = async (account_id) => {
        try {
            const response = await axios.delete(`https://umaxxnew-1-d6861606.deta.app/account-delete?account_id=${account_id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
                }
            })
            getaccount()
            setUpdateCard(true)
            
        } catch (error) {
            console.log(error)
        }
    }

    const tableRef = useRef(null);

    function generateExcel(){
        Swal.fire({
            title: "Are you sure?",
            text: "Are you sure want to download excel file?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, download it!"
          }).then((result) => {
            if (result.isConfirmed) {
                const backupLastPage = lastPage;
                const backupFirstPage = firstPage;
                setFirstPage(0);
                setLastPage(account.length);
                setTimeout(() => {
                    onDownload();
                    setFirstPage(backupFirstPage);
                    setLastPage(backupLastPage);
                }, 100);
              Swal.fire({
                title: "Downloaded!",
                text: "Your file has been downloaded.",
                icon: "success"
              });
            }
          });
    }

    const { onDownload } = useDownloadExcel({
        currentTableRef: tableRef.current,
        filename: "Dataaccount",
        sheet: "Dataaccount",
      });

    const generatePDF = () => {
        Swal.fire({
            title: "Are you sure?",
            text: "Are you sure want to download pdf file?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, download it!"
          }).then((result) => {
            if (result.isConfirmed) {
                const doc = new jsPDF();
                doc.text('Data Account Umax Dashboard', 10, 10);
                doc.autoTable({
                    head: [['Name', 'Client', 'Platorm', "Email", "Status", "Notes", "Company"]],
                    body: account.map((account) => [account.username, account.client_name, account.platform, account.email, account.status, account.notes, account.company_name]),
                });
                doc.save('DataAccount.pdf');
              Swal.fire({
                title: "Downloaded!",
                text: "Your file has been downloaded.",
                icon: "success"
              });
            }
          });
    };

    function handleDetail(account_id){
        const filteredaccount = account.filter(account => account._id === account_id);
        if(filteredaccount.length > 0) {
            const [account] = filteredaccount;
            Swal.fire(`<p>
                ${account.username}\n ${account.client_name} \n ${account.platform}\n ${account.email}\n ${account.status}
                </p>`);
        } else {
            Swal.fire("account not found");
        }
    }

    async function getaccount(){
        const response = await axios.get('https://umaxxnew-1-d6861606.deta.app/account-by-tenant', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
            }
        })
        setaccount(response.data.Data)
        setaccountMemo(response.data.Data)
        setTotalPages(Math.ceil(account.length / itemsPerPage));
        setFirstPage(0);
        setLastPage(itemsPerPage);
    }

    useEffect(() => {
        getaccount()
    }, [])

    useEffect(() => {
    }, [account])

    async function createCampaing(){
        const name = document.getElementById('name').value
        const client = document.getElementById('client').value
        const email = document.getElementById('email').value
        const platform = document.getElementById('platform').value
        const password = document.getElementById('password').value
        const passwordverify = document.getElementById('passwordverify').value
        const status = document.getElementById('status').value
        const tenant_id = document.getElementById('tenant').value

        const formData = new FormData();
        formData.append('username', name);
        formData.append('client_id', client);
        formData.append('email', email);
        formData.append('platform', platform);
        formData.append('password', password);
        formData.append('confirm_password', passwordverify);
        formData.append('status', status);
        formData.append('notes', "notes");

        let url = ""

        if(userData.roles == "sadmin"){
            url = `https://umaxxnew-1-d6861606.deta.app/account-create?tenantId=${tenant_id}`
        }else if(userData.roles == "admin"){
            url = `https://umaxxnew-1-d6861606.deta.app/account-create`
        }

        const response = await axios.post(url, formData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
            }
        })

        if(response.data.Output == "Create Account Successfully"){
            getaccount()
            closeModal()
            setUpdateCard(true)
            document.getElementById('name').value = null
            document.getElementById('email').value = null
            document.getElementById('password').value = null
            document.getElementById('passwordverify').value = null
            Swal.fire("Success", "Account created successfully", "success")
        }else{
            Swal.fire("Error", response.detail, "error")
        }
    }

    async function updateCampaing(){
        if(EditaccountId !== null) {
        const name = document.getElementById('name').value
        const client = document.getElementById('client').value
        const email = document.getElementById('email').value
        const platform = document.getElementById('platform').value
        const password = document.getElementById('password').value
        const passwordverify = document.getElementById('passwordverify').value
        const status = document.getElementById('status').value

        const formData = new FormData();
        formData.append('name', name);
        formData.append('client', client);
        formData.append('email', email);
        formData.append('platform', platform);
        formData.append('password', password);
        formData.append('confirm_password', passwordverify);
        formData.append('status', status);
        formData.append('notes', "notes");
    
            const response = await axios.put(`https://umaxxnew-1-d6861606.deta.app/account-edit?account_id=${EditaccountId}`, formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
                }
            })
    
            if(response.data.Output == "Data Updated Successfully"){
                getaccount()
                closeModal()
                document.getElementById('name').value = null
                document.getElementById('email').value = null
                document.getElementById('password').value = null
                document.getElementById('passwordverify').value = null
                Swal.fire("Success", "Campaing Updated", "success")
            }else{
                Swal.fire("Error", response.detail.ErrMsg, "error")
            }
        }
    }


    const [timezone, setTimezone] = useState([])
    const [currency, setCurrency] = useState([])
    const [culture, setCulture] = useState([])
    const [client, setClient] = useState([])
    const [tenant, setTenant] = useState([])

    async function getSelectFrontend(){
        await axios.get('https://umaxxnew-1-d6861606.deta.app/timezone').then((response) => {
            setTimezone(response.data)
        })

        await axios.get('https://umaxxnew-1-d6861606.deta.app/currency').then((response) => {
            setCurrency(response.data)
        })

        await axios.get('https://umaxxnew-1-d6861606.deta.app/culture').then((response) => {
            setCulture(response.data)
        })

        await axios.get('https://umaxxnew-1-d6861606.deta.app/client-by-tenant', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
            }
        }).then((response) => {
            setClient(response.data.Data)
        })
        if(userData.roles ==  "sadmin"){
            await axios.get('https://umaxxnew-1-d6861606.deta.app/tenant-get-all', {
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


    // Pagination

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [firstPage, setFirstPage] = useState(0);
    const [lastPage, setLastPage] = useState(10);

    useEffect(() => {
        setCurrentPage(1);
        setTotalPages(Math.ceil(account.length / itemsPerPage));
        setFirstPage(0);
        setLastPage(itemsPerPage);
    }, [account, itemsPerPage]);

    const firstPageButton = useRef(null);
    const previousButton = useRef(null);
    const nextButton = useRef(null);
    const lastPageButton = useRef(null);

    useEffect(() => {
        setFirstPage((currentPage - 1) * itemsPerPage);
        setLastPage(currentPage * itemsPerPage);
        if(currentPage == 1){
            firstPageButton.current.classList.add("paginDisable");
            previousButton.current.classList.add("paginDisable");
            nextButton.current.classList.remove("paginDisable");
            lastPageButton.current.classList.remove("paginDisable");
        }else if(currentPage == totalPages){
            nextButton.current.classList.add("paginDisable");
            lastPageButton.current.classList.add("paginDisable");
            firstPageButton.current.classList.remove("paginDisable");
            previousButton.current.classList.remove("paginDisable");
        }else{
            firstPageButton.current.classList.remove("paginDisable");
            previousButton.current.classList.remove("paginDisable");
            nextButton.current.classList.remove("paginDisable");
            lastPageButton.current.classList.remove("paginDisable");
        }
    }, [currentPage]);

    function handleNextButton(){
        if(currentPage < totalPages){
            setCurrentPage(currentPage + 1);
        }
    }

    function handlePreviousButton(){
        if(currentPage > 1){
            setCurrentPage(currentPage - 1);
        }
    }

    function handleFristPageButton(){
        if(currentPage > 1){
            setCurrentPage(1);
        }
    }

    function handleLastPageButton(){
        if(currentPage < totalPages){
            setCurrentPage(totalPages);
        }
    }

    return (
        <>
            <div className="w-full">
            <div className="flex flex-col md:flex-row justify-between mt-3">
                    <h1 className="text-3xl font-bold flex gap-2"><RiIdCardLine/> Accounts</h1>
                    <p>Dashboard / Accounts</p>
                </div>
                <div className=" flex flex-col md:flex-row justify-between items-center w-full ">
                    <div className="flex gap-5">
                    <div className="mt-5">
                            <label htmlFor="platformfilter" className="text-sm font-medium text-gray-900 hidden">Platform</label>
                            <select id="platformfilter" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full md:px-10 py-2" defaultValue={0}
                             onChange={(e) => {
                                const accountvalue = e.target.value;
                                const filteredData = accountMemo.filter((account) =>
                                account.platform == accountvalue
                                );
                                accountvalue === "0" ? setaccount(accountMemo) : setaccount(filteredData);
                            }}>
                                <option value="0" key={0} >All Platform</option>
                                <option value={1} key={1}>Meta Ads</option>
                                <option value={2} key={2}>Google Ads</option>
                                <option value={3} key={3}>Tiktok Ads</option>
                            </select>
                            
                        </div>
                        <div className="mt-5">
                            <label htmlFor="accountfilter" className="text-sm font-medium text-gray-900 hidden">status</label>
                            <select id="accountfilter" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full md:px-10 py-2" defaultValue={0}
                             onChange={(e) => {
                                const accountvalue = e.target.value;
                                const filteredData = accountMemo.filter((account) =>
                                account.status == accountvalue
                                );
                                accountvalue === "0" ? setaccount(accountMemo) : setaccount(filteredData);
                            }}>
                                <option value="0" key={0} >All Status</option>
                                <option value={1} key={1}>Active</option>
                                <option value={2} key={2}>Inactive</option>
                            </select>
                            
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-5 items-center mt-5">
                        <div>
                            <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2" onClick={generatePDF}>
                                <IconContext.Provider value={{ className: "text-xl" }}>
                                    <AiOutlineFilePdf />
                                </IconContext.Provider>
                            </button>
                            <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2" onClick={generateExcel}>
                                <IconContext.Provider value={{ className: "text-xl" }}>
                                    <FaFileExcel />
                                </IconContext.Provider>
                            </button>
                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => showModal("Create")}>
                                <IconContext.Provider value={{ className: "text-xl" }}>
                                    <FaPlus />
                                </IconContext.Provider>
                            </button>
                        </div>
                        <div className="relative">
                            <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Search Account" 
                            onChange={(e) => {
                                const search = e.target.value.toLowerCase();
                                const filteredData = accountMemo.filter((account) =>
                                account.username.toLowerCase().includes(search)
                                );
                                search === "" ? setaccount(accountMemo) : setaccount(filteredData);
                            }} id="search"/>
                            <span className="absolute inset-y-0 right-0 flex items-center pr-3">
                                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                            </span>
                        </div>
                    </div>
                </div>
                <div className="rounded-md mt-5 shadow-xl h-[50vh] overflow-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400" ref={tableRef}>
                        <thead className="text-xs text-black uppercase bg-[#F9FAFB]">
                            <tr>
                                <th scope="col" className="px-6 py-3">No</th>
                                <th scope="col" className="px-6 py-3">Username</th>
                                <th scope="col" className="px-6 py-3">Client</th>
                                <th scope="col" className="px-6 py-3">Platform</th>
                                <th scope="col" className="px-6 py-3">Email</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                {/* <th scope="col" className="px-6 py-3">Action</th> */}
                            </tr>
                        </thead>
                        <tbody>
                            {
                                account.length > 0 ? account.map((account, index) => {
                                    return (
                                        <tr key={index} className=  "odd:bg-white  even:bg-gray-200 hover:bg-blue-200 hover:cursor-pointer" onClick={() => showModal("Edit", account._id)}>
                                            <td scope="row" className="px-6 py-3 font-medium text-gray-900 whitespace-nowrap">{index + 1}</td>
                                            <td scope="row" className="px-6 py-3 font-medium text-gray-900 whitespace-nowrap">{account.username}</td>
                                            <td scope="row" className="px-6 py-3 font-medium text-gray-900 whitespace-nowrap">{account.client_name}</td>
                                            <td scope="row" className="px-6 py-3 font-medium text-gray-900 whitespace-nowrap">{account.platform == 1 ? "Meta Ads" : account.platform == 2 ? "Google Ads" : "Tiktok Ads"}</td>
                                            <td scope="row" className="px-6 py-3 font-medium text-gray-900 whitespace-nowrap">{account.email }</td>
                                            <td scope="row" className="px-6 py-3 font-medium text-gray-900 whitespace-nowrap">{account.status == 1 ? "Active" : "Inactive"}</td>
                                            {/* <td scope="row" className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap flex gap-3">
                                                <button className="text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-green-500 py-2 px-4 rounded-md" onClick={() => handleDetail(account._id)}>
                                                    <IconContext.Provider value={{ className: "text-xl" }}>
                                                        <FaEye />
                                                    </IconContext.Provider>
                                                </button>
                                                <button className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-blue-500 py-2 px-4 rounded-md" onClick={() => showModal("Edit", account._id)}>
                                                    <IconContext.Provider value={{ className: "text-xl" }}>
                                                        <FaPen />
                                                    </IconContext.Provider>
                                                </button>
                                                <button className="text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-red-500 py-2 px-4 rounded-md" onClick={() => handleDelete(account._id)}>
                                                    <IconContext.Provider value={{ className: "text-xl" }}>
                                                        <FaTrash />
                                                    </IconContext.Provider>
                                                </button>
                                            </td> */}
                                        </tr>
                                    )
                            }).slice(firstPage, lastPage) : <tr className="text-center animate-pulse"><td>Loading...</td></tr>
                            }
                        </tbody>
                    </table>
                </div>
                <style jsx>
                    {
                        `
                            .paginDisable{
                                opacity:0.5;
                            }
                        `
                    }

                </style>
                    <div className="mt-5 flex  gap-3 items-center w-full justify-end">
                        <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1.5 px-3 rounded inline-flex items-center" onClick={handleFristPageButton} ref={firstPageButton}>
                            {"<<"}
                        </button>
                        <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1.5 px-3 rounded inline-flex items-center" onClick={handlePreviousButton} ref={previousButton}>
                            {"<"}   
                        </button>
                        <div>
                            <p>Page {currentPage} / {totalPages}</p>
                        </div>
                        <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1.5 px-3 rounded inline-flex items-center" onClick={handleNextButton} ref={nextButton}>
                            {">"}
                        </button>
                        <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1.5 px-3 rounded inline-flex items-center" onClick={handleLastPageButton} ref={lastPageButton}>
                           {">>"}
                        </button>
                    </div>
            </div>

            {/* <!-- Main modal --> */}
            <div id="crud-modal" ref={addModal} className="fixed inset-0 flex hidden items-center justify-center bg-gray-500 bg-opacity-75 z-50">

                <div className="relative p-4 w-full max-w-md max-h-full ">
                    {/* <!-- Modal content --> */}
                    <div className="relative bg-white rounded-lg shadow">
                        {/* <!-- Modal header --> */}
                        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t ">
                            <h3 className="text-lg font-semibold text-gray-900 ">
                                {`${modeModal} Campaing`}
                            </h3>
                            <button type="button" className="text-gray-600 text-xl bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg  w-8 h-8 ms-auto inline-flex justify-center items-center " data-modal-toggle="crud-modal" onClick={closeModal}>
                                <FaTimes />
                            </button>
                        </div>
                        {/* <!-- Modal body --> */}
                        <div className="p-4 md:p-5">
                            <div className="grid gap-4 mb-4 grid-cols-2">
                                <div className="col-span-2">
                                    <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 ">Account Name</label>
                                    <input type="text" name="name" id="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 " placeholder="Type account name here"
                                    required/>
                                </div>
                                <div className="col-span-1">
                                    <label htmlFor="client" className="block mb-2 text-sm font-medium text-gray-900">Client</label>
                                    <select id="client" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5  ">
                                        {
                                            client.length > 0 ? client.map((client, index) => {
                                                return <option key={index} value={client._id}>{client.name}</option>
                                            }) : <option key={0} value={0}>Loading...</option>
                                        }
                                    </select>
                                </div>
                                <div className="col-span-1" ref={tenantInput}>
                                    <label htmlFor="tenant" className="block mb-2 text-sm font-medium text-gray-900">Tenant</label>
                                    <select id="tenant" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5  ">
                                        {
                                            tenant.length > 0 ? tenant.map((tenant, index) => {
                                                return <option key={index} value={tenant._id}>{tenant.company}</option>
                                            }) : <option key={0} value={0}>Loading...</option>
                                        }
                                    </select>
                                </div>
                                <div className="col-span-1">
                                    <label htmlFor="platform" className="block mb-2 text-sm font-medium text-gray-900">Platform</label>
                                    <select id="platform" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5">
                                        <option value="1">Meta Ads</option>
                                        <option value="2">Google Ads</option>
                                        <option value="3">Tiktok Ads</option>
                                    </select>
                                </div>

                                <div className="col-span-1">
                                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 ">Email</label>
                                    <input type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 " placeholder="example@gmail.com" required/>
                                </div>

                                

                                <div className="col-span-1" ref={passwordInput}>
                                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 ">Password</label>
                                    <div className="relative">
                                        <input type={showPassword ? "text" : "password"} name="password" id="password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 " placeholder="Type password here" required/>
                                        <button onClick={handleShowPassword} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none" type="button">
                                            {showPassword ? <IoMdEye/> : <IoMdEyeOff/>}
                                        </button>
                                    </div>
                                </div>
                                <div className="col-span-1" ref={passwordverifyInput}>
                                    <label htmlFor="passwordverify" className="block mb-2 text-sm font-medium text-gray-900 ">Confirm Password</label>
                                    <div className="relative">
                                        <input type={showPassword ? "text" : "password"} name="passwordverify" id="passwordverify" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 " placeholder="Type password here" required/>
                                        <button onClick={handleShowPassword} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none" type="button">
                                            {showPassword ? <IoMdEye/> : <IoMdEyeOff/>}
                                        </button>
                                    </div>
                                </div>

                            </div>
                                <div className="flex justify-between items-end">
                                <div>
                                    <label htmlFor="status" className="block mb-2 text-sm font-medium text-gray-900">Status</label>
                                        <select id="status" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5  ">
                                            <option value="1">Active</option>
                                            <option value="2">Inactive</option>
                                        </select>
                                    </div>

                                        {
                                            modeModal === 'Edit' ? <button className="bg-blue-500 hover:bg-blue-700 mt-5 text-white font-bold py-2 px-4 rounded text-nowrap" onClick={updateCampaing}>Save Change</button> : <button className="bg-blue-500 hover:bg-blue-700 mt-5 text-white font-bold py-2 px-4 rounded" onClick={createCampaing}>Submit</button>
                                        }
                                        
                                </div>  
                        </div>
                    </div>
                </div>
            </div> 

        </>
    )
}