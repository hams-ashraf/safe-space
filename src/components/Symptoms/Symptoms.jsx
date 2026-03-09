import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const feelings = [
  { label: "Sad", emoji: "😢" },
  { label: "Anxious", emoji: "😰" },
  { label: "Stressed", emoji: "😤" },
  { label: "Overwhelmed", emoji: "😵" },
  { label: "Hopeless", emoji: "😔" },
  { label: "Angry", emoji: "😡" },
  { label: "Lonely", emoji: "🥺" },
  { label: "Worried", emoji: "😟" },
];

const questions = [
  {
    question:
      "Over the past 2 weeks, how often have you felt down, depressed, or hopeless?",
    options: ["Not at all", "Several days", "More than half the days", "Nearly every day"],
  },
  {
    question:
      "How often have you had trouble falling or staying asleep, or sleeping too much?",
    options: ["Not at all", "Several days", "More than half the days", "Nearly every day"],
  },
  {
    question: "Have you experienced any of the following? (Select all that apply)",
    options: ["Loss of interest in activities", "Difficulty concentrating", "Change in appetite", "Feeling of worthlessness"],
    multiple: true,
  },
  {
    question: "How often have you felt nervous, anxious, or on edge?",
    options: ["Not at all", "Several days", "More than half the days", "Nearly every day"],
  },
  {
    question: "Have these feelings interfered with your daily life?",
    options: ["Not at all", "Somewhat", "Moderately", "Severely"],
  },
];

export default function SymptomsChecking() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showFeelings, setShowFeelings] = useState(true);
  const [selectedFeelings, setSelectedFeelings] = useState([]);

  const total = questions.length;
  const steps = total + 1; 
  const mainGreen = "#198754";

  const progress = showFeelings
    ? Math.round((1 / steps) * 100)
    : Math.round(((currentQuestion + 2) / steps) * 100); 

  const handleChange = (option) => {
    if (questions[currentQuestion].multiple) {
      const prev = answers[currentQuestion] || [];
      if (prev.includes(option)) {
        setAnswers({ ...answers, [currentQuestion]: prev.filter((o) => o !== option) });
      } else {
        setAnswers({ ...answers, [currentQuestion]: [...prev, option] });
      }
    } else {
      setAnswers({ ...answers, [currentQuestion]: option });
    }
  };

  const toggleFeeling = (feeling) => {
    setSelectedFeelings((prev) =>
      prev.includes(feeling) ? prev.filter((f) => f !== feeling) : [...prev, feeling]
    );
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
    <div
        style={{
          width: "95vw",
          height: "85vh",
          maxWidth: "1200px",
          padding: 24,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
    >
        {/* Progress bar */}
       <div>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="fw-semibold">
              {showFeelings
                ? "Question 1 of " + steps
                : "Question " + (currentQuestion + 2) + " of " + steps}
            </span>
            <span className="fw-semibold" style={{ color: mainGreen }}>
              {progress}% Complete
            </span>
          </div>

          <div className="progress mb-4" style={{ height: 6 }}>
            <div
              className="progress-bar"
              style={{ width: `${progress}%`, backgroundColor: mainGreen }}
            />
          </div>
        </div>

        {}
        {showFeelings ? (
          <div style={{ flex: 1 }}>
            <h3 className="mb-2 fw-semibold">How are you feeling?</h3>
            <p className="text-muted mb-4">
              Select all the feelings that describe how you've been feeling lately
            </p>

            <div className="row g-3">
              {feelings.map((item, i) => {
                const active = selectedFeelings.includes(item.label);
                return (
                  <div key={i} className="col-6 col-md-3">
                    <div
                      onClick={() => toggleFeeling(item.label)}
                      className="p-3 rounded-4 text-center h-100 d-flex flex-column align-items-center justify-content-center"
                      style={{
                        cursor: "pointer",
                        border: `2px solid ${active ? mainGreen : "#e5e5e5"}`,
                        background: active ? "rgba(47,174,143,0.2)" : "white",
                      }}
                    >
                      <div style={{ fontSize: 32 }}>{item.emoji}</div>
                      <div className="fw-semibold mt-2">{item.label}</div>
                      {active && (
                        <div
                          style={{
                            marginTop: 8,
                            width: 20,
                            height: 20,
                            borderRadius: "50%",
                            background: mainGreen,
                            color: "white",
                            fontSize: 12,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          ✓
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div style={{ flex: 1 }}>
            <h3 className="mb-4 fw-semibold">
              {questions[currentQuestion].question}
            </h3>

            {questions[currentQuestion].options.map((option, index) => {
              const selected = questions[currentQuestion].multiple
                ? (answers[currentQuestion] || []).includes(option)
                : answers[currentQuestion] === option;

              return (
                <label
                  key={index}
                  className="d-flex align-items-center rounded-3 p-3 mb-3 w-100"
                  style={{
                    cursor: "pointer",
                    backgroundColor: selected ? "rgba(47, 174, 143, 0.2)" : "white",
                    border: `2px solid ${selected ? mainGreen : "#d8d8d8"}`,
                    position: "relative",
                  }}
                >
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      border: `2px solid #d8d8d8`,
                      marginRight: 12,
                      backgroundColor: selected ? mainGreen : "white",
                      color: "white",
                      fontSize: 14,
                      fontWeight: "bold",
                    }}
                  >
                    {selected ? "✓" : ""}
                  </span>

                  <span className="fw-medium">{option}</span>

                  <input
                    type={questions[currentQuestion].multiple ? "checkbox" : "radio"}
                    name="option"
                    checked={selected}
                    onChange={() => handleChange(option)}
                    style={{ display: "none" }}
                  />
                </label>
              );
            })}
          </div>
        )}

        {}
        {showFeelings ? (
          <button
            style={{
              width: "100%",
              background: mainGreen,
              border: `1px solid ${mainGreen}`,
              color: "white",
              borderRadius: 10,
              padding: 12,
            }}
            disabled={selectedFeelings.length === 0}
            onClick={() => setShowFeelings(false)}
          >
            Next →
          </button>
        ) : (
          <div className="d-flex justify-content-between">
            <button
              style={{
                width: "30%",
                background: "white",
                border: `1px solid #d8d8d8`,
                borderRadius: 10,
                padding: 12,
                color: "black",
                fontWeight: 600,
                fontSize: 16,
              }}
              onClick={() => {
                if (currentQuestion === 0) {
                  setShowFeelings(true); 
                } else {
                  setCurrentQuestion((p) => p - 1);
                }
              }}
            >
              ← Previous
            </button>
            <button
              style={{
                width: "65%",
                background: mainGreen,
                border: `1px solid ${mainGreen}`,
                color: "white",
                borderRadius: 10,
                padding: 12,
              }}
              disabled={!answers[currentQuestion] || answers[currentQuestion].length === 0}
              onClick={() => setCurrentQuestion((p) => p + 1)}
            >
              Next Question →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}