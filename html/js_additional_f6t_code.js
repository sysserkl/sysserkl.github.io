function menu_more_f6t(){
    var str_t=klmenu_hide_b('');
    
    table_th_jscm_global={'title':'','user':'','type':'','km(s)':'right','difficult':'','start time':'','hour(s)':'right','from':'','to':'','img':''};

    var col_name_list=['href'].concat(Object.keys(table_th_jscm_global));
    var klmenu1=[
    '<a href="http://www.foooooot.com/" target=_blank>foooooot</a>',
    klmenu_select_sort_b('select_sort_type_jsad_f6t',col_name_list,str_t,'sort_f6t',true,true),
    '<span class="span_menu" onclick="'+str_t+'rank_f6t();">当前条件县市排行</span>',            
    ];

    return klmenu_b(klmenu1,'🏔','20rem','1rem','1rem','30rem');
}

function file_load_f6t(){
    flot_load_common(['en_de_str'],[],[],['map/district_cn_geo_data.js','jieba_pb_dict_data.js'],[],false);
}

function sort_f6t(is_desc=false,rank_no=false){
    if (rank_no===false){
        rank_no=parseInt(document.getElementById('select_sort_type_jsad_f6t').value);
    }
    if ([4,7].includes(rank_no)){
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
    var ym_list=csarr[5].split('-');
    return [blname,ym_list,csarr[3],csarr[4]];
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
        
        var blstr=county_list[key_list[blxl]]['name'].join(' ').replace(/[—～（）]/g,' ');
        county_list[key_list[blxl]]['name']=count_words_b(blstr,split_words_b(blstr,true),2).slice(0,10);
        
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
            one_district.slice(2,),
            county_list[one_district]['count'],
            county_list[one_district]['distance'],
            county_list[one_district]['month_count'],
            county_list[one_district]['month_distance'],
            county_list[one_district]['name']
            ]);
        }
        
        var h3_list={
        '县市线路条数':['s',[0,1,3,5],0],
        '地市线路条数':['c',[0,1,3,5],0],
        '县市线路长度':['s',[0,2,4,5],1],
        '地市线路长度':['c',[0,2,4,5],1],
        };
        
        var odiv=document.getElementById('div_status_common');
        odiv.innerHTML='';
        
        var th_month='';
        for (let month_no=1;month_no<=12;month_no++){
            th_month=th_month+'<th nowrap>'+month_no+'月</th>';
        }        
        
        for (let one_h3 in h3_list){
            var one_row=h3_list[one_h3];
            var tr_list=array_split_by_col_b(cs_dict[one_row[0]],one_row[1]);
            tr_list.sort(function (a,b){return zh_sort_b(a,b,false,0);});
            tr_list.sort(function (a,b){return a[1]>b[1]?-1:1;});
            
            var row_no=0;
            for (let blno=0,lent=tr_list.length;blno<lent;blno++){
                var item=tr_list[blno];
                item[2]=array_split_by_col_b(item[2],[1]);
                var blmax=Math.max(...item[2]);
                var blmin=Math.min(...item[2]);
                for (let one_month=0,lenb=item[2].length;one_month<lenb;one_month++){
                    var blvalue=item[2][one_month];
                    if (blvalue==0){
                        item[2][one_month]='<td align=right nowrap></td>';
                    } else {
                        var blcolor=(blvalue==blmax?'red':(blvalue==blmin?'blue':''));
                        item[2][one_month]='<td align=right nowrap style="color: '+blcolor+';">'+blvalue.toFixed(one_row[2])+'</td>';
                    }
                }
                row_no=row_no+1;
                tr_list[blno]='<tr><td>'+row_no+'</td><td>'+item[0]+'</td><td align=right nowrap>'+item[1].toFixed(one_row[2])+'</td>'+item[2].join('')+'<td><small>'+item[3]+'</small></td></tr>';
            }
            
            var th_str='<tr><th>No.</th><th>地区</th><th nowrap>'+one_h3.slice(2,)+'</th>'+th_month+'<th>热词</th></tr>';
            odiv.insertAdjacentHTML('beforeend','<h3>'+one_h3+'</h3><table class="table_common">'+th_str+tr_list.join('\n')+'</table>');
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
        var from_to_list=array_unique_b(item[0].slice(7,9));
        
        var city_list=[];
        for (let blno=0,lent=from_to_list.length;blno<lent;blno++){
            var city_name=city_name_get_f6t(from_to_list[blno]);
            city_list.push('c_'+city_name);
            from_to_list[blno]='s_'+from_to_list[blno];
        }
        from_to_list=from_to_list.concat(city_list);

        var value_list=name_ym_distance_difficult_get_f6t(item[0]);

        for (let one_district of from_to_list){
            if (county_list[one_district]==undefined){
                county_list[one_district]={'name':[],'count':0,'distance':0,'month_count':{},'month_distance':{}};
                for (let month_no=1;month_no<=12;month_no++){
                    var blkey='m_'+('00'+month_no).slice(-2,)+'月';
                    county_list[one_district]['month_count'][blkey]=0;
                    county_list[one_district]['month_distance'][blkey]=0;
                }
            }
            county_list[one_district]['count']=county_list[one_district]['count']+1;

            county_list[one_district]['name']=county_list[one_district]['name'].concat(value_list[0]);
            
            var month_key='m_'+value_list[1][1]+'月';
            if (value_list[1][2]!=='00'){
                county_list[one_district]['month_count'][month_key]=county_list[one_district]['month_count'][month_key]+1;
                county_list[one_district]['month_distance'][month_key]=county_list[one_district]['month_distance'][month_key]+value_list[2];
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
    
    var county_list={};
    
    var blxl=0;
    var key_list=[];
    var bllen=js_data_current_common_search_global.length;
    var old_title=document.title;
    sub_rank_f6t_one();
}
