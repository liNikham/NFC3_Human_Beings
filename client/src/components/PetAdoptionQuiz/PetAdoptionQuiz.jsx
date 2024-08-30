import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import 'tailwindcss/tailwind.css';

const PetAdoptionQuiz = () => {
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const location = useLocation();
  const token = new URLSearchParams(location.search).get('token');

  useEffect(() => {
    axios.get(`http://localhost:5000/api/questionnaire?token=${token}`)
      .then(response => setQuestions(response.data))
      .catch(error => console.error('Error fetching questions:', error));

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [token]);

  const handleChange = (questionId, answer) => {
    setResponses(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = () => {
    axios.post('http://localhost:5000/api/submit-responses', { responses, token })
      .then(response => Swal.fire('Success', 'Responses submitted successfully.', 'success'))
      .catch(error => Swal.fire('Error', 'Error submitting responses.', 'error'));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  return (
    <div className="container mx-auto p-4 bg-white ">
      <h1 className="text-2xl font-bold mb-4">Questionnaire</h1>
      <p className="mb-4">Time Left: {Math.floor(timeLeft / 60)}:{timeLeft % 60}</p>
      {questions.length > 0 && (
        <div className="mb-4">
          <p className="text-xl mb-2">{questions[currentQuestionIndex].text}</p>
          {questions[currentQuestionIndex].choices.map(choice => (
            <div key={choice} className="mb-2">
              <input
                type="radio"
                name={questions[currentQuestionIndex]._id}
                value={choice}
                onChange={() => handleChange(questions[currentQuestionIndex]._id, choice)}
                className="mr-2"
              />
              <label>{choice}</label>
            </div>
          ))}
        </div>
      )}
      <div className="flex justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Previous
        </button>
        {currentQuestionIndex < questions.length - 1 ? (
          <button
            onClick={handleNext}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Submit
          </button>
        )}
      </div>
    </div>
  );
};

export default PetAdoptionQuiz;
