function more_symbols(ospan){
    var blid=ospan.id.substring(5,);
    if (blid in symbols_global){
        var oparent=ospan.parentNode;   //先定义，不然失去 ospan 后，无法获得 ospan.parentNode - 保留注释
        oparent.innerHTML=symbol_div_left_global+symbols_global[blid].join('</div>'+symbol_div_left_global)+'</div>';
        
        cursor_change_symbols(false,oparent.querySelectorAll('div.div_one_symbol'));
    }
}

function show_symbols(cstype='simple'){
    var div_style='positon:relative;float:left;border:0.1rem '+scheme_global['memo']+' dotted;border-radius:0.5rem;margin:0.5rem;padding:0.5rem;font-size:2rem;word-break:break-all;word-wrap:break-word;line-height:180%;';
    var bljg='';
    for (let blkey in symbols_global){
        bljg=bljg+'<div style="'+div_style+'">';
        if (cstype=='simple' && symbols_global[blkey].length>8){
            bljg=bljg+symbol_div_left_global+symbols_global[blkey].slice(0,4).join('</div>'+symbol_div_left_global)+'</div>';
            bljg=bljg+' <span id="span_'+blkey+'" style="cursor:pointer;" onclick="more_symbols(this);">...</span> ';
            bljg=bljg+symbol_div_left_global+symbols_global[blkey].slice(-4,).join('</div>'+symbol_div_left_global)+'</div>';
        } else {
            bljg=bljg+symbol_div_left_global+symbols_global[blkey].join('</div>'+symbol_div_left_global)+'</div>';
        }

        bljg=bljg+'</div>';
    }
    document.getElementById('divhtml').innerHTML=bljg;
}

function init_symbols(){
    divstyle_global='display:inline-block;padding:0.2rem;margin:0.2rem;border:0.1rem '+scheme_global['memo']+' dotted;border-radius:0.5rem;';
    symbol_div_left_global='<div class="div_one_symbol" style="'+divstyle_global+'" onclick="copy_or_not_symbols(this);">';

    top_bottom_arrow_b('div_top_bottom','',false,(ismobile_b()?'1.6rem':'1.6rem'));
    show_symbols();
    menu_symbols();
}

function cursor_change_symbols(do_change=false,odoms=false){
    klmenu_check_b('span_enable_copy',do_change);
    var cursor_str=(klmenu_check_b('span_enable_copy',false)===true?'pointer':'');
    if (odoms===false){
        odoms=document.querySelectorAll('div.div_one_symbol');
    }
    for (let one_dom of odoms){
        one_dom.style.cursor=cursor_str;
    }
    console.log('操作了',odoms.length,'个对象');
}

function menu_symbols(){
    var str_t=klmenu_hide_b('');
    var klmenu1=[
    '<span id="span_enable_copy" class="span_menu" onclick="'+str_t+'cursor_change_symbols(true);">⚪ 点击即复制</span>',
    '<span class="span_menu" onclick="'+str_t+'show_symbols(\'all\');">全部展开</span>',
    ];

    document.getElementById('h3_title').insertAdjacentHTML('afterbegin',klmenu_multi_button_div_b(klmenu_b(klmenu1,'🔣','10rem','1rem','1rem','60rem'),'','0rem')+' ');
}

function copy_or_not_symbols(odiv){
    if (klmenu_check_b('span_enable_copy',false)){
        copy_2_clipboard_b(odiv.innerText,true);
    }
}
