
const questions = [
  {
    category: "html",
    comment: "<!-- Q1 -->",
    question: "What does <!DOCTYPE html> do?",
    choices: [
      "Loads the page's CSS stylesheet automatically",
      "Tells the browser to render in standards mode (HTML5) instead of quirks mode",
      "Defines the character encoding for the page",
      "Creates a new HTML5 <head> section"
    ],
    correctIndex: 1
  },
  {
    category: "html",
    comment: "<!-- Q2 -->",
    question: "What's the difference between <div> and <span>?",
    choices: [
      "<div> is block-level; <span> is inline",
      "<div> is for styling; <span> is for scripting",
      "<span> can hold other elements; <div> cannot",
      "There's no difference — they're interchangeable"
    ],
    correctIndex: 0
  },
  {
    category: "html",
    comment: "<!-- Q3 -->",
    question: "Which tag embeds JavaScript in a page?",
    choices: ["<js>", "<code>", "<script>", "<style>"],
    correctIndex: 2
  },
  {
    category: "css",
    comment: "/* Q4 */",
    question: "What's the difference between a class and an id selector?",
    choices: [
      "An id can be reused on many elements; a class can't",
      "A class can be reused on many elements; an id should be unique and has higher specificity",
      "A class has higher specificity than an id",
      "They behave identically in CSS"
    ],
    correctIndex: 1
  },
  {
    category: "css",
    comment: "/* Q5 */",
    question: "What is the CSS \"cascade\"?",
    choices: [
      "The order CSS files load in via <link> tags",
      "A staggered CSS animation technique",
      "The way CSS variables inherit only from :root",
      "The rule system that decides which style wins, based on specificity, source order, and !important"
    ],
    correctIndex: 3
  },
  {
    category: "css",
    comment: "/* Q6 */",
    question: "How do you center a block element horizontally?",
    choices: [
      "Give it a fixed width and set margin: 0 auto (or use flex + justify-content: center)",
      "text-align: center on the element itself",
      "position: absolute; left: 50%; with no transform",
      "float: center;"
    ],
    correctIndex: 0
  },
  {
    category: "js",
    comment: "// Q7",
    question: "What's the difference between let and var?",
    choices: [
      "let is function-scoped, var is block-scoped",
      "var can't be reassigned, let can",
      "let is block-scoped and can't be used before its declaration; var is function-scoped and gets hoisted",
      "There's no functional difference, only stylistic"
    ],
    correctIndex: 2
  },
  {
    category: "js",
    comment: "// Q8",
    question: "What is a callback function?",
    choices: [
      "A function that calls itself recursively",
      "A function passed into another function to be run later, often after an async operation finishes",
      "A built-in browser function you can't modify",
      "A function that returns another function's result immediately"
    ],
    correctIndex: 1
  },
  {
    category: "js",
    comment: "// Q9",
    question: "What does JSON.stringify() do?",
    choices: [
      "Converts a JS object or value into a JSON-formatted string",
      "Converts a JSON string back into a JS object",
      "Validates whether a string is properly formatted JSON",
      "Compresses a JSON file for network transfer"
    ],
    correctIndex: 0
  },
  {
    category: "js",
    comment: "// Q10",
    question: "What is the DOM?",
    choices: [
      "A CSS layout system for grid-based designs",
      "The server-side database that stores page content",
      "A JavaScript library for DOM manipulation",
      "The Document Object Model — the tree structure the browser builds from HTML, which JS can read and modify"
    ],
    correctIndex: 3
  }
];

const categoryInfo = {
  html: { color: "var(--html-color)", fileExtension: ".html" },
  css: { color: "var(--css-color)", fileExtension: ".css" },
  js: { color: "var(--js-color)", fileExtension: ".js" }
};

const TOTAL_QUIZ_SECONDS = 300; 
const SECONDS_PER_QUESTION = 30; 

const RING_RADIUS = 34;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;


const quizState = {
  currentQuestionIndex: 0,
  selectedAnswers: new Array(questions.length).fill(null), // null = not answered yet
  timeLeftForQuestion: new Array(questions.length).fill(SECONDS_PER_QUESTION), // seconds left on each question's own ring
  quizStartedAt: null,     // Date.now() when "start quiz" was clicked
  currentQuestionStartedAt: null, // Date.now() when we landed on the current question
  questionExpiredOnArrival: false, // true if the current question's timer was already at 0 when we arrived
  countdownInterval: null, // the setInterval id, so we can stop it later
  isFinished: false
};


const startScreen = document.getElementById("startView");
const quizScreen = document.getElementById("quizView");
const resultsScreen = document.getElementById("resultsView");
const statusBar = document.getElementById("statusbar");

const tabDot = document.getElementById("tabDot");
const tabName = document.getElementById("tabName");

const totalTimeText = document.getElementById("totalTimeText");
const totalTimeFill = document.getElementById("totalFill");

const stepDotsContainer = document.getElementById("steps");

const questionCommentEl = document.getElementById("questionComment");
const questionTextEl = document.getElementById("questionText");
const choicesContainer = document.getElementById("options");

const ringForeground = document.getElementById("ringFg");
const ringNumberText = document.getElementById("ringNumber");

const statusProgressText = document.getElementById("statusProgress");
const statusAnsweredText = document.getElementById("statusAnswered");

const previousButton = document.getElementById("prevBtn");
const nextButton = document.getElementById("nextBtn");
const startButton = document.getElementById("startBtn");
const restartButton = document.getElementById("restartBtn");

ringForeground.style.strokeDasharray = RING_CIRCUMFERENCE;


function startQuiz() {
  startScreen.hidden = true;
  quizScreen.hidden = false;
  statusBar.hidden = false;

  quizState.quizStartedAt = Date.now();

  createStepDots();
  showQuestion(0);

  // Re-check the clock and the ring every 100ms
  quizState.countdownInterval = setInterval(updateTimers, 100);
}

function restartQuiz() {
  clearInterval(quizState.countdownInterval);

  quizState.currentQuestionIndex = 0;
  quizState.selectedAnswers = new Array(questions.length).fill(null);
  quizState.timeLeftForQuestion = new Array(questions.length).fill(SECONDS_PER_QUESTION);
  quizState.quizStartedAt = null;
  quizState.currentQuestionStartedAt = null;
  quizState.questionExpiredOnArrival = false;
  quizState.isFinished = false;

  resultsScreen.hidden = true;
  startScreen.hidden = false;
  statusBar.hidden = true;
}


function createStepDots() {
  stepDotsContainer.innerHTML = "";

  questions.forEach(function (_question, index) {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "step-dot";
    dot.id = "step-dot-" + index;
    dot.setAttribute("aria-label", "Go to question " + (index + 1));
    dot.addEventListener("click", function () {
      showQuestion(index);
    });
    stepDotsContainer.appendChild(dot);
  });
}

function updateStepDots() {
  questions.forEach(function (_question, index) {
    const dot = document.getElementById("step-dot-" + index);
    if (!dot) return;

    const isCurrent = index === quizState.currentQuestionIndex;
    const hasBeenAnswered = quizState.selectedAnswers[index] !== null;

    dot.classList.toggle("current", isCurrent);
    dot.classList.toggle("answered", hasBeenAnswered);
  });
}

function showQuestion(index) {
  saveRemainingTimeForCurrentQuestion();

  quizState.currentQuestionIndex = index;
  quizState.currentQuestionStartedAt = Date.now();
  quizState.questionExpiredOnArrival = quizState.timeLeftForQuestion[index] <= 0;

  const question = questions[index];
  const category = categoryInfo[question.category];

  tabName.textContent = "quiz" + category.fileExtension;
  tabDot.style.background = category.color;

  questionCommentEl.textContent = question.comment;
  questionTextEl.textContent = question.question;

  renderChoices(question, index);
  resetRingDisplay();
  updateNavButtons(index);

  statusProgressText.textContent = "question " + (index + 1) + "/" + questions.length;
  statusAnsweredText.textContent = "answered: " + countAnsweredQuestions() + "/" + questions.length;

  updateStepDots();
}

function saveRemainingTimeForCurrentQuestion() {
  if (quizState.currentQuestionStartedAt === null) return; // nothing to save before the first question

  const index = quizState.currentQuestionIndex;
  const secondsElapsed = (Date.now() - quizState.currentQuestionStartedAt) / 1000;
  const secondsLeftBefore = quizState.timeLeftForQuestion[index];

  quizState.timeLeftForQuestion[index] = Math.max(0, secondsLeftBefore - secondsElapsed);
}

function renderChoices(question, questionIndex) {
  choicesContainer.innerHTML = "";
  const previouslySelected = quizState.selectedAnswers[questionIndex];

  question.choices.forEach(function (choiceText, choiceIndex) {
    const button = document.createElement("button");
    button.className = "option";
    if (choiceIndex === previouslySelected) {
      button.classList.add("selected");
    }

    const letter = String.fromCharCode(65 + choiceIndex); // 0 -> A, 1 -> B, ...

    const keySpan = document.createElement("span");
    keySpan.className = "option-key";
    keySpan.textContent = letter + ")";

    const textSpan = document.createElement("span");
    textSpan.textContent = choiceText;

    button.appendChild(keySpan);
    button.appendChild(textSpan);

    button.addEventListener("click", function () {
      selectAnswer(choiceIndex);
    });

    choicesContainer.appendChild(button);
  });
}

function resetRingDisplay() {
  const secondsRemaining = quizState.timeLeftForQuestion[quizState.currentQuestionIndex];
  const fractionRemaining = clamp(secondsRemaining / SECONDS_PER_QUESTION, 0, 1);

  ringForeground.style.strokeDashoffset = RING_CIRCUMFERENCE * (1 - fractionRemaining);
  ringNumberText.textContent = Math.ceil(secondsRemaining);
  ringForeground.classList.toggle("warn", secondsRemaining <= 15 && secondsRemaining > 7);
  ringForeground.classList.toggle("bad", secondsRemaining <= 7);
}

function updateNavButtons(index) {
  previousButton.disabled = index === 0;

  const isLastQuestion = index === questions.length - 1;
  nextButton.textContent = isLastQuestion ? "finish ✓" : "next →";
  nextButton.classList.toggle("finish", isLastQuestion);
}

function countAnsweredQuestions() {
  return quizState.selectedAnswers.filter(function (answer) {
    return answer !== null;
  }).length;
}


function selectAnswer(choiceIndex) {
  quizState.selectedAnswers[quizState.currentQuestionIndex] = choiceIndex;

  const choiceButtons = choicesContainer.querySelectorAll(".option");
  choiceButtons.forEach(function (button, index) {
    button.classList.toggle("selected", index === choiceIndex);
  });

  statusAnsweredText.textContent = "answered: " + countAnsweredQuestions() + "/" + questions.length;
  updateStepDots();
}


function updateTimers() {
  if (quizState.isFinished) return;

  updateTotalClock();
  updateQuestionRing();
}

function updateTotalClock() {
  const secondsElapsed = (Date.now() - quizState.quizStartedAt) / 1000;
  const secondsRemaining = TOTAL_QUIZ_SECONDS - secondsElapsed;

  totalTimeText.textContent = formatTime(secondsRemaining);
  totalTimeFill.style.width = Math.max(0, (secondsRemaining / TOTAL_QUIZ_SECONDS) * 100) + "%";

  const isUrgent = secondsRemaining <= 30;
  totalTimeText.classList.toggle("urgent", isUrgent);
  totalTimeFill.classList.toggle("urgent", isUrgent);

  if (secondsRemaining <= 0) {
    finishQuiz();
  }
}

function updateQuestionRing() {
  const index = quizState.currentQuestionIndex;
  const secondsBanked = quizState.timeLeftForQuestion[index]; // what was left when we arrived here
  const secondsElapsedHere = (Date.now() - quizState.currentQuestionStartedAt) / 1000;
  const secondsRemaining = secondsBanked - secondsElapsedHere;
  const fractionRemaining = clamp(secondsRemaining / SECONDS_PER_QUESTION, 0, 1);

 
  ringForeground.style.strokeDashoffset = RING_CIRCUMFERENCE * (1 - fractionRemaining);
  ringNumberText.textContent = Math.max(0, Math.ceil(secondsRemaining));

  ringForeground.classList.toggle("warn", secondsRemaining <= 15 && secondsRemaining > 7);
  ringForeground.classList.toggle("bad", secondsRemaining <= 7);

  if (secondsRemaining <= 0 && !quizState.questionExpiredOnArrival) {
    advanceAfterTimeout(index);
  }
}


function advanceAfterTimeout(index) {
  const isLastQuestion = index === questions.length - 1;
  if (isLastQuestion) {
    finishQuiz();
  } else {
    showQuestion(index + 1);
  }
}

function formatTime(totalSeconds) {
  const safeSeconds = Math.max(0, Math.ceil(totalSeconds));
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;
  return String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0");
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function finishQuiz() {
  if (quizState.isFinished) return;
  quizState.isFinished = true;
  clearInterval(quizState.countdownInterval);

  let correctCount = 0;
  questions.forEach(function (question, index) {
    if (quizState.selectedAnswers[index] === question.correctIndex) {
      correctCount += 1;
    }
  });

  quizScreen.hidden = true;
  statusBar.hidden = true;
  resultsScreen.hidden = false;

  const percentCorrect = Math.round((correctCount / questions.length) * 100);
  document.getElementById("scoreBig").textContent = correctCount + "/" + questions.length;
  document.getElementById("scoreSub").textContent = percentCorrect + "% correct";
}


previousButton.addEventListener("click", function () {
  if (quizState.currentQuestionIndex > 0) {
    showQuestion(quizState.currentQuestionIndex - 1);
  }
});

nextButton.addEventListener("click", function () {
  const isLastQuestion = quizState.currentQuestionIndex === questions.length - 1;
  if (isLastQuestion) {
    finishQuiz();
  } else {
    showQuestion(quizState.currentQuestionIndex + 1);
  }
});

startButton.addEventListener("click", startQuiz);
restartButton.addEventListener("click", restartQuiz);
