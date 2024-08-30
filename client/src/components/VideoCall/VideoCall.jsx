import React, { useState, useRef, useEffect } from "react";
import Peer from "peerjs";
import { useParams, useNavigate } from "react-router-dom";

const VideoCall = () => {
    const { roomId: urlRoomId } = useParams();
    const navigate = useNavigate();
    const [peer, setPeer] = useState(null);
    const [currentPeer, setCurrentPeer] = useState(null);
    const [localStream, setLocalStream] = useState(null);
    const [screenStream, setScreenStream] = useState(null);
    const [screenSharing, setScreenSharing] = useState(false);
    const [notification, setNotification] = useState("");
    const [roomId, setRoomId] = useState(urlRoomId || "");

    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const screenshareVideoRef = useRef(null);
    const localMediaRef = useRef(null);

    useEffect(() => {
        if (urlRoomId) {
            joinRoom(urlRoomId);
        } else {
            createRoom();
        }
    }, [urlRoomId]);

    const notify = (msg) => {
        setNotification(msg);
        setTimeout(() => setNotification(""), 3000);
    };

    const createRoom = () => {
        const newRoomId = Math.random().toString(36).substring(2, 15);
        setRoomId(newRoomId);

        const newPeer = new Peer(newRoomId);
        setPeer(newPeer);

        newPeer.on("open", () => {
            notify("Waiting for peer to join...");
            navigator.mediaDevices.getUserMedia({ video: true, audio: true })
                .then(stream => {
                    setLocalStream(stream);
                    localVideoRef.current.srcObject = stream;
                    localVideoRef.current.play();
                })
                .catch(error => {
                    console.error("Error accessing media devices.", error);
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

    const joinRoom = (roomId) => {
        const newPeer = new Peer();
        setPeer(newPeer);

        newPeer.on("open", () => {
            notify("Joining peer...");
            navigator.mediaDevices.getUserMedia({ video: true, audio: true })
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
                })
                .catch(error => {
                    console.error("Error accessing media devices.", error);
                });
        });
    };

    const startScreenShare = () => {
        if (screenSharing) return stopScreenSharing();
        navigator.mediaDevices.getDisplayMedia({ video: true }).then(stream => {
            setScreenSharing(true);
            setScreenStream(stream);
            screenshareVideoRef.current.srcObject = stream;
            screenshareVideoRef.current.play();
            const videoTrack = stream.getVideoTracks()[0];
            videoTrack.onended = stopScreenSharing;
            if (peer && currentPeer) {
                const sender = currentPeer.peerConnection.getSenders().find(s => s.track.kind === videoTrack.kind);
                sender.replaceTrack(videoTrack);
            }
        }).catch(error => {
            console.error("Error accessing display media.", error);
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
    const url = `http://localhost:5173/videocall/${roomId}`;

    return (
        <div className="min-h-screen bg-gray-100 p-6 text-black flex flex-col items-center justify-center">
            <div className="container mx-auto">
                <div className="text-center mb-6">
                    <h2 className="text-xl font-semibold">Room ID: {roomId}</h2>
                    <p>Share this Room ID with the person you want to connect with.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Enter Room ID to connect or create
                        </label>

                        <input
                            id="room-input"
                            type="text"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Room ID"
                            value={url}
                            readOnly
                        />
                        <div className="mt-4 space-y-2 md:space-y-0 md:space-x-2">
                            <button
                                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300 w-full md:w-auto"
                                onClick={() => navigate(`/videocall/${roomId}`)}
                            >
                                Join Room
                            </button>
                            <button
                                className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition duration-300 w-full md:w-auto"
                                onClick={startScreenShare}
                            >
                                Share Screen
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                    <div hidden={!localStream}>
                        <h2 className="text-xl font-semibold">Local Stream</h2>
                        <video ref={localVideoRef} className="w-full mt-4 rounded shadow-lg" controls muted />
                    </div>
                    <div hidden={!screenStream}>
                        <h2 className="text-xl font-semibold">Screen Shared Stream</h2>
                        <video ref={screenshareVideoRef} className="w-full mt-4 rounded shadow-lg" controls muted />
                    </div>
                    <div hidden={!currentPeer}>
                        <h2 className="text-xl font-semibold">Remote Stream</h2>
                        <video ref={remoteVideoRef} className="w-full mt-4 rounded shadow-lg" controls />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VideoCall;
