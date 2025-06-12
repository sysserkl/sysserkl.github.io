function menu_lt_klmemo(){
    var str_t=klmenu_hide_b('#top');
    var klmenu1=[
    '<span class="span_menu" onclick="'+str_t+'search_lt_klmemo();">search</span>',     
    '<span id="span_reg_lt_klmemo" class="span_menu" onclick="'+str_t+'klmenu_check_b(this.id,true);">⚪ reg</span>',        
    '<span class="span_menu" onclick="'+str_t+'init_lt_klmemo(\'DONE\');">finished items</span>',     
    '<span class="span_menu" onclick="'+str_t+'new_lt_klmemo();">new memo</span>', 
    '<span class="span_menu" onclick="'+str_t+'backup_lt_klmemo();">edit/import/export</span>', 
    ];

    var klmenu_sort=[
    '<span class="span_menu" onclick="'+str_t+'sort_type_klmemo_global=\'0a\';init_lt_klmemo();">sort by name</span>',     
    '<span class="span_menu" onclick="'+str_t+'sort_type_klmemo_global=\'0\';init_lt_klmemo();">sort by name desc</span>',     
    '<span class="span_menu" onclick="'+str_t+'sort_type_klmemo_global=\'1a\';init_lt_klmemo();">sort by start date</span>',     
    '<span class="span_menu" onclick="'+str_t+'sort_type_klmemo_global=\'1\';init_lt_klmemo();">sort by start date desc</span>',     
    '<span class="span_menu" onclick="'+str_t+'sort_type_klmemo_global=\'2a\';init_lt_klmemo();">sort by end date</span>',     
    '<span class="span_menu" onclick="'+str_t+'sort_type_klmemo_global=\'2\';init_lt_klmemo();">sort by end date desc</span>',         
    '<span class="span_menu" onclick="'+str_t+'sort_type_klmemo_global=\'tag\';init_lt_klmemo();">sort by tags</span>',
    '<span class="span_menu" onclick="'+str_t+'sort_type_klmemo_global=\'random\';init_lt_klmemo();">random sort</span>',
    ];
    
    var klmenu_config=[
    '<span class="span_menu" onclick="'+str_t+'service_worker_delete_b(\'memo\');">update</span>',
    ];
    klmenu_config=root_font_size_menu_b(str_t,true,true,true).concat(klmenu_config);
    
    var bljg=klmenu_multi_button_div_b(klmenu_b(klmenu1,'🧷','14rem','1rem','1rem','60rem')+klmenu_b(klmenu_sort,'↕','14rem','1rem','1rem','60rem')+klmenu_b(klmenu_config,'⚙','16rem','1rem','1rem','60rem'),'','0rem');
    
    document.getElementById('h2_title').insertAdjacentHTML('afterbegin',bljg+' ');
    klmenu_check_b('span_reg_lt_klmemo',true);
}

function search_lt_klmemo(){
    var blstr=(prompt('input search keys：',recent_search_key_klmemo_global) || '').trim();
    if (blstr==''){return;}
    recent_search_key_klmemo_global=blstr;
    init_lt_klmemo(blstr);
}

function update_lt_klmemo(){
    var otextarea_item=document.getElementById('textarea_backup_memo');
    if (!otextarea_item){return;}
    var blitems=otextarea_item.value.trim();
    if (confirm('是否更新数据？')){
        localStorage.setItem('list_klmemo',blitems);
        init_lt_klmemo('',true);
    }
}

function array_2_local_storage_lt_klmemo(){
    array_2_local_storage_b('list_klmemo',content_klmemo_global);
}

function delete_lt_klmemo(){
    if (confirm('delete finished item?')){
        local_storage_2_array_lt_klmemo(true);
        init_lt_klmemo('',true);
    }
}

function local_storage_2_array_lt_klmemo(do_delete=false,do_join_sort=false){
    var is_ok;
    var result_t;
    [is_ok,result_t]=local_storage_2_array_b('list_klmemo',3,do_join_sort);
    if (is_ok === false){
        alert('发现重复key: '+result_t+'，未更新');
        return;
    }
    
    if (do_delete){
        content_klmemo_global=[];
        for (let one_item of result_t){
            var start_day = validdate_b(one_item[1]);
            var end_day = validdate_b(one_item[2]);
            if (start_day!==false && end_day!==false){
                if (end_day>=start_day){continue;}
            }
            content_klmemo_global.push(one_item);
        }
    } else {
        content_klmemo_global=result_t;
    }
    
    sort_lt_klmemo();
    array_2_local_storage_lt_klmemo();
}

function sort_lt_klmemo(){
    if (sort_type_klmemo_global==''){return;}
    
    if (sort_type_klmemo_global=='tag'){
        content_klmemo_global.sort(function (a,b){
            let list_a=a[0].match(/(#[^#\s]{2,})/g) || ['']; //忽略#1 #r 等 - 保留注释
            let list_b=b[0].match(/(#[^#\s]{2,})/g) || [''];
            list_a.sort();
            list_b.sort();
            if (list_a[0]==''){return 0;}
            if (list_b[0]==''){return 1;}
            return list_a[0]<list_b[0] ? 1 : -1;
        });    
    } else if (sort_type_klmemo_global=='random'){
        content_klmemo_global.sort(randomsort_b);
    } else {
        var blno=parseInt((sort_type_klmemo_global+'0').substring(0,1));
        if (isNaN(blno)){
            blno=0;
        }
        blno=Math.min(2,Math.max(0,blno));
        content_klmemo_global.sort(function (a,b){return a[blno]>b[blno] ? 1 : -1;});
        if (sort_type_klmemo_global.includes('a')){
            content_klmemo_global.reverse();
        }
    }
}

function backup_lt_klmemo(){
    sort_type_klmemo_global='';
    local_storage_2_array_lt_klmemo(false,true);
    init_lt_klmemo('',false,false);
    
    var items=local_storage_get_b('list_klmemo',-1,false);
    var postpath=postpath_b();
    var bljg='<div id="div_backup" style="width:90%;margin:0.5rem;">';
    
    bljg=bljg+'<div id=div_help></div>'
    bljg=bljg+'<p><b>Items:</b></p>';
    
    var left_strings='<p>';
    left_strings=left_strings+close_button_b('div_backup','none')+' ';
    left_strings=left_strings+'<span class="aclick" onclick="local_storage_view_form_b(\'PIM\',\'div_backup\');">查看 localStorage(PIM系列)</span> ';
    left_strings=left_strings+'<span class="aclick" onclick="help_lt_klmemo();">Help</span> ';

    left_strings=left_strings+'<span class="aclick" onclick="update_lt_klmemo();">Update</span> ';   
    var right_strings=' </p>';

    var blstr=textarea_with_form_generate_b('textarea_backup_memo','width:100%;height:10rem;',left_strings,'清空,复制,发送到临时记事本,发送地址',right_strings,'list_klmemo','');

    bljg=bljg+blstr+'</div>';
    
    var odiv=document.getElementById('div_backup');
    if (odiv){
        odiv.outerHTML=bljg;
    } else {
        document.getElementById('divhtml').insertAdjacentHTML('afterbegin',bljg);
    }
    document.getElementById('textarea_backup_memo').value=items;
}

function help_lt_klmemo(){
    //history
    //0.0.1-20201225
    //-----------------------
    var bljg=`ver. 0.0.1-20201225
    <b>格式如下：</b>
    ---
    Memo1
    起始日期，形式如：2020-04-23
    结束日期，形式如：2021-12-31
    ---
    Memo2
    2020-04-23
    2020-12-31
    `;
    document.getElementById('div_help').innerHTML=bljg.split('\n').join('<br />');
}

function tag_style_lt_klmemo(csstr){
    var color_value=''
    var color_list=[['#r','🔴'],['#b','🔵'],['#y','🟡'],['#g',' 🟢'],['#p','🟣']];
    for (let item of color_list){
        if (csstr.includes(item[0]+' ') || csstr.slice(-2,)==item[0]){
            color_value=item[1];
            break;
        }
    }
    
    var no_value='';
    for (let blxl=0;blxl<=3;blxl++){
        if (csstr.includes('#'+blxl+' ') || csstr.slice(-2,)=='#'+blxl){
            no_value='⓿❶❷❸'.substring(blxl,blxl+1);
            break;
        }    
    }
    return color_value+no_value;
}

function draw_lt_klmemo(csno){
    var csitem=content_klmemo_global[csno];
    var start_day = validdate_b(csitem[1]);
    var end_day = validdate_b(csitem[2]);
    var today=new Date();
    var today_str=date2str_b('/',today);
    var all_days=Math.ceil((end_day-start_day+1)/(1000*3600*24));
    if (all_days<0){
        all_days='';
    } else {
        all_days=' ('+all_days+'天)';
    }
    
    var flag_value=tag_style_lt_klmemo(csitem[0]);
    var is_son=((csitem[0].includes('#s ') || csitem[0].slice(-2,)=='#s')?'padding-left:2rem;':'');

    var bljg='';
    bljg=bljg+'<hr />';
    bljg=bljg+'<table width=100% cellspacing=0 cellpadding=0><tr style="font-size:0.8rem;color:'+scheme_global['color']+';background-color:'+scheme_global[(csitem[2]<csitem[1]?'skyblue':'button')]+';"><td>'+(csno+1)+'. <span style="cursor:pointer;" onclick="change_lt_klmemo(\''+csitem[0]+'\',1);">'+csitem[1]+'</span>&nbsp;&nbsp;-&nbsp;&nbsp;';

    bljg=bljg+'<span style="cursor:pointer;" onclick="change_lt_klmemo(\''+csitem[0]+'\',2);">'+(csitem[2]<csitem[1]?'yyyy-mm-dd':csitem[2])+'</span>'+all_days+'</td>';
    bljg=bljg+'<td width=1% nowrap align=left style="padding:0 0.2rem;">'+flag_value+'</td>';
    bljg=bljg+'<td id="td_memo_buttons_'+csno+'" align=right width=1% nowrap><span style="cursor:pointer;" onclick="content_editable_lt_klmemo('+csno+');">🖊</span></td></tr></table>'; //onclick 不能放在 td 中 - 保留注释
    bljg=bljg+'<p class="p_memo_content" style="font-size:1.2rem;">';
    bljg=bljg+'<span class="span_memo_content" id="span_memo_content_'+csno+'" style="font-weight:bold;'+is_son+'">';

    bljg=bljg+csitem[0]+'</span>'; //change_lt_klmemo(\''+csitem[0]+'\',0); - 保留注释
    bljg=bljg+'</p><hr />';
    var odiv=document.getElementById('div_memo_'+csno);
    if (odiv){
        odiv.innerHTML=bljg;
    } else {
        document.getElementById('divhtml').insertAdjacentHTML('afterbegin','<div id="div_memo_'+csno+'" width=100%>'+bljg+'</div>\n');
    }
}

function content_editable_lt_klmemo(csno){
    var ospan=document.getElementById('span_memo_content_'+csno);
    var otd=document.getElementById('td_memo_buttons_'+csno);    
    if (!ospan){
        alert('未发现指定编号事项');
        return;
    }
    if (!otd){
        alert('未发现按钮区');
        return;
    }    
    ospan.setAttribute('contenteditable','true');
    otd.innerHTML='<button onclick="change_content_lt_klmemo('+csno+');">Save</button> <button onclick="draw_lt_klmemo('+csno+');">Cancel</button>';
}

function change_content_lt_klmemo(csno){
    var ospan=document.getElementById('span_memo_content_'+csno);
    if (!ospan){
        alert('未发现指定编号事项');
        return;
    }
    
    var currentvalue=ospan.innerText.trim();
    if (currentvalue==''){
        alert('修改项为空值，未保存');
        return;
    }
    
    if (csno<0 || csno>=content_klmemo_global.length){
        alert('编号超出范围，未保存');
        return;    
    }
    
    currentvalue=quote_2_cn_character_b(currentvalue);
    
    for (let blxl=0,lent=content_klmemo_global.length;blxl<lent;blxl++){
        if (currentvalue==content_klmemo_global[blxl][0]){
            if (blxl==csno){
                alert('未做修改，未保存');
                return;                
            } else {
                alert('存在同名的Memo，取消修改');
                return;
            }
        }
    }
    
    var oldvalue=content_klmemo_global[csno][0];
    if (confirm('是否修改？\n'+oldvalue+'\n'+currentvalue)==false){
        return;
    }

    content_klmemo_global[csno][0]=currentvalue;
    array_2_local_storage_lt_klmemo();
    draw_lt_klmemo(csno);
    if (oldvalue.includes('#') || currentvalue.includes('#')){
        tag_list_lt_klmemo();
    }
}

function done_lt_klmemo(){
    var blfound=false;
    for (let blxl=0,lent=content_klmemo_global.length;blxl<lent;blxl++){
        var item=content_klmemo_global[blxl];
        var start_day = validdate_b(item[1]);
        var end_day = validdate_b(item[2]);
        if (start_day===false || end_day===false){continue;}
        if (end_day<start_day){continue;}
        blfound=true;
        draw_lt_klmemo(blxl);
    }
    if (blfound){
        document.getElementById('divhtml').insertAdjacentHTML('afterbegin','<p><span class="aclick" onclick="delete_lt_klmemo();">Clear finished items</span></p>');
    }
}

function init_lt_klmemo(cskey='',refresh_tag=false,reload=true){
    if (reload){
        local_storage_2_array_lt_klmemo();
    }
    document.getElementById('divhtml').innerHTML='';

    var bljg=array_repeated_column_value_b(content_klmemo_global,0);
    if (bljg.length>0){
        document.getElementById('divhtml').innerHTML='<h4>发现重复名称：</h4>'+bljg.join('<br />');
        return;
    }
    if (content_klmemo_global.length==0){
        content_klmemo_global.push(['Memo Demo','2020-05-01','2020-10-31']);
        array_2_local_storage_lt_klmemo();
    }
    document.getElementById('span_count').innerHTML='('+content_klmemo_global.length+')';

    if (cskey=='DONE'){
        done_lt_klmemo();
        return;
    }
    
    var isreg=klmenu_check_b('span_reg_lt_klmemo',false);
    if (cskey.slice(-4,)=='(:r)'){
        isreg=true;
        cskey=cskey.substring(0,cskey.length-4);
    }
    
    if (cskey.length==2 && cskey.slice(0,1)=='#'){  //针对 #1 #r 等 - 保留注释
        cskey=cskey+'\\b';
        isreg=true;
    }
    if (cskey!==''){
        for (let blxl=0,lent=content_klmemo_global.length;blxl<lent;blxl++){
            var item=content_klmemo_global[blxl][0];   //Memo Name - 保留注释
            blfound=str_reg_search_b(item,cskey,isreg);
            if (blfound==-1){
                break;
            }
            if (blfound){
                draw_lt_klmemo(blxl);
            }
        }
    } else {
        for (let blxl=0,lent=content_klmemo_global.length;blxl<lent;blxl++){
            draw_lt_klmemo(blxl);
        }
    }
    if (refresh_tag){
        tag_list_lt_klmemo();
    }
}

function old_value_get_klmemo(){
    var nameset=new Set();
    for (let item of content_klmemo_global){
        nameset.add(item[0]);
    }
    return nameset;
}

function change_lt_klmemo(csid,csnumber){
    csnumber=parseInt(csnumber);
    var list_t=['Memo Name','Start Date','End Date'];
    if (csnumber<0 || csnumber>=list_t.length){return;}
    
    var nameset=old_value_get_klmemo();
    
    for (let blxl=0,lent=content_klmemo_global.length;blxl<lent;blxl++){
        var item=content_klmemo_global[blxl];
        if (item[0]==csid){
            var oldvalue=item[csnumber];
            var blinfo='：'+oldvalue;
            if (csnumber==2 && item[2]<item[1]){
                oldvalue=date2str_b();
                blinfo='';
            }
            
            if (confirm('是否修改？\n'+list_t[csnumber]+blinfo)==false){
                break;
            }

            var currentvalue=(prompt('输入'+list_t[csnumber],oldvalue) || '').trim();                        
            currentvalue=quote_2_cn_character_b(currentvalue);
            if (currentvalue==item[csnumber]){
                alert('未修改');
                return;
            }
            if (currentvalue!==''){
                if (csnumber==0){
                    if (nameset.has(currentvalue)){
                        alert('存在同名的Memo，取消修改');
                        return;
                    }
                    if (currentvalue=='---'){
                        alert('禁止使用---');
                        return;
                    }
                } else if ([1,2].includes(csnumber)){
                    currentvalue=validdate_b(currentvalue);
                    if (currentvalue===false){
                        alert('日期格式错误');
                        return;
                    }
                    currentvalue=date2str_b('-',currentvalue);
                }
                content_klmemo_global[blxl][csnumber]=currentvalue;
                array_2_local_storage_lt_klmemo();
                draw_lt_klmemo(blxl);
                if (csnumber==0){
                    if (oldvalue.includes('#') || currentvalue.includes('#')){
                        tag_list_lt_klmemo();
                    }
                }
            }
            break;
        }
    }
}

function new_lt_klmemo(){
    var newmemo=quote_2_cn_character_b((prompt('输入Memo') || '').trim());
    if (newmemo==''){return;}
    var name_list=old_value_get_klmemo();
    if (name_list.has(newmemo)){
        alert('存在同名的Memo，取消添加');
        return;
    }
    if (newmemo=='---'){
        alert('禁止使用---');
        return;
    }    
    if (confirm('do append?')==false){return;}
    
    var list_t=[newmemo,date2str_b(),previous_day_b('',10)];
    content_klmemo_global.push(list_t); //此处无sort - 保留注释
    array_2_local_storage_lt_klmemo();
    draw_lt_klmemo(content_klmemo_global.length-1);
    if (newmemo.includes('#')){
        tag_list_lt_klmemo();
    }    
    document.getElementById('span_count').innerHTML='('+content_klmemo_global.length+')';
}

function tag_list_lt_klmemo(){
    function sub_tag_list_lt_klmemo_one_tag(tagname,cscount){
        if (tagname==''){return ''};
        if (tagname.length>2){
            tagname=tagname.substring(1,);  //剔除# - 保留注释
        }
        return '<span class="oblong_box" onclick="init_lt_klmemo(\''+tagname+'\');">'+tagname+'<font color="grey"><small>('+cscount+')</small></font></span>\n';
    }
    //-----------------------
    var tags_t=[];
    for (let item of content_klmemo_global){
        var list_t=item[0].match(/#[^\s]+/g);
        if (list_t==null){continue;}
        tags_t=tags_t.concat(list_t);
    }
    
    tags_t.sort();
    var result_t=[];
    var tagname='';
    var blcount=0;
    for (let item of tags_t){
        if (item==tagname){
            blcount=blcount+1;
        } else {
            result_t.push(sub_tag_list_lt_klmemo_one_tag(tagname,blcount));
            tagname=item;
            blcount=1;
        }
    }
    
    result_t.push(sub_tag_list_lt_klmemo_one_tag(tagname,blcount));
    var op=document.getElementById('p_tags_klmemo');
    op.innerHTML=result_t.join('');
    mouseover_mouseout_oblong_span_b(op.querySelectorAll('span.oblong_box'));
}
