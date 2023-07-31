import { User } from "./user.js";

export class Room {
    private roomCode: string;
  
    constructor() {
      this.roomCode = Math.floor(Math.random() * 1000000).toString();
    }

    static fromData(data: any): Room {
      const room = new Room();
      room.roomCode = data.roomCode;
      return room;
    }

    get getRoomCode(): string {
        return this.roomCode;
    }
}