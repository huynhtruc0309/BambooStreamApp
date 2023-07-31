import { User } from "./user.js";
import { Room } from "./room.js";

export class UserManager {
    private users: User[];
    private currentLoggedInUser: User | null = null;
  
    constructor() {
      const storedUsers = localStorage.getItem("users");
      this.users = storedUsers ? JSON.parse(storedUsers).map((userData: any) => User.fromData(userData)) : [];
      const storedCurrentUser = localStorage.getItem("currentLoggedInUser");
    }
  
    public registerUser(username: string, password: string, email: string): void {
      const isUsernameTaken = this.users.some((user) => user.getUserName === username);
      if (isUsernameTaken) {
        throw new Error('Tên đăng nhập đã tồn tại.');
      }
  
      const newUser = new User(username, password, email);
      this.users.push(newUser);
    }
  
    public loginUser(username: string, password: string): void {
      console.log(username, password);
      console.log(this.users);
      const user = this.users.find((user) => user.getUserName === username);

      if (!user) {
        throw new Error('Không tìm thấy người dùng.');
      }
  
      if (user.getUserPassword !== password) {
        throw new Error('Mật khẩu không chính xác.');
      }
  
      this.setCurrentUser(user);
    }

    public editUserProfile(newUserName: string, newUserEmail: string): void {
      if (this.currentLoggedInUser === null) {
        throw new Error('Bạn chưa đăng nhập.');
      }
      if (newUserName !== '') {
          this.currentLoggedInUser.setUserName = newUserName;
      }

      if (newUserEmail !== '') {
          this.currentLoggedInUser.setUserEmail = newUserEmail;
      }
    }

    public changeUserPassword(currentPassword: string, newPassword: string, confirmNewPassword: string): void {
      if (this.currentLoggedInUser === null) {
        throw new Error('Bạn chưa đăng nhập.');
      }
      if (this.currentLoggedInUser.getUserPassword !== currentPassword) {
        throw new Error('Mật khẩu cũ không chính xác.');
      }
      if (newPassword !== confirmNewPassword) {
        throw new Error('Mật khẩu mới không khớp.');
      }
      this.currentLoggedInUser.setUserPassword = newPassword;
    }

    public joinRoom(room: Room): void {
      if (this.currentLoggedInUser === null) {
        throw new Error('Bạn chưa đăng nhập.');
      }
      this.currentLoggedInUser.joinRoom(room);
      this.saveDataToLocalStorage(); 
    }

    private saveDataToLocalStorage(): void {
      localStorage.setItem("users", JSON.stringify(this.users));
      localStorage.setItem("currentLoggedInUser", JSON.stringify(this.currentLoggedInUser));
    }
  
    private setCurrentUser(user: User | null): void {
      this.currentLoggedInUser = user;
    }
  
    public getCurrentUser(): User | null {
      return this.currentLoggedInUser;
    }
}