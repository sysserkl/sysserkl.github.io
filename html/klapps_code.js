function init_klindex(){
    //将常用app储存在localstorage中，便于KLWiki等调用 - 保留注释
    var bljg='';
    var tags=[];
    var common_apps=common_apps_kl_global.concat(common_apps_pb_global);
    for (let item of common_apps){
        var finfo=file_path_name_b(item[0]);
        if (finfo[2]=='htm' && pwa_id_global.includes(finfo[1])){
            if (item.length==4){
                item.push('PWA');
            }
            else if (item.length>4){
                item[4]=item[4]+',PWA';
            }
        }
        bljg=bljg+item.join(',')+'\n';
        if (item.length>=5){
            tags=tags.concat(item[4].split(','));
        }
    }

    if (local_storage_get_b('common_softs')!==bljg.trim()){
        console.log('更新 common_softs');
        localStorage.setItem('common_softs',bljg);
    }
    input_with_x_b('input_search',20);
    character_2_icon_b('🔮');
    args_klindex();
    tags.sort();
    recent_search_klindex('',array_unique_b(tags));
}

function recent_search_klindex(csstr='',constant_value=[]){
    recent_search_b('recent_search_app',csstr,'components_klindex','div_recent_search',constant_value,35,false);
}

function php_remove_klindex(cskey,is_local){
    var divlist=klsofts_list_b(cskey,[],false,false,false);
    if (divlist.length==0){return divlist;}
    //if (is_file_type_b() || location.host=='127.0.0.1'){
        //不在其他host时生效，因为无法知道 local 为 file 时的具体地址 - 保留注释    
        if (location_host_b()!==location_host_b(true)){
            if (is_local){
                divlist.push(['javascript:components_klindex(false,false);','local','⛺','0']);
            } else {
                divlist.push(['javascript:components_klindex(false,true);','remote','☁','0']);        
            }
            divlist.push(['javascript:kl_remote_host_address_b();','remote ip address','⛓','1']);
        }
    //}
    
    divlist=klsofts_ingore_php_b(divlist,is_local);
    return divlist;
}

function components_klindex(cskey=false,is_local=-1){
    function sub_components_klindex_table(csarray,tdcolumns){
        var bljg='';
        for (let blxl=0,lent=csarray.length;blxl<lent;blxl++){
            if (blxl % tdcolumns==0){
                bljg=bljg+'</tr><tr>';
            }
            bljg=bljg+'<td align=center valign=top>';   //顶部对齐图标 - 保留注释
            bljg=bljg+'<div style="border:0.2rem solid '+scheme_global['background']+';border-radius: 2rem; padding:0.5rem;" onmouseover="this.style.borderColor=\''+scheme_global['shadow']+'\';" onmouseout="this.style.borderColor=\''+scheme_global['background']+'\';">'+csarray[blxl]+'</div>'; //用div 使图标文字在框中居中 - 保留注释
            bljg=bljg+'</td>';
        }
        if (bljg.slice(-4,)=='<tr>'){
            bljg=bljg.substring(0,-4);
        }    
        if (bljg.slice(5,)!=='</tr>'){
            bljg=bljg+'</tr>';
        }
        if (bljg.substring(0,5)=='</tr>'){
            bljg=bljg.substring(5,);
        }
        if (bljg==''){return '';} 
        return '<table width=100% border=0 cellpadding=0 cellspacing=0 style="word-break:normal;word-wrap:break-word;">'+bljg+'</table>';    
    }
    //--------------------    
    var oinput=document.getElementById('input_search');
    if (cskey===false){
        cskey=oinput.value;
    }
    
    if (is_local===-1){
        is_local=klsofts_is_local_p();
    }

    var divlist=php_remove_klindex(cskey,is_local);

    oinput.value=cskey;
    recent_search_klindex(cskey);

    var list_file={};
    var tdcolumns=klsofts_cols_count_b();
    var popup_menu_size=(ismobile_b()?1.5:1);
    for (let item of divlist){
        var str_t=klsofts_one_b(item,2.5,true,'','onclick="klsofts_recent_b(this);"',' target=_blank',popup_menu_size);

        var bldegree='3';   //如果cskey不为空，则一律设为3 - 保留注释
        if (cskey=='' && item.length>=4){
            bldegree=item[3];
        }
        if (list_file['list'+bldegree]==undefined){
            list_file['list'+bldegree]=[];
        }
        list_file['list'+bldegree].push(str_t);
    }
    
    var result_t=[];
    for (let keyname in list_file){
        if (list_file[keyname].length==0){continue;}    
        list_file[keyname].sort(function (a,b){return a[1].toLowerCase()<b[1].toLowerCase() ? 1 : -1;});
        var blhtml=sub_components_klindex_table(list_file[keyname],tdcolumns);
        result_t.push([parseInt(keyname.substring(4,)),blhtml]);
    }
    result_t.sort(function (a,b){return a[0]>b[0] ? 1 : -1;});   //按key数字序号排序 - 保留注释
    result_t=result_t.slice(0,5);   //显示-1,0,1,2,3 - 保留注释
    for (let blxl=0,lent=result_t.length;blxl<lent;blxl++){
        result_t[blxl]=result_t[blxl][1];
    }
    document.getElementById('div_list').innerHTML=result_t.join('<hr />');
    klsofts_local_or_remote_b(is_local);    
}

function args_klindex(){
    var cskeys=href_split_b(location.href);
    if (cskeys.length>0 && cskeys[0]!==''){
        //形如：xxx.htm?s=a=&b= - 保留注释
        for (let item of cskeys){
            if (item.substring(0,7)=='enable='){
                enable_check_klindex(item.substring(7,).trim());
            } else if (item=='disable'){
                if (confirm('是否 disable klapps？')){
                    localStorage.removeItem('enable_klapps');
                    localStorage.setItem('reactive_klapps_date',next_day_b('',10)); //停止10天 - 保留注释
                }
            } else if (item.substring(0,2)=='s='){
                components_klindex(item.substring(2,).trim());
            }
        }
    } else {
        components_klindex();
    }
}

function enable_check_klindex(csstr){
    if (SHA1(date2str_b()+'enable')==csstr){
        localStorage.setItem('enable_klapps','1');
    }
}
