import { useEffect, useState } from 'react';

/**
 * This hook helps track which page number you are currently viewing.
 * It looks for special marker elements (added to the markdown for each page)
 * and checks which one is visible in the displayed area (viewport).
 */
export function usePageNumber(ref: any, deps: any[] = []) {
    const [pageNumber, setPageNumber] = useState<number | null>(null);

    useEffect(() => {
        const page = ref.current;
        if (!page) return;

        function determinePageNumber() {
            const viewport = page.getBoundingClientRect();

            const elementsInDom: HTMLElement[] = page.querySelectorAll('pre');

            for (const element of elementsInDom) {
                const elementPosition = element.getBoundingClientRect();

                const isInViewport =
                    elementPosition.bottom > viewport.top &&
                    elementPosition.top < viewport.bottom &&
                    elementPosition.right > viewport.left &&
                    elementPosition.left < viewport.right;

                if (isInViewport) {
                    const isPageNumberNode = element.innerHTML.includes('data-page-index');
                    if (isPageNumberNode) {
                        const currPageNumber = Number(element.innerText);

                        if (currPageNumber > -1) {
                            setPageNumber(currPageNumber);
                        }
                    }
                }
            }
        }

        determinePageNumber();

        let raf = 0;
        function schedule() {
            cancelAnimationFrame(raf);
            raf = requestAnimationFrame(determinePageNumber);
        }
        window.addEventListener('scroll', schedule, { passive: true });
        window.addEventListener('resize', schedule);

        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener('scroll', schedule as any);
            window.removeEventListener('resize', schedule as any);
        };
    }, [ref, ...deps]);

    return pageNumber;
}
