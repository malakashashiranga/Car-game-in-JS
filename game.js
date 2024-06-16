const score_bar = document.querySelector('.score_bar');   //select an element from html
const startScreen = document.querySelector('.greeting');
const gameArea = document.querySelector('.road');
var roadLines = document.querySelectorAll(".l_sub_line, .r_sub_line");     //select these element for one variable
const start = document.querySelector(".start");
const over = document.querySelector(".gameOver");
var playerName = document.getElementById("box").value;

var rotationAngle = 10;
var step = 3;
var score= 0;
let player = {};

var isMovingLeft = false;
var isMovingRight = false;

score_bar.style.display = 'none';
over.style.display = 'none';


start.addEventListener('click', () => {          //game start after click start button

  var playerName = document.getElementById("box").value;

  if (playerName.trim() !== "") {               //game start if name entered

    startScreen.classList.add('hide');
    gameArea.innerHTML = "";
    score_bar.style.display = 'block';
      
    player.start = true;
    score = 0;
    window.requestAnimationFrame(gamePlay);

    let my_car = document.createElement('div');       //element show, after game started
    my_car.setAttribute('class', 'car');
    gameArea.appendChild(my_car);

    player.x = my_car.offsetLeft;
    player.y = my_car.offsetTop;

    displayEnemyCars();

    let midLine = document.createElement('div');
    midLine.setAttribute('class', 'mid_line');
    gameArea.appendChild(midLine);

    let leftSubLine = document.createElement('div');
    leftSubLine.setAttribute('class', 'l_sub_line');
    leftSubLine.setAttribute('id', 'l_sub_line');
    gameArea.appendChild(leftSubLine);

    let rightSubLine = document.createElement('div');
    rightSubLine.setAttribute('class', 'r_sub_line');
    rightSubLine.setAttribute('id', 'r_sub_line');
    gameArea.appendChild(rightSubLine);

    startStepIncrement();
  }
});


function displayEnemyCars() {

  const enemyCarImages = ['img/car2.png', 'img/car3.png', 'img/car.png'];    
  
  let imageIndex = 0; 
  const leftPositions = [30, 100, 200, 280, 350]; 
  const enemyCarYPositions = [-450, -900, -1350, -1800, -2150]; 

  for (let i = 0; i < 5; i++) {
    var enemyCar = document.createElement('div');
    enemyCar.setAttribute('class', 'enemyCar');

    enemyCar.y = enemyCarYPositions[i]; 
    enemyCar.style.top = enemyCar.y + "px";                           //change enemy car top using array
    enemyCar.style.left = leftPositions[i] + "px";                    // change enemy car left using array

    const imageName = enemyCarImages[imageIndex];                      //change enemy car image
    enemyCar.style.backgroundImage = `url(${imageName})`;
    imageIndex = (imageIndex + 1) % enemyCarImages.length; 

    gameArea.appendChild(enemyCar);
  }
}


function rotateCar() {          //rotate the car when moving

  let car = document.querySelector('.car');
    
  if (isMovingLeft) {
    car.style.transform = "rotate(-" + rotationAngle + "deg)";
  } 
  else if (isMovingRight) {
    car.style.transform = "rotate(" + rotationAngle + "deg)";
  } 
  else {
    car.style.transform = "rotate(0)";
  }
}


function Collision(my_car,enemyCars){       //collision check between user car and enemy cars
  
  mc = my_car.getBoundingClientRect();
  ec = enemyCars.getBoundingClientRect();
    
  return !((mc.top >  ec.bottom) || (mc.bottom <  ec.top) || (mc.right <  ec.left) || (mc.left >  ec.right)); 
}
 

function GameOver() {          //display notification when game over
  
  player.start = false;

  over.style.display = 'block';
  over.innerHTML = "Game Over <br> Your score is " + score + "<br>Score is printed in the file.";

  score_bar.style.display = 'none';

  saveScore();
}
  

function moveCar(my_car){                          // enemy cars loop moving
  
  let enemyCars = document.querySelectorAll('.enemyCar');
  enemyCars.forEach(function(enemyCars){
    
  if(Collision(my_car,enemyCars)){
    GameOver();
  }
    
  if(enemyCars.y >= 800){
    enemyCars.y -= 800;
    enemyCars.style.left = Math.floor(Math.random() * 500) + "<br>px";
  }
  
  enemyCars.y += step;
  enemyCars.style.top = enemyCars.y + "px";
  })
}
    

function gamePlay() {                  // features while game play
        
  let my_car = document.querySelector('.car');
  let road = gameArea.getBoundingClientRect();
        
  if(player.start){                    //user car moving
        
    moveCar(my_car);

    if(isMovingLeft && player.x > 0){ 
      player.x -= step
    }
    else if(isMovingRight && player.x < (road.width - 60)){
      player.x += step
    }
    
    my_car.style.left = player.x + "px";
    window.requestAnimationFrame(gamePlay);
    updateScore();       
  }
}


function saveScore() {              //save name, score, date and time in file

  var playerName = document.getElementById("box").value;
  var currentDate = new Date();
  var dateTimeString = currentDate.toLocaleString();

  var scoreText = playerName + "'s Score is " + score + "\nDate/Time: " + dateTimeString;
  const blob = new Blob([scoreText], { type: 'text/plain' });
      
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'score.txt';
  link.click();
}


document.addEventListener("keydown", function (event) {
  switch (event.keyCode) {
    case 37: // Left arrow key
      isMovingLeft = true;
      break;
    case 39: // Right arrow key
      isMovingRight = true;
      break;
  } 
  rotateCar();
});


document.addEventListener("keyup", function (event) {
  switch (event.keyCode) {
    case 37: // Left arrow key
      isMovingLeft = false;
      break;
    case 39: // Right arrow key
      isMovingRight = false;
      break;
  }
  rotateCar();
});


function updateScore() {   //show update score
  score_bar.innerText = "Score: " + score;
}

   
setInterval(function() {
  score++; // Increment the score
  updateScore(); 
}, 1000);   


function startStepIncrement() {          //increament speed
  stepInterval = setInterval(() => {
    if (step < 15) {
      step++;
    } 
    else {
            clearInterval(stepInterval);
    }
  }, 20000);
}