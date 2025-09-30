import { getIdToken } from '@/services/amplify-auth/getIdToken';

type GetNotesArgs = {
    bookTitle: string;
};

export async function getNotes({ bookTitle }: GetNotesArgs) {
    const token = await getIdToken();

    const url = new URL(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/library/get-notes`);
    url.searchParams.set('book_title', bookTitle);

    const res = await fetch(url, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        const detail = await res.text();
        throw new Error(detail || 'Failed to get notes');
    }

    return res.json();
}
