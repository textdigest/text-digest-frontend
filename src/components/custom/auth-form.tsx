'use client';
import { useState } from 'react';
import { useAuth } from '@/hooks/auth/useAuth';
import { GoogleIcon } from '@/svg/google-icon';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';

export function SignInForm() {
    const [isPasswordHidden, setIsPasswordHidden] = useState<boolean>(true);

    const { signInWithGoogle } = useAuth();

    return (
        <div className='w-96 space-y-2 rounded-md p-2 lg:p-4'>
            <div className='space-y-1'>
                <Label htmlFor='emailInput'>Email</Label>
                <Input placeholder='jane.doe@textdigest.ai' id='emailInput' type='email' />
            </div>

            <div className='space-y-1'>
                <Label htmlFor='passwordInput'>Password</Label>
                <div className='relative'>
                    <Input
                        placeholder='••••••••'
                        id='passwordInput'
                        type={isPasswordHidden ? 'password' : 'text'}
                    />

                    {isPasswordHidden ? (
                        <Eye
                            onClick={() => setIsPasswordHidden(false)}
                            size={16}
                            className='absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer'
                        />
                    ) : (
                        <EyeOff
                            onClick={() => setIsPasswordHidden(true)}
                            size={16}
                            className='absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer'
                        />
                    )}
                </div>
            </div>

            <div className='my-4 flex items-center'>
                <div className='h-px flex-grow bg-neutral-200'></div>
                <span className='mx-2 text-sm text-neutral-400'>or</span>
                <div className='h-px flex-grow bg-neutral-200'></div>
            </div>

            <Button variant='secondary' onClick={signInWithGoogle} className='w-full'>
                <GoogleIcon />
                Sign in with Google
            </Button>
        </div>
    );
}

export function SignUpForm() {}
