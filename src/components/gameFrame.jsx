import React, { useState, useEffect } from 'react';

const GameFrame = () => {
  const [pos, setPos] = useState(0);
  const [quizVisible, setQuizVisible] = useState(false);
  const [currentQuizType, setCurrentQuizType] = useState(null); // ladder or snake
  const [quizPosition, setQuizPosition] = useState(null);

  const ladders = [[5, 26], [10, 31], [12, 33], [23, 42], [34, 57], [49, 71], [53, 86], [60, 79], [73, 92], [77, 96]];
  const snakes = [[97, 42], [95, 47], [91, 69], [82, 57], [65, 33], [48, 29], [43, 36], [39, 20], [25, 3], [27, 13]];

  useEffect(() => {
    createBoxes();
  }, []);

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
    let x = LIST[dv-1][0];
    let y = LIST[dv-1][1];
    let z = LIST[dv-1][2];
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
      }
    });
  }

  function checkSnake(currentPos) {
    snakes.forEach(([start, end]) => {
      if (currentPos === start) {
        setQuizPosition(end);
        setCurrentQuizType('snake');
        setQuizVisible(true);
      }
    });
  }

  function handleQuizSubmit(correct) {
    setQuizVisible(false);
    if (correct && currentQuizType === 'ladder') {
      removeBox(`b_${pos}`);
      setPos(quizPosition);
      setBox(`b_${quizPosition}`);
    } else if (!correct && currentQuizType === 'snake') {
      removeBox(`b_${pos}`);
      setPos(quizPosition);
      setBox(`b_${quizPosition}`);
    } else {
      playerMover(1); 
    }
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
            <div className="dot m-[3%] w-[10px] h-[10px] bg-white rounded-full"></div>
            <div className="dot m-[3%] w-[10px] h-[10px] bg-white rounded-full"></div>
          </div>
          <div className="front w-full h-full absolute rounded-md">
            <div className="dot m-[3%] w-[10px] h-[10px] bg-white rounded-full"></div>
          </div>
          <div className="back w-full h-full absolute rounded-md">
            <div className="dot m-[3%] w-[10px] h-[10px] bg-white rounded-full"></div>
            <div className="dot m-[3%] w-[10px] h-[10px] bg-white rounded-full"></div>
            <div className="dot m-[3%] w-[10px] h-[10px] bg-white rounded-full"></div>
            <div className="dot m-[3%] w-[10px] h-[10px] bg-white rounded-full"></div>
            <div className="dot m-[3%] w-[10px] h-[10px] bg-white rounded-full"></div>
          </div>
        </div>
        <button onClick={rotateDice} className='bg-indigo-950 text-white font-semibold rounded-md px-2 py-1'>Rotate Dice</button>
      </div>
      {quizVisible && (
        <PopQuiz handleSubmit={handleQuizSubmit} />
      )}
    </div>
  );
};

const PopQuiz = ({ handleSubmit }) => {
  const [answer, setAnswer] = useState('');

  const checkAnswer = () => {
    const correct = answer.toLowerCase() === 'correct answer'; // Replace with actual logic
    handleSubmit(correct);
  };

  return (
    <div className='quiz-modal bg-white p-4 shadow-lg rounded-lg'>
      <p className='font-bold'>Quiz Question: What is 2 + 2?</p>
      <input
        type='text'
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        className='border-2 p-1'
      />
      <button onClick={checkAnswer} className='bg-green-500 text-white rounded-md px-2 py-1'>Submit Answer</button>
    </div>
  );
};

export default GameFrame;