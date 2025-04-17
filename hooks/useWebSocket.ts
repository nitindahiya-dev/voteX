// hook/usewebSocket.ts

import { useEffect } from 'react';

export const useWebSocket = (url: string, onMessage: (message: any) => void) => {
  useEffect(() => {
    const ws = new WebSocket(url);

    ws.onopen = () => {
      console.log('WebSocket connected');
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      onMessage(message);
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
    };

    return () => {
      ws.close();
    };
  }, [url, onMessage]);
};