function mobile_style_kltxt_b(){
	var mobile_t='\n<style>\n';
	mobile_t=mobile_t+'ul,ol,li{font-size:1.1rem;line-height:'+line_height_global+'%;}\n';
    mobile_t=mobile_t+'li{margin-bottom:1.5rem;}\n';
    mobile_t=mobile_t+'ul,ol{padding:0;margin-left:0rem;list-style-position: inside;}\n';    
	mobile_t=mobile_t+'#divhtml,#div_cn_words {margin:0 1rem;}\n';
	mobile_t=mobile_t+'#div_top_bottom{position:fixed; bottom:2%; right:1%; z-index:9999; padding:0; margin:0;opacity:0.7;}\n';
    mobile_t=mobile_t+'#divhtml p {font-size:1.1rem;margin-bottom:1rem;line-height:'+line_height_global+'%;}\n';
    mobile_t=mobile_t+'img {max-width:100%;}\n';
	mobile_t=mobile_t+'</style>\n';

	var pc_t='\n<style>\n';
	pc_t=pc_t+'ul,ol,li{font-size:1.1rem;line-height:'+line_height_global+'%;padding:0px;}\n';
    pc_t=pc_t+'li{margin-bottom:0.5rem;}\n';
	pc_t=pc_t+'#divhtml,#div_cn_words {font-family:Noto Sans;margin-left:10%; margin-right:10%;max-width:'+Math.max(700,parseInt(document.body.clientWidth*0.5))+'px;}\n'; //margin-left:'+(parseInt(document.body.clientWidth)*0.5)/2+'px; - 保留注释
	pc_t=pc_t+'#div_top_bottom{position:fixed; bottom:2%; right:1%; z-index:9999; padding:0; margin:0;opacity:0.7;}\n';
    pc_t=pc_t+'#divhtml p {font-size:1.1rem;margin-bottom:1rem;line-height:'+line_height_global+'%;}\n';
    pc_t=pc_t+'img {max-width:500px;}\n';
	pc_t=pc_t+'</style>\n';
    
	mobile_b(mobile_t, pc_t);
}

function possible_menu_kltxt_b(){
    var list_t=[];
    for (let blxl=0;blxl<filelist.length;blxl++){
        var item=filelist[blxl];
        if (item.length>50){continue;}
        list_t.push([item,blxl]);
    }
    list_t.sort();
    var blstr='';
    var blno=0;
    var double_t=[];
    var bltimes=1;
    for (let blxl=0;blxl<list_t.length;blxl++){
        var item=list_t[blxl];
        if (item[0]!==blstr){
            if (blxl>0 && bltimes==2 && blstr!==''){
                double_t.push([blno,blstr]);
            }
            blstr=item[0];
            blno=item[1];
            bltimes=1;
        }
        else {
            bltimes=bltimes+1;
            blno=Math.max(blno,item[1]);
        }
    }
    double_t.sort(function (a,b){return a[0]>b[0];});
    var bljg='';
    for (let item of double_t){
        bljg=bljg+'<li>'+item[1]+'<span style="cursor:pointer;color:'+scheme_global['memo']+';font-size:0.9rem;" onclick="javascript:getlines_kltxt_b('+item[0]+');">('+(item[0]+1)+')</span></li>';
    }
    document.getElementById('divhtml').innerHTML='<ol>'+bljg+'</ol>';
}

function change_colors_kltxt_b(csstr=''){
    if (csstr==''){
        csstr=local_storage_get_b('theme_txtlistsearch');
    }
    change_colors_b(csstr);
    localStorage.setItem('theme_txtlistsearch',csstr);
    var ospan=document.querySelectorAll('span[class*="span_page_number"]');
    for (let item of ospan){
        var ofont=item.querySelector('font[color="'+scheme_global['a-hover']+'"]');
        if (ofont){
            item.click();
            document.location.href="#top";
            break;
        }
    }
}

function statistics_kltxt_b(){
    var list_t=local_storage_get_b('booklist_statistics',-1,true);
    var bljg='';
    var flot_data=[];

    for (let item of list_t){
        var day_count=item.split('/');
        if (day_count.length!==2){continue;}
        bljg=bljg+'<tr><td style="padding:0.2rem;" nowrap>'+day_count[0]+'</td>';
        bljg=bljg+'<td align=right style="padding:0.2rem;" nowrap>'+day_count[1]+'</td></tr>';        
        flot_data.push([new Date(day_count[0]),parseInt(day_count[1])]);
    }
    if (bljg!==''){
        bljg='<table border=1 cellspacing=0 cellpadding=0 style="margin:1rem 0rem;"><tr><th  style="padding:0.2rem;" nowrap>日期</th><th style="padding:0.2rem;" nowrap>书籍数</th></tr>'+bljg+'</table>';
    }
    
    bljg='<table border=0 width=100% height=100%><tr><td valign=top width=1 height=100%>'+bljg+'</td>';
    bljg=bljg+'<td valign=top width=70%><div style="width:100%;height:300px;" id="div_flot_line"></div></td></tr>';
    bljg=bljg+'</table>';

    document.getElementById("divhtml").innerHTML=bljg;
    flot_data.sort(function (a,b){return a[0]>b[0];});
    flot_lines_k([['书籍数'].concat(flot_data)],'div_flot_line','nw',true,'','d','本',0,[1, 'day'],5);
}

function new_words_kltxt_b(){
    get_new_words_arr_enbook(2,document.getElementById('divhtml').innerText,document.querySelectorAll('.txt_content'),true);
}

function search_or_reader_kltxt_b(cstype){
    var blno=document.getElementById('input_lineno').value;
    window.open(cstype+'.htm?'+csbookname_global+(cstype=='reader_card'?'':'&line='+blno));
}

function tw_kltxt_b(){
    var tws=new Set();
    for (let item of filelist){
        var list_t=item.split('');
        for (let one_word of list_t){
            tws.add(one_word);
        }
    }
    var result_t=[];
    for (let item of tws){
        if (item.trim()=='' || item==','){continue;}
        if (zh_tw_global.includes(item+'>')){
            result_t.push(item);
        }
    }
    document.getElementById('divhtml').innerHTML='<p>'+result_t.join(', ')+'</p><p>'+result_t.length+'</p>';
}

function digest_statistics_kltxt_b(){
    var t0 = performance.now();
	var start_lineno;
	var end_lineno;
    var blmax;
    [start_lineno,end_lineno,blmax]=start_end_lineno_kltxt_b();
    var all_empty=false;
    var result_t=[];
    var digest_t=[].concat(digest_global);
    
    for (let blxl=start_lineno;blxl<end_lineno;blxl++){     
        if (filelist[blxl]==''){continue;}
        if (all_empty){
            result_t.push('<span style="color:grey;margin-left:0.1rem;" title="'+(blxl+1)+'">○</span>');
            continue;
        }
        
        var blfound='<span style="color:grey;margin-left:0.1rem;" title="'+(blxl+1)+'">○</span>';
        all_empty=true;
        for (let blno=0;blno<digest_t.length;blno++){
            var one_digest=digest_t[blno];
            if (one_digest==''){continue;}
            if (one_digest.substring(0,1)=='#'){
                digest_t[blno]='';
                continue;
            }
            all_empty=false;
            if (filelist[blxl].includes(one_digest)){
                digest_t[blno]='';
                blfound='<span style="color:green;margin-left:0.1rem;" title="'+(blxl+1)+'">●</span>';
                break;  
            }
        }
        result_t.push(blfound);
    }
    document.getElementById('divhtml').innerHTML='<p style="line-height:120%;font-size:0.8rem;word-break:break-all;word-wrap:break-word;">'+result_t.join('\n')+'</p>';
    console.log('digest_statistics_kltxt_b() 费时：'+(performance.now() - t0) + " milliseconds");
}

function reading_mode_kltxt_b(){
    digest_temp_add_kltxt_b(true);   
    document.getElementById("div_show_hide").style.display='none';
    location.href='#content';
}

function txtmenus_kltxt_b(cstype=''){
    var str_t=klmenu_hide_b('');
    if (cstype=='reader'){
        var menu_general=[
        '<span class="span_menu" onclick="javascript:'+str_t+'search_or_reader_kltxt_b(\'txtlistsearch\');">Search Page</span>',       
        ];
    }
    else {
        var menu_general=[
        '<span class="span_menu" onclick="javascript:'+str_t+'search_or_reader_kltxt_b(\'reader\');">Reader</span>',
        ];    
    }
    menu_general.push('<span class="span_menu" onclick="javascript:'+str_t+'search_or_reader_kltxt_b(\'reader_card\');">Card</span>');
    menu_general.push('<span class="span_menu" onclick="javascript:'+str_t+'bookmarks_get_kltxt_b(false,false);">读取最新书签</span>');
    menu_general.push('<span class="span_menu" onclick="javascript:'+str_t+'bookmarks_set_kltxt_b();">添加书签</span>');
    menu_general.push('<span class="span_menu" onclick="javascript:'+str_t+'getlines_kltxt_b();">返回阅读页面</span>');
    menu_general.push('<span class="span_menu" onclick="javascript:'+str_t+'new_words_kltxt_b();">显示生词</span>');
    menu_general.push('<span class="span_menu" onclick="javascript:'+str_t+'find_cn_words_kltxt_b();">显示汉字生字</span>');

    var menu_dir=[
        '<span class="span_menu" onclick="javascript:'+str_t+'findmenu_kltxt_b(-1,-1,a_raw_number_kltxt_b());">查找目录</span>',
        '<span class="span_menu" onclick="javascript:'+str_t+'fullmenu_kltxt_b();">全部目录</span>',
        '<span class="span_menu" onclick="javascript:'+str_t+'possible_menu_kltxt_b();">可能的目录</span>',
    ];

    if (cstype!=='reader'){
        menu_dir.push('<span class="span_menu" onclick="javascript:'+str_t+'menu_insert_kltxt_b(3);">显示搜索关键字目录3</span>');
        menu_dir.push('<span class="span_menu" onclick="javascript:'+str_t+'menu_insert_kltxt_b(1);">显示搜索关键字目录1</span>');
        menu_dir.push('<hr />');
    }
    var menu_dir_width='14rem';
    var search_list=[
    '<span class="span_menu" onclick="javascript:'+str_t+'absearch_kltxt_b();">AB搜索</span>',
    '<span class="span_menu" onclick="javascript:'+str_t+'absearch_kltxt_b(\'\',-1,true);">AB搜索(单一结果)</span>',
    '<span class="span_menu" onclick="javascript:'+str_t+'rearray_kltxt_b();">重新分组</span>',
    '<span class="span_menu" onclick="javascript:'+str_t+'select_array_kltxt_b(\'select\');">提取符合条件的记录(不支持AB搜索)</span>',
    '<span class="span_menu" onclick="javascript:'+str_t+'select_array_kltxt_b(\'remove\');">删除符合条件的记录</span>',
    ];
    
    var menu_config=root_font_size_menu_b(str_t);
    menu_config.push('<span class="span_menu" onclick="javascript:'+str_t+'enwords_mini_search_frame_show_hide_b();">单词搜索</span>');
    if (cstype!=='reader' && cstype!=='digest'){
        menu_dir=menu_dir.concat(search_list);
        menu_dir_width='19rem';
        menu_config=menu_config.concat([
        '<span class="span_menu" onclick="javascript:'+str_t+'search_demo_kltxt_b();">语法示例</span>',
        '<span class="span_menu" onclick="javascript:'+str_t+'editable_kltxt_b();">页面可编辑</span>',        
        '<span class="span_menu" onclick="javascript:'+str_t+'break_line_kltxt_b();">断句</span>',        
        ]);
    }
    
    var menu_statistics=[
        '<span class="span_menu" onclick="javascript:'+str_t+'statistics_kltxt_b();">统计</span>',    
        '<span class="span_menu" onclick="javascript:'+str_t+'counthz_kltxt_b();">汉字量统计</span>',
        '<span class="span_menu" onclick="javascript:'+str_t+'tw_kltxt_b();">繁体字统计</span>',     
        '<span class="span_menu" onclick="javascript:'+str_t+'booksthickness_form_kltxt_b();">书的厚度</span>',    
        '<span class="span_menu" onclick="javascript:'+str_t+'books_current_table_kltxt_b();">当前书目列表</span>',
    ];
    
    var menu_digest=[
    '<span class="span_menu" onclick="javascript:'+str_t+'reading_mode_kltxt_b();">进入阅读状态</span>',    
    '<span class="span_menu" onclick="javascript:'+str_t+'digest_temp_add_kltxt_b();">添加临时摘要</span>',
    '<span class="span_menu" onclick="javascript:'+str_t+'digest_lines_kltxt_b();">显示摘要段落</span>',
    '<span class="span_menu" onclick="javascript:'+str_t+'digest_excluded_kltxt_b();">查看未包含或重复的摘要</span>',
    '<span class="span_menu" onclick="javascript:'+str_t+'digest_statistics_kltxt_b();">摘要分布统计</span>',
    ];
    if (is_local_b()){
        menu_digest.push('<span class="span_menu" onclick="javascript:window.open(\''+klwebphp_path_b('sticker.php')+'\', \'sticker\'+new Date().getTime(), \'width=1440, height=540\');">Sticker</span>');
    }
    
    //color menu - 保留注释
    var list_t=['default'].concat(popular_colors_b());
    var color_menu=[];

    for (let blxl=0;blxl<list_t.length;blxl++){
        var item=list_t[blxl];
        color_menu.push('<span class="span_menu" onclick="javascript:'+'change_colors_kltxt_b(\''+item+'\');" style="color:'+item.split(',')[0]+';background-color:'+item.split(',')[1]+';">'+(blxl+1)+'. '+item+'</span>');
    }
    
    var fontsize=(ismobile_b()?'0.9rem':'1rem');
    var bljg='';
    var colors=klmenu_b(color_menu,'🎨',(ismobile_b()?'16rem':'20rem'),'',fontsize,'20rem');
    if (cstype!=='digest'){
        bljg=bljg+klmenu_b(menu_general,'','10rem','',fontsize);
        bljg=bljg+klmenu_b(menu_dir,'🔍',menu_dir_width,'',fontsize);
        bljg=bljg+klmenu_b(menu_digest,'🖊','14rem','',fontsize);       
        bljg=bljg+colors;
        bljg=bljg+klmenu_b(menu_config,'⚙','10rem','',fontsize);
        if (cstype!=='reader'){
            bljg=bljg+klmenu_b(menu_statistics,'🧮','9rem','',fontsize);
        }
    }
    else{
        bljg=bljg+colors;
    }

    document.getElementById('span_title').insertAdjacentHTML('beforebegin',klmenu_multi_button_div_b(bljg,'','0rem')+' ');
}

function editable_kltxt_b(){
    var odiv=document.getElementById('divhtml');
    if (!odiv){return;}
    if (odiv.getAttribute('contenteditable')=='true'){
        odiv.setAttribute('contenteditable','false');
    }
    else {
        odiv.setAttribute('contenteditable','true');
    }
}

function books_current_table_kltxt_b(){
    var list_t=[];
    var bookname_list=[];
    var bookpath_list=[];
    list_t.push(array_2_li_b(['id','name','tag','no','type'],'th',container_type='tr'));
    for (let item of csbooklist_sub_global_b){
        if (item[0]==csbookname_global){
            var highheight_row=[].concat(item);
            highheight_row[0]='<span style="background-color:'+scheme_global['pink']+';">'+highheight_row[0]+'</span>';
            list_t.push(array_2_li_b(highheight_row,'td',container_type='tr'));
        }
        else {
            list_t.push(array_2_li_b(item,'td',container_type='tr'));
        }
        bookname_list.push(item[1]);
        if (item[3]=='3'){
            bookpath_list.push('~/klwebphp/PythonTools/data/selenium_news/jsdoc'+item[3]+'/'+item[0]+'.js');
        }
        else {
            bookpath_list.push('~/jsdoc/jsdoc'+item[3]+'/'+item[0]+'.js');
        }
    }
    bookpath_list.sort();
    
    var bljg='<table class="table_common" cellpadding=0 cellspacing=0>'+list_t.join('\n')+'</table>';

    bljg=bljg+'<textarea name="textarea_booknamelist" id="textarea_booknamelist" style="height:15rem;">';
    bljg=bljg+bookname_list.join('\n')+'\n';
    bljg=bljg+'</textarea>';
    bljg=bljg+'<p>';
    bljg=bljg+textarea_buttons_b('textarea_booknamelist','全选,清空,复制');
    bljg=bljg+'</p>';

    bljg=bljg+'<textarea name="textarea_bookpathlist" id="textarea_bookpathlist" style="height:15rem;">';
    bljg=bljg+bookpath_list.join('\n')+'\n';
    bljg=bljg+'</textarea>';
    bljg=bljg+'<p><span class="aclick" onclick="javascript:document.getElementById(\'divhtml2\').innerHTML=\'\';">关闭</span>';    
    bljg=bljg+textarea_buttons_b('textarea_bookpathlist','全选,清空,复制');
    bljg=bljg+'</p>';
    
    document.getElementById('divhtml2').innerHTML=bljg;
    fix_divhtml2_kltxt_b(false);
    location.href="#divhtml2";
}

function fullmenu_kltxt_b(){
    function sub_fullmenu_kltxt_b_id_2_line_number(csxl){
        for (let item of kltxt_menulist_index_global){
            if (item[1]==csxl){
                return '<span style="cursor:pointer;color:'+scheme_global['memo']+';font-size:0.9rem;" onclick="javascript:getlines_kltxt_b('+item[0]+');">('+(item[0]+1)+')</span>';
            }
        }
        return '';
    }
    //---------------------------------------------
	var bljg='';
    if (csbookname_global.substring(0,6)=='klwiki'){
        for (let blxl=0;blxl<menulist.length;blxl++){
            if (menulist[blxl].substring(0,7)=='<title>' && menulist[blxl].slice(-8)=='</title>'){
                bljg=bljg+'<li><a href="javascript:void(null);" onclick="javascript:findmenu_kltxt_b('+blxl+');" style="text-decoration:none;">'+menulist[blxl].substring(7,menulist[blxl].length-8)+'</a> '+sub_fullmenu_kltxt_b_id_2_line_number(blxl)+'</li>\n';
            }
            else {
                bljg=bljg+'<li><a href="javascript:void(null);" onclick="javascript:findmenu_kltxt_b('+blxl+');" style="text-decoration:none;">'+menulist[blxl]+'</a> '+sub_fullmenu_kltxt_b_id_2_line_number(blxl)+'</li>\n';
            }
        }
    }
    else {
        for (let blxl=0;blxl<menulist.length;blxl++){
            bljg=bljg+'<li><a href="javascript:void(null);" onclick="javascript:findmenu_kltxt_b('+blxl+');" style="text-decoration:none;">'+menulist[blxl]+'</a> '+sub_fullmenu_kltxt_b_id_2_line_number(blxl)+'</li>\n';
        }
    }
	document.getElementById('divhtml').innerHTML='<ol>'+bljg+'</ol>';
}

function menu_insert_kltxt_b(menu_count=3){
    var ohr=document.querySelector('hr.hr_inserted_menu');
    if (ohr){return;}
    
    var menu_no=[];
    for (let item of kltxt_menulist_index_global){
        menu_no.push(item[0]);
    }
    if (menu_no.length==0){return;}
    
    var oli_op=document.querySelectorAll('div#divhtml p, div#divhtml li');
    var pre_no=-1;
    var menu_list=[];
    for (let arow of oli_op){
        var ospan=arow.querySelector('span.txtsearch_kltxt_lineno');
        if (!ospan){continue;}
        var lineno=ospan.innerText;
        lineno=lineno.replace('(','');
        lineno=parseInt(lineno.replace(')','').trim());
        if (isNaN(lineno)){continue;}
        lineno=lineno-1;
        if (menu_no.includes(lineno)){
            arow.insertAdjacentHTML('beforebegin','<hr class="hr_inserted_menu" />');
            arow.insertAdjacentHTML('afterend','<hr class="hr_inserted_menu" />');
            arow.style.fontWeight='bold';
            arow.style.fontSize='1.5rem';
            pre_no=lineno;
            menu_list=[];
            continue;
        }
        for (let item of menu_no){
            if (item<=pre_no){continue;}
            if (item>lineno){
                menu_list=menu_list.slice(-1*menu_count,);
                for (let one_menu of menu_list){
                    arow.insertAdjacentHTML('beforebegin',one_menu);
                }
                menu_list=[];
                break;
            }
            menu_list.push('<hr class="hr_inserted_menu" /><span style="font-weight:bold;font-size:1.5rem;">'+filelist[item]+'</span> <span style="cursor:pointer;font-style: italic;color:'+scheme_global["shadow"]+';" onclick="javascript:getlines_kltxt_b('+(item+1)+');">('+(item+1)+')</span>'+'<hr class="hr_inserted_menu" />');
            pre_no=item;
        }
    }
}

function create_menulist_kltxt_b(value=0){
	var len_t=menulist.length;
	if (len_t<1){return;}
	var oselect=document.getElementById('select_menu');
    if (!oselect){return;}
    
    var klwiki_t=false;
    if (csbookname_global.substring(0,6)=='klwiki'){
         klwiki_t=true;
    }

	var bljg='';
	var step_t=Math.max(parseInt(len_t/1000),1);
	if (len_t>1000){
		bljg=bljg+'<option>共有目录项'+len_t+'个，显示了一部分目录</option>\n';
	}
	for (let blxl=0;blxl<len_t;blxl=blxl+step_t){
		if (menulist[blxl]==''){continue;}
        var menuitem_t=menulist[blxl];
        if (klwiki_t){
            if (menuitem_t.substring(0,7)=='<title>' && menuitem_t.slice(-8)=='</title>') {
                menuitem_t=menuitem_t.substring(7,menuitem_t.length-8)
		    }
        }
		if (value==blxl){
			bljg=bljg+'<option value="'+blxl+'" selected>'+menuitem_t+'</option>\n';
		}
		else {
			bljg=bljg+'<option value="'+blxl+'">'+menuitem_t+'</option>\n';
		}
	}
    oselect.innerHTML=bljg;
}

function counthz_kltxt_b(){
    var t0 = performance.now();
	var hz_t=new Set();
	var bd_t='　，、！？。“”《》；：（）．…‘’〈〉／％※□ －—･【】℃＞～∶○―「」';
	bd_t=bd_t+'０１２３４５〔〕•∕─①②［］＿→↗↘＋③④⑤⑥｀   –﹙﹚『』﹝﹞';
	bd_t=bd_t+'＊＆＝▲６７８⒄〖〗＜■◎●〓々⑩⑦⑧⑨﹔ＡＧⅠⅡⅢＯＶＸετāⅣα';
	bd_t=bd_t+'ɑɒʤəɜɪŋɔʃʊʌʒβθˌ⇒❶❷❸❹❺';

	var start_lineno;
	var end_lineno;
    var blmax;
    [start_lineno,end_lineno,blmax]=start_end_lineno_kltxt_b();
    
	for (let blxl=start_lineno;blxl<end_lineno;blxl++){
		var blhzs_t=filelist[blxl].match(/[^\x00-\xff]/g);
		if (blhzs_t){
			for (let blxl2=0;blxl2<blhzs_t.length;blxl2++){
				if(!bd_t.includes(blhzs_t[blxl2])){
					hz_t.add(blhzs_t[blxl2]);
				}
			}
		}
	}
    hz_t=Array.from(hz_t);
    
	hz_t.sort(function(a,b){return a.localeCompare(b,"zh");});
	
	var blcount=0;
	var out_3500_t=[];
	for (let item of hz_t){
		if (hz_3500_global.includes(item)){
            blcount=blcount+1;
        }
		else{
            out_3500_t.push(item);
        }
	}
	
	document.getElementById('divhtml').innerHTML='<p><b>汉字量：'+hz_t.length+' 其中常用汉字：'+blcount+' 占 '+(blcount*100/hz_t.length).toFixed(2)+'%</b></p><p>'+hz_t+'</p><p><b>其中非常用汉字：</b></p><p>'+out_3500_t+'</p>';
	hz_t=[];
    console.log('counthz_kltxt_b() 费时：'+(performance.now() - t0) + " milliseconds");
}

function booksthickness_form_kltxt_b(){
	document.getElementById('divhtml').innerHTML='<p>导入书籍js文件名和大小数据：<textarea id="textarea_books_thickness"></textarea><p>被比较书籍：<input type="text" id="input_compared_book" size="15" style="margin-left:15px; margin-bottom:5px;"> <a href="javascript:void(null);" onclick="javascript:get_books_thickness_kltxt_b();" class=aclick>比较</a>';
	return;
}

function select_array_kltxt_b(cstype){
    var blkey= document.getElementById('input_search').value.trim().split(' ');
	var csreg=document.getElementById('input_reg').checked;

    var match_t=str_reg_search_b('',blkey,csreg);
    if (match_t==-1){return;}
    
    var newlist_t=[];
    
    for (let item of filelist){
        match_t=str_reg_search_b(item,blkey,csreg);
        if (cstype=='remove' && match_t==false || cstype=='select' && match_t==true){
            newlist_t.push(item);
        }
    }

    filelist=[];
    for (let item of newlist_t){
        filelist.push(item);
    }
    document.getElementById('linecount').innerHTML='('+filelist.length+'行)';
}

function rearray_kltxt_b(){
    var blkey= document.getElementById('input_search').value.trim().split(' ');
	var csreg=document.getElementById('input_reg').checked;

    var match_t=str_reg_search_b('',blkey,csreg);
    if (match_t==-1){return;}
    
    var bljg='';
    var newlist_t=[];
    for (let item of filelist){
        match_t=str_reg_search_b(item,blkey,csreg);
        if (match_t){
            if (bljg!==''){
                newlist_t.push(bljg);
            }
            bljg=item;
        }
        else {
            if (bljg==''){
                bljg=bljg+item;
            }
            else {
                bljg=bljg+' &lt;br /&gt;'+item;
            }
        }
    }
    if (bljg!==''){
        newlist_t.push(bljg);
    }

    if (newlist_t.length>0){
        filelist=[];
        for (let item of newlist_t){
            filelist.push(item);
        }
        document.getElementById('linecount').innerHTML='('+filelist.length+'行)';
    }
}

function get_books_thickness_kltxt_b(){
	var blarr=document.getElementById("textarea_books_thickness").value.split('\n');
	var blcompared_book=document.getElementById("input_compared_book").value;
	var blcompared_size=0;
	var blarr3_t=[];
	for (let blxl=0;blxl<blarr.length;blxl++){
		if (blarr[blxl].includes('/')){
			var arr_t=blarr[blxl].split('/');
			blarr[blxl]=arr_t[arr_t.length-1];
		}
		var blarr2_t=blarr[blxl].split(' ');
		if (blarr2_t.length!=2){continue;}
		var bookname_t=blarr2_t[0];
        if (bookname_t.trim()==''){continue;}
        if (bookname_t.slice(-4,).toLowerCase()=='.jpg'){continue;}
        if (bookname_t.slice(-8,).toLowerCase()=='_menu.js'){continue;}
		for (let one_book of csbooklist_sub_global_b){
			if (one_book[0]==bookname_t || one_book[0]+'.js'==bookname_t || one_book[1]==bookname_t){
				blarr2_t[0]=one_book[1];
				break;
			}
		}
		blarr3_t.push(blarr2_t);
	}
	blarr3_t.sort(function(a,b){return a[1]-b[1];});
	var bljg='';
	for (let blxl=0;blxl<blarr3_t.length;blxl++){
		bljg=bljg+blarr3_t[blxl][0]+' '+blarr3_t[blxl][1]+'\n';
		if (blarr3_t[blxl][0]==blcompared_book){
			blcompared_size=blarr3_t[blxl][1];
		}
	}
	if (blcompared_size==0){
		blcompared_book=blarr3_t[0][0];
		blcompared_size=blarr3_t[0][1];
	}
	document.getElementById("textarea_books_thickness").value=bljg;

	var bljg='';
	var totalsize_t=0;
	for (let blxl=0;blxl<blarr3_t.length;blxl++){
		bljg=bljg+'<div style="positon:relative;float:left;width:30%; margin:2px; border:3px #c0c0c0 solid; background-color:'+rndcolor_b()+';">';
        bljg=bljg+'<p style="font-size:1.8rem;margin:'+blarr3_t[blxl][1]*15/blcompared_size+'px 0px;" align=center>'+blarr3_t[blxl][0]+'('+(blarr3_t[blxl][1]/blcompared_size).toFixed(2)+')</p>';
        bljg=bljg+'</div>';
		totalsize_t=totalsize_t+blarr3_t[blxl][1]/blcompared_size;
	}
	document.getElementById('divhtml2').innerHTML='<p>全部书籍相当于：'+totalsize_t.toFixed(2)+'本'+blcompared_book+'</p>'+bljg;
}

function search_demo_kltxt_b(){
	var bljg='<p>搜索语法示例：</p>\n';
	bljg=bljg+'<ol>\n';
	bljg=bljg+'<li>必须含有宝玉，并且必须含有林黛玉（<b>+宝玉 +林黛玉</b>）</li>\n';
	bljg=bljg+'<li>或者含有宝玉，或者含有林黛玉（<b>宝玉 林黛玉</b>）</li>\n';
	bljg=bljg+'<li>必须含有宝玉，并且必须不含有林黛玉（<b>+宝玉 -林黛玉</b>）</li>\n';
	bljg=bljg+'<li>或者含有宝玉，并且必须含有林黛玉（<b>宝玉 +林黛玉</b>）</li>\n';
	bljg=bljg+'</ol>\n';
	document.getElementById('divhtml').innerHTML=bljg;
	return;
}

function menu_all_only_one_kltxt_b(csmax=3000){
    var t0 = performance.now();
    var bllen=menulist.length;
    var blstep=1;
    if (csmax>0 && bllen>csmax){
        blstep=Math.ceil(bllen/csmax);
    }
    
    var notfound_list=[];
    var startno=0;
    for (let blxl=0;blxl<bllen;blxl=blxl+blstep){
        var list_t=menu_only_one_kltxt_b(blxl,startno);
        if (list_t.length==2){
            kltxt_menulist_index_global.push(list_t);
            startno=list_t[0];
        }
        else {
            notfound_list.push(blxl);
        }
    }
    
    while (true){
        var changed=false;
        
        for (let blno=0;blno<notfound_list.length;blno++){
            var one_no=notfound_list[blno];
            if (one_no==-1){continue;}
            var startno=0;
            var endno=-1;
            for (let blxl=0;blxl<kltxt_menulist_index_global.length;blxl++){
                var item=kltxt_menulist_index_global[blxl];
                if (item[1]>one_no){    //目录数组中目录序号大于指定目录序号 - 保留注释
                    endno=Math.max(0,item[0]-1);
                    if (blxl>0){
                        startno=kltxt_menulist_index_global[blxl-1][0]+1;
                    }
                    var list_t=menu_only_one_kltxt_b(one_no,startno,endno);
                    if (list_t.length==2){
                        kltxt_menulist_index_global.push(list_t);
                        kltxt_menulist_index_global.sort(function (a,b){return a[1]>b[1];});
                        notfound_list[blno]=-1;
                        changed=true;
                    }
                    break;
                }
            }
        }
        if (changed===false){
            break;
        }
    }
    console.log('menu_all_only_one_kltxt_b() 费时：'+(performance.now() - t0) + " milliseconds");
}

function menu_only_one_kltxt_b(csxl,startno=0,endno=-1){
    var list_t=[];
    
    var left_at=filelist.indexOf(menulist[csxl],startno);
    if (left_at>=0){
        if (endno<0 || endno==filelist.length){
            if (left_at==filelist.lastIndexOf(menulist[csxl])){
                return [left_at,csxl];
            }
        }
        else {
            if (filelist.indexOf(menulist[csxl],left_at+1)>endno){  //在搜寻范围内只有1个 - 保留注释
                return [left_at,csxl];
            }
        }
    }
    
    var remove_strs=['=','[=\\s]'];
    for (let one_remove of remove_strs){
        var blitem=menulist[csxl].replace(new RegExp(one_remove,"g"),"").trim();
        var left_at=filelist.indexOf(blitem,startno);
        if (left_at>=0){
            if (endno<0 || endno==filelist.length){
                if (left_at==filelist.lastIndexOf(blitem)){
                    return [left_at,csxl];
                }
            }
            else {
                if (filelist.indexOf(blitem,left_at+1)>endno){
                    return [left_at,csxl];
                }
            }
        }
    }
    return list_t;
}
    
function findmenu_kltxt_b(csxl=-1,cslimit=20,cscontent_length=-1){
    //cscontent_length: input_line_no - 保留注释
    function sub_findmenu_kltxt_bscan(blxl,cscontent_length,start_no_t,menu_no_t){
        var blitem=menulist[blxl].replace(new RegExp("=","g"),"").trim();
        var blitem2=blitem.replace(new RegExp(/\s/,"g"),"").trim();
        var blitem3=blitem.split('—')[0].replace(new RegExp(/[=\s]/,"g"),"").trim();
        var found_t=false;
        for (let blxl2=cscontent_length-1;blxl2>=start_no_t;blxl2--){ //内容扫描
            if (menulist[blxl]==filelist[blxl2].trim() || blitem==filelist[blxl2].trim() || blitem2==filelist[blxl2].trim().replace(new RegExp("　","g"),"")){
                start_no_t=blxl2;
                menu_no_t=blxl;
                found_t=true;
                break;
            }
            if (blxl2-1>=0){
                if (blitem==filelist[blxl2-1].trim()+filelist[blxl2].trim() || blitem2==(filelist[blxl2-1].trim()+filelist[blxl2].trim()).replace(new RegExp("　","g"),"")){
                    start_no_t=blxl2-1;
                    menu_no_t=blxl;
                    found_t=true;
                    break;
                }
            }
            if (blxl2+1<cscontent_length){
                if (blitem==filelist[blxl2].trim()+filelist[blxl2+1].trim() || blitem2==(filelist[blxl2].trim()+filelist[blxl2+1].trim()).replace(new RegExp(/[\s　]/,"g"),"")){
                    start_no_t=blxl2;
                    menu_no_t=blxl;
                    found_t=true;
                    break;
                }
            }
            if (blxl2+2<cscontent_length){
                if (blitem==filelist[blxl2].trim()+filelist[blxl2+1].trim()+filelist[blxl2+2].trim() || blitem2==(filelist[blxl2].trim()+filelist[blxl2+1].trim()+filelist[blxl2+2].trim()).replace(new RegExp(/[\s　]/,"g"),"")){
                    start_no_t=blxl2;
                    menu_no_t=blxl;
                    found_t=true;
                    break;
                }
            }     
        }
        if (found_t===false){
            for (let blxl2=cscontent_length-1;blxl2>=start_no_t;blxl2--){ //内容扫描   
                    if (blitem==filelist[blxl2].trim().split(' ')[0]){
                    start_no_t=blxl2;
                    menu_no_t=blxl;
                    found_t=true;
                    break;
                }
            }
        }
        if (found_t===false){
            for (let blxl2=cscontent_length-1;blxl2>=start_no_t;blxl2--){ //内容扫描   
                    if (blitem3==filelist[blxl2].trim().split(' ')[0]){
                    start_no_t=blxl2;
                    menu_no_t=blxl;
                    found_t=true;
                    break;
                }
            }
        }
        return [start_no_t,menu_no_t];
    }

    function sub_findmenu_kltxt_binnerHTML(start_no_t,menu_no_t){
        var oinput_startlineno=document.getElementById('input_start_lineno');
        if (oinput_startlineno){
            oinput_startlineno.value=start_no_t+1;
        }
        document.getElementById('input_lineno').value=start_no_t+1;
        document.getElementById('input_search').value=menulist[menu_no_t].replace(new RegExp("=","g"),"").trim();

        create_menulist_kltxt_b(menu_no_t);

        getlines_kltxt_b();
    }
    
    function sub_findmenu_kltxt_bsteps(){
        switch (step_xl){
            case 1:
                for (let blxl=max_t;blxl<=csxl;blxl++){ //目录序号
                    if (menulist[blxl].includes('==')){continue;}
                    no_list_t=sub_findmenu_kltxt_bscan(blxl,cscontent_length,start_no_t,menu_no_t);
                    start_no_t=no_list_t[0];
                    menu_no_t=no_list_t[1];
                }
                document.getElementById('divhtml').innerHTML='搜索阶段：'+step_xl+'/'+step_count+'...';
                break;
            case 2:
                for (let blxl=max_t;blxl<=csxl;blxl++){ //目录序号
                    if (menulist[blxl].includes('===') || (menulist[blxl].match(/=/g) || []).length==2){
                        continue;
                    }
                    no_list_t=sub_findmenu_kltxt_bscan(blxl,cscontent_length,start_no_t,menu_no_t);
                    start_no_t=no_list_t[0];
                    menu_no_t=no_list_t[1];
                }
                document.getElementById('divhtml').innerHTML='搜索阶段：'+step_xl+'/'+step_count+'...';
                break;
            case 3:
                for (let blxl=max_t;blxl<=csxl;blxl++){ //目录序号
                    if (menulist[blxl].includes('===')){
                        no_list_t=sub_findmenu_kltxt_bscan(blxl,cscontent_length,start_no_t,menu_no_t);
                        start_no_t=no_list_t[0];
                        menu_no_t=no_list_t[1];
                    }
                }
                document.getElementById('divhtml').innerHTML='搜索阶段：'+step_xl+'/'+step_count+'...';
                break;
            case 4:
                sub_findmenu_kltxt_binnerHTML(start_no_t,menu_no_t);
                break;
        }
        step_xl=step_xl+1;
        if (step_xl>4){return;}
        else {
            setTimeout(sub_findmenu_kltxt_bsteps,10);
        }
    }
    //----------------------
	if (csxl>menulist.length-1 || menulist.length==0){
        return;
    }
    
    if (csbookname_global.substring(0,6)=='klwiki'){
        if (csxl==-1 && cslimit==-1){
            for (let blxl2=cscontent_length-1;blxl2>=0;blxl2--){
                if (filelist[blxl2].substring(0,7)=='<title>' && filelist[blxl2].slice(-8)=='</title>'){
                    sub_findmenu_kltxt_binnerHTML(blxl2,menulist.indexOf(filelist[blxl2]));
                    return;
                }
            }
        }
        else if (csxl>=0) {
            for (let blxl2=0;blxl2<filelist.length;blxl2++){
                if (filelist[blxl2]==menulist[csxl]){
                    sub_findmenu_kltxt_binnerHTML(blxl2,csxl);
                    return;
                }
            }
        }
    }
    
    var start_no_t=0;
    var cstype='';
	if (csxl==-1){
        var cstype='search menu';
		csxl=menulist.length-1;
        for (let item of kltxt_menulist_index_global){
            if (cscontent_length-1>=item[0]){
                start_no_t=item[0];
            }
            else {
                break;
            }
        }
	}
    
	if (cslimit==-1){
		cslimit=menulist.length-1;
	}

	if (cscontent_length==-1){
        var cstype='search content';
		cscontent_length=filelist.length;
        
        for (let item of kltxt_menulist_index_global){
            if (csxl<=item[1]){
                cscontent_length=item[0]+1;
                break;
            }
            else {
                start_no_t=item[0];
            }
        }
	}
    
    var oinput_endlineno=document.getElementById('input_end_lineno');
    if (oinput_endlineno && parseInt(oinput_endlineno.value)>0){
        cscontent_length=Math.min(cscontent_length,parseInt(document.getElementById('input_end_lineno').value));
    }
    
	var max_t=Math.max(0,csxl-cslimit);
	var menu_no_t=0;
    
    var step_xl=1;
    var step_count=4;

    console.log(cstype,csxl,cscontent_length,start_no_t);
    
    var list_t=[];
    if (cstype=='search content'){
        var list_t=menu_only_one_kltxt_b(csxl,start_no_t,cscontent_length-1);
    }

    if (list_t.length==2){
        sub_findmenu_kltxt_binnerHTML(list_t[0],list_t[1]);
        console.log('only one');    
    }
    else {
        sub_findmenu_kltxt_bsteps();
        console.log('scan all');
    }
}

function find_cn_words_kltxt_b(){
    var csstr=document.getElementById('divhtml').innerHTML;
    var bljg='';
    for (let item of cnwords_global){
        if (csstr.includes(item[0])){
            bljg=bljg+'<li style="font-size:0.9rem;"><font color=blue><b>'+item[0]+'</b></font> '+item[1]+' '+item[2]+'</li>';
        }
    }
    if (bljg!==''){
        bljg='<ol>'+bljg+'</ol>';
        bljg=bljg+'<p align=right class="fmini"><a href="javascript:void(null);" onclick=\'javascript:document.getElementById("div_cn_words").innerHTML="";\'>Clear</a></p>';
        document.getElementById('div_cn_words').innerHTML=bljg;
    }
}

function search_next_kltxt_b(csxl,csstr){
	csxl=Math.max(csxl,0);
	var pd_t=false;
	for (let blxl=csxl+1;blxl<filelist.length;blxl++){ //不能使用 blxl in filelist
		if (csstr.trim()==filelist[blxl].trim() || csstr.replace(new RegExp(/\t[, \.　]/,"g")," ")==filelist[blxl].replace(new RegExp(/\t[, \.　]/,"g")," ")){
			getlines_kltxt_b(blxl+1);
			pd_t=true;
			break;
		}
	}
	if (pd_t==false){
		csstr=csstr.replace(new RegExp(/\t[,\.　]/,"g")," ");
		csstr=csstr.replace('　',' ');
		csstr=csstr.split(' ')[0].trim();
		for (let blxl=csxl+1;blxl<filelist.length;blxl++){ //不能使用 blxl in filelist
			if (csstr==filelist[blxl].trim() || csstr.replace(new RegExp(/ /,"g"),"")==filelist[blxl].replace(new RegExp(/\t[, \.　]/,"g"),"")){
				getlines_kltxt_b(blxl+1);
				pd_t=true;
				break;
			}
		}
	}
	
	if (pd_t==false){
		for (let blxl=csxl+1;blxl<filelist.length;blxl++){ //不能使用 blxl in filelist
			if (csstr==filelist[blxl].substring(0,csstr.length)){
				getlines_kltxt_b(blxl+1);
				pd_t=true;
				break;
			}
			else {
				var blstr_t=csstr.replace(new RegExp(/ /,"g"),"");
				if (blstr_t == filelist[blxl].replace(new RegExp(/\t[, \.　]/,"g"),"").substring(0,blstr_t.length)){
					getlines_kltxt_b(blxl+1);
					pd_t=true;
					break;
				}
			}
		}
	}
	
	if (pd_t==false){
		for (let blxl=csxl+1;blxl<filelist.length;blxl++){ //不能使用 blxl in filelist
			if (csstr==filelist[blxl].replace(new RegExp(/\t[, \.　]/,"g")," ").split(' ')[0]){
				getlines_kltxt_b(blxl+1);
				pd_t=true;
				break;
			}
		}
	}
}

function bookmarks_set_kltxt_b(){
    var bljg='';
    var list_t=local_storage_get_b('reader_lastbook',-1,true);
    if (list_t.length>900){
        alert('现有书签多于900个，无法添加');
        return;
    }
    for (let item of list_t){
        if (item.split('&').length==6){
            bljg=bljg+item+'\n';
        }
    }

	var csno= Math.max(parseInt(document.getElementById('input_lineno').value.trim()),0);
	var cslines= Math.min(500,Math.max(0,parseInt(document.getElementById('input_lines').value.trim())));
    if ((csno-1)/cslines+1==Math.ceil(filelist.length/cslines)){
        csno=filelist.length;   //最后一页 - 保留注释
    }
    var str_t=csbookname_global+'&'+csno+'&'+cslines;
    if (!('&'+bljg+'&').includes('&'+str_t+'&')){   //避免不同日期，相同书签值的出现 - 保留注释
        str_t=csbooklist_sub_global_b[csbookno_global_b][1].replace(new RegExp(/&/,'g'),'_')+'&'+str_t+'&'+filelist.length+'&'+now_time_str_b(':',true)+'\n';
        bljg=str_t+bljg;
    }
    else{
        alert('书签已存在');
        return;
    }
    if (bljg.slice(-1)=='\n'){
        bljg=bljg.substring(0,bljg.length-1);
    }
    localStorage.setItem('reader_lastbook',bljg);
    alert('书签已添加');
}

function bookmarks_read_kltxt_b(current_book_today_bookmark_only_one=false,return_full=true){
    //current_book_today_bookmark_only_one 为 true 时：当前书籍今日书签仅保留最新的一个 - 保留注释
    var last_book=local_storage_get_b('reader_lastbook',-1,true);
    var today=date2str_b();
    var bookmark_list=[];

    var current_book_today_bookmark_count=0;
    var current_book_today_row=[];
    for (let item of last_book){
        var abook=item.split('&');
        if (abook.length!==6){
            continue;
        }
        abook[2]=parseInt(abook[2]);
        abook[4]=parseInt(abook[4]);
        
        if (csbookname_global==abook[1] && abook[5].substring(0,11)==today+' '){ //如果是当前书籍且是今天的书签 - 保留注释
            current_book_today_bookmark_count=current_book_today_bookmark_count+1;
            if (current_book_today_bookmark_only_one){
                if (current_book_today_row.length==0){  //初始添加 - 保留注释
                    current_book_today_row=[];
                    for (let one_col of abook){
                        current_book_today_row.push(one_col);
                    }
                }
                else if (current_book_today_row[5]<abook[5]){   //保留最新日期的书签 - 保留注释
                    current_book_today_row=[];
                    for (let one_col of abook){
                        current_book_today_row.push(one_col);
                    }
                }
                continue;
            }
        }
        
        bookmark_list.push(abook);
    }
    if (current_book_today_row.length>0){
        bookmark_list.push(current_book_today_row);
    }

    var bookmark_name={}
    for (let item of bookmark_list){
        if (bookmark_name[item[1]]==null){
            bookmark_name[item[1]]=[];
        }
        bookmark_name[item[1]].push(item);  //同名书籍分组 - 保留注释
    }
    
    var preday=previous_day_b('',366)+' ';   //366天以前 - 保留注释
    for (let key in bookmark_name){
        bookmark_name[key].sort(function (a,b){return a[5]<b[5];}); //按日期排序 - 保留注释
        var oldest_bookmark=bookmark_name[key].slice(-1);
        var bllen=bookmark_name[key].length;
        for (let blxl=3;blxl<bookmark_name[key].length;blxl++){
            if (bookmark_name[key][blxl][5].substring(0,11)<preday){
                bookmark_name[key]=bookmark_name[key].slice(0,blxl);    //不含第 blxl 个元素 - 保留注释
                if (blxl<=bllen-1){
                    bookmark_name[key]=bookmark_name[key].concat(oldest_bookmark);  //保留最古老的书签 - 保留注释
                }
                break;
            }
        }
    }
    
    bookmark_list=[];
    var bookmark_list_only2=[];
    for (let key in bookmark_name){
        bookmark_list=bookmark_list.concat(bookmark_name[key]);
        bookmark_list_only2=bookmark_list_only2.concat(bookmark_name[key].slice(0,2));  //最新的2个 - 保留注释
    }

    bookmark_list.sort(function (a,b){return a[5]<b[5];});
    bookmark_list.sort(function (a,b){return a[0]>b[0];});
    
    bookmark_list_only2.sort(function (a,b){return a[5]<b[5];});
    bookmark_list_only2.sort(function (a,b){return a[0]>b[0];});

    if (current_book_today_bookmark_only_one && current_book_today_bookmark_count>1){
        if (confirm("当前书籍今日书签是否仅保留最新的一个？")){
            current_book_today_bookmark_count=0;
            var bljg='';
            for (let item of bookmark_list){
                bljg=bljg+item.join('&')+'\n';
            }
            localStorage.setItem('reader_lastbook',bljg);
        }
    }
    
    if (return_full){
        return [current_book_today_bookmark_count,bookmark_list];
    }
    else {
        return [current_book_today_bookmark_count,bookmark_list_only2];    
    }
}

function bookmarks_get_kltxt_b(current_book_today_bookmark_only_one=false,return_full=true){
    //格式：书编号&开始行号&每页行数&filelist元素个数&日期时间 - 保留注释
    fix_divhtml2_kltxt_b(false);
    var current_book_today_bookmark_count=0;
    var bookmark_list=[];
    
    [current_book_today_bookmark_count,bookmark_list]=bookmarks_read_kltxt_b(current_book_today_bookmark_only_one,return_full);
    var sum_line_done=0;
    var sum_line_total=0;

    var bookname_t='';
    var bllen=bookmark_list.length;
    var sum_line_change=0;
    
    var theyear = new Date().getFullYear();
    var remain_days=1+days_remained_of_year_b();    //包含当天 - 保留注释
    var next_year_days=(isLeapYear_b(theyear+1)?366:365);
    var next_year2_days=(isLeapYear_b(theyear+2)?366:365);
    
    var result_t=[];
    var newest_datetime='';
    for (let blxl=0;blxl<bllen;blxl++){
        var abook=bookmark_list[blxl];

        if (blxl==0 || blxl>0 && abook[1]!==bookmark_list[blxl-1][1]){  //只读取同名书籍的最新记录 - 保留注释
            sum_line_done=sum_line_done+abook[2];
            sum_line_total=sum_line_total+abook[4];
        }
        
        var str_t=books_id2name_b(abook[1]);
        if (str_t==''){
            str_t=abook[1];
        }
        
        var lines_left=abook[4]-abook[2];
        var blstr='<td align=right>'+abook[2]+' / ';
        blstr=blstr+abook[4]+' / ';
        blstr=blstr+(abook[2]/abook[4]*100).toFixed(2)+'%</td>';
        
        blstr=blstr+'<td align=right>';
        if (blxl<bllen-1 && abook[1]==bookmark_list[blxl+1][1]){
            var one_book_line_change=abook[2]-bookmark_list[blxl+1][2];
            if (blxl>0 && abook[1]==bookmark_list[blxl-1][1]){
                //blstr=blstr+'/';    //相同书名已读行数变动只统计最新的2条 - 保留注释
                blstr=blstr+'<font color="'+scheme_global['memo']+'">'+(one_book_line_change>0?'+':'')+one_book_line_change+'</font>';
            }
            else {
                blstr=blstr+(one_book_line_change>0?'+':'')+one_book_line_change;
                sum_line_change=sum_line_change+one_book_line_change;
            }
        }
        else {
            blstr=blstr+'<font color="'+scheme_global['memo']+'">/</font>';
        }
        blstr=blstr+'</td>';
    
        blstr=blstr+'<td align=right>'+Math.ceil(lines_left/remain_days)+' / ';
        blstr=blstr+Math.ceil(lines_left/(remain_days+next_year_days))+' / ';
        blstr=blstr+Math.ceil(lines_left/(remain_days+next_year_days+next_year2_days))+'</td>';        
        blstr=blstr+'<td class="td_bookmark_datetime">'+abook[5]+'</td>';
        if (abook[5]>newest_datetime){
            newest_datetime=abook[5];
        }
        
        if (csbookname_global==abook[1]){
            result_t.push('<td align=right>'+(blxl+1)+'</td><td style="min-width:10rem;"><a href="javascript:void(null);" onclick="javascript:getlines_kltxt_b('+abook[2]+','+abook[3]+');">'+str_t+'</a></td>'+blstr);
        }
        else {
            result_t.push('<td align=right>'+(blxl+1)+'</td><td style="min-width:10rem;"><a href="?'+abook[1]+'&line='+abook[2]+'_'+abook[3]+'">'+str_t+'</a></td>'+blstr);
        }
    }
        
    var postpath=postpath_b();
	var bljg='<form method="POST" action="'+postpath+'temp_txt_share.php?type=txtlistearch_bookmarks" name="form_bookmarks" target=_blank style="margin-left:0.5rem;">\n';
    if (return_full){
        bljg=bljg+'<textarea name="textarea_bookmarks" id="textarea_bookmarks" style="height:20rem;">';
        for (let item of bookmark_list){
            bljg=bljg+item.join('&')+'\n';
        }
        bljg=bljg+'</textarea>';
    }
    bljg=bljg+'<p>';
    bljg=bljg+'<span class="aclick" onclick="javascript:document.getElementById(\'divhtml2\').innerHTML=\'\';">关闭</span> ';       
    if (return_full){
        bljg=bljg+'<span class="aclick" onclick="javascript:bookmarks_import_kltxt_b();">更新</span> ';
        bljg=bljg+'<span class="aclick" onclick="javascript:bookmarks_get_kltxt_b(false,false);">最新书签</span> ';
        bljg=bljg+textarea_buttons_b('textarea_bookmarks','全选,清空,复制,发送到临时记事本,发送地址','txtlistearch_bookmarks')+' ';
    }
    else {
        bljg=bljg+'<span class="aclick" onclick="javascript:bookmarks_get_kltxt_b();">全部书签</span> ';
    }
    bljg=bljg+theyear+'年剩余天数：'+remain_days;
    bljg=bljg+'</p>';
    if (current_book_today_bookmark_count>1){
        bljg=bljg+'<p><span class="aclick" onclick="javascript:bookmarks_get_kltxt_b(true);">当前书籍今日书签仅留最新一个</span></p>';
    }
    bljg=bljg+'</form>\n';
    var current_book_percent=[];
    var reading_lines=[];
    if (return_full){
        for (let item of bookmark_list){
            if (item[1]!==csbookname_global){continue;}
            current_book_percent.push([new Date(item[5].split(' ')[0]),item[2]*100/item[4]]);
            reading_lines.push([new Date(item[5].split(' ')[0]),item[2]]);
        }
        current_book_percent.sort(function (a,b){return a[0]>b[0];});
        reading_lines.sort(function (a,b){return a[0]>b[0];});
        if (current_book_percent.length>0){
            bljg=bljg+'<div id="div_flot_bookmark_line" style="width=100%;height:35rem;"></div>';
        }
    }
    for (let blxl=reading_lines.length-1;blxl>0;blxl--){
        reading_lines[blxl][1]=reading_lines[blxl][1]-reading_lines[blxl-1][1];
    }
    document.getElementById('divhtml').innerHTML='';
    var table_th='<tr><th>No.</th><th>书名</th><th nowrap>当前行号 / 总行数 / 完成%</th><th>Δ</th><th nowrap>'+theyear+' / '+(theyear+1)+' / '+(theyear+2)+'年年底<br />完成每日需阅读行数</th><th>添加日期</th></tr>';
    
    var table_sum='<tr><th></th><th align=center>合计</th>';
    table_sum=table_sum+'<th align=right>'+sum_line_done+' / '+sum_line_total+' / '+(sum_line_done/sum_line_total*100).toFixed(2)+'%</th>';
    table_sum=table_sum+'<th align=right>'+(sum_line_change>0?'+':'')+sum_line_change+'</th>';

    lines_left=sum_line_total-sum_line_done;

    table_sum=table_sum+'<th align=right>'+Math.ceil(lines_left/remain_days)+' / ';
    table_sum=table_sum+Math.ceil(lines_left/(remain_days+next_year_days))+' / ';
    table_sum=table_sum+Math.ceil(lines_left/(remain_days+next_year_days+next_year2_days))+'</th>';       

    table_sum=table_sum+'<th></th></tr>';
    
    document.getElementById('divhtml2').innerHTML='<section style="overflow:auto;"><table id="table_bookmarks" class="table_common" cellpadding=0 cellspacing=0 style="font-size:0.85rem;margin-left:0.5rem;" width=100%>'+table_th+array_2_li_b(result_t,'tr',false)+table_sum+'</table></section><br />'+bljg;
    var blstatsitics='';

    var current_line_no_max=0;
    for (let item of bookmark_list){
        if (item[1]!==csbookname_global){continue;}
        current_line_no_max=Math.max(current_line_no_max,item[2]);
    }
    if (current_line_no_max<filelist.length){
        current_line_no_max=current_line_no_max-1;  //书签行号-1 - 保留注释
    }
    if (reading_lines.length>=2){
        if (reading_lines[0][1]<=1){    //考虑第一个书签已读行数为1的情形 - 保留注释
            var day_start=reading_lines[1][0];  //第二个书签已读行数应当>1 - 保留注释
            var read_days=reading_lines.length-1;
        }
        else {
            var day_start=reading_lines[0][0];
            var read_days=reading_lines.length;
        }
        var day_end=reading_lines.slice(-1)[0][0];
        blstatsitics='<p style="margin-left:0.5rem;"><b>《'+csbooklist_sub_global_b[csbookno_global_b][1]+'》</b>';
        blstatsitics=blstatsitics+'开始阅读日期：'+date2str_b('-',day_start)+' '+day_2_week_b(day_start)+'；结束日期：'+date2str_b('-',day_end)+' '+day_2_week_b(day_end)+'；总天数：'+((day_end - day_start) / 86400000 + 1)+'天；';
        
        var lines_per_day=current_line_no_max/read_days;
        blstatsitics=blstatsitics+'实际阅读天数：'+read_days+'天；平均每天阅读：'+lines_per_day.toFixed(0)+'行。';
        if (current_line_no_max<filelist.length){
            var plan_days=Math.ceil((filelist.length-current_line_no_max)/lines_per_day);
            blstatsitics=blstatsitics+'完成阅读还需要：'+plan_days+'天；即，'+next_day_b('',plan_days)+'。';
        }
        blstatsitics=blstatsitics+'</p>';
    }

    if (return_full && current_book_percent.length>0 && csbooklist_sub_global_b.length>0){
        flot_two_lines_two_yaxis_k(['《'+csbooklist_sub_global_b[csbookno_global_b][1]+'》阅读行数'].concat(reading_lines),['《'+csbooklist_sub_global_b[csbookno_global_b][1]+'》已读比例'].concat(current_book_percent),'div_flot_bookmark_line','行','%','nw',true,'d',0,0,'',[],-1,false,false,false,100);
        document.getElementById('div_flot_bookmark_line').insertAdjacentHTML('afterend',blstatsitics);
    }
    var otds=document.querySelectorAll('table#table_bookmarks td.td_bookmark_datetime');
    for (let one_td of otds){
        if (one_td.innerText==newest_datetime){
            one_td.parentNode.style.backgroundColor=scheme_global['pink'];
            one_td.parentNode.setAttribute('onmouseover','javascript:this.style.backgroundColor="'+scheme_global['button']+'";');
            one_td.parentNode.setAttribute('onmouseout','javascript:this.style.backgroundColor="'+scheme_global['pink']+'";');
            break;
        }
    }
}

function bookmarks_import_kltxt_b(){
    if (confirm("是否更新书签？")){
        var str_t=document.getElementById('textarea_bookmarks').value;
        localStorage.setItem('reader_lastbook',str_t.trim());
        bookmarks_get_kltxt_b();
    }
}

function page_kltxt_b(cspages,cslines){
    var blno=page_location_b(cspages);
    if (blno!==false){
        getlines_kltxt_b((blno-1)*cslines+1,cslines);
    }
}

function getlines_kltxt_b(csno=false,cslines=false,single=false){
    //csno 从 1 开始 - 保留注释
    function sub_getlines_kltxt_b_pages(csno,cslines,bllength){
        var bljg='';
        var pages=Math.ceil(filelist.length/cslines);
        //var pginterval=Math.max(1,parseInt(pages/(ismobile_b()?1:3))); - 保留注释
        for (let blxl=1;blxl<=pages;blxl++){
            bljg=bljg+page_one_b(pages,(csno-1)/cslines+1,blxl,'onclick="javascript:getlines_kltxt_b('+((blxl-1)*cslines+1)+', '+cslines+');"',0,0,'span_page_number oblong_box');
        }
        bljg=page_remove_dot_b(bljg);
        if (filelist.length<=2000){
            bljg=bljg+'<span style="cursor:pointer;" class="oblong_box" onclick="javascript:getlines_kltxt_b(1,filelist.length,true);"><b>一页</b></span> ';
        }        
        bljg=bljg+page_prev_next_b(pages,(csno-1)/cslines+1,' onclick="javascript:getlines_kltxt_b('+(csno-cslines)+', '+cslines+');"','onclick="javascript:getlines_kltxt_b('+(csno+cslines)+', '+cslines+');"',' onclick="javascript:page_kltxt_b('+pages+','+cslines+');"','oblong_box');

        bljg='<p align=right style="font-size:0.9rem;line-height:1rem;">'+bljg+'</p>';

        return bljg;    
    }
    
    function sub_getlines_kltxt_b_lines(csmin,csmax,bllength,csgrey=false,csaname){
        var bljg='';
        var style_t='';
        if (csgrey==true){
            style_t='color:'+scheme_global["shadow"];
        }
        var list_t=[];
        for (let blxl=csmin;blxl<csmax;blxl++){
            if (blxl>=bllength){break;}
            if (blxl<0 || blxl>filelist.length-1){continue;}
            list_t.push([filelist[blxl],blxl]);
        }
        bljg=bljg+format_lines_kltxt_b(list_t,style_t,csaname);
        return bljg;
    }    
    //--------
    if (csbooklist_sub_global_b.length==0){
        return;
    }
    
	if (csno===false){
        csno= Math.max(parseInt(document.getElementById('input_lineno').value.trim()),0);
    }
	else{
        csno=Math.max(0,csno);
    }
	if (cslines===false){
        var csmaxlines=start_end_lineno_kltxt_b()[2];//500;
        cslines= Math.min(csmaxlines,Math.max(0,parseInt(document.getElementById('input_lines').value.trim())));
    }

    var ohide_no=document.getElementById('check_hide_no');
    if (ohide_no){
	    var cshideno=ohide_no.checked;
    }
    else {
        var cshideno=true;
    }

	klwiki_syntaxhighlight_global=false;
	
	var bljg='';
	var bllength=filelist.length;
	
	if (csno==0){
		csno=Math.min(bllength-1,Math.max(1,(Math.random()*bllength).toFixed(0)));
		document.getElementById('input_lineno').value=csno;
	}
	if (cslines==0){
		cslines=Math.max(1,(Math.random()*500).toFixed(0));
		document.getElementById('input_lines').value=cslines;
	}
	
    var aname_num=csno;
    if (single===false){
        csno=(Math.ceil(csno/cslines)-1)*cslines+1;
    }
    
    var olineno=document.getElementById('input_lineno');
    if (olineno){
        olineno.value=csno;
    }
    var olines=document.getElementById('input_lines');
    if (olines){
        olines.value=cslines;
    }
    
    var blpage=sub_getlines_kltxt_b_pages(csno,cslines,bllength);
    if (single===false){
	    bljg=bljg+blpage;
    }

	if (cshideno==false){
        bljg=bljg+'<ul>';
    }
    if (csno==1 && csbookno_global_b>=0){
        var coverpath=csbooklist_sub_global_b[csbookno_global_b][3];
        var covername=csbooklist_sub_global_b[csbookno_global_b][0];
        if (coverpath.includes('digest')){
            coverpath=coverpath.replace('digest','');
            if (covername.slice(-7,)=='_digest'){
                covername=covername.slice(0,-7);
            }
        }
        if (csbooklist_sub_global_b[csbookno_global_b][4].includes('P')){
            var cover_img='<img src="'+book_path_b(coverpath)+'cover/'+covername+'.jpg" alt="'+csbooklist_sub_global_b[csbookno_global_b][1]+'" />';
        }
        else {
            var cover_img='<img src="'+book_path_py_b('cover',coverpath)+covername+'.jpg" alt="'+csbooklist_sub_global_b[csbookno_global_b][1]+'" />';
        }
        
		if (cshideno){
            bljg=bljg+'<p style="color:'+scheme_global["shadow"]+';">'+cover_img+'</p>';
        }
		else{
            bljg=bljg+'<li style="color:'+scheme_global["shadow"]+';">'+cover_img+'</li>';
        }
    }
    if (single===false){
        bljg=bljg+sub_getlines_kltxt_b_lines(csno-3,csno-1,bllength,true);
    }
	if (cshideno==false){
        bljg=bljg+'</ul>';
    }
    
	bljg=bljg+'<hr />';
    
	if (cshideno==false){
        bljg=bljg+'<ol>';
    }
    bljg=bljg+sub_getlines_kltxt_b_lines(csno-1,csno+cslines-1,bllength,false,aname_num);
	if (cshideno==false){
        bljg=bljg+'</ol>';
    }
    
	bljg=bljg+'<hr />';
    
	if (cshideno==false){
        bljg=bljg+'<ul>';
    }
    if (single===false){
        bljg=bljg+sub_getlines_kltxt_b_lines(csno+cslines-1,csno+cslines-1+2,bllength,true);
    }
	if (cshideno){
        bljg='<div>'+bljg+'</div>';
    }
	else{
        bljg=bljg+'</ul>';
    }

    if (single===false){
        bljg=bljg+blpage;
    }
    
	document.getElementById('divhtml').innerHTML=bljg;
    mouseover_mouseout_oblong_span_b(document.querySelectorAll('div#divhtml span.oblong_box'));

    if (aname_num!==csno){
	    document.location.href = "#a_raw_line_number";
    }
    else {
        document.location.href = "#content";
    }
    sup_kleng_words_b();
    highheight_kltxt_b();
    digest_show_kltxt_b();
}

function booksearch_kltxt_b(csword,csreg){
	var csnum=arguments.length;
	if (csnum==0){
        var csword= document.getElementById('input_search').value.trim();
    }
	document.getElementById('input_search').value=csword;

	if (csnum<=1){
        var csreg=document.getElementById('input_reg').checked;
    }
	document.getElementById('input_reg').checked=csreg;
    
    recent_search_kltxt_b(csword+(csreg?'(:r)':''));

    if (csword.trim()==''){return;}
    if (csreg){
        csword=csword+'_reg';
    }

    document.location.href="?_tag"+encodeURIComponent(csword)+'&line=1';
}

function recent_search_kltxt_b(cskeys='',addstyle=false){
    if (document.location.href.includes('reader.htm')){
        var blfn='search_klreader';
    }
    else {
        var blfn='txtsearch_kltxt_b';
    }
    if (addstyle){
        var odiv=document.getElementById('div_recent_search');
        if (odiv){
            odiv.style.cssText='line-height:1.8rem;margin-top:0.5rem;margin-bottom:0.5rem;padding-top:0.2rem;border-top:0.1rem dotted '+scheme_global['memo']+';border-bottom:0.1rem dotted '+scheme_global['memo']+';';
        }
    }
    recent_search_b('recent_search_txtlistsearch',cskeys,blfn,'div_recent_search',["&lt;title;.mht",'&lt;title&gt;;.mht|blogspot|evernote|youdao|wordpress\.com(:r)','+http +2018\\d{4}(:r)','&lt;title;avplayer','&lt;title;引用资料;-ref','&lt;title;引用资料;^[0-9]\\.(:r)','&lt;title;{{wikiuploads}}200[2-6]/(:r)','&lt;title;引用资料;^\\d+.*http','([^\\x00-\\xff])\\1\\1(:r)','^[^\\x00-\\xff]{2,10}$(:r)','一|二|三|四|五|六|七|八|九|十|零|〇(:r)','+http +2018\\d{4}(:r)','-klwiki -englishwords','狍 獐 獾 鹿 蛙 野味 兔'],20);
}

function txtsearch_one_kltxt_b(csword='',csreg=false){
    if (csword.slice(-4,)=='(:r)'){
        csreg=true;
        csword=csword.slice(0,-4);
    }
    var result_t=txtsearch_list_kltxt_b(csword,csreg,1);
    if (result_t.length==0){return;}
    var oinput=document.getElementById('input_search');
    if (oinput){
        oinput.value=csword;
    }
    var oreg=document.getElementById('input_reg');
    if (oreg){
        oreg.checked=csreg;
    }
    getlines_kltxt_b(result_t[0][1]+1);
}

function txtsearch_list_kltxt_b(csword,csreg,csmaxlines,start_lineno=0,end_lineno=-1){
    if (csword==''){return [];}
    var cswordlist=csword.split(' ');   
	var blcount=0;
    if (end_lineno==-1){
        end_lineno=filelist.length;
    }
    var result_t=[];
    for (let blxl=start_lineno;blxl<end_lineno;blxl++){         
		var bltmp = filelist[blxl];
		
		var blfound=str_reg_search_b(bltmp,cswordlist,csreg);
		if (blfound==-1){
			break;
		}

		if (blfound){
            result_t.push([bltmp,blxl]);
			blcount=blcount+1;
			if (blcount>=csmaxlines){break;}
		}
	}
    recent_search_kltxt_b(csword+(csreg?'(:r)':''));
    return result_t;
}

function txtsearch_kltxt_b(csword,csreg,cscontinue,csmaxlines){
	var csnum=arguments.length;
	if (csnum==0){
        var csword=document.getElementById('input_search').value.trim();
    }

	if (csnum<=1){
        var csreg=document.getElementById('input_reg').checked;
    }

    if (csword.slice(-4,)=='(:r)'){
        csreg=true;
        csword=csword.slice(0,-4);
    }
    document.getElementById('input_search').value=csword;
    document.getElementById('input_reg').checked=csreg;

    if (csnum<=2){
        var cscontinue=false;
    }
    var oinput_continue=document.getElementById('input_continue');
    if (oinput_continue){
        if (csnum<=2){
            cscontinue=oinput_continue.checked;
        }
        oinput_continue.checked=cscontinue;
    }

	//if (csword==''){return;}
	
	var cshideno=document.getElementById('check_hide_no').checked;

    if (csnum<=3){
        var csmaxlines=false;
    }
    
    var list_t=start_end_lineno_kltxt_b();
	var start_lineno=list_t[0];
	var end_lineno=list_t[1];
    if (csmaxlines===false){
        csmaxlines=list_t[2];
    }
    
    //一开始设置为false，这样才能正确运行 wiki_line_b
	klwiki_syntaxhighlight_global=false;
	
	var blwordlist=csword.split(' ');   

    var result_t=txtsearch_list_kltxt_b(csword,csreg,csmaxlines,start_lineno,end_lineno);
	var bljg=format_lines_kltxt_b(result_t);

	var odiv = document.getElementById('divhtml');
	if (cshideno){
        odiv.innerHTML='<div>'+bljg+'</div>';
    }
	else{
        odiv.innerHTML='<ol>'+bljg+'</ol>';
    }
	
	if (bljg.length==0 && cscontinue==true){
		if (csbookno_global_b==csbooklist_sub_global_b.length-1 && confirm("是否继续跨数据表搜索？")==false){
            return;
        }
		if (csreg==true){
            var blreg='_reg';
        }
		else{
            var blreg='';
        }
		if (csbookno_global_b==csbooklist_sub_global_b.length-1){
            location.href='?'+csbooklist_sub_global_b[0][0]+'_tag'+book_tag_global+'&sc='+csword+blreg;
        }
		else{
            location.href='?'+csbooklist_sub_global_b[parseInt(csbookno_global_b)+1][0]+'_tag'+book_tag_global+'&sc='+csword+blreg;
        }
	}
    sup_kleng_words_b();
    highheight_kltxt_b(blwordlist);
    digest_show_kltxt_b();
    books_b(false,'txt',book_tag_global);
}

function highheight_kltxt_b(cswordlist=[]){
    var ohighlight=document.getElementById('input_highlight');
    if (ohighlight){
        if (document.getElementById('input_highlight').checked==false){
            return;
        }
    }
    
    if (cswordlist.length==0){
        var csword=document.getElementById('input_search').value.trim();
        if (csword.slice(-4,)=='(:r)'){
            csword=csword.slice(0,-4);
        }
        if (csword==''){return;}
        cswordlist=csword.split(' ');
    }
    
    var t0 = performance.now();
    var blkey=[];
    for (let item of cswordlist){
        if (item.substring(0,1)=='-'){
            continue;
        }
        if (item.substring(0,1)=='+'){
            item=item.substring(1,);
        }
        if (item.substring(0,1)=='(' && item.slice(-1)==')'){
            item=item.slice(1,-1);
        }
        item=item.replace(new RegExp(/\.\*|\||\.\+|\[|\]/,'g'),' ');
        blkey=blkey.concat(item.split(' '));
    }
    blkey=array_unique_b(blkey);
    var blkey2=[];
    for (let item of blkey){
        if (item.trim()==''){continue;}
        if (item.includes('\\') || item.includes('(') || item.includes(')')){
            continue;
        }
        blkey2.push(item);
    }
    
    var reg_error=false;
    for (let one_key of blkey2){
        try {
            var bltmp=''.replace(new RegExp(one_key,'g'),'');
        }
        catch (error){
            console.log(error.message); //此行保留 - 保留注释
            reg_error=true;
            break;
        }
    }
            
    if (blkey2.length>0){
        var odiv=document.getElementById('divhtml');
        var ospans=odiv.querySelectorAll('p span.txt_content,li span.txt_content');
        for (let one_dom of ospans){
            var old_text=one_dom.innerText;
            var old_html=one_dom.innerHTML;
            var new_html=old_html;
            for (let blxl=0;blxl<blkey2.length;blxl++){
                var one_key=blkey2[blxl];
                if (old_text.includes(one_key)){
                    if (reg_error){
                        new_html=new_html.replace(one_key,'<span style="font-weight:bold;background-color:'+scheme_global[(blxl>=2?'pink':(blxl==0?'skyblue':'selection'))]+';">'+one_key+'</span>');                    
                    }
                    else {
                        new_html=new_html.replace(new RegExp(one_key,'g'),'<span style="font-weight:bold;background-color:'+scheme_global[(blxl>=2?'pink':(blxl==0?'skyblue':'selection'))]+';">'+one_key+'</span>');
                    }
                }
            }
            one_dom.innerHTML=new_html;
            if (one_dom.innerText!==old_text){
                console.log(one_dom.innerText,old_text);
                one_dom.innerHTML=old_html;
            }
        }
    }
    console.log('highheight_kltxt_b() 关键字加亮',blkey2,'费时：'+(performance.now() - t0) + " milliseconds");
}

function format_lines_kltxt_b(cslist,csstyle='',csaname=-1){
    //cslist 的每个元素为数组，包含2个元素：0为字符串，1为序号
    function sub_format_lines_kltxt_b_bible(blstr){
        if (blstr.includes('<')){return blstr;}
        if (blstr.match(/^==*\s(.*?)\s(\d*)\s?==*/g)){
            var str_t=blstr.replace(new RegExp(/^==*\s(.*?)\s(\d*)\s?==*/,'g'),'$1');
            var num_t=blstr.replace(new RegExp(/^==*\s(.*?)\s(\d*)\s?==*/,'g'),'$2');
            var other_book_t='';
            if (csbooklist_sub_global_b[csbookno_global_b][1]=='圣经和合本'){
                other_book_t='Bible(kjv)';
            }
            else {
                other_book_t='圣经和合本';
            }
            var other_book_id_t='';
            for (let item of csbooklist_sub_global_b){
                if (item[1]==other_book_t){
                    other_book_id_t=item[0];
                    break;
                }
            }
            if (other_book_id_t==''){return blstr;}
            blstr='<a href="txtlistsearch.htm?'+other_book_id_t+'&s=+'+bible_en_cn_b(str_t).replace(new RegExp(' ','g'),' +');
            if (num_t){
                num_t=parseInt(num_t);
                if (num_t>0){
                    blstr=blstr+' +'+num_t+'" target=_blank>'+str_t+' '+num_t+'</a>';
                }
                else {
                    blstr=blstr+'" target=_blank>'+str_t+' </a>';
                }
            }
            else {
                blstr=blstr+'" target=_blank>'+str_t+' </a>';
            }
        }    
        return blstr;
    }
    
    function sub_format_lines_kltxt_b_a_line(cslist,cshidelineno=false,csklwiki_format=false,remote_host='',imgpath='',is_digest=false,isbold=false){
        var blstr=cslist[0];
        var csxl=cslist[1];
        var menu_t='';
        if (csbookno_global_b>=0 && (csbooklist_sub_global_b[csbookno_global_b][0].substring(0,6)=='klwiki' || csbooklist_sub_global_b[csbookno_global_b][0].slice(-6,).toLowerCase()=='klwiki')){
            if (blstr.includes('<') || blstr.includes('>')){
                blstr=blstr.replace(new RegExp("<","g"),"&lt;");
                blstr=blstr.replace(new RegExp(">","g"),"&gt;");
            }
            if (csklwiki_format){
                blstr=wiki_line_b(blstr,remote_host+'/wikiuploads/');
            }            
        }
        if (csbookno_global_b>=0 && (csbooklist_sub_global_b[csbookno_global_b][1]=='圣经和合本' || csbooklist_sub_global_b[csbookno_global_b][1]=='Bible(kjv)')){
            blstr=sub_format_lines_kltxt_b_bible(blstr);
        }
        else if (is_digest===false && csxl<100 && blstr.length<50){
            menu_t=' <span class="txtsearch_kltxt_lineno" style="cursor:pointer;'+(cshidelineno?'display:none;':'')+'" onclick=\'javascript:search_next_kltxt_b('+csxl+',"'+blstr+'");\'>⇓</span>';
        }
        
        if (csklwiki_format && blstr.match(/<jsdocimg>(.*?)<\/jsdocimg>/)!==null){
            blstr=blstr.replace(new RegExp(/<jsdocimg>(.*?)<\/jsdocimg>/,'g'),'<img src="'+imgpath+'$1" />');
        }
        blstr='<span class="txt_content">'+blstr+'</span>';
        if (isbold){
            blstr='<big><strong>'+blstr+'</strong></big>';
        }

        blstr=blstr+' <span class="txtsearch_kltxt_lineno" style="cursor:pointer;font-style: italic;'+(cshidelineno?'display:none;':'')+'" onclick="javascript:getlines_kltxt_b('+(csxl+1)+');">('+(csxl+1)+')</span>';
        blstr=blstr+menu_t;
        return blstr;
    }

    //---------
    var t0 = performance.now();
    if (csstyle==''){
        csstyle='color:'+scheme_global['color'];
    }
    
    var ohideno=document.getElementById('check_hide_no');
    if (ohideno){
	    var cshideno=ohideno.checked;
    }
    else {
        var cshideno=true;
    }
    var ohidelineno=document.getElementById('check_hide_lineno');
    if (ohidelineno){
	    var cshidelineno=ohidelineno.checked;
    }
    else {
        var cshidelineno=true;
    }
    var owikiformat=document.getElementById('check_klwiki_format');
    if (owikiformat){
	    var csklwiki_format=owikiformat.checked;
    }
    else {
        var csklwiki_format=true;
    }
    
    var bljg='';
    var remote_host=local_storage_get_b('kl_remote_host',-1,false);
    var is_digest=location.href.includes('digest.htm');
    
    var imgpath='';
    if (csbookno_global_b>=0){
        if (csbooklist_sub_global_b[csbookno_global_b][4].includes('L')){
            imgpath=book_path_b(csbooklist_sub_global_b[csbookno_global_b][3])+'images/'+csbookname_global+'/';
        }
        else {
            imgpath=book_path_py_b('images',csbooklist_sub_global_b[csbookno_global_b][3])+csbookname_global+'/';
        }
    }

    var html_keys=['table','tr','th','td','ul','ol','li','div'];
    var opened_keys=[];
    
    var menu_no_list=[];
    var obold=document.getElementById('input_menu_bold');
    if (obold && obold.checked){
        for (let item of kltxt_menulist_index_global){
            menu_no_list.push(item[0]);
        }
    }
    for (let item of cslist){
        //item 为 [ "玉亭失望地见他哥快上了土坡，就又轻轻喊叫了一声：“哥，你先等一等……”", 380 ] 这样的数组 - 保留注释
        if (item[1]+1==csaname){
            bljg=bljg+'<a name="a_raw_line_number" id="a_raw_line_number_'+csaname+'"></a>';
        }

        var hide_p_li='';
        var only_html_key=null;
        if (item[0].substring(0,1)=='<'){
            for (let one_key of html_keys){
                if (['<'+one_key+' ','<'+one_key+'>'].includes(item[0].substring(0,1+one_key.length+1))){
                    hide_p_li=one_key;
                    opened_keys.push(one_key);
                    break;
                }
                else if ('</'+one_key+'>'==item[0].substring(0,2+one_key.length+1)){
                    hide_p_li='/';
                    var blat=opened_keys.lastIndexOf(one_key);
                    if (blat>=0){
                        opened_keys.splice(blat,1);
                    }
                    break;
                }
            }
            if (hide_p_li!==''){
                only_html_key=item[0].match(/^<[^<>]+>$/);
            }
        }
        
        var blleft='';
        var blright='';        
        if (hide_p_li==''){ //如果含有指定的html key，则不添加 p 或 li。不能使用 opened_keys.length==0，因为表格内部需要换行 - 保留注释
            if (cshideno){
                blleft='<p style="'+csstyle+';">';
                blright='</p>';
            }
            else{
                blleft='<li style="'+csstyle+';">';
                blright='</li>';
            }
        }
        if (only_html_key==null){
            bljg=bljg+blleft+sub_format_lines_kltxt_b_a_line(item,cshidelineno,csklwiki_format,remote_host,imgpath,is_digest,menu_no_list.includes(item[1]))+blright;
        }
        else {
            bljg=bljg+item[0];  //如一行只有html key，如<td>，则不做修饰 - 保留注释
        }
    }
    
    //收回html key - 保留注释
    opened_keys.reverse(); 
    for (let item of opened_keys){
        bljg=bljg+'</'+item+'>';
    }
    console.log('format_lines_kltxt_b() 费时：'+(performance.now() - t0) + " milliseconds");
    return bljg;
}

function a_raw_number_kltxt_b(){
    var blnum=1;
    var oa=document.querySelector('a[id^="a_raw_line_number_"]');
    if (oa){
        blnum=parseInt(oa.id.split('a_raw_line_number_')[1]);
    }
    return blnum;
}

function absearch_kltxt_b(csword='',csreg=-1,csonlyone=false){
	var csnum=arguments.length;
	if (csnum==0 || csword==''){
        var csword= document.getElementById('input_search').value.trim();
    }
	document.getElementById('input_search').value=csword;

	if (csnum<=1 || csreg==-1){
        var csreg=document.getElementById('input_reg').checked;
    }
	document.getElementById('input_reg').checked=csreg;

	if (csword==''){return;}

	var start_lineno;
	var end_lineno;
    var csmaxlines;
    [start_lineno,end_lineno,csmaxlines]=start_end_lineno_kltxt_b();
    
	var cshideno=document.getElementById('check_hide_no').checked;

    //这样才能更新搜索关键字
	books_b(false,'txt',book_tag_global);
	
	klwiki_syntaxhighlight_global=false;
	
	var bljg='';
    var list_t=[];
	var blcount=0;
    //ablist 是条件组 - 保留注释
    var ablist=csword.trim().split(';');
    for (let blxl=0;blxl<ablist.length;blxl++){
        //每个条件字符串转化为数组 - 保留注释
	    ablist[blxl] = [ablist[blxl].trim().split(' '),[]];
    }
    var breakfor=false;
	for (let blxl=start_lineno;blxl<end_lineno;blxl++){
		var bltmp = filelist[blxl];
		var blfound=false;
        
        //对每一行内容，遍历条件组 - 保留注释
        for (let bly=0;bly<ablist.length;bly++){
            blfound=str_reg_search_b(bltmp,ablist[bly][0],csreg);
            if (blfound==-1){
                breakfor=true;
                break;
            }
            
            if (blfound){
                //储存行内容和行号 - 保留注释
                ablist[bly][1]=[bltmp,blxl];
                if (bly<ablist.length-1){
                    //将剩余的列表改为空列表 - 保留注释
                    for (var blz=bly+1;blz<ablist.length;blz++){
                        ablist[blz][1]=[];
                    }
                    break;
                }
            }
            //搜索到最后一个查询关键字时 - 保留注释
            if (bly==ablist.length-1){
                var match_t=true;
                //如果存储的行内容为空 - 保留注释
                if (ablist[ablist.length-1][1][0]==''){
                    match_t=false;
                }
                else {
                    //如果存在一项搜索结果为空列表 - 保留注释
                    for (var blz=0;blz<ablist.length;blz++){
                        if (ablist[blz][1].length==0){
                            match_t=false;
                            break;
                        }
                    }
                }
                if (match_t){
                    //循环一边当前存储的值 - 保留注释
                    for (var blz=0;blz<ablist.length;blz++){
                        if (ablist[blz][1][0]==''){continue;}
                        list_t.push([ablist[blz][1][0],ablist[blz][1][1]]);
                        if (csonlyone){
                            ablist[blz][1]=[];
                        }
                        else {
                            //消除存储的行内容，但不把列表改为空列表 - 保留注释
                            ablist[blz][1][0]='';
                        }
                        blcount=blcount+1;
                        if (blcount>=csmaxlines){
                            breakfor=true;
                            break;
                        }
                    }
                }
            }
        }
        
        if (breakfor){
            break;
        }
	}
	bljg=bljg+format_lines_kltxt_b(list_t);
	var blhtml = document.getElementById('divhtml');
	if (cshideno){
        blhtml.innerHTML='<div>'+bljg+'</div>';
    }
	else{
        blhtml.innerHTML='<ol>'+bljg+'</ol>';
    }
    sup_kleng_words_b();
	return;
}

function en_lines_days_kltxt_b(theday=new Date()){
    function sub_en_lines_days_kltxt_b_h3(csday,line_count_t,wordcount_t){
        var daystr_t=csday.getFullYear()+"-" + ('0'+(csday.getMonth()+1)).slice(-2) + "-" + ('0'+csday.getDate()).slice(-2)+' 星期'+['日','一','二','三','四','五','六'][csday.getDay()];
        var bljg='';
        if (csbookname_global=='klwiki_en'){
            bljg=bljg+'<h3>'+daystr_t+' ('+line_count_t+'行 '+wordcount_t+'词)</h3>'; 
        }
        else {
            bljg=bljg+'<h3>'+daystr_t+' ('+line_count_t+'行)</h3>'; 
        }
        return bljg;
    }
    
    function sub_en_lines_days_kltxt_b_div(blenstr_t){
        var bljg='';
        var englist_t=blenstr_t.match(/<sup style="font-size:0.8rem;color:#cc0000;" class="kleng">(.*?)<\/sup>/g);
        if (englist_t==null){return '';}
        for (let blxl=0;blxl<englist_t.length;blxl++){
            englist_t[blxl]=englist_t[blxl].replace(new RegExp(/<sup style="font-size:0.8rem;color:#cc0000;" class="kleng">(.*?)<\/sup>/,'g'),'$1');
        }
        bljg=bljg+enwords_batch_div_b(englist_t);    
        return bljg;
    }
    //--------------
    var cscount=Math.ceil(filelist.length/365);
    
    var today_t=validdate_b(theday,false,true);
    if (today_t==false){
        today_t=new Date();
    }

    //不含当月的今年累计天数+当月已过天数 - 保留注释
    //var csday2=months_b(today_t.getMonth()+1-1)+today_t.getDate();

	var csday = new Date(today_t.getFullYear(),0,1); //1月1日 - 保留注释

	var bljg='';
	var blenstr_t='';
	var wordcount_t=0;
	var en_count_t=0;
	var line_count_t=0;

    var today_t_str=date2str_b('',today_t);
	var blxl=0;
    var remote_host=local_storage_get_b('kl_remote_host',-1,false);
	for (let blstr of filelist){
		if ((csbookname_global=='klwiki_en' || csbookname_global=='klwiki_en2') && blxl>0 && blxl%cscount==0){
			if (date2str_b('',csday)==today_t_str){
                bljg=bljg+sub_en_lines_days_kltxt_b_h3(csday,line_count_t,wordcount_t);
    	        bljg=bljg+blenstr_t;
                bljg=bljg+sub_en_lines_days_kltxt_b_div(blenstr_t);
                break;
            }
			csday.setTime(csday.getTime()+24*60*60*1000);
			wordcount_t=0;
			blenstr_t='';
			line_count_t=0;
		}
		
		en_count_t=(blstr.match(/&lt;eword /g) || []).length;
		if (en_count_t==0){
            en_count_t=(blstr.match(/kleng/g) || []).length;
        }
		wordcount_t =wordcount_t + en_count_t;
		
        blenstr_t=blenstr_t+'<p style="font-size:1.1rem;"><span class="txt_content">';
	    blenstr_t=blenstr_t+(line_count_t+1)+'. ';
        blenstr_t=blenstr_t+wiki_line_b(blstr,remote_host+'/wikiuploads/')+'</span>';
        
        if (csbookname_global=='klwiki_en'){
            blenstr_t=blenstr_t+'<sub>('+wordcount_t+')</sub>';
        }
        blenstr_t=blenstr_t+'</p>';
		
		blxl=blxl+1;
		line_count_t=line_count_t+1;
	}
    
    var pages='<p>';
    for (let blxl=4;blxl>=1;blxl--){
        var day_temp=previous_day_b(today_t,blxl);
        pages=pages+'<a class="aclick" href="javascript:void(null);" onclick="javascript:en_lines_days_kltxt_b(\''+day_temp+'\');">'+day_temp.slice(-5,)+'</a> ';
    }
    var day_temp=date2str_b('-',today_t);
    pages=pages+'<a class="aclick" href="javascript:void(null);" onclick="javascript:en_lines_days_kltxt_b(\''+day_temp+'\');"><font color="'+scheme_global['a-hover']+'">'+day_temp.slice(-5,)+'</font></a> ';
    for (let blxl=1;blxl<=4;blxl++){
        var day_temp=next_day_b(today_t,blxl);
        pages=pages+'<a class="aclick" href="javascript:void(null);" onclick="javascript:en_lines_days_kltxt_b(\''+day_temp+'\');">'+day_temp.slice(-5,)+'</a> ';
    }
    pages=pages+'<a class="aclick" href="javascript:void(null);" onclick="javascript:en_lines_days_kltxt_b();">今日</a> ';
    pages=pages+'<a class="aclick" href="javascript:void(null);" onclick="javascript:en_lines_position_kltxt_b();">指定日期</a>';
    pages=pages+'</p>';
	document.getElementById('divhtml').innerHTML = bljg+pages;
    sup_kleng_words_b();
    document.location.href="#content";
}

function en_lines_position_kltxt_b(){
    var blday=(prompt('输入指定日期') || '').trim();
    if (blday==''){return;}
    en_lines_days_kltxt_b(blday);
}

function decode_and_create_menu_kltxt_b(){
    if (csbooklist_sub_global_b.length>0 && csbooklist_sub_global_b[csbookno_global_b][4].includes('*')){
         for (let item in filelist){
             if (filelist[item].includes('~~')){
                filelist[item]=de_confuse_str_b(filelist[item]); 
            }
        }
    }

    if (csbookname_global.substring(0,6)=='klwiki' && menulist.length==0){
         for (let item in filelist){
             if (filelist[item].substring(0,7)=='<title>' && filelist[item].slice(-8)=='</title>') {
                menulist.push(filelist[item]);
            }
        }
    }

    document.getElementById('linecount').innerHTML='('+filelist.length+'行)';
    document.getElementById('readingdata').innerHTML='';
}

function args_kltxt_b(cskeys){
    for (let bltmpstr of cskeys){
        bltmpstr=bltmpstr.trim();
        if (bltmpstr.substring(0,5)=='line='){
            var blno_lines=bltmpstr.substring(5,).split('_'); //30_20
            if (blno_lines.length>1){
                getlines_kltxt_b(parseInt(blno_lines[0]), parseInt(blno_lines[1]));
            }
            else{
                getlines_kltxt_b(parseInt(blno_lines[0]));
            }
            break;
        }
        
        if (bltmpstr.substring(0,2)=='s='){
            var bls_reg=bltmpstr.substring(2,).trim(); //河流_reg

            if (bls_reg.slice(-4)=='_reg'){
                txtsearch_kltxt_b(bls_reg.substring(0,bls_reg.length-4),true);
            }
            else {
                txtsearch_kltxt_b(bls_reg);
            }
            break;
        }
        
        if (bltmpstr.substring(0,3)=='s1='){//返回搜索得到的第一条记录的阅读页面 - 保留注释
            txtsearch_one_kltxt_b(bltmpstr.substring(3,).trim());
            break;
        }
        
        if (location.href.match(/\/(txtlistsearch|digest)\.htm\?/)==null){continue;}
                
        if (bltmpstr.substring(0,3)=='sc='){
            var bls_reg=bltmpstr.substring(3,).trim(); //河流_reg
            if (bls_reg.slice(-4)=='_reg'){
                txtsearch_kltxt_b(bls_reg.substring(0,bls_reg.length-4),true,true);
            }
            else {
                txtsearch_kltxt_b(bls_reg,false,true);
            }

            break;
        }
        if (bltmpstr.substring(0,3)=='ab='){
            var bls_reg=bltmpstr.substring(3).trim(); //河流_reg
            if (bls_reg.slice(-4)=='_reg'){
                absearch_kltxt_b(bls_reg.substring(0,bls_reg.length-4),true,false);
            }
            else {
                absearch_kltxt_b(bls_reg,false,false);
            }
            break;
        }
        if (bltmpstr.substring(0,4)=='ab1='){
            var bls_reg=bltmpstr.substring(4,).trim(); //河流_reg
            if (bls_reg.slice(-4)=='_reg'){
                absearch_kltxt_b(bls_reg.substring(0,bls_reg.length-4),true,true);
            }
            else {
                absearch_kltxt_b(bls_reg,false,true);
            }
            break;
        }    
    }
    recent_search_kltxt_b('',true);
}

function import_book_kltxt_b(cskeys,csrandom=false){
    if (cskeys.length>0){
        var list_t=cskeys[0].split('_tag');
        csbookname_global=list_t[0];
        if (list_t.length>=2){
            book_tag_global=list_t[1];
        }
        if (csbookname_global.substring(0,4)=='_tag'){
            book_tag_global=csbookname_global.substring(4,);
            csbookname_global='';
        }
    }
    //-------
    book_makelist_b(book_tag_global);
    if (csbookname_global=='' || csbookname_global=='0'){
        if (book_tag_global=='' || book_tag_global=='all' || csrandom==true){
            csbookno_global_b=Math.min(csbooklist_sub_global_b.length-1,Math.max(0,(csbooklist_sub_global_b.length*Math.random()).toFixed(0)));
        }
        else {
            csbookno_global_b=0;
        }
        if (csbooklist_sub_global_b.length>0){
            csbookname_global=csbooklist_sub_global_b[csbookno_global_b][0];
        }
    }

    if (csbookno_global_b<=0){
        if (csbookname_global==''){
            csbookno_global_b=0;
        }
        else {
            var blfound=false;           
            for (let blxl=0;blxl<csbooklist_sub_global_b.length;blxl++){
                if (csbooklist_sub_global_b[blxl][0]==csbookname_global){
                    csbookno_global_b=blxl;
                    blfound=true;
                    break;
                }
            }
            
            if (blfound===false){
                //此次添加不在数组中的书籍 - 保留注释
                //csbookname_global 格式：id-name-jsdoc号-是否解密 - 保留注释
                var list_t=csbookname_global.split('-');
                csbookname_global=list_t[0];
                var bname=csbookname_global;
                if (list_t.length>=2){
                    bname=list_t[1];
                }
                var jsdoc_no='1';
                if (list_t.length>=3){
                    jsdoc_no=list_t[2];
                }
                var do_decode='';
                if (list_t.length>=4){
                    do_decode=list_t[3];
                }
                book_makelist_b(csbookname_global);
                csbooklist_sub_global_b.push([csbookname_global,bname,csbookname_global,jsdoc_no,do_decode]);
                csbookno_global_b=csbooklist_sub_global_b.length-1;
            }
        }
    }
    import_book_js_b();
    if (csbooklist_sub_global_b.length>0){
        document.getElementById('booktitle').innerHTML=(parseInt(csbookno_global_b)+1)+'.'+csbooklist_sub_global_b[csbookno_global_b][1]+' <span id="linecount" style="font-size:0.7rem;font-style: italic;"></span>';
        document.getElementById('readingdata').innerHTML=' - 正在读取数据...';
        document.title=(location.href.includes('digest.htm')?'🗃 ':'')+csbooklist_sub_global_b[csbookno_global_b][1]+" - TXT文本搜索";
    }
    else {
        document.getElementById('booktitle').innerHTML=' <span id="linecount" style="font-size:0.7rem;font-style: italic;"></span>';
    }
}

function start_end_lineno_kltxt_b(){
    var ostart=document.getElementById('input_start_lineno');
    var oend=document.getElementById('input_end_lineno');
	var start_lineno = 0;
    if (ostart){
        var blvalue=parseInt(ostart.value);
        if (!isNaN(blvalue)){
            start_lineno=Math.max(0,blvalue-1);
        }
    }
	var end_lineno = filelist.length;
    if (oend){
        var blvalue=parseInt(oend.value);
        if (!isNaN(blvalue) && blvalue>0){
            end_lineno=Math.min(blvalue,end_lineno);
        }
    }
    
    var omax=document.getElementById('input_max_lines');
    var blmax=500;
    if (omax){
        blmax=parseInt(omax.value);
    }
    return [start_lineno,end_lineno,blmax];
}

function digest_number_2_txt_kltxt_b(){
    if (digest_scan_hash_global){return;}
    var t0 = performance.now();
    var bllen=filelist.length;
    for (let blxl=0;blxl<digest_global.length;blxl++){
        var item=digest_global[blxl];
        if (item.length>=2 && item.substring(0,1)=='#' && item.slice(-1)=='#'){
            item=parseInt(item.slice(1,-1));
            if (!isNaN(item) && item>=0 && item<bllen){
                digest_global[blxl]=filelist[item];
            }
        }
    }
    digest_scan_hash_global=true;
    console.log('digest_number_2_txt_kltxt_b() 费时：'+(performance.now() - t0) + " milliseconds");
}

function digest_lines_kltxt_b(){
    var t0 = performance.now();
	var start_lineno;
	var end_lineno;
    var blmax;
    [start_lineno,end_lineno,blmax]=start_end_lineno_kltxt_b();

    var cshideno=document.getElementById('check_hide_no').checked;
    
    var list_t=[];
    var blcount=0;
    digest_number_2_txt_kltxt_b();
    
    var scanned_number=new Set();
    for (let one_digest of digest_global){
        if (one_digest=='' || one_digest.substring(0,1)=='#'){continue;}

        var all_scanned=true;
        var blfound=false;
        for (let blxl=start_lineno;blxl<end_lineno;blxl++){
            if (scanned_number.has(blxl)){continue;}
            all_scanned=false;
            if (filelist[blxl].includes(one_digest)){
                list_t.push([filelist[blxl],blxl]);
                blfound=true;
                scanned_number.add(blxl);
                break;  
            }
        }
        if (blfound){
            blcount=blcount+1;
            if (blcount>=blmax){break;}        
        }
        if (all_scanned){
            console.log('all_scanned');
            break;
        }
    }

	var bljg=format_lines_kltxt_b(list_t);

	var odiv = document.getElementById('divhtml');
	if (cshideno){
        odiv.innerHTML='<div>'+bljg+'</div>';
    }
	else{
        odiv.innerHTML='<ol>'+bljg+'</ol>';
    }
    sup_kleng_words_b();
    digest_show_kltxt_b();
    console.log('digest_lines_kltxt_b() 费时：'+(performance.now() - t0) + " milliseconds");
}

function digest_show_kltxt_b(){
    digest_number_2_txt_kltxt_b();
    var digest_len=digest_global.length;
    if (digest_len.length==0){return;}
    var oinput=document.getElementById('input_digest');
    if (!oinput){return;}
    if (oinput.checked==false){return;}    
    var t0 = performance.now();
    var ospans=document.querySelectorAll('div#divhtml span.txt_content');

    digest_list=[].concat(digest_global);
    for (let blno=0;blno<digest_len;blno++){
        if (digest_list[blno].substring(0,1)=='#'){// && digest_list[blno].slice(-1)!=='#'){
            digest_list[blno]='';   //忽略开头为 # 的 摘要 - 保留注释
        } 
    }
    
    var line_no_list=[];    
    for (let blxl=0;blxl<ospans.length;blxl++){
        line_no_list.push('');
        var oldtxt=ospans[blxl].innerText;
        var oldhtml=ospans[blxl].innerHTML;
        var newhtml=oldhtml;
        for (let blno=0;blno<digest_len;blno++){
            var one_digest=digest_list[blno];
            var is_whole_line=false;
            if (one_digest==''){continue;}
            if (!newhtml.includes(one_digest)){
                if (one_digest.substring(0,1)!=='#' || one_digest.slice(-1)!=='#'){continue;}
                if (line_no_list[blxl]==''){
                    var oline_no=ospans[blxl].parentNode.querySelector('span.txtsearch_kltxt_lineno');
                    if (!oline_no){continue;}
                    line_no_list[blxl]=(parseInt(oline_no.innerText.slice(1,-1))-1).toString();
                }
                if (line_no_list[blxl]!==one_digest.slice(1,-1)){
                    continue;
                }
                else {
                    one_digest=oldtxt;
                    is_whole_line=true;
                }
            }
         
            newhtml=newhtml.replace(one_digest,'<span style="font-weight:bold;border-bottom:0.15rem solid '+scheme_global['pink']+';">'+one_digest+'</span>');
            digest_list[blno]='';
            if (is_whole_line){break;}
        }
        ospans[blxl].innerHTML=newhtml;
        if (ospans[blxl].innerText!==oldtxt){//list_t[blxl]){
            ospans[blxl].innerHTML=oldhtml;
            ospans[blxl].insertAdjacentHTML('afterend','💡');
        }
    }
    console.log('digest_show() 费时：'+(performance.now() - t0) + " milliseconds");
}

function digest_temp_load_kltxt_b(){
    var list_t=local_storage_get_b('digest_temp_txtlistsearch',-1,true);
    var new_full_list=[];
    var bllen=csbookname_global.length;
    for (let item of list_t){
        item=item.trim();
        if (item==''){continue;}
        if (item.substring(0,bllen+1)==csbookname_global+':'){
            item=item.substring(bllen+1,).trim();
            if (digest_global.includes(item)){continue;}
            digest_global.push(item);
            new_full_list.push(csbookname_global+':'+item);
        }
        else {
            new_full_list.push(item);
        }
    }
    if (list_t.join('\n')!==new_full_list.join('\n')){
        localStorage.setItem('digest_temp_txtlistsearch',new_full_list.join('\n'));
    }
    digest_enwords_get_book_b();    //添加英语单词 - 保留注释
}

function fix_divhtml2_kltxt_b(do_fix=true,ospan=false){
    var otemp=document.getElementById('div_temp_space');
    if (otemp){
        otemp.parentNode.removeChild(otemp);
    }
    var odiv=document.getElementById('divhtml2');
    if (do_fix){
        var rect =odiv.getBoundingClientRect();
        odiv.insertAdjacentHTML('afterend','<div id="div_temp_space" style="height:'+rect.height+'px;"></div>');
        if (ismobile_b()){
            var blmargin='width:100%;';
        }
        else {
            var blmargin='margin-left:10%;margin-right:10%;max-width:'+Math.max(700,parseInt(document.body.clientWidth*0.5))+'px;';
        }
        odiv.style.cssText='position:fixed;bottom:0;'+blmargin+'padding:0.1rem;height:auto;background-color:'+scheme_global['background']+';border-top:0.2rem solid '+scheme_global['shadow']+';';    
    }
    else {
        odiv.style.cssText='';
        odiv.scrollIntoView();
    }
    if (ospan){
        ospan.innerText=(ospan.innerText=='固定'?'不固定':'固定');
    }

    var op=document.getElementById('p_temp_digest_bottom_buttons');
    if (op){
        op.style.display=(do_fix?'none':'');
    }    
    var omenu=document.getElementById('menu_temp_digest');
    if (omenu){
        omenu.style.display=(do_fix?'none':'');
    }    
}

function digest_temp_add_kltxt_b(do_fix=false){
    fix_divhtml2_kltxt_b(false);
    var list_t=local_storage_get_b('digest_temp_txtlistsearch',-1,true);
    var postpath=postpath_b();
	var bljg='<form method="POST" action="'+postpath+'temp_txt_share.php" name="form_digest_textarea" target=_blank style="margin-left:0.5rem;">\n';
    bljg=bljg+'<p id="p_digest_button" style="font-size:0.9rem;line-height:1.5rem;margin-top:0.2rem;">';
    bljg=bljg+textarea_buttons_b('textarea_digest_txtlistsearch','清空','','','oblong_box');
    bljg=bljg+'<span class="oblong_box" onclick="javascript:digest_temp_update_kltxt_b();">➕临时摘要</span> ';
    bljg=bljg+'<span class="oblong_box" onclick="javascript:digest_temp_jump_to_line_kltxt_b();">返回阅读</span> ';
    bljg=bljg+'<span class="oblong_box" id="span_digest_temp_fix" onclick="javascript:fix_divhtml2_kltxt_b(this.innerText==\'固定\',this);">固定</span> '; 
    bljg=bljg+'<span id="span_current_book_temp_digest_count"></span>';     
    bljg=bljg+'</p>';
    bljg=bljg+'<textarea name="textarea_digest_txtlistsearch" id="textarea_digest_txtlistsearch" style="height:4rem;">';
    for (let item of list_t){
        bljg=bljg+'\n';
    }
    bljg=bljg+'</textarea>';
    bljg=bljg+'<p id="p_temp_digest_bottom_buttons" style="font-size:0.9rem;line-height:1.5rem;margin-top:0.2rem;">';
    bljg=bljg+'<span class="oblong_box" onclick="javascript:document.getElementById(\'divhtml2\').innerHTML=\'\';">关闭</span> ';       
    bljg=bljg+textarea_buttons_b('textarea_digest_txtlistsearch','全选,复制,发送到临时记事本,发送地址','','','oblong_box')+' 行数：'+list_t.length+' <span id="span_digest_temp_status"></span></p>';    
    bljg=bljg+'</form>\n';
    var odiv=document.getElementById('divhtml2');
    odiv.innerHTML=bljg;
    mouseover_mouseout_oblong_span_b(odiv.querySelectorAll('span.oblong_box'));

    var str_t=klmenu_hide_b('');
    var digest_menu=[
    '<span class="span_menu" onclick="javascript:'+str_t+'digest_temp_show_kltxt_b();">显示当前书籍临时摘要</span>',
    '<span class="span_menu" onclick="javascript:'+str_t+'digest_temp_show_kltxt_b(true);">显示全部临时摘要</span>',
    '<span class="span_menu" onclick="javascript:'+str_t+'digest_temp_delete_kltxt_b(true);">清除当前书籍所有临时摘要</span>',
    '<span class="span_menu" onclick="javascript:'+str_t+'digest_temp_delete_kltxt_b();">清除当前书籍最新添加的一条临时摘要</span>',
    ];
    document.getElementById('p_digest_button').insertAdjacentHTML('afterbegin',klmenu_b(digest_menu,'🔻','21rem','0.8rem','0.9rem','','','menu_temp_digest')+' ');
    
    if (do_fix){
        var ospan=document.getElementById('span_digest_temp_fix');
        if (ospan){
            fix_divhtml2_kltxt_b(true,ospan);
        }
    }
    location.href="#divhtml2";
}

function digest_temp_jump_to_line_kltxt_b(){
    var otextarea=document.getElementById('textarea_digest_txtlistsearch');
    if (!otextarea){return;}
    
    var blstr=otextarea.value.trim().split('\n').slice(-1)[0];  //最后一行的字符串 - 保留注释
    if (blstr==''){
        location.href='#divhtml';
        return;
    }
    var blstr2=blstr.replace(new RegExp(/^#*/,'g'),'').trim();
    
    var ospans=document.querySelectorAll('div#divhtml span.txt_content');
    for (let item of ospans){
        if (item.innerText.includes(blstr) || blstr2!=='' && item.innerText.includes(blstr2)){
            item.scrollIntoView();
            break;
        }
    }
}

function digest_excluded_kltxt_b(){
    digest_number_2_txt_kltxt_b();
    var excluded_list=[];
    var bllen=filelist.length-1;
    for (let item of digest_global){
        item=item.trim();
        if (item==''){continue;}
        var blfound=false;
        for (let one_row of filelist){
            if (one_row.includes(item)){
                blfound=true;
                break;
            }
        }
        if (blfound===false){
            excluded_list.push(item);
            if (excluded_list.length>=500){break;}
        }
    }
    
    list_t=[].concat(digest_global);
    list_t.sort();
    var blstr='';
    var duplication=new Set();
    for (let item of list_t){
        if (item==blstr){
            duplication.add(item);
        }
        else {
            blstr=item;
        }
    }
    document.getElementById('divhtml').innerHTML='<h4>未包含的摘要</h4>'+array_2_li_b(excluded_list,'li','ol')+(excluded_list.length>=500?'<p>超长省略...</p>':'')+'<h4>重复的摘要</h4>'+array_2_li_b(Array.from(duplication),'li','ol');
}

function digest_temp_show_kltxt_b(is_all=false){
    var otextarea=document.getElementById('textarea_digest_txtlistsearch');
    if (!otextarea){return;}
    
    var list_t=local_storage_get_b('digest_temp_txtlistsearch',-1,true);
    var new_full_list=[];
    var new_current_list=[];
    var bllen=csbookname_global.length;
    for (let item of list_t){
        item=item.trim();
        if (item==''){continue;}
        if (item.substring(0,bllen+1)==csbookname_global+':'){
            item=item.substring(bllen+1,).trim();
            new_full_list.push(csbookname_global+':'+item);
            new_current_list.push(item);
        }
        else {
            new_full_list.push(item);
        }
    }
    
    if (is_all){
        otextarea.value=new_full_list.join('\n');
    }
    else {
        otextarea.value=new_current_list.join('\n');
    }
}

function digest_temp_delete_kltxt_b(isall=false){
    var otextarea=document.getElementById('textarea_digest_txtlistsearch');
    if (!otextarea){return;}
    
    var list_t=local_storage_get_b('digest_temp_txtlistsearch',-1,true);
    var new_full_list=[];
    var current_book_list=[];
    var bllen=csbookname_global.length;
    for (let item of list_t){
        item=item.trim();
        if (item==''){continue;}
        if (item.substring(0,bllen+1)==csbookname_global+':'){
            current_book_list.push(item);
            continue;
        }
        new_full_list.push(item);
    }
    if (current_book_list.length>0){
        var rndstr=randstr_b(4,true,false);
        var do_change=false;
        if (isall){
            if ((prompt('输入 '+rndstr+' 确认清空当前书籍的临时摘要'+current_book_list.length+'条') || '').trim()==rndstr){
                do_change=true;
            }
        }
        else {
            if ((prompt('输入 '+rndstr+' 确认清空当前书籍的最新一条临时摘要\n'+current_book_list.slice(-1)[0]) || '').trim()==rndstr){
                new_full_list=new_full_list.concat(current_book_list.slice(0,-1));
                do_change=true;
            }
        }
        if (do_change){
            localStorage.setItem('digest_temp_txtlistsearch',new_full_list.join('\n'));
            alert('原有各书籍临时摘要共'+list_t.length+'条，现有'+new_full_list.length+'条');
        }
    }
}

function digest_temp_update_kltxt_b(){
    var otextarea=document.getElementById('textarea_digest_txtlistsearch');
    if (!otextarea){return;}
    var blstr=otextarea.value.trim();
    if (blstr.includes(csbookname_global+':')){return;}
    
    var list_t=blstr.split('\n');
    var digest_list=local_storage_get_b('digest_temp_txtlistsearch',-1,true);
    var blxl=0;
    var last_row='';
    for (let one_row of list_t){
        one_row=one_row.trim();
        if (one_row==''){continue;}
        
        if (digest_list.includes(csbookname_global+':'+one_row)){
            continue;
        }
        if (confirm("是否添加临时摘要？\n"+one_row)){
            digest_list.push(csbookname_global+':'+one_row);
            last_row=one_row;
            blxl=blxl+1;
        }
    }
    if (blxl>0){
        localStorage.setItem('digest_temp_txtlistsearch',digest_list.join('\n'));
        document.getElementById('span_digest_temp_status').innerHTML='<span style="background-color:'+rndcolor_b()+';border-radius:1rem;padding-right:1rem;">&nbsp;</span> <font color="'+scheme_global['a']+'"><b>'+now_time_str_b()+'</b></font> 添加了<font color="'+scheme_global['a-hover']+'"><b>'+blxl+'</b></font>条临时摘要('+specialstr92_b(last_row.substring(0,20))+'...)';
        
        digest_list=local_storage_get_b('digest_temp_txtlistsearch',-1,true);
        var blno=0;
        for (let one_row of digest_list){
            if (one_row.indexOf(csbookname_global+':')==0){
                blno=blno+1;
            }        
        }
        document.getElementById('span_current_book_temp_digest_count').innerHTML='('+blno+')';
    }
}

function break_line_kltxt_b(){
    var blkey=document.getElementById('input_search').value.trim();
    var isreg=document.getElementById('input_reg').checked;
    if (blkey.slice(-4,)=='(:r)'){
        isreg=true;
        blkey=blkey.substring(0,blkey.length-4);
        document.getElementById('input_reg').checked=true;
    }    
    if (blkey==''){return;}
    if (isreg){
        try{
            ''.match(blkey);
            ''.replace(new RegExp('('+blkey+')','g'),'\n$1');
        }
        catch (error){
            alert(error.message);
            return;
        }
    }
    
    var result_t=[];
    var unique_t=[];
    if (isreg){
        for (let item of filelist){
            if (item.match(blkey)!==null){
                result_t.push(item.replace(new RegExp('('+blkey+')','g'),'\n$1'));
                unique_t=unique_t.concat(item.match(new RegExp('('+blkey+')','g')));
            }
        }
    }
    else {
        for (let item of filelist){
            if (item.includes(blkey)){
                result_t.push(item.replace(new RegExp('('+blkey+')','g'),'\n$1'));
                unique_t=unique_t.concat(item.match(new RegExp('('+blkey+')','g')));
            }
        }
    }
    
    if (result_t.length==0){return;}
    result_t=result_t.join('\n').split('\n');   //重新分段 - 保留注释

    unique_t=array_unique_b(unique_t);
    unique_t.sort();
    var unique_str='';
    for (let blxl=0;blxl<unique_t.length;blxl++){
        unique_str=unique_str+(blxl+1)+'. '+unique_t[blxl]+'; ';
    }
    
    var bljg=[];    //剔除分段后无关键字的行 - 保留注释
    if (isreg){
        for (let item of result_t){
            if (item.match(blkey)!==null){
                bljg.push(item);
            }
        }
    }
    else {
        for (let item of result_t){
            if (item.includes(blkey)){
                bljg.push(item);
            }        
        }
    }
    bljg.sort(function (a,b){return zh_sort_b(a,b);});
    var blbuttons='<p><span class="aclick" onclick="javascript:document.getElementById(\'divhtml2\').innerHTML=\'\';">Close</span></p>';
    var odiv=document.getElementById('divhtml2');
    odiv.innerHTML='<div style="margin-left:1rem;">'+array_2_li_b(bljg,'li','ol')+'<hr />'+unique_str+blbuttons+'</div>';
    odiv.scrollIntoView();
}
