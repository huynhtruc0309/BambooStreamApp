// models/User.ts
import { Room } from "./room.js";

export class User {
  private userId: string;
  private username: string;
  private password: string;
  private email: string;
  private rooms: Room[];
  private currentRoomCode: string | null = null;

  constructor(username: string, password: string, email: string) {
    this.userId = Math.floor(Math.random() * 1000000).toString();
    this.username = username;
    this.password = password;
    this.email = email;
    this.rooms = [];
  }

  static fromData(data: any): User {
    const user = new User(data.username, data.password, data.email);
    user.userId = data.userId;
    user.rooms = data.rooms.map((roomData: any) => Room.fromData(roomData));
    user.currentRoomCode = data.currentRoomCode;
    return user;
  }
  
  set setUserName(username: string) {
    this.username = username;
  }

  set setUserPassword(password: string) {
    this.password = password;
  }

  set setUserEmail(email: string) {
    this.email = email;
  }

  get getUserName(): string {
    return this.username;
  }

  get getUserPassword(): string {
    return this.password;
  }

  get getUserEmail(): string {
    return this.email;
  }

  get getCurrentRoomCode(): string | null {
    return this.currentRoomCode;
  }

  public joinRoom(newRoom: Room): void {
    const existingRoom = this.rooms.find(room => room.getRoomCode === newRoom.getRoomCode);
  
    if (!existingRoom) {
      this.rooms.push(newRoom);
    }
    this.currentRoomCode = newRoom.getRoomCode;
  }
}