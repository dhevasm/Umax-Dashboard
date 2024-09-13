"use client"
import Image from 'next/image'
import React from 'react'
import Link from 'next/link'

const Footer = () => {
  return (
    <div>
        <footer className="relative z-10 bg-blue-600 max-w-full flex flex-col justify-center">
            <div className="container mx-auto px-10 md:px-20">
                <div className="border-b border-gray-7/20 pt-[10px] pb-10">
                </div>
            </div>
            <div className="container pt-14 lg:pt-20 px-10 md:px-20 w-full flex justify-center">
                <div className="flex flex-wrap justify-center -mx-4">
                    <div className="w-full px-4 sm:w-2/3 lg:w-4/12 2xl:w-3/12">
                        <div className="w-full mb-10">
                            <a href="" className="mb-6  max-w-[160px] flex gap-3 items-center">
                                <Image src={"/assets/iconBlue.png"} alt="logo" className="max-w-full bg-white p-3 rounded-full" width={58} height={58}/>
                                <h1 className='text-white font-bold text-xl text-nowrap'>
                                UMAX Dasboard
                                </h1>
                            </a>
                            <p className="text-base mb-7 text-white/70">
                                We create digital experiences for brands and companies by using
                                technology.
                            </p>
                            <div className="flex items-center justify-start -mx-3">
                                <a href="" className="px-3 text-white hover:text-gray-900">
                                    <svg width={10} height={18} viewBox="0 0 10 18" className="fill-current">
                                        <path d="M9.00007 6.82105H7.50006H6.96434V6.27097V4.56571V4.01562H7.50006H8.62507C8.91971 4.01562 9.16078 3.79559 9.16078 3.46554V0.550085C9.16078 0.247538 8.9465 0 8.62507 0H6.66969C4.55361 0 3.08038 1.54024 3.08038 3.82309V6.21596V6.76605H2.54466H0.72322C0.348217 6.76605 0 7.06859 0 7.50866V9.48897C0 9.87402 0.294645 10.2316 0.72322 10.2316H2.49109H3.02681V10.7817V16.31C3.02681 16.6951 3.32145 17.0526 3.75003 17.0526H6.26791C6.42862 17.0526 6.56255 16.9701 6.66969 16.8601C6.77684 16.7501 6.8572 16.5576 6.8572 16.3925V10.8092V10.2591H7.4197H8.62507C8.97328 10.2591 9.24114 10.0391 9.29471 9.709V9.6815V9.65399L9.66972 7.7562C9.6965 7.56367 9.66972 7.34363 9.509 7.1236C9.45543 6.98608 9.21436 6.84856 9.00007 6.82105Z" />
                                    </svg>
                                </a>
                                <a href="" className="px-3 text-white hover:text-gray-900">
                                    <svg width={19} height={15} viewBox="0 0 19 15" className="fill-current">
                                        <path d="M16.2622 3.17878L17.33 1.93293C17.6391 1.59551 17.7234 1.33595 17.7515 1.20618C16.9085 1.67337 16.1217 1.82911 15.6159 1.82911H15.4192L15.3068 1.72528C14.6324 1.18022 13.7894 0.894714 12.8902 0.894714C10.9233 0.894714 9.37779 2.40012 9.37779 4.13913C9.37779 4.24295 9.37779 4.39868 9.40589 4.5025L9.49019 5.02161L8.90009 4.99565C5.30334 4.89183 2.35288 2.03675 1.87518 1.5436C1.08839 2.84136 1.53799 4.08722 2.01568 4.86587L2.97107 6.31937L1.45369 5.54071C1.48179 6.63084 1.93138 7.48736 2.80247 8.11029L3.56116 8.62939L2.80247 8.9149C3.28017 10.2386 4.34795 10.7837 5.13474 10.9913L6.17443 11.2509L5.19094 11.8738C4.48002 12.3589 3.41723 12.6673 2.37935 12.6125C4.55361 13.9502 7.32939 13.8834 9.35666 12.4777C10.4572 11.7656 11.1653 11.0049 11.5101 10.5946L12.069 9.93073L11.2224 9.93073H10.9281C10.5023 9.93073 10.1351 9.56412 10.1351 9.13979V7.64451H11.2224H11.9261C12.2043 7.64451 12.374 7.47431 12.4276 7.34312C12.5102 7.13955 12.4511 6.98662 12.4019 6.92075L12.4019 6.89324C12.4019 6.89324 12.4019 6.86573 12.374 6.86573H12.1201C12.1743 6.81135 12.3467 6.70353 12.4019 6.64915C13.5036 5.8671 14.4769 4.93998 15.289 3.89695L15.671 3.37785C15.5031 3.43223 15.4479 3.4866 15.3068 3.43223C15.6988 3.43223 16.1191 3.3244 16.2622 3.17878Z" />
                                    </svg>
                                </a>
                                <a href="" className="px-3 text-white hover:text-gray-900">
                                    <svg width={18} height={16} viewBox="0 0 18 16" className="fill-current">
                                        <path d="M16.3438 0H1.65625C0.737891 0 0 0.737891 0 1.65625V14.3438C0 15.2621 0.737891 16 1.65625 16H16.3438C17.2621 16 18 15.2621 18 14.3438V1.65625C18 0.737891 17.2621 0 16.3438 0ZM5.625 13.2812H3.42188V6.42188H5.625V13.2812ZM4.52344 5.58984H4.50656C3.74883 5.58984 3.1875 5.00601 3.1875 4.29141C3.1875 3.55879 3.76758 2.99219 4.54219 2.99219C5.31758 2.99219 5.85938 3.55879 5.875 4.29141C5.875 5.00601 5.31406 5.58984 4.52344 5.58984ZM14.8125 13.2812H12.6094V9.94922C12.6094 9.13555 12.5836 8.04688 11.4734 8.04688C10.3371 8.04688 10.1602 8.93945 10.1602 9.88203V13.2812H7.95703V6.42188H10.0664V7.22695H10.093C10.4066 6.68945 11.1301 6.11523 12.132 6.11523C14.282 6.11523 14.8125 7.4457 14.8125 9.50977V13.2812Z" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="w-full px-4 sm:w-1/2 lg:w-2/12 2xl:w-2/12">
                        <div className="w-full mb-10">
                            <h4 className="text-lg font-semibold text-white mb-9">Umax</h4>
                            <ul>
                                <li>
                                    <Link href={"https://umax.co.id/about"} className="inline-block text-base leading-loose text-white/70 hover:text-white mb-2">
                                        About Us
                                    </Link>
                                </li>
                                <li>
                                    <Link href="https://umax.co.id/portfolio/" className="inline-block text-base leading-loose text-white/70 hover:text-white mb-2">
                                        Portofolio
                                    </Link>
                                </li>
                                <li>
                                    <Link href="https://umax.co.id/blog/" className="inline-block text-base leading-loose text-white/70 hover:text-white mb-2">
                                        Blog
                                    </Link>
                                </li>
                                <li>
                                    <Link href="https://umax.co.id/gallery/" className="inline-block text-base leading-loose text-white/70 hover:text-white mb-2">
                                        Gallery
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="w-full px-4 sm:w-1/2 lg:w-2/12 2xl:w-2/12">
                        <div className="w-full mb-10">
                            <h4 className="text-lg font-semibold text-white mb-9">Legal</h4>
                            <ul>
                                <li>
                                    <Link href="https://www.termsfeed.com/live/2d907ed6-3b08-4a39-b196-15250f047b29" target='_blank' className="inline-block text-base leading-loose text-white/70 hover:text-white mb-2">
                                        Privacy Policy
                                    </Link>
                                </li>
                                <li>
                                    <Link href="https://www.termsfeed.com/live/2d907ed6-3b08-4a39-b196-15250f047b29" target='_blank' className="inline-block text-base leading-loose text-white/70 hover:text-white mb-2">
                                        Terms & Conditions
                                    </Link>
                                </li>
                                <li>
                                    <a href="" className="inline-block text-base leading-loose text-white/70 hover:text-white mb-2">
                                        Refund Policy
                                    </a>
                                </li>
                                <li>
                                    <a href="" className="inline-block text-base leading-loose text-white/70 hover:text-white mb-2">
                                        Cookie Policy
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="w-full px-4 sm:w-2/3 lg:w-4/12 2xl:w-3/12">
                        <div className="w-full mb-10">
                            <h4 className="text-lg font-semibold text-white mb-9">Contact Us</h4>
                            <ul>
                                <li>
                                    <Link href={"https://wa.me/6281212122388"} target='_blank' className="inline-block text-base leading-loose text-white/70 mb-2">
                                        0812-1212-2388
                                    </Link>
                                </li>
                                <li>
                                    <Link href={"mailto:suratkita@gmail.com"} className="inline-block text-base leading-loose text-white/70 mb-2">
                                        suratkita@gmail.com
                                    </Link>
                                </li>
                                <li>
                                    <Link href={"https://ubig.co.id"} target='_blank' className="inline-block text-base leading-loose text-white/70 mb-2">
                                        ubig.co.id
                                    </Link>
                                </li>
                                <li>
                                    <Link href={"https://www.google.com/maps?sca_esv=9267af3241730e66&sca_upv=1&rlz=1C1ONGR_enID1037ID1037&sxsrf=ADLYWIK90hxbmGCOKIdtDp2nmSUBUg1ozw:1722582345654&lsig=AB86z5VlZ0IJm7LN4VqASAEKSYB4&shndl=-1&shem=lsde,vslcca&kgs=1710c6c08c50f5a1&um=1&ie=UTF-8&fb=1&gl=id&sa=X&geocode=KV8tQDwPgnguMUtF11K-rBhO&daddr=Ruko+Modern+Kav+A16-A17,+Tasikmadu,+Kec.+Lowokwaru,+Kota+Malang,+Jawa+Timur+65143"} className="inline-block text-base leading-loose text-white/70 mb-2" target='_blank'>
                                    Ruko Modern Kav A16-A17, Jl Loncat Indah, Tasikmadu, Kota Malang 65143
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div className="pt-10 pb-10 px-20 w-full bg-white/[.06]">
                <div className="flex flex-col gap-5 md:flex-row justify-between -mx-4">
                    <div className="w-full px-4 text-center sm:w-auto">
                        <p className="text-base text-white/70">
                            &copy; 
                            {new Date().getFullYear()} Umax Dashboard. All Rights Reserved.
                        </p>
                    </div>
                    <div className="w-full px-4 text-center sm:w-auto">
                        <div className="flex flex-col gap-5 md:flex-row items-center justify-center">
                            <Link href="https://www.termsfeed.com/live/2d907ed6-3b08-4a39-b196-15250f047b29" target='_blank' className="px-4 text-base text-white/70 hover:text-white">
                                Privacy Policy
                            </Link>
                            <Link href="https://www.termsfeed.com/live/2d907ed6-3b08-4a39-b196-15250f047b29" target='_blank' className="px-4 text-base text-white/70 hover:text-white">
                                Terms of Use
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    </div>
  )
}

export default Footer