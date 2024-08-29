import React, { useState } from 'react';

const questions = [
    {
        question: "How often should you take your dog for a walk?",
        options: ["Once a week", "Once a month", "Once a day", "Twice a day"],
        correct: 3
    },
    {
        question: "What is the first thing you should do if your pet is showing signs of illness?",
        options: ["Ignore it and hope it gets better", "Take them to the vet immediately", "Ask a friend for advice", "Give them over-the-counter medicine"],
        correct: 1
    },
    {
        question: "What is the best diet for a cat?",
        options: ["Dry food only", "Wet food only", "A mix of dry and wet food", "Human food"],
        correct: 2
    },
    {
        question: "How often should you clean your pet's living area?",
        options: ["Once a month", "Once a week", "Every day", "Never"],
        correct: 1
    },
    {
        question: "What is the average lifespan of a domestic rabbit?",
        options: ["1-2 years", "3-5 years", "6-8 years", "8-12 years"],
        correct: 3
    }
];

const Questionnaire = () => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState(Array(questions.length).fill(null));
    const [result, setResult] = useState(null);

    const handleOptionChange = (optionIndex) => {
        const newAnswers = [...answers];
        newAnswers[currentQuestionIndex] = optionIndex;
        setAnswers(newAnswers);
    };

    const calculateResult = () => {
        let score = 0;
        answers.forEach((answer, index) => {
            if (answer === questions[index].correct) {
                score += 1;
            }
        });
        setResult(score >= questions.length * 0.8 ? 'Pass' : 'Fail');
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
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md mt-40">
            <h1 className="text-2xl font-bold text-center mb-6">Pet Adoption Eligibility Questionnaire</h1>
            <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">{currentQuestionIndex + 1}. {questions[currentQuestionIndex].question}</h2>
                {questions[currentQuestionIndex].options.map((option, i) => (
                    <div key={i} className="flex items-center mb-2">
                        <input
                            type="radio"
                            id={`q${currentQuestionIndex}o${i}`}
                            name={`question${currentQuestionIndex}`}
                            value={i}
                            checked={answers[currentQuestionIndex] === i}
                            onChange={() => handleOptionChange(i)}
                            className="mr-2"
                        />
                        <label htmlFor={`q${currentQuestionIndex}o${i}`} className="text-gray-700">{option}</label>
                    </div>
                ))}
            </div>
            <div className="flex justify-between">
                <button
                    onClick={handlePrevious}
                    disabled={currentQuestionIndex === 0}
                    className="py-2 px-4 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-700 disabled:opacity-50"
                >
                    Previous
                </button>
                {currentQuestionIndex < questions.length - 1 ? (
                    <button
                        onClick={handleNext}
                        className="py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-700"
                    >
                        Next
                    </button>
                ) : (
                    <button
                        onClick={calculateResult}
                        className="py-2 px-4 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-700"
                    >
                        Submit
                    </button>
                )}
            </div>
            {result && <h2 className="text-xl font-bold text-center mt-6">You {result} the questionnaire!</h2>}
        </div>
    );
};

export default Questionnaire;
