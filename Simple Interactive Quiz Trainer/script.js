// interview-prep/script.js
// Enhanced interactive quiz features

document.addEventListener('DOMContentLoaded', () => {
    // ────────────────────────────────────────────────
    //  Selectors & State
    // ────────────────────────────────────────────────
    const cards = Array.from(document.querySelectorAll('.card'));
    const topics = document.querySelectorAll('.topic');
    const container = document.getElementById('container') || document.body;
    
    let currentIndex = 0;
    let score = 0;
    let knownQuestions = new Set(
        JSON.parse(localStorage.getItem('knownQuestions') || '[]')
    );

    // ────────────────────────────────────────────────
    //  Helper functions
    // ────────────────────────────────────────────────
    function shuffle(array) {
        const copy = [...array];
        for (let i = copy.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [copy[i], copy[j]] = [copy[j], copy[i]];
        }
        return copy;
    }

    function updateProgress() {
        const progress = document.getElementById('progress');
        if (!progress) return;
        const percentage = cards.length ? Math.round((currentIndex + 1) / cards.length * 100) : 0;
        progress.style.width = `${percentage}%`;
        progress.textContent = `${percentage}%`;
    }

    function showCard(index) {
        cards.forEach((card, i) => {
            card.style.display = (i === index) ? 'block' : 'none';
        });
        currentIndex = index;
        updateProgress();
        updateKnownStatus();
    }

    function revealAnswer(card) {
        const btn = card.querySelector('.show-btn');
        const answer = card.querySelector('.answer');
        if (btn && answer) {
            btn.style.display = 'none';
            answer.style.display = 'block';
        }
    }

    function markAsKnown(card, isKnown) {
        const id = card.dataset.id || card.querySelector('.question')?.textContent.trim().slice(0,40);
        if (!id) return;

        if (isKnown) {
            knownQuestions.add(id);
            score = Math.min(score + 1, cards.length);
        } else {
            knownQuestions.delete(id);
            score = Math.max(score - 1, 0);
        }
        localStorage.setItem('knownQuestions', JSON.stringify([...knownQuestions]));
        updateKnownStatus();
        updateScoreDisplay();
    }

    function updateKnownStatus() {
        const currentCard = cards[currentIndex];
        if (!currentCard) return;
        
        const id = currentCard.dataset.id || currentCard.querySelector('.question')?.textContent.trim().slice(0,40);
        const knownBtn = currentCard.querySelector('.known-btn');
        if (knownBtn) {
            knownBtn.textContent = knownQuestions.has(id) ? "✓ Known (click to undo)" : "I knew it!";
            knownBtn.className = `known-btn ${knownQuestions.has(id) ? 'known' : ''}`;
        }
    }

    function updateScoreDisplay() {
        const scoreEl = document.getElementById('score');
        if (scoreEl) scoreEl.textContent = `${score} / ${cards.length}`;
    }

    function filterCards() {
        const difficultyFilter = document.getElementById('difficulty-filter')?.value || 'all';
        const topicFilter = document.getElementById('topic-filter')?.value || 'all';

        cards.forEach(card => {
            const diff = card.querySelector('.difficulty-easy, .difficulty-medium, .difficulty-hard')?.className.match(/difficulty-(\w+)/)?.[1];
            const topic = card.closest('.topic')?.querySelector('h2')?.textContent.trim();

            const matchDiff = difficultyFilter === 'all' || diff === difficultyFilter;
            const matchTopic = topicFilter === 'all' || topic === topicFilter;

            card.style.display = (matchDiff && matchTopic) ? 'block' : 'none';
        });

        // Re-collect visible cards and reset navigation
        const visibleCards = Array.from(document.querySelectorAll('.card[style*="block"], .card:not([style*="none"])'));
        if (visibleCards.length === 0) return;

        cards.length = 0;
        cards.push(...visibleCards);
        currentIndex = 0;
        showCard(0);
    }

    // ────────────────────────────────────────────────
    //  Add missing data-id to cards (for persistence)
    // ────────────────────────────────────────────────
    cards.forEach((card, index) => {
        if (!card.dataset.id) {
            const qText = card.querySelector('.question')?.textContent.trim().slice(0,60) || `q${index}`;
            card.dataset.id = qText;
        }
    });

    // ────────────────────────────────────────────────
    //  Controls UI (add to page dynamically)
    // ────────────────────────────────────────────────
    const controls = document.createElement('div');
    controls.id = 'quiz-controls';
    controls.innerHTML = `
        <div class="top-bar">
            <div>Score: <strong id="score">0 / ${cards.length}</strong></div>
            <div>Progress: <div class="progress-bar"><div id="progress">0%</div></div></div>
            <button id="dark-mode">Dark Mode</button>
        </div>

        <div class="filters">
            <label>Difficulty:
                <select id="difficulty-filter">
                    <option value="all">All</option>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                </select>
            </label>
            <label>Topic:
                <select id="topic-filter">
                    <option value="all">All</option>
                    ${Array.from(topics).map(t => `<option>${t.querySelector('h2')?.textContent.trim()}</option>`).join('')}
                </select>
            </label>
        </div>

        <div class="navigation">
            <button id="prev">← Previous</button>
            <button id="reveal">Show Answer (Space)</button>
            <button id="next">Next →</button>
        </div>

        <div class="known-area">
            <button class="known-btn" id="known">I knew it!</button>
            <button id="reset">Reset Progress</button>
        </div>
    `;
    container.insertBefore(controls, container.firstChild);

    // ────────────────────────────────────────────────
    //  Event listeners
    // ────────────────────────────────────────────────
    document.getElementById('prev')?.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + cards.length) % cards.length;
        showCard(currentIndex);
    });

    document.getElementById('next')?.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % cards.length;
        showCard(currentIndex);
    });

    document.getElementById('reveal')?.addEventListener('click', () => {
        revealAnswer(cards[currentIndex]);
    });

    document.getElementById('known')?.addEventListener('click', () => {
        const wasKnown = knownQuestions.has(cards[currentIndex].dataset.id);
        markAsKnown(cards[currentIndex], !wasKnown);
    });

    document.getElementById('reset')?.addEventListener('click', () => {
        if (confirm('Reset all progress?')) {
            knownQuestions.clear();
            localStorage.removeItem('knownQuestions');
            score = 0;
            updateScoreDisplay();
            updateKnownStatus();
        }
    });

    document.getElementById('dark-mode')?.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
    });

    document.getElementById('difficulty-filter')?.addEventListener('change', filterCards);
    document.getElementById('topic-filter')?.addEventListener('change', filterCards);

    // Keyboard shortcuts
    document.addEventListener('keydown', e => {
        if (e.code === 'Space' || e.code === 'Enter') {
            e.preventDefault();
            revealAnswer(cards[currentIndex]);
        }
        if (e.code === 'ArrowRight' || e.code === 'KeyN') {
            document.getElementById('next')?.click();
        }
        if (e.code === 'ArrowLeft' || e.code === 'KeyP') {
            document.getElementById('prev')?.click();
        }
        if (e.code === 'KeyK') {
            document.getElementById('known')?.click();
        }
    });

    // ────────────────────────────────────────────────
    //  Initialize
    // ────────────────────────────────────────────────
    if (cards.length > 0) {
        // Shuffle at start (optional – comment out if you prefer original order)
        const shuffled = shuffle(cards);
        cards.length = 0;
        cards.push(...shuffled);

        showCard(0);
        updateScoreDisplay();

        // Auto-reveal previously known answers (optional)
        // cards.forEach(card => {
        //     if (knownQuestions.has(card.dataset.id)) revealAnswer(card);
        // });
    }

    console.log(`Interview prep ready — ${cards.length} questions loaded. Good luck!`);
});