function more_symbols(ospan){
    var blid=ospan.id.substring(5,);
    if (blid in symbols_global){
        ospan.parentNode.innerHTML='<div style="'+divstyle_global+'">'+symbols_global[blid].join('</div><div style="'+divstyle_global+'">')+'</div>';
    }
}

function show_symbols(cstype='simple'){
    var bljg='';
    divstyle_global='display:inline-block;padding:0.2rem;margin:0.2rem;border:0.1rem grey dotted;border-radius:0.5rem;';
    for (let blkey in symbols_global){
        bljg=bljg+'<div style="positon:relative;float:left;border:0.1rem grey dotted;border-radius:0.5rem;margin:0.5rem;padding:0.5rem;font-size:2rem;word-break:break-all;word-wrap:break-word;line-height:180%;">';
        if (cstype=='simple' && symbols_global[blkey].length>8){
            bljg=bljg+'<div style="'+divstyle_global+'">'+symbols_global[blkey].slice(0,4).join('</div><div style="'+divstyle_global+'">')+'</div>';
            bljg=bljg+' <span id="span_'+blkey+'" style="cursor:pointer;" onclick="more_symbols(this);">...</span> ';
            bljg=bljg+'<div style="'+divstyle_global+'">'+symbols_global[blkey].slice(-4,).join('</div><div style="'+divstyle_global+'">')+'</div>';
        }
        else {
            bljg=bljg+'<div style="'+divstyle_global+'">'+symbols_global[blkey].join('</div><div style="'+divstyle_global+'">')+'</div>';
        }
        
        bljg=bljg+'</div>';
    }
    document.getElementById('divhtml').innerHTML=bljg;
}

function init_symbols(){
    top_bottom_arrow_b('div_top_bottom','',false,(ismobile_b()?'1.6rem':'1.6rem'));
    show_symbols();
    menu_symbols();
}

function menu_symbols(){
    var str_t=klmenu_hide_b('');
    var klmenu1=[
    '<span class="span_menu" onclick="'+str_t+'show_symbols(\'all\');">全部展开</span>',
    ];

    document.getElementById('h3_title').insertAdjacentHTML('afterbegin',klmenu_multi_button_div_b(klmenu_b(klmenu1,'🔣','14rem','1rem','1rem','60rem'),'','0rem')+' ');
}
