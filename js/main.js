const Prando = require("prando").default;
const { members, REFERENCE_DATE_STRING } = require("./constants");
const {
  getNearestSunday,
  getNextSaturday,
  deterministicShuffle,
} = require("./utils");
const phoneNumbers = require("./candidatesDetails");

function getWeekRangeString() {
  return getNearestSunday() + " - " + getNextSaturday();
}

function weeksSince(dateString) {
  var date = new Date(dateString);
  var today = new Date();
  const result = Math.floor((today - date) / (1000 * 60 * 60 * 24 * 7));
  return result;
}

function getRoundNumber() {
  return (
    (weeksSince(REFERENCE_DATE_STRING) + 1) % (members.SET_1.length * 2 - 1)
  );
}

function appendScheduleToDOM(participants1, participants2) {
  const pairings = [];
  const chatAppPrefix = 'https://wa.me/';
  for (let i = 0; i < participants1.length; i += 1) {
    let participants1Number = chatAppPrefix+phoneNumbers[participants1[i]]
    let participants2Number = chatAppPrefix+phoneNumbers[participants2[i]]

    const pairing = `<li><a href=${participants1Number} target="_blank">${participants1[i]}</a> - <a href=${participants2Number} target="_blank">${participants2[i]}</a></li>`;
    pairings.push(pairing);
  }
  const element = document.getElementById("app");
  let content = "<div>";
  content += `<h2>Pairings for the week ${getWeekRangeString()}. ( Sunday - Saturday )</h2>`;
  content += "<ul>";
  pairings.forEach((pair) => (content += pair));
  content += "</ul>";
  element.innerHTML = content;
}

function generateSchedule() {
  const participants1 = members.SET_1;
  const participants2 = members.SET_2;
  schedulingAlgorithm(participants1, participants2, getRoundNumber());
  appendScheduleToDOM(participants1, participants2);
}

// https://en.wikipedia.org/wiki/Round-robin_tournament#Scheduling_algorithm
function schedulingAlgorithm(participants1, participants2, week) {
  let rotations = week - 1;

  while (rotations > 0) {
    rotations -= 1;
    const first_participant_2 = participants2[0];
    const last_participant_1 = participants1[participants1.length - 1];

    for (let i = 1; i < participants2.length; i++) {
      participants2[i - 1] = participants2[i];
    }
    participants2[participants2.length - 1] = last_participant_1;
    let i = participants1.length - 1;
    while (i >= 1) {
      participants1[i] = participants1[i - 1];
      i -= 1;
    }
    participants1[1] = first_participant_2;
  }
}

generateSchedule();
