import React, { useState, useEffect } from 'react';

const GameFrame = () => {
  const [pos, setPos] = useState(0);
  const [quizVisible, setQuizVisible] = useState(false);
  const [currentQuizType, setCurrentQuizType] = useState(null); // ladder or snake
  const [quizPosition, setQuizPosition] = useState(null);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null); // Added state for selected option

  const ladders = [[5, 26], [10, 31], [12, 33], [23, 42], [34, 57], [49, 71], [53, 86], [60, 79], [73, 92], [77, 96]];
  const snakes = [[97, 42], [95, 47], [91, 69], [82, 57], [65, 33], [48, 29], [43, 36], [39, 20], [25, 3], [27, 13]];

  const quizQuestions = [
    {
      question: "What is the capital of France?",
      options: ["Berlin", "Madrid", "Paris", "Rome"],
      correct: 2,
    },
    {
      question: "Who wrote 'To Kill a Mockingbird'?",
      options: ["Harper Lee", "J.K. Rowling", "Ernest Hemingway", "Mark Twain"],
      correct: 0,
    },
    // Add more questions here...
    {
      question: "Which planet is known as the Red Planet?",
      options: ["Earth", "Mars", "Venus", "Jupiter"],
      correct: 1,
    },
    {
      question: "Who painted the Mona Lisa?",
      options: ["Vincent Van Gogh", "Leonardo da Vinci", "Pablo Picasso", "Claude Monet"],
      correct: 1,
    },
    {
      question: "What is the square root of 144?",
      options: ["10", "11", "12", "13"],
      correct: 2,
    },
    // Add up to 20 questions as required
  ];

  useEffect(() => {
    createBoxes();
  }, []);

  useEffect(() => {
    if (quizPosition !== null) {
      // After position is updated, set the player's new box
      setBox(`b_${pos}`);
    }
  }, [pos, quizPosition]);

  function createBoxes() {
    var boxes = '';
    var no = 100, inc = -1;
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        let y = i * 60;
        let x = j * 60;
        boxes += `<div id="b_${no}" class='box w-[60px] h-[60px] absolute' style="margin: ${y}px ${x}px"></div>`;
        no = no + inc;
      }
      if (i % 2 === 0) {
        no = no - 9;
      } else {
        no = no - 11;
      }
      inc = -inc;
    }
    document.querySelector(".board").innerHTML = boxes;
  }

  function setBox(id) {
    document.getElementById(id).innerHTML = `<div class='circle w-full h-full bg-blue-800 border-4 border-white scale-[0.6] rounded-full'></div>`;
  }

  function removeBox(id) {
    document.getElementById(id).innerHTML = "";
  }

  function playerMover(move) {
    if (move > 0) {
      setTimeout(() => {
        setPos((prevPos) => {
          if (prevPos >= 1) {
            removeBox(`b_${prevPos}`);
          }
          const newPos = prevPos + 1;
          setBox(`b_${newPos}`);
          if (move === 1) {
            checkLadder(newPos);
            checkSnake(newPos);
          }
          return newPos;
        });
        playerMover(move - 1);
      }, 500);
    }
  }

  function rotateDice() {
    let dv = Math.floor(Math.random() * 6) + 1;
    console.log(dv);
    let LIST = [[0, 0, 0], [-90, 0, 0], [0, 90, 0], [0, -90, 0], [90, 0, 0], [180, 0, 0]];
    let x = LIST[dv - 1][0];
    let y = LIST[dv - 1][1];
    let z = LIST[dv - 1][2];
    document.querySelector(".dice").classList.add('anm');
    setTimeout(() => {
      document.querySelector(".dice").style.transform = `rotateX(${x}deg) rotateY(${y}deg) rotateZ(${z}deg)`;
      setTimeout(() => {
        document.querySelector(".dice").classList.remove('anm');
        playerMover(dv);
      }, 500);
    }, 2000);
  }

  function checkLadder(currentPos) {
    ladders.forEach(([start, end]) => {
      if (currentPos === start) {
        setQuizPosition(end);
        setCurrentQuizType('ladder');
        setQuizVisible(true);
        selectRandomQuestion();
      }
    });
  }

  function checkSnake(currentPos) {
    snakes.forEach(([start, end]) => {
      if (currentPos === start) {
        setQuizPosition(end);
        setCurrentQuizType('snake');
        setQuizVisible(true);
        selectRandomQuestion();
      }
    });
  }

  function selectRandomQuestion() {
    const randomIndex = Math.floor(Math.random() * quizQuestions.length);
    setSelectedQuestion(quizQuestions[randomIndex]);
  }

  function handleQuizSubmit() {
    setQuizVisible(false);
    
    if (currentQuizType === 'ladder' && selectedOption === selectedQuestion.correct) {
      console.log(`Climbing the ladder from ${pos} to ${quizPosition}`);
      removeBox(`b_${pos}`);
      setPos(quizPosition); // Move player to the top of the ladder
    } else if (currentQuizType === 'snake' && selectedOption !== selectedQuestion.correct) {
      console.log(`Bitten by snake! Moving from ${pos} to ${quizPosition}`);
      removeBox(`b_${pos}`);
      setPos(quizPosition); // Move player to the bottom of the snake
    } else {
      console.log('No movement for the ladder or correct snake answer');
      playerMover(1); // Move forward 1 step as a fallback
    }
    
    // Clear selected option after submission
    setSelectedOption(null);
  }

  return (
    <div className='p-10 shadow-lg bg-white flex flex-col space-y-4 justify-center items-center'>
      <div className='board w-[600px] h-[600px] shadow-md'></div>
      <div className='dicef flex flex-col justify-center items-center pt-4 space-y-4'>
        <div className="dice w-[60px] h-[60px] relative">
          <div className="top w-full h-full absolute rounded-md">
            <div className="dot m-[3%] w-[10px] h-[10px] bg-white rounded-full"></div>
            <div className="dot m-[3%] w-[10px] h-[10px] bg-white rounded-full"></div>
          </div>
          <div className="bottom w-full h-full absolute rounded-md">
            <div className="dot m-[3%] w-[10px] h-[10px] bg-white rounded-full"></div>
            <div className="dot m-[3%] w-[10px] h-[10px] bg-white rounded-full"></div>
            <div className="dot m-[3%] w-[10px] h-[10px] bg-white rounded-full"></div>
            <div className="dot m-[3%] w-[10px] h-[10px] bg-white rounded-full"></div>
            <div className="dot m-[3%] w-[10px] h-[10px] bg-white rounded-full"></div>
          </div>
          <div className="left w-full h-full absolute rounded-md">
            <div className="dot m-[3%] w-[10px] h-[10px] bg-white rounded-full"></div>
            <div className="dot m-[3%] w-[10px] h-[10px] bg-white rounded-full"></div>
            <div className="dot m-[3%] w-[10px] h-[10px] bg-white rounded-full"></div>
          </div>
          <div className="right w-full h-full absolute rounded-md">
            <div className="dot m-[3%] w-[10px] h-[10px] bg-white rounded-full"></div>
            <div className="dot m-[3%] w-[10px] h-[10px] bg-white rounded-full"></div>
          </div>
          <div className="front w-full h-full absolute rounded-md">
            <div className="dot m-[3%] w-[10px] h-[10px] bg-white rounded-full"></div>
            <div className="dot m-[3%] w-[10px] h-[10px] bg-white rounded-full"></div>
            <div className="dot m-[3%] w-[10px] h-[10px] bg-white rounded-full"></div>
          </div>
          <div className="back w-full h-full absolute rounded-md">
            <div className="dot m-[3%] w-[10px] h-[10px] bg-white rounded-full"></div>
            <div className="dot m-[3%] w-[10px] h-[10px] bg-white rounded-full"></div>
          </div>
        </div>
        <button onClick={rotateDice} className='bg-blue-600 hover:bg-blue-800 text-white px-4 py-2 rounded'>
          Roll Dice
        </button>
      </div>

      {quizVisible && (
        <div className='quizModal'>
          <h2 className='text-lg font-semibold'>{selectedQuestion.question}</h2>
          <div>
            {selectedQuestion.options.map((option, index) => (
              <div key={index}>
                <input
                  type='radio'
                  id={`option-${index}`}
                  name='quiz-option'
                  value={index}
                  onChange={(e) => setSelectedOption(Number(e.target.value))} // Set selected option
                />
                <label htmlFor={`option-${index}`}>{option}</label>
              </div>
            ))}
          </div>
          <button onClick={handleQuizSubmit} className='bg-green-600 hover:bg-green-800 text-white px-4 py-2 rounded'>
            Submit
          </button>
        </div>
      )}
    </div>
  );
}

export default GameFrame; 
