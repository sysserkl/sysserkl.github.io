function wiki_all_format_b(csstr,cstyle='',ismobile=-1,underline=false){
    //先解密 - 保留注释
    var list_t=wiki_code_highlight_b(csstr);
    for (let blxl=0,lent=list_t.length;blxl<lent;blxl++){
        var one_arr=list_t[blxl];
        if (one_arr[1]==1){continue;}
        var blstr=one_arr[0];
        blstr=wiki_de_double_b(blstr);
        blstr=wiki_base64_b(blstr);
        blstr=wiki_strong_b(blstr,underline);
        blstr=wiki_href_b(blstr);
        blstr=wiki_quote_b(blstr);
        blstr=wiki_photo_b(blstr);
        blstr=wiki_ed2k_magnet_b(blstr);
        blstr=wiki_mrt_b(blstr);
        blstr=wiki_ul_b(blstr);
        blstr=wiki_font_color_b(blstr);
        blstr=wiki_website_b(blstr);
        blstr=wiki_sns_b(blstr);
        blstr=wiki_blur_text_b(blstr,ismobile);
        list_t[blxl][0]=blstr;
    }
    var bljg='';
    for (let item of list_t){
        bljg=bljg+item[0];
    }
    return bljg;
}

function wiki_line_b(csstr,attachment_server){
    //for txtlistsearch - 保留注释
    //需要全局变量 klwiki_syntaxhighlight_global - 保留注释
    //attachment_server 形如 http://aaa.bbb.com/xxx/ - 保留注释
    if (typeof klwiki_syntaxhighlight_global=='undefined'){
        klwiki_syntaxhighlight_global=false;
    }
	if (csstr.indexOf('&lt;syntaxhighlight lang=')==0){
		klwiki_syntaxhighlight_global=true;
	}
	if (csstr.slice(-1*'&lt;/syntaxhighlight&gt;'.length)=='&lt;/syntaxhighlight&gt;'){
		klwiki_syntaxhighlight_global=false;
		return csstr;
	}
	if (klwiki_syntaxhighlight_global){
        return csstr;
    }

	//nowiki - 保留注释
	if (csstr.includes('&lt;nowiki&gt;') && csstr.includes('&lt;/nowiki&gt;')){
		list_t=csstr.match(/&lt;nowiki&gt;.*?&lt;\/nowiki&gt;/g);
		for (let blxl=0,lent=list_t.length;blxl<lent;blxl++){
			var tmp_t=list_t[blxl];
			tmp_t=tmp_t.replace(/\[/g,'&#91;');
			tmp_t=tmp_t.replace(/\]/g,'&#93;');
			tmp_t=tmp_t.substring('&lt;nowiki&gt;'.length,tmp_t.length-'&lt;/nowiki&gt;'.length);
			csstr=csstr.replace(list_t[blxl],tmp_t);
		}
	}
	
	csstr=csstr.replace(new RegExp("{{wikiuploads}}","g"),attachment_server);
	//ed2k magnet - 保留注释
    csstr=wiki_ed2k_magnet_b(csstr,'and');
    //photo - 保留注释
    csstr=wiki_photo_b(csstr,'and');
    //mrt - 保留注释
    csstr=wiki_mrt_b(csstr,'and');
    ///搜索引擎 - 保留注释
    csstr=wiki_website_b(csstr,'and');
	//eword - 保留注释
    csstr=enwords_b(csstr);
	//u - 保留注释
	if (csstr.includes('&lt;u&gt;') && csstr.includes('&lt;/u&gt;')){
		csstr=csstr.replace(/&lt;u&gt;(.*?)&lt;\/u&gt;/g,'<u>$1</u>');
	}
	//p - 保留注释
	if (csstr.includes('&lt;p&gt;') && csstr.includes('&lt;/p&gt;')){
		csstr=csstr.replace(/&lt;p&gt;(.*?)&lt;\/p&gt;/g,'<p>$1</p>');
	}
	//sup - 保留注释
	if (csstr.includes('&lt;sup&gt;') && csstr.includes('&lt;/sup&gt;')){
		csstr=csstr.replace(/&lt;sup&gt;(.*?)&lt;\/sup&gt;/g,'<sup>$1</sup>');
	}    
	//sub - 保留注释
	if (csstr.includes('&lt;sub&gt;') && csstr.includes('&lt;/sub&gt;')){
		csstr=csstr.replace(/&lt;sub&gt;(.*?)&lt;\/sub&gt;/g,'<sub>$1</sub>');
	}        
    //quote - 保留注释
	if (csstr.includes('{{quote') && csstr.includes('{{/quote}}') || csstr.includes('{{span') && csstr.includes('{{/span}}')){
		csstr=wiki_quote_b(csstr);
	}
	//br - 保留注释
	if (csstr.includes('&lt;br /&gt;')){
		csstr=csstr.replace(/&lt;br \/&gt;/g,'<br />');
	}        
	//font - 保留注释
	if (csstr.includes('&lt;font ') && csstr.includes('&lt;/font&gt;')){
		csstr=csstr.replace(/&lt;font (.*?)&gt;(.*?)&lt;\/font&gt;/g,'<font $1>$2</font>');
	}
	//''' - 保留注释
	//'' - 保留注释
	if (csstr.includes("''")){
        csstr=wiki_strong_b(csstr);
	}
	
	//http - 保留注释
    csstr=wiki_href_b(csstr);
    //sns - 保留注释
    csstr=wiki_sns_b(csstr);
    //blur - 保留注释
    csstr=wiki_blur_text_b(csstr);
	return csstr;
}

function wiki_href_b(csstr){
    //show link or img
	//http
    if (csstr.includes('[mailto:') && csstr.includes(']') && csstr.includes(' ')){
        //[mailto:aa@bbc.om xxxx] - 保留注释
        csstr=csstr.replace(/\[(mailto:[^ ]*?) (.*?)\]/ig,'<a href="$1" target=_blank>$2</a>');
    }
    
	if (csstr.includes('http')){
        //[http] no title,just link
		if (csstr.includes('[http') && csstr.includes(']')){
			csstr=csstr.replace(/\[(https?:\/\/[^ ]*?)\]/ig,'<a href="$1" target=_blank>$1</a>');
		}
		//[http ]
		if (csstr.includes('[http') && csstr.includes(']') && csstr.includes(' ')){
			csstr=csstr.replace(/\[(https?:\/\/[^ ]*?) (.*?)\]/ig,'<a href="$1" target=_blank>$2</a>');
		}
		//^http
		if (csstr.indexOf('http')==0){
			csstr=csstr.replace(/(^https?:\/\/[^ ]*?([^\/]*?)\.(jpg|jpeg|png|gif|bmp|webp)) /ig,'<img src="$1" title="$1" /> ');
			csstr=csstr.replace(/(^https?:\/\/[^ ]*?([^\/]*?)\.(jpg|jpeg|png|gif|bmp|webp)$)/ig,'<img src="$1" title="$1" />');
			
			csstr=csstr.replace(/(^https?:\/\/[^ ]+) /ig,'<a href="$1" target=_blank>$1</a> ');
			csstr=csstr.replace(/(^https?:\/\/[^ ]+)/ig,'<a href="$1" target=_blank>$1</a>');
		}
		// http
		if (csstr.includes(' http')){
			csstr=csstr.replace(/ (https?:\/\/[^ ]*?([^\/]*?)\.(jpg|jpeg|png|gif|bmp|webp)) /ig,' <br /><img src="$1" title="$1" /> ');
			csstr=csstr.replace(/ (https?:\/\/[^ ]*?([^\/]*?)\.(jpg|jpeg|png|gif|bmp|webp)$)/ig,' <br /><img src="$1" title="$1" />');
			
			csstr=csstr.replace(/ (https?:\/\/[^ ]+) /ig,' <a href="$1" target=_blank>$1</a> ');
			csstr=csstr.replace(/ (https?:\/\/[^ ]+)/ig,' <a href="$1" target=_blank>$1</a>');
		}
		
		//chinese
		csstr=csstr.replace(/([^\x00-\xff])(https?:\/\/[^ ]*?([^\/]*?)\.(jpg|jpeg|png|gif|bmp|webp)) /ig,'$1<br /><img src="$2" title="$1"> ');
		csstr=csstr.replace(/([^\x00-\xff])(https?:\/\/[^ ]*?([^\/]*?)\.(jpg|jpeg|png|gif|bmp|webp)$)/ig,'$1<br /><img src="$2" title="$1" />');
		
		csstr=csstr.replace(/([^\x00-\xff])(https?:\/\/[^ ]+) /ig,'$1<a href="$2" target=_blank>$2</a> ');
		csstr=csstr.replace(/([^\x00-\xff])(https?:\/\/[^ ]+)/ig,'$1<a href="$2" target=_blank>$2</a>');
	}
    //[?] no title,just link
    if (csstr.includes('[?') && csstr.includes(']')){
        csstr=csstr.replace(/\[\?([^ ]*?)\]/ig,'<a href="?$1" target=_blank>$1</a>');
    }
    //[? ]
    if (csstr.includes('[?') && csstr.includes(']') && csstr.includes(' ')){
        csstr=csstr.replace(/\[(\?[^ ]*?) (.*?)\]/ig,'<a href="$1" target=_blank>$2</a>');
    }
    return csstr;
}

function wiki_strong_b(csstr,underline=false){
    if (underline){
        csstr=csstr.replace(/'''(.*?)'''/g,'<strong style="border-bottom:0.5rem double '+scheme_global['pink']+';">$1</strong>');
        csstr=csstr.replace(/([^=])''(.*?)''/g,'$1<i style="border-bottom:0.5rem dotted '+scheme_global['pink']+';">$2</i>');
        csstr=csstr.replace(/^''(.*?)''/g,'<i style="border-bottom:0.5rem dotted '+scheme_global['pink']+';">$1</i>');
    } else {
        csstr=csstr.replace(/'''(.*?)'''/g,'<strong>$1</strong>');
        csstr=csstr.replace(/([^=])''(.*?)''/g,'$1<i>$2</i>');
        csstr=csstr.replace(/^''(.*?)''/g,'<i>$1</i>');
    }
    return csstr;
}

function wiki_base64_b(csstr){
    //形如：
    //base64_BEGIN
    //.......
    //base64_END
    if (!csstr.includes('base64_BEGIN') || !csstr.includes('base64_END')){
        return csstr;
    }

    var list_t=csstr.split('\n');
    var bljg='';
    var base64=false;
    for (let aline of list_t){
        if (aline=='base64_BEGIN'){
            base64=true;
            bljg=bljg+aline;
            continue;
        }
        if (aline=='base64_END'){
            base64=false;
            bljg=bljg+aline+'\n';
            continue;
        }
        if (base64){
            bljg=bljg+aline;
        } else {
            bljg=bljg+aline+'\n';
        }
    }
    bljg=bljg.replace(/base64_BEGIN(.*?)base64_END/g,'<img src="$1" />');
    return bljg;
}

function wiki_quote_b(csstr,multi_lines=false){
    var rstyle='g';
    if (multi_lines){
        rstyle='gm';
    }
    if (csstr.includes('{{quote') && csstr.includes('{{/quote}}')){
        csstr=csstr.replace(new RegExp(/{{quote}}(.*?){{\/quote}}/,rstyle),'<div style="width:90%;border:solid 1px #6396D6;background-color:#E7EBEF;padding:0.2rem 0.5rem;">$1</div>');
        csstr=csstr.replace(new RegExp(/{{quote\|t=0}}(.*?){{\/quote}}/,rstyle),'<div style="width:100%;background-color:#E0EEF7;padding:0.2rem 0.5rem;">$1</div>');
        csstr=csstr.replace(new RegExp(/{{quote\|t=y}}(.*?){{\/quote}}/,rstyle),'<div style="width:90%;background-color:#FFFFDD;padding:0.2rem 0.5rem;">$1</div>');
        csstr=csstr.replace(new RegExp(/{{quote\|t=b}}(.*?){{\/quote}}/,rstyle),'<div style="width:90%;background-color:#F7F1E8;padding:0.2rem 0.5rem;border:solid 1px #9C6918;">$1</div>');
        csstr=csstr.replace(new RegExp(/{{quote\|t=r}}(.*?){{\/quote}}/,rstyle),'<div style="width:90%;background-color:#FFF7F7;padding:0.2rem 0.5rem;border:solid 1px #D66563;">$1</div>');
    }

    if (csstr.includes('{{span') && csstr.includes('{{/span}}')){
        csstr=csstr.replace(new RegExp(/{{span}}(.*?){{\/span}}/,rstyle),'<span style="border:solid 1px #6396D6;background-color:#E7EBEF;">$1</span>');
        csstr=csstr.replace(new RegExp(/{{span\|t=0}}(.*?){{\/span}}/,rstyle),'<span style="background-color:#E0EEF7;">$1</span>');
        csstr=csstr.replace(new RegExp(/{{span\|t=y}}(.*?){{\/span}}/,rstyle),'<span style="background-color:#FFFFDD;">$1</span>');
        csstr=csstr.replace(new RegExp(/{{span\|t=b}}(.*?){{\/span}}/,rstyle),'<span style="background-color:#F7F1E8;border:solid 1px #9C6918;">$1</span>');
        csstr=csstr.replace(new RegExp(/{{span\|t=r}}(.*?){{\/span}}/,rstyle),'<span style="background-color:#FFF7F7;border:solid 1px #D66563;">$1</span>');
        csstr=csstr.replace(new RegExp(/{{span\|t=l}}(.*?){{\/span}}/,rstyle),'<span style="color:black; border-bottom:1px dotted #303030;background-color:#fdfd32;font-style:italic;">$1</span>');
        csstr=csstr.replace(new RegExp(/{{span\|t=yellow}}(.*?){{\/span}}/,rstyle),'<span style="color:black;background-color:#fdfd32;">$1</span>');
        csstr=csstr.replace(new RegExp(/{{span\|t=d}}(.*?){{\/span}}/,rstyle),'<span style="color:#454600;border:dashed 1px #ff0000;border-radius:5px;padding:0px 1px;margin:0px 1px;">$1</span>');
        csstr=csstr.replace(new RegExp(/{{span\|t=(.*?)}}(.*?){{\/span}}/,rstyle),'<span style="color:'+(scheme_global['color'] || 'black')+';background-color:$1;">$2</span>');

    }
    return csstr;
}

function wiki_photo_b(csstr,cstyle=''){
    if (cstyle=='and'){
        if (csstr.includes('&lt;photo&gt;') && csstr.includes('&lt;/photo&gt;')){
            csstr=csstr.replace(/&lt;photo&gt;(.*?)&lt;\/photo&gt;/g,'<img src="$1" title="$1" />');
        }
    } else {
        if (csstr.includes('<photo>') && csstr.includes('</photo>')){
            csstr=csstr.replace(/<photo>(.*?)<\/photo>/g,'<img src="$1" title="$1" />');
        }
    }
    return csstr;
}

function wiki_ed2k_magnet_b(csstr,cstyle=''){
    function sub_wiki_ed2k_magnet_b_filesize(csstr){
        var fsizelist_t=csstr.match(/<filesize>.*?<\/filesize>/g);
        var bldw='';
        for (var blxl in fsizelist_t){
            var blsize=parseInt(fsizelist_t[blxl].substring('<filesize>'.length,fsizelist_t[blxl].length-'</filesize>'.length).trim());
            csstr=csstr.replace(fsizelist_t[blxl], '<span style="font-size:0.8rem;color:#707070">('+kbmbgb_b(blsize,2)+')</span>');
        }
        return csstr;
    }
    //-----------------------
    if (cstyle=='and'){
        //ed2k
        if (csstr.includes('&lt;ed2k name=&quot;') && csstr.includes('&lt;/ed2k&gt;')){
            csstr=csstr.replace(/&lt;ed2k name=&quot;(.*?)&quot;&gt;(ed2k:\/\/\|.*?\|.*?\|(.*?)\|.*?)&lt;\/ed2k&gt;/g,'<a href="$2">$1</a><filesize>$3</filesize>');
            csstr=sub_wiki_ed2k_magnet_b_filesize(csstr);
        } else if (csstr.includes('&lt;ed2k name="') && csstr.includes('&lt;/ed2k&gt;')){
            csstr=csstr.replace(/&lt;ed2k name="(.*?)"&gt;(ed2k:\/\/\|.*?\|.*?\|(.*?)\|.*?)&lt;\/ed2k&gt;/g,'<a href="$2">$1</a><filesize>$3</filesize>');
            csstr=sub_wiki_ed2k_magnet_b_filesize(csstr);
        } else if (csstr.includes('&lt;ed2k name=') && csstr.includes('&lt;/ed2k&gt;')){
            csstr=csstr.replace(/&lt;ed2k name=(.*?)&gt;(ed2k:\/\/\|.*?\|.*?\|(.*?)\|.*?)&lt;\/ed2k&gt;/g,'<a href="$2">$1</a><filesize>$3</filesize>');
            csstr=sub_wiki_ed2k_magnet_b_filesize(csstr);
        } else if (csstr.includes('&lt;ed2k&gt;') && csstr.includes('&lt;/ed2k&gt;')){
            csstr=csstr.replace(/&lt;ed2k&gt;(ed2k:\/\/\|.*?\|.*?\|(.*?)\|.*?)&lt;\/ed2k&gt;/g,'<a href="$1">ed2k</a><filesize>$2</filesize>');
            csstr=sub_wiki_ed2k_magnet_b_filesize(csstr);
        }
        
        //magnet
        if (csstr.includes('&lt;magnet&gt;') && csstr.includes('&lt;/magnet&gt;')){
            csstr=csstr.replace(/&lt;magnet&gt;(.*?)&lt;\/magnet&gt;/g,'<a href="$1">magnet</a>');
        } else if (csstr.includes('&lt;magnet name=&quot;') && csstr.includes('&lt;/magnet&gt;')){
            csstr=csstr.replace(/&lt;magnet name=&quot;(.*?)&quot;&gt;(.*?)&lt;\/magnet&gt;/g,'<a href="$2">$1</a>');
        } else if (csstr.includes('&lt;magnet name="') && csstr.includes('&lt;/magnet&gt;')){
            csstr=csstr.replace(/&lt;magnet name="(.*?)"&gt;(.*?)&lt;\/magnet&gt;/g,'<a href="$2">$1</a>');
        } else if (csstr.includes('&lt;magnet name=') && csstr.includes('&lt;/magnet&gt;')){
            csstr=csstr.replace(/&lt;magnet name=(.*?)&gt;(.*?)&lt;\/magnet&gt;/g,'<a href="$2">$1</a>');
        }
    } else {
       //ed2k
        if (csstr.includes('<ed2k name="') && csstr.includes('</ed2k>')){
            csstr=csstr.replace(/<ed2k name="(.*?)">(ed2k:\/\/\|.*?\|.*?\|(.*?)\|.*?)<\/ed2k>/g,'<a href="$2">$1</a><filesize>$3</filesize>');
            csstr=sub_wiki_ed2k_magnet_b_filesize(csstr);
        } else if (csstr.includes('<ed2k name=') && csstr.includes('</ed2k>')){
            csstr=csstr.replace(/<ed2k name=(.*?)>(ed2k:\/\/\|.*?\|.*?\|(.*?)\|.*?)<\/ed2k>/g,'<a href="$2">$1</a><filesize>$3</filesize>');
            csstr=sub_wiki_ed2k_magnet_b_filesize(csstr);
        } else if (csstr.includes('<ed2k>') && csstr.includes('</ed2k>')){
            csstr=csstr.replace(/<ed2k>(ed2k:\/\/\|.*?\|.*?\|(.*?)\|.*?)<\/ed2k>/g,'<a href="$1">ed2k</a><filesize>$2</filesize>');
            csstr=sub_wiki_ed2k_magnet_b_filesize(csstr);
        }
        
        //magnet
        if (csstr.includes('<magnet>') && csstr.includes('</magnet>')){
            csstr=csstr.replace(/<magnet>(.*?)<\/magnet>/g,'<a href="$1">magnet</a>');
        } else if (csstr.includes('<magnet name="') && csstr.includes('</magnet>')){
            csstr=csstr.replace(/<magnet name="(.*?)">(.*?)<\/magnet>/g,'<a href="$2">$1</a>');
        } else if (csstr.includes('<magnet name=') && csstr.includes('</magnet>')){
            csstr=csstr.replace(/<magnet name=(.*?)>(.*?)<\/magnet>/g,'<a href="$2">$1</a>');
        }
    }
    return csstr;
}

function wiki_mrt_b(csstr,cstyle=""){
    if (cstyle=='and'){
        if (csstr.includes('&lt;mrt r&gt;') && csstr.includes('&lt;/mrt&gt;')){
            csstr=csstr.replace(/&lt;mrt r&gt;(.*?)&lt;\/mrt&gt;/g,'<font color=blue><b>REVIEW:</b></font> <span style="color:#303030; border-bottom:1px dotted #303030;background-color:#fdfd32;">$1</span>');
        } else if (csstr.includes('&lt;mrt m&gt;') && csstr.includes('&lt;/mrt&gt;')){
            csstr=csstr.replace(/&lt;mrt m&gt;(.*?)&lt;\/mrt&gt;/g,'<font color=green><b>MEMO:</b></font> <span style="color:#303030; border-bottom:1px dotted #303030;background-color:#fdfd32;">$1</span>');
        } else if (csstr.includes('&lt;mrt t&gt;') && csstr.includes('&lt;/mrt&gt;')){
            csstr=csstr.replace(/&lt;mrt t&gt;(.*?)&lt;\/mrt&gt;/g,'<font color=red><b>TODO:</b></font> <span style="color:#303030; border-bottom:1px dotted #303030;background-color:#fdfd32;">$1</span>');
        }
    } else {
        if (csstr.includes('<mrt r>') && csstr.includes('</mrt>')){
            csstr=csstr.replace(/<mrt r>(.*?)<\/mrt>/g,'<font color=blue><b>REVIEW:</b></font> <span style="color:#303030; border-bottom:1px dotted #303030;background-color:#fdfd32;">$1</span>');
        } else if (csstr.includes('<mrt m>') && csstr.includes('</mrt>')){
            csstr=csstr.replace(/<mrt m>(.*?)<\/mrt>/g,'<font color=green><b>MEMO:</b></font> <span style="color:#303030; border-bottom:1px dotted #303030;background-color:#fdfd32;">$1</span>');
        } else if (csstr.includes('<mrt t>') && csstr.includes('</mrt>')){
            csstr=csstr.replace(/<mrt t>(.*?)<\/mrt>/g,'<font color=red><b>TODO:</b></font> <span style="color:#303030; border-bottom:1px dotted #303030;background-color:#fdfd32;">$1</span>');
        }
    }
    return csstr;
}

function wiki_blur_text_b(csstr,ismobile=-1){
    //{{blur}}{{/blur}}
    //ismobile -1 未设定; true: mobile; false: pc; 0-1:text-shadow - 保留注释
    if (csstr.includes('{{blur}}') && csstr.includes('{{/blur}}')){
        if (ismobile===-1){
            ismobile=ismobile_b();
        }
        if (ismobile===false || ismobile===true){
            csstr=csstr.replace(/{{blur}}(.*?){{\/blur}}/g,'<span style="color: transparent; text-shadow: 0 0 '+(ismobile?'0.5':'0.2')+'rem #000;">$1</span>');
        } else {
            csstr=csstr.replace(/{{blur}}(.*?){{\/blur}}/g,'<span style="color: transparent; text-shadow: 0 0 '+ismobile+'rem #000;">$1</span>');
        }
    }
    return csstr;
}

function wiki_ul_b(csstr,csstyle=''){
    //形如：
    //* 
    //* 
    //或
    //#
    //#
    function sub_wiki_ul_b_type(csstr,hash_asterisk='#',csstyle){
        if (hash_asterisk=='*'){
            var ul_ol='ul';
            if (csstr.match(/\n\*/)==null && csstr.match(/^\*/)==null){
                return csstr;
            }            
        } else {
            //#
            var ul_ol='ol';
            if (csstr.match(/\n#/)==null && csstr.match(/^#/)==null){
                return csstr;
            }
        }

        var list_t=csstr.split('\n');
        var bljg='';
        var in_ul=false;
        csstyle=(csstyle==''?'':' style="'+csstyle+'"');
        for (let aline of list_t){
            if (aline.substring(0,1)==hash_asterisk){
                if (in_ul==false){
                    bljg=bljg+'<'+ul_ol+'>\n';
                    in_ul=true;
                }
                bljg=bljg+'<li'+csstyle+'>'+aline.substring(1,).trim()+'</li>\n';
            } else {
                if (in_ul){
                    bljg=bljg+'</'+ul_ol+'>\n';
                    in_ul=false;
                }
                bljg=bljg+aline+'\n';
            }
        }
        if (in_ul){
            bljg=bljg+'</'+ul_ol+'>\n';
            in_ul=false;
        }
        return bljg;
    }
    //-----------------------
    csstr=sub_wiki_ul_b_type(csstr,'#',csstyle);
    csstr=sub_wiki_ul_b_type(csstr,'*',csstyle);
    return csstr;
}

function wiki_font_color_b(csstr,cstyle=''){
    //<fc=red>xxxxxx</fc> <fc=#ff0000></fc>
    if (cstyle=='and'){
        if (csstr.includes('&lt;fc=') && csstr.includes('&lt;/fc&gt;')){
            csstr=csstr.replace(/&lt;fc=(.*?)&gt;(.*?)&lt;\/fc&gt;/g,'<font color=$1>$2</font>');
        }
    } else {
        if (csstr.includes('<fc=') && csstr.includes('</fc>')){
            csstr=csstr.replace(/<fc=(.*?)>(.*?)<\/fc>/g,'<font color=$1>$2</font>');
        }
    }
    return csstr;
}

function wiki_website_b(csstr,cstyle=''){
    //<website s>xxxx</website>
    if (cstyle=='and'){
        if (csstr.includes('&lt;website s&gt;') && csstr.includes('&lt;/website&gt;')){
            csstr=csstr.replace(/&lt;website s&gt;(.*?)&lt;\/website&gt;/g,'<a href="https://cn.bing.com/search?q=$1" target=_blank>$1</a><sub><a href="https://www.baidu.com/s?wd=$1" target=_blank>b</a><a href="https://www.ecosia.org/search?q=$1" target=_blank>e</a><a href="https://duckduckgo.com/?q=$1" target=_blank>d</a></sub>');
        }
    } else {
        if (csstr.includes('<website s>') && csstr.includes('</website>')){
            csstr=csstr.replace(/<website s>(.*?)<\/website>/g,'<a href="https://cn.bing.com/search?q=$1" target=_blank>$1</a><sub><a href="https://www.baidu.com/s?wd=$1" target=_blank>b</a><a href="https://www.ecosia.org/search?q=$1" target=_blank>e</a><a href="https://duckduckgo.com/?q=$1" target=_blank>d</a></sub>');
        }
    }
    return csstr;
}

function wiki_sns_b(csstr){
    //{{t|n=}} {{w|n=}}
    if (csstr.includes('{{t|n=')){
        csstr=csstr.replace(/{{t\|n=(.*?)}}/g,'<a href="https://twitter.com/$1" target=_blank>@$1</a>');
    }   
    if (csstr.includes('{{w|n=')){
        csstr=csstr.replace(/{{w\|n=(.*?)}}/g,'<a href="https://weibo.com/n/$1" target=_blank>@$1</a>');
    }    
    return csstr;
}

function wiki_de_double_b(csstr){
    //形如：
    //<en_double>xxxxx
    //.......
    //</en_double>
    if (!csstr.includes('<en_double>') || !csstr.includes('</en_double>')){
        return csstr;
    }

    var list_t=csstr.match(/<en_double>.*?<\/en_double>/mg);
    if (list_t==null){return csstr;}
    for (var item of list_t){
        var str_t=item.substring('<en_double>'.length,);
        str_t=str_t.substring(0,str_t.length-'</en_double>'.length);
        csstr=csstr.replace(item,de_double_str_b(str_t));
    }
    return csstr;
}

function wiki_table_b(csstr='',tablestyle='',tdstyle='',thstyle=''){
    //形如： - 以下几行保留 - 保留注释
    //{| class="wikitable sortable"
    //|-
    //! 国家/地区 !! 治愈率
    //|-
    //| United States || align=right | 2.23%
    //|}
    
    //tablestyle tdstyle 可以是 style="****" 或 width=200% 等 - 保留注释
    if (!csstr.includes('{|') || !csstr.includes('|}') || !csstr.includes('|-') || !csstr.includes('| ')){
        return csstr;
    }
    if (tdstyle!==''){
        tdstyle=' '+tdstyle;
    }
    if (thstyle!==''){
        thstyle=' '+thstyle;
    }
    var list_t=csstr.split('\n');
    var blstart=false;
    for (let blxl=0,lent=list_t.length;blxl<lent;blxl++){
        var item=list_t[blxl];
        if (item.substring(0,2)=='{|'){
            blstart=true;
            list_t[blxl]='<table '+list_t[blxl].substring(2,)+' '+tablestyle+'>';
        } else if (blstart==false){
            continue;
        } else if (item.trim()=='|-'){
            list_t[blxl]='<tr>';
        } else if (item.trim()=='|}'){
            list_t[blxl]='</table>';
            blstart=false;
        } else if (item.substring(0,2)=='! '){
            item=item.substring(2,);
            item=item.replace(/ \|\| /g,' !! ');
            var td_list=item.split(' !! ');
            var blstr_t='';
            for (let one_td of td_list){
                blstr_t=blstr_t+'<th'+thstyle+'>'+one_td.trim()+'</th>\n';
            }
            list_t[blxl]=blstr_t+'</tr>';
        } else if (item.substring(0,2)=='| '){
            item=item.substring(2,);
            var td_list=item.split(' || ');
            var blstr_t='';
            for (let one_td of td_list){
                blat=one_td.indexOf(' | ');
                if (blat>0){
                    blstr_t=blstr_t+'<td '+one_td.substring(0,blat).trim()+tdstyle+'>'+one_td.substring(blat+3,).trim()+'</td>\n';
                } else {
                    blstr_t=blstr_t+'<td'+tdstyle+'>'+one_td.trim()+'</td>\n';
                }
            }
            list_t[blxl]=blstr_t+'</tr>';
        }
    }

    return list_t.join('\n');
}

function wiki_code_highlight_b(csstr){
    //形如：
    //<syntaxhighlight lang="bash">
    //.......
    //</syntaxhighlight>
    if (!csstr.includes('<syntaxhighlight lang="') || !csstr.includes('</syntaxhighlight>')){
        return [[csstr,0]];
    }
    var bllen='<syntaxhighlight lang="'.length;
    var code_highlight=false;    
    var list_t=csstr.split('\n');
    var bljg=[];
    var code_str='';
    var lang_name='';
    for (let aline of list_t){
        if (aline.substring(0,bllen)=='<syntaxhighlight lang="'){
            var blat=aline.indexOf('>');
            if (blat>code_highlight){
                lang_name=aline.substring(bllen,blat);
                if (lang_name.slice(-1)=='"'){
                    lang_name=lang_name.slice(0,-1);
                    code_highlight=true;
                    if (code_str!==''){
                        bljg.push([code_str,0]);
                        code_str='';
                    }
                    code_str=code_str+'<pre class="line-numbers"><code class="lang-'+lang_name+'">'+aline.substring(blat+1,);
                    continue;
                }
            }
        }
        if (aline=='</syntaxhighlight>'){
            code_highlight=false;
            code_str=code_str+'</code></pre>'+'\n';
            bljg.push([code_str,1]);
            code_str='';
            continue;
        }
        code_str=code_str+aline+'\n';
    }
    if (code_str!==''){
        bljg.push([code_str,0]);
        code_str='';
    }
    return bljg;
}
