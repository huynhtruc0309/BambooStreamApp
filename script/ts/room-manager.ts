import { Room } from "./room.js";
import { User } from "./user.js";

export class RoomManager {
    private rooms: Room[];

    constructor() {
        const storedRooms = localStorage.getItem("rooms");
        this.rooms = storedRooms ? JSON.parse(storedRooms).map((roomData: any) => Room.fromData(roomData)) : [];
    }

    public createRoom(): Room {
        const newRoom = new Room();
        this.rooms.push(newRoom);
        localStorage.setItem("rooms", JSON.stringify(this.rooms));
        return newRoom;
    }
    
    public getRoomByRoomCode(roomCode: string): Room {
        const room = this.rooms.find((room) => room.getRoomCode === roomCode);
        if (!room) {
            throw new Error('Không tìm thấy phòng.');
        }
        return room;
    }
}