function init_bookshelf(){
    character_2_icon_b('𝍂');
    top_bottom_arrow_b('div_top_bottom','',false,(ismobile_b()?'1.8rem':'1.6rem'));
    input_with_x_b('input_search',11);
    menu_bookshelf();
    generate_bookshelf();
    show_bookshelf();
    recent_search_bookshelf();
}

function menu_bookshelf(){
    var str_t=klmenu_hide_b('');
    
    var book_tag_list=book_category_b('span_tag',[],'全部','list');

    var klmenu1=[
    '<span id="span_random_sort_bookshelf" class="span_menu" onclick="'+str_t+'klmenu_check_b(this.id,true);">⚪ 随机排序</span>',       
    ];
    for (let item of book_tag_list){
        if (item==''){continue;}
        klmenu1.push('<span class="span_menu" onclick="'+str_t+'show_bookshelf(this.innerText);">'+item+'</span>');
    }

    var klmenu_link=[
    '<a href="https://www.amazon.cn/" onclick="'+str_t+'" target=_blank>亚马逊中国</a>',    
    '<a href="https://book.douban.com/" onclick="'+str_t+'" target=_blank>豆瓣读书</a>',    
    '<a href="https://www.ituring.com.cn/" onclick="'+str_t+'" target=_blank>图灵社区</a>',    
    ];
    
    document.getElementById('span_title').insertAdjacentHTML('beforebegin',klmenu_multi_button_div_b(klmenu_b(klmenu1,'𝍂','12rem','1rem','1rem','30rem')+klmenu_b(klmenu_link,'L','10rem','1rem','1rem','30rem'),'','0rem')+' ');
}

function recent_search_bookshelf(csstr=''){
    recent_search_b('recent_search_bookshelf',csstr,'show_bookshelf','div_recent_search',[],45,false);
}

function generate_bookshelf(){
    var att_path=book_href_check_b(true);
    for (let blxl=0,lent=csbooklist_source_global.length;blxl<lent;blxl++){
        var item=csbooklist_source_global[blxl];
        var is_private=item[4].includes('P');
        var bookpath=book_path_b(item[3],is_private);
        if (is_private){
            var book_cover=bookpath+'cover/'+item[0]+'.jpg';
        } else {
            var book_cover=att_path+'cover'+item[3]+'/'+item[0]+'.jpg';
        }
        var book_address=bookpath+item[0]+'.js'
        book_cover_list_all_global.push([book_cover,blxl]);
    }
    book_cover_list_all_global.sort();
}

function show_bookshelf(cskey=false,israndom=false){
    if (cskey==false){
        cskey=document.getElementById('input_search').value.trim();
    }
    document.getElementById('input_search').value=cskey;

    recent_search_bookshelf(cskey);
    var csreg=false;
    [cskey,csreg]=str_reg_check_b(cskey,csreg,true);     
        
    book_cover_list_current_global=[];

    var img_style=style_card_b('img_bookcover');
    for (let item of book_cover_list_all_global){
		var blfound=(cskey=='' || str_reg_search_b(csbooklist_source_global[item[1]],cskey,csreg));
		if (blfound==-1){break;}

		if (blfound){
            var blstr='<td width="1%" align="center" valign="middle">';
            blstr=blstr+'<a href="reader.htm?'+csbooklist_source_global[item[1]][0]+'&line=1" target=_blank>';
            blstr=blstr+'<img src="'+item[0]+'" '+img_style+' alt="'+specialstr_j(csbooklist_source_global[item[1]][1],true)+'" />';
            blstr=blstr+'</a></td>';
            book_cover_list_current_global.push(blstr);
        }
    }
    if (klmenu_check_b('span_random_sort_bookshelf',false)){
        book_cover_list_current_global.sort(randomsort_b);
    }    
    page_bookshelf(1);
}

function page_bookshelf(csno,books_per_page=-1){
    return page_card_b(book_cover_list_current_global,'page_bookshelf','locate_bookshelf',csno,books_per_page,'table_bookshelf');
}

function locate_bookshelf(cspages,books_per_page){
    var blno=page_location_b(cspages);
    if (blno!==false){
        page_bookshelf((blno-1)*books_per_page+1,books_per_page);
    }
}
