async function showDateCountdown() {
    const configJson = await window.fileAPI.readConfig('config.json');
    if (!configJson.extension.dateCountdown.enable) {
        return
    }
    document.getElementById("dateCountdown").style.display = "block";
    function difference(date1, date2) {
        const date1utc = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
        const date2utc = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());
        const day = 1000 * 60 * 60 * 24;
        return (date2utc - date1utc) / day;
    }
    async function getNowFormatDate() {
        let date = new Date(),
        year = date.getFullYear(), // 获取完整的年份(4位)
        month = date.getMonth() + 1, // 获取当前月份(0-11,0代表1月)
        strDate = date.getDate(); // 获取当前日(1-31)
        if (month < 10) month = `0${month}`; // 如果月份是个位数，在前面补0
        if (strDate < 10) strDate = `0${strDate}`; // 如果日是个位数，在前面补0
        return `${year}-${month}-${strDate}`;
    }
    async function getDateDiff() {
        const date1 = new Date(await getNowFormatDate());
        const date2 = new Date(configJson.extension.dateCountdown.dateCountdownTime);
        const timeDifference = difference(date1, date2);
        document.getElementById("dateCountdownDetail").innerHTML = configJson.extension.dateCountdown.dateCountdownDetail;
        document.getElementById("dateCountdownTime").innerHTML = `${timeDifference}天`;
    }
    getDateDiff();
};
showDateCountdown()