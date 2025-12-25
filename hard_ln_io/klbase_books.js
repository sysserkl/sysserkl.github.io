function book_makelist_b(cstag='all',reg_mark='_reg'){
    //cstag 支持如：“历史 幻想” 等表达式 - 保留注释
    var list_t=[];
    var blreg=false;
    [cstag,blreg]=str_reg_check_b(cstag,blreg,true,reg_mark);
    
    if (csbookno_global>=0){
        var list_t=csbooklist_sub_global[csbookno_global];
    }
    var list2_t=[];
    if (csbookno2_global>=0){
        var list2_t=csbooklist_sub_global[csbookno2_global];
    }
    
    csbooklist_sub_global=[];
    if (cstag=='' || cstag=='all'){
        for (let item of csbooklist_source_global){
            csbooklist_sub_global.push(item);
        }
    } else {
        for (let item of csbooklist_source_global){
            search_t=str_reg_search_b(item,cstag,blreg);
            if (search_t==-1){break;}
            if (search_t){
                csbooklist_sub_global.push(item);
            }
        }
    }
    
    if (list_t.length>0){
        csbookno_global=csbooklist_sub_global.indexOf(list_t);
    }    
    if (list2_t.length>0){
        csbookno2_global=csbooklist_sub_global.indexOf(list2_t);
    }
}

function book_href_check_b(is_attach=true){
    var cshref=location.href;
    
    if ((cshref.includes('/klwebphp/') || cshref.includes('/klwebphp_backup/')) && !cshref.includes('/PythonTools/')){
        if (is_attach){
            return 'PythonTools/data/selenium_news/jsdoc_attachment/';
        } else {
            return 'PythonTools/data/selenium_news/jsdoc3/';
        }
    } else {
        if (is_attach){    
            return new URL('../',cshref)['href']+'jsdoc_attachment/';
        } else {
            return new URL('../',cshref)['href']+'jsdoc3/';
        }
    }
}

function book_path_py_b(csname,jsdoc_num){
    return book_href_check_b(true)+csname+jsdoc_num+'/';
}

function book_path_b(jsdoc_num,is_private=false){
    var blhref=location.href;
    var is_file=(blhref.substring(0,5)=='file:');
    if (jsdoc_num=='3'){
        return book_href_check_b(false);
    } else if (jsdoc_num.toString().includes('digest')){
        if (is_private){
            if (is_file){
                return blhref.split('/klwebphp/')[0]+'/jsdoc/jsdoc'+jsdoc_num.replace('digest','')+'/digest/';
            } else {
                return blhref.split('/klwebphp/')[0]+'/klwebphp/jsdoc'+jsdoc_num.replace('digest','')+'/digest/';
            }        
        } else {
            return book_href_check_b(true)+jsdoc_num+'/';
        }
    } else {
        if (blhref.includes('/klwebphp/')){
            if (is_file){
                blhref=blhref.split('/klwebphp/')[0]+'/jsdoc/jsdoc'+jsdoc_num+'/';
            } else {
                blhref=blhref.split('/klwebphp/')[0]+'/klwebphp/jsdoc'+jsdoc_num+'/';
            }
        } else if (blhref.includes('/klwebphp_backup/')){
            if (is_file){
                blhref=blhref.split('/klwebphp_backup/')[0]+'/jsdoc_backup/jsdoc'+jsdoc_num+'/'; //是 /jsdoc_backup/ 而不是 /jsdoc/ - 保留注释
            } else {
                blhref=blhref.split('/klwebphp_backup/')[0]+'/klwebphp_backup/jsdoc'+jsdoc_num+'/';
            }
        } else {
            blhref=new URL('../',blhref)['href']+'jsdoc'+jsdoc_num+'/';
        }    
        return blhref;
    }
}

function import_one_book_b(bookname,jsdoc_num,do_write=true){
    //bookname: klwiki_en.js - 保留注释
    filelist=[];    //全局变量 - 保留注释
    var blpath_name=book_path_b(jsdoc_num)+bookname+file_date_parameter_b();
    if (do_write){
        document.write('\n<script src="'+blpath_name+'"><\/script>\n');
        console.log(blpath_name);
    }
    return blpath_name;
}

function filelist_merge_book_b(id_list,run_fn=false){
    function sub_filelist_merge_book_b_wait(is_ok){
        console.log(is_ok);
        if (is_ok){
            result_t=result_t.concat(filelist);
            console.log(result_t.length);
            filelist=undefined;
        }
        
        blxl=blxl+1;
        document.title=blxl+'/'+bllen+' - '+old_title;
        setTimeout(sub_filelist_merge_book_b_one,1);        
    }
    
    function sub_filelist_merge_book_b_one(){
        if (blxl>=bllen){
            document.title=old_title;
            if (typeof run_fn == 'function'){
                run_fn(result_t);
            }
            return;
        }
        
        let blfound=false;
        for (let row_no=0,lent=csbooklist_sub_global.length;row_no<lent;row_no++){
            if (csbooklist_sub_global[row_no][0]==id_list[blxl]){
                fpath=['js',num_type_path_id_get_book_b(row_no).slice(-2,).join('')+'.js',''];
                load_js_var_file_b('filelist',[fpath],'',sub_filelist_merge_book_b_wait);
                blfound=true;
                break;
            }
        }
        
        if (!blfound){
            console.log('未发现 id',id_list[blxl]);
            sub_filelist_merge_book_b_wait(false);
        }
    }
    
    var blxl=0;
    var bllen=id_list.length;
    var old_title=document.title;
    var fpath;
    var result_t=[];
    filelist=undefined;
    sub_filelist_merge_book_b_one();
}

function num_type_path_id_get_book_b(book_no){
    var jsdoc_num='';
    var book_type='';
    var jsdoc_path='';
    var bookid='';
    
    if (csbooklist_sub_global.length>0){
        if (csbooklist_sub_global[book_no].length>=4){
            jsdoc_num=csbooklist_sub_global[book_no][3];
        }

        var book_type=book_type_b(csbooklist_sub_global[book_no]);
        var jsdoc_path=book_path_b(jsdoc_num,book_type.includes('P'));
        var bookid=csbooklist_sub_global[book_no][0];
    }
    
    //结果形如：[ "1", "", "http://aaa/jsdoc1/", "1984_dong_wu_zhuang_yuan_ywb_186007" ]
    return [jsdoc_num,book_type,jsdoc_path,bookid];
}

function import_book_js_b(){
    var book_no = csbookno_global;
    var today=file_date_parameter_b();
    var jsdoc_num,book_type,jsdoc_path,bookid;
    if (csbookno2_global>=0){
        [jsdoc_num,book_type,jsdoc_path,bookid]=num_type_path_id_get_book_b(csbookno2_global);

	    document.write('\n<script src="'+jsdoc_path+bookid+'.js'+today+'"><\/script>\n');
        console.log(jsdoc_path+bookid+'.js'+today);
        //以下2行保留，第2本书忽略目录和摘要 - 保留注释
	    //document.write('\n<script src="'+jsdoc_path+'menu/'+csbooklist_sub_global[csbookno2_global][0]+'_menu.js"><\/script>\n');
	    //document.write('\n<script src="'+jsdoc_path+'digest/'+csbooklist_sub_global[csbookno2_global][0]+'_digest.js"><\/script>\n');

        document.write('\n<script>\n');
        document.write('\nvar filelist2=[].concat(filelist);\n');
        document.write('</script>\n');
    }
    txtbook_js_code_file_global=''; //全局变量 - 保留注释
    //---
    [jsdoc_num,book_type,jsdoc_path,bookid]=num_type_path_id_get_book_b(book_no);

    if (csbooklist_sub_global.length>0){
        document.write('\n<script src="'+jsdoc_path+bookid+'.js'+today+'" onload="console.log(\'loaded:\', this.src);" onerror="console.log(\'failed:\', this.src);"><\/script>\n');
        //console.log(jsdoc_path+bookid+'.js'+today);   //此行保留 - 保留注释
        
        if (jsdoc_num.includes('digest')){
            document.write('\n<script>\n');
            document.write('var filelist=[].concat(digest_global);\n');
            document.write('</script>\n');        
        } else {
            menu_digest_file_full_name_b(book_no,jsdoc_num,bookid,jsdoc_path,true);
        }
        if (book_type.includes('J')){
            var list_t=book_type.match(/J([a-z_]+)/) || [];
            if (list_t.length==2){
                txtbook_js_code_file_global=list_t[1];            
            } else {
                txtbook_js_code_file_global=bookid;
            }
        }
    }
}

function digest_get_enwords_b(is_set=true,is_lower=false){
    var result_t=[];
    for (let item of digest_global){
        if (item.substring(0,1)=='*'){
            if (is_lower){
                result_t.push(item.substring(1,).trim().toLowerCase());            
            } else {
                result_t.push(item.substring(1,).trim());
            }
        }
    }
    if (is_set){
        return new Set(result_t);
    }
    return result_t;
}

function menu_digest_file_full_name_b(book_no=false,jsdoc_num=false,bookid=false,jsdoc_path=false,do_write=false,add_date=true){
    if (csbooklist_sub_global.length==0){
        return ['',''];
    }
    
    if (book_no===false){
        book_no=csbookno_global;
    }
    
    if (jsdoc_num===false){
        if (csbooklist_sub_global[book_no].length>=4){
            jsdoc_num=csbooklist_sub_global[book_no][3];    
        } else {
            jsdoc_num='';
        }
    }

    var book_type=book_type_b(csbooklist_sub_global[book_no]);

    if (jsdoc_path===false){
        jsdoc_path=book_path_b(jsdoc_num,book_type.includes('P'));
    }
    if (bookid===false){
        bookid=csbooklist_sub_global[book_no][0];
    }
    
    var result_t=[];
    var js_menu_file='';
    var js_digest_file='';

    if (book_type.includes('P')){
        js_menu_file=jsdoc_path+'menu/'+bookid+'_menu.js';
        result_t.push(['js',js_menu_file,'']);
        
        js_digest_file=jsdoc_path+'digest/'+bookid+'_digest.js';
        result_t.push(['js',js_digest_file,'']);
    } else {
        js_menu_file=book_path_py_b('menu',jsdoc_num)+bookid+'_menu.js';
        result_t.push(['js',js_menu_file,'']);

        js_digest_file=book_path_py_b('digest',jsdoc_num)+bookid+'_digest.js';
        result_t.push(['js',js_digest_file,'']);
    }
    
    if (do_write){
        write_js_css_b(result_t);
    }

    var today=(add_date?file_date_parameter_b():'');
    return [js_menu_file+today,js_digest_file+today];
    //return [js_menu_file+today,''];   //此行保留 - 保留注释
}

function books_generate_b(show_type=false,cstype='txt',cstag='all',enforce_refresh=false){   //书目生成，category - 保留注释
    if (cstag=='NONE'){return '';}
    
    if (typeof show_all_books_global == 'undefined'){
        show_all_books_global=false;
    }
    
    switch (show_type){
        case 'global':
            var showall=show_all_books_global;
            break;
        case 'switch':
            show_all_books_global=!show_all_books_global;
            var showall=show_all_books_global;
            break;
        default:
            var showall=show_type;
    }
    
    var current_show=document.querySelector('span.span_show_all_kltxt')!==null;
    var ocurrent=document.querySelector('span.span_current_book_item');
    if (ocurrent){
        var oa=ocurrent.parentNode;
        if (oa){
            var blhref=decodeURIComponent(oa.href);
            if (blhref){
                var blstr='?'+csbooklist_sub_global[csbookno_global][0]+'_tag'+cstag;
                if (!enforce_refresh){
                    if ((blhref.includes(blstr+'&') || blhref.endsWith(blstr)) && showall==current_show){
                        console.log('books_generate_b() 未更新');
                        return;
                    }
                }
            }
        }
    }
    
	var blword = '';
	var tmp_o=document.getElementById('input_search');
	if (tmp_o){
        var blkey=tmp_o.value.trim();
        if (blkey.length<200){
            blword = specialstr_html_b(blkey);
        } else {
            console.log('忽略长链接：',blkey);
        }
    }
    
	var blreg='';
	tmp_o=document.getElementById('input_reg');
	if (tmp_o){
		if (tmp_o.checked==true){
            blreg='_reg';
        }
	}
	
	var bljg='';
	var left1str1_tmp='';
	var left1str2_tmp='';
    
    var today = new Date();
    var day_t=today.getDate();
    var month_t=today.getMonth()+1;
    var day_t2=months_b(month_t-1)+day_t;
    if (day_t2>182){
        day_t2=day_t2-182;
    }
    var today_xl=1;
    
    var blshow_no=(location.href.includes('/txtlistsearch.htm')?1:0);
	for (let blno=0,lent=csbooklist_sub_global.length;blno<lent;blno++){
        var item=csbooklist_sub_global[blno];
        var asc_t=asc_sum_b(item[0]+item[1]);
		if (csbooklist_sub_global.length<=5 || showall || blno==0 || Math.abs(csbookno_global-blno)<=blshow_no || csbooklist_sub_global.length-1==blno || csbookno_global==blno || asc_t%182+1==day_t2){
			if (csbookno_global==blno){
                bljg=bljg+'<span style="color:'+scheme_global['a-hover']+';">';
            }
            //#dfdf7f 棕青色 - 保留注释
			if (asc_t%182+1==day_t2){
				bljg=bljg+'<span style="border-bottom:3px solid #ff0000;margin-right:2px;">('+today_xl+')-';
                today_xl=today_xl+1;
			}
			bljg=bljg+(parseInt(blno)+1)+'. ';

			if (asc_t%182+1==day_t2){
				bljg=bljg+'</span>';
			}

			if (csbookno_global==blno){
                bljg=bljg+'</span>';
            }
			if (cstype=='txt'){
                bljg=bljg+'<a class="a_oblong_box" '+(item[3]=='3'?'style="background-color:'+scheme_global['button']+';" ':'')+'href="?'+item[0]+'_tag'+cstag;
                if (blword+blreg==''){
                    bljg=bljg+'&line=1';
                } else {
                    bljg=bljg+'&s='+blword+blreg;
                }
                bljg=bljg+'">';
            } else if (cstype=='eng'){
                bljg=bljg+'<a class="a_oblong_box" href="?book='+(parseInt(blno)+1)+'">';
            } else if (cstype=='wiki'){
                bljg=bljg+'<a class="a_oblong_box" href="?book='+(parseInt(blno)+1)+'&subtag='+specialstr92_b(cstag)+'">';                
            }
            
			if (csbookno_global==blno){
				bljg=bljg+'<span class="span_current_book_item" style="color:'+scheme_global['a-hover']+';">';
			}
			bljg=bljg+item[1];
			if (csbookno_global==blno){
                bljg=bljg+'</span>';
            }
            if (item[2].includes('已整理')){   //待完成整理后，删除
                bljg=bljg+'✔';
            }
			if (['txt','eng','wiki'].includes(cstype)){
                bljg=bljg+'</a> ';
            }
		} else {
            bljg=bljg+'. . . ';
        }
	}
    
	while (bljg.includes('. . . . ')){
        bljg=bljg.replace(/(\. ){4}/g,'. . . ');
    }
    if (showall){
	    bljg=bljg+'<span class="span_show_all_kltxt"></span>';
    }
	tmp_o=document.getElementById('booklinks');
	if (tmp_o){
        tmp_o.innerHTML=bljg;
        console.log('books_generate_b() 已更新');
    } else {
        console.log('未发现 id: booklinks');
        return bljg;
    }
	return '';
}

function book_category_b(csid='',otherlists=[],cstag='',cstype=''){
    //全部书籍的分类
    var list_t=[].concat(otherlists);
    for (let item of csbooklist_source_global){
        if (item.length>=3){
            list_t=list_t.concat(item[2].split(','));  //item[2] 可能含有多个, - 保留注释
        }
    }
    list_t=array_unique_b(list_t);
    list_t.sort(function (a,b){return zh_sort_b(a,b,false);}); 
    if (cstype=='list'){
        return list_t;
    }
    
    var blstr=local_storage_get_b('digest_temp_txtlistsearch').trim();
    var bljg=[];
    for (let blxl=1;blxl<=3;blxl++){
        bljg.push('<a class="a_book_category" href="?_tag^'+blxl+'$_reg">'+blxl+'</a> ');
    }
    for (let item of list_t){
        if (item==''){continue;}
        if (item=='📝' && blstr==''){continue;} //无临时摘要则不显示临时摘要图标，但 csbooklist_source_global 中书籍的 tag 中还有 📝 标记 - 保留注释
        if ((' '+cstag+' ').includes(' +'+item+' ') || (' '+cstag+' ').includes(' '+item+' ') && !cstag.includes('+')){
            var redstr=' style="color:red;"';
        } else {
            var redstr='';
        }
        bljg.push('<a class="a_book_category" href="?_tag'+item+'"'+redstr+'>'+item+'</a> ');
    }
	var tmp_o=document.getElementById(csid);
	if (tmp_o){
        tmp_o.innerHTML=bljg.join('\n');
    }
    return bljg;
}

function bookid_2_bookname_b(csid,is_current=false,is_name_2_id=false){
    //根据id返回书名 或 根据书名返回id - 保留注释
    let col_list=(is_name_2_id?[1,0]:[0,1]);
    
    let bookname_t=csid;
    let blno=-1;    
    let csarr=(is_current?csbooklist_sub_global:csbooklist_source_global);    
    for (let blxl=0,lent=csarr.length;blxl<lent;blxl++){
        let item=csarr[blxl];    
        if (item[col_list[0]]==csid){
            bookname_t=item[col_list[1]];
            blno=blxl;
            break;
        }
    }
    return [bookname_t,blno];
}

function reader_lastbook_id_get_b(){
    var last_book=local_storage_get_b('reader_lastbook',-1,true);
    var marked_set=new Set();
    for (let blxl=0,lent=last_book.length;blxl<lent;blxl++){
        last_book[blxl]=last_book[blxl].split('&');
        if (last_book[blxl].length>=2){
            marked_set.add(last_book[blxl][1]);
        }
    }
    return [marked_set,last_book];
}

function booklist_source_config_b(is_digest=false){
    var marked_set=reader_lastbook_id_get_b()[0];
    
    var temp_digest_set=new Set();
    var list_t=local_storage_get_b('digest_temp_txtlistsearch',-1,true);
    for (let item of list_t){
        temp_digest_set.add(item.split(':')[0]);
    }

    var type_list=[['P','🏳P'],['L','🏳L'],['*','🏳E']];
    for (let blxl=0,lent=csbooklist_source_global.length;blxl<lent;blxl++){
        var item=csbooklist_source_global[blxl];
        var book_type=book_type_b(item);
        if (marked_set.has(item[0])){
            csbooklist_source_global[blxl][2]=csbooklist_source_global[blxl][2]+',🔖';
        }
        if (temp_digest_set.has(item[0])){
            csbooklist_source_global[blxl][2]=csbooklist_source_global[blxl][2]+',📝';
        }
        for (let one_type of type_list){
            if (book_type.includes(one_type[0])){
                csbooklist_source_global[blxl][2]=csbooklist_source_global[blxl][2]+','+one_type[1];
            }
        }
    }
    
    if (is_digest){
        var list_t=[];
        without_digest_book_list_global=[];
        for (let one_book of csbooklist_source_global){
            var blfound=false;
            for (let one_digest of digest_list_source_global){
                if (one_book[0]+'_digest'==one_digest[0]){
                    one_book[0]=one_book[0]+'_digest';
                    one_book[3]='digest'+one_digest[1];
                    list_t.push(one_book);
                    blfound=true;
                    break;
                }
            }
            if (!blfound){
                without_digest_book_list_global.push(one_book);
            }
        }
        csbooklist_source_global=[].concat(list_t);    
    }
    
    csbooklist_source_global.sort(function(a,b){return zh_sort_b(a,b,false,1);});
    
    if (is_digest===false){
        local_storage_today_b('booklist_statistics',40,csbooklist_source_global.length,'/');
        var list_t=local_storage_get_b('booklist_statistics',-1,true);
        if (list_t.length>30){
            local_storage_squash_b('booklist_statistics',list_t,8,0,0.5);
        }
    }
}

function book_type_b(arow,includes_character=false){
    if (includes_character===false){
        return arow[4];
    } else {
        return arow[4].includes(includes_character);
    }
}

function books_global_value_init_b(){        
    //以下变量为全局变量，不加 var 或 let - 保留注释
    csbookno_global=-1;
    csbookno2_global=-1;
    // csbooklist_sub_global 是 csbooklist_source_global 的子集 - 保留注释
    csbooklist_sub_global=[];
    //以下变量名若要更改，需要更改 jsdoc 目录下的所有 js 文件及 menu 子目录下的所有 js 文件 - 保留注释
    filelist=[];
    filelist2=[];
    menulist=[];
    digest_global=[];
}

function load_current_book_b(load_digest_file=false,do_write=true,add_date=true,init_var=false){
    if (init_var){
        books_global_value_init_b();
    }
    
    var blhref=location.href;
    if (blhref.includes('/klwebphp/')){
        blhref=blhref.split('/klwebphp/')[0]+'/klwebphp/data/';
    } else if (blhref.includes('/klwebphp_backup/')){
        blhref=blhref.split('/klwebphp_backup/')[0]+'/klwebphp_backup/data/';
    } else {
        blhref=new URL('../',blhref)['href']+'jsdata/';
    }
    
    var today=(add_date?file_date_parameter_b():'');
    
    var file_list=[];
    var book_list_js=blhref+'booklist_current_data.js'; //csbooklist_source_global - 保留注释
    file_list.push(['js',book_list_js,'']);
    
    var digest_js='';
    if (load_digest_file){
        digest_js=blhref+'digest_list_data.js'; //digest_list_source_global - 保留注释
        file_list.push(['js',digest_js,'']);
    }
    
    if (do_write){
        if (is_render_page_b()){
            csbooklist_source_global=[];    //由于异步操作麻烦，不从 bigfile 载入 - 保留注释
            if (load_digest_file){
                digest_list_source_global=[];
            }
        } else {
            write_js_css_b(file_list);
        }
    }
    console.log(file_list); //此行保留 - 保留注释
    return [book_list_js+today,(digest_js==''?'':digest_js+today),file_list];
} 
