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
  const lang = pathname.slice(0, 3);
  const t = useTranslations('login')

  useEffect(() => {
    console.log(process.env.NEXT_PUBLIC_API_URL);
  }, [])

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
          'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
        }
      });

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
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
          method: "POST",
          headers: {
            accept: "application/json",
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams(values).toString(),
        });

        if (!response.ok) throw new Error("Login failed");

        const data = await response.json();
        const { Token, Data } = data;
        const { tenant_id: tenantID, roles, name } = Data;

        localStorage.setItem("jwtToken", Token);
        localStorage.setItem("tenantId", tenantID);
        localStorage.setItem("roles", roles);
        localStorage.setItem("name", name);

        getUserData(roles);
      } catch (error) {
        setError(error.message.includes("ERR_NAME_NOT_RESOLVED")
          ? "Network error. Please check your internet connection and try again."
          : "Please check your email and password.");
      } finally {
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    const roles = localStorage.getItem("roles");
    const lang = localStorage.getItem("lang");
    if (token) {
      Swal.fire('Already Logged In', 'Nice Try!', 'warning').then(() => {
        router.push(roles === "sadmin" || roles === "admin"
          ? `/${lang}/admin-dashboard`
          : `/${lang}/dashboard`);
      });
    }
  }, [router]);

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center bg-bg-login bg-cover bg-no-repeat bg-left">
      <div className="w-full max-w-md mx-auto">
        <Image
          src="/assets/logo.png"
          alt="logo"
          className="mx-auto pb-2 w-20"
          width={80} 
          height={10}
        />
        <div className="flex flex-col items-center justify-center mt-5 sm:mt-0">
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
            />
            {formik.errors.email && <div className="text-red-500">{formik.errors.email}</div>}

            <div className="relative items-center">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                placeholder="Password"
                className="w-full h-12 rounded-lg pl-5 border border-blue mt-2 focus:outline-none focus:ring-1"
                onChange={formik.handleChange}
                value={formik.values.password}
              />
              {formik.errors.password && <div className="text-red-500">{formik.errors.password}</div>}

              <div
                className="absolute top-3 right-2 cursor-pointer"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <AiOutlineEye size={15} /> : <AiOutlineEyeInvisible size={15} />}
              </div>
            </div>

            {error && (
              <div
                className="w-full mt-2 text-[15px] md:text-base bg-red-200 h-12 p-3 rounded-md border-2 border-red-400 animate-pulse transition-all duration-200"
                style={{ opacity: 1 }}
              >
                <p className="text-red-500">{error}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full h-12 rounded-full bg-[#3D5FD9] text-[#F5F7FF] hover:bg-[#2347C5] mt-5"
            >
              {loading ? <LoadingCircle /> : t('sign-in')}
            </button>

            <div className="flex justify-between items-center">
              <Link
                href={`${lang}/forgotpassword`}
                className="mt-3 text-[#5473E3] hover:text-[#2347C5] hover:underline"
              >
                <p className="text-[#5473E3] mb-2 mt-2">{t('forgot-password')}</p>
              </Link>
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
