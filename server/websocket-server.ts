import WebSocket from 'ws';

const wss = new WebSocket.Server({ port: 8080 });
console.log(wss);

// Object to store connected clients
const clients: WebSocket[] = [];

wss.on('connection', (ws) => {
  console.log('WebSocket connection established.');

  // Add the new WebSocket client to the clients array
  clients.push(ws);
  console.log('Number of connected clients: %s', clients.length);

  // Event listener for receiving messages from clients
  ws.on('message', (message: string) => {
    console.log('Message received: %s', message);
    const data = JSON.parse(message);
    const { type, payload } = data;

    // Broadcast the message to all connected clients
    for (const client of clients) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    }
  });

  // Event listener for client disconnection
  ws.on('close', () => {
    // Remove the WebSocket from the clients array when it's closed
    const index = clients.indexOf(ws);
    if (index !== -1) {
      clients.splice(index, 1);
    }
  });
});
