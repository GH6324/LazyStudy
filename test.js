textContains("搜一搜").findOne().parent().click();
sleep(1000);
text("小程序").findOne().click();
sleep(1000);
className("android.view.View").text("强国挑战答题答案查询").findOne().parent().parent().click();      
sleep(1000);  