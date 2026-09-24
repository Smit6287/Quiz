# Front-End Speed Round ⏱️

## 🔹 Project Description

Front-End Speed Round is a timed multiple-choice quiz built with **HTML, CSS and JavaScript** that tests
basic front-end knowledge — HTML, CSS and JavaScript questions mixed together.

There are **10 questions**, a **30-second timer** on each question and a **5-minute timer** for the whole
quiz. You can move between questions with **Previous / Next buttons** or jump straight to any question
using the **step-dots** above the question, and your answer is remembered when you come back to it.
At the end, it shows your score out of 10.

---

## 🔹 What is Included in This Project

- 10-question quiz (HTML / CSS / JS categories)
- 5-minute total countdown + a 30-second ring timer per question
- Previous / Next navigation — going back to a question resumes its timer where you left it
- Clickable step-dots to jump straight to any question
- Answer selection with visual highlighting
- Auto-advance to the next question if its timer runs out
- Results screen showing score and percentage correct
- Restart button to take the quiz again
- Responsive layout + reduced-motion support for accessibility
- "Glassmorphism" code-editor themed UI (aurora gradient background, frosted card, animated timer ring)

---

## 🔹 How This Project is Made

- **HTML** builds three screens — start, quiz, results — inside one card, shown/hidden with the `hidden` attribute
- **CSS custom properties** (`:root` variables) drive the whole color theme in one place
- **CSS `backdrop-filter`** gives the frosted-glass card effect, with blurred animated circles behind it for the aurora glow
- **CSS keyframe animations** power the option entrance animation, the step-dot "pop" on answer, and the pulsing start button
- **JavaScript (vanilla, no libraries)**:
  - A `quizState` object holds all the state that changes while the quiz runs (current question, answers, time left per question)
  - A single `setInterval` (every 100ms) drives both the 5-minute total clock and the current question's 30-second ring, calculated from real `Date.now()` timestamps so the timing stays accurate
  - `saveRemainingTimeForCurrentQuestion()` "banks" the time left before you navigate away from a question, so Previous / Next / step-dots resume it instead of resetting to 30s
  - Grading happens once, at the end, in `finishQuiz()`, comparing your answers against each question's correct index

---

## 🔹 Technologies Used

- HTML5
- CSS3 (custom properties, `backdrop-filter`, keyframes, media queries)
- JavaScript (ES6+, vanilla — no frameworks or libraries)

---



### ⭐ Thank You
