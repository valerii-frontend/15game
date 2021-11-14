// MAIN VARS
// ===========================================================================================
const board = document.querySelector(".board");
const body = document.querySelector("body");
const newGameBtn = document.querySelector(".header__new");
const reloadGameBtn = document.querySelector(".header__reload");
const field = board.getBoundingClientRect();
let score = document.querySelector(".header__value span");
let scoreCounter = 0;
let random = Math.floor(Math.random() * 100);
// ===========================================================================================
// INIT FUNCTION
function init() {
	body.style.background = 'url("https://picsum.photos/1920/1080") center/cover no-repeat';
	board.style.pointerEvents = "none";
	for (let index = 0; index <= 15; index++) {
		const item = document.createElement("div");
		item.innerText = index + 1;
		item.setAttribute("data-number", index + 1);
		item.setAttribute("data-value", index + 1);
		if (index == 15) {
			item.classList.add("empty");
			// item.innerText = "";
		}
		board.appendChild(item);
		item.classList.add("item");
		let itemCoord = item.getBoundingClientRect();
		let counter = index + 1;
		if (counter <= 4) {
			item.style.top = 0;
			item.style.left = `${item.offsetWidth * index}px`;
		} else if (counter <= 8 && counter > 4) {
			item.style.top = `${item.offsetHeight}px`;
			item.style.left = `${item.offsetWidth * (index - 4)}px`;
		} else if (counter <= 12 && counter > 8) {
			item.style.top = `${item.offsetHeight * 2}px`;
			item.style.left = `${item.offsetWidth * (index - 8)}px`;
		} else if (counter <= 16 && counter > 12) {
			item.style.top = `${item.offsetHeight * 3}px`;
			item.style.left = `${item.offsetWidth * (index - 12)}px`;
		}
	}
}
// START NEWGAME
function start(times) {
	const arrayEl = board.querySelectorAll(".item");
	let n = 0;
	while (n < times) {
		arrayEl.forEach((el) => {
			let number = el.getAttribute("data-number");
			el.click();
			if (el.getAttribute("data-number") !== number) {
				n++;
			}
		});
	}
}
// MOVE THE NUMBER ( MAIN LOGIC )
function move(e) {
	let clicked = e.target;
	let emptyEl = document.querySelector(".empty");
	let empty = emptyEl.getBoundingClientRect();
	let target = clicked.getBoundingClientRect();
	let emptyCoords = [emptyEl.offsetTop, emptyEl.offsetLeft];
	let targetCoords = [clicked.offsetTop, clicked.offsetLeft];
	let dataNums = [emptyEl.getAttribute("data-number"), clicked.getAttribute("data-number")];
	if (
		empty.top == target.top &&
		(empty.left - target.left == clicked.offsetWidth || empty.left - target.left == -clicked.offsetWidth)
	) {
		clicked.style.top = `${emptyCoords[0]}px`;
		clicked.style.left = `${emptyCoords[1]}px`;
		emptyEl.style.top = `${targetCoords[0]}px`;
		emptyEl.style.left = `${targetCoords[1]}px`;
		clicked.setAttribute("data-number", dataNums[0]);
		emptyEl.setAttribute("data-number", dataNums[1]);
	}
	if (
		empty.left == target.left &&
		(empty.top - target.top == clicked.offsetWidth || empty.top - target.top == -clicked.offsetWidth)
	) {
		clicked.style.top = `${emptyCoords[0]}px`;
		clicked.style.left = `${emptyCoords[1]}px`;
		emptyEl.style.top = `${targetCoords[0]}px`;
		emptyEl.style.left = `${targetCoords[1]}px`;
		clicked.setAttribute("data-number", dataNums[0]);
		emptyEl.setAttribute("data-number", dataNums[1]);
	}
}
// ADD TRANSITION
function getTransition() {
	let items = document.querySelectorAll(".item");
	setTimeout(() => {
		items.forEach((item) => {
			item.style.transition = "0.25s";
		});
	}, 1000);
}
// ===========================================================================================
// CHECK WINNER
function checkWinner() {
	const allItems = board.querySelectorAll(".item");
	let counter = 0;
	allItems.forEach((element) => {
		const points = element.getAttribute("data-number") == element.getAttribute("data-value");
		if (points) counter++;
	});
	return counter;
}
// WIN BANNER
function winnerPopUp() {
	const winner = document.createElement("div");
	winner.classList.add("win");
	winner.textContent = "You are winner!🎉";
	body.appendChild(winner);
	setTimeout(() => {
		location.reload();
	}, 3000);
}
// ===========================================================================================
// GAME CLICKS
board.addEventListener("click", function (e) {
	let target = e.target;
	let number = target.getAttribute("data-number");
	move(e);
	target.classList.add("clicked");
	setTimeout(() => {
		e.target.classList.remove("clicked");
	}, 1000);
	if (board.classList.contains("game") && checkWinner() == 16) {
		winnerPopUp();
	}

	if (
		board.classList.contains("game") &&
		e.target.classList.contains("item") &&
		number !== target.getAttribute("data-number")
	) {
		scoreCounter++;
		score.textContent = scoreCounter;
	}
});
// ===========================================================================================
//  FIRST LOAD AND RELOAD FUNCTION
function loading() {
	console.log("===================START===================");
	console.log("random - " + random);
	init();
	start(random);
	board.setAttribute("data-random", random);
	getTransition();
	board.classList.add("game");
	board.style.pointerEvents = "all";
}
window.addEventListener("load", loading);
// ===========================================================================================
// NEW GAME AND RELOAD BUTTONS

newGameBtn.addEventListener("click", (e) => location.reload());
reloadGameBtn.addEventListener("click", function (e) {
	board.innerHTML = "";
	board.classList.remove("game");
	board.style.transform = "scale(0)";
	board.style.opacity = 0;
	score.style.opacity = 0;
	init();
	start(board.getAttribute("data-random"));
	console.log("===================RELOAD===================");
	console.log("random - " + board.getAttribute("data-random"));
	setTimeout(() => {
		board.classList.add("game");
		board.style.pointerEvents = "all";
		board.style.opacity = 1;
		board.style.transform = "scale(1)";
		scoreCounter = 0;
		score.textContent = scoreCounter;
		score.style.opacity = 1;
		getTransition();
	}, 1000);
});
// ===========================================================================================
