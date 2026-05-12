const defaultWords = [
    { english: "abandon", pos: "動詞", root: "ab- (離開)", difficulty: "中等", example: "He had to abandon his plan due to bad weather." },
    { english: "benefit", pos: "名詞", root: "bene- (善)", difficulty: "簡單", example: "There are many benefits to reading every day." },
    { english: "complex", pos: "形容詞", root: "com- / plex- (一起 / 折疊)", difficulty: "中等", example: "The assignment was more complex than she expected." },
    { english: "contrast", pos: "名詞", root: "contra- (相反)", difficulty: "簡單", example: "The contrast between day and night is clear." },
    { english: "create", pos: "動詞", root: "cre- (產生)", difficulty: "簡單", example: "He likes to create new ideas in his notebook." },
    { english: "discover", pos: "動詞", root: "dis- / cover- (分離 / 蓋)", difficulty: "簡單", example: "They discovered a hidden path in the forest." },
    { english: "efficient", pos: "形容詞", root: "e- / fic- (出 / 做)", difficulty: "中等", example: "She is very efficient at finishing her homework." },
    { english: "expect", pos: "動詞", root: "ex- (向外)", difficulty: "簡單", example: "We expect the bus to arrive soon." },
    { english: "focus", pos: "動詞", root: "fo- / cus- (中心)", difficulty: "簡單", example: "Please focus on the lesson." },
    { english: "identity", pos: "名詞", root: "id- (自身)", difficulty: "中等", example: "Her identity was confirmed by the teacher." }
];

let words = [];
let currentIndex = 0;
let isFlipped = false;

const wordDisplay = document.getElementById('word-display');
const wordIndex = document.getElementById('word-index');
const wordDifficulty = document.getElementById('word-difficulty');
const wordPos = document.getElementById('word-pos');
const wordRoot = document.getElementById('word-root');
const wordExample = document.getElementById('word-example');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const flipBtn = document.getElementById('flip-btn');
const openAdminBtn = document.getElementById('open-admin-btn');
const card = document.getElementById('card');

function loadWords() {
    const stored = localStorage.getItem('wordBookCustomWords');
    const customWords = stored ? JSON.parse(stored) : [];
    words = [...defaultWords, ...customWords];
}

function displayWord() {
    const current = words[currentIndex];
    wordDisplay.textContent = current.english;
    wordIndex.textContent = `${currentIndex + 1} / ${words.length}`;
    wordDifficulty.textContent = `難易度：${current.difficulty || '-'} `;
    wordPos.textContent = current.pos || '-';
    wordRoot.textContent = current.root || '-';
    wordExample.textContent = current.example || '-';
    card.classList.toggle('is-flipped', isFlipped);
}

function prevWord() {
    currentIndex = (currentIndex - 1 + words.length) % words.length;
    isFlipped = false;
    displayWord();
}

function nextWord() {
    currentIndex = (currentIndex + 1) % words.length;
    isFlipped = false;
    displayWord();
}

function toggleCard() {
    isFlipped = !isFlipped;
    card.classList.toggle('is-flipped', isFlipped);
}

function openAdmin() {
    window.location.href = 'admin.html';
}

prevBtn.addEventListener('click', prevWord);
nextBtn.addEventListener('click', nextWord);
flipBtn.addEventListener('click', toggleCard);
openAdminBtn.addEventListener('click', openAdmin);

loadWords();
displayWord();