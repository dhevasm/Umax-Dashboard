'use client';

import React, { useEffect, useState } from 'react';

const Navbar = () => {
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const handleNavbarToggle = () => {
    setNavbarOpen(prevState => !prevState);
  };

  useEffect(() => {
    if (
      localStorage.getItem('color-theme') === 'dark' || 
      (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      document.documentElement.classList.add('dark');
      setIsDark(true);
      localStorage.setItem('color-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
      localStorage.setItem('color-theme', 'light');
    }
  }, []);

  const handleTheme = () => {
    document.documentElement.classList.toggle("dark");
    setIsDark(!isDark);
    localStorage.setItem('color-theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
  };

  return (
    <div>
      <header className={`top-0 left-0 z-50 w-full fixed px-20 bg-white dark:bg-slate-900 bg-opacity-80 shadow-sm backdrop-blur-sm`}>
        <div className="container mx-auto">
          <div className="relative flex items-center justify-between -mx-4">
            <div className="max-w-full px-4 w-60">
              <a href="javascript:void(0)" className="block w-full py-5">
                <img src="../assets/logo.png" alt="logo" className="w-[150px]" />
              </a>
            </div>
            <div className="flex items-center justify-between w-full px-4">
              <div>
                <button
                  onClick={handleNavbarToggle}
                  className={`absolute right-4 top-1/2 block -translate-y-1/2 rounded-lg px-3 py-[6px] ring-primary focus:ring-2 lg:hidden ${navbarOpen ? 'navbarTogglerActive' : ''}`}
                >
                  <span className="relative my-[6px] block h-[2px] w-[30px] bg-body-color bg-black dark:bg-white"></span>
                  <span className="relative my-[6px] block h-[2px] w-[30px] bg-body-color bg-black dark:bg-white"></span>
                  <span className="relative my-[6px] block h-[2px] w-[30px] bg-body-color bg-black dark:bg-white"></span>
                </button>
                <nav className={`absolute right-4 top-full w-full max-w-[250px] rounded-lg bg-white py-5 px-6 shadow transition-all lg:static lg:block lg:w-full lg:max-w-full lg:bg-transparent lg:shadow-none dark:bg-dark-2 lg:dark:bg-transparent ${navbarOpen ? 'block' : 'hidden'}`}>
                  <ul className="block lg:flex">
                    <li>
                      <a href="javascript:void(0)" className="flex py-2 text-base dark:text-slate-200 font-medium hover:text-primary lg:ml-12 lg:inline-flex">Home</a>
                    </li>
                    <li>
                      <a href="javascript:void(0)" className="flex py-2 text-base dark:text-slate-200 font-medium hover:text-primary lg:ml-12 lg:inline-flex">Payment</a>
                    </li>
                    <li>
                      <a href="javascript:void(0)" className="flex py-2 text-base dark:text-slate-200 font-medium hover:text-primary lg:ml-12 lg:inline-flex">Features</a>
                    </li>
                  </ul>
                </nav>
              </div>
              <div className="justify-end hidden pr-16 sm:flex lg:pr-0">
                <a href="/" className="py-3 text-base font-medium px-7 text-dark dark:text-white hover:text-primary">Login</a>
                {/* <a href="javascript:void(0)" className="py-3 text-base font-medium text-white rounded-lg bg-blue-600 px-7 hover:bg-opacity-90">Sign Up</a> */}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Theme Switcher */}
      <div className="fixed flex items-center justify-center bg-white rounded dark:bg-gray-600 z-[99999] shadow-1 dark:shadow-box-dark bottom-10 right-10 h-11 w-11">
        <label htmlFor="themeSwitcher" className="inline-flex items-center cursor-pointer" aria-label="themeSwitcher" name="themeSwitcher">
          <input 
            type="checkbox" 
            name="themeSwitcher" 
            checked={isDark} 
            onChange={handleTheme} 
            id="themeSwitcher" 
            className="sr-only" 
          />
          <span className="block text-body-color dark:hidden">
            <svg className="fill-current" width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13.3125 1.50001C12.675 1.31251 12.0375 1.16251 11.3625 1.05001C10.875 0.975006 10.35 1.23751 10.1625 1.68751C9.93751 2.13751 10.05 2.70001 10.425 3.00001C13.0875 5.47501 14.0625 9.11251 12.975 12.525C11.775 16.3125 8.25001 18.975 4.16251 19.0875C3.63751 19.0875 3.22501 19.425 3.07501 19.9125C2.92501 20.4 3.15001 20.925 3.56251 21.1875C4.50001 21.75 5.43751 22.2 6.37501 22.5C7.46251 22.8375 8.58751 22.9875 9.71251 22.9875C11.625 22.9875 13.5 22.5 15.1875 21.5625C17.85 20.1 19.725 17.7375 20.55 14.8875C22.1625 9.26251 18.975 3.37501 13.3125 1.50001ZM18.9375 14.4C18.2625 16.8375 16.6125 18.825 14.4 20.0625C12.075 21.3375 9.41251 21.6 6.90001 20.85C6.63751 20.775 6.33751 20.6625 6.07501 20.55C10.05 19.7625 13.35 16.9125 14.5875 13.0125C15.675 9.56251 15 5.92501 12.7875 3.07501C17.5875 4.68751 20.2875 9.67501 18.9375 14.4Z" />
            </svg>
          </span>
          <span className="hidden text-white dark:block">
            <svg className="fill-current" width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_2172_3070)">
                <path d="M12 6.89999C9.18752 6.89999 6.90002 9.18749 6.90002 12C6.90002 14.8125 9.18752 17.1 12 17.1C14.8125 17.1 17.1 14.8125 17.1 12C17.1 9.18749 14.8125 6.89999 12 6.89999ZM12 15.4125C10.125 15.4125 8.58752 13.875 8.58752 12C8.58752 10.125 10.125 8.58749 12 8.58749C13.875 8.58749 15.4125 10.125 15.4125 12C15.4125 13.875 13.875 15.4125 12 15.4125Z" />
                <path d="M12 4.6875C12.375 4.6875 12.75 4.3875 12.75 3.9375V1.5C12.75 1.05 12.375 0.75 12 0.75C11.625 0.75 11.25 1.05 11.25 1.5V3.9375C11.25 4.3875 11.625 4.6875 12 4.6875Z" />
                <path d="M12 19.3125C11.625 19.3125 11.25 19.6125 11.25 20.0625V22.5C11.25 22.95 11.625 23.25 12 23.25C12.375 23.25 12.75 22.95 12.75 22.5V20.0625C12.75 19.6125 12.375 19.3125 12 19.3125Z" />
                <path d="M6.4875 6.48749C6.75 6.74999 7.125 6.74999 7.3875 6.48749C7.65 6.22499 7.65 5.84999 7.3875 5.58749L5.8125 4.01249C5.55 3.74999 5.175 3.74999 4.9125 4.01249C4.65001 4.27499 4.65001 4.64999 4.9125 4.91249L6.4875 6.48749Z" />
                <path d="M18.1875 18.1875C17.925 17.925 17.55 17.925 17.2875 18.1875C17.025 18.45 17.025 18.825 17.2875 19.0875L18.8625 20.6625C19.125 20.925 19.5 20.925 19.7625 20.6625C20.025 20.4 20.025 20.025 19.7625 19.7625L18.1875 18.1875Z" />
                <path d="M4.68752 12C4.68752 11.625 4.38752 11.25 3.93752 11.25H1.50002C1.05002 11.25 0.750015 11.625 0.750015 12C0.750015 12.375 1.05002 12.75 1.50002 12.75H3.93752C4.38752 12.75 4.68752 12.375 4.68752 12Z" />
                <path d="M22.5 11.25H20.0625C19.6125 11.25 19.3125 11.625 19.3125 12C19.3125 12.375 19.6125 12.75 20.0625 12.75H22.5C22.95 12.75 23.25 12.375 23.25 12C23.25 11.625 22.95 11.25 22.5 11.25Z" />
                <path d="M6.4875 17.5125L4.9125 19.0875C4.65001 19.35 4.65001 19.725 4.9125 19.9875C5.175 20.25 5.55 20.25 5.8125 19.9875L7.3875 18.4125C7.65001 18.15 7.65001 17.775 7.3875 17.5125C7.125 17.25 6.75 17.25 6.4875 17.5125Z" />
                <path d="M17.5125 6.48749C17.775 6.74999 18.15 6.74999 18.4125 6.48749L19.9875 4.91249C20.25 4.64999 20.25 4.27499 19.9875 4.01249C19.725 3.74999 19.35 3.74999 19.0875 4.01249L17.5125 5.58749C17.25 5.84999 17.25 6.22499 17.5125 6.48749Z" />
              </g>
              <defs>
                <clipPath id="clip0_2172_3070">
                  <rect width={24} height={24} fill="white" />
                </clipPath>
              </defs>
            </svg>
          </span>
        </label>
      </div>
    </div>
  );
};

export default Navbar;
