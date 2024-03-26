function insert_new_lines_klr_b(csinterval,csinsert_str,csid='textarea_rows_content'){
    var otextarea=document.getElementById(csid);
	var list_t = otextarea.value.split('\n');
	var bljg=[];
	var blno=1;
	for (let blxl=0;blxl<list_t.length;blxl++){
		if (blxl%csinterval==0){
			bljg.push(csinsert_str.replace(new RegExp('NO','g'),blno));
			blno=blno+1;
		}
		bljg.push(list_t[blxl]);
	}	 
	console.log(csinterval);
	console.log(csinsert_str);
    otextarea.value=bljg.join('\n');
}

function reverse_klr_b(csid='textarea_rows_content'){
	var otextarea = document.getElementById(csid);
	var list_t = otextarea.value.split('\n').reverse();
	otextarea.value = list_t.join('\n');
}

function line_count_klr_b(content_id='',status_id=''){
    var ocontent = document.getElementById(content_id);
    var ostatus=document.getElementById(status_id);
    ostatus.value=ocontent.value.trim().split('\n').length;
}

function sort_rows_klr_b(csid='textarea_rows_content',cstype=''){
	var otextarea = document.getElementById(csid);
    var list_t = otextarea.value.split('\n');
    
    switch (cstype){
        case '':
        case 'asc':
        	list_t.sort();
            break;
        case 'desc':
            list_t.sort();
            list_t.reverse();
            break;
        case 'random':
            var bltotal_t=Math.floor((Math.random()*5)+1);
            for (let blxl=0;blxl<bltotal_t;blxl++){
                list_t.sort(randomsort_b);
            }        
            break;    
        case 'asc_num':
            list_t.sort(function (a,b){return parseFloat(a)>parseFloat(b) ? 1 : -1;});
            break;
        case 'desc_num':
            list_t.sort(function (a,b){return parseFloat(a)<parseFloat(b) ? 1 : -1;});
            break;      
        case 'length':
            list_t.sort(function (a,b){return a.length>b.length ? 1 : -1;});        
            break;
    }

	var result_t=[];
	for (let item of list_t){
		if (item==''){continue;}
		result_t.push(item);
	}
	otextarea.value = result_t.join('\n');
}

function basen_klr_b(blstr){
    blstr =('\n'+blstr).replace(new RegExp("\n[ \n\t　]+","gm"),"\n");
	if (blstr.indexOf("\n")==0){
        blstr=blstr.substring(1,);
    }
	return blstr;
}

//移除段落
function blank_rows_remove_klr_b(csid='textarea_rows_content'){
	var otextarea = document.getElementById(csid);
	var blstr = otextarea.value;
	otextarea.value = basen_klr_b(blstr);
}

function chinese_sort_klr_b(csdesc=false,csid='textarea_rows_content'){
	var otextarea = document.getElementById(csid);
	var list_t = otextarea.value.trimRight().split('\n');
    list_t.sort(function (a,b){return zh_sort_b(a,b,csdesc);});
	otextarea.value = list_t.join('\n');
}

function lines_unique_klr_b(csid='textarea_rows_content'){
	var otextarea = document.getElementById(csid);
	var list_t = otextarea.value.split('\n');
    list_t=array_unique_b(list_t);
	otextarea.value = list_t.join('\n');
}

function characters_unique_klr_b(csid='textarea_rows_content'){
	var otextarea = document.getElementById(csid);
	var list_t = otextarea.value.split('');
    list_t=array_unique_b(list_t);
    list_t.sort(function (a,b){return zh_sort_b(a,b);});
	otextarea.value = list_t.join(' ');
}

//添加段落
function blank_rows_add_klr_b(csid_or_csstr='textarea_rows_content',cstype='textarea'){
    if (cstype=='textarea'){
	    var otextarea = document.getElementById(csid_or_csstr);
    	var blstr = otextarea.value;
    } else {
        var blstr=csid_or_csstr;
    }
	blstr=basen_klr_b(blstr);
	blstr = blstr.replace(new RegExp('\n','gm'),'\n\n');
    if (cstype=='textarea'){
        otextarea.value = blstr;
    }
    return blstr;
}

function blank_rows_wiki_type_klr_b(csid_or_csstr='textarea_rows_content',cstype='textarea'){
    //* #开头的不添加空行，其他的添加空行 - 保留注释
    var blstr='\n'+blank_rows_add_klr_b(csid_or_csstr,cstype)+'\n';
    
    var blxl=0;
    while (true){
        if (blstr.match(/\n([#\*].*?)\n\n([#\*].*?)\n/)==null || blxl>10){break;}
        blstr = blstr.replace(/\n([#\*].*?)\n\n([#\*].*?)\n/mg,'\n$1\n$2\n');
        blxl=blxl+1;
    }
    
    blstr=blstr.trim();
    if (cstype=='textarea'){
	    var otextarea = document.getElementById(csid_or_csstr);
        otextarea.value = blstr;
    }
    return blstr;
}

//插入行首行尾
function add_line_str_klr_b(lstr='',rstr='',csid='textarea_rows_content'){   
	var otextarea = document.getElementById(csid);
	var blcontent = otextarea.value;
	
	if (lstr!==''){
		blcontent = blcontent.replace(new RegExp('\n','gm'),'\n'+lstr);
		if (blcontent.indexOf('\n')!==0){
            blcontent=lstr+blcontent;
        }
	}
	
    if (rstr!==''){
		blcontent = blcontent.replace(new RegExp('\n','gm'),rstr+'\n');
		if (blcontent.lastIndexOf('\n')!==(blcontent.length-1)){
            blcontent=blcontent+rstr;
        }
	}
	otextarea.value = blcontent;
}

function add_line_no_klr_b(blop=1,blno1=1,blno2=1,csid='textarea_rows_content'){
	var otextarea = document.getElementById(csid);
	var list_t = otextarea.value.split('\n');
	var bljg='';
	var bln;
	for (let blx=0;blx<list_t.length;blx++){
        var item=list_t[blx];
		bln=(parseInt(blno1)+parseInt(blx)).toString();
		var nlen=bln.length;
		if (nlen<blno2){
			for (let bly = 0; bly<blno2-nlen; bly++){
				bln= '0'+bln;  
			}
		}
		if (blop==1){
            bljg=bljg+bln+item+'\n';
        } else {
            bljg=bljg+item+bln+'\n';
        }
	}
	if (bljg.lastIndexOf('\n')==bljg.length-1){
        bljg=bljg.substring(0,bljg.length-1);
    }
	otextarea.value = bljg;
}

function add_ahref_klr_b(csid,encode=false){
	var otextarea = document.getElementById(csid);
    var blstr=otextarea.value;
    if (encode){
        var list_t=blstr.split('\n')
        for (let blxl=0;blxl<list_t.length;blxl++){
            list_t[blxl]='<a href="'+encodeURI(list_t[blxl])+'" target=_blank>'+list_t[blxl]+'</a>';
        }
        blstr=list_t.join('\n');
    } else {
        blstr=blstr.replace(/\b(https?:\/\/[^\s]+)/g,'<a href="$1" target=_blank>$1</a>');
    }
	otextarea.value = blstr;
	add_to_html_klr_b();
}

function add_to_html_klr_b(csid='textarea_rows_content',querystr='div#divhtml'){
	var otextarea = document.getElementById(csid);
	var odom = document.querySelector(querystr);
	if (odom){
        odom.innerHTML=otextarea.value;
    }
}

function get_selected_lines_klr_b(cstype,csin,cskey,csid='textarea_rows_content'){
	if (cskey==''){return;}
	var otextarea = document.getElementById(csid);
	var blstr = otextarea.value.split('\n');
	var bljg=[];
	for (let item of blstr){
		var regexp  = new RegExp(cskey);
		if ((cstype+csin=='selin' || cstype+csin=='delout') && regexp.test(item)){
            bljg.push(item);
        }
		if ((cstype+csin=='selout' || cstype+csin=='delin') && regexp.test(item)==false){
            bljg.push(item);
        }
	}
	otextarea.value = bljg.join('\n');
}

function lines_trim_klr_b(cstype='',csid='textarea_rows_content'){
	var otextarea = document.getElementById(csid);
	var list_t = otextarea.value.split('\n');
	var bljg='';
	for (let item of list_t){
		switch(cstype){
			case 'l':
				bljg=bljg+item.trimLeft()+'\n';
				break;
			case 'r':
				bljg=bljg+item.trimRight()+'\n';
				break;
			default:
				bljg=bljg+item.trim()+'\n';
				break;
		}
	}
	if (bljg.lastIndexOf('\n')==bljg.length-1){
        bljg=bljg.substring(0,bljg.length-1);
    }
	otextarea.value = bljg;
}

function lines_del_chars_klr_b(cstype,cscount,csid='textarea_rows_content'){
	var otextarea = document.getElementById(csid);
	var blstr = otextarea.value.split('\n');
	var bljg='';
	for (let item of blstr){
		if (cstype=='begin'){
            bljg=bljg+item.substring(Math.min(item.length,cscount),item.length)+'\n';
        } else {
            bljg=bljg+item.substring(0,Math.max(0,item.length-cscount))+'\n';
        }
	}
	if (bljg.lastIndexOf('\n')==bljg.length-1){
        bljg=bljg.substring(0,bljg.length-1);
    }
	otextarea.value = bljg;
}

function replace_strs_klr_b(csrep1,csrep2,textarea_id='textarea_rows_content',status_id='textarea_status'){
    //csrep1 被替换
    //csrep2 替换为，当 csrep1 为数组时，csrep2无作用
	if (csrep1==''){return;}

	var otextarea = document.getElementById(textarea_id);
	var blstr = otextarea.value;
    var blcount=0;
    if (Array.isArray(csrep1)){
        //形如：[["被替换","替换为"], ["被替换","替换为"]];
        for (let item of csrep1){
            if (item[0]==''){continue;}
            blcount=blcount+(blstr.match(new RegExp(item[0],'gm')) || []).length;
            blstr = blstr.replace(new RegExp(item[0],'gm'),item[1]);
        }
    } else {
        blcount=blcount+(blstr.match(new RegExp(csrep1,'gm')) || []).length;    
	    blstr = blstr.replace(new RegExp(csrep1,'gm'),csrep2);
    }
	otextarea.value = blstr;
    
    var ostatus=document.getElementById(status_id);
    if (ostatus){
        ostatus.value='共发现 '+blcount+' 处\n'+ostatus.value;
    }
    return [otextarea,blstr];
}

function hash_filename2wiki_table_klr_b(csid,filename_hash=false){
    var otextarea = document.getElementById(csid);
    var result_t=[];
    var list_t=otextarea.value.split('\n');
    for (let item of list_t){
        item=item.trim();
        if (filename_hash){
            var blat=item.lastIndexOf(' ');        
        } else {
            var blat=item.indexOf(' ');
        }
        if (blat==-1){continue;}
        if (filename_hash){        
            var blfile=file_path_name_b(item.substring(0,blat).trim())[3];
            var blhash=item.substring(blat+1,).trim();           
        } else {
            var blhash=item.substring(0,blat).trim();
            var blfile=file_path_name_b(item.substring(blat+1,).trim())[3];     
        }
        if (blfile==''){continue;}
        result_t.push('|-\n| '+blfile+' || '+blhash);
    }
    otextarea.value=result_t.join('\n');
}

function html2wiki_klr_b(csid){
    var year_t=new Date().getFullYear();       
    var arr_t=[
    ['\n',''],
    ['<(div|p) [^<>]*?>','\n'],
    ['<br>','\n'],
    ['<br \/>','\n'],
    ['<(\/?div|\/?p)>','\n'],
    ['<h2>(.*?)<\/h2>',"==== $1 ===="],
    ['<li>(.*?)<\/li>',"\n$1\n"],
    ['<h2 [^<>]*>(.*?)<\/h2>',"==== $1 ===="],
    ['<h3>(.*?)<\/h3>',"'''$1'''"],
    ['<\/?strong>',"'''"],
    ['<\/?i>',"''"],
    ['<\/?b>',"'''"],
    ['<h3 [^<>]*>(.*?)<\/h3>',"'''$1'''"],
    ['&nbsp;',' '],
    ['&amp;','&'],
    ['<\/?em>',"''"],
    ['<blockquote>',"{{quote}}\n"],
    ['<\/blockquote>',"\n{{/quote}}\n"],
    ['<a href="([^"]*?)">(.*?)<\/a>',"[$1 $2]"],   //此行和以下3行顺序不可变 - 保留注释
    ['<a href="([^"]*?)" .*?>(.*?)<\/a>',"[$1 $2]"],        
    ['<a [^<>]* href="([^"]*?)">(.*?)<\/a>',"[$1 $2]"],
    ['<a [^<>]* href="([^"]*?)" .*?>(.*?)<\/a>',"[$1 $2]"],        
    ['<img src="http://[^"]+/wikiuploads/([^"]+)">',"{{wikiuploads}}$1"],   //对源自 wikiuploads 的图片优先处理 - 保留注释
    ['<img src="[^<>]*\/(.*?)">',"\n{{wikiuploads}}"+year_t+"/$1\n"],
    ['<img src="[^<>]*\/(.*?)" .*?>',"\n{{wikiuploads}}"+year_t+"/$1\n"],
    ['<img [^<>]* src="[^<>]*\/(.*?)">',"\n{{wikiuploads}}"+year_t+"/$1\n"],
    ['<img [^<>]* src="[^<>]*\/(.*?)" .*?>',"\n{{wikiuploads}}"+year_t+"/$1\n"],
    ];

    replace_strs_klr_b(arr_t,'',csid);
}

function wiki_photo_klr_b(csid){
    var otextarea = document.getElementById(csid);
    var list_t=otextarea.value.split('\n');
    var bljg='';
    for (let item of list_t){
        if (!item.includes('/')){
            bljg=bljg+item+'\n';
            continue;
        }
        var blat=item.indexOf('/wikiuploads/');
        if (blat>=0){
            var full_name=item.substring(blat+'/wikiuploads/'.length,);
            var path_fname='{{wikiuploads}}'+full_name;
            full_name=file_path_name_b(full_name)[3];
        } else {
            var year_t=new Date().getFullYear();             
            var full_name=item.substring(item.lastIndexOf('/'),);
            var path_fname='{{wikiuploads}}'+year_t+full_name;
        }
        var blext='';
        if (full_name.includes('.')){
            blext=full_name.substring(full_name.lastIndexOf('.'),).toLowerCase();
        }
        if (['.jpg','.png','.webp','.gif','.bmp','.jpeg'].includes(blext)){
            if (path_fname.match(/[^\x00-\xff]/)!==null){
                path_fname='<photo>'+path_fname+'</photo>';
            }
            bljg=bljg+path_fname+'\n';
        } else {
            if (full_name.substring(0,1)=='/'){
                full_name=full_name.substring(1,);
            }
            bljg=bljg+'['+path_fname+' '+full_name+']\n';
        }
    }
    otextarea.value=bljg;
}

function capitalize_first_letter_klr_b(csid,lower_art_prep=true){
    var otextarea=document.getElementById(csid);
    var list_t=otextarea.value.split('\n');
    for (let blx=0;blx<list_t.length;blx++){
        if (list_t[blx].match(/[a-z]/ig)==null){continue;}
        
        list_t[blx]=list_t[blx].split(' ');
        for (let bly=0;bly<list_t[blx].length;bly++){
            if (lower_art_prep && bly>0 && ['a','the','by','in','of','for','at','on','to','with'].includes(list_t[blx][bly].toLowerCase())){
                list_t[blx][bly]=list_t[blx][bly].toLowerCase();
                continue;
            }
            if (list_t[blx][bly].length>=1){
                list_t[blx][bly]=list_t[blx][bly].substring(0,1).toUpperCase()+list_t[blx][bly].substring(1,).toLowerCase();
            }
        }
        list_t[blx]=list_t[blx].join(' ');
    }
    otextarea.value=list_t.join('\n');
}

function common_string_from_lines_klr_b(csid,only_file_name=false,status_id=''){
    var otextarea=document.getElementById(csid);
    if (!otextarea){return;}
    
    var blstr=otextarea.value.trim();
    if (blstr==''){return;}
    
    var lines=blstr.split('\n');
    if (only_file_name){
        for (let blxl=0;blxl<lines.length;blxl++){
            var blat=lines[blxl].lastIndexOf('/');
            if (blat>=0){
                lines[blxl]=lines[blxl].substring(blat+1,);
            }
        }
        var words=new Set(lines.join(' ').split(' '));
    } else {
        var words=new Set(blstr.replace(/\n/g,' ').split(' '));
    }
    
    var common_list=[];
    for (let aword of words){
        var blfound=true;
        for (let aline of lines){
            if (!aline.includes(aword)){
                blfound=false;
                break;
            }
        }
        if (blfound){
            common_list.push(aword);
        }
    }
    
    common_list.sort();
    
    if (status_id!==''){
        var ostatus=document.getElementById(status_id);
        if (ostatus){
            ostatus.value='+'+common_list.join(' +')+'\n';
        }
    }
    return common_list;
}

function ltrim_rows_klr_b(csid){
    var otextarea=document.getElementById(csid);
    var list_t=otextarea.value.split('\n');
    for (let blxl=0;blxl<list_t.length;blxl++){
        list_t[blxl]=list_t[blxl].trimLeft();
    }
    otextarea.value=list_t.join('\n');
}

function strquick_klr_b(cstype='',csid='textarea_rows_content',status_id='textarea_status',start_no=1,no_len=1){
    var ostatus=document.getElementById(status_id);
    if (ostatus){
        ostatus.value=cstype + ' 处理前行数：' + document.getElementById(csid).value.split('\n').length;
    }
    
	switch (cstype){
        case 'number_sub':
            var otextarea = document.getElementById(csid);
			otextarea.value=otextarea.value.trim().replace(/(\d+)/g,'<sub>$1</sub>');
            break;            
        case 'blank_rows_remove':
            blank_rows_remove_klr_b(csid);
            break;
        case 'blank_rows_wiki_type':
            blank_rows_wiki_type_klr_b(csid);
            break;
        case 'lines2comma':
            var otextarea = document.getElementById(csid);
			otextarea.value=otextarea.value.trim().replace(/\n/mg,',');
            break;
        case 'ltrim_rows':
            ltrim_rows_klr_b(csid);
            break;
        case 'wiki_photo':
            wiki_photo_klr_b(csid);
            break;
        case 'unique_characters':
            characters_unique_klr_b(csid);
            break;
		case 'ed2k':
			add_line_str_klr_b('">');
			add_line_no_klr_b(1,start_no,no_len);
			add_line_str_klr_b('<ed2k name="','</ed2k>');
			break;
		case 'magnet':
			add_line_str_klr_b('">');
			add_line_no_klr_b(1,start_no,no_len);
			add_line_str_klr_b('<magnet name="','</magnet>');
			break;
		case 'ffmpeg_combine':
			add_line_str_klr_b("ffmpeg -i 'concat:","' -codec copy 0_combined_");
			add_line_no_klr_b(2,3,no_len);
			add_line_str_klr_b('','.ogg');
			break;            
		case 'replace_cn_quote':
            var arr_t=[
            ['‘([\x00-\xff])',"'$1"],
            ['([\x00-\xff])’',"$1'"],
            ['“([\x00-\xff])','"$1'],
            ['([\x00-\xff])”','$1"'],
            ];
            var otextarea = document.getElementById(csid);
			otextarea.value=english_punctuation_b(otextarea.value);
			break;
        case 'reverse':
            var otextarea = document.getElementById(csid);
            var list_t=otextarea.value.split('\n');
            list_t.reverse();
            otextarea.value=list_t.join('\n');
            break;
        case 'reverse_str':
            var otextarea = document.getElementById(csid);
            var list_t=otextarea.value.split('\n');
            for (let blxl=0;blxl<list_t.length;blxl++){
                list_t[blxl]=list_t[blxl].split('').reverse().join('');
            }            
            otextarea.value=list_t.join('\n');            
            break;
        case 'double2single':
            var otextarea = document.getElementById(csid);
            otextarea.value=character_double_2_single_b(otextarea.value);    
            break;
        case 'double2single_w':
            var otextarea = document.getElementById(csid);
            otextarea.value=character_double_2_single_b(otextarea.value,true);    
            break;
        case 'single2double':
            var otextarea = document.getElementById(csid);
            otextarea.value=character_single_2_double_b(otextarea.value);
            break;
        case 'js_multilines':
            var otextarea = document.getElementById(csid);
            var blstr=otextarea.value.replace(/`/g,"`+'`'+`");
            blstr=blstr.replace(/{/g,'\\{');
            blstr=blstr.replace(/}/g,'\\}');
            otextarea.value=blstr;       
            break;
		case 'blank8':
			var bldate=new Date();
			add_line_str_klr_b('        ');
			break;
		case 'rhash_ed2k':
			add_line_str_klr_b('rhash --printf="%l\\n" "','"');
			break;
        case 'links_html':
            links_and_text_klr_b();
            break;
		case 'ahref':
			add_ahref_klr_b(csid);
			break;
        case 'ahref_encode':
            add_ahref_klr_b(csid,true);
            break;
        case 'space2underline':
            var otextarea = document.getElementById(csid);
            otextarea.value = otextarea.value.replace(/ /g,'_')  
            break;
        case 'chinese_punctuation':
            var otextarea = document.getElementById(csid);
            otextarea.value = chinese_punctuation_b(otextarea.value);
            break;
        case 'jieba':
            var otextarea = document.getElementById(csid);
            var arr_t = count_words_b(otextarea.value,split_words_b(otextarea.value,true),2);
            var str_t=[];
            for (let item of arr_t){
                str_t.push(item[0]);
            }
            otextarea.value = str_t.join(' ')+'\n\n'+arr_t;
            break;
        case 'n_br':
            replace_strs_klr_b('\n','\n<br />',csid);
            break;
        case 'htm2wiki':
            html2wiki_klr_b(csid);

            if (ostatus){
                var otextarea = document.getElementById(csid);
                if (otextarea.value.includes('<')){
                    ostatus.value=ostatus.value+'\n发现<';
                }
                if (otextarea.value.includes("''''")){
                    ostatus.value=ostatus.value+"\n发现''''";
                }
            }
            break;
        case 'hash_filename2wiki_table':
            hash_filename2wiki_table_klr_b(csid);
            break;
        case 'filename_hash2wiki_table':
            hash_filename2wiki_table_klr_b(csid,true);
            break;
        case 'get_head_lines':
            slice_lines_klr_b(csid);
            break;
        case 'capitalize_first_letter':
            capitalize_first_letter_klr_b(csid);
            break;
		case 'movefiles':
			add_line_str_klr_b('mv "','"');
			break;
        case 'common_string_from_filenames':
            common_string_from_lines_klr_b(csid,true,status_id);
            break;
        case 'common_string_from_lines':
            common_string_from_lines_klr_b(csid,false,status_id);
            break;
		case 'js2href':
            var arr_t=[
            ['","','">'],
            ['^# ',''],
            ['^#',''],
            ['^\\["','<br /><a href='],
            ['"],','</a>'],
            ];
			replace_strs_klr_b(arr_t,'',csid);
			break;
		case 'js2wikihref':
            var arr_t=[
            ['^# ',''],
            ['^#',''],
            ['^\\["','['],
			['","',' '],
            ['", "',' '],
			['"],',']'],
            ];
            var otextarea,blstr;
			[otextarea,blstr]=replace_strs_klr_b(arr_t,'',csid);
            var list_t=blstr.split('\n');
            for (let blxl=0;blxl<list_t.length;blxl++){
                if (list_t[blxl].match(/^(.*?\s)(.*?[\[\]].*)\]$/)){
                    list_t[blxl]=list_t[blxl].replace(/^(.*?\s)(.*?[\[\]].*)\]$/mg,'$1<nowiki>$2</nowiki>]');
                }
            }
            otextarea.value=list_t.join('\n');
			break;     
        case 'wikihref2js':
            str2js_klr_b(csid,'wikihref');
            break;
        case 'href_title2js':
            str2js_klr_b(csid,'href_title');
            break;
        case 'title_href2js':
            str2js_klr_b(csid,'title_href');
            break;      
        case 'title_href2csv':
            str2csv_klr_b(csid,'title_href');
            break;
        case 'batchwww':
        case 'klwikititle':
        case 'collins':
        case 'bing_collins_oxford_klsearch_en':                
        case 'bing_oxford_klsearch_en':        
        case 'oxford_klsearch_en':
        case 'cambridge':
            batch_open_www_klr_b(csid,ostatus,cstype);
            break;
        case 'count':
            if (ostatus){
                var blstr=document.getElementById(csid).value;
                var blstr2=blstr.replace(/\s/g,'');
                ostatus.value='字数：' + blstr.length+', 去除空格后字数：'+blstr2.length+'\n'+ostatus.value;
            }
            break;
        case 'eword':
            var blstr=document.getElementById(csid).value;
            var blstr=(blstr.match(/<eword w="?(.*?)"?><\/eword>/g) || []).join('\n');
            blstr=blstr.replace(/<eword w="?/g,'');
            blstr=blstr.replace(/"?><\/eword>/g,'');
            document.getElementById(csid).value=blstr;
            break;
        case 'clear_copy_tab_title_url':
            clear_copy_tab_title_url_klr_b(csid);
            break;
	}
    if (ostatus){
        ostatus.value=ostatus.value + ' 处理后行数：' + document.getElementById(csid).value.split('\n').length;
    }
}

function clear_copy_tab_title_url_klr_b(csid){
    var otextarea=document.getElementById(csid);
    if (!otextarea){return;}
    var bljg=[];
    var list_t=otextarea.value.trim().split('\n');
    for (let item of list_t){
        if (item.substring(0,'["moz-extension://'.length)=='["moz-extension://' && item.slice(-1*'"undefined"],'.length,)=='"undefined"],'){
            continue;
        }
        if (item=='["about:blank","undefined"],'){continue;}
        if (item=='["'+document.location.href+'","'+document.title+'"],'){continue;}
        if (item.substring(0,10)=='["file:///'){continue;}
        if (item==''){continue;}
        if (item.trim().match(/^-+$/g)){continue;}
        bljg.push(item);
    }
    otextarea.value=bljg.join('\n');
}

function batch_open_www_klr_b(csid,ostatus,cstype=''){
    function sub_batch_open_www_klr_b_one_link(){
        if (blxl>=bllen){
            if (ostatus){
                ostatus.value='批量打开网址完成，已打开 '+blsites_count+' 个网址\n'+blstr.replace(/\n/mg,',')+'\n'+ostatus.value;
            }        
            return;
        }
        var item=list_t[blxl].trim();
        if (item.substring(0,4).toLowerCase()=='http'){
            window.open(item);
            blsites_count=blsites_count+1;
            if (ostatus){
                ostatus.value='打开：' + item+'\n'+ostatus.value;
            }
        }
        blxl=blxl+1;
        setTimeout(sub_batch_open_www_klr_b_one_link,1000);
    }
    //-----------------------
    var blstr=document.getElementById(csid).value.trim();
    if (blstr==''){return;}
    if (!confirm('是否批量打开'+cstype+'链接？')){return;}        
    var list_t=blstr.split('\n');
    
    switch (cstype){
        case 'klwikititle':
            for (let blno=0;blno<list_t.length;blno++){
                var atitle=list_t[blno].trim();
                atitle=atitle.split('</title>')[0];
                if (atitle.substring(0,7)=='<title>'){
                    atitle=atitle.substring(7,);
                }
                list_t[blno]=klwiki_link_b(atitle,false);
            }
            break;
        case 'bing_collins_oxford_klsearch_en':
        case 'bing_oxford_klsearch_en':
        case 'oxford_klsearch_en':
            var bing_links=[];
            var collins_links=[];
            var klsearch_links=[];
            var cambridge_links=[];
            for (let blno=0;blno<list_t.length;blno++){
                var aword=list_t[blno].trim();
                list_t[blno]=[aword,open_link_en_b('o',aword,false)];   //klbase_eng.js - 保留注释
                bing_links.push([aword,open_link_en_b('b',aword,false)]);
                collins_links.push([aword,open_link_en_b('c',aword,false)]);
                cambridge_links.push([aword,open_link_en_b('+',aword,false)]);
                klsearch_links.push([aword,open_link_en_b('k',aword,false)]);
            }
            list_t=list_t.concat(klsearch_links);
            if (cstype=='bing_oxford_klsearch_en' || cstype=='bing_collins_oxford_klsearch_en'){
                list_t=list_t.concat(bing_links);
            }
            if (cstype=='bing_collins_oxford_klsearch_en'){
                list_t=list_t.concat(collins_links);
                list_t=list_t.concat(cambridge_links);
            }
            
            list_t.sort();
            for (let blno=0;blno<list_t.length;blno++){
                list_t[blno]=list_t[blno][1];
            }
            break;
        case 'collins':
            for (let blno=0;blno<list_t.length;blno++){
                list_t[blno]=open_link_en_b('c',list_t[blno].trim(),false);
            }
            break;
        case 'cambridge':
            for (let blno=0;blno<list_t.length;blno++){
                list_t[blno]=open_link_en_b('+',list_t[blno].trim(),false);
            }
            break;        
    }
    
    var bllen=list_t.length;
    var blxl=0;
    var blsites_count=0;
    sub_batch_open_www_klr_b_one_link();
}

function str2csv_klr_b(csid,cstype){
    var otextarea = document.getElementById(csid);
    var list_t=[];
    var blstart=0;
    var blend=undefined;
    switch (cstype){
        case 'title_href':
            var temp_t=otextarea.value.trim().split('\n');
            for (let item of temp_t){
                var blat=item.indexOf(' http');
                if (blat>=0){
                    list_t.push('"#'+specialstr_j(item.slice(blat+1))+'","","'+item.substring(0,blat)+'",20,"分类名"');
                }
            }
            break;
    }
    otextarea.value=list_t.join('\n');
}

function js2_str_klr_b(csid){
    var otextarea = document.getElementById(csid);
    var blstr=otextarea.value.trim();
    blstr=blstr.replace(/^\["(.*?)","(.*?)"\],$/mg,'$1 $2');
    otextarea.value=blstr;
}

function str2js_klr_b(csid,cstype){
    var otextarea = document.getElementById(csid);
    var list_t=[];
    var blstart=0;
    var blend=undefined;    
    switch (cstype){
        case 'wikihref':
            list_t=otextarea.value.match(/\[.*\]/g) || [];     //返回包含形如元素：[xxxxxx]的数组 - 保留注释
            blstart=1;
            blend=-1;
            break;
        case 'href_title':
            list_t=otextarea.value.trim().split('\n');
            break;
        case 'title_href':
            var temp_t=otextarea.value.trim().split('\n');
            for (let item of temp_t){
                var blat=item.indexOf(' http');
                if (blat==-1){
                    list_t.push(item);  //此处相当于 href_title - 保留注释
                } else {
                    list_t.push(item.slice(blat+1)+' '+item.substring(0,blat));
                }
            }
            break;        
        case '[t](h)':
            var blstr=otextarea.value.trim();
            blstr=blstr.replace(/^\[(.*)\]\((.*)\)$/mg,'["$2","$1"],');
            otextarea.value=blstr;
            return;
    }
    
    for (let blxl=0;blxl<list_t.length;blxl++){
        list_t[blxl]=specialstr_j(list_t[blxl],true);
        list_t[blxl]='["'+list_t[blxl].slice(blstart,blend)+'"],';
        list_t[blxl]=list_t[blxl].replace(' ','","');
    }
    otextarea.value=list_t.join('\n');
}

function copy_lines_klr_b(cstimes,csid='textarea_rows_content'){
	var otextarea = document.getElementById(csid);
	var blstr = otextarea.value;
	otextarea.value = blstr + blstr.repeat(cstimes);
}

function html_to_image_klr_b(){
	html2canvas(document.getElementById('divhtml')).then(canvas => {
		document.body.appendChild(canvas)
	});
}

function links_and_text_klr_b(){
	var otextarea = document.getElementById('textarea_rows_content').value;
	var alist_t=otextarea.match(/<[aA] .*?<\/[aA]>/g) || [];
	var bljg=alist_t.join('<br />')
	var div_t=document.getElementById('divhtml');
	div_t.innerHTML=bljg;
    
	var alinks_t=div_t.getElementsByTagName('a');
	var ahref='';
	for (let item of alinks_t){
		var str_t=item.getAttribute('href');
		if (str_t){
			ahref=ahref+'<br />'+str_t;
		}
	}
	div_t.innerHTML=ahref+'<br />'+otextarea;
}

function rnd_str_klr_b(cstype='',cslines=0,csmin=0,csmax=0,csid='textarea_rows_content'){
    cslines=parseInt(cslines);
    csmin=parseInt(csmin);
    csmax=parseInt(csmax);
    var bljg=[];
    switch (cstype){
        case 'cn':
            for (let blxl=1;blxl<=cslines;blxl++){
                var blstr=random_chs_b(randint_b(csmin,csmax));
                bljg.push(blstr);
            }
            break;
        case 'en':
            for (let blxl=1;blxl<=cslines;blxl++){
                var blstr=randstr_b(randint_b(csmin,csmax),false);
                bljg.push(blstr);
            }
            break;
        default:
            for (let blxl=1;blxl<=cslines;blxl++){
                var bllen=randint_b(csmin,csmax);
                var blstr=randstr_b(bllen)+random_chs_b(bllen);
                var list_t=blstr.split('');
                list_t.sort(randomsort_b);
                blstr=list_t.join('');
                blstr=blstr.substring(0,bllen);
                bljg.push(blstr);
            }
            break;
    }
    document.getElementById(csid).value=bljg.join('\n');
}

function slice_lines_klr_b(csid,break_line=[]){
    var otextarea=document.getElementById(csid);
    if (!otextarea){return;}
    
    var blvalue=otextarea.value.trim().split('\n');
    if (blvalue.length==1){return;}

    var blat=blvalue.length;
    if (break_line.length>0){
        for (let blxl=0;blxl<blvalue.length;blxl++){
            var do_break=false;
            for (let item of break_line){
                if (blvalue[blxl]==item){
                    blat=Math.min(blat,blxl);
                    do_break=true;
                    break;
                }
            }
            if (do_break){break;}
        }
    }
    
    var blno=(prompt('输入截取行数',blat) || '').trim();
    if (blno==''){return;}
    blno=parseInt(blno);
    if (isNaN(blno)){return;}
    if (blno<=0){return;}
    otextarea.value=blvalue.slice(0,blno).join('\n');
}

function en_transform_klr_b(old_value,csno){
    csno=parseInt(csno);
    var new_value=letters52_style_transform_b(old_value,csno);
    
    var restore_str=letters52_style_transform_b(new_value,-1);
    
    var len_old=old_value.length;
    var len_new=new_value.length;
    var is_ok=(restore_str==old_value);

    var bljg='-----\n'+'length: '+len_old+' - '+len_new;
    if (csno!==-1){
        bljg=bljg+' - '+(is_ok?'一致':'不一致');
    }
    
    return [new_value,bljg,len_old,len_new,is_ok];
}

function invisible_klr_b(old_str,is_restrict,cstype=''){
    var new_str=invisible_character_add_or_remove_b(old_str,cstype,is_restrict);
    var restore_str=invisible_character_add_or_remove_b(new_str,'remove',is_restrict);

    var len_old=old_str.length;
    var len_new=new_str.length;
    var is_ok=(restore_str==old_str);
    
    var bljg='-----\nlength: '+len_old+' - '+len_new;
    if (! ['remove','test'].includes(cstype)){
        bljg=bljg+' - '+(is_ok?'一致':'不一致')+'\n注：搜索时是可以在textarea中搜索到的';
    }
    return [new_str,bljg,len_old,len_new,is_ok];
}

function encrypt_content_quick_transform_klr_b(csold,do_ask=true){
    var http_list=csold.match(/\bhttps?:\/\/[^\s]+/g) || [];
    http_list.sort(function (a,b){return a.length<b.length ? 1 : -1;});  //最长的链接居前，避免有被包含关系的链接被先替换 - 保留注释
    
    result_t=invisible_klr_b(csold,true,'cn_phrase');
    if (result_t[4]==false){
        if (do_ask && confirm('发现不一致，是否转换？')===false){
            return false;
        }
    }    

    csold=result_t[0];
    var result_t=en_transform_klr_b(csold,4);
    if (result_t[4]==false){
        if (do_ask && confirm('发现不一致，是否转换？')===false){
            return false;
        }
    }

    var not_found=[];
    for (let item of http_list){
        var new_http=en_transform_klr_b(invisible_klr_b(item,true,'cn_phrase')[0],4)[0];
        if (!result_t[0].includes(new_http)){
            not_found.push(item);
        }
        result_t[0]=result_t[0].replace(new_http,item);
    }

    if (not_found.length>0){
        alert('未发现以下链接：\n'+not_found.slice(0,10).join('\n')+(not_found.length>10?'\n...':''));
    }
    if (do_ask && confirm('是否转换？')===false){
        return false;
    }
    
    return result_t[0];
}

function klarticle_imgsize_klr_b(is_simple=false){
    if (is_simple){
        var odom=document.getElementById('divhtml');
    } else {
        var odom=document.body;        
    }
    var rect=odom.getBoundingClientRect();
    var blwidth=Math.round(rect.width*0.9);
    var oimgs=odom.querySelectorAll('img');
    for (let item of oimgs){
        item.style.maxWidth=blwidth+'px';
    }
}

function klarticle_funs_klr_b(is_simple){
    var simple=['klarticle_init_klr_b','klarticle_imgsize_klr_b','ismobile_b','top_bottom_arrow_b','top_bottom_menu_b','popup_show_hide_b','root_font_size_change_b','local_storage_get_b','css_root_size_b','is_local_b','is_file_type_b'];
    var additional=['de_interval_str_b','odd_str_b','de_double_str_b'];
    if (is_simple){
        return fun_2_string_b(simple);
    } else {
        return fun_2_string_b(simple.concat(additional));    
    }
}

function klarticle_init_klr_b(is_simple=false){
    //klarticle 系列函数 - 保留注释
    css_root_size_b('14.5','14.5');
    if (ismobile_b()){
        document.body.style.fontSize='1rem';
        var div_margin='0.2';
    } else {
        document.body.style.fontSize='1.2rem';    
        document.body.style.maxWidth='900px';
        var div_margin='0.5';
    }
    if (is_simple){
        klarticle_imgsize_klr_b();
        top_bottom_arrow_b('div_top_bottom','',false,(ismobile_b()?'1.5rem':'1.6rem'),false,false,0,[10,true],true);
        return;
    }
    //-----------------------
    if (title_global!==''){
        document.title='📝 '+de_double_str_b(title_global);
    }
    if (Array.isArray(content_global)){
        content_global=content_global.join('\n');
    }
    if (content_global==''){return;}
    var blstr=de_double_str_b(content_global);
    var odiv=document.getElementById('divhtml');
    odiv.style.cssText='margin:'+div_margin+'rem '+div_margin+'rem 2rem '+div_margin+'rem;';
    odiv.innerHTML=blstr;
    var oimgs=odiv.querySelectorAll('img');
    for (let blxl=0;blxl<oimgs.length;blxl++){
        if (blxl>=images_global.length){break;}
        oimgs[blxl].setAttribute('src',images_global[blxl]);
    }
    klarticle_imgsize_klr_b();
    title_global='';
    content_global=[];
    images_global=[];
    top_bottom_arrow_b('div_top_bottom','',false,(ismobile_b()?'1.5rem':'1.6rem'),false,false,0,[10,true],true);
}
    
function en_double_2_array_klr_b(cscontent,do_export=false,img_src_list=[],convert_emoji=true){
    for (let blxl=0;blxl<img_src_list.length;blxl++){
        img_src_list[blxl]='"'+specialstr_j(img_src_list[blxl])+'",';
    }
    
    if (convert_emoji){
        cscontent=emoji_2_num_b(cscontent); //依赖 klbase_en_de_str.js - 保留注释
    }
    var list_t=en_double_str_b(cscontent,true);
    if (do_export){
        var bltitle=prompt('输入标题：');
        if (bltitle==null){return;}
        var html_top=standalone_html_head_klr_b('Article')+`
<body>
<div id="divhtml"></div>
<script>
`.trim()+'\n'+"var title_global='"+specialstr_j(en_double_str_b(bltitle))+"';\nvar content_global=[\n"+list_t.join('\n')+'\n];\nvar images_global=[\n'+img_src_list.join('\n')+'\n];\n</script>\n<script>\n';
        var b_fn=klarticle_funs_klr_b(false)+'\n\n';
        var html_tail=`
//-----------------------
klarticle_init_klr_b();
</script>
</body>
</html>
`.trim()+'\n';
        var result_t=html_top+b_fn+html_tail;
        string_2_txt_file_b(result_t,bltitle+'.htm','htm');
        return result_t;
    } else {
        return list_t.join('\n');
    }
}

function standalone_html_head_klr_b(cstitle){
    return `<!DOCTYPE html>
<html>
<head>
<title>`+cstitle+`</title>
<meta charset="UTF-8" />
<style>
#section_top_bottom_menu p {line-height:150%;font-size:0.9rem;}
#section_top_bottom_menu p span {cursor:pointer;}
a {word-break:break-all;word-wrap:break-word;}
</style>
<meta content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0' name='viewport' />
</head>`;
}

function important_line_js_array_klr_b(textarea_id){
    var otextarea=document.getElementById(textarea_id);
    var blstr=otextarea.value.trim();
    if (blstr==''){return;}
    
    var list_t=blstr.split('\n');
    var important_str='💎"],';
    var bllen=important_str.length*-1;
    for (let blxl=0;blxl<list_t.length;blxl++){
        var item=list_t[blxl];
        if (item.slice(-3,)!=='"],'){continue;}
        if (item.slice(bllen,)==important_str){
            list_t[blxl]=item.slice(0,bllen)+'"],';
        } else {
            list_t[blxl]=item.slice(0,item.length-3)+important_str;
        }
    }
    otextarea.value=list_t.join('\n');
}

function buttons_txt_klr_b(textarea_id,clear_copy_tab_title_url=false){
    var buttons='';
    buttons=buttons+'<span class="aclick" onclick="slice_lines_temp_txt_klr_b(\''+textarea_id+'\');">head</span> ';   
    buttons=buttons+'<span class="aclick" onclick="important_line_js_array_klr_b(\''+textarea_id+'\');">💎</span> ';
    buttons=buttons+'<span class="aclick" onclick="str2js_klr_b(\''+textarea_id+'\',\'title_href\');">JS</span> ';
    buttons=buttons+'<span class="aclick" onclick="str2js_klr_b(\''+textarea_id+'\',\'[t](h)\');">[t](h)</span> ';
    if (clear_copy_tab_title_url){
        buttons=buttons+'<span class="aclick" onclick="clear_copy_tab_title_url_klr_b(\''+textarea_id+'\');">🪥</span> ';   
    }
    return buttons;
}

function slice_lines_temp_txt_klr_b(textarea_id){
    slice_lines_klr_b(textarea_id,['["about:blank","undefined"],']);
}

function sort_menu_klr_b(textarea_id,str_t){
    var klmenu_sort=[];
    
    var group_list=[
    ['升序','sort_rows_klr_b(\''+textarea_id+'\',\'\');',true],
    ['倒序','sort_rows_klr_b(\''+textarea_id+'\',\'desc\');',true],
    ];    
    klmenu_sort.push(menu_container_b(str_t,group_list,''));    //依赖 klbase_css.js - 保留注释

    var group_list=[
    ['升序','sort_rows_klr_b(\''+textarea_id+'\',\'asc_num\');',true],
    ['倒序','sort_rows_klr_b(\''+textarea_id+'\',\'desc_num\');',true],
    ];    
    klmenu_sort.push(menu_container_b(str_t,group_list,'数字：'));
    
    klmenu_sort=klmenu_sort.concat([
    '<span class="span_menu" onclick="'+str_t+'reverse_klr_b(\''+textarea_id+'\');">倒转</span>',
    '<span class="span_menu" onclick="'+str_t+'chinese_sort_klr_b(false,\''+textarea_id+'\');">汉字升序</span>',
    '<span class="span_menu" onclick="'+str_t+'lines_unique_klr_b(\''+textarea_id+'\');">unique</span>',
    '<span class="span_menu" onclick="'+str_t+'sort_rows_klr_b(\''+textarea_id+'\',\'length\');">长度排序</span>',    
    '<span class="span_menu" onclick="'+str_t+'sort_rows_klr_b(\''+textarea_id+'\',\'random\');">随机排序</span>',
    ]);    
    return klmenu_sort;
}
