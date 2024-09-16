import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { AiOutlineFilePdf } from 'react-icons/ai';
import { RiFileExcel2Line } from 'react-icons/ri';
import LoadingCircle from '../Loading/LoadingCircle';
import Swal from "sweetalert2";
import { useDownloadExcel } from "react-export-table-to-excel";
import jsPDF from "jspdf";
import 'jspdf-autotable';
import { BiEdit } from 'react-icons/bi';
import { MdDeleteForever } from 'react-icons/md';
import AccountDetail from '../Detail/AccountDetail';
import { useTranslations } from 'next-intl';
import { FaSortUp, FaSortDown } from 'react-icons/fa';
import { useFormik } from 'formik';

const AccountTable = () => {
    const [tableData, setTableData] = useState([]);
    const [selectedPlatform, setSelectedPlatform] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [isWideScreen, setIsWideScreen] = useState(true); // Set default to true
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [sortOrder, setSortOrder] = useState('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const [dataPerPage, setDataPerPage] = useState(10);
    const [isLoading, setIsLoading] = useState(true);
    const tableRef = useRef(null);
    const t = useTranslations('accounts');
    const tfile = useTranslations('swal-file');
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
        setIsLoading(true);
        try {
            const token = localStorage.getItem('jwtToken');
            const response = await axios.get(`${umaxUrl}/account-by-tenant`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            setTableData(response.data.Data);
        } catch (error) {
            console.error("Error fetching data:", error.message);
        } finally {
            setIsLoading(false);  // Pastikan loading state diubah ke false baik berhasil maupun gagal
        }
    };
    
    useEffect(() => {
        fetchData();
    }, []); // Dependency array kosong memastikan fetchData hanya dipanggil sekali saat komponen pertama kali dimount
    

    const { onDownload } = useDownloadExcel({
        currentTableRef: tableRef.current,
        filename: `${t('title')} ${dateWithTime}`,
        sheet: "DataAccounts",
    });

    const generatePDF = () => {
        const doc = new jsPDF();
        doc.text('Account Data', 14, 15);
    
        const filteredData = tableData.map((row, index) => ({
            No: index + 1,
            Name: row.username,
            Client: row.client_name,
            Platform: row.platform === 1 ? 'Meta Ads' : row.platform === 2 ? 'Google Ads' : row.platform === 3 ? 'Tiktok Ads' : '',
            Email: row.email,
            Status: row.status === 1 ? 'Active' : row.status === 2 ? 'Deactive' : '',
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

    function ConfirmationModal(name) {
        if (name === 'pdf') {
            Swal.fire({
                title: `${tfile('warn')}`,
                text: `${tfile('msg')}`,
                icon: 'info',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: `${tfile('yes')}`,
                cancelButtonText: `${tfile('no')}`,
            }).then((result) => {
                if (result.isConfirmed) {
                    generatePDF();
                    Swal.fire({
                        title: `${tfile('success')}`,
                        text: `${tfile('suc-msg')}`,
                        icon: 'success',
                        confirmButtonColor: '#3085d6',
                    });
                }
            }).catch((error) => {
                Swal.fire({
                    icon: 'error',
                    title: `${tfile('error')}`,
                    text: `${tfile('err-msg')}`,
                    confirmButtonColor: '#3085d6',
                });
            });
        } else if (name === 'excel') {
            Swal.fire({
                title: `${tfile('warn')}`,
                text: `${tfile('msg')}`,
                icon: 'info',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: `${tfile('yes')}`,
                cancelButtonText: `${tfile('no')}`,
            }).then((result) => {
                if (result.isConfirmed) {
                    onDownload();
                    Swal.fire(
                        `${tfile('success')}`,
                        `${tfile('suc-msg')}`,
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

    const handleDelete = async (_id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
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
                        `${umaxUrl}/account-delete?account_id=${_id}`,
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
                            text: 'Terjadi kesalahan saat menghapus data',
                            icon: 'error',
                            customClass: {
                                confirmButton: 'custom-error-button-class',
                            },
                        });
                    }
                } catch (error) {
                    Swal.fire({
                        title: 'Error',
                        text: 'Terjadi kesalahan saat menghapus data',
                        icon: 'error',
                        customClass: {
                            confirmButton: 'custom-error-button-class',
                        },
                    });
                }  
            }
        });
    };
    
    const handlePlatformChange = (event) => {
        setSelectedPlatform(event.target.value);
        setCurrentPage(1);
    };

    const handleStatusChange = (event) => {
        setSelectedStatus(event.target.value);
        setCurrentPage(1);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1);
    };

    const handleSortChange = (event) => {
        setDataPerPage(event.target.value);
        setCurrentPage(1);
    }

    const filteredData = tableData.filter((data) => {
        const client_name = localStorage.getItem("name");
        const role = localStorage.getItem("roles");
        if(role != 'client'){
            return (
                (!selectedPlatform || data.platform === Number(selectedPlatform)) &&
                (!selectedStatus || data.status === Number(selectedStatus)) &&
                (!searchTerm || data.username.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        } else {
            return (
                (!selectedPlatform || data.platform === Number(selectedPlatform)) &&
                (!selectedStatus || data.status === Number(selectedStatus)) &&
                (!searchTerm || data.username.toLowerCase().includes(searchTerm.toLowerCase())) &&
                (data.client_name === client_name)
            );
        }
    });

    const handleSort = () => {
        const sortedData = [...filteredData].sort((a, b) => {
            if (sortOrder === 'asc') {
                return a.username.localeCompare(b.username);
            } else {
                return b.username.localeCompare(a.username);
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
        // This effect will only run on the client side
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

    const handleOpenModal = (account) => {
        setSelectedAccount(account);
        setModalIsOpen(true);
    };

    const handleCloseModal = () => {
        setModalIsOpen(false);
        setSelectedAccount(null);
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
    const currentAccounts = filteredData.slice(indexOfFirstCampaign, indexOfLastCampaign);

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
            <div className='font-semibold text-3xl text-slate-800 mb-10 dark:text-slate-200'>
                <h1>
                    {t("title")}
                </h1>
            </div>
            <div className="bg-white border dark:bg-gray-800 border-gray-300 dark:border-gray-700 rounded-lg w-full h-fit p-3 sm:p-4 md:p-5 xl:p-5">
                <div className={`flex ${isWideScreen ? `${'flex-row'}` : "flex-col-reverse"}`}>
                    <div className={`mb-4 flex flex-row items-start ${isWideScreen ? `gap-4` : "gap-2"}`}>
                        <input
                            className={`border h-10 ${isWideScreen ? 'w-[200px]' : 'w-1/3'} border-gray-300 dark:border-gray-600 rounded-lg px-2 text-[15px] py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-300`}
                            type="search"
                            placeholder={t("search")}
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                        <select 
                            className={`border h-10 ${isWideScreen ? 'w-[200px]' : 'w-1/3'} border-gray-300 dark:border-gray-600 rounded-lg px-2 md:text-[15px] text-[12px] py-2 bg-white dark:bg-gray-700 dark:text-gray-300`} 
                            onChange={handlePlatformChange} defaultValue={""}>
                            <option value="" disabled hidden>Platform</option>
                            <option value="">All Platform</option>
                            <option value="1">Meta Ads</option>
                            <option value="2">Google Ads</option>
                            <option value="3">Tiktok Ads</option>
                        </select>
                        <select 
                            className={`border h-10 ${isWideScreen ? 'w-[200px]' : 'w-1/3'} border-gray-300 dark:border-gray-600 rounded-lg px-2 md:text-[15px] text-[12px] py-2 bg-white dark:bg-gray-700 dark:text-gray-300`} 
                            onChange={handleStatusChange} defaultValue={""}>
                            <option value="" disabled hidden>Status</option>
                            <option value="">All Status</option>
                            <option value="1">{t("active")}
                            </option>
                            <option value="2">{t("deactive")}</option>
                        </select>
                    </div>
                    <div className={`w-full flex ${isWideScreen ? `gap-4` : "gap-2"} justify-end pb-5`}>
                        <select className="float-right border border-gray-300 dark:border-gray-600 rounded-lg px-2 md:text-[15px] text-[12px] text-semibold py-2 bg-white dark:bg-gray-700 dark:text-gray-300"
                            value={dataPerPage}
                            onChange={handleSortChange}
                        >
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="20">20</option>
                        </select>
                        <button className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-300" onClick={() => ConfirmationModal('excel')}>
                            <RiFileExcel2Line className="font-medium text-lg" />
                        </button>
                        <button className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-300" onClick={() => ConfirmationModal('pdf')}>
                            <AiOutlineFilePdf className="font-medium text-lg" />
                        </button>
                    </div>
                </div>
                <div className='overflow-x-auto'>
                    <table className='w-full border-collapse'>
                        <thead className='bg-white dark:bg-blue-700'>
                            <tr className=''>
                                {/* <th className='px-4 py-2 border border-gray-300 dark:border-gray-600 dark:text-slate-200'>No.</th> */}
                                <th className='px-4 py-2 border border-gray-300 dark:border-gray-600 dark:text-slate-200 text-left'>
                                    <span className='flex justify-between items-center'>
                                        {t('name')}
                                        <span className='flex flex-col items-center ml-1' style={{ lineHeight: 1 }}> {/* Adjusted line-height */}
                                            <FaSortUp onClick={handleSort} className={sortOrder === 'asc' ? 'text-blue-500' : 'text-gray-400'} style={{ marginBottom: '-8.3px' }} /> 
                                            <FaSortDown onClick={handleSort} className={sortOrder === 'desc' ? 'text-blue-500' : 'text-gray-400'} style={{ marginTop: '-8.3px' }} /> 
                                        </span>
                                    </span>
                                </th>
                                <th className='px-4 py-2 border border-gray-300 dark:border-gray-600 dark:text-slate-200 text-left'>{t('client')}</th>
                                <th className='px-4 py-2 border border-gray-300 dark:border-gray-600 dark:text-slate-200 text-left'>Platform</th>
                                <th className='px-4 py-2 border border-gray-300 dark:border-gray-600 dark:text-slate-200 text-left'>Email</th>
                                <th className='px-4 py-2 border border-gray-300 dark:border-gray-600 dark:text-slate-200 text-left'>Status</th>
                                <th className='px-4 py-2 border border-gray-300 dark:border-gray-600 dark:text-slate-200 hidden'>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                isLoading ? (
                                    // Jika data sedang loading
                                    <tr>
                                        <td colSpan="6" className="text-center">
                                            <LoadingCircle />
                                        </td>
                                    </tr>
                                ) : (
                                    currentAccounts.length > 0 ? (
                                        // Jika data ditemukan
                                        currentAccounts.map((data, index) => (
                                            <tr key={index} className='border text-center dark:border-gray-700'>
                                                <td className='px-4 py-2 border border-gray-300 dark:border-gray-600 dark:text-slate-200 text-nowrap text-left'>
                                                    <button className="text-gray-500 dark:text-gray-300 underline" title={`${t('details-of')} ${data.username}`} onClick={() => handleOpenModal(data)}>
                                                        {data.username}
                                                    </button>
                                                </td>
                                                <td className='px-4 py-2 border border-gray-300 dark:border-gray-600 dark:text-slate-200 text-nowrap text-left'>{data.client_name}</td>
                                                <td className='px-4 py-2 border border-gray-300 dark:border-gray-600 dark:text-slate-200 text-nowrap text-left'>{data.platform === 1 ? 'Meta Ads' : data.platform === 2 ? 'Google Ads' : 'Tiktok Ads'}</td>
                                                <td className='px-4 py-2 border border-gray-300 dark:border-gray-600 dark:text-slate-200 text-nowrap text-left'>
                                                    <a href={`mailto:${data.email}`} className="text-blue-500 underline dark:text-blue-400">{data.email}</a>
                                                </td>
                                                <td className='px-4 py-2 border border-gray-300 dark:border-gray-600 dark:text-slate-200 text-nowrap text-left'><StatusBadge status={data.status} /></td>
                                                <td className='px-4 py-2 border border-gray-300 dark:border-gray-600 dark:text-slate-200 text-nowrap hidden gap-1 justify-center'>
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
                                            <td colSpan="6" className="text-center py-4 border border-gray-300 dark:border-gray-600 dark:text-gray-200">
                                                {t('not-found')}
                                            </td>
                                        </tr>
                                    )
                                )
                            }
                        </tbody>
                    </table>
                    <table className='hidden'ref={tableRef}>
                        <thead>
                            <tr>
                                <th className='px-4 py-2 border border-gray-300 dark:border-gray-600 dark:text-slate-200'>{t('name')}</th>
                                <th className='px-4 py-2 border border-gray-300 dark:border-gray-600 dark:text-slate-200'>{t('client')}</th>
                                <th className='px-4 py-2 border border-gray-300 dark:border-gray-600 dark:text-slate-200'>Platform</th>
                                <th className='px-4 py-2 border border-gray-300 dark:border-gray-600 dark:text-slate-200'>Email</th>
                                <th className='px-4 py-2 border border-gray-300 dark:border-gray-600 dark:text-slate-200'>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.length > 0 ? (
                                filteredData.map((data, index) => (
                                    <tr key={index} className='border text-center dark:border-gray-700'>
                                        <td>{data.username}</td>
                                        <td>{data.client_name}</td>
                                        <td>{data.platform === 1 ? 'Meta Ads' : data.platform === 2 ? 'Google Ads' : 'Tiktok Ads'}</td>
                                        <td><a href={`mailto:${data.email}`} className="text-blue-500 underline dark:text-blue-400">{data.email}</a></td>
                                        <td><StatusBadge status={data.status} /></td>
                                    </tr>
                                )
                            )
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center py-4 border border-gray-300 dark:border-gray-600 dark:text-gray-200">
                                        {t('not-found')}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className='flex flex-wrap justify-between items-center mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg'>
                    <div className='flex gap-3 items-center'>
                        {/* <p className='text-gray-700 dark:text-slate-300 font-medium'>Jump to</p>
                        <form action="" onSubmit={jumpToPage.handleSubmit} className="flex items-center">
                            <input
                                type="text"
                                className='border border-gray-300 dark:border-gray-600 rounded-lg w-12 h-10 px-2 text-center bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 transition duration-150 ease-in-out'
                                name="page"
                                onChange={jumpToPage.handleChange}
                                value={jumpToPage.values.page}
                            />
                            <button type='submit' hidden></button>
                        </form> */}
                    </div>
                    {renderPagination()}
                </div>
            </div>

            {selectedAccount && (
                <AccountDetail isOpen={modalIsOpen} onClose={handleCloseModal} data={selectedAccount} />
            )}
        </>
    )
}

export default AccountTable;
