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
    const pendingAudioRef = useRef<{
        base64Data: string;
        conversationId: string;
        fileExtension: string;
    } | null>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

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
        const button = buttonRef.current;
        if (!button) return;

        const handleSelectStart = (e: Event) => e.preventDefault();
        button.addEventListener('selectstart', handleSelectStart);

        return () => {
            button.removeEventListener('selectstart', handleSelectStart);
        };
    }, []);

    const stopRecording = useCallback(() => {
        if (!mediaRecorderRef.current || !recording) return;
        mediaRecorderRef.current.stop();
        setRecording(false);
    }, [recording]);

    useEffect(() => {
        if (!recording) return;

        const handleGlobalTouch = (e: TouchEvent) => {
            if (buttonRef.current && !buttonRef.current.contains(e.target as Node)) {
                stopRecording();
            }
        };

        const handleVisibilityChange = () => {
            if (document.hidden) {
                stopRecording();
            }
        };

        document.addEventListener('touchstart', handleGlobalTouch);
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('touchstart', handleGlobalTouch);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [recording, stopRecording]);

    useEffect(() => {
        if (pendingAudioRef.current && conversationId) {
            const {
                base64Data,
                conversationId: pendingId,
                fileExtension,
            } = pendingAudioRef.current;
            const currentConversationId = conversationId || pendingId;

            setSending(true);

            (async () => {
                try {
                    await reconnect();

                    const response = await postVerbalQnaMessage({
                        audio_base64: base64Data,
                        highlighted_text: viewportContentRef.current,
                        page_content: '',
                        curr_conversation: [],
                        conversation_id: currentConversationId,
                        file_extension: fileExtension,
                    });

                    const transcribedText = response.transcribed || '';

                    if (transcribedText) {
                        const userMessage = { role: 'user' as const, content: transcribedText };
                        const assistantMessage = { role: 'assistant' as const, content: '' };
                        setConversation([userMessage, assistantMessage]);
                    } else {
                        setSending(false);
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
            console.log('handleRecordingComplete: blob size =', blob.size, 'type =', blob.type);

            if (blob.size < 100) {
                console.error('Blob too small, not sending');
                return;
            }

            const mimeType = blob.type || 'audio/webm';
            const fileExtension = mimeType.includes('mp4') ? 'mp4' : 'webm';

            const reader = new FileReader();
            reader.onloadend = async () => {
                const base64Audio = reader.result as string;
                const base64Data = base64Audio.split(',')[1];

                console.log('Base64 data length:', base64Data.length);

                try {
                    setHighlightedText(viewportContentRef.current);
                    setIsOpen(true);
                    setSending(true);

                    const generatedId = crypto.randomUUID();
                    pendingAudioRef.current = {
                        base64Data,
                        conversationId: generatedId,
                        fileExtension,
                    };

                    if (conversationId) {
                        await reconnect();

                        const response = await postVerbalQnaMessage({
                            audio_base64: base64Data,
                            highlighted_text: viewportContentRef.current,
                            page_content: '',
                            curr_conversation: [],
                            conversation_id: conversationId,
                            file_extension: fileExtension,
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
                        } else {
                            setSending(false);
                        }

                        pendingAudioRef.current = null;
                    } else {
                        console.log('No conversationId, storing in pendingAudioRef');
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

    const startRecording = useCallback(
        async (e: React.MouseEvent | React.TouchEvent) => {
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return;
            if (recording) return;

            e.preventDefault();

            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

                if (!buttonRef.current?.matches(':active')) {
                    stream.getTracks().forEach((track) => track.stop());
                    return;
                }

                let mimeType = 'audio/webm;codecs=opus';
                if (!MediaRecorder.isTypeSupported(mimeType)) {
                    mimeType = 'audio/webm';
                }
                if (!MediaRecorder.isTypeSupported(mimeType)) {
                    mimeType = 'audio/mp4';
                }
                if (!MediaRecorder.isTypeSupported(mimeType)) {
                    mimeType = '';
                }

                const options = mimeType ? { mimeType } : undefined;
                const mediaRecorder = new MediaRecorder(stream, options);
                chunksRef.current = [];

                console.log('Recording with MIME type:', mediaRecorder.mimeType);
                console.log('viewport content: ', viewportContentRef.current);

                mediaRecorder.ondataavailable = (event) => {
                    if (event.data.size > 0) chunksRef.current.push(event.data);
                };

                mediaRecorder.onstop = () => {
                    const actualMimeType = mediaRecorder.mimeType || 'audio/webm';
                    const blob = new Blob(chunksRef.current, { type: actualMimeType });
                    console.log(
                        'Recording stopped. Blob size:',
                        blob.size,
                        'MIME type:',
                        actualMimeType,
                    );
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
                    console.error('Microphone not found');
                } else {
                    console.error(error);
                }
            }
        },
        [recording, handleRecordingComplete],
    );

    return (
        <Button
            ref={buttonRef}
            className='fixed right-2 bottom-2 z-10 select-none md:right-32 lg:right-48 xl:right-96 2xl:right-[33svw]'
            variant='secondary'
            onMouseDown={startRecording}
            onMouseUp={stopRecording}
            onTouchStart={startRecording}
            onTouchEnd={stopRecording}
            onTouchCancel={stopRecording}
        >
            <AudioLines size={32} />
            {recording ? 'Listening...' : 'Ask AI'}
        </Button>
    );
}
