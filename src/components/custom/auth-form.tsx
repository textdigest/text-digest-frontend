'use client';
import { useState } from 'react';
import { useAuth } from '@/hooks/auth/useAuth';
import { GoogleIcon } from '@/svg/google-icon';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ArrowRight, Mail } from 'lucide-react';

export function SignInForm() {
    const { signInWithGoogle, getOtpSignInCode, confirmOtpSignInCode, isOtpSent } = useAuth();

    const [isEmailFieldHidden, setIsEmailFieldHidden] = useState<boolean>(true);
    const [email, setEmail] = useState<string | undefined>();

    const [otp, setOtp] = useState<string | undefined>();

    return (
        <div className='w-96 rounded-md p-2 lg:p-4'>
            {isEmailFieldHidden ? (
                <Button
                    size='lg'
                    variant='secondary'
                    onClick={() => setIsEmailFieldHidden(false)}
                    className='w-full'
                >
                    <Mail />
                    Sign in Email
                </Button>
            ) : isOtpSent ? (
                <div className='space-y-4'>
                    <div className='space-y-1'>
                        <Label htmlFor='otp'>Passcode</Label>
                        <Input
                            value={otp}
                            onChange={(e) => {
                                const val = e.target.value;
                                if (/^\d{0,8}$/.test(val)) setOtp(val);
                            }}
                            placeholder='Enter your passcode'
                            id='otp'
                            type='text'
                        />
                    </div>
                    <Button
                        size='lg'
                        disabled={!otp || otp.length === 0}
                        className='w-full'
                        onClick={() => {
                            if (otp) confirmOtpSignInCode(otp);
                        }}
                    >
                        Confirm Passcode
                        <ArrowRight />
                    </Button>
                </div>
            ) : (
                <div className='space-y-4'>
                    <div className='space-y-1'>
                        <Label htmlFor='email'>Email</Label>
                        <Input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder='jane.doe@textdigest.ai'
                            id='email'
                            type='email'
                        />
                    </div>
                    <Button
                        size='lg'
                        disabled={!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)}
                        className='w-full'
                        onClick={() => {
                            if (email) getOtpSignInCode(email);
                        }}
                    >
                        Send Passcode
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

            <Button size='lg' onClick={signInWithGoogle} className='w-full'>
                <GoogleIcon />
                Sign in with Google
            </Button>
        </div>
    );
}
