const moment = require('moment');
const startHour = 9;
const dayDuration = 8;
const scheduleMinutesIncrement = 60;

var currentDayHeader = document.getElementById('currentDay') as HTMLElement;
var scheduleBody = document.getElementById('timeblocks') as HTMLElement;

function init(): void {
	currentDayHeader.innerText = moment().format('LLL');
	loadTimeBlocks();
}

function loadTimeBlocks(): void {
	for (var i = 0; i <= (dayDuration * 60) / scheduleMinutesIncrement; i++) {
		var timeBlockHour = moment().startOf('day');
		var newTimeBlock = document.createElement('div');
		var newTimeBlockHeader = document.createElement('span');
		var newTimeBlockTextArea = document.createElement('textarea');
		var newTimeBlockButton = document.createElement('button');
		var newTimeBlockSaveIcon = document.createElement('span');

		newTimeBlock.classList.add('input-group');
		newTimeBlockHeader.classList.add('input-group-text');
		newTimeBlockTextArea.classList.add('form-control');
		newTimeBlockButton.classList.add('btn', 'btn-outline-secondary');
		newTimeBlockSaveIcon.classList.add('material-icons', 'md-light');

		newTimeBlockButton.type = 'button';
		newTimeBlockHeader.innerText = timeBlockHour.add(startHour * 60 + i * scheduleMinutesIncrement, 'm').format('hh:mm A');
		newTimeBlockSaveIcon.innerText = 'save';

		newTimeBlockButton.appendChild(newTimeBlockSaveIcon);
		newTimeBlock.append(newTimeBlockHeader, newTimeBlockTextArea, newTimeBlockButton);
		scheduleBody.appendChild(newTimeBlock);
	}
}

init();
