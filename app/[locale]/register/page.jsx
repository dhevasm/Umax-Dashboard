'use client'

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { FaHome } from 'react-icons/fa';

const Page = () => {
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showKonfirmasiPassword, setShowKonfirmasiPassword] = useState(false);
  const [count, setCount] = useState(0);
  const navigate = useRouter();
  const t = useTranslations('register');
  const umaxUrl = process.env.NEXT_PUBLIC_API_URL;

  const router = useRouter();
  useEffect(() => {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        Swal.fire('You Must Login First', 'Nice Try!', 'error').then(() => {
            router.push('/');
        });
      }
  }, [router]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const toggleKonfirmasiPasswordVisibility = () => {
    setShowKonfirmasiPassword(!showKonfirmasiPassword);
  };

  const [values, setValues] = useState({
    username: '',
    email: '',
    password: '',
    passwordMatch: '',
    role: '',
  });

  const [error, setError] = useState({
    username: '',
    email: '',
    password: '',
    passwordMatch: '',
    role: '',
  });

  const [isValid, setIsValid] = useState(false);

  const validateForm = useCallback(() => {
    let errors = {};
    if (values.username === '') {
      errors.username = t('name-error');
    }
    if (!values.email.includes("@")) {
      errors.email = t('email-error2');
    }
    if (values.email === '') {
      errors.email = t('email-error');
    }
    if (values.password !== values.passwordMatch) {
      errors.password = t('password-error2');
      errors.passwordMatch = t('password-error2');
    }
    if (values.password === '') {
      errors.password = t('password-error');
    }
    if (values.passwordMatch === '') {
      errors.passwordMatch = t('confirm-error');
    }
    if (values.role === '') {
      errors.role = t('role-error');
    }
    setError(errors);
    setIsValid(Object.keys(errors).length === 0);
  }, [values, t]);

  useEffect(() => {
    validateForm();
  }, [values, validateForm]);

  async function handleSubmit() {
    if (isValid) {
      const formData = new FormData();
      formData.append('name', values.username);
      formData.append('email', values.email);
      formData.append('password', values.password);
      formData.append('confirm_password', values.passwordMatch);
      formData.append('role', values.role);
      await axios.post(`${umaxUrl}/register`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
        }
      }).then((res) => {
          if (res.data.Output === "Registration Successfully") {
            Swal.fire('Register Success', 'Please Login', 'success').then(() => {
              navigate.push('/');
            });
          }
        }).catch((err) => {
          Swal.fire('Register Failed', 'Email already exists', 'error');
        });
    } else {
      Swal.fire('Register Failed', 'Please fill in the blanks', 'error');
    }
  }

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
          id="name"
          name="name"
          onChange={(e) => setValues({ ...values, username: e.target.value })}
          placeholder={t('holder-name')}
          className="w-full h-9 rounded-md border pl-5 border-blue mt-2 focus:outline-none focus:ring-1 text-slate-500"
        />
        {error.username && <p className="text-red-500 text-xs">{error.username}</p>}
        <input
          type="text"
          id="email"
          name="email"
          onChange={e => setValues({ ...values, email: e.target.value })}
          placeholder={t('holder-email')}
          className="w-full h-9 rounded-md border pl-5 border-blue mt-3 focus:outline-none focus:ring-1 text-slate-500"
        />
        {error.email && <p className="text-red-500 text-xs">{error.email}</p>}
        <div className="relative flex items-center">
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            name="password"
            onChange={(e) => setValues({ ...values, password: e.target.value })}
            placeholder="Password"
            className="w-full h-9 rounded-md border pl-5 border-blue mt-3 focus:outline-none focus:ring-1 text-slate-500"
          />
          <div className="absolute top-3 right-2 cursor-pointer" onClick={togglePasswordVisibility}>
            {showPassword ? <AiOutlineEye size={15} /> : <AiOutlineEyeInvisible size={15} />}
          </div>
        </div>
        {error.password && <p className="text-red-500 text-xs">{error.password}</p>}
        <div className="relative flex items-center">
          <input
            type={showKonfirmasiPassword ? 'text' : 'password'}
            id="confirm_password"
            name="confirm_password"
            onChange={(e) => setValues({ ...values, passwordMatch: e.target.value })}
            placeholder={t('holder-confirm')}
            className="w-full h-9 rounded-md border pl-5 border-blue mt-3 focus:outline-none focus:ring-1 text-slate-500"
          />
          <div className="absolute top-3 right-2 cursor-pointer flex items-center" onClick={toggleKonfirmasiPasswordVisibility}>
            {showKonfirmasiPassword ? <AiOutlineEye size={15} /> : <AiOutlineEyeInvisible size={15} />}
          </div>
        </div>
        {error.passwordMatch && <p className="text-red-500 text-xs">{error.passwordMatch}</p>}
        <select
          id="role"
          name="role"
          onChange={(e) => setValues({ ...values, role: e.target.value })}
          className="w-full h-9 rounded-md border pl-5 border-blue mt-3 focus:outline-none focus:ring-1 text-slate-500"
        >
          <option value="" hidden>{t('select-role')}</option>
          <option value="admin">Admin</option>
          <option value="staff">Staff</option>
          <option value="client">Client</option>
        </select>
        {error.role && <p className="text-red-500 text-xs">{error.role}</p>}
        <div className='flex gap-4 mt-5'>
          <button
            className="flex-1 h-12 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500"
            onClick={router.back}
          >
            {t('back')}
          </button>
          <button
            className="flex-1 h-12 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={handleSubmit}
          >
            {t('sign-up')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;  // Ensure component is properly exported
