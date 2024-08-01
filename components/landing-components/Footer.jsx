import Image from 'next/image'
import React from 'react'

const Footer = () => {
  return (
    <div>
        <footer className="relative z-10 bg-blue-600 max-w-full flex flex-col justify-center">
            <div className="container mx-auto px-20">
                <div className="border-b border-gray-7/20 pt-[70px] pb-10">
                    <div className="flex flex-wrap items-center justify-center -mx-4">
                        <div className="w-full px-4 lg:w-1/2">
                            <div className="w-full mb-5 max-w-[470px]">
                                <h3 className="text-2xl font-bold text-white sm:text-[28px] sm:leading-snug">
                                    Signup for latest news and insights from TailGrids UI
                                </h3>
                            </div>
                        </div>
                        <div className="w-full px-4 lg:w-1/2">
                            <div className="w-full mb-5">
                                <form className="flex flex-wrap justify-center">
                                    <div className="relative mr-5 mb-3 w-full max-w-[370px]">
                                        <input type="email" placeholder="Enter your email address" className="w-full pr-5 text-white bg-white/5 border border-white/[.08] rounded-md outline-none h-[52px] pl-14 placeholder-dark-8 focus:border-white/40 focus-visible:shadow-none" />
                                        <label className="absolute -translate-y-1/2 left-5 top-1/2">
                                            <svg width={18} height={13} viewBox="0 0 18 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M16.3052 0H1.69481C0.75974 0 0 0.799055 0 1.78251V11.2175C0 12.2009 0.75974 13 1.69481 13H16.3052C17.2403 13 18 12.2009 18 11.2175V1.78251C18 0.799055 17.2403 0 16.3052 0ZM16.3052 1.07565C16.4513 1.07565 16.5682 1.10638 16.6851 1.19858L9.40909 5.83924C9.1461 5.99291 8.8539 5.99291 8.59091 5.83924L1.31494 1.19858C1.43182 1.13712 1.5487 1.07565 1.69481 1.07565H16.3052ZM16.3052 11.8936H1.69481C1.34416 11.8936 1.02273 11.5863 1.02273 11.1868V2.27423L8.03572 6.76123C8.32792 6.94563 8.64935 7.03782 8.97078 7.03782C9.29221 7.03782 9.61364 6.94563 9.90584 6.76123L16.9188 2.27423V11.1868C16.9773 11.5863 16.6558 11.8936 16.3052 11.8936Z" fill="white" />
                                            </svg>
                                        </label>
                                    </div>
                                    <button type="submit" className="px-7 border border-transparent mb-3 transition bg-white rounded-md text-dark h-[52px] font-medium hover:bg-opacity-90">
                                        Subscribe
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container pt-14 lg:pt-20 px-20 w-full flex justify-center">
                <div className="flex flex-wrap justify-center -mx-4">
                    <div className="w-full px-4 sm:w-2/3 lg:w-4/12 2xl:w-3/12">
                        <div className="w-full mb-10">
                            <a href="" className="mb-6 inline-block max-w-[160px]">
                                <Image src="https://demo.tailgrids.com/templates/startup/build/src/assets/images/logo/logo-white.svg" alt="logo" className="max-w-full" width={160} height={160}/>
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
                            <h4 className="text-lg font-semibold text-white mb-9">TailGrids</h4>
                            <ul>
                                <li>
                                    <a href="" className="inline-block text-base leading-loose text-white/70 hover:text-white mb-2">
                                        About Us
                                    </a>
                                </li>
                                <li>
                                    <a href="" className="inline-block text-base leading-loose text-white/70 hover:text-white mb-2">
                                        Support
                                    </a>
                                </li>
                                <li>
                                    <a href="" className="inline-block text-base leading-loose text-white/70 hover:text-white mb-2">
                                        Our Blog
                                    </a>
                                </li>
                                <li>
                                    <a href="" className="inline-block text-base leading-loose text-white/70 hover:text-white mb-2">
                                        Our Products
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="w-full px-4 sm:w-1/2 lg:w-2/12 2xl:w-2/12">
                        <div className="w-full mb-10">
                            <h4 className="text-lg font-semibold text-white mb-9">Legal</h4>
                            <ul>
                                <li>
                                    <a href="" className="inline-block text-base leading-loose text-white/70 hover:text-white mb-2">
                                        Privacy Policy
                                    </a>
                                </li>
                                <li>
                                    <a href="" className="inline-block text-base leading-loose text-white/70 hover:text-white mb-2">
                                        Terms & Conditions
                                    </a>
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
                                    <span className="inline-block text-base leading-loose text-white/70 mb-2">
                                        +123 456 7890
                                    </span>
                                </li>
                                <li>
                                    <span className="inline-block text-base leading-loose text-white/70 mb-2">
                                        info@yourdomain.com
                                    </span>
                                </li>
                                <li>
                                    <span className="inline-block text-base leading-loose text-white/70 mb-2">
                                        www.tailgrids.com
                                    </span>
                                </li>
                                <li>
                                    <span className="inline-block text-base leading-loose text-white/70 mb-2">
                                        123 Business Centre London SW1A 1AA
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div className="pt-10 pb-10 px-20 w-full bg-white/[.06]">
                <div className="flex justify-between -mx-4">
                    <div className="w-full px-4 text-center sm:w-auto">
                        <p className="text-base text-white/70">
                            &copy; 2024 TailGrids. All Rights Reserved.
                        </p>
                    </div>
                    <div className="w-full px-4 text-center sm:w-auto">
                        <div className="flex items-center justify-center">
                            <a href="" className="px-4 text-base text-white/70 hover:text-white">
                                Privacy Policy
                            </a>
                            <a href="" className="px-4 text-base text-white/70 hover:text-white">
                                Terms of Use
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    </div>
  )
}

export default Footer