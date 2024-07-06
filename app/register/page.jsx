'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';  // Correct import statement
import { useFormik } from 'formik';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';

const Page = () => {  // Component name should be capitalized
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showKonfirmasiPassword, setShowKonfirmasiPassword] = useState(false);
  const [count, setCount] = useState(0)
  const navigate = useRouter();
  const umaxUrl = 'https://umaxxnew-1-d6861606.deta.app';

  const router = useRouter();
  useEffect(() => {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
      Swal.fire('You Must Login First', 'Nice Try!', 'error').then(() => {
          router.push('/');
      });
      }
  }, [router]);

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirm_password: '',
      role: '',
    },
    validate: (values) => {
      const errors = {};
      if (!values.name) {
        errors.name = 'Name is required';
      }
      if (!values.email) {
        errors.email = 'Email is required';
      }
      if (!values.password) {
        errors.password = 'Password is required';
      }
      if (!values.confirm_password) {
        errors.confirm_password = 'Confirm password is required';
      } else if (values.password !== values.confirm_password) {
        errors.confirm_password = 'Passwords do not match';
      }
      if (!values.role) {
        errors.role = 'Role is required';
      }
      return errors;
    },
    onSubmit: (values, { setSubmitting }) => {

      const errors = formik.validate(values);
      if (Object.keys(errors).length > 0) {
        setSubmitting(false);
        return;
      }

      const token = localStorage.getItem('jwtToken');
      fetch(`${umaxUrl}/register`, {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Bearer ${token}`,
        },
        body: new URLSearchParams(values).toString(),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          if (data.message === 'Registration successful') {
            Swal.fire({
              title: 'Registration Successful!',
              text: 'Your data has been successfully registered.',
              icon: 'success',
              confirmButtonText: 'OK',
            }).then((result) => {
              if (result.isConfirmed) {
                navigate.push('/UsersTable');
              }
            });
          }
        })
        .catch((error) => {
          console.error(error);
          Swal.fire({
            title: 'Registration Failed!',
            text: 'There was an error during registration. Please try again.',
            icon: 'error',
            confirmButtonText: 'OK',
          });
        })
        .finally(() => {
          setSubmitting(false);
        });
    },
    validateOnChange: false,
  });

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        console.log("Esc key pressed");
        navigate.push(-1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [navigate]);

  const toggleKonfirmasiPasswordVisibility = () => {
    setShowKonfirmasiPassword(!showKonfirmasiPassword);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const setTimer = () => {
    setTimeout(() => {
        setCount(count + 1)
    }, 1000)
  }

  return (
    <div className="relative overflow-hidden min-h-screen flex flex-col items-center justify-center bg-bg-login bg-cover bg-no-repeat bg-center">
      <div>
        <img src="../assets/logo.png" alt="logo" className="mx-auto pb-2 w-20" />
      </div>
      <form
        onSubmit={formik.handleSubmit}
        className="w-10/12 md:w-full max-w-md bg-white rounded-lg shadow-lg p-6 border-2"
      >
        <p className="font-semibold text-base text-[#5473E3] mb-5">Register</p>
        <input
          type="text"
          id="name"
          name="name"
          onChange={formik.handleChange}
          value={formik.values.name}
          placeholder="Nama"
          className="w-full h-9 rounded-md border pl-5 border-blue mt-2 focus:outline-none focus:ring-1 text-slate-500"
        />
        {formik.errors.name && count < 3 && (
          <span className="text-red-500 text-sm">{formik.errors.name}</span>
        )}
        <input
          type="text"
          id="email"
          name="email"
          onChange={formik.handleChange}
          value={formik.values.email}
          placeholder="Email"
          className="w-full h-9 rounded-md border pl-5 border-blue mt-3 focus:outline-none focus:ring-1 text-slate-500"
        />
        {formik.errors.email && count < 3 && (
          <span className="text-red-500 text-sm">{formik.errors.email}</span>
        )}
        <div className="relative flex items-center">
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            name="password"
            onChange={formik.handleChange}
            value={formik.values.password}
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
        {formik.errors.password && count < 3 && (
          <span className="text-red-500 text-sm">{formik.errors.password}</span>
        )}
        <div className="relative flex items-center">
          <input
            type={showKonfirmasiPassword ? 'text' : 'password'}
            id="confirm_password"
            name="confirm_password"
            onChange={formik.handleChange}
            value={formik.values.confirm_password}
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

        {formik.errors.confirm_password && count < 3 && (
          <span className="text-red-500 text-sm">{formik.errors.confirm_password}</span>
        )}
        {!passwordMatch && (
          <span className="text-red-500 text-sm relative bottom-0 left-0 mb-2 ml-2">
            Password tidak sama!
          </span>
        )}
        <select
          id="role"
          name="role"
          onChange={formik.handleChange}
          value={formik.values.role}
          className="w-full h-9 rounded-md border pl-5 border-blue mt-3 focus:outline-none focus:ring-1 text-slate-500"
        >
          <option value="" hidden>Select Role</option>
          <option value="admin">Admin</option>
          <option value="staff">Staff</option>
          <option value="client">Client</option>
        </select>
        {formik.errors.role && (
          <span className="text-red-500 text-sm">{formik.errors.role}</span>
        )}
        <button
          type="submit"
          disabled={formik.isSubmitting}
          className="w-full h-10 rounded-full bg-[#3D5FD9] text-[#F5F7FF] hover:bg-[#2347C5] mt-5"
        >
          SIGN UP
        </button>
        <Link
          href="/"
          className="block text-[#5473E3] mt-3 text-center hover:text-[#2347C5] hover:underline"
        >
          Already have an account? Sign in
        </Link>
      </form>
    </div>
  );
};

export default Page;  // Ensure component is properly exported
