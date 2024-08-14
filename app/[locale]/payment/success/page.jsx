'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { IconContext } from 'react-icons'
import { FaCheckCircle, FaExclamationCircle } from 'react-icons/fa'
import { useSearchParams } from 'next/navigation'
import Swal from 'sweetalert2'
import axios from 'axios'
import { Snap } from 'midtrans-client'

const SuccessPage = () => {  
    const Router = useRouter()
    const [order_id, setOrder_id] = useState("")

    const searchParams = useSearchParams()
    const [status, setStatus] = useState('')
    const [snapToken, setSnapToken] = useState('')

    const verifyPayment = async (order_id) => { 
        const formData = new URLSearchParams({
            order_id: order_id,
        }).toString();
  
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payment-verify`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Server Error:', errorData);
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Failed to verify payment. Please try again.',
                }).then(() => Router.push('/'));
                return;
            }
  
            const data = await response.json();
            // console.log(data);
            setStatus(data.Status);
            setSnapToken(data.SnapToken);
        } catch (error) {
            console.error('Network Error:', error);
            alert('Network error occurred. Please try again.');
        }
    }
    
    useEffect(() => {
        setOrder_id(searchParams.get('order_id'))
    }, [searchParams])

    useEffect(() => {
        if(order_id){
            verifyPayment(order_id)
        }
    }, [order_id])

    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(order_id).then(() => {
            Swal.fire({
                icon: 'success',
                title: 'Copied!',
                text: 'Order ID copied to clipboard.',
                timer: 1500,
                showConfirmButton: false,
            })
        }).catch(err => {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Failed to copy the order ID.',
            })
        })
    }

    const cancelPayment = () => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You will not be able to revert this!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, cancel it!',
            cancelButtonText: 'No, keep it',
        }).then( async(result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/delete-transaction?order_id=${order_id}`, {
                        method: 'DELETE',
                    });
        
                    if (!response.ok) {
                        const errorData = await response.json();
                        console.error('Server Error:', errorData);
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Failed to cancel payment. Please try again.',
                        }).then(() => Router.push('/'));
                        return;
                    }
          
                    const data = await response.json();
                    if(!data.isError){
                        Swal.fire('Cancelled!', 'Your payment has been cancelled.', 'success').then(() => Router.push('/'));
                    }
                } catch (error) {
                    console.error('Network Error:', error);
                    alert('Network error occurred. Please try again.');
                }
            }
        });
    }

    const continuePayment = async() => {
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
      snap.pay(data.token)
    } catch (error) {
      console.error('Network Error:', error);
      alert('Network error occurred. Please try again.');
    }
    }

    return (
        <div className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center bg-bg-login bg-cover bg-no-repeat bg-left">
            { status == "settlement" && (
                <>
                    <div className="bg-white p-6 rounded-lg shadow-lg text-center flex flex-col justify-center">
                    <div className='flex w-full justify-center my-3'>
                        <FaCheckCircle size={50} className='text-2xl font-bold text-green-500' />
                    </div>
                    <h2 className="text-4xl font-semibold text-gray-800 mb-2">Payment Success</h2>
                    <p className="text-gray-600 mb-4">
                        Thank you for your order. Your payment has been processed successfully.
                        <br />
                        This is your order ID: <span onClick={handleCopyToClipboard} className="hover:underline font-semibold text-blue-500 cursor-pointer">{order_id}</span>
                    </p>
                    
                    <button onClick={() => Router.push(`/en/tenant-register?order_id=${order_id}`)} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition duration-300">
                        Register your tenant
                    </button>
                </div>
                    <p className='text-yellow-500 mt-3'>Save your order id (click order_id to copy)</p>
                </>
            )
            }
            {
                status == "pending" && (
                    <>
                        <div className="bg-white p-6 rounded-lg shadow-lg text-center flex flex-col justify-center">
                    <div className='flex w-full justify-center my-3'>
                        <FaExclamationCircle size={50} className='text-2xl font-bold text-yellow-500' />
                    </div>
                    <h2 className="text-4xl font-semibold text-gray-800 mb-2">Payment Pending</h2>
                    <p className="text-gray-600 mb-4">
                        Your payment is currently being processed. Please complete the payment to proceed.
                        <br />
                        This is your order ID: <span onClick={handleCopyToClipboard} className="hover:underline font-semibold text-blue-500 cursor-pointer">{order_id}</span>
                    </p>
                    <button onClick={continuePayment} id='continue' className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded transition duration-300 mb-3">
                        Complete your payment
                    </button>
                    <button onClick={cancelPayment} className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition duration-300">
                        Cancel Payment & back to page
                    </button>
                </div>
                <p className='text-yellow-500 mt-3'>Save your order id (click order_id to copy)</p>
                </>
                )
            }
            
        </div>
    )
}

export default SuccessPage
