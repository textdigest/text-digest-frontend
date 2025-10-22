import { fetchAuthSession } from 'aws-amplify/auth';

/**@returns IdToken as string for usage in fetch authorization header.*/
export async function getIdToken(): Promise<string | null> {
    const session = await fetchAuthSession();
    const idToken = session?.tokens?.idToken?.toString() ?? null;
    return idToken;
}
