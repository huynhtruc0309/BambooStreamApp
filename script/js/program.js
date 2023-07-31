import { UserManager } from "./user-manager.js";
import { RoomManager } from "./room-manager.js";
export class Program {
    constructor() {
        this.userManager = new UserManager();
        this.roomManager = new RoomManager();
        this.loadElements();
        this.initEvents();
    }
    loadElements() {
        console.log('loadElements()');
        this.loginForm = document.getElementById('loginForm');
        this.signupForm = document.getElementById('signupForm');
        this.userProfile = document.getElementById('userProfile');
        this.editUserProfileForm = document.getElementById('editUserProfileForm');
        this.changePasswordForm = document.getElementById('changePasswordForm');
        this.createRoomForm = document.getElementById('createRoomForm');
        this.joinRoomForm = document.getElementById('joinRoomForm');
        this.roomView = document.getElementById('roomView');
        this.chatBox = document.getElementById('chatBox');
        this.messageInput = document.getElementById('messageInput');
    }
    initEvents() {
        console.log('initEvents()');
        const loginLink = document.getElementById('loginLink');
        loginLink.addEventListener('click', () => {
            this.showLoginForm();
        });
        const signupLink = document.getElementById('signupLink');
        signupLink.addEventListener('click', () => {
            this.showSignupForm();
        });
        this.loginForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const username = this.loginForm.querySelector('input[name="username"]').value;
            const password = this.loginForm.querySelector('input[name="password"]').value;
            try {
                this.userManager.loginUser(username, password);
                this.showUserProfile();
            }
            catch (error) {
                alert(error.message);
            }
        });
        this.signupForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const username = this.signupForm.querySelector('input[name="username"]').value;
            const password = this.signupForm.querySelector('input[name="password"]').value;
            const email = this.signupForm.querySelector('input[name="email"]').value;
            try {
                this.userManager.registerUser(username, password, email);
                this.showLoginForm();
            }
            catch (error) {
                alert(error.message);
            }
        });
        const editUserProfileLink = document.getElementById('editUserProfileLink');
        editUserProfileLink.addEventListener('click', () => {
            this.showEditUserProfileForm();
        });
        const changePasswordLink = document.getElementById('changePasswordLink');
        changePasswordLink.addEventListener('click', () => {
            this.showChangePasswordForm();
        });
        const createRoomLink = document.getElementById('createRoomLink');
        createRoomLink.addEventListener('click', () => {
            this.showCreateRoomForm();
        });
        const joinRoomLink = document.getElementById('joinRoomLink');
        joinRoomLink.addEventListener('click', () => {
            this.showJoinRoomForm();
        });
        this.editUserProfileForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const username = this.editUserProfileForm.querySelector('input[name="newUsername"]').value;
            const email = this.editUserProfileForm.querySelector('input[name="newEmail"]').value;
            try {
                this.userManager.editUserProfile(username, email);
                this.showUserProfile();
            }
            catch (error) {
                alert(error.message);
            }
        });
        this.changePasswordForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const currentPassword = this.changePasswordForm.querySelector('input[name="currentPassword"]').value;
            const newPassword = this.changePasswordForm.querySelector('input[name="newPassword"]').value;
            const confirmNewPassword = this.changePasswordForm.querySelector('input[name="confirmNewPassword"]').value;
            try {
                this.userManager.changeUserPassword(currentPassword, newPassword, confirmNewPassword);
                this.showLoginForm();
            }
            catch (error) {
                alert(error.message);
            }
        });
        this.createRoomForm.addEventListener('submit', (event) => {
            event.preventDefault();
            try {
                const newRoom = this.roomManager.createRoom();
                this.userManager.joinRoom(newRoom);
                socket.send(JSON.stringify({ roomCode: newRoom.getRoomCode }));
                this.showRoomView();
            }
            catch (error) {
                alert(error.message);
            }
        });
        this.joinRoomForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const roomCode = this.joinRoomForm.querySelector('input[name="roomCode"]').value;
            try {
                const room = this.roomManager.getRoomByRoomCode(roomCode);
                this.userManager.joinRoom(room);
                socket.send(JSON.stringify({ roomCode: roomCode }));
                this.showRoomView();
            }
            catch (error) {
                alert(error.message);
            }
        });
        const videoPlayer = document.getElementById('videoPlayer');
        const socket = new WebSocket('ws://localhost:3000'); // Replace the URL with your server's URL
        socket.onopen = () => {
            console.log('Connected to WebSocket server');
        };
        socket.onmessage = (event) => {
            console.log('Received message from server:', event.data);
            try {
                const data = JSON.parse(event.data);
                if (data.type && data.currentTime) {
                    videoPlayer.currentTime = data.currentTime;
                    if (data.type === 'play') {
                        videoPlayer.play();
                    }
                    else if (data.type === 'pause') {
                        videoPlayer.pause();
                    }
                    console.log(`Set playback to ${data.type} - ${data.currentTime}`);
                }
                if (data.type === 'chat' && data.message) {
                    this.displayChatMessage(data.message);
                }
            }
            catch (error) {
                console.error('Error parsing JSON:', error);
            }
        };
        socket.onclose = () => {
            console.log('WebSocket connection closed');
        };
        setInterval(() => {
            const status = videoPlayer.paused ? "pause" : "play";
            const currentTime = videoPlayer.currentTime;
            sendPlaybackMessage(status, currentTime);
        }, 5000);
        const playButton = document.getElementById('playButton');
        playButton.addEventListener('click', () => {
            videoPlayer.play();
            const currentTime = videoPlayer.currentTime;
            console.log(this.userManager);
            sendPlaybackMessage('play', currentTime);
        });
        const pauseButton = document.getElementById('pauseButton');
        pauseButton.addEventListener('click', () => {
            videoPlayer.pause();
            sendPlaybackMessage('pause', videoPlayer.currentTime);
        });
        const fastForwardButton = document.getElementById('fastForwardButton');
        fastForwardButton.addEventListener('click', () => {
            videoPlayer.currentTime += 10;
            const status = videoPlayer.paused ? "pause" : "play";
            sendPlaybackMessage(status, videoPlayer.currentTime);
        });
        const rewindButton = document.getElementById('rewindButton');
        rewindButton.addEventListener('click', () => {
            videoPlayer.currentTime -= 10;
            const status = videoPlayer.paused ? "pause" : "play";
            sendPlaybackMessage(status, videoPlayer.currentTime);
        });
        const sendPlaybackMessage = (type, currentTime) => {
            console.log('Sending play message:', currentTime);
            console.log(this.userManager);
            if (this.userManager.getCurrentUser()) {
                const message = {
                    type: type,
                    currentTime: currentTime,
                    roomCode: this.userManager.getCurrentUser().getCurrentRoomCode,
                };
                socket.send(JSON.stringify(message));
            }
        };
        const sendMessageForm = document.getElementById('sendMessageForm');
        sendMessageForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const message = `${this.userManager.getCurrentUser().getUserName}: ${this.messageInput.value.trim()}`;
            if (message !== '') {
                sendMessage(message);
                this.messageInput.value = '';
            }
        });
        const sendMessage = (message) => {
            const chatMessage = {
                type: 'chat',
                message: message,
                roomCode: this.userManager.getCurrentUser().getCurrentRoomCode,
            };
            socket.send(JSON.stringify(chatMessage));
        };
        const emojiPickerButton = document.getElementById('emojiPickerButton');
        emojiPickerButton.addEventListener('click', () => {
            let drawer = document.getElementById('drawer');
            if (drawer.classList.contains('hidden')) {
                drawer.classList.remove('hidden');
            }
            else {
                drawer.classList.add('hidden');
            }
        });
        const emojiList = document.querySelectorAll('.emoji');
        emojiList.forEach(item => {
            item.addEventListener('click', (event) => {
                const clickedEmoji = event.target.innerHTML;
                this.messageInput.value += clickedEmoji;
            });
        });
    }
    showLoginForm() {
        this.loginForm.style.display = 'block';
        this.signupForm.style.display = 'none';
        this.changePasswordForm.style.display = 'none';
    }
    showSignupForm() {
        this.loginForm.style.display = 'none';
        this.signupForm.style.display = 'block';
    }
    showUserProfile() {
        const usernameInput = document.getElementById('username');
        const emailInput = document.getElementById('email');
        usernameInput.value = this.userManager.getCurrentUser().getUserName;
        emailInput.value = this.userManager.getCurrentUser().getUserEmail;
        this.userProfile.style.display = 'block';
        this.loginForm.style.display = 'none';
        this.editUserProfileForm.style.display = 'none';
    }
    showEditUserProfileForm() {
        this.editUserProfileForm.style.display = 'block';
        this.userProfile.style.display = 'none';
    }
    showChangePasswordForm() {
        this.changePasswordForm.style.display = 'block';
        this.userProfile.style.display = 'none';
    }
    showCreateRoomForm() {
        this.createRoomForm.style.display = 'block';
        this.userProfile.style.display = 'none';
    }
    showJoinRoomForm() {
        this.joinRoomForm.style.display = 'block';
        this.userProfile.style.display = 'none';
    }
    showRoomView() {
        const roomCodeElement = document.getElementById('roomCode');
        roomCodeElement.textContent = this.userManager.getCurrentUser().getCurrentRoomCode;
        this.roomView.style.display = 'block';
        this.createRoomForm.style.display = 'none';
        this.joinRoomForm.style.display = 'none';
    }
    displayChatMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.textContent = message;
        this.chatBox.appendChild(messageElement);
    }
}
const p = new Program();
console.log('Running program...');
