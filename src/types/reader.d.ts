export interface ParsedDocument {
    pages: PageContent[];
    total_pages: number;
    job_id: string;
}

export type BBox = [number, number, number, number];

export interface KeyValue {
    key: string;
    value: string;
    key_bbox: BBox;
    value_bbox: BBox;
}

export interface TableBlock {
    bbox: BBox;
    rows: string[][];
}

export type LayoutType =
    | 'LINE'
    | 'WORD'
    | 'TITLE'
    | 'SECTION_HEADER'
    | 'LAYOUT_TEXT'
    | 'LAYOUT_TITLE'
    | 'LAYOUT_SECTION_HEADER'
    | 'LAYOUT_LIST'
    | 'LAYOUT_FIGURE'
    | 'LAYOUT_TABLE'
    | 'LAYOUT_KEY_VALUE_SET'
    | 'LAYOUT_HEADER'
    | 'LAYOUT_FOOTER'
    | 'LAYOUT_PAGE_NUMBER';

export interface LayoutItem {
    type: LayoutType | string;
    text?: string;
    bbox: BBox;
}

export interface PageContent {
    page_number: number;
    text: string;
    forms: KeyValue[];
    tables: TableBlock[];
    layout: LayoutItem[];
}
