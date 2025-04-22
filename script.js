const sentences = [
    "The quick brown fox jumps over the lazy dog.",
    "Mastering typing is your gateway to digital efficiency.",
    "Every keystroke brings you closer to perfection.",
    "JavaScript: The language that powers the modern web.",
    "Precision and speed are the pillars of productivity.",
    "In the realm of coding, practice reigns supreme.",
    "Digital fluency begins with keyboard mastery.",
    "Frontend development: Where creativity meets logic.",
    "Algorithms and data structures form programming's core.",
    "Elegant code combines simplicity with effectiveness."
];

let timer;
let interval;
let isTyping = false;
let timeLimit;
let originalSentence = "";
let testActive = false;

const elements = {
    sentenceDisplay: document.getElementById("sentence"),
    inputBox: document.getElementById("input-box"),
    timerDisplay: document.getElementById("timer"),
    wpmDisplay: document.getElementById("wpm"),
    startBtn: document.getElementById("start-btn"),
    progressBar: document.getElementById("typing-progress"),
    displayText: document.getElementById("display-text"),
    timeSelect: document.getElementById("time-select")
};

function initializeTest() {
    if (testActive) return;

    timeLimit = parseInt(elements.timeSelect.value);
    timer = timeLimit;
    elements.timerDisplay.textContent = timer;

    originalSentence = sentences[Math.floor(Math.random() * sentences.length)];
    displayText(originalSentence);

    elements.inputBox.value = "";
    elements.inputBox.disabled = false;
    elements.inputBox.focus();
    isTyping = false;
    elements.wpmDisplay.textContent = "0";
    elements.progressBar.value = 0;

    elements.timeSelect.disabled = true;
    elements.startBtn.disabled = true;
    elements.startBtn.querySelector('.neon-text').textContent = "Running...";

    testActive = true;
    clearInterval(interval);
}

function updateTimer() {
    if (!testActive) return;

    timer--;
    elements.timerDisplay.textContent = timer < 0 ? 0 : timer;

    if (timer <= 0) {
        endTest();
    }
}

function endTest() {
    testActive = false;
    clearInterval(interval);
    elements.inputBox.disabled = true;
    const typedText = elements.inputBox.value;

    // Calculate actual time elapsed (minimum 1 second)
    const timeElapsed = Math.max(timeLimit - timer, 1);
    const wordsTyped = typedText.trim().split(/\s+/).length;
    const wpm = Math.round((wordsTyped / timeElapsed) * 60);

    // Update WPM display in stats
    elements.wpmDisplay.textContent = wpm; // <-- Added fix here

    const accuracy = calculateAccuracy(originalSentence, typedText);
    showCompletion(wpm, accuracy);
    resetControls();
}

function calculateAccuracy(original, typed) {
    const minLength = Math.min(original.length, typed.length);
    let correctChars = 0;

    for (let i = 0; i < minLength; i++) {
        if (typed[i] === original[i]) correctChars++;
    }

    return ((correctChars / original.length) * 100).toFixed(1);
}

function displayText(text) {
    elements.displayText.innerHTML = text.split('').map(char => {
        return char === ' '
            ? `<span class="space"> </span>`
            : `<span>${char}</span>`;
    }).join('');
}

function showCompletion(wpm, accuracy) {
    const completion = document.createElement('div');
    completion.className = 'completion-message';
    completion.innerHTML = `
        <div class="checkmark">✓</div>
        <h2>Test Complete!</h2>
        <p>Speed: ${wpm} WPM</p>
        <p>Accuracy: ${accuracy}%</p>
    `;
    document.body.appendChild(completion);

    setTimeout(() => {
        completion.style.opacity = '1';
        completion.style.transform = 'translateY(0)';
    }, 100);

    setTimeout(() => {
        completion.style.opacity = '0';
        completion.style.transform = 'translateY(-20px)';
        setTimeout(() => completion.remove(), 500);
    }, 3000);
}

function resetControls() {
    elements.timeSelect.disabled = false;
    elements.startBtn.disabled = false;
    elements.startBtn.querySelector('.neon-text').textContent = "Restart Challenge";
    testActive = false;
}

// Event Listeners
elements.inputBox.addEventListener("input", () => {
    if (!testActive) return;

    if (!isTyping) {
        isTyping = true;
        interval = setInterval(updateTimer, 1000);
    }

    const typedText = elements.inputBox.value;
    const spans = elements.displayText.querySelectorAll('span');
    let allCorrect = true;

    spans.forEach((span, index) => {
        span.classList.remove('correct', 'incorrect', 'current');

        if (index < typedText.length) {
            const isCorrect = typedText[index] === span.textContent;
            span.classList.add(isCorrect ? 'correct' : 'incorrect');
            if (!isCorrect) allCorrect = false;
        }

        if (index === typedText.length) {
            span.classList.add('current');
        }
    });

    const progress = Math.min((typedText.length / originalSentence.length) * 100, 100);
    elements.progressBar.value = progress;

    if (allCorrect && typedText.length === originalSentence.length) {
        endTest();
    }
});

elements.startBtn.addEventListener("click", () => {
    if (!elements.startBtn.disabled) {
        initializeTest();
    }
});

// Initialize default timer display
elements.timerDisplay.textContent = elements.timeSelect.value;