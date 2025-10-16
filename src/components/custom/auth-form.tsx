'use client';
import { useState } from 'react';
import { GoogleIcon } from '@/svg/google-icon';
import { ArrowRight, Mail } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/auth/useAuth';

export function SignInForm() {
    const { signInWithGoogle, getOtpSignInCode, confirmOtpSignInCode, isOtpSent } = useAuth();

    const [isEmailFieldHidden, setIsEmailFieldHidden] = useState<boolean>(true);
    const [email, setEmail] = useState<string | undefined>();
    const emailPattern =
        /^[A-Za-z0-9]+(?:[._%+-][A-Za-z0-9]+)*@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;

    const [otp, setOtp] = useState<string | undefined>();

    return (
        <div className='w-96 max-w-full space-y-4 rounded-md border border-neutral-200 bg-neutral-100 p-4 shadow-lg lg:space-y-10 lg:p-6 dark:border-neutral-800 dark:bg-neutral-900'>
            <div className='space-y-2'>
                <h1 className='to-primary-800 from-primary-400 dark:to-primary-400 dark:from-primary-50 bg-gradient-to-r bg-clip-text text-3xl font-bold text-transparent lg:text-4xl'>
                    Sign in
                    <span className='dark:text-primary-500'>.</span>
                </h1>
                <p className='text-lg text-neutral-700 dark:text-neutral-300'>
                    Use your Google account, or request a one-time password to sign in.
                </p>
            </div>
            <div>
                {isEmailFieldHidden ? (
                    <Button
                        size='lg'
                        variant='secondary'
                        onClick={() => setIsEmailFieldHidden(false)}
                        className='w-full bg-white py-4 text-base md:py-6 md:text-lg dark:bg-neutral-800'
                    >
                        <Mail />
                        Sign in with Email
                    </Button>
                ) : !isOtpSent ? (
                    <div className='space-y-4'>
                        <div className='space-y-1'>
                            <Label htmlFor='email'>Email</Label>
                            <Input
                                className='h-12'
                                value={email ?? ''}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder='jane.doe@textdigest.ai'
                                id='email'
                                type='email'
                                pattern={
                                    '[A-Za-z0-9]+(?:[._%+-][A-Za-z0-9]+)*@[A-Za-z0-9-]+(?:\\.[A-Za-z0-9-]+)*\\.[A-Za-z]{2,}'
                                }
                            />
                        </div>
                        <Button
                            size='lg'
                            disabled={!email || !emailPattern.test(email)}
                            className='w-full py-4 text-base md:py-6 md:text-lg'
                            onClick={() => {
                                if (email) getOtpSignInCode(email);
                            }}
                        >
                            Send Passcode
                            <ArrowRight />
                        </Button>
                    </div>
                ) : (
                    <div className='space-y-4'>
                        <div className='space-y-1'>
                            <Label htmlFor='otp'>Passcode</Label>
                            <Input
                                className='h-12'
                                value={otp ?? ''}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (/^\d{0,8}$/.test(val)) setOtp(val);
                                }}
                                placeholder={`Enter the passcode sent to ${(email ?? '').slice(0, 16)}...`}
                                id='otp'
                                type='text'
                            />
                        </div>
                        <Button
                            size='lg'
                            disabled={!otp || otp.length === 0}
                            className='w-full py-4 text-base md:py-6 md:text-lg'
                            onClick={() => {
                                if (otp) confirmOtpSignInCode(otp);
                            }}
                        >
                            Confirm Passcode
                            <ArrowRight />
                        </Button>
                    </div>
                )}

                <div className='my-4 flex items-center'>
                    <div className='h-px flex-grow bg-neutral-300 dark:bg-neutral-200'></div>
                    <span className='mx-2 text-sm font-medium text-neutral-500 dark:text-neutral-300'>
                        or
                    </span>
                    <div className='h-px flex-grow bg-neutral-300 dark:bg-neutral-200'></div>
                </div>

                <Button
                    size='lg'
                    variant='secondary'
                    onClick={signInWithGoogle}
                    className='w-full py-4 text-base md:py-6 md:text-lg'
                >
                    <GoogleIcon className='size-6' />
                    Sign in with Google
                </Button>
            </div>
        </div>
    );
}
