import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import ProgressBar from "../components/ProgressBar";
import Timer from "../components/Timer";

export default function Quiz() {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const difficulty = params.get("difficulty") || "easy";
  const amount = params.get("amount") || 5;

  // Decode HTML entities
  const decodeHTML = (str) => {
    const txt = document.createElement("textarea");
    txt.innerHTML = str;
    return txt.value;
  };

  // Fetch questions with fallback
  useEffect(() => {
    async function fetchQuestions() {
      try {
        setLoading(true);

        let res = await axios.get(
          `https://opentdb.com/api.php?amount=${amount}&category=18&difficulty=${difficulty}&type=multiple`
        );

        // fallback if no results
        if (res.data.response_code !== 0 || res.data.results.length === 0) {
          res = await axios.get(
            `https://opentdb.com/api.php?amount=${amount}&category=18&difficulty=${difficulty}`
          );
        }

        const data = res.data.results.map((q) => {
          const options = [...q.incorrect_answers, q.correct_answer];
          options.sort(() => Math.random() - 0.5);
          return {
            question: decodeHTML(q.question),
            correct_answer: decodeHTML(q.correct_answer),
            options: options.map((opt) => decodeHTML(opt)),
          };
        });

        setQuestions(data);
        setAnswers(Array(data.length).fill(null)); // initialize answers
      } catch (error) {
        console.error("Error fetching questions:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchQuestions();
  }, [amount, difficulty]);

  // Handle option selection
  const handleOptionClick = (option) => {
    setSelectedOption(option);
    const updatedAnswers = [...answers];
    updatedAnswers[currentIndex] = {
      question: questions[currentIndex].question,
      selected: option,
      correct: questions[currentIndex].correct_answer,
      isCorrect: option === questions[currentIndex].correct_answer,
    };
    setAnswers(updatedAnswers);
  };

  // Handle Skip (like timeout)
  const handleSkip = () => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentIndex] = {
      question: questions[currentIndex].question,
      selected: "⏭ Skipped",
      correct: questions[currentIndex].correct_answer,
      isCorrect: false,
    };
    setAnswers(updatedAnswers);
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      finishQuiz(updatedAnswers);
    }
  };

  // Handle Next
  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      finishQuiz(answers);
    }
  };

  // Finish Quiz
  const finishQuiz = (finalAnswers) => {
    const finalScore = finalAnswers.filter((a) => a?.isCorrect).length;

    const prevHigh = localStorage.getItem("highScore") || 0;
    if (finalScore > prevHigh) {
      localStorage.setItem("highScore", finalScore);
    }

    navigate("/results", {
      state: {
        score: finalScore,
        total: questions.length,
        answers: finalAnswers,
      },
    });
  };

  // Handle Previous
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  // Auto-timeout
  const handleTimeout = () => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentIndex] = {
      question: questions[currentIndex].question,
      selected: "⏰ Timeout",
      correct: questions[currentIndex].correct_answer,
      isCorrect: false,
    };
    setAnswers(updatedAnswers);
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      finishQuiz(updatedAnswers);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <progress className="progress w-56"></progress>
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="min-h-screen flex items-center justify-center text-base-content">
        <p className="text-xl text-error">No questions found.</p>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className="min-h-screen flex items-center justify-center p-6 text-base-content">
      <div className="card w-full max-w-2xl bg-base-200 shadow-xl">
        <div className="card-body">
          {/* Progress + Timer */}
          <ProgressBar current={currentIndex} total={questions.length} />
          <Timer
            duration={30}
            resetTrigger={currentIndex}
            onTimeout={handleTimeout}
          />

          {/* Question */}
          <h2 className="card-title mb-2 text-lg font-bold">
            Question {currentIndex + 1} of {questions.length}
          </h2>
          <p className="mb-4">{currentQuestion.question}</p>

          {/* Options (2 per row) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            {currentQuestion.options.map((option, i) => (
              <button
                key={i}
                onClick={() => handleOptionClick(option)}
                className={`btn btn-outline w-full ${
                  answers[currentIndex]?.selected === option
                    ? "btn-primary"
                    : ""
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-8">
            {/* Skip */}
            <button
              onClick={handleSkip}
              className="btn bg-gray-400 hover:bg-gray-500 text-white"
            >
              Skip
            </button>

            <div className="flex gap-4">
              {/* Previous */}
              <button
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className={`btn ${
                  currentIndex === 0
                    ? "btn-disabled"
                    : "bg-blue-500 hover:bg-blue-600 text-white"
                }`}
              >
                Previous
              </button>

              {/* Next / Finish */}
              <button
                onClick={handleNext}
                disabled={!answers[currentIndex]}
                className={`btn ${
                  answers[currentIndex]
                    ? "bg-green-500 hover:bg-green-600 text-white"
                    : "btn-disabled"
                }`}
              >
                {currentIndex + 1 === questions.length ? "Finish" : "Next"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
