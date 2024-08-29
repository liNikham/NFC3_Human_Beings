import React, { useState, useRef } from "react";
import Peer from "peerjs";

const VideoCall = () => {
    const [peer, setPeer] = useState(null);
    const [currentPeer, setCurrentPeer] = useState(null);
    const [localStream, setLocalStream] = useState(null);
    const [screenStream, setScreenStream] = useState(null);
    const [screenSharing, setScreenSharing] = useState(false);
    const [notification, setNotification] = useState("");

    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const screenshareVideoRef = useRef(null);
    const localMediaRef = useRef(null);

    const notify = (msg) => {
        setNotification(msg);
        setTimeout(() => setNotification(""), 3000);
    };

    const createRoom = () => {
        const roomId = prompt("Enter Room ID to create:");
        if (!roomId) return alert("Room ID is required");

        const newPeer = new Peer(roomId);
        setPeer(newPeer);

        newPeer.on("open", () => {
            notify("Waiting for peer to join...");
            navigator.mediaDevices.getUserMedia({ video: true, audio: true })
                .then(stream => {
                    setLocalStream(stream);
                    localVideoRef.current.srcObject = stream;
                    localVideoRef.current.play();
                });
        });

        newPeer.on("call", call => {
            call.answer(localStream);
            call.on("stream", stream => {
                remoteVideoRef.current.srcObject = stream;
                remoteVideoRef.current.play();
            });
            setCurrentPeer(call);
        });
    };

    const joinRoom = () => {
        const roomId = prompt("Enter Room ID to join:");
        if (!roomId) return alert("Room ID is required");

        const newPeer = new Peer();
        setPeer(newPeer);

        newPeer.on("open", () => {
            notify("Joining peer...");
            navigator.mediaDevices.getUserMedia({ video: true, audio: false })
                .then(stream => {
                    setLocalStream(stream);
                    localVideoRef.current.srcObject = stream;
                    localVideoRef.current.play();
                    const call = newPeer.call(roomId, stream);
                    call.on("stream", stream => {
                        remoteVideoRef.current.srcObject = stream;
                        remoteVideoRef.current.play();
                    });
                    setCurrentPeer(call);
                });
        });
    };

    const joinRoomWithoutCamShareScreen = () => {
        const roomId = prompt("Enter Room ID to join:");
        if (!roomId) return alert("Room ID is required");

        const newPeer = new Peer();
        setPeer(newPeer);

        newPeer.on("open", () => {
            notify("Joining peer...");
            const createEmptyTrack = () => {
                const ctx = new AudioContext();
                const oscillator = ctx.createOscillator();
                const dst = oscillator.connect(ctx.createMediaStreamDestination());
                oscillator.start();
                return dst.stream.getAudioTracks()[0];
            };
            const fakeStream = new MediaStream([createEmptyTrack(), createEmptyTrack()]);
            const call = newPeer.call(roomId, fakeStream);
            call.on("stream", stream => {
                remoteVideoRef.current.srcObject = stream;
                remoteVideoRef.current.play();
            });
            setCurrentPeer(call);
            startScreenShare();
        });
    };

    const joinRoomShareVideoAsStream = () => {
        const roomId = prompt("Enter Room ID to join:");
        if (!roomId) return alert("Room ID is required");

        const newPeer = new Peer();
        setPeer(newPeer);

        newPeer.on("open", () => {
            notify("Joining peer...");
            const video = localMediaRef.current;
            video.onplay = () => {
                const stream = video.captureStream();
                const call = newPeer.call(roomId, stream);
                call.on("stream", stream => {
                    remoteVideoRef.current.srcObject = stream;
                    remoteVideoRef.current.play();
                });
            };
            video.play();
        });
    };

    const startScreenShare = () => {
        if (screenSharing) return stopScreenSharing();
        navigator.mediaDevices.getDisplayMedia({ video: true }).then(stream => {
            setScreenSharing(true);
            setScreenStream(stream);
            screenshareVideoRef.current.srcObject = stream;
            screenshareVideoRef.current.play();
            const videoTrack = screenStream.getVideoTracks()[0];
            videoTrack.onended = stopScreenSharing;
            if (peer && currentPeer) {
                const sender = currentPeer.peerConnection.getSenders().find(s => s.track.kind === videoTrack.kind);
                sender.replaceTrack(videoTrack);
            }
        });
    };

    const stopScreenSharing = () => {
        if (!screenSharing) return;
        const videoTrack = localStream.getVideoTracks()[0];
        if (peer && currentPeer) {
            const sender = currentPeer.peerConnection.getSenders().find(s => s.track.kind === videoTrack.kind);
            sender.replaceTrack(videoTrack);
        }
        screenStream.getTracks().forEach(track => track.stop());
        setScreenSharing(false);
    };

    return (
        <div className="p-6 text-white">
            <div className="container mx-auto my-8">
                <div className="flex flex-col md:flex-row">
                    <div className="md:w-2/5 p-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Enter Room ID to connect or create
                        </label>
                        <input
                            id="room-input"
                            type="text"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Room ID"
                        />
                        <div className="mt-4 space-x-2">
                            <button
                                className="bg-gray-600 text-white py-2 px-4 rounded"
                                onClick={createRoom}
                            >
                                Create Room
                            </button>
                            <button
                                className="bg-blue-500 text-white py-2 px-4 rounded"
                                onClick={joinRoom}
                            >
                                Join Room
                            </button>
                            <button
                                className="bg-green-500 text-white py-2 px-4 rounded"
                                onClick={joinRoomWithoutCamShareScreen}
                            >
                                Join Room and Share screen directly
                            </button>
                            <button
                                className="bg-black text-white py-2 px-4 rounded"
                                onClick={joinRoomShareVideoAsStream}
                            >
                                Join Room and stream local media
                            </button>
                        </div>
                    </div>
                    <div className="md:w-3/5 p-4">
                        {notification && (
                            <div className="bg-blue-100 border-t border-b border-blue-500 text-blue-700 px-4 py-3" role="alert">
                                <p className="font-bold">Notification</p>
                                <p className="text-sm">{notification}</p>
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex flex-col md:flex-row mt-8">
                    <div className="w-full p-4" hidden={!localStream}>
                        <h2 className="text-xl font-semibold">Local Stream</h2>
                        <video
                            ref={localVideoRef}
                            className="w-full mt-4"
                            controls
                            muted
                        />
                    </div>
                    <div className="w-full p-4" hidden={!screenStream}>
                        <h2 className="text-xl font-semibold">Screen Shared Stream</h2>
                        <video
                            ref={screenshareVideoRef}
                            className="w-full mt-4"
                            controls
                            muted
                        />
                    </div>
                    <div className="w-full p-4" hidden={!currentPeer}>
                        <h2 className="text-xl font-semibold">Remote Stream</h2>
                        <video
                            ref={remoteVideoRef}
                            className="w-full mt-4"
                            controls
                        />
                    </div>
                    <div className="w-full p-4" hidden={!localMediaRef}>
                        <h2 className="text-xl font-semibold">Local video from media</h2>
                        <h6 className="text-sm">On play stream to remote peer</h6>
                        <video
                            ref={localMediaRef}
                            className="w-full mt-4"
                            controls
                            muted
                            src="https://www.radiantmediaplayer.com/media/bbb-360p.mp4"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VideoCall;
