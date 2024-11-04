import React, { useState, useEffect } from "react";

const GameFrame = () => {
	const [pos, setPos] = useState(0);
	const [quizVisible, setQuizVisible] = useState(false);
	const [currentQuizType, setCurrentQuizType] = useState(null);
	const [quizPosition, setQuizPosition] = useState(null);
	const [selectedQuestion, setSelectedQuestion] = useState(null);
	const [selectedOption, setSelectedOption] = useState(null);
	const [toast, setToast] = useState({
		visible: false,
		message: "",
		type: "",
		justification: "",
	});
	const [winner, setWinner] = useState(false); // New state to track if player has won

	const ladders = [
		[5, 26],
		[10, 31],
		[12, 33],
		[23, 42],
		[34, 57],
		[49, 71],
		[53, 86],
		[60, 79],
		[73, 92],
		[77, 96],
	];
	const snakes = [
		[97, 42],
		[95, 47],
		[91, 69],
		[82, 57],
		[65, 33],
		[48, 29],
		[43, 36],
		[39, 20],
		[25, 3],
		[27, 13],
	];

	const quizQuestions = [
		{
			question: "What is the capital of France?",
			options: ["Berlin", "Madrid", "Paris", "Rome"],
			correct: 2,
			justification: "Paris is the capital and most populous city of France.",
		},
		{
			question: "Who wrote 'To Kill a Mockingbird'?",
			options: ["Harper Lee", "J.K. Rowling", "Ernest Hemingway", "Mark Twain"],
			correct: 0,
			justification: "'To Kill a Mockingbird' was written by Harper Lee.",
		},
		{
			question: "Which planet is known as the Red Planet?",
			options: ["Earth", "Mars", "Venus", "Jupiter"],
			correct: 1,
			justification:
				"Mars is often called the Red Planet due to its reddish appearance.",
		},
		{
			question: "Who painted the Mona Lisa?",
			options: [
				"Vincent Van Gogh",
				"Leonardo da Vinci",
				"Pablo Picasso",
				"Claude Monet",
			],
			correct: 1,
			justification: "Leonardo da Vinci painted the Mona Lisa.",
		},
		{
			question: "What is the square root of 144?",
			options: ["10", "11", "12", "13"],
			correct: 2,
			justification: "The square root of 144 is 12.",
		},
		// Add up to 20 questions as required
		// Add more questions as needed
	];

	useEffect(() => {
		createBoxes();
	}, []);

	useEffect(() => {
		if (quizPosition !== null) {
			setBox(`b_${pos}`);
		}
	}, [pos, quizPosition]);

	function createBoxes() {
		let boxes = "";
		let no = 100,
			inc = -1;
		for (let i = 0; i < 10; i++) {
			for (let j = 0; j < 10; j++) {
				let y = i * (window.innerWidth >= 768 ? 60 : 40);
				let x = j * (window.innerWidth >= 768 ? 60 : 40);
				boxes += `<div id="b_${no}" class='box w-[40px] h-[40px] md:w-[60px] md:h-[60px] absolute' style="margin: ${y}px ${x}px"></div>`;
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
		document.getElementById(
			id
		).innerHTML = `<div class='circle w-full h-full bg-blue-800 border-4 border-white scale-[0.6] rounded-full'></div>`;
	}

	function removeBox(id) {
		document.getElementById(id).innerHTML = "";
	}

	function playerMover(move) {
		if (move > 0 && pos + move <= 100) { // Only move if it stays within bounds
			setPos((prevPos) => {
				if (prevPos >= 1) {
					removeBox(`b_${prevPos}`);
				}
				const newPos = prevPos + move; // Move by exact dice value
				setBox(`b_${newPos}`);
				
				if (newPos === 100) {
					setWinner(true); // Mark as winner if reached 100
				} else {
					checkLadder(newPos);
					checkSnake(newPos);
				}
				return newPos;
			});
		} else {
			// If no move, player stays in position, no further recursive calls
			setToast({
				visible: true,
				message: "Roll a different number to proceed.",
				type: "info",
				justification: "",
			});
		}
	}

	function rotateDice() {
		if (winner) return; // Stop the game if the player has won
		let diceValue = Math.floor(Math.random() * 6) + 1;
		console.log(diceValue);
	
		// Check if the dice roll would move player past 100
		if (pos + diceValue > 100) {
			setToast({
				visible: true,
				message: "Roll again! You need an exact roll to reach 100.",
				type: "info",
				justification: "",
			});
			return;
		}
	
		let rotationList = [
			[0, 0, 0],
			[-90, 0, 0],
			[0, 90, 0],
			[0, -90, 0],
			[90, 0, 0],
			[180, 0, 0],
		];
		let x = rotationList[diceValue - 1][0];
		let y = rotationList[diceValue - 1][1];
		let z = rotationList[diceValue - 1][2];
		document.querySelector(".dice").classList.add("anm");
		setTimeout(() => {
			document.querySelector(
				".dice"
			).style.transform = `rotateX(${x}deg) rotateY(${y}deg) rotateZ(${z}deg)`;
			setTimeout(() => {
				document.querySelector(".dice").classList.remove("anm");
				playerMover(diceValue); // Call playerMover only if it's a valid move
			}, 500);
		}, 2000);
	}
	
	function checkLadder(currentPos) {
		ladders.forEach(([start, end]) => {
			if (currentPos === start) {
				setQuizPosition(end);
				setCurrentQuizType("ladder");
				setQuizVisible(true);
				selectRandomQuestion();
			}
		});
	}

	function checkSnake(currentPos) {
		snakes.forEach(([start, end]) => {
			if (currentPos === start) {
				setQuizPosition(end);
				setCurrentQuizType("snake");
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
		if (selectedOption === null) return;

		const isCorrect = selectedOption === selectedQuestion.correct;
		const message = isCorrect
			? currentQuizType === "ladder"
				? "Correct Answer! The ladder will take you up."
				: "Correct Answer! The snake won't bite you."
			: currentQuizType === "ladder"
			? "Wrong Answer! The ladder won't take you up."
			: "Wrong Answer! The snake will bite you.";
		const justification = selectedQuestion.justification || (isCorrect ? "Great job!" : "Better luck next time!");

		setToast({
			visible: true,
			message,
			type: isCorrect ? "success" : "error",
			justification,
		});

		setQuizVisible(false);
	}

	function handleToastOk() {
		const isCorrect = toast.type === "success";
		setToast({ visible: false, message: "", type: "", justification: "" });

		if (currentQuizType === "ladder" && isCorrect) {
			console.log(`Climbing the ladder from ${pos} to ${quizPosition}`);
			removeBox(`b_${pos}`);
			setPos(quizPosition); // Move player to the top of the ladder
		} else if (currentQuizType === "snake" && !isCorrect) {
			console.log(`Bitten by snake! Moving from ${pos} to ${quizPosition}`);
			removeBox(`b_${pos}`);
			setPos(quizPosition); // Move player to the bottom of the snake
		} else {
			console.log("No movement for the ladder or correct snake answer");
			// Optionally perform other actions, e.g., move forward 1 step
		}

		// Clear selected option after submission
		setSelectedOption(null);
	}

	return (
        <div className="bg-white p-2 relative">
            {/* Board */}
            <div className="board w-[400px] h-[400px] md:w-[600px] md:h-[600px] shadow-md relative"></div>

            {/* Dice and Roll Button */}
            <div className="dicef flex flex-col justify-center items-center pt-4 space-y-4">
                <div className="dice w-[40px] h-[40px] md:w-[60px] md:h-[60px] relative">
                    <div className="two top w-full h-full absolute rounded-md bg-blue-600">
                        <div className="dot m-[3%] w-[6px] h-[6px] md:w-[10px] md:h-[10px] bg-white rounded-full"></div>
                        <div className="dot m-[3%] w-[6px] h-[6px] md:w-[10px] md:h-[10px] bg-white rounded-full"></div>
                    </div>
                    <div className="five bottom w-full h-full absolute rounded-md bg-blue-600">
                        <div className="dot w-[6px] h-[6px] m-[3%] md:w-[10px] md:h-[10px] bg-white rounded-full"></div>
                        <div className="dot w-[6px] h-[6px] m-[3%] md:w-[10px] md:h-[10px] bg-white rounded-full"></div>
                        <div className="dot w-[6px] h-[6px] m-[3%] md:w-[10px] md:h-[10px] bg-white rounded-full"></div>
                        <div className="dot w-[6px] h-[6px] m-[3%] md:w-[10px] md:h-[10px] bg-white rounded-full"></div>
                        <div className="dot w-[6px] h-[6px] m-[3%] md:w-[10px] md:h-[10px] bg-white rounded-full"></div>
                    </div>
                    <div className="three left w-full h-full absolute rounded-md bg-blue-600 gap-[1px]">
                        <div className="dot w-[6px] h-[6px] md:w-[10px] md:h-[10px] bg-white rounded-full"></div>
                        <div className="dot md:w-[10px] md:h-[10px] w-[6px] h-[6px] bg-white rounded-full"></div>
                        <div className="dot md:w-[10px] md:h-[10px] bg-white w-[6px] h-[6px] rounded-full"></div>
                    </div>
                    <div className="four right w-full h-full absolute rounded-md bg-blue-600">
                        <div className="dot m-[3%] w-[6px] h-[6px] md:w-[10px] md:h-[10px] bg-white rounded-full"></div>
                        <div className="dot m-[3%] w-[6px] h-[6px] md:w-[10px] md:h-[10px] bg-white rounded-full"></div>
                        <div className="dot m-[3%] w-[6px] h-[6px] md:w-[10px] md:h-[10px] bg-white rounded-full"></div>
                        <div className="dot m-[3%] w-[6px] h-[6px] md:w-[10px] md:h-[10px] bg-white rounded-full"></div>
                    </div>
                    <div className="one front w-full h-full absolute rounded-md bg-blue-600">
                        <div className="dot m-[3%] w-[6px] h-[6px] md:w-[10px] md:h-[10px] bg-white rounded-full"></div>
                    </div>
                    <div className="six back w-full h-full absolute rounded-md bg-blue-600">
                        <div className="dot m-[3%] w-[6px] h-[6px] md:w-[10px] md:h-[10px] bg-white rounded-full"></div>
                        <div className="dot m-[3%] w-[6px] h-[6px] md:w-[10px] md:h-[10px] bg-white rounded-full"></div>
                        <div className="dot m-[3%] w-[6px] h-[6px] md:w-[10px] md:h-[10px] bg-white rounded-full"></div>
                        <div className="dot m-[3%] w-[6px] h-[6px] md:w-[10px] md:h-[10px] bg-white rounded-full"></div>
                        <div className="dot m-[3%] w-[6px] h-[6px] md:w-[10px] md:h-[10px] bg-white rounded-full"></div>
                        <div className="dot m-[3%] w-[6px] h-[6px] md:w-[10px] md:h-[10px] bg-white rounded-full"></div>
                    </div>
                </div>
                <button
                    onClick={rotateDice}
                    className="bg-blue-600 hover:bg-blue-700 text-white transition duration-300 delay-75 px-4 py-2 rounded"
                >
                    Roll Dice
                </button>
            </div>

            {/* Quiz Modal */}
            {quizVisible && selectedQuestion && (
                <div className="fixed inset-0 z-20 flex items-center justify-center">
                    {/* Overlay with opacity */}
                    <div className="absolute inset-0 bg-black bg-opacity-75"></div>

                    {/* Modal */}
                    <div className="quizModal bg-white flex items-center justify-center flex-col p-4 rounded-md relative z-30 shadow-lg transition transform duration-300 ease-in-out">
                        <h2 className="text-lg font-semibold pb-2">
                            {selectedQuestion.question}
                        </h2>
                        <div className="grid grid-cols-2 p-2 gap-2 pb-4">
                            {selectedQuestion.options.map((option, index) => (
                                <div key={index} className="flex flex-row space-x-1">
                                    <input
                                        type="radio"
                                        required
                                        id={`option-${index}`}
                                        name="quiz-option"
                                        value={index}
                                        onChange={(e) => setSelectedOption(Number(e.target.value))} // Set selected option
                                    />
                                    <label htmlFor={`option-${index}`}>{option}</label>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={handleQuizSubmit}
                            disabled={selectedOption === null} // Disable if no option selected
                            className={`transition duration-300 delay-75 px-2 py-1 rounded-md text-white 
                                ${selectedOption !== null
                                    ? "bg-green-600 hover:bg-green-700"
                                    : "bg-gray-400 cursor-not-allowed"
                                }`}
                        >
                            Submit
                        </button>
                    </div>
                </div>
            )}

            {/* Toast Notification */}
            {toast.visible && (
                <div className="fixed inset-0 flex items-center justify-center z-40 shadow-lg shadow-gray-800">
                    <div
                        className={`${
                            toast.type === "success" ? "bg-green-600" : "bg-red-500"
                        } text-white p-4 rounded-md shadow-lg transform transition-all duration-300 ease-in-out opacity-100 max-w-sm mx-auto`}
                    >
                        <h3 className="text-lg font-semibold">{toast.message}</h3>
                        <p className="mt-2">{toast.justification}</p>
                        {/* Added 'OK' button */}
                        <div className="flex justify-center items-center">
                            <button
                                onClick={handleToastOk}
                                className="mt-4 bg-white text-black px-2 w-12 py-1 rounded-md hover:bg-gray-200 transition duration-300 flex items-center justify-center"
                            >
                                <div>Ok</div>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Winner Notification */}
            {winner && (
                <div className="fixed inset-0 z-40 flex items-center justify-center">
                    <div className="bg-green-500 text-white p-6 rounded shadow-lg">
                        Congratulations! You've reached 100 and won the game!
                    </div>
                </div>
            )}
        </div>
    );
};

export default GameFrame;