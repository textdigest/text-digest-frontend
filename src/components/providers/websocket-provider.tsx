import {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
    useRef,
    useCallback,
} from 'react';
import { fetchAuthSession } from '@aws-amplify/auth';
import { getIdToken } from '@/services/amplify/getIdToken';

interface IWebsocketMessage {
    connectionId: string;
    service: string;
    event: string;
    body: any;
    timestamp: string;
}

interface WebsocketContext {
    send: (message: IWebsocketMessage) => void;
    subscribe: (service: string, fn: (message: IWebsocketMessage) => void) => () => void;
    reconnect: () => Promise<void>;
}

const defaultContext: WebsocketContext = {
    send: () => {},
    subscribe: () => () => {},
    reconnect: async () => {},
};

export const WebsocketContext = createContext<WebsocketContext>(defaultContext);

export const useWebsockets = () => useContext(WebsocketContext);

export const WebsocketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const MAX_RETRIES = 3;
    const connected = useRef<boolean>(false);

    const [websocket, setWebsocket] = useState<WebSocket | null>(null);
    const [retryCount, setRetryCount] = useState<number>(0);

    const listeners = useRef<{ service: string; fn: (message: IWebsocketMessage) => void }[]>(
        [],
    );

    useEffect(() => {
        if (connected.current) return;
        connect();
        return () => {
            if (websocket) {
                websocket.close(1000, 'Component unmounting');
            }
        };
    }, []);

    const send = useCallback(
        (message: IWebsocketMessage) => {
            if (websocket && websocket.readyState === WebSocket.OPEN) {
                websocket.send(JSON.stringify(message));
            }
        },
        [websocket],
    );
    const subscribe = useCallback(
        (service: string, fn: (message: IWebsocketMessage) => void) => {
            listeners.current.push({ service, fn });
            return () => {
                listeners.current = listeners.current.filter(
                    (l) => l.service !== service || l.fn !== fn,
                );
            };
        },
        [],
    );

    const publish = (i: IWebsocketMessage) =>
        listeners.current.forEach(({ service, fn }) => {
            if (service === i.service) fn(i);
        });

    const connect = async () => {
        try {
            console.log(`Connection: ${connected.current}`);

            if (connected.current) return;

            const idToken = await getIdToken();
            if (!idToken) {
                return;
            }

            const ws = new WebSocket(
                `${process.env.NEXT_PUBLIC_WEBSOCKET_URL}/$default?token=${idToken}`,
            );

            console.log(ws);

            ws.onopen = () => {
                setWebsocket(ws);
                connected.current = true;
                console.log('Websocket connection established...');
                setRetryCount(0);
            };

            ws.onclose = (event) => {
                setWebsocket(null);
                connected.current = false;
                console.log('Websocket connection closing...');

                if (event.code !== 1000 && retryCount < MAX_RETRIES) {
                    setRetryCount((prev) => {
                        const retry = prev + 1;

                        if (retry <= MAX_RETRIES) {
                            const timeout = Math.min(1000 * Math.pow(2, prev), 10000);
                            setTimeout(connect, timeout);
                        }

                        console.log(
                            `Retrying to establish connnection. Attempt no. ${retryCount}`,
                        );
                        return retry;
                    });
                }
            };

            ws.onerror = (error) => {
                console.error('ws err:', error);
            };

            ws.onmessage = (event) => {
                const message = JSON.parse(event.data);
                console.log('📨WebSocket message received:', message);
                publish(message);
            };
        } catch (error) {
            console.error('Failed to connect to alerts websocket:', error);
        }
    };

    const reconnect = (): Promise<void> =>
        connected.current
            ? Promise.resolve()
            : new Promise((resolve) => {
                  const interval = setInterval(() => {
                      if (connected.current) {
                          clearInterval(interval);
                          resolve();
                      }
                  }, 25);
              });

    const value: WebsocketContext = { send, subscribe, reconnect };

    return <WebsocketContext.Provider value={value}>{children}</WebsocketContext.Provider>;
};
