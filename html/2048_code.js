function var_set_2048(rows=4){
    board_2048_global = [];
    size_2048_global = rows;
    colors_2048_global = {
    0: '#cdc1b4',
    2: '#eee4da',
    4: '#ede0c8',
    8: '#f2b179',
    16: '#f59563',
    32: '#f67c5f',
    64: '#f65e3b',
    128: '#edcf72',
    256: '#edcc61',
    512: '#edc850',
    1024: '#edc53f',
    2048: '#edc22e',
    };
    
    base_size_2048_global=(ismobile_b()?5:3);
    
    document.getElementById('div_grid').style.cssText='display: grid; grid-template-columns: repeat('+rows+', 1fr); gap: '+(base_size_2048_global-2)+'vw; background-color: #bbada0; padding: '+(base_size_2048_global-2)+'vw; border-radius: 1vw;';
}

function init_2048(){
    score_2048_global = 0;
    game_over_show_hide_2048('none');
    
    board_2048_global = Array.from({ length: size_2048_global }, () => Array(size_2048_global).fill(0));
    add_random_tile_2048(2);
}

function add_random_tile_2048(cscount=1){
    const emptyTiles = new Map(); // 使用 Map 来存储空位置
    //Map: 可以使用任何类型的值（包括对象、函数、基本数据类型等）作为键。
    //Map: 没有默认键。你只能通过显式调用 .set() 方法来添加键值对。
    
    //{} (普通对象): 只能使用字符串或符号作为键。如果尝试使用非字符串类型的值作为键，JavaScript 会自动将其转换为字符串。
    //{} (普通对象): 总是有一个原型链，默认情况下包含一些方法和属性（例如 toString, hasOwnProperty 等）。这可能会导致意外的行为
    
    for (let row = 0; row < size_2048_global; row++){
        for (let col = 0; col < size_2048_global; col++){
            if (board_2048_global[row][col] === 0){
                const key = `${row},${col}`; // 创建唯一的键
                emptyTiles.set(key, { row, col });
            }
        }
    }

    for (let blxl=0;blxl<cscount;blxl++){
        if (emptyTiles.size == 0){break;} // 如果没有空位置，则返回

        // 获取所有键，并随机选择一个
        const keys = Array.from(emptyTiles.keys());
        const randomKey = keys[Math.floor(Math.random() * keys.length)];
        const { row, col } = emptyTiles.get(randomKey); // 获取选定的位置
        
        // 设置新数值
        board_2048_global[row][col] = Math.random() < 0.9 ? 2 : 4;

        // 直接从 Map 中删除指定的键
        emptyTiles.delete(randomKey);
    }
    update_grid_2048();
}

function update_grid_2048(){
    const ogrid = document.getElementById('div_grid');
    
    const ofragment = document.createDocumentFragment(); // 创建 DocumentFragment
    var css_str = 'width: 100%; aspect-ratio: 1 / 1; background-color: #cdc1b4; border-radius: .5vw; display: flex; justify-content: center; align-items: center; font-size: ' + (base_size_2048_global + 0.5) + 'vw; font-weight: bold; color: #776e65;';

    for (let row = 0; row < size_2048_global; row++){
        for (let col = 0; col < size_2048_global; col++){
            const otile = document.createElement('div');
            otile.style.cssText = css_str;
            const value = board_2048_global[row][col];
            otile.textContent = (value !== 0 ? value : '');
            otile.style.backgroundColor = colors_2048_global[value] || '#3c3a32';
            otile.style.color = (value > 4 ? '#f9f6f2' : '#776e65');
            ofragment.appendChild(otile); // 先插入到 fragment
        }
    }

    ogrid.innerHTML = ''; // 清空旧内容
    ogrid.appendChild(ofragment); // 一次性将 fragment 插入真实 DOM
    
    var oscore=document.getElementById('span_score');
    if (!oscore){
        var blstr=`<div style="font-size: `+(base_size_2048_global-0.5)+`vw; color: #776e65; margin-bottom: `+(base_size_2048_global-1)+`vw;">
<span>Score: </span>
<span id="span_score">0</span>
</div>`;
        if (ismobile_b()){
            var blstyle='display: inline-block; padding: 1vw 2vw; font-size: '+(base_size_2048_global+5)+'vw; color: #f9f6f2; background-color: #8f7a66; border: none; border-radius: .5vw; cursor: pointer; margin: '+(base_size_2048_global-2)+'vw;'
            blstr=blstr+'<table border=0 width=100%><tr>';
            blstr=blstr+'<td><button style="'+blstyle+'" onclick="keys_2048(\'ArrowUp\');">⬆</button></td>';       
            blstr=blstr+'<td><button style="'+blstyle+'" onclick="keys_2048(\'ArrowDown\');">⬇</button></td>';

            blstr=blstr+'</tr><tr>';
            blstr=blstr+'<td><button style="'+blstyle+'" onclick="keys_2048(\'ArrowLeft\');">⬅</button></td>';
            blstr=blstr+'<td><button style="'+blstyle+'" onclick="keys_2048(\'ArrowRight\');">➡</button></td>';

            blstr=blstr+'</table>';
        }
        document.getElementById('div_grid').insertAdjacentHTML('afterend',blstr);        
        oscore=document.getElementById('span_score');
    }
    if (oscore){
        oscore.textContent = score_2048_global;
    }
    
    if (is_game_over_2048()){
        game_over_show_hide_2048('block');
    }
}

function is_game_over_2048(){
    for (let row = 0; row < size_2048_global; row++){
        for (let col = 0; col < size_2048_global; col++){
            var blcell=board_2048_global[row][col];
            if (blcell === 0){return false;}
            if (col < size_2048_global - 1 && blcell === board_2048_global[row][col + 1]){return false;}
            if (row < size_2048_global - 1 && blcell === board_2048_global[row + 1][col]){return false;}
        }
    }
    return true;
}

function slide_combine_slide_2048(arr){
    function sub_slide_combine_slide_2048_slide(row){
        let arr = row.filter(val => val !== 0); // 过滤掉所有0值
        while (arr.length < size_2048_global){
            arr.push(0); // 在数组末尾补充0，使其长度与游戏板大小相同
        }
        return arr;
    }

    function sub_slide_combine_slide_2048_combine(row){
        //将相邻且相同的数字合并，并在合并后的位置后面补充一个空位
        for (let blxl = 0; blxl < size_2048_global - 1; blxl++){
            if (row[blxl] === row[blxl + 1] && row[blxl] !== 0){    //如果当前元素与下一个元素相同且不为0，则合并
                row[blxl] *= 2; //合并后的值翻倍
                score_2048_global += row[blxl];  //更新全局得分
                row.splice(blxl + 1, 1, 0); //在合并位置的后面插入一个0，移除被合并的元素
            }
        }
        return row;
    }
        
    arr = sub_slide_combine_slide_2048_slide(arr);
    arr = sub_slide_combine_slide_2048_combine(arr);
    arr = sub_slide_combine_slide_2048_slide(arr);
    return arr;
}

function move_left_2048(){
    for (let row = 0; row < size_2048_global; row++){
        let arr = board_2048_global[row].slice(); // Copy the current row to avoid direct manipulation
        board_2048_global[row] = slide_combine_slide_2048(arr);
    }
}

function move_right_2048(){
    for (let row = 0; row < size_2048_global; row++){
        let arr = board_2048_global[row].slice().reverse();  //不带参数调用 .slice()，用于复制整个数组 - 保留注释
        arr = slide_combine_slide_2048(arr);
        board_2048_global[row] = arr.reverse();
    }
}

function move_up_2048(){
    for (let col = 0; col < size_2048_global; col++){
        let arr = [];
        for (let row = 0; row < size_2048_global; row++){
            arr.push(board_2048_global[row][col]);
        }
        arr = slide_combine_slide_2048(arr);
        for (let row = 0; row < size_2048_global; row++){
            board_2048_global[row][col] = arr[row];
        }
    }
}

function move_down_2048(){
    for (let col = 0; col < size_2048_global; col++){
        let arr = [];
        for (let row = 0; row < size_2048_global; row++){
            arr.push(board_2048_global[row][col]);
        }
        arr = arr.slice().reverse();
        arr = slide_combine_slide_2048(arr);
        arr = arr.reverse();
        for (let row = 0; row < size_2048_global; row++){
            board_2048_global[row][col] = arr[row];
        }
    }
}

function keys_2048(cstype){
    if (is_game_over_2048()){return;}

    const prevBoard = JSON.stringify(board_2048_global); // Store previous state to check changes

    switch (cstype){
        case 'ArrowLeft':
            move_left_2048();
            break;
        case 'ArrowRight':
            move_right_2048();
            break;
        case 'ArrowUp':
            move_up_2048();
            break;
        case 'ArrowDown':
            move_down_2048();
            break;
    }

    if (prevBoard !== JSON.stringify(board_2048_global)){ // Check if the board_2048_global has changed
        add_random_tile_2048();
    }
}

function game_over_show_hide_2048(cstype){
    var odiv=document.getElementById('div_game_over');
    if (!odiv){
        var blstr=`<div id="div_game_over" style="display: none; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background-color: rgba(238, 228, 218, 0.8); padding: `+(base_size_2048_global-1)+`vw; border-radius: `+(base_size_2048_global-2)+`vw; text-align: center;">
<p style="font-size: `+(base_size_2048_global+0.5)+`vw; color: #776e65;">Game Over!</p>
<button onclick="init_2048();" style="padding: `+(base_size_2048_global-1)+`vw `+(base_size_2048_global-1)+`vw; font-size: `+base_size_2048_global+`vw; color: #f9f6f2; background-color: #8f7a66; border: none; border-radius: .5vw; cursor: pointer;" onmouseover="this.style.backgroundColor=\'#9e8b77\';" onmouseout="this.style.backgroundColor=\'#8f7a66\';">Restart</button>
</div>`;
        var ocontainer=document.getElementById('div_grid');
        ocontainer.insertAdjacentHTML('afterend',blstr);
        odiv=document.getElementById('div_game_over');
    }

    if (odiv){
        odiv.style.display=cstype;
    }
}
