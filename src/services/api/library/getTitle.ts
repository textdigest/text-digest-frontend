import { getIdToken } from '@/services/amplify-auth/getIdToken';

type GetTitleArgs = {
    title: string;
};

export async function getTitle({ title }: GetTitleArgs) {
    const token = await getIdToken();

    const url = new URL(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/library/get-title/`);
    url.searchParams.set('title_name', title);

    const res = await fetch(url, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        const detail = await res.text();
        throw new Error(detail || 'Failed to get title');
    }

    return res.json();
}
