import type { QnAMessage } from '@/types/reader';
import { getIdToken } from '@/services/amplify/getIdToken';

type PostQnaMessageArgs = {
    query: string;
    highlighted_text: string;
    page_content: string;
    curr_conversation: QnAMessage[];
};

export async function postQnaMessage({
    query,
    highlighted_text,
    page_content,
    curr_conversation,
}: PostQnaMessageArgs) {
    const token = await getIdToken();

    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/reader/post-qna`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, page_content, highlighted_text, curr_conversation }),
    });

    if (!res.ok) {
        const detail = await res.text();
        throw new Error(detail || 'Failed to post note');
    }

    return res.json();
}
