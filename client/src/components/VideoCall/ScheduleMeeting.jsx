import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthProvider";

const ScheduleMeeting = () => {
    const [meetingTime, setMeetingTime] = useState("");
    const history = useHistory();
    const { user } = useContext(AuthContext); // Get the authenticated user

    const handleSchedule = async () => {
        const roomId = generateRoomId(); // Generate a unique room ID
        await axios.post("/schedule-meeting", {
            userEmail: user.email, // Use the authenticated user's email
            shelterEmail: "shelter@example.com",
            meetingTime,
            roomId,
        });
        history.push(`/video-call/${roomId}`);
    };

    const generateRoomId = () => {
        return Math.random().toString(36).substring(2, 15);
    };

    return (
        <div>
            <h1>Schedule Meeting</h1>
            <input
                type="datetime-local"
                value={meetingTime}
                onChange={(e) => setMeetingTime(e.target.value)}
            />
            <button onClick={handleSchedule}>Schedule</button>
        </div>
    );
};

export default ScheduleMeeting;
