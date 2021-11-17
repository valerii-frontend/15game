// MAIN VARS
// ===========================================================================================
const board = document.querySelector(".board");
const body = document.querySelector("body");
const newGameBtn = document.querySelector(".header__new");
const reloadGameBtn = document.querySelector(".header__reload");
const audio = document.querySelector("audio");
const field = board.getBoundingClientRect();
let score = document.querySelector(".header__value span");
let scoreCounter = 0;
let randomArr = 0;
// let random = Math.floor(Math.random() * 1000);
// ===========================================================================================
// INIT FUNCTION
function init() {
	board.style.pointerEvents = "none";

	for (let index = 0; index <= 15; index++) {
		const item = document.createElement("div");
		item.setAttribute("data-startPosition", index + 1);
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
// MOVE THE NUMBER ( MAIN LOGIC )
function move(e) {
	let clicked = e.target;
	console.log("click");
	let emptyEl = document.querySelector(".empty");
	let empty = emptyEl.getBoundingClientRect();
	let target = clicked.getBoundingClientRect();
	let emptyCoords = [emptyEl.offsetTop, emptyEl.offsetLeft];
	let targetCoords = [clicked.offsetTop, clicked.offsetLeft];
	let dataPos = [emptyEl.getAttribute("data-currentplace"), clicked.getAttribute("data-currentplace")];
	if (
		empty.top == target.top &&
		(empty.left - target.left == clicked.offsetWidth || empty.left - target.left == -clicked.offsetWidth)
	) {
		clicked.style.top = `${emptyCoords[0]}px`;
		clicked.style.left = `${emptyCoords[1]}px`;
		emptyEl.style.top = `${targetCoords[0]}px`;
		emptyEl.style.left = `${targetCoords[1]}px`;
		clicked.setAttribute("data-currentplace", dataPos[0]);
		emptyEl.setAttribute("data-currentplace", dataPos[1]);
	}
	if (
		empty.left == target.left &&
		(empty.top - target.top == clicked.offsetWidth || empty.top - target.top == -clicked.offsetWidth)
	) {
		clicked.style.top = `${emptyCoords[0]}px`;
		clicked.style.left = `${emptyCoords[1]}px`;
		emptyEl.style.top = `${targetCoords[0]}px`;
		emptyEl.style.left = `${targetCoords[1]}px`;
		clicked.setAttribute("data-currentplace", dataPos[0]);
		emptyEl.setAttribute("data-currentplace", dataPos[1]);
	}
}
// ===========================================================================================
// CHECK WINNER
function checkWinner() {
	const allItems = board.querySelectorAll(".item");
	let counter = 0;
	allItems.forEach((element) => {
		const points = element.getAttribute("data-startPosition") == element.getAttribute("data-currentPlace");
		if (points) counter++;
	});
	return counter;
}
// WIN BANNER
function winnerPopUp() {
	const winner = document.createElement("div");
	audio.setAttribute("src", "./sound/win.mp3");
	playSound();
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
	let position = target.getAttribute("data-currentplace");
	move(e);
	if (target.getAttribute("data-startPosition") == target.getAttribute("data-currentPlace"))
		target.classList.add("place");
	else target.classList.remove("place");
	playSound();
	if (board.classList.contains("game") && checkWinner() == 16) {
		winnerPopUp();
	}
	if (position !== target.getAttribute("data-currentplace")) {
		scoreCounter++;
		score.textContent = scoreCounter;
	}
});
// ===========================================================================================
//  FIRST LOAD FUNCTION
function loading() {
	console.log("===================START===================");
	init();
	sort();
	board.classList.add("game");
	board.style.pointerEvents = "all";
}
window.addEventListener("load", loading);
// ===========================================================================================
// NEW GAME AND RELOAD BUTTONS

newGameBtn.addEventListener("click", (e) => location.reload());
reloadGameBtn.addEventListener("click", function (e) {
	board.innerHTML = "";
	init();
	reload();
	board.style.transform = "scale(0)";
	board.style.opacity = 0;
	score.style.opacity = 0;
	console.log("===================RELOAD===================");
	setTimeout(() => {
		board.style.pointerEvents = "all";
		board.classList.add("game");
		board.style.opacity = 1;
		board.style.transform = "scale(1)";
		scoreCounter = 0;
		score.textContent = scoreCounter;
		score.style.opacity = 1;
	}, 1000);
});
// ===========================================================================================
// SOUND FUNC

function playSound() {
	audio.pause();
	let playPromise = audio.play();
	if (playPromise !== undefined)
		playPromise.then(() => console.log("sound-click")).catch((error) => console.log(error));
}
// ===========================================================================================
// SORT
function sort() {
	const arrayEl = board.querySelectorAll(".item");
	const map = [...arrayEl].map((x) => x.getAttribute("data-startPosition"));
	for (let i = map.length - 1; i > 0; i--) {
		let j = Math.floor(Math.random() * (i + 1)); // случайный индекс от 0 до i
		[map[i], map[j]] = [map[j], map[i]];
	}
	randomArr = map;
	console.log(randomArr);
	arrayEl.forEach((element, i) => {
		element.setAttribute("data-startPosition", map[i]);
		element.setAttribute("data-currentPlace", i + 1);
		element.innerText = Number(map[i]);
		if (map[i] == 16) {
			element.classList.add("empty");
			element.innerText = "";
		}
	});
}

// ===========================================================================================
// RELOAD
function reload() {
	const arrayEl = board.querySelectorAll(".item");
	console.log(randomArr);
	arrayEl.forEach((element, i) => {
		element.setAttribute("data-startPosition", randomArr[i]);
		element.setAttribute("data-currentPlace", i + 1);
		element.innerText = Number(randomArr[i]);
		if (randomArr[i] == 16) {
			element.classList.add("empty");
			element.innerText = "";
		}
	});
}
