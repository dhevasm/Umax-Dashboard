"use client";

import React, { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import Swal from "sweetalert2";
import { useSearchParams, useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslations } from "next-intl";

export default function TenantRegisterPage() {
  const searchParams = useSearchParams();
  const Router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [timezone, setTimezone] = useState([]);
  const [currency, setCurrency] = useState([]);
  const [culture, setCulture] = useState([]);
  const [Country, setCountry] = useState([]);
  const [City, setCity] = useState([]);
  const [currentSegment, setCurrentSegment] = useState(1);
  const t = useTranslations('tenant-register');
  const [order_id, setOrder_id] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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

  useEffect(() => {
    async function getSelectFrontend() {
      await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/timezone`).then((response) => {
        setTimezone(response.data);
      });

      await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/currency`).then((response) => {
        setCurrency(response.data);
      });

      await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/culture`).then((response) => {
        setCulture(response.data);
      });

      await axios.get("https://countriesnow.space/api/v0.1/countries").then((response) => {
        setCountry(response.data.data);
      });
    }

    getSelectFrontend();
  }, []);

  const handleCityList = (countryname) => {
    let citylist = [];
    Country.map((item) => {
      if (item.country === countryname) {
        citylist = item.cities;
      }
    });
    setCity(citylist);
  };

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      companyName: "",
      companyAddress: "",
      companyEmail: "",
      companyContact: "",
      language: "",
      culture: "",
      timezone: "",
      currency: "",
      currencyPosition: "true",
      companyCountry: "",
      companyCity: "",
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .min(3, t('useername-error2'))
        .required(t('username-error')),
      email: Yup.string().email(t('email-error2')).required(t('email-error')),
      password: Yup.string()
        .min(6, t('password-error2'))
        .required(t('password-error')),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], t('confirm-password-error2'))
        .required(t('confirm-password-error')),
      companyName: Yup.string().required(t('company-name-error')),
      companyAddress: Yup.string().required(t('company-address-error')),
      companyEmail: Yup.string().email(t('company-email-error2')).required(t('company-email-error')),
      companyContact: Yup.string().required(t('company-contact-error')),
      language: Yup.string().required(t('language-error')),
      culture: Yup.string().required(t('culture-error')),
      timezone: Yup.string().required(t('timezone-error')),
      currency: Yup.string().required(t('currency-error')),
      companyCountry: Yup.string().required(t('company-country-error')),
      companyCity: Yup.string().required(t('company-city-error')),
    }),
    validateOnChange: true, // Validate on every field change
    validateOnBlur: true,   // Validate on blur (default behavior)
    onSubmit: async (values) => {
      setIsLoading(true);
      const formDat = new FormData();
      formDat.append("username", values.username);
      formDat.append("email", values.email);
      formDat.append("password", values.password);
      formDat.append("company", values.companyName);
      formDat.append("companyemail", values.companyEmail);
      formDat.append("companycontact", values.companyContact);
      formDat.append(
        "companyaddress",
        `${values.companyAddress} - ${values.companyCity} - ${values.companyCountry}`
      );
      formDat.append("language", values.language);
      formDat.append("culture", values.culture);
      formDat.append("currency", values.currency);
      formDat.append(
        "currency_position",
        values.currencyPosition === "true" ? true : false
      );
      formDat.append(
        "subscription",
        searchParams.get("order_id") === "free" ? false : true
      );
      formDat.append("input_timezone", values.timezone);
  
      await axios
        .post(`${process.env.NEXT_PUBLIC_API_URL}/register-request`, formDat, {
          headers: {
            accept: "application/json",
            "Content-Type": "application/x-www-form-urlencoded",
          },
        })
        .then(async (response) => {
          const data = response.data;
          if (data.IsError === false) {
            const response = await axios.delete(
              `${process.env.NEXT_PUBLIC_API_URL}/delete-transaction?order_id=${searchParams.get(
                "order_id"
              )}`
            );
  
            if (response.data.IsError === false) {
              setIsLoading(false);
              Swal.fire({
                icon: "success",
                title: "Success",
                text: t('success'),
              }).then(() => Router.push("/"));
            } else {
              setIsLoading(false);
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: t('error'),
              }).then(() => Router.push("/"));
            }
          } else {
            setIsLoading(false);
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: t('error2'),
            });
          }
        });
    },
  });

  function LoadingCircle(){
      return(
          <div className="flex justify-center items-center h-4">
              <div className="relative">
                  <div className="w-4 h-4 border-4 border-white rounded-full border-t-transparent animate-spin"></div>
              </div>
          </div>
      )
  }
  
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-bg-login bg-cover bg-no-repeat bg-left max-h-screen max-w-[100vw]">
      <div className="w-full h-[50%] max-w-md p-8 bg-white rounded-lg shadow-lg overflow-hidden">
        <h1 className="mb-6 text-2xl font-semibold text-center text-indigo-600 uppercase">
          {t('registration')}
        </h1>
        <form onSubmit={formik.handleSubmit} className="space-y-8">
          {/* Segment 1: User Data */}
          <div
            className={`transition-opacity duration-300 ${
              currentSegment === 1 ? "block" : "hidden"
            }`}
          >
            <h2 className="mb-4 text-xl font-semibold text-blue-800">
              {t('user-data')}
            </h2>
            <div className="grid grid-cols-1 gap-3">
              <div>
                <label
                  className="block mb-1 text-sm font-medium text-gray-700"
                  htmlFor="username"
                >
                  {t('username')}
                </label>
                <input
                  type="text"
                  id="username"
                  {...formik.getFieldProps("username")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
                {formik.touched.username && formik.errors.username ? (
                  <p className="text-sm text-red-600">
                    {formik.errors.username}
                  </p>
                ) : null}
              </div>
              <div>
                <label
                  className="block mb-1 text-sm font-medium text-gray-700"
                  htmlFor="email"
                >
                  {t('email')}
                </label>
                <input
                  type="email"
                  id="email"
                  {...formik.getFieldProps("email")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
                {formik.touched.email && formik.errors.email ? (
                  <p className="text-sm text-red-600">
                    {formik.errors.email}
                  </p>
                ) : null}
              </div>
              <div className="relative">
                <label
                  className="block mb-1 text-sm font-medium text-gray-700"
                  htmlFor="password"
                >
                  {t('password')}
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  {...formik.getFieldProps("password")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
                <button
                  type="button"
                  className="absolute top-5 text-xl inset-y-0 right-0 flex items-center px-3 text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
                {formik.touched.password && formik.errors.password ? (
                  <p className="text-sm text-red-600">
                    {formik.errors.password}
                  </p>
                ) : null}
              </div>
              <div className="relative">
                <label
                  className="block mb-1 text-sm font-medium text-gray-700"
                  htmlFor="confirmPassword"
                >
                  {t('confirm-password')}
                </label>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  {...formik.getFieldProps("confirmPassword")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none                   focus:border-indigo-500"
                  required
                />
                <button
                  type="button"
                  className="absolute top-5 text-xl inset-y-0 right-0 flex items-center px-3 text-gray-600"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
                {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
                  <p className="text-sm text-red-600">
                    {formik.errors.confirmPassword}
                  </p>
                ) : null}
              </div>
            </div>
          </div>

          {/* Segment 2: Company Profile */}
          <div
            className={`transition-opacity duration-300 ${
              currentSegment === 2 ? "block" : "hidden"
            }`}
          >
            <h2 className="mb-4 text-xl font-semibold text-blue-800">
              {t('company-profile')}
            </h2>
            <div className="grid grid-cols-1 gap-3">
              <div>
                <label
                  className="block mb-1 text-sm font-medium text-gray-700"
                  htmlFor="companyName"
                >
                  {t('company-name')}
                </label>
                <input
                  type="text"
                  id="companyName"
                  {...formik.getFieldProps("companyName")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
                {formik.touched.companyName && formik.errors.companyName ? (
                  <p className="text-sm text-red-600">
                    {formik.errors.companyName}
                  </p>
                ) : null}
              </div>
              <div>
                <label
                  className="block mb-1 text-sm font-medium text-gray-700"
                  htmlFor="companyAddress"
                >
                  {t('company-address')}
                </label>
                <input
                  type="text"
                  id="companyAddress"
                  {...formik.getFieldProps("companyAddress")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
                {formik.touched.companyAddress && formik.errors.companyAddress ? (
                  <p className="text-sm text-red-600">
                    {formik.errors.companyAddress}
                  </p>
                ) : null}
              </div>
              <div className="flex gap-2">
                <div className="w-full">
                  <label className="w-full block mb-1 text-sm font-medium text-gray-700">
                    {t('company-country')}
                  </label>
                  <select
                    id="companyCountry"
                    {...formik.getFieldProps("companyCountry")}
                    onChange={(
                      e) => {
                      formik.handleChange(e);
                      handleCityList(e.target.value);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  >
                    <option value="">{t('select-country')}</option>
                    {culture.length > 0 ? (
                      Country.map((item, index) => (
                        <option key={index} value={item.country}>
                          {item.country}
                        </option>
                      ))
                    )
                    : (
                      <option value="" disabled>{t('getting-country-list')}...{}</option>
                    )
                    }
                  </select>
                  {formik.touched.companyCountry && formik.errors.companyCountry ? (
                    <p className="text-sm text-red-600">
                      {formik.errors.companyCountry}
                    </p>
                  ) : null}
                </div>
                <div className="w-full">
                  <label className="w-full block mb-1 text-sm font-medium text-gray-700">
                    {t('company-city')}
                  </label>
                  <select
                    id="companyCity"
                    {...formik.getFieldProps("companyCity")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  >
                    <option value="">{t('select-city')}</option>
                    {City.length > 0 ? (
                      City.map((item, index) => (
                        <option key={index} value={item}>
                          {item}
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>{t('getting-city-list')}...</option>
                    )}
                  </select>
                  {formik.touched.companyCity && formik.errors.companyCity ? (
                    <p className="text-sm text-red-600">
                      {formik.errors.companyCity}
                    </p>
                  ) : null}
                </div>
              </div>
              <div>
                <label
                  className="block mb-1 text-sm font-medium text-gray-700"
                  htmlFor="companyEmail"
                >
                  {t('company-email')}
                </label>
                <input
                  type="email"
                  id="companyEmail"
                  {...formik.getFieldProps("companyEmail")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
                {formik.touched.companyEmail && formik.errors.companyEmail ? (
                  <p className="text-sm text-red-600">
                    {formik.errors.companyEmail}
                  </p>
                ) : null}
              </div>
              <div>
                <label
                  className="block mb-1 text-sm font-medium text-gray-700"
                  htmlFor="companyContact"
                >
                  {t('company-contact')}
                </label>
                <input
                  type="number"
                  id="companyContact"
                  {...formik.getFieldProps("companyContact")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
                {formik.touched.companyContact && formik.errors.companyContact ? (
                  <p className="text-sm text-red-600">
                    {formik.errors.companyContact}
                  </p>
                ) : null}
              </div>
            </div>
          </div>

          {/* Segment 3: Format */}
          <div
            className={`transition-opacity duration-300 ${
              currentSegment === 3 ? "block" : "hidden"
            }`}
          >
            <h2 className="mb-4 text-xl font-semibold text-blue-800">
              {t('format')}
            </h2>
            <div className="grid grid-cols-1 gap-3">
              <div>
                <label
                  className="block mb-1 text-sm font-medium text-gray-700"
                  htmlFor="language"
                >
                  {t('language')}
                </label>
                <select
                  name="language" 
                  id="language"
                  {...formik.getFieldProps("language")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="id">{t('indonesian')}</option>
                  <option value="en">{t('english')}</option>
                </select>
                {formik.touched.language && formik.errors.language ? (
                  <p className="text-sm text-red-600">
                    {formik.errors.language}
                  </p>
                ) : null}
              </div>
              <div>
                <label
                  className="block mb-1 text-sm font-medium text-gray-700"
                  htmlFor="culture"
                >
                  {t('culture')}
                </label>
                <select 
                  name="culture" 
                  id="culture" 
                  {...formik.getFieldProps("culture")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-indigo-500"
                >
                  <option value="" selected disabled>{t('select-culture')}</option>
                  {culture.length > 0 ? 
                    culture.map((item, index) => (
                      <option key={index} value={item.cultureInfoCode}>{item.country}</option>
                  ))
                  :
                    <option value="" disabled>{t('getting-culture-list')}...{}</option>
                  }
                </select>
                {formik.touched.culture && formik.errors.culture ? (
                  <p className="text-sm text-red-600">
                    {formik.errors.culture}
                  </p>
                ) : null}
              </div>
              <div>
                <label
                  className="block mb-1 text-sm font-medium text-gray-700"
                  htmlFor="timezone"
                >
                  {t('timezone')}
                </label>
                <select 
                  name="timezone" 
                  id="timezone" 
                  {...formik.getFieldProps("timezone")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-indigo-500"
                >
                  <option value="" selected disabled>{t('select-timezone')}</option>
                  {timezone.length > 0 ? 
                    timezone.map((item, index) => (
                      <option key={index} value={item.timezone}>{item.timezone}</option>
                  ))
                  :
                    <option value="" disabled>{t('getting-timezone-list')}...</option>
                  }
                </select>
                {formik.touched.timezone && formik.errors.timezone ? (
                  <p className="text-sm text-red-600">
                    {formik.errors.timezone}
                  </p>
                ) : null}
              </div>
              <div>
                <label
                  className="block mb-1 text-sm font-medium text-gray-700"
                  htmlFor="currency"
                >
                  {t('currency')}
                </label>
                <select 
                  name="currency" 
                  id="currency" 
                  {...formik.getFieldProps("currency")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-indigo-500"
                >
                  <option value="" selected disabled>{t('select-currency')}</option>
                  {currency.length > 0 ? 
                    currency.map((item, index) => {
                      const [currencyCode, ...currencyNameParts] = item.currency.split('  -  ');
                      return (
                          <option key={index} value={currencyCode.trim()}>
                              {item.currency}
                          </option>
                      );
                    })
                  :
                    <option value="" disabled>{t('getting-currency-list')}...</option>
                  }
                </select>
                {formik.touched.currency && formik.errors.currency ? (
                  <p className="text-sm text-red-600">
                    {formik.errors.currency}
                  </p>
                ) : null}
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  {t('currency-position')}
                </label>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="currencyPosition"
                      value="true"
                      checked={formik.values.currencyPosition === "true"}
                      onChange={() => formik.setFieldValue("currencyPosition", "true")}
                      className="form-radio h-4 w-4 text-indigo-600"
                    />
                    <span>{t('before-amount')}</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="currencyPosition"
                      value="false"
                      checked={formik.values.currencyPosition === "false"}
                      onChange={() => formik.setFieldValue("currencyPosition", "false")}
                      className="form-radio h-4 w-4 text-indigo-600"
                    />
                    <span>{t('after-amount')}</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-end items-center gap-2 mt-6">
            {currentSegment > 1 && (
              <button
                type="button"
                onClick={() => setCurrentSegment(currentSegment - 1)}
                className="w-full py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {t('back')}
              </button>
            )}

            {currentSegment < 3 && (
              <button
                type="button"
                disabled={
                  (currentSegment === 1 &&
                    (formik.errors.name ||
                    formik.errors.email ||
                    formik.errors.password ||
                    formik.errors.confirmPassword)) ||
                  (currentSegment === 2 &&
                    (formik.errors.companyName ||
                    formik.errors.companyEmail ||
                    formik.errors.companyAddress ||
                    formik.errors.companyCountry ||
                    formik.errors.companyCity ||
                    formik.errors.companyContact))
                }
                onClick={() => setCurrentSegment(currentSegment + 1)}
                className="disabled:cursor-not-allowed w-full py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {t('next')}
              </button>
            )}

            {currentSegment === 3 && (
              <button
                type="submit"
                className="w-full py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                {isLoading ? <LoadingCircle /> : t('submit')}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
