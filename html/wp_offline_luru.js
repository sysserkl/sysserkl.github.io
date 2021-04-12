function init_wp_offline_luru(){
    top_bottom_arrow_b('div_top_bottom','',false,'2rem');
    menu_wp_offline_luru();
    luru_input_format_money_b('id');
    editor_money_b();
    popup_selection_money_b();
    calculator_generate_money_b();
    read_wp_offline_luru();
    
    var list_t=[
    "input_class",
    "input_name",
    "input_unit",
    "input_amount",
    "input_price",
    "input_total_price",
    "input_address",
    //"input_day_purchase", //购置日期忽略 - 保留注释
    "input_tag",
    ];
    for (let item of list_t){
        document.getElementById(item).setAttribute('onkeyup',"javascript:if (event.key=='Enter'){submit_wp_offline_luru();}");
    }
    document.getElementById('input_day_purchase').value=date2str_b();
}

function menu_wp_offline_luru(){
    var str_t=klmenu_hide_b('');
    var klmenu1=[
    '<span class="span_menu" onclick="javascript:'+str_t+'export_import_form_wp_offline_luru();">导入/导出</span>',
    ];

    var klmenu2=[
    '<span class="span_menu" onclick="javascript:'+str_t+'if (confirm(\'是否更新版本？\')){service_worker_delete_b(\'wp_offline\');}">更新版本</span>',        
    ];

    document.getElementById('span_title').insertAdjacentHTML('beforebegin',klmenu_multi_button_div_b(klmenu_b(klmenu1,'✍️','8rem','1rem','1rem','60rem')+klmenu_b(klmenu2,'⚙','8rem','1rem','1rem','60rem'),'','0rem')+' ');
}

function update_wp_offline_luru(){
    var otextarea=document.getElementById('textarea_wp_offline_luru');
    if (!otextarea){return;}
    var bldata=otextarea.value.trim();
    var rndstr=randstr_b(4,true,false);
    if ((prompt('输入 '+rndstr+' 确认更新') || '').trim()==rndstr){
        localStorage.setItem('wp_offline_data',bldata);
        read_wp_offline_luru();
    }
}

function innertext_wp_offline_luru(){
    if (confirm('是否获取正文文本到当前编辑框？')){
        var blstr=document.getElementById('divhtml').innerText;
        document.getElementById('textarea_wp_offline_luru').value=blstr;
    }
}

function export_import_form_wp_offline_luru(){
    var bldata=specialstr92_b(local_storage_get_b('wp_offline_data'));
    var postpath=postpath_b();
	var bljg='<form method="POST" action="'+postpath+'temp_txt_share.php" name="form_fav_bible" target=_blank>\n';
    bljg=bljg+'<textarea name="textarea_wp_offline_luru" id="textarea_wp_offline_luru" style="height:20rem;">'+bldata+'</textarea>';
    bljg=bljg+'<p>';
    bljg=bljg+'<span class="aclick" onclick="javascript:document.getElementById(\'div_export_import\').innerHTML=\'\';">Close</span> ';      
    bljg=bljg+'<span class="aclick" onclick="javascript:update_wp_offline_luru();">更新</span> ';          
    bljg=bljg+'<span class="aclick" onclick="javascript:innertext_wp_offline_luru();">innerText</span> ';    
    bljg=bljg+textarea_buttons_b('textarea_wp_offline_luru','清空,复制,发送到临时记事本,发送地址');
    bljg=bljg+'</p></form>\n';
    document.getElementById('div_export_import').innerHTML=bljg;
}

function info_wp_offline_luru(csstr){
    var odiv=document.getElementById('lurudiv');
    odiv.innerHTML=csstr;
    odiv.style.display=(csstr==''?'none':'block');    
}

function check_wp_offline_luru(cstype='添加'){
    var input_list=[
    ["input_class",'分类'],
    ["input_name",'名称'],
    ["input_amount",'数量'],
    ["input_total_price",'总价'],
    ["input_day_purchase",'购置日期'],
    ];
    for (let item of input_list){
        if (document.getElementById(item[0]).value.trim()==''){
            info_wp_offline_luru(item[1]+'未输入');
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
            info_wp_offline_luru('【'+value+'】'+item[1]+'长度为'+item[0].length+'超过'+item[2]);
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
            info_wp_offline_luru(one_number[1]+'非数字');
            return false;
        }    
    }
   
    var k_amount=parseFloat(document.getElementById('input_amount').value.trim());
    if (k_amount<=0){
        info_wp_offline_luru('数量小于等于0');
        return false;
    }

    var k_price=document.getElementById('input_price').value.trim();
    var k_total_price=parseFloat(document.getElementById('input_total_price').value.trim());
    
    if (k_price==''){
        k_price=parseFloat((k_total_price/k_amount).toFixed(2));
    }
    else if (isNaN(k_price)){
        info_wp_offline_luru('单价非数字');
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
            info_wp_offline_luru(one_number[1]+'小数点超过1个');
            return false;
        }
        else if (list_t.length==2){
            if (list_t[1].length>one_number[4]){
                info_wp_offline_luru(one_number[1]+'小数位数超过'+one_number[4]);
                return false;            
            }
        }    
        if (one_number[0]<one_number[2] || one_number[0]>one_number[3]){
            info_wp_offline_luru(one_number[1]+'不在'+one_number[2]+'和'+one_number[3]+'之间');
            return false;
        }
    }
    
    var bldate=validdate_b(document.getElementById('input_day_purchase').value.trim());
    if (bldate===false){
        info_wp_offline_luru('日期格式错误');
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
    blcontent=blcontent.replace(new RegExp(/\r/,'g'),'');
    blcontent=specialstr92_b(blcontent);
    blcontent=blcontent.replace(new RegExp(/\n/,'g'),'<p class=tb01>');
    result_t.push('备注:'+blcontent);    
    
    //-----------
    var bldata=local_storage_get_b('wp_offline_data');
    var old_count=count_wp_offline_luru();
    if (old_count>200){
        info_wp_offline_luru('已储存超过200条记录，清理后再'+cstype);
        return false;         
    }
    if (('---'+bldata.replace(new RegExp(/\n/,'g'),'')+'---').includes('---'+result_t.join('')+'---')){
        info_wp_offline_luru('重复输入');
        return false;                    
    }
    
    var alert_info=[];
    for (let item of result_t){
        if (["分类","子类","名称","出处","购置日期","单位","数量","单价","总价","备注"].includes(item.split(':')[0])){
            alert_info.push(item);
        }
    }
    if (confirm("是否"+cstype+"记录"+(current_id_wp_offline_luru_global>=0?(current_id_wp_offline_luru_global+1):'')+"\n\n"+alert_info.join('\n')+"？")){
        if (cstype=='添加'){
            var bldata=bldata+'\n---\n'+result_t.join('\n')+'\n';
            bldata=bldata.replace(new RegExp(/\n{2,}/,'g'),'\n');
            localStorage.setItem('wp_offline_data',bldata);
        }
        else if (cstype=='修改'){
            if (current_id_wp_offline_luru_global>=0 && csdata.length>=0 && current_id_wp_offline_luru_global<csdata.length){
                var one_record=push_one_record_wp_offline_luru(result_t,csdata.length+1,result_t.join('\n'));
                if (one_record.length==15){
                    csdata.splice(current_id_wp_offline_luru_global,1,one_record);
                    array2localstorage_wp_offline_luru();     
                    current_id_wp_offline_luru_global=-1;
                }
            }
            else {
                info_wp_offline_luru('指定修改记录号不一致');
                return false;
            }
        }
        document.getElementById('input_class').value='';
        alert(cstype+'完成，原有记录'+old_count+'条，现有记录'+count_wp_offline_luru()+'条');
        read_wp_offline_luru();
        cancel_edit_wp_offline_luru(true);
        return true;
    }
    return false;
}

function count_wp_offline_luru(){
    var list_t=local_storage_get_b('wp_offline_data',-1,true);
    var blcount=0;
    for (let item of list_t){
        if (item.trim()=='---'){
            blcount=blcount+1;
        }
    }
    return blcount;
}

function push_one_record_wp_offline_luru(csarray,csno,csstr){
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
    
    return one_record;
}

function localstorage2array_wp_offline_luru(){
    csdata=[];
    var list_t=('\n'+local_storage_get_b('wp_offline_data')+'\n').split('\n---\n');
    var blno=0;
    for (let item of list_t){
        var blstr=item.trim();
        if (blstr==''){continue;}
        var one_record=blstr.split('\n');
        if (one_record.length!==15){
            alert('错误记录\n'+blstr);
            continue;
        }
        
        var one_record=push_one_record_wp_offline_luru(one_record,blno,blstr);
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

function read_wp_offline_luru(){
    var blamount=0;
    var blsum=0;
    [blamount,blsum]=localstorage2array_wp_offline_luru();

    var bljg='';
    var blamount_total=0;
    var blamount_this_page=0;
    var blsum_this_page=0;
    [bljg,blamount_total,blamount_this_page,blsum_this_page]=table_detail_money_b(0,'',-1,false,'wp_offline_luru',true,true);
    document.getElementById('divhtml').innerHTML=bljg;
    var ostatus=document.getElementById('td_status_wp');
    if (ostatus){
        ostatus.innerHTML='共有记录 <span style="color:red;font-weight:bold;">'+csdata.length+'</span> 条；数量累计：<span style="color:blue;font-weight:bold;">'+blamount.toFixed(3)+'</span>；总额累计：<span style="color:blue;font-weight:bold;">'+blsum.toFixed(2)+'</span>￥';
    }
}

function add_or_edit_wp_offline_luru(cstype){
    info_wp_offline_luru('');
    check_wp_offline_luru(cstype);
}

function edit_form_wp_offline_luru(csno,cs_asc_sum){
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
    cancel_edit_wp_offline_luru(false);
    current_id_wp_offline_luru_global=csno;
    document.getElementById('span_title').scrollIntoView();
}

function array2localstorage_wp_offline_luru(){
    var result_t=[];
    var item_name=["记录号","编号","分类","子类","名称","出处","购置日期","用户名","登记日期","登记时间","单位","数量","单价","总价","备注"];
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
    bldata=bldata.replace(new RegExp(/\n{2,}/,'g'),'\n');
    localStorage.setItem('wp_offline_data',bldata.trim());
}

function cancel_edit_wp_offline_luru(cscancel=true){
    document.getElementById('span_submit').innerText=(cscancel?'添加':'修改');
    document.getElementById('span_cancel_edit').style.display=(cscancel?'none':'');
    if (cscancel){
        current_id_wp_offline_luru_global=-1;
    }
}

function submit_wp_offline_luru(){
    document.getElementById('span_submit').click();
}
