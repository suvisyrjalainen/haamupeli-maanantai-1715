let BOARD_SIZE = 15 //kentän koko eli seinäpalikoiden määrä
let board; //kenttä tallennetaan tähän
const cellSize = calculateCellSize();

document.getElementById('start-button').addEventListener('click', startGame);

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
    return newBoard;
    
}  

function drawBoard(board) {
    const gameBoard = document.getElementById('game-board');

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
        {startX: 4, startY: 8}
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