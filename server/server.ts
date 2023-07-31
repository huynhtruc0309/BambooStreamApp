import express from 'express';
import WebSocket from 'ws';

const app = express();
const PORT = 3000;

const server = app.listen(PORT, () => {
    console.log(`WebSocket server is listening on port ${PORT}`);
});

const wss = new WebSocket.Server({ server, clientTracking: true });
const connectionsByRoom: { [key: string]: ConnectionInfo[] } = {}; // Đối tượng lưu trữ kết nối theo room code

interface ConnectionInfo {
    socket: WebSocket;
}

wss.on('connection', (ws) => {
    console.log('A new client connected');

    ws.on('message', (message) => {
        console.log(`Received message: ${message}`);

        // Parse the incoming JSON message
        try {
            const data = JSON.parse(message.toString()); // Chuyển Buffer thành chuỗi trước khi phân tích JSON
            // Kiểm tra xem có trường roomCode trong thông điệp không
            if (data.roomCode) {
                const roomCode = data.roomCode;

                // Lưu trữ thông tin kết nối của client theo roomCode
                if (!connectionsByRoom[roomCode]) {
                    connectionsByRoom[roomCode] = [];
                }

                // Kiểm tra xem kết nối của client đã tồn tại trong mảng connectionsByRoom[roomCode] chưa
                const existingConnection = connectionsByRoom[roomCode].find(conn => conn.socket === ws);
                if (!existingConnection) {
                    // Nếu chưa tồn tại, thêm thông tin kết nối của client vào mảng
                    connectionsByRoom[roomCode].push({ socket: ws });
                }
                
                if ((data.type === 'play' || data.type === 'pause') && "currentTime" in data) {
                    console.log(`Received playback from client ${ws}: ${data.type} - ${data.currentTime}`);
                    // Gửi lại thông điệp cho tất cả các kết nối trong cùng roomCode
                    connectionsByRoom[roomCode].forEach((conn) => {
                        if (conn.socket !== ws) {
                            conn.socket.send(JSON.stringify(data));
                            console.log(`Sent playback to client ${conn.socket}`);
                        }
                    });
                }

                if (data.type === 'chat' && "message" in data) {
                    console.log(`Received chat message from client ${ws}: ${data.message}`);
                    connectionsByRoom[roomCode].forEach((conn) => {
                        conn.socket.send(JSON.stringify(data));
                        console.log(`Sent chat message to client ${conn.socket}`);
                    });
                }
            } 
        } catch (error) {
            console.error('Error parsing JSON:', error);
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');

        // Xóa thông tin kết nối của client khi họ ngắt kết nối
        for (const roomCode in connectionsByRoom) {
            connectionsByRoom[roomCode] = connectionsByRoom[roomCode].filter(conn => conn.socket !== ws);
        }
    });
});
