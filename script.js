const obj ={
    "easy":{
        "row":8,
        "col":8,
        "mines":10
    },
    "medium":{
        "row":10,
        "col":10,
        "mines":12
    },
    "hard":{
        "row":12,
        "col":12,
        "mines":14
    }
}



let select=document.querySelector('#select');
let interval;
let timer=document.querySelector('.watch-count');
let flagNo=document.querySelector('.flag-count');
let restart=document.querySelector('.restart');
let board = [];
let rows=8;
let columns = 8;
let widthVal;
let flgcount=10;

let minesCount = 10;
flagNo.innerText=minesCount;
let minesLocation = []; // "2-2", "3-4", "2-1"

let tilesClicked = 0; //goal to click all tiles except the ones containing mines
let flagEnabled = false;

let gameOver = false;

select.addEventListener('change',()=>{
        let box=document.querySelector('#board');
        box.innerHTML='';
        gameOver=false;
        board = [];
        minesLocation = [];
        
        let val=select.value;    
        rows=obj[val].row;
        console.log(rows)
        columns=obj[val].col;
        console.log(columns)

        minesCount=obj[val].mines;
        flgcount=minesCount;
        flagNo.innerText=flgcount;
        
        if(rows===8){
            widthVal=48;
        }
        else if(rows===10){
            widthVal=38;
        }
        else{
            widthVal=31.3;
        }
        clearInterval(interval)
    t=0;
    timer.innerText=t;
    
        // startGame();
})




window.onload = function() {
//    startGame();
restart.innerText='Start'
}
restart.addEventListener('click',()=>{
    restart.style.backgroundColor='';
    restart.innerText='Restart'
    let box=document.querySelector('#board');
    box.innerHTML='';
    gameOver=false;
    board = [];
    minesLocation = [];
    clearInterval(interval)
    t=0;
    timer.innerText=t;
    startGame();
})

function setMines() {
   
    let minesLeft = minesCount;
    while (minesLeft > 0) { 
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);
        let id = r.toString() + "-" + c.toString();

        if (!minesLocation.includes(id)) {
            minesLocation.push(id);
            minesLeft -= 1;
        }
    }
}

let t=0;
function startGame() {
    clearInterval(interval);
    interval=setInterval(() => {
        t +=1;
        timer.innerText=t;
    }, 1000);
    flgcount=minesCount;
    flagNo.innerText=flgcount;
    flagEnabled = false;
    document.getElementById("flag-button").style.backgroundColor = "lightgray";
    document.getElementById("mines-count").innerText = minesCount;
    document.getElementById("flag-button").addEventListener("click", setFlag);
    setMines();

    //populate our board
    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < columns; c++) {
            //<div id="0-0"></div>
            let tile = document.createElement("div");
            tile.style.width=widthVal + 'px';
            tile.style.height=widthVal + 'px';
            tile.id = r.toString() + "-" + c.toString();
            tile.addEventListener("click", clickTile);
            
            document.getElementById("board").append(tile);
            row.push(tile);
        }
        board.push(row);
    }

    console.log(board);
}

function setFlag() {
  
    if (flagEnabled) {
        flagEnabled = false;
        document.getElementById("flag-button").style.backgroundColor = "lightgray";
    }
    else {
        flagEnabled = true;
        document.getElementById("flag-button").style.backgroundColor = "darkgray";
    }
}

function clickTile() {
    if (gameOver || this.classList.contains("tile-clicked")) {
        return;
    }
    if(flgcount === 0){
        document.getElementById("flag-button").removeEventListener("click", setFlag);
        flagEnabled =false;
        document.getElementById("flag-button").style.backgroundColor = "lightgray";
    }
    let tile = this;
    if (flagEnabled && flgcount!==0) {
        if (tile.innerText == "") {
            tile.innerText = "🚩";
            flgcount -=1;
            flagNo.innerHTML=flgcount;
        }
        else if (tile.innerText == "🚩" ) {
            tile.innerText = "";
            flgcount +=1;
            flagNo.innerHTML=flgcount;
        }
        return;
    }

    if (minesLocation.includes(tile.id)) {
        // alert("GAME OVER");
        gameOver = true;
        clearInterval(interval)
        revealMines();
        
        let resultBox = document.createElement('section');
        let h1 = document.createElement('h1');
        h1.classList.add('result'); 
        h1.innerText = 'You lost'; 
        h1.style.color='red';

        let p = document.createElement('p');
        p.innerText = "Try again!"; 
        p.style.color='red'

        resultBox.classList.add('result-box'); 
    
        resultBox.append(h1); 
        resultBox.append(p); 
    
       document.querySelector('#board').append(resultBox);
        restart.style.backgroundColor='red'
       
        return;
    }


    let coords = tile.id.split("-"); // "0-0" -> ["0", "0"]
    let r = parseInt(coords[0]);
    let c = parseInt(coords[1]);
    checkMine(r, c);

}

function revealMines() {
    for (let r= 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = board[r][c];
            if (minesLocation.includes(tile.id)) {
                tile.innerText = "💣";
                tile.style.backgroundColor = "red";                
            }
        }
    }
}

function checkMine(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= columns) {
        return;
    }
    if (board[r][c].classList.contains("tile-clicked")) {
        return;
    }

    board[r][c].classList.add("tile-clicked");
    tilesClicked += 1;

    let minesFound = 0;

    //top 3
    minesFound += checkTile(r-1, c-1);      //top left
    minesFound += checkTile(r-1, c);        //top 
    minesFound += checkTile(r-1, c+1);      //top right

    //left and right
    minesFound += checkTile(r, c-1);        //left
    minesFound += checkTile(r, c+1);        //right

    //bottom 3
    minesFound += checkTile(r+1, c-1);      //bottom left
    minesFound += checkTile(r+1, c);        //bottom 
    minesFound += checkTile(r+1, c+1);      //bottom right

    if (minesFound > 0) {
        board[r][c].innerText = minesFound;
        board[r][c].classList.add("x" + minesFound.toString());
    }
    else {
        board[r][c].innerText = "";
        
        //top 3
        checkMine(r-1, c-1);    //top left
        checkMine(r-1, c);      //top
        checkMine(r-1, c+1);    //top right

        //left and right
        checkMine(r, c-1);      //left
        checkMine(r, c+1);      //right

        //bottom 3
        checkMine(r+1, c-1);    //bottom left
        checkMine(r+1, c);      //bottom
        checkMine(r+1, c+1);    //bottom right
    }

    if (tilesClicked == rows * columns - minesCount) {
        document.getElementById("mines-count").innerText = "Cleared";
        clearInterval(interval);

        let resultBox = document.createElement('section');
        let h1 = document.createElement('h1');
        h1.classList.add('result'); 
        h1.innerText = 'You won...🏆🏆'; 
        h1.style.color='blue';

        let p = document.createElement('p');
        p.innerText = "Your Time:-" +t+"sec"; 
        p.style.color='blue'

        resultBox.classList.add('result-box'); 
    
        resultBox.append(h1); 
        resultBox.append(p); 
    
       document.querySelector('#board').append(resultBox);
        
        restart.style.backgroundColor='red'

        gameOver = true;
    }
}

function checkTile(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= columns) {
        return 0;
    }
    if (minesLocation.includes(r.toString() + "-" + c.toString())) {
        return 1;
    }
    return 0;
}

 
