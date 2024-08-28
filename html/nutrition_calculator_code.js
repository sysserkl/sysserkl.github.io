function one_col_nutrition_calc(value_dict={}){
    table_create_nutrition_calc();
    var otables=document.querySelectorAll('.table_nc');
    var blno=otables.length-1;
    var otrs=otables[blno].querySelectorAll('tr');
        
    var en_cn=en_cn_dict_nutrition_calc(false);
    var en_names=Object.keys(en_cn);
    var cn_names=Object.values(en_cn);
    
    var bljg='<td nowrap>';
    for (let blxl=0,lent=cn_names.length;blxl<lent;blxl++){
        bljg=bljg+'<p>'+cn_names[blxl]+'：<input type="number" id="input_'+en_names[blxl]+'_nc_'+blno+'" value="'+(value_dict[en_names[blxl]] || '')+'" /></p>';
    }
    bljg=bljg+'</td>';
    
    otrs[0].insertAdjacentHTML('beforeend','<th id="input_name_nc_'+blno+'" contenteditable="true">'+(value_dict['name'] || blno)+'</th>');
    otrs[1].insertAdjacentHTML('beforeend',bljg);

    var otds=otrs[1].querySelectorAll('td');
    var oinputs=otds[otds.length-1].querySelectorAll('input');
    var input_list=[];
    for (let one_input of oinputs){
        input_list.push([one_input.id,6,0.5]);
    }
    input_size_b(input_list,'id');    
}

function compare_nutrition_calc(do_calc=true){
    var result_t=[];
    var otables=document.querySelectorAll('.table_nc');
    
    var en_cn=en_cn_dict_nutrition_calc(false);
    var en_names=Object.keys(en_cn);
    
    for (let blxl=0,lent=otables.length; blxl<lent; blxl++){
        var otrs=otables[blxl].querySelectorAll('tr');
        
        var td_str=[];
        var nc_dict=value_dict_nutrition_calc();
        for (let akey in nc_dict){
            nc_dict[akey]=parseFloat(document.getElementById('input_'+akey+'_nc_'+blxl).value.trim());
        }
        
        if (do_calc){
            var one_diet_quality=nc_dict['diet']*nc_dict['quality']/nc_dict['sub_group'];
            var blpercent=one_diet_quality/nc_dict['unit'];
            td_str.push('<p><b>一次进食</b></p>');

            td_str.push('<p>质量（体积）：'+one_diet_quality.toFixed(3)+'</p>');
            td_str.push('<p>价格：'+(nc_dict['price']*nc_dict['diet']/nc_dict['sub_group']).toFixed(3)+'</p>');
            
            for (let blno=3,lenb=en_names.length-2;blno<lenb;blno++){
                td_str.push('<p>'+en_cn[en_names[blno]]+'：'+(nc_dict[en_names[blno]]*blpercent).toFixed(3)+'</p>');
            }
            otrs[2].innerHTML='<td>'+td_str.join('\n')+'</td>';
        }
        
        nc_dict['name']=otrs[0].querySelector('th').innerText.trim();
        result_t.push(nc_dict);
    }
    
    if (do_calc){
        var untrition_price={};
        for (let blno=3,lent=en_names.length-2;blno<lent;blno++){
            untrition_price[en_names[blno]]=[];
        }
        for (let item of result_t){
            var multiple=item['quality']/item['unit'];
            for (let blno=3,lent=en_names.length-2;blno<lent;blno++){
                var blvalue=multiple*item[en_names[blno]]/item['price'];
                if (!isNaN(blvalue)){
                    untrition_price[en_names[blno]].push([item['name'],blvalue]);
                }
            }
        }
        
        var rank_list=[];
        for (let key in untrition_price){
            untrition_price[key].sort(function (a,b){return zh_sort_b(a,b,false,0);});
            untrition_price[key].sort(function (a,b){return a[1]<b[1] ? 1 : -1;});
            for (let blxl=0,lent=untrition_price[key].length;blxl<lent;blxl++){
                untrition_price[key][blxl]='<tr><td>'+(blxl+1)+'</td><td>'+untrition_price[key][blxl][0]+'</td><td align="right">'+untrition_price[key][blxl][1].toFixed(3)+'</td></tr>';
            }
            if (untrition_price[key].length>0){
                rank_list.push('<table class="table_common" style="position:relative;float:left;"><tr><td colspan=3><h3>'+en_cn[key]+'含量排名</h3></td></tr><tr><th>No.</th><th>品名</th><th>每元含量</th></tr>'+untrition_price[key].join('\n')+'</table>');
            }
        }
        document.getElementById('div_status').innerHTML=rank_list.join('\n')+'<p>'+close_button_b('div_status','')+'</p>';
    }
    
    return result_t;
}

function table_create_nutrition_calc(){
    document.getElementById('div_table').insertAdjacentHTML('beforeend','<table class="table_nc table_common" style="position:relative;float:left;"><tr></tr><tr></tr><tr></tr></table>');
}

function init_nutrition_calc(){
    top_bottom_arrow_b('div_top_bottom','',false,(ismobile_b()?'1.8rem':'1.6rem'),false,false,2);
    one_col_nutrition_calc();
    one_col_nutrition_calc();
    character_2_icon_b('🥗');    
}

function remove_nutrition_calc(is_last=false){
    if (is_last){
        var otables=document.querySelectorAll('.table_nc');
        if (otables.length==0){return;}
        var blcount=parseInt(prompt('输入删除列数（1-'+otables.length+'）','1') || '');    
        if (isNaN(blcount)){return;}
        
        for (let blxl=otables.length-1; blxl>otables.length-1-blcount; blxl--){
            otables[blxl].outerHTML='';
        }
    } else {
        if (!confirm('是否清除当前数据？')){return;}
        document.getElementById('div_table').innerHTML='';
    }    
}

function add_col_nutrition_calc(){
    var blcount=parseInt(prompt('输入新建列数（1-10）','1') || '');    
    if (isNaN(blcount)){return;}
    if (blcount<1 || blcount>10){return;}
    for (let blxl=0;blxl<blcount;blxl++){
        one_col_nutrition_calc();
    }
}

function menu_nutrition_calc(){
    var str_t=klmenu_hide_b('');
    var klmenu1=[
    '<span class="span_menu" onclick="'+str_t+'import_form_nutrition_calc();">导入导出</span>',
    '<span class="span_menu" onclick="'+str_t+'add_col_nutrition_calc();">新建空白列</span>',
    '<span class="span_menu" onclick="'+str_t+'remove_nutrition_calc();">清除当前数据</span>',
    '<span class="span_menu" onclick="'+str_t+'remove_nutrition_calc(true);">删除最后几列</span>',
    '<span class="span_menu" onclick="'+str_t+'klwiki_link_b(\'营养成分表\',true);">营养成分表</span>',
    ];
    
    var klmenu_config=root_font_size_menu_b(str_t);

    document.getElementById('span_title').insertAdjacentHTML('beforebegin',klmenu_multi_button_div_b(klmenu_b(klmenu1,'🥗','11rem','1rem','1rem','30rem')+klmenu_b(klmenu_config,'⚙','16rem','1rem','1rem','30rem'),'','0rem')+' ');
}

function import_value_nutrition_calc(cstype=''){
    var en_cn=en_cn_dict_nutrition_calc();
    var en_names=Object.keys(en_cn);
    var cn_names=Object.values(en_cn);
    var found_error=false;
    var result_t=[];
    var list_t=('\n'+document.getElementById('textarea_import_nc').value.trim()+'\n').split('\n-----\n');
    for (let item of list_t){
        item=item.trim();
        if (item==''){continue;}
        item=item.split('\n');
        if (item.length!==cn_names.length){
            alert('行数不一致：\n'+item.join('\n'));
            found_error=true;
            break;
        }
        
        var nc_dict={};
        for (let blxl=0,lent=item.length;blxl<lent;blxl++){
            item[blxl]=item[blxl].split('：');
            if (item[blxl].length!==2){
                alert('格式错误：'+item[blxl]);
                found_error=true;
                break;                   
            }
            
            if (item[blxl][0]!==cn_names[blxl]){
                alert('名称（'+cn_names[blxl]+'）（'+item[blxl]+'）不一致：\n'+item.join('\n'));
                found_error=true;
                break;            
            }
            nc_dict[en_names[blxl]]=item[blxl][1];
        }
        result_t.push(nc_dict);
        if (found_error){break;}
    }
    
    if (found_error){return false;}
    if (result_t.length==0){return false;}
    if (cstype=='table'){
        return result_t;
    }
    
    if (!confirm('是否导入'+result_t.length+'组数据？')){return false;}
    for (let item of result_t){
        one_col_nutrition_calc(item);
    }
}

function value_dict_nutrition_calc(add_name=false){
    var nc_dict=en_cn_dict_nutrition_calc(false);
    for (let key in nc_dict){
        nc_dict[key]=-1;
    }
    if (add_name){
        nc_dict['name']='';
    }
    return nc_dict;
}

function en_cn_dict_nutrition_calc(add_name=true){
    var en_cn={'name':'品名','quality':'质量|体积(g|ml)/盒', 'price':'价格(￥)/盒', 'unit':'营养含量单位分量(g|ml)', 'protein':'蛋白质(g)', 'fat':'脂肪(g)', 'ch':'碳水化合物(g)', 'sugar':'糖(g)', 'sodium':'钠(g)', 'calcium':'钙(g)', 'fiber':'膳食纤维(g)','sub_group':'份数/盒','diet':'一次进食份数'};
    if (add_name===false){
        delete en_cn['name'];
    }
    return en_cn;
}

function current_value_nutrition_calc(){
    var current_t=compare_nutrition_calc(false);
    var en_cn=en_cn_dict_nutrition_calc();
    
    var result_t=[];
    for (let item of current_t){
        var list_t=[];
        for (let key in en_cn){
            list_t.push(en_cn[key]+'：'+item[key]);
        }
        result_t.push(list_t.join('\n'));
    }
    return result_t.join('\n-----\n');
}

function import_form_nutrition_calc(){
    var odiv=document.getElementById('divhtml');
    var buttons='<p>';
    buttons=buttons+close_button_b('divhtml','');
    buttons=buttons+'<span class="aclick" onclick="import_value_nutrition_calc();">import</span>';
    buttons=buttons+'<span class="aclick" onclick="table_show_nutrition_calc();">显示为表格</span>';
    
    buttons=buttons+textarea_buttons_b('textarea_import_nc','清空,复制');
    buttons=buttons+'</p>';

    odiv.innerHTML='<textarea id="textarea_import_nc" style="height:25rem;">'+current_value_nutrition_calc()+'</textarea>'+buttons;
    odiv.scrollIntoView();
}

function table_show_nutrition_calc(sort_no=0,is_desc=false){
    var list_t=import_value_nutrition_calc('table');
    var keys=new Set();
    var keys_one_diet=new Set(['one_diet_quality','one_diet_price']);
    for (let blxl=0,lent=list_t.length;blxl<lent;blxl++){
        var arow=list_t[blxl];

        for (let one_key in arow){
            keys.add(one_key);
            if (one_key!=='name'){
                list_t[blxl][one_key]=parseFloat(arow[one_key]);
            }
        }
        
        var one_diet_quality=arow['diet']*arow['quality']/arow['sub_group'];
        var one_diet_price=parseFloat((arow['price']*arow['diet']/arow['sub_group']).toFixed(3));
        var blpercent=one_diet_quality/arow['unit'];
        
        for (let one_key in arow){
            if (!['name','diet','unit','sub_group'].includes(one_key)){
                list_t[blxl]['one_diet_'+one_key]=parseFloat((arow[one_key]*blpercent).toFixed(3));
                keys_one_diet.add('one_diet_'+one_key);
            }
        }

        list_t[blxl]['one_diet_quality']=one_diet_quality;
        list_t[blxl]['one_diet_price']=one_diet_price;
    }
    
    keys=Array.from(keys);
    keys=keys.concat(Array.from(keys_one_diet));

    var result_t=dicts_2_value_list_b(list_t,keys)[0];

    if (keys[sort_no]=='name'){
        result_t.sort(function (a,b){return zh_sort_b(a,b,is_desc,0);});
    } else {
        if (is_desc){
            result_t.sort(function (a,b){return (isNaN(b[sort_no]) || a[sort_no]>b[sort_no]) ? 1 : -1;});
        } else {
            result_t.sort(function (a,b){return (isNaN(a[sort_no]) || a[sort_no]<b[sort_no]) ? 1 : -1;});
        }
    }
    
    var decimal_t=longest_fraction_b(result_t,'col');
    
    for (let blxl=0,lent=result_t.length;blxl<lent;blxl++){
        var arow=result_t[blxl];
        for (let blcol=0,lenb=arow.length;blcol<lenb;blcol++){
            var align_type=(keys[blcol]=='name'?'left':'right');
            if (arow[blcol]==undefined || arow[blcol].toString()=='NaN' || arow[blcol]==''){//不能使用 isNaN - 保留注释
                arow[blcol]='<td></td>';
            } else if (keys[blcol]=='name'){
                arow[blcol]='<td>'+arow[blcol]+'</td>';
            } else {
                arow[blcol]='<td align=right>'+arow[blcol].toFixed(decimal_t[blcol])+'</td>';
            }
        }
        result_t[blxl]='<tr>'+arow.join('')+'</tr>';
    }

    var en_cn=en_cn_dict_nutrition_calc();
    en_cn['one_diet_quality']='一次进食质量（体积）';
    en_cn['one_diet_price']='一次进食价格';
    for (let key in en_cn){
        if (['name','diet','unit','sub_group'].includes(key)){continue;}
        en_cn['one_diet_'+key]='一次进食'+en_cn[key];
    }
    
    var sort_order=(is_desc?'false':'true');

    var one_diet_position=[];
    for (let blxl=0,lent=keys.length;blxl<lent;blxl++){
        if (keys[blxl]=='diet' || keys[blxl].substring(0,8)=='one_diet'){
            one_diet_position.push(blxl);
        }
    }
    
    var blmin=Math.min(...one_diet_position);
    var blmax=Math.max(...one_diet_position);
    if (blmax-blmin!==one_diet_position.length-1){
        alert('一次进食不连贯');
        return;
    }

    var th1_list=[];
    for (let blxl=0;blxl<blmin;blxl++){
        var akey=keys[blxl];
        th1_list.push('<th rowspan=2 style="cursor:pointer;" onclick="table_show_nutrition_calc('+blxl+','+sort_order+');">'+en_cn[akey]+'</th>');
    }
    
    th1_list.push('<th colspan='+(blmax-blmin+1)+'>一次进食</th>');

    var th2_list=[];
    for (let blxl=blmin,lent=keys.length;blxl<lent;blxl++){
        var akey=keys[blxl];
        th2_list.push('<th style="cursor:pointer;" onclick="table_show_nutrition_calc('+blxl+','+sort_order+');">'+en_cn[akey].replace('一次进食','')+'</th>');
    }
    
    document.getElementById('div_status').innerHTML='<table class="table_common"><tr>'+th1_list.join('')+'</tr><tr>'+th2_list.join('')+'</tr>'+result_t.join('')+'</table>';
}
