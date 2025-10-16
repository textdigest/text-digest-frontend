'use client';
import { useReaderSettings } from '@/hooks/reader/useReaderSettings';
import { Button } from '@/components/ui/button';

export default function ReaderDemo() {
    const { font, fontClass, fontSize, toggleFont, increaseFont, decreaseFont } =
        useReaderSettings();

    return (
        <div className='p-10'>
            <Button className='text-white' onClick={toggleFont}>
                Toggle Font ({font})
            </Button>
            <Button className='text-white' onClick={increaseFont}>
                A+
            </Button>
            <Button className='text-white' onClick={decreaseFont}>
                A-
            </Button>
            <p className={`${fontClass} transition-all`} style={{ fontSize: `${fontSize}px` }}>
                TEST TEST TEST
            </p>
        </div>
    );
}
