import { useTranslations } from "next-intl";
import React from "react";
import axios from "axios";
import { useState,useEffect, useContext } from "react";
import Image from "next/image";
import Snap from "midtrans-client/lib/snap";
import { useRouter } from "next/navigation";

const PricingSection = () => {
  const t = useTranslations("landing");

  const Router = useRouter();

  const [showModal, setShowModal] = useState(false);
  const [Subscribe, setSubscribe] = useState(1);
  const [snapToken, setSnapToken] = useState(null);
  const [formValues, setFormValues] = useState({
      first_name: '',
      last_name: '',
      email: '',
      phone_number: '',
  });

  const handleChange = (event) => {
      const { name, value } = event.target;
      setFormValues({
          ...formValues,
          [name]: value,
      });
  };

  const handleSubmit = async (event) => {
      let price = [
        0,
        3200000,
        4000000
      ]

      event.preventDefault();
      const url = process.env.NEXT_PUBLIC_API_URL;

      // Convert form values to URL-encoded format
      const formData = new URLSearchParams({
          first_name: formValues.first_name,
          last_name: formValues.last_name,
          email: formValues.email,
          phone_number: formValues.phone_number,
          price: price[Subscribe - 1],
          product_name : Subscribe === 1 ? 'Personal plan' : Subscribe === 2 ? 'Business plan' : 'Professional plan',
      }).toString();

      try {
          const response = await fetch(`${url}/payment`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/x-www-form-urlencoded',
              },
              body: formData,
          });

          if (!response.ok) {
              const errorData = await response.json();
              console.error('Server Error:', errorData);
              alert('Your email has aready purchased a plan!');
              return;
          }

          const data = await response.json();
          setSnapToken(data.token);
      } catch (error) {
          console.error('Network Error:', error);
          alert('Network error occurred. Please try again.');
      }
  };

  const openModal = (Subscribe) => {
    setSubscribe(Subscribe);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    if(snapToken !== null) {
      handlePayment(snapToken)
    }
  }, [snapToken])

  const handlePayment = (token) => {
    closeModal()
    snap.pay(token)
  }

  const uncompletedpayment = async(order_id) =>{
    const url = process.env.NEXT_PUBLIC_API_URL;
    const formData = new URLSearchParams({
      order_id: order_id,
    }).toString();

    try {
      const response = await fetch(`${url}/token-from-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server Error:', errorData);
        alert('Order id not found!');
        return;
      }

      const data = await response.json();
      setSnapToken(data.token);
    } catch (error) {
      console.error('Network Error:', error);
      alert('Network error occurred. Please try again.');
    }
  }

  useEffect(() => {
    // Mengaktifkan scroll-blocking ketika modal aktif
    document.body.style.overflow = showModal ? 'hidden' : 'auto';

    // Bersihkan gaya saat komponen unmount
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showModal]);

  return (
    // ====== Pricing Section Start ======
    <section className="relative overflow-hidden dark:bg-slate-900 bg-white pt-20 pb-12 lg:pt-[120px] lg:pb-[90px] px-2 md:px-20" id="payment">
      <div className="container mx-auto">
        <div className="flex flex-wrap -mx-4">  
          <div className="w-full px-4">
            <div className="mx-auto mb-[60px] max-w-[510px] text-center">
              <span className="block mb-2 text-lg font-semibold text-blue-600">
                {t('pricing-table')}
              </span>
              <h2 className="mb-3 text-3xl leading-[1.208] font-bold text-dark dark:text-white sm:text-4xl md:text-[40px]">
                {t('our-pricing-plan')}
              </h2>
              <p className="text-base text-gray-500 dark:text-gray-300">
                {t('pricing-desc')}
                <br />
                <br />
                {t('have-an-order-id')} <a onClick={() => {
                  const order_id = prompt("Enter your order ID");
                  uncompletedpayment(order_id)
                }} className="text-blue-500 underline hover:cursor-pointer">{t('click-me')}</a>
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap justify-center -mx-4">
          <div className="w-full px-4 md:w-1/2 lg:w-1/2">
            <div className="relative z-10 mb-10 overflow-hidden rounded-[10px] border-2 border-stroke dark:border-gray-600 bg-white dark:bg-slate-800 py-10 px-8 shadow-pricing sm:p-12 lg:py-10 lg:px-6 xl:p-[50px]">
              <span className="block mb-3 text-lg font-semibold text-blue-600">
                {t('free-trial')}
              </span>
              <h2 className="mb-5 text-[42px] font-bold text-dark dark:text-white">
                <span>{t('free')}</span>
              </h2>
              <p className="pb-8 mb-8 text-base border-b border-stroke dark:border-gray-600 text-body-color dark:text-gray-300">
              {t('free-desc')}
              </p>
              <div className="mb-9 flex flex-col gap-[14px]">
                <p className="text-base text-body-color dark:text-gray-300">{t('30-day-trial-period')}</p>
                <p className="text-base text-body-color dark:text-gray-300">

                  1 {t('admin-per-company')}
                </p>
                <p className="text-base text-body-color dark:text-gray-300">
                  2 {t('staff-per-company')}
                </p>
                <p className="text-base text-body-color dark:text-gray-300">
                  {t('maximum')} 3 {t('accounts-per-company')}
                </p>
                <p className="text-base text-body-color dark:text-gray-300">
                  {t('maximum')} 2 {t('campaigns-per-account')}
                </p>
                <p className="text-base text-body-color dark:text-gray-300">
                  {t('maximum')} 6 {t('metrics-per-company')}
                </p>
                <p className="text-base text-body-color dark:text-gray-300">
                  {t('unlimited-clients')}
                </p>
              </div>
              <a
                onClick={(e) => {
                    e.currentTarget.innerHTML = "Loading..."
                    Router.push('/en/tenant-register?order_id=free')
                }}
                className=" hover:cursor-pointer block w-full p-3 text-base dark:text-white font-medium text-center text-white transition rounded-md bg-blue-600 hover:bg-opacity-90"
              >
                {t('start-free-trial')}
              </a>

              <div>
                <span className="absolute right-0 top-7 z-[-1]">
                  <svg
                    width="77"
                    height="172"
                    viewBox="0 0 77 172"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="86" cy="86" r="86" fill="url(#paint0_linear)" />
                    <defs>
                      <linearGradient
                        id="paint0_linear"
                        x1="86"
                        y1="0"
                        x2="86"
                        y2="172"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stopColor="#3056D3" stopOpacity="0.09" />
                        <stop offset="1" stopColor="#C4C4C4" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                  </svg>
                </span>
                <span className="absolute right-0 top-7 z-[-1]">
                  <svg
                    width="77"
                    height="172"
                    viewBox="0 0 77 172"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="86" cy="86" r="86" fill="url(#paint0_linear)" />
                    <defs>
                      <linearGradient
                        id="paint0_linear"
                        x1="86"
                        y1="0"
                        x2="86"
                        y2="172"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stopColor="#3056D3" stopOpacity="0.09" />
                        <stop offset="1" stopColor="#C4C4C4" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                  </svg>
                </span>
                <span className="absolute right-4 top-4 z-[-1]">
                <svg
                  width="51"
                  height="50"
                  viewBox="0 0 51 50"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M45.9473 17.2656H41.2598V8.125C41.2598 5.46875 39.1504 3.35938 36.4941 3.35938H10.7129C8.05664 3.35938 5.94727 5.46875 5.94727 8.125V21.7969C5.47852 22.1875 5.08789 22.7344 4.85352 23.4375L1.96289 37.5C1.80664 38.2813 2.04102 39.1406 2.58789 39.7656C3.05664 40.3906 3.83789 40.7031 4.61914 40.7031H29.7754V43.4375C29.7754 45.2344 31.2598 46.7188 33.0566 46.7188H45.9473C47.7441 46.7188 49.2285 45.2344 49.2285 43.4375V20.5469C49.2285 18.75 47.7441 17.2656 45.9473 17.2656ZM5.63477 37.1875L8.21289 24.7656H8.60352H29.8535V37.1875H5.63477ZM29.7754 20.5469V21.25H9.46289V8.125C9.46289 7.42187 10.0098 6.875 10.7129 6.875H36.4941C37.1973 6.875 37.7441 7.42187 37.7441 8.125V17.2656H33.0566C31.2598 17.2656 29.7754 18.75 29.7754 20.5469ZM45.7129 43.125H33.291V20.7812H45.7129V43.125Z"
                    fill="#3758F9"
                  />
                  <path
                    d="M37.7441 26.7969H41.6504C42.5879 26.7969 43.4473 26.0156 43.4473 25C43.4473 24.0625 42.666 23.2031 41.6504 23.2031H37.7441C36.8066 23.2031 35.9473 23.9844 35.9473 25C35.9473 25.9375 36.7285 26.7969 37.7441 26.7969Z"
                    fill="#3758F9"
                  />
                  <path
                    d="M39.541 38.9063C39.4629 38.9063 39.3066 38.9844 39.2285 38.9844C39.1504 39.0625 38.9941 39.0625 38.916 39.1406C38.8379 39.2188 38.7598 39.2969 38.6816 39.375C38.3691 39.6875 38.1348 40.1563 38.1348 40.625C38.1348 41.0938 38.291 41.5625 38.6816 41.875C38.7598 41.9531 38.8379 42.0313 38.916 42.1094C38.9941 42.1875 39.1504 42.2656 39.2285 42.2656C39.3066 42.3438 39.4629 42.3438 39.541 42.3438C39.6191 42.3438 39.7754 42.3438 39.8535 42.3438C40.3223 42.3438 40.791 42.1875 41.1035 41.7969C41.416 41.4844 41.6504 41.0156 41.6504 40.5469C41.6504 40.0781 41.4941 39.6094 41.1035 39.2969C40.7129 38.9844 40.0879 38.8281 39.541 38.9063Z"
                    fill="#3758F9"
                  />
                </svg>
                </span>
              </div>
            </div>
          </div>
          <div className="w-full px-4 md:w-1/2 lg:w-1/2">
            <div className="relative z-10 mb-10 overflow-hidden rounded-[10px] border-2 border-stroke dark:border-gray-600 bg-white dark:bg-slate-800 py-10 px-8 shadow-pricing sm:p-12 lg:py-10 lg:px-6 xl:p-[50px]">
              <span className="block mb-3 text-lg font-semibold text-blue-600">
                {t('business')}
              </span>
              <h2 className="mb-5 text-[42px] font-bold text-dark dark:text-white">
                <span>$199</span>
                <span className="text-base font-medium text-body-color dark:text-gray-300">
                  / {t('year')}
                </span>
              </h2>
              <p className="pb-8 mb-8 text-base border-b border-stroke dark:border-gray-600 text-body-color dark:text-gray-300">

              {t('business-desc')}
              </p>
              <div className="mb-9 flex flex-col gap-[14px]">
                <p className="text-base text-body-color dark:text-gray-300">
                {t('1-year-trial')}
                </p>
                <p className="text-base text-body-color dark:text-gray-300">
                {t('unlimited-admins')}
                </p>
                <p className="text-base text-body-color dark:text-gray-300">
                {t('unlimited-staffs')}
                </p>
                <p className="text-base text-body-color dark:text-gray-300">
                {t('unlimited-accounts')}
                </p>
                <p className="text-base text-body-color dark:text-gray-300">
                {t('unlimited-campaigns')}
                </p>
                <p className="text-base text-body-color dark:text-gray-300">
                {t('unlimited-metrics')}
                </p>
                <p className="text-base text-body-color dark:text-gray-300">
                  {t('unlimited-clients')}
                </p>
              </div>
              <a
                onClick={() => openModal(2)}
                className="hover:cursor-pointer block w-full p-3 text-base dark:text-white font-medium text-center text-white transition rounded-md bg-blue-600 hover:bg-opacity-90"
              >
                {t('choose-business')}
              </a>
              <div>
                <span className="absolute right-0 top-7 z-[-1]">
                  <svg
                    width="77"
                    height="172"
                    viewBox="0 0 77 172"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="86" cy="86" r="86" fill="url(#paint0_linear)" />
                    <defs>
                      <linearGradient
                        id="paint0_linear"
                        x1="86"
                        y1="0"
                        x2="86"
                        y2="172"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stopColor="#3056D3" stopOpacity="0.09" />
                        <stop offset="1" stopColor="#C4C4C4" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                  </svg>
                </span>
                <span className="absolute right-4 top-4 z-[-1]">
                <svg
                  width="51"
                  height="50"
                  viewBox="0 0 51 50"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M48.1348 34.7656C47.1191 31.4062 43.7598 29.5312 40.5566 30.4687C37.9004 31.25 34.2285 32.3437 31.3379 33.2031C31.5723 32.2656 31.416 31.4844 31.1816 30.8594C30.4004 28.9844 28.3691 28.125 26.5723 28.125H18.6816C18.0566 28.125 17.3535 27.8125 16.6504 27.1875C15.791 26.4062 14.6191 25.9375 13.4473 25.9375H7.11914C4.30664 25.9375 1.96289 28.3594 1.96289 31.3281V41.4844C1.96289 44.5312 4.30664 46.9531 7.19727 46.9531H14.9316C15.8691 46.9531 16.8848 46.6406 17.7441 46.0938C20.0098 47.3438 22.5879 47.9688 25.166 47.9688C26.7285 47.9688 28.291 47.7344 29.6973 47.2656L43.916 42.9688H43.9941C48.291 41.3281 48.916 37.5781 48.1348 34.7656ZM7.19727 43.4375C6.25977 43.4375 5.47852 42.5781 5.47852 41.4844V31.3281C5.47852 30.3125 6.18164 29.4531 7.11914 29.4531H13.5254C13.916 29.4531 14.2285 29.6094 14.3848 29.7656C14.6191 30 14.8535 30.1562 15.0879 30.3125V43.3594C15.0098 43.3594 15.0098 43.3594 14.9316 43.3594H7.19727V43.4375ZM42.8223 39.6094L28.5254 43.9844C27.4316 44.2969 26.2598 44.5313 25.0098 44.5313C22.9785 44.5313 21.0254 43.9844 19.3066 43.0469L18.5254 42.6562V31.7187C18.6035 31.7187 18.6035 31.7187 18.6816 31.7187H26.6504C27.3535 31.7187 27.9004 32.0312 27.9785 32.2656C28.0566 32.5 27.9004 33.3594 26.2598 34.9219L25.2441 35.8594L25.9473 37.0313C26.6504 38.2813 27.3535 38.0469 30.0879 37.2656C31.3379 36.875 33.0566 36.4063 34.7754 35.9375C38.1348 34.9219 41.5723 33.9063 41.5723 33.9063C42.9004 33.5156 44.3066 34.375 44.7754 35.8594C45.166 37.1094 45.0879 38.75 42.8223 39.6094Z"
                    fill="#3758F9"
                  />
                  <path
                    d="M47.4316 17.6563H45.4785V3.75C45.4785 2.8125 44.6973 1.95312 43.6816 1.95312C42.666 1.95312 41.9629 2.8125 41.9629 3.75V17.6563H37.666V6.09375C37.666 5.15625 36.8848 4.29688 35.8691 4.29688C34.8535 4.29688 34.1504 5.15625 34.1504 6.09375V17.6563H29.8535V10C29.8535 9.0625 29.0723 8.20313 28.0566 8.20313C27.041 8.20313 26.2598 8.98438 26.2598 10V17.6563H25.0879C24.1504 17.6563 23.291 18.4375 23.291 19.4531C23.291 20.4688 24.0723 21.25 25.0879 21.25H47.4316C48.3691 21.25 49.2285 20.4688 49.2285 19.4531C49.2285 18.4375 48.3691 17.6563 47.4316 17.6563Z"
                    fill="#3758F9"
                  />
                </svg>
                </span>
              </div>
            </div>
          </div>
          {/* <div className="w-full px-4 md:w-1/2 lg:w-1/3">
            <div className="relative z-10 mb-10 overflow-hidden rounded-[10px] border-2 border-stroke dark:border-gray-600 bg-white dark:bg-slate-800 py-10 px-8 shadow-pricing sm:p-12 lg:py-10 lg:px-6 xl:p-[50px]">
              <span className="block mb-3 text-lg font-semibold text-blue-600">
                Coming Soon
              </span>
              <h2 className="mb-5 text-[42px] font-bold text-dark dark:text-white">
                <span>$256</span>
                <span className="text-base font-medium text-body-color dark:text-gray-300">
                  / year
                </span>
              </h2>
              <p className="pb-8 mb-8 text-base border-b border-stroke dark:border-gray-600 text-body-color dark:text-gray-300">
                Coming soon
              </p>
              <div className="mb-9 flex flex-col gap-[14px]">
                <p className="text-base text-body-color dark:text-gray-300">
                  Unlimited Users
                </p>
                <p className="text-base text-body-color dark:text-gray-300">
                  All UI components
                </p>
                <p className="text-base text-body-color dark:text-gray-300">
                  Lifetime access
                </p>
                <p className="text-base text-body-color dark:text-gray-300">
                  Free updates
                </p>
                <p className="text-base text-body-color dark:text-gray-300">
                  Use on Unlimited project
                </p>
                <p className="text-base text-body-color dark:text-gray-300">
                  12 Months support
                </p>
              </div>
              <a
                onClick={() => openModal(3)}
                className="hover:cursor-pointer block w-full p-3 text-base dark:text-white font-medium text-center text-white transition rounded-md bg-blue-600 hover:bg-opacity-90"
              >
                Choose Professional
              </a>

              <div>
                <span className="absolute right-0 top-7 z-[-1]">
                  <svg
                    width="77"
                    height="172"
                    viewBox="0 0 77 172"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="86" cy="86" r="86" fill="url(#paint0_linear)" />
                    <defs>
                      <linearGradient
                        id="paint0_linear"
                        x1="86"
                        y1="0"
                        x2="86"
                        y2="172"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stopColor="#3056D3" stopOpacity="0.09" />
                        <stop offset="1" stopColor="#C4C4C4" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                  </svg>
                </span>
                <span className="absolute right-4 top-4 z-[-1]">
                <svg
                  width="51"
                  height="50"
                  viewBox="0 0 51 50"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M45.9473 17.2656H41.2598V8.125C41.2598 5.46875 39.1504 3.35938 36.4941 3.35938H10.7129C8.05664 3.35938 5.94727 5.46875 5.94727 8.125V21.7969C5.47852 22.1875 5.08789 22.7344 4.85352 23.4375L1.96289 37.5C1.80664 38.2813 2.04102 39.1406 2.58789 39.7656C3.05664 40.3906 3.83789 40.7031 4.61914 40.7031H29.7754V43.4375C29.7754 45.2344 31.2598 46.7188 33.0566 46.7188H45.9473C47.7441 46.7188 49.2285 45.2344 49.2285 43.4375V20.5469C49.2285 18.75 47.7441 17.2656 45.9473 17.2656ZM5.63477 37.1875L8.21289 24.7656H8.60352H29.8535V37.1875H5.63477ZM29.7754 20.5469V21.25H9.46289V8.125C9.46289 7.42187 10.0098 6.875 10.7129 6.875H36.4941C37.1973 6.875 37.7441 7.42187 37.7441 8.125V17.2656H33.0566C31.2598 17.2656 29.7754 18.75 29.7754 20.5469ZM45.7129 43.125H33.291V20.7812H45.7129V43.125Z"
                    fill="#3758F9"
                  />
                  <path
                    d="M37.7441 26.7969H41.6504C42.5879 26.7969 43.4473 26.0156 43.4473 25C43.4473 24.0625 42.666 23.2031 41.6504 23.2031H37.7441C36.8066 23.2031 35.9473 23.9844 35.9473 25C35.9473 25.9375 36.7285 26.7969 37.7441 26.7969Z"
                    fill="#3758F9"
                  />
                  <path
                    d="M39.541 38.9063C39.4629 38.9063 39.3066 38.9844 39.2285 38.9844C39.1504 39.0625 38.9941 39.0625 38.916 39.1406C38.8379 39.2188 38.7598 39.2969 38.6816 39.375C38.3691 39.6875 38.1348 40.1563 38.1348 40.625C38.1348 41.0938 38.291 41.5625 38.6816 41.875C38.7598 41.9531 38.8379 42.0313 38.916 42.1094C38.9941 42.1875 39.1504 42.2656 39.2285 42.2656C39.3066 42.3438 39.4629 42.3438 39.541 42.3438C39.6191 42.3438 39.7754 42.3438 39.8535 42.3438C40.3223 42.3438 40.791 42.1875 41.1035 41.7969C41.416 41.4844 41.6504 41.0156 41.6504 40.5469C41.6504 40.0781 41.4941 39.6094 41.1035 39.2969C40.7129 38.9844 40.0879 38.8281 39.541 38.9063Z"
                    fill="#3758F9"
                  />
                </svg>
                </span>
              </div>
            </div>
          </div> */}
        </div>
      </div>
            {/* Modal */}
            {showModal && (
              <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="absolute inset-0 bg-black opacity-60"></div>
                <div className="relative z-10 bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8 max-w-lg w-full">
                  <h2 className="text-3xl font-semibold mb-6 text-gray-900 dark:text-white">Complete Your Payment</h2>
                  <div className="w-full h-1 bg-gray-300 my-4"></div>
                  <div className="text-gray-600 dark:text-gray-300">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="flex gap-4">
                        <input
                          className="w-full px-4 py-3 border dark:bg-slate-900 dark:text-white dark:border-gray-600 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          type="text"
                          placeholder="First Name"
                          name="first_name"
                          onChange={handleChange}
                          value={formValues.first_name}
                          required
                        />
                        <input
                          className="w-full px-4 py-3 border dark:bg-slate-900 dark:text-white dark:border-gray-600 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          type="text"
                          placeholder="Last Name"
                          name="last_name"
                          required
                          onChange={handleChange}
                          value={formValues.last_name}
                        />
                      </div>
                      <input
                        className="w-full px-4 py-3 border dark:bg-slate-900 dark:text-white dark:border-gray-600 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        type="email"
                        placeholder="Input your email"
                        name="email"
                        required
                        onChange={handleChange}
                        value={formValues.email}
                      />
                      <input
                        className="w-full px-4 py-3 border dark:bg-slate-900 dark:text-white dark:border-gray-600 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        type="tel"
                        placeholder="Input phone number"
                        name="phone_number"
                        required
                        onChange={handleChange}
                        value={formValues.phone_number}
                      />
                      <select
                        className="w-full px-4 py-3 border dark:bg-slate-900 dark:text-white dark:border-gray-600 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        defaultValue={Subscribe}
                        disabled
                      >
                        <option value="1">Personal Plan (Free)</option>
                        <option value="2">Business Plan ($199/year)</option>
                        <option value="3">Professional Plan ($256/year)</option>
                      </select>
                      <div className="flex gap-4">
                        <div className="flex items-center gap-2">
                          <input type="radio" id="midtrans" name="method" value="midtrans" defaultChecked />
                          <label htmlFor="midtrans" className="flex items-center gap-2">
                            <img src="assets/Midtrans.png" alt="Midtrans" className="w-24 h-24 object-contain" />
                            Midtrans
                          </label>
                        </div>
                        <div className="flex items-center gap-2">
                          <input type="radio" id="paypal" name="method" value="paypal" disabled />
                          <label htmlFor="paypal" className="flex items-center gap-2">
                            <img src="assets/Paypal.png" alt="Paypal" className="w-24 h-24 object-contain" />
                            Paypal
                          </label>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={closeModal}
                          className="w-full px-5 py-2 bg-gray-500 text-white rounded-md shadow-md hover:bg-gray-600"
                        >
                          Cancel
                        </button>
                        <button
                          className="w-full px-5 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          type="submit"
                        >
                          {Subscribe === 1
                            ? 'Get (Free)'
                            : Subscribe === 2
                            ? 'Subscribe ($199/year)'
                            : Subscribe === 3
                            ? 'Subscribe ($256/year)'
                            : '(Select Package)'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}

    </section>
    // ====== Pricing Section End ======
  );
};

export default PricingSection;