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
        const randomIndex = crypto.getRandomValues(new Uint32Array(1))[0] % cards.length;
        return cards[randomIndex];
    }

    function compareCards(card1, card2) {
        return cards.indexOf(card1) - cards.indexOf(card2);
    }
    function playWar(initialBet) {
        let warPot = initialBet * 2;
        let playerWar, opponentWar;
    
        messageEl.textContent = "It's a tie! Going to war!";
    
        // Draw 3 face-down cards and 1 face-up card for each player
        for (let i = 0; i < 3; i++) {
            drawCard(); // Face-down card for player
            drawCard(); // Face-down card for opponent
            warPot += initialBet * 2;
        }
    
        playerWar = drawCard();
        opponentWar = drawCard();
    
        playerCardEl.textContent = playerWar;
        opponentCardEl.textContent = opponentWar;
    
        const warResult = compareCards(playerWar, opponentWar);
    
        if (warResult > 0) {
            updateChips(warPot);
            messageEl.textContent = `You win the war! You won ${warPot} chips!`;
        } else if (warResult < 0) {
            updateChips(-warPot);
            messageEl.textContent = `You lost the war! You lost ${warPot} chips.`;
        } else {
            // Recursive call for another war
            playWar(warPot / 2);
        }
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
            playWar(bet);
        }
    
        if (chips <= 0) {
            messageEl.textContent = 'Game over! You ran out of chips.';
            playButtonEl.disabled = true;
        }
    }

    playButtonEl.addEventListener('click', playRound);

    tg.ready();
});
