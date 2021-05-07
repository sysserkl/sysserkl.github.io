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
                bljg.push('<div style="position:relative;float:left;"><table style="border:0.15rem dotted grey;margin:0.2rem;"><tr><td align=center valign=middle>'+hz2py_global[item].join(', ')+'</td></tr><tr><td align=center valign=middle>'+item+'</td></tr></table></div>');
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

function init_hzpy(){
    top_bottom_arrow_b('div_top_bottom','',false,(ismobile_b()?'2rem':'1.6rem'));
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
