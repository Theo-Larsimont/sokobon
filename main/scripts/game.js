"use strict";

let currenLevel = 0;
let countMove = 0;
let state = new State(null, null);
const stockage = localStorage;
/**
 * builds the level entered in parameter .
 * @param {number} level number level
 */
function buildLevel(level) {
    const map = levels[level].map;
    currenLevel = level;
    $("#world").empty();
    const world = $("#world");
    for (const line of map) {
        const row = $("<div>").addClass("row");
        for (const item of line) {
            row.append($("<div>")
                .addClass("square")
                .addClass(squareItemMap(item)));
        }
        world.append(row);
    }
    $("#target").text(levels[currenLevel].best);
    if (stockage[countMove] != null) {
        $("#best").text(stockage[currenLevel]);
    }
}

// give a class to each character of a level
const squareMap = new Map([
    [" ", "floor"],
    ["x", "cible"],
    ["#", "box"],
    ["@", "target box cible"],
    ["🧍", "player"],
]);

/**
 * assign a class according to the one given previously in squareMap
 * @param {string} c
 * @returns {string}
 */
function squareItemMap(c) {
    return squareMap.get(c) ?? "wall";
}
class Position {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

/**
 * create a position object
 */
// const position = {
//     x: 0,
//     y: 0,
// };

/**
 * gives the position of the player in the game
 * @returns position of player
 */
function getPlayerPosition() {
    const player = $(".player");
    const playerPos = new Position(player.parent().index(), player.index());
    return playerPos;
}

/**
 * gives the set of classes of a square at a given position
 * @param {Position} pos
 */
function getSquareAt(pos) {
    const x = pos.x;
    const y = pos.y;
    return $("#world").children()[x].children[y];
}

/**
 * depending on the arrow pressed by the player update
 * the position if the level is over ask to press space to go to the next level
 * @param {{ keyCode: number; code: number; }} e
 */
function move(e) {
    if (!allOnTarget()) {
        let oldplayerPos = new Position();
        oldplayerPos = getPlayerPosition();
        const newPlayerPos = new Position();
        newPlayerPos.x = oldplayerPos.x;
        newPlayerPos.y = oldplayerPos.y;
        const boxPos = new Position();
        boxPos.x = oldplayerPos.x;
        boxPos.y = oldplayerPos.y;
        switch (e.keyCode) {
        case 40:
            newPlayerPos.x = newPlayerPos.x + 1;
            boxPos.x = newPlayerPos.x + 1;
            break;
        case 39:
            newPlayerPos.y = newPlayerPos.y + 1;
            boxPos.y = newPlayerPos.y + 1;
            break;
        case 38:
            newPlayerPos.x = newPlayerPos.x - 1;
            boxPos.x = newPlayerPos.x - 1;
            break;
        case 37:
            newPlayerPos.y = newPlayerPos.y - 1;
            boxPos.y = newPlayerPos.y - 1;
            break;
        case 82:
            initLevel();
            break;
        case 85:
            annulation();
            break;
        }
        displayMove(oldplayerPos, newPlayerPos, boxPos);
    } else {
        $("#world").append("Appuyer sur espace pour passer au niveau suivant");
        if (countMove < stockage[currenLevel] || stockage[currenLevel] == null) {
            stockage[currenLevel] = countMove;
        }
        if (currenLevel === 6) {
            alert("Bravo vous avez fini le jeu !");
        } else if (e.keyCode === 32) {
            currenLevel++;
            initLevel();
        }
    }
}

/**
 *
 * @param {Position} oldplayerPos;
 * @param {Position} newPlayerPos;
 * @param {Position} boxPos;
 */
function displayMove(oldplayerPos, newPlayerPos, boxPos) {
    let square = getSquareAt(newPlayerPos);
    if (square.classList.contains("box")) {
        state = new State(oldplayerPos, boxPos);
        square = getSquareAt(boxPos);
        if (!square.classList.contains("box")
            && !square.classList.contains("wall")) {
            if (square.classList.contains("cible")) {
                $(square).addClass("target");
            }
            $(square).removeClass("floor");
            $(square).addClass("box");
            square = getSquareAt(oldplayerPos);
            $(square).removeClass("player");
            $(square).addClass("floor");
            square = getSquareAt(newPlayerPos);
            $(square).removeClass("box");
            $(square).removeClass("target");
            $(square).addClass("player");
            countMove++;
        }
    } else if (!square.classList.contains("wall")) {
        state = new State(oldplayerPos);
        square = getSquareAt(oldplayerPos);
        $(square).removeClass("player");
        $(square).addClass("floor");
        square = getSquareAt(newPlayerPos);
        $(square).addClass("player");
        countMove++;
    }
    console.log(state);
    $("#nb_move").text(countMove);
}
/**
 * check if all boxes are on target
 * @returns true if all boxe are on target
 */
function allOnTarget() {
    const allcible = $(".cible");
    let allBoxCible = true;
    for (let i = 0; i < allcible.length; ++i) {
        if (!allcible[i].classList.contains("box")) {
            allBoxCible = false;
        }
    }
    return allBoxCible;
}

/**
 * builds the level with the current level and resets the movement counter to 0
 */
function initLevel() {
    buildLevel(currenLevel);
    countMove = 0;
}

function annulation() {
    const square1 = getSquareAt(state.playerPos);
    const square2 = getSquareAt(getPlayerPosition());
    $(square1).addClass("player");
    $(square2).removeClass("player");
    if (state.oldBoxPos !== undefined) {
        const square3 = getSquareAt(state.oldBoxPos);
        $(square2).addClass("box");
        $(square3).removeClass("box");
        $(square3).addClass("floor");
        $(square3).removeClass("target");
    }
}

function reset() {
    stockage.clear();
}
$(function() {
    initLevel();
    $(document).on("keydown", move);
});
