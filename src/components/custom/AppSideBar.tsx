import React, { useState } from 'react'
import { Sidebar, SidebarContent, SidebarGroup, SidebarHeader } from '../ui/sidebar'
import { Button } from '../ui/button'
import { IoReaderOutline, IoLibrary, IoAddOutline } from "react-icons/io5";
import { HiLibrary } from "react-icons/hi";
import { IoMdSettings } from "react-icons/io";

type AppSideBarProps = {
  currentRoute: string;
};

const AppSideBar = ({ currentRoute }: AppSideBarProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div
        className={`fixed inset-0 transition-all duration-300 ${isOpen ? "bg-black/30 backdrop-blur-sm z-40" : ""}`}
      />
      <Sidebar collapsible='none' className='p-2 bg-primary2 border-none shadow-2xl relative z-50'>
        <SidebarHeader className='bg-primary2'>
          <button onClick={() => setIsOpen((prevState => !prevState))} className="flex items-center justify-center">
              <img 
              src="/LogoSmall.svg" 
              alt="TextDigest.AI Logo"
              className='w-15'
            />
          </button>
          <div className="flex-grow border-t border-accent my-4" />
        </SidebarHeader>
        <SidebarContent className='bg-primary2 grid items-center'>
          <SidebarGroup>
            <Button
              variant="outline"
              className={`border-${currentRoute === 'Reader' ? 'primary-bright' : 'accent'} h-15 transition-all duration-300 overflow-hidden flex items-center justify-start ${
                isOpen ? "w-65 px-3" : "w-15 px-3"
              }`}
            >
              <IoReaderOutline className={`text-${currentRoute === 'Reader' ? 'primary-bright' : 'accent'} flex-shrink-0 ml-2`} />
              <span
                className={`ml-auto text-${currentRoute === 'Reader' ? 'primary-bright' : 'accent'} text-lg font-medium whitespace-nowrap transition-opacity duration-300 ${
                  isOpen ? "opacity-100" : "opacity-0"
                }`}
              >
                Reader
              </span>
            </Button>
          </SidebarGroup>
          <SidebarGroup>
            <Button
              variant="outline"
              className={`border-${currentRoute === 'Library' ? 'primary-bright' : 'accent'} h-15 transition-all duration-300 overflow-hidden flex items-center justify-start ${
                isOpen ? "w-65 px-3" : "w-15 px-3"
              }`}
            >
              <IoLibrary className={`text-${currentRoute === 'Library' ? 'primary-bright' : 'accent'} flex-shrink-0 ml-2`} />
              <span
                className={`ml-auto text-${currentRoute === 'Library' ? 'primary-bright' : 'accent'} text-lg font-medium whitespace-nowrap transition-opacity duration-300 ${
                  isOpen ? "opacity-100" : "opacity-0"
                }`}
              >
                Library
              </span>
            </Button>
          </SidebarGroup>
          <SidebarGroup>
            <Button
              variant="outline"
              className={`border-${currentRoute === 'Add' ? 'primary-bright' : 'accent'} h-15 transition-all duration-300 overflow-hidden flex items-center justify-start ${
                isOpen ? "w-65 px-3" : "w-15 px-3"
              }`}
            >
              <IoAddOutline className={`text-${currentRoute === 'Add' ? 'primary-bright' : 'accent'} flex-shrink-0 ml-2`} />
              <span
                className={`ml-auto text-${currentRoute === 'Add' ? 'primary-bright' : 'accent'} text-lg font-medium whitespace-nowrap transition-opacity duration-300 ${
                  isOpen ? "opacity-100" : "opacity-0"
                }`}
              >
                Add
              </span>
            </Button>
          </SidebarGroup>
          <SidebarGroup>
            <Button
              variant="outline"
              className={`border-${currentRoute === 'Market' ? 'primary-bright' : 'accent'} h-15 transition-all duration-300 overflow-hidden flex items-center justify-start ${
                isOpen ? "w-65 px-3" : "w-15 px-3"
              }`}
            >
              <HiLibrary className={`text-${currentRoute === 'Market' ? 'primary-bright' : 'accent'} flex-shrink-0 ml-2`} />
              <span
                className={`ml-auto text-${currentRoute === 'Market' ? 'primary-bright' : 'accent'} text-lg font-medium whitespace-nowrap transition-opacity duration-300 ${
                  isOpen ? "opacity-100" : "opacity-0"
                }`}
              >
                Market
              </span>
            </Button>
          </SidebarGroup>
          <SidebarGroup>
            <Button
              variant="outline"
              className={`border-${currentRoute === 'Settings' ? 'primary-bright' : 'accent'} h-15 transition-all duration-300 overflow-hidden flex items-center justify-start ${
                isOpen ? "w-65 px-3" : "w-15 px-3"
              }`}
            >
              <IoMdSettings className={`text-${currentRoute === 'Settings' ? 'primary-bright' : 'accent'} flex-shrink-0 ml-2`} />
              <span
                className={`ml-auto text-${currentRoute === 'Settings' ? 'primary-bright' : 'accent'} text-lg font-medium whitespace-nowrap transition-opacity duration-300 ${
                  isOpen ? "opacity-100" : "opacity-0"
                }`}
              >
                Settings
              </span>
            </Button>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </>
  )
}

export default AppSideBar
