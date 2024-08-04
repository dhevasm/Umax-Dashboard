"use client"

import React, { useState, useEffect } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { Route } from 'react-router-dom';

export default function TenantRegisterPage() {
    const searchParams = useSearchParams()
    const Router = useRouter()
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [timezone, setTimezone] = useState([])
    const [currency, setCurrency] = useState([])
    const [culture, setCulture] = useState([])
    const [Country, setCountry] = useState([])
    const [City, setCity] = useState([])
    const [alldial, setDial] = useState([])
    const [DialCountry, setDialCountry] = useState([])
    const [order_id, setOrder_id] = useState("")
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    companyAddress: '',
    companyEmail: '',
    companyContact: '',
    language: '',
    culture: '',
    timezone: '',
    currency: '',
    currencyPosition: "true",
    companyCountry: '',
    companyCity: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if(!searchParams.get('order_id')){
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Order ID not found. Please try again.',
        }).then(() => Router.push('/'));
    }
    
    async function checkOrderId(){
      const formDatacek = new URLSearchParams({
        order_id: searchParams.get('order_id'),
      }).toString();
  

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/token-from-order`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: formDatacek
        });
  
        if (!response.ok && searchParams.get('order_id') != "free") {
          const errorData = await response.json();
          console.error('Server Error:', errorData);
          console.log('Order id not found!'); 
          Router.push('/');
          return;
        }

        console.log("order id found");
        return;
      } catch (error) {
        console.error('Network Error:', error);
        alert('Network error occurred. Please try again.');
        Router.push('/');
        return;
      }
    }
    
    checkOrderId()
    setOrder_id(searchParams.get('order_id'))
}, [searchParams])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    let formErrors = {};

    if (formData.password !== formData.confirmPassword) {
      formErrors.confirmPassword = 'Passwords do not match';
    }
    if(formData.username.length < 3){
        formErrors.username = 'Username must be at least 3 characters';
    }
    if(formData.password.length < 6){
        formErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async(e) => {
    e.preventDefault();

    if (validateForm()) {
        // console.log(formData);
        const formDat = new FormData();
        formDat.append('username', formData.username);
        formDat.append('email', formData.email);
        formDat.append('password', formData.password);
        formDat.append('company', formData.companyName);
        formDat.append('companyemail', formData.companyEmail);
        formDat.append('companycontact', formData.companyContact);
        formDat.append('companyaddress', `${formData.companyAddress} - ${formData.companyCity} - ${formData.companyCountry}`);
        formDat.append('language', formData.language);
        formDat.append('culture', formData.culture);
        formDat.append('currency', formData.currency);
        formDat.append('currency_position', formData.currencyPosition == "true" ? true : false);
        formDat.append('subscription', searchParams.get('order_id') != "free" ? true : false);
        formDat.append('input_timezone', formData.timezone);
        
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/register-request`, formDat , {
            headers : {
                'accept' : 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then((response) => {
            const data = response.data
        if(data.IsError == false){
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Your request has been sent. Please wait for the confirmation email.',
            }).then(() => Router.push('/'));
        }else{
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: data.Message,
            })
        }
        }).catch((error) => {
          console.log(error)
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: error.response.data.detail,
            })
        })

        
      }else{
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Please check your form again',
        })
      }
  };

  async function getSelectFrontend(){
    await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/timezone`).then((response) => {
        setTimezone(response.data)
    })

    await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/currency`).then((response) => {
        setCurrency(response.data)
    })

    await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/culture`).then((response) => {
        setCulture(response.data)
    })

    await axios.get("https://countriesnow.space/api/v0.1/countries").then((response) => {
        setCountry(response.data.data)

    })
    // await axios.get("https://countriesnow.space/api/v0.1/countries/codes").then((response) => {
    //     setDial(response.data.data)
    // })
    }

    async function handleCityList(countryname){
        let citylist = []
        Country.map((item) => {
            if(item.country == countryname){
                citylist= item.cities
            }
        })
        // alldial.map((item) => {
        //     if(item.name == countryname){
        //         setDialCountry(item.dial_code)
        //         // console.log(item.dial_code)
        //     }
        // })
        setCity(citylist)
    }

    // useEffect(() => {
    //     document.getElementById("companyContact").value = DialCountry.slice(1)
    // }, [DialCountry])   

    useEffect(() => {
        getSelectFrontend()
    }, [])

  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center bg-bg-login bg-cover bg-no-repeat bg-left max-h-screen max-w-[100vw]">
      <div className="w-full max-w-4xl p-8 bg-white rounded-lg shadow-lg overflow-y-auto">
        <h1 className="mb-6 text-2xl font-bold text-center text-indigo-600">Register</h1>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Data Group */}
          <div>
            <h2 className="mb-4 text-xl font-semibold text-blue-800">User Data</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {['username'].map((key) => (
                <div key={key} className="col-span-1">
                  <label className="block mb-1 text-sm font-medium text-gray-700" htmlFor={key}>
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                  </label>
                  <input
                    type="text"
                    id={key}
                    name={key}
                    value={formData[key]}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                  {
                    errors.username && (
                      <p className="mt-2 text-sm text-red-600">{errors.username}</p>
                    )
                  }
                </div>
              ))}
              {['email'].map((key) => (
                <div key={key} className="col-span-1">
                  <label className="block mb-1 text-sm font-medium text-gray-700" htmlFor={key}>
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                  </label>
                  <input
                    type="email"
                    id={key}
                    name={key}
                    value={formData[key]}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
              ))}
              {['password', 'confirmPassword'].map((key) => (
                <div key={key} className="col-span-1 relative">
                  <label className="block mb-1 text-sm font-medium text-gray-700" htmlFor={key}>
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                  </label>
                  <input
                    type={(key === 'password' && showPassword) || (key === 'confirmPassword' && showConfirmPassword) ? 'text' : 'password'}
                    id={key}
                    name={key}
                    value={formData[key]}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                  <button
                    type="button"
                    className="absolute top-5 text-xl inset-y-0 right-0 flex items-center px-3 text-gray-600"
                    onClick={() => {
                      if (key === 'password') {
                        setShowPassword(!showPassword);
                      } else {
                        setShowConfirmPassword(!showConfirmPassword);
                      }
                    }}
                  >
                    {(key === 'password' && showPassword) || (key === 'confirmPassword' && showConfirmPassword) ? <FaEyeSlash/> : <FaEye/>}
                  </button> 
                  {key === 'confirmPassword' && errors.confirmPassword && 
                  (
                    <p className="mt-2 text-sm text-red-600">{errors.confirmPassword}</p>
                  )}
                  {
                    key === 'password' && errors.password && (
                      <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                    )
                  }
                </div>
              ))}
            </div>
          </div>

          {/* Company Data Group */}
          <div>
            <h2 className="mb-4 text-xl font-semibold text-blue-800">Company Profile</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {['companyName', 'companyAddress', 'companyEmail', 'companyContact'].map((key) => (
                <div key={key} className="col-span-1">
                  <label className="block mb-1 text-sm font-medium text-gray-700" htmlFor={key}>
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                  </label>
                  <input
                    type={key === 'companyContact' ? 'number' : (key === 'companyEmail' ? 'email' : 'text')}
                    id={key}
                    name={key}
                    value={formData[key]}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
              ))}
              <div className="col-span-1">
                <label className="block mb-1 text-sm font-medium text-gray-700" htmlFor="companyCountry">
                  Country
                </label>
                <select
                  id="companyCountry"
                  name="companyCountry"
                  value={formData.companyCountry}
                  onChange={(e) => {
                    handleChange(e);
                    handleCityList(e.target.value);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                  defaultValue={""}
                >
                  <option value="" hidden disabled>Select Country</option>
                  {  Country.map((country, index) => (
                    <option key={index} value={country.country}>
                      {country.country}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-span-1">
                <label className="block mb-1 text-sm font-medium text-gray-700" htmlFor="companyCity">
                  City
                </label>
                <select
                  id="companyCity"
                  name="companyCity"
                  value={formData.companyCity}
                  onChange={(e) => {
                    handleChange(e);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                  defaultValue={""}
                >
                  <option value="" hidden disabled>Select Country First</option>
                  {  City.map((city, index) => (
                    <option key={index} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Format Data Group */}
          <div>
            <h2 className="mb-4 text-xl font-semibold text-blue-800">Format</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="col-span-1">
                <label className="block mb-1 text-sm font-medium text-gray-700" htmlFor="language">
                  Language
                </label>
                <select
                  id="language"
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                  defaultValue={""}
                >
                  <option value="" hidden disabled>Select Language</option>
                  <option value="id">Indonesia</option>
                  <option value="en">English</option>
                </select>
              </div>
              <div className="col-span-1">
                <label className="block mb-1 text-sm font-medium text-gray-700" htmlFor="culture">
                  Culture
                </label>
                <select
                  id="culture"
                  name="culture"
                  value={formData.culture}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                  defaultValue={""}
                >
                  <option value="" hidden disabled>Select Culture</option>
                  {
                    culture.map((item, index) => (
                      <option key={index} value={item.cultureInfoCode}>
                        {item.country} ({item.cultureInfoCode})
                      </option>
                    ))
                  }
                </select>
              </div>
              <div className="col-span-1">
                <label className="block mb-1 text-sm font-medium text-gray-700" htmlFor="timezone">
                  Timezone
                </label>
                <select
                  id="timezone"
                  name="timezone"
                  value={formData.timezone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                  defaultValue={""}
                >
                  <option value="" hidden disabled>Select Timezone</option>
                  {
                    timezone.map((item, index) => (
                      <option key={index} value={item.timezone}>
                        {item.timezone}
                      </option>
                    ))
                  }
                </select>
              </div>
              <div className="col-span-1">
                <label className="block mb-1 text-sm font-medium text-gray-700" htmlFor="currency">
                  Currency
                </label>
                <select
                  id="currency"
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                  defaultValue={""}
                >
                  <option value="" hidden disabled>Select Currency</option>
                  {
                    currency.map((item, index) => (
                      <option key={index} value={item.currency.split(' - ')[0]}>
                        {item.currency}
                      </option>
                    ))
                  }
                </select>
              </div>
              <div className='flex flex-col gap-3'>
              <h2 className="mb-4 text-xl font-semibold text-blue-800">Currency Position</h2>
              <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="currencyPositionLeft"
                      name="currencyPosition"
                      value="true"
                      checked={formData.currencyPosition === "true"}
                      onChange={handleChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <label htmlFor="currencyPositionLeft" className="ml-2 block text-sm font-medium text-gray-700">
                      Left ($-)
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="currencyPositionRight"
                      name="currencyPosition"
                      value="false"
                      checked={formData.currencyPosition === "false"}
                      onChange={handleChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <label htmlFor="currencyPositionRight" className="ml-2 block text-sm font-medium text-gray-700">
                      Right (-$)
                    </label>
                  </div>
                </div>
              </div>
              </div>
            </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="w-full px-6 py-2 font-bold text-white bg-indigo-600 rounded hover:bg-indigo-700 focus:outline-none focus:shadow-outline"
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
