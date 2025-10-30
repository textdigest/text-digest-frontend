import { useEffect, useState } from 'react';

export function useViewport() {
    const [size, setSize] = useState<{ w: number; h: number }>({ w: 0, h: 0 });

    useEffect(() => {
        const get = () => {
            const vv: any = (window as any).visualViewport;
            if (vv) return { w: Math.floor(vv.width), h: Math.floor(vv.height) };
            return { w: window.innerWidth, h: window.innerHeight };
        };
        const onResize = () => setSize(get());
        onResize();
        const vv: any = (window as any).visualViewport;
        if (vv) vv.addEventListener('resize', onResize);
        window.addEventListener('resize', onResize);
        return () => {
            if (vv) vv.removeEventListener('resize', onResize);
            window.removeEventListener('resize', onResize);
        };
    }, []);

    return size;
}
