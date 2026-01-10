export type BBox = [number, number, number, number];
export type Asset = { name: string; data: string; mime: string };
export type Metadata =
    | { type: 'text'; text: string; bbox: BBox; page_idx: number; text_level?: number }
    | {
          type: 'image';
          img_path: string;
          image_caption: string[];
          image_footnote: string[];
          bbox: BBox;
          page_idx: number;
      }
    | { type: 'header' | 'footer'; text: string; bbox: BBox; page_idx: number }
    | { type: 'page_number'; text: string; bbox: BBox; page_idx: number }
    | { type: 'list'; sub_type: string; list_items: string[]; bbox: BBox; page_idx: number };
export type Document = { markdown: string; assets: Asset[]; metadata: Metadata[] };

export interface QnAMessage {
    role: 'user' | 'assistant';
    content: string;
}
