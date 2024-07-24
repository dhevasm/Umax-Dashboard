'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';  // Correct import statement
// import { useFormik } from 'formik';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const Page = () => {  // Component name should be capitalized
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showKonfirmasiPassword, setShowKonfirmasiPassword] = useState(false);
  const [count, setCount] = useState(0)
  const navigate = useRouter();
  const umaxUrl = 'https://umaxxxxx-1-r8435045.deta.app';

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
  }
  const toggleKonfirmasiPasswordVisibility = () => {
    setShowKonfirmasiPassword(!showKonfirmasiPassword);
  }

  const [values, setValues] = useState({
    username : '',
    email : '',
    password : '',
    passwordMatch : '',
    role : '',
  })
  const [error, setError] = useState({
    username : '',
    email : '',
    password : '',
    passwordMatch : '',
    role : '',
  })
  const [isValid, setIsvalid] = useState(false)

    function validateForm(){
        let errors = {}
        if(values.username == ''){
            errors.username = 'Username is required'
        }
        if(!values.email.includes("@")){
            errors.email = "Email must contain @"
        }
        if(values.email == ''){
            errors.email = 'Email is required'
        }
        if(values.password != values.passwordMatch){
            errors.password = 'Password not match'
            errors.passwordMatch = 'Password not match'
        }
        if(values.password == ''){
            errors.password = 'Password is required'
        }
        if(values.passwordMatch == ''){
            errors.passwordMatch = 'Password verify is required'
        }
        if(values.role == ''){
            errors.role = 'Role is required'
        }
        setError(errors)  
        setIsvalid(Object.keys(errors).length === 0)
    }

    useEffect(() => {
        validateForm()
    }, [values])

    async function handleSubmit(){
      if(isValid){
        const formData = new FormData()
        formData.append('name', values.username)
        formData.append('email', values.email)
        formData.append('password', values.password)
        formData.append('confirm_password', values.passwordMatch)
        formData.append('role', values.role)
        await axios.post(`https://umaxxxxx-1-r8435045.deta.app/register`, formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
          }
        } ).then((res) => {
            if(res.data.Output == "Registration Successfully"){
              Swal.fire('Register Success', 'Please Login', 'success').then(() => {
                navigate.push('/')
              })
            }
          }).catch((err) => {
            Swal.fire('Register Failed', 'Email already exist', 'error')
          })
      }else{
        Swal.fire('Register Failed', 'Please fill the blank', 'error')
      }
    }   

  return (
    <div className="relative overflow-hidden min-h-screen flex flex-col items-center justify-center bg-bg-login bg-cover bg-no-repeat bg-center">
      <div>
        <img src="../assets/logo.png" alt="logo" className="mx-auto pb-2 w-20" />
      </div>
      <div
        className="w-10/12 md:w-full max-w-md bg-white rounded-lg shadow-lg p-6 border-2"
      >
        <p className="font-semibold text-base text-[#5473E3] mb-5">Register</p>
        <input
          type="text"
          id="name"
          name="name"
          onChange={(e) => setValues({...values, username: e.target.value})}
          placeholder="Nama"
          className="w-full h-9 rounded-md border pl-5 border-blue mt-2 focus:outline-none focus:ring-1 text-slate-500"
        />
        {
          error.username && <p className="text-red-500 text-xs">{error.username}</p>
        }
        <input
          type="text"
          id="email"
          name="email"
          onChange={e => setValues({...values, email: e.target.value})}
          placeholder="Email"
          className="w-full h-9 rounded-md border pl-5 border-blue mt-3 focus:outline-none focus:ring-1 text-slate-500"
        />
        {
          error.email && <p className="text-red-500 text-xs">{error.email}</p>
        }
      
        <div className="relative flex items-center">
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            name="password"
            onChange={(e) => setValues({...values, password: e.target.value})}
            placeholder="Password"
            className="w-full h-9 rounded-md border pl-5 border-blue mt-3 focus:outline-none focus:ring-1 text-slate-500"
          />
          <div
            className="absolute top-3 right-2 cursor-pointer"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? (
              <AiOutlineEye size={15} />
            ) : (
              <AiOutlineEyeInvisible size={15} />
            )}
          </div>
        </div>
        {
          error.password && <p className="text-red-500 text-xs">{error.password}</p>
        }
        <div className="relative flex items-center">
          <input
            type={showKonfirmasiPassword ? 'text' : 'password'}
            id="confirm_password"
            name="confirm_password"
            onChange={(e) => setValues({...values, passwordMatch: e.target.value})}
            placeholder="Konfirmasi Password"
            className="w-full h-9 rounded-md border pl-5 border-blue mt-3 focus:outline-none focus:ring-1 text-slate-500"
          />
          <div
            className="absolute top-3 right-2 cursor-pointer flex items-center"
            onClick={toggleKonfirmasiPasswordVisibility}
          >
            {showKonfirmasiPassword ? (
              <AiOutlineEye size={15} />
            ) : (
              <AiOutlineEyeInvisible size={15} />
            )}
          </div>
        </div>
        {
          error.passwordMatch && <p className="text-red-500 text-xs">{error.passwordMatch}</p>
        }

        
        
        <select
          id="role"
          name="role"
          onChange={(e) => setValues({...values, role: e.target.value})}
          className="w-full h-9 rounded-md border pl-5 border-blue mt-3 focus:outline-none focus:ring-1 text-slate-500"
        >
          <option value="" hidden>Select Role</option>
          <option value="admin">Admin</option>
          <option value="staff">Staff</option>
          <option value="client">Client</option>
        </select>
        {
          error.role && <p className="text-red-500 text-xs">{error.role}</p>
        }
        
        <button
          className="w-full h-10 rounded-full bg-[#3D5FD9] text-[#F5F7FF] hover:bg-[#2347C5] mt-5"
          onClick={handleSubmit}
        >
          SIGN UP
        </button>
        <Link
          href="/"
          className="block text-[#5473E3] mt-3 text-center hover:text-[#2347C5] hover:underline"
        >
          Already have an account? Sign in
        </Link>
      </div>
    </div>
  );
};

export default Page;  // Ensure component is properly exported
