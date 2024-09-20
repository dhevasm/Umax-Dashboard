"use client";

import axios from "axios";
import { useState, useEffect, useRef, useContext, useCallback } from "react";
import { AdminDashboardContext } from "@/app/[locale]/admin-dashboard/page";
import Swal from "sweetalert2";
import { useDownloadExcel } from "react-export-table-to-excel";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { IconContext } from "react-icons";
import { AiOutlineFilePdf } from "react-icons/ai";
import { FaTable } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import { FaTimes } from "react-icons/fa";
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
import { MdPeopleOutline } from "react-icons/md";
import { RiFileExcel2Line, RiRefreshLine } from "react-icons/ri";
import { BiPlus } from "react-icons/bi";
import { useTranslations } from "next-intl";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import { useRouter } from "next/navigation";
export default function ClientTable() {
  const [client, setclient] = useState([]);
  const [clientMemo, setclientMemo] = useState([]);
  const [EditclientId, setEditclientId] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedTenant, setSelectedTenant] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [dataPerPage, setDataPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const t = useTranslations("admin-clients");
  const tfile = useTranslations("swal-file");
  const tdel = useTranslations("swal-delete");
  const [crudLoading, setCrudLoading] = useState(false);
  const Router = useRouter();

  function LoadingCrud() {
    return (
      <div className="flex justify-center items-center h-6">
        <div className="relative">
          <div className="w-6 h-6 border-4 border-white rounded-full border-t-transparent dark:border-t-transparent animate-spin"></div>
        </div>
      </div>
    );
  }

  function handleShowPassword() {
    setShowPassword(!showPassword);
  }

  const {
    sidebarHide,
    setSidebarHide,
    updateCard,
    setUpdateCard,
    changeTable,
    setChangeTable,
    userData,
    dataDashboard,
  } = useContext(AdminDashboardContext);

  const addModal = useRef(null);
  const [modeModal, setModeModal] = useState("add");

  const passwordInput = useRef(null);
  const passwordverifyInput = useRef(null);
  const tenantInput = useRef(null);

  // validasi form
  const [values, setValues] = useState({
    name: "",
    address: "",
    contact: "",
    email: "",
    password: "",
    passwordverify: "",
  });

  const [error, setError] = useState({
    name: "",
    address: "",
    contact: "",
    email: "",
    password: "",
    passwordverify: "",
  });

  const [touched, setTouched] = useState({
    name: false,
    address: false,
    contact: false,
    email: false,
    password: false,
    passwordverify: false,
  });

  const [isValid, setIsValid] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prevTouched) => ({
      ...prevTouched,
      [name]: true,
    }));
  };

  const validateForm = useCallback(() => {
    let errors = {};

    if (values.name === "" && touched.name) {
      errors.name = t("name-error");
    }
    if (values.address === "" && touched.address) {
      errors.address = t("address-error");
    }
    if (values.contact === "" && touched.contact) {
      errors.contact = t("contact-error");
    }
    if (!values.email.includes("@") && touched.email) {
      errors.email = t("email-error2");
    }
    if (values.email === "" && touched.email) {
      errors.email = t("email-error");
    }
    if (
      values.password !== values.passwordverify &&
      (touched.password || touched.passwordverify)
    ) {
      errors.password = t("password-error2");
      errors.passwordverify = t("password-error2");
    }
    if (values.password === "" && touched.password) {
      errors.password = t("password-error");
    }
    if (values.passwordverify === "" && touched.passwordverify) {
      errors.passwordverify = t("confirm-error");
    }

    setError(errors);
    setIsValid(Object.keys(errors).length === 0);
  }, [values, touched, t]);

  useEffect(() => {
    validateForm();
  }, [values, touched, validateForm]);

  function showModal(mode, client_id = null) {
    document.body.style.overflow = "hidden";
    setModeModal(mode);
    if (mode == "Edit") {
      const filteredclient = client.filter(
        (client) => client._id === client_id
      );
      if (filteredclient.length > 0) {
        // console.log(filteredCampaing[0])
        setEditclientId(client_id);
        setValues({
          name: filteredclient[0].name,
          address: filteredclient[0].address,
          contact: filteredclient[0].contact.slice(1),
          email: filteredclient[0].email,
        });
        setError({ name: "", address: "", contact: "", email: "" });
        document.getElementById("name").value = filteredclient[0].name;
        document.getElementById("country").value =
          filteredclient[0].address.split(", ")[1];
        handleCityList(filteredclient[0].address.split(", ")[1]);
        setTimeout(() => {
          document.getElementById("city").value =
            filteredclient[0].address.split(", ")[0];
        }, 300);
        document.getElementById("contact").value =
          filteredclient[0].contact.slice(1);
        document.getElementById("email").value = filteredclient[0].email;
        document.getElementById("status").checked =
          filteredclient[0].status == 1 ? true : false;
        // passwordInput.current.classList.add("hidden")
        // passwordverifyInput.current.classList.add("hidden")
        if (userData.roles == "sadmin") {
          document.getElementById("tenant").value = filteredclient[0].tenant_id;
          document.getElementById("tenant").disabled = true;
        }
        document.getElementById("email").disabled = true;
        if (filteredclient[0].notes == "empty") {
          document.getElementById("notes").value = "";
        } else {
          document.getElementById("notes").value = filteredclient[0].notes;
        }
        // console.log(client_id)
      } else {
        Swal.fire("client not found");
      }
    } else if (mode == "Create") {
      setValues({
        name: "",
        address: "",
        contact: "",
        email: "",
        password: "",
        passwordverify: "",
      });
      setError({
        name: "",
        address: "",
        contact: "",
        email: "",
        password: "",
        passwordverify: "",
      });
      document.getElementById("name").value = null;
      document.getElementById("country").value = "";
      document.getElementById("city").value = "";
      document.getElementById("contact").value = null;
      document.getElementById("email").value = null;
      document.getElementById("email").disabled = false;
      if (userData.roles == "sadmin") {
        document.getElementById("tenant").value = "";
        document.getElementById("tenant").disabled = false;
      }
      setTimeout(() => {
        document.getElementById("password").value = null;
        document.getElementById("passwordverify").value = null;
      }, 500);
      document.getElementById("notes").value = "";
      // passwordInput.current.classList.remove("hidden")
      // passwordverifyInput.current.classList.remove("hidden")
    }
    addModal.current.classList.remove("hidden");
  }
  function closeModal() {
    document.body.style.overflow = "auto";
    setValues({
      name: "",
      address: "",
      contact: "",
      email: "",
      password: "",
      passwordverify: "",
    });
    setError({
      name: "",
      address: "",
      contact: "",
      email: "",
      password: "",
      passwordverify: "",
    });
    setTouched({
      name: false,
      address: false,
      contact: false,
      email: false,
      password: false,
      passwordverify: false,
    });
    addModal.current.classList.add("hidden");
  }

  function handleDelete(client_id) {
    Swal.fire({
      title: tdel("warn"),
      text: tdel("msg"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: tdel("yes"),
      cancelButtonText: tdel("no"),
    }).then((result) => {
      if (result.isConfirmed) {
        deleteclient(client_id);
        // Swal.fire({
        //     title: tdel('success'),
        //     text: tdel('suc-msg'),
        //     icon: "success"
        // })
      }
    });
  }

  const deleteclient = async (client_id) => {
    closeModal();
    try {
      setCrudLoading(true);
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/client-delete?client_id=${client_id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        }
      );
      getclient();
      setUpdateCard(true);
      setCrudLoading(false);
      toastr.success(tdel("suc-msg"), tdel("success"));
    } catch (error) {
      setCrudLoading(false);
      toastr.error("Delete user failed", "Error");
      console.log(error);
    }
  };

  const tableRef = useRef(null);

  function generateExcel() {
    Swal.fire({
      title: `${tfile("warn")}`,
      text: `${tfile("msg2")}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `${tfile("yes")}`,
      cancelButtonText: `${tfile("no")}`,
    }).then((result) => {
      if (result.isConfirmed) {
        onDownload();
        //   Swal.fire({
        //     title: `${tfile('success')}`,
        //     text: `${tfile('suc-msg')}`,
        //     icon: "success"
        //   });
        toastr.success(tfile("suc-msg"), tfile("success"));
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
      title: `${tfile("warn")}`,
      text: `${tfile("msg1")}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `${tfile("yes")}`,
      cancelButtonText: `${tfile("no")}`,
    }).then((result) => {
      if (result.isConfirmed) {
        const doc = new jsPDF();
        doc.text("Data client Umax Dashboard", 10, 10);
        doc.autoTable({
          head: [["Name", "Address", "Contact", "Email", "Status"]],
          body: client.map((client) => [
            client.name,
            client.address,
            client.contact,
            client.email,
            client.status == 1 ? "Active" : "Inactive",
          ]),
        });
        doc.save("Dataclient.pdf");
        //   Swal.fire({
        //     title: `${tfile('success')}`,
        //     text: `${tfile('suc-msg')}`,
        //     icon: "success"
        //   });
        toastr.success(tfile("suc-msg"), tfile("success"));
      }
    });
  };

  function handleDetail(client_id) {
    const filteredclient = client.filter((client) => client._id === client_id);
    if (filteredclient.length > 0) {
      const [client] = filteredclient;
      Swal.fire(`<p>
                ${client.name}\nAddress: ${client.address}\nContact: ${client.contact}\nEmail: ${client.email}
                </p>`);
    } else {
      Swal.fire("client not found");
    }
  }

  async function getclient() {
    setIsLoading(true);
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/client-by-tenant`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      }
    );
    setclient(response.data.Data);
    setclientMemo(response.data.Data);
    setIsLoading(false);
  }

  useEffect(() => {
    getclient();
  }, []);

  useEffect(() => {}, [client]);

  async function createClient() {
    if (isValid) {
      const name = document.getElementById("name").value;
      const country = document.getElementById("country").value;
      const city = document.getElementById("city").value;
      const address = `${city}, ${country}`;
      const contact = `+${document.getElementById("contact").value}`;
      const email = document.getElementById("email").value;
      const status = document.getElementById("status").checked ? 1 : 2;
      const password = document.getElementById("password").value;
      const passwordverify = document.getElementById("passwordverify").value;

      let notes = document.getElementById("notes").value;
      if (notes == "") {
        notes = "empty";
      }

      const formData = new FormData();
      formData.append("name", name);
      formData.append("address", address);
      formData.append("email", email);
      formData.append("contact", contact);
      formData.append("status", status);
      formData.append("password", password);
      formData.append("confirm_password", passwordverify);
      formData.append("notes", notes);

      let url = "";

      if (userData.roles == "sadmin") {
        const tenant_id = document.getElementById("tenant").value;
        url = `${process.env.NEXT_PUBLIC_API_URL}/client-create?tenantId=${tenant_id}`;
      } else if (userData.roles == "admin") {
        url = `${process.env.NEXT_PUBLIC_API_URL}/client-create`;
      }

      setCrudLoading(true);
      const response = await axios.post(url, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      });

      if (response.data.Output == "Create Client Successfully") {
        getclient();
        closeModal();
        setUpdateCard(true);
        document.getElementById("name").value = null;
        document.getElementById("country").value = 0;
        document.getElementById("city").value = 0;
        document.getElementById("contact").value = null;
        document.getElementById("email").value = null;
        document.getElementById("password").value = null;
        document.getElementById("passwordverify").value = null;
        document.getElementById("notes").value = "";
        // Swal.fire("Success", "Client created successfully", "success")
        setCrudLoading(false);
        toastr.success("Client created successfully", "Success");
      } else {
        // Swal.fire("Error", response.detail, "error")
        setCrudLoading(false);
        toastr.error(response.detail, "Error");
      }
    } else {
      // Swal.fire({
      //     title: "Failed!",
      //     text: "Please Fill The Blank!",
      //     icon: "error"
      //   });
      setCrudLoading(false);
      toastr.warning("Please Fill The Blank!", "Failed");
      //   validateForm()
    }
  }

  async function updateClient() {
    if (EditclientId !== null) {
      if (isValid) {
        const name = document.getElementById("name").value;
        const country = document.getElementById("country").value;
        const city = document.getElementById("city").value;
        const address = `${city}, ${country}`;
        const contact = `+${document.getElementById("contact").value}`;
        const email = document.getElementById("email").value;
        const status = document.getElementById("status").checked ? 1 : 2;
        let notes = document.getElementById("notes").value;
        if (notes == "") {
          notes = "empty";
        }
        const formData = new FormData();
        formData.append("name", name);
        formData.append("address", address);
        formData.append("email", email);
        formData.append("contact", contact);
        formData.append("status", status);
        formData.append("notes", notes);

        setCrudLoading(true);
        const response = await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/client-edit?client_id=${EditclientId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
            },
          }
        );

        if (response.data.Output == "Data Updated Successfully") {
          getclient();
          closeModal();
          document.getElementById("name").value = null;
          document.getElementById("country").value = 0;
          document.getElementById("city").value = 0;
          document.getElementById("contact").value = null;
          // document.getElementById('email').value = null
          // document.getElementById('password').value = null
          // Swal.fire("Success", "Client Updated", "success")
          setCrudLoading(false);
          toastr.success("Client Updated", "Success");
        } else {
          // Swal.fire("Error", response.detail.ErrMsg, "error")
          setCrudLoading(false);
          toastr.error(response.detail.ErrMsg, "Error");
        }
      } else {
        // Swal.fire({
        //     title: "Failed!",
        //     text: "Please Fill The Blank!",
        //     icon: "error"
        //   });
        setCrudLoading(false);
        toastr.warning("Please Fill The Blank!", "Failed");
      }
    }
  }

  const [timezone, setTimezone] = useState([]);
  const [currency, setCurrency] = useState([]);
  const [culture, setCulture] = useState([]);
  const [tenants, setTenants] = useState([]);

  async function getSelectFrontend() {
    // await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/timezone`).then((response) => {
    //     setTimezone(response.data)
    // })

    // await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/currency`).then((response) => {
    //     setCurrency(response.data)
    // })

    // await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/culture`).then((response) => {
    //     setCulture(response.data)
    // })

    if (userData.roles == "sadmin") {
      await axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/tenant-get-all`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        })
        .then((response) => {
          setTenants(response.data.Data);
        });
    }
  }

  useEffect(() => {
    getSelectFrontend();
  });

  function LoadingCircle() {
    return (
      <div className="flex justify-center items-center h-20">
        <div className="relative">
          <div className="w-10 h-10 border-4 border-[#1C2434] dark:border-white rounded-full border-t-transparent dark:border-t-transparent animate-spin"></div>
        </div>
      </div>
    );
  }

  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
    setCurrentPage(1);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleTenantChange = (event) => {
    setSelectedTenant(event.target.value);
    setCurrentPage(1);
  };

  const filteredData = client.filter((data) => {
    return (
      (!selectedStatus || data.status === Number(selectedStatus)) &&
      (!selectedTenant || data.tenant_id === selectedTenant) &&
      (!searchTerm ||
        data.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  const [Country, setCountry] = useState([]);
  const [City, setCity] = useState([]);

  const getAdresslist = async () => {
    await axios
      .get("https://countriesnow.space/api/v0.1/countries")
      .then((response) => {
        setCountry(response.data.data);
      });
  };

  async function handleCityList(countryname) {
    let citylist = [];
    Country.map((item) => {
      if (item.country == countryname) {
        citylist = item.cities;
      }
    });
    setCity(citylist);
  }

  useEffect(() => {
    getAdresslist();
  }, []);

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
        {"<<"}
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
        {"<"}
      </button>
    );

    // Info page
    pageButtons.push(
      <span
        key="info"
        className="px-1 sm:px-3 md:px-3 lg:px-3 xl:px-3 py-1 dark:text-white rounded-md"
      >
        {`${t("page")} ${currentPage} / ${totalPages}`}
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
        {">"}
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
        {">>"}
      </button>
    );

    return <div className="flex justify-center gap-2 mt-4">{pageButtons}</div>;
  };

  const indexOfLastclient = currentPage * dataPerPage;
  const indexOfFirstclient = indexOfLastclient - dataPerPage;
  const currentclients = filteredData.slice(
    indexOfFirstclient,
    indexOfLastclient
  );

  function onSubmit(par) {
    if (par == 1) {
      createClient();
    } else if (par == 2) {
      updateClient();
    } else {
      null;
    }
  }

  const handleRefresh = () => {
    Router.refresh();
    getclient();
  };

  return (
    <>
      <div className="w-full">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10">
          <h1 className="text-3xl font-bold uppercase dark:text-white flex gap-2">
            <MdPeopleOutline size={35} /> {t("title")}
          </h1>
          <p className="dark:text-white">
            <a
              className="hover:cursor-pointer dark:text-white hover:text-blue-400 hover:underline"
              href="#"
              onClick={() => setChangeTable("dashboard")}
            >
              {t("dashboard")}
            </a>{" "}
            / {t("clients")}
          </p>
        </div>

        <div className="w-full fit mb-5 rounded-md shadow-md">
          {/* Header */}
          <div className="w-full h-12 bg-[#175FBE] dark:bg-slate-700 flex items-center rounded-t-md">
            <h1 className="flex gap-2 p-4 items-center text">
              <FaTable className="text-blue-200" size={18} />
              <p className="text-white text-md font-semibold"></p>
            </h1>
          </div>
          {/* Header end */}

          <div className="w-full h-fit bg-white dark:bg-slate-800 dark:text-white rounded-b-md p-4">
            <div className=" flex flex-col-reverse md:flex-row justify-between items-center w-full ">
              <div
                className={`flex ${
                  userData.roles == "sadmin" ? "flex-col md:flex-row" : ""
                } items-center `}
              >
                <div className="flex mb-4">
                  {/* Button */}
                  <button
                    title="Export Pdf"
                    className="h-10 bg-white dark:bg-slate-800 border dark:border-gray-500 hover:bg-gray-100 dark:hover:bg-slate-400 font-bold px-3 rounded-s-md"
                    onClick={generatePDF}
                  >
                    <IconContext.Provider value={{ className: "text-xl" }}>
                      <AiOutlineFilePdf />
                    </IconContext.Provider>
                  </button>
                  <button
                    title="Export Excel"
                    className="h-10 bg-white dark:bg-slate-800 border-b border-t border-e dark:border-gray-500 hover:bg-gray-100 dark:hover:bg-slate-400 font-bold px-3"
                    onClick={generateExcel}
                  >
                    <IconContext.Provider value={{ className: "text-xl" }}>
                      <RiFileExcel2Line />
                    </IconContext.Provider>
                  </button>
                  <button
                    title="Refresh"
                    className="h-10 bg-white dark:bg-slate-800 py-2 sm:py-2 md:py-2 dark:text-white border-b border-t border-e dark:border-gray-500 hover:bg-gray-100 dark:hover:bg-slate-500 font-bold px-3"
                    onClick={handleRefresh}
                  >
                    <IconContext.Provider value={{ className: "text-xl" }}>
                      <RiRefreshLine />
                    </IconContext.Provider>
                  </button>
                  <button
                    title="Add Data"
                    className={`h-10 bg-white dark:bg-slate-800 border-b border-t border-e ${
                      userData.roles == "sadmin"
                        ? "rounded-e-md md:rounded-e-none"
                        : ""
                    } dark:border-gray-500 hover:bg-gray-100 dark:hover:bg-slate-400 font-bold px-3 `}
                    onClick={() => showModal("Create")}
                  >
                    <IconContext.Provider value={{ className: "text-xl" }}>
                      <BiPlus className="text-thin" />
                    </IconContext.Provider>
                  </button>
                  {/* Button end */}
                </div>

                <div className="flex">
                  {/* Filter by select */}
                  {userData.roles == "sadmin" && (
                    <div className="mb-4">
                      <label
                        htmlFor="tenantfilter"
                        className="text-sm font-medium hidden"
                      >
                        Tenant
                      </label>
                      <select
                        id="tenantfilter"
                        className="md:w-[150px] h-10 bg-white dark:bg-slate-800 border-b border-t border-e border-s md:border-s-0 rounded-s-md md:rounded-s-none dark:border-gray-500 text-sm block w-full px-3 py-2 select-no-arrow"
                        value={selectedTenant}
                        onChange={handleTenantChange}
                      >
                        <option value="" disabled hidden>
                          Tenant
                        </option>
                        <option value="">All Tenant</option>
                        {tenants ? (
                          tenants.map((tenant, index) => (
                            <option key={index} value={tenant._id}>
                              {tenant.company}
                            </option>
                          ))
                        ) : (
                          <option>Loading</option>
                        )}
                      </select>
                    </div>
                  )}
                  <div className="mb-4">
                    <label
                      htmlFor="rolefilter"
                      className="text-sm font-medium hidden"
                    >
                      Role
                    </label>
                    <select
                      id="rolefilter"
                      className="md:w-[150px] h-10 bg-white dark:bg-slate-800 border-b border-t border-e dark:border-gray-500 rounded-e-md text-sm block w-full px-3 py-2 select-no-arrow"
                      value={selectedStatus}
                      onChange={handleStatusChange}
                    >
                      <option value="" disabled hidden>
                        Status
                      </option>
                      <option value="">{t("all-status")}</option>
                      <option value="1">{t("active")}</option>
                      <option value="2">{t("deactive")}</option>
                    </select>
                  </div>
                </div>
                {/* Filter by select end */}
              </div>

              {/* Search */}
              <div className="flex gap-5">
                <div className="relative mb-4">
                  <label htmlFor="search" className="hidden"></label>
                  <input
                    type="text"
                    id="search"
                    name="search"
                    className="h-10 dark:bg-slate-800 w-full px-4 py-2 border dark:border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={t("search")}
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                  <span className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <svg
                      className="w-4 h-4 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      ></path>
                    </svg>
                  </span>
                </div>
              </div>
              {/* Search */}
            </div>

            <div className="bg-white dark:bg-slate-800 h-fit overflow-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-md text-left uppercase bg-white dark:bg-slate-700">
                  <tr>
                    <th
                      scope="col"
                      className="px-5 border dark:border-gray-500 py-3"
                    >
                      {t("name")}
                    </th>
                    <th
                      scope="col"
                      className="px-5 border dark:border-gray-500 py-3"
                    >
                      {t("address")}
                    </th>
                    <th
                      scope="col"
                      className="px-5 border dark:border-gray-500 py-3"
                    >
                      {t("contact")}
                    </th>
                    <th
                      scope="col"
                      className="px-5 border dark:border-gray-500 py-3"
                    >
                      Email
                    </th>
                    <th
                      scope="col"
                      className="px-5 border dark:border-gray-500 py-3"
                    >
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-slate-800">
                  {isLoading ? (
                    // Jika data sedang loading
                    <tr className="text-center py-3 border dark:border-gray-500">
                      <td colSpan={8}>
                        <LoadingCircle />
                      </td>
                    </tr>
                  ) : currentclients.length > 0 ? (
                    // Jika data ditemukan
                    currentclients.map((client, index) => (
                      <tr
                        key={index}
                        className="hover:bg-gray-100 hover:cursor-pointer dark:hover:bg-slate-400 dark:odd:bg-slate-600 dark:even:bg-slate-700 transition-colors duration-300"
                      >
                        <td
                          scope="row"
                          className="px-5 border dark:border-gray-500 py-3 font-medium whitespace-nowrap underline"
                          onClick={() => showModal("Edit", client._id)}
                        >
                          {client.name}
                        </td>
                        <td
                          scope="row"
                          className="px-5 border dark:border-gray-500 py-3 font-medium whitespace-nowrap"
                        >
                          {client.address}
                        </td>
                        <td
                          scope="row"
                          className="px-5 border dark:border-gray-500 py-3 font-medium whitespace-nowrap"
                        >
                          <a
                            href={`https://wa.me/${client.contact.replace(
                              /\D+/g,
                              ""
                            )}`}
                            target="_blank"
                            className="text-blue-500"
                          >
                            {client.contact}
                          </a>
                        </td>
                        <td
                          scope="row"
                          className="px-5 border dark:border-gray-500 py-3 font-medium whitespace-nowrap"
                        >
                          <a
                            href={`mailto:${client.email}`}
                            className="text-blue-500"
                          >
                            {client.email}
                          </a>
                        </td>
                        <td
                          scope="row"
                          className="px-5 border dark:border-gray-500 py-3 font-medium whitespace-nowrap"
                        >
                          {client.status == 1 ? t("active") : t("deactive")}
                        </td>
                      </tr>
                    ))
                  ) : (
                    // Jika tidak ada data setelah loading
                    <tr className="text-center border dark:border-gray-500">
                      <td colSpan={8} className="py-4">
                        {t("not-found")}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              <table className="w-full text-sm text-left hidden" ref={tableRef}>
                <thead className="text-md text-left uppercase bg-white dark:bg-slate-700">
                  <tr>
                    <th
                      scope="col"
                      className="px-5 border dark:border-gray-500 py-3"
                    >
                      {t("name")}
                    </th>
                    <th
                      scope="col"
                      className="px-5 border dark:border-gray-500 py-3"
                    >
                      {t("address")}
                    </th>
                    <th
                      scope="col"
                      className="px-5 border dark:border-gray-500 py-3"
                    >
                      {t("contact")}
                    </th>
                    <th
                      scope="col"
                      className="px-5 border dark:border-gray-500 py-3"
                    >
                      Email
                    </th>
                    <th
                      scope="col"
                      className="px-5 border dark:border-gray-500 py-3"
                    >
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-slate-800">
                  {filteredData.length > 0 ? (
                    // Jika data ditemukan
                    filteredData.map((client, index) => (
                      <tr
                        key={index}
                        className="hover:bg-gray-100 hover:cursor-pointer dark:hover:bg-slate-400 dark:odd:bg-slate-600 dark:even:bg-slate-700 transition-colors duration-300"
                      >
                        <td
                          scope="row"
                          className="px-5 border dark:border-gray-500 py-3 font-medium whitespace-nowrap underline"
                          onClick={() => showModal("Edit", client._id)}
                        >
                          {client.name}
                        </td>
                        <td
                          scope="row"
                          className="px-5 border dark:border-gray-500 py-3 font-medium whitespace-nowrap"
                        >
                          {client.address}
                        </td>
                        <td
                          scope="row"
                          className="px-5 border dark:border-gray-500 py-3 font-medium whitespace-nowrap"
                        >
                          <a
                            href={`https://wa.me/${client.contact.replace(
                              /\D+/g,
                              ""
                            )}`}
                            target="_blank"
                            className="text-blue-500"
                          >
                            {client.contact}
                          </a>
                        </td>
                        <td
                          scope="row"
                          className="px-5 border dark:border-gray-500 py-3 font-medium whitespace-nowrap"
                        >
                          <a
                            href={`mailto:${client.email}`}
                            className="text-blue-500"
                          >
                            {client.email}
                          </a>
                        </td>
                        <td
                          scope="row"
                          className="px-5 border dark:border-gray-500 py-3 font-medium whitespace-nowrap"
                        >
                          {client.status == 1 ? t("active") : t("deactive")}
                        </td>
                      </tr>
                    ))
                  ) : (
                    // Jika tidak ada data setelah loading
                    <tr className="text-center border dark:border-gray-500">
                      <td colSpan={8} className="py-4">
                        {t("not-found")}
                      </td>
                    </tr>
                  )}
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
      <div
        id="crud-modal"
        ref={addModal}
        className="fixed inset-0 flex hidden items-center justify-center bg-gray-500 bg-opacity-60 z-50"
      >
        <div
          className="w-screen h-screen fixed top-0 left-0"
          onClick={closeModal}
        ></div>
        <div className="relative mt-1 w-screen md:w-full max-w-2xl max-h-screen">
          {/* <!-- Modal content --> */}
          <div className="relative bg-white dark:bg-[#243040] shadow max-h-[100vh] overflow-auto">
            {/* <!-- Modal header --> */}
            <div className="fixed z-50 w-full max-w-2xl flex items-center justify-between p-4 md:p-5 border-b rounded-t bg-white dark:bg-[#243040] dark:border-[#314051] text-black dark:text-white">
              <h3 className="text-lg font-semibold">
                {`${modeModal} ${t("clients")}`}
              </h3>
              <button
                type="button"
                className="text-xl bg-transparent w-8 h-8 ms-auto inline-flex justify-center items-center "
                data-modal-toggle="crud-modal"
                onClick={closeModal}
              >
                <FaTimes />
              </button>
            </div>
            {/* <!-- Modal body --> */}
            <div className="p-4 md:p-5">
              <form
                onSubmit={(e) => {
                  e.preventDefault(); // Mencegah perilaku default formulir
                  onSubmit(modeModal === "Edit" ? 2 : 1);
                }}
              >
                <div className="grid gap-4 mb-4 grid-cols-2 bg-white dark:bg-[#243040] dark:text-white overflow-y-auto mt-[4.5rem]">
                  <div className="col-span-2">
                    <label
                      htmlFor="name"
                      className="block mb-2 text-sm font-medium text-black dark:text-slate-200 "
                    >
                      {t("client_name")}
                      <span className="text-red-500">*</span>{" "}
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      required
                      className="bg-white dark:bg-[#1d2a3a] placeholder-[#858c96] text-black dark:text-slate-200 dark:border-[#314051] border border-gray-200 text-sm focus:ring-[#3c54d9] focus:border-[#3c54d9] outline-none block w-full p-2.5 "
                      placeholder={t("holder-name")}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {touched.name && error.name && (
                      <p className="text-red-500 text-xs">{error.name}</p>
                    )}
                  </div>
                  <div className="col-span-1">
                    <label
                      htmlFor="country"
                      className="block mb-2 text-sm font-medium text-black dark:text-slate-200 "
                    >
                      {t("country")}
                      <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="country"
                      defaultValue={""}
                      name="country"
                      required
                      className={`bg-white dark:bg-[#1d2a3a] ${
                        values.address
                          ? "text-black dark:text-white"
                          : "text-[#858c96]"
                      } text-black dark:text-slate-200 dark:border-[#314051] border border-gray-200  text-sm rounded-[3px] focus:ring-[#3c54d9] focus:border-[#3c54d9] outline-none block w-full p-2.5`}
                      onChange={(e) => handleCityList(e.target.value)}
                    >
                      <option value={""} disabled hidden>
                        {t("select-country")}
                      </option>
                      {Country.length > 0 &&
                        Country.map((item, index) => (
                          <option key={index} value={item.country}>
                            {item.country}
                          </option>
                        ))}
                    </select>
                    {touched.address && error.address && (
                      <p className="text-red-500 text-xs">{error.address}</p>
                    )}
                  </div>
                  <div className="col-span-1">
                    <label
                      htmlFor="city"
                      className="block mb-2 text-sm font-medium text-black dark:text-slate-200 "
                    >
                      {t("city")}
                      <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="city"
                      name="address"
                      defaultValue={""}
                      required
                      className={`bg-white dark:bg-[#1d2a3a] ${
                        values.address
                          ? "text-black dark:text-white"
                          : "text-[#858c96]"
                      } text-black dark:text-slate-200 dark:border-[#314051] border border-gray-200  text-sm rounded-[3px] focus:ring-[#3c54d9] focus:border-[#3c54d9] outline-none block w-full p-2.5`}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      <option value={""} disabled hidden>
                        {t("select-city")}
                      </option>
                      {City.length > 0 ? (
                        City.map((item, index) => (
                          <option key={index} value={item}>
                            {item}
                          </option>
                        ))
                      ) : (
                        <option disabled value={""} hidden>
                          Please Select Country
                        </option>
                      )}
                    </select>
                    {touched.address && error.address && (
                      <p className="text-red-500 text-xs">{error.address}</p>
                    )}
                  </div>
                  <div className="col-span-1">
                    <label
                      htmlFor="email"
                      className="block mb-2 text-sm font-medium text-black dark:text-slate-200 "
                    >
                      Email<span className="text-red-500">*</span>{" "}
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      required
                      className="bg-white dark:bg-[#1d2a3a] placeholder-[#858c96] text-black dark:text-slate-200 dark:border-[#314051] border border-gray-200 text-sm rounded-[3px] focus:ring-[#3c54d9] focus:border-[#3c54d9] outline-none block w-full p-2.5 "
                      placeholder={t("holder-email")}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {touched.email && error.email && (
                      <p className="text-red-500 text-xs">{error.email}</p>
                    )}
                  </div>
                  <div className="col-span-1">
                    <label
                      htmlFor="contact"
                      className="block mb-2 text-sm font-medium text-black dark:text-slate-200 "
                    >
                      {t("contact")}
                      <span className="text-red-500">*</span>{" "}
                    </label>
                    <input
                      type="number"
                      name="contact"
                      id="contact"
                      required
                      className="bg-white dark:bg-[#1d2a3a] placeholder-[#858c96] text-black dark:text-slate-200 dark:border-[#314051] border border-gray-200 text-sm rounded-[3px] focus:ring-[#3c54d9] focus:border-[#3c54d9] outline-none block w-full p-2.5 "
                      placeholder={t("holder-contact")}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {touched.contact && error.contact && (
                      <p className="text-red-500 text-xs">{error.contact}</p>
                    )}
                  </div>
                  {modeModal == "Create" && (
                    <>
                      <div
                        className="col-span-2 md:col-span-1"
                        ref={passwordInput}
                      >
                        <label
                          htmlFor="password"
                          className="block mb-2 text-sm font-medium text-black dark:text-slate-200 "
                        >
                          Password<span className="text-red-500">*</span>{" "}
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            id="password"
                            className="bg-white dark:bg-[#1d2a3a] placeholder-[#858c96] text-black dark:text-slate-200 dark:border-[#314051] border border-gray-200 text-sm rounded-[3px] focus:ring-[#3c54d9] focus:border-[#3c54d9] outline-none block w-full p-2.5 "
                            placeholder={t("holder-password")}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            required
                          />
                          <button
                            onClick={handleShowPassword}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                            type="button"
                          >
                            {showPassword ? <IoMdEye /> : <IoMdEyeOff />}
                          </button>
                        </div>
                        {touched.password && error.password && (
                          <p className="text-red-500 text-xs">
                            {error.password}
                          </p>
                        )}
                      </div>
                      <div
                        className="col-span-2 md:col-span-1"
                        ref={passwordverifyInput}
                      >
                        <label
                          htmlFor="passwordverify"
                          className="block mb-2 text-sm font-medium text-black dark:text-slate-200 "
                        >
                          {t("confirm_password")}
                          <span className="text-red-500">*</span>{" "}
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            name="passwordverify"
                            id="passwordverify"
                            className="bg-white dark:bg-[#1d2a3a] placeholder-[#858c96] text-black dark:text-slate-200 dark:border-[#314051] border border-gray-200 text-sm rounded-[3px] focus:ring-[#3c54d9] focus:border-[#3c54d9] outline-none block w-full p-2.5 "
                            placeholder={t("holder-confirm")}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            required
                          />
                          <button
                            onClick={handleShowPassword}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                            type="button"
                          >
                            {showPassword ? <IoMdEye /> : <IoMdEyeOff />}
                          </button>
                        </div>
                        {touched.passwordverify && error.passwordverify && (
                          <p className="text-red-500 text-xs">
                            {error.passwordverify}
                          </p>
                        )}
                      </div>
                    </>
                  )}

                  {userData.roles == "sadmin" && (
                    <div className="col-span-2" ref={tenantInput}>
                      <label
                        htmlFor="tenant"
                        className="block mb-2 text-sm font-medium text-black dark:text-slate-200 "
                      >
                        Tenant <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="tenant"
                        defaultValue={""}
                        required
                        className={`bg-white dark:bg-[#1d2a3a] placeholder-[#858c96] text-black dark:text-slate-200 dark:border-[#314051] border border-gray-200 text-sm rounded-[3px] focus:ring-[#3c54d9] focus:border-[#3c54d9] outline-none block w-full p-2.5`}
                      >
                        <option value={""} key={0} hidden disabled>
                          {t("select-tenant")}
                        </option>
                        {tenants.length > 0 ? (
                          tenants.map((tenant, index) => {
                            return (
                              <option key={index} value={tenant._id}>
                                {tenant.company}
                              </option>
                            );
                          })
                        ) : (
                          <option value={0}>Loading..</option>
                        )}
                      </select>
                    </div>
                  )}
                </div>

                <div className="col-span-2">
                  <label
                    htmlFor="notes"
                    className="mb-2 text-sm font-medium text-black dark:text-slate-200"
                  >
                    Notes
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    className="bg-gray-50 border dark:bg-slate-800 text-black dark:text-slate-200 dark:border-none border-gray-300 text-sm rounded-[3px] focus:ring-[#3c54d9] focus:border-[#3c54d9] outline-none block w-full p-2.5"
                    placeholder="Enter notes here"
                    onChange={(e) =>
                      setValues({ ...values, notes: e.target.value })
                    }
                  ></textarea>
                </div>
                <div className={`mt-3 ${modeModal == "Edit" && "pb-4"} `}>
                  <label
                    htmlFor="status"
                    className="flex flex-col md:flex-row gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      value=""
                      id="status"
                      name="status"
                      className="sr-only peer"
                    />
                    <span className="text-sm font-medium text-black dark:text-slate-200 ">
                      Status
                    </span>
                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4  rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white dark:bg-slate-800 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#3b50df]"></div>
                  </label>
                </div>

                {modeModal === "Edit" ? (
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="w-full bg-[#3b50df] hover:bg-blue-600 border border-indigo-700 text-white py-2 px-4 rounded text-nowrap"
                      disabled={crudLoading}
                    >
                      {crudLoading ? <LoadingCrud /> : t("save")}
                    </button>
                    <div
                      className="text-center hover:cursor-pointer w-full bg-indigo-700 hover:bg-indigo-600 border border-indigo-800 text-white py-2 px-4 rounded text-nowrap"
                      onClick={() => handleDelete(EditclientId)}
                    >
                      {t("delete")}
                    </div>
                  </div>
                ) : (
                  <button
                    type="submit"
                    className="w-full bg-[#3b50df] hover:bg-blue-700 border border-indigo-700 mt-5 text-white py-2 px-4 rounded-[3px]"
                    disabled={crudLoading}
                  >
                    {crudLoading ? <LoadingCrud /> : t("submit")}
                  </button>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
