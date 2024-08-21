'use client'

import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

const ForgotPassword = () => {
    const router = useRouter();
    const t = useTranslations('forgot-password');
    const pathname = usePathname();
    const lang = pathname.slice(0, 3);
    const [loading, setLoading] = useState(false);

    const validationSchema = Yup.object({
        email: Yup.string()
            .email(t('email-error'))
            .required(t('email-required'))
    });

    const formik = useFormik({
        initialValues: {
            email: '',
        },
        validationSchema,
        onSubmit: async (values) => {
            setLoading(true); // Set loading to true when submission starts
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/send-password-reset-email`,
                    {
                        method: 'POST',
                        headers: {
                            'accept': 'application/json',
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        body: new URLSearchParams(values).toString(),
                    }
                );

                if (!response.ok) {
                    throw new Error('Failed to send reset email');
                }

                Swal.fire({
                    icon: 'success',
                    title: t('success-title'),
                    text: t('reset-email-sent'),
                    confirmButtonColor: '#3D5FD9',
                    confirmButtonText: t('ok'),
                }).then((result) => {
                    if (result.isConfirmed) {
                        router.push(`${lang}/login`);
                    }
                });
            } catch (error) {
                console.error(error);
                Swal.fire({
                    icon: 'error',
                    title: t('error-title'),
                    text: t('reset-email-error'),
                    confirmButtonColor: '#FF5252',
                    confirmButtonText: t('ok'),
                });
            } finally {
                setLoading(false); // Set loading to false when submission ends
            }
        },
    });

    return (
        <div className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center bg-bg-login bg-cover bg-no-repeat bg-center">
            <div className="w-10/12 md:w-full max-w-md mx-auto">
                <Image src="/assets/logo.png" alt="logo" className="mx-auto pb-2" width={80} height={10}/>
                <div className="flex flex-col items-center justify-center mt-5 sm:mt-0">
                    <form
                        onSubmit={formik.handleSubmit}
                        className="w-full p-6 bg-white rounded-lg shadow-lg border-2"
                    >
                        <input
                            type="email"
                            name="email"
                            id="email"
                            placeholder={t('email-placeholder')}
                            className="w-full h-12 rounded-lg pl-5 border border-blue mt-2 focus:outline-none focus:ring-1"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.email}
                        />
                        {formik.touched.email && formik.errors.email ? (
                            <div className="text-red-500 mt-2">{formik.errors.email}</div>
                        ) : null}

                        <button
                            type="submit"
                            className="w-full h-10 rounded-full bg-[#3D5FD9] text-[#F5F7FF] hover:bg-[#2347C5] mt-5 flex items-center justify-center"
                        >
                            {loading ? <LoadingCircle /> : t('submit')}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

const LoadingCircle = () => (
    <div className="flex justify-center items-center h-8">
        <div className="relative">
            <div className="w-7 h-7 border-4 border-white rounded-full border-t-transparent animate-spin"></div>
        </div>
    </div>
);

export default ForgotPassword;
