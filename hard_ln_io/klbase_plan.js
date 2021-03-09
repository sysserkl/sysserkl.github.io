function count_klplan_b(){
    function sub_count_klplan_b_one_div(odiv){
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
    //------------------------------
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
        [one_done,one_done_today,one_total]=sub_count_klplan_b_one_div(one_div);
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

function done_list_klplan(csid='',cstype='',cssavename='',minday=''){
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
        list_t.push(now_time_str_b(':',true)+' '+day_2_week_b('',true)+','+csid);
        changed=true;
    }
    if (changed){
        localStorage.setItem(cssavename,list_t.join('\n'));
    }
    list_t.sort();
    return list_t;
}

function hide_klplan_b(only_today=false){
    hide_li_golbal=!hide_li_golbal;
    var today=date2str_b('-');
    var olis=document.querySelectorAll('div#divhtml li');
    for (let item of olis){
        var ospan_date=item.querySelector('span.span_date');
        if (ospan_date){
            if (hide_li_golbal==true){
                if (ospan_date.innerHTML==''){
                    item.style.display='none';
                }
                if (only_today && !ospan_date.innerText.includes(today)){
                    item.style.display='none';
                }
            }
            else {
                item.style.display='';
            }
        }        
    }
}

function search_klplan_b(){
    var cskey=prompt('输入搜索关键字：');
    if (cskey==null){
        return;
    }
    var olis=document.querySelectorAll('div#divhtml li');
    obj_search_show_hide_b(olis,'span.span_link',cskey.trim(),false,true);
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

function check_klplan_b(csid,csfound,cscaption,cssavename,blminday=''){
    var oa=document.getElementById('span_item_'+csid);
    var ospan=document.getElementById('span_'+csid);
    if (oa){
        if (csfound==false){
            if (confirm("是否标记【"+cscaption+"】为完成项目？")){
                oa.style.backgroundColor=scheme_global["pink"];
                done_list_klplan(csid,'add',cssavename,blminday);
                ospan.innerHTML=' <small><strong>('+now_time_str_b(':',true)+' '+day_2_week_b('',true)+')</strong></small>';
            }
        }
        else {
            if (confirm("是否恢复【"+cscaption+"】为未标记项目？")){
                oa.style.backgroundColor='';
                done_list_klplan(csid,'remove',cssavename,blminday);
                ospan.innerHTML='';
            }
        }
    }
    count_klplan_b();
}

function done_date_klplan_b(arow,today,span_name){
    var done_date=' <span id="span_'+span_name+'" class="span_date" style="color:'+scheme_global["shadow"]+';">';
    
    //获取日期和时间 - 保留注释
    var item0=arow.split(',')[0];
    
    //比较日期 - 保留注释
    if (today==item0.split(' ')[0]){
        done_date=done_date+'<small><strong>('+item0+')</strong></small></span>';
    }
    else {
        done_date=done_date+'<small>('+item0+')</small></span>';
    }
    return done_date;
}

function load_lists_klplan_b(csid){
    var plan_t=[];
    var list_t=local_storage_get_b(csid,-1,true);
    for (let arow of list_t){
        arow=arow.trim();
        var blat=arow.indexOf(' ');
        if (blat==-1){continue;}
        var blid=arow.substring(0,blat).trim();
        arow=arow.substring(blat,).trim();

        blat=arow.indexOf(' ');
        if (blat==-1){continue;}
    
        var blcategory=arow.substring(0,blat).trim();
        arow=arow.substring(blat,).trim();
        
        if (blid=='' || blcategory=='' || arow==''){continue;}
        if (blid.substring(0,1)=='#' || blcategory.substring(0,1)=='#' || arow.substring(0,1)=='#'){continue;}
        plan_t.push([blid,blcategory,arow]);
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
    
    var postpath=postpath_b();
	var bljg='<form method="POST" action="'+postpath+'temp_txt_share.php?type=list_'+cstype+'" name="form_list_'+cstype+'" target=_blank>\n';
    bljg=bljg+'<textarea name="textarea_list_'+cstype+'" id="textarea_list_'+cstype+'" style="width:90%;height:24rem;">'+list_plans.join('\n')+'</textarea>';
    bljg=bljg+'<p>';
    bljg=bljg+'<span class="aclick" onclick="javascript:document.getElementById(\'divhtml2\').innerHTML=\'\';">关闭</span> ';
    bljg=bljg+'<span class="aclick" onclick="javascript:local_storage_view_form_b(\'PIM\',\'divhtml2\');">查看 localStorage(PIM)</span> ';
    bljg=bljg+'<span class="aclick" onclick="javascript:'+update_fn_name+'(\'textarea_list_'+cstype+'\',\''+plan_id+'\');">更新</span> ';
    bljg=bljg+textarea_buttons_b('textarea_list_'+cstype,'清空,复制,发送到临时记事本,发送地址','list_'+cstype)+' 行数：'+list_plans.length;
    bljg=bljg+'</p></form>';
    
    bljg=bljg+"<p><b>1.</b> 格式：id 分类 名称 <b>2.</b> id必须唯一，名称可重复 <b>3. </b>忽略元素个数小于3的行 <b>4.</b> 如果前3个元素之一开头为#，则忽略</p>";
    bljg=bljg+'<hr />';
    document.getElementById('divhtml2').innerHTML=bljg;
}

function form_done_klplan_b(cstype,done_id,update_fn_name){
    var done_list=local_storage_get_b(done_id,-1,false);
    var postpath=postpath_b();
	var bljg='<form method="POST" action="'+postpath+'temp_txt_share.php?type=done_'+cstype+'" name="form_done_'+cstype+'" target=_blank>\n';
    bljg=bljg+'<textarea name="textarea_done_'+cstype+'" id="textarea_done_'+cstype+'" style="width:90%;height:24rem;">'+done_list+'</textarea>';
    bljg=bljg+'<p>';
    bljg=bljg+'<span class="aclick" onclick="javascript:document.getElementById(\'divhtml2\').innerHTML=\'\';">关闭</span> ';
    bljg=bljg+'<span class="aclick" onclick="javascript:local_storage_view_form_b(\'done_PIM\',\'divhtml2\');">查看 localStorage(done_PIM)</span> ';        
    bljg=bljg+'<span class="aclick" onclick="javascript:'+update_fn_name+'(\'textarea_done_'+cstype+'\',\''+done_id+'\',false);">更新完成项</span> ';
    bljg=bljg+textarea_buttons_b('textarea_done_'+cstype,'清空,复制,发送到临时记事本,发送地址','done_'+cstype)+' 行数：'+done_list.split('\n').length;
    bljg=bljg+'</p></form>';
    document.getElementById('divhtml2').innerHTML=bljg;
}

function edit_item_klplan_b(csarray,plan_id,csid){
    for (let item of csarray){
        if (csid!==item[0]){continue;}
        var new_name=(prompt('输入新的名称，若删除则输入【删除】二字',item[2]) || '').trim();
        if (new_name==''){
            alert('取消修改');
            return false;
        }
        if (new_name=='删除'){
            if (confirm("是否删除 "+item[1]+' '+specialstr92_b(item[2])+"？")){
                change_klplan_b(csarray,plan_id,csid,false);
                alert('已删除');
                return true;
            }
            else {
                alert('取消删除');
                return false;
            }        
        }
        var new_category=(prompt('输入新的分类',item[1]) || '').trim();
        if (new_category==''){
            alert('取消修改');
            return false;
        }
        if (confirm("是否修改 "+item[1]+' '+specialstr92_b(item[2])+' 为 '+new_category+' '+specialstr92_b(new_name)+"？")){
            change_klplan_b(csarray,plan_id,csid,[item[0],new_category,new_name]);
            alert('已更新');
            return true;
        }
        else {
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

function change_klplan_b(csarray,plan_id,csid,new_row=false){
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
    list2localstorage_klplan_b(new_list,plan_id);
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

function new_item_klplan_b(csarray,plan_id){
    var new_name=(prompt('输入新事项的名称') || '').trim();
    if (new_name==''){
        alert('取消添加');
        return false;
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
    if (new_category==''){
        alert('取消添加');
        return false;
    }
    if (confirm("是否添加新事项 "+new_category+' '+specialstr92_b(new_name)+"？")){
        change_klplan_b(csarray,plan_id,'',['',new_category,new_name]);
        return true;
    }
    return false;
}
