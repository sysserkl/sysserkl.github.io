function menu_more_nobel_prize(){
    var str_t=klmenu_hide_b('');
    var klmenu1=[
    '<a href="https://www.britannica.com/topic/Nobel-Prize/The-prizes" onclick="'+str_t+'" target=_blank>Nobel Prize - Britannica</a>',        
    '<span class="span_menu" onclick="'+str_t+'search_common(\'^20\\\\d{2}$\');">2000年及以来</span>',       
    '<span class="span_menu" onclick="'+str_t+'countries_nobel_prize();">当前条件国家统计</span>',   
    ];
    return klmenu_b(klmenu1,'🧮','16rem','1rem','1rem','30rem');
}

function file_load_nobel_prize(){
    flot_load_common(['flot'],['pie']);
}

function countries_nobel_prize(){
    var countries={};
    for (let item of js_data_current_common_search_global){
        var country_list=item[0][3].split('/');
        var bllen=country_list.length;
        for (let one_country  of country_list){
            if (countries['c_'+one_country]==undefined){
                countries['c_'+one_country]=0;
            }
            countries['c_'+one_country]=countries['c_'+one_country]+1/bllen;
        }
    }
    countries=object2array_b(countries,true,2);
    countries.sort();
    countries.sort(function (a,b){return a[1]<b[1];});
    var flot_list=[];
    var others=[];
    for (let blxl=0;blxl<countries.length;blxl++){
        if (blxl>=10){
            others=others+countries[blxl][1];
        }
        else {
            flot_list.push({'label':countries[blxl][0],'data':countries[blxl][1]});
        }
    
        countries[blxl]='<tr><td>'+(blxl+1)+'</td><td>'+countries[blxl][0]+'</td><td align="right">'+countries[blxl][1].toFixed(2)+'</td></tr>';
    }
    flot_list.push({'label':'others','data':others});
    
    var bljg='<table class="table_common"><tr><th>No.</th><th>Country</th><th>Count</th></tr>';
    bljg=bljg+countries.join('\n')+'</table>';
    bljg=bljg+'<div id="div_flot" style="width:600px;height:600px;"></div>';
    var odiv=document.getElementById('divhtml');    
    odiv.innerHTML=bljg;
    flot_pie_b(flot_list,'div_flot');
}
