import type { ITitle } from '@/types/library';
import { getIdToken } from '@/services/amplify/getIdToken';

export async function getTitlesAll(): Promise<ITitle[]> {
    try {
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

        if (res.ok) {
            const titles: ITitle[] = await res.json();

            console.log(titles);

            return titles;
        }
    } catch (error) {
        console.error('Failed to fetch titles:', error);
    }

    return [];
}
