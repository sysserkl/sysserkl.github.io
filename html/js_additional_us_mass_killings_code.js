function menu_more_us_mass_killings(){
    var str_t=klmenu_hide_b('');

    var col_name_list=Object.keys(table_th_jscm_global);
    var klmenu1=[
    '<a href="https://projects.apnews.com/features/2023/mass-killings/index.html" onclick="'+str_t+'" title="Database of mass killings and shootings in the US" target=_blank>Database - AP</a>',

    klmenu_select_sort_b('select_sort_type_jsad_umk',col_name_list,str_t,'sort_us_mass_killings',true,true,[['group_us_mass_killings','当前结果分组排行']]),
    ];
    
    if (var_name_jscm_global=='us_mass_killings_incidents_global'){
        klmenu1.push('<span class="span_menu" onclick="'+str_t+'gps_news_generate_mass_killings();">当前结果生成GPS News格式</span>');
    }
    return klmenu_b(klmenu1,'🩸','24rem','1rem','1rem','30rem');
}

function sort_us_mass_killings(is_desc=false,rank_no=false){
    if (rank_no===false){
        rank_no=parseInt(document.getElementById('select_sort_type_jsad_umk').value);
    }
    
    if (rank_no!==0){
        if (is_desc){
            eval(var_name_jscm_global).sort(function (a,b){return a[rank_no]<b[rank_no] ? 1 : -1;});
        } else {
            eval(var_name_jscm_global).sort(function (a,b){return a[rank_no]>b[rank_no] ? 1 : -1;});    
        }
    } else {
        eval(var_name_jscm_global).sort(function (a,b){return zh_sort_b(a[rank_no].slice(4,),b[rank_no].slice(4,),is_desc);});
    }
}

function group_us_mass_killings(){
    function sub_group_us_mass_killings_sort(csarr){
        var bltotal=0;
        csarr.sort(function (a,b){return a[1]<b[1] ? 1 : -1});
        for (let blxl=0,lent=csarr.length;blxl<lent;blxl++){
            bltotal=bltotal+csarr[blxl][1];
            csarr[blxl]='<tr><td>'+csarr[blxl][0]+'</td><td align=right>'+csarr[blxl][1]+'</td></tr>';
        }    
        csarr.push('<tr><td>➕</td><td align=right>'+bltotal+'</td></tr>');
        return csarr;
    }
    
    var oselect=document.getElementById('select_sort_type_jsad_umk');
    var rank_no=parseInt(oselect.value);
    
    var list_t=[];
    for (let item of js_data_current_common_search_global){
        list_t.push(item[0][rank_no]);
    }
    
    var count_list=list_category_count_b(list_t);
    
    var sum_list=[];
    if (num_col_get_us_mass_killings().includes(rank_no)){
        sum_list=list_category_count_b(list_t,-1,false,true);
    }
    
    var odiv=document.getElementById('div_status_common');
    var buttons='<p>'+close_button_b('div_status_common','')+'</p>';
    
    var bljg='<h4>'+oselect.options[rank_no].text+'</h4><table class="table_common"><tr><th>value</th><th>count</th></tr>'+sub_group_us_mass_killings_sort(count_list).join('\n')+'</table>';
    
    if (sum_list.length>0){
        bljg=bljg+'<table class="table_common"><tr><th>value</th><th>sum</th></tr>'+sub_group_us_mass_killings_sort(sum_list).join('\n')+'</table>';
    }
    
    bljg=bljg+buttons;
    
    odiv.innerHTML=bljg;
    odiv.scrollIntoView();
}

function gps_news_generate_mass_killings(){
    var result_t=[];
    for (let arow of js_data_current_common_search_global){
        var item=arow[0];
        result_t.push(`"${item[1]}","","${item[2]}(${item[3]}), ${item[7]}, 凶嫌${item[4]}人，杀死${item[5]}人，受伤${item[6]}人","","",${item[13]},${item[14]}`);
    }
    
    var odiv=document.getElementById('div_status_common');

    var left_str='<p>'+close_button_b('div_status_common','')+' ';
    var right_str='</p>';
    var bljg=textarea_with_form_generate_b('textarea_us_mass_killings','height:10rem;',left_str,'清空,复制,发送到临时记事本,发送地址',right_str,'','',false,result_t.join('\n'));

    odiv.innerHTML=bljg;
    odiv.scrollIntoView();
}

function num_col_get_us_mass_killings(){
    if (var_name_jscm_global=='us_mass_killings_offenders_global'){
        return num_col=[0,3];
    } else {
        return num_col=[0,4,5,6];
    }
}

function data_load_us_mass_killings(array_name){
    if (var_name_jscm_global=='us_mass_killings_offenders_global'){
        table_th_jscm_global={'incident id':'','outcome':'','sex':'','age':''};
    } else {
        table_th_jscm_global={'incident id':'','date':'','city':'','state':'','offenders':'','victims killed':'','victims injured':'','firstcod':'','secondcod':'','type':'','situation type':'','location type':'','location':'','longitude':'','latitude':''};
    }
    
    var num_col=num_col_get_us_mass_killings();

    var blarr=eval(array_name);
    var bllen=Object.keys(table_th_jscm_global).length;
    for (let blxl=0,lent=blarr.length;blxl<lent;blxl++){
        var changed='';
        while (blarr[blxl].length<bllen){
            blarr[blxl].push('');
            changed='添加列；';
        }
        
        for (let one_col of num_col){
            if (blarr[blxl][one_col] === ''){   //不能使用 == ，会把 数值 0 改为 -1 - 保留注释
                blarr[blxl][one_col]=-1;
                changed=changed+'转换为-1；';
            } else if (typeof blarr[blxl][one_col] == 'string'){
                blarr[blxl][one_col]=parseInt(blarr[blxl][one_col]);
                //changed=changed+'转换为数值；'; //此行保留 - 保留注释
            }
        }
        
        if (changed!==''){
            console.log(changed,blarr[blxl]);
        }
    }
    eval(array_name+'=blarr');
}
