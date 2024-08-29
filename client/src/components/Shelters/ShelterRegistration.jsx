import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const ShelterRegistration = () => {
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        phone: '',
        email: '',
        password: '',
    });

    const { name, address, phone, email, password } = formData;

    const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log('Submitting form data:', formData);
            const res = await axios.post('http://localhost:5000/api/shelters/register', formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            console.log('Response data:', res.data);

            // Show success alert
            Swal.fire({
                icon: 'success',
                title: 'Registration Successful',
                text: 'Your shelter has been registered successfully!',
                confirmButtonText: 'OK'
            });

            // Reset form data after successful registration
            setFormData({
                name: '',
                address: '',
                phone: '',
                email: '',
                password: '',
            });

        } catch (err) {
            if (err.response) {
                console.error('Error response data:', err.response.data);
                console.error('Error response status:', err.response.status);
                console.error('Error response headers:', err.response.headers);
            } else if (err.request) {
                console.error('Error request:', err.request);
            } else {
                console.error('Error message:', err.message);
            }
            console.error('Error config:', err.config);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Shelter Registration</h2>
                <form onSubmit={onSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="name"
                        value={name}
                        onChange={onChange}
                        placeholder="Name"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="text"
                        name="address"
                        value={address}
                        onChange={onChange}
                        placeholder="Address"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="text"
                        name="phone"
                        value={phone}
                        onChange={onChange}
                        placeholder="Phone"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="email"
                        name="email"
                        value={email}
                        onChange={onChange}
                        placeholder="Email"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="password"
                        name="password"
                        value={password}
                        onChange={onChange}
                        placeholder="Password"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200"
                    >
                        Register
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ShelterRegistration;
