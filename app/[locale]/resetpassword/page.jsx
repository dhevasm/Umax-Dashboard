'use client'

import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup'; // Import Yup for validation
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl'; // Import the translation hook
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';

const Page = () => {
    const router = useRouter();
    const t = useTranslations('reset-password');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showKonfirmasiPassword, setShowKonfirmasiPassword] = useState(false);
    const searchParams = useSearchParams();

    const validationSchema = Yup.object({
        token: Yup.string()
            .required(t('token-required')),
        new_password: Yup.string()
            .min(8, t('password-min'))
            .required(t('password-required')),
        konfirmasi_password: Yup.string()
            .oneOf([Yup.ref('new_password'), null], t('password-match'))
            .required(t('password-confirmation-required'))
    });

    useEffect(() => {
        if(!searchParams.get('token')){
            Swal.fire({
                icon: 'error',
                text: 'invalid token',
                confirmButtonColor: '#FF5252',
                confirmButtonText: t('ok'),
            }).then((result) => {
                if (result.isConfirmed) {
                    router.push('/');
                }
            });
        }
    }, [searchParams])

    const formik = useFormik({
        initialValues: {
            token: searchParams.get('token'),
            new_password: '',
            konfirmasi_password: '',
        },
        validationSchema,
        onSubmit: async (values) => {
            setLoading(true);
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/reset-password?token=${values.token}&new_password=${values.new_password}&konfirmasi_password=${values.konfirmasi_password}`,
                    {
                        method: 'POST',
                        headers: {
                            'accept': 'application/json',
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        body: new URLSearchParams(values).toString(),
                    }
                );

                const data = await response.json();
                console.log(data)
                
                if(data.message == "Password reset successful"){
                    Swal.fire({
                        icon: 'success',
                        title: t('success-title'),
                        text: t('success-message'),
                        confirmButtonColor: '#3D5FD9',
                        confirmButtonText: t('ok'),
                    }).then((result) => {
                        if (result.isConfirmed) {
                            router.push('/');
                        }
                    });
                }else{
                    Swal.fire({
                        icon: 'error',
                        title: t('error-title'),
                        text: t('error-message'),
                        confirmButtonColor: '#FF5252',
                        confirmButtonText: t('ok'),
                    });
                }
            } catch (error) {
                console.error(error);
                Swal.fire({
                    icon: 'error',
                    title: t('error-title'),
                    text: t('error-message'),
                    confirmButtonColor: '#FF5252',
                    confirmButtonText: t('ok'),
                });
            } finally {
                setLoading(false);
            }
        },
    });

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center bg-bg-login bg-cover bg-no-repeat bg-center px-4">
            <div className="mb-4">
                <Image
                    src="/assets/logo.png"
                    alt="logo"
                    className="mx-auto pb-2 w-20"
                    width={80} 
                    height={10}
                />
            </div>
            <div className="flex flex-col items-center justify-center w-full max-w-md">
                <form
                    onSubmit={formik.handleSubmit}
                    className="w-full p-6 bg-white rounded-lg shadow-lg border-2 relative"
                    >
                    <h1 className='font-semibold text-lg text-blue-500 ms-1'>Reset Password</h1>
                    <PasswordField
                        id="new_password"
                        name="new_password"
                        placeholder={t('new-password-placeholder')}
                        formik={formik}
                        showPassword={showPassword}
                        setShowPassword={setShowPassword}
                    />

                    <PasswordField
                        id="konfirmasi_password"
                        name="konfirmasi_password"
                        placeholder={t('confirm-password-placeholder')}
                        formik={formik}
                        showPassword={showKonfirmasiPassword}
                        setShowPassword={setShowKonfirmasiPassword}
                    />

                    <button
                        type="submit"
                        className="w-full h-12 rounded-md bg-[#3D5FD9] text-[#F5F7FF] hover:bg-[#2347C5] mt-5 flex items-center justify-center text-lg"
                    >
                        {loading ? <LoadingCircle /> : t('submit')}
                    </button>
                </form>
            </div>
        </div>
    );
}

const InputField = ({ id, name, type, placeholder, formik }) => (
    <div className="relative">
        <input
            type={type}
            name={name}
            id={id}
            placeholder={placeholder}
            className="w-full h-12 rounded-lg pl-4 border border-blue mt-2 focus:outline-none focus:ring-1 text-lg"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values[name]}
        />
        {formik.touched[name] && formik.errors[name] ? (
            <div className="text-red-500 text-sm mt-2">{formik.errors[name]}</div>
        ) : null}
    </div>
);

const PasswordField = ({ id, name, placeholder, formik, showPassword, setShowPassword }) => (
    <div className="relative">
        <input
            type={showPassword ? 'text' : 'password'}
            name={name}
            id={id}
            placeholder={placeholder}
            className="w-full h-12 rounded-lg pl-4 border border-blue mt-2 focus:outline-none focus:ring-1 text-lg"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values[name]}
        />
        <div
            className="absolute top-5 right-3 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
        >
            {showPassword ? <AiOutlineEye size={25} /> : <AiOutlineEyeInvisible size={25} />}
        </div>
        {formik.touched[name] && formik.errors[name] ? (
            <div className="text-red-500 text-sm mt-2">{formik.errors[name]}</div>
        ) : null}
    </div>
);

const LoadingCircle = () => (
    <div className="flex justify-center items-center h-8">
        <div className="relative">
            <div className="w-8 h-8 border-4 border-white rounded-full border-t-transparent animate-spin"></div>
        </div>
    </div>
);

export default Page;
