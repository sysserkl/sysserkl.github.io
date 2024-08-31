function count_get_klplan_b(){
    function sub_count_get_klplan_b_one_div(odiv){
        var items=odiv.getElementsByClassName('span_date');
        var bltotal=items.length;
        var bldone=0;
        var bldone_today=0;
        for (let one_item of items){
            if (one_item.innerHTML!==''){
                bldone=bldone+1;
                if (one_item.innerText.includes(today)){
                    bldone_today=bldone_today+1;
                }
            }
        }
        var ospan=odiv.querySelector('span.span_cetegory_count');
        ospan.innerHTML=bldone+'/'+bltotal;
        return [bldone,bldone_today,bltotal];
    }
    //-----------------------
    //var cscolor='rgb('+hex2rgb_b(scheme_global["pink"]).join(', ')+')'; - 保留注释
    var bldone=0;
    var bldone_today=0;
    var bltotal=0;
    var one_done;
    var one_done_today;
    var one_total;
    var today=date2str_b('-');
    var odivs=document.getElementsByClassName('div_category');
    for (let one_div of odivs){
        [one_done,one_done_today,one_total]=sub_count_get_klplan_b_one_div(one_div);
        bldone=bldone+one_done;
        bldone_today=bldone_today+one_done_today;
        bltotal=bltotal+one_total;
    }
    document.getElementById('span_total').innerHTML='('+bldone+'/'+bldone_today+'/'+bltotal+')';
}

function remove_memo_klplan_b(cslist){
    //cslist 形如 以 ["info2","信息","整理5个mht文件"] 为元素，组成的数组 - 保留注释
    var list_t=[];
    for (let item of cslist){
        if (!Array.isArray(item)){continue;} //支持非数组类型的元素 - 保留注释
        if (item.length<3){continue;} //忽略元素个数小于3的数组 - 保留注释
        if (item[0].substring(0,1)=='#' || item[1].substring(0,1)=='#' || item[2].substring(0,1)=='#'){
            continue; //如果前3个元素之一开头为#，则忽略 - 保留注释
        } 
        list_t.push(item);
    }
    return list_t;
}

function done_list_klplan_b(csid='',cstype='',cssavename='',minday=''){
    var list_done=local_storage_get_b(cssavename,-1,true);
    var list_t=[];
    var changed=false;
    for (let item of list_done){
        if (minday!=='' && item<minday || !item.includes(',')){
            changed=true;
            continue;
        }
        if (cstype=='remove' && item.split(',')[1]==csid){
            changed=true;
            continue;
        }
        list_t.push(item);
    }
    if (cstype=='add' && csid!==''){
        list_t.push(now_time_str_b(':',true)+' '+day_2_week_b('','en3')+','+csid);
        changed=true;
    }
    if (changed){
        localStorage.setItem(cssavename,list_t.join('\n'));
    }
    list_t.sort();
    return list_t;
}

function hide_klplan_b(only_today=false,show_all=false){
    if (!show_all){
        hide_li_golbal=!hide_li_golbal;
    } else {
        console.log('hide_klplan_b()','show_all');
    }
    var today=date2str_b('-');
    var undone_set=new Set();
    var is_unique=klmenu_check_b('span_unique_klplan',false);
    var olis=document.querySelectorAll('div#divhtml li');
    for (let item of olis){
        var ospan_date=item.querySelector('span.span_date');
        if (!ospan_date){continue;}
        
        if (!show_all && hide_li_golbal==true){
            if (ospan_date.innerHTML==''){
                item.style.display='none';
            }
            if (only_today && !ospan_date.innerText.includes(today)){
                item.style.display='none';
            }
        } else if (is_unique){
            var ocontent=item.querySelector('span.span_link');
            var odate=item.querySelector('span.span_date');
            if (odate){
                if (odate.innerText!==''){
                    item.style.display='';
                    continue;
                }
            }
            if (ocontent){
                var blcontent=ocontent.innerText;
                if (undone_set.has(blcontent)){
                    item.style.display='none';
                } else {
                    item.style.display='';
                    if (ospan_date.innerHTML==''){
                        undone_set.add(blcontent);
                    }
                }
            } else {
                item.style.display='';
            }
        } else {
            item.style.display='';
        }
    }
}

function search_klplan_b(){
    var cskey=prompt('输入搜索关键字：',recent_search_key_klplan_global);
    if (cskey==null){return;}
    recent_search_key_klplan_global=cskey;
    var olis=document.querySelectorAll('div#divhtml li');
    var isreg=klmenu_check_b('span_reg_klplan',false);
    obj_search_show_hide_b(olis,'span.span_link',cskey.trim(),isreg,true);
}

function category_klplan_b(cscategory){
    var spanstr='<span class="span_cetegory_count" style="font-size:1rem;color:'+scheme_global["shadow"]+';"></span>';
    var bljg='<a name="'+cscategory+'"></a><div class="div_category"><h4><span class="span_category">'+cscategory+'</span> '+spanstr+'</h4>';
    bljg=bljg+'<ol>';
    return bljg;
}

function no_repeated_keys_klplan(cslist){
    var bljg=array_repeated_column_value_b(cslist,0);
    if (bljg.length>0){
        document.getElementById('divhtml').innerHTML='<h4>发现重复key：</h4>'+bljg.join('<br />');
        return false;
    }
    return true;
}

function found_klplan_b(csdonelist,csid,cstodolist,minday=''){
    var blfound=false;
    var blcaption='';    
    for (let item of csdonelist){
        if (minday!=='' && item<minday){continue;}
        if (item.split(',')[1]==csid){
            blfound=true;
            break;
        }
    }
    for (let item of cstodolist){
        if (item[0]==csid){
            blcaption=item[2]+' - '+item[1];
        }
    }
    return [blfound,blcaption];
}

function show_namesake_undone_item_klplan_b(ospan){
    var is_unique=klmenu_check_b('span_unique_klplan',false);
    if (!is_unique){return;}
    
    var blstr=ospan.innerText;
    var olis=document.querySelectorAll('div#divhtml li');
    for (let one_li of olis){
        var ospan=one_li.querySelector('span.span_link');
        var odate=one_li.querySelector('span.span_date');
        if (ospan.innerText==blstr && odate.innerHTML==''){
            one_li.style.display='';
            break;
        }
    }
}

function check_klplan_b(csid,csfound,cscaption,cssavename,blminday='',odom=false,show_done=true,show_undone=true){
    var oa=document.getElementById('span_item_'+csid);
    var ospan=document.getElementById('span_'+csid);
    if (oa){
        if (csfound==false){
            if (confirm("是否标记【"+cscaption+"】为完成项目？")){
                oa.style.backgroundColor=scheme_global["pink"];
                done_list_klplan_b(csid,'add',cssavename,blminday);
                ospan.innerHTML=' <small><strong>('+now_time_str_b(':',true)+' '+day_2_week_b('','en3')+')</strong></small>';
                if (odom!==false){
                    odom.style.display=(show_done?'':'none');
                }
                show_namesake_undone_item_klplan_b(oa);
            }
        } else {
            if (confirm("是否恢复【"+cscaption+"】为未标记项目？")){
                oa.style.backgroundColor='';
                done_list_klplan_b(csid,'remove',cssavename,blminday);
                ospan.innerHTML='';
                if (odom!==false){
                    odom.style.display=(show_undone?'':'none');
                }                
            }
        }
    }
    count_get_klplan_b();
}

function done_date_klplan_b(arow,today,span_name){
    var done_date=' <span id="span_'+span_name+'" class="span_date" style="color:'+scheme_global["shadow"]+';">';
    
    //获取日期和时间 - 保留注释
    var item0=arow.split(',')[0];
    
    //比较日期 - 保留注释
    if (today==item0.split(' ')[0]){
        done_date=done_date+'<small><strong>('+item0+')</strong></small></span>';
    } else {
        done_date=done_date+'<small>('+item0+')</small></span>';
    }
    return done_date;
}

function id_category_name_get_klplan_b(arow){
    arow=arow.trim();
    var blat=arow.indexOf(' ');
    if (blat==-1){return false;}
    var blid=arow.substring(0,blat).trim();
    arow=arow.substring(blat,).trim();

    blat=arow.indexOf(' ');
    if (blat==-1){return false;}

    var blcategory=arow.substring(0,blat).trim();
    arow=arow.substring(blat,).trim();
    
    if (blid=='' || blcategory=='' || arow==''){return false;}
    if (blid.substring(0,1)=='#' || blcategory.substring(0,1)=='#' || arow.substring(0,1)=='#'){return false;}
    
    return [blid,blcategory,arow];
}

function load_lists_klplan_b(csid){
    var plan_t=[];
    var list_t=local_storage_get_b(csid,-1,true);
    for (let arow of list_t){        
        var result_t=id_category_name_get_klplan_b(arow);
        if (result_t===false){continue;}
        plan_t.push(result_t);
    }
    return remove_memo_klplan_b(plan_t);
}

function sort_klplan_b(csarray){
    csarray.sort();
    csarray.sort(function (a,b){return zh_sort_b(a,b,false,2)});
    csarray.sort(function (a,b){return zh_sort_b(a,b,false,1)});
    return csarray;
}

function edit_show_klplan_b(query_str){
    var ospans=document.querySelectorAll(query_str);
    if (ospans.length<1){return;}
    for (let one_span of ospans){
        one_span.style.display='';
    }
}

function edit_switch_klplan_b(query_str){
    var ospans=document.querySelectorAll(query_str);
    if (ospans.length<1){return;}
    var bldisplay=ospans[0].style.display;
    for (let one_span of ospans){
        one_span.style.display=(bldisplay==''?'none':'');
    }
}

function update_klplan_b(textarea_id,local_storage_id){
    if (textarea_id==''){return true;}  //仅重载 - 保留注释
    if (local_storage_id==''){return false;}
    if (confirm("是否更新？")){
        var blstr=document.getElementById(textarea_id).value.trim();
        localStorage.setItem(local_storage_id,blstr);
        return true;
    }
    return false;
}

function form_list_klplan_b(csarray,cstype,plan_id,update_fn_name){
    //var list_routines=local_storage_get_b('list_routines',-1,false); - 保留注释
    var list_plans=[];
    for (let item of csarray){
        list_plans.push(item.join(' '));
    }
        
    var left_strings='<p>';
    left_strings=left_strings+close_button_b('divhtml2','')+' ';
    left_strings=left_strings+'<span class="aclick" onclick="local_storage_view_form_b(\'PIM\',\'divhtml2\');">View localStorage(PIM)</span> ';
    left_strings=left_strings+'<span class="aclick" onclick="filter_klplan_b(\'textarea_list_'+cstype+'\',this);">Filter</span> ';    
    left_strings=left_strings+'<span class="aclick" onclick="'+update_fn_name+'(\'textarea_list_'+cstype+'\',\''+plan_id+'\');">Update</span> ';
    var right_strings=' rows: <span id="span_rows_klplan">'+list_plans.length+'</span></p>';

    var bljg=textarea_with_form_generate_b('textarea_list_'+cstype,'width:90%;height:24rem;',left_strings,'清空,复制,发送到临时记事本,发送地址',right_strings,'list_'+cstype,'form_list_'+cstype,false,list_plans.join('\n'));

    bljg=bljg+'<p><textarea id="textarea_filter_items_klplan" style="display:none;" onclick="this.select();document.execCommand(\'copy\');"></textarea></p>\n';
    
    bljg=bljg+"<p><b>1.</b> 格式：id 分类 名称 <b>2.</b> id必须唯一，名称可重复 <b>3. </b>忽略元素个数小于3的行 <b>4.</b> 如果前3个元素之一开头为#，则忽略</p>";
    bljg=bljg+'<hr />';
    document.getElementById('divhtml2').innerHTML=bljg;
}

function filter_klplan_b(textarea_id,ospan=false){
    var otextarea=document.getElementById(textarea_id);
    var list_t=otextarea.value.trim().split('\n');

    var cskey=(prompt('输入分类 或 名称 或 分类 名称，不支持正则表达式：') || '').trim();
    if (cskey==''){return;}
    
    var others_item_list=[];
    var current_item_list=[];
    var category_set=new Set();
    for (let item of list_t){
        var result_t=id_category_name_get_klplan_b(item);
        if (result_t===false){continue;}
        
        if (cskey==result_t[1] || cskey==result_t[2] || cskey==result_t[1]+' '+result_t[2]){
            current_item_list.push(item);
            category_set.add(result_t[1]);
        } else {
            others_item_list.push(item);
        }
        if (category_set.size>1){
            alert('分类数超过1个（'+Array.from(category_set)+'），取消操作');
            return;
        }
    }
    if (current_item_list.length==0){
        alert('not found');
        return;
    }
    
    otextarea.value=others_item_list.join('\n');
    document.getElementById('span_rows_klplan').innerHTML=others_item_list.length;
    var otextarea_current=document.getElementById('textarea_filter_items_klplan');
    otextarea_current.value=current_item_list.join('\n');
    otextarea_current.style.display='';
    alert('原共有项目'+list_t.length+'条；当前筛选出项目'+current_item_list.length+'条，分类为：'+Array.from(category_set)[0]+'；剩余项目'+others_item_list.length+'条。'+(list_t.length==current_item_list.length+others_item_list.length?'条数一致。':'条数不一致。'));
    if (ospan!==false){
        ospan.style.display='none'; //仅运行一次filter，避免误删 - 保留注释
    }
}

function form_done_klplan_b(cstype,done_id,update_fn_name){
    var done_list=local_storage_get_b(done_id,-1,false);

    var left_strings='<p>';
    left_strings=left_strings+close_button_b('divhtml2','')+' ';
    left_strings=left_strings+'<span class="aclick" onclick="local_storage_view_form_b(\'done_PIM\',\'divhtml2\');">View localStorage(done_PIM)</span> ';        
    left_strings=left_strings+'<span class="aclick" onclick="'+update_fn_name+'(\'textarea_done_'+cstype+'\',\''+done_id+'\',false);">Update done items</span> ';
    var right_strings=' rows: '+done_list.split('\n').length+'</p>';
    
    var blstr=textarea_with_form_generate_b('textarea_done_'+cstype,'width:90%;height:24rem;',left_strings,'清空,复制,发送到临时记事本,发送地址',right_strings,'done_'+cstype,'form_done_'+cstype,false,done_list);

    document.getElementById('divhtml2').innerHTML=blstr;
}

function edit_item_klplan_b(csarray,plan_id,csid){
    for (let item of csarray){
        if (csid!==item[0]){continue;}
        var new_name=(prompt('输入新的名称，若删除则输入【删除】或【delete】',item[2]) || '').trim();
        new_name=new_name.replace(/\r?\n/g,' ');
        if (new_name==''){
            alert('取消修改');
            return false;
        }
        if (new_name.includes('///')){
            alert('不得含有///，取消修改');
            return false;
        }
            
        if (new_name=='删除' || new_name=='delete'){
            if (confirm('是否删除 '+item[1]+' '+specialstr92_b(item[2])+'？')){
                change_klplan_b(csarray,plan_id,csid,false);
                alert('已删除');
                return true;
            } else {
                alert('取消删除');
                return false;
            }        
        }
        var new_category=(prompt('输入新的分类',item[1]) || '').trim();
        new_category=new_category.replace(/\r?\n/g,' ');
        
        if (new_category==''){
            alert('取消修改');
            return false;
        }
        if (confirm('是否修改 '+item[1]+' '+specialstr92_b(item[2])+' 为 '+new_category+' '+specialstr92_b(new_name)+'？')){
            change_klplan_b(csarray,plan_id,csid,[item[0],new_category,new_name]);
            alert('已更新');
            return true;
        } else {
            alert('取消修改');
            return false;
        }
        break;
    }
    return false;
}

function list2localstorage_klplan_b(cslist,plan_id){
    var bljg=[];
    for (let one_row of cslist){
        bljg.push(one_row.join(' '));
    }
    localStorage.setItem(plan_id,bljg.join('\n'));
}

function change_klplan_b(csarray,plan_id,csid,new_row=false,save_local=true){
    var new_list=[];
    for (let arow of csarray){
        if (csid!=='' && arow[0]==csid){continue;}
        new_list.push(arow);   
    }
    if (Array.isArray(new_row)){
        if (new_row.length==3){
            if (new_row[0]==''){
                new_row[0]=new_id_klplan_b(csarray);
            }
            new_list.push(new_row);
        }
    }
    new_list=sort_klplan_b(new_list);
    if (save_local){
        list2localstorage_klplan_b(new_list,plan_id);
    }
    return new_list;
}

function new_id_klplan_b(csarray){
    var list_t=[];
    for (let arow of csarray){
        list_t.push(arow[0]);
    }
    var blstr='';
    while (true){
        blstr=randstr_b(8);
        if (!list_t.includes(blstr)){
            break;
        }
    }
    return blstr;
}

function new_item_klplan_b(csarray,plan_id,multiple=false){
    var recent_input_item_name=local_storage_get_b('recent_input_item_name_klplan').trim();
    var new_name=(prompt('输入新事项的名称',recent_input_item_name) || '').trim();
    new_name=new_name.replace(/\r?\n/g,' ');
    
    if (new_name==''){
        alert('取消添加');
        return false;
    }
    
    if (new_name.includes('///')){
        alert('不得含有///，取消添加');
        return false;
    }
    
    if (recent_input_item_name!==new_name){
        localStorage.setItem('recent_input_item_name_klplan',new_name);
    }
    
    var new_category=''
    for (let item of csarray){
        if (item.length<3){continue;}
        if (item[2]==new_name){
            new_category=item[1];
            break;
        }
    }
    var new_category=(prompt('输入新事项的分类',new_category) || '').trim();
    new_category=new_category.replace(/\r?\n/g,' ');
    
    if (new_category==''){
        alert('取消添加');
        return false;
    }
    
    var times=1;
    if (multiple){
        times=parseInt((prompt('项目个数') || '').trim());
        if (isNaN(times)){
            alert('格式错误');
            return false;            
        }
    }
    if (times>1){
        if (confirm('是否添加新事项 '+new_category+' '+specialstr92_b(new_name)+' 〔'+times+'〕次？')){
            for (let blxl=0;blxl<times;blxl++){
                csarray=change_klplan_b(csarray,plan_id,'',['',new_category,new_name],false);
            }
            list2localstorage_klplan_b(csarray,plan_id);
            return true;
        }
        return false;        
    } else {
        if (confirm('是否添加新事项 '+new_category+' '+specialstr92_b(new_name)+'？')){
            change_klplan_b(csarray,plan_id,'',['',new_category,new_name]);
            return true;
        }
        return false;
    }
}

function statistics_category_count_klplan_b(cslist,csbegin='',csend=''){    
    var result_t;
    var total_t;
    [result_t,total_t]=statistics_cym_get_klplan_b(cslist,0,csbegin,csend).slice(0,2);
        
    result_t=object2array_b(result_t);
    result_t.sort(function (a,b){return a[2]<b[2] ? 1 : -1;});
   
    for (let blxl=0,lent=result_t.length;blxl<lent;blxl++){
        var blpercent=(result_t[blxl][2]*100/total_t['ALL'][1]).toFixed(2)+'%';
        result_t[blxl]='<tr><td align="right">'+(blxl+1)+'</td><td>'+result_t[blxl][0]+'</td><td>'+number_2_emoji_b(result_t[blxl][2])+'</td><td align="right">'+result_t[blxl][2]+'</td><td align="right">'+blpercent+'</td></tr>';
    }
    result_t.push('<tr style="font-weight:bold;"><td></td><td>Total</td><td>'+number_2_emoji_b(total_t['ALL'][1])+'</td><td align="right">'+total_t['ALL'][1]+'</td><td align="right">100.00%</td></tr>');
    
    var th='<tr><th>No.</th><th>Category</th><th>Medal</th><th>Count</th><th>Percent</th></tr>';
    return th+result_t.join('\n');
}

function statistics_cym_get_klplan_b(cslist,csat=0,csbegin='',csend=''){
    var filtered_list=[];
    for (let arow of cslist){
        arow=arow.trim().split(' /// ');
        if (arow.length!==3){continue;}
        arow[1]=arow[1].trim();
        var blyear=arow[1].split(' ')[0];
        
        if (blyear>=csbegin && (csend=='' || blyear<=csend)){            
            filtered_list.push(arow);
        }
    }

    var result_t={};
    var total_t={};
    var category_set=new Set();
    var date_set=new Set();
    for (let item of filtered_list){
        var item_category=item[2];
        var item_date=item[1].substring(0,csat);
        
        category_set.add(item_category);
        
        if (result_t[item_category+item_date]==undefined){
            result_t[item_category+item_date]=[item_category,item_date,0];
        }
        result_t[item_category+item_date][2]=result_t[item_category+item_date][2]+1;

        if (item_date!==''){
            date_set.add(item_date);   

            if (total_t[item_date]==undefined){
                total_t[item_date]=[item_date,0];
            }
            total_t[item_date][1]=total_t[item_date][1]+1;        
        } else {
            if (total_t['ALL']==undefined){
                total_t['ALL']=['ALL',0];
            }
            total_t['ALL'][1]=total_t['ALL'][1]+1;            
        }
    }
    
    //result_t 每一个 key，如"IT"，形如：["IT","",20] 或 [ "IT", "2022-06", 3 ] - 保留注释
    //total_t 的 key "ALL"形如: ["ALL", 1169]，或 key "2022-04" 形如: [ "2022-04", 239 ] - 保留注释
    return [result_t,total_t,category_set,date_set];
}

function statistics_category_year_month_klplan_b(cslist,csat=0,csbegin='',csend=''){
    var result_t;
    var total_t;
    var category_set;
    var date_set;
    [result_t,total_t,category_set,date_set]=statistics_cym_get_klplan_b(cslist,csat,csbegin,csend);
    
    date_set=Array.from(date_set);
    date_set.sort();
    var th_list=['<th>No.</th>','<th>分类</th>'];
    for (let adate of date_set){
        for (let acategory of category_set){
            if (result_t[acategory+adate]==undefined){
                result_t[acategory+adate]=[acategory,adate,0];
            }
        }
        th_list.push('<th>'+adate+'</th>');
    }
       
    result_t=object2array_b(result_t);
    result_t.sort();
    
    if (th_list.length==2){
        th_list.push('<th>Count</th>');
    }
    
    var acategory='';
    var td_list=[];
    var tr_list=[];
    var row_total=0;
    var all_total=0;
    for (let item of result_t){
        if (item[0]!==acategory){
            if (td_list.length>0){
                tr_list.push([td_list.join('')+'<td align="right" style="font-weight:bold;">'+row_total+'</td>',row_total]);
                row_total=0;
            }
            acategory=item[0];
            td_list=['<td>'+item[0]+'</td>'];
        }
        td_list.push('<td align="right">'+item[2]+'</td>');
        row_total=row_total+item[2];
        all_total=all_total+item[2];
    }
    
    if (td_list.length>0){
        tr_list.push([td_list.join('')+'<td align="right" style="font-weight:bold;">'+row_total+'</td>',row_total]);
    }

    tr_list.sort(function (a,b){return a[1]<b[1] ? 1 : -1;});

    for (let blxl=0,lent=tr_list.length;blxl<lent;blxl++){
        tr_list[blxl]='<td>'+(blxl+1)+'</td>'+tr_list[blxl][0]+'<td align="right">'+(tr_list[blxl][1]*100/all_total).toFixed(2)+'%</td>';
    }
    
    tr_list=[th_list.join('')+'<th>Total</th><th>Percent</th>'].concat(tr_list);
    
    total_t=object2array_b(total_t);
    total_t.sort();
    var sum_list=[];
    var sum_str='';
    if (total_t.length>0){
        for (let item of total_t){
            sum_list.push('<td align="right">'+item[1]+'</td>');
        }
        sum_str='<tr style="font-weight:bold;"><td></td><td>Total</td>'+sum_list.join('')+'<td align="right">'+all_total+'</td><td align="right">100.00%</td></tr>';
    }
    return '<tr>'+tr_list.join('</tr>\n<tr>')+'</tr>'+sum_str;
}
