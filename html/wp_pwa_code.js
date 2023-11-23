function init_wp_pwa(){
    top_bottom_arrow_b('div_top_bottom','',false,'2rem');
    menu_wp_pwa();
    luru_input_format_money_b('id');
    editor_money_b();
    popup_selection_money_b();
    calculator_generate_money_b();
    read_wp_pwa();
    
    var list_t=[
    'input_class',
    'input_name',
    'input_unit',
    'input_amount',
    'input_price',
    'input_total_price',
    'input_address',
    //'input_day_purchase', //购置日期忽略 - 保留注释
    'input_tag',
    ];
    for (let item of list_t){
        document.getElementById(item).setAttribute('onkeyup',"if (event.key=='Enter'){submit_wp_pwa();}");
    }
    document.getElementById('input_day_purchase').value=date2str_b();
    
    var op=elm_buttons_money_b('span_elm_buttons_wp_pwa','textarea_content');
    op.insertAdjacentHTML('afterbegin',textarea_buttons_b('textarea_content','复制'));    
}

function menu_wp_pwa(){
    var str_t=klmenu_hide_b('');
    var klmenu1=[
    '<span class="span_menu" onclick="'+str_t+'export_import_form_wp_pwa();">导入/导出</span>',
    '<span class="span_menu" onclick="'+str_t+'read_lines_2_form_wp_pwa();">读取行列格式到表单</span>',    
    '<span class="span_menu" onclick="'+str_t+'batch_append_wp_pwa(false,false,false);">批量添加当前行列格式到缓存</span>',    
    '<span class="span_menu" onclick="'+str_t+'electricity_wp_pwa();">电费</span>',
    ];
    
    var group_list=[
    ['饿了么','elm_wp_pwa();',true],
    ['按钮切换','popup_show_hide_b(\'span_elm_buttons_wp_pwa\',\'\'); popup_show_hide_b(\'div_elm_buttons\');',true],
    ];    
    klmenu1.push(menu_container_b(str_t,group_list,''));    

    var klmenu2=[
    '<span class="span_menu" onclick="'+str_t+'service_worker_delete_b(\'wp_pwa\');">更新版本</span>',        
    ];

    document.getElementById('span_title').insertAdjacentHTML('beforebegin',klmenu_multi_button_div_b(klmenu_b(klmenu1,'✍️','16rem','1rem','1rem','60rem')+klmenu_b(klmenu2,'⚙','8rem','1rem','1rem','60rem'),'','0rem')+' ');
}

function elm_wp_pwa(){
    var result_t,line_style_list,error;
    [result_t,line_style_list,error]=import_elm_money_b('textarea_content');
    if (error!==''){
        info_wp_pwa(error);
    }
    if (result_t===false){return;}
    batch_append_wp_pwa(line_style_list,result_t,true);
}

function batch_append_wp_pwa(line_style_list=false,result_t=false,show_in_textarea=true){
    var otextarea=document.getElementById('textarea_content');
    var old_value=otextarea.value;
    if (line_style_list==false){
        line_style_list=[];
        var list_t=('\n'+otextarea.value.trim()+'\n').split('\n---\n');
        for (let item of list_t){
            if (item==''){continue;}
            line_style_list.push('---\n'+item.trim());
        }
    }
    
    var blfound=false;
    for (let blxl=0;blxl<line_style_list.length;blxl++){
        var item=line_style_list[blxl];
        otextarea.value=item;
        read_lines_2_form_wp_pwa(false);
        if (check_wp_pwa('处理',false)==false){
            if (result_t==false){
                alert('出错：'+item);
            }
            else {
                alert('出错：'+result_t[blxl]);
            }
            blfound=true;
            break;
        }
    }
    if (show_in_textarea){
        otextarea.value=line_style_list.join('\n');    
    }
    
    if (!blfound){
        if (!confirm('是否批量添加到暂存记录？')){
            otextarea.value=old_value;
            return;
        }
        var old_count=count_wp_pwa();
        var blstr=line_style_list.join('\n')+'\n'+localstorage_get_wp_pwa();
        localstorage_set_wp_pwa(blstr);
        alert('批量添加完成，原有记录'+old_count+'条，现有记录'+count_wp_pwa()+'条');
        read_wp_pwa();        
    }
    else {
        otextarea.value=old_value;
    }
}

function electricity_wp_pwa(){
    var otextarea=document.getElementById('textarea_content');
    var blstr=otextarea.value;
    var error='';
    var blname='';
    var bladdress='';        
    var blamount='';
    var total_price='';
    [error,blname,bladdress,blamount,total_price,blstr]=electricity_get_money_b(blstr);    
    if (error!==''){
        alert(error);
        return;    
    }    
    document.getElementById('input_class').value='水电物';
    document.getElementById('input_name').value=blname;
    document.getElementById('input_amount').value=blamount;
    document.getElementById('input_total_price').value=total_price;
    document.getElementById('input_address').value=bladdress;
    otextarea.value=blstr;
}

function read_lines_2_form_wp_pwa(do_ask=true){
    var otextarea=document.getElementById('textarea_content');
    var blstr=otextarea.value.trim();
    if (!blstr.includes(':')){return;}
    if (do_ask && !confirm('是否从编辑框读取行列格式值到表单？')){return;}

    var list_t=blstr.split('\n');
    var col_names=input_col_names_wp_pws();
    var col_ids=input_col_names_wp_pws(true);
    for (let item of list_t){
        var blat1=item.indexOf(':');
        if (blat1==-1){continue;}
        var blname=item.substring(0,blat1).trim();
        var blat2=col_names.indexOf(blname);
        if (blat2==-1){continue;}
        document.getElementById(col_ids[blat2]).value=item.substring(blat1+1,).replace(new RegExp('<p class=tb01>','g'),'\n').trim();
    }
}

function input_col_names_wp_pws(return_id=false){
    if (return_id){
        return ['input_class','input_tag','input_name','input_address','input_day_purchase','input_unit','input_amount','input_price','input_total_price','textarea_content'];
    }
    return ['分类','子类','名称','出处','购置日期','单位','数量','单价','总价','备注'];
}

function update_wp_pwa(){
    var otextarea=document.getElementById('textarea_wp_pwa');
    if (!otextarea){return;}
    var bldata=otextarea.value.trim();
    var rndstr=randstr_b(4,true,false);
    if ((prompt('输入 '+rndstr+' 确认更新') || '').trim()==rndstr){
        if (bldata==''){
            localStorage.removeItem('wp_pwa_data'); //用来对付手机版 firefox 有时清除失败，不知是否有效 - 保留注释
        }
        else {
            localstorage_set_wp_pwa(bldata);
        }
        read_wp_pwa();
    }
}

function innertext_wp_pwa(){
    if (confirm('是否获取正文文本到当前编辑框？')){
        var blstr=document.getElementById('divhtml').innerText;
        document.getElementById('textarea_wp_pwa').value=blstr;
    }
}

function export_import_form_wp_pwa(){
    var bldata=specialstr92_b(localstorage_get_wp_pwa());
    var postpath=postpath_b();
	var bljg='<form method="POST" action="'+postpath+'temp_txt_share.php" name="form_fav_bible" target=_blank>\n';
    bljg=bljg+'<textarea name="textarea_wp_pwa" id="textarea_wp_pwa" style="height:20rem;">'+bldata+'</textarea>';
    bljg=bljg+'<p>';
    bljg=bljg+close_button_b('div_export_import','')+' ';      
    bljg=bljg+'<span class="aclick" onclick="update_wp_pwa();">Update</span> ';          
    bljg=bljg+'<span class="aclick" onclick="innertext_wp_pwa();">innerText</span> ';    
    bljg=bljg+textarea_buttons_b('textarea_wp_pwa','清空,复制,发送到临时记事本,发送地址');
    bljg=bljg+'</p></form>\n';
    document.getElementById('div_export_import').innerHTML=bljg;
}

function info_wp_pwa(csstr){
    var odiv=document.getElementById('lurudiv');
    odiv.innerHTML=csstr;
    odiv.style.display=(csstr==''?'none':'block');    
}

function check_wp_pwa(cstype='添加',do_ask=true){
    var input_list=[
    ['input_class','分类'],
    ['input_name','名称'],
    ['input_amount','数量'],
    ['input_total_price','总价'],
    ['input_day_purchase','购置日期'],
    ];
    for (let item of input_list){
        if (document.getElementById(item[0]).value.trim()==''){
            info_wp_pwa(item[1]+'未输入');
            return false;
        }
    }
    
    var item_len=[
    ['input_class','分类',50],
    ['input_tag','子类',50],    
    ['input_name','名称',150],
    ['input_address','出处',100],
    ['input_unit','单位',10],
    ];
    for (let item of item_len){
        var value=specialstr92_b(document.getElementById(item[0]).value.trim());
        if (value.length>item[2]){
            info_wp_pwa('【'+value+'】'+item[1]+'长度为'+item[0].length+'超过'+item[2]);
            return false;
        }
    }
    
    var number_list=[
    ['input_amount','数量'],
    ['input_total_price','总价'],    
    ];
      
    for (let one_number of number_list){
        var value=document.getElementById(one_number[0]).value.trim();
        if (isNaN(value) || value==''){ //isNaN('')==false - 保留注释
            info_wp_pwa(one_number[1]+'非数字');
            return false;
        }    
    }
   
    var k_amount=parseFloat(document.getElementById('input_amount').value.trim());
    if (k_amount<=0){
        info_wp_pwa('数量小于等于0');
        return false;
    }

    var k_price=document.getElementById('input_price').value.trim();
    var k_total_price=parseFloat(document.getElementById('input_total_price').value.trim());
    
    if (k_price==''){
        k_price=parseFloat((k_total_price/k_amount).toFixed(2));
    }
    else if (isNaN(k_price)){
        info_wp_pwa('单价非数字');
        return false;
    }
    else {
        k_price=parseFloat(k_price);
    }
    
    number_list=[
    [k_amount,'数量',0,99999999.999,3],
    [k_total_price,'总价',-999999.99,9999999.99,2],    
    [k_price,'单价',-999999.99,9999999.99,2],    
    ];
    for (let one_number of number_list){
        var list_t=one_number[0].toString().split('.');
        if (list_t.length>2){
            info_wp_pwa(one_number[1]+'小数点超过1个');
            return false;
        }
        else if (list_t.length==2){
            if (list_t[1].length>one_number[4]){
                info_wp_pwa(one_number[1]+'小数位数超过'+one_number[4]);
                return false;            
            }
        }    
        if (one_number[0]<one_number[2] || one_number[0]>one_number[3]){
            info_wp_pwa(one_number[1]+'不在'+one_number[2]+'和'+one_number[3]+'之间');
            return false;
        }
    }
    
    var bldate=validdate_b(document.getElementById('input_day_purchase').value.trim());
    if (bldate===false){
        info_wp_pwa('日期格式错误');
        return false;    
    }

    //-----------
    form_content_check_money_b();
    
    var result_t=[
    '记录号:忽略',
    '编号:忽略',
    ];
    var items=[
    ['input_class','分类'],
    ['input_tag','子类'],    
    ['input_name','名称'],
    ['input_address','出处'],    
    ];
    for (let one_item of items){
        var value=specialstr92_b(document.getElementById(one_item[0]).value.trim());
        result_t.push(one_item[1]+':'+value);
    }
    result_t.push('购置日期:'+date2str_b('-',bldate));
    result_t.push('用户名:忽略');
    result_t.push('登记日期:忽略');
    result_t.push('登记时间:忽略');
    
    var value=specialstr92_b(document.getElementById('input_unit').value.trim());
    result_t.push('单位:'+value);    
    
    result_t.push('数量:'+k_amount);    
    result_t.push('单价:'+k_price);    
    result_t.push('总价:'+k_total_price);    
    
    var blcontent=document.getElementById('textarea_content').value.trim();
    blcontent=blcontent.replace(/\r/g,'');
    blcontent=specialstr92_b(blcontent);
    blcontent=blcontent.replace(/\n/g,'<p class=tb01>');
    result_t.push('备注:'+blcontent);    
    
    //-----------
    var bldata=localstorage_get_wp_pwa();
    var old_count=count_wp_pwa();
    if (old_count>200){
        info_wp_pwa('已储存超过200条记录，清理后再'+cstype);
        return false;         
    }
    if (('---'+bldata.replace(/\n/g,'')+'---').includes('---'+result_t.join('')+'---')){
        info_wp_pwa('重复输入');
        return false;                    
    }
    
    var alert_info=[];
    var col_names=input_col_names_wp_pws();
    for (let item of result_t){
        if (col_names.includes(item.split(':')[0])){
            alert_info.push(item);
        }
    }
    
    if (do_ask && !confirm('是否'+cstype+'记录'+(current_id_wp_pwa_global>=0?(current_id_wp_pwa_global+1):'')+"\n\n"+alert_info.join('\n')+"？")){
        return false;
    }

    if (cstype=='添加'){
        var bldata=bldata+'\n---\n'+result_t.join('\n')+'\n';
        bldata=bldata.replace(/\n{2,}/g,'\n');
        localstorage_set_wp_pwa(bldata);
    }
    else if (cstype=='修改'){
        if (current_id_wp_pwa_global>=0 && csdata.length>=0 && current_id_wp_pwa_global<csdata.length){
            var one_record=push_one_record_wp_pwa(result_t,csdata.length+1,result_t.join('\n'));
            if (one_record.length==15){
                csdata.splice(current_id_wp_pwa_global,1,one_record);
                array2localstorage_wp_pwa();     
                current_id_wp_pwa_global=-1;
            }
        }
        else {
            info_wp_pwa('指定修改记录号不一致');
            return false;
        }
    }
    
    if (['添加','修改'].includes(cstype)){
        document.getElementById('input_class').value='';
        alert(cstype+'完成，原有记录'+old_count+'条，现有记录'+count_wp_pwa()+'条');
        read_wp_pwa();
        cancel_edit_wp_pwa(true);
    }
    return true;
}

function localstorage_get_wp_pwa(return_list=false){
    return local_storage_get_b('wp_pwa_data',-1,return_list);
}

function localstorage_set_wp_pwa(csdata){
    localStorage.setItem('wp_pwa_data',csdata);
}

function count_wp_pwa(){
    var list_t=localstorage_get_wp_pwa(true);
    var blcount=0;
    for (let item of list_t){
        if (item.trim()=='---'){
            blcount=blcount+1;
        }
    }
    return blcount;
}

function push_one_record_wp_pwa(csarray,csno,csstr){
    var one_record=[].concat(csarray);
    for (let blxl=0;blxl<one_record.length;blxl++){
        var blat=one_record[blxl].indexOf(':');
        if (blat<0){
            alert('缺失:\n'+csstr);
            return [];
        }
        one_record[blxl]=one_record[blxl].substring(blat+1,);
    }
    one_record[0]=csno;
    one_record[1]=csno;
    one_record[11]=parseFloat(one_record[11]);
    one_record[12]=parseFloat(one_record[12]);
    one_record[13]=parseFloat(one_record[13]);
    if (isNaN(one_record[12])){
        one_record[12]=one_record[13]/one_record[11];
    }
        
    return one_record;
}

function localstorage2array_wp_pwa(){
    csdata=[];
    var list_t=('\n'+localstorage_get_wp_pwa()+'\n').split('\n---\n');
    var blno=0;
    for (let item of list_t){
        var blstr=item.trim();
        if (blstr==''){continue;}
        var one_record=blstr.split('\n');
        if (one_record.length!==15){
            alert('错误记录\n'+blstr);
            continue;
        }
        
        var one_record=push_one_record_wp_pwa(one_record,blno,blstr);
        if (one_record.length==15){
            blno=blno+1;
            csdata.push(one_record);        
        }
    }
    csdata.sort(function (a,b){return a[6]<b[6];});
    var blamount=0;
    var blsum=0;
    for (let blxl=0;blxl<csdata.length;blxl++){
        csdata[blxl][0]=blxl;
        csdata[blxl][1]=blxl;
        blamount=blamount+csdata[blxl][11];
        blsum=blsum+csdata[blxl][13];
    }
    return [blamount,blsum];
}

function read_wp_pwa(){
    var blamount=0;
    var blsum=0;
    [blamount,blsum]=localstorage2array_wp_pwa();

    var bljg='';
    var blamount_total=0;
    var blamount_this_page=0;
    var blsum_this_page=0;
    [bljg,blamount_total,blamount_this_page,blsum_this_page]=table_detail_money_b(0,'',-1,false,'wp_pwa',true,true);
    document.getElementById('divhtml').innerHTML=bljg;
    var ostatus=document.getElementById('td_status_wp');
    if (ostatus){
        ostatus.innerHTML='共有记录 <span style="color:red;font-weight:bold;">'+csdata.length+'</span> 条；数量累计：<span style="color:blue;font-weight:bold;">'+blamount.toFixed(3)+'</span>；总额累计：<span style="color:blue;font-weight:bold;">'+blsum.toFixed(2)+'</span>￥';
    }
}

function add_or_edit_wp_pwa(cstype){
    info_wp_pwa('');
    check_wp_pwa(cstype);
}

function edit_form_wp_pwa(csno,cs_asc_sum){
    if (csdata.length==0 || csno<0 || csno>=csdata.length){return;}

    var arow=csdata[csno];
    if (asc_sum_b(arow.join(''))!==cs_asc_sum){
        alert('记录'+(csno+1)+'不一致');
        return;
    }
        
    var items=[
    '记录号:忽略',
    '编号:忽略',
    'input_class',
    'input_tag',    
    'input_name',
    'input_address',    
    'input_day_purchase',
    '用户名:忽略',
    '登记日期:忽略',
    '登记时间:忽略',        
    'input_unit',
    'input_amount',
    'input_price',
    'input_total_price',
    'textarea_content',
    ];    
    
    if (items.length!==arow.length){
        alert('数组长度出错');
        return;
    }

    if (!confirm('是否修改记录'+arow[4]+'？')){return;}

    for (let blxl=0;blxl<arow.length;blxl++){
        var blid=items[blxl];
        if (blid.slice(-3,)==':忽略'){continue;}
        if (blxl>=11 && blxl<=13){
            document.getElementById(blid).value=arow[blxl];
        }
        else if (blxl<14) {
            document.getElementById(blid).value=restore_str_b(arow[blxl]);
        }
        else {
            document.getElementById(blid).value=restore_str_b(arow[blxl]).replace(new RegExp('<p class=tb01>','g'),'\n');
        }
    }
    cancel_edit_wp_pwa(false);
    current_id_wp_pwa_global=csno;
    document.getElementById('span_title').scrollIntoView();
}

function array2localstorage_wp_pwa(){
    var result_t=[];
    var item_name=['记录号','编号','分类','子类','名称','出处','购置日期','用户名','登记日期','登记时间','单位','数量','单价','总价','备注'];
    for (let item of csdata){
        if (item.length!==15){
            alert('元素个数不为15\n'+item.split('\n'));
            return;
        }
        var list_t=[].concat(item);
        for (let blno of [0,1,7,8,9]){
            list_t[blno]='忽略';
        }
        for (let blxl=0;blxl<list_t.length;blxl++){
            list_t[blxl]=item_name[blxl]+':'+list_t[blxl];
        }
        result_t.push(list_t.join('\n')+'\n');
    }
    var bldata='---\n'+result_t.join('\n---\n');
    bldata=bldata.replace(/\n{2,}/g,'\n');
    localstorage_set_wp_pwa(bldata.trim());
}

function cancel_edit_wp_pwa(cscancel=true){
    document.getElementById('span_submit').innerText=(cscancel?'添加':'修改');
    document.getElementById('span_cancel_edit').style.display=(cscancel?'none':'');
    if (cscancel){
        current_id_wp_pwa_global=-1;
    }
}

function submit_wp_pwa(){
    document.getElementById('span_submit').click();
}
