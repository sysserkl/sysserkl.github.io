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
    ['⚪ 月份','klmenu_check_b(this.id,true);',false,'span_show_month_f6t'],
    ['⚪ 难度','klmenu_check_b(this.id,true);',false,'span_show_difficult_f6t'],
    ['⚪ 过滤地名','klmenu_check_b(this.id,true);',false,'span_filter_district_f6t'],
    ];
    klmenu1.push(menu_container_b(str_t,group_list,'统计显示：'));
    
    return klmenu_b(klmenu1,'🏔','24rem','1rem','1rem','30rem');
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

function col_rearrange_f6t(){
    var result_t=[];
    for (let item of js_data_current_common_search_global){
        var list_t=[].concat(item[0]);
        list_t[1]='<a href="'+list_t[0]+'" target=_blank>'+list_t[1]+'</a>';
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

function rank_f6t(){
    function sub_rank_f6t_hot(){
        if (blxl>=bllen){
            setTimeout(sub_rank_f6t_done,1);
            return;
        }    
        
        if (show_hot_words){
            var blstr=county_list[key_list[blxl]]['name'].join(' ').replace(/[—～（）、，]/g,' ');
            county_list[key_list[blxl]]['name']=count_words_b(blstr,split_words_b(blstr,true),2).slice(0,15);
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
            cs_dict[one_district.slice(0,1)].push([
            one_district.slice(2,), //地区
            county_list[one_district]['count'],
            county_list[one_district]['distance'],
            county_list[one_district]['month_count'],
            county_list[one_district]['month_distance'],
            county_list[one_district]['name'],  //线路名称
            object2array_b(county_list[one_district]['difficult_count'],true,2),
            object2array_b(county_list[one_district]['difficult_distance'],true,2),
            ]);
        }
        
        var h3_list={
        '县市线路条数':['s',[0,1,3,5,6],0],
        '地市线路条数':['c',[0,1,3,5,6],0],
        '县市线路长度':['s',[0,2,4,5,7],1],
        '地市线路长度':['c',[0,2,4,5,7],1],
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
            for (let difficult_type of ['简单','一般','难','非常难','专家级','难+']){
                th_difficult=th_difficult+'<th nowrap>'+difficult_type+'(%)</th>';
            }
        }
        var th_len=(show_month?12:0)+(show_difficult?6:0)+2;
        
        var hot_th='</tr>';
        if (!show_month && !show_difficult && show_hot_words){
            hot_th='<th>热词</th></tr>';
        }
        
        for (let one_h3 in h3_list){
            var one_row=h3_list[one_h3];
            var tr_list=array_split_by_col_b(cs_dict[one_row[0]],one_row[1]);
            tr_list.sort(function (a,b){return zh_sort_b(a,b,false,0);});
            tr_list.sort(function (a,b){return a[1]>b[1]?-1:1;});
            
            var row_no=0;
            for (let blno=0,lent=tr_list.length;blno<lent;blno++){
                var item=tr_list[blno];
                if (show_month){
                    item[2]=array_split_by_col_b(item[2],[1]);
                    var blmax=Math.max(...item[2]);
                    var blmin=Math.min(...item[2]);
                    for (let one_month=0,lenb=item[2].length;one_month<lenb;one_month++){
                        var blvalue=item[2][one_month];
                        if (blvalue==0){
                            item[2][one_month]='<td></td>';
                        } else {
                            var blcolor=(blvalue==blmax?'red':(blvalue==blmin?'blue':''));
                            item[2][one_month]='<td align=right nowrap style="color: '+blcolor+';"><small>'+blvalue.toFixed(one_row[2])+'</small></td>';
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
                            item[4][difficult_no]='<td></td>'
                        } else {
                            item[4][difficult_no]='<td nowrap align=right><small>'+item[4][difficult_no][2]+'</small></td>'
                        }
                    }
                } else {
                    item[4]=[];
                }
                
                var row_span=1;
                var hot_tr='</tr>';
                
                if (!show_month && !show_difficult){
                    if (show_hot_words){
                        hot_tr='<td><small>'+item[3]+'</small></td></tr>';
                    }
                } else if (item[3].length>0){
                    hot_tr='</tr><tr class="tr_hot_words_f6t"><td colspan='+(th_len+1)+' style="color:grey;"><small>'+item[3]+'</small></td></tr>';
                    row_span=2;
                }

                row_no=row_no+1;
                
                if (filter_district!==''){
                    if (common_search_b(filter_district,is_reg,[item[0]])[0].length==0){
                        tr_list[blno]='';
                        continue;
                    }  //在全部结果中，筛选哪些tr显示 - 保留注释
                }
                
                tr_list[blno]='<tr><td nowrap rowspan='+row_span+'><small>'+row_no+'</small></td><td nowrap rowspan='+row_span+'><small>'+item[0]+'</small></td><td align=right nowrap rowspan='+row_span+'><small>'+item[1].toFixed(one_row[2])+'</small></td>'+item[2].join('')+item[4].join('')+hot_tr;
            }
            
            var th_str='<tr><th style="cursor:pointer;" ondblclick="no_refresh_f6t(this);">No.</th><th>地区</th><th nowrap>'+one_h3.slice(2,)+'</th>'+th_month+th_difficult+hot_th;
            odiv.insertAdjacentHTML('beforeend','<div><h3>'+one_h3+' <input style="width:10rem;" placeholder=\'filter\' onkeyup="if (event.key==\'Enter\'){filter_table_f6t(this);}" />'+'</h3><table class="table_common">'+th_str+tr_list.join('\n')+'</table></div>');
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
                county_list[one_district]={'name':[],'count':0,'distance':0,'month_count':{},'month_distance':{},'difficult_count':{},'difficult_distance':{}};
                for (let month_no=1;month_no<=12;month_no++){
                    var blkey='m_'+('00'+month_no).slice(-2,)+'月';
                    county_list[one_district]['month_count'][blkey]=0;
                    county_list[one_district]['month_distance'][blkey]=0;
                }
                for (let difficult_type of ['简单','一般','难','非常难','专家级','难+']){
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
    var show_month=klmenu_check_b('span_show_month_f6t',false);        
    var show_difficult=klmenu_check_b('span_show_difficult_f6t',false);        
    
    if (klmenu_check_b('span_filter_district_f6t',false)){
        var filter_district=document.getElementById('input_search').value;
        var is_reg=klmenu_check_b('span_reg_common',false);
    } else {
        var filter_district='';
        var is_reg=false;
    }
    
    var county_list={};
    var blxl=0;
    var key_list=[];
    var bllen=js_data_current_common_search_global.length;
    var old_title=document.title;
    sub_rank_f6t_one();
}

function filter_table_f6t(oinput){
    var otable=oinput.parentNode.parentNode.querySelector('table');
    var otrs=otable.querySelectorAll('tr');
    if (otrs.length==0){return;}
    
    obj_search_show_hide_b(otrs,'',oinput.value,false,true);
    otrs[0].style.display='';   //th 行 - 保留注释
    
    if (!otable.querySelector('tr.tr_hot_words_f6t')){return;}  //不存在热词 - 保留注释
    for (let blxl=2,lent=otrs.length;blxl<lent;blxl=blxl+2){    //热词行 - 保留注释
        otrs[blxl].style.display=otrs[blxl-1].style.display;    //热词行的显示与其上一行tr一致 - 保留注释
    }
}

function no_refresh_f6t(oth){
    if (!confirm('是否刷新编号？')){return;}

    var otable=oth.parentNode.parentNode;
    var otrs=otable.querySelectorAll('tr');
    var blno=1;
    for (let one_tr of otrs){
        if (one_tr.classList.contains('tr_hot_words_f6t')){continue;}
        if (one_tr.style.display=='none'){continue;}
        
        var otd=one_tr.querySelector('td');
        if (otd){
            otd.innerHTML='<small>'+blno+'</small>';
            blno=blno+1;
        }
    }
}
