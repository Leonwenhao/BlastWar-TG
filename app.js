document.addEventListener('DOMContentLoaded', () => {
    const tg = window.Telegram.WebApp;
    let chips = 1000;
    let currentBet = 0;
    const cardRanks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

    const chipCountEl = document.getElementById('chip-count');
    const playerCardEl = document.getElementById('player-card').querySelector('img');
    const opponentCardEl = document.getElementById('opponent-card').querySelector('img');
    const playButtonEl = document.getElementById('play-button');
    const messageEl = document.getElementById('message');
    const currentBetEl = document.getElementById('current-bet');
    const betButtons = document.querySelectorAll('.bet-button');
    const clearBetButton = document.getElementById('clear-bet');
    const warDecisionModal = document.getElementById('war-decision-modal');
    const goToWarButton = document.getElementById('go-to-war-button');
    const surrenderButton = document.getElementById('surrender-button');

    function updateChips(amount) {
        chips += amount;
        chipCountEl.textContent = chips;
    }

    function updateCurrentBet(amount) {
        currentBet += amount;
        currentBetEl.textContent = currentBet;
        playButtonEl.disabled = currentBet === 0 || currentBet > chips;
    }

    function clearBet() {
        currentBet = 0;
        currentBetEl.textContent = currentBet;
        playButtonEl.disabled = true;
    }

    function drawCard() {
        const suits = ['H', 'D', 'C', 'S'];
        
        // Generate random index for rank
        const randomRankIndex = crypto.getRandomValues(new Uint32Array(1))[0] % cardRanks.length;
        const randomRank = cardRanks[randomRankIndex];
        
        // Generate random index for suit
        const randomSuitIndex = crypto.getRandomValues(new Uint32Array(1))[0] % suits.length;
        const randomSuit = suits[randomSuitIndex];
        
        return `${randomRank}${randomSuit}`;
    }

    function compareCards(card1, card2) {
        const rank1 = card1.slice(0, -1);  // Remove the last character (suit)
        const rank2 = card2.slice(0, -1);
        return cardRanks.indexOf(rank1) - cardRanks.indexOf(rank2);
    }

    function displayCard(element, card) {
        element.src = `images/${card}.png`;
        element.alt = card;
    }
    
    function showWarDecisionModal() {
        warDecisionModal.style.display = 'block';
    }

    function hideWarDecisionModal() {
        warDecisionModal.style.display = 'none';
    }

    function surrender(bet) {
        const lossAmount = Math.floor(bet / 2);
        updateChips(-lossAmount);
        messageEl.textContent = `You surrendered. You lost ${lossAmount} chips.`;
        hideWarDecisionModal();
        clearBet();
    }

    function playWar(bet) {
        if (chips < bet) {
            messageEl.textContent = "Not enough chips to go to war!";
            hideWarDecisionModal();
            clearBet();
            return;
        }

        updateChips(-bet); // Deduct the additional bet
        const totalBet = bet * 2;

        messageEl.textContent = "Going to war! Three cards burned.";

        // Simulate burning three cards
        for (let i = 0; i < 3; i++) {
            drawCard();
        }

        const playerWarCard = drawCard();
        const dealerWarCard = drawCard();

        displayCard(playerCardEl, playerWarCard);
        displayCard(opponentCardEl, dealerWarCard);

        const warResult = compareCards(playerWarCard, dealerWarCard);

        if (warResult > 0) {
            updateChips(bet * 2);
            messageEl.textContent = `You won the war! You won ${bet} chips.`;
        } else if (warResult < 0) {
            messageEl.textContent = `You lost the war! You lost ${totalBet} chips.`;
        } else {
            updateChips(bet * 4);
            messageEl.textContent = `It's another tie! You won ${bet * 3} chips.`;
        }

        hideWarDecisionModal();
        clearBet();
    }

    function playRound() {
        const bet = currentBet;
        if (bet === 0 || bet > chips) {
            messageEl.textContent = 'Invalid bet amount!';
            return;
        }

        const playerCard = drawCard();
        const opponentCard = drawCard();

        displayCard(playerCardEl, playerCard);
        displayCard(opponentCardEl, opponentCard);

        const result = compareCards(playerCard, opponentCard);

        if (result > 0) {
            updateChips(bet);
            messageEl.textContent = 'You win!';
            clearBet();
        } else if (result < 0) {
            updateChips(-bet);
            messageEl.textContent = 'You lose!';
            clearBet();
        } else {
            showWarDecisionModal();
            goToWarButton.onclick = () => playWar(bet);
            surrenderButton.onclick = () => surrender(bet);
        }

        if (chips <= 0) {
            messageEl.textContent = 'Game over! You ran out of chips.';
            playButtonEl.disabled = true;
        }
    }

    betButtons.forEach(button => {
        button.addEventListener('click', () => {
            const betValue = parseInt(button.dataset.value);
            if (currentBet + betValue <= chips) {
                updateCurrentBet(betValue);
            }
        });
    });

    clearBetButton.addEventListener('click', clearBet);
    playButtonEl.addEventListener('click', playRound);

    tg.ready();
});
