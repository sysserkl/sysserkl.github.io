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
    '<a href="https://www.zjuss.cn/experts" onclick="'+str_t+'" target=_blank>省妇保</a>',
    '<a href="https://www.zjuss.cn/experts" onclick="'+str_t+'" target=_blank>浙大口腔</a>',    
    '<span class="span_menu" onclick="'+str_t+'surname_zjuss();">当前条件姓氏统计</span>',
    '<span class="span_menu" onclick="'+str_t+'same_name_zjuss();">同一医院内相同名称的医生</span>',
    '<span class="span_menu" onclick="'+str_t+'same_content_zjuss();">简介相同的医生</span>',
    ];
    return klmenu_b(klmenu1,'🦷','16rem','1rem','1rem','30rem');
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

    var blbutton='<p>'+close_button_b('div_status_common','','aclick')+'</p>';

    var odiv=document.getElementById('div_status_common');
    odiv.innerHTML=array_2_li_b(surname_dict)+blbutton;
    odiv.scrollIntoView();
}

function same_name_zjuss(){
    var name_set=new Set();
    for (let item of zjuss_expert_global){
        let blname=item[1].match(/>(.*?)_\d+<\/a>/) || ['',''];
        if (blname[0]!==''){
            //blname 形如：[ ">陈佳琦_2</a>", "陈佳琦" ] - 保留注释
            name_set.add(blname[1]);
        }
    }
    
    document.getElementById('input_search').value='>('+Array.from(name_set).join('|')+')(_\\d+)?<';
    search_common();
}

function same_content_zjuss(){
    var content_list=[];
    for (let item of zjuss_expert_global){
        content_list.push([item[1],item[2]]);
    }
    content_list.sort(function (a,b){return a[1]>b[1]?-1:1;});
    
    var name_set=new Set();
    for (let blxl=1,lent=content_list.length;blxl<lent;blxl++){
        if (content_list[blxl][1]==content_list[blxl-1][1]){
            let blname=content_list[blxl][0].match(/>(.*?)(_\d+)?<\/a>/) || ['','',''];
            //blname 形如：[ ">周炯_2</a>", "周炯", "_2" ] 或 [ ">周庆芳</a>", "周庆芳", undefined ] - 保留注释
            name_set.add(blname[1]);
            
            blname=content_list[blxl-1][0].match(/>(.*?)(_\d+)?<\/a>/) || ['','',''];
            name_set.add(blname[1]);
        }
    }
    
    document.getElementById('input_search').value='>('+Array.from(name_set).join('|')+')(_\\d+)?<';
    search_common();
}
