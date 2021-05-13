function gb_big5_hzpy(csstr){
    for (let item of zh_tw_global){
        if (item.includes(csstr)){
            return item;
        }
    }
    return '';
}

function definition_hzpy(csstr){
    if (csstr in cnwords_global){
        return csstr+' '+cnwords_global[csstr].join(' ');
    }
    return '';
}

function search_hzpy(csstr=''){
    if (csstr==''){
        csstr=document.getElementById('textarea_search').value.trim();
    }
    document.getElementById('textarea_search').value=csstr;
    if (csstr==''){return;}
    
    recent_search_hzpy(csstr);
    
    var gb_big5_list=[];
    var gb_big5_str='';
    var definition_list=[];
    var definition_str='';
    var bljg=[];
    if (csstr in hz2py_global){
        bljg.push(csstr+' '+hz2py_global[csstr].join(', '));
        gb_big5_str=gb_big5_hzpy(csstr);
        if (gb_big5_str!==''){
            gb_big5_list.push(gb_big5_str);
        }
        definition_str=definition_hzpy(csstr);
        if (definition_str!==''){
            definition_list.push(definition_str);
        }        
    }
    if (csstr in py2hz_global){
        bljg.push(csstr+' '+py2hz_global[csstr].join(', '));
    }
    
    if (bljg=='' && csstr.substring(0,1) in hz2py_global){
        var list_t=csstr.split('');
        for (let item of list_t){
            item=item.trim();
            if (item==''){continue;}
            if (item in hz2py_global){
                bljg.push(one_word_hzpy(item));
            }
        }
        list_t=array_unique_b(list_t);
        for (let item of list_t){
            gb_big5_str=gb_big5_hzpy(item);
            if (gb_big5_str!==''){
                gb_big5_list.push('<div style="position:relative;float:left;"><table style="border:0.15rem dotted grey;margin:0.2rem;"><tr><td align=center valign=middle>'+gb_big5_str+'</td></tr></table></div>');
            }
            definition_str=definition_hzpy(item);
            if (definition_str!==''){
                definition_list.push('<p>'+definition_str+'</p>');
            }
        }
    }
    document.getElementById('divhtml').innerHTML='<table><tr><td>'+bljg.join('\n')+'</td></tr><tr><td>'+gb_big5_list.join('\n')+'</td></tr><tr><td>'+definition_list.join('\n')+'</td></tr></table>';
}

function one_word_hzpy(cskey){
    return '<div style="position:relative;float:left;"><table style="border:0.15rem dotted grey;margin:0.2rem;"><tr><td align=center valign=middle>'+hz2py_global[cskey].join(', ')+'</td></tr><tr><td align=center valign=middle>'+cskey+'</td></tr></table></div>';
}

function pronunciation_hzpy(cstype){
    switch (cstype){
        case 'single':
            var result_t=new Set();
            for (let key in hz2py_global){
                if (hz2py_global[key].length==1){
                    result_t.add(one_word_hzpy(key));
                }
            }
            result_t=Array.from(result_t);
            result_t.sort();            
            break;
        case 'multiple':
            var result_t=[];
            for (let key in hz2py_global){
                if (hz2py_global[key].length>1){
                    result_t.push([one_word_hzpy(key),hz2py_global[key].length]);
                }
            }    
            result_t.sort();
            result_t.sort(function (a,b){return a[1]>b[1];});   
            for (let blxl=0;blxl<result_t.length;blxl++){
                result_t[blxl]=result_t[blxl][0];
            }
            break;
        case 'list':
            var result_t=[];
            for (let key in py2hz_global){
                result_t.push([key,py2hz_global[key].length]);
            }
            result_t.sort(function (a,b){return a[1]>b[1];});
            for (let blxl=0;blxl<result_t.length;blxl++){
                var words='';
                if (result_t[blxl][1]<=10){
                    words='<span class="oblong_box">'+py2hz_global[result_t[blxl][0]].join(' ')+'</span>';
                }
                
                result_t[blxl]=result_t[blxl][0]+'<small>('+result_t[blxl][1]+')'+words+'</small>';
            }
            break;
    }
    document.getElementById('divhtml').innerHTML='<table><tr><td style="line-height:1.8rem;">'+result_t.join('\n')+'</td></tr><tr><td>'+result_t.length+'</td></tr></table>';
}

function menu_hzpy(){
    var str_t=klmenu_hide_b('');
    var klmenu1=[
    '<span class="span_menu" onclick="javascript:'+str_t+'pronunciation_hzpy(\'single\');">所有单音字</span>',
    '<span class="span_menu" onclick="javascript:'+str_t+'pronunciation_hzpy(\'multiple\');">所有多音字</span>',
    '<span class="span_menu" onclick="javascript:'+str_t+'pronunciation_hzpy(\'list\');">读音列表</span>',    
    ];

    document.getElementById('h2_title').insertAdjacentHTML('afterbegin',klmenu_multi_button_div_b(klmenu_b(klmenu1,'','8rem','1rem','1rem','60rem'),'','0rem')+' ');
}

function init_hzpy(){
    top_bottom_arrow_b('div_top_bottom','',false,(ismobile_b()?'2rem':'1.6rem'));
    menu_hzpy();
    var input_list=[
    ["input_half_py_probability",4],
    ];
    input_size_b(input_list,'id');
    
    var blxl=0
    for (let item in hz2py_global){
        blxl=blxl+1;
    }

    var blxl2=0
    for (let item in py2hz_global){
        blxl2=blxl2+1;
    }
    
    var blxl3=0
    for (let item in cnwords_global){
        blxl3=blxl3+1;
    }
    
    zh_tw_global=zh_tw_global.trim().slice(1,-1).split('><');   //去掉头尾的<和> - 保留注释    
    var bljg='汉字 '+blxl+' 个；读音 '+blxl2+' 种；简繁对应 '+zh_tw_global.length+' 组；汉字注释：'+blxl3+' 个';
    document.getElementById('span_info').innerHTML=bljg;
    recent_search_hzpy();
}

function recent_search_hzpy(csstr=''){
    recent_search_b('recent_search_hzpinyin',csstr,'search_hzpy','div_recent_search',[],25,false); 
}

function half_py_hzpy(){
    var blprobability=parseFloat(document.getElementById('input_half_py_probability').value);
    if (isNaN(blprobability)){
        blprobability=1;
    }
    var blstr=document.getElementById('textarea_search').value.trim();
    var str_len=blstr.length;
    var list_t=blstr.split('\n');
    var result_t=[];
    var done_py=false;
    var blcount=0;
    for (let arow of list_t){
        arow=arow.split('');
        for (let one_character of arow){
            var blfound=false;
            if (blcount/str_len<blprobability && Math.random()<=blprobability && done_py===false && one_character in hz2py_global){
                if (hz2py_global[one_character].length==1){
                    blfound=true;
                }
            }
            if (blfound){
                result_t.push(hz2py_global[one_character][0]);
                done_py=true;
                blcount=blcount+1;
            }
            else {
                result_t.push(one_character);
                done_py=false;
            }
        }
        result_t.push('\n');
    }
    document.getElementById('divhtml').innerHTML='<textarea style="height:10rem;" onclick="javascript:this.select();document.execCommand(\'copy\');">'+result_t.join('')+'</textarea><p style="margin-top:0.5rem;font-size:0.8rem;">'+blcount+'/'+str_len+' '+(blcount*100/str_len).toFixed(2)+'%</p>';
}
