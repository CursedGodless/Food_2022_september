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

getData('http://localhost:3000/menu')
	.then(data => {
		data.forEach(({ img, altimg, title, descr, price }) => {
			new MenuCard(img, altimg, title, descr, price, '.menu__field .container').render()
		})
	})

const forms = document.querySelectorAll('form');

async function getData(src) {
	return await fetch(src)
		.then(response => {
			if (response.ok) {
				return response.json()
			} else {
				throw new Error('error');
			}
		})
}

async function postData(src, data) {
	return await fetch(src, {
		body: data,
		method: 'POST',
		headers: { 'Content-type': 'application/json' }
	}).then(response => {
		if (response.ok) {
			return response.text()
		} else {
			throw new Error('error');
		}
	})
}

function formProcessing(form) {
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

		postData('http://localhost:3000/requests', JSON.stringify(Object.fromEntries(formData.entries())))
			.then(data => {
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
	formProcessing(item)
})


// Slider 

const slider = document.querySelector('.offer__slider'),
	slides = slider.querySelectorAll('.offer__slide'),
	prevSlide = slider.querySelector('.offer__slider-prev'),
	nextSlide = slider.querySelector('.offer__slider-next'),
	currentSlide = slider.querySelector('#current'),
	totalSlides = slider.querySelector('#total'),
	sliderWrapper = slider.querySelector('.offer__slider-wrapper'),
	sliderField = slider.querySelector('.offer__slider-inner'),
	width = window.getComputedStyle(sliderWrapper).width;

let slideIndex = 1,
	offset = 0;

currentSlide.textContent = '01'
totalSlides.textContent = setZero(slides.length);
sliderWrapper.style.overflow = 'hidden';

sliderField.style.cssText = `
display: flex;
width: ${100 * slides.length}%;
transition: .5s all;
`;

slides.forEach(slide => {
	slide.style.width = width;
})

function changeSlideIndex() {
	currentSlide.textContent = setZero(slideIndex);
}

nextSlide.addEventListener('click', () => {
	slideIndex++;
	offset -= width.slice(0, -2);

	if (offset <= -parseInt(window.getComputedStyle(sliderField).width)) {
		offset = 0
		slideIndex = 1;
	}
	changeSlideIndex()

	sliderField.style.transform = `translateX(${offset}px)`;

	dots.forEach(dot => dot.style.opacity = '.5');
	dots[slideIndex - 1].style.opacity = '1';


})

prevSlide.addEventListener('click', () => {
	slideIndex--
	if (offset >= 0) {
		offset = -parseInt(window.getComputedStyle(sliderField).width)
		slideIndex = slides.length
	}
	changeSlideIndex()

	offset += +width.slice(0, -2);

	sliderField.style.transform = `translateX(${offset}px)`;

	dots.forEach(dot => dot.style.opacity = '.5');
	dots[slideIndex - 1].style.opacity = '1';
})

// Dots

sliderWrapper.style.position = 'relative';

let dotsWrapper = document.createElement('ul'),
	dots = [];
dotsWrapper.classList.add('carousel-indicators');
dotsWrapper.style.cssText = `
	position: absolute;
	right: 0;
	bottom: 0;
	left: 0;
	z-index: 15;
	display: flex;
	justify-content: center;
	margin-right: 15%;
	margin-left: 15%;
	list-style: none;
`;
sliderWrapper.append(dotsWrapper)

slides.forEach((item, index) => {
	const dot = document.createElement('li');
	dot.classList.add('dot');
	dot.setAttribute('data-slide-to', index + 1)

	dot.style.cssText = `
		box-sizing: content-box;
		flex: 0 1 auto;
		width: 30px;
		height: 6px;
		margin-right: 3px;
		margin-left: 3px;
		cursor: pointer;
		background-color: #fff;
		background-clip: padding-box;
		border-top: 10px solid transparent;
		border-bottom: 10px solid transparent;
		opacity: .5;
		transition: opacity .6s ease;
	`;
	if (index === 0) {
		dot.style.opacity = 1;
	}
	dots.push(dot)
	dotsWrapper.append(dot)
})

dotsWrapper.addEventListener('click', (e) => {
	if (e.target.matches('.dot')) {
		const slideTo = e.target.getAttribute('data-slide-to');

		slideIndex = +slideTo;
		offset = -+parseInt(width) * (slideTo - 1);

		sliderField.style.transform = `translateX(${offset}px)`;
		changeSlideIndex()
		dots.forEach(dot => dot.style.opacity = '.5');
		dots[slideIndex - 1].style.opacity = '1';
	}
})