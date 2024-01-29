const WINDOWWIDTH = 800;
const WINDOWHEIGHT = 800;
const PADDLEWIDTH = 100;
const PADDLEHEIGHT = 15;
const PADDLEGAPFROMBOTTOM = 100;
const BALLSIZE = 30;
const BALLCOLOR = "yellow"

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
                clearInterval(this.loop);
                this.ballElm.remove()
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
                            firstOccurence = element.id;
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
        this.id = id;
        id += 1;

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
            this.brickElm.remove()
            aliveBrickList.forEach((element, index) => {
                if (element.id === this.id) {
                    aliveBrickList.splice(index, 1)
                }
            })

        } else if (this.level === 1) {
            this.brickElm.classList.remove("brick-2");  
            this.brickElm.classList.add("brick-1");
        } else if (this.level === 2) {
            this.brickElm.classList.remove("brick-3");  
            this.brickElm.classList.add("brick-2");  
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


const paddleElm = document.getElementById("paddle");
const gameContainerElm = document.getElementById("brick-container");

const paddleObject = new Paddle(WINDOWWIDTH / 2 - PADDLEWIDTH / 2, PADDLEWIDTH);

const aliveBallList = [];
const aliveBrickList = [];
id = 1;

function game(lives) {
    
    brickList.forEach((element) => {
        aliveBrickList.push(new Brick(element[0], element[1], element[2], element[3], element[4]))
    })

    // aliveBallList.push(new Ball(490, PADDLEGAPFROMBOTTOM + 140, 0, -1, 2 , false)); // balle de droite
    // aliveBallList.push(new Ball(370, PADDLEGAPFROMBOTTOM + 140, 0, 1, 2 , false)); // balle de gauche
    // aliveBallList.push(new Ball(420, PADDLEGAPFROMBOTTOM + 95, 1, 0, 2 , false)); // balle de bas
    // aliveBallList.push(new Ball(421, PADDLEGAPFROMBOTTOM + 180, -1, 0, 2 , false)); // balle de haut

    aliveBallList.push(new Ball(null, null, null, null, 2.3, true));
}


const brickList = [
    [60, 690, 80, 50, 2], [140, 690, 80, 50, 2], [220, 690, 80, 50, 2], [500, 690, 80, 50, 2], [580, 690, 80, 50, 2], [660, 690, 80, 50, 2],
    [60, 640, 80, 50, 2], [140, 640, 80, 50, 1], [220, 640, 80, 50, 2], [500, 640, 80, 50, 2], [580, 640, 80, 50, 1], [660, 640, 80, 50, 2],
    [60, 590, 80, 50, 2], [140, 590, 80, 50, 1], [220, 590, 80, 50, 2], [500, 590, 80, 50, 2], [580, 590, 80, 50, 1], [660, 590, 80, 50, 2],
    [60, 540, 80, 50, 2], [140, 540, 80, 50, 1], [220, 540, 80, 50, 2], [500, 540, 80, 50, 2], [580, 540, 80, 50, 1], [660, 540, 80, 50, 2],
    [60, 490, 80, 50, 2], [140, 490, 80, 50, 1], [220, 490, 80, 50, 2], [500, 490, 80, 50, 2], [580, 490, 80, 50, 1], [660, 490, 80, 50, 2],
    [60, 440, 80, 50, 3], [140, 440, 80, 50, 3], [220, 440, 80, 50, 3], [500, 440, 80, 50, 3], [580, 440, 80, 50, 3], [660, 440, 80, 50, 3]
]

game(3)