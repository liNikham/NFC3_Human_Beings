import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, BarElement } from 'chart.js';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Register ChartJS components
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, BarElement);

const Reports = () => {
    const [feedback, setFeedback] = useState([]);
    const [feedbackCount, setFeedbackCount] = useState(0);
    const [adoptionData, setAdoptionData] = useState({ dogs: 0, cats: 0, others: 0 });

    // Fetch pet count data
    const fetchPetCount = async () => {
        try {
            const categories = ['Dog', 'Cat', 'Other'];
            const counts = await Promise.all(
                categories.map(async (category) => {
                    const response = await axios.get(`http://localhost:5000/api/petCount/${category}`);
                    return response.data.result;
                })
            );

            setAdoptionData({
                dogs: counts[0],
                cats: counts[1],
                others: counts[2]
            });
        } catch (error) {
            console.error('Error fetching pet count:', error);
        }
    };

    useEffect(() => {
        // Fetch feedback data
        const fetchFeedback = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/feedback');
                setFeedback(response.data);
                setFeedbackCount(response.data.length);
            } catch (error) {
                console.error('Error fetching feedback:', error);
            }
        };

        fetchFeedback();
        fetchPetCount();
    }, []);

    // Chart data
    const adoptionChartData = {
        labels: ['Dogs', 'Cats', 'Others'],
        datasets: [{
            data: [adoptionData.dogs, adoptionData.cats, adoptionData.others],
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        }]
    };

    const eventChartData = {
        labels: ['Event A', 'Event B', 'Event C'],
        datasets: [{
            data: [75, 50, 25],
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        }]
    };

    const shelterChartData = {
        labels: ['Shelter 1', 'Shelter 2', 'Shelter 3'],
        datasets: [{
            label: 'Shelter Performance',
            data: [100, 60, 90],
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        }]
    };

    // Function to generate PDF
    const generatePDF = () => {
        const input = document.getElementById('charts-container');
        html2canvas(input).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF();
            const imgWidth = 190;
            const pageHeight = 295; // A4 page height in mm
            const imgHeight = canvas.height * imgWidth / canvas.width;
            let heightLeft = imgHeight;

            let position = 0;
            pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            pdf.save('charts.pdf');
        });
    };

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <div className="flex justify-end mb-4">
                <button
                    onClick={generatePDF}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600"
                >
                    Export as PDF
                </button>
            </div>

            <h1 className="text-3xl font-bold mb-8 text-center">Reports and Analytics</h1>

            <div id="charts-container" className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-gray-50 p-4 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4">Adoption Reports</h2>
                        <div className="w-full h-64">
                            <Pie data={adoptionChartData} options={{ responsive: true, maintainAspectRatio: false }} />
                        </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4">Event Reports</h2>
                        <div className="w-full h-64">
                            <Bar data={eventChartData} options={{ responsive: true, maintainAspectRatio: false, indexAxis: 'x' }} />
                        </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4">Shelter Performance</h2>
                        <div className="w-full h-64">
                            <Bar data={shelterChartData} options={{ responsive: true, maintainAspectRatio: false, indexAxis: 'x' }} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto bg-white p-6 mt-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold mb-4">User Feedback</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-4 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold mb-2">Comments</h3>
                        <div className="divide-y divide-gray-300">
                            {feedback.map((item) => (
                                <div key={item._id} className="py-2">
                                    <p className="text-sm">{item.comments}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold mb-2">Number of Users</h3>
                        <p className="text-xl font-bold">{feedbackCount}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports;
