const moment = require('moment');
const startHour = 9;
const dayDuration = 8;
const now = moment();

var currentDayHeader = document.querySelector('#currentDay') as HTMLElement;
var scheduleBody = document.querySelector('#timeblocks') as HTMLElement;
var incrementSelector = document.querySelector('#increment-selector') as HTMLElement;
var currentIncrement = document.querySelector('#increment') as HTMLElement;

var todaysEvents: timeBlockEvent[] = [];

var currentDayEventCode = moment().format('DD-MM-YYYY');
var timeBlockIncrement: number;

type timeBlockEvent = {
	id: string;
	increment: number;
	index: number;
	eventText: string;
};

function init(): void {
	scheduleBody.innerHTML = '';
	currentDayHeader.innerText = moment().format('DD MMMM YYYY');
	var incrementExists = localStorage.getItem('timeBlockIncrement');
	if (incrementExists !== null && !isNaN(Number(incrementExists))) {
		timeBlockIncrement = Number(incrementExists);
		currentIncrement.textContent = String(timeBlockIncrement) + ' minutes';
		loadTimeBlocks();
		loadEvents();
	}
}

function loadTimeBlocks(): void {
	var timeBlockFormats = ['future', 'present', 'past'];
	for (var i = 0; i <= (dayDuration * 60) / timeBlockIncrement; i++) {
		var newTimeBlock = document.createElement('div');
		var newTimeBlockHeader = document.createElement('span');
		var newTimeBlockTextArea = document.createElement('textarea');
		var newTimeBlockButton = document.createElement('button');
		var newTimeBlockSaveIcon = document.createElement('span');

		var timeBlock = moment()
			.startOf('day')
			.add(startHour * 60 + i * timeBlockIncrement, 'm');
		var formatCondition =
			0 +
			(now.isBetween(
				moment()
					.startOf('day')
					.add(startHour * 60 + i * timeBlockIncrement, 'm'),
				moment()
					.startOf('day')
					.add(startHour * 60 + (i + 1) * timeBlockIncrement, 'm'),
			)
				? 1
				: 0) +
			(now.isAfter(timeBlock, 'minute ') ? 2 : 0);
		console.log(formatCondition);
		newTimeBlock.classList.add('input-group', 'row');
		newTimeBlockHeader.classList.add('input-group-text');
		newTimeBlockTextArea.classList.add('form-control', timeBlockFormats[formatCondition]);
		newTimeBlockButton.classList.add('btn', 'btn-outline-secondary');
		newTimeBlockSaveIcon.classList.add('material-icons', 'md-light');

		newTimeBlock.setAttribute('data-time', String(i));
		newTimeBlockButton.type = 'button';
		newTimeBlockButton.addEventListener('click', (event) => saveEvent(event));
		newTimeBlockHeader.innerText = timeBlock.format('hh:mm A');
		newTimeBlockSaveIcon.innerText = 'save';

		newTimeBlockButton.appendChild(newTimeBlockSaveIcon);
		newTimeBlock.append(newTimeBlockHeader, newTimeBlockTextArea, newTimeBlockButton);
		scheduleBody.appendChild(newTimeBlock);
	}
}

function loadEvents(): void {
	todaysEvents = JSON.parse(String(localStorage.getItem(currentDayEventCode)));
	todaysEvents = todaysEvents.filter((item) => {
		console.log(item.eventText.length);
		return item.eventText.length !== 0;
	});
	if (todaysEvents !== null) {
		todaysEvents.forEach((item) => {
			var incrementedIndex = item.index * (item.increment / timeBlockIncrement);
			if (scheduleBody.children[incrementedIndex] !== undefined) {
				(scheduleBody.children[incrementedIndex].children[1] as HTMLTextAreaElement).value = item.eventText;
			}
		});
	} else {
		todaysEvents = [];
	}
}

function saveEvent(event: MouseEvent): void {
	var timeBlockBody = <HTMLElement>(<HTMLElement>event.currentTarget).parentNode;
	var timeBlockIndex = Number(timeBlockBody.dataset.time);
	var newEvent = {
		id: String(timeBlockIncrement) + '-' + String(timeBlockIndex),
		increment: timeBlockIncrement,
		index: timeBlockIndex,
		eventText: String((timeBlockBody.children[1] as HTMLTextAreaElement).value),
	};
	todaysEvents = todaysEvents.filter((item) => {
		return item.id !== newEvent.id;
	});
	todaysEvents.push(newEvent);
	localStorage.setItem(currentDayEventCode, JSON.stringify(todaysEvents));
	loadEvents();
}

function getIncrement(event: Event): void {
	timeBlockIncrement = Number((event.currentTarget as HTMLInputElement).value);
	if (!isNaN(timeBlockIncrement)) {
		localStorage.setItem('timeBlockIncrement', String(timeBlockIncrement));
	} else {
		localStorage.removeItem('timeBlockIncrement');
		currentIncrement.textContent = '';
	}
	init();
}

incrementSelector.addEventListener('change', (event) => getIncrement(event));

init();
