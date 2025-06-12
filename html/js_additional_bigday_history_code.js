function style_load_bigday_history(){
    var blstr='#divhtml br {margin-bottom:0.5rem;}';
    style_generate_b(blstr,true);
}

function file_load_bigday_history(){
    flot_load_common(['date','flot'],['time','symbol']);
}

function data_load_bigday_history(array_name){
    var result_t=[];
    for (let adata of eval(array_name)){
        adata[0]=adata[0].replace(/m(\d+)d(\d+)/g,'$1月$2日');
        for (let arow of adata[1]){
            if (!arow.includes(adata[0])){
                arow=adata[0]+'，'+arow;
            }
            result_t.push(arow);
        }
    }
    eval(array_name+'=result_t');
    raw_data_len_jscm_global=result_t.length;
    document.getElementById('span_count').innerText='('+raw_data_len_jscm_global+')';
}

function col_rearrange_bigday_history(){
    var is_merge=klmenu_check_b('span_merge_show_bigday_history_common',false);
    if (!is_merge){return js_data_current_common_search_global;}
    
    var list_t={};
    for (let arow of js_data_current_common_search_global){
        //[ "1863年1月1日，现代奥林匹克之父 Pierre de Coubertin 皮埃尔·德·顾拜旦诞生于巴黎一个信仰天主教的贵族家庭", 1 ] - 保留注释
        var bldate=arow[0].match(/\d+月\d+日/);
        if (bldate==null){continue;}
        if (list_t[bldate]==undefined){
            list_t[bldate]=[];
        }
        list_t[bldate].push(arow[0]);
    }
    list_t=object2array_b(list_t,true);
    for (let blxl=0,lent=list_t.length;blxl<lent;blxl++){
        var md=list_t[blxl].shift();
        md=('0'+md.split('月')[0]).slice(-2,)+'月'+('0'+md.split('月')[1]).slice(-3,);
        list_t[blxl]=[[md,list_t[blxl].join('<br />'),list_t[blxl].length],-1];
    }
    return list_t;
}

function menu_more_bigday_history(){
    var str_t=klmenu_hide_b('');
    var klmenu1=[
    '<span id="span_merge_show_bigday_history_common" class="span_menu" onclick="'+str_t+'klmenu_check_b(this.id,true);">⚪ 合并展示</span>',        
    '<span class="span_menu" onclick="'+str_t+'statistics_bigday_history(\'md\');">逐日分布</span>',   
    '<span class="span_menu" onclick="'+str_t+'statistics_bigday_history(\'m\');">逐月分布</span>',   
    '<span class="span_menu" onclick="'+str_t+'statistics_bigday_history(\'y\');">逐年分布</span>',   
    ];
    return klmenu_b(klmenu1,'📉','8rem','1rem','1rem','30rem');
}

function statistics_bigday_history(cstype){
    if (js_data_current_common_search_global.length==0){return;}
    if (js_data_current_common_search_global[0].length>0){
        if (Array.isArray(js_data_current_common_search_global[0][0])){
            alert('不支持合并显示');
            return;
        }
    }
    
    var result_t=[];
    var caption='';
    var is_time=false;
    switch (cstype){
        case 'md':
            var md_list={};
            for (let item of js_data_current_common_search_global){
                var the_date=item[0].split('日')[0]+'日';
                if (the_date.includes('年')){
                    the_date=the_date.split('年')[1];
                }
                the_date='md_'+the_date;
                if (md_list[the_date]==undefined){
                    md_list[the_date]=0;
                }
                md_list[the_date]=md_list[the_date]+1;
            }
            list_t=object2array_b(md_list,true,3);
            for (let item of list_t){
                item[0]=validdate_b('2000年'+item[0]);
                if (item[0]===false){continue;}
                result_t.push(item);
            }
            
            result_t.sort(function (a,b){return a[0]>b[0] ? 1 : -1;});
            result_t=date_list_insert_zero_b(result_t);
            caption='逐日分布';
            is_time=true;
            break;
        case 'm':
            var m_list={};
            for (let blxl=1;blxl<=12;blxl++){
                m_list['m_'+('0'+blxl).slice(-2,)]=0;
            }
                        
            for (let item of js_data_current_common_search_global){
                var the_month=item[0].split('月')[0];
                if (the_month.includes('年')){
                    the_month=the_month.split('年')[1];
                }
                the_month='m_'+('0'+the_month).slice(-2,);
                m_list[the_month]=m_list[the_month]+1;
            }
            result_t=object2array_b(m_list,true,2);
            for (let blxl=0,lent=result_t.length;blxl<lent;blxl++){
                result_t[blxl][0]=parseInt(result_t[blxl][0]);
            }
            result_t.sort(function (a,b){return a[0]>b[0] ? 1 : -1;});
            caption='逐月分布';
            break;
        case 'y':
            var y_list={};
            for (let item of js_data_current_common_search_global){
                if (item[0].match(/^\d+年/)==null){continue;}
                var one_year='y_'+item[0].split('年')[0];
                if (y_list[one_year]==undefined){
                    y_list[one_year]=0;
                }
                y_list[one_year]=y_list[one_year]+1;
            }
            result_t=object2array_b(y_list,true,2);
            for (let blxl=0,lent=result_t.length;blxl<lent;blxl++){
                result_t[blxl][0]=parseInt(result_t[blxl][0]);
            }
            result_t.sort(function (a,b){return a[0]>b[0] ? 1 : -1;});
            caption='逐年分布';
            break;
    }
    
    var blbutton='<p>'+close_button_b('div_status_common','','aclick')+'</p>';
    var odiv=document.getElementById('div_status_common');
    odiv.innerHTML='<div id="div_status_common_sub" style="width:100%; height:600px;"></div>'+blbutton;

    result_t=[caption].concat(result_t);
    flot_lines_b([result_t],'div_status_common_sub','nw',is_time,'','d','条',0);
    odiv.scrollIntoView();
}
