
// global vars
var dx = [-1, 0, 1, -1, 1, -1, 0, 1];
var dy = [-1, -1, -1, 0, 0, 1, 1, 1];
var mineCount = 55;
var rowCount = 20;
var colCount = 28;
var onCount = 0;
var playing = false;

var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

context.fillStyle = "#030303";
context.fillRect(0, 0, 700, 500);
window.onload = function() {
    document.getElementById("loader").style.display = "none";
    displayText();
}

function displayText() {
    context.fillStyle = "#ffffff";
    context.font = "16px Ubuntu Mono";
    context.fillText("Welcome to Spacesweeper.", 45, 75);
    context.fillText("You are an astronaut traveling in space on a mission to discover a new", 45, 95);
    context.fillText("planet for humanity to settle on.", 45, 115);
    context.fillText("You have reached unknown territory and need to carefully guide your", 45, 135);
    context.fillText("spaceship through the region without setting off any of the explosive", 45, 155);
    context.fillText("planets.", 45, 175);
    context.fillText("Uncover the entire area on the screen to safely get through.", 45, 195);
    context.fillText("Left click to uncover cells.", 45, 235);
    context.fillText("Numbers that appear represent how many planets are in the cells", 45, 255);
    context.fillText("surrounding (adjacent or diagonal to) the cell.", 45, 275);
    context.fillText("Right click to mark a space as containing a planet.", 45, 295);
    context.fillText("Left clicking on a spot where a planet is present will set off a chain of", 45, 315);
    context.fillText("explosions and the world will end.", 45, 335);
    context.fillText("The future of our universe is in your hands...", 45, 355);
    context.fillText("Good luck!", 45, 375);
    context.fillText("[Press space to accept the mission]", 45, 415);
}

// switch screens to game board
document.addEventListener('keyup', event => {
    if(playing === true) return;
    if (event.code === 'Space') {
      console.log('Space pressed');
      setup();
    }
})

// sets up the playing board
function setup() {
    playing = true;
    context.fillStyle = "#332cb0";
    context.fillRect(0, 0, 700, 500);

    for(var i = 0; i <= 28; i++) { // vertical - x
        context.beginPath();
        context.moveTo(i*25, 0);
        context.lineTo(i*25, 500);
        context.lineWidth = 0.2;
        context.stroke();
    }
    for(var i = 0; i <= 20; i++) { // horizontal - y
        context.beginPath();
        context.moveTo(0, i*25);
        context.lineTo(700, i*25);
        context.lineWidth = 0.2;
        context.stroke();
    }

}

var mines = new Array(20);
for(var i = 0; i < mines.length; i++) {
    mines[i] = new Array(28);
}
for(var i = 0; i < mines.length; i++) {
    for(var j = 0; j < mines[0].length; j++) {
        mines[i][j] = false;
    }
}
for(var i = 0; i < mineCount; i++) {
    while(true) {
        var x = randomNum(28);
        var y = randomNum(20);
        if(mines[y][x] === false) {
            // console.log(x + " " + y);
            mines[y][x] = true;
            break;
        }
    }
}
var nom = new Array(20);
for(var i = 0; i < nom.length; i++) {
    nom[i] = new Array(28);
}
for(var i = 0; i < mines.length; i++) {
    for(var j = 0; j < mines[0].length; j++) {
        nom[i][j] = getMineCount(i, j);
    }
}
function getMineCount(r, c) {
    var count = 0;
    for(var i = 0; i < 8; i++) {
        var rr = r+dy[i];
        var cc = c+dx[i];
        if(rr >= 0 && rr < rowCount && cc >= 0 && cc < colCount) {
            if(mines[rr][cc]) {
                count++;
            }
        }
    }
    return count;
}

// function for random coordinates
function randomNum(x) {
    var temp = Math.floor(Math.random()*x);
    return temp;
}

// LEFT CLICK
canvas.addEventListener("click", action, false);
function action(event) {
    if(playing === false) return;
    var rect = canvas.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
    var row = Math.floor(y/25);
    var col = Math.floor(x/25);
    console.log(row + " "+ col);

    if(mines[row][col]) { // is a mine, GAME OVER
        for(var i = 0; i < mines.length; i++) {
            for(var j = 0; j < mines[0].length; j++) {
                if(mines[i][j]) {
                    displayMine(i, j, "#db0000");
                }
            }
        }
    } else {
        floodfill(row, col);
        if(onCount === mineCount && done()) {
            context.fillStyle = "#ffffff";
            context.fillRect(0, 0, 700, 500);
            console.log(onCount);
            console.log("hello world");
        }
    }
}

// RIGHT CLICK
// 0 = not visited/off
// 1 = visited
// 2 = on
var toggle = new Array(20);
for(var i = 0; i < toggle.length; i++) {
    toggle[i] = new Array(28);
}
for(var i = 0; i < toggle.length; i++) {
    for(var j = 0; j < toggle[0].length; j++) {
        toggle[i][j] = 0;
    }
}
canvas.addEventListener("contextmenu", showMine, false);
function showMine(event) {
    if(playing === false) return;
    var rect = canvas.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
    var row = Math.floor(y/25);
    var col = Math.floor(x/25);
    event.preventDefault();

    if(toggle[row][col] === 2) {
        context.fillStyle = "#332cb0";
        context.fillRect(col*25, row*25, 25, 25);
        toggle[row][col] = 0;
        onCount--;
    } else if(toggle[row][col] === 0) {
        displayMine(row, col, "#1f1275");
        toggle[row][col] = 2;
        onCount++;
    }

    if(onCount === mineCount && done()) {
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, 700, 500);
        console.log("hello world 2");
    }

}

function done() {
    for(var i = 0; i < toggle.length; i++) {
        for(var j = 0; j < toggle[0].length; j++) {
            if(toggle[i][j] === 0) {
                return false;
            }
            if(toggle[i][j] === 2 && mines[i][j] !== true) {
                return false;
            }
        }
    }
    return true;
}

var planets = ["./saturn2.png", "./earth.png", "./moon.png"];
function displayMine(row, col, color) {
    context.fillStyle = color;
    context.fillRect(col*25, row*25, 25, 25);
    var img = new Image();
    var planetIndex = Math.floor(Math.random()*planets.length);
    img.src = planets[planetIndex];
    img.onload = function() {
        if(planetIndex === 1) {
            context.drawImage(img, col*25+3, row*25+3, 18, 18);
        } else if(planetIndex === 2) {
            context.drawImage(img, col*25+4, row*25+4, 16, 16);
        } else {
            context.drawImage(img, col*25+2, row*25+5);
        }
    }
}

function floodfill(r, c) {
    console.log(r + " "+ c);
    if(r < 0 || r >= mines.length || c < 0 || c >= mines[0].length) {
        return;
    }
    if(toggle[r][c] >= 1) {
        return;
    }
    if(mines[r][c]) {
        return;
    }

    toggle[r][c] = 1;
    context.fillStyle = "#1f1275";
    context.fillRect(c*25, r*25, 25, 25);
    if(nom[r][c] > 0) {
        displayCount(r, c);
    } else {
        for(var i = 0; i < 8; i++) {
            floodfill(r+dy[i], c+dx[i]);
        }
    }

}

var colors = ["#fff719", "#ffb30f", "#ff8b0f", "#ff530f", "#ff270f", "#f00000"];
function displayCount(row, col) {
    context.fillStyle = colors[nom[row][col] - 1];
    context.textAlign = "center";
    context.font = "10px Arial";
    context.fillText(nom[row][col], col*25+12.5, row*25+12.5);
}