// CONSTANCE INITIALIZATION

const WINDOWWIDTH = 800;
const WINDOWHEIGHT = 650;
const DEFAULTPADDLEWIDTH = 100;
const PADDLEHEIGHT = 15;
const PADDLEGAPFROMBOTTOM = 100;
const BALLSIZE = 20;
const BALLCOLOR = "yellow"
const BONUSSIZE = 30;
const BONUSCOLOR = "gray";
const GUNDISTANCEFROMEDGE = 10;



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
                let newAliveBallList = aliveBallList.filter((element) => {
                    if (element.ballID !== this.ballID) {
                        return element;
                    }
                })

                aliveBallList = [...newAliveBallList]

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

                if (this.xPosition >= paddleObject.xPosition - BALLSIZE + 1 && this.xPosition <= paddleObject.xPosition + paddleObject.width - 1 && this.yPosition <= PADDLEGAPFROMBOTTOM + PADDLEHEIGHT + 1 && this.yPosition >= PADDLEGAPFROMBOTTOM + PADDLEHEIGHT - 3) { // Check if the ball touch the top border of the paddle
                    let receivedZone = paddleObject.xPosition + paddleObject.width - this.xPosition;
                    
                    let actualPaddleReceipt = paddleObject.width + BALLSIZE - 1

                    let mappedX = (receivedZone - actualPaddleReceipt) * (30 + 30) / (1 - actualPaddleReceipt) - 30;

                    this.radianAngle = Math.atan2(10, mappedX);
                    this.dx = Math.cos(this.radianAngle);
                    this.dy = Math.sin(this.radianAngle);

                } else if (this.xPosition >= paddleObject.xPosition - BALLSIZE && this.xPosition <= paddleObject.xPosition - BALLSIZE + 30 && this.yPosition >= PADDLEGAPFROMBOTTOM - BALLSIZE && this.yPosition <= PADDLEGAPFROMBOTTOM + PADDLEHEIGHT - 3) { // Check if the ball touch the left border of the paddle                  
                    if (this.dx > 0) {
                        this.dx = -this.dx;
                    }
                } else if (this.xPosition >= paddleObject.xPosition + paddleObject.width - 30 && this.xPosition <= paddleObject.xPosition + paddleObject.width + 1 && this.yPosition >= PADDLEGAPFROMBOTTOM - BALLSIZE && this.yPosition <= PADDLEGAPFROMBOTTOM + PADDLEHEIGHT - 3) { // Check if the ball touch the right border of the paddle
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
            

            let newAliveBrickList = aliveBrickList.filter((element) => {
                if (element.brickID !== this.brickID) {
                    return element;
                }
            })

            aliveBrickList = [...newAliveBrickList]

            this.brickElm.remove()



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
        paddleElm.style.width = DEFAULTPADDLEWIDTH + "px";
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



        this.bonusImgElm = document.createElement("img");

        if (this.type === 0) { // +1 life
            this.bonusImgElm.src = "./img/heart-plus.png"
        } else if (this.type === 1) { // +1 ball
            this.bonusImgElm.src = "./img/ball-plus.png"
        } else if (this.type === 2) { // extend the paddle
            this.bonusImgElm.src = "./img/paddle-expand.png"
        } else if (this.type === 3) { // shootgun for 4 sec
            this.bonusImgElm.src = "./img/machine-gun.png"
        }

        this.bonusElm.appendChild(this.bonusImgElm);

        gameContainerElm.appendChild(this.bonusElm);

        this.bonusElm.style.left = this.xPosition + "px";
        this.printBonus()

        this.loop = setInterval(() => {
            this.calculNextMove();
        }, 8)
    }

    printBonus() {
        this.bonusElm.style.bottom = this.yPosition + "px";
    }

    calculNextMove() {
        this.yPosition -= 2;
        if (this.xPosition < paddleObject.xPosition + paddleObject.width && this.xPosition + BONUSSIZE > paddleObject.xPosition && this.yPosition < PADDLEGAPFROMBOTTOM + PADDLEHEIGHT && this.yPosition + BONUSSIZE > PADDLEGAPFROMBOTTOM) {

            applyBonus(this.type)

            let newAliveBonusList = aliveBonusList.filter((element) => {
                if (element.bonusID !== this.bonusID) {
                    return element;
                }
            })

            aliveBonusList = [...newAliveBonusList]

            this.bonusElm.remove()
            clearInterval(this.loop);

        } else if (this.yPosition <= 0) {
            let newAliveBonusList = aliveBonusList.filter((element) => {
                if (element.bonusID !== this.bonusID) {
                    return element;
                }
            })
            aliveBonusList = [...newAliveBonusList]

            this.bonusElm.remove()
            clearInterval(this.loop);
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

const paddleObject = new Paddle(WINDOWWIDTH / 2 - DEFAULTPADDLEWIDTH / 2, DEFAULTPADDLEWIDTH);



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

let aliveBallList = [];
let aliveBrickList = [];
let aliveBonusList = [];
let bonusBrickLink = [];
let brickID = 1;
let ballID = 1;
let bonusID = 1;
let numberOfLive = 3;
let score = 0;
let timer;
let timerValue = 0;
let currentGameLevel = 0;
let gunActive = false;



// GAME FUNCTION INITIALIZATION

function applyBonus(bonusType) {
    console.log(bonusType)
    if (bonusType === 0) { // +1 life
        numberOfLive += 1;
        printLives();
    } else if (bonusType === 1) { // +1 ball
        aliveBallList.push(new Ball(Math.floor(Math.random() * 600 + 100), PADDLEGAPFROMBOTTOM + 50, 10, Math.random() * 40 - 20, 2, false));
    } else if (bonusType === 2) { // extend the paddle
        paddleObject.width += 40
        if (paddleObject.xPosition > WINDOWWIDTH - paddleObject.width) {
            paddleObject.xPosition = WINDOWWIDTH - paddleObject.width;
        }
        paddleObject.printPaddle()
    } else if (bonusType === 3) { // shootgun for 4 sec
        if (!gunActive) {
            gunActive = true;
            const leftGun = document.createElement("div");
            const rightGun = document.createElement("div");
            leftGun.classList.add("gun");
            rightGun.classList.add("gun");

            leftGun.style.bottom = (PADDLEGAPFROMBOTTOM + PADDLEHEIGHT) + "px"
            rightGun.style.bottom = (PADDLEGAPFROMBOTTOM + PADDLEHEIGHT) + "px"

            gameContainerElm.appendChild(leftGun);
            gameContainerElm.appendChild(rightGun);

            const gunTimerInterval = setInterval(() => {
                leftGun.style.left = (paddleObject.xPosition + GUNDISTANCEFROMEDGE) + "px";
                rightGun.style.left = (paddleObject.xPosition + paddleObject.width - GUNDISTANCEFROMEDGE - 15) + "px";
            }, 10)

            setTimeout(() => {
                clearInterval(gunTimerInterval)
                leftGun.remove()
                rightGun.remove()
                gunActive = false;
            }, 3500)
        }
    }
}

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
        
    }

    if (aliveBonusList.length) {
        aliveBonusList.forEach((element) => {
            element.bonusElm.remove()
            clearInterval(element.loop);
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
        if (aliveBallList.length) {
            aliveBallList.forEach((element) => {
                element.ballElm.remove()
                clearInterval(element.loop);
            })
            
        }
        
        if (aliveBonusList.length) {
            aliveBonusList.forEach((element) => {
                element.bonusElm.remove()
                clearInterval(element.loop);
            })
        }

        aliveBallList.splice(0, aliveBallList.length)
        aliveBonusList.splice(0, aliveBonusList.length)



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

    paddleObject.xPosition = WINDOWWIDTH / 2 - DEFAULTPADDLEWIDTH / 2;
    paddleObject.width = DEFAULTPADDLEWIDTH;
    paddleObject.printPaddle();
    

    gameLevel[currentGameLevel].forEach((element) => {
        aliveBrickList.push(new Brick(element[0], element[1], element[2], element[3], element[4]));
    })

    let numberOfBonus = Math.floor(gameLevel[currentGameLevel].length * 0.15);

    if (numberOfBonus < 1) {
        numberOfBonus = 1;
    }

    bonusBrickLink.splice(0, bonusBrickLink.length)

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

    aliveBonusList.push(new Bonus(380, 200, 2))
    aliveBonusList.push(new Bonus(380, 400, 3))

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

const level2 = [
    [68, 540, 60, 30, 1], [128, 540, 60, 30, 2], [188, 540, 60, 30, 3], [248, 540, 60, 30, 4], [308, 540, 60, 30, 5], [368, 540, 60, 30, 6], [428, 540, 60, 30, 1], [488, 540, 60, 30, 2], [548, 540, 60, 30, 3], [608, 540, 60, 30, 4], [668, 540, 60, 30, 5],
    [68, 510, 60, 30, 6], [128, 510, 60, 30, 1], [188, 510, 60, 30, 2], [248, 510, 60, 30, 3], [308, 510, 60, 30, 4], [368, 510, 60, 30, 5], [428, 510, 60, 30, 6], [488, 510, 60, 30, 1], [548, 510, 60, 30, 2], [608, 510, 60, 30, 3], [668, 510, 60, 30, 4],
    [68, 480, 60, 30, 5], [128, 480, 60, 30, 6], [188, 480, 60, 30, 1], [248, 480, 60, 30, 2], [308, 480, 60, 30, 3], [368, 480, 60, 30, 4], [428, 480, 60, 30, 5], [488, 480, 60, 30, 6], [548, 480, 60, 30, 1], [608, 480, 60, 30, 2], [668, 480, 60, 30, 3],
    [68, 450, 60, 30, 4], [128, 450, 60, 30, 5], [188, 450, 60, 30, 6], [248, 450, 60, 30, 1], [308, 450, 60, 30, 2], [368, 450, 60, 30, 3], [428, 450, 60, 30, 4], [488, 450, 60, 30, 5], [548, 450, 60, 30, 6], [608, 450, 60, 30, 1], [668, 450, 60, 30, 2],
    [68, 420, 60, 30, 3], [128, 420, 60, 30, 4], [188, 420, 60, 30, 5], [248, 420, 60, 30, 6], [308, 420, 60, 30, 1], [368, 420, 60, 30, 2], [428, 420, 60, 30, 3], [488, 420, 60, 30, 4], [548, 420, 60, 30, 5], [608, 420, 60, 30, 6], [668, 420, 60, 30, 1],
    [68, 390, 60, 30, 2], [128, 390, 60, 30, 3], [188, 390, 60, 30, 4], [248, 390, 60, 30, 5], [308, 390, 60, 30, 6], [368, 390, 60, 30, 1], [428, 390, 60, 30, 2], [488, 390, 60, 30, 3], [548, 390, 60, 30, 4], [608, 390, 60, 30, 5], [668, 390, 60, 30, 6],
    [68, 360, 60, 30, 1], [128, 360, 60, 30, 2], [188, 360, 60, 30, 3], [248, 360, 60, 30, 4], [308, 360, 60, 30, 5], [368, 360, 60, 30, 6], [428, 360, 60, 30, 1], [488, 360, 60, 30, 2], [548, 360, 60, 30, 3], [608, 360, 60, 30, 4], [668, 360, 60, 30, 5],
]

const level3 = [
                                                                                                                                 [368, 570, 60, 30, 1],
                                                            [188, 540, 60, 30, 5], [248, 540, 60, 30, 4], [308, 540, 60, 30, 3], [368, 540, 60, 30, 2], [428, 540, 60, 30, 3], [488, 540, 60, 30, 4], [548, 540, 60, 30, 5],
                                                                                   [248, 510, 60, 30, 5], [308, 510, 60, 30, 4], [368, 510, 60, 30, 3], [428, 510, 60, 30, 4], [488, 510, 60, 30, 5],
                                                                                                          [308, 480, 60, 30, 5], [368, 480, 60, 30, 4], [428, 480, 60, 30, 5],
                                                                                                                                 [368, 450, 60, 30, 5],
    [-2, 490, 60, 30, 5],                                                                                                                                                                                                                                      [738, 490, 60, 30, 5],
    [-2, 460, 60, 30, 4], [58, 460, 60, 30, 5],                                                                                                                                                                                         [678, 460, 60, 30, 5], [738, 460, 60, 30, 4],
    [-2, 430, 60, 30, 3], [58, 430, 60, 30, 4], [118, 430, 60, 30, 5],                                                                                                                                           [618, 430, 60, 30, 5], [678, 430, 60, 30, 4], [738, 430, 60, 30, 3],
    [-2, 400, 60, 30, 2], [58, 400, 60, 30, 3], [118, 400, 60, 30, 4], [178, 400, 60, 30, 5],                                                                                             [558, 400, 60, 30, 5], [618, 400, 60, 30, 4], [678, 400, 60, 30, 3], [738, 400, 60, 30, 2],
    [-2, 370, 60, 30, 1], [58, 370, 60, 30, 2], [118, 370, 60, 30, 3], [178, 370, 60, 30, 4], [238, 370, 60, 30, 5],                                               [498, 370, 60, 30, 5], [558, 370, 60, 30, 4], [618, 370, 60, 30, 3], [678, 370, 60, 30, 2], [738, 370, 60, 30, 1],
    [-2, 340, 60, 30, 6], [58, 340, 60, 30, 6], [118, 340, 60, 30, 6], [178, 340, 60, 30, 6], [238, 340, 60, 30, 6], [298, 340, 60, 30, 5], [438, 340, 60, 30, 5], [498, 340, 60, 30, 6], [558, 340, 60, 30, 6], [618, 340, 60, 30, 6], [678, 340, 60, 30, 6], [738, 340, 60, 30, 6]
]



const testLevel1 = [[180, 250, 60, 30, 1], [260, 250, 60, 30, 1], [340, 250, 60, 30, 1], [420, 250, 60, 30, 1], [500, 250, 60, 30, 1], [580, 250, 60, 30, 1]]
const testLevel2 = [[365, 250, 60, 30, 2]]

// const gameLevel = [testLevel1, testLevel2]
const gameLevel = [level1, level2, level3]

initGame()