function menu_more_nobel_prize(){
    table_th_jscm_global={'year':'','category':'','name':'','country':'','achievement':'','group':''};
    
    var str_t=klmenu_hide_b('');
    var klmenu1=[
    '<span id="span_table_data_hide_nobel_prize" class="span_menu" onclick="'+str_t+'klmenu_check_b(this.id,true);">⚪ 不显示表格数据</span>',    
    '<a href="https://www.britannica.com/topic/Nobel-Prize/The-prizes" onclick="'+str_t+'" target=_blank>Nobel Prize - Britannica</a>',        
    '<span class="span_menu" onclick="'+str_t+'search_common(\'^20\\\\d{2}$\');">2000年及以来</span>',       
    '<span class="span_menu" onclick="'+str_t+'countries_nobel_prize();">当前条件国家统计</span>',   
    '<span class="span_menu" onclick="'+str_t+'ten_years_nobel_prize();">当前条件10年统计</span>',   
    ];
    return klmenu_b(klmenu1,'🧮','16rem','1rem','1rem','30rem');
}

function file_load_nobel_prize(){
    flot_load_common(['flot'],['pie']);
}

function data_load_nobel_prize(array_name){
    for (let blxl=0,lent=nobel_prize_global.length;blxl<lent;blxl++){
        if (nobel_prize_global[blxl].length==4){
            nobel_prize_global[blxl].push('');
        } else if (nobel_prize_global[blxl].length<4){
            console.log('error',nobel_prize_global[blxl]);
        }
    }
        
    nobel_prize_global.sort(function (a,b){return a[1]>b[1] ? 1 : -1;});
    nobel_prize_global.sort(function (a,b){return a[0]>b[0] ? 1 : -1;});
    
    year_group={};
    for (let item of nobel_prize_global){
        if (year_group['y_'+item[0]]==undefined){
            year_group['y_'+item[0]]={};
        }
        
        if (year_group['y_'+item[0]]['t_'+item[1]]==undefined){
            year_group['y_'+item[0]]['t_'+item[1]]=0;
        }
        year_group['y_'+item[0]]['t_'+item[1]]=year_group['y_'+item[0]]['t_'+item[1]]+1;
    }
    
    for (let blxl=0,lent=nobel_prize_global.length;blxl<lent;blxl++){
        var ykey='y_'+nobel_prize_global[blxl][0];
        var tkey='t_'+nobel_prize_global[blxl][1];
        if (isNaN(year_group[ykey][tkey])){
            console.log('error',ykey,tkey,year_group[ykey][tkey]);
        }
        nobel_prize_global[blxl].push(year_group[ykey][tkey]);
    }
}

function ten_years_nobel_prize(){
    var yc_list={};
    var bltotal=0;    
    var max_year=0;
    for (let item of js_data_current_common_search_global){
        max_year=Math.max(max_year,parseInt(item[0][0]));
    }    
    
    for (let item of js_data_current_common_search_global){
        var arow=item[0];
        if (isNaN(arow[5])){console.log(arow);}
        bltotal=bltotal+1/arow[5];

        if (arow[0].slice(-1)=='0'){
            var blgroup=(parseInt(arow[0])-1).toString();
        } else {
            var blgroup=arow[0];
        }
        blgroup=blgroup.substring(0,3)+'1-'+Math.min(max_year,parseInt(blgroup.substring(0,3))*10+10);

        var ykey='y_'+blgroup
        if (yc_list[ykey]==undefined){
            yc_list[ykey]={};
        }

        var country_list=arow[3].split('/');
        var bllen=country_list.length*arow[5];
        for (let one_country of country_list){
            var cyear='c_'+one_country
            if (yc_list[ykey][cyear]==undefined){
                yc_list[ykey][cyear]=0;
            }
            yc_list[ykey][cyear]=yc_list[ykey][cyear]+1/bllen;
        }
    }

    console.log(bltotal); //此行保留 - 保留注释

    var hide_table_data=klmenu_check_b('span_table_data_hide_nobel_prize',false);        
    var odiv=document.getElementById('divhtml');    
    odiv.innerHTML='';
    
    for (let ykey in yc_list){
        if (hide_table_data){
            var sub_div=document.createElement('div');
            sub_div.style.cssText='position:relative;float:left;';
            odiv.appendChild(sub_div);
        }
        pie_nobel_prize(yc_list[ykey],bltotal,(hide_table_data?sub_div:odiv),hide_table_data,'div_flot_'+ykey,'350px','',ykey.substring(2,));
    }
    
    console.log(yc_list);
}

function countries_nobel_prize(){
    var countries={};
    var bltotal=0;
    for (let item of js_data_current_common_search_global){
        var country_list=item[0][3].split('/');
        var bllen=country_list.length*item[0][5];
        bltotal=bltotal+1/item[0][5];
        for (let one_country  of country_list){
            if (countries['c_'+one_country]==undefined){
                countries['c_'+one_country]=0;
            }
            countries['c_'+one_country]=countries['c_'+one_country]+1/bllen;
        }
    }
    console.log(bltotal); //此行保留 - 保留注释

    var odiv=document.getElementById('divhtml');    
    odiv.innerHTML='';
    
    var hide_table_data=klmenu_check_b('span_table_data_hide_nobel_prize',false);        
    pie_nobel_prize(countries,bltotal,odiv,hide_table_data);
}

function pie_nobel_prize(countries,cstotal,odiv,hide_table_data=false,flot_id='div_flot',flot_size='600px',head_caption='',tail_caption=''){
    countries=object2array_b(countries,true,2);
    countries.sort();
    countries.sort(function (a,b){return a[1]<b[1] ? 1 : -1;});
    
    var flot_list=[];
    var others=0;
    for (let blxl=0,lent=countries.length;blxl<lent;blxl++){
        if (blxl>=10){
            others=others+countries[blxl][1];
        } else {
            flot_list.push({'label':countries[blxl][0],'data':countries[blxl][1]});
        }
    
        countries[blxl]='<tr><td>'+(blxl+1)+'</td><td>'+countries[blxl][0]+'</td><td align="right">'+countries[blxl][1].toFixed(2)+'</td><td align="right">'+(countries[blxl][1]*100/cstotal).toFixed(2)+'%</td></tr>';
    }
    
    if (others>0){
        flot_list.push({'label':'Others','data':others});
    }
    
    if (head_caption!==''){
        head_caption='<tr><th colspan=4>'+head_caption+'</th></tr>';
    }
    if (!hide_table_data){
        var bljg='<table class="table_common">'+head_caption;
        bljg=bljg+'<tr><th>No.</th><th>Country</th><th>Count</th><th>Percent</th></tr>';
        bljg=bljg+countries.join('\n');
    } else {
        var bljg='<table>'+head_caption;    
    }
    bljg=bljg+'<tr><td colspan=4 align="center"><div id="'+flot_id+'" style="width:'+flot_size+';height:'+flot_size+';"></div></td></tr>';
    if (tail_caption!==''){
        bljg=bljg+'<tr><th colspan=4>'+tail_caption+'</th></tr>';
    }
    bljg=bljg+'</table>';
    odiv.insertAdjacentHTML('beforeend',bljg);
    flot_pie_b(flot_list,flot_id);
}
