async function getQuote() {
    const configJson = await window.fileAPI.readConfig('config.json');
    if (!configJson.extension.randomQuote.enable) {
        return
    }
    let quoteFilePath = ''
    if (configJson.extension.randomQuote.quoteFile === '') {
        quoteFilePath = await window.fileAPI.getResourcePath('defaultQuote.json');//打包后不行
    }
    else {
        quoteFilePath = configJson.extension.randomQuote.quoteFile;
    }
    const quoteJson = await window.fileAPI.readJson(quoteFilePath);
    const quoteLength = quoteJson.quotes.length;
    const randomIndex = Math.floor(Math.random() * quoteLength);
    const quoteSet = quoteJson.quotes[randomIndex];
    const quoteFontScale = configJson.extension.randomQuote.quoteFontSizeScale;
    setTimeout(() => {
        try {
            if (document.getElementById("randomQuoteBox")) {
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
            else {
                console.log("no box");
            }
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
        window.infoAPI.showInfoDialog('复制成功');
        window.fileAPI.writeLog('randomQuote.js', "成功复制元素");
    }).catch(err => {
        window.infoAPI.showErrorDialog('复制失败', err);
        window.fileAPI.writeLog('randomQuote.js', "元素复制失败: "+err);
    })
};
document.getElementById('copyQuoteElementButton').addEventListener('click', copyText);
document.getElementById('quoteFileFormatView').addEventListener('click', async function () {
    await window.docswAPI.create()
});
getQuote();