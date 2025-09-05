Quiz App – Architecture & Design


1. Overview

The Quiz App is a single-page application built with React + Vite + TailwindCSS. It fetches questions from the Open Trivia DB API, manages quiz flow with React state, and uses React Router for navigation between pages (/, /quiz, /results).

2. Architecture

Entry Point (main.jsx)

Bootstraps React app

Wraps routes using React Router

 -> Pages

Home.jsx → Select difficulty & start quiz

Quiz.jsx → Core quiz logic (questions, navigation, timer)

Results.jsx → Final score + answer summary

-> Components

ProgressBar.jsx → Shows quiz progress

Timer.jsx → 30s countdown for each question

-> Data

Fetched from Open Trivia DB API

Fallback to local questions.json (for offline / no API)

-> State Flow

Load questions → Display one at a time → Track answers & score → Store in localStorage (high score) → Show summary in Results

3. Key Design Decisions

React Hooks (useState, useEffect) for clean state management.

React Router to separate pages (/quiz, /results) instead of keeping everything in one component.

TailwindCSS for fast, responsive, and mobile-friendly UI.

LocalStorage used for:

Persisting high scores

Optional: Resuming quiz after refresh

Navigation Buttons (Next, Previous, Skip) to give more control to the user.

Timer (30s) to make quiz more challenging & test timeout handling.

Error Handling → Retry screen shown if API fails, with fallback local questions.

4. Edge Case Handling

No internet / API failure → fallback to local questions.

Empty response → Show "No questions found".

Timeout → Auto-move to next question with ⏰ marker.

Skip → User can move on without answering.

Rapid clicks → Disabled button states to avoid multiple submissions.

Refresh → Quiz state can be restored from localStorage.

5. Deployment

Hosted on Netlify with CI/CD from GitHub.

_redirects file ensures React Router works on page refresh.

vite.config.js has base: "./" for Netlify compatibility.