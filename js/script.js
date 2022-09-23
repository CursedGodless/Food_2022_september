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

// Модалка

const modalBtns = document.querySelectorAll('[data-modal]'),
	modal = document.querySelector('.modal'),
	modalClose = document.querySelector('.modal__close');

modalBtns.forEach(item => {
	item.addEventListener('click', openModal)
})

modal.addEventListener('click', (e) => {
	const target = e.target;
	if (target.matches('.modal__close') || target.matches('.modal')) {
		closeModal();
	}
})

document.addEventListener('keydown', (e) => {
	if (modal.classList.contains('show') && e.code === 'Escape') {
		closeModal();
	}
})

function openModal() {
	modal.classList.add('show');
	document.body.style.overflow = 'hidden';
	clearTimeout(timerId);
}

function closeModal() {
	modal.classList.remove('show');
	document.body.style.overflow = '';
}

let timerId = setTimeout(openModal, 15000);

function openOnBottom() {
	if (document.documentElement.scrollHeight - 1 <= document.documentElement.scrollTop + document.documentElement.clientHeight) {
		openModal();
		document.removeEventListener('scroll', openOnBottom)

	}
}

document.addEventListener('scroll', openOnBottom);


class MenuCard {
	constructor(src, alt, subtitle, descr, price, parentSelector, ...classes) {
		this.src = src;
		this.alt = alt;
		this.subtitle = subtitle;
		this.descr = descr;
		this.price = price;
		this.parentSelector = document.querySelector(parentSelector);
		this.classes = classes.length ? classes : 'menu__item';
	}

	render() {
		this.parentSelector.insertAdjacentHTML('beforeend', `
		<div class=${this.classes}>
				<img src=${this.src} alt=${this.alt}>
				<h3 class="menu__item-subtitle">${this.subtitle}</h3>
				<div class="menu__item-descr"> ${this.descr}
				</div>
				<div class="menu__item-divider"></div>
				<div class="menu__item-price">
					<div class="menu__item-cost">Цена:</div>
					<div class="menu__item-total"><span>${this.price}</span> грн/день</div>
				</div>
		</div>
		`)
	}
}

new MenuCard("img/tabs/vegy.jpg", "vegy", 'Меню "Фитнес"', `Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и
фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким
качеством!`, 229, '.menu__field .container').render();


const forms = document.querySelectorAll('form');

function postData(form) {
	form.addEventListener('submit', (e) => {
		e.preventDefault();

		const message = {
			success: 'Данные успешно отправлены',
			failure: 'Упс... Что-то пошло не так',
			loading: 'icons/spinner.svg'
		}

		const loading = document.createElement('img');
		loading.style.cssText = `
		display:block;
		margin:0 auto;
		margin-top: 15px;
		`
		loading.src = message.loading;

		const prevDialog = modal.querySelector('.modal__dialog')

		const formData = new FormData(form);

		function showThanksModal(message, ms = 3000) {

			prevDialog.classList.add('hide')
			openModal();
			loading.remove();
			const statusMessage = document.createElement('div');
			statusMessage.classList.add('modal__dialog');
			statusMessage.innerHTML =
				`
						<div class="modal__content">
							<div class="modal__close">&times;</div>
							<div class="modal__title">${message}</div>
						</div>
				`

			modal.append(statusMessage);
			setTimeout(() => statusMessage.remove(), ms)
		}

		form.insertAdjacentElement('afterend', loading);

		fetch('server.php', {
			body: JSON.stringify(Object.fromEntries(formData.entries())),
			method: 'POST',
			headers: { 'Content-type': 'application/json' }
		})
			.then(response => {
				if (response.ok) {
					return response.text()
				} else {
					throw new Error('error');
				}
			})
			.then(data => {
				console.log('sadadad');
				showThanksModal(message.success);
			})
			.catch(() => {
				showThanksModal(message.failure)
			})
			.finally(() => {
				setTimeout(() => {
					closeModal();
					prevDialog.classList.remove('hide')
					form.reset()
				}, 3000);
			})
	})
}

forms.forEach(item => {
	postData(item)
})