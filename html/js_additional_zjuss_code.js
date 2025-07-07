function data_load_zjuss(){
    var t0=performance.now();   

    zjuss_expert_global.sort(function (a,b){return zh_sort_b(a,b,false,0);});
    zjuss_expert_global.sort(function (a,b){return zh_sort_b(a,b,false,2);});
    var result_t=[];
    for (let arow of zjuss_expert_global){
        arow[2]='<a href="'+arow[1]+'" target=_blank>'+arow[2]+'</a>';
        arow[3]=array_2_li_b(arow[3].split('\n'),'li','ul');

        result_t.push([arow[0],arow[2],arow[3]]);
    }
    zjuss_expert_global=result_t;
    
    console.log('data_load_zjuss 费时：'+(performance.now() - t0) + ' milliseconds');    
}

function menu_more_zjuss(){
    var str_t=klmenu_hide_b('');

    table_th_jscm_global={'医院':'','姓名':'','介绍':''};
    var col_name_list=Object.keys(table_th_jscm_global);

    var klmenu1=[    
    '<a href="https://www.zy91.com/department/doctor_list" onclick="'+str_t+'" target=_blank>浙一</a>',
    '<a href="https://www.z2hospital.com/doct.html" onclick="'+str_t+'" target=_blank>浙二</a>',    
    '<a href="https://www.srrsh.com/expertList/" onclick="'+str_t+'" target=_blank>邵逸夫</a>',
    '<a href="https://www.zjuss.cn/experts" onclick="'+str_t+'" target=_blank>浙大口腔</a>',    
    '<span class="span_menu" onclick="'+str_t+'surname_zjuss();">当前条件姓氏统计</span>',
    
    ];
    return klmenu_b(klmenu1,'🦷','12rem','1rem','1rem','30rem');
}

function surname_zjuss(){
    var surname_dict={};
    for (let item of js_data_current_common_search_global){
        var blkey=item[0][1].split(/[<>]/)[2].substring(0,1); //数组形如：[ "", 'a href="https://www.zjuss.cn/%E6%BB%95%E9%A3%9E" target=_blank', "滕飞", "/a", "" ] - 保留注释
        if (surname_dict['s_'+blkey]==undefined){
            surname_dict['s_'+blkey]=0;
        }
        surname_dict['s_'+blkey]=surname_dict['s_'+blkey]+1;
    }
    
    surname_dict=object2array_b(surname_dict,true,2);
    surname_dict.sort(function (a,b){return zh_sort_b(a,b,false,0);});
    surname_dict.sort(function (a,b){return a[1]>b[1]?-1:1;});
    
    var odiv=document.getElementById('div_status_common');
    odiv.innerHTML=array_2_li_b(surname_dict);
    odiv.scrollIntoView();
}
