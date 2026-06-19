const { WebSocketServer } = require('ws');

const wss = new WebSocketServer({ port: 8085 });

const messageHistory = [];
const MAX_HISTORY = 50;

wss.on('connection', (ws) => {
  
  messageHistory.forEach((msg) => {
    ws.send(JSON.stringify(msg));
  });

  ws.on('message', (rawData) => {
    try {
      const messageString = rawData.toString();
      const messageObj = JSON.parse(messageString);
      
      messageHistory.push(messageObj);
      if (messageHistory.length > MAX_HISTORY) {
        messageHistory.shift();
      }
      
      wss.clients.forEach((client) => {
        if (client.readyState === 1) {
          client.send(messageString);
        }
      });
    } catch (err) {
      console.error('Error:', err);
    }
  });
});