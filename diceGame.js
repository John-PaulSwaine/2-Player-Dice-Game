document.addEventListener("DOMContentLoaded", () => {
  let currentPlayer = 1;
  let player1Total = 0;
  let player2Total = 0;
  let player1Name = "";
  let player2Name = "";
  let currentScore = 0;
  let gameActive = true;

  const newGameBtn = document.getElementById('newGameBtn');
  const rollBtn = document.getElementById('rollBtn');
  const holdBtn = document.getElementById('holdBtn');
  const coinTossSection = document.getElementById('coinTossSection');
  const messageDiv = document.getElementById('message');

  if (!newGameBtn || !rollBtn || !holdBtn || !coinTossSection || !messageDiv) {
    console.error('One or more essential elements are missing!');
    return;
  }

  // Load player names
  const loadPlayerNames = () => {
    player1Name = prompt('Enter name for Player 1:') || 'Player 1';
    player2Name = prompt('Enter name for Player 2:') || 'Player 2';
  };

  const startNewGame = () => {
    console.log('Starting new game...');

    document.getElementById('player1Name').textContent = player1Name;
    document.getElementById('player2Name').textContent = player2Name;

    coinTossSection.classList.remove('hidden');
    rollBtn.classList.add('hidden');
    holdBtn.classList.add('hidden');
    messageDiv.textContent = '';

    document.querySelectorAll('#diceImage, #dice1, #dice2, #dice3, #dice4, #dice5, #dice6').forEach(img => img.classList.add('hidden'));

    player1Total = 0;
    player2Total = 0;
    document.getElementById('player1Total').textContent = player1Total;
    document.getElementById('player2Total').textContent = player2Total;

    document.getElementById('choosePrompt').textContent = `${currentPlayer === 1 ? player1Name : player2Name}, choose Heads or Tails:`;
    document.getElementById('cointoss').classList.remove('hidden');
    gameActive = true;
  };

  const selectCoin = (choice) => {
    if (!gameActive) return;
    console.log(`Coin selected: ${choice}`);
    
    const result = Math.random() < 0.5 ? 'heads' : 'tails';
    document.getElementById(result).classList.remove('hidden');

    if (choice === result) {
      messageDiv.textContent = `${currentPlayer === 1 ? player1Name : player2Name} goes first!`;
    } else {
      currentPlayer = currentPlayer === 1 ? 2 : 1;
      messageDiv.textContent = `${currentPlayer === 1 ? player1Name : player2Name} goes first!`;
    }

    setTimeout(() => {
      document.getElementById('heads').classList.add('hidden');
      document.getElementById('tails').classList.add('hidden');
      coinTossSection.classList.add('hidden');
      rollBtn.classList.remove('hidden');
      holdBtn.classList.remove('hidden');
    }, 1000);
  };

  const rollDice = () => {
    if (!gameActive) return;
    console.log('Rolling dice...');
    
    document.querySelectorAll('#dice1, #dice2, #dice3, #dice4, #dice5, #dice6').forEach(img => img.classList.add('hidden'));
    document.getElementById('diceImage').classList.remove('hidden');

    setTimeout(() => {
      document.getElementById('diceImage').classList.add('hidden');

      const diceRoll = Math.floor(Math.random() * 6) + 1;
      document.getElementById(`dice${diceRoll}`).classList.remove('hidden');

      currentScore += diceRoll;

      if (diceRoll === 1) {
        messageDiv.textContent = `Oops! ${currentPlayer === 1 ? player1Name : player2Name} rolled a 1. Turn over.`;
        currentScore = 0;
        switchPlayer();
      } else {
        document.getElementById(`player${currentPlayer}Current`).textContent = currentScore;
      }
    }, 1000);
  };

  const hold = () => {
    if (!gameActive) return;
    console.log('Holding...');
    
    if (currentPlayer === 1) {
      player1Total += currentScore;
      document.getElementById('player1Total').textContent = player1Total;
    } else {
      player2Total += currentScore;
      document.getElementById('player2Total').textContent = player2Total;
    }

    currentScore = 0;
    document.getElementById(`player${currentPlayer}Current`).textContent = currentScore;
    checkForWinner();
    if (gameActive) {
      switchPlayer();
    }
  };

  const switchPlayer = () => {
    if (!gameActive) return;
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    messageDiv.textContent = `It's ${currentPlayer === 1 ? player1Name : player2Name}'s turn!`;
    document.getElementById('choosePrompt').textContent = `${currentPlayer === 1 ? player1Name : player2Name}, choose Heads or Tails:`;

    // Only show the coin toss section if the game is in the initial state
    if (!document.querySelector('.hidden')) {
      coinTossSection.classList.remove('hidden');
    }
  };

  const checkForWinner = () => {
    if (player1Total >= 50) {
      endGame(`${player1Name} wins! Congratulations!`);
    } else if (player2Total >= 50) {
      endGame(`${player2Name} wins! Congratulations!`);
    }
  };

  const endGame = (winnerMessage) => {
    gameActive = false;
    rollBtn.classList.add('hidden');
    holdBtn.classList.add('hidden');
    document.querySelectorAll('#diceImage, #dice1, #dice2, #dice3, #dice4, #dice5, #dice6').forEach(img => img.classList.add('hidden'));
    messageDiv.textContent = winnerMessage;
  };

  // Load player names or prompt if not already set
  loadPlayerNames();

  // Attach event listeners
  newGameBtn.addEventListener('click', () => {
    startNewGame();
    // Save names to localStorage only when starting a new game
    localStorage.setItem('player1Name', player1Name);
    localStorage.setItem('player2Name', player2Name);
  });

  rollBtn.addEventListener('click', rollDice);
  holdBtn.addEventListener('click', hold);

  document.getElementById('headsBtn').addEventListener('click', () => selectCoin('heads'));
  document.getElementById('tailsBtn').addEventListener('click', () => selectCoin('tails'));
});
