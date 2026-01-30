class Tetris {
    #start_stop;
    #gameBoard;
    #flag;
    #startToken;

    constructor() {
        this.#start_stop = document.querySelector('.button');
        this.#gameBoard = new GameBoard();
        this.#gameBoard.keyPress();
        this.#flag = true;
        this.#startToken = 0;
    }

    render() {

        this.#start_stop.addEventListener('mousedown', async () => {
            if (this.#start_stop.textContent === 'Start') {

                const myToken = ++this.#startToken;
                sessionStorage.setItem('start_stop', 'Stop');

                this.#start_stop.textContent = 'Stop';
                sessionStorage.setItem('start_stop', 'Stop');

                await this.sleep(1000);

                if (myToken !== this.#startToken) return;
                if (sessionStorage.getItem('start_stop') !== 'Stop') return;

                if (this.#flag) {
                    document.querySelector('.div3').textContent = 'Score: 0';
                    document.querySelector('.div4').textContent = 'Heart: 3';
                    this.#flag = false;
                }

                if (document.querySelector('.div1 > h1')) {
                    this.#gameBoard.get_div.innerHTML = '';
                    this.#gameBoard.get_div.style.backgroundColor = 'white';
                    this.#gameBoard.get_heart.textContent = 'Heart: 3';
                    this.#gameBoard.get_score.textContent = 'Score: 0';
                }

                this.#gameBoard.addBrick();

            } else {
                this.#start_stop.textContent = 'Start';
                sessionStorage.setItem('start_stop', 'Start');

                this.#startToken++;
                this.#gameBoard.stop();
            }
        });

        this.#start_stop.addEventListener('mouseenter', () => {
            this.#start_stop.style.opacity = '0.5';
        });

        this.#start_stop.addEventListener('mouseleave', () => {
            this.#start_stop.style.opacity = '1';
        });
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

}

class GameBoard {
    #brick;
    #board;
    #div;
    #div1;
    #divs;
    #dropInterval;
    #score;
    #heart;
    #scoreValue;
    #nextType;
    #speed;
    #lastSpeedIncreaseScore;

    constructor() {
        this.#div = document.querySelector('.div1');
        this.#div1 = document.querySelector('.div2');

        this.#brick = null;
        this.#dropInterval = null;

        this.#score = document.querySelector('.div3');
        this.#heart = document.querySelector('.div4');

        this.#divs = [];

        this.#scoreValue = 0;

        this.#lastSpeedIncreaseScore = 0;

        this.#speed = 300;

        this.#nextType = Math.floor(Math.random() * 9) + 1;

        this.#board = Array.from({ length: 30 }, () =>
            Array(30).fill(false)
        );

    }

    get get_div() {
        return this.#div;
    }

    get get_heart() {
        return this.#heart;
    }

    get get_score() {
        return this.#score;
    }

    updateDropInterval() {
        if (this.#dropInterval) {
            clearInterval(this.#dropInterval);
        }
        this.#dropInterval = setInterval(() => {
            if (this.canMoveDown()) {
                this.moveDown();
            } else {
                this.lockBrick();
                this.clearFullRows(); // clearFullRows خودش امتیاز و سرعت رو چک میکنه
                this.addBrick(); // addBrick معمولا فقط بلوک جدید اضافه میکنه
            }
        }, this.#speed);
    }

    stop() {
        if (this.#dropInterval) {
            clearInterval(this.#dropInterval);
            this.#dropInterval = null;
        }

        if (this.#brick) {
            for (let i = 0; i < this.#brick.get_divs.length; i++) {
                this.#brick.get_divs[i].remove();
            }

            this.#brick = null;
        }

        if (this.#div1) {
            this.#div1.innerHTML = '';
        }

    }

    canSpawnBreak() {
        const cell = 3.333333333333333;

        for (let div of this.#brick.get_divs) {
            const x = Math.round(parseFloat(div.style.left) / cell);
            const y = Math.round(parseFloat(div.style.top) / cell);

            if (this.#board[y][x] === true) {
                return false;
            }
        }

        return true;
    }

    gameOver() {

        this.stop();
        this.#div.innerHTML = '';

        for (let div of this.#divs) {
            div.remove();
        }

        this.#divs = [];

        for (let i = 0; i < 30; i++) {
            for (let j = 0; j < 30; j++) {
                this.#board[i][j] = false;
            }
        }

        let start_stop = document.querySelector('.button');

        start_stop.textContent = 'Start';

        if (this.#heart.textContent === 'Heart: 3') {
            this.#heart.textContent = 'Heart: 2';
        }

        else if (this.#heart.textContent === 'Heart: 2') {
            this.#heart.textContent = 'Heart: 1'
        }

        else {

            let h1 = document.createElement('h1');

            this.#scoreValue = 0;

            this.#div.style.backgroundColor = 'black';

            h1.textContent = 'Game Over!!!';
            h1.style.color = 'red';
            h1.style.position = 'absolute';
            h1.style.fontSize = '90px';
            h1.style.left = '27%';
            h1.style.top = '30%';

            this.#div.append(h1);

            this.#heart.textContent = 'Heart: 0';

            this.#speed = 300;

        }

    }

    addBrick() {

        const currentType = this.#nextType;

        this.#nextType = Math.floor(Math.random() * 9) + 1;

        this.#div1.innerHTML = '';

        this.createPreviewBrick(this.#nextType);

        this.createCurrentBrick(currentType);

        if (!this.canSpawnBreak()) {
            this.gameOver();
            return;
        }

        this.startDrop();
    }

    createCurrentBrick(type) {
        switch (type) {
            case 1:
                this.#brick = new RedBrick(this.#div, null);
                break

            case 2:
                this.#brick = new GreenBrick(this.#div, null);
                break

            case 3:
                this.#brick = new YellowBrick(this.#div, null);
                break

            case 4:
                this.#brick = new PurpleBrick(this.#div, null);
                break

            case 5:
                this.#brick = new Blue1Brick(this.#div, null);
                break

            case 6:
                this.#brick = new Blue2Brick(this.#div, null);
                break;

            case 7:
                this.#brick = new OrangeBrick(this.#div, null);
                break

            case 8:
                this.#brick = new PinkBrick(this.#div, null);
                break

            case 9:
                this.#brick = new Pink2Brick(this.#div, null);
                break
        }
    }

    createPreviewBrick(type) {
        switch (type) {
            case 1:
                this.#brick = new RedBrick(null, this.#div1);
                break

            case 2:
                this.#brick = new GreenBrick(null, this.#div1);
                break

            case 3:
                this.#brick = new YellowBrick(null, this.#div1);
                break

            case 4:
                this.#brick = new PurpleBrick(null, this.#div1);
                break

            case 5:
                this.#brick = new Blue1Brick(null, this.#div1);
                break

            case 6:
                this.#brick = new Blue2Brick(null, this.#div1);
                break;

            case 7:
                this.#brick = new OrangeBrick(null, this.#div1);
                break

            case 8:
                this.#brick = new PinkBrick(null, this.#div1);
                break

            case 9:
                this.#brick = new Pink2Brick(null, this.#div1);
                break
        }
    }

    startDrop() {
        if (this.#dropInterval) {
            clearInterval(this.#dropInterval);
        }

        this.#dropInterval = setInterval(() => {
            if (this.canMoveDown()) {
                this.moveDown();
            } else {
                this.lockBrick();
                this.clearFullRows();   // 👈 اول پاک کن
                this.addBrick();        // 👈 بعد بلوک جدید
            }
        }, this.#speed);
    }


    canMoveDown() {
        for (let div of this.#brick.get_divs) {
            const x = Math.round(parseFloat(div.style.left) / 3.333333333333333);
            const y = Math.round(parseFloat(div.style.top) / 3.333333333333333);

            if (y + 1 >= 30) return false;
            if (this.#board[y + 1][x] === true) return false;
        }
        return true;
    }

    canMoveLeft() {
        for (let div of this.#brick.get_divs) {
            const x = Math.round(parseFloat(div.style.left) / 3.333333333333333);
            const y = Math.round(parseFloat(div.style.top) / 3.333333333333333);

            if (x < 1) return false;
            if (this.#board[y][x - 1] === true) return false;
        }
        return true;
    }

    canMoveRight() {
        for (let div of this.#brick.get_divs) {
            const x = Math.round(parseFloat(div.style.left) / 3.333333333333333);
            const y = Math.round(parseFloat(div.style.top) / 3.333333333333333);

            if (x + 1 >= 30) return false;
            if (this.#board[y][x + 1] === true) return false;
        }
        return true;
    }

    moveDown() {
        this.#brick.get_divs.forEach(div => {
            let top = parseFloat(div.style.top) || 0;
            div.style.top = (top + 3.333333333333333) + '%';
        });
    }

    moveLeft() {
        if (!this.canMoveLeft()) return;
        this.#brick.get_divs.forEach(div => {
            let left = parseFloat(div.style.left) || 0;
            div.style.left = (left - 3.333333333333333) + '%';
        });
    }

    moveRight() {
        if (!this.canMoveRight()) return;
        this.#brick.get_divs.forEach(div => {
            let left = parseFloat(div.style.left) || 0;
            div.style.left = (left + 3.333333333333333) + '%';
        });
    }

    lockBrick() {
        for (let div of this.#brick.get_divs) {
            const x = Math.round(parseFloat(div.style.left) / 3.333333333333333);
            const y = Math.round(parseFloat(div.style.top) / 3.333333333333333);

            this.#board[y][x] = true;
            this.#divs.push(div);
        }
    }

    rotate() {
        const center = this.#brick.get_divs[0];
        const cx = parseFloat(center.style.left);
        const cy = parseFloat(center.style.top);

        const newPositions = this.#brick.get_divs.map(div => {
            const x = parseFloat(div.style.left);
            const y = parseFloat(div.style.top);

            const relX = x - cx;
            const relY = y - cy;

            const newX = -relY + cx;
            const newY = relX + cy;

            return { x: newX, y: newY };
        });

        for (let pos of newPositions) {
            const gridX = Math.round(pos.x / 3.333333333333333);
            const gridY = Math.round(pos.y / 3.333333333333333);

            if (gridX < 0 || gridX >= 30 || gridY < 0 || gridY >= 30) return;
            if (this.#board[gridY][gridX]) return;
        }

        this.#brick.get_divs.forEach((div, i) => {
            div.style.left = newPositions[i].x + '%';
            div.style.top = newPositions[i].y + '%';
        });
    }

    move(key) {
        if (!this.#brick) return;

        switch (key) {
            case 'Enter':
                if (this.canMoveDown()) {
                    this.moveDown();
                }

                else {
                    this.lockBrick();
                    this.addBrick();
                    this.clearFullRows();
                }

                break;

            case 'ArrowLeft':
                if (this.canMoveLeft()) {
                    this.moveLeft();
                }

                break;

            case 'ArrowRight':
                if (this.canMoveRight()) {
                    this.moveRight();
                }

                break;

            case 'ArrowUp':
                this.rotate();

                break
        }
    }

    shiftDivsDown(row) {

        const CELL = 3.333333333333333;


        for (let div of this.#divs) {

            const y = Math.round(parseFloat(div.style.top) / CELL + 0.0001);

            if (y < row) {

                div.style.top = (parseFloat(div.style.top) + CELL) + '%';

            }

        }

    }

    rebuildBoardFromDivs() {

        const CELL = 3.333333333333333;


        this.#board = Array.from({ length: 30 }, () =>

            Array(30).fill(false)

        );


        for (let div of this.#divs) {

            const y = Math.round(parseFloat(div.style.top) / CELL + 0.0001);

            const x = Math.round(parseFloat(div.style.left) / CELL + 0.0001);

            this.#board[y][x] = true;

        }

    }

    clearFullRows() {
        const CELL = 3.333333333333333;
        let rowsToClear = [];

        // پیدا کردن سطرهای پر
        for (let y = 0; y < 30; y++) {
            let count = 0;

            for (let x = 0; x < 30; x++) {
                if (this.#board[y][x]) count++;
            }

            if (count === 30) {
                rowsToClear.push(y);
            }
        }

        if (rowsToClear.length === 0) {
             return;
            }

        this.flashBackground();    

        // حذف div های سطرهای پر
        for (let row of rowsToClear) {
            for (let i = this.#divs.length - 1; i >= 0; i--) {
                const div = this.#divs[i];
                const y = Math.round(parseFloat(div.style.top) / CELL);

                if (y === row) {
                    div.remove();
                    this.#divs.splice(i, 1);
                }
            }
        }

        // پایین آوردن سطرهای بالایی
        for (let row of rowsToClear) {
            for (let div of this.#divs) {
                const y = Math.round(parseFloat(div.style.top) / CELL);

                if (y < row) {
                    div.style.top = (parseFloat(div.style.top) + CELL) + '%';
                }
            }
        }

        // بازسازی برد
        this.rebuildBoardFromDivs();

        // امتیاز
        this.addScore(rowsToClear.length);
    }


    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }


    trueBoard() {
        for (let i = 0; i < this.#divs.length; i++) {
            this.#board[Math.round(parseFloat(this.#divs[i].style.top) / 3.333333333333333)]
            [Math.round(parseFloat(this.#divs[i].style.left) / 3.333333333333333)] = true;
        }
    }

    rowDown(row) {
        const CELL = 3.333333333333333;

        for (let div of this.#divs) {
            let top = parseFloat(div.style.top);
            let y = Math.round(top / CELL);

            if (y < row) {
                div.style.top = (top + CELL) + '%';
            }
        }

        this.#board = Array.from({ length: 30 }, () =>
            Array(30).fill(false)
        );

        this.trueBoard();
    }


    clearRow(row) {
        for (let i = this.#divs.length - 1; i >= 0; i--) {
            let y = Math.round(
                parseFloat(this.#divs[i].style.top) / 3.333333333333333
            );

            if (y === row) {
                this.#divs[i].remove();
                this.#divs.splice(i, 1);
            }
        }

        for (let col = 0; col < 30; col++) {
            this.#board[row][col] = false;
        }
    }

    addScore(lines) {
        this.#scoreValue += lines * 5;
        this.#score.textContent = 'Score: ' + this.#scoreValue;

        // هر 15 امتیاز یک level
        const currentLevel = Math.floor(this.#scoreValue / 15);
        const lastLevel = Math.floor(this.#lastSpeedIncreaseScore / 15);

        if (currentLevel > lastLevel) {
            this.increaseSpeed();
            this.#lastSpeedIncreaseScore = this.#scoreValue;
        }
    }

    increaseSpeed() {
        // حداقل سرعت (خیلی سریع نشه)
        const MIN_SPEED = 100;

        // هر بار 30ms سریع‌تر
        this.#speed = Math.max(MIN_SPEED, this.#speed - 50);

        // interval رو با سرعت جدید ریست کن
        this.updateDropInterval();
    }

    flashBackground() {
        const div = this.#div;
        const originalColor = this.#div.style.backgroundColor || '';

        this.#div.style.backgroundColor = 'black';

        setTimeout(() => {
            this.#div.style.backgroundColor = originalColor;
        }, 50);

    }


    keyPress() {
        document.addEventListener('keydown', (event) => {
            if (sessionStorage.getItem('start_stop') === 'Stop') {
                this.move(event.key);
            }
        });
    }
}

class Brick {
    #color;
    #width;
    #height;
    #divs;

    constructor() {
        this.#width = 3.333333333333333;
        this.#height = 3.333333333333333;
        this.#divs = [];
    }

    get get_color() {
        return this.#color;
    }

    set set_color(color) {
        this.#color = color;
    }

    get get_width() {
        return this.#width;
    }

    set set_width(width) {
        this.#width = width;
    }

    get get_height() {
        return this.#height;
    }

    set set_height(height) {
        this.#height = height;
    }

    get get_divs() {
        return this.#divs;
    }

    set set_divs(divs) {
        this.#divs = divs;
    }
}

class RedBrick extends Brick {
    constructor(div, div1) {
        super();
        this.set_color = '#CC0B10';
        if (div) this.drawBrick(div);
        if (div1) this.addBrick(div1);
    }

    addBrick(div) {
        div.innerHTML = '';
        let div1 = document.createElement('div');
        div1.style.position = 'absolute';
        div1.style.backgroundColor = this.get_color;
        div1.style.width = 12.5 + '%';
        div1.style.height = 12.5 + '%';
        div1.style.border = '1px solid';
        div1.style.left = (4.5 * 12.5) + '%';
        div1.style.top = (3 * 12.5) + '%';
        div.append(div1);

        div1 = document.createElement('div');
        div1.style.position = 'absolute';
        div1.style.backgroundColor = this.get_color;
        div1.style.width = 12.5 + '%';
        div1.style.height = 12.5 + '%';
        div1.style.border = '1px solid';
        div1.style.left = (3.5 * 12.5) + '%';
        div1.style.top = (3 * 12.5) + '%';
        div.append(div1);

        div1 = document.createElement('div');
        div1.style.position = 'absolute';
        div1.style.backgroundColor = this.get_color;
        div1.style.width = 12.5 + '%';
        div1.style.height = 12.5 + '%';
        div1.style.border = '1px solid';
        div1.style.left = (3.5 * 12.5) + '%';
        div1.style.top = (4 * 12.5) + '%';
        div.append(div1);

        div1 = document.createElement('div');
        div1.style.position = 'absolute';
        div1.style.backgroundColor = this.get_color;
        div1.style.width = 12.5 + '%';
        div1.style.height = 12.5 + '%';
        div1.style.border = '1px solid';
        div1.style.left = (2.5 * 12.5) + '%';
        div1.style.top = (4 * 12.5) + '%';
        div.append(div1);
    }

    drawBrick(div) {
        let div1 = document.createElement('div');
        div1.style.position = 'absolute';
        div1.style.backgroundColor = this.get_color;
        div1.style.width = this.get_width + '%';
        div1.style.height = this.get_height + '%';
        div1.style.border = '1px solid';
        div1.style.left = (16 * this.get_width) + '%';
        div1.style.top = 0 + '%';
        div.append(div1);
        this.get_divs.push(div1);

        div1 = document.createElement('div');
        div1.style.position = 'absolute';
        div1.style.backgroundColor = this.get_color;
        div1.style.width = this.get_width + '%';
        div1.style.height = this.get_height + '%';
        div1.style.border = '1px solid';
        div1.style.left = (15 * this.get_width) + '%';
        div1.style.top = 0 + '%';
        div.append(div1);
        this.get_divs.push(div1);

        div1 = document.createElement('div');
        div1.style.position = 'absolute';
        div1.style.backgroundColor = this.get_color;
        div1.style.width = this.get_width + '%';
        div1.style.height = this.get_height + '%';
        div1.style.border = '1px solid';
        div1.style.left = (15 * this.get_width) + '%';
        div1.style.top = this.get_height + '%';
        div.append(div1);
        this.get_divs.push(div1);

        div1 = document.createElement('div');
        div1.style.position = 'absolute';
        div1.style.backgroundColor = this.get_color;
        div1.style.width = this.get_width + '%';
        div1.style.height = this.get_height + '%';
        div1.style.border = '1px solid';
        div1.style.left = (14 * this.get_width) + '%';
        div1.style.top = this.get_height + '%';
        div.append(div1);
        this.get_divs.push(div1);
    }
}

class GreenBrick extends Brick {
    constructor(div, div1) {
        super();
        this.set_color = '#379A30';
        if (div) this.drawBrick(div);
        if (div1) this.addBrick(div1);
    }

    addBrick(div) {
        div.innerHTML = '';
        let div1 = document.createElement('div');
        div1.style.position = 'absolute';
        div1.style.backgroundColor = this.get_color;
        div1.style.width = 12.5 + '%';
        div1.style.height = 12.5 + '%';
        div1.style.border = '1px solid';
        div1.style.left = (4 * 12.5) + '%';
        div1.style.top = (2.5 * 12.5) + '%';
        div.append(div1);

        div1 = document.createElement('div');
        div1.style.position = 'absolute';
        div1.style.backgroundColor = this.get_color;
        div1.style.width = 12.5 + '%';
        div1.style.height = 12.5 + '%';
        div1.style.border = '1px solid';
        div1.style.left = (4 * 12.5) + '%';
        div1.style.top = (3.5 * 12.5) + '%';
        div.append(div1);

        div1 = document.createElement('div');
        div1.style.position = 'absolute';
        div1.style.backgroundColor = this.get_color;
        div1.style.width = 12.5 + '%';
        div1.style.height = 12.5 + '%';
        div1.style.border = '1px solid';
        div1.style.left = (4 * 12.5) + '%';
        div1.style.top = (4.5 * 12.5) + '%';
        div.append(div1);

        div1 = document.createElement('div');
        div1.style.position = 'absolute';
        div1.style.backgroundColor = this.get_color;
        div1.style.width = 12.5 + '%';
        div1.style.height = 12.5 + '%';
        div1.style.border = '1px solid';
        div1.style.left = (3 * 12.5) + '%';
        div1.style.top = (4.5 * 12.5) + '%';
        div.append(div1);
    }

    drawBrick(div) {
        let div1 = document.createElement('div');
        div1.style.position = 'absolute';
        div1.style.backgroundColor = this.get_color;
        div1.style.width = this.get_width + '%';
        div1.style.height = this.get_height + '%';
        div1.style.border = '1px solid';
        div1.style.left = (16 * this.get_width) + '%';
        div1.style.top = 0 + '%';
        div.append(div1);
        this.get_divs.push(div1);

        div1 = document.createElement('div');
        div1.style.position = 'absolute';
        div1.style.backgroundColor = this.get_color;
        div1.style.width = this.get_width + '%';
        div1.style.height = this.get_height + '%';
        div1.style.border = '1px solid';
        div1.style.left = (16 * this.get_width) + '%';
        div1.style.top = this.get_height + '%';
        div.append(div1);
        this.get_divs.push(div1);

        div1 = document.createElement('div');
        div1.style.position = 'absolute';
        div1.style.backgroundColor = this.get_color;
        div1.style.width = this.get_width + '%';
        div1.style.height = this.get_height + '%';
        div1.style.border = '1px solid';
        div1.style.left = (16 * this.get_width) + '%';
        div1.style.top = (2 * this.get_height) + '%';
        div.append(div1);
        this.get_divs.push(div1);

        div1 = document.createElement('div');
        div1.style.position = 'absolute';
        div1.style.backgroundColor = this.get_color;
        div1.style.width = this.get_width + '%';
        div1.style.height = this.get_height + '%';
        div1.style.border = '1px solid';
        div1.style.left = (15 * this.get_width) + '%';
        div1.style.top = (2 * this.get_height) + '%';
        div.append(div1);
        this.get_divs.push(div1);
    }
}


class YellowBrick extends Brick {
    constructor(div, div1) {
        super();
        this.set_color = '#EAD500';
        if (div) this.drawBrick(div);
        if (div1) this.addBrick(div1);
    }

    addBrick(div) {
        div.innerHTML = '';
        let div1 = document.createElement('div');
        div1.style.position = 'absolute';
        div1.style.backgroundColor = this.get_color;
        div1.style.width = 12.5 + '%';
        div1.style.height = 12.5 + '%';
        div1.style.border = '1px solid';
        div1.style.left = (4 * 12.5) + '%';
        div1.style.top = (3 * 12.5) + '%';
        div.append(div1);

        div1 = document.createElement('div');
        div1.style.position = 'absolute';
        div1.style.backgroundColor = this.get_color;
        div1.style.width = 12.5 + '%';
        div1.style.height = 12.5 + '%';
        div1.style.border = '1px solid';
        div1.style.left = (3 * 12.5) + '%';
        div1.style.top = (3 * 12.5) + '%';
        div.append(div1);

        div1 = document.createElement('div');
        div1.style.position = 'absolute';
        div1.style.backgroundColor = this.get_color;
        div1.style.width = 12.5 + '%';
        div1.style.height = 12.5 + '%';
        div1.style.border = '1px solid';
        div1.style.left = (4 * 12.5) + '%';
        div1.style.top = (4 * 12.5) + '%';
        div.append(div1);

        div1 = document.createElement('div');
        div1.style.position = 'absolute';
        div1.style.backgroundColor = this.get_color;
        div1.style.width = 12.5 + '%';
        div1.style.height = 12.5 + '%';
        div1.style.border = '1px solid';
        div1.style.left = (3 * 12.5) + '%';
        div1.style.top = (4 * 12.5) + '%';
        div.append(div1);
    }

    drawBrick(div) {
        let div1 = document.createElement('div');
        div1.style.position = 'absolute';
        div1.style.backgroundColor = this.get_color;
        div1.style.width = this.get_width + '%';
        div1.style.height = this.get_height + '%';
        div1.style.border = '1px solid';
        div1.style.left = (16 * this.get_width) + '%';
        div1.style.top = 0 + '%';
        div.append(div1);
        this.get_divs.push(div1);

        div1 = document.createElement('div');
        div1.style.position = 'absolute';
        div1.style.backgroundColor = this.get_color;
        div1.style.width = this.get_width + '%';
        div1.style.height = this.get_height + '%';
        div1.style.border = '1px solid';
        div1.style.left = (15 * this.get_width) + '%';
        div1.style.top = 0 + '%';
        div.append(div1);
        this.get_divs.push(div1);

        div1 = document.createElement('div');
        div1.style.position = 'absolute';
        div1.style.backgroundColor = this.get_color;
        div1.style.width = this.get_width + '%';
        div1.style.height = this.get_height + '%';
        div1.style.border = '1px solid';
        div1.style.left = (16 * this.get_width) + '%';
        div1.style.top = this.get_height + '%';
        div.append(div1);
        this.get_divs.push(div1);

        div1 = document.createElement('div');
        div1.style.position = 'absolute';
        div1.style.backgroundColor = this.get_color;
        div1.style.width = this.get_width + '%';
        div1.style.height = this.get_height + '%';
        div1.style.border = '1px solid';
        div1.style.left = (15 * this.get_width) + '%';
        div1.style.top = this.get_height + '%';
        div.append(div1);
        this.get_divs.push(div1);
    }
}

class PurpleBrick extends Brick {
    constructor(div, div1) {
        super();
        this.set_color = '#894087';
        if (div) this.drawBrick(div);
        if (div1) this.addBrick(div1);
    }

    addBrick(div) {
        div.innerHTML = '';
        let div1 = document.createElement('div');
        div1.style.position = 'absolute';
        div1.style.backgroundColor = this.get_color;
        div1.style.width = 12.5 + '%';
        div1.style.height = 12.5 + '%';
        div1.style.border = '1px solid';
        div1.style.left = (4.5 * 12.5) + '%';
        div1.style.top = (4 * 12.5) + '%';
        div.append(div1);

        div1 = document.createElement('div');
        div1.style.position = 'absolute';
        div1.style.backgroundColor = this.get_color;
        div1.style.width = 12.5 + '%';
        div1.style.height = 12.5 + '%';
        div1.style.border = '1px solid';
        div1.style.left = (3.5 * 12.5) + '%';
        div1.style.top = (3 * 12.5) + '%';
        div.append(div1);

        div1 = document.createElement('div');
        div1.style.position = 'absolute';
        div1.style.backgroundColor = this.get_color;
        div1.style.width = 12.5 + '%';
        div1.style.height = 12.5 + '%';
        div1.style.border = '1px solid';
        div1.style.left = (3.5 * 12.5) + '%';
        div1.style.top = (4 * 12.5) + '%';
        div.append(div1);

        div1 = document.createElement('div');
        div1.style.position = 'absolute';
        div1.style.backgroundColor = this.get_color;
        div1.style.width = 12.5 + '%';
        div1.style.height = 12.5 + '%';
        div1.style.border = '1px solid';
        div1.style.left = (2.5 * 12.5) + '%';
        div1.style.top = (4 * 12.5) + '%';
        div.append(div1);
    }

    drawBrick(div) {
        let div1 = document.createElement('div');
        div1.style.position = 'absolute';
        div1.style.backgroundColor = this.get_color;
        div1.style.width = this.get_width + '%';
        div1.style.height = this.get_height + '%';
        div1.style.border = '1px solid';
        div1.style.left = (15 * this.get_width) + '%';
        div1.style.top = 0 + '%';
        div.append(div1);
        this.get_divs.push(div1);

        div1 = document.createElement('div');
        div1.style.position = 'absolute';
        div1.style.backgroundColor = this.get_color;
        div1.style.width = this.get_width + '%';
        div1.style.height = this.get_height + '%';
        div1.style.border = '1px solid';
        div1.style.left = (16 * this.get_width) + '%';
        div1.style.top = this.get_height + '%';
        div.append(div1);
        this.get_divs.push(div1);

        div1 = document.createElement('div');
        div1.style.position = 'absolute';
        div1.style.backgroundColor = this.get_color;
        div1.style.width = this.get_width + '%';
        div1.style.height = this.get_height + '%';
        div1.style.border = '1px solid';
        div1.style.left = (15 * this.get_width) + '%';
        div1.style.top = this.get_height + '%';
        div.append(div1);
        this.get_divs.push(div1);

        div1 = document.createElement('div');
        div1.style.position = 'absolute';
        div1.style.backgroundColor = this.get_color;
        div1.style.width = this.get_width + '%';
        div1.style.height = this.get_height + '%';
        div1.style.border = '1px solid';
        div1.style.left = (14 * this.get_width) + '%';
        div1.style.top = this.get_height + '%';
        div.append(div1);
        this.get_divs.push(div1);
    }
}

class Blue1Brick extends Brick {
    constructor(div, div1) {
        super();
        this.set_color = '#1564A6';
        if (div) this.drawBrick(div);
        if (div1) this.addBrick(div1);
    }

    addBrick(div) {
        div.innerHTML = '';
        let div1 = document.createElement('div');
        div1.style.position = 'absolute';
        div1.style.backgroundColor = this.get_color;
        div1.style.width = 12.5 + '%';
        div1.style.height = 12.5 + '%';
        div1.style.border = '1px solid';
        div1.style.left = (3.5 * 12.5) + '%';
        div1.style.top = (2.5 * 12.5) + '%';
        div.append(div1);

        div1 = document.createElement('div');
        div1.style.position = 'absolute';
        div1.style.backgroundColor = this.get_color;
        div1.style.width = 12.5 + '%';
        div1.style.height = 12.5 + '%';
        div1.style.border = '1px solid';
        div1.style.left = (3.5 * 12.5) + '%';
        div1.style.top = (3.5 * 12.5) + '%';
        div.append(div1);

        div1 = document.createElement('div');
        div1.style.position = 'absolute';
        div1.style.backgroundColor = this.get_color;
        div1.style.width = 12.5 + '%';
        div1.style.height = 12.5 + '%';
        div1.style.border = '1px solid';
        div1.style.left = (3.5 * 12.5) + '%';
        div1.style.top = (4.5 * 12.5) + '%';
        div.append(div1);
    }

    drawBrick(div) {
        let div1 = document.createElement('div');
        div1.style.position = 'absolute';
        div1.style.backgroundColor = this.get_color;
        div1.style.width = this.get_width + '%';
        div1.style.height = this.get_height + '%';
        div1.style.border = '1px solid';
        div1.style.left = (15 * this.get_width) + '%';
        div1.style.top = 0 + '%';
        div.append(div1);
        this.get_divs.push(div1);

        div1 = document.createElement('div');
        div1.style.position = 'absolute';
        div1.style.backgroundColor = this.get_color;
        div1.style.width = this.get_width + '%';
        div1.style.height = this.get_height + '%';
        div1.style.border = '1px solid';
        div1.style.left = (15 * this.get_width) + '%';
        div1.style.top = this.get_height + '%';
        div.append(div1);
        this.get_divs.push(div1);

        div1 = document.createElement('div');
        div1.style.position = 'absolute';
        div1.style.backgroundColor = this.get_color;
        div1.style.width = this.get_width + '%';
        div1.style.height = this.get_height + '%';
        div1.style.border = '1px solid';
        div1.style.left = (15 * this.get_width) + '%';
        div1.style.top = (2 * this.get_height) + '%';
        div.append(div1);
        this.get_divs.push(div1);
    }
}

class Blue2Brick extends Brick {
    constructor(div, div1) {
        super();
        this.set_color = '#58B0BC';
        if (div) this.drawBrick(div);
        if (div1) this.addBrick(div1);
    }

    addBrick(div) {
        div.innerHTML = '';
        let div1 = document.createElement('div');
        div1.style.position = 'absolute';
        div1.style.backgroundColor = this.get_color;
        div1.style.width = 12.5 + '%';
        div1.style.height = 12.5 + '%';
        div1.style.border = '1px solid';
        div1.style.left = (4.5 * 12.5) + '%';
        div1.style.top = (3 * 12.5) + '%';
        div.append(div1);

        div1 = document.createElement('div');
        div1.style.position = 'absolute';
        div1.style.backgroundColor = this.get_color;
        div1.style.width = 12.5 + '%';
        div1.style.height = 12.5 + '%';
        div1.style.border = '1px solid';
        div1.style.left = (3.5 * 12.5) + '%';
        div1.style.top = (3 * 12.5) + '%';
        div.append(div1);

        div1 = document.createElement('div');
        div1.style.position = 'absolute';
        div1.style.backgroundColor = this.get_color;
        div1.style.width = 12.5 + '%';
        div1.style.height = 12.5 + '%';
        div1.style.border = '1px solid';
        div1.style.left = (2.5 * 12.5) + '%';
        div1.style.top = (3 * 12.5) + '%';
        div.append(div1);

        div1 = document.createElement('div');
        div1.style.position = 'absolute';
        div1.style.backgroundColor = this.get_color;
        div1.style.width = 12.5 + '%';
        div1.style.height = 12.5 + '%';
        div1.style.border = '1px solid';
        div1.style.left = (4.5 * 12.5) + '%';
        div1.style.top = (4 * 12.5) + '%';
        div.append(div1);

        div1 = document.createElement('div');
        div1.style.position = 'absolute';
        div1.style.backgroundColor = this.get_color;
        div1.style.width = 12.5 + '%';
        div1.style.height = 12.5 + '%';
        div1.style.border = '1px solid';
        div1.style.left = (2.5 * 12.5) + '%';
        div1.style.top = (4 * 12.5) + '%';
        div.append(div1);
    }

    drawBrick(div) {
        let div1 = document.createElement('div');
        div1.style.position = 'absolute';
        div1.style.backgroundColor = this.get_color;
        div1.style.width = this.get_width + '%';
        div1.style.height = this.get_height + '%';
        div1.style.border = '1px solid';
        div1.style.left = (16 * this.get_width) + '%';
        div1.style.top = 0 + '%';
        div.append(div1);
        this.get_divs.push(div1);

        div1 = document.createElement('div');
        div1.style.position = 'absolute';
        div1.style.backgroundColor = this.get_color;
        div1.style.width = this.get_width + '%';
        div1.style.height = this.get_height + '%';
        div1.style.border = '1px solid';
        div1.style.left = (15 * this.get_width) + '%';
        div1.style.top = 0 + '%';
        div.append(div1);
        this.get_divs.push(div1);

        div1 = document.createElement('div');
        div1.style.position = 'absolute';
        div1.style.backgroundColor = this.get_color;
        div1.style.width = this.get_width + '%';
        div1.style.height = this.get_height + '%';
        div1.style.border = '1px solid';
        div1.style.left = (14 * this.get_width) + '%';
        div1.style.top = 0 + '%';
        div.append(div1);
        this.get_divs.push(div1);

        div1 = document.createElement('div');
        div1.style.position = 'absolute';
        div1.style.backgroundColor = this.get_color;
        div1.style.width = this.get_width + '%';
        div1.style.height = this.get_height + '%';
        div1.style.border = '1px solid';
        div1.style.left = (16 * this.get_width) + '%';
        div1.style.top = this.get_height + '%';
        div.append(div1);
        this.get_divs.push(div1);

        div1 = document.createElement('div');
        div1.style.position = 'absolute';
        div1.style.backgroundColor = this.get_color;
        div1.style.width = this.get_width + '%';
        div1.style.height = this.get_height + '%';
        div1.style.border = '1px solid';
        div1.style.left = (14 * this.get_width) + '%';
        div1.style.top = this.get_height + '%';
        div.append(div1);
        this.get_divs.push(div1);
    }
}

class OrangeBrick extends Brick {
    constructor(div, div1) {
        super();
        this.set_color = '#DB8400';
        if (div) this.drawBrick(div);
        if (div1) this.addBrick(div1);
    }

    addBrick(div) {
        div.innerHTML = '';
        let div1 = document.createElement('div');
        div1.style.position = 'absolute';
        div1.style.backgroundColor = this.get_color;
        div1.style.width = 12.5 + '%';
        div1.style.height = 12.5 + '%';
        div1.style.border = '1px solid';
        div1.style.left = (4 * 12.5) + '%';
        div1.style.top = (4 * 12.5) + '%';
        div.append(div1);

        div1 = document.createElement('div');
        div1.style.position = 'absolute';
        div1.style.backgroundColor = this.get_color;
        div1.style.width = 12.5 + '%';
        div1.style.height = 12.5 + '%';
        div1.style.border = '1px solid';
        div1.style.left = (3 * 12.5) + '%';
        div1.style.top = (3 * 12.5) + '%';
        div.append(div1);

        div1 = document.createElement('div');
        div1.style.position = 'absolute';
        div1.style.backgroundColor = this.get_color;
        div1.style.width = 12.5 + '%';
        div1.style.height = 12.5 + '%';
        div1.style.border = '1px solid';
        div1.style.left = (3 * 12.5) + '%';
        div1.style.top = (4 * 12.5) + '%';
        div.append(div1);
    }

    drawBrick(div) {
        let div1 = document.createElement('div');
        div1.style.position = 'absolute';
        div1.style.backgroundColor = this.get_color;
        div1.style.width = this.get_width + '%';
        div1.style.height = this.get_height + '%';
        div1.style.border = '1px solid';
        div1.style.left = (15 * this.get_width) + '%';
        div1.style.top = 0 + '%';
        div.append(div1);
        this.get_divs.push(div1);

        div1 = document.createElement('div');
        div1.style.position = 'absolute';
        div1.style.backgroundColor = this.get_color;
        div1.style.width = this.get_width + '%';
        div1.style.height = this.get_height + '%';
        div1.style.border = '1px solid';
        div1.style.left = (16 * this.get_width) + '%';
        div1.style.top = this.get_height + '%';
        div.append(div1);
        this.get_divs.push(div1);

        div1 = document.createElement('div');
        div1.style.position = 'absolute';
        div1.style.backgroundColor = this.get_color;
        div1.style.width = this.get_width + '%';
        div1.style.height = this.get_height + '%';
        div1.style.border = '1px solid';
        div1.style.left = (15 * this.get_width) + '%';
        div1.style.top = this.get_height + '%';
        div.append(div1);
        this.get_divs.push(div1);
    }
}

class PinkBrick extends Brick {
    constructor(div, div1) {
        super();
        this.set_color = '#E64076';
        if (div) this.drawBrick(div);
        if (div1) this.addBrick(div1);
    }

    addBrick(div) {
        div.innerHTML = '';
        let div1 = document.createElement('div');
        div1.style.position = 'absolute';
        div1.style.backgroundColor = this.get_color;
        div1.style.width = 12.5 + '%';
        div1.style.height = 12.5 + '%';
        div1.style.border = '1px solid';
        div1.style.left = (4 * 12.5) + '%';
        div1.style.top = (4 * 12.5) + '%';
        div.append(div1);

        div1 = document.createElement('div');
        div1.style.position = 'absolute';
        div1.style.backgroundColor = this.get_color;
        div1.style.width = 12.5 + '%';
        div1.style.height = 12.5 + '%';
        div1.style.border = '1px solid';
        div1.style.left = (3 * 12.5) + '%';
        div1.style.top = (3 * 12.5) + '%';
        div.append(div1);

        div1 = document.createElement('div');
        div1.style.position = 'absolute';
        div1.style.backgroundColor = this.get_color;
        div1.style.width = 12.5 + '%';
        div1.style.height = 12.5 + '%';
        div1.style.border = '1px solid';
        div1.style.left = (3 * 12.5) + '%';
        div1.style.top = (4 * 12.5) + '%';
        div.append(div1);

        div1 = document.createElement('div');
        div1.style.position = 'absolute';
        div1.style.backgroundColor = this.get_color;
        div1.style.width = 12.5 + '%';
        div1.style.height = 12.5 + '%';
        div1.style.border = '1px solid';
        div1.style.left = (3 * 12.5) + '%';
        div1.style.top = (2 * 12.5) + '%';
        div.append(div1);
    }

    drawBrick(div) {
        let div1 = document.createElement('div');
        div1.style.position = 'absolute';
        div1.style.backgroundColor = this.get_color;
        div1.style.width = this.get_width + '%';
        div1.style.height = this.get_height + '%';
        div1.style.border = '1px solid';
        div1.style.left = (15 * this.get_width) + '%';
        div1.style.top = 0 + '%';
        div.append(div1);
        this.get_divs.push(div1);

        div1 = document.createElement('div');
        div1.style.position = 'absolute';
        div1.style.backgroundColor = this.get_color;
        div1.style.width = this.get_width + '%';
        div1.style.height = this.get_height + '%';
        div1.style.border = '1px solid';
        div1.style.left = (15 * this.get_width) + '%';
        div1.style.top = this.get_height + '%';
        div.append(div1);
        this.get_divs.push(div1);

        div1 = document.createElement('div');
        div1.style.position = 'absolute';
        div1.style.backgroundColor = this.get_color;
        div1.style.width = this.get_width + '%';
        div1.style.height = this.get_height + '%';
        div1.style.border = '1px solid';
        div1.style.left = (15 * this.get_width) + '%';
        div1.style.top = (2 * this.get_height) + '%';
        div.append(div1);
        this.get_divs.push(div1);

        div1 = document.createElement('div');
        div1.style.position = 'absolute';
        div1.style.backgroundColor = this.get_color;
        div1.style.width = this.get_width + '%';
        div1.style.height = this.get_height + '%';
        div1.style.border = '1px solid';
        div1.style.left = (16 * this.get_width) + '%';
        div1.style.top = (2 * this.get_height) + '%';
        div.append(div1);
        this.get_divs.push(div1);
    }
}

class Pink2Brick extends Brick {
    constructor(div, div1) {
        super();
        this.set_color = '#E64076';
        if (div) this.drawBrick(div);
        if (div1) this.addBrick(div1);
    }

    addBrick(div) {
        div.innerHTML = '';
        let div1 = document.createElement('div');
        div1.style.position = 'absolute';
        div1.style.backgroundColor = this.get_color;
        div1.style.width = 12.5 + '%';
        div1.style.height = 12.5 + '%';
        div1.style.border = '1px solid';
        div1.style.left = (2.5 * 12.5) + '%';
        div1.style.top = (3 * 12.5) + '%';
        div.append(div1);

        div1 = document.createElement('div');
        div1.style.position = 'absolute';
        div1.style.backgroundColor = this.get_color;
        div1.style.width = 12.5 + '%';
        div1.style.height = 12.5 + '%';
        div1.style.border = '1px solid';
        div1.style.left = (3.5 * 12.5) + '%';
        div1.style.top = (3 * 12.5) + '%';
        div.append(div1);

        div1 = document.createElement('div');
        div1.style.position = 'absolute';
        div1.style.backgroundColor = this.get_color;
        div1.style.width = 12.5 + '%';
        div1.style.height = 12.5 + '%';
        div1.style.border = '1px solid';
        div1.style.left = (3.5 * 12.5) + '%';
        div1.style.top = (4 * 12.5) + '%';
        div.append(div1);

        div1 = document.createElement('div');
        div1.style.position = 'absolute';
        div1.style.backgroundColor = this.get_color;
        div1.style.width = 12.5 + '%';
        div1.style.height = 12.5 + '%';
        div1.style.border = '1px solid';
        div1.style.left = (4.5 * 12.5) + '%';
        div1.style.top = (4 * 12.5) + '%';
        div.append(div1);
    }

    drawBrick(div) {
        let div1 = document.createElement('div');
        div1.style.position = 'absolute';
        div1.style.backgroundColor = this.get_color;
        div1.style.width = this.get_width + '%';
        div1.style.height = this.get_height + '%';
        div1.style.border = '1px solid';
        div1.style.left = (16 * this.get_width) + '%';
        div1.style.top = this.get_height + '%';
        div.append(div1);
        this.get_divs.push(div1);

        div1 = document.createElement('div');
        div1.style.position = 'absolute';
        div1.style.backgroundColor = this.get_color;
        div1.style.width = this.get_width + '%';
        div1.style.height = this.get_height + '%';
        div1.style.border = '1px solid';
        div1.style.left = (15 * this.get_width) + '%';
        div1.style.top = this.get_height + '%';
        div.append(div1);
        this.get_divs.push(div1);

        div1 = document.createElement('div');
        div1.style.position = 'absolute';
        div1.style.backgroundColor = this.get_color;
        div1.style.width = this.get_width + '%';
        div1.style.height = this.get_height + '%';
        div1.style.border = '1px solid';
        div1.style.left = (15 * this.get_width) + '%';
        div1.style.top = 0 + '%';
        div.append(div1);
        this.get_divs.push(div1);

        div1 = document.createElement('div');
        div1.style.position = 'absolute';
        div1.style.backgroundColor = this.get_color;
        div1.style.width = this.get_width + '%';
        div1.style.height = this.get_height + '%';
        div1.style.border = '1px solid';
        div1.style.left = (14 * this.get_width) + '%';
        div1.style.top = 0 + '%';
        div.append(div1);
        this.get_divs.push(div1);
    }
}

body = document.querySelector('body');

if (localStorage.getItem('backgroundColor')) {
    body.style.backgroundColor = localStorage.getItem('backgroundColor');
}

const tetris = new Tetris();


tetris.render();
