function menu_more_slexicon(){
    var str_t=klmenu_hide_b('');
    
    table_th_jscm_global={'word':'','category':'','type':''};

    var klmenu1=[
    '<a href="https://github.com/Konsheng/Sensitive-lexicon" target=_blank>konsheng/Sensitive-lexicon</a>',
    '<span class="span_menu" onclick="'+str_t+'set_count_slexicon();">当前无重复词汇数量统计</span>',    
    '<span class="span_menu" onclick="'+str_t+'intersection_diff_slexicon(\'intersection\');">当前条件不同分类词汇交集</span>',    
    '<span class="span_menu" onclick="'+str_t+'intersection_diff_slexicon(\'diff\');">当前条件不同分类词汇差集</span>',    
    ];
    
    return klmenu_b(klmenu1,'汉','16rem','1rem','1rem','30rem');
}

function set_count_slexicon(){
    var words=new Set();
    var whole_cn=new Set();
    var whole_en=new Set();
    var others=new Set();
    for (let arow of js_data_current_common_search_global){
        words.add(arow[0][0]);
        if (arow[0][2]=='C'){
            whole_cn.add(arow[0][0]);
        } else if (arow[0][2]=='M'){
            others.add(arow[0][0]);
        } else {
            whole_en.add(arow[0][0]);
        }
    }
    console.log(whole_cn,whole_en,others);
    alert('当前共有不重复词汇 '+words.size+' 个，其中全汉字 '+whole_cn.size+' 个，无汉字 '+whole_en.size+' 个，其他 '+others.size+' 个');
    //return [words,whole_cn,whole_en,others];
}

function intersection_diff_slexicon(cstype){
    function sub_intersection_diff_slexicon_one(){
        if (blxl>=bllen){
            let blbutton='<p>'+close_button_b('div_status_common','','aclick')+'</p>';
            ostatus.insertAdjacentHTML('beforeend',blbutton);
            ostatus.scrollIntoView();
            document.title=old_title;            
            console.log('intersection_diff_slexicon() 费时：'+(performance.now() - t0) + ' milliseconds');
            return;
        }
        
        let key1=key_list[blxl].slice(2,);
        let intersect, diff1,diff2;
        for (let key2 of key_list){
            key2=key2.slice(2,);
            if (key1==key2){continue;}
            
            let two_keys=[key1,key2];
            two_keys.sort();
            if (used_set.has(two_keys.join('_'))){continue;}
            used_set.add(two_keys.join('_'));
            
            let bljg='';
            
            switch (cstype){
                case 'intersection':
                    intersect=array_intersection_b(category_dict['c_'+key1],category_dict['c_'+key2]);
                    
                    bljg=bljg+'<h4>'+key1+' 与 '+key2+' 的交集('+intersect.length+')</h4>';
                    if (intersect.length>0){
                        bljg=bljg+textarea_with_form_generate_b('textarea_slexicon_intersection_'+blxl,'height:10rem;','<p>','清空,复制,发送到临时记事本'+address,'</p>','','',false,intersect.join('\n'));
                        address='';
                    }
                    break;
                case 'diff':
                    [diff1,diff2]=array_difference_b(category_dict['c_'+key1],category_dict['c_'+key2],false,true);
                    
                    bljg=bljg+'<h4>'+key1+' 含有 '+key2+' 不含有('+diff1.length+')</h4>';
                    if (diff1.length>0){
                        bljg=bljg+textarea_with_form_generate_b('textarea_slexicon_diff1_'+blxl,'height:10rem;','<p>','清空,复制,发送到临时记事本'+address,'</p>','','',false,diff1.join('\n'));
                        address='';
                    }
                    
                    bljg=bljg+'<h4>'+key1+' 不含有 '+key2+' 含有('+diff2.length+')</h4>';
                    if (diff2.length>0){
                        bljg=bljg+textarea_with_form_generate_b('textarea_slexicon_diff2_'+blxl,'height:10rem;','<p>','清空,复制,发送到临时记事本'+address,'</p>','','',false,diff2.join('\n'));
                        address='';
                    }
                    break;
            }
            if (bljg!==''){
                ostatus.insertAdjacentHTML('beforeend',bljg);
            }
        }
        blxl=blxl+1;
        document.title=blxl+'/'+bllen+' - '+old_title;
        
        setTimeout(sub_intersection_diff_slexicon_one,1);
    }
    
    var t0=performance.now();    

    var category_dict={};
    for (let arow of js_data_current_common_search_global){
        let blkey='c_'+arow[0][1];
        if (category_dict[blkey]==undefined){
            category_dict[blkey]=[];    //如果使用 new Set() 变慢 - 保留注释
        }
        category_dict[blkey].push(arow[0][0]);
    }
    
    var key_list=Object.keys(category_dict);
    key_list.sort(function (a,b){return zh_sort_b(a,b);});

    var used_set=new Set();
        
    var blxl=0;
    var bllen=key_list.length;
    var old_title=document.title;
    var address=',发送地址'
    var ostatus=document.getElementById('div_status_common');
    ostatus.innerHTML='';
    sub_intersection_diff_slexicon_one();
}
