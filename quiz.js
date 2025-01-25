import React, { useState, useEffect } from "react";

const WebDevQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [timer, setTimer] = useState(30);
  const [selectedOption, setSelectedOption] = useState(null);
  const [gameState, setGameState] = useState("start");
  const [userData, setUserData] = useState({ name: "", email: "", image: null, imagePreview: "" });
  const [isFormValid, setIsFormValid] = useState(true);

  const quizData = [
    {
      question: "What does HTML stand for?",
      options: [
        "Hyper Text Markup Language",
        "High Tech Modern Language",
        "Hyper Transfer Markup Language",
        "Home Tool Markup Language",
      ],
      correctAnswer: 0,
    },
    {
      question: "Which tag is used to create a hyperlink in HTML?",
      options: ["<link>", "<href>", "<a>", "<url>"],
      correctAnswer: 2,
    },
    {
      question: "What does CSS stand for?",
      options: ["Cascading Style Sheets", "Computer Style System", "Creative Style Sheets", "Coding Style Sheets"],
      correctAnswer: 0,
    },
    {
      question: "Which CSS property is used to change text color?",
      options: ["text-color", "color", "font-color", "text-style"],
      correctAnswer: 1,
    },
    {
      question: "In JavaScript, which operator is used for strict equality comparison?",
      options: ["==", "=", "===", "!="],
      correctAnswer: 2,
    },
  ];

  useEffect(() => {
    let interval;
    if (gameState === "playing" && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0 && gameState === "playing") {
      handleNextQuestion();
    }
    return () => clearInterval(interval);
  }, [timer, gameState]);

  const handleFormChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      const file = files[0];
      if (file) {
        const imagePreviewURL = URL.createObjectURL(file);
        setUserData((prev) => ({ ...prev, image: file, imagePreview: imagePreviewURL }));
      }
    } else {
      setUserData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValidName = userData.name.trim() !== "";
    const isValidEmail = emailRegex.test(userData.email);
    const isImageUploaded = userData.image !== null;

    return isValidName && isValidEmail && isImageUploaded;
  };

  const startQuiz = () => {
    if (validateForm()) {
      setIsFormValid(true);
      setGameState("playing");
      setTimer(30);
      setScore(0);
      setCurrentQuestion(0);
      setSelectedOption(null);
      setShowScore(false);
    } else {
      setIsFormValid(false);
    }
  };

  const handleOptionClick = (optionIndex) => {
    if (selectedOption === null) {
      setSelectedOption(optionIndex);
      if (optionIndex === quizData[currentQuestion].correctAnswer) {
        setScore((prev) => prev + 1);
      }
    }
  };

  const handleNextQuestion = () => {
    setTimer(30);
    setSelectedOption(null);

    if (currentQuestion === quizData.length - 1) {
      setShowScore(true);
      setGameState("ended");
    } else {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const renderStartScreen = () => (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Web Development Quiz</h1>
          <p className="text-gray-600 mb-6">Please enter your details to begin the quiz.</p>
          <form className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={userData.name}
              onChange={handleFormChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={userData.email}
              onChange={handleFormChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleFormChange}
              className="w-full p-3 border border-gray-300 rounded-lg bg-white"
            />
          </form>
          {!isFormValid && (
            <p className="text-red-500 mt-2">Please fill all fields correctly (valid email & image required).</p>
          )}
          <button
            onClick={startQuiz}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:opacity-90 transition-opacity mt-6"
          >
            Start Quiz
          </button>
        </div>
      </div>
    </div>
  );

  const renderScoreScreen = () => {
    const percentage = (score / quizData.length) * 100;
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-lg text-center">
          {userData.imagePreview && (
            <img
              src={userData.imagePreview}
              alt="Profile"
              className="w-24 h-24 rounded-full mx-auto mb-4"
            />
          )}
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{userData.name}</h2>
          <p className="text-gray-600 mb-6">{userData.email}</p>
          <div className="text-6xl mb-4">
            {percentage === 100 ? "🏆" : percentage >= 70 ? "🌟" : percentage >= 50 ? "👍" : "💪"}
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Quiz Complete!</h2>
          <p className="text-xl text-blue-600 mb-4">
            Your score: {score} out of {quizData.length}
          </p>
          <button
            onClick={() => setGameState("start")}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-full font-semibold hover:opacity-90 transition-opacity inline-flex items-center"
          >
            <span className="mr-2">↺</span> Restart Quiz
          </button>
        </div>
      </div>
    );
  };

  const renderQuizScreen = () => (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <div className="text-blue-600 font-semibold">
            Question {currentQuestion + 1}/{quizData.length}
          </div>
          <div className="bg-gray-100 px-4 py-2 rounded-full flex items-center">
            <span className="mr-2">⏱️</span>
            {timer}s
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-lg text-gray-800 mb-6">{quizData[currentQuestion].question}</h2>
          <div className="space-y-3">
            {quizData[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleOptionClick(index)}
                disabled={selectedOption !== null}
                className={`w-full text-left p-4 rounded-lg transition-all ${
                  selectedOption === null
                    ? "bg-gray-100 hover:bg-gray-200"
                    : selectedOption === index
                    ? index === quizData[currentQuestion].correctAnswer
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white"
                    : index === quizData[currentQuestion].correctAnswer
                    ? "bg-green-500 text-white"
                    : "bg-gray-100 opacity-50"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="flex space-x-4">
          {!selectedOption && (
            <button
              onClick={handleNextQuestion}
              className="w-full bg-gray-300 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-400 transition-opacity"
            >
              Skip
            </button>
          )}
          {selectedOption !== null && (
            <button
              onClick={handleNextQuestion}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              {currentQuestion === quizData.length - 1 ? "Finish Quiz" : "Next Question"}
            </button>
          )}
        </div>
      </div>
    </div>
  );

  if (gameState === "start") {
    return renderStartScreen();
  }

  if (showScore) {
    return renderScoreScreen();
  }

  return renderQuizScreen();
};

export default WebDevQuiz;
