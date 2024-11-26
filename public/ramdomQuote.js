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
            if (configJson.extension.randomQuote.quoteTranslation) {
                quoteBox.innerHTML = `<p id="quoteMain">${quoteSet.main}</p> 
                    <p id="quoteTranslation">${"&emsp;" + quoteSet.translation}</p> 
                    <p id="quoteAuthor">${"&mdash;&mdash; " + quoteSet.author}</p>`;
            }
            else {
            quoteBox.innerHTML = `<p id="quoteMain">${quoteSet.main}</p> 
                <p id="quoteAuthor">${"&mdash;&mdash; " + quoteSet.author}</p>`;
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
        alert('复制成功');
    }).catch(err => {
        console.error('复制失败', err);
    })
};
document.getElementById('copyQuoteElementButton').addEventListener('click', copyText);
getQuote();