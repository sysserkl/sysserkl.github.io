function drop_tetris(){
    let now = Date.now();
    let delta = now - dropStart_global;
    if (delta > 1000){
        moveDown_tetris();
        dropStart_global = Date.now();
    }
    if (!gameOver_global){
        requestAnimationFrame(drop_tetris);
    }
}

function moveDown_tetris(){
    if (!collision_tetris(0,1,current_brick_pattern_global)){
        piecefill_tetris(background_color_global);
        position_y_global++;
        piecefill_tetris(current_brick_color_global);
        return true;
    }

    //piecelock
    for (let r = 0,lent= current_brick_pattern_global.length; r <lent; r++){
        for (let c = 0,lenb= current_brick_pattern_global.length; c <lenb; c++){
            // we skip the background_color_global square_size_globaluares
            if (!current_brick_pattern_global[r][c]){continue;}
            // pieces to lock on top = game over
            if (position_y_global + r < 0){
                alert('Game Over');
                // stop request animation frame
                gameOver_global = true;
                break;
            }
            // we lock the piece
            board_current_global[position_y_global+r][position_x_global+c] = current_brick_color_global;
        }
        if (gameOver_global){break;}
    }
    
    // remove full rows_globals
    var full_row_count=0;
    for (let the_full_row = 0; the_full_row < rows_global; the_full_row++){
        let isrows_globalFull = true;
        for (let c = 0; c < cols_global; c++){
            //isrows_globalFull = isrows_globalFull && (board[r][c] != background_color_global);
            if (board_current_global[the_full_row][c] == background_color_global){
                isrows_globalFull=false;
                break;
            }
        }
        
        if (!isrows_globalFull){continue;}
        
        full_row_count=full_row_count+1;
        // if the rows_global is full
        // we move down all the rows_globals above it
        for (let arow = the_full_row; arow > 1; arow--){
            for (let acol = 0; acol < cols_global; acol++){
                board_current_global[arow][acol] = board_current_global[arow-1][acol];
            }
        }
        
        // the top rows_global board[0][..] has no rows_global above it
        for (let acol = 0; acol < cols_global; acol++){
            board_current_global[0][acol] = background_color_global;
        }
        // increment the score
    }
    if (full_row_count>0){
        score_global = score_global + Math.floor(cols_global*(full_row_count+(full_row_count-1)*0.5));
    }
    // update the board
    randomPiece_tetris();
    
    // update the score
    document.getElementById('span_score').innerHTML = 'Score : '+score_global;
    return false;
}

// generate random pieces
function randomPiece_tetris(){
    //draw board
    var ctx_current = document.getElementById('tetris_current').getContext('2d');    
    for (let r = 0; r <rows_global; r++){
        for (let c = 0; c < cols_global; c++){
            drawsquare_tetris(ctx_current,c,r,board_current_global[r][c]);
        }
    }
    //---
    pattern_list_generator_tetris();
    
    var first_pattern=pattern_list_global.shift();
    current_brick_list_global = first_pattern[0];
    current_brick_no_global = first_pattern[1];
    current_brick_pattern_global = current_brick_list_global[current_brick_no_global];
    current_brick_color_global=first_pattern[2];    

    draw_board_next_tetris();
    
    position_x_global = Math.floor(cols_global/2);
    position_y_global = -2;
}

function draw_board_next_tetris(){
    var list_t=[];
    
    for (let r=0,lent=board_next_global.length;r<lent;r++){
        for (let c=0,lenb=board_next_global[0].length;c<lenb;c++){
            board_next_global[r][c]=background_color_global;
        }
    }
    
    for (let blxl=0;blxl<3;blxl++){
        var one_pattern=pattern_list_global[blxl];

        var piece4 = one_pattern[0];
        var piece4_no = one_pattern[1];
        var current_piece = piece4[piece4_no];
        var thecolor=one_pattern[2];    
    
        for (let r=0,lent=current_piece.length;r<lent;r++){
            for (let c=0,lenb=current_piece.length;c<lenb;c++){
                if (current_piece[r][c]==0){
                    board_next_global[r+blxl*5][c]=background_color_global;
                } else {
                    board_next_global[r+blxl*5][c]=thecolor;
                }
            }
        }
    }

    var ctx_next = document.getElementById('tetris_next').getContext('2d');    
    for (let r=0,lent=board_next_global.length;r<lent;r++){
        for (let c=0,lenb=board_next_global[0].length;c<lenb;c++){
            drawsquare_tetris(ctx_next,c,r,board_next_global[r][c]);
        }
    }
}

function piecefill_tetris(cscolor){
    var ctx_current = document.getElementById('tetris_current').getContext('2d');
    for (let r = 0,lent= current_brick_pattern_global.length; r <lent; r++){
        for (let c = 0,lenb= current_brick_pattern_global.length; c <lenb; c++){
            // we draw only occupied square_size_globaluares
            if ( current_brick_pattern_global[r][c]){
                drawsquare_tetris(ctx_current,position_x_global + c,position_y_global + r, cscolor);
            }
        }
    }
}

function collision_tetris(x,y,piece){
    for (let r = 0,lent= piece.length; r <lent; r++){
        for (let c = 0,lenb= piece.length; c <lenb; c++){
            // if the square_size_globaluare is 0(empty), we skip it.
            if (!piece[r][c]){continue;}
            // coordinates of the piece after movement
            let newX = position_x_global + c + x;
            let newY = position_y_global + r + y;
            
            // conditions
            if (newX < 0 || newX >= cols_global || newY >= rows_global){
                return true;
            }
            // skip newY < 0; board[-1] will crush our game
            if (newY < 0){continue;}
            // check if there is a locked piece alrady in place
            if (board_current_global[newY][newX] != background_color_global){
                return true;
            }
        }
    }
    return false;
}
    
function key_control_tetris(event){
    return move_brick_tetris(event.keyCode);
}

function move_brick_tetris(cstype){
    var blstat=false;
    if (cstype == 37){
        //moveLeft
        if (!collision_tetris(-1,0,current_brick_pattern_global)){
            piecefill_tetris(background_color_global);
            position_x_global--;
            piecefill_tetris(current_brick_color_global);
            blstat=true;
        }
        dropStart_global = Date.now();
    } else if (cstype == 38){
        //rotate
        let nextPattern = current_brick_list_global[(current_brick_no_global + 1)%current_brick_list_global.length];
        let kick = 0;
        
        if (collision_tetris(0,0,nextPattern)){
            if (position_x_global > cols_global/2){
                // it's the right wall
                kick = -1; // we need to move the piece to the left
            } else {
                // it's the left wall
                kick = 1; // we need to move the piece to the right
            }
        }
        
        if (!collision_tetris(kick,0,nextPattern)){
            piecefill_tetris(background_color_global);
            position_x_global += kick;
            current_brick_no_global = (current_brick_no_global + 1)%current_brick_list_global.length; // (0+1)%4 => 1
            current_brick_pattern_global = current_brick_list_global[current_brick_no_global];
            piecefill_tetris(current_brick_color_global);
        }
                
        dropStart_global = Date.now();
    } else if (cstype == 39){
        //moveRight
        if (!collision_tetris(1,0,current_brick_pattern_global)){
            piecefill_tetris(background_color_global);
            position_x_global++;
            piecefill_tetris(current_brick_color_global);
            blstat=true;
        }
            
        dropStart_global = Date.now();
    } else if (cstype == 40){
        moveDown_tetris();
    } else if (cstype == 'bottom'){
        while (moveDown_tetris()){}
    } else if (cstype == 'leftmost'){
        while (move_brick_tetris(37)){}
    } else if (cstype == 'rightmost'){
        while (move_brick_tetris(39)){}
    }    
    return blstat;
}

// draw a square_size_globaluare
function drawsquare_tetris(canvasobj,x,y,cscolor){
    canvasobj.fillStyle = cscolor;
    canvasobj.fillRect(x*square_size_global,y*square_size_global,square_size_global,square_size_global);

    canvasobj.strokeStyle = 'black';
    canvasobj.strokeRect(x*square_size_global,y*square_size_global,square_size_global,square_size_global);
}

function piece_4_patterns_tetris(cslist){
    function sub_piece_4_patterns_tetris_1(cslist){
        var rows=cslist.length;
        var cols=cslist[0].length;
        var list_t=[];
        for (let blxl=0; blxl<cols;blxl++){
            var new_row=[];
            var blxl2=rows-1;
            while (blxl2>=0){
                new_row.push(cslist[blxl2][blxl]);
                blxl2=blxl2-1;
            }
            list_t.push(new_row);
        }
        return list_t;
    }
    var list1=sub_piece_4_patterns_tetris_1(cslist);
    var list2=sub_piece_4_patterns_tetris_1(list1);
    var list3=sub_piece_4_patterns_tetris_1(list2);
    return [cslist,list1,list2,list3];
}

function array_mirror_tetris(cslist){
    var list_t=[];
    for (let item of cslist){
        var new_row=item.reverse();
        list_t.push(new_row);
    }
    return list_t;
}

function pattern_list_generator_tetris(){
    if (pattern_list_global.length>=10){return;}
    function sub_pattern_list_generator_tetris_one(){
        if (random_value_tetris()>0.5){
            if (false_random_key_global===false){
                piece_types_global.sort(randomsort_b);
                var sort_key=0;
            } else {
                var sort_key=Math.round(10*random_value_tetris())%piece_types_global.length;
            }
            switch (piece_types_global[sort_key]){
                case "I":
                    var selected_brick = [
                    [0, 0, 0, 0],
                    [1, 1, 1, 1],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                    ];
                    break;
                case "L":
                    var selected_brick = [
                    [0, 0, 1],
                    [1, 1, 1],
                    [0, 0, 0]
                    ];
                    break;
                case "O":
                    var selected_brick = [
                    [0, 0, 0, 0],
                    [0, 1, 1, 0],
                    [0, 1, 1, 0],
                    [0, 0, 0, 0],
                    ];
                    break;
                case "T":
                    var selected_brick = [
                    [0, 1, 0],
                    [1, 1, 1],
                    [0, 0, 0]
                    ];
                    break;
                case "Z":
                    var selected_brick = [
                    [1, 1, 0],
                    [0, 1, 1],
                    [0, 0, 0]
                    ];
                    break;
            }
        } else {
            var rnd_row_col=Math.max(2,Math.floor(random_value_tetris() * 4));
            var selected_brick =[];
            var count1=0;
            for (let blxl=0;blxl<rnd_row_col;blxl++){
                selected_brick[blxl]=[];
                for (let blxl2=0;blxl2<rnd_row_col;blxl2++){
                    if (random_value_tetris()>0.5){
                        selected_brick[blxl].push(1);
                        count1=count1+1;
                    } else {
                        selected_brick[blxl].push(0);
                    }
                }
            }
            if (count1==0){
                selected_brick[0][0]=1;
            }
        }

        if (random_value_tetris()>0.5){
            selected_brick=array_mirror_tetris(selected_brick);
        }
        
        var piece4 = piece_4_patterns_tetris(selected_brick);
        var piece4_no = Math.floor(random_value_tetris() * piece4.length);
        if (random_value_tetris()>0.5){
            var piece4_color=rnd_margin_color_b();
        } else {
            var piece4_color=rndcolor_light_b(0.4,0.4);
        }
        return [piece4,piece4_no,piece4_color];
    }
    for (let blxl=0;blxl<10;blxl++){
        pattern_list_global.push(sub_pattern_list_generator_tetris_one());
    }
}

function init_tetris(){
    square_size_global = 20;
    rows_global = Math.ceil(window.innerHeight/square_size_global)-10; //20
    cols_global = Math.ceil(window.innerWidth/square_size_global)-6; //10
    background_color_global = 'white';    

    var input_list=[
    ['input_seed_no',4,0.5],
    ];
    input_size_b(input_list,'id');        

    key_used_global=new Set();    
    refresh_tetris();
}

function refresh_tetris(){
    piece_types_global = ['Z', 'T', 'O', 'L', 'I'];

    current_brick_list_global=false;
    current_brick_no_global=false;
    current_brick_pattern_global=false;
    current_brick_color_global=false;
    position_x_global=false;
    position_y_global=false;
        
    score_global = 0;
    document.getElementById('span_score').innerHTML='0';

    canvas_tetris();

    false_random_list_global=[];
    false_random_key_set_tetris();

    pattern_list_global=[];
    // create the board
    board_current_global = [];
    for (let r = 0; r <rows_global; r++){
        board_current_global[r] = [];
        for (let c = 0; c < cols_global; c++){
            board_current_global[r][c] = background_color_global;
        }
    }

    board_next_global = [];
    for (let r = 0; r <(4+1)*3; r++){
        board_next_global[r] = [];
        for (let c = 0; c < 4; c++){
            board_next_global[r][c] = background_color_global;
        }
    }
    
    randomPiece_tetris();

    document.addEventListener('keydown',key_control_tetris);

    // drop the piece every 1sec
    dropStart_global = Date.now();
    gameOver_global = false;

    drop_tetris();
}

function canvas_tetris(){
    document.getElementById('td_canvas_current').innerHTML='<canvas id="tetris_current" width="'+square_size_global*cols_global+'" height="'+square_size_global*rows_global+'"><\/canvas>';
    document.getElementById('td_canvas_next').innerHTML='<canvas id="tetris_next" width="'+square_size_global*4+'" height="'+square_size_global*(4+1)*3+'"><\/canvas>';
}

function random_value_tetris(){
    if (false_random_key_global===false){
        return Math.random();
    }

    if (false_random_list_global.length==0){
        false_random_list_global=random_false_list_b(false_random_key_global);    
        if (!key_used_global.has(false_random_key_global)){
            key_used_global.add(false_random_key_global);        
            var blcount1=0;
            var blcount2=0;
            for (let item of false_random_list_global){
                if (item>0.5){
                    blcount1=blcount1+1;
                } else if (item==0.5){
                    blcount2=blcount2+1;
                }
            }
            console.log('重新生成伪随机列表',false_random_key_global,false_random_list_global.slice(0,20).toString()+'...，其中>0.5占'+blcount1+'个，==0.5占'+blcount2+'个'); //此行保留 - 保留注释
        } else {
            console.log('重新生成伪随机列表',false_random_key_global); //此行保留 - 保留注释            
        }
    }
    return false_random_list_global.shift();
}

function false_random_key_set_tetris(){
    if (document.getElementById('input_seed_checkbox').checked){
        false_random_key_global=parseInt(document.getElementById('input_seed_no').value);
    } else {
        false_random_key_global=false;
        false_random_list_global=[];
    }
}

