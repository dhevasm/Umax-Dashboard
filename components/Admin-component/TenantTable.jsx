'use client'

import axios from "axios"
import { useState,useEffect, useRef } from "react"
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
export default function TenantTable() {

    const [tenants, setTenants] = useState([])
    const [tenantMemo, setTenantMemo] = useState([])
    const [editTenant, setEditTenant] = useState([])

    const addModal = useRef(null)
    const [modeModal, setModeModal] = useState("add")

    function showModal(mode, tenant_id = null ){
        setModeModal(mode)
        if(mode == "Edit"){
            const filteredTenant = tenantMemo.filter(tenant => tenant._id === tenant_id);
            if(filteredTenant.length > 0){
                setEditTenant(filteredTenant[0]);
            } else {
                Swal.fire("Tenant not found");
            }
        }
        addModal.current.classList.remove("hidden")
    }
    function closeModal(){
        addModal.current.classList.add("hidden")
    }

    function handleDelete(tenant_id){
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
            deleteTenant(tenant_id)
            Swal.fire({
                title: "Deleted!",
                text: "Your file has been deleted.",
                icon: "success"
            })
            }
          });
    }

    const deleteTenant = async (tenant_id) => {
        console.log(tenant_id)
        try {
            const response = await axios.delete(`https://umaxxnew-1-d6861606.deta.app/tenant-delete?tenant_id=${tenant_id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
                }
            })
            getTenants()
            
        } catch (error) {
            console.log(error)
        }
    }

    const tableRef = useRef(null);

    const { onDownload } = useDownloadExcel({
        currentTableRef: tableRef.current,
        filename: "DataTenant",
        sheet: "DataTenant",
      });

    const generatePDF = () => {
        const doc = new jsPDF();
        doc.text('DataTenant', 10, 10);
        doc.autoTable({
            head: [['Name', 'Address', 'Contact', "Email"]],
            body: tenants.map((tenant) => [tenant.company, tenant.address, tenant.contact, tenant.email]),
        });
        doc.save('DataTenant.pdf');
    };

    function handleDetail(tenant_id){
        const filteredTenant = tenants.filter(tenant => tenant._id === tenant_id);
        if(filteredTenant.length > 0) {
            const [tenant] = filteredTenant;
            Swal.fire(`<p>
                ${tenant.company}\nAddress: ${tenant.address}\nContact: ${tenant.contact}\nEmail: ${tenant.email}
                </p>`);
        } else {
            Swal.fire("Tenant not found");
        }
    }

    async function getTenants(){
        const response = await axios.get('https://umaxxnew-1-d6861606.deta.app/tenant-get-all', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
            }
        })
        setTenants(response.data.Data)
        setTenantMemo(response.data.Data)
    }

    useEffect(() => {
        getTenants()
    }, [])

    async function createTenant(){
        const company = document.getElementById('name').value
        const address = document.getElementById('address').value
        const contact = document.getElementById('contact').value
        const email = document.getElementById('email').value
        const language = document.getElementById('language').value
        const culture = document.getElementById('culture').value
        const currency = document.getElementById('currency').value
        const timezone = document.getElementById('input_timezone').value
        const currentposition = document.getElementById('currentposition').value

        const formData = new FormData();
        formData.append('company', company);
        formData.append('address', address);
        formData.append('email', email);
        formData.append('contact', contact);
        formData.append('language', language);
        formData.append('culture', culture);
        formData.append('currency', currency);
        formData.append('input_timezone', timezone);
        formData.append('currency_position', currentposition);

        const response = await axios.post('https://umaxxnew-1-d6861606.deta.app/tenant-create', formData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
            }
        })

        if(response.data.Output == "Registration Successfully"){
            getTenants()
            closeModal()
            Swal.fire("Success", "Tenant created successfully", "success")
        }else{
            Swal.fire("Error", response.data.Message, "error")
        }
    }

    return (
        <>
            <div className="w-full pb-20 mt-10">
                <div className=" flex flex-row justify-between items-center ">
                    <h1 className="text-3xl font-bold">Tenants</h1>
                    <div className="flex gap-5 items-center mt-5">
                        <div>
                            <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2">
                                <IconContext.Provider value={{ className: "text-xl" }}>
                                    <AiOutlineFilePdf />
                                </IconContext.Provider>
                            </button>
                            <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2">
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
                            <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Search Tenant" 
                            onChange={(e) => {
                                const search = e.target.value.toLowerCase();
                                const filteredData = tenantMemo.filter((tenant) =>
                                tenant.company.toLowerCase().includes(search)
                                );
                                search === "" ? setTenants(tenantMemo) : setTenants(filteredData);
                            }}/>
                            <span className="absolute inset-y-0 right-0 flex items-center pr-3">
                                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                            </span>
                        </div>
                    </div>
                </div>
                <div className="rounded-md m-5 shadow-xl overflow-auto">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400" ref={tableRef}>
                        <thead className="text-xs text-white uppercase bg-blue-500">
                            <tr>
                                <th scope="col" className="px-6 py-3">No</th>
                                <th scope="col" className="px-6 py-3">Company</th>
                                <th scope="col" className="px-6 py-3">Address</th>
                                <th scope="col" className="px-6 py-3">Email</th>
                                <th scope="col" className="px-6 py-3">Contact</th>
                                <th scope="col" className="px-6 py-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                tenants.map((tenant, index) => {
                                    return (
                                        <tr key={index} className="odd:bg-white  even:bg-gray-200 hover:bg-blue-200 hover:cursor-pointer">
                                            <td  scope="row" className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap">{index + 1}</td>
                                            <td scope="row" className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap">{tenant.company}</td>
                                            <td scope="row" className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap">{tenant.address}</td>
                                            <td scope="row" className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap">
                                             <a href={`mailto:${tenant.email}`} className="text-blue-500">{tenant.email}</a></td>
                                            <td scope="row" className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap">
                                               <a className="text-blue-500" href={`tel:${tenant.contact}`}>{tenant.contact}</a> </td>
                                            <td scope="row" className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap flex gap-3">
                                                <button className="text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-green-500 py-2 px-4 rounded-md" onClick={() => handleDetail(tenant._id)}>
                                                    <IconContext.Provider value={{ className: "text-xl" }}>
                                                        <FaEye />
                                                    </IconContext.Provider>
                                                </button>
                                                <button className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-blue-500 py-2 px-4 rounded-md" onClick={() => showModal("Edit", tenant._id)}>
                                                    <IconContext.Provider value={{ className: "text-xl" }}>
                                                        <FaPen />
                                                    </IconContext.Provider>
                                                </button>
                                                <button className="text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-red-500 py-2 px-4 rounded-md" onClick={() => handleDelete(tenant._id)}>
                                                    <IconContext.Provider value={{ className: "text-xl" }}>
                                                        <FaTrash />
                                                    </IconContext.Provider>
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                })
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
                    {`${modeModal} Tenant`}
                </h3>
                <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center " data-modal-toggle="crud-modal" onClick={closeModal}>
                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                    </svg>
                </button>
            </div>
            {/* <!-- Modal body --> */}
            <div className="p-4 md:p-5">
                <div className="grid gap-4 mb-4 grid-cols-2">
                    <div className="col-span-2">
                        <label for="name" className="block mb-2 text-sm font-medium text-gray-900 ">Company Name</label>
                        <input type="text" name="name" id="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 " placeholder="Type company name here"
                        required/>
                    </div>
                    <div className="col-span-2">
                        <label for="address" className="block mb-2 text-sm font-medium text-gray-900 ">Company Address</label>
                        <input type="text" name="address" id="address" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 " placeholder="Type company adress here" required/>
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                        <label for="email" className="block mb-2 text-sm font-medium text-gray-900 ">Email</label>
                        <input type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 " placeholder="example@gmail.com" required/>
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                        <label for="contact" className="block mb-2 text-sm font-medium text-gray-900 ">Contact</label>
                        <input type="number" name="contact" id="contact" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 " placeholder="+62427836778" required/>
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                        <label for="language" className="block mb-2 text-sm font-medium text-gray-900">Language</label>
                        <select id="language" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5  ">
                            <option value="en">English</option>
                            <option value="usa">Usa</option>
                            <option value="jp">Japan</option>
                            <option value="id">Indonesia</option>
                        </select>
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                        <label for="culture" className="block mb-2 text-sm font-medium text-gray-900">Culture</label>
                        <select id="culture" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5  ">
                            <option value="en_EN">English</option>
                            <option value="en_US">Usa</option>
                            <option value="jp_JP">Japan</option>
                            <option value="id_ID">Indonesia</option>
                        </select>
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                        <label for="input_timezone" className="block mb-2 text-sm font-medium text-gray-900">Time Zone</label>
                        <select id="input_timezone" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5  ">
                            <option value="asia/jakarta">asia/jakarta</option>
                        </select>
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                        <label for="currency" className="block mb-2 text-sm font-medium text-gray-900">Currency</label>
                        <select id="currency" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5  ">
                            <option value="USD">USD</option>
                            <option value="YEN">YEN</option>
                            <option value="EUR">EUR</option>
                            <option value="IDR">IDR</option>
                        </select>
                    </div>
                    
                </div>
                    <div className="col-span-2 sm:col-span-1">
                        <label for="currentposition" className="block mb-2 text-sm font-medium text-gray-900">Current Position</label>
                        <div className="flex items-center gap-20 justify-between">
                            <select id="currentposition" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5  ">
                                <option value="true">True</option>
                                <option value="false">False</option>
                            </select>
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={createTenant}>Submit</button>
                        </div>
                    </div>  
            </div>
        </div>
    </div>
</div> 

        </>
    )
}