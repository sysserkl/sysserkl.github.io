function import_data_klsda(){
    var data_type=datalist_global[0];

    var cskeys=href_split_b(location.href);
    for (let bltmpstr of cskeys){
        if (bltmpstr.substring(0,5)=='type='){
            data_type=bltmpstr.substring(5,).trim();
        }
    }
    document.write('\n<script src="../jsdata/sda/'+data_type+'_data.js"><\/SCRIPT>\n');
    console.log('../jsdata/sda/'+data_type+'_data.js');
    document.getElementById('h2_title').innerHTML=data_type;
}

function batch_lines_klsda(){
    function sub_batch_lines_klsda_one_item(){
        draw_lines_klsda();
        if (oselect.selectedIndex<oselect.length-1){
            oselect.selectedIndex++;
            setTimeout(sub_batch_lines_klsda_one_item,blinterval);
        }
    }
    //-----------------------
    var blinterval=document.getElementById('input_interval').value*1000;
    var oselect=document.getElementById('select_item');
    sub_batch_lines_klsda_one_item();
}

function menu_klsda(){
    var str_t=klmenu_hide_b('');
    var klmenu1=[
    '<a href="http://tjj.zj.gov.cn/" onclick="'+str_t+'" target=_blank>浙江省统计局</a>',    
    '<a href="http://data.tjj.zj.gov.cn/" onclick="'+str_t+'" target=_blank>数据浙江</a>',    
    ];

    var menu_dbf=[];
    for (let item of datalist_global){
        menu_dbf.push('<a href="?type='+item+'">'+item+'</a>');
    }
    
    var klmenu_config=[
    '<span class="span_menu" onclick="'+str_t+'batch_lines_klsda();">折线图批量</span>',
    ];
    
    klmenu_config=klmenu_config.concat(root_font_size_menu_b(str_t));
    
    document.getElementById('h2_title').insertAdjacentHTML('afterbegin',klmenu_multi_button_div_b(klmenu_b(klmenu1,'','10rem','1rem','1rem','60rem')+klmenu_b(menu_dbf,'🛢','14rem','1rem','1rem','60rem')+klmenu_b(klmenu_config,'⚙','15rem','1rem','1rem','60rem'),'','0rem')+' ');
}


function options_klsda(csyear=-1,csvalue=-1){
    var bljg='';
    for (let item of analyze_item_year_global){
        if (csyear==item){
            bljg=bljg+'<option selected>'+item+'</option>';
        } else {
            bljg=bljg+'<option>'+item+'</option>';
        }
    }
    document.getElementById('select_year').innerHTML=bljg;
    
    var bljg='';
    for (let item of analyze_item_name_global){
        if (csvalue==item){
            bljg=bljg+'<option selected>'+item+'</option>';
        } else {
            bljg=bljg+'<option>'+item+'</option>';
        }
    }
    document.getElementById('select_item').innerHTML=bljg;    
}

function draw_lines_klsda(){
    var selected_options=document.getElementById('select_item').selectedOptions;
    var selected_item_list=[];
    for (let one_option of selected_options){
        selected_item_list.push(one_option.value);
    }
    var selected_item_len=selected_item_list.length;
    var bljg='';
    
    var csyear=parseInt(document.getElementById('select_year').value);
    var csreg=document.getElementById('input_reg').checked;
    var include_citys_t=document.getElementById('input_citys').value.trim();
    
    var list_t={};
    var blat=analyze_item_year_global.indexOf(csyear);
    var year_section=analyze_item_year_global.slice(0,blat+1);
    for (let selected_item of selected_item_list){
        for (let one_city_data of analyze_item_data_global){
            if (one_city_data[0].slice(-1*selected_item.length,)!==selected_item){continue;}
            var blfound=str_reg_search_b(one_city_data[0],include_citys_t.split(' '),csreg);
            if (blfound==-1){break;}
            if (selected_item_len==1){
                var city_t=one_city_data[0].split('_')[0];
            } else {
                var city_t=one_city_data[0];
            }
            if (include_citys_t=='' || blfound){        
                if (list_t[city_t]==undefined){
                    list_t[city_t]=[city_t];
                }
                list_t[city_t]=one_city_data.slice(1,blat+1+1);
                for (let blxl=0,lenb=list_t[city_t].length;blxl<lenb;blxl++){
                    list_t[city_t][blxl]=[year_section[blxl],list_t[city_t][blxl]];
                }
                list_t[city_t].sort();
                list_t[city_t]=[city_t].concat(list_t[city_t]);
            }
        }
    }
    
    year_section.sort();
    bljg=bljg+'<h4>'+selected_item_list.join('、')+'</h4>\n';
    bljg=bljg+'<table>';
    bljg=bljg+'<tr class=odd><td align=center class=blackline>城市'+(selected_item_len>1?'_指标':'')+'</td>';
    for (let item of year_section){
        bljg=bljg+'<td align=center class=blackline>'+item+'年</td>';
    }
    bljg=bljg+'</tr>';
    for (let key in list_t){
        bljg=bljg+'<tr class=odd><td class=blackline0>'+key+'</td>';
        for (let blxl=1,lent=list_t[key].length;blxl<lent;blxl++){
            bljg=bljg+'<td align=right class=blackline0>'+list_t[key][blxl][1].toFixed(2)+'</td>';
        }
        bljg=bljg+'</tr>';
    }
    bljg=bljg+'</table>';
    document.getElementById('divhtml').innerHTML=bljg;
    document.getElementById('div_flot').style.cssText='width:100%;height:'+document.documentElement.scrollHeight*0.5+'px;margin-bottom:30px;';
    list_t=object2array_b(list_t);
    list_t.sort(function (a,b){
        return (a[0].substring(a[0].lastIndexOf('('),)>b[0].substring(b[0].lastIndexOf('('),)) ? 1 : -1;
    });
    
    var split_no=0;
    if (selected_item_len>1){
        for (let blxl=1,lent=list_t.length;blxl<lent;blxl++){ //忽略第一组数据 - 保留注释
            var item_name_current=list_t[blxl][0];
            var item_name_prev=list_t[blxl-1][0];
            if (item_name_current.substring(item_name_current.lastIndexOf('('),)==item_name_prev.substring(item_name_prev.lastIndexOf('('),)){continue;}
            if (split_no==0){
                split_no=blxl;
            } else {
                list_t=list_t.slice(0,blxl);    //不含当前组 - 保留注释
                break;
            }
        }
    }
    if (split_no==0){
        flot_lines_b(list_t,'div_flot');
    } else {
        var unit1=list_t[0][0].substring(list_t[0][0].lastIndexOf('('),).replace('(','').replace(')','');
        var unit2=list_t[list_t.length-1][0].substring(list_t[list_t.length-1][0].lastIndexOf('('),).replace('(','').replace(')','');
        flot_two_lines_two_yaxis_b(list_t,'div_flot',unit1,unit2,'nw',false,'m',2,2,'',[],-1,false,false,false,false,list_t.length-split_no);
    }
}

function draw_pie_klsda(){
    var selected_item=document.getElementById('select_item').value;
    var csyear=parseInt(document.getElementById('select_year').value);    
    var include_citys_t=document.getElementById('input_citys').value.trim();
    var csreg=document.getElementById('input_reg').checked;
    
    var bljg='<h4>'+csyear+'年</h4>\n';
    bljg=bljg+'<br />'+'地区,'+selected_item+'\n';

    var blindex=analyze_item_year_global.indexOf(csyear);

    var chart_data=[];
    for (let one_city_data of analyze_item_data_global){
        if (one_city_data[0].slice(-1*selected_item.length,)!==selected_item){continue;}
        var blfound=str_reg_search_b(one_city_data[0],include_citys_t.split(' '),csreg);
        if (blfound==-1){break;}
        if (include_citys_t=='' ||blfound){        
            bljg=bljg+'<br />'+one_city_data[0].split('_')[0]+', '+one_city_data[blindex+1]+'\n';
            chart_data.push({ label: one_city_data[0].split('_')[0], data: one_city_data[blindex+1]});
        }
    }

    document.getElementById('divhtml').innerHTML=bljg;

    if (document.getElementById('input_sort').checked){
        chart_data.sort(function(a,b){return b.data>a.data ? 1 : -1;});
    }
    document.getElementById('div_flot').style.cssText='width:100%;height:'+document.documentElement.scrollHeight*0.5+'px;margin:30px;';
    flot_pie_b(chart_data,'div_flot');
}

function slide_interval_klsda(){
    var oyear=document.getElementById('select_year');
    var blyear=parseInt(oyear.value);
    draw_pie_klsda();
    blyear=blyear+1;
    if (blyear>analyze_item_year_global[0]){
        clearInterval(global_interval);
    } else {
        oyear.value=blyear;
    }
}

function slide_start_klsda(){
    global_interval=setInterval(slide_interval_klsda,document.getElementById('input_interval').value*1000);
}

function slide_stop_klsda(){
    clearInterval(global_interval);
}

function format_klsda(){
    analyze_item_data_global=analyze_item_data_global.trim().split('\n');
    var years=analyze_item_data_global.shift().trim().split(','); //年份 - 保留注释
    analyze_item_year_global=[];
    for (let blxl=1,lent=years.length;blxl<lent;blxl++){
        analyze_item_year_global.push(parseInt(years[blxl]));
    }
    //analyze_item_year_global 不能sort - 保留注释
    
    analyze_item_name_global=new Set();
    for (let arow=0,lent=analyze_item_data_global.length;arow<lent;arow++){
        analyze_item_data_global[arow]=analyze_item_data_global[arow].trim().split(',');
        var item=analyze_item_data_global[arow][0];
        var blat=item.indexOf('_');
        analyze_item_name_global.add(item.substring(blat+1,));
        for (let acol=1,lenb=analyze_item_data_global[arow].length;acol<lenb;acol++){
            analyze_item_data_global[arow][acol]=parseFloat(analyze_item_data_global[arow][acol]);
        }
    }
    analyze_item_name_global=Array.from(analyze_item_name_global);
}

function raw_data_check_klsda(){
    var category_set=new Set();
    var year_list=[];
    for (let key in sda_raw_data_global){
        year_list.push(key);
        for (let blxl=0,lent=sda_raw_data_global[key].length;blxl<lent;blxl++){
            var arow=sda_raw_data_global[key][blxl];
            if (arow.length!==13){
                console.log(key,arow);
            }
            var one_category=arow[0].trim();
            one_category=one_category.replace(/\t/g,' ');
            one_category=one_category.replace(/\s+/g,' ');
            one_category=one_category.replace(new RegExp('（','g'),'(');
            one_category=one_category.replace(new RegExp('）','g'),')');
            if (one_category.substring(0,1)=='#'){
                one_category='其中：'+one_category.substring(1,).trim();
            }
            var blunit=arow[1].trim();
            blunit=blunit.replace(/[（）\(\)]/g,'');

            sda_raw_data_global[key][blxl][0]=one_category;
            sda_raw_data_global[key][blxl][1]=blunit;
            
            category_set.add(one_category+(blunit==''?'':'('+blunit+')'));
        }
    }
   
    year_list.sort();
    year_list.reverse();
    
    var result_t={};
    for (let ayear of year_list){
        var one_year_data=sda_raw_data_global[ayear];
        for (let arow=1,lent=one_year_data.length;arow<lent;arow++){//忽略第一行 城市名称 - 保留注释
            if (one_year_data[arow].slice(2,).join('')==''){continue;}    //所有值为空 - 保留注释
            for (let acol=2,lenb=one_year_data[arow].length;acol<lenb;acol++){//忽略前2列（指标名称 单位） - 保留注释
                var city_name=one_year_data[0][acol];
                var category_name=one_year_data[arow][0]+(one_year_data[arow][1]==''?'':'('+one_year_data[arow][1]+')');
                if (result_t[city_name+'_'+category_name]==undefined){
                    result_t[city_name+'_'+category_name]=[city_name+'_'+category_name];
                }
                result_t[city_name+'_'+category_name].push(one_year_data[arow][acol]==''?parseInt(''):one_year_data[arow][acol]);
            }
        }
    }

    analyze_item_name_global=new Set();
    analyze_item_data_global=[];
    
    var bllen=year_list.length+1;
    for (let key in result_t){
        if (result_t[key].length!==bllen){
            //console.log(result_t[key]); //此行保留 - 保留注释
        } else {
            analyze_item_data_global.push(result_t[key]);
            
            var blat=key.indexOf('_');
            analyze_item_name_global.add(key.substring(blat+1,));            
        }
    }
    analyze_item_name_global=Array.from(analyze_item_name_global);
    
    analyze_item_year_global=[];
    for (let one_year of year_list){
        analyze_item_year_global.push(parseInt(one_year));
    }
    options_klsda();
}

function init_klsda(){
    if (document.getElementById('h2_title').innerHTML!=='zj_11_raw'){
        format_klsda();
    } else {
        raw_data_check_klsda();
    }
    menu_klsda();
    options_klsda();
}

function change_option_klsda(csvalue){
    var oselect = document.getElementById('select_item');

    if (oselect.selectedIndex>0 && csvalue==-1){
        oselect.selectedIndex--;
    } else if (oselect.selectedIndex<oselect.length-1 && csvalue==1){
        oselect.selectedIndex++;
    }
}

function show_hide_klsda(){
    var odiv=document.getElementById('div_buttons');
    odiv.style.display=(odiv.style.display==''?'none':'');
}
