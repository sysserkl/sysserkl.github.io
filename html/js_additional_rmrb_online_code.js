function menu_more_rmrb_online(){
    var str_t=klmenu_hide_b('');
    var klmenu1=[];
    var flist=flist_get_rmrb_online();
    for (let item of flist){
        klmenu1.push([item[1],'🖫','rmrb online '+item[0],'rmrb_online_global','rmrb_online','','0']);
    }

    klmenu1=js_file_links_common(klmenu1);
    
    klmenu1=klmenu1.concat([
    '<span id="span_merge_show_rmrb_online_common" class="span_menu" onclick="'+str_t+'table_head_set_rmrb_online(this.id);">⚪ 合并展示</span>',
    '<span class="span_menu" onclick="'+str_t+'statistics_rmrb_online(false);">逐月分布</span>',   
    '<span class="span_menu" onclick="'+str_t+'statistics_rmrb_online(true);">逐年分布</span>',       
    '<span id="span_mutli_keys_flot_rmrb_online_common" class="span_menu" onclick="'+str_t+'klmenu_check_b(this.id,true);">⚪ 多关键字分别统计</span>',
    ]);
    
    if (flist.length>1){
        if (data_file_jscm_global==flist[0][1]){
            klmenu1.push('<span class="span_menu" onclick="'+str_t+'merge_data_rmrb_online(this);">合并数据</span>');
        }
    }
    return klmenu_b(klmenu1,'📚','18rem','1rem','1rem','30rem');
}

function table_head_set_rmrb_online(csid=''){
    var is_merge=klmenu_check_b(csid,true);
    if (is_merge){
        table_th_jscm_global={'年月':'','标题':''};    
    } else {
        table_th_jscm_global={'网址':'','年月':'','标题':''};
    }
}

function file_load_rmrb_online(){
    table_head_set_rmrb_online();
    flot_load_common(['date','flot'],['time','symbol']);
}

function flist_get_rmrb_online(){
    var list_t=['194605_196612','196701_198712','198801_200312'];
    for (let blxl=0,lent=list_t.length;blxl<lent;blxl++){
        list_t[blxl]=[list_t[blxl],'../jsdata/rmrb_online/rmrb_online_'+list_t[blxl]+'_data.js'];
    }
    return list_t;
}

function statistics_rmrb_online(is_year=false){
    function sub_statistics_rmrb_online_one_key(){
        if (blxl>=bllen){
            oinput.value=key_name.join(' ');
            
            var blbutton='<p>'+close_button_b('div_status_common','','aclick')+'</p>';
            blbutton=blbutton+sub_statistics_rmrb_online_textarea();
            var odiv=document.getElementById('div_status_common');
            odiv.innerHTML='<div id="div_status_common_sub" style="width:100%; height:600px;"></div>'+blbutton;
            
            flot_lines_b(flot_arr,'div_status_common_sub','nw',true,'',(is_year?'y':'m'),'条',0);
            odiv.scrollIntoView();        
            
            return;
        }
        search_common(key_name[blxl],1,false);
        
        var result_t={};
        
        for (let item of js_data_current_common_search_global){
            var blkey=(is_year?item[0][1].substring(0,4):item[0][1]);
            if (result_t[blkey]==undefined){
                result_t[blkey]=0;
            }
            result_t[blkey]=result_t[blkey]+1;
        }

        result_t=object2array_b(result_t,true);
        result_t.sort(function (a,b){return a[0]>b[0] ? 1 : -1;});
        //---        
        if (!is_year){
            for (let blxl=0,lent=result_t.length;blxl<lent;blxl++){
                result_t[blxl][0]=validdate_b(result_t[blxl][0]+'01');
            }
        } else {
            for (let blxl=0,lent=result_t.length;blxl<lent;blxl++){
                result_t[blxl][0]=validdate_b(result_t[blxl][0]+'0101');
            }
        }
        
        if (result_t.length>0){
            result_t=date_list_insert_zero_b(result_t,false,false,(is_year?['01']:[]),['01']);  //只补零01月01日，或01日 - 保留注释
            textarea_data.push([key_name[blxl]].concat(result_t));
            
            result_t=[key_name[blxl]+'#points:false#'].concat(result_t);    
            flot_arr.push(result_t);
        }
        blxl=blxl+1;
        setTimeout(sub_statistics_rmrb_online_one_key,1000);
    }
    
    function sub_statistics_rmrb_online_textarea(){
        var blmin=false;
        var blmax=false;
        for (let arow of textarea_data){
            var blvalue=arow[1][0];
            if (blmin===false){
                blmin=blvalue;
            } else if (blvalue<blmin){
                blmin=blvalue;
            }

            var blvalue=arow[arow.length-1][0];
            if (blmax===false){
                blmax=blvalue;
            } else if (blvalue>blmax){
                blmax=blvalue;
            }            
        }

        var textarea1=[];
        var textarea2=[];    
    
        for (let blxl=0,lent=textarea_data.length;blxl<lent;blxl++){
            var blname=textarea_data[blxl][0];
            var result_t=textarea_data[blxl].slice(1,);
            if (result_t[0][0]>blmin){
                result_t=[[blmin,0]].concat(result_t);
                console.log(blname,'min',blmin);  //此行保留 - 保留注释
            }
            if (result_t[result_t.length-1][0]<blmax){
                result_t.push([blmax,0]);
                console.log(blname,'max',blmax);  //此行保留 - 保留注释
            }
            result_t=date_list_insert_zero_b(result_t,false,false,(is_year?['01']:[]),['01']);  //只补零01月01日，或01日 - 保留注释
            textarea_data[blxl]=[blname].concat(result_t);
            
            //---
            var slice_len=(is_year?4:6);       
            var blstart=date2str_b('',result_t[0][0]).substring(0,slice_len);
            var blend=date2str_b('',result_t[result_t.length-1][0]).substring(0,slice_len);
            var blstr="'"+specialstr_j(key_name[blxl]+'('+blstart+'-'+blend+')')+"'";
            var list_t1=[blstr];
            var list_t2=[blstr];
            for (let item of result_t){
                var bldate=date2str_b('',item[0]).substring(0,slice_len);
                list_t1.push(bldate+':'+item[1]);
                list_t2.push(item[1]);
            }
            
            textarea1.push(list_t1);
            textarea2.push(list_t2);            
        }
        var bljg='<textarea>'+textarea1.join('\n')+'</textarea>';
        bljg=bljg+'<textarea>'+textarea2.join('\n')+'</textarea>';        
        return bljg;
    }
    //-----------------------
    var oinput=document.getElementById('input_search');
    var key_name=oinput.value.replace(/\s+/g,' ').trim();   //去掉重复的空格 -保留注释
    var is_multi_keys=klmenu_check_b('span_mutli_keys_flot_rmrb_online_common',false);
    if (is_multi_keys){
        key_name=key_name.split(' ');
        search_common(key_name[0],1,false);
    } else {
        key_name=[key_name];
    }
    
    var blxl=0;
    var bllen=key_name.length;
    var flot_arr=[];
    var textarea_data=[];
    sub_statistics_rmrb_online_one_key();
}

function col_rearrange_rmrb_online(){    
    var is_merge=klmenu_check_b('span_merge_show_rmrb_online_common',false);
    if (!is_merge){return js_data_current_common_search_global;}
    
    var list_t=[];
    for (let arow of js_data_current_common_search_global){
        var bllink='https://rmrb.online/simple/?'+arow[0][0];
        var bldate=arow[0][1].substring(0,4)+'年'+arow[0][1].slice(-2,)+'月';
        list_t.push([[bldate,'<a href="'+bllink+'" target=_blank>'+arow[0][2]+'</a>'],arow[1]]);
    }
    return list_t;
}

function merge_data_rmrb_online(ospan){    
    var flist=flist_get_rmrb_online();
    flist=flist.slice(1,);
    
    for (let blxl=0,lent=flist.length;blxl<lent;blxl++){
        flist[blxl]=flist[blxl][1];
    }

    merge_data_common(flist,ospan);
}

function upload_data_files_rmrb_online(csarr){
    function sub_upload_data_files_rmrb_online_run(csresult){
        rmrb_online_global=csresult;
        arr_len_refresh_common();
        alert('导入完成');
    }
    
    merge_js_lines_from_file_list_b(csarr,'[',sub_upload_data_files_rmrb_online_run);
}
