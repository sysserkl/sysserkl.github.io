//依赖以下2行 - 保留注释
//<script type="text/javascript" src="module/jquery.js"></script>
//<script type="text/javascript" src="PythonTools/data/selenium_news/module/jeromeetienne_qrcode.min.js"></script>
function utf16to8_qr_b(str) {
    var out, i, len, c;
    out = "";
    len = str.length;
    for(i = 0; i < len; i++) {
        c = str.charCodeAt(i);
        if ((c >= 0x0001) && (c <= 0x007F)) {
            out += str.charAt(i);
        } 
        else if (c > 0x07FF) {
            out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
            out += String.fromCharCode(0x80 | ((c >>  6) & 0x3F));
            out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));
        } 
        else {
            out += String.fromCharCode(0xC0 | ((c >>  6) & 0x1F));
            out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));
        }
    }
    return out;
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
