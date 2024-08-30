import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const PetAdoptionQuiz = () => {
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState({});
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
    axios.post('/api/submit-responses', { responses, token })
      .then(response => alert('Responses submitted successfully.'))
      .catch(error => console.error('Error submitting responses:', error));
  };

  return (
    <div>
      <h1>Questionnaire</h1>
      <p>Time Left: {Math.floor(timeLeft / 60)}:{timeLeft % 60}</p>
      {questions.map(question => (
        <div key={question._id}>
          <p>{question.text}</p>
          {question.choices.map(choice => (
            <div key={choice}>
              <input
                type="radio"
                name={question._id}
                value={choice}
                onChange={() => handleChange(question._id, choice)}
              />
              <label>{choice}</label>
            </div>
          ))}
        </div>
      ))}
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default PetAdoptionQuiz;
