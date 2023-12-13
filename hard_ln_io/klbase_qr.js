//依赖以下2行 - 保留注释
//<script src="module/jquery.js"></script>
//<script src="PythonTools/data/selenium_news/module/jeromeetienne_qrcode.min.js"></script>
function utf16to8_qr_b(csstr){
    var bljg = '';
    for (let blxl = 0; blxl < csstr.length; blxl++){
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

function create_qr_b(jquery_obj,cstext='just for fun',qrsize=400,qrfcolor='',qrbcolor='',csencode=false,cstype='table'){
	if (csencode){
		cstext=encodeURIComponent(cstext);
	}

	if (qrfcolor=='' || qrfcolor=='-1'){
		qrfcolor=rndcolor_b();
	}
	if (qrbcolor=='' || qrbcolor=='-1'){
		qrbcolor=rndcolor_b();
	}

    jquery_obj.qrcode({render: cstype,correctLevel : 3, background:qrbcolor,foreground: qrfcolor, width: qrsize,height: qrsize,text: utf16to8_qr_b(cstext)});
}

function round_qr_b(csid){
    var otable=csid.querySelector('table');
    if (!otable){
        return;
    }
    var otds=otable.querySelectorAll('td');
    for (let item of otds){
        item.style.borderRadius='2rem';
    }
}
