import { fetchAuthSession } from 'aws-amplify/auth';

/**@returns User attributes as JWT payload if user signed in (else null).*/
export async function getUserAttributes() {
    const session = await fetchAuthSession();
    const idToken = session?.tokens?.idToken ?? null;

    if (idToken) {
        return idToken.payload;
    }

    return null;
}
