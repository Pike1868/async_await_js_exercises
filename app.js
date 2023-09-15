const NUMBERS_API_BASE_URL = `http://numbersapi.com/`;
const FAV_NUM = 14;

// Part 1 ========================================================
// ==== #1
async function getNumFact(num) {
  resp = await axios.get(`${NUMBERS_API_BASE_URL}${num}?json`);
  // console.log(resp.data.text);
}

getNumFact(FAV_NUM);

// ==== #2

async function getBatchNumFacts() {
  return await axios.get(`http://numbersapi.com/1..5`);
}

getBatchNumFacts().then((response) => {
  let data = response.data;
  for (i = 1; i < 6; i++) {
    $("#2").append(`<li>${data[i]}</li>`);
  }
});

// ==== #3

async function getFavNumFacts(num) {
  let favNumArray = await Promise.all([
    axios.get(`${NUMBERS_API_BASE_URL}${num}?json`),
    axios.get(`${NUMBERS_API_BASE_URL}${num}?json`),
    axios.get(`${NUMBERS_API_BASE_URL}${num}?json`),
    axios.get(`${NUMBERS_API_BASE_URL}${num}?json`),
  ]);

  for (i = 0; i < favNumArray.length; i++) {
    // console.log(favNumArray[i].data.text);
  }
}

getFavNumFacts(FAV_NUM);

// PART 2 ========================================================

const SHUFFLED_DECK_BASE_URL = `https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1`;

const DRAW_CARD_BASE_URL = `https://deckofcardsapi.com/api/deck/`;

// ==== #1

async function getShuffledDeckId() {
  let resp = await axios.get(SHUFFLED_DECK_BASE_URL);
  return resp.data.deck_id;
}

async function drawSingleCard(deckId) {
  let resp = await axios.get(`${DRAW_CARD_BASE_URL}${deckId}/draw/?count=1`);
  let deck_remaining = resp.data.remaining;
  let card = resp.data.cards[0];
  console.log("Remaining cards in deck:", deck_remaining);
  return card;
}

// ==== #2
let cardsArr = [];

async function drawTwoCards() {
  let deckId = await getShuffledDeckId();

  let card1 = await drawSingleCard(deckId);
  cardsArr.push(card1);
  console.log("First Card:",card1);

  let card2 = await drawSingleCard(deckId);
  cardsArr.push(card2);
  console.log("Second Card:",card2);

  cardsArr.forEach((card) => {
    console.log(card.value, "of", card.suit);
    $("#second_card_container").append(`<p>${card.value} of ${card.suit}</p>`);
  });
}

drawTwoCards();

// ==== #3

let z_index = 0;
let currentDeckId;

async function initializeDeck() {
  currentDeckId = await getShuffledDeckId();
}

initializeDeck();

async function getCard() {
  let card = await drawSingleCard(currentDeckId);

  if (card) {
    console.log(card);
    $("#deck_container").append(
      `<img src=${
        card.image
      } style="z-index:${z_index}; position: absolute; top: ${z_index}px; transform:rotate(${
        Math.random() * 90
      }deg); margin:150px;"></img>`
    );
    z_index++;
  } else {
    alert("The deck is out of cards!");
    location.reload();
  }
}

$("button").on("click", getCard);
