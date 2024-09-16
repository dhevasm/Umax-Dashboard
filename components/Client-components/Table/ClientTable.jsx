'use client'

import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import LoadingCircle from '../Loading/LoadingCircle';
import { RiFileExcel2Line } from "react-icons/ri";
import { AiOutlineFilePdf } from "react-icons/ai";
import Swal from "sweetalert2";
import { useDownloadExcel } from "react-export-table-to-excel";
import jsPDF from "jspdf";
import 'jspdf-autotable';
import { MdDeleteForever } from 'react-icons/md';
import CreateClient from '../Create/CreateClient';
import { BiEdit, BiFirstPage, BiLastPage, BiSolidArrowToLeft, BiSolidArrowToRight } from 'react-icons/bi';
import ClientDetail from '../Detail/ClientDetail';
import { useTranslations } from 'next-intl';
import { FaSortDown, FaSortUp } from 'react-icons/fa';
import { useFormik } from 'formik';

const ClientTable = () => {
    const [tableData, setTableData] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState('');    
    const [searchTerm, setSearchTerm] = useState('');
    const [isWideScreen, setIsWideScreen] = useState(true);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [dataPerPage, setDataPerPage] = useState(10);
    const [sortOrder, setSortOrder] = useState('asc');
    const [isLoading, setIsLoading] = useState(true);
    const [mode, setMode] = useState('');
    const t = useTranslations("clients");
    const tfile = useTranslations('swal-file')
    const [selectedClient, setSelectedClient] = useState(null);
    const tableRef = useRef(null);
    const date = new Date();
    const dateWithTime = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
        .toISOString()
        .split("T")[0] +
        " " +
        (date.getHours().toString().padStart(2, "0")) +
        ":" +
        (date.getMinutes().toString().padStart(2, "0")) +
        ":" +
        (date.getSeconds().toString().padStart(2, "0"));
    const umaxUrl = process.env.NEXT_PUBLIC_API_URL;

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const token = localStorage.getItem('jwtToken');
            const response = await axios.get(`${umaxUrl}/client-by-tenant`, {
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Bearer ${token}`,
                },
            });
            setTableData(response.data.Data);
        } catch (error) {
            console.error("Error fetching data:", error.message);
        } finally {
            setIsLoading(false);
        }
    }

    const { onDownload } = useDownloadExcel({
        currentTableRef: tableRef.current,
        filename: `${t('title')} ${dateWithTime}`,
        sheet: "DataClients",
    });

    const generatePDF = () => {
        const doc = new jsPDF();
        doc.text('Client Data', 14, 15);
    
        // FUNGSI FILTER SELECT
        const filteredData = tableData.map((row, index) => ({
          No: index + 1,  
          Name: row.name,
          Address: row.address,
          Contact: row.contact,
          Status: row.status == 1 ? 'Active' : row.status == 2 ? 'Deactive' : '',
        }));
    
        const tableColumnNames = Object.keys(filteredData[0]);
        const tableColumnValues = filteredData.map((row) => Object.values(row));
    
        doc.autoTable({
          head: [tableColumnNames],
          body: tableColumnValues,
          startY: 20,
        });
    
        doc.save(`${t('title')} ${dateWithTime}.pdf`);
    };

    const handleDelete = async (_id) => {
        Swal.fire({
          title: 'Are you sure?',
          text: 'You won\'t be able to revert this!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, delete it!',
          cancelButtonText: 'Cancel',
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          customClass: {
            confirmButton: 'custom-confirm-button-class',
            cancelButton: 'custom-cancel-button-class',
          },
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              const token = localStorage.getItem('jwtToken');
              const response = await axios.delete(
                `${umaxUrl}/client-delete?client_id=${_id}`,
                {
                  headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                  },
                }
              );
    
              if (response.status === 200) {
                fetchData();
                Swal.fire({
                  title: 'Success!',
                  text: 'Data has been deleted.',
                  icon: 'success',
                  confirmButtonColor: '#3085d6',
                  customClass: {
                    confirmButton: 'custom-ok-button-class',
                  },
                });
              } else {
                Swal.fire({
                  title: 'Error',
                  text: 'Maaf Anda Tidak Dapat Menghapus Data.',
                  icon: 'error',
                  customClass: {
                    confirmButton: 'custom-error-button-class',
                  },
                });
              }
            } catch (error) {
              Swal.fire({
                title: 'Error',
                text: 'Maaf Anda Tidak Dapat Menghapus Data.',
                icon: 'error',
                customClass: {
                  confirmButton: 'custom-error-button-class',
                },
              });
            }
          }
        });
    };

    function ConfirmationModal(name) {
        if (name === 'pdf') {
            Swal.fire({
                title: tfile('warn'),
                text: tfile('msg'),
                icon: 'info',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: tfile('yes'),
                cancelButtonText: tfile('no')
            }).then((result) => {
                if (result.isConfirmed) {
                    generatePDF();
                    Swal.fire({
                        title: tfile('success'),
                        text: tfile('suc-msg'),
                        icon: 'success',
                        confirmButtonColor: '#3085d6',
                    });
                }
            }).catch((error) => {
                console.error('Error:', error);
                Swal.fire({
                    title: tfile('error'),
                    text: tfile('err-msg'),
                    icon: 'error',
                    confirmButtonText: '#3085d6'
                })
            });
        } else if (name === 'excel') {
            Swal.fire({
                title: tfile('warn'),
                text: tfile('msg'),
                icon: 'info',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: tfile('yes'),
                cancelButtonText: tfile('no')
            }).then((result) => {
                if (result.isConfirmed) {
                    onDownload();
                    Swal.fire(
                        tfile('success'),
                        tfile('suc-msg'),
                        'success'
                    );
                }
            }).catch((error) => {
                console.error('Error:', error);
                Swal.fire({
                    title: tfile('error'),
                    text: tfile('err-msg'),
                    icon: 'error',
                    confirmButtonText: '#3085d6'
                })
            });
        }
    }

    const handleStatusChange = (event) => {
        setSelectedStatus(event.target.value);
        setCurrentPage(1);
    }

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1);
    }

    const handleSortChange = (event) => {
        setDataPerPage(event.target.value);
        setCurrentPage(1);
    }

    useEffect(() => {
        fetchData();
    }, []);

    const filteredData = tableData.filter((data) => {
        return (
            (!selectedStatus || data.status === Number(selectedStatus)) &&
            (!searchTerm || data.name.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    });

    const handleSort = () => {
        const sortedData = [...filteredData].sort((a, b) => {
            if (sortOrder === 'asc') {
                return a.name.localeCompare(b.name);
            } else {
                return b.name.localeCompare(a.name);
            }
        });
    
        setTableData(sortedData);
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        setCurrentPage(1); // Reset to the first page after sorting
    };

    const checkDeviceWidth = () => {
        setIsWideScreen(window.innerWidth >= 947);
    };

    useEffect(() => {
        checkDeviceWidth();
        window.addEventListener("resize", checkDeviceWidth);
        return () => window.removeEventListener("resize", checkDeviceWidth);
    }, []);

    function StatusBadge({ status }) {
        let statusStyle = {}; // Objek gaya status

        switch (status) {
        case 1:
            statusStyle = {
            backgroundColor: "#DFFFDF",
            color: '#00A600',
            border: '0.3px solid #00CA00',
            padding: '5px 22px',
            fontSize: "12px",
            borderRadius: '6px',
            fontWeight: '500', 
            };
            return (
            <span style={statusStyle}>{t("active")}</span>
            );
        
        case 2:
            statusStyle = {
            backgroundColor: "#FFF2E8",
            color: '#D4380D', 
            border: '0.3px solid #FF0000',
            padding: '5px 15px',
            fontSize: "12px",
            borderRadius: '6px',
            fontWeight: '500', 
            };
            return (
            <span style={statusStyle}>{t('deactive')}</span>
            );
        default:
            return "Unknown";
        }
    }

    const handleOpenModal = (client, mode) => {
        setSelectedClient(client);
        setMode(mode);
        setModalIsOpen(true);
    };

    const handleCloseModal = () => {
        setModalIsOpen(false);
        setSelectedClient(null);
    };

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
                className={`px-3 py-1 dark:text-white ${
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
                className={`px-3 py-1 dark:text-white ${
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
            <span key="info" className="px-3 py-1 dark:text-white rounded-md text-nowrap">
                {`${t("page")} ${currentPage} / ${totalPages}`}
            </span>
        );
    
        // Next page button
        pageButtons.push(
            <button
                key="next"
                className={`px-3 py-1 dark:text-white ${
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
                className={`px-3 py-1 dark:text-white ${
                    currentPage === totalPages ? "cursor-not-allowed" : ""
                } rounded-md`}
                onClick={() => goToPage(totalPages)}
                disabled={currentPage === totalPages}
            >
                {'>>'}
            </button>
        );
    
        return (
            <div className="flex justify-center sm:justify-center md:justify-end xl:justify-end gap-2 mt-4">
                {pageButtons}
            </div>
        );
    };
    
    
    const indexOfLastCampaign = currentPage * dataPerPage;
    const indexOfFirstCampaign = indexOfLastCampaign - dataPerPage;
    const currentClients = filteredData.slice(indexOfFirstCampaign, indexOfLastCampaign);

    const jumpToPage = useFormik({
        initialValues: {
            page: '',
        },
        onSubmit: (values) => {
            const page = parseInt(values.page);
            if(isNaN(page)) {
                Swal.fire('warning', 'Page must be a number', 'warning');
                jumpToPage.resetForm();          
            } else {
                if (page > totalPages || page < 1) {
                    Swal.fire('warning', 'Page not found', 'warning');
                    jumpToPage.resetForm();
                } else {
                    setCurrentPage(page);
                    jumpToPage.resetForm();          
                }
            }
        },
    });

    return (
        <>
            <div className='font-semibold flex justify-between text-3xl text-slate-800 mb-10 dark:text-slate-200'>
            <h1>{t('title')}</h1>
            
            </div>
            <div className="bg-white border border-gray-300 rounded-lg w-full h-fit p-3 sm:p-4 md:p-5 xl:p-5 dark:bg-gray-800 dark:border-gray-700">
                <div className={`flex ${isWideScreen ? "flex-row" : "flex-col-reverse"}`}>
                    <div className={`mb-4 flex flex-row items-start gap-4`}>
                        <input
                            className={`border h-10 ${isWideScreen ? 'w-[200px]' : 'w-1/2'} border-gray-300 dark:border-gray-600 rounded-lg px-2 text-[15px] py-2 bg-white dark:bg-gray-700 dark:text-gray-300`}
                            type="search"
                            placeholder={t('search')}
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                        <select 
                            className={`border h-10 ${isWideScreen ? 'w-[200px]' : 'w-1/2'} border-gray-300 dark:border-gray-600 rounded-lg px-2 md:text-[15px] text-[12px] py-2 bg-white dark:bg-gray-700 dark:text-gray-300`} 
                            value={selectedStatus} 
                            onChange={handleStatusChange}
                        >
                            <option value="" disabled hidden>Status</option>
                            <option value="">All Status</option>
                            <option value="1">{t('active')}</option>
                            <option value="2">{t('deactive')}</option>
                        </select>
                    </div>
                    
                    <div className={`w-full flex ${isWideScreen ? "gap-4" : "gap-2"} justify-end pb-5`}>
                    <button onClick={() => handleOpenModal(null, "create")} className='text-sm dark:text-gray-300 dark:bg-gray-700 font-normal border border-gray-300 dark:border-gray-600 rounded-md flex justify-center items-center py-2 px-4'>
                        {t('add-client')}
                    </button>
                        <select className="float-right border border-gray-300 dark:border-gray-600 rounded-lg px-2 md:text-[15px] text-[12px] text-semibold py-2 bg-white dark:bg-gray-700 dark:text-gray-300"
                            value={dataPerPage}
                            onChange={handleSortChange}
                        >
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="20">20</option>
                        </select>
                        <button className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-300" onClick={() => ConfirmationModal('excel')}>
                            <RiFileExcel2Line className="relative font-medium text-lg" />
                        </button>
                        <button className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-300" onClick={() => ConfirmationModal('pdf')}>
                            <AiOutlineFilePdf className="relative font-medium text-lg" />
                        </button>
                    </div>
                </div>
                <div className='overflow-x-auto'>
                    <table className='w-full'>
                        <thead className='bg-white dark:bg-blue-700'>
                            <tr className='text-left'>
                                {/* <th className='px-4 py-2 border dark:border-gray-600 dark:text-slate-200'>No.</th> */}
                                <th className='px-4 py-2 border dark:border-gray-600 dark:text-slate-200 text-left'>
                                    <span className='flex justify-between items-center'>
                                        {t('name')}
                                        <button className='flex flex-col items-center ml-1' style={{ lineHeight: 1 }}> {/* Adjusted line-height */}
                                            <FaSortUp onClick={handleSort} className={sortOrder === 'asc' ? 'text-blue-500' : 'text-gray-400'} style={{ marginBottom: '-8.3px' }} /> 
                                            <FaSortDown onClick={handleSort} className={sortOrder === 'desc' ? 'text-blue-500' : 'text-gray-400'} style={{ marginTop: '-8.3px' }} /> 
                                        </button>
                                    </span>
                                </th>
                                <th className='px-4 py-2 border dark:border-gray-600 dark:text-slate-200 text-left'>{t('address')}</th>
                                <th className='px-4 py-2 border dark:border-gray-600 dark:text-slate-200 text-left'>{t('contact')}</th>
                                <th className='px-4 py-2 border dark:border-gray-600 dark:text-slate-200 text-left'>{t('email')}</th>
                                <th className='px-4 py-2 border dark:border-gray-600 dark:text-slate-200 text-left'>Status</th>
                                <th className='px-4 py-2 border dark:border-gray-600 dark:text-slate-200 hidden'>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                isLoading ? (
                                    // Jika data sedang loading
                                    <tr>
                                        <td colSpan="6" className="text-center dark:border-gray-700">
                                            <LoadingCircle />
                                        </td>
                                    </tr>
                                ) : currentClients.length > 0 ? (
                                    // Jika data ditemukan
                                    currentClients.map((data, index) => (
                                        <tr key={index} className='text-center'>
                                            <td className='px-4 py-2 border dark:border-gray-600 dark:text-slate-200 text-nowrap text-left'>
                                                <button className="text-gray-500 dark:text-gray-300 underline" title={`${t('details-of')} ${data.name}`} onClick={() => handleOpenModal(data, "edit")}>
                                                    {data.name}
                                                </button>
                                            </td>
                                            <td className='px-4 py-2 border dark:border-gray-600 dark:text-slate-200 text-nowrap text-left'>{data.address}</td>
                                            <td className='px-4 py-2 border dark:border-gray-600 dark:text-slate-200 text-blue-500 underline text-nowrap text-left'>
                                                <a href={`https://wa.me/${data.contact.replace(/\D+/g, '')}`} title={`Message ${data.name} on WhatsApp`} target='_blank' rel='noopener noreferrer'>{data.contact}</a>
                                            </td>
                                            <td className='px-4 py-2 border dark:border-gray-600 dark:text-slate-200 text-blue-500 underline text-nowrap text-left'>
                                                <a href={`mailto:${data.email}`} title={`Email ${data.name}`}>{data.email}</a>
                                            </td>
                                            <td className='px-4 py-2 border dark:border-gray-600 dark:text-slate-200 text-nowrap text-left'><StatusBadge status={data.status} /></td>
                                            <td className='px-4 py-2 border dark:border-gray-600 dark:text-slate-200 text-nowrap text-left hidden justify-center gap-1'>
                                                <button className='bg-orange-500 text-white px-2 py-2 rounded-md me-1'>
                                                    <BiEdit size={25}/>
                                                </button>
                                                <button className='bg-red-600 text-white px-2 py-2 rounded-md' onClick={() => handleDelete(data._id)}>
                                                    <MdDeleteForever size={25}/>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    // Jika tidak ada data yang ditemukan setelah loading selesai
                                    <tr>
                                        <td colSpan="6" className="text-center py-4 border dark:border-gray-700 dark:text-gray-200">
                                            {t('not-found')}
                                        </td>
                                    </tr>
                                )
                            }
                        </tbody>
                    </table>

                    {/* Table for export */}
                    <table className='w-full border hidden dark:border-gray-600' ref={tableRef}>
                        <thead className='bg-white dark:bg-gray-800'>
                            <tr className='text-left'>
                                <th className='px-4 py-2 border dark:border-gray-600'>No.</th>
                                <th className='px-4 py-2 border dark:border-gray-600'>Name</th>
                                <th className='px-4 py-2 border dark:border-gray-600'>{t('address')}</th>
                                <th className='px-4 py-2 border dark:border-gray-600'>{t('contact')}</th>
                                <th className='px-4 py-2 border dark:border-gray-600'>{t('email')}</th>
                                <th className='px-4 py-2 border dark:border-gray-600'>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map((data, index) => (
                                <tr key={index} className='text-center dark:bg-gray-900'>
                                    <td className='px-4 py-2 border dark:border-gray-600'>{index + 1}.</td>
                                    <td className='px-4 py-2 border dark:border-gray-600'>{data.name}</td>
                                    <td className='px-4 py-2 border dark:border-gray-600'>{data.address}</td>
                                    <td className='px-4 py-2 border dark:border-gray-600 text-blue-500 underline text-nowrap'>
                                        <a href={`tel:${data.contact}`}>{data.contact}</a>
                                    </td>
                                    <td className='px-4 py-2 border dark:border-gray-600 text-blue-500 underline text-nowrap'>
                                        <a href={`mailto:${data.email}`}>{data.email}</a>
                                    </td>
                                    <td className='px-4 py-2 border dark:border-gray-600'>{StatusBadge({ status: data.status })}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className='flex flex-wrap justify-between items-center mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg'>
                    <div className='flex gap-3 items-center mb-2 md:mb-0'>
                        {/* <p className='text-gray-700 dark:text-slate-300 font-medium'>Jump to</p>
                        <form action="" onSubmit={jumpToPage.handleSubmit} className="flex items-center">
                            <input
                                type="text"
                                className='border border-gray-300 dark:border-gray-600 rounded-lg w-16 h-10 px-2 text-center bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 transition duration-150 ease-in-out'
                                name="page"
                                onChange={jumpToPage.handleChange}
                                value={jumpToPage.values.page}
                            />
                            <button type='submit' hidden></button>
                        </form> */}
                    </div>
                    <div className='w-full md:w-auto flex justify-end'>
                        {renderPagination()}
                    </div>
                </div>
            </div>


            {mode === "create" ? (
                <CreateClient 
                    isOpen={modalIsOpen} 
                    onClose={handleCloseModal} 
                    mode={mode} 
                    refresh={fetchData}
                /> 
            ) : mode == 'edit' ? (
                    <ClientDetail 
                        isOpen={modalIsOpen} 
                        onClose={handleCloseModal} 
                        data={selectedClient} 
                        mode={mode} 
                        deleteClient={handleDelete}
                        refresh={fetchData}
                    />
                ) : (null)
            }
        </>
    )
}

export default ClientTable