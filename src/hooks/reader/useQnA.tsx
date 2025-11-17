'use client';
import type { QnAMessage } from '@/types/reader';
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

import { postQnaMessage } from '@/services/api/reader/postQnaMessage';
import { useWebsockets } from '@/components/providers/websocket-provider';

interface QnAContextType {
    highlightedText: string;
    setHighlightedText: (text: string) => void;
    //
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    //
    message: string;
    setMessage: (message: string) => void;
    //
    conversation: QnAMessage[];
    setConversation: (conversation: QnAMessage[]) => void;
    //
    isSending: boolean;
    setSending: (sending: boolean) => void;
    //
    handleSend: (message: string) => void;
    //
    conversationId: string | null;
    //
    reset: () => void;
}

const QnAContext = createContext<QnAContextType | undefined>(undefined);

interface QnAProviderProps {
    children: ReactNode;
}

export function QnAProvider({ children }: QnAProviderProps) {
    const [highlightedText, setHighlightedText] = useState<string>('');
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');
    const [conversation, setConversation] = useState<QnAMessage[]>([]);
    const [isSending, setSending] = useState<boolean>(false);
    const [conversationId, setConversationId] = useState<string | null>(null);

    const { reconnect, subscribe } = useWebsockets();

    function reset() {
        setHighlightedText('');
        setMessage('');
        setConversation([]);
        setSending(false);
        setConversationId(null);
    }

    useEffect(() => {
        if (!isOpen) {
            reset();
        } else if (isOpen && !conversationId) {
            setConversationId(crypto.randomUUID());
        }
    }, [isOpen, conversationId]);

    useEffect(() => {
        if (!conversationId) return;

        const unsubscribe = subscribe('reader-qna', (ws) => {
            if (!ws.conversation_id || ws.conversation_id !== conversationId) return;

            if (ws.event === 'chunk') {
                setConversation((prev) => {
                    if (prev.length === 0) {
                        return [{ role: 'assistant' as const, content: ws.body }];
                    }
                    const lastIdx = prev.length - 1;
                    return prev.map((msg, idx) =>
                        idx === lastIdx ? { ...msg, content: msg.content + ws.body } : msg,
                    );
                });
            }

            if (ws.event === 'turn-over') {
                setSending(false);
                setConversation((prev) => {
                    const savedConversation = ws.body;
                    if (Array.isArray(savedConversation) && savedConversation.length > 0) {
                        return savedConversation.map((msg: any) => {
                            let content = '';
                            if (Array.isArray(msg.content)) {
                                content = msg.content
                                    .map((item: any) =>
                                        typeof item === 'string'
                                            ? item
                                            : item?.text || item?.content || '',
                                    )
                                    .join('');
                            } else if (typeof msg.content === 'string') {
                                content = msg.content;
                            }
                            return {
                                role:
                                    msg.role === 'user' || msg.role === 'assistant'
                                        ? msg.role
                                        : 'assistant',
                                content: content,
                            };
                        });
                    }
                    return prev;
                });
            }

            if (ws.event === 'error') {
                setSending(false);
            }
        });

        return unsubscribe;
    }, [subscribe, conversationId]);

    async function handleSend(msg: string) {
        if (!msg.trim() || isSending || !conversationId) return;

        const userMessage: QnAMessage = { role: 'user', content: msg };
        const assistantMessage: QnAMessage = { role: 'assistant', content: '' };
        const updatedConversation = [...conversation, userMessage, assistantMessage];

        setConversation(updatedConversation);
        setMessage('');
        setSending(true);

        try {
            await reconnect();
            await postQnaMessage({
                query: msg,
                highlighted_text: highlightedText,
                page_content: '',
                curr_conversation: [...conversation, userMessage],
                conversation_id: conversationId,
            });
        } catch (error) {
            console.error('Failed to send message:', error);
            setSending(false);
        }
    }

    return (
        <QnAContext.Provider
            value={{
                highlightedText,
                setHighlightedText,

                isOpen,
                setIsOpen,

                message,
                setMessage,

                conversation,
                setConversation,

                isSending,
                setSending,

                handleSend,

                conversationId,

                reset,
            }}
        >
            {children}
        </QnAContext.Provider>
    );
}

export function useQnA() {
    const context = useContext(QnAContext);
    if (context === undefined) {
        throw new Error('useQnA must be used within a QnAProvider');
    }
    return context;
}
