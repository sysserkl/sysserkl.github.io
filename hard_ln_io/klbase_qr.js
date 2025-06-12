//依赖以下2行 - 保留注释
//<script src="module/jquery.js"></script>
//<script src="PythonTools/data/selenium_news/module/jeromeetienne_qrcode.min.js"></script>
function utf16to8_qr_b(csstr){
    var bljg = '';
    for (let blxl = 0,lent= csstr.length; blxl <lent; blxl++){
        var blvalue = csstr.charCodeAt(blxl);
        if ((blvalue >= 0x0001) && (blvalue <= 0x007F)){
            bljg += csstr.charAt(blxl);
        } else if (blvalue > 0x07FF){
            bljg += String.fromCharCode(0xE0 | ((blvalue >> 12) & 0x0F));
            bljg += String.fromCharCode(0x80 | ((blvalue >>  6) & 0x3F));
            bljg += String.fromCharCode(0x80 | ((blvalue >>  0) & 0x3F));
        } else {
            bljg += String.fromCharCode(0xC0 | ((blvalue >>  6) & 0x1F));
            bljg += String.fromCharCode(0x80 | ((blvalue >>  0) & 0x3F));
        }
    }
    return bljg;
}

function create_qr_b(jquery_obj,cstext='just for fun',qrsize=400,qrfcolor='',qrbcolor='',csencode=false,cstype='table',cscorrect_level=3){
	if (csencode){
		cstext=encodeURIComponent(cstext);
	}

	if (qrfcolor=='' || qrfcolor=='-1'){
		qrfcolor=rndcolor_b();
	}
	if (qrbcolor=='' || qrbcolor=='-1'){
		qrbcolor=rndcolor_b();
	}
    try {        
        jquery_obj.qrcode({render: cstype,correctLevel : cscorrect_level, background:qrbcolor,foreground: qrfcolor, width: qrsize,height: qrsize,text: utf16to8_qr_b(cstext)});
    } catch (error){
        console.log(error.toString());  //Error: code length overflow. (13332>13328) - 保留注释
    }
}

function round_qr_b(csid){
    var otable=csid.querySelector('table');
    if (!otable){return;}
    
    var otds=otable.querySelectorAll('td');
    for (let item of otds){
        item.style.borderRadius='2rem';
    }
}

function str_2_list_qr_b(csstr){
    var list_t=csstr.split('');
    var bllen=list_t.length;
    var rows=parseInt(Math.sqrt(bllen));
    if (rows*rows!==bllen){
        return csstr;
    }
    
    var result_t=[];
    for (let blxl=0;blxl<bllen;blxl=blxl+rows){
        result_t.push(list_t.slice(blxl,blxl+rows));
    }
    return result_t;
}

function qr_list_get_from_table_b(tr_oblocks,shownumber,color_list,return_str=false){
    var qrfcolor,qrbcolor,f_rgb,b_rgb;
    [qrfcolor,qrbcolor,f_rgb,b_rgb]=color_list;
    
    var result_t=[];
    for (let blr=0,lent=tr_oblocks.length;blr<lent;blr++){
        var td_oblocks=tr_oblocks[blr].querySelectorAll('td');        
        for (let blc=0,lenb=td_oblocks.length;blc<lenb;blc++){
            if ([qrfcolor,f_rgb].includes(td_oblocks[blc].style.backgroundColor)){
                if (shownumber){
                    td_oblocks[blc].innerHTML='<span style="color: '+qrbcolor+'; font-size:0.8rem;">'+(blr+1)+'+'+(blc+1)+'</span>';
                }
                result_t.push([blr,blc,1]);
            } else if ([qrbcolor,b_rgb].includes(td_oblocks[blc].style.backgroundColor)){
                if (shownumber){
                    td_oblocks[blc].innerHTML='<span style="color: '+qrfcolor+'; font-size:0.8rem;">'+(blr+1)+'-'+(blc+1)+'</span>';
                }
                result_t.push([blr,blc,0]);
            }
            if (shownumber){
                td_oblocks[blc].align='center';
            }
        }
    }
    if (return_str){
        return array_split_by_col_b(result_t,[2]).join('');
    } else {
        return result_t;
    }
}

function list_2_table_qr_b(cslist,table_wh,fcolor='black',bcolor='white'){
    var bllen=cslist.length;
    if (bllen==0){return '';}
    var td_size=table_wh/bllen;
    
    var result_t=[];
    for (let arow of cslist){
        result_t.push('<tr style="height: '+td_size+'px;">');
        var tr_list=[];
        for (let acol of arow){
            tr_list.push('<td style="width: '+td_size+'px; background-color: '+(acol=='1'?fcolor:bcolor)+';"></td>');
        }
        result_t.push(tr_list.join(''));
        result_t.push('</tr>');
    }
    return '<table style="width: '+table_wh+'px; height: '+table_wh+'px; border: 0px; border-collapse: collapse; background-color: white;">'+result_t.join('')+'</table>';
}
