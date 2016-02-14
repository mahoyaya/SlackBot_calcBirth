誕生日から経過した日付を出力するSlack Botです。
Slack公式のBotkitを利用します。
Botkitは[こちら](https://github.com/howdyai/botkit)からダウンロードしてください。


# 使い方
bot.js を編集します。

// Help Message
controller.hears(['help'], 'ambient', function(bot, message) {
    var ary = [];
    ary.unshift('受付コマンド一覧：');
    // yournameを設定したいコマンド名に置換
    ary.unshift(' yourname : 生年月日と生まれてから経過した時間を出力します');
    for(var i = ary.length; i--; ) {
        bot.reply(message, ary[i]);
    }
});

// yournameを設定したいコマンド名に置換
controller.hears(['yourname'], 'ambient', function(bot, message) {
    // 生年月日を設定
    var my_birth = "2015/1/1 9:00:00";
    // ある日にち時点の情報が欲しければ設定する
    var t_date = "2016/3/1";

    // calcBirth.jsを読み込む
    var f = require('./calcBirth.js');
    // calcBirthのインスタンス作成
    var cb = new f.calcBirth(my_birth);
    // 指定された日時時点の情報を出力する場合は第2引数を指定します
    //var cb = new f.calcBirth(my_birth, t_date);
    
    // 戻り値は配列に格納されます
    var ary_mess = me.printAge();
    for(var i = 0; i < ary_mess.length; i++) {
        bot.reply(message, ary_mess[i]);
    }
});


# 出力
Botを起動した状態でyourname（実際は指定したコマンド名）をSlackで入力すると次の情報が出力されます。

```
Tue Oct 20 2015 22:47:00 GMT+0900 (JST)
Sun Feb 14 2016 17:18:32 GMT+0900 (JST)
満年齢:0
前回の誕生日からの経過月と日数:3か月と25日
前回の誕生日からの経過日数:116日
```
