//依赖 klbase.js - 保留注释
function rotate_poker_b(csstr){
    return '<div style="transform: rotate(180deg);margin:0;padding:0;">'+csstr+'</div>';
}

function number_poker_b(csnumber,cstype=''){
    function number_poker_b_table(csnumber,col1,col2,col3,csnumber2){
        if (col1==''){col1='&nbsp;';}
        if (col2==''){col2='&nbsp;';}
        if (col3==''){col3='&nbsp;';}
        var bljg='<table style="width:7rem;height:10rem;border: 0.1rem black solid;">';
        bljg=bljg+'<tr>';
        bljg=bljg+'<td valign=top align=center><small>'+csnumber+'</small></td>';
        bljg=bljg+'<td valign=middle align=center><big>'+col1+'</big></td>';
        bljg=bljg+'<td valign=middle align=center><big>'+col2+'</big></td>';
        bljg=bljg+'<td valign=middle align=center><big>'+col3+'</big></td>';
        bljg=bljg+'<td valign=bottom align=center><small>'+rotate_poker_b(csnumber)+'</small></td>';
        bljg=bljg+'</tr>';
        bljg=bljg+'</table>';
        return bljg;
    }
    //-----------------------
    if (cstype=='random'){
        var list_t=['heart','spade','diamond','club'];
        list_t.sort(randomsort_b);
        cstype=list_t[0];
    }
    csnumber=csnumber.toString();
    switch (csnumber){
        case '1':
            csnumber='A';
            break;
        case '11':
            csnumber='J';
            break;
        case '12':
            csnumber='Q';
            break;
        case '13':
            csnumber='K';
            break;
        case '14':
            csnumber='W';
            cstype='black';
            break;
        case '15':
            csnumber='W';
            cstype='red';
            break;
    }
    
    switch (cstype){
        case 'heart':
            cstype='<font color=red>♥</font>';
            blstr='<font color=red>'+csnumber+'<br />♥</font>';
            break;
        case 'diamond':
            cstype='<font color=red>♦</font>';
            blstr='<font color=red>'+csnumber+'<br />♦</font>';
            break;
        case 'club':
            cstype='<font color=black>♣</font>';
            blstr='<font color=black>'+csnumber+'<br />♣</font>';
            break;
        case 'spade':
            cstype='<font color=black>♠</font>';
            blstr='<font color=black>'+csnumber+'<br />♠</font>';
            break;
        default:
            blstr='<font color='+cstype+'>'+csnumber+'</font>';
            cstype='';
            break;
    }
    
    switch (csnumber){
        case 'A':
            return number_poker_b_table(blstr,'',cstype,'');
        case '2':
            return number_poker_b_table(blstr,'',cstype+'<br />&nbsp;<br />&nbsp;<br />'+rotate_poker_b(cstype),'');
        case '3':
            return number_poker_b_table(blstr,'',cstype+'<br />&nbsp;<br />'+cstype+'<br />&nbsp;<br />'+rotate_poker_b(cstype),'');        
        case '4':
            return number_poker_b_table(blstr,cstype+'<br />&nbsp;<br />&nbsp;<br />'+rotate_poker_b(cstype),'',cstype+'<br />&nbsp;<br />&nbsp;<br />'+rotate_poker_b(cstype));
        case '5':
            return number_poker_b_table(blstr,cstype+'<br />&nbsp;<br />&nbsp;<br />'+rotate_poker_b(cstype),cstype,cstype+'<br />&nbsp;<br />&nbsp;<br />'+rotate_poker_b(cstype));
        case '6':
            return number_poker_b_table(blstr,cstype+'<br />&nbsp;<br />'+cstype+'<br />&nbsp;<br />'+rotate_poker_b(cstype),'',cstype+'<br />&nbsp;<br />'+rotate_poker_b(cstype+'<br />&nbsp;<br />'+cstype));        
        case '7':
            return number_poker_b_table(blstr,cstype+'<br />&nbsp;<br />'+cstype+'<br />&nbsp;<br />'+rotate_poker_b(cstype),cstype+'<br />&nbsp;<br />&nbsp;',cstype+'<br />&nbsp;<br />'+rotate_poker_b(cstype+'<br />&nbsp;<br />'+cstype));                
        case '8':
            return number_poker_b_table(blstr,cstype+'<br />&nbsp;<br />'+cstype+'<br />&nbsp;<br />'+rotate_poker_b(cstype),cstype+'<br />&nbsp;<br />'+rotate_poker_b(cstype),cstype+'<br />&nbsp;<br />'+rotate_poker_b(cstype+'<br />&nbsp;<br />'+cstype));                        
        case '9':
            return number_poker_b_table(blstr,cstype+'<br />'+cstype+'<br />'+rotate_poker_b(cstype+'<br />'+cstype),cstype,cstype+'<br />'+cstype+'<br />'+rotate_poker_b(cstype+'<br />'+cstype));
        case '10':
            return number_poker_b_table(blstr,cstype+'<br />'+cstype+'<br />'+rotate_poker_b(cstype+'<br />'+cstype),cstype+'<br />&nbsp;<br />'+rotate_poker_b(cstype),cstype+'<br />'+cstype+'<br />'+rotate_poker_b(cstype+'<br />'+cstype));        
        case 'J':
        case 'Q':
        case 'K':
        case 'W':
            return number_poker_b_table(blstr,'',blstr,'');
        default:
            return number_poker_b_table(blstr,'',blstr,'');
    }
}
