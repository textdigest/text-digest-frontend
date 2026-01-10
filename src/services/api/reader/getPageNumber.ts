import { getIdToken } from '@/services/amplify/getIdToken';

export async function getPageNumber(titleId: string): Promise<number> {
    try {
        const token = await getIdToken();

        const url = new URL(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/reader/page-number`);
        url.searchParams.set('title_id', titleId);

        const res = await fetch(url, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (res.ok) {
            const data = await res.json();
            return data.pageNumber as number;
        }
    } catch (error) {
        console.error('Error fetching page number:', error);
    }
    return 0;
}

