'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { FaHome } from 'react-icons/fa';
import { useFormik } from 'formik';

const Page = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showKonfirmasiPassword, setShowKonfirmasiPassword] = useState(false);
  const [tenants, setTenants] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useRouter();
  const t = useTranslations('register');
  const umaxUrl = process.env.NEXT_PUBLIC_API_URL;
  const roles = localStorage.getItem('roles');

  // Tenant all
  const fetchData = async () => {
    setIsLoading(true);
    try {
        const token = localStorage.getItem('jwtToken');
        const response = await axios.get(`${umaxUrl}/tenant-get-all`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        console.log(response.data.Data);
        setTenants(response.data.Data);
    } catch (error) {
        console.error("Error fetching data:", error.message);
    } finally {
        setIsLoading(false);  // Pastikan loading state diubah ke false baik berhasil maupun gagal
    }
};

useEffect(() => {
    fetchData();
}, []);

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      Swal.fire('You Must Login First', 'Nice Try!', 'error').then(() => {
        navigate.push('/');
      });
    }
  }, [navigate]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleKonfirmasiPasswordVisibility = () => {
    setShowKonfirmasiPassword(!showKonfirmasiPassword);
  };

  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
      passwordMatch: '',
      tenant_id: '',
      role: '',
    },
    validate: (values) => {
      const errors = {};
      if (!values.username) {
        errors.username = t('name-error');
      }
      if (!values.email) {
        errors.email = t('email-error');
      } else if (!values.email.includes('@')) {
        errors.email = t('email-error2');
      }
      if (!values.password) {
        errors.password = t('password-error');
      }
      if (!values.passwordMatch) {
        errors.passwordMatch = t('confirm-error');
      } else if (values.password !== values.passwordMatch) {
        errors.password = t('password-error2');
        errors.passwordMatch = t('password-error2');
      }
      if (!values.tenant_id) {
        errors.tenant_id = t('tenant-error');
      }
      if (!values.role) {
        errors.role = t('role-error');
      }
      return errors;
    },
    onSubmit: async (values) => {
      const url = roles == 'sadmin' ? `${umaxUrl}/register?tenantId=${values.tenant_id}` : `${umaxUrl}/register`;
      try {
        const formData = new FormData();
        formData.append('name', values.username);
        formData.append('email', values.email);
        formData.append('password', values.password);
        formData.append('confirm_password', values.passwordMatch);
        formData.append('role', values.role);

        const response = await axios.post(`${url}`, formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
          },
        });

        if (response.data.Output === 'Registration Successfully') {
          Swal.fire('Register Success', 'Please Login', 'success').then(() => {
            navigate.push('/');
          });
        }
      } catch (error) {
        Swal.fire('Register Failed', 'Email already exists', 'error');
      }
    },
  });

  return (
    <div className="relative overflow-hidden min-h-screen flex flex-col items-center justify-center bg-bg-login bg-cover bg-no-repeat bg-center">
      <div>
        <Image
          src="/assets/logo.png"
          alt="logo"
          className="mx-auto pb-2 w-20"
          width={80} 
          height={10}
        />
        {/* <div className='fixed z-30 bottom-5 right-5 p-3 rounded-full hover:bg-blue-600 hover:cursor-pointer bg-blue-500 text-white' onClick={() => router.back()}>
        <FaHome className='text-2xl'/>
        </div> */}
      </div>
      <div className="w-10/12 md:w-full max-w-md bg-white rounded-lg shadow-lg p-6 border-2">
        <p className="font-semibold text-base text-[#5473E3] mb-5">Register</p>
        <input
          type="text"
          id="username"
          name="username"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.username}
          placeholder={t('holder-name')}
          className="w-full h-9 rounded-md border pl-5 border-blue mt-2 focus:outline-none focus:ring-1 text-slate-500"
        />
        {formik.touched.username && formik.errors.username && <p className="text-red-500 text-xs">{formik.errors.username}</p>}
        <input
          type="text"
          id="email"
          name="email"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.email}
          placeholder={t('holder-email')}
          className="w-full h-9 rounded-md border pl-5 border-blue mt-3 focus:outline-none focus:ring-1 text-slate-500"
        />
        {formik.touched.email && formik.errors.email && <p className="text-red-500 text-xs">{formik.errors.email}</p>}
        <div className="relative flex items-center">
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            name="password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
            placeholder="Password"
            className="w-full h-9 rounded-md border pl-5 border-blue mt-3 focus:outline-none focus:ring-1 text-slate-500"
          />
          <div className="absolute top-3 right-2 cursor-pointer" onClick={togglePasswordVisibility}>
            {showPassword ? <AiOutlineEye size={15} /> : <AiOutlineEyeInvisible size={15} />}
          </div>
        </div>
        {formik.touched.password && formik.errors.password && <p className="text-red-500 text-xs">{formik.errors.password}</p>}
        <div className="relative flex items-center">
          <input
            type={showKonfirmasiPassword ? 'text' : 'password'}
            id="passwordMatch"
            name="passwordMatch"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.passwordMatch}
            placeholder={t('holder-confirm')}
            className="w-full h-9 rounded-md border pl-5 border-blue mt-3 focus:outline-none focus:ring-1 text-slate-500"
          />
          <div className="absolute top-3 right-2 cursor-pointer flex items-center" onClick={toggleKonfirmasiPasswordVisibility}>
            {showKonfirmasiPassword ? <AiOutlineEye size={15} /> : <AiOutlineEyeInvisible size={15} />}
          </div>
        </div>
        {formik.touched.passwordMatch && formik.errors.passwordMatch && <p className="text-red-500 text-xs">{formik.errors.passwordMatch}</p>}
        <select
          id="tenant_id"
          name="tenant_id"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.tenant_id}
          className="w-full h-9 rounded-md border pl-5 border-blue mt-3 focus:outline-none focus:ring-1 text-slate-500"
        >
          <option value="" hidden>{t('select-tenant')}</option>
          {isLoading ? (
            <>
              <option value="">Loading ...</option>
            </>
          ) : tenants.length > 0 ? (
            <>
              {tenants.map((tenant) => (
                <option key={tenant._id} value={tenant._id}>
                  {tenant.company}
                </option>
              ))}
            </>
          )
            : (
              <>
                <option value="">{t('tenant-not-found')}</option>
              </>
            )}
        </select>
        {formik.touched.tenant_id && formik.errors.tenant_id && <p className="text-red-500 text-xs">{formik.errors.role}</p>}
        <select
          id="role"
          name="role"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.role}
          className="w-full h-9 rounded-md border pl-5 border-blue mt-3 focus:outline-none focus:ring-1 text-slate-500"
        >
          <option value="" hidden>{t('select-role')}</option>
          <option value="admin">Admin</option>
          <option value="staff">Staff</option>
          <option value="client">Client</option>
        </select>
        {formik.touched.role && formik.errors.role && <p className="text-red-500 text-xs">{formik.errors.role}</p>}
        <div className='flex gap-4 mt-5'>
          <button
            type="button"
            className="flex-1 h-12 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500"
            onClick={() => navigate.back()}
          >
            {t('back')}
          </button>
          <button
            type="button"
            className="flex-1 h-12 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={formik.handleSubmit}
          >
            {t('sign-up')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;
