"use strict";

const $playedWords = $("#words");
const $form = $("#newWordForm");
const $wordInput = $("#wordInput");
const $message = $(".msg");
const $table = $("table");

let gameId;


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
  let word = $wordInput.val().toUpperCase();

  let result = await axios({
    url: "/api/score-word",
    method: "POST",
    data: { word, gameId }
  });

  console.log(result.data);

  if (JSON.stringify(result.data) === JSON.stringify({result: "not-word"}) || 
  JSON.stringify(result.data) === JSON.stringify({result: "not-on-board"})){
    $message.html("Please play a valid word")
  }

  else{
    $playedWords.append($(`<li>${word}</li>`))
  }

})
