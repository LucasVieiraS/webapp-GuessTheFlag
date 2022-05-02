//CONSTANTS
const flagsDiv = document.getElementById("flags");
const gameDiv = document.getElementById("game");
const menuDiv = document.getElementById("menu");

const CreateNotification = NotificationManager.prototype.createNotification

const failMessage = "Failed to load flags, please try refreshing the page! :( \nError: ";

var listOpen = false;
var gameOpen = false;
var savedFlags = null;

// HTTP REQUESTS
function getFlagsListXHR(toLoadMethod){
    var xhr = new XMLHttpRequest();
    xhr.onload = function(){
        var objectResult = JSON.parse(this.responseText); 
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
    return savedFlags[Math.floor(Math.random()*savedFlags.length)];
}

function getRandomInitials(){
    return savedFlags[Math.floor(Math.random()*savedFlags.length)][0];
}

function getRandomCountry(){
    return savedFlags[Math.floor(Math.random()*savedFlags.length)][1];
}

// GAME
function endGame() {
    gameDiv.innerHTML = "";
    gameDiv.setAttribute("class", "hidden")
}

function generateRandom(maxLimit = 3){
    let rand = Math.floor(Math.random() * maxLimit);
    if (rand <= 1){
        rand = 1;
    }
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
    var optionId = generateRandom(3)
    var country = getCountry();
    function checkAnswer(e){
        console.log(e.target.value, optionId)
        if (e.target.value == optionId) {
            return wonGame();
        }else{
            return lostGame(country[1]);
        }
    }
    gameDiv.removeAttribute("class")
    let gameInfo = document.createElement("div")
    gameInfo.setAttribute("class", "game-info")
    gameDiv.appendChild(gameInfo)
    var gameTitle = document.createElement("p")
    gameTitle.setAttribute("class", "game-title")
    gameTitle.innerHTML = "Which flag is this?"
    gameInfo.appendChild(gameTitle)
    var countryImage = document.createElement("img")
    countryImage.setAttribute("id", "game-flag")
    countryImage.setAttribute("src", `https://flagcdn.com/256x192/${country[0]}.png`)
    gameDiv.appendChild(countryImage);
    var gameOptions = document.createElement("div")
    gameOptions.setAttribute("id", "game-options")
    gameDiv.appendChild(gameOptions)
    var ulOptions = document.createElement("ul")
    gameOptions.appendChild(ulOptions)
    ulOptions.setAttribute("class", "options")
    for (var i = 0; i < 3; i++){
        var li = document.createElement("li")
        ulOptions.appendChild(li)
        var button = document.createElement("button")
        if (i + 1 == optionId) {
            button.innerHTML = country[1]
        } else {
            button.innerHTML = getRandomCountry()
        }
        button.addEventListener('click', checkAnswer, false);
        button.setAttribute("value", i + 1)
        li.appendChild(button)
    }
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
    clearMenu();
    flagsDiv.removeAttribute("class")
    document.body.style['overflow-y'] = 'visible';
    savedFlags.forEach(element => {
        const shortName = element[0], longName = element[1]
        if (!shortName.includes("us-")){
            createFlagContainer(`https://flagcdn.com/84x63/${shortName}.png`, longName)
        }
    });
}

// MENU
function clearMenu() {
    menuDiv.setAttribute("class", "hidden");
}

// FRONT-END CORE
function returnToMenu(){
    if (listOpen == true){
        closeList();
    }
    if (gameOpen == true){
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