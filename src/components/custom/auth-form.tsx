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
        <div className='rounded-md'>
            {isEmailFieldHidden ? (
                <Button
                    size='lg'
                    variant='outline'
                    onClick={() => setIsEmailFieldHidden(false)}
                    className='bg-primary2 border-accent w-full py-6 text-xl text-white'
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
                            className='bg-secondary border-accent py-6 text-white'
                        />
                    </div>
                    <Button
                        size='lg'
                        disabled={!otp || otp.length === 0}
                        className='bg-primary-bright border-accent w-full py-6 text-xl text-white'
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
                            className='bg-secondary border-accent py-6 text-white'
                        />
                    </div>
                    <Button
                        size='lg'
                        variant='outline'
                        disabled={!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)}
                        className='bg-primary2 border-accent w-full py-6 text-xl text-white'
                        onClick={() => {
                            if (email) getOtpSignInCode(email);
                        }}
                    >
                        Send Passcode
                        <ArrowRight />
                    </Button>
                </div>
            )}

            <div className='my-8 flex items-center'>
                <div className='dark:bg-accent h-px flex-grow bg-neutral-300'></div>
                <span className='dark:text-accent mx-2 text-sm font-medium text-neutral-500'>
                    OR CONTINUE WITH
                </span>
                <div className='dark:bg-accent h-px flex-grow bg-neutral-300'></div>
            </div>

            <Button
                size='lg'
                onClick={signInWithGoogle}
                variant='outline'
                className='bg-primary2 border-accent w-full py-6 text-xl text-white'
            >
                <GoogleIcon />
                Sign in with Google
            </Button>
        </div>
    );
}
