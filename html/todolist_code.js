function check_todolist(csid,cscategory){
    var list_t=done_list_klplan('','','done_todolist','');
    var blfound=false;
    var blcaption='';
    [blfound,blcaption]=found_klplan_b(list_t,csid,todolist_data_global,'');    
    
    check_klplan_b(csid,blfound,blcaption,'done_todolist','');
}

function clear_todolist(){
    if (confirm("是否清空全部完成项目？")){
        localStorage.setItem('done_todolist','');
        html_todolist();
    }
}

function edit_switch_todolist(){
    edit_switch_klplan_b('div#divhtml span[class="span_box span_edit_todolist"]');
}

function form_list_todolist(){
    form_list_klplan_b(todolist_data_global,'todolist','list_todolist','update_todolist');
}

function demo_todolist(){
    var list_str=local_storage_get_b('list_todolist',-1,false).trim();
    if (list_str!==''){
        alert('现有事项，取消导入');
        return;
    }
    if (confirm('是否导入Demo事项？')){
        localStorage.setItem('list_todolist',todolist_demo_data_global.trim());
        todolist_data_global=load_lists_klplan_b('list_todolist');
        init_todolist(false);
    }
}

function form_done_todolist(){
    form_done_klplan_b('todolist','done_todolist','update_todolist');
}

function edit_item_todolist(csid){
    if (edit_item_klplan_b(todolist_data_global,'list_todolist',csid)){
        todolist_data_global=load_lists_klplan_b('list_todolist');
        init_todolist(false);
        edit_show_klplan_b('div#divhtml span[class="span_box span_edit_todolist"]');
    }
}

function update_todolist(textarea_id='',local_storage_id='',reload=true){
    //update_todolist() - 意味仅重载 - 保留注释
    if (update_klplan_b(textarea_id,local_storage_id)){
        if (reload){
            todolist_data_global=load_lists_klplan_b('list_todolist');
        }    
        init_todolist(false);
    }
}

function menu_todolist(){
    var str_t=klmenu_hide_b('');
    var klmenu1=[
    '<span class="span_menu" onclick="javascript:'+str_t+'search_klplan_b();">搜索</span>',     
    '<span class="span_menu" onclick="javascript:'+str_t+'edit_switch_todolist();">逐个整理事项</span>',    
    '<span class="span_menu" onclick="javascript:'+str_t+'form_list_todolist();">批量整理事项</span>',
    '<span class="span_menu" onclick="javascript:'+str_t+'demo_todolist();">导入Demo事项</span>',
    '<span class="span_menu" onclick="javascript:'+str_t+'form_done_todolist();">导入/导出完成项</span>',    
    '<span class="span_menu" onclick="javascript:'+str_t+'update_todolist();">数据重载</span>',            
    '<span class="span_menu" onclick="javascript:'+str_t+'if (confirm(\'是否更新版本？\')){service_worker_delete_b(\'todolist\');}">更新版本</span>',
    ];
    
    document.getElementById('h2_title').insertAdjacentHTML('afterbegin',klmenu_multi_button_div_b(klmenu_b(klmenu1,'✅','14rem','1rem','1rem','60rem'),'','0rem')+' '); //♾ - 保留注释
}

function show_todolist(){
    var csdone_list=done_list_klplan('','','done_todolist','');
    var bljg='';
    var category='';
    var category_list=[];
    var today=date2str_b('-');
    for (let item of todolist_data_global){
        if (category==''){
            category=item[1];
            //<span class="span_category"> 的 innerHTML 只能是 分类名 - 保留注释
            bljg=bljg+category_klplan_b(category);
            category_list.push(category);
        }
        else if (category!==item[1]){
            bljg=bljg+'</ol></div>';
            category=item[1];
            bljg=bljg+category_klplan_b(category);
            category_list.push(category);
        }
    
        bljg=bljg+'<li>';
        bljg=bljg+'<span class="span_link" onclick="javascript:check_todolist(\''+item[0]+'\',\''+category+'\');" id="span_item_'+item[0]+'"';

        var done_date='<span id="span_'+item[0]+'" class="span_date" style="color:'+scheme_global["shadow"]+';"></span>';
        for (let arow of csdone_list){
            if (arow.split(',')[1]!==item[0]){
                continue;
            }
            bljg=bljg+' style="background-color:'+scheme_global["pink"]+';"';

            done_date=done_date_klplan_b(arow,today,item[0]);
            break;
        }
        bljg=bljg+'>'+specialstr92_b(item[2]);
        
        var span_edit=' <span class="span_box span_edit_todolist" onclick="javascript:edit_item_todolist(\''+item[0]+'\');" style="font-size:0.9rem;display:none;">🖍</span> ';

        bljg=bljg+'</span>'+span_edit+done_date;
        bljg=bljg+'</li>';
    }
    
    if (bljg.slice(-11,)!=='</ol></div>'){
        bljg=bljg+'</ol></div>';
    }
    document.getElementById('divhtml').innerHTML=bljg;
    count_klplan_b();
    return category_list;
}

function init_todolist(showmenu=true){
    todolist_data_global=sort_klplan_b(todolist_data_global);
    if (no_repeated_keys_klplan(todolist_data_global)){
        html_todolist();
    }
    if (showmenu){
        menu_todolist();
    }    
}

function html_todolist(){
    var list_t=show_todolist();
    var bljg='';
    for (let item of list_t){
        bljg=bljg+'<a href="#'+item+'" class="a_oblong_box">'+item+'</a> ';
    }
    bljg=bljg+'<span class="oblong_box" onclick="javascript:new_item_todolist();">新事项</span> ';    
    var odiv=document.getElementById('div_category_links')
    odiv.innerHTML=bljg;
    mouseover_mouseout_oblong_span_b(odiv.querySelectorAll('span.oblong_box'));
    
    if (ismobile_b()==false){
        document.getElementById('divhtml').style.columnCount=5;
    }
}

function new_item_todolist(){
    if (new_item_klplan_b(todolist_data_global,'list_todolist')){
        todolist_data_global=load_lists_klplan_b('list_todolist');
        init_todolist(false);
        alert('已添加');
    }
}
