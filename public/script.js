const socket = io("/");
let myVideoStream;
const myVideo = document.createElement("video");
const videoGrid = document.getElementById("video-grid");
myVideo.muted = true;

const addVideoStream = (video, stream) => {
  video.srcObject = stream;
  video.addEventListener("loadmetadata", () => {
    video.play();
  });
  videoGrid.append(video);
};

const connectToNewUser = () => {
  console.log("new user");
};

socket.emit("join-room", ROOM_ID);
socket.on("user-connected", () => {
  connectToNewUser();
});

navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true,
  })
  .then((stream) => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream);
  });
