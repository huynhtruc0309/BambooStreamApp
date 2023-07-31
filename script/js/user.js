// models/User.ts
import { Room } from "./room.js";
export class User {
    constructor(username, password, email) {
        this.currentRoomCode = null;
        this.userId = Math.floor(Math.random() * 1000000).toString();
        this.username = username;
        this.password = password;
        this.email = email;
        this.rooms = [];
    }
    static fromData(data) {
        const user = new User(data.username, data.password, data.email);
        user.userId = data.userId;
        user.rooms = data.rooms.map((roomData) => Room.fromData(roomData));
        user.currentRoomCode = data.currentRoomCode;
        return user;
    }
    set setUserName(username) {
        this.username = username;
    }
    set setUserPassword(password) {
        this.password = password;
    }
    set setUserEmail(email) {
        this.email = email;
    }
    get getUserName() {
        return this.username;
    }
    get getUserPassword() {
        return this.password;
    }
    get getUserEmail() {
        return this.email;
    }
    get getCurrentRoomCode() {
        return this.currentRoomCode;
    }
    joinRoom(newRoom) {
        const existingRoom = this.rooms.find(room => room.getRoomCode === newRoom.getRoomCode);
        if (!existingRoom) {
            this.rooms.push(newRoom);
        }
        this.currentRoomCode = newRoom.getRoomCode;
    }
}
