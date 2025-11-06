function import_files_offline_file_browser(){
    if (!is_local_b()){return;}
    var flist=['bash/data/file_browser_data/offline_file_data.js','data/important_movie_data.js'];
    for (let blxl=0,lent=flist.length;blxl<lent;blxl++){
        flist[blxl]='../../../../'+flist[blxl];
    }
    klbase_addons_import_js_b([],[],[],flist);
    //-----------------------
    var flist=tf_page_count_b('../../../../data/ssd_tf_file_list','_data.js');
    flist=klbase_addons_import_js_b([],[],[],flist,false,false,true);

    var today=file_date_parameter_b();
    ssd_tf_file_list_merged_global=[];
    for (let one_file of flist){
        document.write('\n<script src="'+one_file+today+'"><\/script>\n');
        console.log(one_file+today);
        document.write('<script>\n');
        document.write('ssd_tf_file_list_merged_global=ssd_tf_file_list_merged_global.concat(ssd_tf_file_list_raw_global);\n');
        document.write('ssd_tf_file_list_raw_global=[];\n');            
        document.write('</script>\n');    
    }
}

function disk_relation_offline_file_browser(){
    function sub_disk_relation_offline_file_browser_size(cspath){
        if (cspath.endsWith('/')){
            cspath=cspath.slice(0,-1);
        }
        return path_disk_size_ofb_global[0]['p_'+cspath][1] || 0;
    }
    
    function sub_disk_relation_offline_file_browser_one(cskey,csvalue){
        cskey='d_'+cskey;
        if (disk_dict[cskey]==undefined){
            disk_dict[cskey]=new Set();
        }
        disk_dict[cskey].add(csvalue);    
    }
    
    var disk_dict={};
    var connection_count_dict={};
    size_calculate_offline_file_browser();
    
    var is_kmg=klmenu_check_b('span_kmg_ofb',false);

    for (let item of disk_category_list_global){
        sub_disk_relation_offline_file_browser_one(item[0],item[2]);
        sub_disk_relation_offline_file_browser_one(item[2],item[0]);
        let blkey=[item[0],item[2]];
        blkey.sort();
        blkey='c_'+blkey.join('_');
        if (connection_count_dict[blkey]==undefined){
            connection_count_dict[blkey]=[0,0];
        }
        connection_count_dict[blkey][0]=connection_count_dict[blkey][0]+1;

        let blsize=Math.max(sub_disk_relation_offline_file_browser_size(item[1]),sub_disk_relation_offline_file_browser_size(item[3]));
        connection_count_dict[blkey][1]=connection_count_dict[blkey][1]+blsize;
    }
    
    disk_dict=object2array_b(disk_dict,true,2);
    disk_dict.sort();
    var lent=disk_dict.length;
    for (let blxl=0;blxl<lent;blxl++){
        disk_dict[blxl][1]=Array.from(disk_dict[blxl][1]);
        disk_dict[blxl][1].sort();
    }

    connection_count_dict=object2array_b(connection_count_dict,true,2);
    connection_count_dict.sort();
    connection_count_dict.sort(function (a,b){return a[1]<b[1]?-1:1;});
    connection_count_dict.sort(function (a,b){return a[2]<b[2]?-1:1;});
    if (is_kmg){
        for (let blxl=0,lenb=connection_count_dict.length;blxl<lenb;blxl++){
            connection_count_dict[blxl][2]=kbmbgb_b(connection_count_dict[blxl][2]);
        }
    }
    for (let blxl=0,lenb=connection_count_dict.length;blxl<lenb;blxl++){
        let item=connection_count_dict[blxl];
        connection_count_dict[blxl]='<tr><td>'+item[0]+'</td><td align=right>'+item[1]+'</td><td align=right>'+item[2]+'</td></tr>';
    }    
    
    var intersection2_list=[];
    for (let blx=0;blx<lent;blx++){
        for (let bly=0;bly<lent;bly++){
            if (blx>=bly){continue;}
            let blintersection=array_intersection_b([disk_dict[blx][0]].concat(disk_dict[blx][1]),[disk_dict[bly][0]].concat(disk_dict[bly][1]));
            blintersection.sort();
            let intersection_color=(blintersection.includes(disk_dict[blx][0]) || blintersection.includes(disk_dict[bly][0])?scheme_global['memo']:scheme_global['a']);
            intersection2_list.push([[disk_dict[blx][0],disk_dict[bly][0]],blintersection,intersection_color]);
        }
    }
    
    for (let blxl=0,lenb=intersection2_list.length;blxl<lenb;blxl++){
        let item=intersection2_list[blxl];
        intersection2_list[blxl]='<span style="color:'+item[2]+'; font-weight:bold;">'+item[0][0]+'∩'+item[0][1]+'('+item[1].length+'):</span> '+item[1].join(' ');
    }
    
    for (let blxl=0;blxl<lent;blxl++){
        disk_dict[blxl]=disk_dict[blxl][0]+': '+disk_dict[blxl][1].join(' ');
    }
    
    document.getElementById('div_disk_intersection').innerHTML=array_2_li_b(disk_dict)+array_2_li_b(intersection2_list)+'<table class="table_common">'+connection_count_dict.join('\n')+'</table>';
}

function disk_category_offline_file_browser(csxl=0){
    if (disk_category_list_global.length==0){return;}
    sort_des_global=!sort_des_global;
    disk_category_list_global.sort(function(a,b){return zh_sort_b(a,b,sort_des_global,csxl);});
    var bljg='<tr><th style="cursor:pointer;" onclick="disk_category_offline_file_browser(0);">磁盘1</th><th style="cursor:pointer;" onclick="disk_category_offline_file_browser(1);">目录1</th><th style="cursor:pointer;" onclick="disk_category_offline_file_browser(2);">磁盘2</th><th style="cursor:pointer;" onclick="disk_category_offline_file_browser(3);">目录2</th></tr>';
    
    var blfilter=document.getElementById('input_disk_category').value.trim();
    var class_set=new Set();
    for (let item of disk_category_list_global){
		var blfound=str_reg_search_b(item,blfilter,true);
		if (blfound==-1){break;}
        if (blfilter=='' || blfound){
            var bltype=item[1].split(/\-?\d+/)[0];
            var disk2=[item[0],item[2]];
            disk2.sort();
            bltype='tr_'+disk2.join('_')+'_'+bltype;
            class_set.add(bltype);
            bljg=bljg+'<tr class="'+bltype+'"><td>'+item[0]+'</td><td>'+item[1]+'</td><td>'+item[2]+'</td><td>'+item[3]+'</td></tr>';
        }
    }
    
    document.getElementById('table_disk_category').innerHTML=bljg;
    
    //class_set 形如："tr_S2_S4_save", "tr_S2_S3_待整理", ​​"tr_S2_S5_待整理", ​​"tr_S2_S4_待看" - 保留注释
    
    for (let one_class of class_set){
        var otrs=document.querySelectorAll('tr.'+one_class);
        if (otrs.length<=1){continue;}
        for (let one_tr of otrs){
            one_tr.style.background=scheme_global['skyblue'];
        }
    }
}

function window_offline_file_browser(csnumber){
    var otd1=document.getElementById('td_content_1');
    var otd2=document.getElementById('td_content_2');
    if (csnumber==2){
        if (otd2.innerHTML==''){
            otd1.style.width='50%';
            otd2.style.width='50%';        
            td_offline_file_browser('td_content_2');
            if (offline_file_category_global.length>0){
                dir_offline_file_browser(offline_file_category_global[0][0]);
            }
        }
    } else if (csnumber==1){
        td_offline_file_browser('td_content_1');
        otd1.style.width='100%';
        otd1.style.borderColor='white';
        otd2.innerHTML='';
        otd2.style.width='';
    }
}

function keys_offline_file_browser(cskeys=''){
    recent_search_b('keys_offline_file_browser',cskeys,'search_offline_file_browser','div_recent_search',['^0[3-9]:(:r)', '+save-\\d\\d-a/ +(\\.|[^0-9])\\d{4}(\\.|年) +/完整影视/ +.(mkv|rmvb|mp4|rm|avi|flv)$(:r)', '+待看0 -副本', '+待看0 +副本/', '+生活记录 +Photos -\\.txt(:r)','.rmvb','+💖 +save +-a/','+^\\d+:(:r)','-(TFA|ssd)\\d+ +save-\\d+-[ab](:r)','+wikiuploads +\\b'+(date_2_ymd_b(false,'y')-20)+'-[0-9]{2}-[0-9]{2}\\b(:r)'],20);
}

function statistics_offline_file_browser(csarray=false,showhtml=true,size_col=3,time_col=5){
    if (typeof offline_file_data_raw_global=='undefined'){return;}
    
    var t0 = performance.now();

    var blsize=0;
    var bltime=[0,0,0];
    var isfullarray=false;
    if (csarray===false){
        //全部统计 - 保留注释
        csarray=offline_file_data_raw_global;
        isfullarray=true;
    }
    for (let item of csarray){
        blsize=blsize+item[size_col];
        //时长 - 保留注释
        if (Array.isArray(item[time_col])){
            bltime[0]=bltime[0]+item[time_col][0];
            bltime[1]=bltime[1]+item[time_col][1];
            bltime[2]=bltime[2]+item[time_col][2];
        } else {
            if (item[time_col]==''){continue;}
            
            var list_t=item[time_col].split(':').map(Number);
            if (list_t.length!==3){continue;}   //忽略无 小时:分:秒 格式的数据 - 保留注释

            bltime[0]=bltime[0]+list_t[0];
            bltime[1]=bltime[1]+list_t[1];
            bltime[2]=bltime[2]+list_t[2];
        }
    }
    if (bltime[2]>=60){
        bltime[1]=bltime[1]+Math.floor(bltime[2]/60);
        bltime[2]=bltime[2]-60*Math.floor(bltime[2]/60);
    }
    if (bltime[1]>=60){
        bltime[0]=bltime[0]+Math.floor(bltime[1]/60);
        bltime[1]=bltime[1]-60*Math.floor(bltime[1]/60);
    }
    bltime[2]=bltime[2].toFixed(2);
    
    var bldays=0;
    if (bltime[0]>=24){
        //以2小时/天计算 - 保留注释
        bldays=bltime[0]/2;
    }
    var blmonths=0;
    if (bldays>=30){
        //以30天/月计算 - 保留注释
        blmonths=Math.floor(bldays/30);
        bldays=bldays-30*Math.floor(bldays/30);
    }
    var blyears=0;
    if (blmonths>=12){
        //以12月/年计算 - 保留注释
        blyears=Math.floor(blmonths/12);
        blmonths=blmonths-12*Math.floor(blmonths/12);
    }
    var bljg='';
    if (blyears>0){
        bljg=bljg+blyears+'年';
    }    
    if (blmonths>0){
        bljg=bljg+blmonths+'月';
    }
    if (bldays>0){
        bljg=bljg+bldays+'天';
    }
    if (blmonths>0 || bldays>0){
        bljg=bljg+'(以 2小时/天 和 30天/月、12月/年 计算)';
    }
    if (bljg!==''){
        bljg=' ≈'+bljg;
    }
    
    var kmg_size=blsize;
    if (klmenu_check_b('span_kmg_ofb',false)){
        kmg_size=kbmbgb_b(blsize);
    }
    bljg=current_td_global.slice(-1)+': '+csarray.length+' / '+kmg_size+' / '+bltime.join(':')+bljg;
    if (showhtml){
        document.getElementById('span_statistics').innerHTML=bljg;
    }
    
    if (isfullarray){
        local_storage_today_b('offline_file_browser_statistics',40,csarray.length+' / '+(blsize/1024/1024/1024).toFixed(2)+' / '+(bltime[0]+bltime[1]/60+bltime[2]/3600).toFixed(3),' / ');
    }
    console.log('statistics_offline_file_browser() 费时：'+(performance.now() - t0) + ' milliseconds');    
    return bljg;
}

function td_offline_file_browser(csid,opposite=false){
    if (opposite){
        if (csid=='td_content_1'){
            csid='td_content_2';
        } else {
            csid='td_content_1';
        }
    }
    
    if (current_td_global==csid){return;}
    document.getElementById(current_td_global).style.border='0.2rem solid white';
    current_td_global=csid;
    document.getElementById(current_td_global).style.border='0.2rem solid '+scheme_global['skyblue'];
}

function search_offline_file_browser(csstr='',isreg=-1,csmax=-1,csunique=-1,showhtml=true){
    var t0 = performance.now();
    
    if (csmax==-1){
        csmax=parseInt(document.getElementById('input_return_max_rows_ofb').value) || 10000;
    }
    
    var oinput=document.getElementById('input_search');
    if (oinput && csstr==''){
        csstr=document.getElementById('input_search').value;
    }
    
    csstr=csstr.replace(new RegExp('&amp;','g'),'&');   //&amp; 可能和 & 两样同时存在 - 保留注释
    csstr=csstr.replace(new RegExp('&','g'),'&amp;');
    
    if (csstr.slice(-4,)=='(:r)'){
        isreg=true;
        csstr=csstr.slice(0,-4);
    }
        
    if (oinput){
        oinput.value=csstr;
    }
    if (isreg==-1){
        isreg=klmenu_check_b('span_reg_ofb',false);
    }

    if (csunique==-1){
        csunique=klmenu_check_b('span_unique_ofb',false);
    }

    var check_path_name=klmenu_check_b('span_path_name_ofb',false);
    var blxl=1;
    
    offline_file_data_current_global=[];
    var dir_list=[];
    for (let item of offline_file_data_raw_global){
        var blfound=str_reg_search_b(item,csstr,isreg);
        if (blfound==-1){return;}
        if (blfound==false){
            if (check_path_name){
                if (str_reg_search_b(item[1]+item[2],csstr,isreg)==false){continue;}
            } else {continue;}
        }
        if (csunique){
            if (dir_list.includes(item[1])){continue;}
            dir_list.push(item[1]);
        }
        offline_file_data_current_global.push(item);

        blxl=blxl+1;
        if (blxl>csmax){break;}
    }
    if (showhtml){
        current_2_html_offline_file_browser();
        keys_offline_file_browser(csstr+(isreg?'(:r)':''));
    }
    console.log('search_offline_file_browser() 费时：'+(performance.now() - t0) + ' milliseconds');    
}

function current_2_html_offline_file_browser(){
    statistics_offline_file_browser(offline_file_data_current_global,true);
    search_html_offline_file_browser(offline_file_data_current_global,current_td_global);
}

function fav_and_ssd_tf_generate_offline_file_browser(){
    var do_fav=klmenu_check_b('span_fav_ofb',false);
    var do_ssd_tf=klmenu_check_b('span_ssd_tf_show_ofb',false);
    
    if (important_movie_global.length==0 && ssd_tf_file_list_merged_global.length==0){
        return [do_fav,do_ssd_tf];
    }  //避免重复执行 important_movies_offline_file_browser - 保留注释
    
    if (do_fav || do_ssd_tf){
        important_movies_offline_file_browser(true);
    }
    return [do_fav,do_ssd_tf];
}

function fav_and_ssd_tf_show_offline_file_browser(item,do_fav,do_ssd_tf){
    if (!do_fav && !do_ssd_tf){return '';}
    
    var fav_str='';
    if (do_fav){
        fav_str=(item[6]==''?'':' '+item[6]);
    }
    
    var ssd_tf_str='';
    if (do_ssd_tf){
        ssd_tf_str=(item[7]==''?'':' <span class="span_ssd_tf_mark_ofb">'+item[7]+'</span>');
    }
    
    return fav_str+ssd_tf_str;
}

function search_html_offline_file_browser(cslist,csid,show_review_bookmark=false){
    var odiv=document.getElementById(csid);
    if (!odiv){return;}
    var bljg='<table border=0 width=100% cellpading=0 cellspacing=0><tr style="background-color:'+scheme_global['button']+';"><th>No.</th>';
    var jsfn='td_offline_file_browser(\''+current_td_global+'\');current_2_html_offline_file_browser();';
    var list_t=['Disk','Path','Filename','File Size','Modified Date','Multimedia<br />Length'];
    for (let blxl=0,lent=list_t.length;blxl<lent;blxl++){
        bljg=bljg+'<th style="cursor:pointer;" onclick="sort_offline_file_browser('+blxl+',true); '+jsfn+';">'+list_t[blxl]+'</th>';
    }

    bljg=bljg+'</tr>';
    var str_t='';
    var tr_list=[];
    var all_disks=[];
    var review_bookmark=local_storage_get_b('reveiw_bookmark_ofb');
    var review_bookmark_added=false;
    var is_kmg=klmenu_check_b('span_kmg_ofb',false);  

    var do_fav, do_ssd_tf;
    [do_fav,do_ssd_tf]=fav_and_ssd_tf_generate_offline_file_browser();
    
    for (let item of cslist){
        if (!all_disks.includes(item[0])){
            all_disks.push(item[0]);
        }
        str_t='<td width=1 nowrap align=center>'+item[0]+'</td>';
        str_t=str_t+'<td width=30%>';
        
        str_t=str_t+dir_link_offlie_file_browser('',item[0],item[1]);

        str_t=str_t+'</td>';
        str_t=str_t+'<td width=45%>'+item[2]+fav_and_ssd_tf_show_offline_file_browser(item,do_fav,do_ssd_tf)+'</td>';

        str_t=str_t+size_date_av_len_td_offline_file_browser(item,is_kmg);

        if (show_review_bookmark && review_bookmark==item[2]){
            str_t='<tr id="tr_review_bookmark_'+current_td_global+'" style="background-color:'+scheme_global['skyblue']+';"><td width=1 nowrap align=right class="td_no"></td>'+str_t+'</tr>';        
            show_review_bookmark=false;
            review_bookmark_added=true;
        } else {
            str_t='<tr><td width=1 nowrap align=right class="td_no"></td>'+str_t+'</tr>';
        }
        if (tr_list.includes(str_t)){continue;}
        tr_list.push(str_t);
    }
    
    all_disks.sort();
    var disk_strs='';
    for (let item of all_disks){
        disk_strs=disk_strs+'<span class="oblong_box" onclick="td_offline_file_browser(\''+current_td_global+'\',true);dir_offline_file_browser(\''+item+'\');">'+item+'</span> ';
    }
    
    bljg=bljg+tr_list.join('\n');

    odiv.innerHTML='<p>'+disk_strs+'</p>'+bljg+'</table>';
    mouseover_mouseout_oblong_span_b(odiv.querySelectorAll('span.oblong_box'));
    
    var otds=document.querySelectorAll('#'+current_td_global+' .td_no');
    for (let blxl=0,lent=otds.length;blxl<lent;blxl++){
        otds[blxl].innerHTML=blxl+1;
    }
    
    top_bottom_arrow_b('div_top_bottom',cslist.length+' ');
    if (review_bookmark_added){
        document.getElementById('tr_review_bookmark_'+current_td_global).scrollIntoView();
    }
}

function parent_offline_file_browser(csdisk,csdir=''){
    var list_t=csdir.split('/');
    var str_t='';
    if (list_t.length>2){
        var str_t='';
        for (let blxl=0,lent=list_t.length-1-1;blxl<lent;blxl++){
            str_t=str_t+list_t[blxl]+'/';
        }
    }
    return str_t;
}

function dir_offline_file_browser(csdisk='ALL',csdir='',isreg=-1,use_current=false){
    if (csdisk=='' && csdir==''){
        return dir_html_offline_file_browser([],current_td_global,'','');
    }
    
    var csmax=parseInt(document.getElementById('input_return_max_rows_ofb').value) || 100000;
    
    if (csdisk=='ALL' && csdir==''){
        csdir=document.getElementById('input_search').value;
        keys_offline_file_browser(csdir);   //仅当从 input_search 读取时添加到最近搜索 - 保留注释
    }
    document.getElementById('input_search').value=csdir;
    var blxl=1;
    if (csdir==csdisk){
        csdir='';
    }
    
    csdir=csdir.replace(new RegExp('&amp;','g'),'&');
    csdir=csdir.replace(new RegExp('&','g'),'&amp;');
    csdir=csdir.replace(/'/g,'&#039;');  //此行放在以上两行后 - 保留注释
    
    if (isreg==-1){
        isreg=klmenu_check_b('span_reg_ofb',false);
    }
    
    if (use_current){
        dir_html_offline_file_browser(offline_file_data_current_global,current_td_global,csdisk,csdir);
        return;
    }
    
    offline_file_data_current_global=[];
    
    for (let item of offline_file_data_raw_global){
        if (item[0]!==csdisk && csdisk!=='ALL'){continue;}
        
        if (csdir==''){ //直接磁盘下目录或文件 - 保留注释
            //子文件 - 保留注释
            if (item[1]==''){
                offline_file_data_current_global.push(item);
            } else {
                offline_file_data_current_global.push([item[0],item[1].split('/')[0]+'/','','','','']);
            }
        } else if (item[1]==csdir){ //目录名与传入值相等 - 保留注释
            offline_file_data_current_global.push(item);
        } else if (item[1].substring(0,csdir.length)==csdir){ //传入值是目录名的左侧一部分 - 保留注释
            var str_t=('/'+item[1]).split('/'+csdir)[1];
            str_t=str_t.split('/')[0]+'/';
            offline_file_data_current_global.push([item[0],csdir+str_t,'','','','']);
        } else if (csdisk=='ALL'){
            //传入值是目录名的其中一个子目录 - 保留注释
            var str_t='';
            if (isreg){
                var match_list=null;
                try {
                    match_list=('/'+item[1]).match(new RegExp('.*?'+csdir+'[^/]*?/','i'));
                } catch (error){return;}
            
                if (match_list==null){continue;}
                str_t=match_list[0];
            } else {
                if (item[1].includes(csdir)){
                    str_t=item[1].substring(0,item[1].indexOf(csdir)+csdir.length);
                    if (str_t.slice(-1)!=='/'){
                        var right_part_t=item[1].substring(item[1].indexOf(csdir)+csdir.length,);
                        if (right_part_t.includes('/')){
                            right_part_t=right_part_t.split('/')[0]+'/';
                        }
                        str_t=str_t+right_part_t;
                    }
                } else {continue;}
            }
            if (str_t.substring(0,1)=='/'){
                str_t=str_t.substring(1,);
            }
            offline_file_data_current_global.push([item[0],str_t,'','','','']);
        } else {continue;}
        
        blxl=blxl+1;
        if (csdisk!=='ALL' && blxl>csmax){break;}
    }
    dir_html_offline_file_browser(offline_file_data_current_global,current_td_global,csdisk,csdir);
}

function dir_link_offlie_file_browser(cstype,csdisk,csdir,cscaption=''){
    var is_same=false;
    if (cscaption==''){
        cscaption=csdir;
        is_same=true;
    }
    var str_t='';
    if (cstype=='ALL'){
        str_t='💾 '+csdisk;
        str_t=str_t+' <span style="cursor:pointer" onclick="td_offline_file_browser(\''+current_td_global+'\',true);dir_offline_file_browser(\''+csdisk+'\',\''+csdir+'\');">📁</span> ';
        if (is_same){
            str_t=str_t+'<span style="cursor:pointer" onclick="dir_click_offline_file_browser(this,\''+csdisk+'\');">'+cscaption+'</span>';        
        } else {
            str_t=str_t+'<span style="cursor:pointer" onclick="dir_click_offline_file_browser(this,\''+csdisk+'\',true);" alt="'+csdir+'">'+cscaption+'</span>';
        }
    } else {
        str_t='<span style="cursor:pointer" onclick="td_offline_file_browser(\''+current_td_global+'\',true);dir_offline_file_browser(\''+csdisk+'\',\''+csdir+'\');">';
        if (csdir.includes('/')){
            str_t=str_t+'📁';
        } else {
            str_t=str_t+'💾';
        }
        str_t=str_t+'</span>';
        if (is_same){
            str_t=str_t+'<span style="cursor:pointer" onclick="dir_click_offline_file_browser(this,\''+csdisk+'\');">'+cscaption+'</span>';        
        } else {
            str_t=str_t+'<span style="cursor:pointer" onclick="dir_click_offline_file_browser(this,\''+csdisk+'\',true);" alt="'+csdir+'">'+cscaption+'</span>';
        }
    }

    return str_t;
}

function dir_click_offline_file_browser(odom,csdisk,alt=false){
    td_offline_file_browser(current_td_global);
    if (alt){
        var blstr=odom.getAttribute('alt') || '';
    } else {
        var blstr=odom.innerText;
    }
    dir_offline_file_browser(csdisk,blstr);
}

function size_date_av_len_td_offline_file_browser(item,is_kmg){
    var str_t='<td width=1 nowrap align=right>'+(is_kmg?kbmbgb_b(item[3]):item[3])+'</td>';
    str_t=str_t+'<td width=1 nowrap align=right>'+item[4]+'</td>';
    str_t=str_t+'<td width=1 nowrap align=right>'+item[5]+'</td>';
    return str_t;
}

function dir_html_offline_file_browser(cslist,csid,csdisk,csdir){
    var odiv=document.getElementById(csid);
    if (!odiv){return;}
    var bljg='<table border=0 width=100% cellpading=0 cellspacing=0><tr style="background-color:'+scheme_global['button']+';"><th>No.</th>';

    var jsfn='td_offline_file_browser(\''+current_td_global+'\');dir_offline_file_browser(\''+csdisk+'\',\''+csdir+'\',-1,true)';
    
    bljg=bljg+'<th><span style="cursor:pointer;" title="sort by disk" onclick="sort_offline_file_browser(0,true); '+jsfn+';">Disk</span> / ';
    bljg=bljg+'<span style="cursor:pointer;" title="sort by path" onclick="sort_offline_file_browser(1,true); '+jsfn+';">Path</span> / ';
    bljg=bljg+'<span style="cursor:pointer;" title="sort by filename" onclick="sort_offline_file_browser(2,true); '+jsfn+';">Filename</span></th>';
    bljg=bljg+'<th style="cursor:pointer;" onclick="sort_offline_file_browser(3,true); '+jsfn+';">File Size</th>';
    bljg=bljg+'<th style="cursor:pointer;" onclick="sort_offline_file_browser(4,true); '+jsfn+';">Modified Date</th>';    
    bljg=bljg+'<th style="cursor:pointer;" onclick="sort_offline_file_browser(5,true); '+jsfn+';">Multimedia<br />Length</th>';        

    bljg=bljg+'</tr>';
    var str_t='';
    var tr_list=[];
    var is_kmg=klmenu_check_b('span_kmg_ofb',false);
    
    var do_fav, do_ssd_tf;
    [do_fav,do_ssd_tf]=fav_and_ssd_tf_generate_offline_file_browser();
    
    for (let item of cslist){
        if (item[2]!==''){
            str_t='<td width=75%>🗎'+item[2]+fav_and_ssd_tf_show_offline_file_browser(item,do_fav,do_ssd_tf)+'</td>';
        } else {
            str_t='<td width=75%>';
            if (csdisk=='ALL'){
                str_t=str_t+dir_link_offlie_file_browser('ALL',item[0],item[1]);
            } else {
                str_t=str_t+dir_link_offlie_file_browser('',item[0],item[1],item[1].substring(csdir.length,));
            }
            str_t=str_t+'</td>';
        }
        
        str_t=str_t+size_date_av_len_td_offline_file_browser(item,is_kmg);
        str_t='<tr><td width=1 nowrap align=right class="td_no"></td>'+str_t+'</tr>';
        if (tr_list.includes(str_t)){continue;}
        tr_list.push(str_t);
    }
    
    bljg=bljg+tr_list.join('\n');
    var bltitle='<p>';
    if (csdisk!=='' && csdisk!=='ALL'){
        bltitle=bltitle+'<span class="oblong_box" onclick="td_offline_file_browser(\''+current_td_global+'\');dir_offline_file_browser(\''+csdisk+'\');">'+csdisk+'</span> ';
        
        blparent=parent_offline_file_browser(csdisk,csdir);
        if (blparent!==''){
            bltitle=bltitle+'<span class="oblong_box" onclick="td_offline_file_browser(\''+current_td_global+'\');dir_offline_file_browser(\''+csdisk+'\',\''+blparent+'\');">'+blparent+'</span> ';
        }
        
        if (csdir!==''){
            bltitle=bltitle + '<span id="span_current_'+current_td_global+'" class="oblong_box" onclick="dir_click_offline_file_browser(this,\''+csdisk+'\',true);" alt="'+csdir+'">'+csdir.substring(blparent.length,);+'</span>';
        }
    }
    bltitle=bltitle+'</p>';
    odiv.innerHTML=bltitle+bljg+'</table>';
    mouseover_mouseout_oblong_span_b(odiv.querySelectorAll('span.oblong_box'));
    var otds=document.querySelectorAll('#'+current_td_global+' .td_no');
    for (let blxl=0,lent=otds.length;blxl<lent;blxl++){
        otds[blxl].innerHTML=blxl+1;
    }
    statistics_offline_file_browser(cslist);
    top_bottom_arrow_b('div_top_bottom',tr_list.length+' ');
}

function save_movie_sort_col_offline_file_browser(csxl){
    if (csxl!==2){
        saved_movie_data_global.sort(function (a,b){return zh_sort_b(a,b,sort_des_global,csxl);});
    } else {
        saved_movie_data_global.sort(function (a,b){return character_num_sort_b(a[2],b[2],sort_des_global);});    
    }
    sort_des_global=!sort_des_global;
}

function saved_movie_html_offline_file_browser(cscategory=''){
    if (cscategory==''){
        cscategory=document.getElementById('input_search').value;
    }
    var isreg=klmenu_check_b('span_reg_ofb',false);
    keys_offline_file_browser(cscategory+(isreg?'(:r)':''));
    
    var odiv=document.getElementById(current_td_global);
    if (!odiv){return;}
    
    var show_disk_path=klmenu_check_b('span_saved_disk_path_ofb',false);        
    
    var bljg='<table border=0 width=100% cellpading=0 cellspacing=0><tr style="background-color:'+scheme_global['button']+';"><th>No.</th>';
    
    var jsfn='saved_movie_html_offline_file_browser()';
    var list_t=['Category','Filename','SSD/TF','Disk & Path'];
    if (show_disk_path){
        var bllen=list_t.length;
        var td_width='40%';
    } else {
        var bllen=list_t.length-1;        
        var td_width='80%';
    }

    for (let blxl=0;blxl<bllen;blxl++){
        bljg=bljg+'<th nowrap style="cursor:pointer;" title="sort by '+list_t[blxl]+'" onclick="save_movie_sort_col_offline_file_browser('+blxl+'); '+jsfn+';">'+list_t[blxl]+'</th>';
    }

    bljg=bljg+'</tr>';
    var str_t='';
    var blxl=0;
    var tr_list=[];
    var size_len_list=[];
    for (let item of saved_movie_data_global){
        if (cscategory!==''){
            var blfound=str_reg_search_b(item,cscategory,isreg);
            if (blfound==-1){return;}
            if (blfound==false){continue;}
        }
        blxl=blxl+1;        
        str_t='<tr><td width=1 nowrap align=right>'+blxl+'</td>';
        str_t=str_t+'<td width=10% nowrap align=center>'+item[0]+'</td>';
        str_t=str_t+'<td width='+td_width+'>';
        str_t=str_t+item[1];
        str_t=str_t+'</td>';
        str_t=str_t+'<td width=5% nowrap align=center>'+item[2]+'</td>';        
        
        if (show_disk_path){
            str_t=str_t+'<td width=40%>';
            for (let onedir of item[3]){
                var list_t=onedir.split(' /// ');
                if (list_t.length==2){
                    str_t=str_t+dir_link_offlie_file_browser('ALL',list_t[0],list_t[1])+'<br />';
                }
            }
            str_t=str_t+'</td>';
        }
        
        str_t=str_t+'</tr>';
        tr_list.push(str_t);
        size_len_list.push([item[4],item[5]]);
    }
    bljg=bljg+tr_list.join('\n');

    odiv.innerHTML=bljg+'</table>';
    if (cscategory==''){
        var ostatistics=document.getElementById('div_statistics');
        ostatistics.innerHTML='<div style="margin-top:1rem;width:100%;height:600px;" id="div_flot_line_saved_movie"></div><p align=right>'+close_button_b('div_statistics','none')+'<p>';
        ostatistics.style.display='block';
        saved_movie_year_offline_file_browser();
    }
    top_bottom_arrow_b('div_top_bottom',blxl+' ');
    statistics_offline_file_browser(size_len_list,true,0,1);
}

function saved_movie_year_offline_file_browser(){
    var list_t=[];
    var today=new Date();
    var theyear=today.getFullYear();
    
    for (let item of saved_movie_data_global){
        var m_name=item[1];
        var blyear=m_name.match(/\.([12]\d{3})\./) || m_name.match(/[^0-9]([12]\d{3})年/) || [];
        if (blyear.length!==2){continue;}
        if (parseInt(blyear[1])>theyear || blyear[1]=='1024'){
            continue;
        }
        
        if (list_t[blyear[1]+'年']==undefined){
            list_t[blyear[1]+'年']=[blyear[1],0];
        }
        list_t[blyear[1]+'年'][1]=list_t[blyear[1]+'年'][1]+1;
    }
    var flot_data=[];
    for (let blxl in list_t){
        flot_data.push([parseInt(list_t[blxl][0]),list_t[blxl][1]]);
    }
    flot_data.sort();
    
    flot_lines_b([['年份'].concat(flot_data)],'div_flot_line_saved_movie');
}

function saved_movie_list_offline_file_browser(){    
    var do_fav, do_ssd_tf;
    [do_fav,do_ssd_tf]=fav_and_ssd_tf_generate_offline_file_browser();
    
    if (saved_movie_data_global.length>0){
        if (do_ssd_tf && typeof is_regenerated_saved_movie_global == 'undefined'){
            saved_movie_data_global=[];
            console.log('重新生成 saved_movie_data_global');
            is_regenerated_saved_movie_global=true;
        } else {
            saved_movie_html_offline_file_browser();
            return;
        }
    }
    
    var t0 = performance.now();
    var category;
    var fname='';
    var ssd_tf_tag='';
    var blsize=0;
    var av_len=[0,0,0];
    sort_offline_file_browser(2);
   
    for (let item of offline_file_data_raw_global){
        if (!item[1].includes('/完整影视/')){continue;}
        if (item[1].includes('/完整影视/MV') || item[1].includes('/完整影视/短片')){continue;}
        if (item[2].match(/\.(mkv|rmvb|mp4|rm|avi|flv)$/i)==null){continue;}
        
        var subpath_list=item[1].split('/完整影视/')[1].split('/');
        category=subpath_list[0];
        if (subpath_list.length>2){
            fname=subpath_list[1];
        } else {
            fname=item[2];
        }
        fname=fname+fav_and_ssd_tf_show_offline_file_browser(item,do_fav,false);
        if (item[7]==undefined){
            ssd_tf_tag='';
        } else {
            ssd_tf_tag=(item[7]==''?'&nbsp;':item[7]);
        }
        blsize=item[3];
        av_len=item[5].split(':').map(Number);
        if (av_len.length!==3){
            av_len=[0,0,0];
        }
        
        var blfound=false;
        for (let blxl=0,lent=saved_movie_data_global.length;blxl<lent;blxl++){
            if (category==saved_movie_data_global[blxl][0] && fname==saved_movie_data_global[blxl][1]){
                if (!saved_movie_data_global[blxl][3].includes(item[0]+' /// '+item[1])){
                    saved_movie_data_global[blxl][3].push(item[0]+' /// '+item[1]);
                }
                saved_movie_data_global[blxl][4]=saved_movie_data_global[blxl][4]+blsize;
                
                for (let blno=0;blno<3;blno++){
                    saved_movie_data_global[blxl][5][blno]=saved_movie_data_global[blxl][5][blno]+av_len[blno];
                }
                blfound=true;
                break;
            }
        }
        if (blfound==false){
            saved_movie_data_global.push([category,fname,ssd_tf_tag,[item[0]+' /// '+item[1]],blsize,av_len]);
            if (!saved_movie_category_global.includes(category)){
                saved_movie_category_global.push(category);
            }
        }
    }
    sort_des_global=false;
    save_movie_sort_col_offline_file_browser(1);
    sort_des_global=false;    
    save_movie_sort_col_offline_file_browser(0);

    saved_movie_html_offline_file_browser();
    console.log('saved_movie_list_offline_file_browser() 费时：'+(performance.now() - t0) + ' milliseconds');    
}

function diff_all_offline_file_browser(){
    //获取目录名 - 保留注释
    var category_list=[];
    for (let item of offline_file_data_raw_global){
        var str_t=item[1].split('/')[0]+'/';
        if (category_list.includes(str_t)){continue;}
        if (str_t.match(/待看\d{3}/)!==null || str_t.includes('待整理-') || str_t.includes('save-')){
            category_list.push(str_t);
        }
    }
    category_list.sort();
    //category_list 形如：[ "save-33-b/", "待整理-01-a/", "待整理-01-b/" ] - 保留注释
    //获取成对的目录名 - 保留注释
    var list_t=[];
    for (let item of category_list){
        if (item.slice(-3,)=='-a/' && category_list.includes(item.slice(0,-3)+'-b/')){
            list_t.push(item);
            list_t.push(item.slice(0,-3)+'-b/');
            continue;
        } else if (item.slice(-3,)=='副本/' && category_list.includes(item.slice(0,-3)+'/')){
            list_t.push(item);
            list_t.push(item.slice(0,-3)+'/');
            continue;
        }
    }

    var bljg=[];
    var list_diff1=[];
    var list_diff2=[];
    var diskname1='';
    var diskname2='';
    var disk_category=[];
    disk_category_list_global=[];
    for (let blxl=0,lent=list_t.length;blxl<lent;blxl=blxl+2){
        [list_diff1,list_diff2,diskname1,diskname2]=diff_offline_file_browser(list_t[blxl],list_t[blxl+1],false);
        
        disk_category_list_global.push([diskname1,list_t[blxl],diskname2,list_t[blxl+1]]);
        //元素形如：[ "S3", "待看014副本/", ​​"S4", ​​"待看014/" ] - 保留注释
        
        if (list_diff1.length==0 && list_diff2.length==0){continue;}
        
        if (list_diff1.length>0){
            list_diff1.sort();
            var str_t='<h2>'+diskname1+' '+list_t[blxl]+' 拥有但 '+diskname2+' '+list_t[blxl+1]+' 不存在</h2>'+array_2_li_b(list_diff1);
            bljg.push(str_t);
        }
        
        if (list_diff2.length>0){
            list_diff2.sort();
            var str_t='<h2>'+diskname2+' '+list_t[blxl+1]+' 拥有但 '+diskname1+' '+list_t[blxl]+' 不存在</h2>'+array_2_li_b(list_diff2);    
            bljg.push(str_t);
        }
    }
    
    if (typeof ssd_tf_difference_disk_global !== 'undefined'){
        for (let key in ssd_tf_difference_disk_global){
            if (ssd_tf_difference_disk_global[key].size==0){continue;}
            var str_t='<h2>'+key+' 拥有但 硬盘 不存在</h2>'+array_2_li_b(Array.from(ssd_tf_difference_disk_global[key]));
            bljg.push(str_t);
        }
    }
    
    bljg.sort();
    
    var odiv=document.getElementById('div_statistics');
    odiv.innerHTML='<p>过滤：<input type="text" id="input_disk_category" onkeyup="if (event.key==\'Enter\'){disk_category_offline_file_browser();}" /></p><table id="table_disk_category" border=1></table><div id="div_disk_intersection"></div>'+bljg.join('\n')+'<p>'+close_button_b('div_statistics','none')+'</p>\n';
    odiv.style.display='block';
    odiv.scrollIntoView();
    
    input_size_b([['input_disk_category',10],],'id');
    disk_category_offline_file_browser();
    disk_relation_offline_file_browser();
}

function diff_offline_file_browser(csdir1='',csdir2='',showhtml=true){
    //console.log(csdir1,csdir2);
    //save-02-a/ save-02-b/ - 保留注释
    if (csdir1==''){
        var ospan1=document.getElementById('span_current_td_content_1');
        if (ospan1){
            csdir1=ospan1.innerText;
        }
    }
    if (csdir2==''){
        var ospan2=document.getElementById('span_current_td_content_2');
        if (ospan2){
            csdir2=ospan2.innerText;
        }
    }
    if (csdir1=='' || csdir2==''){
        if (showhtml){
            document.getElementById('span_statistics').innerHTML='无可比较的目录';
        }
        return '';
    }

    var list_1=[];
    var list_2=[];
    var diskname1='';
    var diskname2='';
    //忽略文件日期仅 - 保留注释
    for (let item of offline_file_data_raw_global){
        if (item[1].includes(csdir1)){
            list_1.push(item[1].replace(csdir1,'')+' '+item[2]+' '+item[3]+' '+item[5]);
            diskname1=item[0];
        } else if (item[1].includes(csdir2)){
            list_2.push(item[1].replace(csdir2,'')+' '+item[2]+' '+item[3]+' '+item[5]);
            diskname2=item[0];
        }
    }
    list_diff1=array_difference_b(list_1,list_2);
    list_diff2=array_difference_b(list_2,list_1);

    if (showhtml){
        var bljg='<h2>「'+diskname1+'」'+csdir1+' 拥有但「'+diskname2+'」'+csdir2+' 不存在</h2>\n<ol>\n<li>'+list_diff1.join('</li>\n<li>')+'</li>\n</ol>\n';
        bljg=bljg+'<h2>「'+diskname2+'」'+csdir2+' 拥有但「'+diskname1+'」'+csdir1+' 不存在</h2>\n<ol>\n<li>'+list_diff2.join('</li>\n<li>')+'</li>\n</ol>\n';    
        bljg=bljg+'<p align=right>'+close_button_b('div_statistics','')+'</p>\n';    
        document.getElementById('div_statistics').innerHTML=bljg;
    } else {
        return [list_diff1,list_diff2,diskname1,diskname2];
    }
}

function batch_search_form_offline_file_browser(){   
    var postpath=postpath_b();
    bljg='<textarea name="textarea_batch_search_ofb" id="textarea_batch_search_ofb" style="width:90%;height:20rem;"></textarea>';
    bljg=bljg+'<p>';
    bljg=bljg+'<span class="aclick" onclick="document.getElementById(\'div_statistics\').style.display=\'none\';">关闭</span>';
    bljg=bljg+textarea_buttons_b('textarea_batch_search_ofb','清空,复制,全选');
    bljg=bljg+'<span class="aclick" onclick="batch_search_result_offline_file_browser();">批量文件名匹配搜索</span> ';
    bljg=bljg+'<select id="select_remove_str_ofb"><option>行首的*号</option><option>行尾的hash值列</option><option>每行左侧字符串至空格处</option></select> ';
    bljg=bljg+'<span class="aclick" onclick="remove_characters_offline_file_browser();">去除字符串</span>';
    bljg=bljg+'</p>\n';
    bljg=bljg+'<div id="div_batch_search_result_ofb"></div>\n';
    var odiv=document.getElementById('div_statistics');
    odiv.innerHTML=bljg;
    odiv.style.display='';
    odiv.scrollIntoView();
}

function remove_characters_offline_file_browser(cstype=false){
    if (cstype==false){
        cstype=document.getElementById('select_remove_str_ofb').value;
    }
    var otextarea=document.getElementById('textarea_batch_search_ofb');
    if (!otextarea){return;}
    var blstr=otextarea.value.trim();
    if (blstr==''){return;}

    if (confirm('是否去除'+cstype+'？')==false){return;}

    switch (cstype){
        case '行尾的hash值列':
            otextarea.value=blstr.replace(/\s+[^\s]+$/mg,'');
            break;
        case '行首的*号':
            otextarea.value=blstr.replace(/^\*\s*/mg,'');        
            break;
        case '每行左侧字符串至空格处':
            otextarea.value=blstr.replace(/^[^ ]*\s*/gm, '');
            break;
    }
}

function batch_search_result_offline_file_browser(){
    var otextarea=document.getElementById('textarea_batch_search_ofb');
    if (!otextarea){return;}
    var blstr=otextarea.value.trim();
    if (blstr==''){return;}

    fav_and_ssd_tf_generate_offline_file_browser();
    
    blstr=blstr.replace(new RegExp('&','g'),'&amp;');
    blstr=blstr.replace(/'/g,'&#039;');
    
    offline_file_data_current_global=[];
    var not_found_t=[];
    var found_one_t=[];
    var found_two_t=[];
    var found_more_t=[];
    var list_t=blstr.split('\n');
    list_t.sort();
    for (let item of list_t){
        var rawitem=item;
        item=item.trim();
        if (item=='' || item.slice(-1)=='/'){continue;}
        if (item.substring(0,4)=='=== ' && item.slice(-4,)==' ==='){continue;}
        var blat=item.lastIndexOf('/');
        if (blat>=0){
            item=item.substring(blat+1,);
        }
        var is_in_tf=false;
        var blcount=0;
        for (let arow of offline_file_data_raw_global){
            if (arow[2]==item){
                offline_file_data_current_global.push([].concat(arow));
                blcount=blcount+1;
                is_in_tf=(arow[7]!=='');
            }
        }
        var finfo=file_path_name_b(rawitem);
        var parent_dir=file_path_name_b(finfo[0].slice(0,-1));
        rawitem=parent_dir[0]+'<span style="background-color:'+scheme_global['skyblue']+';">'+parent_dir[1]+'</span>/'+finfo[3];
        if (is_in_tf){
            rawitem=rawitem+' 📀';
        }
        if (blcount==0){
            not_found_t.push(rawitem);
        } else if (blcount==1){
            found_one_t.push(rawitem);
        } else if (blcount==2){
            found_two_t.push(rawitem);
        } else { // if (blcount!==2){
            found_more_t.push(rawitem);
        }
    }
    offline_file_data_current_global.sort(function (a,b){return a[2]>b[2] ? 1 : -1;});
    search_html_offline_file_browser(offline_file_data_current_global,current_td_global);

    var bljg='';
    bljg=bljg+'<h4 style="color:red;">未发现的记录('+not_found_t.length+')</h4>'+array_2_li_b(not_found_t,'li','ol');
    bljg=bljg+'<h4 style="color:brown;">出现次数为1的记录('+found_one_t.length+')</h4>'+array_2_li_b(found_one_t,'li','ol');
    bljg=bljg+'<h4 style="color:green;">出现次数为2的记录('+found_two_t.length+')</h4>'+array_2_li_b(found_two_t,'li','ol');    
    bljg=bljg+'<h4 style="color:darkgreen;">出现次数大于2的记录('+found_more_t.length+')</h4>'+array_2_li_b(found_more_t,'li','ol');
    var odiv=document.getElementById('div_batch_search_result_ofb');
    odiv.innerHTML=bljg;
    
    if (not_found_t.length>0 || found_one_t.length>0 || found_more_t.length>0){
        odiv.scrollIntoView();
    } else {
        document.getElementById(current_td_global).scrollIntoView();
    }
    statistics_offline_file_browser(offline_file_data_current_global);
}

function sort_offline_file_browser(csindex,is_current=false){
    if (is_current){
        var csarray=offline_file_data_current_global;
    } else {
        var csarray=offline_file_data_raw_global;
    }
    
    if (csarray.length==0){return;}
    
    if (typeof csindex == 'string'){
        csindex=parseInt(csindex);
    }
    
    if (csindex==-1){
        csarray.sort(randomsort_b);
    }
    var blmax=csarray[0].length-1;
    if (csindex<0 || csindex>blmax){return;}
    
    if (csindex>2){
        if (sort_des_global){
            csarray.sort(function (a,b){return a[csindex]<b[csindex] ? 1 : -1;});
        } else {
            csarray.sort(function (a,b){return a[csindex]>b[csindex] ? 1 : -1;});
        }
    } else {
        csarray.sort(function (a,b){return zh_sort_b(a,b,sort_des_global,csindex);});
    }
    sort_des_global=!sort_des_global;
}

function statistics_show_offline_file_browser(){
    var list_t=local_storage_get_b('offline_file_browser_statistics',-1,true);
    if (list_t.length>20){
        local_storage_squash_b('offline_file_browser_statistics',list_t,3,0,0.5);
        list_t=local_storage_get_b('offline_file_browser_statistics',-1,true);
    }    
    var bljg='';
    var flot_data=[];
    var flot_data2=[];
    var flot_data3=[];
    for (let item of list_t){
        var day_count=item.split(' / ');
        if (day_count.length!==4){continue;}
        bljg=bljg+'<tr><td style="padding:0.2rem;" nowrap>'+day_count[0]+'</td>';
        bljg=bljg+'<td align=right style="padding:0.2rem;" nowrap>'+day_count[1]+'</td>';
        bljg=bljg+'<td align=right style="padding:0.2rem;" nowrap>'+day_count[2]+'</td>';
        bljg=bljg+'<td align=right style="padding:0.2rem;" nowrap>'+day_count[3]+'</td></tr>';        
        flot_data.push([new Date(day_count[0]),parseInt(day_count[1])]);
        flot_data2.push([new Date(day_count[0]),parseInt(day_count[2])]);
        flot_data3.push([new Date(day_count[0]),parseFloat(day_count[3])]);
    }
    if (bljg!==''){
        bljg='<table border=1 cellspacing=0 cellpadding=0 style="margin:1rem 0rem;"><tr><th style="padding:0.2rem;" nowrap>日期</th><th style="padding:0.2rem;" nowrap>文件数</th><th style="padding:0.2rem;" nowrap>大小(GB)</th><th style="padding:0.2rem;" nowrap>时长(小时)</th></tr>'+bljg+'</table>';
    }
    
    bljg='<table border=0 width=100% height=100%><tr><td valign=top width=1 height=100% rowspan=3>'+bljg+'</td>';
    bljg=bljg+'<td valign=top width=70%><div style="width:100%;height:300px;" id="div_flot_line_12"></div></td></tr>';
    bljg=bljg+'<tr><td valign=top width=70%><div style="width:100%;height:300px;" id="div_flot_line_3"></div></td></tr>';
    bljg=bljg+'<tr><td valign=bottom width=70% align=right>'+close_button_b('div_statistics','none')+'</td></tr></table>';

    var odiv=document.getElementById('div_statistics');
    odiv.innerHTML=bljg;
    odiv.style.display='block';
    odiv.scrollIntoView();
    
    flot_data.sort(function (a,b){return a[0]>b[0] ? 1 : -1;});
    flot_data2.sort(function (a,b){return a[0]>b[0] ? 1 : -1;});
    flot_data3.sort(function (a,b){return a[0]>b[0] ? 1 : -1;});

    flot_two_lines_two_yaxis_b([['文件数'].concat(flot_data),['文件大小'].concat(flot_data2)],'div_flot_line_12','个','GB','nw',true,'d',0,0,'',[1, 'day'],5);

    flot_lines_b([['时长'].concat(flot_data3)],'div_flot_line_3','nw',true,'','d','小时',1,[1, 'day'],5);
}

function review_plan_bookmark_offline_file_browser(){
    var review_bookmark=local_storage_get_b('reveiw_bookmark_ofb');
    var new_bookmark=(prompt('输入作为书签的影片名称：',review_bookmark) || '').trim();
    new_bookmark=new_bookmark.replace(/^(.*(mp4|mkv)).*/ig,'$1');
    if (new_bookmark==''){return;}
    localStorage.setItem('reveiw_bookmark_ofb',new_bookmark);
    alert('设定书签：\n'+new_bookmark+'\n完成');
}

function menu_offline_file_browser(){
    var str_t=klmenu_hide_b('#top');
    var blparent=menu_parent_node_b(str_t);
    
    var col_name=['Disk','Path','Filename','File Size','Modified Date','Multimedia Length','Tag','TF Name','File path & name Length'];
    for (let blxl=0,lent=col_name.length;blxl<lent;blxl++){
        col_name[blxl]='<option value='+blxl+'>'+col_name[blxl]+'</option>';
    }
    
     var klmenu1=[
    '<span class="span_menu"><select id="select_raw_sort_id_ofb" style="height:2rem;">'+col_name.join('\n')+'</select> <span class="aclick" onclick="sort_offline_file_browser(document.getElementById(\'select_raw_sort_id_ofb\').value,false);'+blparent+'">排序</span></span>',
    
    '<span class="span_menu" style="font-size:0.85rem; line-height:2rem;">分组2：<select id="select_raw_sub_group1_id_ofb">'+col_name.join('\n')+'</select><br />分组3：<select id="select_raw_sub_group2_id_ofb">'+col_name.join('\n')+'</select><br />次数：<input type="number" id="input_group_count_min_ofb" min=1 value=2 / > - <input type="number" id="input_group_count_max_ofb" min=1 value=2 / ><br /><span class="oblong_box" onclick="group_count_offline_file_browser();'+blparent+'">当前条件分组统计指定次数列</span></span>',    

    '<span class="span_menu" onclick="'+str_t+'review_plan_list_offline_file_browser();">完整影视温习列表</span>',    
    '<span class="span_menu" onclick="'+str_t+'review_plan_bookmark_offline_file_browser();">设定完整影视温习列表当前书签</span>',        
    '<span class="span_menu" onclick="'+str_t+'batch_search_form_offline_file_browser();">批量文件名匹配搜索</span>',    
    '<span class="span_menu" onclick="'+str_t+'file_list_offline_file_browser();">当前结果文件列表</span>',    
    ];
    
    var group_list=[
    ['文件列表','file_list_offline_file_browser();',true],
    ['坐标导出','lat_lng_date_get_offline_file_browser();',true],
    ];    
    klmenu1.push(menu_container_b(str_t,group_list,'当前结果：'));
    
     var klmenu_config=[
    '<span class="span_menu" onclick="'+str_t+'import_bigfile_offline_file_browser();">导入 bigfile 文件</span>',
    '<span id="span_saved_disk_path_ofb" class="span_menu" onclick="'+str_t+'klmenu_check_b(this.id,true);">⚪ save movie 显示 Disk & Path</span>',    
    '<span id="span_path_name_ofb" class="span_menu" onclick="'+str_t+'klmenu_check_b(this.id,true);">⚪ 搜索目录+文件名</span>',    
    '<span id="span_unique_ofb" class="span_menu" onclick="'+str_t+'klmenu_check_b(this.id,true);">⚪ 不重复显示相同目录的记录</span>',    
    
    ];
    
    var group_list=[
    ['⚪ reg','klmenu_check_b(this.id,true);',true,'span_reg_ofb'],
    ['⚪ kmg','klmenu_check_b(this.id,true);',true,'span_kmg_ofb'],
    ['⚪ 💖','klmenu_check_b(this.id,true);',true,'span_fav_ofb'],
    ['⚪ SSD/TF','klmenu_check_b(this.id,true);',true,'span_ssd_tf_show_ofb'],
    ];    
    klmenu_config.push(menu_container_b(str_t,group_list,''));    
    
    klmenu_config.push('<span class="span_menu">最大结果数：<input type="number" id="input_return_max_rows_ofb" min=1 value=10000 / ></span>');

    var multimedia='mkv|rmvb|mp4|rm|avi|flv';
    var jscode='<span class="span_menu" onclick="'+str_t+'sort_offline_file_browser(-1); search_offline_file_browser';
    var klmenu2=[
    jscode+'(\'.*\',true,200);">随机记录</a>',
    jscode+'(\'\\.('+multimedia+')$\',true,200);">随机影视</a>',
    jscode+'(\'+/动画/ +\\.('+multimedia+')$\',true,200);">随机动画</a>',
    jscode+'(\'+/恐怖/ +\\.('+multimedia+')$\',true,200);">随机恐怖</a>',
    jscode+'(\'+/幻想/ +\\.('+multimedia+')$\',true,200);">随机幻想</a>',
    jscode+'(\'+\\.('+multimedia+')$ +\\\\bcmct\\\\b\',true,200);">随机CMCT</a>',
    jscode+'(\'+\\.('+multimedia+')$ +(帝国|cnxp)\',true,200);">随机影视帝国</a>',
    jscode+'(\'+待看 +\.('+multimedia+')$\',true,200);">随机待看</a>',
    jscode+'(\'+save- +\.('+multimedia+')$\',true,200);">随机save</a>',
    jscode+'(\'\\.(doc|xls|docx|xlsx|txt|pdf|htm|html|php|js|md|py|sh|epub|chm|azw|azw3|mobi|htmlz)$\',true,200);">随机文档</span>',
    ];

    var klmenu_statistics=[
    '<span class="span_menu" onclick="'+str_t+'statistics_show_offline_file_browser();">文件数统计</span>',
    '<span class="span_menu" onclick="'+str_t+'disks_size_date_offline_file_browser();">磁盘大小和日期统计</span>',
    '<span class="span_menu" onclick="'+str_t+'diff_all_offline_file_browser();">Diff All</span>', 
    '<span class="span_menu" onclick="'+str_t+'statistics_lengthy_offline_file_browser();">超长路径和文件名统计</span>',
    ];
    
     var klmenu_link=[
    '<span class="span_menu" onclick="'+str_t+'klwiki_link_b(\'文件包内容列表\',true);">文件包内容列表</span>',
    '<span class="span_menu" onclick="'+str_t+'klwiki_link_b(\'KL 移动硬盘数据总量\',true);">KL 移动硬盘数据总量</span>',
    ];
    
    var group_list=[
    ['01','klwiki_link_b(\'光盘柜01\',true);',true],
    ['02','klwiki_link_b(\'光盘柜02\',true);',true],
    ['03','klwiki_link_b(\'光盘柜03\',true);',true],
    ['批量打开','tf_ssd_batch_open_offline_file_browser(3);',true],

    ];    
    klmenu_link.push(menu_container_b(str_t,group_list,'光盘柜：'));
    
    document.getElementById('span_title').insertAdjacentHTML('beforebegin',klmenu_multi_button_div_b(klmenu_b(klmenu1,'💾','18rem','','1rem')+klmenu_b(klmenu2,'🔀','10rem','','1rem')+klmenu_b(klmenu_statistics,'🧮','14rem','','1rem')+klmenu_b(klmenu_config,'⚙','18rem','','1rem')+(is_local_b()?klmenu_b(klmenu_link,'L','16rem','','1rem'):''),'','0rem')+' ');
    
    klmenu_check_b('span_kmg_ofb',true);            
    klmenu_check_b('span_reg_ofb',true);       
    klmenu_check_b('span_fav_ofb',true);            
    klmenu_check_b('span_ssd_tf_show_ofb',true);            
    
    var input_list=[
    ['input_group_count_min_ofb',3],
    ['input_group_count_max_ofb',3],
    ['input_return_max_rows_ofb',6],
    ];
    input_size_b(input_list,'id');
}

function statistics_lengthy_offline_file_browser(){
    var username=prompt('输入用户名称');
    if (username==null){return;}
    
    const encoder = new TextEncoder();
    var result_t=[];
    for (let item of offline_file_data_raw_global){
        switch (item[0]){
            case 'wikiuploads':
                var prepath='/home/'+username+'/';
                break;
            case 'klmusic':
                var prepath='/home/'+username+'/KLData/';
                break;
            default:
                var prepath='/media/'+username+'/';
        }
        
        var blmark=['',''];
        if (encoder.encode(prepath+item[0]+'/'+item[1]).length>4096){
            blmark[0]='📏';
        }
        
        if (encoder.encode(item[2]).length>255){
            blmark[1]='📐';
        }

        if (blmark[0]=='' && blmark[1]==''){continue;}
        result_t.push(prepath+item[0]+'/'+item[1]+item[2]+blmark.join(''));
    }
    result_t.sort();
    var odiv=document.getElementById('div_statistics');
    odiv.innerHTML='<h3>超长路径和文件名</h3>'+array_2_li_b(result_t)+'<p>'+close_button_b('div_statistics','none')+'</p>';
    odiv.style.display='block';
    odiv.scrollIntoView();
}

function tf_ssd_batch_open_offline_file_browser(csno){
    //csno 仅限于个位数 - 保留注释
    function sub_tf_ssd_batch_open_offline_file_browser_one(){
        if (blxl>csno){return;}
        klwiki_link_b('光盘柜0'+blxl,true);
        blxl=blxl+1;
        setTimeout(sub_tf_ssd_batch_open_offline_file_browser_one,1000);
    }
    var blxl=1;
    sub_tf_ssd_batch_open_offline_file_browser_one();
}

function group_count_offline_file_browser(){
    var group1=parseInt(document.getElementById('select_raw_sort_id_ofb').value);
    var group2=parseInt(document.getElementById('select_raw_sub_group1_id_ofb').value);    
    var group3=parseInt(document.getElementById('select_raw_sub_group2_id_ofb').value);
    
    var result_t={};
    for (let arow of offline_file_data_current_global){
        if (group2==group1){
            var blkey='g_'+arow[group1];
        } else {
            var blkey='g_'+arow[group1]+'_'+arow[group2];        
        }
        
        if (group3!==group1 && group3!==group2){
            blkey=blkey+'_'+arow[group3];
        }
        
        if (result_t[blkey]==undefined){
            result_t[blkey]=[];
        }
        result_t[blkey].push(arow);
    }    
    var blmin=parseInt(document.getElementById('input_group_count_min_ofb').value) || 1;
    var blmax=parseInt(document.getElementById('input_group_count_max_ofb').value) || blmin;
    
    var blcount1=offline_file_data_current_global.length;
    offline_file_data_current_global=[];
    for (let key in result_t){
        if (result_t[key].length<blmin){continue;}
        if (!isNaN(blmax) && result_t[key].length>blmax){continue;}
        offline_file_data_current_global=offline_file_data_current_global.concat(result_t[key]);
    }
    alert('分组前：'+blcount1+'；分组后：'+offline_file_data_current_global.length);
    
    current_2_html_offline_file_browser();
}

function import_bigfile_offline_file_browser(){
    function sub_bigfile_offline_file_browser_load(is_ok){
        ospan.innerHTML='数据导入'+(is_ok?'成功':'失败');
    }
    var fname=prompt_from_local_storage_b('输入文件名','bigfile_ofb') || '';
    if (fname.trim()==''){return;}
    
    var ospan=document.getElementById('span_statistics');
    ospan.innerHTML='数据导入中...';
    offline_file_data_raw_global=undefined;
    load_js_var_file_b('offline_file_data_raw_global',[],fname,sub_bigfile_offline_file_browser_load,true,true);
}

function filelist_2_virtual_path_offline_file_browser(){
    var ool=document.getElementById('ol_flist_ofb');
    var olis=ool.querySelectorAll('li');
    var result_t=[];
    for (let one_li of olis){
        if (one_li.style.display=='none'){continue;}
        result_t.push(one_li.textContent);
    }
    document.getElementById('div_sub_statistics').innerHTML='<textarea>'+result_t.join('\n').replace(/^wikiuploads\//mg,'{{wikiuploads}}')+'</textarea>';
}

function lat_lng_date_get_offline_file_browser(){
    if (offline_file_data_current_global.length==0){return;}
    var result_t=[];
    for (let item of offline_file_data_current_global){
        let list_t=item[5].split(/\s+/);
        if (list_t.length<7){continue;}
        result_t.push(item[0]+'/'+item[1]+item[2]+' /// '+list_t[3]+' /// '+list_t[4]+' /// '+list_t[5]+' '+list_t[6]);
    }
    result_t.sort();
    
    var left_str='<p>';
    left_str=left_str+close_button_b('div_statistics','');
    var right_str='('+result_t.length+' '+(result_t.length*100/offline_file_data_current_global.length).toFixed(2)+'%)</p>';

    var bljg=textarea_with_form_generate_b('textarea_lat_lng_date_ofb','height:10rem;',left_str,'清空,复制,发送到临时记事本,发送地址',right_str);

    var odiv=document.getElementById('div_statistics');
    odiv.innerHTML=bljg;
    odiv.style.display='block';
    odiv.scrollIntoView();
    document.getElementById('textarea_lat_lng_date_ofb').value=result_t.join('\n');
}

function file_list_offline_file_browser(){
    if (offline_file_data_current_global.length==0){return;}
    var result_t=[];
    for (let item of offline_file_data_current_global){
        result_t.push(item[0]+'/'+item[1]+item[2]);
    }
    result_t.sort();
    
    var odiv=document.getElementById('div_statistics');
    var bljg='<p><input id="input_flist_filter_ofb" onkeyup="if (event.key==\'Enter\'){filelist_filter_offline_file_browser(this.value);}"></p>';
    bljg=bljg+array_2_li_b(result_t,'li','ol','ol_flist_ofb');
    
    bljg=bljg+'<p align=right>';
    bljg=bljg+'<span class="aclick" onclick="document.getElementById(\'input_flist_filter_ofb\').scrollIntoView();">head</span>';
    bljg=bljg+'<span class="aclick" onclick="filelist_disk_count_offline_file_browser();">磁盘数</span>';    
    bljg=bljg+'<span class="aclick" onclick="filelist_2_virtual_path_offline_file_browser();">转换当前可见结果的wikiuploads/为虚拟路径</span>';    
    bljg=bljg+close_button_b('div_statistics','none')+'</p>';
    bljg=bljg+'<div id="div_sub_statistics"></div>';
    bljg=bljg+'<p>&nbsp;</p><p>&nbsp;</p>';
    odiv.innerHTML=bljg;
    odiv.style.display='block';
    input_with_x_b('input_flist_filter_ofb',11);
    odiv.scrollIntoView();
}

function filelist_disk_count_offline_file_browser(){
    var olis=document.querySelectorAll('ol#ol_flist_ofb li');
    var disk_set=new Set();
    for (let one_li of olis){
        if (one_li.style.display=='none'){continue;}
        var blstr=one_li.innerText.split('/')[0].split('-')[0];
        disk_set.add(blstr);
    }    
    disk_set=Array.from(disk_set);
    alert(disk_set.length+': '+disk_set);
}

function filelist_filter_offline_file_browser(cskey){
    var olis=document.querySelectorAll('ol#ol_flist_ofb li');
    var is_reg=false;
    [cskey,is_reg]=str_reg_check_b(cskey,is_reg);
    if (cskey==''){return;}
    
    obj_search_show_hide_b(olis,'',cskey,is_reg);
}

function size_calculate_offline_file_browser(){
    if (typeof path_disk_size_ofb_global!=='undefined'){return;}
    
    var path_list={};
    var disk_list={};
    var merge_list={};
    offline_file_data_raw_global.sort(function (a,b){return a[4]>b[4] ? 1 : -1;});
    for (let item of offline_file_data_raw_global){
        let disk_key='d_'+item[0];
        if (disk_list[disk_key]==undefined){
            disk_list[disk_key]=[item[0],0,'',item[4],'']; //磁盘名称，体积，TXT文件修改日期，最旧文件日期，最新文件日期 - 保留注释
            for (let one_name of offline_file_category_global){
                if (item[0]==one_name[0]){
                    disk_list[disk_key][2]=one_name[1]; //添加修改日期 - 保留注释
                }
            }
        }
        
        var merge_key='m_'+item[0].split('-')[0];
        if (merge_list[merge_key]==undefined){
            merge_list[merge_key]=0;
        }
                        
        disk_list[disk_key][1]=disk_list[disk_key][1]+item[3];
        disk_list[disk_key][4]=item[4];
        merge_list[merge_key]=merge_list[merge_key]+item[3];
        
        if (item[1].startsWith('save-') || item[1].startsWith('待看') || item[1].startsWith('待整理')){
            let path_key='p_'+item[1].split('/')[0];
            if (path_list[path_key]==undefined){
                path_list[path_key]=[item[0],0];    //假设相同目录名称的磁盘也相同 - 保留注释
            }                
            path_list[path_key][1]=path_list[path_key][1]+item[3];
        }
    }
    path_disk_size_ofb_global=[path_list,disk_list,merge_list];
}

function disks_size_date_offline_file_browser(cscol=0,csdesc=false,cstable_no=0){
    function sub_disks_size_date_offline_file_browser_th(csno,cscaption,tableno){
        return '<th onclick="disks_size_date_offline_file_browser('+csno+','+is_desc+','+tableno+');" style="cursor:pointer;">'+cscaption+'</th>';
    }
    
    function sub_disks_size_date_offline_file_browser_simple(csarr,cscaption,col_name_list,tableno){
        var th_list1=[];   
        for (let blxl=0,lent=col_name_list.length;blxl<lent;blxl++){
            th_list1.push(sub_disks_size_date_offline_file_browser_th(blxl,col_name_list[blxl],tableno));
        }
        
        var lenb=col_name_list.length-1;
        for (let blxl=0,lent=csarr.length;blxl<lent;blxl++){
            var arow='';
            for (let blno=0;blno<lenb;blno++){
                arow=arow+'<td>'+csarr[blxl][blno]+'</td>';
            }
            csarr[blxl]='<tr>'+arow+'<td align=right>'+(is_kmg?kbmbgb_b(csarr[blxl][lenb]):csarr[blxl][lenb])+'</td></tr>';
        }
        
        return '<h3 class="h3_disk_size_ofb">'+cscaption+'</h3><table class="table_common"><tr>'+th_list1.join('')+'</tr>'+csarr.join('\n')+'</table>';    
    }
    //-----------------------
    size_calculate_offline_file_browser();

    var path_list=object2array_b(path_disk_size_ofb_global[0],true,2);    
    var disk_list=object2array_b(path_disk_size_ofb_global[1]);
    var merge_list=object2array_b(path_disk_size_ofb_global[2],true,2);

    var ssd_size_list=[];
    if (typeof ssd_tf_size_global !== 'undefined'){
        for (let key in ssd_tf_size_global){
            ssd_size_list.push([key,ssd_tf_size_global[key]]);
        }
    }
    
    var merge_col_no=(cscol>1?1:cscol);
    var path_col_no=(cscol>2?2:cscol);

    if (csdesc){
        disk_list.sort(function (a,b){return a[cscol]<b[cscol] ? 1 : -1;});
        merge_list.sort(function (a,b){return a[merge_col_no]<b[merge_col_no] ? 1 : -1;});
        path_list.sort(function (a,b){return a[path_col_no]<b[path_col_no] ? 1 : -1;});

        var is_desc='false';
    } else {
        disk_list.sort(function (a,b){return a[cscol]>b[cscol] ? 1 : -1;});
        merge_list.sort(function (a,b){return a[merge_col_no]>b[merge_col_no] ? 1 : -1;});
        path_list.sort(function (a,b){return a[path_col_no]>b[path_col_no] ? 1 : -1;});
        
        var is_desc='true';
    }
    
    if (merge_col_no==0){
        ssd_size_list.sort(function (a,b){return character_num_sort_b(a[0],b[0],csdesc);});
    } else {
        if (csdesc){
            ssd_size_list.sort(function (a,b){return a[merge_col_no]<b[merge_col_no] ? 1 : -1;});
        } else {
            ssd_size_list.sort(function (a,b){return a[merge_col_no]>b[merge_col_no] ? 1 : -1;});
        }
    }

    var tr_list=[];
    var is_kmg=klmenu_check_b('span_kmg_ofb',false);            
    for (let item of disk_list){
        tr_list.push('<tr><td>'+item[0]+'</td><td align=right>'+(is_kmg?kbmbgb_b(item[1]):item[1])+'</td><td align=center>'+item[2]+'</td><td align=center>'+item[3]+'</td><td align=center>'+item[4]+'</td></tr>');
    }

    var th_names=['Disk','Size','TXT文件修改日期','最旧文件','最新文件'];

    var th_list0=[];   
    for (let blxl=0,lent=th_names.length;blxl<lent;blxl++){
        th_list0.push(sub_disks_size_date_offline_file_browser_th(blxl,th_names[blxl],0));
    }   
    
    var merge_table=sub_disks_size_date_offline_file_browser_simple(merge_list,'合并统计',['Disk','Size'],1);
    var path_table=sub_disks_size_date_offline_file_browser_simple(path_list,'目录统计',['Path','Disk','Size'],2);
    var ssd_table=sub_disks_size_date_offline_file_browser_simple(ssd_size_list,'SSD_TF统计',['Disk','Size'],3);

    var bljg='<h3 class="h3_disk_size_ofb">磁盘大小</h3><table class="table_common"><tr>'+th_list0.join('')+'</tr>'+tr_list.join('\n')+'</table>'+merge_table+path_table+ssd_table+'<p>'+close_button_b('div_statistics','none')+'</p>\n';
    
    var odiv=document.getElementById('div_statistics');
    odiv.innerHTML=bljg;
    odiv.style.display='block';
    var oh3s=odiv.querySelectorAll('h3.h3_disk_size_ofb');
    if (cstable_no>=0 && cstable_no<oh3s.length){
        oh3s[cstable_no].scrollIntoView();
    }
    //odiv.scrollIntoView();
}

function disks_offline_file_browser(){    
    // 窗口切换 - 保留注释
    var bljg='';
    bljg=bljg+'<span class="aclick" onclick="window_offline_file_browser(1);">□</span> ';    //style="border:0.1rem black solid;padding:0 0.5rem;margin-right:0.5rem;"
    bljg=bljg+'<span class="aclick" onclick="window_offline_file_browser(2);">⿰</span> ';
    //'<span style="border:0.1rem black solid;border-right:0;padding-left:0.5rem;"></span><span style="border:0.1rem black solid;padding-right:0.5rem;margin-right:0.5rem;"></span>';
    bljg=bljg+'<span class="aclick" onclick="dir_offline_file_browser(\'ALL\',\'/完整影视/\',0);"><small>完整影视</small></span> ';
    bljg=bljg+'<span class="aclick" onclick="dir_offline_file_browser(\'ALL\',\'save-[0-9][0-9]-[ab]/\',1);"><small>save</small></span> ';
    bljg=bljg+'<span class="aclick" onclick="dir_offline_file_browser(\'ALL\',\'待看0\',0);"><small>待看</small></span> ';

    var list_t=[];
    for (let item of offline_file_category_global){
        list_t.push('<span class="aclick" onclick="dir_offline_file_browser(this.innerText);">'+item[0]+'</span>');
    }
    bljg=bljg+'<span style="cursor:pointer;" onclick="popup_show_hide_b(\'span_category\',\'\');">💾</span> <span id="span_category" style="display:none;">'+list_t.join(' ')+'</span>';
    document.getElementById('div_category').innerHTML=bljg;
}

function review_plan_list_offline_file_browser(){
    var result_t=[];
    for (let item of offline_file_data_raw_global){
        if (!item[1].includes('-a/完整影视/')){continue;}   //不考虑待看，不考虑save-xx-b - 保留注释        
        if (item[2].match(/\.(mkv|mp4)$/i)==null){continue;}    //不考虑 rmvb - 保留注释
        var category=item[1].split('/完整影视/')[1].split('/');
        result_t.push([item,category[(category.length>=2?1:0)]]);
    }
    
    result_t.sort(function (a,b){return a[0][2]>b[0][2] ? 1 : -1;});
    result_t.sort(function (a,b){return a[1]>b[1] ? 1 : -1;});
    for (let blxl=0,lent=result_t.length;blxl<lent;blxl++){
        result_t[blxl]=result_t[blxl][0];
    }
    statistics_offline_file_browser(result_t,true);
    search_html_offline_file_browser(result_t,current_td_global,true);
}

function important_movies_offline_file_browser(do_ssd_tf=false){
    var t0 = performance.now();

    var important_set_t=new Set(important_movie_global);
    //important_movie_global 形如 [ "127小时", "1408幻影凶间", "21克" ] - 保留注释
    
    var ssd_tf_set=new Set();
    if (do_ssd_tf){
        for (let arow of ssd_tf_file_list_merged_global){
            if (ssd_tf_set[arow[1]]==undefined){
                ssd_tf_set[arow[1]]=new Set();
            }
            ssd_tf_set[arow[1]].add(arow[0].replace(/&/g,'&amp;').replace(/\'/g,'&#039;'));
        }
    }
    //ssd_tf_set 每个元素为 set，形如：FA0: [ "2009 43rd Annual CMA Awards.第43届年度乡村音乐颁奖礼.cbr", "2009年第51届格莱美奖颁奖礼.cbr", ] - 保留注释 
    ssd_tf_size_global={};
    for (let key in ssd_tf_set){
        ssd_tf_size_global[key]={};
    }
    
    var both_exist_set=new Set();
    for (let blxl=0,lent=offline_file_data_raw_global.length;blxl<lent;blxl++){
        var item=offline_file_data_raw_global[blxl];
        //-----------------------
        if (do_ssd_tf){
            var blfound=false;
            for (let key in ssd_tf_set){
                if (ssd_tf_set[key].has(item[2])){  //文件名 - 保留注释
                    offline_file_data_raw_global[blxl][7]=key;
                    ssd_tf_size_global[key]['f_'+item[2]]=item[3];
                    both_exist_set.add(item[2]);
                    blfound=true;
                    break;
                }
            }
        }
        //-----------------------
        if (!item[1].includes('/完整影视/')){continue;}   //不考虑待看 - 保留注释
        if (item[2].match(/\.(mkv|mp4|rmvb)$/i)==null){continue;}
        for (let akey of important_set_t){
            if (item[1].includes(akey) || item[2].includes(akey)){  //不使用 .toLowerCase() 会加快速度 - 保留注释
                offline_file_data_raw_global[blxl][6]='💖';
                break;
            }
        }
    }
    important_movie_global=[];  //便于统计时统一计算length需要，important_movie_global 不能是 new Set() - 保留注释
    ssd_tf_file_list_merged_global=[];
    
    for (let key in ssd_tf_set){
        ssd_tf_set[key]=array_difference_b(ssd_tf_set[key],both_exist_set,true);
    }
    ssd_tf_difference_disk_global=ssd_tf_set;
    
    for (let key in ssd_tf_size_global){
        var value_list=Object.values(ssd_tf_size_global[key]);
        ssd_tf_size_global[key]=value_list.reduce((blsum, currentValue) => {return blsum + currentValue;}, 0);    // 0 是初始值 - 保留注释
    }
    console.log('important_movies_offline_file_browser() 费时：'+(performance.now() - t0) + ' milliseconds');
}

function style_offline_file_browser(){
    var style_list=[
    'span.span_ssd_tf_mark_ofb {font-size:small; border: 0.15rem '+scheme_global['pink']+' dotted; border-radius:0.3rem; padding:0 0.1rem; background-color:'+scheme_global['button']+';}',
    ];
    style_generate_b(style_list,true);
}

function init_offline_file_browser(){
    var t0 = performance.now();
    input_with_x_b('input_search',15);

    top_bottom_arrow_b('div_top_bottom','',false,(ismobile_b()?'1.8rem':'1.6rem'));
    menu_offline_file_browser();

    var blerror=false;
    for (let item of offline_file_data_raw_global){
        if (item[0]=='error'){
            document.getElementById(current_td_global).innerHTML=item;
            blerror=true;
            break;
        }
    }
    if (blerror==false){
        setTimeout(statistics_offline_file_browser,3000);
    }

    disks_offline_file_browser();
    
    if (args_offline_file_browser()==false){
        if (offline_file_category_global.length>0){
            sort_offline_file_browser(1);
            dir_offline_file_browser(offline_file_category_global[0][0]);
        }
    }
    keys_offline_file_browser();
    character_2_icon_b('💾');
}

function args_offline_file_browser(){
    var cskeys=href_split_b(location.href);
    if (cskeys.length>0 && cskeys[0]!==''){
        //形如：xxx.htm?s=english& - 保留注释
        for (let bltmpstr of cskeys){
            bltmpstr=bltmpstr.trim();
            if (bltmpstr.substring(0,2)=='s='){
                bltmpstr=bltmpstr.substring(2,);
                if (bltmpstr=='' || bltmpstr=='(:r)'){return false;}
                search_offline_file_browser(bltmpstr);
                break;
            }
        }
        return true;
    } else {
        return false;
    }
}
