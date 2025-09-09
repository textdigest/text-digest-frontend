'use client';
import type { ReactNode } from 'react';
import { useContext, createContext, useEffect } from 'react';
import {
    signOut as amplifySignOut,
    signIn as amplifySignIn,
    signInWithRedirect,
} from 'aws-amplify/auth';
import { useRouter } from 'next/navigation';
import ConfigureAmplifyClientSide from '@/config/amplify.client.config';
import { fetchAuthSession } from 'aws-amplify/auth';

interface AuthContext {
    signInWithEmailPassword: (username: string, password: string) => Promise<void>;
    signInWithGoogle: () => Promise<void>;
    signOut: () => Promise<void>;
    getIdToken: () => Promise<string | null>;
    getUserAttributes: () => Promise<any>;
}

const defaultContext: AuthContext = {
    signInWithEmailPassword: async () => {},
    signInWithGoogle: async () => {},
    signOut: async () => {},
    getIdToken: async () => null,
    getUserAttributes: async () => null,
};

export const AuthContext = createContext<AuthContext>(defaultContext);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const router = useRouter();

    useEffect(() => {
        // Temporary way we can get the id token for dev
        // Do not let this go to production
        async function logToken() {
            const idToken = await getIdToken();
            const attributes = await getUserAttributes();

            console.log('idtoken: ', idToken);
            console.log('user attributes: ', attributes);
        }
        logToken();
    }, []);

    async function signInWithEmailPassword(username: string, password: string) {
        try {
            await amplifySignIn({
                username,
                password,
            });
            router.push('/library');
        } catch (e) {
            console.error('Sign in failed:', e);
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
        signInWithEmailPassword,
        signInWithGoogle,
        signOut,
        getIdToken,
        getUserAttributes,
    };

    return (
        <AuthContext.Provider value={value}>
            <ConfigureAmplifyClientSide />
            {children}
        </AuthContext.Provider>
    );
};
