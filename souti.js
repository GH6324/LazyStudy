function begin()
{
    recents();
    sleep(1500);
    if (textContains("强国挑战").exists()) {
        toastLog("正在切换小程序");
        click("强国挑战");
    } else {
        launch("com.tencent.mm");
        sleep(1000);
        desc("搜索").findOne().click();
        //className("android.widget.ImageView").id("r_").findOnce().click();
        sleep(1000);
        //click("小程序");
        //sleep(1000);
        setText("强国挑战答题答案查询");
        sleep(1000);
        textContains("搜一搜").findOne(3000).parent().click();
        sleep(1000);
        text("小程序").findOne(3000).click();
        sleep(1000);
        className("android.view.View").text("强国挑战答题答案查询").findOne().parent().parent().click();
        sleep(1000);
        //recents();
    }
}
module.exports=begin;