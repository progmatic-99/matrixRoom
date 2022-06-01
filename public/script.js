const socket = io("/");
let myVideoStream;
const myVideo = document.createElement("video");
const videoGrid = document.getElementById("video-grid");
myVideo.muted = true;

const peer = new Peer();

navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: false,
  })
  .then((stream) => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream);

    peer.on("call", (call) => {
      call.answer(stream);
      const video = document.createElement("video");

      call.on("stream", (userVideoStream) => {
        addVideoStream(video, userVideoStream);
      });
    });

    socket.on("user-connected", (userId) => {
      connectToNewUser(stream, userId);
    });
  });

const addVideoStream = (video, stream) => {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  videoGrid.append(video);
};

const connectToNewUser = (stream, userId) => {
  console.log(`Destination: ${userId}`);
  // Calling peer
  const call = peer.call(userId, stream);
  const video = document.createElement("video");
  console.log("video div created");

  call.on("stream", (userVideoStream) => {
    addVideoStream(video, userVideoStream);
  });
};

peer.on("open", (id) => {
  socket.emit("join-room", ROOM_ID, id);
  console.log(`User id: ${id}`);
});
