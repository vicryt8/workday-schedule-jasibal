"use strict";
const moment = require('moment');
const startHour = 9;
const dayDuration = 8;
const timeBlockIncrement = 60;
const now = moment();
var currentDayHeader = document.querySelector('#currentDay');
var scheduleBody = document.querySelector('#timeblocks');
var todaysEvents = [];
var currentDayEventCode = moment().format('DD-MM-YYYY');
function init() {
    currentDayHeader.innerText = moment().format('LLL');
    loadTimeBlocks();
    formatTimeBlocks();
    loadEvents();
}
function loadTimeBlocks() {
    for (var i = 0; i <= (dayDuration * 60) / timeBlockIncrement; i++) {
        var timeBlockHour = moment().startOf('day');
        var newTimeBlock = document.createElement('div');
        var newTimeBlockHeader = document.createElement('span');
        var newTimeBlockTextArea = document.createElement('textarea');
        var newTimeBlockButton = document.createElement('button');
        var newTimeBlockSaveIcon = document.createElement('span');
        newTimeBlock.classList.add('input-group', 'row');
        newTimeBlockHeader.classList.add('input-group-text');
        newTimeBlockTextArea.classList.add('form-control');
        newTimeBlockButton.classList.add('btn', 'btn-outline-secondary');
        newTimeBlockSaveIcon.classList.add('material-icons', 'md-light');
        newTimeBlock.setAttribute('data-time', String(i));
        newTimeBlockButton.type = 'button';
        newTimeBlockButton.addEventListener('click', (event) => saveEvent(event));
        newTimeBlockHeader.innerText = timeBlockHour.add(startHour * 60 + i * timeBlockIncrement, 'm').format('hh:mm A');
        newTimeBlockSaveIcon.innerText = 'save';
        newTimeBlockButton.appendChild(newTimeBlockSaveIcon);
        newTimeBlock.append(newTimeBlockHeader, newTimeBlockTextArea, newTimeBlockButton);
        scheduleBody.appendChild(newTimeBlock);
    }
}
function formatTimeBlocks() {
    var timeBlockRows = document.querySelectorAll('.row');
    var timeBlockFormats = ['future', 'present', 'past'];
    timeBlockRows.forEach((item) => {
        var timeBlockHour = moment().startOf('day');
        var hour = Number(item.getAttribute('data-time'));
        timeBlockHour = timeBlockHour.add(startHour * 60 + hour * timeBlockIncrement, 'm');
        var formatCondition = 0 + (timeBlockHour.isSame(now, 'hour') ? 1 : 0) + (timeBlockHour.isBefore(now, 'hour') ? 2 : 0);
        item.children[1].classList.add('class', timeBlockFormats[formatCondition]);
    });
}
function loadEvents() {
    todaysEvents = JSON.parse(String(localStorage.getItem(currentDayEventCode)));
    if (todaysEvents !== null) {
        todaysEvents.forEach((item) => {
            var incrementedIndex = item.index * (item.increment / timeBlockIncrement);
            if (scheduleBody.children[incrementedIndex] !== undefined) {
                scheduleBody.children[incrementedIndex].children[1].value = item.eventText;
            }
        });
    }
    else {
        todaysEvents = [];
    }
}
function saveEvent(event) {
    var timeBlockBody = event.currentTarget.parentNode;
    var timeBlockIndex = Number(timeBlockBody.dataset.time);
    console.log(event.currentTarget);
    var newEvent = {
        id: String(timeBlockIncrement) + '-' + String(timeBlockIndex),
        increment: timeBlockIncrement,
        index: timeBlockIndex,
        eventText: String(timeBlockBody.children[1].value),
    };
    todaysEvents = todaysEvents.filter((item) => {
        return item.id !== newEvent.id;
    });
    console.log(todaysEvents);
    todaysEvents.push(newEvent);
    localStorage.setItem(currentDayEventCode, JSON.stringify(todaysEvents));
    loadEvents();
}
init();
