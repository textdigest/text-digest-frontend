import { getIdToken } from '@/services/amplify/getIdToken';

type PostTitleArgs = {
    title: string;
    file: File;
    author?: string;
    datePublished?: string;
    pages?: number;
};

export async function postTitle({
    title,
    file,
    author = '',
    datePublished = '',
    pages = 0,
}: PostTitleArgs) {
    const token = await getIdToken();

    const form = new FormData();

    form.append('title', title);
    form.append('author', author);
    form.append('date_published', datePublished);
    form.append('pages', `${pages}`);
    form.append('file', file);

    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/library/post-title`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: form,
    });

    if (!res.ok) {
        const detail = await res.text();
        throw new Error(detail || 'Failed to post title');
    }

    return res.json();
}
