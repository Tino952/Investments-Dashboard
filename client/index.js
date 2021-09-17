// importing styles and json

import "./canvas.js"
import "./css/styles.scss"
import myData from "../allocation.json"
const textFit = require("textFit");

// Defining global variables

let backButton = document.querySelector("#back");

let myNav = document.querySelector("#navigation");

let entryPoint = myData.lines;

let myArray = [];


// Building financial indicator buttons

( () => {

  // getting the names of financial indicators from headers array

  let myHeaders = myData.headers;

  let myHeadersLength = myHeaders.length;

  let myFinInd = document.querySelector("#finind");

  for (let i = 0; i < myHeadersLength ; i++) {

    let headerName = myHeaders[i];

    let myButton = document.createElement("button");

    myButton.textContent = headerName;

    myButton.classList.add("finind__button");

    // indexing buttons to select in currentFinInd() function

    myButton.setAttribute("id", `Button-${i}`);

    // creating event listener to refresh main output field when a new financial
    // indicator is selected

    myButton.addEventListener("click", ()=> {

      // move button's active state css away from previous button and to
      // the selected button

      let currentButton = document.querySelector(".finind__button-active");

      if (currentButton !== null) {
        currentButton.classList.toggle("finind__button-active");
      }

      myButton.classList.toggle("finind__button-active");

      // this is the combination of main functions in order to
      //
      //  a) determine which index of myData we are i.e. how deep in the
      //     nested object we are - this is captured by the var nestLevel
      //
      //  b) populate output field with the output from that nestlevel, as
      //     well as the current financial indicator index from the active
      //     button. This is done with outputInit

      let nestLevel = getNestedObject(entryPoint, myArray);

      return outputInit(nestLevel, i);

    })

    myFinInd.appendChild(myButton);



  }

  // To initialize our page, set the value of output equal to first financial
  // indicator

  let firstButton = document.getElementById("Button-0");


  firstButton.classList.toggle("finind__button-active")

  // initialize the main output

  outputInit(entryPoint);

  // update the back button i.e. make it disappear if we are on top level of
  // myData i.e. if we are at entryPoint i.e. if mArray is empty

  statusBack(myArray);

  // click button with timeout to overcome bugginess of textFit on pageload.
  // Normally, the title text of the first output box on initial page load
  // overflows onto page background. With timeout we are able to overcome this,
  // without user noticing due to short timeout interval

  window.setTimeout(()=>{firstButton.click()},100)

})();

// Main function to populate the main output field
// This function is passed an array pertaining to the nested level we are
// currently at in myData, as well as an index to indicate which financial
// indicator we are currently at

// note to self: if this function was called not as a declaration function
// i.e. "function () {}" but as a non-anonymous arrow function i.e.
// "const x = () => {}" then it is not hoisted.

function outputInit (arr, x = 0) {

  let myOutput = document.querySelector("#output__main-flex");

  // clearing the output field

  myOutput.innerHTML = "";

  // getting total value of all each array element's value property
  // this will be used to calculate a percentage

  let sum = 0;

  for (let i = 0; i < arr.length; i++) {

    let value = arr[i].lineValues[x].value

    value = parseInt(value.replace(/\./g, ""))

    if (value > 0) {
      sum += parseInt(value);
    }
  }

  // next, create our output buttons and assign content and classes

  for (let i = 0; i < arr.length; i++) {

    let myDiv = document.createElement("div");

    let myTitle = document.createElement("div");

    let myId = document.createElement("div");

    let myMiddle = document.createElement("div");

    let myValue = document.createElement("div");

    let myValueSpan = document.createElement("span");

    let myPercentage = document.createElement("div");

    let value = arr[i].lineValues[x].value;

    myDiv.setAttribute("id", arr[i].lineName);

    myDiv.classList.add("output__main-container");

    myTitle.textContent = arr[i].lineName;

    myTitle.classList.add("output__main-container__title");

    myId.textContent = "ID: " + arr[i].id;

    myId.classList.add("output__main-container__id");

    myMiddle.classList.add("output__main-container__middle");

    myValue.textContent = "Value:";

    myValue.classList.add("output__main-container__middle-value");

    myValueSpan.textContent = value;

    myValueSpan.classList.add("output__main-container__middle-value__span")

    myPercentage.classList.add("output__main-container__middle-percentage")

    // changing value to an integer in order to generate percentage of sum

    value = parseInt(value.replace(/\./g, ""));

    if (value > 0) {

      let percentage = value / sum * 100;

      percentage = Math.round(percentage * 10) / 10;

      myPercentage.textContent = percentage + "%";

      // if value is negative, then just assign 0%

    } else {

      myPercentage.textContent = "0%";

    }

    myValue.appendChild(myValueSpan);

    myMiddle.append(myValue, myPercentage);

    myDiv.append(myTitle, myMiddle, myId);

    myOutput.appendChild(myDiv);

    // adding a click event listener to navigate to next level of myData by
    // adding to the nestedLevel array and re-running outputInit

    myDiv.addEventListener("click", () => {

      // keep track of active financial indicator selector e.g. "IRR"

      let currentButtonIndex = currentFinInd();

      // if we are not on last level of arr i.e. the nestLevel of myData, then
      // append the index number of that output field plus "subLines" to
      // navigate to next level

      let last = false;

      if (arr[i].subLines.length > 0) {

        myArray.push(i,"subLines");

      } else {

        return last = true;

      }

      let nestLevel = getNestedObject(entryPoint, myArray);

      outputInit(nestLevel, currentButtonIndex);

      statusBack(myArray);

      // update our navigation

      let tracker = myDiv.id;

      updateNav(tracker, last);

    })

  }
      runTextFit();

  // remove hover on the last field of myData tree

  if (arr[0].subLines == 0) {

    let myChildren = myOutput.children;

    for (let i = 0; i < myChildren.length; i++) {

      myOutput.children[i].classList.add("output__main-container__no-hov");

    }

  }

  // center the first container if is no back button i.e. if myArray is still empty

  let myOutputGrid = document.querySelector(".output");

  if (myArray.length == 0) {

    myOutputGrid.classList.add("output-init");

  } else {

    myOutputGrid.classList.remove("output-init");

  }

}

function runTextFit () {

  // adjusting font size to container using textFit plugin

  textFit(document.getElementsByClassName("output__main-container__title"), {
    minFontSize: 10,
    maxFontSize: 16,
    alignHoriz: true,
    alignVert: true,
  });

}

// Using array reduce to access nested objects using an array of properties on
// that object. Not using dot notation but array notation to access object
// properties and arrays within those properties

const getNestedObject = (nestedObj, pathArr) => {
  return pathArr.reduce(reducer, nestedObj);
}

function reducer (obj, key) {
  return (obj && obj[key] !== "undefined") ? obj[key] : undefined;
}

// Function to update navigation menu

const updateNav = (tracker, last) => {

  // Don't update navigation if we are on last item in myData

  if (last) {
    return
  }

  let myLink = document.createElement("a");

  let mySpan = document.createElement("span");

  mySpan.textContent = " > ";

  myLink.textContent = tracker;

  myLink.classList.add("nav-link");

  myLink.dataset["array"] = myArray

  // if first nav item, then do not append span

  let navLength = myNav.childElementCount;

  if (navLength == 0) {

    myNav.appendChild(myLink);

  } else if (navLength > 0) {

    myNav.appendChild(mySpan);

    myNav.appendChild(myLink);
  }

  // Making navigation items clickable

  myLink.addEventListener("click", ()=> {

    let navLength = myNav.childElementCount;

    let myChildNodes = myNav.children

    let i = 1;

    // determine the index number of the navigation item that was selected

    for (let node of myChildNodes) {

      if (node == myLink) {

        for (let j = 0; j < navLength - i; j++) {

          console.log("before");

          console.log(myNav);

          // removing last child of my nav for the amount of iterations needed
          // to locate that nav link in navigation, however deleting from the
          // back, so iterate until navLength - i, not i

          myNav.removeChild(myNav.lastElementChild);

          console.log("after");

          console.log(myNav);

        }
      }
      i ++
    }

    // *important*
    // We have to mutate the myArray variable once a nav link is clicked on
    // We do this by grabbing the information on the level of that clicked link
    // from the data attribute assigned above. This takes the value of myArray
    // which was passed to updateNav as soon as an output field was clicked on.
    // Below we convert this data attribute back into an array we can pass into
    // our function getNestedObject

    myArray = myLink.dataset["array"].split(",").map(function(x) {

      if (isNaN(parseInt(x))) {

        return x

      } else {

        return parseInt(x)
      }
      })

    console.log(myArray);

    let currentButtonIndex = currentFinInd();

    let nestLevel = getNestedObject(entryPoint, myArray);

    outputInit(nestLevel, currentButtonIndex);

  })
}

backButton.addEventListener("click", () => {

  // if we have more than one link in our nav i.e. if navLength > 2 then
  // remove nav link and ">" span, otherwise just remove the link

  let navLength = myNav.childElementCount;

  if (navLength > 2) {

    myNav.removeChild(myNav.lastElementChild);

    myNav.removeChild(myNav.lastElementChild);

  } else {

    myNav.removeChild(myNav.lastElementChild);

  }

  // mutating myArray, remove last two elements which are array index and subLines

  myArray.pop();

  myArray.pop();

  // update the status of back button

  statusBack(myArray);

  let currentButtonIndex = currentFinInd();

  let nestLevel = getNestedObject(entryPoint, myArray);

  return outputInit(nestLevel, currentButtonIndex);
})

// function to determine whether we are on first node of main output
// e.g. "Total Assets" or not
// If we are on first node, then make back button disappear
// This function is run whenever we click the back button or whenever we click
// one of the input fields

function statusBack (arr) {

  if (arr.length == 0) {

    backButton.classList.add("output__back-button-start");

  } else {

    backButton.classList.remove("output__back-button-start");
  }
}

// Determine current financial indicator selector

const currentFinInd = () => {

  let currentButton = document.querySelector(".finind__button-active");

  return currentButton.id.split("-")[1];
}
