document.addEventListener('DOMContentLoaded', () => {
    const tg = window.Telegram.WebApp;
    let chips = 1000;
    const cards = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

    const chipCountEl = document.getElementById('chip-count');
    const playerCardEl = document.getElementById('player-card');
    const opponentCardEl = document.getElementById('opponent-card');
    const betInputEl = document.getElementById('bet-input');
    const playButtonEl = document.getElementById('play-button');
    const messageEl = document.getElementById('message');

    function updateChips(amount) {
        chips += amount;
        chipCountEl.textContent = chips;
    }

    function drawCard() {
        return cards[Math.floor(Math.random() * cards.length)];
    }

    function compareCards(card1, card2) {
        return cards.indexOf(card1) - cards.indexOf(card2);
    }

    function playRound() {
        const bet = parseInt(betInputEl.value);
        if (isNaN(bet) || bet <= 0 || bet > chips) {
            messageEl.textContent = 'Invalid bet amount!';
            return;
        }

        const playerCard = drawCard();
        const opponentCard = drawCard();

        playerCardEl.textContent = playerCard;
        opponentCardEl.textContent = opponentCard;

        const result = compareCards(playerCard, opponentCard);

        if (result > 0) {
            updateChips(bet);
            messageEl.textContent = 'You win!';
        } else if (result < 0) {
            updateChips(-bet);
            messageEl.textContent = 'You lose!';
        } else {
            messageEl.textContent = "It's a tie!";
        }

        if (chips <= 0) {
            messageEl.textContent = 'Game over! You ran out of chips.';
            playButtonEl.disabled = true;
        }
    }

    playButtonEl.addEventListener('click', playRound);

    tg.ready();
});
