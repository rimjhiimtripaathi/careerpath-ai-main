import React, { useState } from "react";
import "./QuestionRenderer.css";

const QuestionRenderer = ({ question, onAnswer, currentAnswer }) => {
  const [selectedOption, setSelectedOption] = useState(currentAnswer || "");

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    onAnswer(option);
  };

  const renderMultipleChoice = () => {
    return (
      <div className="options-grid">
        {question.options.map((option, index) => (
          <button
            key={index}
            className={`option-btn ${
              selectedOption === option ? "selected" : ""
            }`}
            onClick={() => handleOptionSelect(option)}
          >
            {option}
          </button>
        ))}
      </div>
    );
  };

  const renderLikertScale = () => {
    const labels = question.options || [
      "Strongly Disagree",
      "Disagree",
      "Neutral",
      "Agree",
      "Strongly Agree",
    ];

    return (
      <div className="likert-scale">
        <div className="scale-labels">
          {labels.map((label, index) => (
            <div key={index} className="scale-label">
              {label}
            </div>
          ))}
        </div>
        <div className="scale-options">
          {labels.map((label, index) => (
            <button
              key={index}
              className={`scale-option ${
                selectedOption === label ? "selected" : ""
              }`}
              onClick={() => handleOptionSelect(label)}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderTextInput = () => {
    return (
      <div className="text-input-container">
        <textarea
          value={selectedOption}
          onChange={(e) => {
            setSelectedOption(e.target.value);
            onAnswer(e.target.value);
          }}
          placeholder="Type your answer here..."
          rows={6}
          className="text-answer-input"
        />
      </div>
    );
  };

  const getQuestionRenderer = () => {
    switch (question.question_type) {
      case "multiple_choice":
        return renderMultipleChoice();
      case "likert_scale":
        return renderLikertScale();
      case "text":
        return renderTextInput();
      default:
        return renderMultipleChoice();
    }
  };

  return (
    <div className="question-renderer">
      <div className="question-header">
        <h2>Question {question.order_index}</h2>
        <div className="question-points">Points: {question.points}</div>
      </div>

      <div className="question-text">{question.question_text}</div>

      <div className="question-options">{getQuestionRenderer()}</div>

      {selectedOption && (
        <div className="selected-answer">
          <strong>Your answer:</strong> {selectedOption}
        </div>
      )}
    </div>
  );
};

export default QuestionRenderer;
