import { Check } from 'lucide-react';

export function AuthCopy() {
    return (
        <div className='w-96 max-w-full space-y-4 p-2 lg:space-y-8 lg:p-6'>
            <div className='space-y-2'>
                <h1 className='dark:to-primary-400 dark:from-primary-50 text-3xl font-bold lg:text-4xl dark:bg-gradient-to-r dark:bg-clip-text dark:text-transparent'>
                    TextDigest
                    <span className='dark:text-primary-500'>.</span>
                </h1>
                <p className='lg:text-lg dark:text-neutral-300'>
                    The{' '}
                    <span className='font-semibold dark:text-neutral-200'>
                        AI integrated, UI optimized
                    </span>{' '}
                    reading platform for your{' '}
                    <span className='font-semibold dark:text-neutral-200'>textbooks</span>
                </p>
            </div>
            <ul className='grid grid-cols-2 gap-4 lg:flex lg:flex-col'>
                <li className='flex items-center gap-2'>
                    <Check
                        className='size-4 text-green-500 lg:size-8 dark:text-green-300'
                        strokeWidth={3}
                    />
                    <p className='text-sm lg:text-xl dark:text-neutral-300'>
                        Higher Comprehension
                    </p>
                </li>
                <li className='flex items-center gap-2'>
                    <Check
                        className='size-4 text-green-500 lg:size-8 dark:text-green-300'
                        strokeWidth={3}
                    />
                    <p className='text-sm lg:text-xl dark:text-neutral-300'>Read Faster</p>
                </li>
                <li className='flex items-center gap-2'>
                    <Check
                        className='size-4 text-green-500 lg:size-8 dark:text-green-300'
                        strokeWidth={3}
                    />
                    <p className='text-sm lg:text-xl dark:text-neutral-300'>Enjoy Reading</p>
                </li>
                <li className='flex items-center gap-2'>
                    <Check
                        className='size-4 text-green-500 lg:size-8 dark:text-green-300'
                        strokeWidth={3}
                    />
                    <p className='text-sm lg:text-xl dark:text-neutral-300'>
                        Deeper Understanding
                    </p>
                </li>
            </ul>
        </div>
    );
}
