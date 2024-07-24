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
import { FaArrowLeft, FaArrowRight, FaFileExcel, FaTable } from "react-icons/fa"
import { FaPlus } from "react-icons/fa"
import { FaPen } from "react-icons/fa"
import { FaTrash } from "react-icons/fa"
import { FaEye } from "react-icons/fa"
import { FaTimes } from "react-icons/fa"
import { IoMdEye } from "react-icons/io"
import { IoMdEyeOff } from "react-icons/io"
import { MdPeopleOutline } from "react-icons/md"
import { RiFileExcel2Fill, RiFileExcel2Line } from "react-icons/ri"
import { BiPlus } from "react-icons/bi"
import CountCard from "./CountCard"
export default function ClientTable() {

    const [client, setclient] = useState([])
    const [clientMemo, setclientMemo] = useState([])
    const [EditclientId, setEditclientId] = useState(null)
    const [showPassword, setShowPassword] = useState(false)
    const [selectedStatus, setSelectedStatus] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [dataPerPage, setDataPerPage] = useState(10);


    function handleShowPassword() {
        setShowPassword(!showPassword)
    }

    const {sidebarHide, setSidebarHide, updateCard, setUpdateCard, changeTable, setChangeTable,  userData, dataDashboard} = useContext(AdminDashboardContext)

    const addModal = useRef(null)
    const [modeModal, setModeModal] = useState("add")

    const passwordInput = useRef(null)
    const passwordverifyInput = useRef(null)
    const tenantInput = useRef(null)

    // validasi form
    const [values, setValues] = useState({name: '', address: '', contact: '', email: '', password: '', passwordverify: ''})
    const [error, setError] = useState({
        name: '',
        address: '',
        contact: '',
        email: '',
        password: '',
        passwordverify: ''
    })
    const [isvalid, setIsvalid] = useState(false)

    function validateForm(){
        let errors = {}
        if(values.name == ''){
            errors.name = 'Name is required'
        }
        if(values.address == ''){
            errors.address = 'Address is required'
        }
        if(values.contact == ''){
            errors.contact = 'Contact is required'
        }
        if(!values.email.includes("@")){
            errors.email = "Email must contain @"
        }
        if(values.email == ''){
            errors.email = 'Email is required'
        }
        if(values.password != values.passwordverify){
            errors.password = 'Password not match'
            errors.passwordverify = 'Password not match'
        }
        if(values.password == ''){
            errors.password = 'Password is required'
        }
        if(values.passwordverify == ''){
            errors.passwordverify = 'Password verify is required'
        }
        setError(errors)
        setIsvalid(Object.keys(errors).length === 0)
    }

    useEffect(() => {
        validateForm()
    }, [values])


    function showModal(mode, client_id = null ){
        setModeModal(mode)
        if(mode == "Edit"){
            const filteredclient = client.filter(client => client._id === client_id);
            if(filteredclient.length > 0){
                // console.log(filteredCampaing[0])
                setEditclientId(client_id)
                setValues({name: filteredclient[0].name, address: filteredclient[0].address, contact: filteredclient[0].contact.slice(1), email: filteredclient[0].email})
                setError({name: '', address: '', contact: '', email: ''})
                document.getElementById('name').value = filteredclient[0].name
                document.getElementById('country').value = filteredclient[0].address.split(", ")[1]
                handleCityList(filteredclient[0].address.split(", ")[1])
                setTimeout(() => {
                    document.getElementById('city').value = filteredclient[0].address.split(", ")[0]
                }, 300);
                document.getElementById('contact').value = filteredclient[0].contact.slice(1)
                document.getElementById('email').value = filteredclient[0].email
                document.getElementById('status').checked = filteredclient[0].status == 1 ? true : false
                passwordInput.current.classList.add("hidden")
                passwordverifyInput.current.classList.add("hidden")
                tenantInput.current.classList.add("hidden")
                // console.log(client_id)
            } else{
                Swal.fire("client not found");
            }
        }else if(mode == "Create") {
            setValues({name: '', address: '', contact: '', email: '', password: '', passwordverify: ''})
            setError({name: '', address: '', contact: '', email: '', password: '', passwordverify: ''})
            document.getElementById('name').value = null
            document.getElementById('country').value = 0
            document.getElementById('city').value = 0
            document.getElementById('contact').value = null
            document.getElementById('email').value = null  
            document.getElementById('password').value = null  
            document.getElementById('passwordverify').value = null 
            passwordInput.current.classList.remove("hidden")
            passwordverifyInput.current.classList.remove("hidden") 
            if(userData.roles == "sadmin"){
                tenantInput.current.classList.remove("hidden")
            }
            if(userData.roles == "admin"){
                tenantInput.current.classList.add("hidden")
            }
        }
        addModal.current.classList.remove("hidden")
    }
    function closeModal(){
        addModal.current.classList.add("hidden")
    }
    
    function handleDelete(client_id){
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
            deleteclient(client_id)
            Swal.fire({
                title: "Deleted!",
                text: "Your file has been deleted.",
                icon: "success"
            })
            }
          });
    }

    const deleteclient = async (client_id) => {
        closeModal()
        try {
            const response = await axios.delete(`https://umaxxxxx-1-r8435045.deta.app/client-delete?client_id=${client_id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
                }
            })
            getclient()
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
                onDownload();
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
        filename: "Dataclient",
        sheet: "Dataclient",
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
                doc.text('Data client Umax Dashboard', 10, 10);
                doc.autoTable({
                    head: [['Name', 'Address', 'Contact', "Email", "Status"]],
                    body: client.map((client) => [client.name, client.address, client.contact, client.email, client.status == 1 ? "Active" : "Inactive"]),
                });
                doc.save('Dataclient.pdf');
              Swal.fire({
                title: "Downloaded!",
                text: "Your file has been downloaded.",
                icon: "success"
              });
            }
          });
    };

    function handleDetail(client_id){
        const filteredclient = client.filter(client => client._id === client_id);
        if(filteredclient.length > 0) {
            const [client] = filteredclient;
            Swal.fire(`<p>
                ${client.name}\nAddress: ${client.address}\nContact: ${client.contact}\nEmail: ${client.email}
                </p>`);
        } else {
            Swal.fire("client not found");
        }
    }

    async function getclient(){
        const response = await axios.get('https://umaxxxxx-1-r8435045.deta.app/client-by-tenant', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
            }
        })
        setclient(response.data.Data)
        setclientMemo(response.data.Data)
    }

    useEffect(() => {
        getclient()
    }, [])

    useEffect(() => {
    }, [client])
    
    async function createClient(){
        if(isvalid){
            const name = document.getElementById('name').value
            const country = document.getElementById('country').value
            const city = document.getElementById('city').value
            const address = `${city}, ${country}`
            const contact = `+${document.getElementById('contact').value}`
            const email = document.getElementById('email').value
            const status = document.getElementById('status').checked ? 1 : 2
            const password = document.getElementById('password').value
            const passwordverify = document.getElementById('passwordverify').value
            const tenant_id = document.getElementById('tenant').value

            const formData = new FormData();
            formData.append('name', name);
            formData.append('address', address);
            formData.append('email', email);
            formData.append('contact', contact);
            formData.append('status', status);
            formData.append('password', password);
            formData.append('confirm_password', passwordverify);
            formData.append('notes', 'notes')

            let url = ""

            if(userData.roles == "sadmin"){
                url = `https://umaxxxxx-1-r8435045.deta.app/client-create?tenantId=${tenant_id}`
            }else if(userData.roles == "admin"){
                url = `https://umaxxxxx-1-r8435045.deta.app/client-create`
            }

            const response = await axios.post(url, formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
                }
            })

            if(response.data.Output == "Create Client Successfully"){
                getclient()
                closeModal()
                setUpdateCard(true)
                document.getElementById('name').value = null
                document.getElementById('country').value = 0
                document.getElementById('city').value = 0
                document.getElementById('contact').value = null
                document.getElementById('email').value = null
                document.getElementById('password').value = null
                document.getElementById('passwordverify').value = null
                Swal.fire("Success", "Client created successfully", "success")
            }else{
                Swal.fire("Error", response.detail, "error")
            }
        }else{
            Swal.fire({
                title: "Failed!",
                text: "Please Fill The Blank!",
                icon: "error"
              });
            //   validateForm()
            
        }
        
    }

    async function updateClient(){
        if(EditclientId !== null) {
            if(isvalid){

                const name = document.getElementById('name').value
                const country = document.getElementById('country').value
                const city = document.getElementById('city').value
                const address = `${city}, ${country}`
                const contact = `+${document.getElementById('contact').value}`
                const email = document.getElementById('email').value
                const status = document.getElementById('status').checked ? 1 : 2
                const formData = new FormData();
                formData.append('name', name);
                formData.append('address', address);
                formData.append('email', email);
                formData.append('contact', contact);
                formData.append('status', status);  
        
                const response = await axios.put(`https://umaxxxxx-1-r8435045.deta.app/client-edit?client_id=${EditclientId}`, formData, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
                    }
                })
        
                if(response.data.Output == "Data Updated Successfully"){
                    getclient()
                    closeModal()
                    document.getElementById('name').value = null
                    document.getElementById('country').value = 0
                    document.getElementById('city').value = 0
                    document.getElementById('contact').value = null
                    document.getElementById('email').value = null
                    Swal.fire("Success", "Client Updated", "success")
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
    const [tenants, setTenants] = useState([])

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

        if(userData.roles == "sadmin"){
            await axios.get('https://umaxxxxx-1-r8435045.deta.app/tenant-get-all', {
                headers : {
                    Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
                }
            }).then((response) => {
                setTenants(response.data.Data)
            })
        }
    }

    useEffect(() => {
        getSelectFrontend()
    }, [])

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

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1);
    };

    const filteredData = client.filter((data) => {
        return (
            (!selectedStatus || data.status === Number(selectedStatus)) &&
            (!searchTerm ||
                data.name.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    });


    const [Country, setCountry] = useState([])
    const [City, setCity] = useState([])

    const getAdresslist = async () => {
        await axios.get("https://countriesnow.space/api/v0.1/countries").then((response) => {
            setCountry(response.data.data)
        })
    }

    async function handleCityList(countryname){
        let citylist = []
        Country.map((item) => {
            if(item.country == countryname){
                citylist= item.cities
            }
        })
        setCity(citylist)
    }

    useEffect(() => {
        getAdresslist()
    }, [])

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
                {`Page ${currentPage} / ${totalPages}`}
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
       
    const indexOfLastclient = currentPage * dataPerPage;
    const indexOfFirstclient = indexOfLastclient - dataPerPage;
    const currentclients = filteredData.slice(indexOfFirstclient, indexOfLastclient);


    return (
        <>
            <div className="w-full">
                <div className="flex flex-col md:flex-row justify-between items-center mb-10">
                    <h1 className="text-3xl font-bold uppercase dark:text-white flex gap-2"><MdPeopleOutline size={35}/> Client</h1>
                    <p className="dark:text-white"><a className="hover:cursor-pointer dark:text-white hover:text-blue-400 hover:underline" href="#" onClick={() => setChangeTable("dashboard")}>Dashboard</a>  / Clients</p>
                </div>

                <div className="w-full fit mb-5 rounded-md shadow-md">
                    {/* Header */}
                    <div className="w-full h-12 bg-[#3c50e0] flex items-center rounded-t-md">
                        <h1 className="flex gap-2 p-4 items-center text">
                            <FaTable  className="text-blue-200" size={18}/><p className="text-white text-md font-semibold"></p>
                        </h1>
                    </div>
                    {/* Header end */}


                    <div className="w-full h-fit bg-white dark:bg-slate-800 dark:text-white rounded-b-md p-4">
                        <div className=" flex flex-col-reverse md:flex-row justify-between items-center w-full ">
                            <div className="flex">
                                {/* Button */}
                                <button className="bg-white dark:bg-slate-800 mb-4 border hover:bg-gray-100 dark:hover:bg-slate-400 font-bold px-3 rounded-s-md" onClick={generatePDF}>
                                    <IconContext.Provider value={{ className: "text-xl" }}>
                                        <AiOutlineFilePdf />
                                    </IconContext.Provider>
                                </button>
                                <button className="bg-white dark:bg-slate-800 mb-4 border-b border-t border-e hover:bg-gray-100 dark:hover:bg-slate-400 font-bold px-3" onClick={generateExcel}>
                                    <IconContext.Provider value={{ className: "text-xl" }}>
                                        <RiFileExcel2Line />
                                    </IconContext.Provider>
                                </button>
                                <button className="bg-white dark:bg-slate-800 mb-4 border-b border-t border-e hover:bg-gray-100 dark:hover:bg-slate-400 font-bold px-3 " onClick={() => showModal("Create")} >
                                    <IconContext.Provider value={{ className: "text-xl" }}>
                                        <BiPlus className="text-thin"/>
                                    </IconContext.Provider>
                                </button>
                                {/* Button end */}

                                {/* Filter by select */}
                                <div className="mb-4">
                                    <label htmlFor="rolefilter" className="text-sm font-medium hidden">Role</label>
                                    <select id="rolefilter" className="md:w-[150px] h-10 bg-white dark:bg-slate-800 border-b border-t border-e rounded-e-md text-sm block w-full px-3 py-2 focus:border-none select-no-arrow" defaultValue={0}
                                    value={selectedStatus} onChange={handleStatusChange}
                                    >
                                        <option value="" disabled hidden>Status</option>
                                        <option value="">All status</option>
                                        <option value="1">Active</option>
                                        <option value="2">Inactive</option>
                                    </select>  
                                </div>
                                {/* Filter by select end */}
                            </div>

                            {/* Search */}
                            <div className="flex gap-5">
                                <div className="relative mb-4">
                                    <label htmlFor="search" className="hidden"></label>
                                    <input type="text" id="search" name="search" className=" dark:bg-slate-800 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Search"
                                    defaultValue="" 
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    />
                                    <span className="absolute inset-y-0 right-0 flex items-center pr-3">
                                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                                    </span>
                                </div>
                            </div>
                            {/* Search */}
                        </div>

                        <div className="bg-white dark:bg-slate-800 h-fit overflow-auto">
                            <table className="w-full text-sm text-left" ref={tableRef}>
                                <thead className="text-md text-left uppercase bg-white dark:bg-slate-700">
                                    <tr>
                                        <th scope="col" className="px-5 border dark:border-gray-500 py-3">Name</th>
                                        <th scope="col" className="px-5 border dark:border-gray-500 py-3">Address</th>
                                        <th scope="col" className="px-5 border dark:border-gray-500 py-3">Contact</th>
                                        <th scope="col" className="px-5 border dark:border-gray-500 py-3">Email</th>
                                        <th scope="col" className="px-5 border dark:border-gray-500 py-3">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-slate-800">
                                    {
                                        currentclients.length > 0 ? currentclients.map((client, index) => {
                                            return (    
                                                <tr key={index} className="hover:bg-gray-100 hover:cursor-pointer dark:hover:bg-slate-400 dark:odd:bg-slate-600 dark:even:bg-slate-700 transition-colors duration-300">
                                                    <td scope="row" className="px-5 border dark:border-gray-500 py-3 font-medium whitespace-nowrap underline" onClick={() => showModal("Edit", client._id)}>{client.name}</td>
                                                    <td scope="row" className="px-5 border dark:border-gray-500 py-3 font-medium whitespace-nowrap">{client.address}</td>
                                                    <td scope="row" className="px-5 border dark:border-gray-500 py-3 font-medium whitespace-nowrap">
                                                        <a href={`https://wa.me/${client.contact.replace(/\D+/g, '')}`} target="_blank" className="text-blue-500">
                                                            {client.contact}
                                                        </a>
                                                    </td>
                                                    <td scope="row" className="px-5 border dark:border-gray-500 py-3 font-medium whitespace-nowrap"><a href={`mailto:${client.email}`} className="text-blue-500">{client.email }</a></td>
                                                    <td scope="row" className="px-5 border dark:border-gray-500 py-3 font-medium whitespace-nowrap">{client.status == 1 ? "Active" : "Inactive"}</td>
                                                </tr>
                                            )
                                    }) : (
                                        // Check user yang sudah difilter
                                        client.length > 0 ? (
                                            // Jika data tida ditemukan
                                            <tr className="text-center border dark:border-gray-500">
                                                <td colSpan={8} className=" py-4">
                                                    Data not found
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
                </div>
            </div>

            {/* <!-- Main modal --> */}
            <div id="crud-modal" ref={addModal} className="fixed inset-0 flex hidden items-center justify-center bg-gray-500 bg-opacity-75 z-50">

                <div className="relative p-4 w-full max-w-2xl max-h-full ">
                    {/* <!-- Modal content --> */}
                    <div className="relative bg-white dark:bg-slate-900 dark:text-white rounded-lg shadow">
                        {/* <!-- Modal header --> */}
                        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t bg-[#3c50e0] dark:bg-slate-800 text-white">
                            <h3 className="text-lg font-semibold">
                                {`${modeModal} Client`}
                            </h3>
                            <button type="button" className=" text-xl bg-transparent hover:bg-blue-400  rounded-lg  w-8 h-8 ms-auto inline-flex justify-center items-center " data-modal-toggle="crud-modal" onClick={closeModal}>
                                <FaTimes/>
                            </button>
                        </div>
                        {/* <!-- Modal body --> */}
                        <div className="p-4 md:p-5">
                            <div className="grid gap-4 mb-4 grid-cols-2">
                                <div className="col-span-2">
                                    <label htmlFor="name" className="block mb-2 text-sm font-medium ">Client Name <span className="text-red-500">*</span> </label>
                                    <input type="text" name="name" id="name" className="bg-gray-50 dark:bg-slate-800 dark:border-none border border-gray-300 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 " placeholder="Type client name here"
                                    required
                                    onChange={(e) => setValues({...values, name: e.target.value})}/>
                                    {
                                        error.name && <p className="text-red-500 text-xs">{error.name}</p>
                                    }
                                </div>
                                <div className="col-span-1">
                                <label htmlFor="country" className="block mb-2 text-sm font-medium ">Country</label>
                                <select id="country" className="bg-gray-50 dark:bg-slate-800 dark:border-none border border-gray-300  text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5" onChange={(e) => handleCityList(e.target.value)} defaultValue={0}>
                                    <option value="0" key={0} disabled hidden>Select Country</option>
                                    {
                                        Country.length > 0 ? Country.map((item, index) => (
                                            <option key={index} value={item.country}>{item.country}</option>
                                        )) : <option disabled>Loading</option>
                                    }
                                </select>
                            </div>

                            <div className="col-span-1">
                                <label htmlFor="city" className="block mb-2 text-sm font-medium ">City</label>
                                <select id="city" className="bg-gray-50 dark:bg-slate-800 dark:border-none border border-gray-300  text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5" defaultValue={0}  onChange={(e) => setValues({...values, address: e.target.value})}>
                                    {
                                        City.length > 0 ? <option disabled value={0} key={0} hidden>Select City</option> : ""
                                    }
                                    {
                                        City.length > 0 ? City.map((item, index) => (
                                            <option key={index} value={item}>{item}</option>
                                        )) : <option disabled value={0} key={0} hidden>Please Select Country</option>
                                    }
                                </select>
                                {
                                    error.address && <p className="text-red-500 text-xs">{error.address}</p>
                                }
                            </div>
                                
                                <div className="col-span-1">
                                    <label htmlFor="email" className="block mb-2 text-sm font-medium ">Email <span className="text-red-500">*</span> </label>
                                    <input type="email" name="email" id="email" className="bg-gray-50 dark:bg-slate-800 dark:border-none border border-gray-300 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 " placeholder="example@gmail.com" required
                                    onChange={(e) => setValues({...values, email: e.target.value})}/>
                                    {
                                        error.email && <p className="text-red-500 text-xs">{error.email}</p>
                                    }
                                </div>
                                <div className="col-span-1">
                                    <label htmlFor="contact" className="block mb-2 text-sm font-medium ">Contact <span className="text-red-500">*</span> </label>
                                    <input type="number" name="contact" id="contact" className="bg-gray-50 dark:bg-slate-800 dark:border-none border border-gray-300 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 " placeholder="+62427836778" required
                                    onChange={(e) => setValues({...values, contact: e.target.value})}/>
                                    {
                                        error.contact && <p className="text-red-500 text-xs">{error.contact}</p>
                                    }
                                </div>
                                <div className="col-span-2 md:col-span-1" ref={passwordInput}>
                                    <label htmlFor="password" className="block mb-2 text-sm font-medium ">Password <span className="text-red-500">*</span> </label>
                                    <div className="relative">
                                        <input type={showPassword ? "text" : "password"} name="password" id="password" className="bg-gray-50 dark:bg-slate-800 dark:border-none border border-gray-300 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 " placeholder="Type password here" required 
                                        onChange={(e)=> setValues({...values, password: e.target.value})}/>
                                        <button onClick={handleShowPassword} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none" type="button">
                                            {showPassword ? <IoMdEye/> : <IoMdEyeOff/>}
                                        </button>
                                    </div>
                                    {
                                        error.password && <p className="text-red-500 text-xs">{error.password}</p>
                                    }
                                </div>
                                <div className="col-span-2 md:col-span-1" ref={passwordverifyInput}>
                                    <label htmlFor="passwordverify" className="block mb-2 text-sm font-medium ">Confirm Password <span className="text-red-500">*</span> </label>
                                    <div className="relative">
                                        <input type={showPassword ? "text" : "password"} name="passwordverify" id="passwordverify" className="bg-gray-50 dark:bg-slate-800 dark:border-none border border-gray-300 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 " placeholder="Type password here" required onChange={(e) => setValues({...values, passwordverify: e.target.value})}/>
                                        <button onClick={handleShowPassword} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none" type="button">
                                            {showPassword ? <IoMdEye/> : <IoMdEyeOff/>}
                                        </button>
                                    </div>
                                    {
                                        error.passwordverify && <p className="text-red-500 text-xs">{error.passwordverify}</p>
                                    }
                                </div>
                                <div className="col-span-2" ref={tenantInput}>
                                    <label htmlFor="tenant" className="block mb-2 text-sm font-medium ">Tenant <span className="text-red-500">*</span> </label>
                                    <select id="tenant" className="bg-gray-50 dark:bg-slate-800 dark:border-none border border-gray-300 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5  ">
                                        {
                                            tenants.length > 0 ? tenants.map((tenant, index) => {
                                                return (
                                                    <option key={index} value={tenant._id}>{tenant.company}</option>
                                                )
                                            }) : <option key={0} value={0}>Loading..</option>
                                        }
                                    </select>
                                </div>
                            </div>
                            
                                <div className="flex justify-between items-end">
                                <div>
                                    <label htmlFor="status" className="flex flex-col md:flex-row gap-2 items-center cursor-pointer">
                                    <input type="checkbox" value="" id="status" name="status" className="sr-only peer"/>
                                    <span className="text-sm font-medium ">Status</span>
                                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4  rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white dark:bg-slate-800 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>
                                <div>
                                 {
                                            modeModal === 'Edit' ? <div className="flex gap-3">
                                                <button className="bg-blue-500 hover:bg-blue-700 mt-5 text-white font-bold py-2 px-4 rounded text-nowrap" onClick={updateClient}>Save Change</button>
                                                <button className="bg-red-500 hover:bg-red-700 mt-5 text-white font-bold py-2 px-4 rounded text-nowrap" onClick={() => handleDelete(EditclientId)}><FaTrash/></button>
                                            </div> 
                                             : <button className="bg-blue-500 hover:bg-blue-700 mt-5 text-white font-bold py-2 px-4 rounded" onClick={createClient}>Submit</button>
                                        }
                                </div>
                                </div>  
                        </div>
                    </div>
                </div>
            </div> 
        </>
    )
}