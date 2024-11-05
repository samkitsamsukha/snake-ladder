import React, { useState, useEffect } from "react";

const GameFrame = () => {
	const [pos, setPos] = useState(0);
	const [quizVisible, setQuizVisible] = useState(false);
	const [currentQuizType, setCurrentQuizType] = useState(null); // ladder or snake
	const [quizPosition, setQuizPosition] = useState(null);
	const [selectedQuestion, setSelectedQuestion] = useState(null);
	const [selectedOption, setSelectedOption] = useState(null); // Added state for selected option
	const [showFeedback, setShowFeedback] = useState(false);
	const [feedbackMessage, setFeedbackMessage] = useState(""); // State for feedback messag
	const [feedbackAction, setFeedbackAction] = useState("");

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
		{
			question: "What is the largest ocean on Earth?",
			options: [
				"Atlantic Ocean",
				"Indian Ocean",
				"Arctic Ocean",
				"Pacific Ocean",
			],
			correct: 3,
			justification: "The Pacific Ocean is the largest ocean on Earth.",
		},
		{
			question: "Which gas do plants absorb from the atmosphere?",
			options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"],
			correct: 1,
			justification: "Plants absorb carbon dioxide for photosynthesis.",
		},
		{
			question: "Who discovered penicillin?",
			options: [
				"Marie Curie",
				"Alexander Fleming",
				"Isaac Newton",
				"Albert Einstein",
			],
			correct: 1,
			justification: "Alexander Fleming discovered penicillin in 1928.",
		},
		{
			question: "What is the boiling point of water at sea level?",
			options: ["90°C", "100°C", "110°C", "120°C"],
			correct: 1,
			justification: "Water boils at 100°C at sea level.",
		},
		{
			question: "What is the longest river in the world?",
			options: ["Amazon", "Nile", "Yangtze", "Mississippi"],
			correct: 1,
			justification:
				"The Nile is traditionally considered the longest river in the world.",
		},
		{
			question: "What is the chemical symbol for gold?",
			options: ["Ag", "Au", "Pb", "Fe"],
			correct: 1,
			justification: "The chemical symbol for gold is Au.",
		},
		{
			question: "Who invented the telephone?",
			options: [
				"Thomas Edison",
				"Nikola Tesla",
				"Alexander Graham Bell",
				"Guglielmo Marconi",
			],
			correct: 2,
			justification:
				"Alexander Graham Bell is credited with inventing the first practical telephone.",
		},
		{
			question: "In which continent is the Sahara Desert located?",
			options: ["Asia", "South America", "Africa", "Australia"],
			correct: 2,
			justification: "The Sahara Desert is located in Africa.",
		},
		{
			question: "What is the hardest natural substance on Earth?",
			options: ["Gold", "Iron", "Diamond", "Quartz"],
			correct: 2,
			justification: "Diamond is the hardest natural substance on Earth.",
		},
		{
			question: "Who is known as the 'Father of Computers'?",
			options: [
				"Alan Turing",
				"Charles Babbage",
				"John von Neumann",
				"Steve Jobs",
			],
			correct: 1,
			justification: "Charles Babbage is considered the 'Father of Computers'.",
		},
		{
			question: "How many bones are in the human body?",
			options: ["206", "208", "210", "212"],
			correct: 0,
			justification: "The human body has 206 bones.",
		},
		{
			question: "Which country hosted the 2016 Summer Olympics?",
			options: ["China", "Brazil", "Russia", "United Kingdom"],
			correct: 1,
			justification:
				"Brazil hosted the 2016 Summer Olympics in Rio de Janeiro.",
		},
		{
			question: "What is the largest planet in our Solar System?",
			options: ["Earth", "Mars", "Jupiter", "Saturn"],
			correct: 2,
			justification: "Jupiter is the largest planet in our Solar System.",
		},
		{
			question: "Who wrote 'Pride and Prejudice'?",
			options: [
				"Jane Austen",
				"Emily Brontë",
				"Charles Dickens",
				"Virginia Woolf",
			],
			correct: 0,
			justification: "'Pride and Prejudice' was written by Jane Austen.",
		},
		{
			question: "What is the capital city of Japan?",
			options: ["Seoul", "Tokyo", "Beijing", "Bangkok"],
			correct: 1,
			justification: "Tokyo is the capital city of Japan.",
		},
	];

	useEffect(() => {
		if (selectedOption !== null) {
			handleQuizSubmit();
		}
	}, [selectedOption]);

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
		let boxes = "";
		let no = 100,
			inc = -1;
		for (let i = 0; i < 10; i++) {
			for (let j = 0; j < 10; j++) {
				let y = i * (window.innerWidth >= 768 ? 70 : 40); // Use 60px margin for md+ and 40px for smaller screens
				let x = j * (window.innerWidth >= 768 ? 70 : 40);
				boxes += `<div id="b_${no}" class='box w-[40px] h-[40px] md:w-[70px] md:h-[70px] absolute' style="margin: ${y}px ${x}px"></div>`;
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
			}, 400);
		}
	}

	function rotateDice() {
		let dv = Math.floor(Math.random() * 6) + 1;
		// let dv = 3;
		console.log(dv);
		let LIST = [
			[0, 0, 0],
			[-90, 0, 0],
			[0, 90, 0],
			[0, -90, 0],
			[90, 0, 0],
			[180, 0, 0],
		];
		let x = LIST[dv - 1][0];
		let y = LIST[dv - 1][1];
		let z = LIST[dv - 1][2];
		document.querySelector(".dice").classList.add("anm");
		setTimeout(() => {
			document.querySelector(
				".dice"
			).style.transform = `rotateX(${x}deg) rotateY(${y}deg) rotateZ(${z}deg)`;
			setTimeout(() => {
				document.querySelector(".dice").classList.remove("anm");
				playerMover(dv);
			}, 500);
		}, 700);
	}

	function checkLadder(currentPos) {
		ladders.forEach(([start, end]) => {
			if (currentPos === start) {
				console.log(`Ladder quiz triggered at ${start}`);
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
				console.log(`Snake quiz triggered at ${start}`);
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

	const handleQuizSubmit = () => {
		if (selectedOption === null) return;

		const isCorrect = selectedOption === selectedQuestion.correct;

		// Set feedback message based on correctness
		const feedbackMsg = isCorrect ? "Correct Answer!" : "Wrong Answer!";
		const feedbackAct =
			currentQuizType === "snake"
				? isCorrect
					? " The snake won't bite you"
					: " The snake will bite you"
				: isCorrect
				? " The ladder takes you up"
				: " The ladder won't take you up";

		// Combine feedback message and action
		setFeedbackMessage(feedbackMsg);
		setFeedbackAction(feedbackAct);

		// Show feedback
		setShowFeedback(true);

		// Automatically close the modal after 2 seconds
		setTimeout(() => {
			setQuizVisible(false);
			setShowFeedback(false);
			setFeedbackMessage(""); // Reset feedback message for the next question
			setSelectedOption(null); // Reset selected option for the next question
		}, 1500);

		// Your existing game logic
		if (currentQuizType === "ladder" && isCorrect) {
			console.log(`Climbing the ladder from ${pos} to ${quizPosition}`);
			removeBox(`b_${pos}`);
			setPos(quizPosition);
		} else if (currentQuizType === "snake" && !isCorrect) {
			console.log(`Bitten by snake! Moving from ${pos} to ${quizPosition}`);
			removeBox(`b_${pos}`);
			setPos(quizPosition);
		} else {
			console.log("No movement for the ladder or correct snake answer");
		}
	};

	return (
		<div className="bg-white p-2 relative">
			{/* Board */}
			<div className="board w-[400px] h-[400px] md:w-[700px] md:h-[700px] shadow-md relative"></div>

			{/* Dice and Roll Button */}
			<div className="dicef flex flex-col justify-center items-center pt-4 space-y-4">
				<button
					onClick={rotateDice}
					className="text-white transition duration-300 delay-75"
				>
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
				</button>
			</div>

			{/* Quiz Modal */}
			{quizVisible && (
				<div className="quiz-modal fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-0">
					<div className="quiz-content  bg-white p-2 rounded-lg shadow-lg max-w-sm w-full">
						<div className="font-bold mb-1 text-center">
							{selectedQuestion?.question}
						</div>
						<div className="options space-y-1">
							{selectedQuestion?.options.map((option, index) => (
								<button
									key={index}
									onClick={() => setSelectedOption(index)}
									className={`w-full p-1 rounded text-sm ${
										selectedOption === index
											? index === selectedQuestion.correct
												? "bg-green-500 text-white"
												: "bg-red-500 text-white"
											: "bg-gray-100"
									}`}
								>
									{option}
								</button>
							))}
						</div>
						{showFeedback && (
							<p className="feedback-message text-center mt-4">
								<span className={`${feedbackMessage === "Correct Answer!" ? "text-green-700" : "text-red-700"} font-bold`}>{feedbackMessage}</span>
								<span>{feedbackAction}</span>
							</p>
						)}
					</div>
				</div>
			)}
		</div>
	);
};

export default GameFrame;
