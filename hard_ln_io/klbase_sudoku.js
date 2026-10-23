//-----------------------
//history
//0.0.1-20260507 通义千问 javascript: 生成随机数独，要求解唯一，且出现的数字个数最少
//-----------------------
class sudoku_generator_b{
    constructor() {
        this.board = Array(9).fill().map(() => Array(9).fill(0));
        this.solutionCount = 0;
        this.fillBoardCount = 0;
        this.startTime=performance.now();
        this.timeUsed=0;
    }

    // 检查在 (row, col) 位置放置 num 是否有效
    isValid(row, col, num) {
        const boxStartRow = row - row % 3;
        const boxStartCol = col - col % 3;

        for (let bli = 0; bli < 9; bli++) {
            if (this.board[row][bli] === num || 
                this.board[bli][col] === num || 
                this.board[boxStartRow + Math.floor(bli / 3)][boxStartCol + bli % 3] === num) {
                return false;
            }
        }
        return true;
    }

    // 使用回溯法填充整个数独
    fillBoard() {
        this.fillBoardCount=this.fillBoardCount+1;
        for (let blr = 0; blr < 9; blr++) {
            for (let blc = 0; blc < 9; blc++) {
                if (this.board[blr][blc] === 0) {
                    let nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
                    // 随机打乱数字顺序以生成不同的终局
                    for (let bli = nums.length - 1; bli > 0; bli--) {
                        const blj = Math.floor(Math.random() * (bli + 1));
                        [nums[bli], nums[blj]] = [nums[blj], nums[bli]];
                    }

                    for (let num of nums) {
                        if (this.isValid(blr, blc, num)) {
                            this.board[blr][blc] = num;
                            if (this.fillBoard()) {
                                return true;
                            }
                            this.board[blr][blc] = 0; // 回溯
                        }
                    }
                    return false; // 触发回溯
                }
            }
        }
        return true; // 完成填充
    }

    // 计算当前棋盘状态下的解的数量（限制搜索以提高性能）
    countSolutions(bln = 2) { // bln=2 意味着找到2个解就停止，因为我们只关心是否唯一
        this.solutionCount = 0;
        this._countSolutionsRecursive(bln);
        return this.solutionCount;
    }

    _countSolutionsRecursive(limit) {
        if (this.solutionCount >= limit) return; // 提前终止

        for (let blr = 0; blr < 9; blr++) {
            for (let blc = 0; blc < 9; blc++) {
                if (this.board[blr][blc] === 0) {
                    for (let num = 1; num <= 9; num++) {
                        if (this.isValid(blr, blc, num)) {
                            this.board[blr][blc] = num;
                            this._countSolutionsRecursive(limit);
                            this.board[blr][blc] = 0; // 回溯
                        }
                    }
                    return; // 找到第一个空格后立即进入递归，不再遍历其他空格
                }
            }
        }
        // 如果没有空格，说明找到了一个解
        this.solutionCount++;
    }

    // 生成最终的数独题目
    generate() {
        // 1. 生成一个完整的终局
        this.fillBoard();
        
        // 2. 随机移除数字，确保解的唯一性
        const filledPositions = [];
        for (let blr = 0; blr < 9; blr++) {
            for (let blc = 0; blc < 9; blc++) {
                filledPositions.push([blr, blc]);
            }
        }
        
        // 随机打乱要移除的位置
        for (let bli = filledPositions.length - 1; bli > 0; bli--) {
            const blj = Math.floor(Math.random() * (bli + 1));
            [filledPositions[bli], filledPositions[blj]] = [filledPositions[blj], filledPositions[bli]];
        }

        for (const [blr, blc] of filledPositions) {
            const backup = this.board[blr][blc];
            this.board[blr][blc] = 0;

            // 创建一个临时棋盘副本用于验证
            // 注意：这里的 this.board 已经是当前操作的棋盘，我们将其备份到临时变量
            // 正确的做法是在修改前就备份整个棋盘，或者通过其他方式避免污染原棋盘。
            // 为了不影响主流程，我们在这里创建一个快照用于检查。
            const snapshot = this.board.map(row => [...row]);

            // 验证移除后是否仍为唯一解
            if (this.countSolutions(2) !== 1) {
                // 如果不唯一，则恢复数字
                this.board[blr][blc] = backup;
            } 
            // 如果唯一，则当前board状态已经更新，不需要额外操作
            // 但countSolutions改变了board，所以需要恢复快照
             this.board = snapshot;
        }

        // 最后再设置一次被移除的数字
         for (const [blr, blc] of filledPositions) {
            const backup = this.board[blr][blc];
            this.board[blr][blc] = 0;

            const snapshot = this.board.map(row => [...row]);

            if (this.countSolutions(2) !== 1) {
                 this.board[blr][blc] = backup;
            }
             this.board = snapshot;
        }
        
        // 最终执行一遍确定的移除
        for (const [blr, blc] of filledPositions) {
            const backup = this.board[blr][blc];
            this.board[blr][blc] = 0;
            const snapshot = this.board.map(row => [...row]);
            if (this.countSolutions(2) !== 1) {
                 this.board[blr][blc] = backup;
            } else {
                // 如果唯一，正式移除
                snapshot[blr][blc] = 0;
                this.board = snapshot;
            }
        }

        return this.board;
    }

    // 重新定义一个更安全的生成流程，避免在验证过程中污染主棋盘
    generateClean() {
        // 1. 生成一个完整的终局
        this.fillBoard();
        const fullSolution = this.board.map(row => [...row]); // 保存一份完整解

        // 2. 随机移除数字，确保解的唯一性
        const filledPositions = [];
        for (let blr = 0; blr < 9; blr++) {
            for (let blc = 0; blc < 9; blc++) {
                if (fullSolution[blr][blc] !== 0) filledPositions.push([blr, blc]);
            }
        }
        
        for (let bli = filledPositions.length - 1; bli > 0; bli--) {
            const blj = Math.floor(Math.random() * (bli + 1));
            [filledPositions[bli], filledPositions[blj]] = [filledPositions[blj], filledPositions[bli]];
        }

        let puzzleBoard = fullSolution.map(row => [...row]); // 从完整解开始构建谜题

        for (const [blr, blc] of filledPositions) {
            const backup = puzzleBoard[blr][blc];
            puzzleBoard[blr][blc] = 0;

            // 对谜题副本进行唯一性检查
            const testPuzzle = puzzleBoard.map(row => [...row]);
            const testGenerator = new sudoku_generator_b(); // 创建一个新的实例来避免状态干扰
            testGenerator.board = testPuzzle;
            
            if (testGenerator.countSolutions(2) !== 1) {
                // 如果不唯一，则恢复数字
                puzzleBoard[blr][blc] = backup;
            }
            // 如果唯一，则保留移除状态
        }

        this.board = puzzleBoard; // 将最终的谜题赋值给当前实例
        this.timeUsed=(performance.now() - this.startTime);
        return this.board;
    }
}
