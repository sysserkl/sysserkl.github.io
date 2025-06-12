function show_type_todolist(save_to_local_storage=false){
    var oselect=document.getElementById('select_show_type_todolist');
    if (!oselect){
        return [true,true];
    }
    var bltype=oselect.value;
    if (save_to_local_storage){
        localStorage.setItem('show_totolist',bltype);
    }
    var show_done=(bltype=='all' || bltype=='done');
    var show_undone=(bltype=='all' || bltype=='undone');
    return [show_done,show_undone];
}

function check_todolist(oli,csid,cscategory){
    var list_t=done_list_klplan_b('','','done_todolist','');
    var blfound=false;
    var blcaption='';
    [blfound,blcaption]=found_klplan_b(list_t,csid,todolist_data_global,'');    
    var show_done;
    var show_undone;
    [show_done,show_undone]=show_type_todolist();
    check_klplan_b(csid,blfound,blcaption,'done_todolist','',oli,show_done,show_undone);
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
        var demo_str=['emergency1 应急外出 病222历单、病历卡','emergency2 应急外出 公交卡','emergency10 应急外出 保温杯','emergency13 应急外出 垃圾袋','comeback1 外出后回家整理事宜 打开电源','comeback3 外出后回家整理事宜 开窗、开门、开阳台','comeback4 外出后回家整理事宜 开水阀门、烧水','comeback5 外出后回家整理事宜 整理冰箱','equipment4 旅游物资准备 风油精|白花油|清凉油','equipment5 旅游物资准备 邦迪','equipment19 旅游物资准备 塑料袋','equipment28 旅游物资准备 手电筒 or 头灯',].join('\n');
        localStorage.setItem('list_todolist',demo_str);
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
    var show_type=local_storage_get_b('show_totolist');
    var blselect=[];
    for (let item of ['all','done','undone']){
        if (show_type==item){
            blselect.push('<option selected>'+item+'</option>');
        } else {
            blselect.push('<option>'+item+'</option>');
        }
    }
    
    var klmenu1=[
    '<span class="span_menu" onclick="'+str_t+'search_klplan_b();">search</span>',    
    '<span id="span_reg_klplan" class="span_menu" onclick="'+str_t+'klmenu_check_b(this.id,true);">⚪ reg</span>',
    '<span class="span_menu" onclick="'+str_t+'demo_todolist();">import demo</span>',
    '<span class="span_menu" onclick="'+str_t+'form_done_todolist();">import/export finished items</span>',    
    '<span class="span_menu">show: <select id="select_show_type_todolist" onchange="show_todolist(true);">'+blselect.join('')+'</select></span>',
    '<span class="span_menu" onclick="'+str_t+'update_todolist();">reload</span>',            
    '<span class="span_menu" onclick="'+str_t+'service_worker_delete_b(\'todolist\');">update</span>',
    ];
    
    var group_list=[
    ['one by one','edit_switch_todolist();',true],
    ['batch','form_list_todolist();',true],
    ];    
    klmenu1.push(menu_container_b(str_t,group_list,'organize: '));
    
    document.getElementById('h2_title').insertAdjacentHTML('afterbegin',klmenu_multi_button_div_b(klmenu_b(klmenu1,'✅','18rem','1rem','1rem','60rem'),'','0rem')+' '); //♾ - 保留注释
    klmenu_check_b('span_reg_klplan',true);
}

function show_todolist(save_to_local_storage=false){
    var csdone_list=done_list_klplan_b('','','done_todolist','');
    var bljg='';
    var category='';
    var category_list=[];
    var today=date2str_b('-');
    
    var show_done;
    var show_undone;
    [show_done,show_undone]=show_type_todolist(save_to_local_storage);
        
    for (let item of todolist_data_global){
        if (category==''){
            category=item[1];
            //<span class="span_category"> 的 innerHTML 只能是 分类名 - 保留注释
            bljg=bljg+category_klplan_b(category);
            category_list.push(category);
        } else if (category!==item[1]){
            bljg=bljg+'</ol></div>';
            category=item[1];
            bljg=bljg+category_klplan_b(category);
            category_list.push(category);
        }

        var blfound=false;
        var done_date='<span id="span_'+item[0]+'" class="span_date" style="color:'+scheme_global["shadow"]+';"></span>';
        for (let arow of csdone_list){
            if (arow.split(',')[1]!==item[0]){continue;}

            done_date=done_date_klplan_b(arow,today,item[0]);
            blfound=true;
            break;
        }
        
        if (blfound && show_done || !blfound && show_undone){
            var bldisplay='';
        } else {
            var bldisplay='none';
        }
        bljg=bljg+'<li style="display:'+bldisplay+';">';
        bljg=bljg+'<span class="span_link" onclick="check_todolist(this.parentNode,\''+item[0]+'\',\''+category+'\');" id="span_item_'+item[0]+'"';        
        if (blfound){
            bljg=bljg+' style="background-color:'+scheme_global["pink"]+';"';        
        }
        bljg=bljg+'>'+specialstr92_b(item[2]);
        
        var span_edit=' <span class="span_box span_edit_todolist" onclick="edit_item_todolist(\''+item[0]+'\');" style="font-size:0.9rem;display:none;">🖍</span> ';

        bljg=bljg+'</span>'+span_edit+done_date;
        bljg=bljg+'</li>';
    }
    
    if (bljg.slice(-11,)!=='</ol></div>'){
        bljg=bljg+'</ol></div>';
    }
    document.getElementById('divhtml').innerHTML=bljg;
    count_get_klplan_b();
    return category_list;
}

function init_todolist(showmenu=true){
    todolist_data_global=sort_klplan_b(todolist_data_global);
    if (showmenu){
        menu_todolist();
    }    
    if (no_repeated_keys_klplan(todolist_data_global)){
        html_todolist();
    }
}

function html_todolist(){
    var list_t=show_todolist();
    var bljg='';
    for (let item of list_t){
        bljg=bljg+'<a href="#'+item+'" class="a_oblong_box">'+item+'</a> ';
    }
    bljg=bljg+'<span class="oblong_box" onclick="new_item_todolist();">New Item</span> ';    
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
