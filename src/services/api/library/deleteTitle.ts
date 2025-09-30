import { getIdToken } from '@/services/amplify/getIdToken';

type DeleteTitleArgs = {
    title: string;
};

export async function deleteTitle({ title }: DeleteTitleArgs) {
    const token = await getIdToken();

    const url = new URL(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/library/delete-title/`);
    url.searchParams.set('title_name', title);

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
