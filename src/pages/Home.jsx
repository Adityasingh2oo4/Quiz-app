import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-6 text-base-content">
      <div className="card w-full max-w-md bg-base-200 shadow-xl">
        <div className="card-body items-center text-center">
          <h1 className="card-title text-3xl font-bold">Quiz Master</h1>
          <p className="mb-6">Test your knowledge by choosing a difficulty:</p>

          <div className="flex flex-col gap-4 w-full">
            <button
              className="btn btn-primary w-full"
              onClick={() => navigate("/quiz?difficulty=easy&amount=5")}
            >
              Easy
            </button>
            <button
              className="btn btn-secondary w-full"
              onClick={() => navigate("/quiz?difficulty=medium&amount=5")}
            >
              Medium
            </button>
            <button
              className="btn btn-accent w-full"
              onClick={() => navigate("/quiz?difficulty=hard&amount=5")}
            >
              Hard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
