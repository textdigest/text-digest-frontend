import { getIdToken } from '@/services/amplify/getIdToken';
import { ITitle } from '@/types/library';

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
}: PostTitleArgs): Promise<ITitle | null> {
    try {
        const token = await getIdToken();

        const form = new FormData();
        form.append('title', title);
        form.append('author', author);
        form.append('date_published', datePublished);
        form.append('pages', `${pages}`);

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/library/post-title`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: form,
            },
        );

        if (!res.ok) {
            const errorText = await res.text();
            console.error('Failed to get presigned URL:', res.status, errorText);
            throw new Error(`Failed to get presigned URL: ${res.status} ${errorText}`);
        }

        const { presigned_url, title_id, s3_key } = await res.json();

        const uploadRes = await fetch(presigned_url, {
            method: 'PUT',
            body: file,
            headers: {
                'Content-Type': 'application/pdf',
            },
        });

        if (!uploadRes.ok) {
            throw new Error('Failed to upload file to S3');
        }

        const confirmForm = new FormData();
        confirmForm.append('title_id', title_id);

        const confirmRes = await fetch(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/library/confirm-title-upload`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: confirmForm,
            },
        );

        if (!confirmRes.ok) {
            const errorText = await confirmRes.text();
            console.error('Failed to confirm upload:', confirmRes.status, errorText);
            throw new Error(`Failed to confirm upload: ${confirmRes.status} ${errorText}`);
        }

        const response = await confirmRes.json();

        const newTitle: ITitle = {
            id: title_id,
            title,
            author,
            pages,
            date_published: datePublished || 'unknown',
            date_downloaded: new Date().toISOString(),
            is_public: false,
            is_processing: true,
            pdf_presigned_url: undefined,
            parsed_pdf_presigned_url: undefined,
            notes: [],
        };

        return newTitle;
    } catch (e) {
        console.error(e);
    }
    return null;
}
