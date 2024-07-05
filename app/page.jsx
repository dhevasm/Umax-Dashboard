'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useFormik } from 'formik'
import Link from 'next/link'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { useRouter } from 'next/navigation'

const Page = () => {
  
  const [error, setError] = useState()
  const router = useRouter()

  const loading = useRef(null)

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },

    onSubmit: (values) => {

      // Cek apakah email dan password kosong
      if (!values.email && !values.password) {
        setError('Please fill in all fields');
        return;
      } else if(!values.email) {
        setError('Email is required');
        return;
      } else if(!values.password) {
        setError('Password is required');
        return;
      }

      // const { Token } = response.Data;
      fetch(`https://umaxxnew-1-d6861606.deta.app/login`, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(values).toString(),
      })

        .then(response => {
          if (!response.ok) {
            throw new Error('Login failed');
          }
          return response.json();
        })
        .then(data => {
          // console.log(data)
          const { Token } = data
          localStorage.setItem('jwtToken', Token);

          // Arahkan ke Dashboard untuk pengguna non-staff

          const roles = data.Data.roles;

          if (roles == 'sadmin' || roles == "admin") {  
            router.push('/admin-dashboard');
          }else{
            router.push('/dashboard');
          }
          

        })
        .catch(error => {
          // // Handle network errors
          if (error.message.includes('ERR_NAME_NOT_RESOLVED')) {
            setError('Network error. Please check your internet connection and try again.');
          } else {
            // Handle other types of errors
            setError('Login failed. Please check your email and password.');
          }
          console.log(error)
        });
    },
  });

  // set Timeout error
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 3000); // 3 detik
  
      return () => clearTimeout(timer); // Bersihkan timer jika komponen unmount atau error berubah
    }
  }, [error]);


  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };



  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center bg-bg-login bg-cover bg-no-repeat bg-center">
      <div className="w-full max-w-md mx-auto">
        <img src="../assets/logo.png" alt="logo" className="mx-auto pb-2 w-20" />
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
            <div className="relative flex items-center">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                id="password"
                placeholder="Password"
                className="w-full h-12 rounded-lg pl-5 border border-blue mt-2 focus:outline-none focus:ring-1"
                onChange={formik.handleChange}
                value={formik.values.password}
              />
              <div
                className="absolute top-3 right-2 cursor-pointer"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <AiOutlineEye size={15} /> : <AiOutlineEyeInvisible size={15} />}
              </div>
            </div>
            {error && (
              <div
                className="w-full mt-2 bg-red-200 h-12 p-3 rounded-md border-2 border-red-400 animate-pulse transition-all duration-200"
                style={{ opacity: 1 }}
                onAnimationEnd={() => setError(null)}
              >
                <p className="text-red-500">{error}</p>
              </div>
            )}
            <button
              type="submit"
              className="w-full h-12 rounded-full bg-[#3D5FD9] text-[#F5F7FF] hover:bg-[#2347C5] mt-5"
              onClick={() => loading.current.classList.toggle('hidden')}
            >
              SIGN IN
            </button>
            <div className='flex justify-between items-center'>
            <Link
              href="/forgotpassword"
              className="mt-3 text-[#5473E3] hover:text-[#2347C5] hover:underline"
            >
              <p className="text-[#5473E3] mb-2 mt-2">Forgot Password?</p>
            </Link>
            <img src="../assets/loading.gif" alt="Loading" className="w-10 hidden" ref={loading} />
            </div>
          </form>
        </div>
        
        
      </div>
    </div>
  )
}

export default Page
