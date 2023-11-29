function directors_multimedia(){
    var dlist=[];    
    for (let arow of moviedata_global){
        if (arow['Directors']==undefined){continue;}
        if (arow['rating']==undefined){
            console.log(arow['Title'],'not found rating');
            continue;
        }
        dlist.push([arow['Title'],arow['Directors'],'',arow['rating']]);
    }
    return dlist;
}

function imdb_sort_multimedia(iname='Director',cssplit=false){
    var dlist=[];  
    var parallel_dict={'Release Date':'Release date','Gross USA':'Gross US & Canada'};
    for (let arow of moviedata_global){
        if (arow['rating']==undefined){
            console.log(arow['Title'],'not found rating');
            continue;
        }
        var blrating=arow['rating'];
        if (blrating.length==1){
            blrating=blrating+'.0';
        }
        
        var blvalue='';
        if (arow[iname]==undefined){
            if (iname in parallel_dict){
                if (parallel_dict[iname] in arow){
                    blvalue=arow[parallel_dict[iname]];
                }
            }
            else if (iname+'s' in arow){
                blvalue=arow[iname+'s'];
            }
        }
        else {
            blvalue=arow[iname];
        }
        
        if (iname=='Motion Picture Rating (MPAA)'){
            if (blvalue.substring(0,6)=='Rated '){
                blvalue=blvalue.substring(6,);
            }
            blvalue=blvalue.trim().split(' ')[0];
        }
        else if (iname=='Gross USA' && blvalue.trim().substring(0,1)=='$'){
            blvalue=(blvalue.trim().substring(1,).split(' ')[0]).replace(new RegExp(',','g'),'');
        }
        else if (iname=='Runtime'){
            var blhour=blvalue.replace(/^(\d+)\s*hours?.*$/g,'$1');
            var blmin=blvalue.replace(/^(\d+\s*hours?\s*)?(\d+)\s*minutes\s*$/g,'$2');
            if (blhour!=='' && !isNaN(blhour)){
                blhour=parseInt(blhour)*60;
            }
            else {
                blhour=0;
            }
            
            if (blmin!=='' && !isNaN(blmin)){
                blmin=parseInt(blmin);
            }
            else {
                blmin=0;
            }
            if (blhour>0 || blmin>0){
                blvalue=(blhour+blmin).toString();
            }
            
            blvalue=blvalue.trim().split('\|')[0].split(' ')[0];
        }
        else if (iname=='Release Date'){
            blvalue=(blvalue.match(/\d{4}/) || [''])[0];
        }
        
        if (blvalue!==''){
            if (cssplit==false){
                dlist.push([blvalue,blrating,arow['Title']]);
            }
            else {
                blvalue=blvalue.replace(/\|/g,',');
                var value_list=blvalue.split(',');
                for (let item of value_list){
                    if (item.trim()==''){continue;}
                    dlist.push([item.split('(')[0].trim(),blrating,arow['Title']]);
                }
            }
        }        
    }
    
    var dlist2=[];
    for (let item of dlist){
        if (dlist2[item[0]]==undefined){
            dlist2[item[0]]=[item[0],0,'',0,''];
        }
        dlist2[item[0]][1]=dlist2[item[0]][1]+1;
        dlist2[item[0]][3]=dlist2[item[0]][3]+parseFloat(item[1]);
        dlist2[item[0]][4]=dlist2[item[0]][4]+item[2]+',';
    }
    
    var dlist3=[];
    for (let key in dlist2){
        dlist3.push(dlist2[key]);
    }
    for (let blxl=0;blxl<dlist3.length;blxl++){
        dlist3[blxl][3]=(dlist3[blxl][3]/dlist3[blxl][1]).toFixed(2);
        if (dlist3[blxl][4].slice(-1)==','){
            dlist3[blxl][4]=dlist3[blxl][4].substring(0,dlist3[blxl][4].length-1);
        }
    }
    if (iname=='Gross USA' || iname=='Runtime'){
        dlist3.sort(
            function(a,b){
                if (parseFloat(b[0])==parseFloat(a[0])){
                    return b[3]-a[3];
                }
                else {
                    return parseFloat(b[0])-parseFloat(a[0]);
                }
            }
        );
    }
    else if (iname=='Release Date'){
        dlist3.sort();
    }
    else {
        dlist3.sort(
            function(a,b){
                if (b[1]==a[1]){
                    return b[3]-a[3];
                }
                else {
                    return b[1]-a[1];
                }
            }
        );
    }
    return dlist3;
}

function douban_sort_multimedia(csno){
    //"肖申克的救赎  / The Shawshank Redemption  / 月黑高飞(港)/刺激1995(台)","弗兰克·德拉邦特 Frank Darabont",1994, ["美国",], ["犯罪","剧情",], 9.6
    //0 片名；1 导演；2 年份；3 国家；4 类型；5 得分；
    var blnoname_t=document.getElementById('check_no_name').checked;
    var bljg='';
    var dlist2=[];
    for (let arow of moviedata_global){
        var zd_t=arow[csno];

        if (csno==3 || csno==4){
            for (let nation_or_type of zd_t){
                if (dlist2[nation_or_type]==undefined){
                    //片名，csno，数量，分数
                    dlist2[nation_or_type]=['',nation_or_type,0,0];
                }
                if (blnoname_t==false){
                    dlist2[nation_or_type][0]=dlist2[nation_or_type][0]+arow[0].split('/')[0].trim()+'('+arow[5]+'), ';
                }
                dlist2[nation_or_type][2]=dlist2[nation_or_type][2]+1;
                dlist2[nation_or_type][3]=dlist2[nation_or_type][3]+arow[5];
            }
        }
        else {
            if (dlist2[zd_t]==undefined){
                //片名，csno，数量，分数
                dlist2[zd_t]=['',zd_t,0,0];
            }
            if (blnoname_t==false){            
                dlist2[zd_t][0]=dlist2[zd_t][0]+arow[0].split('/')[0].trim()+'('+arow[5]+'), ';
            }
            dlist2[zd_t][2]=dlist2[zd_t][2]+1;
            dlist2[zd_t][3]=dlist2[zd_t][3]+arow[5];
        }
    }
    
    var dlist3=[];
    for (let key in dlist2){
        dlist3.push(dlist2[key]);
    }
    for (let blxl=0;blxl<dlist3.length;blxl++){
        dlist3[blxl][3]=dlist3[blxl][3]/dlist3[blxl][2];
        if (dlist3[blxl][0].slice(-2)==', '){
            dlist3[blxl][0]=dlist3[blxl][0].substring(0,dlist3[blxl][0].length-2);
        }
    }
    
    if (csno==2){
        dlist3.sort(function (a,b){return a[1]-b[1];});
    }
    else if (csno==5){
        dlist3.sort(function (a,b){return b[1]-a[1];});
    }
    else {
        dlist3.sort(
            function(a,b){
                if (b[2]==a[2]){
                    return b[3]-a[3];
                }
                else {
                    return b[2]-a[2];
                }
            }
        );
    }
    
    if (csno==2){
        var theyear_t=dlist3[0][1];
    }
    
    for (let item of dlist3){
        if (csno==1 && item[2]<=1){break;}
        if (csno==2){
            while (theyear_t<item[1]-1){
                theyear_t=theyear_t+1;
                bljg=bljg+'<li>'+theyear_t+', 0, 0, </li>\n';
            }
        }
        bljg=bljg+'<li>'+item[1]+', '+item[2];
        
        if (csno!==5){
            bljg=bljg+', '+item[3].toFixed(2);
        }
        if (item[0]==''){
            bljg=bljg+'</li>\n';
        }
        else {
            bljg=bljg+', '+item[0]+'</li>\n';
        }
        if (csno==2){
            theyear_t=item[1];
        }
    }
    return bljg;
}

function douban_main_multimedia(){
    var bljg=douban_sort_multimedia(1);
    var bljg3=douban_sort_multimedia(3);
    var bljg5=douban_sort_multimedia(4);
    var bljg10=douban_sort_multimedia(2);
    var bljg11=douban_sort_multimedia(5);
    //-----------------------
    document.getElementById('divhtml').innerHTML=
    '<h3>有2部及以上作品的导演</h3><ol>'+bljg+'</ol>'
    +'<h3>国家排序</h3><ol>'+bljg3+'</ol>'
    //+'<h3>2部及以上作品的编剧</h3><ol>'+bljg4+'</ol>'
    +'<h3>影片类型</h3><ol>'+bljg5+'</ol>'
    //+'<h3>影片语言</h3><ol>'+bljg6+'</ol>'
    //+'<h3>影片票房</h3><ol>'+bljg7+'</ol>'
    //+'<h3>影片时长</h3><ol>'+bljg8+'</ol>'
    //+'<h3>影片色彩</h3><ol>'+bljg9+'</ol>'
    +'<h3>影片发行年份</h3><ol>'+bljg10+'</ol>'
    +'<h3>影片评分</h3><ol>'+bljg11+'</ol>';
    //+'<h3>影片评级</h3><ol>'+bljg12+'</ol>';    
}

function tr_generate_multimedia(cslist,cstype,ignore_lt_2=false){
    var bljg=[];
    switch (cstype){
        case '4013':
            for (let blxl=0;blxl<cslist.length;blxl++){
                var item=cslist[blxl];
                if (ignore_lt_2 && item[1]<2){break;}
                bljg.push('<tr><td>'+(blxl+1)+'</td><td>'+item[4]+'</td><td>'+item[0]+'</td><td>'+item[1]+'</td><td>'+item[3]+'</td></tr>');
            }
            break;
        case '01':
            for (let blxl=0;blxl<cslist.length;blxl++){
                var item=cslist[blxl];
                if (ignore_lt_2 && item[1]<2){break;}
                bljg.push('<tr><td>'+(blxl+1)+'</td><td>'+item[0]+'</td><td>'+item[1]+'</td></tr>');
            }        
            break;
        case '013':
            for (let blxl=0;blxl<cslist.length;blxl++){
                var item=cslist[blxl];
                if (ignore_lt_2 && item[1]<2){break;}
                bljg.push('<tr><td>'+(blxl+1)+'</td><td>'+item[0]+'</td><td>'+item[1]+'</td><td>'+item[3]+'</td></tr>');
            }                
            break;
    }
    return bljg.join('\n');
}

function imdb_main_multimedia(){
    var movie_type_list;
    //--director
    movie_type_list=imdb_sort_multimedia('Director',true);
    var bljg=tr_generate_multimedia(movie_type_list,'013',true);

    //--directors
    movie_type_list=directors_multimedia();
    var bljg2=tr_generate_multimedia(movie_type_list,'013',false);

    //--country
    movie_type_list=imdb_sort_multimedia('Country',true);
    var bljg3=tr_generate_multimedia(movie_type_list,'013',false);

    //--writer
    movie_type_list=imdb_sort_multimedia('Writer',true);
    var bljg4=tr_generate_multimedia(movie_type_list,'013',true);

    //--Genres
    movie_type_list=imdb_sort_multimedia('Genres',true);
    var bljg5=tr_generate_multimedia(movie_type_list,'01',true);

    //--Language
    movie_type_list=imdb_sort_multimedia('Language',true);
    var bljg6=tr_generate_multimedia(movie_type_list,'013',false);

    //--Gross USA
    movie_type_list=imdb_sort_multimedia('Gross USA',false);
    var bljg7=tr_generate_multimedia(movie_type_list,'4013',false);

    //--Runtime
    movie_type_list=imdb_sort_multimedia('Runtime',false);
    var bljg8=tr_generate_multimedia(movie_type_list,'4013',false);

    //--Color
    movie_type_list=imdb_sort_multimedia('Color',true);
    var bljg9=tr_generate_multimedia(movie_type_list,'013',false);

    //--Release Date
    movie_type_list=imdb_sort_multimedia('Release Date',false);
    var bljg10='';
    if (movie_type_list.length>0){
        var year_tmp=parseInt(movie_type_list[0][0]);
        for (let item of movie_type_list){
            while (parseInt(item[0])-1>year_tmp){
                year_tmp=year_tmp+1;
                bljg10=bljg10+'<tr><td>'+year_tmp+'</td><td>0</td><td>0</td></tr>\n';  //补足空白年份 - 保留注释
            }
            bljg10=bljg10+'<tr><td>'+item[0]+'</td><td>'+item[1]+'</td><td>'+item[3]+'</td></tr>\n';
            year_tmp=parseInt(item[0]);
        }
    }

    //--rating
    movie_type_list=imdb_sort_multimedia('rating',false);
    var bljg11=tr_generate_multimedia(movie_type_list,'01',false);

    //--MPAA
    movie_type_list=imdb_sort_multimedia('Motion Picture Rating (MPAA)',false);
    var bljg12=tr_generate_multimedia(movie_type_list,'013',false);
    
    document.getElementById('divhtml').innerHTML=
    '<div><h3>有2部及以上作品的导演</h3><table class="table_common">'+bljg+'</table></div>'
    +'<div><h3>有2个及以上导演的影片</h3><table class="table_common">'+bljg2+'</table></div>'
    +'<div><h3>国家/地区排序</h3><table class="table_common">'+bljg3+'</table></div>'
    +'<div><h3>2部及以上作品的编剧</h3><table class="table_common">'+bljg4+'</table></div>'
    +'<div><h3>影片类型</h3><table class="table_common">'+bljg5+'</table></div>'
    +'<div><h3>影片语言</h3><table class="table_common">'+bljg6+'</table></div>'
    +'<div><h3>影片票房</h3><table class="table_common">'+bljg7+'</table></div>'
    +'<div><h3>影片时长</h3><table class="table_common">'+bljg8+'</table></div>'
    +'<div><h3>影片色彩</h3><table class="table_common">'+bljg9+'</table></div>'
    +'<div><h3>影片发行年份</h3><table class="table_common">'+bljg10+'</table></div>'
    +'<div><h3>影片评分</h3><table class="table_common">'+bljg11+'</table></div>'
    +'<div><h3>影片评级</h3><table class="table_common">'+bljg12+'</table></div>';
}

function gate_multimedia(){
    if (multimedia_current_id_global.includes('imdb')){
        imdb_main_multimedia();
    }
    else if (multimedia_current_id_global.includes('douban')){
        douban_main_multimedia();
    }
}

function load_multimedia(){
    var datanum=0;
    var datalist=['douban_data_20181010','imdb_data_20180929','imdb_data_20221012'];

    var bljg='· ';
    for (let blxl=0;blxl<datalist.length;blxl++){
        bljg=bljg+'<a href="imdb.htm?'+blxl+'">'+datalist[blxl]+'</a> · ';
    }
    document.getElementById('span_data_list').innerHTML=bljg;
    
    var cskeys=href_split_b(location.href);
    if (cskeys.length>0){
        if (parseInt(cskeys[0])>=0){
            datanum=Math.min(datalist.length-1,Math.max(0,parseInt(cskeys[0])));
        }
    }

    multimedia_current_id_global=datalist[datanum];     //全局变量 - 保留注释

    moviedata_global=[];    //全局变量 - 保留注释
    klbase_addons_import_js_b([],[],['imdb/'+multimedia_current_id_global+'.js']);
    document.getElementById('span_title').innerHTML=multimedia_current_id_global;
    document.title='🎬 '+multimedia_current_id_global+' - IMDb Analyze';
}

function menu_multimedia(){
    var str_t=klmenu_hide_b('');
    var klmenu1=[
    '<a href="https://www.imdb.com/chart/top/" onclick="'+str_t+'" target=_blank>IMDb Top 250</a>',    
    '<a href="https://movie.douban.com/top250" onclick="'+str_t+'" target=_blank>豆瓣 Top 250</a>',        
    ];

    document.getElementById('span_title').insertAdjacentHTML('beforebegin',klmenu_multi_button_div_b(klmenu_b(klmenu1,'🎬','10rem','1rem','1rem','60rem'),'','0rem')+' ');
    klmenu_check_b('span_reg_kltemplate',true);        
}

function init_multimedia(){
    top_bottom_arrow_b('div_top_bottom','',false,(ismobile_b()?'1.8rem':'1.6rem'));
    menu_multimedia();
}
