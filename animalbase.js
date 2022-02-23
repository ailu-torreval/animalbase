"use strict";

window.addEventListener("DOMContentLoaded", start);

let allAnimals = [];
let filteredAndSortedArr;
let winnerAnimals = [];

let selectedAnimals = [
  // { name: "bunny", desc: "messy", type: "rabbit", age: "2" },
];
// The prototype for all animals:
const Animal = {
  name: "",
  desc: "-unknown animal-",
  type: "",
  age: 0,
  winner: false,
};

function start() {
  console.log("ready");
  document
    .querySelector("[data-filter=cat]")
    .addEventListener("click", function () {
      filterAnimals(this.dataset.filter);
    });
  document
    .querySelector("[data-filter=dog]")
    .addEventListener("click", function () {
      filterAnimals(this.dataset.filter);
    });
  document.querySelector(".filter-all").addEventListener("click", all);
  document
    .querySelector("[data-sort=name]")
    .addEventListener("click", sortNames);
  document
    .querySelector("[data-sort=type]")
    .addEventListener("click", sortType);
  document
    .querySelector("[data-sort=desc]")
    .addEventListener("click", sortDesc);
  document.querySelector("[data-sort=age]").addEventListener("click", sortAge);
  loadJSON();
}

async function loadJSON() {
  const response = await fetch("animals.json");
  const jsonData = await response.json();

  // when loaded, prepare data objects
  prepareObjects(jsonData);
}

function prepareObjects(jsonData) {
  allAnimals = jsonData.map(preapareObject);
  console.log("allAnimals", allAnimals);
  filteredAndSortedArr = allAnimals;
  // TODO: This might not be the function we want to call first
  displayList(filteredAndSortedArr);
  return filteredAndSortedArr;
}

function preapareObject(jsonObject) {
  const animal = Object.create(Animal);

  const texts = jsonObject.fullname.split(" ");
  animal.name = texts[0];
  animal.desc = texts[2];
  animal.type = texts[3];
  animal.age = jsonObject.age;

  return animal;
}

function all() {
  filteredAndSortedArr = allAnimals;
  displayList(filteredAndSortedArr);
}

function filterAnimals(type) {
  filteredAndSortedArr = allAnimals.filter(isAnimalType);

  function isAnimalType(animal) {
    if (animal.type === type) {
      console.log("isanimaltype", animal);
      return true;
    } else {
      return false;
    }
  }
  displayList(filteredAndSortedArr);
}

function sortNames() {
  filteredAndSortedArr.sort(compareNames);
  displayList(filteredAndSortedArr);
}
function compareNames(a, b) {
  if (a.name < b.name) {
    return -1;
  } else {
    return 1;
  }
}

function sortType() {
  filteredAndSortedArr.sort(compareTypes);
  displayList(filteredAndSortedArr);
}
function compareTypes(a, b) {
  if (a.type < b.type) {
    return -1;
  } else {
    return 1;
  }
}

function sortDesc() {
  filteredAndSortedArr.sort(compareDesc);
  displayList(filteredAndSortedArr);
}
function compareDesc(a, b) {
  if (a.desc < b.desc) {
    return -1;
  } else {
    return 1;
  }
}

function sortAge() {
  filteredAndSortedArr.sort(compareAge);
  displayList(filteredAndSortedArr);
}
function compareAge(a, b) {
  if (a.age < b.age) {
    return -1;
  } else {
    return 1;
  }
}

function displayList() {
  // clear the list
  document.querySelector("#list tbody").innerHTML = "";

  // build a new list

  filteredAndSortedArr.forEach(displayAnimal);
}

function displayAnimal(animal) {
  // create clone
  const clone = document
    .querySelector("template#animal")
    .content.cloneNode(true);

  // set clone data
  clone.querySelector("[data-field=name]").textContent = animal.name;
  clone.querySelector("[data-field=desc]").textContent = animal.desc;
  clone.querySelector("[data-field=type]").textContent = animal.type;
  clone.querySelector("[data-field=age]").textContent = animal.age;
  if (animal.star) {
    clone.querySelector("[data-field=star]").textContent = "⭐";
  } else {
    clone.querySelector("[data-field=star]").textContent = "☆";
  }

  if (animal.winner) {
    clone.querySelector("[data-field=winner]").classList.remove("grey");
  } else {
    clone.querySelector("[data-field=winner]").classList.add("grey");
  }

  clone
    .querySelector("[data-field=star]")
    .addEventListener("click", starClicked);

  clone
    .querySelector("[data-field=winner]")
    .addEventListener("click", function (event) {
      checkTrophy(event.target);
      console.log("select anim", selectedAnimals);
      // selectedAnimals.push(animal);
    });

  function starClicked() {
    console.log("start clicked");
    if (animal.star) {
      animal.star = false;
    } else {
      animal.star = true;
    }
    console.log("animal star", animal.star);
    displayList();
  }

  function checkTrophy() {
    selectedAnimals.push(animal);
    // checked if we can add the animal to the winners list

    if (selectedAnimals.length === 1) {
      console.log("youcan go");
      clickedTrophy();
    } else if (selectedAnimals.length === 2) {
      console.log("are the same type?");
      isTheSameType(selectedAnimals);
    } else if (selectedAnimals.length > 2) {
      console.log("thats too much");
      selectedAnimals.pop();
      showTooManyPopup();
    }

    function isTheSameType(selectedAnimals) {
      if (selectedAnimals[0].type === selectedAnimals[1].type) {
        console.log("they are the same");
        selectedAnimals.pop();
        showSameTypePopup();
      } else {
        console.log("they are different");
        clickedTrophy();
      }
    }

    function clickedTrophy() {
      if (animal.winner) {
        animal.winner = false;
        winnerAnimals.push();
        console.log("winners", winnerAnimals);
      } else {
        // selectedAnimals.splice(animal);
        animal.winner = true;
      }
    }
    function showTooManyPopup() {
      console.log("showTooMAny");
      // show screen
      // print name 1 and2
      document.querySelector("#onlytwowinners").classList.remove("hidden");
      document.querySelector(
        "#animal1"
      ).textContent = ` ${selectedAnimals[0].name}, the ${selectedAnimals[0].type}`;
      document.querySelector(
        "#animal2"
      ).textContent = ` ${selectedAnimals[1].name}, the ${selectedAnimals[1].type}`;
      document
        .querySelector("[data-action=remove1]")
        .addEventListener("click", removePUAnimal1);

      document
        .querySelector("[data-action=remove2]")
        .addEventListener("click", removePUAnimal2);
      document
        .querySelector(".closebutton")
        .addEventListener("click", closePU1);
    }

    function showSameTypePopup() {
      console.log("show the same");
      // show screen
      // print name 1 and2
      document.querySelector("#onlyonekind").classList.remove("hidden");
      document.querySelector(
        "#animalx"
      ).textContent = ` ${selectedAnimals[0].name}, the ${selectedAnimals[0].type}`;
      document
        .querySelector("#remove-button")
        .addEventListener("click", removePUAnimal3);
      document
        .querySelector(".closebutton3")
        .addEventListener("click", closePU3);
    }
    function removePUAnimal1() {
      selectedAnimals.shift();
      document.querySelector("#btn1").classList.add("hidden");
    }
    function removePUAnimal2() {
      selectedAnimals.pop();
      document.querySelector("#btn2").classList.add("hidden");
    }

    function removePUAnimal3() {
      selectedAnimals.shift();
      document.querySelector("#btn3").classList.add("hidden");
    }

    function closePU1() {
      document.querySelector("#onlytwowinners").classList.add("hidden");
    }

    function closePU3() {
      document.querySelector("#onlyonekind").classList.add("hidden");
    }

    displayList();
  }
  // append clone to list
  document.querySelector("#list tbody").appendChild(clone);
}
