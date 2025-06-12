function en_cn_bible_b(csstr){
    //Python调用：KLfuns_txtbook_enwords.bible_book_name_list() - 保留注释
    var ben=["The First Book of Moses: Called Genesis","The Second Book of Moses: Called Exodus","The Third Book of Moses: Called Leviticus","The Fourth Book of Moses: Called Numbers","The Fifth Book of Moses: Called Deuteronomy","The Book of Joshua","The Book of Judges","The Book of Ruth","The First Book of Samuel","The Second Book of Samuel","The First Book of the Kings","The Second Book of the Kings","The First Book of the Chronicles","The Second Book of the Chronicles","Ezra","The Book of Nehemiah","The Book of Esther","The Book of Job","The Book of Psalms","The Proverbs","Ecclesiastes","The Song of Solomon","The Book of the Prophet Isaiah","The Book of the Prophet Jeremiah","The Lamentations of Jeremiah","The Book of the Prophet Ezekiel","The Book of Daniel","Hosea","Joel","Amos","Obadiah","Jonah","Micah","Nahum","Habakkuk","Zephaniah","Haggai","Zechariah","Malachi","The Gospel According to Saint Matthew","The Gospel According to Saint Mark","The Gospel According to Saint Luke","The Gospel According to Saint John","The Acts of the Apostles","The Epistle of Paul the Apostle to the Romans","The First Epistle of Paul the Apostle to the Corinthians","The Second Epistle of Paul the Apostle to the Corinthians","The Epistle of Paul the Apostle to the Galatians","The Epistle of Paul the Apostle to the Ephesians","The Epistle of Paul the Apostle to the Philippians","The Epistle of Paul the Apostle to the Colossians","The First Epistle of Paul the Apostle to the Thessalonians","The Second Epistle of Paul the Apostle to the Thessalonians","The First Epistle of Paul the Apostle to Timothy","The Second Epistle of Paul the Apostle to Timothy","The Epistle of Paul the Apostle to Titus","The Epistle of Paul the Apostle to Philemon","The Epistle of Paul the Apostle to the Hebrews","The General Epistle of James","The First Epistle General of Peter","The Second General Epistle of Peter","The First Epistle General of John","The Second Epistle General of John","The Third Epistle General of John","The General Epistle of Jude","The Revelation of Saint John the Devine",];
    var bcn=["创世记","出埃及记","利未记","民数记","申命记","约书亚记","士师记","路得记","撒母耳记上","撒母耳记下","列王记上","列王记下","历代志上","历代志下","以斯拉记","尼希米记","以斯帖记","约伯记","诗篇","箴言","传道书","雅歌","以赛亚书","耶利米书","耶利米哀歌","以西结书","但以理书","何西阿书","约珥书","阿摩司书","俄巴底亚书","约拿书","弥迦书","那鸿书","哈巴谷书","西番雅书","哈该书","撒迦利亚书","玛拉基书","马太福音","马可福音","路加福音","约翰福音","使徒行传","罗马书","哥林多前书","哥林多后书","加拉太书","以弗所书","腓立比书","歌罗西书","帖撒罗尼迦前书","帖撒罗尼迦后书","提摩太前书","提摩太后书","提多书","腓利门书","希伯来书","雅各书","彼得前书","彼得后书","约翰一书","约翰二书","约翰三书","犹大书","启示录",];
    
    var at_t=ben.indexOf(csstr);
    if (at_t>=0){
        return bcn[at_t];
    }
    var at_t=bcn.indexOf(csstr);
    if (at_t>=0){
        return ben[at_t];
    }
    return '';
}
