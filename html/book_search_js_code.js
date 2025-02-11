function init_ebsjs(){
    init_ebs_b();
    
    var input_list=[
    ['input_book_filter',12,0.8],
    ];
    input_size_b(input_list,'id');
        
    input_with_x_b('input_search',20,'',false);
    search_recent_ebsjs();

    if (location.href.substring(0,5)=='file:'){
        document.getElementById('divhtml').innerHTML='不支持 file:///';
    }
    args_ebsjs();
}

function args_ebsjs(){
    var is_eng=true;
    var blkey=false;
    var book_filter='';    

    var cskeys=href_split_b(location.href);
    if (cskeys.length>0 && cskeys[0]!==''){        
        for (let one_key of cskeys){
            one_key=one_key.trim();
            if (one_key=='eng'){
                is_eng=true;
            } else if (one_key=='all'){
                is_eng=false;
            } else if (one_key.substring(0,2)=='s='){
                blkey=one_key.substring(2,);
            } else if (one_key.substring(0,2)=='b='){
                book_filter=one_key.substring(2,);
            }
        }
    }

    if (blkey!==false){
        search_ebsjs(blkey);    
        document.getElementById('input_only_eng').checked=is_eng;
        document.getElementById('input_book_filter').value=book_filter;        
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
        var item=csbooklist_sub_global[blxl];//(is_eng?:csbooklist_source_global[blxl]);
        
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
    csstr=csstr.replace(/[<>"]/g,'');   
    csstr=csstr.trim();
    search_recent_ebsjs(csstr);
    document.getElementById('input_search').value=csstr;

    [csstr,is_reg]=str_reg_check_b(csstr,false);
    if (csstr==''){return;}

    digest_file_found_global=[];

    var is_eng=document.getElementById('input_only_eng').checked;
    var book_filter=document.getElementById('input_book_filter').value.trim();
    var ospan=document.getElementById('readingdata');
    if (is_eng){
        var filter_key='+englishwords +已整理'+(book_filter==''?'':'+'+book_filter);
    } else {
        var filter_key=book_filter;
    }
    
    book_makelist_b(filter_key,'(:r)');
    
    csbooklist_sub_global.sort(randomsort_b);
    var bllen=csbooklist_sub_global.length;    

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
    var is_eng=document.getElementById('input_only_eng').checked;
    var book_arr=csbooklist_sub_global;//(is_eng?:csbooklist_source_global);

    var selepath=klbase_sele_path_b()[1];
    show_result_ebs_b(content_file_found_global,book_arr,csstr,selepath);

    filelist=content_file_found_global;
    getlines_kltxt_b(1,99,true,false,false);
    highlight_text_b([csstr]);
}

function search_batch_ebsjs(){
    var blstr=document.getElementById('textarea_batch_search_ebs').value.trim();
    if (blstr==''){return;}
    blstr=blstr.replace(/\r/g,'');
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
