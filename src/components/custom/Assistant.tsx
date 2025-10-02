import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardFooter } from '../ui/card';
import { Input } from '../ui/input';
import { ArrowRight } from 'lucide-react';

type MessagePair = [string, string]; // user message, assistant response

const Assistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<MessagePair[]>([
        [
            'LOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOONNNNNNNGGGGG TTEEEEESSSSTTTTT',
            'LOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOONNNNNNNGGGGG TTEEEEESSSSTTTTT',
        ],
    ]);
    const [input, setInput] = useState('');

    const handleSend = () => {
        if (!input.trim()) return;

        const fakeResponse = 'Placeholder AI response.';

        setMessages((prev) => [...prev, [input, fakeResponse]]);
        setInput('');
    };

    return (
        <div className='absolute right-10 bottom-10 z-25'>
            <Card
                className={` ${isOpen ? 'bg-primary2 border-accent flex h-[90vh] w-[30vw] overflow-hidden p-5 opacity-100' : 'h-[0vh] w-[0vw] overflow-hidden p-0 opacity-0'} rounded-4xl transition-all duration-300`}
            >
                <CardContent
                    className={isOpen ? 'm-5 h-[80%] overflow-y-auto' : 'm-0 h-0 w-0 opacity-0'}
                >
                    {messages.map(([user, ai], i) => (
                        <div className='flex flex-col space-y-2'>
                            <div
                                key={`User_${i}`}
                                className='bg-primary my-5 ml-auto w-fit max-w-[70%] rounded-4xl p-5 break-all hyphens-auto drop-shadow-xl'
                            >
                                {user}
                            </div>
                            <div
                                key={`AI${i}`}
                                className='bg-primary-bright my-5 mr-auto w-fit max-w-[70%] rounded-4xl p-5 break-all hyphens-auto drop-shadow-xl'
                            >
                                {ai}
                            </div>
                        </div>
                    ))}
                </CardContent>
                <CardFooter className={isOpen ? '' : 'm-0 h-0 w-0 opacity-0'}>
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        className={
                            isOpen
                                ? '!bg-primary2 border-accent ml-20 rounded-full py-6 pl-12 text-white'
                                : 'h-0 w-0'
                        }
                    />
                    <Button
                        onClick={handleSend}
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
