'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AudioLines } from 'lucide-react';

import { useQnA } from '@/hooks/reader/useQnA';
import { Button } from '@/components/ui/button';
import { postVerbalQnaMessage } from '@/services/api/reader/postVerbalQnaMessage';
import { useWebsockets } from '@/components/providers/websocket-provider';

export function MicrophoneQnA({ viewportContent }: { viewportContent: string }) {
    const [recording, setRecording] = useState(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<BlobPart[]>([]);
    const viewportContentRef = useRef<string>('');
    const pendingAudioRef = useRef<{ base64Data: string; conversationId: string } | null>(null);

    const {
        setHighlightedText,
        setIsOpen,
        conversation,
        setConversation,
        setSending,
        conversationId,
    } = useQnA();

    const { reconnect } = useWebsockets();

    useEffect(() => {
        viewportContentRef.current = viewportContent;
    }, [viewportContent]);

    useEffect(() => {
        if (pendingAudioRef.current && conversationId) {
            const { base64Data, conversationId: pendingId } = pendingAudioRef.current;
            const currentConversationId = conversationId || pendingId;

            (async () => {
                try {
                    await reconnect();

                    const response = await postVerbalQnaMessage({
                        audio_base64: base64Data,
                        highlighted_text: viewportContentRef.current,
                        page_content: '',
                        curr_conversation: [],
                        conversation_id: currentConversationId,
                    });

                    const transcribedText = response.transcribed || '';

                    if (transcribedText) {
                        const userMessage = { role: 'user' as const, content: transcribedText };
                        const assistantMessage = { role: 'assistant' as const, content: '' };
                        setConversation([userMessage, assistantMessage]);
                        setSending(true);
                    }

                    pendingAudioRef.current = null;
                } catch (error) {
                    console.error('Failed to send audio:', error);
                    setSending(false);
                    pendingAudioRef.current = null;
                }
            })();
        }
    }, [conversationId, reconnect, setConversation, setSending]);

    const handleRecordingComplete = useCallback(
        async (blob: Blob) => {
            const reader = new FileReader();
            reader.onloadend = async () => {
                const base64Audio = reader.result as string;
                const base64Data = base64Audio.split(',')[1];

                try {
                    setHighlightedText(viewportContentRef.current);
                    setIsOpen(true);

                    const generatedId = crypto.randomUUID();
                    pendingAudioRef.current = {
                        base64Data,
                        conversationId: generatedId,
                    };

                    if (conversationId) {
                        await reconnect();

                        const response = await postVerbalQnaMessage({
                            audio_base64: base64Data,
                            highlighted_text: viewportContentRef.current,
                            page_content: '',
                            curr_conversation: [],
                            conversation_id: conversationId,
                        });

                        const transcribedText = response.transcribed || '';

                        if (transcribedText) {
                            const userMessage = {
                                role: 'user' as const,
                                content: transcribedText,
                            };
                            const assistantMessage = {
                                role: 'assistant' as const,
                                content: '',
                            };
                            setConversation([userMessage, assistantMessage]);
                            setSending(true);
                        }

                        pendingAudioRef.current = null;
                    }
                } catch (error) {
                    console.error('Failed to send audio:', error);
                    setSending(false);
                    pendingAudioRef.current = null;
                }
            };
            reader.readAsDataURL(blob);
        },
        [setHighlightedText, setIsOpen, setConversation, setSending, reconnect, conversationId],
    );

    const startRecording = useCallback(async () => {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return;
        if (recording) return;

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            chunksRef.current = [];

            console.log('viewport content: ', viewportContentRef.current);

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) chunksRef.current.push(event.data);
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
                stream.getTracks().forEach((track) => track.stop());
                mediaRecorderRef.current = null;
                handleRecordingComplete(blob);
            };

            mediaRecorderRef.current = mediaRecorder;
            mediaRecorder.start();
            setRecording(true);
        } catch (error) {
            const e = error as any;
            if (e && e.name === 'NotFoundError') {
                // TODO: Add a toast for microphone
            } else {
                console.error(error);
            }
        }
    }, [recording, handleRecordingComplete]);

    const stopRecording = useCallback(() => {
        if (!mediaRecorderRef.current || !recording) return;
        mediaRecorderRef.current.stop();
        setRecording(false);
    }, [recording]);

    return (
        <Button
            className='fixed right-2 bottom-2 z-10 md:right-32 lg:right-48 xl:right-96 2xl:right-[33svw]'
            //variant='secondary'
            onPointerDown={startRecording}
            onPointerUp={stopRecording}
            onPointerLeave={stopRecording}
        >
            <AudioLines size={32} />
            {recording ? 'Listening...' : 'Ask AI'}
        </Button>
    );
}
