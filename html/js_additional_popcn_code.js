function menu_more_popcn(){
    var str_t=klmenu_hide_b('');
    var year_range=[];
    for (let blxl=0;blxl<=95;blxl=blxl+5){
        year_range.push('<option>'+blxl+'</option>');
    }
    var klmenu1=[
    '<a href="https://data.stats.gov.cn/easyquery.htm?cn=C01" onclick="'+str_t+'" target=_blank>国家数据</a>',    
    '<span class="span_menu" onclick="'+str_t+'percent_popcn();">指定年龄段人口占比</span>',    
    '<span class="span_menu">指定年龄段：<select id="select_year_range_jsad_popcn">'+year_range.join('\n')+'</select> 性别：<select id="select_gender_jsad_popcn"><option>男性</option><option>女性</option></select></span>',    
    ];
    return klmenu_b(klmenu1,'🧓','18rem','1rem','1rem','30rem');
}

function data_load_popcn(array_name){
    table_th_jscm_global={'指标':'','2023年':'right','2022年':'right','2021年':'right','2019年':'right','2018年':'right','2017年':'right','2016年':'right','2015年':'right','2014年':'right','2013年':'right','2012年':'right','2011年':'right','2009年':'right','2008年':'right','2007年':'right','2006年':'right','2005年':'right','2004年':'right'};

    var blkeys=Object.keys(table_th_jscm_global);
    var index_list=[blkeys.indexOf('2005年'),blkeys.indexOf('2015年')];
    
    for (let blxl=0,lent=population_cn_global.length;blxl<lent;blxl++){
        for (let acol of index_list){
            population_cn_global[blxl].splice(acol,1);
        }
    }
    
    delete table_th_jscm_global['2015年'];
    delete table_th_jscm_global['2005年'];
}

function file_load_popcn(){
    flot_load_common(['date','flot'],['time','symbol']);
}

function percent_popcn(){
    var old_date={};
    var year_start=parseInt(document.getElementById('select_year_range_jsad_popcn').value);
    var gender_type=document.getElementById('select_gender_jsad_popcn').value;
    
    for (let arow of population_cn_global){
        var gender=arow[0].slice(-2,);
        if (gender!==gender_type){continue;}
        
        var blyear_str=arow[0].split('岁')[0].split('-')[0];
        var blyear_num=parseInt(blyear_str);
        if (blyear_num<year_start){continue;}
        
        var blkey=blyear_str+'_'+gender;
        old_date[blkey]=[blyear_num].concat(arow.slice(1,));
    }

    for (let key1 in old_date){
        for (let key2 in old_date){
            if (key1.slice(-2,)!==key2.slice(-2,)){continue;}
            if (old_date[key2][0]<=old_date[key1][0]){continue;}
            
            for (let blcol=1,lent=old_date[key1].length;blcol<lent;blcol++){
                old_date[key1][blcol]=old_date[key1][blcol]+old_date[key2][blcol];
            }
        }
    }

    var year_list=Object.keys(table_th_jscm_global);
    var flot_arr=[];
    for (let key in old_date){
        if (key==year_start+'_'+gender_type){continue;}
        for (let blcol=1,lent=old_date[key].length;blcol<lent;blcol++){
            old_date[key][blcol]=[parseInt(year_list[blcol].slice(0,4)),old_date[key][blcol]*100/old_date[year_start+'_'+gender_type][blcol]];
        }
        var blname=key.split('_');
        flot_arr.push([blname[0]+'岁～+∞岁'].concat(old_date[key].slice(1,)));
    }

    var odiv=document.getElementById('div_status_common');
    odiv.innerHTML='<h4>中国各年龄段在≥'+year_start+'岁人群中的比例（'+gender_type+'）</h4><div id="div_status_common_sub" style="width:100%; height:1500px;"></div>';
    flot_lines_b(flot_arr,'div_status_common_sub','nw',false,'','','%');
    odiv.scrollIntoView();      
    
    console.log(flot_arr);
}
