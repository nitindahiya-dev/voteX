// websocketServer.ts
import { WebSocketServer } from 'ws';
import { prisma } from './lib/prisma';

const wss = new WebSocketServer({ port: 3001 });

wss.on('connection', (ws, req) => {
  const pollId = req.url?.split('/').pop();
  if (!pollId) {
    ws.close();
    return;
  }

  ws.on('message', async (message) => {
    const data = JSON.parse(message.toString());
    if (data.type === 'vote') {
      await prisma.poll.update({
        where: { id: Number(pollId) },
        data: { votes: { increment: 1 } },
      });
      wss.clients.forEach((client) => {
        if (client.readyState === client.OPEN) {
          client.send(JSON.stringify({ type: 'vote', pollId }));
        }
      });
    }
  });
});

console.log('WebSocket server running on ws://localhost:3001');
