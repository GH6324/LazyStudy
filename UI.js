"ui";
let deviceWidth = device.width;
let deviceHeight = device.height;

let margin = parseInt(deviceWidth * 0.05);
let buttonWidth = parseInt(deviceWidth * 0.50);

ui.layout(
    <vertical margin={margin + "px"}>

        <button margin={margin + "px"} id={"showFloating"} text={" 1 加载悬浮窗 "} width={buttonWidth + "px"}/>
        <button margin={margin + "px"} id={"about1"} text={" 2 使用说明"} width={buttonWidth + "px"}/>

    </vertical>
);

ui.showFloating.click(() => {
    engines.execScriptFile("floating.js");
});


ui.about1.click(() => {
    let info = "" +
        "〇脚本的实际操作需要 悬浮窗 和 无障碍权限（设置→辅助功能→无障碍→本 APP，不同手机可能会不一样）\n" +
        "☆挑战答题为无限答题模式，点击停止按钮，停止答题\n"+
        "☆开始挑战答题前，先点击切到搜题，或 打开微信-答案查询 小程序。脚本遇到不会的题，会自动进入小程序搜答案\n"+
        "☆答题中有错误，会有声音提示";

    dialogs.confirm(info);
});



//toastLog(" 每当重新安装 / 更新 APP 的时候，请执行清除本地脚本 ");