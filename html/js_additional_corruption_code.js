function file_load_corruption(){
    flot_load_common([],[],[],['map/district_cn_geo_data.js'],[],false);
}

function menu_more_corruption(){
    var str_t=klmenu_hide_b('');
    //table_th_jscm_global={'':'','content':''};
    var bltype=type_get_corruption();
    switch (bltype){
        case 'ccdi':
            var blkey='接受中央纪委国家监委纪律审查和监察调查';
            var bllink='<a href="https://www.ccdi.gov.cn/was5/web/search?page=5&channelid=298814&searchword='+encodeURIComponent(blkey)+'" target=_blank>'+blkey+'</a>';
            var bllen=22;
            break;
        case 'tzqf':
            var bllink='<a href="http://www.'+bltype+'.gov.cn/col/col1229059943/index.html" target=_blank>'+bltype+'</a>';
            var bllen=14;
            break;
        case 'zjsjw':
            var bllink='<a href="http://www.'+bltype+'.gov.cn/quanweifabu/shenchadiaocha/index.shtml" target=_blank>'+bltype+'</a>';
            var bllen=14;            
            break;
    }
    var klmenu1=[
    bllink,
    '<span id="span_merge_show_corruption_common" class="span_menu" onclick="'+str_t+'klmenu_check_b(this.id,true);">⚪ 合并展示</span>',
    '<span class="span_menu" onclick="'+str_t+'group_corruption();">分组</span>',
    '<span class="span_menu">项目标记：<input type="text" id="input_bullet_point_corruption_common" style="width:3rem;" placeholder="🐁🐀🐭" /></span>',
    ];

    return klmenu_b(klmenu1,'🛎',bllen+'rem','1rem','1rem','30rem');
}

function type_get_corruption(){
    return title_name_jscm_global.split(' ')[1];
}

function reg_exp_get_corruption(cstype){
    switch (cstype){
        case 'ccdi':
            var reg_exp=/^.+?>?(省|自治区|市|兵团|公司|银行|部|局|大学|政协|领导小组|中央纪委|法院|科协|委员会|国资委|巡视组)/;
            break;
        case 'tzqf':
            var reg_exp=/^.+?>?(区|县|乡|街道|局|公司|检察院|法院|政协|集团|人大|中心|联合会|执法队|站|馆|联合社|办公室|协会|医院|红十字会|常委|总工会)/;
            break;
        case 'zjsjw':
            var reg_exp=/^.+?>?(市|区|县)/;
            break;
    }
    return reg_exp;
}

function district_get_corruption(cstype,csstr,reg_exp,city_name=''){
    csstr=csstr.replace(/^<a href="[^\s]+">/,'');
        
    switch (cstype){
        case 'ccdi':
            if (csstr.startsWith('中央纪委')){
                return '中央纪委';
            }            
            var blstr=csstr.replace(/^原(中国|中央|国家)/,'$1').replace(/^第?.+?届/,'');
            
            var result_t=blstr.split('，')[0].match(reg_exp) || ['',''];
            //结果如：[ "原国家食品药品监督管理总局", "局" ] - 保留注释
            blstr=result_t[0];
            
            var dict_t={'广西自治区':'广西壮族自治区','国家粮食和物资储备局':'国家粮食局'};
            if (blstr in dict_t){
                blstr=dict_t[blstr];
            }
            break;
        case 'tzqf':
            var blstr=csstr.replace(/^.+?省/,'');
            var result_t=blstr.split('，')[0].match(reg_exp) || ['',''];
            
            blstr=result_t[0].replace(/^原/,'').replace(/^(.+?)(镇|乡|街道|局).+$/,'$1$2');

            if (blstr.match(/^.{2}?市(.+?区)/)){
                blstr=blstr.replace(/^.{2}?市(.+?区)/,'$1');
            }

            if (!blstr.startsWith(city_name)){
                blstr=blstr.replace(/^(.+?[县市区]).+$/,'$1');
                if (blstr==''){
                    blstr=csstr.replace(/^(.+?[县市区]).+$/,'$1');
                }                            
            }
            
            break;
        case 'zjsjw':
            csstr=csstr.replace(/^原/,'').replace(/^中共/,'').replace(/(中国|国家).+?(银行|公司|局)/,'');        
            var blstr=csstr.replace(/^.+?省/,'');
            blstr=(blstr.split('，')[0].match(reg_exp) || ['',''])[0];

            var blfound=false;
            for (let item of district_cn_geo_global){
                if (item[3]==blstr){
                    blstr=item[4].split(' ')[1];                    
                    blfound=true;
                    break;
                }
            }
            if (!blfound){
                if (blstr.endsWith('区') || blstr.endsWith('县') || blstr.endsWith('市') || blstr.endsWith('城市')){
                    blstr=blstr.slice(0,2);
                    for (let item of district_cn_geo_global){
                        if (item[3].slice(0,2)==blstr){
                            blstr=item[4].split(' ')[1];
                            blfound=true;
                            break;
                        }
                    }
                }
            }
            if (!blfound){
                blstr=csstr.slice(0,2);
                for (let item of district_cn_geo_global){
                    if (item[3].slice(0,2)==blstr){
                        if (item[4].includes(' ')){
                            blstr=item[4].split(' ')[1];
                        } else {
                            blstr='其他';
                        }
                        blfound=true;
                        break;
                    }
                }
            }

            if (!blfound){
                console.log('not found',csstr);
                blstr='其他';
            }
            break;
    }
    return blstr;
}

function group_corruption(){
    var list_t=[];
    var district_t={}
    var error_list=[];
    
    var bltype=type_get_corruption();
    if (bltype=='tzqf'){
        var city_name=(prompt('输入地级市名称') || '').trim().split('市')[0];
        if (city_name==''){return;}
    }
    
    var reg_exp=reg_exp_get_corruption(bltype);
    for (let arow of js_data_current_common_search_global){        
        var bltitle=arow[0][0].split(/(接受|涉嫌)/)[0];
        var place_name=district_get_corruption(bltype,bltitle,reg_exp,city_name);
        if (place_name==''){
            error_list.push(bltitle);
        } else {
            if (district_t['d_'+place_name]==undefined){
                district_t['d_'+place_name]=[[]];
            }
            district_t['d_'+place_name][0].push(arow[0]);
        }
    }
        
    district_t=object2array_b(district_t,true,2);
    var bullet_point=document.getElementById('input_bullet_point_corruption_common').value;

    for (let blxl=0,lent=district_t.length;blxl<lent;blxl++){
        district_t[blxl][1].sort(function (a,b){return a.slice(-1)[0]>b.slice(-1)[0]?-1:1;});
        for (let blno=0,lenb=district_t[blxl][1].length;blno<lenb;blno++){
            district_t[blxl][1][blno][0]=bullet_point+district_t[blxl][1][blno][0];
            district_t[blxl][1][blno]=district_t[blxl][1][blno].join(' ');
        }
    }
    
    district_t.sort(function (a,b){return zh_sort_b(a, b, false, 0);}); //按key排序 - 保留注释
    district_t.sort(function (a,b){return a[1].length<b[1].length?1:-1;}); //按个数排序 - 保留注释
    
    for (let blxl=0,lent=district_t.length;blxl<lent;blxl++){
        district_t[blxl]='<h4>'+(blxl+1)+'. '+district_t[blxl][0]+'('+district_t[blxl][1].length+')'+'</h4>'+array_2_li_b(district_t[blxl][1]);
    }
    
    document.getElementById('divhtml').innerHTML=district_t.join('\n');

    console.log('error',error_list.length,error_list.join('\n'));
}

function col_rearrange_corruption(){
    var is_merge=klmenu_check_b('span_merge_show_corruption_common',false);
    if (!is_merge){return js_data_current_common_search_global;}
    
    var list_t=[];
    
    for (let arow of js_data_current_common_search_global){        
        var new_row=['<a href="'+arow[0][1]+'">'+arow[0][0]+'</a>',arow[0][2]];        
        list_t.push([new_row,arow[1]]);
    }
    return list_t;
}
