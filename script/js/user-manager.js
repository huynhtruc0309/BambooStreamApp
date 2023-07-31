import { User } from "./user.js";
export class UserManager {
    constructor() {
        this.currentLoggedInUser = null;
        const storedUsers = localStorage.getItem("users");
        this.users = storedUsers ? JSON.parse(storedUsers).map((userData) => User.fromData(userData)) : [];
        const storedCurrentUser = localStorage.getItem("currentLoggedInUser");
    }
    registerUser(username, password, email) {
        const isUsernameTaken = this.users.some((user) => user.getUserName === username);
        if (isUsernameTaken) {
            throw new Error('Tên đăng nhập đã tồn tại.');
        }
        const newUser = new User(username, password, email);
        this.users.push(newUser);
    }
    loginUser(username, password) {
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
    editUserProfile(newUserName, newUserEmail) {
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
    changeUserPassword(currentPassword, newPassword, confirmNewPassword) {
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
    joinRoom(room) {
        if (this.currentLoggedInUser === null) {
            throw new Error('Bạn chưa đăng nhập.');
        }
        this.currentLoggedInUser.joinRoom(room);
        this.saveDataToLocalStorage();
    }
    saveDataToLocalStorage() {
        localStorage.setItem("users", JSON.stringify(this.users));
        localStorage.setItem("currentLoggedInUser", JSON.stringify(this.currentLoggedInUser));
    }
    setCurrentUser(user) {
        this.currentLoggedInUser = user;
    }
    getCurrentUser() {
        return this.currentLoggedInUser;
    }
}
