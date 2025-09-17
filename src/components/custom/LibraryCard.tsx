import React from 'react';
import { Card, CardAction, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { SlOptionsVertical } from 'react-icons/sl';

const LibraryCard = () => {
    return (
        <Card className='hover:border-primary-bright bg-primary2/30 m-10 h-[40%] w-70 items-center rounded-4xl border-none shadow-[0_0_20px_rgba(0,0,0,0.4)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-[0_0_20px_rgba(256,0,0,0.4)]'>
            <Button
                variant='outline'
                size='icon'
                className='hover:!bg-primary2 !bg-primary2/0 absolute top-3 right-3 size-8 rounded-full border-none'
            >
                <SlOptionsVertical className='text-accent' />
            </Button>
            <CardContent className='bg-primary2/80 m-5 flex h-[60%] w-[60%] items-center justify-center'>
                <img src='/LogoSmall.svg' alt='TextDigest.AI Logo' className='m-auto' />
            </CardContent>
            <CardFooter className='text-center text-xl font-semibold'>
                Essential Computer Science
            </CardFooter>
        </Card>
    );
};

export default LibraryCard;
