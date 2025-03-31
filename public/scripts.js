let BOARD_SIZE = 15 //kentän koko eli seinäpalikoiden määrä
let board; //kenttä tallennetaan tähän
const cellSize = calculateCellSize();

let pelaaja;
let playerX;
let playerY;

document.getElementById('start-button').addEventListener('click', startGame);

document.addEventListener('keydown', (event) => {
    switch (event.key) {
      case 'ArrowUp':
      pelaaja.move(0, -1); // Liikuta ylös
      break;
      case 'ArrowDown':
      pelaaja.move(0, 1); // Liikuta alas
      break;
      case 'ArrowLeft':
      pelaaja.move(-1, 0); // Liikuta vasemmalle
     break;
      case 'ArrowRight':
      pelaaja.move(1, 0); // Liikuta oikealle
      break;
      case 'w':
        shootAt(pelaaja.x, pelaaja.y -1);
      break;
      
      }
     event.preventDefault(); // Prevent default scrolling behaviour
     });

function startGame() {
    console.log('Game started');
    document.getElementById('intro-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'block';
    board = generateRandomBoard();
    console.log(board);
    drawBoard(board);
}

function generateRandomBoard() {
    //luodaan uusi tyhjä kenttä, jonka koko on BOARD_SIZE x BOARD_SIZE
    const newBoard = Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(' '));

    //set walls in edges
    for (let y = 0; y < BOARD_SIZE; y++) {
        for (let x = 0; x < BOARD_SIZE; x++) {
         if (y === 0 || y === BOARD_SIZE - 1 || x === 0 || x === BOARD_SIZE - 1) {
             newBoard[y][x] = 'W'; //W is wall
         }
        }
       }

    generateObstacles(newBoard);
    
    [playerX, playerY] = randomEmptyPosition(newBoard);

    pelaaja = new Player(playerX, playerY);

    newBoard[pelaaja.y][pelaaja.x] = 'P'; //P is player

    for(let i = 0; i < 5; i++){
        const [x, y] = randomEmptyPosition(newBoard);
        newBoard[y][x] = 'G'; //G is monster
    }

    return newBoard;
    
}  

function drawBoard(board) {
    const gameBoard = document.getElementById('game-board');

    // Tyhjennetään pelilauta
    gameBoard.innerHTML = '';

    // Tämä luo CSS Grid -ruudukon, jossa on BOARD_SIZE saraketta. 
    // Jokainen sarake saa saman leveyden (1fr).
    gameBoard.style.gridTemplateColumns = `repeat(${BOARD_SIZE}, 1fr)`;

    // Luodaan jokainen ruutu
    for (let y = 0; y < BOARD_SIZE; y++) {
        for (let x = 0; x < BOARD_SIZE; x++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.style.width = cellSize + "px";
            cell.style.height = cellSize + "px";
            if (getCell(board, x, y) === 'W') {
                cell.classList.add('wall'); // 'W' on seinä
            }
            else if (getCell(board, x, y) === 'P') {
                cell.classList.add('player'); // 'P' on pelaaja
            }
            else if (getCell(board, x, y) === 'G') {
                cell.classList.add('monster'); // 'G' on monster
            }else if(getCell(board,x,y) === 'B'){
                cell.classList.add('bullet');
            }

            gameBoard.appendChild(cell);
        }
    }

    
}

function getCell(board, x, y) {
    return board[y][x];
}

function calculateCellSize() {
    // Otetaan talteen pienempi luku ikkunan leveydestä ja korkeudesta
    const screenSize = Math.min(window.innerWidth, window.innerHeight);
    // Tehdään pelilaudasta hieman tätä pienempi, jotta jää pienet reunat
    const gameBoardSize = 0.95 * screenSize;
    // Laudan koko jaetaan ruutujen määrällä, jolloin saadaan yhden ruudun koko
    return gameBoardSize / BOARD_SIZE;
}

function generateObstacles(board){
    //Lista missä esteiden muodot koordinaatteina
    const obstacles =[
    [[0,0], [0,1],[1,0],[1,1]], //Neliö
    [[0,0],[0,1],[0,2],[0,3]],//I
    [[0,0],[1,0],[2,0],[1,1]] // T
    ];

    //kova koodattu X ja Y paikat esteille
    const position =[
        {startX: 2, startY:2},
        {startX: 8, startY: 2},
        {startX: 4, startY: 8},
        {startX: 10, startY: 10},
        {startX: 6, startY: 11},
        {startX: 11, startY: 5},
        {startX: 3, startY: 11},
        {startX: 5, startY: 4},
        {startX: 7, startY: 7}
    ];

    position.forEach(pos=>{
        const randomObstacle = obstacles[Math.floor(Math.random()*obstacles.length)];
        placeObstacle(board, randomObstacle,pos.startX,pos.startY);
    });
}

function placeObstacle(board,obstacle,startX, startY){
    for(coordinatePair of obstacle){
        [x,y]  = coordinatePair;
        board[startY + y][startX + x] = 'W';
    }
}

//Generates random number between 5 and 10
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomEmptyPosition(board) {
    x = randomInt(1, BOARD_SIZE - 2);
    y = randomInt(1, BOARD_SIZE - 2);
    if (getCell(board, x, y) === ' ') {
        return [x, y];
    } else {
        return randomEmptyPosition(board);
    }
}

function shootAt(x,y){
    board[y][x] = 'B';
    drawBoard(board);
}

class Player {
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
    move(dx, dy){

        const currentX = this.x;
        const currentY = this.y;
        

       // Laske uusi sijainti
       // const newX = currentX + deltaX;
       const newY = currentY + dy;
       const newX = currentX + dx;



     
     if (getCell(board, newX, newY) === ' ') {
        // Päivitä pelaajan sijainti
        this.x = newX;
        this.y = newY;

        // Päivitä pelikenttä
        board[currentY][currentX] = ' '; // Tyhjennetään vanha paikka
        board[newY][newX] = 'P'; // Asetetaan uusi paikka
     }

     drawBoard(board);

    }
}
    