// src/components/Map.js
import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import axios from 'axios';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const Map = () => {
    const [clinics, setClinics] = useState([]);
    const [selectedClinic, setSelectedClinic] = useState(null);
    const [currentLocation, setCurrentLocation] = useState({ lat: 0, lng: 0 });
    const [date, setDate] = useState(new Date());

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                const { latitude, longitude } = position.coords;
                setCurrentLocation({ lat: latitude, lng: longitude });

                axios.get(`/api/clinics?lat=${latitude}&lng=${longitude}`)
                    .then(response => setClinics(response.data))
                    .catch(error => console.error('Error fetching clinics:', error));
            }, error => {
                console.error('Error getting location:', error);
            });
        } else {
            console.error('Geolocation is not supported by this browser.');
        }
    }, []);

    const mapStyles = {
        height: "100vh",
        width: "100%"
    };

    const bookAppointment = (clinic) => {
        axios.post('/api/book-appointment', {
            clinicId: clinic.id,
            date: date.toISOString()
        })
            .then(response => {
                alert(`Appointment booked at ${clinic.name} on ${date.toDateString()}`);
            })
            .catch(error => {
                console.error('Error booking appointment:', error);
            });
    };

    return (
        <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
            <GoogleMap
                mapContainerStyle={mapStyles}
                zoom={13}
                center={currentLocation}
            >
                {clinics.map(clinic => (
                    <Marker
                        key={clinic.id}
                        position={{ lat: clinic.latitude, lng: clinic.longitude }}
                        onClick={() => setSelectedClinic(clinic)}
                    />
                ))}

                {selectedClinic && (
                    <InfoWindow
                        position={{ lat: selectedClinic.latitude, lng: selectedClinic.longitude }}
                        onCloseClick={() => setSelectedClinic(null)}
                    >
                        <div>
                            <h2>{selectedClinic.name}</h2>
                            <p>{selectedClinic.address}</p>
                            <Calendar
                                onChange={setDate}
                                value={date}
                            />
                            <button onClick={() => bookAppointment(selectedClinic)}>Book Appointment</button>
                        </div>
                    </InfoWindow>
                )}
            </GoogleMap>
        </LoadScript>
    );
};

export default Map;
