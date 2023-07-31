import { Room } from "./room.js";
export class RoomManager {
    constructor() {
        const storedRooms = localStorage.getItem("rooms");
        this.rooms = storedRooms ? JSON.parse(storedRooms).map((roomData) => Room.fromData(roomData)) : [];
    }
    createRoom() {
        const newRoom = new Room();
        this.rooms.push(newRoom);
        localStorage.setItem("rooms", JSON.stringify(this.rooms));
        return newRoom;
    }
    getRoomByRoomCode(roomCode) {
        const room = this.rooms.find((room) => room.getRoomCode === roomCode);
        if (!room) {
            throw new Error('Không tìm thấy phòng.');
        }
        return room;
    }
}
