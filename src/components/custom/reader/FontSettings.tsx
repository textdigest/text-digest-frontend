'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { fontMap, pageColors, useReaderSettings } from '@/hooks/reader/useReaderSettings';

type FontSettingsProps = {
    isOpen: boolean;
    onClose: () => void;
};

export function FontSettings({ isOpen, onClose }: FontSettingsProps) {
    const { fontClass, setFontName, increaseFont, decreaseFont, setPageColor } =
        useReaderSettings();

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.aside
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className='fixed top-0 right-0 z-40 h-full w-100 bg-neutral-900 p-6 pt-20 text-white shadow-xl'
                >
                    <h1>Font</h1>
                    <div className='mt-4 flex flex-col gap-4'>
                        {Object.entries(fontMap).map(([name, nextFont]) => (
                            <Button
                                key={name}
                                variant={fontClass == nextFont.className ? 'outline' : 'ghost'}
                                className={`justify-start capitalize ${nextFont.className || ''}`}
                                onClick={() =>
                                    setFontName(name as Parameters<typeof setFontName>[0])
                                }
                            >
                                <span className={`${nextFont.className || ''} mr-2`}>Aa</span>
                                <span className='capitalize'>{name}</span>
                            </Button>
                        ))}
                    </div>
                    <Separator className='my-4' />
                    <h1>Font Size</h1>
                    <div className='mt-4 flex items-center gap-6'>
                        <Button variant='ghost' onClick={increaseFont}>
                            <Plus />
                        </Button>
                        <Button variant='ghost' onClick={decreaseFont}>
                            <Minus />
                        </Button>
                    </div>
                    <Separator className='my-4' />
                    <h1>Page Color</h1>
                    <div className='mt-4 flex items-center gap-6'>
                        {pageColors.map((color, index) => (
                            <Button
                                key={index}
                                className={`rounded-full bg-${color.bgColor} border border-neutral-500`}
                                onClick={() => setPageColor(color)}
                            />
                        ))}
                    </div>
                </motion.aside>
            )}
        </AnimatePresence>
    );
}
