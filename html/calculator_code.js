function insert_claculator(csstr){
    var oinput=document.getElementById('input_calc');
    oinput.value=oinput.value+csstr;
    oinput.focus();
}

function get_local_storage_calculator(){
    return local_storage_get_b('kl_calculator_item',100,true);
}

function init_calculator(){
    top_bottom_arrow_b('div_top_bottom','',false,(ismobile_b()?'1.8rem':'1.6rem'));
    input_with_x_b('input_calc',15,'',false);
    menu_calculator();
    old_data_calculator();
    
    var list_t=['*','(',')'];   //插入符号 - 保留注释
    var bljg='';
    for (let item of list_t){
        bljg=bljg+'<span class="oblong_box" onclick="javascript:insert_claculator(\''+item+'\');">'+item+'</span> ';
    }
    document.getElementById('span_status').insertAdjacentHTML('beforebegin',' '+bljg);
    mouseover_mouseout_oblong_span_b(document.querySelectorAll('div#div_form span.oblong_box'));
}

function portion_calculator(cstype='all'){
    var olis=document.querySelectorAll('ol#ol_calc li');    
    var blcolor=hex2rgb_b(scheme_global['pink'],true);
    switch(cstype){
        case '':
        case 'all':
            for (let one_ol of olis){
                one_ol.style.display='';
            }
            break;
        case 'show_selected':
            for (let one_ol of olis){
                one_ol.style.display=(one_ol.querySelector("span[class='span_box span_string_calculator']").style.backgroundColor==blcolor?'':'none');
            }
            break;
        case 'show_unselected':
            for (let one_ol of olis){
                one_ol.style.display=(one_ol.querySelector("span[class='span_box span_string_calculator']").style.backgroundColor==blcolor?'none':'');
            }
            break;
    }
}

function menu_calculator(){
    var str_t=klmenu_hide_b('');
    var klmenu1=[
    '<span class="span_menu" onclick="javascript:'+str_t+'portion_calculator(\'show_selected\');">显示选中项</span>',
    '<span class="span_menu" onclick="javascript:'+str_t+'portion_calculator(\'show_unselected\');">显示未选中项</span>',
    '<span class="span_menu" onclick="javascript:'+str_t+'portion_calculator(\'all\');">全部显示</span>',
    ];

    var klmenu2=[
    '<span class="span_menu" onclick="javascript:'+str_t+'if (confirm(\'是否更新版本？\')){service_worker_delete_b(\'calculator\');}">更新版本</span>',        
    ];

    document.getElementById('span_title').insertAdjacentHTML('beforebegin',klmenu_multi_button_div_b(klmenu_b(klmenu1,'➕','10rem','1rem','1rem','60rem')+klmenu_b(klmenu2,'➖','8rem','1rem','1rem','60rem'),'','0rem')+' ');
}

function old_data_calculator(){
    line_no_calc_global=0;
    var list_t=get_local_storage_calculator();
    var result_t=[];
    for (let item of list_t){
        if (item=='' || !item.includes(' /// ')){continue;}

        var arow=item.trim().split(' /// ');    //emoji,csstr,cstime - 保留注释
        if (arow.length!==3){continue;}
        var blvalue=false;
        var binfo='';
        [blvalue,blinfo]=value_calculator(arow[1]);
        if (blvalue===false){continue;}     
        result_t.push('<li>'+show_row_calculator(arow[0],arow[1],blvalue,arow[2])+'</li>');

        line_no_calc_global=line_no_calc_global+1;
    }
    document.getElementById('ol_calc').innerHTML=result_t.join('\n');
}

function select_row_calculator(ospan){
    ospan.style.backgroundColor=(ospan.style.backgroundColor==''?scheme_global['pink']:'');
}

function value_calculator(csstr){
    if (csstr==''){
        return [false,'未输入数学表达式'];        
    }
    if (csstr.match(/^\d+\.?(\d+)?$/g)!==null){
        return [csstr,''];  //纯数字不计算 - 保留注释
    }
    var check_list=['let','var','eval','=','localStorage','return','break','for','while','{','}','[',']','document','window','if','else','switch','continue','inner','outer','style','class','id','getElement','alert','prompt','confirm','function','try','catch','script','///'];
    for (let item of check_list){
        if (csstr.includes(item)){
            return [false,'包含了多余字符：'+item];
        }
    }
    try {
        var bllen=decimal_len_calculator(csstr);
        var blvalue=eval(csstr);
        if (bllen>0 && !isNaN(blvalue)){
            return [blvalue.toFixed(bllen),''];
        }
        return [blvalue,''];
    }
    catch (error) {
        return [false,error];
    }
}

function eval_calculator(){
    var oinput=document.getElementById('input_calc');
    var str_t=oinput.value.trim();
    var ospan=document.getElementById('span_status');
    var blvalue=false;
    var binfo='';
    [blvalue,blinfo]=value_calculator(str_t);
    ospan.innerHTML=blinfo;
    if (blvalue===false){return;}

    var bltime=now_time_str_b(':',true);
    var blemoji=emoji_category_b('vegetable',line_no_calc_global);

    var bljg=show_row_calculator(blemoji,str_t,blvalue,bltime);
    
    oinput.value=blvalue;
    
    line_no_calc_global=line_no_calc_global+1;
    var ool=document.getElementById('ol_calc');    
    ool.insertAdjacentHTML('afterbegin','<li>'+bljg+'</li>');
    
    var list_t=get_local_storage_calculator();
    list_t=[blemoji+' /// '+str_t+' /// '+bltime].concat(list_t);
    localStorage.setItem('kl_calculator_item',list_t.join('\n'));
}

function show_row_calculator(csemoji,csstr,csvalue,cstime){
    var bljg=csemoji+' <span class="span_box span_string_calculator" onclick="javascript:select_row_calculator(this);" ondblclick="javascript:dbl_calculator(this);">'+csstr+'</span>';
    bljg=bljg+' = <strong>'+csvalue+'</strong>';
    bljg=bljg+' <small><small>'+time_2_emoji_b(cstime)+' <span style="color:'+scheme_global['memo']+';">'+cstime+'</span></small></small>';
    return bljg;
}

function decimal_len_calculator(csstr){
    var bldecimal=csstr.match(/\.\d+/g) || [''];
    var bllen=0;
    for (let item of bldecimal){
        if (item==''){continue;}
        bllen=Math.max(bllen,item.length-1);
    }
    if (bllen==0 && csstr.includes('/')){
        bllen=3;
    }
    return bllen;
}

function dbl_calculator(ospan){
    try{
        document.getElementById('input_calc').value=ospan.innerText;
    }
    catch (error){
        document.getElementById('span_status').innerHTML=error;
    }
}
