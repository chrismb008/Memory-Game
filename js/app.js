const deck = document.querySelector('.deck');
let toggledCards = [];
let moves = 0;
let clockOff = true;
let time = 0;
let clockId;
let matched = 0;



// Create a list that holds all of your cards
// Display the cards on the page
// shuffle the list of cards using the provided "shuffle" method below
// loop through each card and create its HTML
// add each card's HTML to the page

function shuffleDeck() {
  const cardsToShuffle = Array.from(document.querySelectorAll('.deck li'));
  const shuffledCards = shuffle(cardsToShuffle);
  for (card of shuffledCards) {
    deck.appendChild(card);
  }
}
shuffleDeck()


// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


// set up the event listener for a card. If a card is clicked:
deck.addEventListener('click', event => {
  const clickTarget = event.target;
  if (isClickValid(clickTarget)) {
    if (clockOff) {
      startClock();
      clockOff = false;
    }
    toggleCard(clickTarget);
    addToggleCard(clickTarget);
    if (toggledCards.length === 2) {
          checkForMatch(clickTarget);
          addMove();
          checkScore();
    }
  }
});


// this function stops adding a shown or a matched cards to toggledCards array if I click on them again
function isClickValid(clickTarget) {
  return (
    clickTarget.classList.contains('card') &&
    !clickTarget.classList.contains('match') &&
    toggledCards.length < 2 &&
    !toggledCards.includes(clickTarget)
  );
}


// display the card's symbol (put this functionality in another function that you call from this one)
function toggleCard(card) {
  card.classList.toggle('open');
  card.classList.toggle('show');
}


// add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
function addToggleCard(clickTarget) {
  toggledCards.push(clickTarget);
}


// if the list already has another card, check to see if the two cards match
function checkForMatch() {
  if (
    toggledCards[0].firstElementChild.className ===
    toggledCards[1].firstElementChild.className
  ) {
    match(toggledCards);
    matched++;
    const pairs = 8;
    if (matched === pairs) {
      gameOver();
    }
  } else {
    notMatch(toggledCards);
  }
}


// if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
function match() {
  toggledCards[0].classList.toggle('match');
  toggledCards[1].classList.toggle('match');
  toggledCards = [];
}


// if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
function notMatch() {
  setTimeout(() => {
    toggleCard(toggledCards[0]);
    toggleCard(toggledCards[1]);
    toggledCards = [];
  }, 300);
}


// increment the move counter and display it on the page (put this functionality in another function that you call from this one)
function addMove() {
  moves++;
  const movesText = document.querySelector('.moves');
  movesText.innerHTML = moves;
}


// decrease the stars number
function checkScore() {
  if (moves === 10 || moves === 20
  ) {hideStar();
  }
}

function hideStar() {
  const starList = document.querySelectorAll('.stars li');
  for (star of starList) {
    if (star.style.display !== 'none') {
        star.style.display = 'none';
        break;
    }
  }
}


// count the stars for Modal information at the end of the game
function getStars() {
  stars = document.querySelectorAll('.stars li');
  starCount = 0;
  for (star of stars) {
    if (star.style.display !== 'none') {
      starCount++;
    }
  }
    return starCount;
}


// set the time
function startClock() {
  clockId = setInterval(() => {
    time++;
    displayTime();
  }, 1000);
}

function displayTime() {
  const timer = document.querySelector('.timer');
  timer.innerHTML = time +' seconds';
}

function stopClock() {
  clearInterval(clockId);
}


// set the reset function
function resetGame() {
  resetTime();
  resetMoves();
  resetStars();
  resetCards()
  shuffleDeck();
}

function resetTime() {
  stopClock();
  clockOff = true;
  time = 0;
  displayTime();
}

function resetMoves() {
  moves = 0;
  document.querySelector('.moves').innerHTML = moves;
}

function resetStars() {
  stars = 0;
  const starsList = document.querySelectorAll('.stars li');
  for (star of starsList) {
    star.style.display = 'inline';
  }
}

function resetCards() {
  const cards = document.querySelectorAll('.deck li');
  for (card of cards) {
    card.className = 'card';
  }
}

// add the reset functionality to the restart icon
document.querySelector('.restart').addEventListener('click', resetGame);

// add the reset functionality to the Modal "Go Again!" button
document.querySelector('#replay').addEventListener('click', resetGame);


// if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
function gameOver() {
  stopClock();
  $('#winnerText').text(`Time = ${time} seconds, Moves = ${moves}, Stars = ${getStars()}. Well done!`);
  $('#winnerModal').modal('toggle');
}
