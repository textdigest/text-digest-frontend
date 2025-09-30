import { getIdToken } from '@/services/amplify-auth/getIdToken';

type PostNoteArgs = {
    text: string;
    pageNum: number;
    bookTitle: string;
};

export async function postNote({ text, pageNum, bookTitle }: PostNoteArgs) {
    const token = await getIdToken();

    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/library/post-note`, {
        method: 'PATCH',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, page_num: pageNum, book_title: bookTitle }),
    });

    if (!res.ok) {
        const detail = await res.text();
        throw new Error(detail || 'Failed to post note');
    }

    return res.json();
}
