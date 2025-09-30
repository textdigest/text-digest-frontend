import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardFooter } from '../ui/card';
import { Input } from '../ui/input';
import { ArrowRight } from 'lucide-react';

const Assistant = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className='absolute right-10 bottom-10 z-25'>
            <Card
                className={` ${isOpen ? 'bg-primary2 border-accent flex h-[90vh] w-[30vw] overflow-hidden p-5 opacity-100' : 'h-[0vh] w-[0vw] overflow-hidden p-0 opacity-0'} rounded-4xl transition-all duration-300`}
            >
                <CardContent className={isOpen ? 'm-5 h-[80%]' : 'm-0 h-0 w-0'}></CardContent>
                <CardFooter className={isOpen ? '' : 'm-0 h-0 w-0'}>
                    <Input
                        className={
                            isOpen
                                ? '!bg-primary2 border-accent ml-20 rounded-full py-6 pl-12 text-white'
                                : 'h-0 w-0'
                        }
                    />
                    <Button
                        variant='outline'
                        className='!border-accent !bg-primary2 mx-2 rounded-full py-6 text-white'
                    >
                        {isOpen ? <ArrowRight /> : null}
                    </Button>
                </CardFooter>
            </Card>
            <div
                className={`absolute ${isOpen ? 'right-105' : 'right-10'} bottom-8 transition-all duration-300`}
            >
                <Button
                    variant='outline'
                    onClick={() => setIsOpen((prevState) => !prevState)}
                    className='!border-accent size-30 rounded-full !bg-[radial-gradient(circle,rgba(168,27,27,1)_20%,rgba(117,19,19,1)_45%,rgba(33,8,8,1)70%)] shadow-[0_20px_30px_rgba(0,0,0,0.7)]'
                >
                    <span className='mb-2 text-[400%] font-bold text-white'>AI</span>
                </Button>
            </div>
        </div>
    );
};

export default Assistant;
