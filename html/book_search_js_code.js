function init_ebsjs(){
    enwords_init_b(true);
    enwords_mini_search_frame_style_b();
    enwords_mini_search_frame_form_b();
    
    top_bottom_arrow_b('div_top_bottom','',false,(ismobile_b()?'1.8rem':'1.6rem'));
    input_with_x_b('input_search',20,'',false);
    search_recent_ebsjs();

    if (location.href.substring(0,5)=='file:'){
        document.getElementById('divhtml').innerHTML='不支持 file:///';
    }
    args_ebsjs();
}

function menu_ebsjs(){
    var str_t=klmenu_hide_b('');
    var klmenu1=[
    '<span class="span_menu" onclick="'+str_t+'new_words_ebs_b();">显示生词</span>',
    '<span class="span_menu" onclick="'+str_t+'document.getElementById(\'div_batch_search_ebs\').style.display=\'\';">批量搜索</span>',   
    
    ];

    document.getElementById('span_title').insertAdjacentHTML('beforebegin',klmenu_multi_button_div_b(klmenu_b(klmenu1,'','14rem','1rem','1rem','60rem'),'','0rem')+' ');
}

function args_ebsjs(){
    var cskeys=href_split_b(location.href);
    var is_eng=true;
    if (cskeys.length>0 && cskeys[0]!==''){        
        for (let one_key of cskeys){
            one_key=one_key.trim();
            if (one_key=='eng'){
                is_eng=true;
            }
            if (one_key=='all'){
                is_eng=false;
            }            
        }
    }   
    
    document.getElementById('input_only_eng').checked=is_eng;
    
    if (cskeys.length>0 && cskeys[0]!==''){            
        //第二次处理 - 保留注释
        for (let one_key of cskeys){
            one_key=one_key.trim();
            if (one_key.substring(0,2)=='s='){
                search_ebsjs(one_key.substring(2,));
                break;
            }
        }
    }
}

function search_ebsjs(csstr='',csmax_total=50,csmax_current=5){
    function sub_search_ebsjs_one_book(csmax_total,csmax_current){
        if (blxl>=bllen || bltotal>=csmax_total){
            ospan.innerHTML='';
            document.title=old_title;
            document_title_ebs_b();
            content_file_found_global=result_t;
            show_result_ebsjs(csstr);
            enwords_array_ebs_b();
            return;
        }
        var item=(is_eng_global?csbooklist_sub_global_b[blxl]:csbooklist_source_global[blxl]);
        
        var filelist=[];
        var fname=import_one_book_b(item[0]+'.js',item[3],false);
        var allText=read_txt_file_b(fname);
        eval(allText);  //filelist - 保留注释
        
        var blcount=0;
        var current_list=[];
        for (let a_content_row of filelist){
            var blfound_filelist=str_reg_search_b(a_content_row,csstr,is_reg);
            if (blfound_filelist==-1){break;}

            if (blfound_filelist){
                current_list.push(a_content_row);

                var digest_global=[];
                var digest_file=book_path_py_b('digest',item[3])+item[0]+'_digest.js';
                var digestText=read_txt_file_b(digest_file);
                eval(digestText);  //digest_global - 保留注释
                for (let a_digest_row of digest_global){
                    var blfound_digest=str_reg_search_b(a_digest_row,csstr,is_reg);
                    if (blfound_digest==-1){break;}       
                    if (blfound_digest){
                        digest_file_found_global.push(item[0]);
                        break;
                    }
                }
                
                blcount=blcount+1;
                bltotal=bltotal+1;
                if (blcount>=csmax_current || bltotal>=csmax_total){break;}
            }
        }
        if (current_list.length>0){
            result_t.push('BN:'+item[0]);
            result_t=result_t.concat(current_list);
        }
        blxl=blxl+1;      
        var blinfo=blxl+'/'+bllen+'. '+item[1];
        ospan.innerHTML=blinfo+'<small>('+allText.length+'/'+filelist.length+')</small>';
        document.title=blinfo+'('+allText.length+'/'+filelist.length+')'+old_title;
        if (allText.length==0 || filelist.length==0){
            console.log(item[1],item[0],0);
        }
        setTimeout(function(){sub_search_ebsjs_one_book(csmax_total,csmax_current);},5);  
    }
    //-----------------    
    var is_reg=false;    

    csstr=csstr.replace(new RegExp(/[<>"]/,'g'),'');   
    csstr=csstr.trim();
    search_recent_ebsjs(csstr);
    document.getElementById('input_search').value=csstr;

    if (csstr.slice(-4,)=='(:r)'){
        is_reg=true;
        csstr=csstr.slice(0,-4).trim();
    }
    if (csstr==''){return;}

    digest_file_found_global=[];

    var is_eng_global=document.getElementById('input_only_eng').checked;
    var ospan=document.getElementById('readingdata');
    if (is_eng_global){
        csbooklist_sub_global_b.sort(randomsort_b);
        var bllen=csbooklist_sub_global_b.length;
    }
    else {
        csbooklist_source_global.sort(randomsort_b);    
        var bllen=csbooklist_source_global.length;
    }
    var blxl=0;
    var result_t=[];
    var bltotal=0;
    var old_title=document.title;
    sub_search_ebsjs_one_book(csmax_total,csmax_current);
}

function search_recent_ebsjs(csstr=''){
    recent_search_b('recent_search_ebs',csstr,'search_ebsjs','div_recent_search',[],25,false);
}

function show_result_ebsjs(csstr=''){
    if (csstr.slice(0,6)=='&#92;b'){
        csstr=csstr.slice(6,);
    }
    if (csstr.slice(-6,)=='&#92;b'){
        csstr=csstr.slice(0,-6);
    }
    if (csstr==''){return;}
    var is_eng_global=document.getElementById('input_only_eng').checked;
    var book_arr=(is_eng_global?csbooklist_sub_global_b:csbooklist_source_global);

    var selepath=klbase_sele_path_b()[1];
    show_result_ebs_b(content_file_found_global,book_arr,csstr,selepath);

    filelist=content_file_found_global;
    getlines_kltxt_b(1,99,true,false,false);
    highlight_text_b([csstr]);
}

function search_batch_ebsjs(){
    var blstr=document.getElementById('textarea_batch_search_ebs').value.trim();
    if (blstr==''){return;}
    blstr=blstr.replace(new RegExp(/\r/,'g'),'');
    var list_t=blstr.split('\n');
    var result_t=[];
    for (let aword of list_t){
        aword=aword.trim();
        if (aword==''){continue;}
        result_t.push(aword);
    }
    if (result_t.length>0){
        var key='('+result_t.join('|')+')(:r)';
        search_ebsjs(key,100,10);
    }
}
