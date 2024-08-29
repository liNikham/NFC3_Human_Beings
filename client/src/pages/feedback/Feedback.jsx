import React, { useState } from 'react';
import Container from '../../components/shared/Container';

function Feedback() {
    const [comments, setComments] = useState('');
    const [rating, setRating] = useState(0);

    const handleSubmit = async(e) => {
        e.preventDefault();
        const feedbackData = {
            comments,
            rating,
        };
        if(rating){
            try {
                await axios.post('https://your-api-endpoint.com/feedback', feedbackData);
                alert('Feedback submitted successfully!');
            } catch (error) {
                console.error('Error submitting feedback:', error);
            }
        }
        console.log(feedbackData);
        alert('Feedback submitted successfully!');
    };

    const handleRating = (value) => {
        setRating(value);
    };

    return (

        <div className="bg-black/50 text-white p-3 w-2/5 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-center mb-6">Feedback</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="comments" className="block text-sm font-bold mb-2">Comments:</label>
                    <textarea
                        id="comments"
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                        rows="4"
                        required
                        className="w-full p-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2">Rating:</label>
                    <div className="text-3xl">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <span
                                key={star}
                                onClick={() => handleRating(star)}
                                className={`cursor-pointer ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                            >
                                ★
                            </span>
                        ))}
                    </div>
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 text-white py-2 px-4 rounded-md w-full font-semibold hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Submit
                </button>
            </form>
        </div>
    );
}

export default Feedback;
