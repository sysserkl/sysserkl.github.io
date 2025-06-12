function init_mplan(){
    top_bottom_arrow_b('div_top_bottom','',false,(ismobile_b()?'1.8rem':'1.6rem'));
    var input_list=[
    ['input_3year',4,0.5],
    ['input_2year',4,0.5],
    ['input_1year',4,0.5],
    ['input_principal',6,0.5],
    ['input_year_expenditure',6,0.5],
    ['input_year_count',6,0.5],    
    ['input_first_year',6,0.5],
    
    ];
    input_size_b(input_list,'id');
    document.getElementById('input_first_year').value=new Date().getFullYear();
}

function calc_mplan(){
    var otype=document.getElementsByName('radio_money');
    for (let item of otype){
        if (item.checked){
            switch (item.value){
                case '1':
                    calc_years_mplan();
                    break;
                case '2':
                    calc_expenditure_mplan();
                    break;
            }
            break;
        }
    }
}

function calc_expenditure_mplan(){
    var odiv=document.getElementById('divhtml');
    var blprincipal=parseFloat(document.getElementById('input_principal').value);
    var bl_plan_years=parseFloat(document.getElementById('input_year_count').value);
    if (blprincipal<=0 || bl_plan_years<=0){
        odiv.innerHTML='不接受非正整数';
        return;
    }
    if (bl_plan_years>100){
        odiv.innerHTML='不接受超过100的年限';
        return;
    }    

    var percent_min=0;
    var percent_max=1;
    var blxl=0;
    while (true){
        blxl=blxl+1;
        var blexpend=blprincipal*(percent_min+(percent_max-percent_min)/2);
        var blyears=calc_years_mplan(blexpend,false);
        if (Math.abs(blyears-bl_plan_years)<0.01){
            odiv.innerHTML='若每年花费：'+blexpend.toFixed(1)+'万元，可支持'+blyears+'年';
            break;
        }
        if (blyears<bl_plan_years){
            percent_max=percent_max-(percent_max-percent_min)/2;
        } else {
            percent_min=percent_min+(percent_max-percent_min)/2;
        }
        if (blxl>100 || percent_min == percent_max){break;}
    }
    console.log('计算次数：',blxl);
}

function calc_years_mplan(cs_year_expenditure=false,showhtml=true){
    var odiv=document.getElementById('divhtml');
    var oinput_3year=document.getElementById('input_3year');
    var oinput_2year=document.getElementById('input_2year');
    var oinput_1year=document.getElementById('input_1year');
    
    var blpercent=[parseFloat(oinput_1year.value)/100,parseFloat(oinput_2year.value)/100,parseFloat(oinput_3year.value)/100];

    var blprincipal=parseFloat(document.getElementById('input_principal').value);
    if (cs_year_expenditure===false){
        cs_year_expenditure=parseFloat(document.getElementById('input_year_expenditure').value);
    }
    
    if (blpercent[0]<0 || blpercent[1]<0 || blpercent[2]<0 || blprincipal<0 || cs_year_expenditure<0){
        if (showhtml){
            odiv.innerHTML='不接受负值';
        }
        return 0;
    }
    var blyear=parseInt(document.getElementById('input_first_year').value);
    
    var bljg=[];
    var bank_money=0;
    var save_year=0;
    var blxl=1;
    var future_money={};
    while (true){
        if (('y'+blxl in future_money)){
            blprincipal=blprincipal+future_money['y'+blxl];
            future_money['y'+blxl]=0;
        }
        bljg.push('<b>第'+blxl+'年('+(blyear+blxl-1)+'年)</b>，年初本金：'+blprincipal.toFixed(2)+'万元');
        
        while (true){
            [bank_money,save_year,blprincipal]=save_mplan(blprincipal,cs_year_expenditure);
            if (bank_money==0){break;}
            var blinterest=bank_money*save_year*blpercent[(save_year-1)];
            bljg.push('年初存入：'+bank_money+'万元，存期：'+save_year+'年，到期后利息：'+blinterest.toFixed(2)+'万元');
            if (!('y'+(blxl+save_year) in future_money)){
                future_money['y'+(blxl+save_year)]=0;
            }
            future_money['y'+(blxl+save_year)]=future_money['y'+(blxl+save_year)]+bank_money+blinterest;
        }
        
        blprincipal=blprincipal-cs_year_expenditure;
        bljg.push('当年消费资金：'+cs_year_expenditure+'万元，年末结余：'+blprincipal.toFixed(2)+'万元<hr />');
        blxl=blxl+1;
        if (blxl>100){
            break;
        }
        if (bank_money==0){
            var blfound=false;
            for (let key in future_money){
                if (future_money[key]>0){
                    blfound=true;
                    break;
                }
            }
            if (blfound===false){break;}
        }        
    }

    if (showhtml){
        odiv.innerHTML='<hr />'+array_2_li_b(bljg);
    }
    if (blprincipal<0){
        return blxl-2;
    } else {
        return blxl-1;
    }
}

function save_mplan(csprincipal,cs_year_expenditure){
    var save_year=3;
    var bank_money=parseInt(csprincipal-cs_year_expenditure*save_year);
    if (bank_money<=0){
        save_year=2;
        bank_money=parseInt(csprincipal-cs_year_expenditure*save_year);
    }
    if (bank_money<=0){
        save_year=1;
        bank_money=parseInt(csprincipal-cs_year_expenditure*save_year);
    }
    if (isNaN(bank_money)){
        return [0,0,csprincipal];
    }

    if (bank_money<=0){
        return [0,0,csprincipal];
    }
    return [bank_money,save_year,csprincipal-bank_money];
}
