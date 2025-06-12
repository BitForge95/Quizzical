import React, { useState, useEffect, useMemo } from "react";
import { decode } from "html-entities";
import Confetti from 'react-confetti'


export default function Questions() {
  const [data, setData] = useState([]);
  const [disabledQuestions, setDisabledQuestions] = useState(Array(data.length).fill(false));
  const [numberOfCorrectAnswers, setNumberOfCorrectAnswers] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState(Array(data.length).fill(null));
  const [numberOfAttemptedQuestions , setNumberOfAttemptedQuestions] = useState(0);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://opentdb.com/api.php?amount=5&category=9&difficulty=easy&type=multiple");
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const jsonData = await response.json();
        setData(jsonData.results);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  const shuffledAnswers = useMemo(() => {
    return data.map((item) => {
      const allAnswers = [...item.incorrect_answers, item.correct_answer];
      return allAnswers.sort(() => Math.random() - 0.5);
    });
  }, [data]);
    
  function handleOption(event, questionIndex) {
    const userAnswer = event.target.value;
    const correctAnswer = data[questionIndex].correct_answer;
    setNumberOfAttemptedQuestions(prevValue => prevValue+1)
  
    // Track selected answer
    const updatedSelected = [...selectedAnswers];
    updatedSelected[questionIndex] = userAnswer;
    setSelectedAnswers(updatedSelected);
  
    // Update score if correct
    if (userAnswer === correctAnswer) {
      setNumberOfCorrectAnswers(prev => prev + 1);
    }
  
    // Disable the buttons for this question
    const updatedDisabled = [...disabledQuestions];
    updatedDisabled[questionIndex] = true;
    setDisabledQuestions(updatedDisabled);
  }


  function handlePlayAgain () {
    setDisabledQuestions(Array(data.length).fill(false))
    setNumberOfAttemptedQuestions(0)
    setNumberOfCorrectAnswers(0)
    setSelectedAnswers(Array(data.length).fill(null))
    window.location.reload(true);
  }

  return (
    <>
      <div className="Quiz-div">
        {data.map((item, index) => (
          <div key={index} className="Full-div">
          <h2 className="Question">{decode(item.question)}</h2>
              <div className="options-div">
                  {shuffledAnswers[index].map((answer, i) => (
                    <div >
                      <button key={i} type="button" className={`option-button ${
                          disabledQuestions[index]? decode(answer) === data[index].correct_answer
                            ? 'correct'
                            : selectedAnswers[index] === decode(answer)
                            ? 'incorrect'
                            : ''
                          : ''}`}  value={decode(answer)} onClick={(e) => handleOption(e, index)}disabled={disabledQuestions[index]}>
                        {decode(answer)}
                      </button>
                  </div>
                ))}

              </div>
          </div>
        ))}
        
      </div>
      {numberOfAttemptedQuestions ===5 ? <div className="results-div">
          <h2 className="results-heading">"You scored {numberOfCorrectAnswers}/{numberOfAttemptedQuestions} correct answers"</h2>
          <button className="Play-again" onClick={handlePlayAgain}>Play Again</button>
      </div> : null}
      {numberOfCorrectAnswers > 1 && numberOfAttemptedQuestions === 5 ? <Confetti numberOfPieces={500}/> : null}
    </>
     
  );
}
