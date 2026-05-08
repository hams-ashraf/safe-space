
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./symptoms.css";
import { generateQuestionApi, analyzeSymptomsApi } from "../../api/symptomsApi";

const feelingsList = [
  { label: "Sad", emoji: "😢" },
  { label: "Anxious", emoji: "😰" },
  { label: "Stressed", emoji: "😤" },
  { label: "Overwhelmed", emoji: "😵" },
  { label: "Hopeless", emoji: "😔" },
  { label: "Angry", emoji: "😡" },
  { label: "Lonely", emoji: "🥺" },
  { label: "Worried", emoji: "😟" },
];

export default function SymptomsChecking() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showFeelings, setShowFeelings] = useState(true);
  const [selectedFeelings, setSelectedFeelings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const totalSteps = questions.length + 1; 
  const currentStep = showFeelings ? 0 : currentQuestion + 1;
  const progress = Math.round((currentStep / totalSteps) * 100);

  const toggleFeeling = (feeling) => {
    setSelectedFeelings((prev) =>
      prev.includes(feeling) ? prev.filter((f) => f !== feeling) : [...prev, feeling]
    );
  };

  const handleStartQuestions = async () => {
    setLoading(true);
    try {
      const response = await generateQuestionApi(selectedFeelings);

      let rawData = response.data;
      if (typeof rawData === "string") {
        rawData = JSON.parse(rawData);
      }

      const formattedQuestions = rawData.map((qText) => ({
        question: qText,
        options: ["Yes", "No"],
        multiple: false,
      }));

      setQuestions(formattedQuestions);
      setShowFeelings(false);
      setCurrentQuestion(0); 
    } catch (error) {
      console.error("Error:", error);
      const status = error.response?.status;
      if (status === 429 || status === 503) {
        alert("AI limit expired or busy. Try again in 1 minute.");
      } else {
        alert("Error loading questions. Check server connection.");
      }
    } finally {
      setLoading(false);
    }
  };


  const handleFinalSubmit = async () => {
    setLoading(true);
    try {
      const analysisArray = questions.map((q, index) => {
        const answer = answers[index] || "No answer";
        return `${q.question}: ${answer}`;
      });

      const response = await analyzeSymptomsApi({
        mood: selectedFeelings,   
        analyze: analysisArray,   
      });

      let finalResult = response.data;
      if (typeof finalResult === "string") {
        finalResult = JSON.parse(finalResult);
      }
      setResult(finalResult);
    } catch (error) {
      console.error("Analysis Error:", error.response?.data || error.message);
      alert("Error loading analysis. Check server format.");
    } finally {
      setLoading(false);
    }
  };
  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((p) => p + 1);
    } else {
      handleFinalSubmit();
    }
  };
//Anylsis screen
  if (result) {
    return (
      <div className="detection-overlay">
        <div className="detection-container text-center">
          <h2 className="mb-4 fw-bold text-success">SafeSpace Analysis</h2>
          <div className="p-4 rounded-4 shadow-sm bg-white border text-start">
            <h4 className="fw-bold">{result.condition || "Analysis Result"}</h4>
            <div className={`badge p-2 mb-3 ${result.severity === 'Severe' ? 'bg-danger' : 'bg-warning text-dark'}`}>
              {result.severity}
            </div>
            <p className="fs-6 text-muted">{result.message}</p>
          </div>
          <button className="btn-detection btn-green mt-4" onClick={() => window.location.reload()}>
            New Test
          </button>
        </div>
      </div>
    );
  }
//Felling screen
  return (
    <div className="detection-overlay">
      <div className="detection-container">
        <div>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="fw-semibold">
              {showFeelings ? "Initial Step" : `Question ${currentQuestion + 1} of ${questions.length}`}
            </span>
            <span className="fw-semibold text-main-green">{progress}%</span>
          </div>
          <div className="progress progress-container">
            <div 
              className="progress-bar custom-progress-bar" 
              style={{ width: `${progress}%`, transition: "width 0.4s ease" }} 
            />
          </div>
        </div>

        {showFeelings ? (
          <div className="flex-grow-1">
            <h3 className="mb-2 fw-semibold">How are you feeling?</h3>
            <p className="text-muted mb-4">Select your current moods</p>
            <div className="row g-3">
              {feelingsList.map((item, i) => (
                <div key={i} className="col-6 col-md-3">
                  <div
                    onClick={() => toggleFeeling(item.label)}
                    className={`feeling-card ${selectedFeelings.includes(item.label) ? "active" : ""}`}
                  >
                    <div className="emoji-text">{item.emoji}</div>
                    <div className="fw-semibold mt-2">{item.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex-grow-1">
            {questions.length > 0 ? (
              <>
                <h3 className="mb-4 fw-semibold">{questions[currentQuestion]?.question}</h3>
                {questions[currentQuestion]?.options?.map((option, index) => (
                  <label key={index} className={`option-label ${answers[currentQuestion] === option ? "selected" : ""}`}>
                    <span className="radio-check-circle">{answers[currentQuestion] === option ? "✓" : ""}</span>
                    <span className="fw-medium">{option}</span>
                    <input
                      type="radio"
                      className="d-none"
                      name="opt"
                      checked={answers[currentQuestion] === option}
                      onChange={() => setAnswers({ ...answers, [currentQuestion]: option })}
                    />
                  </label>
                ))}
              </>
            ) : (
              <div className="text-center p-5">
                <div className="spinner-border text-success" />
                <p className="mt-3">Consulting SafeSpace AI...</p>
              </div>
            )}
          </div>
        )}

        <div className="mt-4">
          {showFeelings ? (
            <button
              className="btn-detection btn-green"
              disabled={selectedFeelings.length === 0 || loading}
              onClick={handleStartQuestions}
            >
              {loading ? "Generating..." : "Next →"}
            </button>
          ) : (
            <div className="d-flex justify-content-between">
              <button 
                className="btn-detection btn-prev" 
                disabled={loading} 
                onClick={() => currentQuestion === 0 ? setShowFeelings(true) : setCurrentQuestion(p => p - 1)}
              >
                ← Back
              </button>
              <button 
                className="btn-detection btn-next-step" 
                disabled={loading || !answers[currentQuestion]} 
                onClick={handleNext}
              >
                {loading ? "Analyzing..." : (currentQuestion === questions.length - 1 ? "Finish" : "Next →")}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}