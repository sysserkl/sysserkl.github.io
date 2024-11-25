function menu_more_us_mass_killings(){
    var str_t=klmenu_hide_b('');
    
    var klmenu1=[
    '<a href="https://projects.apnews.com/features/2023/mass-killings/index.html" onclick="'+str_t+'" title="Database of mass killings and shootings in the US" target=_blank>Database - AP</a>',
    ];
    
    if (var_name_jscm_global=='us_mass_killings_incidents_global'){
        klmenu1.push('<span class="span_menu" onclick="'+str_t+'gps_news_generate_mass_killings();">当前结果生成GPS News格式</span>');
    }
    return klmenu_b(klmenu1,'🩸','16rem','1rem','1rem','30rem');
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

function data_load_us_mass_killings(array_name){
    if (var_name_jscm_global=='us_mass_killings_offenders_global'){
        table_th_jscm_global={'incident_id':'','outcome':'','sex':'','age':''};
        var num_col=[0,3];
    } else {
        table_th_jscm_global={'incident_id':'','date':'','city':'','state':'','num_offenders':'','num_victims_killed':'','num_victims_injured':'','firstcod':'','secondcod':'','type':'','situation_type':'','location_type':'','location':'','longitude':'','latitude':''};
        var num_col=[0,4,5,6];
    }

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
