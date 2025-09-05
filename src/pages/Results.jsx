import { useLocation, useNavigate } from "react-router-dom";

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();

  // If state is empty  page refresh, fall back
  const { score = 0, total = 0, answers = [] } = location.state || {};
  const highScore = localStorage.getItem("highScore") || 0;

  return (
    <div className="min-h-screen flex items-center justify-center p-6 text-base-content">
      <div className="w-full max-w-2xl card bg-base-200 shadow-xl">
        <div className="card-body">
          {/* Results Summary */}
          <h2 className="card-title text-2xl mb-2">Results</h2>
          <p className="mb-2">
            ✅ You scored{" "}
            <span className="font-bold text-success">{score}</span> / {total}
          </p>
          <p className="mb-4">🏆 High Score: {highScore}</p>

          {/* Scrollable answers list */}
          <div className="overflow-y-auto max-h-80 pr-2">
            <ul className="space-y-3">
              {answers.map((a, i) => (
                <li
                  key={i}
                  className={`p-3 rounded-lg ${
                    a.isCorrect ? "bg-success/20" : "bg-error/20"
                  }`}
                >
                  <p className="font-medium">{i + 1}. {a.question}</p>
                  <p className="text-sm">
                    Your answer:{" "}
                    <span
                      className={
                        a.isCorrect
                          ? "text-success font-medium"
                          : "text-error font-medium"
                      }
                    >
                      {a.selected}
                    </span>
                  </p>
                  {!a.isCorrect && (
                    <p className="text-sm text-success">
                      Correct answer: {a.correct}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Restart button */}
          <div className="card-actions justify-center mt-6">
            <button
              className="btn btn-primary"
              onClick={() => navigate("/")}
            >
              Play Again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
