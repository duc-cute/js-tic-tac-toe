/** @format */

import { GAME_STATUS, TURN } from "./constants.js";
import {
  getCellElementAtIdx,
  getCellElementList,
  getCurrentTurnElement,
  getGameStatusElement,
  getReplayButtonElement,
} from "./selectors.js";
import { checkGameStatus } from "./utils.js";

let currentTurn = TURN.CROSS;
let gameStatus = GAME_STATUS.PLAYING;
let isGameEnded = false;
let cellValues = new Array(9).fill("");

function toggleCurrentTurn() {
  currentTurn = currentTurn === TURN.CROSS ? TURN.CIRCLE : TURN.CROSS;

  let currentTurnElement = getCurrentTurnElement();
  currentTurnElement.classList.remove(TURN.CIRCLE, TURN.CIRCLE);
  currentTurnElement.classList.add(currentTurn);
}

function updateGameStatus(newGameStatus) {
  gameStatus = newGameStatus;
  const elementStatus = getGameStatusElement();
  elementStatus.textContent = isGameEnded ? gameStatus : gameStatus + " win";
}

function showReplayButton() {
  const btnReplay = getReplayButtonElement();
  if (btnReplay) {
    btnReplay.classList.add("show");
  }
}

function highlightWinCell(winCell) {
  const cellElementList = getCellElementList();
  winCell.forEach((index) => cellElementList[index].classList.add("win"));
}

function handleCell(cellEl, index) {
  const isClicked =
    cellEl.classList.contains(TURN.CIRCLE) ||
    cellEl.classList.contains(TURN.CROSS);
  isGameEnded = gameStatus !== GAME_STATUS.PLAYING;
  if (isClicked || isGameEnded) return;

  let currentValueCell = currentTurn === TURN.CROSS ? "X" : "O";
  cellValues.splice(index, 1, currentValueCell);

  const game = checkGameStatus(cellValues);
  switch (game.status) {
    case GAME_STATUS.ENDED: {
      //update game status
      updateGameStatus(game.status);

      //show replay button
      showReplayButton();

      break;
    }
    case GAME_STATUS.X_WIN:
    case GAME_STATUS.O_WIN: {
      //update game status
      updateGameStatus(game.status);

      //show replay button
      showReplayButton();

      //highlight win cell
      highlightWinCell(game.winPositions);
      break;
    }

    default: {
    }
  }
  cellEl.classList.add(currentTurn);

  //toggle Turnn
  toggleCurrentTurn();
}

function initCellElement() {
  const cellElementList = getCellElementList();
  cellElementList.forEach((cellEl, index) =>
    cellEl.addEventListener("click", () => handleCell(cellEl, index))
  );
}

function resetGame() {
  //Reset variables global
  currentTurn = TURN.CROSS;
  gameStatus = GAME_STATUS.PLAYING;
  isGameEnded = false;
  cellValues = cellValues.map(() => "");

  let currentTurnElement = getCurrentTurnElement();
  currentTurnElement.classList.remove(TURN.CIRCLE, TURN.CIRCLE);
  currentTurnElement.classList.add(TURN.CROSS);

  const cellElementList = getCellElementList();
  for (const cellEl of cellElementList) {
    cellEl.classList.remove(TURN.CIRCLE, TURN.CROSS, "win");
  }

  updateGameStatus(GAME_STATUS.PLAYING);
}

function initReplayButton() {
  const btnReplay = getReplayButtonElement();
  btnReplay.addEventListener("click", resetGame);
}
/**
 * TODOs
 *
 * 2. On cell click, do the following:
 *    - Toggle current turn
 *    - Mark current turn to the selected cell
 *    - Check game state: win, ended or playing
 *    - If game is win, highlight win cells
 *    - Not allow to re-click the cell having value.
 *
 * 3. If game is win or ended --> show replay button.
 * 4. On replay button click --> reset game to play again.
 *
 */

(() => {
  // 1. Bind click event for all cells
  initCellElement();
  initReplayButton();
})();
