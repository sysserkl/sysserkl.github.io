function init_kl_iframe(){
    iframe_global={'www':[],'position':'we','percent':[],'size':false,'button':false,'menu':false,'one':false};

    args_kl_iframe();
    build_kl_iframe();
    if (iframe_global['menu']){
        menu_kl_iframe();
    }
}

function menu_kl_iframe(){
var str_t=klmenu_hide_b('');
    var klmenu1=[
    '<a href="?menu&one&www=enwords.htm&&www=enwords_today.htm&www=enwords_exam.htm" onclick="'+str_t+'" target=_blank>enwords_today_exam</a>',
    '<a href="?menu&one&www=readlater.htm&&www=notepad.htm&www=diff_js.htm" onclick="'+str_t+'" target=_blank>readlater_notepad_diff_js</a>',
    '<a href="?menu&button&size=2000px&percent=50,50&www=notepad.htm&www=diff_js.htm&type=ns" onclick="'+str_t+'" target=_blank>notepad_diff_js_demo</a>',
    ];

    document.getElementById('p_button_top_iframe').insertAdjacentHTML('afterbegin',klmenu_multi_button_div_b(klmenu_b(klmenu1,'','18rem','1rem','1rem','30rem'),'','0rem')+' ');
}

function args_kl_iframe(){
    var cskeys=href_split_b(location.href);
    if (cskeys.length>0 && cskeys[0]!==''){
        //形如：iframe.htm?s=a=&b= - 保留注释
        for (let item of cskeys){
            if (item.substring(0,4)=='www='){
                iframe_global['www'].push(item.substring(4,).trim());
            } else if (item.substring(0,5)=='type='){
                iframe_global['position']=item.substring(5,).trim();
            } else if (item.substring(0,8)=='percent='){
                iframe_global['percent']=item.substring(8,).trim().split(',');
            } else if (item.substring(0,5)=='size='){
                iframe_global['size']=item.substring(5,).trim();
            } else if (item=='button'){
                iframe_global['button']=true;
            } else if (item=='menu'){
                iframe_global['menu']=true;
            } else if (item=='one'){
                iframe_global['one']=true;                
            }
        }
    }
}

function build_kl_iframe(){
    function sub_build_kl_iframe_title(){
        var name_list=[];
        for (let blxl=0;blxl<lenwww;blxl++){
            name_list.push(file_path_name_b(iframe_global['www'][blxl])[1].slice(0,1));
        }
        document.title=name_list.join('')+' - iframe';
    }
    
    if (iframe_global['www'].length==0){
        iframe_global['www'][0]='klapps.htm';
    }
    if (iframe_global['www'].length<2){
        iframe_global['www'][1]='about:blank';
    }

    var lenwww=iframe_global['www'].length;
    sub_build_kl_iframe_title();
    
    if (iframe_global['one']){
        var op=document.getElementById('p_button_top_iframe');
        var ocontent=document.getElementById('divhtml');
        iframe_init_b(iframe_global['www'],op,ocontent);
        return;
    }
        
    var lenpercent=iframe_global['percent'].length;
    
    var left_percent=100;
    for (let item of iframe_global['percent']){
        left_percent=left_percent-parseInt(item);
    }
    left_percent=parseInt(left_percent/(lenwww-lenpercent));
    if (left_percent<1){
        left_percent=1;
    }
    
    for (let blxl=lenpercent;blxl<lenwww;blxl++){
        iframe_global['percent'].push(left_percent);
    }
    
    if (iframe_global['position']=='ns'){ //上下排列 - 保留注释
        if (iframe_global['size']===false){
            iframe_global['size']=document_body_offsetHeight_b()+'px';
        }
        var bljg='<table style="width:100%;height:'+iframe_global['size']+'">';    
        for (let blxl=0;blxl<lenwww;blxl++){
            bljg=bljg+'<tr>';
            bljg=bljg+'<td style="width:100%;height:'+iframe_global['percent'][blxl]+'%;">';
            bljg=bljg+'<iframe class="container_kl_iframe" src="'+iframe_global['www'][blxl]+'" style="width:100%;height:100%;"></iframe>';
            bljg=bljg+'</td>';
            bljg=bljg+'</tr>';
        }
    } else {
        if (iframe_global['size']===false){
            iframe_global['size']='100%';
        }
        var bljg='<table style="width:'+iframe_global['size']+';height:'+document_body_offsetHeight_b()+'px;">';
        bljg=bljg+'<tr>';
        for (let blxl=0;blxl<lenwww;blxl++){
            bljg=bljg+'<td style="width:'+iframe_global['percent'][blxl]+'%;height:100%;">';
            bljg=bljg+'<iframe class="container_kl_iframe" src="'+iframe_global['www'][blxl]+'" style="width:100%;height:100%;"></iframe>';
            bljg=bljg+'</td>';
        }
        bljg=bljg+'</tr>';
    }
    bljg=bljg+'</table>';
    document.getElementById('divhtml').innerHTML=bljg;
    
    if (iframe_global['button']){
        var button_list=[];
        for (let blxl=0;blxl<lenwww;blxl++){
            button_list.push('<span class="aclick" onclick="jump_kl_iframe('+blxl+');">'+file_path_name_b(iframe_global['www'][blxl])[1]+'</span>');
        }
        document.getElementById('p_button_top_iframe').insertAdjacentHTML('beforeend',button_list.join(''));
        document.getElementById('p_button_bottom_iframe').innerHTML=button_list.join('');
    }
}

function jump_kl_iframe(csno){
    var oiframes=document.querySelectorAll('iframe.container_kl_iframe');
    if (csno>=0 && csno<=oiframes.length-1){
        oiframes[csno].scrollIntoView();
    }
}
