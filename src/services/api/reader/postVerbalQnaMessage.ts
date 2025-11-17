import type { QnAMessage } from '@/types/reader';
import { getIdToken } from '@/services/amplify/getIdToken';

type PostVerbalQnaMessageArgs = {
    audio_base64: string;
    highlighted_text: string;
    page_content: string;
    curr_conversation: QnAMessage[];
    conversation_id: string;
};

export async function postVerbalQnaMessage({
    audio_base64,
    highlighted_text,
    page_content,
    curr_conversation,
    conversation_id,
}: PostVerbalQnaMessageArgs) {
    const token = await getIdToken();

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/reader/post-verbal-qna`,
        {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                audio_base64,
                page_content,
                highlighted_text,
                curr_conversation,
                conversation_id,
            }),
        },
    );

    if (!res.ok) {
        const detail = await res.text();
        throw new Error(detail || 'Failed to post verbal qna');
    }

    return res.json();
}
