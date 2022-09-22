const tabs = document.querySelectorAll('.tabheader__item'),
	tabsParent = document.querySelector('.tabheader__items'),
	tabContent = document.querySelectorAll('.tabcontent');


function hideTabContent() {
	tabContent.forEach(item => {
		item.classList.add('hide');
		item.classList.remove('add', 'fade');
	})
}

function showTabContent(index = 0) {
	tabContent[index].classList.remove('hide');
	tabContent[index].classList.add('show', 'fade');
	tabs[index].classList.add('tabheader__item_active');
}

hideTabContent()
showTabContent()

tabsParent.addEventListener('click', (e) => {
	const target = e.target;
	if (target.matches('.tabheader__item')) {
		tabs.forEach((item, i) => {
			if (item === target) {
				hideTabContent();
				showTabContent(i)
			} else {
				item.classList.remove('tabheader__item_active');
			}
		})
	}
});


function setTimer(deadline) { // Установка таймера
	const timerDays = document.querySelector('#days'),
		timerHours = document.querySelector('#hours'),
		timerMinutes = document.querySelector('#minutes'),
		timerSeconds = document.querySelector('#seconds');

	let timerId = setInterval(updateTimer, 1000);

	function updateTimer() { // Отвечает за обновление таймера
		const time = Date.parse(deadline) - Date.now();
		timerDays.textContent = setZero(Math.floor(time / (1000 * 60 * 60 * 24)));
		timerHours.textContent = setZero(Math.floor((time / (1000 * 60 * 60)) % 24));
		timerMinutes.textContent = setZero(Math.floor((time / (1000 * 60)) % 60));
		timerSeconds.textContent = setZero(Math.floor((time / 1000) % 60));

		if (time <= 0) {
			timerDays.textContent = '00';
			timerHours.textContent = '00';
			timerMinutes.textContent = '00';
			timerSeconds.textContent = '00';
			clearInterval(timerId);
		}
	}
	return updateTimer;
}

setTimer('2022-10-05')()

function setZero(num) {
	if (num >= 0 && num <= 9) {
		return `0${num}`
	} else {
		return num
	}
}

