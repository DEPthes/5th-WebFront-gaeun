const boardContainer = document.getElementById('sudoku-board');
const newGameBtn = document.getElementById('new-game-btn');
const checkBtn = document.getElementById('check-btn');

const MIN_NUM = 1;
const MAX_NUM = 9;

const gameGrid = {
    problem: [] 
};

async function fetchSudoku() {
    boardContainer.innerHTML = "<p style='color:white; grid-column: span 9; padding:2rem;'>퍼즐 불러오는 중...</p>";
    
    try {
        const response = await fetch('https://sugoku.onrender.com/board?difficulty=easy');
        const data = await response.json();
        
        gameGrid.problem = JSON.parse(JSON.stringify(data.board));
        
        renderBoard(data.board);
    } catch (error) {
        boardContainer.innerHTML = "<p style='color:white; grid-column: span 9;'>로딩 실패. 다시 시도해주세요.</p>";
        console.error("API 에러:", error);
    }
}

// 2. 화면에 9x9 스도쿠 보드 동적 생성 
function renderBoard(board) {
    boardContainer.innerHTML = '';

    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            const val = board[r][c];
            const cellDiv = document.createElement('div');
            cellDiv.className = `cell cell-row-${r}`;
            
            const input = document.createElement('input');
            input.type = 'text';
            input.maxLength = 1; 
            
            input.dataset.row = r;
            input.dataset.col = c;

            if (val !== 0) {
                input.value = val;
                input.readOnly = true;
                cellDiv.classList.add('original');
            }

            cellDiv.appendChild(input);
            boardContainer.appendChild(cellDiv);
        }
    }
}

// 3. 입력값 검증 비즈니스 로직 함수로 따로 분리!
function handleInput(target) {
    const r = Number(target.dataset.row);
    const c = Number(target.dataset.col);
    const value = Number(target.value);

    if (isNaN(value) || value < MIN_NUM || value > MAX_NUM) {
        target.value = '';
        gameGrid.problem[r][c] = 0;
        return;
    }

    gameGrid.problem[r][c] = value;
}

// 4. 완벽한 수학적 정답 검증 비즈니스 로직 함수
function checkSolution() {
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            if (gameGrid.problem[r][c] === 0) {
                alert("❌ 아직 채워지지 않은 빈칸이 있습니다!");
                return;
            }
        }
    }

    
    for (let r = 0; r < 9; r++) {
        const rowSet = new Set(gameGrid.problem[r]); 
        if (rowSet.size !== 9) {
            alert("❌ 가로줄에 중복된 숫자가 있습니다!");
            return;
        }
    }

    for (let c = 0; c < 9; c++) {
        const colSet = new Set();
        for (let r = 0; r < 9; r++) {
            colSet.add(gameGrid.problem[r][c]);
        }
        if (colSet.size !== 9) {
            alert("❌ 세로줄에 중복된 숫자가 있습니다!");
            return;
        }
    }

    for (let rowOffset = 0; rowOffset < 9; rowOffset += 3) {
        for (let colOffset = 0; colOffset < 9; colOffset += 3) {
            const boxSet = new Set();
            for (let r = 0; r < 3; r++) {
                for (let c = 0; c < 3; c++) {
                    boxSet.add(gameGrid.problem[rowOffset + r][colOffset + c]);
                }
            }
            if (boxSet.size !== 9) {
                alert("3x3 박스 안에 중복된 숫자가 있습니다!");
                return;
            }
        }
    }

    alert("대단해요! 완벽하게 맞추셨습니다! 축하합니다! 🩵");
}

// 5. 이벤트 위임을 활용한 입력 감시 
boardContainer.addEventListener('input', (event) => {
    if (event.target.tagName === 'INPUT') {
        handleInput(event.target); 
    }
});

newGameBtn.addEventListener('click', fetchSudoku);
checkBtn.addEventListener('click', checkSolution);

window.addEventListener('DOMContentLoaded', fetchSudoku);