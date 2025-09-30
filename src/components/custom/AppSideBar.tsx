import React, { useState } from 'react';
import { Sidebar, SidebarContent, SidebarGroup, SidebarHeader } from '../ui/sidebar';
import { Button } from '../ui/button';
import { BookOpenText, LibraryBig, Plus, Store, Settings } from 'lucide-react';

type AppSideBarProps = {
    currentRoute: string;
};

const AppSideBar = ({ currentRoute }: AppSideBarProps) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <div
                className={`fixed inset-0 transition-all duration-300 ${isOpen ? 'z-40 bg-black/30 backdrop-blur-sm' : ''}`}
            />
            <Sidebar
                collapsible='none'
                className='bg-primary2 relative z-50 border-none p-2 shadow-2xl'
            >
                <SidebarHeader className='bg-primary2'>
                    <button
                        onClick={() => setIsOpen((prevState) => !prevState)}
                        className='flex items-center justify-center'
                    >
                        <img src='/LogoSmall.svg' alt='TextDigest.AI Logo' className='w-15' />
                    </button>
                    <div className='border-accent my-4 flex-grow border-t' />
                </SidebarHeader>
                <SidebarContent className='bg-primary2 grid items-center'>
                    <SidebarGroup>
                        <Button
                            variant='outline'
                            className={`border-${currentRoute === 'Reader' ? 'primary-bright' : 'accent'} flex h-15 items-center justify-start overflow-hidden transition-all duration-300 ${
                                isOpen ? 'w-65 px-3' : 'w-15 px-3'
                            }`}
                        >
                            <BookOpenText
                                className={`text-${currentRoute === 'Reader' ? 'primary-bright' : 'accent'} !h-8 !w-8 flex-shrink-0`}
                            />
                            <span
                                className={`ml-auto text-${currentRoute === 'Reader' ? 'primary-bright' : 'accent'} text-lg font-medium whitespace-nowrap transition-opacity duration-300 ${
                                    isOpen ? 'opacity-100' : 'opacity-0'
                                }`}
                            >
                                Reader
                            </span>
                        </Button>
                    </SidebarGroup>
                    <SidebarGroup>
                        <Button
                            variant='outline'
                            className={`border-${currentRoute === 'Library' ? 'primary-bright' : 'accent'} flex h-15 items-center justify-start overflow-hidden transition-all duration-300 ${
                                isOpen ? 'w-65 px-3' : 'w-15 px-3'
                            }`}
                        >
                            <LibraryBig
                                className={`text-${currentRoute === 'Library' ? 'primary-bright' : 'accent'} !h-8 !w-8 flex-shrink-0`}
                            />
                            <span
                                className={`ml-auto text-${currentRoute === 'Library' ? 'primary-bright' : 'accent'} text-lg font-medium whitespace-nowrap transition-opacity duration-300 ${
                                    isOpen ? 'opacity-100' : 'opacity-0'
                                }`}
                            >
                                Library
                            </span>
                        </Button>
                    </SidebarGroup>
                    <SidebarGroup>
                        <Button
                            variant='outline'
                            className={`border-${currentRoute === 'Add' ? 'primary-bright' : 'accent'} flex h-15 items-center justify-start overflow-hidden transition-all duration-300 ${
                                isOpen ? 'w-65 px-3' : 'w-15 px-3'
                            }`}
                        >
                            <Plus
                                className={`text-${currentRoute === 'Add' ? 'primary-bright' : 'accent'} !h-8 !w-8 flex-shrink-0`}
                            />
                            <span
                                className={`ml-auto text-${currentRoute === 'Add' ? 'primary-bright' : 'accent'} text-lg font-medium whitespace-nowrap transition-opacity duration-300 ${
                                    isOpen ? 'opacity-100' : 'opacity-0'
                                }`}
                            >
                                Add
                            </span>
                        </Button>
                    </SidebarGroup>
                    <SidebarGroup>
                        <Button
                            variant='outline'
                            className={`border-${currentRoute === 'Market' ? 'primary-bright' : 'accent'} flex h-15 items-center justify-start overflow-hidden transition-all duration-300 ${
                                isOpen ? 'w-65 px-3' : 'w-15 px-3'
                            }`}
                        >
                            <Store
                                className={`text-${currentRoute === 'Market' ? 'primary-bright' : 'accent'} !h-8 !w-8 flex-shrink-0`}
                            />
                            <span
                                className={`ml-auto text-${currentRoute === 'Market' ? 'primary-bright' : 'accent'} text-lg font-medium whitespace-nowrap transition-opacity duration-300 ${
                                    isOpen ? 'opacity-100' : 'opacity-0'
                                }`}
                            >
                                Market
                            </span>
                        </Button>
                    </SidebarGroup>
                    <SidebarGroup>
                        <Button
                            variant='outline'
                            className={`border-${currentRoute === 'Settings' ? 'primary-bright' : 'accent'} flex h-15 items-center justify-start overflow-hidden transition-all duration-300 ${
                                isOpen ? 'w-65 px-3' : 'w-15 px-3'
                            }`}
                        >
                            <Settings
                                className={`text-${currentRoute === 'Settings' ? 'primary-bright' : 'accent'} !h-8 !w-8 flex-shrink-0`}
                            />
                            <span
                                className={`ml-auto text-${currentRoute === 'Settings' ? 'primary-bright' : 'accent'} text-lg font-medium whitespace-nowrap transition-opacity duration-300 ${
                                    isOpen ? 'opacity-100' : 'opacity-0'
                                }`}
                            >
                                Settings
                            </span>
                        </Button>
                    </SidebarGroup>
                </SidebarContent>
            </Sidebar>
        </>
    );
};

export default AppSideBar;
