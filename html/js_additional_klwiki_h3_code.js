function col_rearrange_klwiki_h3(){
    var list_t=[];
    var blstyle='color:'+scheme_global['memo']+';font-size:0.8rem;';
    for (let arow of js_data_current_common_search_global){
        list_t.push(['<a href="'+arow[0][0]+'" target=_blank>'+arow[0][1]+'</a> <span style="'+blstyle+'">('+arow[0][2]+')</span>',arow[1]]);
    }
    return list_t;
}

function data_load_klwiki_h3(array_name){
    eval(array_name).sort(function (a,b){return a[1]<b[1];});
}

function menu_more_klwiki_h3(){
    var str_t=klmenu_hide_b('');
    var klmenu1=[
    '<span class="span_menu" onclick="'+str_t+'host_klwiki_h3();">host statistics</span>',    
    '<span class="span_menu" onclick="'+str_t+'years_count_klwiki_h3();">年度统计</span>',    
    '<span class="span_menu" onclick="'+str_t+'weibo_rank_klwiki_h3();">微博用户排行</span>',    
    '<span class="span_menu" onclick="'+str_t+'weixin_rank_klwiki_h3();">微信公众号排行</span>',    
    '<span class="span_menu" onclick="'+str_t+'temp_form_klwiki_h3();">临时数据输入</span>',   
    ];
    return klmenu_b(klmenu1,'🌎','12rem','1rem','1rem','30rem');
}

function temp_form_klwiki_h3(){
    var blstr='<textarea id="textarea_temp_statistics_klwiki_h3" style="height:20rem;"></textarea>';
    var blbutton='<p>'+close_button_b('div_form_common','','aclick')+'</p>';
    var odiv=document.getElementById('div_form_common');
    odiv.innerHTML=blstr+blbutton;
    odiv.scrollIntoView();
}

function years_count_klwiki_h3(){
    var result_t={};
    var not_found_count=0;
    var csarray=array_chose_klwiki_h3();
    for (let arow of csarray){
        var blstr=arow.toString();
        var list_t=blstr.match(/(http[^\s]*?,|>)(\d{8})\s\|\s/) || [];
        if (list_t.length==0){
            list_t=blstr.match(/(http[^\s]+)\s(\d{8})\s\|\s/) || [];
        }
        
        if (list_t.length==3){
            var blyear='y_'+list_t[2].substring(0,4);
            var blym='y_'+list_t[2].substring(0,6);
            if (result_t[blyear]==undefined){
                result_t[blyear]=0;
            }
            result_t[blyear]=result_t[blyear]+1;

            if (result_t[blym]==undefined){
                result_t[blym]=0;
            }
            result_t[blym]=result_t[blym]+1;            
        }
        else {
            not_found_count=not_found_count+1;
            console.log('not found:',not_found_count,blstr);
        }
    }
    result_t=object2array_b(result_t,true,2);
    result_t.sort(function (a,b){return a[0]>b[0];});
    
    var bljg=[];
    var ym_list=[];
    for (let item of result_t){
        if (item[0].length==4){
            if (ym_list.length>0){
                bljg.push('<p>'+ym_list.join('; ')+'</p>');
            }
            bljg.push('<h3>🔵 '+item[0]+'年: '+item[1]+'</h3>');
            ym_list=[];
        }
        else {
            ym_list.push('⚪ '+item[0].slice(-2,)+'月: '+item[1]);
        }
    }    
    if (ym_list.length>0){
        bljg.push('<p>'+ym_list.join('; ')+'</p>');
    }    

    var blbutton='<p>'+close_button_b('div_status_common','','aclick')+'</p>';
    var odiv=document.getElementById('div_status_common');
    odiv.innerHTML=bljg.join('\n')+blbutton;
    odiv.scrollIntoView();    
}

function weixin_rank_klwiki_h3(){
    var result_t={};
    var not_found_count=0;
    var csarray=array_chose_klwiki_h3();
    for (let arow of csarray){
        var blstr=arow.toString();
        if (!blstr.includes('mp.weixin.qq.com')){continue;}
        
        var blkey='';
    
        var list_t=blstr.match(/\- (.*?)<\/a>/) || [];
        if (list_t.length==2){  //[ " - 棒约翰</a>", "棒约翰" ] - 保留注释
            blkey=list_t[1].trim();
        }
        
        if (list_t.length==0){
            var list_t=blstr.match(/\|\s(.*?)：/) || [];
            if (list_t.length==2){  //[ "| 和菜头：", "和菜头" ] - 保留注释
                blkey=list_t[1].trim();
            }
        } 
        
        if (list_t.length==0){
            var list_t=blstr.match(/\s\|\s.*\s\-\s(.*?),/) || [];
            if (list_t.length==2){  //[ " | 要担心「WiFi 辐射」的危害么? - 小道消息,", "小道消息" ] - 保留注释
                blkey=list_t[1].trim();
            }
        }         
        
        if (blkey.slice(-2,)==']"'){
            blkey=blkey.slice(0,-2);
        }
        
        if (blkey=='' || blkey.length>100){
            not_found_count=not_found_count+1;
            console.log('not found:',not_found_count,blstr);
            continue;
        }
        
        blkey='w_'+blkey;
        if (result_t[blkey]==undefined){
            result_t[blkey]=0;
        }
        result_t[blkey]=result_t[blkey]+1;
    }
    rank_2_html_klwiki_h3(result_t,'weixin');
}

function rank_2_html_klwiki_h3(cslist,cstype='',ignore_value=1){
    cslist=object2array_b(cslist,true,2);
    cslist.sort(function (a,b){return zh_sort_b(a,b,false,0);});
    cslist.sort(function (a,b){return a[1]<b[1];});
    var blat=-1;
    for (let blxl=0;blxl<cslist.length;blxl++){
        if (cslist[blxl][1]==ignore_value){
            blat=blxl;
            break;
        }
        
        if (cstype=='weibo'){
            cslist[blxl]='<a href="https://weibo.com/n/'+encodeURIComponent(cslist[blxl][0])+'" target=_blank>'+cslist[blxl][0]+'</a>：<span class="span_rank_count_klwiki_h3">'+cslist[blxl][1]+'</span>';
        }
        else {
            cslist[blxl]=cslist[blxl][0]+'：<span class="span_rank_count_klwiki_h3">'+cslist[blxl][1]+'</span>';        
        }
    }
    
    var others=0;
    if (blat>-1){
        var others=0;
        for (let blxl=blat;blxl<cslist.length;blxl++){
            others=others+cslist[blxl][1];
        }
        cslist=cslist.slice(0,blat);
    }
    if (others>0){
        cslist.push('others：'+others);
    }
    
    var blbuttons='<p>';
    blbuttons=blbuttons+'<span class="aclick" onclick="website_style_klwiki_h3(this);">网址库风格</span>';
    blbuttons=blbuttons+close_button_b('div_status_common','','aclick');
    blbuttons=blbuttons+'</p>';
    var odiv=document.getElementById('div_status_common');
    odiv.innerHTML=array_2_li_b(cslist)+blbuttons;
    odiv.scrollIntoView();
}

function website_style_klwiki_h3(ospan){
    var odiv=document.getElementById('div_status_common');
    var olis=odiv.querySelectorAll('li');
    var result_t=[];
    for (let one_li of olis){
        var oa=one_li.querySelector('a');
        if (!oa){continue;}
        var ocount=one_li.querySelector('span.span_rank_count_klwiki_h3');
        var blhref=oa.href;
        if (!blhref){continue;}
        var bltitle=oa.innerText;
        if (blhref.includes('weibo')){
            bltitle=bltitle+' - 微博';
        }
        var blcount=(ocount?ocount.innerText:'10');
        result_t.push('"'+blhref+'","","'+bltitle+'",'+blcount+',""');
    }
    odiv.insertAdjacentHTML('beforeend','<textarea style="height:30rem;">'+result_t.join('\n')+'</textarea>');
    ospan.outerHTML='';
}

function weibo_rank_klwiki_h3(){
    var result_t={};
    var not_found_count=0;
    var csarray=array_chose_klwiki_h3();
    for (let arow of csarray){
        var blstr=arow.toString();
        if (!blstr.includes('微博') && !blstr.includes('weibo.com') && !blstr.includes('weibo.cn')){continue;}
        
        var blkey='';
        var list_t=blstr.match(/\s*\-\s*(来自)?(.*?)\s*\-\s*微博/) || [];
        if (list_t.length==3){  //[ " - 人走茶凉-m-j-z - 微博", undefined, "人走茶凉-m-j-z" ] 或 [ " - 来自亮菁菁shining - 微博", "来自", "亮菁菁shining" ] - 保留注释
            blkey=list_t[2].trim();
        }
        
        if (list_t.length==0){
            var list_t=blstr.match(/\|\s(.*?)的(新浪)?微博/) || [];
            if (list_t.length==3){  //[ "| 小洢洢的新浪微博", "小洢洢", "新浪" ] 或 [ "| blt超市的微博", "blt超市", undefined ] - 保留注释
                blkey=list_t[1].trim();
            }
        }

        if (list_t.length==0){
            var list_t=blstr.match(/\s*\.{3,}\s+(来自)?(.*?)\s*\-\s*微博/) || [];
            if (list_t.length==3){  //[ " ... 来自中国气象爱好者 - 微博", "来自", "中国气象爱好者" ] - 保留注释 
                blkey=list_t[2].trim();
            }
        }
        
        if (list_t.length==0){
            var list_t=blstr.match(/\s来自(.*?)\s*\-\s*微博/) || [];
            if (list_t.length==2){
                blkey=list_t[1].trim();
            }
        }        
        
        if (list_t.length==0){
            var list_t=blstr.match(/\|\s(.*?)[：].* - 微博<\/a>/) || [];
            if (list_t.length==2){  //[ "|  曹山石：省长也看朋友圈。 - 微博</a>", " 曹山石" ] - 保留注释
                blkey=list_t[1].trim();
            }
        }
        
        if (list_t.length==0){
            var list_t=blstr.match(/ \- (.*?)<\/a>/) || [];
            if (list_t.length==2){  //[ " - 地球知识局</a>", "地球知识局" ] - 保留注释
                blkey=list_t[1].trim();
            }
        }
        
        if (list_t.length==0){
            var list_t=blstr.match(/\|\s(.*?)：/) || [];
            if (list_t.length==2){  //[ "| 薛兆丰：", "薛兆丰" ] - 保留注释
                blkey=list_t[1].trim();
            }
        }

        if (blkey.substring(0,1)=='@'){
            blkey=blkey.substring(1,);
        }

        if (blkey.slice(-3,)=='的微博'){
            blkey=blkey.slice(0,-3);
        }        
        
        if (blkey=='' || blkey.length>100){
            not_found_count=not_found_count+1;
            console.log('not found:',not_found_count,blstr);
            continue;
        }
        
        blkey='w_'+blkey;
        if (result_t[blkey]==undefined){
            result_t[blkey]=0;
        }
        result_t[blkey]=result_t[blkey]+1;
    }
    rank_2_html_klwiki_h3(result_t,'weibo');
}

function array_chose_klwiki_h3(){
    var otextarea=document.getElementById('textarea_temp_statistics_klwiki_h3');
    if (otextarea){
        var blstr=otextarea.value.trim();
        if (blstr!==''){
            return blstr.split('\n');
        }
    }
    return js_data_current_common_search_global;
}

function host_klwiki_h3(){
    var not_found_count=0;
    var category_list={};    
    var csarray=array_chose_klwiki_h3();
    for (let arow of csarray){
        var blstr=arow.toString();  //形如：<a href="https://xxxxx" target=_blank>20221125 | bbbbb</a> <span style="cccc">(dddd)</span>,589 或 http://xxxxx.shtml,20170719 | bbbb,cccc,12783- 保留注释
        var blhref=blstr.match(/http[^\s]+/) || []; //统计 host，无须考虑 https://xxxxx" 或 http://xxxxx.shtml,20170719 这样的情况 - 保留注释
        if (blhref.length==1){
            try {
                var ourl = new URL(blhref[0]);
            }
            catch (e){
                console.log(e);
                continue;
            }
            var one_host=ourl.host;
            var blkey='h_'+one_host;
            if (category_list[blkey]==undefined){
                category_list[blkey]=0;
            }
            category_list[blkey]=category_list[blkey]+1;                
        }
        else {
            not_found_count=not_found_count+1;
            console.log('not found:',not_found_count,blstr);
        }
    }
    
    rank_2_html_klwiki_h3(category_list,'host',0);
}
