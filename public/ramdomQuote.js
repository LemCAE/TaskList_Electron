async function getQuote() {
    const configJson = await window.fileAPI.readConfig('config.json');
    if (!configJson.extension.randomQuote.enable) {
        return
    }
    const quoteFilePath = configJson.extension.randomQuote.quoteFile;
    const quoteJson = await window.fileAPI.readJson(quoteFilePath);
    const quoteLength = quoteJson.quotes.length;
    const randomIndex = Math.floor(Math.random() * quoteLength);
    const quoteSet = quoteJson.quotes[randomIndex];
    const quoteFontScale = configJson.extension.randomQuote.quoteFontSizeScale;
    setTimeout(() => {
        try {
            let quoteBox = document.getElementById("randomQuoteBox")
            let quoteHtml = ''
            if (configJson.extension.randomQuote.quoteTranslation) {
                quoteHtml += `<p id="quoteMain">${quoteSet.main}</p>`
                if (quoteSet.translation !== '') {
                    quoteHtml += `<p id="quoteTranslation">${"&emsp;" + quoteSet.translation}</p>`
                }
                if (quoteSet.author !== '') {
                    quoteHtml += `<p id="quoteAuthor">${"&mdash;&mdash; " + quoteSet.author}</p>`
                }
            }
            else {
                quoteHtml += `<p id="quoteMain">${quoteSet.main}</p>`
                if (quoteSet.author !== '') {
                    quoteHtml += `<p id="quoteAuthor">${"&mdash;&mdash; " + quoteSet.author}</p>`
                }
            }
            quoteBox.innerHTML = quoteHtml;
        }
        catch (e) {
            console.log("delay");
            return
        }
    }, 50);
    const quoteStyle = document.createElement('style');
    quoteStyle.innerHTML = `
    #randomQuoteBox {
        font-size: ${configJson.fontSize * quoteFontScale}vw;
        #quoteTranslation {
            font-size: ${configJson.fontSize * quoteFontScale * 0.8}vw;
        }
        #quoteAuthor {
            text-align: right;
        }
    }
    `
    document.head.appendChild(quoteStyle);
}
const quoteElement = `<div id="randomQuoteBox"></div>`;
function copyText() {
    navigator.clipboard.writeText(quoteElement).then(() => {
        alert('复制成功');
    }).catch(err => {
        console.error('复制失败', err);
    })
};
document.getElementById('copyQuoteElementButton').addEventListener('click', copyText);
document.getElementById('quoteFileFormatView').addEventListener('click', function () {
    alert(`文件应使用json格式,其基本结构如下:
======================================================
example.json
======================================================
{
    "quotes":[
        {
            "main":"",
            "translation":"",
            "author":""
        },         <-- 相邻字段间有逗号
        ...(更多)
        {
            "main":"",
            "translation":"",
            "author":""
        }          <-- 最后一个字段后无逗号
    ]
}
======================================================
其中,main为主文,translation为另一语言翻译,author为作者或来源。
main为必填项,translation和author为选填项。
请确保格式正确,否则可能导致无法正常显示甚至程序崩溃。
`)
});
getQuote();