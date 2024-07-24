import React from 'react';

const Hero = () => {
  return (
    <div className="relative bg-white dark:bg-slate-900 pt-[120px] pb-[110px] lg:pt-[150px] px-20">
      <div className="container mx-auto">
        <div className="flex flex-wrap -mx-4">
          <div className="w-full px-4 lg:w-5/12">
            <div className="hero-content">
              <h1 className="mb-3 text-4xl font-bold leading-snug text-dark sm:text-[42px] lg:text-[40px] xl:text-[42px] dark:text-white">
                Startup Site Template <br/> Built-with TailGrids Components
              </h1>
              <p className="mb-8 max-w-[480px] text-base dark:text-slate-300 text-body-color">
                With TailGrids, business and students thrive together. Business
                can perfectly match their staffing to changing demand throughout
                the dayed.
              </p>
              <ul className="flex flex-wrap items-center">
                <li>
                  <a
                    href="javascript:void(0)"
                    className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-center text-white rounded-md bg-blue-600 hover:bg-blue-dark lg:px-7"
                  >
                    Get Started
                  </a>
                </li>
                <li>
                  <a
                    href="javascript:void(0)"
                    className="inline-flex items-center justify-center py-3 px-5 text-center text-base font-medium text-[#464646] dark:text-white hover:text-primary"
                  >
                    <span className="mr-2">
                      <svg
                        width="24"
                        height="25"
                        viewBox="0 0 24 25"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle cx="12" cy="12.6152" r="12" fill="#3758F9" />
                        <rect
                          x="7.99893"
                          y="14.979"
                          width="8.18182"
                          height="1.63636"
                          fill="white"
                        />
                        <rect
                          x="11.2717"
                          y="7.61523"
                          width="1.63636"
                          height="4.09091"
                          fill="white"
                        />
                        <path
                          d="M12.0898 14.1606L14.9241 11.0925H9.25557L12.0898 14.1606Z"
                          fill="white"
                        />
                      </svg>
                    </span>
                    Download App
                  </a>
                </li>
              </ul>
              <div className="pt-16 clients">
                <h6 className="flex items-center mb-2 text-xs font-normal dark:text-white">
                  Used by Thriving Brands
                  <span className="ml-2 inline-block h-[1px] w-8 bg-body-color"></span>
                </h6>
                <div className="flex max-w-[550px] items-center">
                  <div className="w-full py-3 mr-4">
                    <img
                      src="../assets/ayroui.svg"
                      alt="ayroui"
                    />
                  </div>
                  <div className="w-full py-3 mr-4">
                    <img
                      src="../assets/graygrids.svg"
                      alt="graygrids"
                    />
                  </div>
                  <div className="w-full py-3 mr-4">
                    <img
                      src="../assets/uideck.svg"
                      alt="uideck"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="hidden px-4 lg:block lg:w-1/12"></div>
          <div className="w-full px-4 lg:w-6/12">
            <div className="lg:ml-auto lg:text-right">
              <div className="relative z-10 inline-block pt-11 lg:pt-0">
                <img
                  src="../assets/hero-image-01.png"
                  alt="hero"
                  className="max-w-full lg:ml-auto"
                />
                <span className="absolute -left-8 -bottom-8 z-[-1]">
                  <svg
                    width="93"
                    height="93"
                    viewBox="0 0 93 93"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="2.5" cy="2.5" r="2.5" fill="#3056D3" />
                    <circle cx="2.5" cy="24.5" r="2.5" fill="#3056D3" />
                    <circle cx="2.5" cy="46.5" r="2.5" fill="#3056D3" />
                    <circle cx="2.5" cy="68.5" r="2.5" fill="#3056D3" />
                    <circle cx="2.5" cy="90.5" r="2.5" fill="#3056D3" />
                    <circle cx="24.5" cy="2.5" r="2.5" fill="#3056D3" />
                    <circle cx="24.5" cy="24.5" r="2.5" fill="#3056D3" />
                    <circle cx="24.5" cy="46.5" r="2.5" fill="#3056D3" />
                    <circle cx="24.5" cy="68.5" r="2.5" fill="#3056D3" />
                    <circle cx="24.5" cy="90.5" r="2.5" fill="#3056D3" />
                    <circle cx="46.5" cy="2.5" r="2.5" fill="#3056D3" />
                    <circle cx="46.5" cy="24.5" r="2.5" fill="#3056D3" />
                    <circle cx="46.5" cy="46.5" r="2.5" fill="#3056D3" />
                    <circle cx="46.5" cy="68.5" r="2.5" fill="#3056D3" />
                    <circle cx="46.5" cy="90.5" r="2.5" fill="#3056D3" />
                    <circle cx="68.5" cy="2.5" r="2.5" fill="#3056D3" />
                    <circle cx="68.5" cy="24.5" r="2.5" fill="#3056D3" />
                    <circle cx="68.5" cy="46.5" r="2.5" fill="#3056D3" />
                    <circle cx="68.5" cy="68.5" r="2.5" fill="#3056D3" />
                    <circle cx="68.5" cy="90.5" r="2.5" fill="#3056D3" />
                    <circle cx="90.5" cy="2.5" r="2.5" fill="#3056D3" />
                    <circle cx="90.5" cy="24.5" r="2.5" fill="#3056D3" />
                    <circle cx="90.5" cy="46.5" r="2.5" fill="#3056D3" />
                    <circle cx="90.5" cy="68.5" r="2.5" fill="#3056D3" />
                    <circle cx="90.5" cy="90.5" r="2.5" fill="#3056D3" />
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
