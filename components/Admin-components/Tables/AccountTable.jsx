'use client'

import axios from "axios"
import { useState,useEffect, useRef, useContext, useCallback } from "react"
import { AdminDashboardContext } from "@/app/[locale]/admin-dashboard/page"
import Swal from "sweetalert2"
import { useDownloadExcel } from "react-export-table-to-excel"
import jsPDF from "jspdf"
import 'jspdf-autotable'
import { IconContext } from "react-icons"
import { AiOutlineFilePdf } from "react-icons/ai"
import { FaFileExcel, FaTable, FaTrash } from "react-icons/fa"
import { FaPlus } from "react-icons/fa"
import { FaTimes } from "react-icons/fa"
import { IoMdEye } from "react-icons/io"
import { IoMdEyeOff } from "react-icons/io"
import { RiFileExcel2Fill, RiFileExcel2Line, RiIdCardLine, RiRefreshFill, RiRefreshLine } from "react-icons/ri"
import { BiPlus } from "react-icons/bi"
import { useTranslations } from "next-intl"
import toastr from "toastr"
import { useRouter } from "next/navigation"
import { useGoogleLogin } from '@react-oauth/google';
import { FaGoogle, FaFacebookF, FaTiktok } from 'react-icons/fa';

export default function AccountTable() {

    const [account, setaccount] = useState([])
    const [accountMemo, setaccountMemo] = useState([])
    const [EditaccountId, setEditaccountId] = useState(null)
    const [showPassword, setShowPassword] = useState(false)
    const [selectedPlatform, setSelectedPlatform] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [dataPerPage, setDataPerPage] = useState(10);
    const [isLoading, setIsLoading] = useState(true);
    const [selectLoading, setSelectLoading] = useState(true)
    const [selectedTenant, setSelectedTenant] = useState("")
    const passwordInput = useRef(null)
    const t = useTranslations('admin-accounts')
    const tfile = useTranslations('swal-file')
    const tdel = useTranslations('swal-delete')
    const [crudLoading, setCrudLoading] = useState(false)
    const [showModalOauth, setShowModalOauth] = useState(false);
    const Router = useRouter()

    function LoadingCrud() {
        return (
          <div className="flex justify-center items-center h-6">
            <div className="relative">
              <div className="w-6 h-6 border-4 border-white rounded-full border-t-transparent dark:border-t-transparent animate-spin"></div>
            </div>
          </div>
        );
    };

    function handleShowPassword() {
        setShowPassword(!showPassword)
    }   

    const {sidebarHide, setSidebarHide, updateCard, setUpdateCard, changeTable, setChangeTable,  userData, dataDashboard} = useContext(AdminDashboardContext)

    const addModal = useRef(null)
    const [modeModal, setModeModal] = useState("add")

    // validasi form
    const [values, setValues] = useState({
        name: '', 
        email: '', 
        password: '', 
        passwordverify: '', 
        client: '', 
        platform: ''
    });

    const [error, setError] = useState({
        name: '',
        email: '',
        password: '',
        passwordverify: '',
        client: '',
        platform: '',
    });

    const [touched, setTouched] = useState({
        name: false,
        email: false,
        password: false,
        passwordverify: false,
        client: false,
        platform: false,
    });

    const [isvalid, setIsvalid] = useState(false);

    // Form Validation
    const validateForm = useCallback(() => {
        let errors = {};
        
        if (touched.name && values.name === '') {
            errors.name = t('name-error');
        }
        
        if (touched.email && !values.email.includes("@")) {
            errors.email = t('email-error2');
        }
        
        if (touched.email && values.email === '') {
            errors.email = t('email-error');
        }
        
        
        if (touched.password && values.password === '') {
            errors.password = t('password-error');
        }
        
        if (touched.client && values.client === '') {
            errors.client = t('client-error');
        }
        
        if (touched.platform && values.platform === '') {
            errors.platform = t('platform-error');
        }
        
        setError(errors);
        setIsvalid(Object.keys(errors).length === 0);
    }, [values, touched, t]);

    useEffect(() => {
        validateForm();
    }, [values, touched, validateForm]);

    // Handle input change and touch
    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    const handleBlur = (e) => {
        setTouched({ ...touched, [e.target.name]: true });
        validateForm();
    };

    const [clientFilter, setClientFilter] = useState([])

    const handleGetClientList = (tenant_id) => {
        setClientFilter(client.filter((acc) => acc.tenant_id === tenant_id))
    }

    function showModal(mode, account_id = null ){
        document.body.style.overflow = 'hidden'
        setModeModal(mode)
        if(mode == "Edit"){
            const filteredaccount = account.filter(account => account._id === account_id);
            if(filteredaccount.length > 0){
                // console.log(filteredCampaing[0])
                setEditaccountId(account_id)
                setValues({name: filteredaccount[0].username, email: filteredaccount[0].email, client: filteredaccount[0].client_id, platform: filteredaccount[0].platform})
                setError({name: '', email: '', client:'', platform: ''})
                document.getElementById('name').value = filteredaccount[0].username
                document.getElementById('client').value = filteredaccount[0].client_id
                document.getElementById('platform').value = filteredaccount[0].platform
                document.getElementById('email').value = filteredaccount[0].email
                document.getElementById('status').checked = filteredaccount[0].status == 1 ? true : false
                // passwordInput.current.classList.add("hidden")
                // passwordverifyInput.current.classList.add("hidden")
                if(userData.roles == "sadmin"){
                    document.getElementById('tenant').value = filteredaccount[0].tenant_id
                    document.getElementById('tenant').disabled = true
                }
                handleGetClientList(filteredaccount[0].tenant_id)
                if(filteredaccount[0].notes == "empty"){
                    document.getElementById("notes").value = ""
                }else{
                    document.getElementById('notes').value = filteredaccount[0].notes 
                }
            } else{
                Swal.fire("Campaing not found");
            }
        }else if(mode == "Create") {
            setValues({client: ""})
            setError({client: ''})
            // document.getElementById('name').value = null
            // document.getElementById('email').value = null
            document.getElementById("client").value = ""
            // document.getElementById("platform").value = ""
            // passwordInput.current.classList.remove("hidden")
            // passwordverifyInput.current.classList.remove("hidden")
            document.getElementById('notes').value = ""
            if(userData.roles == "sadmin"){
                document.getElementById('tenant').value = ""
                document.getElementById('tenant').disabled = false
            }
        }
        addModal.current.classList.remove("hidden")
    }
    function closeModal() {
        document.body.style.overflow = 'auto'
        // Reset input values, errors, and touched states
        setValues({
            name: '', 
            email: '', 
            password: '', 
            passwordverify: '', 
            client: '', 
            platform: ''
        });
        setError({
            name: '',
            email: '',
            password: '',
            passwordverify: '',
            client: '',
            platform: '',
        });
        setTouched({
            name: false,
            email: false,
            password: false,
            passwordverify: false,
            client: false,
            platform: false,
        });
        // Close the modal
        addModal.current.classList.add("hidden");
    }
    
    
    function handleDelete(account_id){
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
            deleteaccount(account_id)
            }
        });
    }

    const deleteaccount = async (account_id) => {
        closeModal()
        try {
            setCrudLoading(true)
            const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/account-delete?account_id=${account_id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
                }
            })
            getaccount()
            setUpdateCard(true)
            toastr.success(tdel('suc-msg'), tdel('success'))
            setCrudLoading(false)
            
        } catch (error) {
            setCrudLoading(false)
            toastr.error('Delete user failed', 'Error')
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
            cancelButtonText: `${tfile('no')}`
        }).then((result) => {
            if (result.isConfirmed) {
                onDownload();
            toastr.success(tfile('suc-msg'), tfile('success'))
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
            title: `${tfile('warn')}`,
            text: `${tfile('msg1')}`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: `${tfile('yes')}`,
            cancelButtonText: `${tfile('no')}`
          }).then((result) => {
            if (result.isConfirmed) {
                const doc = new jsPDF();
                doc.text('Data Account Umax Dashboard', 10, 10);
                doc.autoTable({
                    head: [['Name', 'Client', 'Platorm', "Email", "Status", "Notes", "Company"]],
                    body: account.map((account) => [account.username, account.client_name, account.platform, account.email, account.status, account.notes, account.company_name]),
                });
                doc.save('DataAccount.pdf');
            //   Swal.fire({
            //     title: `${tfile('success')}`,
            //     text: `${tfile('suc-msg')}`,
            //     icon: "success"
            //   });
            toastr.success(tfile('suc-msg'), tfile('success'))
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
        setIsLoading(true)
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/account-by-tenant`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
            }
        })
        setaccount(response.data.Data)
        setaccountMemo(response.data.Data)
        setIsLoading(false)
    }

    useEffect(() => {
        getaccount()
    }, [])

    useEffect(() => {

    }, [account])

    async function createAccount(){
        if(isvalid){
            const name = document.getElementById('name').value
            const client = document.getElementById('client').value
            const email = document.getElementById('email').value
            const password = document.getElementById('password').value
            const platform = document.getElementById('platform').value
            const status = document.getElementById('status').checked ? 1 : 2
            let notes = document.getElementById('notes').value
            if(notes == ""){
                notes = "empty"
            }

            const formData = new FormData();
            formData.append('username', name);
            formData.append('client_id', client);
            formData.append('email', email);
            formData.append('platform', platform);
            formData.append('password', password);
            formData.append('confirm_password', password);
            formData.append('status', status);
            formData.append('notes', notes);
    
            let url = ""
    
            if(userData.roles == "sadmin"){
                const tenant_id = document.getElementById('tenant').value
                url = `${process.env.NEXT_PUBLIC_API_URL}/account-create?tenantId=${tenant_id}`
            }else if(userData.roles == "admin"){
                url = `${process.env.NEXT_PUBLIC_API_URL}/account-create`
            }
            
            setCrudLoading(true)
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
                document.getElementById('notes').value = null
                // Swal.fire("Success", "Account created successfully", "success")
                toastr.success("Account created successfully", "Success")
                setCrudLoading(false)
            }else{
                // Swal.fire("Error", response.detail, "error")
                setCrudLoading(false)
                toastr.error(response.detail, "Error")
            }
        }else{
            // Swal.fire({
            //     title: "Failed!",
            //     text: "Please Fill The Blank!",
            //     icon: "error"
            //   });
            toastr.warning("Please Fill The Blank!", "Failed")
        }
    }

    async function updateAccount(){
        if(EditaccountId !== null) {
            if(isvalid){
                const name = document.getElementById('name').value
                const client = document.getElementById('client').value
                const email = document.getElementById('email').value
                const platform = document.getElementById('platform').value
                // const password = document.getElementById('password').value
                // const passwordverify = document.getElementById('passwordverify').value
                const status = document.getElementById('status').checked ? 1 : 2
                let notes = document.getElementById('notes').value
                if(notes == ""){
                    notes = "empty"
                }

                const formData = new FormData();
                formData.append('username', name);
                formData.append('client_id', client);
                formData.append('email', email);
                formData.append('platform', platform);
                // formData.append('password', password);
                // formData.append('confirm_password', passwordverify);
                formData.append('status', status);
                formData.append('notes', notes);
            
                setCrudLoading(true)
                    const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/account-edit?account_id=${EditaccountId}`, formData, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
                        }
                    })
            
                    if(response.data.Output == "Data Updated Successfully"){
                        getaccount()
                        closeModal()
                        document.getElementById('name').value = null
                        document.getElementById('email').value = null
                        // document.getElementById('password').value = null
                        // document.getElementById('passwordverify').value = null
                        document.getElementById('notes').value = null
                        // Swal.fire("Success", "Campaing Updated", "success")
                        setCrudLoading(false)
                        toastr.success("Account Updated", "Success")
                    }else{
                        // Swal.fire("Error", response.detail.ErrMsg, "error")
                        setCrudLoading(false)
                        toastr.error(response.detail.ErrMsg, "Error")
                    }
            }else{
                // Swal.fire({
                //     title: "Failed!",
                //     text: "Please Fill The Blank!",
                //     icon: "error"
                //   });
                toastr.warning("Please Fill The Blank!", "Failed")
            }
        }
    }


    const [timezone, setTimezone] = useState([])
    const [currency, setCurrency] = useState([])
    const [culture, setCulture] = useState([])
    const [client, setClient] = useState([])
    const [tenant, setTenant] = useState([])

    useEffect(()=>{
        if(client.length > 0 && userData.roles == "admin"){
            handleGetClientList(localStorage.getItem("tenantId"))
        }
    }, [client])

    async function getSelectFrontend(){
        setSelectLoading(true)
        // await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/timezone`).then((response) => {
        //     setTimezone(response.data)
        // })

        // await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/currency`).then((response) => {
        //     setCurrency(response.data)
        // })

        // await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/culture`).then((response) => {
        //     setCulture(response.data)
        // })

        await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/client-by-tenant`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
            }
        }).then((response) => {
            setClient(response.data.Data)
        })
        if(userData.roles ==  "sadmin"){
            await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/tenant-get-all`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
                }
            }).then((response) => {
                setTenant(response.data.Data)
            })
        }
        setSelectLoading(false)
    }

    const tenantInput = useRef(null)

    useEffect(() => {
        getSelectFrontend()
    }, [])

    const handlePlatformChange = (event) => {
        setSelectedPlatform(event.target.value);
        setCurrentPage(1);
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

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1);
    };

    const handleSelectedTenant = (event) => {
        setSelectedTenant(event.target.value)
        setCurrentPage(1)
    };

    const filteredData = account.filter((data) => {
        return (
            (!selectedPlatform || data.platform === Number(selectedPlatform)) &&
            (!selectedStatus || data.status === Number(selectedStatus)) &&
            (!selectedTenant || data.tenant_id === selectedTenant) &&
            (!searchTerm ||
                data.username.toLowerCase().includes(searchTerm.toLowerCase()))
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
       
    const indexOfLastaccount = currentPage * dataPerPage;
    const indexOfFirstaccount = indexOfLastaccount - dataPerPage;
    const currentaccounts = filteredData.slice(indexOfFirstaccount, indexOfLastaccount);

    function onSubmit(par){
        
        if(par == 1){
            createAccount()
        } else if(par == 2){
            updateAccount()
        } else {
            null
        }
    }
    
    const handleRefresh = () => {
        Router.refresh()
        getaccount()
    }

    // Login Section
    // Facebook oauth
    useEffect(() => {
        window.fbAsyncInit = function() {
        FB.init({
            appId      : process.env.NEXT_PUBLIC_FACEBOOK_APP_ID,
            cookie     : true,
            xfbml      : true,
            version    : process.env.NEXT_PUBLIC_FACEBOOK_API_VERSION
        });
        
        FB.AppEvents.logPageView();   
        };
    
        (function(d, s, id){
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {return;}
            js = d.createElement(s); js.id = id;
            js.src = "https://connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
        }, []);

        // Fungsi untuk menangani login Facebook
        const FacebookLogin = () => {
        FB.login(function(response) {
                if (response.authResponse) {
                const accessToken = response.authResponse.accessToken;
                console.log('Access Token:', accessToken);
                
                FB.api('/me', { fields: 'name, email' }, function(response) {
                    console.log('Good to see you, ' + response.name + '.');
                    console.log('User email:', response.email);
                    document.getElementById('platform').value = 1
                });
                } else {
                    console.log('User cancelled login or did not fully authorize.');
                }
            }, {scope: 'public_profile,email'});
        };

        // Login Google
        const GoogleLogin = useGoogleLogin({
            onSuccess: async (tokenResponse) => {
              console.log(tokenResponse);
          
              setTimeout(() => {
                document.getElementById('password').value = tokenResponse.access_token;
              }, 1000);
          
              try {
                await axios
                  .get('https://www.googleapis.com/oauth2/v3/userinfo', {
                    headers: {
                      Authorization: `Bearer ${tokenResponse.access_token}`,
                    },
                  })
                  .then((res) => {
                    document.getElementById('platform').value = 2;
                    document.getElementById('name').value = res.data.name;
                    document.getElementById('email').value = res.data.email;
                    showModal('Create');
                    setShowModalOauth(false);
                  });
              } catch (error) {
                console.error('Error fetching user info:', error);
              }
            },
            onError: (errorResponse) => {
              setError('Login Failed');
              console.error(errorResponse);
            },
            scope: 'openid profile email', // Specify scopes as needed
            access_type: 'offline', // Request for refresh token
            prompt: 'consent',
          });
          


        //   Login Tiktok
        const TiktokLogin = () => {
            const clientId = process.env.NEXT_PUBLIC_TIKTOK_CLIENT_ID;
            const redirectUrl = `https://umax-dashboard.vercel.app/`;
            const scope = "user.info.basic";
        
            const authUrl = `https://www.tiktok.com/v2/auth/authorize/?client_key=${clientId}&response_type=code&scope=${scope}&redirect_uri=${redirectUrl}&state=state123`;
          
            const width = 600;
            const height = 600;
            const left = (window.innerWidth / 2) - (width / 2);
            const top = (window.innerHeight / 2) - (height / 2);
          
            window.open(authUrl, 'TikTokLogin', `width=${width},height=${height},top=${top},left=${left}`);
          };
        
          // Callback untuk menangani kode dari TikTok
          useEffect(() => {
            const searchParams = new URLSearchParams(window.location.search);
            const code = searchParams.get("code");
          
            if (code) {
              const fetchAccessToken = async () => {
                try {
                  const response = await axios.post(
                    "https://open-api.tiktok.com/oauth/access_token/",
                    {
                      client_key: process.env.NEXT_PUBLIC_TIKTOK_CLIENT_ID,
                      client_secret: process.env.NEXT_PUBLIC_TIKTOK_CLIENT_SECRET,
                      code,
                      grant_type: "authorization_code",
                      redirect_uri: `${window.location.origin}/tiktok`,
                    }
                  );
          
                  const { data } = response;
          
                  if (data.data && data.data.access_token) {
                    // Simpan token ke localStorage atau gunakan sesuai kebutuhan
                    localStorage.setItem("tiktok_access_token", data.data.access_token);
                    alert("Login successful!");
                    document.getElementById('platform').value = 3
                    router.push("/dashboard");
                  } else {
                    console.error("Failed to retrieve access token:", data);
                    alert("We couldn't log in with TikTok.");
                  }
                } catch (error) {
                  console.error("Error fetching access token:", error.response?.data || error.message);
                  alert("An error occurred while logging in with TikTok.");
                }
              };
          
              fetchAccessToken();
            }
          }, []);

    return (
        <>
            <div className="w-full">
                <div className="flex flex-col md:flex-row justify-between items-center mb-10">
                    <h1 className="text-3xl font-bold uppercase flex dark:text-white gap-2"><RiIdCardLine size={35}/> {t('title')}</h1>
                    <p className="dark:text-white"><a className="hover:cursor-pointer dark:text-white hover:text-blue-400 hover:underline" href="#" onClick={() => setChangeTable("dashboard")}>{t('dashboard')}</a>  / {t('accounts')}</p>
                </div>
                <div className="w-full h-fit mb-5 rounded-md shadow-md">
                    {/* Header */}
                    <div className="w-full h-12 bg-[#3c50e0] flex items-center rounded-t-md">
                        <h1 className="flex gap-2 p-4 items-center text">
                            <FaTable  className="text-blue-200" size={18}/>
                        </h1>
                    </div>
                    {/* Header end */}

                    {/* Body */}
                    <div className="w-full h-fit bg-white dark:bg-slate-800  rounded-b-md p-4">
                        <div className=" flex flex-col-reverse md:flex-row justify-between items-center w-full ">
                            <div className="flex flex-col md:flex-row items-center">
                                {/* Button */}
                                <div className="flex mb-4">
                                    <button title="Export Pdf" className="h-10 bg-white dark:bg-slate-800 py-2 sm:py-2 md:py-2 dark:text-white border dark:border-gray-500 hover:bg-gray-100 dark:hover:bg-slate-500 font-bold px-3 rounded-s-md" onClick={generatePDF}>
                                        <IconContext.Provider value={{ className: "text-xl" }}>
                                            <AiOutlineFilePdf/>
                                        </IconContext.Provider>
                                    </button>
                                    <button title="Export Excel" className="h-10 bg-white dark:bg-slate-800 py-2 sm:py-2 md:py-2 dark:text-white border-b border-t border-e dark:border-gray-500 hover:bg-gray-100 dark:hover:bg-slate-500 font-bold px-3" onClick={generateExcel}>
                                        <IconContext.Provider value={{ className: "text-xl" }}>
                                            <RiFileExcel2Line/>
                                        </IconContext.Provider>
                                    </button>
                                    <button title="Refresh" className="h-10 bg-white dark:bg-slate-800 py-2 sm:py-2 md:py-2 dark:text-white border-b border-t border-e dark:border-gray-500 hover:bg-gray-100 dark:hover:bg-slate-500 font-bold px-3" onClick={handleRefresh}>
                                        <IconContext.Provider value={{ className: "text-xl" }}>
                                            <RiRefreshLine/>
                                        </IconContext.Provider>
                                    </button>
                                    
                                    {/* <button title="Add Data" className="h-10 bg-white dark:bg-slate-800 py-2 sm:py-2 md:py-2 dark:text-white border-b border-t border-e sm:border-e md:border-e-0 lg:rounded-e-none xl:rounded-e-none dark:border-gray-500 hover:bg-gray-100 dark:hover:bg-slate-500 font-bold px-3 " onClick={() => showModal("Create")} > */}
                                    <button title="Add Data" className="h-10 bg-white dark:bg-slate-800 py-2 sm:py-2 md:py-2 dark:text-white border-b border-t border-e sm:border-e md:border-e-0 lg:rounded-e-none xl:rounded-e-none dark:border-gray-500 hover:bg-gray-100 dark:hover:bg-slate-500 font-bold px-3 " onClick={() => setShowModalOauth(true)} >
                                        <IconContext.Provider value={{ className: "text-xl" }}>
                                            <BiPlus className="text-thin"/>
                                        </IconContext.Provider>
                                    </button>
                                    {
                                        userData.roles == "sadmin" && (
                                            <div>
                                                <label htmlFor="tenantfilter" className="text-sm font-medium  hidden">Tenant</label>
                                                <select id="tenantfilter" className="md:w-[150px] h-10 bg-white dark:bg-slate-800 dark:text-white border-b border-t border-s border-e sm:border-e md:border-e-0 xl:border-e-0 dark:border-gray-500 rounded-e-md md:rounded-none text-sm block w-full px-3 py-2 select-no-arrow"
                                                    value={selectedTenant}
                                                    onChange={handleSelectedTenant}
                                                >
                                                    <option value="" disabled hidden>Tenant</option>
                                                    <option value="">All Tenant</option>
                                                    {
                                                        tenant ? tenant.map((tenant, index) => (
                                                            <option key={index} value={tenant._id}>{tenant.company}</option>
                                                        )) : <option value="">No Tenant</option>
                                                    }
                                                </select>  
                                            </div>
                                        )
                                    }
                                    
                                </div>
                                {/* Button end */}

                                <div className="flex w-[100%]">
                                <div className="mb-4">
                                    <label htmlFor="rolefilter" className="text-sm font-medium  hidden">Role</label>
                                    <select id="rolefilter" className="md:w-[150px] h-10 bg-white dark:bg-slate-800 dark:text-white border rounded-s-md md:rounded-none dark:border-gray-500  text-sm block w-full px-3 py-2 select-no-arrow"
                                    value={selectedStatus} onChange={handleStatusChange}
                                    >
                                        <option value="" hidden disabled>Status</option>
                                        <option value="">{t('all-status')}</option>
                                        <option value="1">{t('active')}</option>
                                        <option value="2">{t('deactive')}</option>
                                    </select>  
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="rolefilter" className="text-sm font-medium  hidden">Role</label>
                                    <select id="rolefilter" className="md:w-[150px] h-10 bg-white dark:bg-slate-800 dark:text-white border-b border-t border-e dark:border-gray-500 rounded-e-md  text-sm block w-full px-3 py-2 select-no-arrow"
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
                                </div>
                                {/* Filter by select */}
                                
                                
                                {/* Filter by select end */}
                            </div>

                            {/* Search */}
                            <div className="flex gap-5">
                                <div className="relative mb-4">
                                    <label htmlFor="search" className="hidden"></label>
                                    <input type="text" id="search" name="search" className="w-full h-10 px-4 py-2 dark:bg-slate-800 dark:text-white border dark:border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder={t('search')} 
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

                        <div className="bg-white h-fit overflow-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-md text-left uppercase bg-white dark:bg-slate-700 dark:text-white">
                                    <tr>
                                        <th scope="col" className="px-5 border dark:border-gray-500 py-3">{t('username')}</th>
                                        <th scope="col" className="px-5 border dark:border-gray-500 py-3">{t('client')}</th>
                                        <th scope="col" className="px-5 border dark:border-gray-500 py-3">Platform</th>
                                        <th scope="col" className="px-5 border dark:border-gray-500 py-3">Email</th>
                                        <th scope="col" className="px-5 border dark:border-gray-500 py-3">Company</th>
                                        <th scope="col" className="px-5 border dark:border-gray-500 py-3">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-slate-800 dark:text-white">
                                    {
                                        isLoading ? (
                                            // Jika data sedang loading
                                            <tr className="text-center py-3 border dark:border-gray-500">
                                                <td colSpan={8}>
                                                    <LoadingCircle />
                                                </td>
                                            </tr>
                                        ) : (
                                            currentaccounts.length > 0 ? (
                                                // Jika data ditemukan
                                                currentaccounts.map((account, index) => (
                                                    <tr key={index} className="hover:bg-gray-100 dark:hover:bg-slate-400 hover:cursor-pointer dark:odd:bg-slate-600 dark:even:bg-slate-700 transition-colors duration-300">
                                                        <td scope="row" className="px-5 border dark:border-gray-500 py-3 dark:text-white whitespace-nowrap underline font-semibold" title="Click to edit" onClick={() => showModal("Edit", account._id)}>{account.username}</td>
                                                        <td scope="row" className="px-5 border dark:border-gray-500 py-3 font-medium dark:text-white whitespace-nowrap">{account.client_name}</td>
                                                        <td scope="row" className="px-5 border dark:border-gray-500 py-3 font-medium dark:text-white whitespace-nowrap">{account.platform == 1 ? "Meta Ads" : account.platform == 2 ? "Google Ads" : "Tiktok Ads"}</td>
                                                        <td scope="row" className="px-5 border dark:border-gray-500 py-3 font-medium dark:text-white whitespace-nowrap"><a href={`mailto:${account.email}`} className="text-blue-500 dark:text-blue-300">{account.email}</a></td>
                                                        <td scope="row" className="px-5 border dark:border-gray-500 py-3 font-medium dark:text-white whitespace-nowrap">{account.company_name}</td>
                                                        <td scope="row" className="px-5 border dark:border-gray-500 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">{account.status == 1 ? t('active') : t('deactive')}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                // Jika tidak ada data setelah loading
                                                <tr className="text-center border dark:border-gray-500">
                                                    <td colSpan={8} className="py-4">
                                                        {t('not-found')}
                                                    </td>
                                                </tr>
                                            )
                                        )
                                    }
                                </tbody>
                            </table>
                            <table className="w-full text-sm text-left hidden" ref={tableRef}>
                                <thead className="text-md text-left uppercase bg-white dark:bg-slate-700 dark:text-white">
                                    <tr>
                                        <th scope="col" className="px-5 border dark:border-gray-500 py-3">{t('username')}</th>
                                        <th scope="col" className="px-5 border dark:border-gray-500 py-3">{t('client')}</th>
                                        <th scope="col" className="px-5 border dark:border-gray-500 py-3">Platform</th>
                                        <th scope="col" className="px-5 border dark:border-gray-500 py-3">Email</th>
                                        <th scope="col" className="px-5 border dark:border-gray-500 py-3">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-slate-800 dark:text-white">
                                    {
                                        filteredData.length > 0 ? (
                                            // Jika data ditemukan
                                            filteredData.map((account, index) => (
                                                <tr key={index} className="hover:bg-gray-100 dark:hover:bg-slate-400 hover:cursor-pointer dark:odd:bg-slate-600 dark:even:bg-slate-700 transition-colors duration-300">
                                                    <td scope="row" className="px-5 border dark:border-gray-500 py-3 dark:text-white whitespace-nowrap underline font-semibold" title="Click to edit" onClick={() => showModal("Edit", account._id)}>{account.username}</td>
                                                    <td scope="row" className="px-5 border dark:border-gray-500 py-3 font-medium dark:text-white whitespace-nowrap">{account.client_name}</td>
                                                    <td scope="row" className="px-5 border dark:border-gray-500 py-3 font-medium dark:text-white whitespace-nowrap">{account.platform == 1 ? "Meta Ads" : account.platform == 2 ? "Google Ads" : "Tiktok Ads"}</td>
                                                    <td scope="row" className="px-5 border dark:border-gray-500 py-3 font-medium dark:text-white whitespace-nowrap"><a href={`mailto:${account.email}`} className="text-blue-500 dark:text-blue-300">{account.email}</a></td>
                                                    <td scope="row" className="px-5 border dark:border-gray-500 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">{account.status == 1 ? t('active') : t('deactive')}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            // Jika tidak ada data setelah loading
                                            <tr className="text-center border dark:border-gray-500">
                                                <td colSpan={8} className="py-4">
                                                    {t('not-found')}
                                                </td>
                                            </tr>
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
            <div id="crud-modal" ref={addModal} className="fixed inset-0 dark:text-white flex hidden items-center justify-center bg-gray-500 bg-opacity-60 z-50">
            <div className="w-screen h-screen fixed top-0 left-0" onClick={closeModal}></div>
                <div className="relative mt-1 w-screen md:w-full max-w-2xl max-h-screen">
                    {/* <!-- Modal content --> */}
                    <div className="relative bg-white dark:bg-[#243040] shadow max-h-[100vh] overflow-auto">
                        {/* <!-- Modal header --> */}
                        <div className="fixed z-50 w-full max-w-2xl flex items-center justify-between p-4 md:p-5 border-b bg-white dark:bg-[#243040] dark:border-[#314051] text-black dark:text-white">
                            <h3 className="text-2xl font-semibold">
                                {`${modeModal} ${t('accounts')}`}
                            </h3>
                            <button type="button" className="text-xl bg-transparent w-8 h-8 ms-auto inline-flex justify-center items-center " data-modal-toggle="crud-modal" onClick={closeModal}>
                                <FaTimes />
                            </button>
                        </div>
                        {/* <!-- Modal body --> */}
                        <div className="p-4 md:p-5">
                            <form onSubmit={(e) => {
                                e.preventDefault()
                                onSubmit(modeModal === 'Edit' ? 2 : 1);
                            }}>
                                <div className="grid gap-4 mb-4 grid-cols-2 bg-white dark:bg-[#243040] dark:text-white overflow-y-auto mt-[4.5rem]">
                                    <div className="col-span-2">
                                        <label htmlFor="name" className="flex mb-2 text-sm font-normal font-sans">{t('account_name')} <div className="text-red-500 dark:text-red-600 ml-[1.5px]">*</div> </label>
                                        <input type="text" name="name" id="name" disabled className="bg-white dark:bg-[#1d2a3a] border border-gray-200 dark:border-[#314051] placeholder-[#858c96]  text-sm rounded-[3px] focus:ring-[#3c54d9] focus:border-[#3c54d9] outline-none block w-full p-2.5 " placeholder={t('holder-name')}
                                        required onChange={handleChange} onBlur={handleBlur}/>
                                        {
                                            touched.name && error.name ? <p className="text-red-500 dark:text-red-600 text-sm">{error.name}</p> : ""
                                        }
                                    </div>
                                    <div className={`${userData.roles == "sadmin" ? "col-span-1" : "col-span-2"}`}>
                                        <label htmlFor="email" className="flex mb-2 text-sm font-normal">Email <div className="text-red-500 dark:text-red-600 ml-[1.5px]">*</div></label>
                                        <input type="email" name="email" disabled id="email" className="bg-white dark:bg-[#1d2a3a] border border-gray-200 dark:border-[#314051] placeholder-[#858c96] text-sm rounded-[3px] focus:ring-[#3c54d9] focus:border-[#3c54d9] outline-none block w-full p-3" placeholder={t('holder-email')} required onChange={handleChange} onBlur={handleBlur}/>
                                        {
                                            touched.email && error.email ? <p className="text-red-500 dark:text-red-600 text-sm">{error.email}</p> : ""
                                        }
                                    </div>

                                    
                                    {
                                        userData.roles == "sadmin" && (
                                            <div className="col-span-1" ref={tenantInput}>
                                            <label htmlFor="tenant" className="block mb-2 text-sm font-normal ">Tenant<span className="text-red-500 dark:text-red-600 ml-[1.5px]">*</span></label>
                                            <select id="tenant" onChange={(e) => handleGetClientList(e.target.value)} required className="bg-white dark:bg-[#1d2a3a] border border-gray-200 dark:border-[#314051] placeholder-[#858c96]  text-sm rounded-[3px] focus:ring-primary-500 focus:border-[#3c54d9] outline-none block w-full p-2.5  " defaultValue={""}>
                                            <option value={""} key={0} hidden disabled>{t("select-tenant")}</option>
                                                {
                                                    tenant.length > 0 ? tenant.map((tenant, index) => {
                                                        return <option key={index} value={tenant._id}>{tenant.company}</option>
                                                    }) : <option key={0} value={0}>Loading...</option>
                                                }
                                            </select>
                                        </div>
                                        )   
                                    }
                                    <div className="col-span-1">
                                        <label htmlFor="client" className="flex mb-2 text-sm font-normal ">{t('client')} <div className="text-red-500 dark:text-red-600 ml-[1.5px]">*</div> </label>
                                        <select id="client" name="client" required className={`bg-white ${values.client ? "text-black dark:text-white" : "text-[#858c96]"} dark:bg-[#1d2a3a] border border-gray-200 dark:border-[#314051] placeholder-[#858c96]  text-sm rounded-[3px] focus:ring-primary-500 focus:border-[#3c54d9] outline-none block w-full p-2.5`} defaultValue={""} onChange={handleChange} onBlur={handleBlur}>
                                            <option value="" disabled hidden>{t('select-client')}</option>
                                            {
                                                selectLoading ? (
                                                    // Jika data sedang loading
                                                    <option disabled key={0} value={0}>Loading clients list...</option>
                                                ) : clientFilter.length > 0 ? (
                                                    // Jika data ditemukan
                                                    clientFilter.map((client, index) => (
                                                        <option key={index} value={client._id}>{client.name}</option>
                                                    ))
                                                ) : (
                                                    // Jika tidak ada data
                                                    <option disabled key={0} value={0}>No clients found</option>
                                                )
                                            }
                                        </select>
                                        {
                                            touched.client && error.client ? <p className="text-red-500 dark:text-red-600 text-sm">{error.client}</p> : ""
                                        }
                                    </div>
                                    
                                    <div className="col-span-1">
                                        <label htmlFor="platform" className="flex mb-2 text-sm font-normal ">Platform <div className="text-red-500 dark:text-red-600 ml-[1.5px]">*</div> </label>
                                        <select id="platform" disabled name="platform" required className={`bg-white dark:bg-[#1d2a3a] border border-gray-200 dark:border-[#314051] placeholder-[#858c96]  text-sm rounded-[3px] focus:ring-primary-500 focus:border-[#3c54d9] outline-none block w-full p-2.5 ${values.platform ? "text-black dark:text-white" : "text-[#858c96]"}`} defaultValue={""} onChange={handleChange} onBlur={handleBlur}>
                                            <option value="" disabled hidden className="">{t('select-platform')}</option>
                                            <option value="1">Meta Ads</option>
                                            <option value="2">Google Ads</option>
                                            <option value="3">Tiktok Ads</option>
                                        </select>
                                        {
                                            touched.platform && error.platform ? <p className="text-red-500 dark:text-red-600 text-sm">{error.platform}</p> : ""
                                        }
                                    </div>
                                    {
                                        modeModal == "Create" && (
                                            <>
                                                <div className="col-span-2" ref={passwordInput}>
                                        <label htmlFor="password" className="flex mb-2 text-sm font-normal">Access Token <div className="text-red-500 dark:text-red-600 ml-[1.5px]">*</div></label>
                                        <div className="relative">
                                            <input type={showPassword ? "text" : "password"} disabled name="password" id="password" className="bg-white dark:bg-[#1d2a3a] border border-gray-200 dark:border-[#314051] placeholder-[#858c96]  text-sm rounded-[3px] focus:ring-[#3c54d9] focus:border-[#3c54d9] outline-none block w-full p-2.5 " placeholder={t('holder-password')} onChange={handleChange} onBlur={handleBlur} required/>
                                            <button onClick={handleShowPassword} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none" type="button">
                                                {showPassword ? <IoMdEye/> : <IoMdEyeOff/>}
                                            </button>
                                        </div>
                                        {
                                            touched.password && error.password ? <p className="text-red-500 dark:text-red-600 text-sm">{error.password}</p> : ""
                                        }
                                    </div>
                                            </>
                                        )
                                    }
                                    

                                    <div className="col-span-2">
                                        <label htmlFor="notes" className="mb-2 text-sm font-normal">Notes</label>
                                        <textarea id="notes" name="notes" className="bg-white border dark:bg-[#1d2a3a] dark:border-[#314051] placeholder-[#858c96] border-gray-200 text-sm rounded-[3px] focus:ring-[#3c54d9] focus:border-[#3c54d9] outline-none block w-full p-2.5" placeholder="Enter notes here" onChange={handleChange} onBlur={handleBlur}></textarea>
                                    </div>
                                    <div className="flex items-center">
                                        <label htmlFor="status" className="flex flex-col md:flex-row gap-2 items-center cursor-pointer">
                                            <input type="checkbox" value="" id="status" name="status" className="sr-only peer"/>
                                            <span className="text-sm font-normal ">Status</span>
                                            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4  rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 dark:border-none after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#3b50df]"></div>
                                        </label>
                                    </div>

                                </div>
                                {
                                    modeModal === 'Edit' ? (
                                        <div className="flex gap-3">
                                            <button type="submit" className="w-full bg-[#3b50df] hover:bg-blue-600 border border-indigo-700 text-white py-2 px-4 rounded text-nowrap" disabled={crudLoading}>
                                                {crudLoading ? <LoadingCrud /> : t('save')}
                                            </button>
                                            <div className="w-full text-center hover:cursor-pointer bg-indigo-700 hover:bg-indigo-600 border border-indigo-800 text-white py-2 px-4 rounded text-nowrap" onClick={() => handleDelete(EditaccountId)}>
                                                {t('delete')}
                                            </div>
                                        </div>
                                    ) : (
                                        <button type="submit" className="w-full bg-[#3b50df] hover:bg-blue-700 border border-indigo-700 mt-5 text-white py-2 px-4 rounded-[3px]" disabled={crudLoading}>
                                                {crudLoading ? <LoadingCrud /> : t('submit')}
                                        </button>
                                    )
                                }
                            </form>
                        </div>
                    </div>
                </div>
            </div> 
            {showModalOauth ? (
                <>
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none bg-black bg-opacity-50">
                    <div className="relative w-auto my-6 mx-auto max-w-3xl">
                    {/* Modal Content */}
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        {/* Modal Header */}
                        <div className="flex justify-between items-center border-b border-solid border-gray-200 pb-4">
                        <h3 className="text-2xl font-semibold me-5">Add Umax Ads Account</h3>
                        <button
                            className="text-gray-400 hover:text-gray-600"
                            onClick={() => setShowModalOauth(false)}
                        >
                            <FaTimes />
                        </button>
                        </div>

                        {/* Modal Body with Buttons */}
                        <div className="my-4 flex flex-col gap-4">
                        <button className="flex items-center justify-center bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition" onClick={GoogleLogin}>
                            <FaGoogle className="mr-2" /> Login with Google
                        </button>

                        <button className="flex items-center justify-center bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition" onClick={FacebookLogin}>
                            <FaFacebookF     className="mr-2" /> Login with Facebook
                        </button>

                        <button className="flex items-center justify-center bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition" onClick={TiktokLogin}>
                            <FaTiktok className="mr-2" /> Login with TikTok
                        </button>
                        </div>
                    </div>
                    </div>
                </div>
                </>
            ) : null}                             
        </>
    )
}