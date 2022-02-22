"use strict";

window.addEventListener("DOMContentLoaded", start);

let allAnimals = [];
let filteredAndSortedArr;

let selectedAnimals = [];
// The prototype for all animals:
const Animal = {
  name: "",
  desc: "-unknown animal-",
  type: "",
  age: 0,
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
  // document
  //   .querySelector("[data-sort=desc]")
  //   .addEventListener("click", sortDesc);
  // TODO: Add event-listeners to filter and sort buttons
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
  filteredAndSortedArr = filteredAndSortedArr.filter(isAnimalType);

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

// function all() {
//   filteredAndSortedArr = allAnimals;
//   displayList(filteredAndSortedArr);
// }

// function filterCats() {
//   filteredAndSortedArr = allAnimals.filter(isCat);
//   displayList(filteredAndSortedArr);
// }

// function filterDogs() {
//   filteredAndSortedArr = allAnimals.filter(isDog);
//   displayList(filteredAndSortedArr);
// }

// function isCat(animal) {
//   if (animal.type === "cat") {
//     return true;
//   } else {
//     return false;
//   }
// }

// function isDog(animal) {
//   if (animal.type === "dog") {
//     return true;
//   } else {
//     return false;
//   }
// }

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
      trophyClicked(event.target);
      selectedAnimals.push(animal);
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

  function trophyClicked() {
    console.log("trophyClicked");
    if (animal.winner) {
      animal.winner = false;
    } else {
      animal.winner = true;
    }
    console.log("selected animals are", selectedAnimals);
    isMoreThan2();
    // areTheSameType();
    displayList();
  }
  function isMoreThan2() {
    if (selectedAnimals.length >= 2) {
      clone
        .querySelector("[data-field=winner]")
        .removeEventListener("click", function (event) {
          trophyClicked(event.target);
        });
      console.log("we have", selectednimals.length);
    } else {
    }
  }
  // function areTheSameType() {
  //   let animal1 = selectedAnimals[0];
  //   let animal2 = selectedAnimals[1];
  //   if (animal1.type === animal2.type) {
  //     console.log("no two of the same");
  //   }
  // }

  // append clone to list
  document.querySelector("#list tbody").appendChild(clone);
}
