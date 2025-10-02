import React, { useState } from 'react';
import { Sidebar, SidebarContent, SidebarGroup, SidebarHeader } from '../ui/sidebar';
import { Button } from '../ui/button';
import { BookOpenText, LibraryBig, Plus, Store, Settings } from 'lucide-react';
import clsx from 'clsx';

type AppSideBarProps = {
    currentRoute: string;
};

const navItems = [
    { label: 'Reader', icon: BookOpenText },
    { label: 'Library', icon: LibraryBig },
    { label: 'Add', icon: Plus },
    { label: 'Market', icon: Store },
    { label: 'Settings', icon: Settings },
];

const AppSideBar = ({ currentRoute }: AppSideBarProps) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <div
                className={`fixed inset-0 transition-all duration-300 ${
                    isOpen ? 'z-40 bg-black/30 backdrop-blur-sm' : ''
                }`}
                onClick={() => setIsOpen(false)}
            />
            <Sidebar
                collapsible='none'
                className='bg-primary2 relative z-50 border-none p-2 shadow-2xl'
            >
                <SidebarHeader className='bg-primary2'>
                    <button
                        onClick={() => setIsOpen((prev) => !prev)}
                        className='flex items-center justify-center'
                    >
                        <img src='/LogoSmall.svg' alt='TextDigest.AI Logo' className='w-15' />
                    </button>
                    <div className='border-accent my-4 flex-grow border-t' />
                </SidebarHeader>

                <SidebarContent className='bg-primary2 grid items-center'>
                    {navItems.map(({ label, icon: Icon }) => {
                        const active = currentRoute === label;
                        return (
                            <SidebarGroup key={label}>
                                <Button
                                    variant='outline'
                                    className={clsx(
                                        'flex h-15 items-center justify-start overflow-hidden transition-all duration-300',
                                        isOpen ? 'w-65 px-3' : 'w-15 px-3',
                                        active ? '!border-primary-bright' : 'border-accent',
                                    )}
                                >
                                    <Icon
                                        className={clsx(
                                            '!h-8 !w-8 flex-shrink-0',
                                            active ? 'text-primary-bright' : 'text-accent',
                                        )}
                                    />
                                    <span
                                        className={clsx(
                                            'ml-auto text-lg font-medium whitespace-nowrap transition-opacity duration-300',
                                            active ? 'text-primary-bright' : 'text-accent',
                                            isOpen ? 'opacity-100' : 'opacity-0',
                                        )}
                                    >
                                        {label}
                                    </span>
                                </Button>
                            </SidebarGroup>
                        );
                    })}
                </SidebarContent>
            </Sidebar>
        </>
    );
};

export default AppSideBar;
