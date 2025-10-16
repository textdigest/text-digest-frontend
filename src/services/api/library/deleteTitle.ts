import type { ITitle } from '@/types/library';
import { getIdToken } from '@/services/amplify/getIdToken';

export async function deleteTitle(title: ITitle) {
    const token = await getIdToken();

    const url = new URL(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/library/delete-title/`);
    url.searchParams.set('id', title.id);

    const res = await fetch(url, {
        method: 'DELETE',
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
