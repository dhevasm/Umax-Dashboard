"use client";

import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Link from "next/link";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { usePathname, useRouter } from "next/navigation";
import Swal from "sweetalert2";
import axios from "axios";
import { useTranslations } from "next-intl";
import Image from "next/image";

const Page = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const [lang, setLang] = useState(pathname.slice(0, 3));
  const t = useTranslations('login');

  const validationSchema = Yup.object({
    email: Yup.string()
      .email(t('email-error2'))
      .required(t('email-error')),
    password: Yup.string()
      .min(6, t('password-error2'))
      .required(t('password-error')),
  });

  const getUserData = async (roles) => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user-by-id`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
        },
      });

      if (!localStorage.getItem('locationChecked') && roles === 'client') {
        const fetchLocation = async () => {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
              const { latitude, longitude } = position.coords;
              try {
                const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
                const data = await res.json();

                if (data.address.country_code !== 'id') {
                  localStorage.setItem('lang', 'en');
                  setLang('en');
                } else {
                  localStorage.setItem('lang', 'id');
                  setLang('id');
                }
                localStorage.setItem('locationChecked', 'true');
              } catch (error) {
                console.error('Error fetching location:', error);
              }
            }, (error) => {
              console.error('Error getting geolocation:', error);
              localStorage.setItem('locationChecked', 'true');
            });
          } else {
            console.error('Geolocation not supported');
            localStorage.setItem('locationChecked', 'true');
          }
        };

        fetchLocation();
      }

      const language = response.data.Data[0]?.language || 'en';
      localStorage.setItem('lang', language);

      switch (roles) {
        case 'sadmin':
        case 'admin':
          router.push(`/${language}/admin-dashboard`);
          break;
        case 'staff':
          router.push(`/${language}/campaigns`);
          break;
        default:
          router.push(`/${language}/dashboard`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        if (!navigator.onLine) {
          Swal.fire("Network error", "Please check your internet connection.", "error");
          throw new Error("Network error: Please check your internet connection.");
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
          method: "POST",
          headers: {
            accept: "application/json",
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams(values).toString(),
        });

        if (!response.ok) {
          if (response.status === 400) {
            Swal.fire("Login failed", "Free Trial has Expired", "error");
          } else {
            Swal.fire("Login failed", "Invalid email or password.", "error");
          }
        }
        
        const data = await response.json();
        const { Token, Data } = data;
        const { tenant_id: tenantID, roles, name, email } = Data;

        if (roles === "client") {
            await fetchClient(email, Token);
        }

        localStorage.setItem("jwtToken", Token);
        localStorage.setItem("tenantId", tenantID);
        localStorage.setItem("roles", roles);
        localStorage.setItem("name", name);

        getUserData(roles);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    },
  });

  const fetchClient = async (email, token) => {
      try {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/client-by-tenant`, {
              headers: {
                  'accept': 'application/json',
                  'Content-Type': 'application/x-www-form-urlencoded',
                  'Authorization': `Bearer ${token}`,
              },
          });

          // Cari client dengan email yang sesuai
          const client = response.data.Data.find((item) => item.email === email);

          // Jika client ditemukan, set clientId ke localStorage
          if (client) {
              localStorage.setItem("clientId", client._id);
          } else {
              console.warn(`Client with email ${email} not found.`);
          }
      } catch (error) {
          console.error("Error fetching data:", error.message);
      }
  };


  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="min-h-screen overflow-y-hidden flex flex-col items-center justify-center bg-bg-login bg-cover bg-no-repeat bg-left">
      <script src="https://www.google.com/recaptcha/api.js" async defer></script>
      <div className="w-full md:max-w-md mx-auto mb-[100px]">
        <Image
          src="/assets/logo.png"
          alt="logo"
          className="mx-auto pb-2"
          width={120}
          height={40}
        />
        <div className="flex flex-col items-center justify-center mt-2 sm:mt-0">
          <form
            onSubmit={formik.handleSubmit}
            className="w-10/12 md:w-full p-6 bg-white rounded-lg shadow-lg border-2"
          >
            <p className="font-semibold text-xl text-[#5473E3] mb-5">Login</p>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Email"
              className="w-full h-12 rounded-lg pl-5 border border-blue mt-2 focus:outline-none focus:ring-1"
              onChange={formik.handleChange}
              value={formik.values.email}
              required
            />
            {formik.errors.email && <div className="text-red-500">{formik.errors.email}</div>}

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                placeholder="Password"
                className="w-full h-12 rounded-lg pl-5 border border-blue mt-2 focus:outline-none focus:ring-1"
                onChange={formik.handleChange}
                value={formik.values.password}
                required
              />
              {formik.errors.password && <div className="text-red-500">{formik.errors.password}</div>}

              <div
                className="absolute top-4 right-3 cursor-pointer"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <AiOutlineEye size={27} /> : <AiOutlineEyeInvisible size={27} />}
              </div>
            </div>

            {error && (
              <div
                className="w-full mt-2 text-base bg-red-200 h-12 p-3 rounded-md border-2 border-red-400 animate-pulse"
              >
                <p className="text-red-500">{error}</p>
              </div>
            )}
            
            <button
              type="submit"
              className="w-full h-12 rounded-md bg-[#3D5FD9] text-[#F5F7FF] hover:bg-[#2347C5] mt-5"
            >
              {loading ? <LoadingCircle /> : t('sign-in')}
            </button>


            <div className="flex justify-between items-center mt-3">
              <Link
                href={`${lang}/forgotpassword`}
                className="text-[#5473E3] hover:text-[#2347C5] hover:underline"
              >
                {t('forgot-password')}
              </Link>
            </div>
            <div className="mt-3 flex justify-center">
              <div className="g-recaptcha" data-sitekey={`${process.env.NEXT_PUBLIC_RECHAPTA_SITE_KEY}`}></div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const LoadingCircle = () => (
  <div className="flex justify-center items-center h-8">
    <div className="relative">
      <div className="w-7 h-7 border-4 border-white rounded-full border-t-transparent animate-spin"></div>
    </div>
  </div>
); 

export default Page;
