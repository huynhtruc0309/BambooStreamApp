import { UserManager } from "./user-manager.js";
import { RoomManager } from "./room-manager.js";

export class Program {
    private userManager: UserManager;
    private roomManager: RoomManager;
    private loginForm: HTMLDivElement;
    private signupForm: HTMLDivElement;
    private userProfile: HTMLDivElement;
    private editUserProfileForm: HTMLDivElement;
    private changePasswordForm: HTMLDivElement;
    private createRoomForm: HTMLDivElement;
    private joinRoomForm: HTMLDivElement;
    private roomView: HTMLDivElement;
    private chatBox: HTMLDivElement;
    private messageInput: HTMLInputElement;


    constructor() {
        this.userManager = new UserManager();
        this.roomManager = new RoomManager();
        this.loadElements();
        this.initEvents();
    }

    private loadElements(): void {
        console.log('loadElements()');
        this.loginForm = document.getElementById('loginForm') as HTMLDivElement;
        this.signupForm = document.getElementById('signupForm') as HTMLDivElement;
        this.userProfile = document.getElementById('userProfile') as HTMLDivElement;
        this.editUserProfileForm = document.getElementById('editUserProfileForm') as HTMLDivElement;
        this.changePasswordForm = document.getElementById('changePasswordForm') as HTMLDivElement;
        this.createRoomForm = document.getElementById('createRoomForm') as HTMLDivElement;
        this.joinRoomForm = document.getElementById('joinRoomForm') as HTMLDivElement;
        this.roomView = document.getElementById('roomView') as HTMLDivElement;
        this.chatBox = document.getElementById('chatBox') as HTMLDivElement;
        this.messageInput = document.getElementById('messageInput') as HTMLInputElement;
    }

    private initEvents(): void {
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
            const username = (this.loginForm.querySelector('input[name="username"]') as HTMLInputElement).value;
            const password = (this.loginForm.querySelector('input[name="password"]') as HTMLInputElement).value;
            try {
                this.userManager.loginUser(username, password);
                this.showUserProfile()
            }
            catch (error) {
                alert(error.message)
            }
        });

        this.signupForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const username = (this.signupForm.querySelector('input[name="username"]') as HTMLInputElement).value;
            const password = (this.signupForm.querySelector('input[name="password"]') as HTMLInputElement).value;
            const email = (this.signupForm.querySelector('input[name="email"]') as HTMLInputElement).value;
            try {
                this.userManager.registerUser(username, password, email);
                this.showLoginForm()
            }
            catch (error) {
                alert(error.message)
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
            const username = (this.editUserProfileForm.querySelector('input[name="newUsername"]') as HTMLInputElement).value;
            const email = (this.editUserProfileForm.querySelector('input[name="newEmail"]') as HTMLInputElement).value;
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
            const currentPassword = (this.changePasswordForm.querySelector('input[name="currentPassword"]') as HTMLInputElement).value;
            const newPassword = (this.changePasswordForm.querySelector('input[name="newPassword"]') as HTMLInputElement).value;
            const confirmNewPassword = (this.changePasswordForm.querySelector('input[name="confirmNewPassword"]') as HTMLInputElement).value;
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
            const roomCode = (this.joinRoomForm.querySelector('input[name="roomCode"]') as HTMLInputElement).value;
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
        
        const videoPlayer = document.getElementById('videoPlayer') as HTMLVideoElement;
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

                } else if (data.type === 'pause') {
                    videoPlayer.pause();
                }
                console.log(`Set playback to ${data.type} - ${data.currentTime}`);
            }
            if (data.type === 'chat' && data.message) {
                this.displayChatMessage(data.message);
            }

          } catch (error) {
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

        const sendPlaybackMessage = (type: string, currentTime: number): void => {
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
            } else {
                drawer.classList.add('hidden');
            }
        });

        const emojiList = document.querySelectorAll('.emoji');
        emojiList.forEach(item => {
            item.addEventListener('click', (event) => {
                const clickedEmoji = (event.target as HTMLElement).innerHTML;
                this.messageInput.value += clickedEmoji;
            });
          });
    }

    private showLoginForm(): void {
        this.loginForm.style.display = 'block';
        this.signupForm.style.display = 'none';
        this.changePasswordForm.style.display = 'none';
    }

    private showSignupForm(): void {
        this.loginForm.style.display = 'none';
        this.signupForm.style.display = 'block';
    }

    private showUserProfile(): void {
        const usernameInput = document.getElementById('username') as HTMLInputElement;
        const emailInput = document.getElementById('email') as HTMLInputElement;
    
        usernameInput.value = this.userManager.getCurrentUser().getUserName;
        emailInput.value = this.userManager.getCurrentUser().getUserEmail;
    
        this.userProfile.style.display = 'block';
        this.loginForm.style.display = 'none';
        this.editUserProfileForm.style.display = 'none';
    }

    private showEditUserProfileForm(): void {
        this.editUserProfileForm.style.display = 'block';
        this.userProfile.style.display = 'none';
    }
    
    private showChangePasswordForm(): void {
        this.changePasswordForm.style.display = 'block';
        this.userProfile.style.display = 'none';
    }
    
    private showCreateRoomForm(): void {
        this.createRoomForm.style.display = 'block';
        this.userProfile.style.display = 'none';
    }
    
    private showJoinRoomForm(): void {
        this.joinRoomForm.style.display = 'block';
        this.userProfile.style.display = 'none';
    }

    private showRoomView(): void {
        const roomCodeElement = document.getElementById('roomCode') as HTMLInputElement;
        roomCodeElement.textContent = this.userManager.getCurrentUser().getCurrentRoomCode;

        this.roomView.style.display = 'block';
        this.createRoomForm.style.display = 'none';
        this.joinRoomForm.style.display = 'none';
    }

    private displayChatMessage(message: string): void {
        const messageElement = document.createElement('div');
        messageElement.textContent = message;
        this.chatBox.appendChild(messageElement);
    }
}

const p = new Program();
console.log('Running program...');
