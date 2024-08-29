import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'tailwindcss/tailwind.css'; // Import Tailwind CSS

const ShelterVerify = () => {
    const [shelters, setShelters] = useState([]);

    useEffect(() => {
        const fetchShelters = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/shelters');
                console.log('Fetched shelters:', res.data); // Log the response data
                setShelters(Array.isArray(res.data) ? res.data : []); // Ensure the data is an array
            } catch (err) {
                console.error('Error fetching shelters:', err.response ? err.response.data : err.message);
            }
        };

        fetchShelters();
    }, []);

    const verifyShelter = async (id) => {
        try {
            await axios.patch(`http://localhost:5000/api/shelters/verify/${id}`);
            setShelters(shelters.map(shelter => shelter._id === id ? { ...shelter, isVerified: true } : shelter));
        } catch (err) {
            console.error('Error verifying shelter:', err.response ? err.response.data : err.message);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold text-center mb-4">Admin Dashboard</h1>
            <table className="min-w-full bg-white border border-gray-200">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b text-left">Name</th>
                        <th className="py-2 px-4 border-b text-left">Status</th>
                        <th className="py-2 px-4 border-b text-left">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {shelters.map(shelter => (
                        <tr key={shelter._id} className={shelter.isVerified ? 'bg-green-100' : 'bg-red-100'}>
                            <td className="py-2 px-4 border-b">{shelter.name}</td>
                            <td className="py-2 px-4 border-b">{shelter.isVerified ? 'Verified' : 'Not Verified'}</td>
                            <td className="py-2 px-4 border-b">
                                {!shelter.isVerified && (
                                    <button
                                        onClick={() => verifyShelter(shelter._id)}
                                        className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-700"
                                    >
                                        Verify
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ShelterVerify;
