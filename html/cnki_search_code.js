function init_cnki(){
    top_bottom_arrow_b('div_top_bottom','',false,(ismobile_b()?'1.8rem':'1.6rem'),false,false,2);
    input_with_x_b('input_search',(ismobile_b()?10:25));
    menu_cnki();
    
    recent_cnki();
    name_set_cnki();
}

function jieba_cnki(){
    var title_t=[];
    for (let item of current_result_cnki_global){
        title_t.push(item[0][0]);
    }
    var blstr=title_t.join('\n');
    var arr_t = count_words_b(blstr,split_words_b(blstr,true),2);
    var str_t='';
    for (let item of arr_t){
        str_t=str_t+item[0]+' ';
    }
    
    var blbuttons=close_button_b('div_status');
    var text_str='<textarea>'+str_t+'\n\n'+arr_t+'</textarea>';    
    var odiv=document.getElementById('div_status');
    odiv.innerHTML=text_str+blbuttons;
    odiv.scrollIntoView();
}

function menu_cnki(){
    var str_t=klmenu_hide_b('');
    var klmenu_pb_data=[];
    var pb_list=['ChatGPT','Python','共同富裕','良渚','房屋养老金','三次分配','三星堆','社会主义核心价值观'];
    for (let item of pb_list){
        klmenu_pb_data.push('<span class="span_menu" onclick="'+str_t+'import_data_cnki(this.innerText,\'pb\');">'+item+'</span>');
    }
    
    var klmenu_kl_data=[];
    for (let item of cnki_kl_list_global){
        klmenu_kl_data.push('<span class="span_menu" onclick="'+str_t+'import_data_cnki(this.innerText,\'kl\');">'+item+'</span>');    
    }

    var klmenu_statistics=[
    '<span class="span_menu" onclick="'+str_t+'jieba_cnki();">题名分词</span>',    
    ];

    var list_t=[
    ['年月','statistics_year_month_cnki();',true],
    ['数据库','statistics_type_cnki(4);',true],
    ['来源','statistics_type_cnki(2);',true],
    ];    
    klmenu_statistics.push(menu_container_b(str_t,list_t,'统计: '));    
    
    var klmenu_config=root_font_size_menu_b(str_t);
    klmenu_config=klmenu_config.concat([
    '<span class="span_menu" onclick="'+str_t+'standalone_cnki();">当前结果导出为 standalone search</span>',    
    '<span class="span_menu" onclick="'+str_t+'slash_export_cnki();">当前结果生成为 /// 格式</span>',   
    '<span class="span_menu" onclick="'+str_t+'temp_form_generate_cnki();">临时数据输入</span>',   
    '<span class="span_menu" onclick="'+str_t+'duplicate_cnki();">重复记录检查</span>',    
    ]);

    var list_t=[
    ['⚪ reg','klmenu_check_b(this.id,true);',true,'span_reg_cnki'],
    ['⚪ highlight','klmenu_check_b(this.id,true);',true,'span_highlight_cnki'],
    ];    
    klmenu_config.push(menu_container_b(str_t,list_t,'临时剔除记录: '));    
    
    var list_t=[
    ['当前页面之前','remove_rows_cnki();',true],
    ['当前页面之后','remove_rows_cnki(true);',true],
    ];    
    klmenu_config.push(menu_container_b(str_t,list_t,'临时剔除记录: '));    
        
    document.getElementById('span_title').insertAdjacentHTML('beforebegin',klmenu_multi_button_div_b(klmenu_b(klmenu_pb_data,'🛢','14rem','1rem','1rem','30rem')+(klmenu_kl_data.length>0?klmenu_b(klmenu_kl_data,'⛽','10rem','1rem','1rem','30rem'):'')+klmenu_b(klmenu_statistics,'🧮','16rem','1rem','1rem','30rem')+klmenu_b(klmenu_config,'⚙','22rem','1rem','1rem','30rem'),'','0rem')+' ');
    klmenu_check_b('span_reg_cnki',true);        
    klmenu_check_b('span_highlight_cnki',true);    
}

function temp_form_generate_cnki(){
    var blstr='<textarea id="textarea_temp_statistics_cnki" style="height:20rem;"></textarea>';
    var buttons='名称：<input type="text" id="input_temp_data_name_cnki" /> <span class="aclick" onclick="slash_import_cnki();">导入 /// 数据</span>';
    buttons=buttons+textarea_buttons_b('textarea_temp_statistics_cnki','清空,复制');
    var odiv=document.getElementById('divhtml');
    odiv.innerHTML=blstr+'<p>'+buttons+'</p>';
    odiv.scrollIntoView();
}

function slash_import_cnki(){
    var blstr=document.getElementById('textarea_temp_statistics_cnki').value.trim();
    if (blstr==''){return;}
    var list_t=blstr.split('\n');
    var result_t=[];
    for (let arow of list_t){
        arow=arow.split(' /// ');
        if (arow.length!==7){
            console.log('error',arow);
            continue;
        }
        result_t.push(arow);
    }

    if (!confirm('是否清空当前数据，并导入'+result_t.length+'条记录？')){return;} 
    cnki_article_list_raw_global=result_t;
    
    database_name_cnki_global=document.getElementById('input_temp_data_name_cnki').value.trim();
    name_set_cnki();
    search_cnki();
}

function name_set_cnki(){
    if (database_name_cnki_global.length>0){
        character_2_icon_b(database_name_cnki_global.substring(0,1));    
        document.title=database_name_cnki_global+' - cnki search';
        document.getElementById('span_title').innerHTML='cnki search - '+database_name_cnki_global;
    } else {
        character_2_icon_b('🛢');        
    }
    document.getElementById('span_count').innerHTML='('+cnki_article_list_raw_global.length+')';
}

function remove_rows_cnki(is_after=false){
    var ofont=document.querySelector('p.p_pages_cnki font.font_current_no_b');
    if (!ofont){return;}
    var blno=parseInt(ofont.innerText);
    if (is_after){
        var row_start=blno*rows_per_page_cnki_global;
        var row_end=current_result_cnki_global.length-1;
    } else {
        var row_start=0;
        var row_end=(blno-1)*rows_per_page_cnki_global-1;
    }
    if (row_start<0 || row_end>current_result_cnki_global.length-1 || row_end<row_start){return;}
    if (!confirm('是否临时清除第'+blno+'页之'+(is_after?'后':'前')+(row_start+1)+'至'+(row_end+1)+'之间的'+(row_end-row_start+1)+'条记录？')){return;} 
    
    current_result_cnki_global.splice(row_start,row_end+1-row_start);
    result_percent_b('span_count',current_result_cnki_global.length,cnki_article_list_raw_global.length);
    page_cnki(1);
}

function duplicate_cnki(){
    if (cnki_article_list_raw_global.length<2){return;}
    
    var cols4_list=[];
    for (let blxl=0,lent=cnki_article_list_raw_global.length;blxl<lent;blxl++){
        cols4_list.push([cnki_article_list_raw_global[blxl].slice(0,4).join(','),blxl]);
    }
    
    cols4_list.sort();
    var no_set=new Set();
    var old_str='';
    var old_no=-1;
    for (let item of cols4_list){
        if (item[0]==old_str){
            no_set.add(old_no);
            no_set.add(item[1]);
        }
        old_str=item[0];
        old_no=item[1];
    }

    if (no_set.size==0){
        alert('无重复');
        return;
    }
    current_result_cnki_global=[];
    for (let blno of no_set){
        current_result_cnki_global.push([cnki_article_list_raw_global[blno],blno]);
    }    
    page_cnki(1);
}

function slash_export_cnki(){
    var result_t=[];
    for (let item of current_result_cnki_global){
        result_t.push(item[0].join(' /// '));
    }
    
    var blbuttons=close_button_b('div_status');
    var text_str='<textarea>'+result_t.join('\n')+'</textarea>';
    var odiv=document.getElementById('div_status');
    odiv.innerHTML=text_str+blbuttons;
    odiv.scrollIntoView();    
}

function standalone_cnki(){
    var bltitle=prompt('输入标题');
    if (bltitle==null){return;}
    if (bltitle.trim()==''){
        bltitle='cnki search';
    }
    var old_value=rows_per_page_cnki_global;
    rows_per_page_cnki_global=current_result_cnki_global.length;
    var result_t=page_cnki(1);
    for (let blxl=0,lent=result_t.length;blxl<lent;blxl++){
        result_t[blxl]='"'+specialstr_j(result_t[blxl])+'",';
    }

    standalone_search_funs_b(bltitle.trim(),result_t.join('\n'),['style_generate_b'],false,table_th_cnki(true));
    rows_per_page_cnki_global=old_value;    
}

function statistics_type_cnki(csno,csmax=20){
    var source_t=[];
    for (let arow of current_result_cnki_global){
        var blkey='t_'+arow[0][csno];
        if (source_t[blkey]==undefined){
            source_t[blkey]=0;
        }
        source_t[blkey]=source_t[blkey]+1;
    }    

    source_t=object2array_b(source_t,true,2);
    source_t.sort(function (a,b){return zh_sort_b(a,b,false,0);});
    source_t.sort(function (a,b){return a[1]<b[1] ? 1 : -1;});

    var text_str='<table width=100%><tr><td id="td_flot_pie_cnki" valign="top" style="width:600px;height:600px;"></td><td valign="top"><div style="max-height:600px;overflow:scroll;">'+array_2_li_b(source_t)+'</div></td></tr></table>';
    
    var others_count=0;
    if (csmax>0 && source_t.length>csmax){
        var others=source_t.slice(csmax,);
        for (let item of others){
            others_count=others_count+item[1];
        }
        source_t=source_t.slice(0,csmax);
    }
    
    var list_t=[];
    for (let item of source_t){
        list_t.push({'label': item[0],'data': item[1]});
    }
    if (others_count>0){
        list_t.push({'label': '其他','data': others_count});        
    }

    var blbuttons=close_button_b('div_status');
    
    var odiv=document.getElementById('div_status');
    odiv.innerHTML=text_str+blbuttons;
    flot_pie_b(list_t,'td_flot_pie_cnki');
    odiv.scrollIntoView();
}

function statistics_year_month_cnki(){
    var year_t=[];
    var ym_t=[];
    for (let arow of current_result_cnki_global){
        var bldate=validdate_b(arow[0][3]);
        if (bldate===false){
            console.log('unknown date:',arow[0]);
            continue;
        }
        var date_dict=date_2_ymd_b(bldate,'dict');
        var blkey='y_'+date_dict['y'];
        if (year_t[blkey]==undefined){
            year_t[blkey]=0;
        }
        year_t[blkey]=year_t[blkey]+1;
        
        blkey='m_'+date_dict['y']+'-'+date_dict['2m']+'-01';
        if (ym_t[blkey]==undefined){
            ym_t[blkey]=0;
        }
        ym_t[blkey]=ym_t[blkey]+1;
    }
    year_t=object2array_b(year_t,true,2);
    for (let blxl=0,lent=year_t.length;blxl<lent;blxl++){
        year_t[blxl][0]=validdate_b(year_t[blxl][0]+'-01-01');
    }
    year_t=date_list_insert_zero_b(year_t,false,false,['01'],['01']);    
    
    ym_t=object2array_b(ym_t,true,2);
    for (let blxl=0,lent=ym_t.length;blxl<lent;blxl++){
        ym_t[blxl][0]=validdate_b(ym_t[blxl][0]);
    }
    ym_t=date_list_insert_zero_b(ym_t,false,false,[],['01']);

    if (year_t.length==0 && ym_t.length==0){return;}
    
    //---
    var blfound_zero=false;
    var text_y_all_list=[];
    var text_y_not_zero_list=[];
    for (let item of year_t){
        var blstr=date_2_ymd_b(item[0],'y');
        text_y_all_list.push(blstr+' /// '+item[1]);
        if (item[1]>0){
            text_y_not_zero_list.push(blstr+' /// '+item[1]);        
        } else {
            blfound_zero=true;
        }        
    }

    var text_m_all_list=[];
    var text_m_not_zero_list=[];    
    for (let item of ym_t){
        var blstr=date2str_b('-',item[0]).substring(0,7);
        text_m_all_list.push(blstr+' /// '+item[1]);
        if (item[1]>0){
            text_m_not_zero_list.push(blstr+' /// '+item[1]);
        } else {
            blfound_zero=true;
        }
    }    
    
    var blbuttons=close_button_b('div_status');
    var div_str='<div style="max-height:300px;overflow:auto;">';
    var text_str='<tr><td valign="top">'+div_str+array_2_li_b(text_y_all_list)+'</div></td><td valign="top">'+div_str+array_2_li_b(text_m_all_list)+'</div></td></tr>';
    if (blfound_zero){
        text_str=text_str+'<tr><td valign="top">'+div_str+array_2_li_b(text_y_not_zero_list)+'</div></td><td valign="top">'+div_str+array_2_li_b(text_m_not_zero_list)+'</div></td></tr>';    
    }
    text_str='<table width=90% cellspacing=10 class="table_common">'+text_str+'</table>';    
    
    var odiv=document.getElementById('div_status');
    odiv.innerHTML='<div id="div_flot_year_cnki" style="width:100%;height:600px;"></div><div id="div_flot_ym_cnki" style="width:100%;height:600px;"></div>'+text_str+blbuttons;
    flot_lines_b([[database_name_cnki_global+' - 年度统计'].concat(year_t)],'div_flot_year_cnki','nw',true,'','y','篇');
    flot_lines_b([[database_name_cnki_global+' - 月度统计'].concat(ym_t)],'div_flot_ym_cnki','nw',true,'','m','篇');
    odiv.scrollIntoView();
}

function import_data_cnki(cskey,cstype){
    location.href='?k='+cskey+'&t='+cstype;
}

function load_cnki(){
    var cskeys=href_split_b(location.href);
    database_name_cnki_global='';
    var cstype='';
    if (cskeys.length>0 && cskeys[0]!==''){
        for (let one_key of cskeys){
            one_key=one_key.trim();
            if (one_key.substring(0,2)=='k='){
                database_name_cnki_global=one_key.substring(2,);
            } else if (one_key.substring(0,2)=='t='){
                cstype=one_key.substring(2,);
            }            
        }
    }
    if (database_name_cnki_global!==''){
        if (cstype=='pb'){
            klbase_addons_import_js_b([],[],['cnki_pb/cnki_'+database_name_cnki_global+'_data.js']);
        } else {
            var blfile=klwebphp_path_b('data/cnki_kl/cnki_'+database_name_cnki_global+'_data.js');
            write_js_css_b([['js',blfile,'']]);
        }
    }
}

function recent_cnki(csstr=''){
    recent_search_b('recent_search_cnki',csstr,'search_cnki','div_recent_search',[],25,false); //此行保留 - 保留注释
}

function search_cnki(cskey=false,row_no=1){
    var oinput=document.getElementById('input_search');
    if (cskey===false){
        cskey=oinput.value.trim();
    }
    oinput.value=cskey;

    recent_cnki(cskey);
    var isreg=klmenu_check_b('span_reg_cnki',false);
    [cskey,isreg]=str_reg_check_b(cskey,isreg,true);   
    
    current_result_cnki_global=[];
    is_all_result_cnki_global=true;

    [current_result_cnki_global,is_all_result_cnki_global]=common_search_b(cskey,isreg,cnki_article_list_raw_global,-1);

    result_percent_b('span_count',current_result_cnki_global.length,cnki_article_list_raw_global.length);

    var page_no=Math.ceil(row_no/rows_per_page_cnki_global);
    page_cnki(1+(page_no-1)*rows_per_page_cnki_global);
    if (row_no!==1){
        var blno=row_no-(page_no-1)*rows_per_page_cnki_global;
        var otrs=document.querySelectorAll('div#divhtml table.table_common tr');
        if (blno>=1 && blno<=otrs.length-1){
            otrs[blno].scrollIntoView();    //otrs[0] 是 th 系列 - 保留注释
        }
    }
}

function page_cnki(csno,show_html=true){
    var cslen=current_result_cnki_global.length;
    var bljg=page_combination_b(cslen,rows_per_page_cnki_global,csno,'page_cnki','locate_cnki',false,1,10,'p_pages_cnki');  
    //-----------------------
    var result_t=[];
    var blend=Math.min(csno-1+rows_per_page_cnki_global,cslen);
    var blno=0;

    for (let blxl=csno-1;blxl<blend;blxl++){
        var item=current_result_cnki_global[blxl][0];
        var blstr='<tr>';
        blstr=blstr+'<td style="max-width:40rem;">'+(item[0].includes('《')?item[0]:'《'+item[0]+'》')+'</td><td>'+item[1]+'</td><td>'+item[2]+'</td><td>'+item[3]+'</td><td>'+item[4]+'</td><td align="right">'+item[5]+'</td><td align="right">'+item[6]+'</td>';
        if (!is_all_result_cnki_global){
            blstr=blstr+'<td align="right">'+no_jump_cnki(current_result_cnki_global[blxl][1])+'</td>';
        } else {
            blstr=blstr+'<td align="right">'+current_result_cnki_global[blxl][1]+'</td>';        
        }
        blstr=blstr+'</tr>';
        result_t.push(blstr);
    }

    if (!show_html){
        return result_t;
    }
    
    var odiv=document.getElementById('divhtml');

    if (result_t.length==0){
        odiv.innerHTML='';
    } else {
        odiv.innerHTML=bljg+'<table class="table_common">'+table_th_cnki()+'\n'+result_t.join('\n')+'</table>\n'+bljg;
        mouseover_mouseout_oblong_span_b(odiv.querySelectorAll('span.oblong_box'));        

        if (klmenu_check_b('span_highlight_cnki',false)){
            highlight_text_b([],'div#divhtml td');            
        }        
    }
    return result_t;
}

function th_names_get_cnki(){
    return ['题名','作者','来源','发表时间','数据库','被引','下载'];
}

function table_th_cnki(is_simple=false){
    var th_names=th_names_get_cnki();
    var th_list=[];
    if (is_simple){
        for (let item of th_names){
            th_list.push('<th nowrap>'+item+'</th>');
        }    
    } else {
        for (let blxl=0,lent=th_names.length;blxl<lent;blxl++){
            th_list.push('<th style="cursor:pointer;" onclick="sort_cnki('+blxl+');" nowrap>'+th_names[blxl]+'</th>');
        }
    }
    th_list.push('<th nowrap>No.</th>');
    return '<tr>'+th_list.join('')+'</tr>';
}

function sort_cnki(csno){    
    var sort_type=(sort_desc_cnki_global ? 1 : -1);
    if (csno>=5){
        current_result_cnki_global.sort(
            function (a,b){return (parseInt(a[0][csno] || 0)*sort_type)<(parseInt(b[0][csno] || 0)*sort_type) ? 1 : -1;}
        );
    } else {
        if (sort_desc_cnki_global){
            current_result_cnki_global.sort(function (a,b){return a[0][csno]<b[0][csno] ? 1 : -1;});
        } else {
            current_result_cnki_global.sort(function (a,b){return a[0][csno]>b[0][csno] ? 1 : -1;});    
        }
    }
    sort_desc_cnki_global=!sort_desc_cnki_global;    
    page_cnki(1);
}

function locate_cnki(pages){
    var blno=page_location_b(pages);
    if (blno!==false){
        page_cnki((blno-1)*rows_per_page_cnki_global+1,rows_per_page_cnki_global);
    }
}

function no_jump_cnki(csno){
    if (csno==-1){return '';}
    return '<span style="cursor:pointer;" onclick="search_cnki(\'\','+csno+');">'+csno+'</span>';
}
