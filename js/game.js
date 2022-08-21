//CONSTANTS
const flagsDiv = document.getElementById("flags");
const gameDiv = document.getElementById("game");
const menuDiv = document.getElementById("menu");

const CreateNotification = NotificationManager.prototype.createNotification

const failMessage = "Failed to load flags, please try refreshing the page! :( \nError: ";

let listOpen = false;
let gameOpen = false;
let savedFlags = null;

let cooldownArray = [false, false, false];

// COOLDOWN HANDLER
function isCooldown(index) {
  return cooldownArray[index];
}

function handleCooldown(index, bool, interval) {
  bool = bool || true;
  function setCooldown() {
    if (cooldownArray.length <= index) {
      cooldownArray[index] = bool
    }
  }
  if (interval) {
    setTimeout(() => {
      setCooldown()
    }, interval)
  } else {
    setCooldown()
  }
}

// HTTP REQUESTS
function getFlagsListXHR(toLoadMethod){
    let xhr = new XMLHttpRequest();
    xhr.onload = function(){
        let objectResult = JSON.parse(this.responseText);
        savedFlags = Object.entries(objectResult);
        init();
    };
    xhr.onerror = showFailMessage;
    xhr.open('GET', 'https://flagcdn.com/en/codes.json');
    xhr.send();
}

// FAVICON
function setFavicon(favImg){
    let headTitle = document.querySelector("head");
    let setFavicon = document.createElement("link");
    setFavicon.setAttribute("rel", "shortcut icon");
    setFavicon.setAttribute("href", favImg);
    headTitle.appendChild(setFavicon);
}

function getCountry(id){
   let current = savedFlags[Math.floor(Math.random()*savedFlags.length)]
    while (current !== null && current[0].includes("us-")){
        current = savedFlags[Math.floor(Math.random()*savedFlags.length)]
    }
    return current;
}

function getRandomInitials(){
    return savedFlags[Math.floor(Math.random()*savedFlags.length)][0];
}

function getRandomCountry(){
    let current = savedFlags[Math.floor(Math.random()*savedFlags.length)]
    while (current !== null && current[0].includes("us-")){
        current = savedFlags[Math.floor(Math.random()*savedFlags.length)]
    }
    return current[1];
}

// GAME
function endGame() {
    gameDiv.innerHTML = "";
    gameDiv.setAttribute("class", "hidden")
}

function generateRandom(min = 0, max = 100) {
    let difference = max - min;
    let rand = Math.random();
    rand = Math.floor( rand * difference);
    rand = rand + min;
    return rand;
}

function wonGame(){
    endGame();
    returnToMenu();
    CreateNotification("success", "That's correct!")
}

function lostGame(countryName){
    endGame();
    returnToMenu();
    CreateNotification("danger", "Unfortunately, that's wrong! The country was " + countryName + ".")
}

function createGame(){
    if (isCooldown(0)) return
    handleCooldown(0, true);
    gameDiv.removeAttribute("class")
    let optionId = generateRandom(1, 4)
    let country = getCountry();
    function checkAnswer(e){
        console.log(e.target.value, optionId)
        if (e.target.value == optionId) {
            return wonGame();
        }else{
            return lostGame(country[1]);
        }
    }
    let gameInfo = document.createElement("div")
    gameInfo.setAttribute("class", "game-info")
    gameDiv.appendChild(gameInfo)
    let gameTitle = document.createElement("p")
    gameTitle.setAttribute("class", "game-title")
    gameTitle.innerHTML = "Which flag is this?"
    gameInfo.appendChild(gameTitle)
    let countryImage = document.createElement("img")
    countryImage.setAttribute("id", "game-flag")
    countryImage.setAttribute("src", `https://flagcdn.com/256x192/${country[0]}.png`)
    gameDiv.appendChild(countryImage);
    let gameOptions = document.createElement("div")
    gameOptions.setAttribute("id", "game-options")
    gameDiv.appendChild(gameOptions)
    let ulOptions = document.createElement("ul")
    gameOptions.appendChild(ulOptions)
    ulOptions.setAttribute("class", "options")
    for (let i = 0; i < 3; i++){
        let li = document.createElement("li")
        ulOptions.appendChild(li)
        let button = document.createElement("button")
        if (i + 1 == optionId) {
            button.innerHTML = country[1]
        } else {
            button.innerHTML = getRandomCountry()
        }
        button.addEventListener('click', checkAnswer, false);
        button.setAttribute("value", i + 1)
        li.appendChild(button)
    }
    handleCooldown(0, false);
}

// LIST
function closeList() {
    flagsDiv.innerHTML = "";
}

function createFlagContainer(img, longName){
    let flagContainer = document.createElement("div")
    flagContainer.setAttribute("class", "flag-container")
    flagContainer.setAttribute("value", longName)
    flagsDiv.appendChild(flagContainer);
    let imgElement = document.createElement('img');
    imgElement.setAttribute("src", img)
    imgElement.setAttribute("class", "country-flag")
    flagContainer.appendChild(imgElement);
    let pElement = document.createElement("p")
    pElement.innerHTML = longName
    pElement.setAttribute("class", "country-name")
    flagContainer.appendChild(pElement)
}

function setupFlagList(){
    if (isCooldown(1)) return
    handleCooldown(1, true);
    clearMenu();
    flagsDiv.removeAttribute("class")
    document.body.style['overflow-y'] = 'visible';
    savedFlags.forEach(element => {
        const shortName = element[0], longName = element[1]
        if (!shortName.includes("us-")){
            createFlagContainer(`https://flagcdn.com/84x63/${shortName}.png`, longName)
        }
    });
    handleCooldown(1, false);
}

// MENU
function clearMenu() {
    menuDiv.setAttribute("class", "hidden");
}

// FRONT-END CORE
function returnToMenu(){
    if (listOpen == true){
        listOpen = false;
        closeList();
    }
    if (gameOpen == true){
        gameOpen = false;
        endGame();
    }
    menuDiv.removeAttribute("class")
}

function beginGamePrompt(){
    gameOpen = !gameOpen
    endGame()
    if (gameOpen == true){
        clearMenu();
        return createGame();
    }else{
        return returnToMenu();
    }
}

function openListPrompt(){
    listOpen = !listOpen
    closeList()
    if (listOpen == true){
        clearMenu();
        return setupFlagList();
    } else {
        flagsDiv.setAttribute("class", "hidden")
        return returnToMenu();
    }
}

function showFailMessage(err){
    let failElement = document.createElement('h1');
    failElement.setAttribute("class", "fail-message")
    failElement.innerHTML = failMessage + err
    flagsDiv.appendChild(failElement);
}

// INITIALIZATION
function init(){
    setFavicon(`https://flagcdn.com/84x63/${getRandomInitials()}.png`)
}

getFlagsListXHR()
