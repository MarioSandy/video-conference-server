const meetings = {};

const meetingController = (socket) => {
  const createMeeting = () => {
    const { v4: uuidv4 } = require("uuid");
    const meetingId = uuidv4();
    meetings[meetingId] = [];
    console.log("created");
    socket.emit("meeting-created", meetingId);
  };

  const joinMeeting = ({ meeting_id, peer_id, username, video_setting }) => {
    if (meetings[meeting_id]) {
      socket.join(meeting_id);
      meetings[meeting_id].push(peer_id);
      socket.to(meeting_id).emit("user-joined", peer_id);
      socket.to(meeting_id).emit("get-meeting-participants", {
        meeting_id,
        participants: meetings[meeting_id],
      });
      socket.on("disconnect", () => {
        leaveMeeting({ meeting_id, peer_id });
      });
    }
  };

  const askToJoinMeeting = () => {
    socket.broadcast.to(meeting_id);
  };

  const leaveMeeting = ({ meeting_id, peer_id }) => {
    meetings[meeting_id] = meetings[meeting_id].filter(
      (peer) => peer !== peer_id
    );
    socket.leave(meeting_id);
    socket.to(meeting_id).emit("disconnected-participant", peer_id);
  };

  const startShareScreen = ({ meeting_id, peer_id }) => {
    socket.to(meeting_id).emit("start-share-screen-participant", peer_id);
  };

  const stopShareScreen = ({ meeting_id, peer_id }) => {
    socket.to(meeting_id).emit("stop-share-screen-participant", peer_id);
  };

  const changeVideoSetting = ({ meeting_id, peer_id, video_setting }) => {
    socket.to(meeting_id).emit("participant-change-video-setting", {
      peer_id,
      video_setting,
    });
  };

  const sendMessage = ({ meeting_id, message }) => {
    socket.to(meeting_id).emit("get-message", message);
  };

  socket.on("create-meeting", createMeeting);
  socket.on("join-meeting", joinMeeting);
  socket.on("ask-to-join-meeting", askToJoinMeeting);
  socket.on("leave-meeting", leaveMeeting);
  socket.on("start-share-screen", startShareScreen);
  socket.on("stop-share-screen", stopShareScreen);
  socket.on("change-video-setting", changeVideoSetting);
  socket.on("send-message", sendMessage);
};

module.exports = meetingController;
