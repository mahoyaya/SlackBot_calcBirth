exports.calcBirth = function (my_birth, target) {
    this.my_birth = my_birth;
    var ary_birth = my_birth.split('/');
    var birth = new Date(this.my_birth);
    if ( target ) {
	var now = new Date(target); // debug
    } else {
	var now = new Date();
    }
    var birth_y = birth.getFullYear();
    var now_y = now.getFullYear();
    var birth_m = birth.getMonth() + 1;
    var now_m = now.getMonth() + 1;
    var birth_d = birth.getDate();
    var now_d = now.getDate();
    var pass = false;
    
    if ( now > birth ) {
	var age = getAge();
	var days_last_birth = getDaysLastBirth();
	const ary_month_30 = [ 4,6,9,11 ];
	var ary_birth = getMonthAfterLastBirth();
	var pass = true;
    }
    
    this.printAge = function () {
	//print(birth.toUTCString());
	//print(now.toUTCString());
	var ary_mess = [];
	if ( pass ) {
	    ary_mess.push(birth.toString());
	    ary_mess.push(now.toString());
	    ary_mess.push("満年齢:" + age);
	    ary_mess.push("前回の誕生日からの経過月と日数:" + ary_birth[0] + "か月と" + ary_birth[1] + "日");
	    ary_mess.push("前回の誕生日からの経過日数:" + days_last_birth + "日");
	} else {
	    ary_mess.push(birth.toString());
	    ary_mess.push(now.toString());
	    ary_mess.push("無効な日付です。");
	}
	return ary_mess;	
    }
    
    /******** functionsstart ********/
    function isBissextile (year) {
	// うるう年判定
	if ( year % 400 == 0 || year % 4 == 0 && year % 100 != 0 ) {
	    return true
	} else {
	    return false;
	}
    }
    
    // 前月の日数を取得して経過日数を返す
    function getNumOfDayLastMonthBirth() {
	var now_last_m = now.getMonth();
	if ( now_last_m < 1 ) now_last_m = 12; // 1月だったら前月は12月
	var days = 0;
	if ( now_last_m == 2 ) {
	    isBissextile(now_y) ? days = 29 : days = 28; // うるう年
	} else if ( isExists(ary_month_30, now_last_m ) ) {
	    days = 30;
	} else {
	    days = 31;
	}
	return days - birth_d;
    }
    
    // 前回の誕生日からの経過月数と日数を返す
    function getMonthAfterLastBirth () {
	var ary = new Array();
	if (birth_m > now_m && birth_d > now_d) {
	    // 誕生月が現在の月よりも大きく、誕生日の日にちが現在の日にちよりも大きい
	    ary.push(12 - birth_m + now_m - 1); // 誕生月からの経過月数
	    ary.push(now_d + getNumOfDayLastMonthBirth(now) ); // 誕生日の日にちからの経過日数
	} else if (birth_m > now_m && birth_d <= now_d) {
	    // 誕生月が現在の月よりも大きく、誕生日の日にちが現在の日にち以下
	    ary.push(12 - birth_m + now_m); // 誕生月からの経過月数
	    ary.push(now_d - birth_d); // 誕生日の日にちからの経過日数
	} else if (birth_m <= now_m && birth_d > now_d) {
	    // 誕生月が現在の月よりも小さく、誕生日の日にちが現在の日にちよりも大きい
	    ary.push(now_m - now_m - 1); // 誕生月からの経過月数
	    ary.push(now_d + getNumOfDayLastMonthBirth(now) ); // 誕生日の日にちからの経過日数
	} else if (birth_m <= now_m && birth_d <= now_d) {
	    // 誕生月が現在の月よりも小さく、誕生日の日にちが現在の日にち以下
	    ary.push(now_m - birth_m); // 誕生月からの経過月数
	    ary.push(now_d - birth_d); // 誕生日の日にちからの経過日数
	}
	//ary.push(1); // test
	return ary;
    }

    // 前回の誕生日からの経過日数を返す
    function getDaysLastBirth () {
	if (age > 0) {
	    // 0歳よりも上
	    var birth_last_y = now_y;
	    if ( new Date('2000/' + (now.getMonth() + 1) + '/' + now.getDate()) < new Date('2000/' + (birth.getMonth() + 1) + '/' + birth.getDate()) ) birth_last_y--; // 年を合わせて仮の日付で比較し、nowが小さければ1年減らす
	    var birth_last = new Date(birth_last_y + '/' + ary_birth[1] + '/' + ary_birth[2]);
	    //print("birth_last:" + birth_last);
	    var num_after_birth_last = now - birth_last;
	    //print("num_after_birth_last:" + Math.floor((num_after_birth_last / 1000 / 60 / 60 / 24)));
	    return Math.floor((num_after_birth_last / 1000 / 60 / 60 / 24));
	} else {
	    // 満0歳
	    return Math.floor((now - birth) / 1000 / 60 / 60 / 24);
	}
    }

    // 満年齢を返す
    function getAge() {
	if( birth_m <= now_m ){
	    // 現在月が誕生月よりも大きい（誕生日を迎えている）
	    return now_y - birth_y;
	} else if( birth_m > now_m ){
	    //  現在月が誕生月よりも小さい（誕生日を迎えていない）
	    return now_y - birth_y - 1;
	}
    }

    // bot.replyのショートカット
    function print (data, prefix) {
	if ( Array.isArray(data) ) {
	    if (prefix) {
		bot.reply(message, prefix, data);
	    } else {
		bot.reply(message, "Array:", data);
	    }
	} else {
	    bot.reply(message, data);
	}
    }
    /******** functions end ********/
}


// 配列にオブジェクトが存在するか確認する
function isExists (ary, obj) {
    ary.some(function(val, index){
	if ( val === obj ) return true;
    });
    return false;
}

// ECMAScript版 配列に存在するか確認 indexOfは存在しない場合に -1 を返す
function isExistsECMA (ary, obj) {
    var ret = ary.indexOf(obj);
    if ( ret > 0 ) return true;
    return false;
}

// console.logのショートカット
function lprint (data, prefix) {
    if ( Array.isArray(data) ) {
	if (prefix) {
	    console.log(prefix, data);
	} else {
	    console.log("Array:", data);
	}
    } else {
	console.log(data);
    }
}

	
