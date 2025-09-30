import { getIdToken } from '@/services/amplify-auth/getIdToken';

export async function getTitlesAll() {
    const token = await getIdToken();

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/library/get-titles-all/`,
        {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
    );

    if (!res.ok) {
        const detail = await res.text();
        throw new Error(detail || 'Failed to get titles');
    }

    return res.json();
}
