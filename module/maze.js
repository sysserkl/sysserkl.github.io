function canvas_set_maze_b(canvas,ROWS,COLS,CELL_SIZE){
    canvas.width = COLS * CELL_SIZE;
    canvas.height = ROWS * CELL_SIZE;
    return canvas.getContext('2d');
}

function init_grid_maze_b(grid,ROWS,COLS,CELL_SIZE=20,border_color='grey',canvas=false,ctx=false) {
    function sub_init_grid_maze_b_cell(cell,r,c){
        const x = c * CELL_SIZE;
        const y = r * CELL_SIZE;
        
        //以下几行保留 - 保留注释
        //if (cell.walls.top) {
            //ctx.moveTo(x, y); 
            //ctx.lineTo(x + CELL_SIZE, y);
        //}
        
        //if (cell.walls.left) {
            //ctx.moveTo(x, y); 
            //ctx.lineTo(x, y + CELL_SIZE);
        //}
                
        if (cell.walls.right) {
            ctx.moveTo(x + CELL_SIZE, y); 
            ctx.lineTo(x + CELL_SIZE, y + CELL_SIZE);
        }
        if (cell.walls.bottom) {
            ctx.moveTo(x, y + CELL_SIZE); 
            ctx.lineTo(x + CELL_SIZE, y + CELL_SIZE);
        }
    }
    
    function sub_init_grid_maze_b_draw(){
        if (!canvas){return;}
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 1. 绘制内部墙壁
        ctx.lineWidth = 1;
        ctx.strokeStyle = border_color;
        ctx.beginPath();
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                sub_init_grid_maze_b_cell(grid[r][c],r,c);
            }
        }

        // 补上最左侧的第一列左墙
        for (let r = 0; r < ROWS; r++) {
            if (grid[r][0].walls.left) {
                const x = 0;
                const y = r * CELL_SIZE;
                ctx.moveTo(x, y);
                ctx.lineTo(x, y + CELL_SIZE);
            }
        }
        
        // 补上最上方的第一行上墙
        for (let c = 0; c < COLS; c++) {
            if (grid[0][c].walls.top) {
                const x = c * CELL_SIZE;
                const y = 0;
                ctx.moveTo(x, y);
                ctx.lineTo(x + CELL_SIZE, y);
            }
        }
        ctx.stroke();
    }

    function sub_init_grid_maze_b_get_unvisited_neighbors(cell) {
        const neighbors = [];
        const { row, col } = cell;
        if (row > 0 && !grid[row - 1][col].visited) neighbors.push(grid[row - 1][col]);
        if (col < COLS - 1 && !grid[row][col + 1].visited) neighbors.push(grid[row][col + 1]);
        if (row < ROWS - 1 && !grid[row + 1][col].visited) neighbors.push(grid[row + 1][col]);
        if (col > 0 && !grid[row][col - 1].visited) neighbors.push(grid[row][col - 1]);
        if (neighbors.length === 0) return null;
        return neighbors[Math.floor(Math.random() * neighbors.length)];
    }

    function sub_init_grid_maze_b_remove_walls(c1, c2) {
        const dx = c1.col - c2.col;
        const dy = c1.row - c2.row;
        if (dx === 1) { c1.walls.left = false; c2.walls.right = false; }
        if (dx === -1) { c1.walls.right = false; c2.walls.left = false; }
        if (dy === 1) { c1.walls.top = false; c2.walls.bottom = false; }
        if (dy === -1) { c1.walls.bottom = false; c2.walls.top = false; }
    }

    for (let r = 0; r < ROWS; r++) {
        let row = [];
        for (let c = 0; c < COLS; c++) {
            row.push({
            'row': r,
            'col': c,
            'walls': { top: true, right: true, bottom: true, left: true },
            'visited': false,
            });
        }
        grid.push(row);
    }
    grid[0][0]['walls']['top']=false;
    grid[ROWS-1][COLS-1]['walls']['bottom']=false;
    
    // 核心生成算法：DFS 回溯
    const stack = [];
    const start = grid[0][0];
    start.visited = true;
    stack.push(start);

    while (stack.length > 0) {
        const current = stack[stack.length - 1];
        const next = sub_init_grid_maze_b_get_unvisited_neighbors(current);
        if (next) {
            next.visited = true;
            sub_init_grid_maze_b_remove_walls(current, next);
            stack.push(next);
        } else {
            stack.pop();
        }
    }
    
    sub_init_grid_maze_b_draw(); // 生成时不显示路径
}

// 求解算法：BFS 寻找最短路径
function find_path_maze_b(grid,ROWS,COLS,CELL_SIZE=20,path_color='tomato',otable=false,canvas=false,ctx=false) {
    function sub_find_path_maze_b_draw(path){
        if (!canvas){return;}
        
        ctx.strokeStyle = path_color;
        ctx.lineWidth = CELL_SIZE / 3; // 路径宽度
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        
        // 从入口中心开始
        ctx.moveTo(CELL_SIZE / 2, CELL_SIZE / 2);
        
        // 连接路径上的每个格子中心
        for (let i = 1; i < path.length; i++) {
            const x = path[i].col * CELL_SIZE + CELL_SIZE / 2;
            const y = path[i].row * CELL_SIZE + CELL_SIZE / 2;
            ctx.lineTo(x, y);
        }
        
        // 延伸到出口中心
        ctx.lineTo((COLS - 0.5) * CELL_SIZE, (ROWS - 0.5) * CELL_SIZE);
        ctx.stroke();
    }
    
    if (grid.length==0){return [];}
    
    const start = grid[0][0];
    const end = grid[ROWS-1][COLS-1];
    
    const queue = [start];
    const visited = new Set([`${start.row},${start.col}`]);
    const parent = new Map(); // 记录路径来源

    while (queue.length > 0) {
        const current = queue.shift();

        // 到达终点
        if (current.row === end.row && current.col === end.col) {
            let path = [];
            let temp = current;
            while (temp) {
                path.push(temp);
                temp = parent.get(`${temp.row},${temp.col}`);
            }
            table_maze_generate_b(COLS,ROWS,grid,otable,path);
            sub_find_path_maze_b_draw(path.reverse());
            return path;
        }

        // 检查四个方向 (上、右、下、左)
        const directions = [
            { dr: -1, dc: 0, wall: 'top', opposite: 'bottom' },
            { dr: 0, dc: 1, wall: 'right', opposite: 'left' },
            { dr: 1, dc: 0, wall: 'bottom', opposite: 'top' },
            { dr: 0, dc: -1, wall: 'left', opposite: 'right' }
        ];

        for (const { dr, dc, wall, opposite } of directions) {
            const nr = current.row + dr;
            const nc = current.col + dc;
            const key = `${nr},${nc}`;

            // 检查边界、墙壁和是否已访问
            if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && !current.walls[wall] && !visited.has(key)) {
                visited.add(key);
                parent.set(key, current);
                queue.push(grid[nr][nc]);
            }
        }
    }
    return []; // 理论上完美迷宫一定有解
}

function table_maze_generate_b(ROWS,COLS,grid,table,path = null,onclick_fn='') {
    if (!table){return;}
    
    if (path) {
        for (let item of path){
            let td=table.querySelector('.td_maze_rc'+item.row+'_'+item.col);
            if (td){
                td.classList.add('td_maze_path');
            }
        }
    } else {
        table.innerHTML='';
        for (let r = 0; r < ROWS; r++) {
            const tr = document.createElement('tr');
            for (let c = 0; c < COLS; c++) {
                const cell = grid[r][c];
                const td = document.createElement('td');

                // 1. 设置四面墙壁的边框 (有墙=1px实线，无墙=0px透明)
                
                //以下几行保留 - 保留注释
                //td.style.borderLeft = cell.walls.left ? '1px solid #333' : '0';
                //td.style.borderTop = cell.walls.top ? '1px solid #333' : '0';
                
                td.style.borderRight = cell.walls.right ? '1px solid #333' : '0';
                td.style.borderBottom = cell.walls.bottom ? '1px solid #333' : '0';

                // 2. 补上最左侧的第一列左墙
               if (c === 0) {
                    td.style.borderLeft = cell.walls.left ? '1px solid #333' : '0';
                }
            
                // 3. 补上最上方的第一行上墙
                if (r === 0) {
                    td.style.borderTop = cell.walls.top ? '1px solid #333' : '0';
                }

                td.classList.add('td_maze_rc'+r+'_'+c);
                td.classList.add('td_maze_w'+(cell.walls.left?1:0)+(cell.walls.top?1:0)+(cell.walls.right?1:0)+(cell.walls.bottom?1:0));
                
                if (onclick_fn!==''){
                    td.setAttribute('onclick',onclick_fn+'(this)');
                }            
                tr.appendChild(td);
            }
            table.appendChild(tr);
        }
    }
}
