import { getIdToken } from '@/services/amplify/getIdToken';

export async function getHealthCheck() {
    const token = await getIdToken();

    const url = new URL(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/health`);
    const res = await fetch(url, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        const detail = await res.text();
        throw new Error(detail || 'Failed to delete title');
    }

    return res.json();
}
