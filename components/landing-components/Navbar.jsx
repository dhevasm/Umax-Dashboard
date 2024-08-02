'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { IconContext } from 'react-icons';
import { FaMoon, FaSun } from 'react-icons/fa';
import { FiSun } from 'react-icons/fi';
import { BiSun } from 'react-icons/bi';

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
      <header className="top-0 left-0 z-50 w-full fixed bg-white dark:bg-slate-900 bg-opacity-80 shadow-sm backdrop-blur-sm">
        <div className="container mx-auto">
          <div className="relative flex items-center justify-between -mx-4">
            <div className="max-w-full px-4 w-60">
              <a href="" className="block w-full py-5 ms-5">
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
                  className={`me-5 absolute right-4 top-1/2 block -translate-y-1/2 rounded-lg px-3 py-[6px] ring-primary focus:ring-2 lg:hidden ${navbarOpen ? 'navbarTogglerActive' : ''}`}
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
      <div className="fixed flex items-center justify-center bg-blue-500 rounded dark:bg-gray-600 z-[99999] shadow-1 dark:shadow-box-dark bottom-10 right-5 h-11 w-11">
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
            <FiSun className='text-2xl text-white'/>
          </span>
          <span className="hidden text-white dark:block">
            <FaMoon className='text-xl'/>
          </span>
        </label>
      </div>
    </div>
  );
}

export default Navbar;
