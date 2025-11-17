import { getIdToken } from '@/services/amplify/getIdToken';

type PostPageNumberArgs = {
    title_id: string;
    page_number: number;
};

export async function postPageNumber({ title_id, page_number }: PostPageNumberArgs) {
    const token = await getIdToken();

    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/reader/page-number`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            title_id,
            page_number,
        }),
    });

    if (!res.ok) {
        const detail = await res.text();
        throw new Error(detail || 'Failed to post page number');
    }

    return res.json();
}

