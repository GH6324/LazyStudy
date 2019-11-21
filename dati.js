//先引用
importClass(android.database.sqlite.SQLiteDatabase);
importClass(android.media.MediaPlayer);

function searchNet(question) {
    var ansNet = [];
    //toastLog("开始网络搜题");
    recents();
    sleep(1500);
    if (textContains("强国挑战").exists()) {
        toastLog("正在切换小程序");
        click("强国挑战");
    } else {
        toastLog("请先点击 切到搜题");
        return ansNet;
    }
    sleep(500);
    textContains("搜索").findOnce().parent().child(0).child(0).child(1).child(0).child(0).click();
    sleep(800);
    setText(question);
    sleep(500);
    //className("android.widget.EditText").findOnce().setText(question);
    textContains("搜索").findOnce().click();
    sleep(1000);
    
    if (textContains("答案：").exists()) {
        //toastLog(textContains("答案：").findOnce().text().substring(3));
        textContains("答案：").find().forEach(item => {
            ansNet.push(item.text().substring(3));
        });
    }
    //sleep(300);
    recents();
    sleep(300);
    click("学习强国");
    // if (textContains("学习强国").exists()) {
    //     textContains("学习强国").findOnce().parent().click();
    // }
    //sleep(500);
    return ansNet;
}

function drawfloaty(x, y) {
    //floaty.closeAll();
    var window = floaty.window(
        <frame gravity="center">
            <text id="text" text="✔" textColor="red" />
        </frame>
    );
    window.setPosition(x, y - 50);
    return window;
    //sleep(2000);
    //window.close();
}

function beep() {
    var player = new MediaPlayer();
    var path = files.cwd() + "/beep.mp3";
    player.setDataSource(path);
    player.setVolume(50, 50);
    player.prepare();
    player.start();
    setTimeout(() => {
        player.stop();
        player.release();
    }, 5000);
}

function searchTiku(keyw) {
    //数据文件名
    var dbName = "tiku.db";
    //文件路径
    var path = files.path(dbName);
    //确保文件存在
    if (!files.exists(path)) {
        files.createWithDirs(path);
    }
    //创建或打开数据库
    var db = SQLiteDatabase.openOrCreateDatabase(path, null);

    query = "SELECT answer,wrongAnswer FROM tiku WHERE question LIKE '" + keyw + "%'"
    //query="select * from tiku"
    //db.execSQL(query);

    var cursor = db.rawQuery(query, null);
    cursor.moveToFirst();
    //var toaststr = "共有" + cursor.getCount() + "行记录，答案是 :";
    //找到记录
    if (cursor.getCount()) {
        //toast("找到答案");
        //toaststr = toaststr + cursor.getString(0);  
        var ansTiku = cursor.getString(0);
        cursor.close();
        return ansTiku;
    } else {
        toastLog("题库中未找到: " + keyw);
        cursor.close();
        return "";
    }
}

function insertOrUpdate(sqlstr) {
    //数据文件名
    var dbName = "tiku.db";
    //文件路径
    var path = files.path(dbName);
    //确保文件存在
    if (!files.exists(path)) {
        files.createWithDirs(path);
    }
    //创建或打开数据库
    var db = SQLiteDatabase.openOrCreateDatabase(path, null);
    db.execSQL(sqlstr);
    toastLog(sqlstr);
    db.close();
}


function tiaoZhan() {
    let failDo = false;
    //提取题目
    if (className("android.widget.ListView").exists()) {
        var _timu = className("android.widget.ListView").findOnce().parent().child(0).desc();
    } else {
        //back();
        toastLog("提取题目失败");
        failDo = true;
        beep();
        return;
    }

    var chutiIndex = _timu.lastIndexOf("出题单位");
    if (chutiIndex != -1) {
        _timu = _timu.substring(0, chutiIndex - 2);
    }
    var timuOld = _timu;
    _timu = _timu.replace(/\s/g, "");

    //提取答案
    var ansTimu = [];
    if (className("android.widget.ListView").exists()) {
        className("android.widget.ListView").findOne().children().forEach(child => {
            var answer_q = child.child(0).child(1).desc();
            ansTimu.push(answer_q);
        });
    } else {
        //back();
        toastLog("答案获取失败");
        failDo = true;
        beep();
        return;
    }

    var ansTiku = searchTiku(_timu);
    sleep(300);

    var answer = "";
    var ansFind = "";
    //toastLog(findAnsRet);

    //如果题库中有
    if (ansTiku != "") {
        //toast("ansTiku="+ansTiku);
        answer = ansTiku;
    } else {
        //toast("进入");
        //从题目中提取检索关键词
        var reg = /[\u4e00-\u9fa5a-zA-Z\d]{4,}/;
        var regTimu = reg.exec(timuOld);
        toastLog("search:" + regTimu);
        var ansNet = searchNet(regTimu); //一个数组
        sleep(500);
        //遍历题中的答案
        toastLog("网络答案: " + ansNet);
        for (let item of ansTimu) {
            toastLog(item);
            var indexFind = ansNet.indexOf(item);
            if (indexFind != -1) {
                ansFind = item;
                break;
            }
        }
        toastLog("匹配结果: " + ansFind);
        if (ansFind != "") {
            answer = ansFind;
        } else {
            //网络也没找到，那么随机咯
            let randomIndex = random(0, ansTimu.length - 1);
            answer = ansTimu[randomIndex];
            beep();
            //sleep(10*1000);
            //return;
        }
    }
    //开始点击

    if (className("android.view.View").desc(answer).exists()) {
        //RadioButton位置
        var b = className("android.view.View").desc(answer).findOnce().parent().child(0).bounds();
        var tipsWindow = drawfloaty(b.centerX(), b.centerY());
        sleep(300);
        //点击RadioButton
        className("android.view.View").desc(answer).findOnce().parent().child(0).click();
        sleep(300);
        //floaty.closeAll();
        tipsWindow.close();
    } else {
        //back();
        toastLog("点击答案失败");
        failDo = true;
        beep();
        //return;
    }

    sleep(1000);
    //写库
    if (!className("android.view.View").descContains("本次答对").exists()) {//如果答对
        if (ansTiku == "") {
            var sqlstr = "INSERT INTO tiku VALUES ('" + _timu + "','" + answer + "','')";
            insertOrUpdate(sqlstr);
        }
    } else {
        if (ansTiku != "" && !failDo) {
            //删掉这条
            toastLog("删除答案: " + ansTiku);
            var sqlstr = "DELETE FROM tiku WHERE question LIKE '" + _timu + "'";
            insertOrUpdate(sqlstr);
        }
    }
    //sleep(1000);
}

function begin() {
    while (true) {
        //floaty.closeAll();
        if (className("android.view.View").descContains("本次答对").exists()) {
            beep();
            //break;
            //back();
        }
        if (className("android.view.View").desc("挑战答题").exists()) {
            className("android.view.View").desc("挑战答题").click();
            sleep(3000);
        }
        tiaoZhan();
        sleep(1000);
        //i++;
    }
}

module.exports = begin;


