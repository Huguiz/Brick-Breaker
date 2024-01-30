// CONSTANCE INITIALIZATION

const WINDOWWIDTH = 800;
const WINDOWHEIGHT = 650;
const PADDLEWIDTH = 100;
const PADDLEHEIGHT = 15;
const PADDLEGAPFROMBOTTOM = 100;
const BALLSIZE = 20;
const BALLCOLOR = "yellow"
const BONUSSIZE = 30;
const BONUSCOLOR = "gray";



// CLASS INITIALIZATION

class Ball {
    constructor(xPosition, yPosition, dx, dy, speed, isFixed) {
        if (xPosition) {
            this.xPosition = xPosition;
        } else {
            this.xPosition = paddleObject.xPosition + paddleObject.width / 2 - BALLSIZE / 2;
        }

        if (yPosition) {
            this.yPosition = yPosition;
        } else {
            this.yPosition = PADDLEGAPFROMBOTTOM + PADDLEHEIGHT;
        }

        if (dx !== null && dy !== null) {
            this.radianAngle = Math.atan2(dx, dy)
            this.dx = Math.cos(this.radianAngle)
            this.dy = Math.sin(this.radianAngle)
        } else {
            this.radianAngle = Math.atan2(-1, 0)
            this.dx = Math.cos(this.radianAngle)
            this.dy = Math.sin(this.radianAngle)
        }
        
        this.speed = speed;
        this.isFixed = isFixed;
        this.ballID = ballID
        ballID += 1;

        this.ballElm = document.createElement("div");
        this.ballElm.classList.add("ball");
        this.ballElm.style.width = BALLSIZE + "px";
        this.ballElm.style.height = BALLSIZE + "px";
        this.ballElm.style.backgroundColor = BALLCOLOR;
        gameContainerElm.appendChild(this.ballElm);

        this.printBall();

        document.addEventListener("keydown", (event) => {
            if (event.code === "Space") {
                this.isFixed = false;
            }
        });
        
        this.loop = setInterval(() => {
            this.calculNextMove();
        }, 5) // Default = 5
    }

    printBall() {
        this.ballElm.style.left = this.xPosition + "px";
        this.ballElm.style.bottom = this.yPosition + "px";
    }

    calculNextMove() {
        if (this.isFixed) {
            this.xPosition = paddleObject.xPosition + paddleObject.width / 2 - BALLSIZE / 2;
            this.printBall();
        } else {
            let nextStepX = this.xPosition + this.dx * this.speed;
            let nextStepY = this.yPosition + this.dy * this.speed;

            if (nextStepY < 0) { // Check if the ball touch the ground
                aliveBallList.forEach((element, index) => {
                    if (element.ballID === this.ballID) {
                        aliveBallList.splice(index, 1)
                    }
                })
                ballDied()
                this.ballElm.remove()
                clearInterval(this.loop);
            } else {
                if (nextStepX < 0 || nextStepX > WINDOWWIDTH - BALLSIZE) { // Check if the ball touch the left and right border
                    this.dx = -this.dx;
                }

                if (nextStepY > WINDOWHEIGHT - BALLSIZE) { // Check if the ball touch the top border
                    this.dy = -this.dy;
                }

                if (this.xPosition >= paddleObject.xPosition - BALLSIZE + 1 && this.xPosition <= paddleObject.xPosition + PADDLEWIDTH - 1 && this.yPosition <= PADDLEGAPFROMBOTTOM + PADDLEHEIGHT + 1 && this.yPosition >= PADDLEGAPFROMBOTTOM + PADDLEHEIGHT - 3) { // Check if the ball touch the top border of the paddle
                    let receivedZone = paddleObject.xPosition + paddleObject.width - this.xPosition;
                    
                    let actualPaddleReceipt = PADDLEWIDTH + BALLSIZE - 1

                    let mappedX = (receivedZone - actualPaddleReceipt) * (30 + 30) / (1 - actualPaddleReceipt) - 30;

                    this.radianAngle = Math.atan2(10, mappedX);
                    this.dx = Math.cos(this.radianAngle);
                    this.dy = Math.sin(this.radianAngle);

                } else if (this.xPosition >= paddleObject.xPosition - BALLSIZE && this.xPosition <= paddleObject.xPosition - BALLSIZE + 30 && this.yPosition >= PADDLEGAPFROMBOTTOM - BALLSIZE && this.yPosition <= PADDLEGAPFROMBOTTOM + PADDLEHEIGHT - 3) { // Check if the ball touch the left border of the paddle                  
                    if (this.dx > 0) {
                        this.dx = -this.dx;
                    }
                } else if (this.xPosition >= paddleObject.xPosition + PADDLEWIDTH - 30 && this.xPosition <= paddleObject.xPosition + PADDLEWIDTH + 1 && this.yPosition >= PADDLEGAPFROMBOTTOM - BALLSIZE && this.yPosition <= PADDLEGAPFROMBOTTOM + PADDLEHEIGHT - 3) { // Check if the ball touch the right border of the paddle
                    if (this.dx < 0) {
                        this.dx = -this.dx;
                    }
                }

                let xReversed = 0;
                let yReversed = 0;
                let firstOccurence = null;

                aliveBrickList.forEach((element) => {
                    let distX = Math.abs((this.xPosition - element.xPosition - element.width/2) + (BALLSIZE)/2);
                    let distY = Math.abs((this.yPosition - element.yPosition - element.height/2) + (BALLSIZE)/2);

                    if (distX <= ((element.width)/2) + (BALLSIZE+3)/2 && distY <= (element.height/2) + (BALLSIZE+3)/2) {
                        if (firstOccurence === null) {
                            if ((this.xPosition >= element.xPosition - BALLSIZE - 5 && this.xPosition <= element.xPosition - BALLSIZE + 1) || (this.xPosition >= element.xPosition + element.width -1 && this.xPosition <= element.xPosition + element.width + 5)) {
                                xReversed += 1;
                            }
                            if ((this.yPosition >= element.yPosition - BALLSIZE - 5 && this.yPosition <= element.yPosition - BALLSIZE + 1) || (this.yPosition >= element.yPosition + element.height -1 && this.yPosition <= element.yPosition + element.height + 5)) {
                                yReversed += 1;
                            }
                            element.getTouched()
                            firstOccurence = element.brickID;
                        }
                    }
                })

                if (xReversed !== 0 ) {
                    this.dx = -this.dx;
                }

                if (yReversed !== 0 ) {
                    this.dy = -this.dy;
                }

                this.xPosition += this.dx * this.speed;
                this.yPosition += this.dy * this.speed;
                this.printBall();
            }
        }
    }
}

class Brick {
    constructor(xPosition, yPosition, width, height, level) {
        this.xPosition = xPosition;
        this.yPosition = yPosition;
        this.width = width;
        this.height = height;
        this.level = level;
        this.brickID = brickID;
        brickID += 1;

        this.brickElm = document.createElement("div");
        this.brickElm.classList.add("brick-" + this.level);
        this.brickElm.style.width = this.width - 4 + "px";
        this.brickElm.style.height = this.height - 4 + "px";
        gameContainerElm.appendChild(this.brickElm);

        this.printBrick()
    }

    printBrick() {
        this.brickElm.style.left = this.xPosition + 2 + "px";
        this.brickElm.style.bottom = this.yPosition + 2 + "px";
    }

    getTouched() {
        this.level -= 1;
        if (this.level === 0) {
            modifyScore(8)
            bonusBrickLink.forEach((element) => {
                if (this.brickID === element[0]) {
                    aliveBonusList.push(new Bonus(this.xPosition + this.width / 2 - BONUSSIZE / 2, this.yPosition + this.height / 2 - BONUSSIZE / 2, element[1]))
                }
            })
            this.brickElm.remove()
            aliveBrickList.forEach((element, index) => {
                if (element.brickID === this.brickID) {
                    aliveBrickList.splice(index, 1)
                }
            })
            nextLevel()
        } else if (this.level === 1) {
            modifyScore(5)
            this.brickElm.classList.remove("brick-2");  
            this.brickElm.classList.add("brick-1");
        } else if (this.level === 2) {
            modifyScore(4)
            this.brickElm.classList.remove("brick-3");  
            this.brickElm.classList.add("brick-2");  
        } else if (this.level === 3) {
            modifyScore(3)
            this.brickElm.classList.remove("brick-4");  
            this.brickElm.classList.add("brick-3");  
        } else if (this.level === 4) {
            modifyScore(2)
            this.brickElm.classList.remove("brick-5");  
            this.brickElm.classList.add("brick-4");  
        } else if (this.level === 5) {
            modifyScore(1)
            this.brickElm.classList.remove("brick-6");  
            this.brickElm.classList.add("brick-5");  
        }
    }
}

class Paddle {
    constructor(xPosition, width) {
        this.xPosition = xPosition;
        this.width = width;
        paddleElm.style.width = PADDLEWIDTH + "px";
        paddleElm.style.height = (PADDLEHEIGHT - 5) + "px"; // substract the border bottom width
        paddleElm.style.bottom = PADDLEGAPFROMBOTTOM + "px";
        this.printPaddle();
    }

    printPaddle() {
        paddleElm.style.left = this.xPosition + "px";
        paddleElm.style.width = this.width + "px";
    }

    movePaddle(direction) {
        if (direction === "left" && this.xPosition > 0) {
            this.xPosition -= 2;
        } else if (direction === "right" && this.xPosition < WINDOWWIDTH - this.width) {
            this.xPosition += 2;
        }
        this.printPaddle()
    }
}

class Bonus {
    constructor(xPosition, yPosition, type) {
        this.xPosition = xPosition;
        this.yPosition = yPosition;
        this.type = type;
        this.bonusID = bonusID;
        bonusID += 1;

        this.bonusElm = document.createElement("div");
        this.bonusElm.classList.add("bonus");
        this.bonusElm.style.width = BONUSSIZE + "px";
        this.bonusElm.style.height = BONUSSIZE + "px";
        this.bonusElm.style.backgroundColor = BONUSCOLOR;
        gameContainerElm.appendChild(this.bonusElm);

        this.bonusElm.style.left = this.xPosition + "px";
        this.printBonus()

        this.loop = setInterval(() => {
            this.calculNextMove();
        }, 100)
    }

    printBonus() {
        this.bonusElm.style.bottom = this.yPosition + "px";
    }

    calculNextMove() {
        this.yPosition -= 2;
        if (this.xPosition < paddleObject.xPosition + paddleObject.width && this.xPosition + BONUSSIZE > paddleObject.xPosition && this.yPosition < PADDLEGAPFROMBOTTOM + PADDLEHEIGHT && this.yPosition + BONUSSIZE > PADDLEGAPFROMBOTTOM) {
            clearInterval(this.loop)
            this.bonusElm.remove()
            aliveBonusList.forEach((element, index) => {
                if (element.bonusID === this.bonusID) {
                    aliveBonusList.splice(index, 1)
                }
            })
            console.log(this.type)
            // to continue...
        } else if (this.yPosition <= 0) {
            clearInterval(this.loop)
            this.bonusElm.remove()
            aliveBonusList.forEach((element, index) => {
                if (element.bonusID === this.bonusID) {
                    aliveBonusList.splice(index, 1)
                }
            })
        } else {
            this.printBonus();
        }
    }
}


// DOCUMENT ELEMENT INITIALIZATION

const paddleElm = document.getElementById("paddle");
const gameContainerElm = document.getElementById("brick-container");
const remainingLivesElm = document.getElementById("live");
const scoreElm = document.getElementById("score");
const boxInfoElm = document.getElementById("box-info");
const gameOverElm = document.getElementById("loose");
const restartTxtElm = document.getElementById("restart-txt");
const restartBtnElm = document.getElementById("restart");
const timerElm = document.getElementById("timer");
const levelElm = document.getElementById("level");

restartBtnElm.addEventListener("click", () => {
    gameOverElm.style.visibility = "hidden";
    initGame();
})



// PADDLE INITIALIZATION

const paddleObject = new Paddle(WINDOWWIDTH / 2 - PADDLEWIDTH / 2, PADDLEWIDTH);



// PADDLE EVENT LISTENER INITIALIZATION

let leftEnable = false;
let rightEnable = false;
let leftEvtLstnr;
let rigthEvtLstnr;
document.addEventListener("keydown", (event) => {
    if (event.code === "ArrowLeft" && !leftEnable) {
        leftEvtLstnr = setInterval(() => {paddleObject.movePaddle("left")}, 5);
        paddleObject.movePaddle("left")
        leftEnable = true;
    } else if (event.code === "ArrowRight" && !rightEnable) {
        rigthEvtLstnr = setInterval(() => {paddleObject.movePaddle("right")}, 5);
        paddleObject.movePaddle("right")
        rightEnable = true;
    }
});

document.addEventListener("keyup", (event) => {
    if (event.code === "ArrowLeft") {
        clearInterval(leftEvtLstnr)
        leftEnable = false;
    } else if (event.code === "ArrowRight") {
        clearInterval(rigthEvtLstnr)
        rightEnable = false;
    }
});



// GAME VARIABLE INITIALIZATION

const aliveBallList = [];
const aliveBrickList = [];
const aliveBonusList = [];
let bonusBrickLink = [];
let brickID = 1;
let ballID = 1;
let bonusID = 1;
let numberOfLive = 10;
let score = 0;
let timer;
let timerValue = 0;
let currentGameLevel = 0;



// GAME FUNCTION INITIALIZATION

function modifyScore(number) {
    score += number;
    scoreElm.innerHTML = score;
}

function ballDied() {
    if (!aliveBallList.length) {
        numberOfLive -= 1;
        modifyScore(-100)
        printLives();
        if (!numberOfLive) {
            gameOver();
        } else {
            aliveBallList.push(new Ball(null, null, null, null, 2.3, true));
        }
    }
}

function printLives() {
    if (!numberOfLive) {
        remainingLivesElm.innerHTML = "0";
    } else {
        let liveSentence = "";
        for (let i = 0; i < numberOfLive; i++) {
            liveSentence += "❤️";
        }
        remainingLivesElm.innerHTML = liveSentence;
    }
    
}

function printLevel() {
    levelElm.innerHTML = (currentGameLevel + 1) + "/" + gameLevel.length
}

function gameOver() {
    if (aliveBrickList.length) {
        aliveBrickList.forEach((element) => {
            element.brickElm.remove()
        })
        aliveBonusList.forEach((element) => {
            element.bonusElm.remove()
        })
    }
    stopTimer()
    restartTxtElm.innerHTML = "Game over !"
    gameOverElm.style.visibility = "visible"
    aliveBallList.splice(0, aliveBallList.length)
    aliveBrickList.splice(0, aliveBrickList.length)
    aliveBonusList.splice(0, aliveBonusList.length)
    bonusID = 1;
    brickID = 1;
    ballID = 1;
    numberOfLive = 3;
    score = 0;
    timerValue = 0;
    currentGameLevel = 0;
}

function nextLevel() {
    if (!aliveBrickList.length) {
        aliveBallList.forEach((element) => {
            element.ballElm.remove();
            clearInterval(element.loop);
            aliveBallList.splice(0, aliveBallList.length);
        })
        stopTimer();
        bonusID = 1;
        brickID = 1;
        ballID = 1;
        numberOfLive = 3;
        if (currentGameLevel + 1 === gameLevel.length) {
            restartTxtElm.innerHTML = "You won !<br\>" + score + " points in " + timerValue + "s !"
            gameOverElm.style.visibility = "visible"
            score = 0;
            timerValue = 0;
            currentGameLevel = 0;
        } else {
            boxInfoElm.innerHTML = "Good !<br\>Now let's move to the next level...";
            boxInfoElm.style.visibility = "visible";
            setTimeout(() => {
                boxInfoElm.style.visibility = "hidden";
                currentGameLevel += 1;
                initGame()
            }, 3000)
        }
    }
}

function initGame() {
    printLives();
    modifyScore(0);
    printLevel();
    startTimer();

    paddleObject.xPosition = WINDOWWIDTH / 2 - PADDLEWIDTH / 2;
    paddleObject.printPaddle();
    

    gameLevel[currentGameLevel].forEach((element) => {
        aliveBrickList.push(new Brick(element[0], element[1], element[2], element[3], element[4]));
    })

    let numberOfBonus = Math.floor(gameLevel[currentGameLevel].length * 0.15);

    if (numberOfBonus < 1) {
        numberOfBonus = 1;
    }

    for (let i = 0; i < numberOfBonus; i++) {
        let doubleDetected = true;
        while (doubleDetected) {
            let checkIfNotDouble = ([Math.floor(Math.random() * gameLevel[currentGameLevel].length + 1), Math.floor(Math.random() * 4)])
            if (bonusBrickLink.length) {
                doubleDetected = false;
                bonusBrickLink.forEach((element) => {
                    if (element[0] === checkIfNotDouble[0]) {
                        doubleDetected = true;
                    }
                })
            } else {
                doubleDetected = false;
            }

            if (!doubleDetected) {
                bonusBrickLink.push(checkIfNotDouble);
            }
        }
    }

    // new Bonus(300, 500, 1)

    // aliveBallList.push(new Ball(490, PADDLEGAPFROMBOTTOM + 140, 0, -1, 2 , false)); // balle de droite
    // aliveBallList.push(new Ball(370, PADDLEGAPFROMBOTTOM + 140, 0, 1, 2 , false)); // balle de gauche
    // aliveBallList.push(new Ball(420, PADDLEGAPFROMBOTTOM + 95, 1, 0, 2 , false)); // balle de bas
    // aliveBallList.push(new Ball(421, PADDLEGAPFROMBOTTOM + 180, -1, 0, 2 , false)); // balle de haut

    aliveBallList.push(new Ball(null, null, null, null, 2, true));
}

function startTimer() {
    timer = setInterval(() => {
        timerValue += 1;
        let min = Math.floor(timerValue / 60);
        let sec = timerValue % 60;
        if (min < 10) {
            min = "0" + min
        }
        if (sec < 10) {
            sec = "0" + sec
        }
        timerElm.innerHTML = min + ":" + sec
    }, 1000)
}

function stopTimer() {
    clearInterval(timer);
}



// BRICKS LEVEL INITIALIZATION

const level1 = [
    [60, 560, 60, 30, 2], [120, 560, 60, 30, 1], [180, 560, 60, 30, 1], [240, 560, 60, 30, 1], [300, 560, 60, 30, 2], [440, 560, 60, 30, 2], [500, 560, 60, 30, 1], [560, 560, 60, 30, 1], [620, 560, 60, 30, 1], [680, 560, 60, 30, 2],
    [60, 530, 60, 30, 2], [120, 530, 60, 30, 1], [180, 530, 60, 30, 2], [240, 530, 60, 30, 1], [300, 530, 60, 30, 2], [440, 530, 60, 30, 2], [500, 530, 60, 30, 1], [560, 530, 60, 30, 2], [620, 530, 60, 30, 1], [680, 530, 60, 30, 2],
    [60, 500, 60, 30, 3], [120, 500, 60, 30, 1], [180, 500, 60, 30, 1], [240, 500, 60, 30, 1], [300, 500, 60, 30, 3], [440, 500, 60, 30, 3], [500, 500, 60, 30, 1], [560, 500, 60, 30, 1], [620, 500, 60, 30, 1], [680, 500, 60, 30, 3],
    [60, 470, 60, 30, 3], [120, 470, 60, 30, 1], [180, 470, 60, 30, 1], [240, 470, 60, 30, 1], [300, 470, 60, 30, 3], [440, 470, 60, 30, 3], [500, 470, 60, 30, 1], [560, 470, 60, 30, 1], [620, 470, 60, 30, 1], [680, 470, 60, 30, 3],
    [60, 440, 60, 30, 3], [120, 440, 60, 30, 2], [180, 440, 60, 30, 2], [240, 440, 60, 30, 2], [300, 440, 60, 30, 3], [440, 440, 60, 30, 3], [500, 440, 60, 30, 2], [560, 440, 60, 30, 2], [620, 440, 60, 30, 2], [680, 440, 60, 30, 3],
    [60, 410, 60, 30, 4], [120, 410, 60, 30, 4], [180, 410, 60, 30, 4], [240, 410, 60, 30, 4], [300, 410, 60, 30, 4], [440, 410, 60, 30, 4], [500, 410, 60, 30, 4], [560, 410, 60, 30, 4], [620, 410, 60, 30, 4], [680, 410, 60, 30, 4]
]

const testLevel1 = [[180, 250, 60, 30, 4], [260, 250, 60, 30, 4], [340, 250, 60, 30, 4], [420, 250, 60, 30, 4], [500, 250, 60, 30, 4], [580, 250, 60, 30, 4]]
const testLevel2 = [[365, 250, 60, 30, 2]]

// const gameLevel = [testLevel1, testLevel2]
const gameLevel = [level1]

initGame()