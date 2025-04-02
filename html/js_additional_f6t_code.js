function style_load_f6t(){
    var style_list=[
    '#divhtml {font-size:0.85rem;}',
    '#div_status_common {font-size:0.85rem;}',
    '#div_mini_search_f6t {font-size:0.85rem;}',
    'a.a_link_f6t:visited {color:'+scheme_global['memo']+';}',  //:visited 不能有空格 - 保留注释
    ];
    style_generate_b(style_list,true);
}

function menu_more_f6t(){
    var str_t=klmenu_hide_b('');
    
    table_th_jscm_global={'title':'','user':'','type':'','difficult':'','start time':'','km(s)':'right','hour(s)':'right','km/h':'right','from':'','to':'','img':''};

    var col_name_list=['href'].concat(Object.keys(table_th_jscm_global));
    var klmenu1=[
    '<a href="http://www.foooooot.com/" target=_blank>foooooot</a>',
    klmenu_select_sort_b('select_sort_type_jsad_f6t',col_name_list,str_t,'sort_f6t',true,true),
    '<span class="span_menu" onclick="'+str_t+'rank_f6t();">当前条件县市排行</span>',
    ];

    var group_list=[
    ['⚪ 热词','klmenu_check_b(this.id,true);',false,'span_show_hot_words_f6t'],
    ['⚪ 年份','klmenu_check_b(this.id,true);',false,'span_show_year_f6t'],
    ['⚪ 月份','klmenu_check_b(this.id,true);',false,'span_show_month_f6t'],
    ['⚪ 难度','klmenu_check_b(this.id,true);',false,'span_show_difficult_f6t'],
    ['⚪ 用户','klmenu_check_b(this.id,true);',false,'span_show_user_f6t'],
    ['⚪ 过渡色','klmenu_check_b(this.id,true);',false,'span_month_color_range_f6t'],
    ];
    klmenu1.push(menu_container_b(str_t,group_list,'统计显示：'));

    var group_list=[
    ['⚪ 过滤地名','klmenu_check_b(this.id,true);',false,'span_filter_district_f6t'],
    ['⚪ 气泡检索仅限有图记录','klmenu_check_b(this.id,true);',false,'span_only_img_f6t'],
    ['⚪ 显示id','klmenu_check_b(this.id,true);',false,'span_show_id_f6t'],
    ];
    klmenu1.push(menu_container_b(str_t,group_list,'统计显示：'));

    var group_list=[
    ['气泡条数：<input id="input_popup_max_rows_f6t" style="width:2rem;" value=10 />','',false,''],
    ['热词个数：<input id="input_max_hot_words_f6t" style="width:2rem;" value=15 />','',false,''],
    ['条数最小值：<input id="input_min_count_f6t" style="width:2rem;" value=3 />','',false,''],
    ['长度最小值：<input id="input_min_len_f6t" style="width:2rem;" value=10 />','',false,''],
    ];
    klmenu1.push(menu_container_b(str_t,group_list,'统计显示：'));
    
    return klmenu_b(klmenu1,'🏔','42rem','1rem','1rem','30rem');
}

function file_load_f6t(){
    flot_load_common(['date','flot','en_de_str'],['time','symbol'],[],['map/district_cn_geo_data.js'],[],true); //不载入 'jieba_pb_dict_data.js' - 保留注释
}

function sort_f6t(is_desc=false,rank_no=false){
    if (rank_no===false){
        rank_no=parseInt(document.getElementById('select_sort_type_jsad_f6t').value);
    }
    if ([6,7,8].includes(rank_no)){
        if (is_desc){
            f6t_global.sort(function (a,b){return a[rank_no]>b[rank_no]?-1:1;});    
        } else {
            f6t_global.sort(function (a,b){return a[rank_no]<b[rank_no]?-1:1;});            
        }
    } else {
        f6t_global.sort(function (a,b){return zh_sort_b(a,b,is_desc,rank_no);});
    }
}

function upload_data_files_f6t(csarr,from_big_file=false){
    function sub_upload_data_files_f6t_run(csresult){
        f6t_global=csresult;
        arr_len_refresh_common();
        alert('导入完成');
    }
    
    if (from_big_file===false){
        merge_js_lines_from_file_list_b(csarr,'[',sub_upload_data_files_f6t_run);    
    } else {
        arr_len_refresh_common();
        alert('导入完成');
    }
}

function col_rearrange_f6t(){
    var show_id=klmenu_check_b('span_show_id_f6t',false);
    var result_t=[];
    for (let item of js_data_current_common_search_global){
        var list_t=[].concat(item[0]);
        list_t[1]='<a class="a_link_f6t" href="'+list_t[0]+'" target=_blank>'+list_t[1]+'</a>'+id_get_f6t(list_t[0],show_id);
        result_t.push([list_t.slice(1,),item[1]]);
    }
    return result_t;
}

function name_ym_distance_difficult_get_f6t(csarr){
    var blname=csarr[0].replace(/^.*\s*target=_blank>(.*?)<\/a>.*$/,'$1');
    var ym_list=csarr[4].split('-');
    return [blname,ym_list,csarr[5],csarr[3]];
    //结果形如：["浙江三门龙脊背", [ "2012", "10", "28" ], 8.3, "非常难"] - 保留注释
}

function city_name_get_f6t(csname){
    var list_t=csname.split(/\s+/);
    if (list_t.length>=2){
        return list_t.slice(0,2).join(' ');
    }
    return 'unknown';
}

function month_difficult_popup_generate_f6t(csstr,table_no,row_no,cstype){
    return '<span class="span_box span_popup_f6t_'+cstype+'" onclick="hot_word_popup_event_f6t(event,this,'+table_no+','+row_no+',\''+cstype+'\');">'+csstr+'</span>';
}

function hot_word_popup_links_f6t(cslist,table_no,row_no,cstype='h',decimal_len=0,min_value=0){
    var result_t=[];
    for (let item of cslist){
        if (item[1]<min_value){continue;}
        result_t.push('<span class="span_box span_popup_f6t_'+cstype+'" onclick="hot_word_popup_event_f6t(event,this,'+table_no+','+row_no+',\''+cstype+'\');">'+item[0]+'</span><font color="grey">('+item[1].toFixed(decimal_len)+')</font>');
    }
    return result_t.join(' ');
}

function distrct_name_get_f6t(table_no,row_no){
    var otr=document.getElementById('tr_rank_f6t_'+table_no+'_'+row_no);
    if (!otr){return [false,false];}
    var otds=otr.querySelectorAll('td');
    if (otds.length<2){return [otr,false];}
    
    var distrct_name=otds[1].innerText;
    return [otr,distrct_name];
}

function hot_word_popup_event_f6t(event,oword,table_no,row_no,cstype){
    var otr,distrct_name;
    [otr,distrct_name]=distrct_name_get_f6t(table_no,row_no);
    if (distrct_name===false){return [];}
    
    var col_no=0;
    var blkey=oword.innerText;

    switch (cstype){
        case 'm':
            col_no=4;
            var ocurrent_td=oword.parentNode;
            var otds=otr.querySelectorAll('td.td_rank_month_f6t');
            var blmonth=-1;
            for (let blxl=0;blxl<12;blxl++){
                if (otds[blxl]==ocurrent_td){
                    blmonth=blxl;
                    break;
                }
            }
            if (blmonth===-1){return [];}
            blkey='-'+('00'+(blmonth+1)).slice(-2,)+'-';
            break;
        case 'y':
            col_no=4;
            blkey=blkey.slice(0,-1)+'-';
            break;
        case 'u':
            col_no=1;
            break;
        case 'd':
            col_no=3;
            var ocurrent_td=oword.parentNode;
            var otds=otr.querySelectorAll('td.td_rank_difficult_f6t');
            var difficult_range=difficult_range_get_f6t();
            var difficult_no=-1;
            for (let blxl=0,lent=difficult_range.length;blxl<lent;blxl++){
                if (otds[blxl]==ocurrent_td){
                    difficult_no=blxl;
                    break;
                }
            }
            if (difficult_no===-1){return [];}
            blkey=difficult_range[difficult_no];
            if (blkey=='难+'){
                var difficult_range=difficult_range_get_f6t();
                var blat=difficult_range.indexOf('难');
                blkey=difficult_range.slice(blat,);
            } else {
                blkey=[blkey];
            }
            break;
    }
    
    var only_img=klmenu_check_b('span_only_img_f6t',false);
    hot_word_html_f6t(event,distrct_name,cstype,blkey,col_no,cstype=='u',only_img);
}

function id_get_f6t(csstr,show_id){
    if (show_id){
        var id_value='('+(csstr.match(/\/trip\/(\d+)/) || ['',''])[1]+')';
    } else {
        var id_value='';
    }
    return id_value;
}

function hot_word_html_f6t(event,distrct_name,cstype,cskey,col_no,show_user=false,only_img=false,csmax=false){
    var result_t=[];
    var blno=0;
    if (csmax===false){
        csmax=parseInt(document.getElementById('input_popup_max_rows_f6t').value.trim()) || 10;
    }

    for (let item of js_data_current_common_search_global){
        if (!item[0][8].startsWith(distrct_name) && !item[0][9].startsWith(distrct_name)){continue;}
        if (only_img && item[0][10]=='no img'){continue;}
        
        if (['d','u'].includes(cstype)){
            if (!cskey.includes(item[0][col_no])){continue;}
        } else {
            if (!item[0][col_no].includes(cskey)){continue;}
        }
        
        blno=blno+1;
        var blname=name_ym_distance_difficult_get_f6t(item[0])[0];
        result_t.push([item[0][4]+' ('+item[0][3]+') '+(show_user?'('+item[0][1]+') ':'')+item[0][0],item[0][4],blname]);
        if (csmax>=0 && blno>=csmax){break;}
    }
    
    if (result_t.length==0){return [];}
    result_t.sort(function (a,b){return zh_sort_b(a,b,true,2);});
    result_t.sort(function (a,b){return a[1]>b[1]?-1:1;});
    result_t=array_split_by_col_b(result_t,[0]);
    if (event!==false){
        popup_event_div_b(event,'div_mini_search_f6t', array_2_li_b(result_t));
    }
    return result_t;
}

function flot_f6t(csno){
    var otable=document.getElementById('table_rank_f6t_'+csno);
    var otrs=otable.querySelectorAll('tr');
    var result_m=[];
    var result_y=[];
    var found_month_or_year=false;
    for (let one_tr of otrs){
        if (one_tr.classList.contains('tr_rank_hot_words_f6t')){continue;}
        if (one_tr.style.display=='none'){continue;}
        
        var oname=one_tr.querySelector('td.td_rank_district_f6t');

        var otds_m=one_tr.querySelectorAll('td.td_rank_month_f6t');
        if (otds_m.length==12){
            found_month_or_year=true;
            var month_t=[oname.innerText];
            for (let blxl=0;blxl<12;blxl++){
                month_t.push([blxl+1,parseFloat(otds_m[blxl].innerText) ||0]);
            }
            result_m.push(month_t);
        }
        
        var tr_year_list=[];
        var otd_y=one_tr.querySelector('td.td_rank_year_f6t');
        if (otd_y){
            var y_list=otd_y.innerText.match(/(\d{4})年\((\d+(\.\d+)?)\)/g) || [];
            for (let one_year of y_list){
                one_year=one_year.match(/(\d{4})年\((\d+(\.\d+)?)\)/);
                //形如：[ "2016年(11.7)", "2016", "11.7", ".7" ] - 保留注释
                //形如：[ "2015年(4)", "2015", "4", undefined ] - 保留注释
                tr_year_list.push([parseInt(one_year[1]),parseFloat(one_year[2])]);
            }
            
            if (tr_year_list.length>0){
                tr_year_list.sort(function (a,b){return a[0]<b[0]?-1:1;});
                tr_year_list=[oname.innerText].concat(tr_year_list);
                result_y.push(tr_year_list);
                found_month_or_year=true;
            }
        }
    }
    
    if (!found_month_or_year){
        alert('未发现月份或年份');
    }

    var omain=document.getElementById('div_rank_f6t_'+csno);
    var h3_str=omain.querySelector('span.span_rank_table_name_f6t').innerText.slice(-2,);
    var unit_str=(h3_str=='长度'?'km':'条');
    
    var odiv_m=document.getElementById('div_rank_f6t_flot_m_'+csno);
    odiv_m.innerHTML='';
    odiv_m.style.height='';

    var do_flot_m=true;
    if (result_m.length==0){
        do_flot_m=false;
    } else if (result_m[0].length<2){
        do_flot_m=false;
    }
    
    if (do_flot_m){
        odiv_m.style.height='600px';
        flot_lines_b(result_m,'div_rank_f6t_flot_m_'+csno,'nw',false,'','',unit_str);
        odiv_m.scrollIntoView();
    }

    var odiv_y=document.getElementById('div_rank_f6t_flot_y_'+csno);
    odiv_y.innerHTML='';
    odiv_y.style.height='';

    var do_flot_y=true;
    if (result_y.length==0){
        do_flot_y=false;
    }
    
    if (do_flot_y){
        odiv_y.style.height='600px';
        flot_lines_b(result_y,'div_rank_f6t_flot_y_'+csno,'nw',false,'','',unit_str);
        odiv_y.scrollIntoView();
    }
}

function rank_f6t(){
    function sub_rank_f6t_hot(){
        if (blxl>=bllen){
            setTimeout(sub_rank_f6t_done,1);
            return;
        }    
        
        if (show_hot_words){
            var blstr=county_list[key_list[blxl]]['name'].join(' ').replace(/[—～（）、，]/g,' ');
            county_list[key_list[blxl]]['name']=count_words_b(blstr,split_words_b(blstr,true,diy_words_list),2).slice(0,max_hot_words);
        } else {
            county_list[key_list[blxl]]['name']='';
        }
        
        blxl=blxl+1;
        if (blxl % 5 == 0){
            setTimeout(sub_rank_f6t_hot,1);
            document.title='热词 '+blxl+'/'+bllen+' - ' +old_title;
        } else {
            sub_rank_f6t_hot();
        }
    }
    
    function sub_rank_f6t_done(){
        var cs_dict={'c':[],'s':[]};
        for (let one_district in county_list){
            for (let month_type of ['month_count','month_distance']){
                county_list[one_district][month_type]=object2array_b(county_list[one_district][month_type],true,2);
                county_list[one_district][month_type].sort(function (a,b){return a[0]<b[0]?-1:1;});
            }

            for (let year_type of ['year_count','year_distance']){
                county_list[one_district][year_type]=object2array_b(county_list[one_district][year_type],true,2);
                county_list[one_district][year_type].sort(function (a,b){return a[0]>b[0]?-1:1;});
                county_list[one_district][year_type].sort(function (a,b){return a[1]>b[1]?-1:1;});
            }
            
            for (let user_type of ['user_count','user_distance']){
                county_list[one_district][user_type]=object2array_b(county_list[one_district][user_type],true,2);
                county_list[one_district][user_type].sort(function (a,b){return zh_sort_b(a,b,true,0);});
                county_list[one_district][user_type].sort(function (a,b){return a[1]>b[1]?-1:1;});
            }
                        
            cs_dict[one_district.slice(0,1)].push([
            one_district.slice(2,), //地区
            county_list[one_district]['count'],
            county_list[one_district]['distance'],
            county_list[one_district]['month_count'],
            county_list[one_district]['month_distance'],
            county_list[one_district]['name'],  //线路名称
            object2array_b(county_list[one_district]['difficult_count'],true,2),
            object2array_b(county_list[one_district]['difficult_distance'],true,2),
            county_list[one_district]['year_count'],
            county_list[one_district]['year_distance'],
            county_list[one_district]['user_count'],
            county_list[one_district]['user_distance'],
            ]);
        }
        
        var h3_list={
        //'c' city - 保留注释
        '县市线路条数':['s',[0,1,3,5,6,8,10],0],
        '地市线路条数':['c',[0,1,3,5,6,8,10],0],
        '县市线路长度':['s',[0,2,4,5,7,9,11],1],
        '地市线路长度':['c',[0,2,4,5,7,9,11],1],
        };
        
        var odiv=document.getElementById('div_status_common');
        odiv.innerHTML='';
        
        var th_month='';
        if (show_month){
            for (let month_no=1;month_no<=12;month_no++){
                th_month=th_month+'<th nowrap>'+month_no+'月</th>';
            }
        }
        var th_difficult='';
        if (show_difficult){        
            for (let difficult_type of difficult_range){
                th_difficult=th_difficult+'<th nowrap>'+difficult_type+'(%)</th>';
            }
        }
        
        var th_year=(show_year?'<th>年份</th>':'');
        var th_user=(show_user?'<th>用户</th>':'');
        
        var th_len=(show_month?12:0)+(show_difficult?6:0)+(show_year?1:0)+(show_user?1:0)+2;
        
        var hot_th='</tr>';
        if (maybe_only_show_words && show_hot_words){
            hot_th='<th>热词</th></tr>';
        }

        var table_no=0;
        var div_column_count=(ismobile_b()?1:2);
        for (let one_h3 in h3_list){
            var one_row=h3_list[one_h3];
            var tr_list=array_split_by_col_b(cs_dict[one_row[0]],one_row[1]);
            tr_list.sort(function (a,b){return zh_sort_b(a,b,true,0);});
            tr_list.sort(function (a,b){return a[1]>b[1]?-1:1;});
            
            var min_value=(one_h3.endsWith('条数')?min_count:min_len);
            
            var row_no=0;
            for (let blno=0,lent=tr_list.length;blno<lent;blno++){
                var item=tr_list[blno];
                if (show_month){
                    item[2]=array_split_by_col_b(item[2],[1]);
                    
                    if (month_color_range){
                        var month_values=[].concat(item[2]);
                        month_values.sort(function (a,b){return a<b?-1:1;});
                    } else {
                        var blmax=Math.max(...item[2]);
                        var blmin=Math.min(...item[2]);
                    }
                    
                    for (let one_month=0,lenb=item[2].length;one_month<lenb;one_month++){
                        var blvalue=item[2][one_month];
                        if (blvalue==0){
                            item[2][one_month]='<td class="td_rank_month_f6t"></td>';
                        } else {
                            if (month_color_range){
                                var blcolor=month_colors[month_values.indexOf(blvalue)];
                            } else {
                                var blcolor=(blvalue==blmax?'red':(blvalue==blmin?'blue':''));
                            }
                            item[2][one_month]='<td align=right nowrap style="color: '+blcolor+';" class="td_rank_month_f6t">'+month_difficult_popup_generate_f6t(blvalue.toFixed(one_row[2]),table_no,row_no,'m')+'</td>';
                        }
                    }
                } else {
                    item[2]=[];
                }
                
                if (show_difficult){
                    for (let difficult_no=0,difficult_len=item[4].length;difficult_no<difficult_len;difficult_no++){
                        item[4][difficult_no].push((item[4][difficult_no][1]*100/item[1]).toFixed(2));
                        item[4][difficult_no][1]=item[4][difficult_no][1].toFixed(one_row[2]);
                        if (item[4][difficult_no][1]==0){
                            item[4][difficult_no]='<td class="td_rank_difficult_f6t"></td>';
                        } else {
                            item[4][difficult_no]='<td nowrap align=right class="td_rank_difficult_f6t">'+month_difficult_popup_generate_f6t(item[4][difficult_no][2],table_no,row_no,'d')+'</td>';
                        }
                    }
                } else {
                    item[4]=[];
                }
                
                if (show_year){
                    item[5]='<td class="td_rank_year_f6t">'+hot_word_popup_links_f6t(item[5],table_no,row_no,'y',one_row[2],min_value)+'</td>';
                } else {
                    item[5]='';
                }
                
                if (show_user){
                    item[6]='<td class="td_rank_user_f6t" id="td_rank_user_f6t_'+table_no+'_'+row_no+'">'+hot_word_popup_links_f6t(item[6].slice(0,max_hot_words),table_no,row_no,'u',one_row[2],min_value)+'</td>';
                } else {
                    item[6]='';
                }
                
                var row_span=1;
                var hot_tr='</tr>';
                
                if (maybe_only_show_words){
                    if (show_hot_words){
                        hot_tr='<td class="td_rank_hot_words_f6t" id="td_rank_hot_words_f6t_'+table_no+'_'+row_no+'">'+hot_word_popup_links_f6t(item[3],table_no,row_no,'h',one_row[2],min_value)+'</td></tr>';
                    }
                } else if (item[3].length>0){
                    hot_tr='</tr><tr class="tr_rank_hot_words_f6t"><td class="td_rank_hot_words_f6t" id="td_rank_hot_words_f6t_'+table_no+'_'+row_no+'" colspan='+(th_len+1)+'>'+hot_word_popup_links_f6t(item[3],table_no,row_no,'h',one_row[2],min_value)+'</td></tr>';
                    row_span=2;
                }
                
                if (filter_district!==''){
                    if (common_search_b(filter_district,is_reg,[item[0]])[0].length==0){
                        tr_list[blno]='';
                        continue;
                    }  //在全部结果中，筛选哪些tr显示 - 保留注释
                }
                
                tr_list[blno]='<tr id="tr_rank_f6t_'+table_no+'_'+row_no+'"><td nowrap rowspan='+row_span+'>'+(row_no+1)+'</td><td nowrap rowspan='+row_span+' class="td_rank_district_f6t">'+item[0]+'</td><td align=right nowrap rowspan='+row_span+'>'+item[1].toFixed(one_row[2])+'</td>'+item[2].join('')+item[4].join('')+item[5]+item[6]+hot_tr;

                row_no=row_no+1;
            }
            
            var th_str='<tr><th style="cursor:pointer;" ondblclick="no_refresh_f6t(this);">No.</th><th>地区</th><th nowrap>'+one_h3.slice(2,)+'</th>'+th_month+th_difficult+th_year+th_user+hot_th;
            
            var buttons_str='<input style="width:10rem;" placeholder=\'filter\' onkeyup="if (event.key==\'Enter\'){filter_table_f6t(this);}" /> <span class="aclick" onclick="flot_f6t('+table_no+');" style="font-weight:normal;">flot</span> html: <select class="select_rank_f6t_html_type"><option>h</option><option>u</option></select> <span class="aclick" onclick="batch_links_generate_f6t(this,'+table_no+');" style="font-weight:normal;">show</span> <span class="aclick" onclick="batch_links_generate_f6t(this,'+table_no+',true);" style="font-weight:normal;">save</span>';
            
            var flot_str='<div id="div_rank_f6t_flot_m_'+table_no+'" style="width:90%;"></div><div id="div_rank_f6t_flot_y_'+table_no+'" style="width:90%;"></div><div id="div_rank_f6t_html_'+table_no+'" style="width:90%;column-count:'+div_column_count+';"></div>';
            
            odiv.insertAdjacentHTML('beforeend','<div id="div_rank_f6t_'+table_no+'"><h3><span class="span_rank_table_name_f6t">'+one_h3+'</span> '+buttons_str+'</h3><table class="table_common" id="table_rank_f6t_'+table_no+'">'+th_str+tr_list.join('\n')+'</table>'+flot_str+'</div>');
            table_no=table_no+1;
        }
        
        var blbutton=close_button_b('div_status_common','','aclick');
        odiv.insertAdjacentHTML('beforeend','<p>'+blbutton+'</p>');
        odiv.scrollIntoView();    
        document.title=old_title;
    }
    
    function sub_rank_f6t_one(){
        if (blxl>=bllen){
            blxl=0;
            key_list=Object.keys(county_list);
            bllen=key_list.length;
            setTimeout(sub_rank_f6t_hot,1);
            return;
        }

        var item=js_data_current_common_search_global[blxl];
        var from_to_list=array_unique_b(item[0].slice(8,10));

        var city_list=new Set();
        for (let blno=0,lent=from_to_list.length;blno<lent;blno++){
            var city_name=city_name_get_f6t(from_to_list[blno]);
            city_list.add('c_'+city_name);  //防止 相同地级市，但不同县 导致 地级市 名称重复 - 保留注释
            from_to_list[blno]='s_'+from_to_list[blno];
        }
        from_to_list=from_to_list.concat(Array.from(city_list));

        var value_list=name_ym_distance_difficult_get_f6t(item[0]);

        for (let one_district of from_to_list){
            if (county_list[one_district]==undefined){
                county_list[one_district]={'name':[],'count':0,'distance':0,'year_count':{},'year_distance':{},'month_count':{},'month_distance':{},'difficult_count':{},'difficult_distance':{},'user_count':{},'user_distance':{}};
                for (let month_no=1;month_no<=12;month_no++){
                    var blkey='m_'+('00'+month_no).slice(-2,)+'月';
                    county_list[one_district]['month_count'][blkey]=0;
                    county_list[one_district]['month_distance'][blkey]=0;
                }
                for (let difficult_type of difficult_range){
                    var blkey='d_'+difficult_type;
                    county_list[one_district]['difficult_count'][blkey]=0;
                    county_list[one_district]['difficult_distance'][blkey]=0;
                }
            }
            
            county_list[one_district]['count']=county_list[one_district]['count']+1;

            county_list[one_district]['name']=county_list[one_district]['name'].concat(value_list[0]);
            
            var month_key='m_'+value_list[1][1]+'月';
            if (value_list[1][2]!=='00'){
                county_list[one_district]['month_count'][month_key]=county_list[one_district]['month_count'][month_key]+1;
                county_list[one_district]['month_distance'][month_key]=county_list[one_district]['month_distance'][month_key]+value_list[2];
            }
            
            var difficult_key='d_'+value_list[3];
            if (county_list[one_district]['difficult_count'][difficult_key]==undefined){    //以防万一有其他难度分类 - 保留注释
                county_list[one_district]['difficult_count'][difficult_key]=0;
            }
            if (county_list[one_district]['difficult_distance'][difficult_key]==undefined){
                county_list[one_district]['difficult_distance'][difficult_key]=0;
            }
            county_list[one_district]['difficult_count'][difficult_key]=county_list[one_district]['difficult_count'][difficult_key]+1;
            county_list[one_district]['difficult_distance'][difficult_key]=county_list[one_district]['difficult_distance'][difficult_key]+value_list[2];
            
            if (['难','非常难','专家级'].includes(value_list[3])){
                county_list[one_district]['difficult_count']['d_难+']=county_list[one_district]['difficult_count']['d_难+']+1;
                county_list[one_district]['difficult_distance']['d_难+']=county_list[one_district]['difficult_distance']['d_难+']+value_list[2];
            }
            
            var year_key='y_'+value_list[1][0]+'年';
            if (county_list[one_district]['year_count'][year_key]==undefined){
                county_list[one_district]['year_count'][year_key]=0;
            }
            if (county_list[one_district]['year_distance'][year_key]==undefined){
                county_list[one_district]['year_distance'][year_key]=0;
            }
            county_list[one_district]['year_count'][year_key]=county_list[one_district]['year_count'][year_key]+1;
            county_list[one_district]['year_distance'][year_key]=county_list[one_district]['year_distance'][year_key]+value_list[2];

            var user_key='u_'+item[0][1];
            if (county_list[one_district]['user_count'][user_key]==undefined){
                county_list[one_district]['user_count'][user_key]=0;
            }
            if (county_list[one_district]['user_distance'][user_key]==undefined){
                county_list[one_district]['user_distance'][user_key]=0;
            }
            county_list[one_district]['user_count'][user_key]=county_list[one_district]['user_count'][user_key]+1;
            county_list[one_district]['user_distance'][user_key]=county_list[one_district]['user_distance'][user_key]+value_list[2];

            county_list[one_district]['distance']=county_list[one_district]['distance']+value_list[2];
        }
        
        blxl=blxl+1;
        if (blxl % 500 == 0){
            setTimeout(sub_rank_f6t_one,1);
            document.title='遍历 '+blxl+'/'+bllen+' - ' +old_title;
        } else {
            sub_rank_f6t_one();
        }
    }
    
    var show_hot_words=klmenu_check_b('span_show_hot_words_f6t',false);
    
    var show_year=klmenu_check_b('span_show_year_f6t',false);
    var show_month=klmenu_check_b('span_show_month_f6t',false);
    var show_difficult=klmenu_check_b('span_show_difficult_f6t',false);
    var show_user=klmenu_check_b('span_show_user_f6t',false);
    var max_hot_words=parseInt(document.getElementById('input_max_hot_words_f6t').value.trim()) || 15;
    var min_count=parseInt(document.getElementById('input_min_count_f6t').value.trim()) || 0;
    var min_len=parseInt(document.getElementById('input_min_len_f6t').value.trim()) || 0;
    
    var maybe_only_show_words=(!show_month && !show_difficult && !show_year && !show_user);
    
    if (klmenu_check_b('span_filter_district_f6t',false)){
        var filter_district=document.getElementById('input_search').value;
        var is_reg=klmenu_check_b('span_reg_common',false);
    } else {
        var filter_district='';
        var is_reg=false;
    }
    
    var month_color_range=klmenu_check_b('span_month_color_range_f6t',false);        
    
    var county_list={};
    var blxl=0;
    var key_list=[];
    var diy_words_list=['莫干山','南北湖','环线','大龙湫','公婆岩','白云山','高阳山','乌大岩','石牛山'];
    
    if (month_color_range){
        //var month_colors=color_with_different_light_b('blue',6,true);
        var month_colors=color_with_different_light_b('red',12);
    }
    
    var difficult_range=difficult_range_get_f6t();
    var bllen=js_data_current_common_search_global.length;
    var old_title=document.title;
    sub_rank_f6t_one();
}

function difficult_range_get_f6t(){
    return ['简单','一般','难','非常难','专家级','难+'];
}

function filter_table_f6t(oinput){
    var otable=oinput.parentNode.parentNode.querySelector('table');
    var otrs=otable.querySelectorAll('tr');
    if (otrs.length==0){return;}

    var is_reg=klmenu_check_b('span_reg_common',false);
    obj_search_show_hide_b(otrs,'',oinput.value,is_reg,false);
    otrs[0].style.display='';   //th 行 - 保留注释
    //return;
    //if (!otable.querySelector('tr.tr_rank_hot_words_f6t')){return;}  //不存在热词 - 保留注释
    
    var otr_hots=otable.querySelectorAll('tr.tr_rank_hot_words_f6t');
    for (let one_hot of otr_hots){
        one_hot.style.display=one_hot.previousElementSibling.style.display;

    //以下2行保留，无法正确过滤 tr - 保留注释
    //for (let blxl=2,lent=otrs.length;blxl<lent;blxl=blxl+2){    //热词行 - 保留注释
        //otrs[blxl].style.display=otrs[blxl-1].style.display;    //热词行的显示与其上一行tr一致 - 保留注释
    }
}

function no_refresh_f6t(oth){
    if (!confirm('是否刷新编号？')){return;}

    var otable=oth.parentNode.parentNode;
    var otrs=otable.querySelectorAll('tr');
    var blno=1;
    for (let one_tr of otrs){
        if (one_tr.classList.contains('tr_rank_hot_words_f6t')){continue;}
        if (one_tr.style.display=='none'){continue;}
        
        var otd=one_tr.querySelector('td');
        if (otd){
            otd.innerHTML=blno;
            blno=blno+1;
        }
    }
}

function batch_links_generate_f6t(obutton,table_no,is_save=false){
    function sub_batch_links_generate_f6t_one(){
        if (blxl>=bllen){
            var blstr=result_t.join('\n')+'<p><b>Total:</b> '+new Set(unique_links).size+'</p>';
            if (is_save){
                if (confirm('是否保存为html文件？')){
                    blstr=html_head_generate_b('f6t',[],true,true)+'<body style="margin:0.5rem;">'+blstr+'</body></html>';
                    string_2_txt_file_b(blstr,'f6t.htm','txt');
                }
            } else {
                var osub=document.getElementById('div_rank_f6t_html_'+table_no);
                osub.innerHTML=blstr;
                osub.scrollIntoView();
            }
            
            document.title=old_title;
            console.log('batch_links_generate_f6t() 费时：'+(performance.now() - t0) + ' milliseconds');
            return;
        }
        
        var one_tr=otrs[blxl];
        if (one_tr.style.display!=='none'){
            var otds=one_tr.querySelectorAll('td.'+csclass);
            for (let one_td of otds){
                var blid=one_td.getAttribute('id').split('_').slice(-2,);

                var distrct_name=distrct_name_get_f6t(blid[0],blid[1])[1];
                if (distrct_name===false){continue;}
                var key_no=0;
                var ospans=one_td.querySelectorAll('span.span_popup_f6t_'+cstype);
                var district_t=[];
                for (let one_span of ospans){
                    var blkey=one_span.innerText;
                    var links_t=hot_word_html_f6t(false,distrct_name,cstype,blkey,col_no,false,only_img,popup_rows);
                    if (links_t.length>0){
                        unique_links=unique_links.concat(links_t);
                        key_no=key_no+1;
                        if (cstype=='h'){
                            var bllink='https://www.foooooot.com/search/trip/all/1/all/time/descent/?keyword='+encodeURIComponent(distrct_name+' '+blkey);
                            bllink='<a href="'+bllink+'" target=_blank>'+blkey+'</a>';
                        } else {
                            var bllink=blkey;
                        }
                        district_t.push('<h3>'+bllink+'<span style="font-size:small;font-weight:normal;"> / '+distrct_name+'</span> '+key_no+'<span style="font-size:small;font-weight:normal;"> / '+district_no+'</span></h3>'+array_2_li_b(links_t));
                    }
                }
                if (district_t.length>0){
                    result_t.push(district_t.join('\n'));
                    district_no=district_no+1;
                }
            }
        }
        
        blxl=blxl+1;
        if (blxl % 10 == 0){
            document.title=blxl+'/'+bllen+' - '+old_title;
            setTimeout(sub_batch_links_generate_f6t_one,1);
        } else {
            sub_batch_links_generate_f6t_one();
        }
    }

    var t0=performance.now();       

    var odiv=document.getElementById('div_rank_f6t_'+table_no);
    var only_img=klmenu_check_b('span_only_img_f6t',false);
    var popup_rows=parseInt(document.getElementById('input_popup_max_rows_f6t').value.trim()) || 10;
    
    var result_t=[];
    
    var cstype=obutton.parentNode.querySelector('select.select_rank_f6t_html_type').value;
    switch (cstype){
        case 'h':
            var col_no=0;
            var csclass='td_rank_hot_words_f6t';
            break;
        case 'u':
            var col_no=1;
            var csclass='td_rank_user_f6t';
            break;
    }
    
    var district_no=1;
    var otrs=odiv.querySelectorAll('tr');
    var blxl=0;
    var bllen=otrs.length;
    var unique_links=[];
    var old_title=document.title;
    sub_batch_links_generate_f6t_one();
}
