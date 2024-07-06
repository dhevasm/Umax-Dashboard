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
import { FaFileExcel } from "react-icons/fa"
import { FaPlus } from "react-icons/fa"
import { FaPen } from "react-icons/fa"
import { FaTrash } from "react-icons/fa"
import { FaEye } from "react-icons/fa"
import { FaTimes } from "react-icons/fa"
export default function UserTable() {

    const [Users, setUsers] = useState([])
    const [UserMemo, setUserMemo] = useState([])
    const [editUser, setEditUser] = useState([])

    const [sidebarHide, setSidebarHide, updateCard, setUpdateCard, changeTable, setChangeTable] = useContext(AdminDashboardContext)

    const addModal = useRef(null)
    const [modeModal, setModeModal] = useState("add")

    function showModal(mode, User_id = null ){
        setModeModal(mode)
        if(mode == "Edit"){
            const filteredUser = UserMemo.filter(User => User._id === User_id);
            if(filteredUser.length > 0){
                setEditUser(filteredUser[0]);
            } else {
                Swal.fire("User not found");
            }
        }
        addModal.current.classList.remove("hidden")
    }
    function closeModal(){
        addModal.current.classList.add("hidden")
    }

    function handleDelete(User_id){
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
            deleteUser(User_id)
            Swal.fire({
                title: "Deleted!",
                text: "Your file has been deleted.",
                icon: "success"
            })
            }
          });
    }

    const deleteUser = async (User_id) => {
        console.log(User_id)
        try {
            const response = await axios.delete(`https://umaxxnew-1-d6861606.deta.app/user-delete?user_id=${User_id}`, {
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

    const { onDownload } = useDownloadExcel({
        currentTableRef: tableRef.current,
        filename: "DataUser",
        sheet: "DataUser",
      });


    const generatePDF = () => {
        const doc = new jsPDF();
        doc.text('Data User Umax Dashboard', 10, 10);
        doc.autoTable({
            head: [['Name', 'Role', 'Email', "Company"]],
            body: Users.map((User) => [User.name, User.roles, User.email, User.company_name]),
        });
        doc.save('DataUser.pdf');
    };

    function handleDetail(User_id){
        const filteredUser = Users.filter(User => User._id === User_id);
        if(filteredUser.length > 0) {
            const [User] = filteredUser;
            Swal.fire(`<p>
                ${User.company}\nAddress: ${User.address}\nContact: ${User.contact}\nEmail: ${User.email}
                </p>`);
        } else {
            Swal.fire("User not found");
        }
    }

    async function getUsers(){
        const response = await axios.get('https://umaxxnew-1-d6861606.deta.app/user-by-tenant ', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
            }
        })
        setUsers(response.data.Data)
        setUserMemo(response.data.Data)
    }

    useEffect(() => {
        getUsers()
    }, [])

    const [timezone, setTimezone] = useState([])
    const [currency, setCurrency] = useState([])
    const [culture, setCulture] = useState([])

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
    }

    useEffect(() => {
        getSelectFrontend()
    }, [])

    useEffect(() => {
        console.log(culture)
    }, [culture])


    return (
        <>
            <div className="w-full pb-20 mt-10">
                <div className=" flex flex-row justify-between items-center">
                    <h1 className="text-3xl font-bold">Users</h1>
                    <div className="flex gap-5 items-center mt-5">
                        <div>
                            <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2" onClick={generatePDF}>
                                <IconContext.Provider value={{ className: "text-xl" }}>
                                    <AiOutlineFilePdf />
                                </IconContext.Provider>
                            </button>
                            <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2" onClick={onDownload}>
                                <IconContext.Provider value={{ className: "text-xl" }}>
                                    <FaFileExcel />
                                </IconContext.Provider>
                            </button>
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded opacity-30" onClick={() => showModal("Create")}>
                                <IconContext.Provider value={{ className: "text-xl" }}>
                                    <FaPlus />
                                </IconContext.Provider>
                            </button>
                        </div>
                        <div className="relative">
                            <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Search User" 
                            onChange={(e) => {
                                const search = e.target.value.toLowerCase();
                                const filteredData = UserMemo.filter((User) =>
                                User.name.toLowerCase().includes(search)
                                );
                                search === "" ? setUsers(UserMemo) : setUsers(filteredData);
                            }}/>
                            <span className="absolute inset-y-0 right-0 flex items-center pr-3">
                                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                            </span>
                        </div>
                    </div>
                </div>
                <div className="rounded-md mt-5 shadow-xl overflow-auto">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400" ref={tableRef}>
                        <thead className="text-xs text-white uppercase bg-green-500">
                            <tr>
                                <th scope="col" className="px-6 py-3">No</th>
                                <th scope="col" className="px-6 py-3">Name</th>
                                <th scope="col" className="px-6 py-3">Role</th>
                                <th scope="col" className="px-6 py-3">Email</th>
                                <th scope="col" className="px-6 py-3">Company</th>
                                <th scope="col" className="px-6 py-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                               Users.length > 0 ?  Users.map((User, index) => {
                                    return (
                                        <tr key={index} className="odd:bg-white  even:bg-gray-200 hover:bg-green-200 hover:cursor-pointer">
                                            <td  scope="row" className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap">{index + 1}</td>
                                            <td scope="row" className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap">{User.name}</td>
                                            <td scope="row" className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap">{User.roles}</td>
                                            <td scope="row" className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap">
                                             <a href={`mailto:${User.email}`} className="text-blue-500">{User.email}</a></td>
                                            <td scope="row" className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap">
                                               <a className="text-blue-500" href={`tel:${User.contact}`}>{User.company_name}</a> </td>
                                            <td scope="row" className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap flex gap-3">
                                                <button className="text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-green-500 py-2 px-4 rounded-md" onClick={() => handleDetail(User._id)}>
                                                    <IconContext.Provider value={{ className: "text-xl" }}>
                                                        <FaEye />
                                                    </IconContext.Provider>
                                                </button>
                                                <button className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-blue-500 py-2 px-4 rounded-md" onClick={() => showModal("Edit", User._id)}>
                                                    <IconContext.Provider value={{ className: "text-xl" }}>
                                                        <FaPen />
                                                    </IconContext.Provider>
                                                </button>
                                                <button className="text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-red-500 py-2 px-4 rounded-md" onClick={() => handleDelete(User._id)}>
                                                    <IconContext.Provider value={{ className: "text-xl" }}>
                                                        <FaTrash />
                                                    </IconContext.Provider>
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                }) : <tr className="text-center animate-pulse"><td>Loading...</td></tr>
                            }
                        </tbody>
                    </table>
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
                    {`${modeModal} User`}
                </h3>
                <button type="button" className="text-gray-600 text-xl bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg  w-8 h-8 ms-auto inline-flex justify-center items-center " data-modal-toggle="crud-modal" onClick={closeModal}>
                    <FaTimes/>
                </button>
            </div>
            {/* <!-- Modal body --> */}
            <div className="p-4 md:p-5">
                <div className="grid gap-4 mb-4 grid-cols-2">
                    <div className="col-span-2">
                        <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 ">Company Name</label>
                        <input type="text" name="name" id="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 " placeholder="Type company name here"
                        required/>
                    </div>
                    <div className="col-span-2">
                        <label htmlFor="address" className="block mb-2 text-sm font-medium text-gray-900 ">Company Address</label>
                        <input type="text" name="address" id="address" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 " placeholder="Type company adress here" required/>
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 ">Email</label>
                        <input type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 " placeholder="example@gmail.com" required/>
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                        <label htmlFor="contact" className="block mb-2 text-sm font-medium text-gray-900 ">Contact</label>
                        <input type="number" name="contact" id="contact" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 " placeholder="+62427836778" required/>
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                        <label htmlFor="language" className="block mb-2 text-sm font-medium text-gray-900">Language</label>
                        <select id="language" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5  ">
                            <option value="en">English</option>
                            <option value="id">Indonesia</option>
                        </select>
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                        <label htmlFor="culture" className="block mb-2 text-sm font-medium text-gray-900">Culture</label>
                        <select id="culture" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5">
                            {
                                culture.length > 0 ? culture.map((item) => (
                                    <option value={item.cultureInfoCode}>{item.country} | {item.cultureInfoCode}</option>
                                )) : <option disabled>Loading</option>
                            }
                        </select>
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                        <label htmlFor="input_timezone" className="block mb-2 text-sm font-medium text-gray-900">Time Zone</label>
                        <select id="input_timezone" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5  ">
                            {
                                timezone.length > 0 ? timezone.map((item) => (
                                    <option value={item.timezone}>{item.timezone}</option>
                                )) : <option disabled>Loading</option>
                            }
                        </select>
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                        <label htmlFor="currency" className="block mb-2 text-sm font-medium text-gray-900">Currency</label>
                        <select id="currency" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5  ">
                            {
                                currency.length > 0 ? currency.map((item) => (
                                    <option value={item.currency}>{item.currency}</option>
                                )) : <option disabled>Loading</option>
                            }
                        </select>
                    </div>
                    
                </div>
                    <div className="col-span-2 sm:col-span-1">
                        <label htmlFor="currentposition" className="block mb-2 text-sm font-medium text-gray-900">Current Position</label>
                        <div className="flex items-center gap-20 justify-between">
                            <select id="currentposition" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5  ">
                                <option value="true">True</option>
                                <option value="false">False</option>
                            </select>
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" >Submit</button>
                        </div>
                    </div>  
            </div>
           
        </div>
    </div>
</div> 

        </>
    )
}