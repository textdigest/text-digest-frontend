import { getIdToken } from '@/services/amplify/getIdToken';

type PostNoteArgs = {
    text: string; // The highlighted/selected text
    annotation: string; // The annotation comment
    pageNum: number;
    bookTitle: string;
};

export async function postNote({ text, annotation, pageNum, bookTitle }: PostNoteArgs) {
    if (!text || typeof text !== 'string') {
        throw new Error('Text is required and must be a string');
    }
    if (!annotation || typeof annotation !== 'string') {
        throw new Error('Annotation is required and must be a string');
    }

    const token = await getIdToken();

    const url = new URL(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/library/post-note`);
    url.searchParams.set('text', text);
    url.searchParams.set('annotation', annotation);
    url.searchParams.set('page_num', pageNum.toString());
    url.searchParams.set('book_title', bookTitle);

    const res = await fetch(url, {
        method: 'PATCH',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        const detail = await res.text();
        let errorMessage = 'Failed to post note';
        try {
            const errorJson = JSON.parse(detail);
            if (errorJson.detail) {
                errorMessage = errorJson.detail;
            }
        } catch {
            errorMessage = detail || errorMessage;
        }
        throw new Error(errorMessage);
    }

    return res.json();
}
