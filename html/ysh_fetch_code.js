function init_ysh_jf(){
    menu_ysh_jf();
    top_bottom_arrow_b('div_top_bottom','',false,(ismobile_b()?'1.8rem':'1.6rem'),false,false,2);
    var input_list=[
    ['input_apikey',11,0.8],
    ['input_count',5,0.8],

    ];
    input_size_b(input_list,'id');
    input_with_x_b('input_search',15);
    recent_ysh_jf();
    character_2_icon_b('🥷');    
}

function recent_ysh_jf(csstr=''){
    recent_search_b('recent_ysh_jf',csstr,'date_fetch_ysh_jf','div_recent_search',[],25,false);
}

function menu_ysh_jf(){
    var str_t=klmenu_hide_b('');
    var klmenu1=[
    '<span class="span_menu" onclick="'+str_t+'data_export_form_ysh_jf();">数据导入导出</span>',    
    ];

    var klmenu_idb=[
    '<span id="span_reg_ysh_jf" class="span_menu" onclick="'+str_t+'klmenu_check_b(this.id,true);">⚪ reg</span>',        
    '<span id="span_idb_ysh_jf" class="span_menu" onclick="'+str_t+'klmenu_check_b(this.id,true);">⚪ 从 indexeddb 中读取</span>',    
    '<span class="span_menu" onclick="'+str_t+'idb_ysh_jf(\'count\');">显示 indexeddb 数据条数</span>',    
    '<span class="span_menu" onclick="'+str_t+'idb_ysh_jf(\'clear\');">清空 indexeddb 数据</span>',    
    ];
    
    document.getElementById('span_title').insertAdjacentHTML('beforebegin',klmenu_multi_button_div_b(klmenu_b(klmenu1,'🥷','12rem','1rem','1rem','30rem')+klmenu_b(klmenu_idb,'🛢','16rem','1rem','1rem','30rem'),'','0rem')+' ');
    klmenu_check_b('span_reg_ysh_jf',true);            
}

function data_export_csv_ysh_jf(){
    var result_t=[];
    for (let item of current_result_ysh_jf_global){
        var arow=[];
        for (let acol of item[0]){    
            arow.push('"'+specialstr_j(acol)+'"');
        }
        result_t.push(arow.join(','));        
    }
    string_2_txt_file_b(result_t.join('\n'),'ysh_jf_csv_export'+now_time_str_b('_',true,false,'_','_')+'.csv','csv');
}

function data_export_form_ysh_jf(){   
    var bljg='';
    var islocal=is_local_b();
    if (islocal){
        var postpath=postpath_b();
	    bljg=bljg+'<form method="POST" action="'+postpath+'temp_txt_share.php" target=_blank style="margin-left:0.5rem;">\n';
    }
    
    bljg=bljg+'<textarea name="textarea_ysh_jf" id="textarea_ysh_jf" style="height:15rem;"></textarea>';
    bljg=bljg+'<p>';
    
    bljg=bljg+'<span class="aclick" onclick="data_load_current_ysh_jf();">显示当前数据</span>';
    bljg=bljg+'<span class="aclick" onclick="data_import_ysh_jf();">导入当前数据到 indexeddb 数据库</span>';
    bljg=bljg+'<span class="aclick" onclick="data_export_csv_ysh_jf();">导出当前数据为 csv</span>',    
    
    bljg=bljg+textarea_buttons_b('textarea_ysh_jf','全选,清空,复制,save as txt file'+(islocal?',发送到临时记事本,发送地址':''));
    bljg=bljg+'</p>';        
    
    if (islocal){
        bljg=bljg+'</form>';
    }
    
    var odiv=document.getElementById('divhtml');
    odiv.innerHTML=bljg;
}

function data_import_ysh_jf(){
    var list_t=document.getElementById('textarea_ysh_jf').value.trim().split('\n');
    if (list_t.length % 3 !== 0){
        alert('行数不是3的倍数');
        return;
    }
    
    for (let blxl=2;blxl<list_t.length;blxl=blxl+3){
        if (validdate_b(list_t[blxl])==false){
            alert('日期格式错误',list_t[blxl]);
            return;
        }
    }
    if (!confirm('是否导入 '+list_t.length/3+' 条记录？')){return;}
    
    raw_data_ysh_jf_global=[];
    for (let blxl=0;blxl<list_t.length;blxl=blxl+3){
        var arow=[list_t[blxl],list_t[blxl+1],list_t[blxl+2]];
        raw_data_ysh_jf_global.push(arow);
    }
    idb_ysh_jf('write',false,true);
}

function data_load_current_ysh_jf(){
    var result_t=[];
    for (let item of current_result_ysh_jf_global){
        result_t.push(item[0].join('\n'));
    }
    document.getElementById('textarea_ysh_jf').value=result_t.join('\n');
}

function data_show_ysh_jf(csarr){
    raw_data_ysh_jf_global=[];
    current_result_ysh_jf_global=[];
    
    var data_set=new Set();
    
    var today=date2str_b('-');
    try {
        for (let blxl=0;blxl<csarr['docs'].length;blxl++){
            let item=csarr['docs'][blxl]['pnx']['sort'];
            let bltitle=(item['title']==undefined?'':item['title'][0]);
            let blauthor=(item['author']==undefined?'':item['author'][0]);
            
            if (data_set.has(bltitle+','+blauthor)){continue;}
            data_set.add(bltitle+','+blauthor);
            
            raw_data_ysh_jf_global.push([bltitle,blauthor,today]);
            current_result_ysh_jf_global.push([[bltitle,blauthor,today],blxl+1]);
        }
        idb_ysh_jf('write');
        result_percent_b('span_count',current_result_ysh_jf_global.length,raw_data_ysh_jf_global.length);        
        page_ysh_jf(1);
    } catch (err){
        alert(err.message);
    }
}

function date_fetch_ysh_jf(search_key=false){
    function sub_date_fetch_ysh_jf_do_fetch(){
        fetch(blhref)
        .then((response) => response.json())
        .then((data) => data_show_ysh_jf(data))
        .catch((error) => {
            alert('error:', error);
        });       
    }
    //-----------------------
    var oinput=document.getElementById('input_search');
    if (search_key===false){
        search_key=oinput.value.trim();
    }
    if (search_key==''){
        alert('请输入查询内容');
        return;
    }
    oinput.value=search_key;

    recent_ysh_jf(search_key);

    let blcount=parseInt(document.getElementById('input_count').value.trim());
    if (isNaN(blcount)){
        alert('格式错误');
        return
    }

    var is_idb=klmenu_check_b('span_idb_ysh_jf',false);            
    if (is_idb){
        idb_ysh_jf('read',search_key);
        return;
    }
    
    let apikey=document.getElementById('input_apikey').value.trim();
    if (apikey==''){
        alert('请输入 apikey');
        return;
    }
    
    let blhref="https://api-ap.hosted.exlibrisgroup.com/primo/v1/search?vid=65SIT_INST:SIT&tab=Everything&scope=MyInst_and_CI&lang=eng&offset=0&limit="+blcount+"&sort=rank&pcAvailability=true&getMore=0&conVoc=false&inst=65SIT_INST:SIT&skipDelivery=true&disableSplitFacets=false&apikey="+apikey+"&q=any,contains,"+encodeURIComponent(search_key);
    document.getElementById('divhtml').innerHTML='获取数据中...';
    setTimeout(sub_date_fetch_ysh_jf_do_fetch,100);
}

function page_ysh_jf(csno){
    var cslen=current_result_ysh_jf_global.length;
    var pages=page_combination_b(cslen,rows_per_page_ysh_jf_global,csno,'page_ysh_jf','locate_ysh_jf',false,1,10);  
    //-----------------------
    var result_t=[];
    var blend=Math.min(csno-1+rows_per_page_ysh_jf_global,cslen);
    var blno=0;

    for (let blxl=csno-1;blxl<blend;blxl++){
        var item=current_result_ysh_jf_global[blxl][0];
        var blno=current_result_ysh_jf_global[blxl][1]; //<td><span style="font-size:0.8rem;color:'+scheme_global['memo']+';">('+blno+')</span></td> - 此行保留 - 保留注释
        result_t.push('<tr><td>'+(blxl+1)+'</td><td>'+item[0]+'</td><td>'+item[1]+'</td><td>'+item[2]+'</td></tr>');
    }
    
    var odiv=document.getElementById('divhtml');

    if (result_t.length==0){
        odiv.innerHTML='';
    } else {
        odiv.innerHTML='<table class="table_common"><tr><th>No.</th><th>Title</th><th>Author</th><th>Date</th></tr>'+result_t.join('\n')+'</table>'+pages;
        mouseover_mouseout_oblong_span_b(odiv.querySelectorAll('span.oblong_box'));                
    }
}

function locate_ysh_jf(pages){
    var blno=page_location_b(pages);
    if (blno!==false){
        page_ysh_jf((blno-1)*rows_per_page_ysh_jf_global+1,rows_per_page_ysh_jf_global);
    }        
}

function idb_write_ysh_jf(db,do_alert=false){
    function sub_idb_write_ysh_jf_alert(){
        if (do_alert){
            var statistics=[];
            for (let key in count_dict){
                statistics.push(key+'：'+count_dict[key]);
            }
            alert('写入完成：'+statistics.join('；'));
        }    
    }
    
    function sub_idb_write_ysh_jf_append(otable){
        if (found_list.length==raw_data_ysh_jf_global.length){
            sub_idb_write_ysh_jf_alert();
            return;
        }
        
        for (let blxl=0;blxl<raw_data_ysh_jf_global.length;blxl++){
            if (found_list.includes(blxl)){continue;}
            
            var item=raw_data_ysh_jf_global[blxl];
            var objectStoreRequest = otable.add({'title':item[0],'author':item[1],'date':item[2]});
            objectStoreRequest.onsuccess = function(event){
                console.log('objectStoreRequest success',blxl,item);
                count_dict['添加']=count_dict['添加']+1;
                if (blxl==raw_data_ysh_jf_global.length-1){
                    sub_idb_write_ysh_jf_alert();
                }
            };
            objectStoreRequest.onerror = function(event){
                console.log('objectStoreRequest error',blxl,item);        
                count_dict['错误']=count_dict['错误']+1;                
            };
        }
    }

    function sub_idb_write_ysh_jf_onsuccess(otable){
        otable.openCursor().onsuccess = function (event){
            var cursor = event.target.result;
            if (cursor){
                for (let blxl=0;blxl<raw_data_ysh_jf_global.length;blxl++){
                    var item=raw_data_ysh_jf_global[blxl];
                    if (cursor.value.title+','+cursor.value.author==item.slice(0,2).join(',')){
                        if (cursor.value.date!==item[2]){
                            var updateData = cursor.value;
                            updateData.date=item[2];
                            var request = cursor.update(updateData);
                            
                            request.onsuccess = () => {
                                console.log('updated',blxl,item);
                                count_dict['更新']=count_dict['更新']+1;                                
                            };
                            request.onerror = () => {
                                console.log('error',blxl,item);
                                count_dict['错误']=count_dict['错误']+1;
                            };
                        } else {
                            count_dict['忽略']=count_dict['忽略']+1;
                        }
                        found_list.push(blxl);
                        break;
                    }
                }
                cursor.continue();
            } else {
                sub_idb_write_ysh_jf_append(otable);
            }
        };
    }
    //-----------------------
    var found_list=[];
    var count_dict={'更新':0,'添加':0,'忽略':0,'错误':0};
    return new Promise((resolve, reject) => {
        idb_write_b(db,'ysh_jf_dbf',false,false,sub_idb_write_ysh_jf_onsuccess,false);
        resolve(true);
    });
}

function idb_read_ysh_jf(db,cskey=false){
    function sub_idb_read_ysh_jf_search(){
        var isreg=klmenu_check_b('span_reg_ysh_jf',false);
        [cskey,isreg]=str_reg_check_b(cskey,isreg,true);
        
        current_result_ysh_jf_global=common_search_b(cskey,isreg,raw_data_ysh_jf_global,-1)[0];
        
        result_percent_b('span_count',current_result_ysh_jf_global.length,raw_data_ysh_jf_global.length);
        
        page_ysh_jf(1);
    }
    
    function sub_idb_read_ysh_jf_onsuccess(event){
        var cursor = event.target.result;
        if (cursor){
            raw_data_ysh_jf_global.push([cursor.value.title,cursor.value.author,cursor.value.date]);
            cursor.continue();
        } else {
            sub_idb_read_ysh_jf_search();
        }
    }
    //-----------------------
    raw_data_ysh_jf_global=[];
    return new Promise((resolve, reject) => {
        idb_read_b(db,'ysh_jf_dbf',sub_idb_read_ysh_jf_onsuccess);
        resolve(true);
    });
}

function idb_count_ysh_jf(db){
    function sub_idb_count_ysh_jf_onsuccess(cscount){
        alert('IDB 现有记录 '+cscount+' 条');
    }

    return new Promise((resolve, reject) => {
        var blcount=idb_count_b(db,'ysh_jf_dbf',sub_idb_count_ysh_jf_onsuccess);
        resolve(blcount);
    });
}

function idb_clear_ysh_jf(db){
    function sub_idb_clear_ysh_jf_count1(cscount){
        //document.getElementById('span_idb_status').innerHTML='IDB 清除前记录数：'+cscount;
    }

    function sub_idb_clear_ysh_jf_count2(cscount){
        //document.getElementById('span_idb_status').innerHTML='IDB数据清除完毕，现有记录 '+cscount+' 条';
    }
    
    function sub_idb_clear_ysh_jf_onsuccess(otable){
        //
    }
    
    return new Promise((resolve, reject) => {
        var rndstr=randstr_b(4,true,false);
        if ((prompt('输入 '+rndstr+' 确认清除全部数据') || '').trim()==rndstr){       
            idb_write_b(db,'ysh_jf_dbf',sub_idb_clear_ysh_jf_count1,sub_idb_clear_ysh_jf_count2,sub_idb_clear_ysh_jf_onsuccess);
        }
        resolve(true);
    });
}

function idb_ysh_jf(cstype='',cskey=false,do_alert=false){
    async function sub_idb_ysh_jf_switch(cstype, db, resolve, blcount){
        switch (cstype){
            case 'read':
                async function sub_idb_ysh_jf_read(){
                    console.log('sub_idb_ysh_jf_read()');
                    await idb_read_ysh_jf(db,cskey);
                    resolve(true);
                }
                sub_idb_ysh_jf_read();
                break;
            case 'write':
                async function sub_idb_ysh_jf_write(){
                    console.log('sub_idb_ysh_jf_write()');
                    await idb_write_ysh_jf(db,do_alert);
                    resolve(true);
                }
                sub_idb_ysh_jf_write();
                break;
            case 'clear':
                async function sub_idb_ysh_jf_clear(){
                    console.log('sub_idb_ysh_jf_clear()');
                    await idb_clear_ysh_jf(db);
                    resolve(true);
                }
                sub_idb_ysh_jf_clear();
                break;
            case 'count':
                async function sub_idb_ysh_jf_count(){
                    console.log('sub_idb_ysh_jf_count()');
                    blcount=await idb_count_ysh_jf(db);
                    resolve(blcount);
                }
                sub_idb_ysh_jf_count();
                break;
        }
    }
    //-----------------------
    return new Promise((resolve, reject) => {
        var bljg=idb_main_b(cstype,'ysh_jf_dbc','ysh_jf_dbf',sub_idb_ysh_jf_switch);
        resolve(bljg);
    });
    //idb_ysh_jf('count').then(value => {console.log('行数：',value);}); //此行保留 - 保留注释    
}
