export class Room {
    constructor() {
        this.roomCode = Math.floor(Math.random() * 1000000).toString();
    }
    static fromData(data) {
        const room = new Room();
        room.roomCode = data.roomCode;
        return room;
    }
    get getRoomCode() {
        return this.roomCode;
    }
}
