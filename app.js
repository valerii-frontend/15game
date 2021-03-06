"use strict";
// MAIN VARS
// ===========================================================================================
const board = document.querySelector(".board");
const body = document.querySelector("body");
const header = document.querySelector(".header");
// all buttons
const buttons = {
	newGame: document.querySelector(".header__new"),
	reload: document.querySelector(".header__reload"),
	about: document.querySelector(".about__btn"),
	mute: document.querySelector(".muted"),
};
const audio = document.querySelector("audio");
const score = { element: document.querySelector(".header__value span"), counter: 0 };
// time obj
const time = {
	minEl: document.querySelector(".header__min"),
	secEl: document.querySelector(".header__sec"),
	min: 0,
	sec: 0,
	start: function () {
		this.secEl.textContent = "00";
		this.minEl.textContent = "00";
		this.secEl.style.opacity = 0;
		this.minEl.style.opacity = 0;
		this.min = 0;
		this.sec = 0;
		setTimeout(() => {
			this.secEl.style.opacity = 1;
			this.minEl.style.opacity = 1;
		}, 1000);
	},
};
// current mix
let currentGameArray = 0;
let width;
const rules = document.querySelector(".about__rules");
// ELEMENT CLASS
class Tag {
	constructor(element) {
		this.element = element;
		this.top = this.element.offsetTop;
		this.left = this.element.offsetLeft;
		this.position = this.element.getAttribute("data-currentplace");
	}
	setData(item) {
		this.element.style.top = `${item.top}px`;
		this.element.style.left = `${item.left}px`;
		this.element.setAttribute("data-currentplace", item.position);
		item.element.style.top = `${this.top}px`;
		item.element.style.left = `${this.left}px`;
		item.element.setAttribute("data-currentplace", this.position);
	}
}

// ===========================================================================================
// INIT FUNCTION
function init() {
	board.style.pointerEvents = "none";
	board.style.transform = "scale(1)";

	for (let index = 0; index <= 15; index++) {
		const item = document.createElement("div");
		item.setAttribute("data-startPosition", index + 1);

		board.appendChild(item);
		item.classList.add("item");
		width = item.offsetWidth;
		let counter = index + 1;
		if (counter <= 4) {
			item.style.top = 0;
			item.style.left = `${width * index}px`;
		} else if (counter <= 8 && counter > 4) {
			item.style.top = `${width}px`;
			item.style.left = `${width * (index - 4)}px`;
		} else if (counter <= 12 && counter > 8) {
			item.style.top = `${width * 2}px`;
			item.style.left = `${width * (index - 8)}px`;
		} else if (counter <= 16 && counter > 12) {
			item.style.top = `${width * 3}px`;
			item.style.left = `${width * (index - 12)}px`;
		}
	}
}
// MOVE THE NUMBER ( MAIN LOGIC )
function move(e) {
	const empty = new Tag(document.querySelector(".empty"));
	const target = new Tag(e.target);
	if (empty.top == target.top && (empty.left - target.left == width || empty.left - target.left == -width)) {
		empty.setData(target);
		target.setData(empty);
	}
	if (empty.left == target.left && (empty.top - target.top == width || empty.top - target.top == -width)) {
		empty.setData(target);
		target.setData(empty);
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
// POPUP
function popUp(textClass, string, sound) {
	const popUpEl = document.createElement("div");
	audio.setAttribute("src", `./sound/${sound}.mp3`);
	playSound();
	popUpEl.classList.add("popUp");
	popUpEl.classList.add(textClass);
	popUpEl.innerHTML = string;
	body.appendChild(popUpEl);
	setTimeout(() => {
		location.reload();
	}, 7000);
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

	if (board.classList.contains("game") && checkWinner() == 16) {
		let winString = `<span class='popUp__string'>You are winner!</span><span>Your time is <span class='popUp__time'>${
			time.min < 10 ? "0" + time.min : time.min
		} </span> min. <span class='popUp__time'>${
			time.sec < 10 ? "0" + time.sec : time.sec
		}</span> sec.</span><span>It took you <span class='popUp__score'>${
			score.counter + 1
		}</span> moves to solve the puzzle</span>`;
		popUp("popUp_win", winString, "win");
		board.querySelectorAll(".item").forEach((e, i) => {
			setTimeout(() => {
				e.classList.add("win");
			}, `${i}00`);
		});
	}
	if (position !== target.getAttribute("data-currentplace")) {
		score.counter++;
		playSound();
		score.element.textContent = score.counter;
	}
});
// ===========================================================================================
//  FIRST LOAD FUNCTION
function loading() {
	console.log("===================START===================");
	init();
	sort();
	timer();
	board.classList.add("game");
	board.style.pointerEvents = "all";
}
window.addEventListener("load", loading);
// ===========================================================================================
// BUTTONS EVENTS
// NEW
buttons.newGame.addEventListener("click", (e) => {
	board.style.transform = "scale(0)";
	audio.setAttribute("src", "./sound/newgame.mp3");
	playSound();
	setTimeout(() => {
		location.reload();
	}, 1500);
});
// RELOAD
buttons.reload.addEventListener("click", function (e) {
	audio.setAttribute("src", "./sound/newgame.mp3");
	playSound();
	setTimeout(() => {
		audio.setAttribute("src", "./sound/click.mp3");
	}, 1500);
	board.innerHTML = "";
	init();
	reload();
	time.start();
	board.style.transform = "scale(0)";
	board.style.opacity = 0;
	score.element.style.opacity = 0;
	buttons.mute.style.opacity = 0;
	console.log("===================RELOAD===================");
	setTimeout(() => {
		board.style.pointerEvents = "all";
		board.classList.add("game");
		board.style.opacity = 1;
		board.style.transform = "scale(1)";
		score.counter = 0;
		score.element.textContent = score.counter;
		score.element.style.opacity = 1;
		buttons.mute.style.opacity = 1;
	}, 1000);
});
// ABOUT
buttons.about.addEventListener("click", function (e) {
	if (this.classList.contains("about__btn_active")) {
		rules.classList.remove("about__rules_active");
		this.classList.remove("about__btn_active");
		header.classList.remove("header_active");
	} else {
		this.classList.add("about__btn_active");
		rules.classList.add("about__rules_active");
		header.classList.add("header_active");
	}
});
// MUTE
buttons.mute.addEventListener("click", function (e) {
	if (this.classList.contains("muted_active")) {
		this.classList.remove("muted_active");
		this.innerHTML = '<img src="./icons/sound.svg" alt="on" />';
		audio.muted = false;
	} else {
		this.innerHTML = '		<img src="./icons/muted.svg" alt="off" />';
		this.classList.add("muted_active");
		audio.muted = true;
	}
});
// ===========================================================================================
// SOUND FUNC

function playSound() {
	audio.pause();
	audio.play();
	// let playPromise = audio.play();
	// if (playPromise !== undefined) playPromise.catch((error) => console.log(error));
}
// ===========================================================================================
// FIND THE ROW WITH EMPTY AND GET IT SUMMARY
function getRow(array) {
	let rowObj = { 1: [], 2: [], 3: [], 4: [] };
	let sum = 0;
	array.forEach((element, index) => {
		if (element == 16) element = 0;
		if (index >= 0 && index < 4) rowObj[1].push(+element); //1
		if (index >= 4 && index < 8) rowObj[2].push(+element); //2
		if (index >= 8 && index < 12) rowObj[3].push(+element); //3
		if (index >= 12) rowObj[4].push(+element); //4
	});
	for (let i = 1; i <= 4; i++) {
		if (rowObj[i].includes(0)) sum += i;
	}
	array.forEach((element, index) => {
		if (element == 16) element = 0;
		for (let i = index + 1; i < array.length; i++) {
			let arrItem = array[i];
			if (element > arrItem) sum++;
		}
	});
	return sum;
}
// ===========================================================================================
// SORT
function sort() {
	const arrayEl = board.querySelectorAll(".item");
	const map = [...arrayEl].map((x) => +x.getAttribute("data-startPosition"));
	let n = 0;
	while (n < 100) {
		for (let i = map.length - 1; i > 0; i--) {
			let j = Math.floor(Math.random() * (i + 1));
			[map[i], map[j]] = [map[j], map[i]];
		}
		console.log(getRow(map));
		if (getRow(map) % 2 == 0) {
			break;
		} else {
			n++;
		}
	}
	// const map = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 16, 15];
	currentGameArray = map;
	console.log(map);
	arrayEl.forEach((element, i) => {
		element.setAttribute("data-startPosition", map[i]);
		element.setAttribute("data-currentPlace", i + 1);
		element.innerText = Number(map[i]);
		element.setAttribute("title", Number(map[i]));
		if (map[i] == 16) {
			element.classList.add("empty");
			element.innerText = "";
		}
	});
}

// getRow() == 0 || >0
// ===========================================================================================
// RELOAD
function reload() {
	const arrayEl = board.querySelectorAll(".item");
	arrayEl.forEach((element, i) => {
		element.setAttribute("data-startPosition", currentGameArray[i]);
		element.setAttribute("data-currentPlace", i + 1);
		element.setAttribute("title", currentGameArray[i]);
		element.innerText = Number(currentGameArray[i]);

		if (currentGameArray[i] == 16) {
			element.classList.add("empty");
			element.innerText = "";
		}
	});
}
// ===========================================================================================
// TIMER
function timer() {
	setInterval(() => {
		if (time.sec == 60) {
			time.sec = 0;
			time.min++;
			time.minEl.textContent = time.min < 10 ? "0" + time.min : time.min;
		}

		time.secEl.textContent = time.sec < 10 ? "0" + time.sec : time.sec;
		time.sec++;
	}, 1000);
}
