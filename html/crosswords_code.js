function init_klcw(){
    clicked_td_klcw_global=false;
    
    var input_list=[
    ['input_count_klcw',5,0.5],
    ['input_w_klcw',5,0.5],
    ['input_h_klcw',5,0.5],
    ['input_leak_klcw',5,0.5],

    ];
    input_size_b(input_list,'id');
    top_bottom_arrow_b('div_top_bottom','',false,(ismobile_b()?'1.8rem':'1.6rem'),true,false,2);
    character_2_icon_b('⚔');    
    test_words_klcw_global=simple_words_b(false,false,false,true);
}

function menu_klcw(){
    var str_t=klmenu_hide_b('');
    var klmenu1=[
    enwords_mini_menu_item_b(str_t),
    ];

    document.getElementById('span_title').insertAdjacentHTML('beforebegin',klmenu_multi_button_div_b(klmenu_b(klmenu1,'⚔','8rem','1rem','1rem','30rem'),'','0rem')+' ');
}

function print_klcw(cstype){
    if (typeof result_klcw_global == 'undefined'){return;}
    
    if (cstype=='textarea'){
        var csarr=array_find_replace_b(result_klcw_global.grid,' ','.');
    } else {
        var csarr=result_klcw_global.grid;
    }

    let leak_percent=parseFloat(document.getElementById('input_leak_klcw').value.trim());

    var mask_list=[];
    if (leak_percent>0){
        for (let arow of csarr){
            let new_row=[];
            for (let acol of arow){
                if (Math.random()<=leak_percent && acol.match(/^[A-Z]$/)){
                    new_row.push('?');
                } else {
                    new_row.push(acol);
                }
            }
            mask_list.push(new_row);
        }
    } else {
        mask_list=csarr;
    }
                
    let result_t=[];
    let bljg='';
    switch (cstype){
        case 'textarea':
            for (let arow of mask_list){
                result_t.push(arow.join(' '));
            }
            bljg='<textarea style="height:'+(result_t.length*1.2)+'rem;">'+result_t.join('\n')+'</textarea>';
            break;
        case 'table':
            for (let arow of mask_list){
                result_t.push('<tr><td>'+arow.join('</td><td>')+'</td></tr>');
            }
            bljg='<table id="table_content_klcw" cellspacing=0>'+result_t.join('\n')+'</table>';
            break;
    }
    document.getElementById('divhtml').innerHTML=bljg;
    td_style_klcw();
    unused_klcw();
    
    console.log(result_klcw_global);
    document.getElementById('span_count').innerText='候选单词：'+result_klcw_global.total_words+'个，放入：'+result_klcw_global.placed_count+'个，成功率：'+result_klcw_global.success_rate.toFixed(1)+'%'+(result_klcw_global.grid.length>0?'；实际宽高：'+result_klcw_global.grid.length+'x'+result_klcw_global.grid[0].length:'');    
}

function td_style_klcw(){
    var otds=document.querySelectorAll('#table_content_klcw td');

    for (let one_td of otds){
        one_td.setAttribute('align','center');
        if (one_td.innerText=='?'){
            one_td.style.color=scheme_global['a-hover'];
            one_td.setAttribute('class','td_character_klcw');
            one_td.style.cursor='pointer';
            one_td.addEventListener('click',
                function(e){
                    td_click_klcw(this);
                },false
            );                       
        } else if (one_td.innerText.trim()==''){
            one_td.style.color='';     
        } else {
            one_td.style.color=scheme_global['a'];
            one_td.setAttribute('class','td_character_klcw');
        }
    }
}

function td_click_klcw(otd){
    if (otd.style.backgroundColor==''){
        if (clicked_td_klcw_global){
            clicked_td_klcw_global.style.backgroundColor='';
        }
        
        clicked_td_klcw_global=otd;
        otd.style.backgroundColor=scheme_global['skyblue'];
    } else {
        otd.style.backgroundColor='';
        clicked_td_klcw_global=false;
    }
}

function choose_klcw(ochar){
    if (!clicked_td_klcw_global){return;}
    clicked_td_klcw_global.innerText=ochar.innerText;
    unused_klcw();
}

function unused_klcw(){
    for (let key in character_used_dict_klcw_global){
        character_used_dict_klcw_global[key]=0;
    }
    var otable=document.getElementById('table_content_klcw');
    
    var otds=otable.querySelectorAll('td.td_character_klcw');
    for (let one_td of otds){
        let char_name='c_'+one_td.innerText;
        character_used_dict_klcw_global[char_name]=character_used_dict_klcw_global[char_name]+1;
    }
    
    var left_list=[];
    for (let key in character_used_dict_klcw_global){
        let blminus=character_all_dict_klcw_global[key]-character_used_dict_klcw_global[key];
        if (key=='c_?'){
            blminus=-1*blminus;
        }
        if (blminus!==0){
            left_list.push('<span class="oblong_box" onclick="choose_klcw(this);">'+key.slice(2,)+'</span> <b>'+blminus+'</b>');
        }
    }
    
    var ostatus=document.getElementById('div_status');
    ostatus.innerHTML='<p style="margin:0.5rem 0;">可用字母数量：'+left_list.join(' | ')+'</p>';
    mouseover_mouseout_oblong_span_b(ostatus.querySelectorAll('span.oblong_box'));
}

function generate_klcw(cstype='table'){
    let cscount=parseInt(document.getElementById('input_count_klcw').value.trim());
    let csw=parseInt(document.getElementById('input_w_klcw').value.trim());
    let csh=parseInt(document.getElementById('input_h_klcw').value.trim());
    
    test_words_klcw_global.sort(randomsort_b);
    result_klcw_global=crosswords_b(test_words_klcw_global.slice(0,cscount),csw,csh,true,false);
    result_klcw_global.grid=arrary_remove_empty_rows_columns_b(result_klcw_global.grid,' ');
    character_count_klcw();
    
    print_klcw(cstype);
}

function character_count_klcw(){
    character_list_klcw_global=[];
    character_count_klcw_global=0;
    character_all_dict_klcw_global={'c_?':0};
    character_used_dict_klcw_global={'c_?':0};
    var a2z=characters_b('A');
    for (let achar of a2z){
        character_all_dict_klcw_global['c_'+achar]=0;
        character_used_dict_klcw_global['c_'+achar]=0;
    }
            
    for (let arow of result_klcw_global.placed_words){
        character_list_klcw_global.push(arow['word']);
        character_count_klcw_global=character_count_klcw_global+arow['word'].length;
        for (let achar of arow['word']){
            character_all_dict_klcw_global['c_'+achar]=character_all_dict_klcw_global['c_'+achar]+1;
        }
    }
    //console.log(character_list_klcw_global,character_count_klcw_global,character_all_dict_klcw_global);   //此行保留 - 保留注释
}
