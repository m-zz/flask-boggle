"use strict";

const $playedWords = $("#words");
const $form = $("#newWordForm");
const $wordInput = $("#wordInput");
const $message = $(".msg");
const $table = $("table");
const $score = $(".score");
const $reset = $(".reset");

let gameId;
let playedWords = new Set();
let score = 0;


/** Start */

async function start() {
  let response = await axios.get("/api/new-game");
  gameId = response.data.gameId;
  let board = response.data.board;
  displayBoard(board);
}

/** Display board */

function displayBoard(board) {
  $table.empty();
   
  for (let i = 0; i < board.length; i++){
    let $newRow = $("<tr></tr>")

    for (let j = 0 ; j < board.length; j++){
      $newRow.append($(`<td>${board[i][j]}</td>`));
    }
    $table.append($newRow)
  }
}

start();

$form.on("submit", async (evt) => {
  evt.preventDefault();
  $message.removeClass();
  $message.html("");
  let word = $wordInput.val().toUpperCase();

  let result = await axios({
    url: "/api/score-word",
    method: "POST",
    data: { word, gameId }
  }); 

  if (JSON.stringify(result.data) === JSON.stringify({ result: "not-word" })) {
    $message.addClass("msg err");
    $message.html(`${word} is not a valid word!`);
  } else if (JSON.stringify(result.data) === JSON.stringify({ result: "not-on-board" })) {
    $message.addClass("msg err");
    $message.html(`${word} is not on the board!`);
  } else if (playedWords.has(word)) {
    $message.addClass("msg ok");
    $message.html(`${word} has already been found!`);
  } else {
    $playedWords.append($(`<li>${word} - ${result.data.result}</li>`));
    playedWords.add(word);
    score += +result.data.result;
    $score.html(score);
  }

  $wordInput.val("");
})

$reset.on("click", () => location.reload());

