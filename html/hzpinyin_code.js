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

function s2t_t2s_pair_hzpy(){
    var result_t=s2t_t2s_pair_b()[0];
    var bljg=[];
    for (let key in result_t){
        bljg.push(key+result_t[key]);
    }
    document.getElementById('divhtml').innerHTML=array_2_li_b(bljg);
}

function s2t_t2s_search_hzpy(){
    var blstr=document.getElementById('textarea_search_hzpy').value.trim();
    var result_t=s2t_t2s_search_b(blstr);
    for (let blxl=0;blxl<result_t.length;blxl++){
        result_t[blxl]='<strong>'+result_t[blxl][0]+'：</strong>'+result_t[blxl][1];
    }
    var odiv=document.getElementById('divhtml');
    odiv.innerHTML='<div style="column-count:'+(ismobile_b()?3:5)+';">'+array_2_li_b(result_t)+'</div>';
    odiv.scrollIntoView();
}

function search_hzpy(csstr=''){
    var otextarea=document.getElementById('textarea_search_hzpy');
    if (csstr==''){
        csstr=otextarea.value.trim().substring(0,1000);
    }
    otextarea.value=csstr;
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

function pronunciation_single_3500_hzpy(show_html=true){
    var result_t={};
    var list_t=(hz_3500_global+hz_easy_global).split('');
    for (let item of list_t){
        if (item in hz2py_global){
            if (hz2py_global[item].length!=1){continue;}
            var key=hz2py_global[item][0];
            if (result_t[key]==undefined){
                result_t[key]=[];
            }
            result_t[key].push(item);
        }
    }
    var bljg={};
    for (let key in result_t){
        if (result_t[key].length<2){continue;}  //忽略只有一个汉字 - 保留注释
        bljg[key]=result_t[key];
    }
    
    if (show_html==false){
        return bljg;
    }
    
    bljg=object2array_b(bljg,true);
    for (let blxl=0;blxl<bljg.length;blxl++){
        bljg[blxl]='"'+bljg[blxl][0]+'":["'+bljg[blxl].slice(1,).join('","')+'"],\n';
    }
    document.getElementById('divhtml').innerHTML=array_2_li_b(bljg.join('').trim().split('\n'));
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
        case 'length':
            var result_t=Object.keys(py2hz_global);
            result_t.sort(function(a,b){return a.length<b.length;});
            for (let blxl=0;blxl<result_t.length;blxl++){
                result_t[blxl]=result_t[blxl]+': '+py2hz_global[result_t[blxl]];
            }
            result_t=array_2_li_b(result_t);
            break;
    }
    
    var bljg='<table><tr><td style="line-height:1.8rem;">';
    if (Array.isArray(result_t)){
        bljg=bljg+result_t.join('\n')+'</td></tr><tr><td>'+result_t.length;
    }
    else {
        bljg=bljg+result_t;
    }
    bljg=bljg+'</td></tr></table>';
    document.getElementById('divhtml').innerHTML=bljg;
}

function idiom_hzpy(cstype='idiom'){
    var list_t=document.getElementById('textarea_search_hzpy').value.match(/[^\x00-\xff]/g);
    var result_t=new Set();
    switch (cstype){
        case 'word':
            var data_t=cn_ci_global;
            break;
        default:
            var data_t=cn_idiom_global;
    }
    
    for (let item of data_t){
        for (let aword of list_t){
            if (item.includes(aword)){
                result_t.add(item);
            }
        }
    }
    result_t=Array.from(result_t);
    result_t.sort(function (a,b){return zh_sort_b(a,b);});
    document.getElementById('divhtml').innerHTML=array_2_li_b(result_t);
}

function menu_hzpy(){
    var str_t=klmenu_hide_b('');
    var klmenu1=[
    '<span class="span_menu" onclick="'+str_t+'pronunciation_hzpy(\'single\');">所有单音字</span>',
    '<span class="span_menu" onclick="'+str_t+'pronunciation_hzpy(\'multiple\');">所有多音字</span>',
    '<span class="span_menu" onclick="'+str_t+'pronunciation_hzpy(\'list\');">读音列表</span>',    
    '<span class="span_menu" onclick="'+str_t+'pronunciation_hzpy(\'length\');">读音长度排序</span>',    
    '<span class="span_menu" onclick="'+str_t+'homophonic_words_hzpy();">谐音字</span>',    
    '<span class="span_menu" onclick="'+str_t+'idiom_hzpy();">含有当前字的成语</span>',    
    '<span class="span_menu" onclick="'+str_t+'idiom_hzpy(\'word\');">含有当前字的词语</span>',    
    '<span class="span_menu" onclick="'+str_t+'s2t_t2s_pair_hzpy();">繁简一一对应的字</span>',        
    '<span class="span_menu" onclick="'+str_t+'s2t_t2s_search_hzpy();">繁简查找</span>',        
    '<span class="span_menu" onclick="'+str_t+'pronunciation_single_3500_hzpy();">常见单音字</span>',            
    ];
    
    var klmenu_link=[
    ];
    if (is_local_b()){
        klmenu_link.push('<a onclick="'+str_t+'" href="'+klwebphp_path_b('sticker.php')+'" target=_blank>Sticker</a>');    
        klmenu_link.push('<span class="span_menu" onclick="'+str_t+'klwiki_link_b(\'KL 微信清单\',true);">KL 微信清单</span>');
    }    

    document.getElementById('h2_title').insertAdjacentHTML('afterbegin',klmenu_multi_button_div_b(klmenu_b(klmenu1,'','12rem','1rem','1rem','60rem')+klmenu_b(klmenu_link,'L','12rem','1rem','1rem','60rem'),'','0rem')+' ');
}

function init_hzpy(){
    top_bottom_arrow_b('div_top_bottom','',false,(ismobile_b()?'2rem':'1.6rem'));
    menu_hzpy();
    var input_list=[
    ['input_half_py_probability',4],
    ['input_delimiter',8],
    ['input_amount_per_col',5],
    
    ];
    input_size_b(input_list,'id');
    form_generate_hzpy();

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
    temp_save_hzpy('read');
}

function form_generate_hzpy(){
    var fav_list=local_storage_get_b('fav_lines_bible',-1,true);
    var postpath=postpath_b();
    var oform=document.getElementById('form_hzpy');
    oform.setAttribute('action',postpath+'temp_txt_share.php');
    
    bljg=textarea_buttons_b('textarea_search_hzpy','清空,复制,发送到临时记事本,发送地址')
    document.getElementById('p_buttons').innerHTML=bljg;
}

function recent_search_hzpy(csstr=''){
    recent_search_b('recent_search_hzpinyin',csstr,'search_hzpy','div_recent_search',[],25,false); 
}

function homophonic_words_hzpy(ratio=-1){
    function sub_homophonic_words_hzpy_includes(pystring,aletter){
        if (pystring.includes(aletter)){return 1;}
        
        var letters='áàǎāéèěēíìǐīóòǒōúùǔū';
        var blat=letters.indexOf(aletter);
        if (blat==-1){return 0;}
        blat=Math.floor(blat/4);
        for (let blxl=blat*4;blxl<blat*4+4;blxl++){
            if (pystring.includes(letters.substring(blxl,blxl+1))){return 1;}
        }
        return 0;
    }
    
    function sub_homophonic_words_hzpy_head(one_hz_list,jiebalist){
        //one_hz_list 形如：[ "s", "h", "ǎ" ] - 保留注释
        var words=[];
        for (let key in jiebalist){
            var blfound=false;        
            if (hz2py_global[key]==undefined){continue;}
            for (let acol of hz2py_global[key]){
                for (let item of one_hz_list){
                    var blcount=0;
                    for (let aletter of item){
                        blcount=blcount+sub_homophonic_words_hzpy_includes(acol,aletter);
                    }
                    if (2*blcount/(acol.length+one_hz_list.length)>ratio){
                        words=words.concat(jiebalist[key]);
                        blfound=true;
                        break;
                    }
                }
                if (blfound){break;}
            }
        }
        return words;
    }
    
    function sub_homophonic_words_hzpy_filter(pylist,csstart,words){
        //pylist 形如 [ "b", "ī" ] - 保留注释
        var result_t=[];
        for (let aword of words){
            var aletter=aword.substring(csstart,csstart+1);
            if (hz2py_global[aletter]==undefined){continue;}
            var blfound=false;
            for (let acol of hz2py_global[aletter]){
                //acol 形如 méng - 保留注释
                for (let item of pylist){
                    var blcount=0;
                    for (let aletter of item){
                        blcount=blcount+sub_homophonic_words_hzpy_includes(acol,aletter);
                    }
                    if (2*blcount/(acol.length+pylist.length)>ratio){
                        result_t.push([aword,2*blcount/(acol.length+pylist.length)]);
                        blfound=true;
                        break;
                    }
                }
                if (blfound){break;}
            }
        }
        result_t.sort(function (a,b){return a[1]<b[1];});
        final_list=[];
        for (let item of result_t){
            final_list.push(item[0]);
        }
        return final_list.slice(0,500);
    }
    
    function sub_homophonic_words_hzpy_split(csstr,csstart){
        var blhead=csstr.substring(csstart,csstart+1);
        if (hz2py_global[blhead]==undefined){
            return [];    
        }
        
        var head_list=[];
        for (let item of hz2py_global[blhead]){
            head_list.push(item.split(''));
        }
        return head_list;
    }
    
    function sub_homophonic_words_hzpy_step(){
        if (blxl>=bllen){
            document.getElementById('divhtml').innerHTML=words.slice(0,500).join(' ');
            return;
        }
        pylist=sub_homophonic_words_hzpy_split(blkey,blxl);
        if (pylist.length==0){
            alert('未发现'+blkey.substring(blxl,blxl+1));
            return;    
        }
        words=sub_homophonic_words_hzpy_filter(pylist,blxl,words);        
        blxl=blxl+1;
        setTimeout(sub_homophonic_words_hzpy_step,10);
    }
    
    function sub_homophonic_words_hzpy_extra(head_list,cslen,words){
        var result_t={};
        var extra_list=array_unique_b(split_words_b(blstr)[1]);
        for (let item of extra_list){
            if (item.length!==bllen){continue;}
            if (words.includes(item)){continue;}
            var blhead=item.substring(0,1);
            if (result_t[blhead]==undefined){
                result_t[blhead]=[];
            }
            result_t[blhead].push(item);
        }
        extra_words=sub_homophonic_words_hzpy_head(head_list,result_t);
        return words.concat(extra_words);
    }
    //-------------------------
    var blstr=document.getElementById('textarea_search_hzpy').value.trim();
    if (blstr==''){return;}
    var blkey=blstr.split('\n')[0];
    var bllen=blkey.length;
    if (bllen<2 || bllen>4){
        alert('长度应在2-4之间');
        return;
    }
    if (ratio==-1){
        ratio=0.2+1/bllen;
    }
    var head_list=sub_homophonic_words_hzpy_split(blkey,0);
    if (head_list.length==0){
        alert('未发现'+blkey.substring(0,1));
        return;    
    }
    var list_t=jieba_pb_dict_global['l'+bllen];
    var words=sub_homophonic_words_hzpy_head(head_list,list_t);

    words=sub_homophonic_words_hzpy_extra(head_list,bllen,words);
    
    var blxl=1;
    sub_homophonic_words_hzpy_step();
}

function half_py_hzpy(cstype='py'){
    var blprobability=parseFloat(document.getElementById('input_half_py_probability').value);
    if (isNaN(blprobability)){
        blprobability=1;
    }
    
    var s2t_list={};
    if (cstype=='s2t'){
        s2t_list=s2t_t2s_pair_b()[0];
    }
    
    var blstr=document.getElementById('textarea_search_hzpy').value.trim();
    var str_len=blstr.length;
    var list_t=blstr.split('\n');
    var result_t=[];
    var done_py=(cstype=='py'); //半拼音化第一个汉字原样显示 - 保留注释
    var blcount=0;
    
    var single_3500={};
    if (cstype=='pronunciation'){
        single_3500=pronunciation_single_3500_hzpy(false);
    }
    
    for (let arow of list_t){
        arow=arow.split('');
        for (let one_character of arow){
            var blfound=false;
            if (blcount/str_len<blprobability && Math.random()<=blprobability && done_py===false){
                switch (cstype){
                    case 'py':
                        if (one_character in hz2py_global){
                            blfound=(hz2py_global[one_character].length==1);
                        }
                        break;
                    case 's2t':
                        blfound=(one_character in s2t_list);
                        break;
                    case 'overlape':
                        blfound=true;
                        break;
                    case 'pronunciation':
                        if (one_character in hz2py_global){
                            if (hz2py_global[one_character].length==1){
                                if (hz2py_global[one_character][0] in single_3500){
                                    blfound=true;
                                }
                            }
                        }
                        break;
                }
            }
            if (blfound){
                switch (cstype){
                    case 'py':
                        result_t.push(hz2py_global[one_character][0]);
                        done_py=true;
                        break;
                    case 's2t':
                        result_t.push(s2t_list[one_character]);
                        break;
                    case 'overlape':
                        unicode_overlape_global.sort(randomsort_b);
                        result_t.push(one_character+unicode_overlape_global[0]);
                        break;
                    case 'pronunciation':
                        var list_t=single_3500[hz2py_global[one_character][0]].sort(randomsort_b);
                        var blno=(list_t[0]==one_character?1:0);
                        result_t.push(list_t[blno]);
                        break;
                }
                blcount=blcount+1;
            }
            else {
                result_t.push(one_character);
                done_py=false;
            }
        }
        result_t.push('\n');
    }
    var bljg='<textarea id="textarea_result_hzpy" style="height:10rem;" onclick="this.select();document.execCommand(\'copy\');">'+result_t.join('')+'</textarea>';
    bljg=bljg+'<p style="margin-top:0.5rem;font-size:0.8rem;">'+blcount+'/'+str_len+' '+(blcount*100/str_len).toFixed(2)+'% <span class="aclick" onclick="textarea_shift_b(\'textarea_search_hzpy\',\'textarea_result_hzpy\');">对调</span></p>';
    
    var odiv=document.getElementById('divhtml');
    odiv.innerHTML=bljg;
}

function vertical_str_hzpy(){
    var otextarea=document.getElementById('textarea_search_hzpy');
    var delimiter=document.getElementById('input_delimiter').value.trim();
    if (delimiter==''){
        delimiter=' ';
    }
    var vlens=parseInt(document.getElementById('input_amount_per_col').value);
    var cstype=document.getElementById('select_vertical_str_hzpy').value;
    var do_replace=document.getElementById('checkbox_replace_punctuation').checked;
    var s2d=document.getElementById('checkbox_single_2_double').checked;
    otextarea.value=vertical_generation_hzpy(otextarea.value.trim(),vlens,delimiter,cstype,do_replace,s2d);
}

function vertical_generation_hzpy(csstr,v_len=-1,delimiter=' ',align='top',replace_punctuation=true,single_2_double=true){    
    var result_t=[];
    csstr=csstr.trim();
    if (single_2_double){
        csstr=character_single_2_double_b(csstr);
    }
    var blstr_list=csstr.split('\n');
    for (let one_row of blstr_list){
        one_row=one_row.trim().split('');
        var one_col=[];
        var blxl=0;
        for (let item of one_row){
            if (delimiter.includes(item)){
                if (one_col.length>0){
                    result_t.push(one_col);
                }
                one_col=[];
                blxl=0;
                continue;   //不添加 分隔符 - 保留注释
            }
            else if (v_len>0 && blxl % v_len == 0){
                if (one_col.length>0){
                    result_t.push(one_col);
                }
                one_col=[];
                blxl=0;
            }

            one_col.push(item);
            blxl=blxl+1;
        }
        
        if (one_col.length>0){
            result_t.push(one_col);
        }
    }
    result_t.reverse();
    
    if (result_t.length==0){return '';}
    
    v_len=0;    //避免不必要的空格 - 保留注释
    for (let item of result_t){
        v_len=Math.max(v_len,item.length);
    }

    switch (align){
        case 'top':
            for (let blxl=0;blxl<result_t.length;blxl++){
                for (let blno=result_t[blxl].length;blno<v_len;blno++){
                    result_t[blxl].push('　');
                }     
            }
            break;
        case 'bottom':
            for (let blxl=0;blxl<result_t.length;blxl++){
                for (let blno=result_t[blxl].length;blno<v_len;blno++){
                    result_t[blxl]=['　'].concat(result_t[blxl]);
                }     
            }
            break;
        case 'center':
            for (let blxl=0;blxl<result_t.length;blxl++){
                for (let blno=result_t[blxl].length;blno<v_len;blno++){
                    if (blno % 2 == 0){
                        result_t[blxl]=['　'].concat(result_t[blxl]);
                    }
                    else {
                        result_t[blxl].push('　');
                    }
                }     
            }
            break;        
    }
    
    if (document.getElementById('checkbox_add_space').checked){
        result_t[0]=add_space_hzpy(result_t[0]);
    }
    var bljg='';
    for (let row=0;row<v_len;row++){
        for (let item of result_t){
            bljg=bljg+item[row]+' ';
        }
        bljg=bljg.slice(0,-1)+'\n';
    }
    if (replace_punctuation){
        var punctuations=[
        ['“','﹁'],['”','﹂'],['《','︽'],['》','︾'],['（','︵'],['）','︶'],['{','︷'],['}','︸'],
        ['—','〡'],
        ];
        for (let item of punctuations){
            bljg=bljg.replace(new RegExp(item[0],'g'),item[1]);
        }        
    }
    bljg=bljg.replace(new RegExp(/[,.?"':;!“”‘’、，。；：？！]/,'g'),'　'); //微信不对齐中文中文标点 - 保留注释
    return bljg;
}

function add_space_hzpy(cslist){
    var blstr=cslist.join('');
    var spaces=blstr.match(/　+$/g);
    if (spaces==null){
        return cslist;
    }
    var blat=blstr.lastIndexOf('——');
    if (blat==-1){
        var blat=blstr.lastIndexOf('—');
    }
    if (blat==-1){
        return cslist;
    }
    var result_t=cslist.slice(0,blat);
    result_t=result_t.concat(spaces[0].split(''));
    result_t=result_t.concat(cslist.slice(blat,cslist.length-spaces[0].length));
    
    return result_t;
}

function temp_save_hzpy(cstype=''){
    temp_save_table_b(cstype,'hzpy_save','textarea_search_hzpy','div_temp_save',20);
}
