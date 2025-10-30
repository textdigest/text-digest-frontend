interface LibraryCard {
    path: string;
    thumbnailPath: string;
    title: string;
}

export interface ITitle {
    id: string;
    title: string;
    author: string;
    pages: number;
    date_published: string;
    date_downloaded: string;

    is_public: boolean;
    is_processing: boolean;

    pdf_presigned_url?: string;
    parsed_pdf_presigned_url?: string;

    notes: {
        comment: string;
        page_num: number;
        book_title: string;
    }[];
    last_viewed?: string | null;
}
