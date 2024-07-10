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
import { useRouter } from "next/navigation"
import { RiFileExcel2Line, RiFileExcelLine, RiUser3Line } from "react-icons/ri"
import Image from "next/image"
import CountCard from "./CountCard"
import { BiPlus } from "react-icons/bi"

export default function UserTable() {

    const [users, setUsers] = useState([])
    const [userMemo, setUserMemo] = useState([])
    const [EditUserId, setEditUserId] = useState(null)

    const [sidebarHide, setSidebarHide, updateCard, setUpdateCard, changeTable, setChangeTable, userData, dataDashboard] = useContext(AdminDashboardContext)

    const addModal = useRef(null)
    const [modeModal, setModeModal] = useState("add")

    const Router = useRouter()

    function showModal(mode, user_id = null ){
        console.log(user_id)
        setModeModal(mode)
        if(mode == "Edit"){
            const filteredUsers = userMemo.filter(user => user._id === user_id);
            if(filteredUsers.length > 0){
                // console.log(filteredUsers[0])
                setEditUserId(user_id)
                document.getElementById('name').value = filteredUsers[0].name
                document.getElementById('role').value = filteredUsers[0].roles
                
            } else{
                Swal.fire("User not found");
            }
        }
        // else if(mode == "Create") {
        //     document.getElementById('name').value = null
        //     document.getElementById('role').value = null
        // }
        addModal.current.classList.remove("hidden")
    }
    function closeModal(){
        addModal.current.classList.add("hidden")
    }
    
    function handleDelete(user_id){
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
            deleteuser(user_id)
            Swal.fire({
                title: "Deleted!",
                text: "Your file has been deleted.",
                icon: "success"
            })
            setTimeout(() => {
                closeModal()
            }, 100);
            }
          });
    }

    const deleteuser = async (user_id) => {
        closeModal()
        // console.log(user_id)
        try {
            const response = await axios.delete(`https://umaxxnew-1-d6861606.deta.app/user-delete?user_id=${user_id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
                }
            })
            getUsers()
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
                setLastPage(users.length);
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
        filename: "DataUsers",
        sheet: "DataUsers",
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
                doc.text('Data Users Umax Dashboard', 10, 10);
                doc.autoTable({
                    head: [['Name', 'Role', 'Email', "Company"]],
                    body: users.map((user) => [user.name, user.roles, user.email, user.company_name]),
                });
                doc.save('DataUsers.pdf');
              Swal.fire({
                title: "Downloaded!",
                text: "Your file has been downloaded.",
                icon: "success"
              });
            }
          });
       
    };

    function handleDetail(user_id){
        const filteredUsers = users.filter(user => user._id === user_id);
        if(filteredUsers.length > 0) {
            const [user] = filteredUsers;
            Swal.fire({
                title: `${user.name} (${user.roles})`,
                text: `${user.email} | ${user.company_name}`,
                imageUrl: `data:image/png;base64, ${user.image}`,
                imageWidth: 200,
                imageHeight: 200,
                imageAlt: "Photo Profile"
              });
        } else {
            Swal.fire("User not found");
        }
    }

    async function getUsers(){
        const response = await axios.get('https://umaxxnew-1-d6861606.deta.app/user-by-tenant', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
            }
        })
        setUsers(response.data.Data)
        setUserMemo(response.data.Data)
        setTotalPages(Math.ceil(users.length / itemsPerPage));
        setFirstPage(0);
        setLastPage(itemsPerPage);
    }

    useEffect(() => {
        getUsers()
    }, [])

    // async function creatUser(){
    //     const name = document.getElementById('name').value
    //     const email = document.getElementById('email').value
    //     const language = document.getElementById('language').value
    //     const culture = document.getElementById('culture').value
    //     const currency = document.getElementById('currency').value
    //     const timezone = document.getElementById('input_timezone').value
    //     const currencyposition = document.getElementById('currencyposition').value

    //     const formData = new FormData();
    //     formData.append('name', name);
    //     formData.append('email', email);
    //     formData.append('language', language);
    //     formData.append('culture', culture);
    //     formData.append('currency', currency);
    //     formData.append('input_timezone', timezone);
    //     formData.append('currency_position', currencyposition);

    //     const response = await axios.post('https://umaxxnew-1-d6861606.deta.app/user-create', formData, {
    //         headers: {
    //             Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
    //         }
    //     })

    //     if(response.data.Output == "Registration Successfully"){
    //         getUsers()
    //         closeModal()
    //         setUpdateCard(true)
    //         document.getElementById('name').value = null
    //         document.getElementById('email').value = null
    //         Swal.fire("Success", "user created successfully", "success")
    //     }else{
    //         Swal.fire("Error", response.detail, "error")
    //     }
    // }

    async function updateUser(){
        if(EditUserId !== null) {
            const role = document.getElementById('role').value
            const formData = new FormData();
            formData.append('role', role);
            console.log(EditUserId)
            const response = await axios.post(`https://umaxxnew-1-d6861606.deta.app/change-user-role?user_id=${EditUserId}`, formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
                }
            })
    
            if(response.data.Output.includes("Successfully changed") || response.data.Output.includes("Berhasil")){
                getUsers()
                closeModal()
                Swal.fire("Success", "user Updated", "success")
            }else{
                Swal.fire("Error", response.detail.ErrMsg, "error")
            }
        }
    }


    const [timezone, setTimezone] = useState([])
    const [currency, setCurrency] = useState([])
    const [culture, setCulture] = useState([])
    const [tenants, setTenants] = useState([])

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

        // if(localStorage.getItem('roles') == 'sadmin'){
        //     await axios.get('https://umaxxnew-1-d6861606.deta.app/tenant-get-all', {
        //         headers : {
        //             Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
        //         }
        //     }).then((response) => {
        //         setTenants(response.data.Data)
        //     })
        // }
    }

    useEffect(() => {
        getSelectFrontend()
    }, [])


    // Pagination

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [firstPage, setFirstPage] = useState(0);
    const [lastPage, setLastPage] = useState(10);

    useEffect(() => {
        setCurrentPage(1);
        setTotalPages(Math.ceil(users.length / itemsPerPage));
        setFirstPage(0);
        setLastPage(itemsPerPage);
    }, [users, itemsPerPage]);

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
        }else if(currentPage == 1 && currentPage == totalPages){
            firstPageButton.current.classList.add("paginDisable");
            previousButton.current.classList.add("paginDisable");
            nextButton.current.classList.add("paginDisable");
            lastPageButton.current.classList.add("paginDisable");
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

    function LoadingCircle() {
        return (
          <div className="flex justify-center items-center h-20">
            <div className="relative">
              <div className="w-10 h-10 border-4 border-[#1C2434] rounded-full border-t-transparent animate-spin"></div>
            </div>
          </div>
        );
    };

    return (
        <>
            <div className="w-full">
                <div className="flex flex-col md:flex-row justify-between items-center mb-3">
                    <h1 className="text-2xl font-bold flex gap-2"> <RiUser3Line/> USERS</h1>
                    <p>Dashboard / Users</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-7 w-full mb-3">
                   {
                   userData.roles == "admin" ? <CountCard title="Tenants" value={userData.company_name ? userData.company_name : <div className="text-md animate-pulse">Loading...</div>} handleClick={"company"}  /> :
                   userData.roles == "sadmin" ?  <CountCard title="Users" value={dataDashboard.tenants ? dataDashboard.tenants : <div className="text-md animate-pulse">Loading...</div>} handleClick={"tenants"}  /> : ""
                  }
                    <CountCard title="Users" value={dataDashboard.users ? dataDashboard.users : <div className="text-md animate-pulse">Loading...</div>} handleClick={"users"}  />
                    <CountCard title="Campaigns" value={dataDashboard.campaigns ? dataDashboard.campaigns : <div className="text-md animate-pulse">Loading...</div>} handleClick={"campaigns"}  />
                    <CountCard title="Clients" value={dataDashboard.clients ? dataDashboard.clients : <div className="text-md animate-pulse">Loading...</div>} handleClick={"clients"}  />
                </div>
                
                <div className="w-full h-fit bg-white mb-5 rounded-md shadow-md">
                    <div className="w-full h-10 bg-[#3c50e0] flex items-center rounded-t-md">
                        <h1 className="flex gap-2 p-4 items-center text">
                            <FaTable  className="text-blue-200" size={18}/><p className="text-white text-md font-semibold">User Table</p>
                        </h1>
                    </div>
                    <div className="w-full h-fit bg-white p-4">
                        <div className="w-full flex justify-start mb-4">
                            <button className="bg-white hover:bg-gray-100 border font-bold py-2 px-3 rounded mr-2" onClick={generatePDF}>
                                <IconContext.Provider value={{ className: "text-xl" }}>
                                    <AiOutlineFilePdf />
                                </IconContext.Provider>
                            </button>
                            <button className="bg-white hover:bg-gray-100 border font-bold py-2 px-3 rounded mr-2" onClick={generateExcel}>
                                <IconContext.Provider value={{ className: "text-xl" }}>
                                    <RiFileExcel2Line />
                                </IconContext.Provider>
                            </button>
                            <button className="bg-white hover:bg-gray-100 border font-bold py-2 px-3 rounded " onClick={() => {Router.push('register')}} >
                                <IconContext.Provider value={{ className: "text-xl" }}>
                                    <BiPlus className="text-thin"/>
                                </IconContext.Provider>
                            </button>
                        </div>

                        <div className=" flex flex-col-reverse md:flex-row justify-between items-center w-full ">
                            <div className="flex gap-3">
                                <div className="mb-4">
                                    <label htmlFor="rolefilter" className="text-sm font-medium text-gray-900 hidden">Role</label>
                                    <select id="rolefilter" className="md:w-[150px] h-10 bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full px-3 py-2" defaultValue={0}
                                    onChange={(e) => {
                                        const role = e.target.value;
                                        const filteredData = userMemo.filter((user) =>
                                        user.roles.includes(role)
                                        );
                                        role === "0" ? setUsers(userMemo) : setUsers(filteredData);
                                    }}>
                                        <option value="0" key={0} >All User</option>
                                        <option value="admin" key={1}>Admin</option>
                                        <option value="staff" key={2}>Staff</option>
                                    </select>
                                    
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="tenantfilter" className="text-sm font-medium text-gray-900 hidden">Tenant</label>
                                    <select id="tenantfilter" className="md:w-[150px] h-10 bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full px-3 py-2" defaultValue={0}>
                                        <option value="0" key={0} disabled hidden>Filter Tenant</option>
                                        {
                                            tenants.map((tenant, index) => {
                                                return (
                                                    <option value={tenant.tenant_id} key={index + 1}>{tenant.company}</option>
                                                )
                                            })
                                        }
                                    </select>
                                </div>

                            </div>
                            <div className="flex gap-5">
                                <div className="relative mb-4">
                                    <input type="text" className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Search" 
                                    onChange={(e) => {
                                        const search = e.target.value.toLowerCase();
                                        const filteredData = userMemo.filter((user) =>
                                        user.name.toLowerCase().includes(search)
                                        );
                                        search === "" ? setUsers(userMemo) : setUsers(filteredData);
                                    }} id="search"/>
                                    <span className="absolute inset-y-0 right-0 flex items-center pr-3">
                                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className=" bg-white h-fit overflow-auto">
                            <table className="w-full text-sm text-left" ref={tableRef}>
                                <thead className="text-md uppercase bg-white text-gray-600">
                                    <tr>
                                        <th scope="col" className="px-6 border py-5">No</th>
                                        <th scope="col" className="px-6 border py-5">Name</th>
                                        <th scope="col" className="px-6 border py-5">Role</th>
                                        <th scope="col" className="px-6 border py-5">Email</th>
                                        <th scope="col" className="px-6 border py-5">Company</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white">
                                    {
                                        users.length > 0 ? users.map((user, index) => (
                                            <tr key={index} className="hover:bg-gray-100 hover:cursor-pointer transition-colors duration-300">
                                                <td className="px-6 border py-4 font-medium text-gray-900 whitespace-nowrap">{index + 1}</td>
                                                <td className="px-6 border py-4 font-medium text-gray-900 whitespace-nowrap" onClick={() => showModal("Edit", user._id)}>{user.name}</td>
                                                <td className="px-6 border py-4 font-medium text-gray-900 whitespace-nowrap" onClick={() => showModal("Edit", user._id)}>{user.roles}</td>
                                                <td className="px-6 border py-4 font-medium text-gray-900 whitespace-nowrap">
                                                    <a href={`mailto:${user.email}`} className="text-blue-500">{user.email}</a>
                                                </td>
                                                <td className="px-6 border py-4 font-medium text-gray-900 whitespace-nowrap">
                                                    <a className="text-blue-500" href={`tel:${user.company_name}`}>{String(user.company_name)}</a>
                                                </td>
                                            </tr>
                                        )).slice(firstPage, lastPage) : (
                                            <tr className="text-center">
                                                <td colSpan={5}>
                                                    <LoadingCircle />
                                                </td>
                                            </tr>
                                        )
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
                        <div className="w-full flex justify-between items-center mb-4">
                            <div className="mt-5 flex  gap-3 items-center w-full justify-end">
                                <button className="bg-white hover:bg-gray-100 border py-1.5 px-3 rounded inline-flex items-center" onClick={handleFristPageButton} ref={firstPageButton}>
                                    {"<<"}
                                </button>
                                <button className="bg-white hover:bg-gray-100 border py-1.5 px-3 rounded inline-flex items-center" onClick={handlePreviousButton} ref={previousButton}>
                                    {"<"}   
                                </button>
                                <div>
                                    <p>Page {currentPage} / {totalPages}</p>
                                </div>
                                <button className="bg-white hover:bg-gray-100 border py-1.5 px-3 rounded inline-flex items-center" onClick={handleNextButton} ref={nextButton}>
                                    {">"}
                                </button>
                                <button className="bg-white hover:bg-gray-100 border py-1.5 px-3 rounded inline-flex items-center" onClick={handleLastPageButton} ref={lastPageButton}>
                                {">>"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* <!-- Main modal --> */}
            <div id="crud-modal" ref={addModal} className="fixed inset-0 flex hidden items-center justify-center bg-gray-500 bg-opacity-75 z-50">

                <div className="relative p-4 w-full max-w-md max-h-full ">
                    {/* <!-- Modal content --> */}
                    <div className="relative bg-white rounded-lg shadow">
                        {/* <!-- Modal header --> */}
                        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t bg-blue-500">
                            <h3 className="text-lg font-semibold text-white ">
                                {`${modeModal} user`}
                            </h3>
                            <button type="button" className="text-white text-xl bg-transparent hover:bg-blue-400 rounded-lg  w-8 h-8 ms-auto inline-flex justify-center items-center " data-modal-toggle="crud-modal" onClick={closeModal}>
                                <FaTimes/>
                            </button>
                        </div>
                        {/* <!-- Modal body --> */}
                        <div className="p-4 md:p-5">
                            <div className="grid gap-4 mb-4 grid-cols-2">
                                <div className="col-span-2">
                                    <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 ">Name</label>
                                    <input type="text" name="name" id="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 " placeholder="Type name here"
                                    disabled/>
                                </div>
                                <div className={`col-span-2 ${EditUserId == '64fa84403ce06f0129321ced' ? "hidden" : "" }`}>
                                    <label htmlFor="role" className="block mb-2 text-sm font-medium text-gray-900">Role</label>
                                    <select id="role" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 " >
                                        <option value="admin">Admin</option>
                                        <option value="staff">Staff</option>
                                    </select>
                                </div>
                            </div>
                                <div className="flex justify-between items-end">
                                    <div></div>
                                    <div className="flex flex-row-reverse items-center gap-3">
                                        {
                                            EditUserId != "64fa84403ce06f0129321ced" ? (
                                                <button className="bg-red-500 hover:bg-red-700 mt-5 text-white text-xl font-bold py-2.5 px-4 rounded" 
                                                onClick={() => handleDelete(EditUserId)}
                                                >
                                                    <FaTrash/>
                                                </button>
                                            ) : ""
                                        }
                                    
                                        {
                                            modeModal === 'Edit' ? <button className="bg-blue-500 hover:bg-blue-700 mt-5 text-white font-bold py-2 px-4 rounded text-nowrap" onClick={updateUser}>Save Change</button> : 
                                            <button className="bg-blue-500 hover:bg-blue-700 mt-5 text-white font-bold py-2 px-4 rounded" 
                                            // onClick={creatUser}
                                            >Submit</button>
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