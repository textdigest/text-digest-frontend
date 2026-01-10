import { useEffect, useState } from 'react';
import type { Metadata } from '@/types/reader';

export function useMarkdown(metadata: Metadata[]) {
    const [pages, setPages] = useState<string[]>([]);

    function toMarkdown(m: Metadata) {
        if (m.type === 'text') {
            if (m.text_level && m.text_level > 0) {
                const level = Math.min(6, m.text_level);
                return `${'#'.repeat(level)} ${m.text}`;
            }
            return m.text;
        }
        if (m.type === 'image') {
            const cap = (m.image_caption && m.image_caption.join(' ')) || '';
            const safe = cap.replace(/"/g, '\\"');
            return `![](${m.img_path} "${safe}")`;
        }
        if (m.type === 'list') {
            const ordered = /ordered|ol/i.test(m.sub_type);
            return m.list_items
                .map((t, i) => (ordered ? `${i + 1}. ${t}` : `- ${t}`))
                .join('\n');
        }
        return '';
    }

    useEffect(() => {
        if (!metadata.length) {
            setPages([]);
            return;
        }
        const max = Math.max(...metadata.map((m) => m.page_idx));

        const grouped: Metadata[][] = Array.from({ length: max + 1 }, () => []);

        for (const m of metadata) grouped[m.page_idx].push(m);

        const isText = (m: Metadata) => m.type === 'text';

        const markdownPages = grouped.map((items, pageIndex) => {
            const out: string[] = [];
            let i = 0;
            while (i < items.length) {
                const cur = items[i];
                if (isText(cur) && cur.text_level === 1) {
                    const headerMarkdown: string[] = [cur.text];
                    i++;
                    while (i < items.length) {
                        const next = items[i];
                        if (!(isText(next) && next.text_level === 1)) break;
                        headerMarkdown.push(next.text);
                        i++;
                    }
                    out.push(`# ${headerMarkdown.join(' ')}`);
                    continue;
                }
                const md = toMarkdown(cur).trim();
                if (md) out.push(md);
                i++;
            }
            const fence = ['```page', String(pageIndex), '```'].join('\n');
            return [fence, out.join('\n\n')].join('\n\n');
        });
        setPages(markdownPages);
    }, [metadata]);

    return { pages };
}
