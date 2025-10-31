import { Check } from 'lucide-react';

export function AuthCopy() {
    return (
        <div className='w-96 max-w-full space-y-4 p-2 lg:space-y-8 lg:p-6'>
            <div className='space-y-2'>
                <h1 className='to-primary-800 from-primary-400 dark:to-primary-400 dark:from-primary-50 bg-gradient-to-r bg-clip-text text-3xl font-bold text-transparent lg:text-4xl'>
                    TextDigest
                    <span className='dark:text-primary-500'>.</span>
                </h1>
                <p className='text-neutral-700 lg:text-lg dark:text-neutral-300'>
                    The{' '}
                    <span className='font-semibold text-neutral-800 dark:text-neutral-200'>
                        AI integrated, UI optimized
                    </span>{' '}
                    reading platform for your{' '}
                    <span className='font-semibold text-neutral-800 dark:text-neutral-200'>
                        textbooks
                    </span>
                </p>
            </div>
            {/** grid grid-cols-2 gap-4 */}
            <ul className='hidden lg:flex lg:flex-col'>
                <li className='flex items-center gap-2'>
                    <Check
                        className='size-4 text-green-500 lg:size-8 dark:text-green-300'
                        strokeWidth={3}
                    />
                    <p className='text-sm text-neutral-700 lg:text-xl dark:text-neutral-300'>
                        Higher Comprehension
                    </p>
                </li>
                <li className='flex items-center gap-2'>
                    <Check
                        className='size-4 text-green-500 lg:size-8 dark:text-green-300'
                        strokeWidth={3}
                    />
                    <p className='text-sm text-neutral-700 lg:text-xl dark:text-neutral-300'>
                        Read Faster
                    </p>
                </li>
                <li className='flex items-center gap-2'>
                    <Check
                        className='size-4 text-green-500 lg:size-8 dark:text-green-300'
                        strokeWidth={3}
                    />
                    <p className='text-sm text-neutral-700 lg:text-xl dark:text-neutral-300'>
                        Enjoy Reading
                    </p>
                </li>
                <li className='flex items-center gap-2'>
                    <Check
                        className='size-4 text-green-500 lg:size-8 dark:text-green-300'
                        strokeWidth={3}
                    />
                    <p className='text-sm text-neutral-700 lg:text-xl dark:text-neutral-300'>
                        Deeper Understanding
                    </p>
                </li>
            </ul>
        </div>
    );
}
