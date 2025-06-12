function split_one_txtcard(csarray,cscount=10,csstr_length=250){
    var bllen=csarray.length;
    if (bllen==0){return [[],[]];}
    if (bllen==1){
        return [[csarray,0],[]];
    }
    var blsub_arr_length=bllen/cscount;
    var blrnd=Math.min(bllen,Math.max(1,parseInt(blsub_arr_length*Math.random())))-1;
    var bljg=[];
    var str_len=0;
    var blxl=blrnd;
    while (true){
        if (str_len>=csstr_length || blxl>=bllen){
            break;
        }    
        bljg.push([csarray[blxl],blxl]);
        str_len=str_len+csarray[blxl].length;
        blxl=blxl+1;
    }
    return [bljg,csarray.slice(blxl+1,)];
} 

function split_all_txtcard(cscount=30,csstr_length=150){
    var list_t=filelist;
    var filelist_len=filelist.length;
    var result_list=[];
    var blstr=[];
    var left_len=0;
    for (let blxl=1;blxl<=cscount;blxl++){
        [blstr,list_t]=split_one_txtcard(list_t,cscount-blxl+1,csstr_length);
        if (blstr.length==0){continue;}

        for (let blxl2=0,lenb=blstr.length;blxl2<lenb;blxl2++){
            blstr[blxl2][1]=left_len+blstr[blxl2][1];
        }
        left_len=filelist_len-list_t.length;
        
        if (list_t.length==0){break;}
        result_list.push(blstr);
    }
    
    var divstyle='padding:0.5rem;margin-bottom:0.5rem; border:0.5rem double '+scheme_global['button']+';border-radius: 2rem;word-break:break-all; word-wrap:break-word;';

    result_list.sort(randomsort_b);
    var bljg='';
    var is_group_file=is_group_file_kltxt_b();
    for (let blxl=0,lent=result_list.length;blxl<lent;blxl++){
        var item=result_list[blxl];
        if (item.length<1){continue;}
        bljg=bljg+'<div class="div_masonry" style="'+divstyle+'">';
        bljg=bljg+'<table width=100%><tr>';
        bljg=bljg+'<td><a href="reader.htm?'+csbookname_global+'_tagall&line='+(item[0][1]+1)+'" style="text-decoration:none;" target=_blank><b>'+(blxl+1)+'</b></a></td>';
        bljg=bljg+'<td align=right><a href="txtlistsearch.htm?'+csbookname_global+'_tagall&line='+(item[0][1]+1)+'" style="text-decoration:none;" target=_blank><font color="'+scheme_global['memo']+'">S</font></a></td>';
        bljg=bljg+'</tr></table>';
        bljg=bljg+format_lines_kltxt_b(item,'',-1,is_group_file);
        bljg=bljg+'</div>';
    }
    document.getElementById('divhtml').innerHTML=bljg;
    bible_title_link_generate_kltxt_b();
    digest_show_kltxt_b();
    img_load_check_kltxt_b();
}

function search_str_txtcard(csstr=''){
    document.getElementById('input_search').value=csstr;
    booksearch_kltxt_b();
}

function recent_search_add_txtcard(){
    var blkey=document.getElementById('input_search').value.trim();
    var blreg=document.getElementById('input_reg').checked;
    recent_search_b('recent_search_reader_card',blkey+(blreg?'_reg':''),'search_str_txtcard','div_recent_search',['-(KLWiki|english)_reg'],20);
    booksearch_kltxt_b();
}

function key_txtcard(){
    var cskeys=href_split_b(location.href);
    for (let item of cskeys){
        if (item.substring(0,4)=='_tag'){
            item=item.substring(4,).trim();
            var blreg=false;
            if (item.slice(-4,)=='_reg'){
                blreg=true;
                item=item.slice(0,-4);
            }

            document.getElementById('input_search').value=item;
            document.getElementById('input_reg').checked=blreg;
            break;
        }
    }
}

function init_txtcard(){
    var style_list=[
    '.txtsearch_kltxt_lineno {color:#707070;font-size:0.8rem}',
    'i {border-bottom:0.15rem dashed tomato;}',
    '#divhtml p{font-size:1rem;line-height:180%;margin-bottom:0.8rem;}',
    '#divhtml img{max-width:100%;}',    
    ];
    
    if (ismobile_b()){
        style_list.push('#divhtml {margin:0.5rem;}');
    } else {
        style_list.push('#divhtml {margin:0rem 0.5rem;column-count:3;}');
    }
    style_generate_b(style_list,true);

    top_bottom_arrow_b('div_top_bottom','',true,(ismobile_b()?'1.7rem':'1.4rem'),true,false,2);

    character_2_icon_b('🗂️️');
    input_with_x_b('input_search',11);
    recent_search_b('recent_search_reader_card','','search_str_txtcard','div_recent_search',[],20);
    split_all_txtcard();
    key_txtcard();
}
