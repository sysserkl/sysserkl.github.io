function insert_claculator(csstr){
    var oinput=document.getElementById('input_calc');
    dom_insert_str_b(oinput,'',csstr);
    oinput.focus();
}

function local_storage_get_calculator(do_split=false){
    var list_t=local_storage_get_b('kl_calculator_item',100,true);
    if (do_split==false){
        return list_t;
    }
    
    var result_t=[];
    for (let blxl=0,lent=list_t.length;blxl<lent;blxl++){
        list_t[blxl]=list_t[blxl].split(' /// ');
        if (list_t[blxl].length!==3){continue;}
        result_t.push(list_t[blxl]);
    }
    return result_t;
}

function local_storage_set_calculator(cslist){
    localStorage.setItem('kl_calculator_item',cslist.join('\n'));
}

function init_calculator(){
    top_bottom_arrow_b('div_top_bottom','',false,(ismobile_b()?'1.8rem':'1.6rem'));
    input_with_x_b('input_calc',(ismobile_b()?15:40),'',false);
    menu_calculator();
    old_data_calculator();
    
    var list_t=['*','(',')'];   //插入符号 - 保留注释
    var bljg='';
    for (let item of list_t){
        bljg=bljg+'<span class="oblong_box" onclick="insert_claculator(\''+item+'\');">'+item+'</span> ';
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

function help_calculator(){
    var blvalue;
    var blinfo='';
    var list_t=[
    '30>20?"ok":"error"',
    '3+4 //memo',
    '[-99,"bad",45].length //array length',
    'days_between_two_dates_b("2020-12-31","2021-12-31") //日期间天数相差',
    'document.body.getBoundingClientRect().height',
    'document.body.offsetHeight',
    'document.querySelector("ol").style.cssText',
    '"dog".length //string length',
    'hex2rgb_b("#ff0000",true)',
    'let a=3;let b=4;a+b',
    'location.href',
    'Math.max(3,45,6)',
    'Math.random() //random number',
    'Math.sin(1)',
    'navigator.userAgent',
    'new Date().getFullYear() //year',
    'next_day_b("",1) //tomorrow',
    'next_day_b("2020-08-16",1) //the day after 2020-08-16',
    'now_time_str_b()',
    'previous_day_b("",1) //1天之前',
    'previous_day_b("2020-08-16",1) //the day before 2020-08-16',    
    'rgb2hex_b(0,0,255)',
    'String.fromCodePoint(Math.round(Math.random()*20901+19968)) //随机汉字',

    ];
    for (let blxl=0,lent=list_t.length;blxl<lent;blxl++){
        var bltime=now_time_str_b(':',true);
        var blemoji=emoji_category_b('vegetable',blxl);
        [blvalue,blinfo]=value_calculator(list_t[blxl]);
        
        list_t[blxl]=show_row_calculator(blemoji,list_t[blxl],blvalue,bltime,true);
    }
    document.getElementById('ol_calc').innerHTML='<li>'+list_t.join('</li><li>')+'</li>';
}

function filter_calculator(){
    var blkey=prompt('输入筛选关键字：') || '';
    if (blkey==''){return;}
    var olis=document.querySelectorAll('ol#ol_calc li');
    var isreg=klmenu_check_b('span_reg_calculator',false);
    obj_search_show_hide_b(olis,'',blkey,isreg,true);
}

function decimal_len_set(){
    var ospan=document.getElementById('span_decimal_len');
    var blkey=prompt('input decimal length: ',decimal_length_global);
    if (blkey==null){return;}
    blkey=parseInt(blkey.trim());
    if (isNaN(blkey) || blkey==decimal_length_global || blkey<0){return;}
    decimal_length_global=blkey;
    ospan.innerHTML='decimal length: '+decimal_length_global;
}

function delete_calculator(){
    var olis=document.querySelectorAll('ol#ol_calc li');
    var blcount=0;
    for (let item of olis){
        if (item.style.display=='none'){continue;}
        blcount=blcount+1;
    }
    if (blcount==0){return;}
    var rndstr=randstr_b(4,true,false);
    if ((prompt('输入 '+rndstr+' 确认清空当前显示的'+blcount+'条记录') || '').trim()!==rndstr){return;}    
    
    var list_t=local_storage_get_calculator();
 
    var blxl=0;
    for (let item of olis){
        if (item.style.display=='none'){continue;}
        var oemoji=item.querySelector('span.span_emoji_calculator');
        var ostr=item.querySelector('span.span_string_calculator');
        var otime=item.querySelector('span.span_time_calculator');
        if (!oemoji ||!ostr || !otime){continue;}
        var blvalue=[oemoji.innerText,ostr.innerText,otime.innerText].join(' /// ');
        var blat=list_t.indexOf(blvalue);
        if (blat>=0){
            list_t.splice(blat,1);
            blxl=blxl+1;
        }
    }
    
    alert('deleted '+blxl+' items');
    if (blxl>0){
        local_storage_set_calculator(list_t);
        old_data_calculator();
    }
}

function menu_calculator(){
    var str_t=klmenu_hide_b('');
    var klmenu1=[
    '<span class="span_menu" onclick="'+str_t+'portion_calculator(\'show_selected\');">show selected items</span>',
    '<span class="span_menu" onclick="'+str_t+'portion_calculator(\'show_unselected\');">show not selected items</span>',
    '<span class="span_menu" onclick="'+str_t+'portion_calculator(\'all\');">show all</span>',
    '<span class="span_menu" onclick="'+str_t+'filter_calculator();">filter</span>',   
    '<span class="span_menu" onclick="'+str_t+'delete_calculator();">delete current items</span>',       
    '<span class="span_menu" onclick="'+str_t+'old_data_calculator();">reload</span>',    
    ];

    var klmenu2=[
    '<span id="span_reg_calculator" class="span_menu" onclick="'+str_t+'klmenu_check_b(this.id,true);">⚪ reg</span>',
    '<span id="span_value_calculator" class="span_menu" onclick="'+str_t+'klmenu_check_b(this.id,true);">⚪ 表达式2数值</span>',        
    '<span id="span_decimal_len" class="span_menu" onclick="'+str_t+'decimal_len_set();">decimal length: '+decimal_length_global+'</span>',        
    '<span class="span_menu" onclick="'+str_t+'help_calculator();">help</span>',    
    '<span class="span_menu" onclick="'+str_t+'service_worker_delete_b(\'calculator\');">update</span>',        
    ];

    document.getElementById('span_title').insertAdjacentHTML('beforebegin',klmenu_multi_button_div_b(klmenu_b(klmenu1,'➕','15rem','1rem','1rem','60rem')+klmenu_b(klmenu2,'➖','12rem','1rem','1rem','60rem'),'','0rem')+' ');
    klmenu_check_b('span_reg_calculator',true);
    klmenu_check_b('span_value_calculator',true);    
}

function old_data_calculator(){
    line_no_calc_global=0;
    var list_t=local_storage_get_calculator(true);
    var result_t=[];
    for (let arow of list_t){   //emoji,csstr,cstime - 保留注释
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
    if (csstr.substring(0,2)=='//'){
        return ['',''];  //注释不计算 - 保留注释
    }
    var check_list=['var','eval','localStorage','return','break','for','while','{','}','window','if','else','switch','continue','inner','outer','class','getElement','alert','prompt','confirm','function','try','catch','script','///'];
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
    } catch (error){
        return [false,error];
    }
}

function eval_calculator(){
    var oinput=document.getElementById('input_calc');
    var str_t=oinput.value.trim();
    var blat=str_t.indexOf('//');
    if (blat>=0){
        str_t=str_t.substring(0,blat)+quote_2_cn_character_b(str_t.substring(blat,));
    }
    var ospan=document.getElementById('span_status');
    var blvalue=false;
    var binfo='';
    [blvalue,blinfo]=value_calculator(str_t);
    ospan.innerHTML=blinfo;
    if (blvalue===false){return;}

    var bltime=now_time_str_b(':',true);
    var blemoji=emoji_category_b('vegetable',line_no_calc_global);

    var bljg=show_row_calculator(blemoji,str_t,blvalue,bltime);
    
    if (klmenu_check_b('span_value_calculator',false)){
        oinput.value=blvalue;
    }
    line_no_calc_global=line_no_calc_global+1;
    var ool=document.getElementById('ol_calc');    
    ool.insertAdjacentHTML('afterbegin','<li>'+bljg+'</li>');
    
    var list_t=local_storage_get_calculator();
    list_t=[blemoji+' /// '+str_t+' /// '+bltime].concat(list_t);
    local_storage_set_calculator(list_t);
}

function show_row_calculator(csemoji,csstr,csvalue,cstime,to_cn=false){
    var blat=csstr.indexOf('//');
    if (blat>=0){
        var blleft=csstr.substring(0,blat);
        var blright=csstr.substring(blat,);
        if (to_cn){
            blright=quote_2_cn_character_b(blright);
        }
        csstr=blleft+'<span style="'+(blat==0?'':'color:'+scheme_global['memo']+';')+'font-size:0.9rem;">'+blright+'</span>';
    }
    var bljg='<span class="span_emoji_calculator">'+csemoji+'</span> <span class="span_box span_string_calculator" onclick="select_row_calculator(this);" ondblclick="dbl_calculator(this);">'+csstr+'</span>';
    if (csvalue!==''){
        bljg=bljg+' = <strong>'+csvalue+'</strong>';
    }
    bljg=bljg+' <small><small>'+time_2_emoji_b(cstime)+' <span class="span_time_calculator" style="color:'+scheme_global['memo']+';">'+cstime+'</span></small></small>';
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
        bllen=decimal_length_global;
    }
    return bllen;
}

function dbl_calculator(ospan){
    try {
        var oinput=document.getElementById('input_calc');
        oinput.value=ospan.innerText;
        oinput.scrollIntoView();
    } catch (error){
        document.getElementById('span_status').innerHTML=error;
    }
}
