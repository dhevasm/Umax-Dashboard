'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

const Navbar = () => {
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [lang, setLang] = useState('id');
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('landing');

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
    document.documentElement.classList.toggle('dark');
    setIsDark(!isDark);
    localStorage.setItem('color-theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
  };

  const handleLangChange = (event) => {
    const newLang = event.target.value;
    setLang(newLang);
    const newPath = pathname.replace(/^\/[a-z]{2}/, `/${newLang}`);
    router.push(newPath);
  };

  useEffect(() => {
    const currentLang = pathname.split('/')[1];
    setLang(currentLang);
  }, [pathname]);

  return (
    <div>
      <header className="top-0 left-0 z-50 w-full fixed px-20 bg-white dark:bg-slate-900 bg-opacity-80 shadow-sm backdrop-blur-sm">
        <div className="container mx-auto">
          <div className="relative flex items-center justify-between -mx-4">
            <div className="max-w-full px-4 w-60">
              <a href="javascript:void(0)" className="block w-full py-5">
              <Image
                  src="/assets/logo.png"
                  alt="Logo"
                  className="w-[140px] h-10 decoration-white mr-1 mt-2"
                  width={140}
                  height={40}
                />
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
                <nav className={`absolute right-4 top-full w-full max-w-[250px] rounded-lg bg-white dark:bg-slate-700 py-5 px-6 shadow transition-all lg:static lg:block lg:w-full lg:max-w-full lg:bg-transparent lg:shadow-none dark:bg-dark-2 lg:dark:bg-transparent ${navbarOpen ? 'block' : 'hidden'}`}>
                  <ul className="block lg:flex">
                    <li>
                      <a href="#home" className="flex py-2 text-base dark:text-slate-200 font-medium hover:text-primary lg:ml-12 lg:inline-flex">{t('home')}</a>
                    </li>
                    <li>
                      <a href="#payment" className="flex py-2 text-base dark:text-slate-200 font-medium hover:text-primary lg:ml-12 lg:inline-flex">{t("payment")}</a>
                    </li>
                    <li>
                      <a href="#feature" className="flex py-2 text-base dark:text-slate-200 font-medium hover:text-primary lg:ml-12 lg:inline-flex">{t("feature")}</a>
                    </li>
                    <li>
                      <a href="#contact" className="flex py-2 text-base dark:text-slate-200 font-medium hover:text-primary lg:ml-12 lg:inline-flex">{t("contact")}</a>
                    </li>
                    <li className='block md:hidden'>
                      <a href={`${lang}/login`} className="flex py-2 text-base dark:text-slate-200 font-medium hover:text-primary lg:ml-12 lg:inline-flex">{t("login")}</a>
                    </li>
                  </ul>
                </nav>
              </div>
              <div className="justify-end hidden pr-16 sm:flex lg:pr-0">
                <a href={`${lang}/login`} className="py-3 text-base font-medium px-7 text-dark dark:text-white hover:text-blue-600 mr-5">{t("login")}</a>
                <select name="" id="" className="rounded-full px-2 border" onChange={handleLangChange} value={lang}>
                  <option value="id">
                    Indonesia
                  </option>
                  <option value="en">
                    Inggris
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Theme Switcher */}
      <div className="fixed flex items-center justify-center bg-white rounded dark:bg-gray-600 z-[99999] shadow-1 dark:shadow-box-dark bottom-10 right-5 h-11 w-11">
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
              <g clipPath="url(#clip0_88_102)">
                <path d="M5.92136 17.6569L4.50717 19.0711L1.63604 16.2L3.05025 14.7858L5.92136 17.6569Z" fill="white" />
                <path d="M14.8285 5.10051L14.0465 2.63605L17.1213 1.63605L17.9033 4.10051L14.8285 5.10051Z" fill="white" />
                <path d="M17.6569 18.0786L19.0711 16.6644L21.9422 19.5355L20.528 20.9497L17.6569 18.0786Z" fill="white" />
                <path d="M9.17159 19.8285L8.17159 17.364L11.2431 16.364L12.2431 18.8285L9.17159 19.8285Z" fill="white" />
                <path d="M21 11.25H18V12.75H21V11.25Z" fill="white" />
                <path d="M6 11.25H3V12.75H6V11.25Z" fill="white" />
                <path d="M11.25 3V6H12.75V3H11.25Z" fill="white" />
                <path d="M11.25 18V21H12.75V18H11.25Z" fill="white" />
                <path d="M6.34315 5.92136L4.92893 4.50715L7.80005 1.63602L9.21426 3.05024L6.34315 5.92136Z" fill="white" />
                <path d="M19.0711 4.50715L17.6569 5.92136L14.7858 3.05024L16.2 1.63602L19.0711 4.50715Z" fill="white" />
                <path d="M18.3284 12C18.3284 15.4986 15.4986 18.3284 12 18.3284C8.50141 18.3284 5.67164 15.4986 5.67164 12C5.67164 8.50141 8.50141 5.67164 12 5.67164C15.4986 5.67164 18.3284 8.50141 18.3284 12Z" fill="white" />
              </g>
              <defs>
                <clipPath id="clip0_88_102">
                  <rect width={24} height={24} fill="white" />
                </clipPath>
              </defs>
            </svg>
          </span>
        </label>
      </div>
    </div>
  );
}

export default Navbar;
