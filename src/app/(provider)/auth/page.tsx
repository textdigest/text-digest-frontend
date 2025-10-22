'use client';
import { AuthCopy as Copywrite } from '@/components/custom/auth-copywrite';
import { SignInForm } from '@/components/custom/auth-form';
import { Logo } from '@/svg/logo';

export default function Page() {
    return (
        <div className='relative h-screen w-screen max-w-full px-4'>
            <Logo className='fixed top-4 left-4 lg:top-8 lg:left-8' />

            <div className='pointer-events-none absolute inset-0 -z-10'>
                <svg
                    width='100%'
                    height='100%'
                    viewBox='0 0 100 100'
                    preserveAspectRatio='none'
                    className='h-full w-full'
                >
                    <polygon
                        points='0,100 100,0 100,100'
                        className='fill-neutral-100 dark:fill-neutral-800'
                        fill='none'
                    />
                </svg>
            </div>
            <div className='flex h-full w-full max-w-full flex-col items-center pt-24 lg:justify-center lg:py-0'>
                <div className='flex flex-col gap-16 lg:flex-row lg:gap-36'>
                    <Copywrite />
                    <SignInForm />
                </div>
            </div>
        </div>
    );
}
