'use client';
import type { ReactNode } from 'react';
import { useContext, createContext, useState, useEffect } from 'react';
import {
    signOut as amplifySignOut,
    signIn as amplifySignIn,
    signUp as amplifySignUp,
    signInWithRedirect,
    confirmSignIn,
} from 'aws-amplify/auth';
import { useRouter } from 'next/navigation';
import ConfigureAmplifyClientSide from '@/config/amplify.client.config';

interface AuthContext {
    getOtpSignInCode: (email: string) => Promise<void>;
    confirmOtpSignInCode: (code: string) => Promise<void>;
    signInWithGoogle: () => Promise<void>;
    signOut: () => Promise<void>;
    isOtpSent: boolean;
}

const defaultContext: AuthContext = {
    getOtpSignInCode: async () => {},
    confirmOtpSignInCode: async () => {},
    signInWithGoogle: async () => {},
    signOut: async () => {},
    isOtpSent: false,
};

export const AuthContext = createContext<AuthContext>(defaultContext);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const router = useRouter();
    const [isOtpSent, setIsOtpSent] = useState<boolean>(false);

    useEffect(() => {
        console.log(isOtpSent);
    }, [isOtpSent]);

    async function getOtpSignInCode(email: string) {
        try {
            await amplifySignIn({
                username: email,
                options: { authFlowType: 'USER_AUTH', preferredChallenge: 'EMAIL_OTP' },
            }).then(() => setIsOtpSent(true));
        } catch (e: any) {
            const code = e?.name || e?.__type;
            if (code === 'UserNotFoundException') {
                await amplifySignUp({
                    username: email,
                    options: { userAttributes: { email } },
                });
                await amplifySignIn({
                    username: email,
                    options: { authFlowType: 'USER_AUTH', preferredChallenge: 'EMAIL_OTP' },
                }).then(() => setIsOtpSent(true));
            } else {
                console.error('Sign in failed:', e);
            }
        }
    }

    async function confirmOtpSignInCode(code: string) {
        try {
            const { nextStep } = await confirmSignIn({ challengeResponse: code });

            if (nextStep.signInStep === 'DONE') {
                router.push('/library');
            }
        } catch (e) {
            console.error(e);
            //TODO: Toast error try again
        }
    }

    async function signInWithGoogle() {
        try {
            await signInWithRedirect({
                provider: 'Google',
            });
        } catch (e) {
            console.error('Google sign in failed:', e);
        }
    }

    async function signOut() {
        try {
            await amplifySignOut();
            router.push('/');
        } catch (e) {
            console.error('Sign out failed:', e);
        }
    }

    const value = {
        getOtpSignInCode,
        confirmOtpSignInCode,
        signInWithGoogle,
        signOut,
        isOtpSent,
    };

    return (
        <AuthContext.Provider value={value}>
            <ConfigureAmplifyClientSide />
            {children}
        </AuthContext.Provider>
    );
};
