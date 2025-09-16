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
import { fetchAuthSession } from 'aws-amplify/auth';

interface AuthContext {
    getOtpSignInCode: (email: string) => Promise<void>;
    confirmOtpSignInCode: (code: string) => Promise<void>;
    signInWithGoogle: () => Promise<void>;
    signOut: () => Promise<void>;
    getIdToken: () => Promise<string | null>;
    getUserAttributes: () => Promise<Record<string, unknown> | null>;
    isOtpSent: boolean;
}

const defaultContext: AuthContext = {
    getOtpSignInCode: async () => {},
    confirmOtpSignInCode: async () => {},
    signInWithGoogle: async () => {},
    signOut: async () => {},
    getIdToken: async () => null,
    getUserAttributes: async () => null,
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
        const { nextStep } = await confirmSignIn({ challengeResponse: code });

        if (nextStep.signInStep === 'DONE') {
            router.push('/library');
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

    async function getIdToken(): Promise<string | null> {
        const session = await fetchAuthSession();
        const idToken = session?.tokens?.idToken?.toString() ?? null;
        return idToken;
    }

    async function getUserAttributes() {
        const session = await fetchAuthSession();
        const idToken = session?.tokens?.idToken ?? null;

        if (idToken) {
            return idToken.payload;
        }

        return null;
    }

    const value = {
        getOtpSignInCode,
        confirmOtpSignInCode,
        signInWithGoogle,
        signOut,
        getIdToken,
        getUserAttributes,
        isOtpSent,
    };

    return (
        <AuthContext.Provider value={value}>
            <ConfigureAmplifyClientSide />
            {children}
        </AuthContext.Provider>
    );
};
