"use client";

import React from 'react';
import { useTheme } from './ThemeProvider';

const Header = ({ sidebarOpen, setSidebarOpen }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-999 flex w-full bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none">
      <div className="flex flex-grow items-center justify-between px-4 py-4 shadow-2 md:px-6 2xl:px-11">
        <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
          {/* <!-- Hamburger Toggle BTN --> */}
          <button
            aria-controls="sidebar"
            onClick={(e) => {
              e.stopPropagation();
              setSidebarOpen(!sidebarOpen);
            }}
            className="z-99999 block rounded-sm border border-stroke bg-white p-1.5 shadow-sm dark:border-strokedark dark:bg-boxdark lg:hidden"
          >
            <span className="relative block h-5.5 w-5.5 cursor-pointer">
              <span className="du-block absolute right-0 h-full w-full">
                <span
                  className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-[0] duration-200 ease-in-out dark:bg-white ${
                    !sidebarOpen && '!w-full delay-300'
                  }`}
                ></span>
                <span
                  className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-150 duration-200 ease-in-out dark:bg-white ${
                    !sidebarOpen && 'delay-400 !w-full'
                  }`}
                ></span>
                <span
                  className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-200 duration-200 ease-in-out dark:bg-white ${
                    !sidebarOpen && '!w-full delay-500'
                  }`}
                ></span>
              </span>
              <span className="absolute right-0 h-full w-full rotate-45">
                <span
                  className={`absolute left-2.5 top-0 block h-full w-0.5 rounded-sm bg-black delay-300 duration-200 ease-in-out dark:bg-white ${
                    !sidebarOpen && '!h-0 !delay-[0]'
                  }`}
                ></span>
                <span
                  className={`delay-400 absolute left-0 top-2.5 block h-0.5 w-full rounded-sm bg-black duration-200 ease-in-out dark:bg-white ${
                    !sidebarOpen && '!h-0 !delay-200'
                  }`}
                ></span>
              </span>
            </span>
          </button>
          {/* <!-- Hamburger Toggle BTN --> */}
        </div>

        <div className="hidden sm:block">
          <h1 className="text-title-md2 font-semibold text-black dark:text-white">
            Panel de Administrador
          </h1>
        </div>

        <div className="flex items-center gap-3 2xsm:gap-7">
          {/* <!-- Dark Mode Toggler --> */}
          <button
            onClick={toggleTheme}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-stroke bg-gray-2 dark:border-strokedark dark:bg-meta-4 dark:text-white"
          >
            {theme === 'dark' ? (
              <svg
                className="fill-current"
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.0002 12.375C10.9127 12.375 12.4689 10.8188 12.4689 8.90625C12.4689 6.99375 10.9127 5.4375 9.0002 5.4375C7.0877 5.4375 5.53145 6.99375 5.53145 8.90625C5.53145 10.8188 7.0877 12.375 9.0002 12.375ZM9.0002 6.5625C10.2814 6.5625 11.3439 7.625 11.3439 8.90625C11.3439 10.1875 10.2814 11.25 9.0002 11.25C7.71895 11.25 6.65645 10.1875 6.65645 8.90625C6.65645 7.625 7.71895 6.5625 9.0002 6.5625Z"
                  fill=""
                />
                <path
                  d="M8.4377 0.5625C8.4377 0.28125 8.7189 0 9.0002 0C9.2814 0 9.5627 0.28125 9.5627 0.5625V2.8125C9.5627 3.09375 9.2814 3.375 9.0002 3.375C8.7189 3.375 8.4377 3.09375 8.4377 2.8125V0.5625Z"
                  fill=""
                />
                <path
                  d="M8.4377 15.1875V17.4375C8.4377 17.7188 8.7189 18 9.0002 18C9.2814 18 9.5627 17.7188 9.5627 17.4375V15.1875C9.5627 14.9063 9.2814 14.625 9.0002 14.625C8.7189 14.625 8.4377 14.9063 8.4377 15.1875Z"
                  fill=""
                />
                <path
                  d="M17.4377 8.4375H15.1877C14.9064 8.4375 14.6252 8.71875 14.6252 9C14.6252 9.28125 14.9064 9.5625 15.1877 9.5625H17.4377C17.7189 9.5625 18.0002 9.28125 18.0002 9C18.0002 8.71875 17.7189 8.4375 17.4377 8.4375Z"
                  fill=""
                />
                <path
                  d="M2.8127 9.5625H0.562695C0.281445 9.5625 0.000195312 9.28125 0.000195312 9C0.000195312 8.71875 0.281445 8.4375 0.562695 8.4375H2.8127C3.09395 8.4375 3.3752 8.71875 3.3752 9C3.3752 9.28125 3.09395 9.5625 2.8127 9.5625Z"
                  fill=""
                />
              </svg>
            ) : (
              <svg
                className="fill-current"
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8.9999 13.5C11.4852 13.5 13.4999 11.4853 13.4999 9C13.4999 6.51472 11.4852 4.5 8.9999 4.5C6.51462 4.5 4.4999 6.51472 4.4999 9C4.4999 11.4853 6.51462 13.5 8.9999 13.5Z"
                  fill=""
                />
              </svg>
            )}
          </button>
          {/* <!-- Dark Mode Toggler --> */}

          {/* <!-- User Area --> */}
          <div className="relative">
            <div className="flex items-center gap-4">
              <span className="hidden text-right lg:block">
                <span className="block text-sm font-medium text-black dark:text-white">
                  Administrador
                </span>
                <span className="block text-xs">Super Admin</span>
              </span>

              <span className="h-12 w-12 rounded-full bg-gray-2 flex items-center justify-center">
                <svg
                  className="fill-current"
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11 9.62499C8.42188 9.62499 6.35938 7.59687 6.35938 5.12187C6.35938 2.64687 8.42188 0.618744 11 0.618744C13.5781 0.618744 15.6406 2.64687 15.6406 5.12187C15.6406 7.59687 13.5781 9.62499 11 9.62499ZM11 2.16562C9.28125 2.16562 7.90625 3.50624 7.90625 5.12187C7.90625 6.73749 9.28125 8.07812 11 8.07812C12.7188 8.07812 14.0938 6.73749 14.0938 5.12187C14.0938 3.50624 12.7188 2.16562 11 2.16562Z"
                    fill=""
                  />
                  <path
                    d="M17.7719 21.4156H4.2281C3.5406 21.4156 2.9906 20.8656 2.9906 20.1781V17.0844C2.9906 13.7156 5.7406 10.9656 9.10935 10.9656H12.925C16.2937 10.9656 19.0437 13.7156 19.0437 17.0844V20.1781C19.0437 20.8656 18.4937 21.4156 17.7719 21.4156ZM4.53748 19.8687H17.4969V17.0844C17.4969 14.575 15.4344 12.5125 12.925 12.5125H9.10935C6.59998 12.5125 4.53748 14.575 4.53748 17.0844V19.8687Z"
                    fill=""
                  />
                </svg>
              </span>
            </div>
          </div>
          {/* <!-- User Area --> */}
        </div>
      </div>
    </header>
  );
};

export default Header;
