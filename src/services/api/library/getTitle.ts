import { getIdToken } from '@/services/amplify/getIdToken';
import { ITitle } from '@/types/library';

export async function getTitle(titleId: string, isPublic: string): Promise<ITitle | null> {
    try {
        const token = await getIdToken();

        const url = new URL(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/library/get-title/`);
        url.searchParams.set('title_id', titleId);
        url.searchParams.set('is_public', isPublic);

        const res = await fetch(url, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (res.ok) {
            const data = await res.json();
            return data.title as ITitle;
        }
    } catch (error) {
        console.error('Error fetching title:', error);
    }
    return null;
}
