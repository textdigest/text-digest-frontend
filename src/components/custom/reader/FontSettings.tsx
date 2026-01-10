'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus, Minus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { fontMap, pageColors, useReaderSettings } from '@/hooks/reader/useReaderSettings';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { useIsMobile } from '@/lib/use-mobile';

export function FontSettings() {
    const {
        isOpen,
        setIsOpen,
        fontClass,
        setFontName,
        increaseFont,
        decreaseFont,
        setPageColor,
    } = useReaderSettings();

    const isMobile = useIsMobile();

    const content = (
        <div>
            <h1>Font</h1>
            <div className='mt-4 flex flex-col gap-4'>
                {Object.entries(fontMap).map(([name, nextFont]) => (
                    <Button
                        key={name}
                        variant={fontClass == nextFont.className ? 'outline' : 'ghost'}
                        className={`justify-start capitalize ${nextFont.className || ''}`}
                        onClick={() => setFontName(name as Parameters<typeof setFontName>[0])}
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
        </div>
    );

    if (isMobile) {
        return (
            <Drawer open={isOpen} onOpenChange={setIsOpen}>
                <DrawerContent className='flex h-[75svh] flex-col gap-2 px-4'>
                    <DrawerHeader className='hidden'>
                        <DrawerTitle>Annotate</DrawerTitle>
                    </DrawerHeader>
                    {content}
                </DrawerContent>
            </Drawer>
        );
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.aside
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className='fixed top-0 right-0 z-40 h-full w-[32rem] border-l border-neutral-800 bg-neutral-900 p-6 pt-20 shadow-xl dark:bg-neutral-950'
                >
                    <X
                        className='mb-5 h-6 w-6 cursor-pointer text-neutral-400 hover:text-neutral-200'
                        onClick={() => setIsOpen(false)}
                    />
                    {content}
                </motion.aside>
            )}
        </AnimatePresence>
    );
}
