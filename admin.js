const adminEnglish = document.getElementById('admin-english');
const adminPos = document.getElementById('admin-pos');
const adminRoot = document.getElementById('admin-root');
const adminDifficulty = document.getElementById('admin-difficulty');
const adminExample = document.getElementById('admin-example');
const searchApiBtn = document.getElementById('search-api-btn');
const adminAddBtn = document.getElementById('admin-add-btn');
const backBtn = document.getElementById('back-btn');
const adminResult = document.getElementById('admin-result');
const apiDisplay = document.getElementById('api-display');
const apiRoot = document.getElementById('api-root');
const apiPos = document.getElementById('api-pos');
const apiExample = document.getElementById('api-example');
const customWordsContainer = document.getElementById('custom-words');

const rootCandidates = [
    { affix: 'ab', meaning: '離開 / 否定' },
    { affix: 'ad', meaning: '向 / 朝' },
    { affix: 'ante', meaning: '前' },
    { affix: 'anti', meaning: '反 / 抗' },
    { affix: 'bene', meaning: '善 / 好' },
    { affix: 'bi', meaning: '二' },
    { affix: 'com', meaning: '一起 / 共同' },
    { affix: 'con', meaning: '一起 / 共同' },
    { affix: 'de', meaning: '下降 / 否定' },
    { affix: 'dis', meaning: '分離 / 否定' },
    { affix: 'en', meaning: '使成為' },
    { affix: 'ex', meaning: '向外 / 前' },
    { affix: 'in', meaning: '不 / 進入' },
    { affix: 'inter', meaning: '在…之間' },
    { affix: 'mis', meaning: '錯誤' },
    { affix: 'pre', meaning: '前' },
    { affix: 'pro', meaning: '向前 / 支持' },
    { affix: 're', meaning: '重新 / 向後' },
    { affix: 'sub', meaning: '在下 / 次要' },
    { affix: 'super', meaning: '超過' },
    { affix: 'trans', meaning: '穿過 / 轉換' },
    { affix: 'un', meaning: '不' },
    { affix: 'under', meaning: '在下' }
];

function loadCustomWords() {
    const stored = localStorage.getItem('wordBookCustomWords');
    return stored ? JSON.parse(stored) : [];
}

function saveCustomWords(words) {
    localStorage.setItem('wordBookCustomWords', JSON.stringify(words));
}

function renderCustomWords() {
    const words = loadCustomWords();
    customWordsContainer.innerHTML = '';
    if (words.length === 0) {
        customWordsContainer.textContent = '目前尚無新增單字。';
        return;
    }

    words.forEach((word, index) => {
        const item = document.createElement('div');
        item.className = 'admin-list-item';
        item.textContent = `${index + 1}. ${word.english} (${word.pos || '-'}) ${word.difficulty ? '[' + word.difficulty + ']' : ''}`;
        customWordsContainer.appendChild(item);
    });
}

async function searchWordData() {
    const word = adminEnglish.value.trim().toLowerCase();
    if (!word) {
        adminResult.textContent = '請先輸入英文單字再查詢。';
        adminResult.style.color = 'red';
        return;
    }

    adminResult.textContent = '查詢中...';
    adminResult.style.color = '#111827';

    try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`);
        if (!response.ok) {
            throw new Error('查無此單字或 API 無法回應');
        }

        const data = await response.json();
        const entry = data[0];
        const meaning = entry.meanings?.[0];
        const definition = meaning?.definitions?.[0];
        const rootCandidate = inferRoot(word, entry.origin);

        adminPos.value = meaning?.partOfSpeech || '';
        adminExample.value = definition?.example || definition?.definition || '';
        adminRoot.value = rootCandidate;
        adminDifficulty.value = '中等';

        apiRoot.textContent = rootCandidate;
        apiPos.textContent = meaning?.partOfSpeech || '-';
        apiExample.textContent = definition?.example || definition?.definition || '-';
        apiDisplay.classList.remove('hidden');

        adminResult.textContent = `已從 API 取得資料，已推測字根：${rootCandidate}`;
        adminResult.style.color = 'green';
    } catch (error) {
        adminResult.textContent = error.message;
        adminResult.style.color = 'red';
    }
}

function inferRoot(word, origin) {
    if (origin) {
        return origin;
    }
    const lower = word.toLowerCase();
    const candidate = rootCandidates.find(match => lower.startsWith(match.affix));
    return candidate ? `${candidate.affix} (${candidate.meaning})` : '-';
}

function addWord() {
    const english = adminEnglish.value.trim().toLowerCase();
    const pos = adminPos.value.trim();
    const root = adminRoot.value.trim();
    const difficulty = adminDifficulty.value.trim() || '中等';
    const example = adminExample.value.trim() || '-';

    if (!english || !pos) {
        adminResult.textContent = '英文與詞性為必填。';
        adminResult.style.color = 'red';
        return;
    }

    const customWords = loadCustomWords();
    if (customWords.some(word => word.english.toLowerCase() === english)) {
        adminResult.textContent = '此單字已存在於自訂單字。';
        adminResult.style.color = 'red';
        return;
    }

    customWords.push({
        english,
        pos,
        root: root || '-',
        difficulty,
        example
    });
    saveCustomWords(customWords);
    renderCustomWords();

    adminEnglish.value = '';
    adminPos.value = '';
    adminRoot.value = '';
    adminDifficulty.value = '';
    adminExample.value = '';

    adminResult.textContent = '單字已新增到自訂單字庫。';
    adminResult.style.color = 'green';
}

function goBack() {
    window.location.href = 'index.html';
}

searchApiBtn.addEventListener('click', searchWordData);
adminAddBtn.addEventListener('click', addWord);
backBtn.addEventListener('click', goBack);

renderCustomWords();