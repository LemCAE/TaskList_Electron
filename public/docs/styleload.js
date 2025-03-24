async function loadStyle() {
    const configJson = await window.fileAPI.readConfig('config.json');
    if (configJson.background === '../resource/default.jpg') {
        configJson.background = '../../resource/default.jpg';
    } else if (configJson.background === '../resource/defaultDark.jpg') {
        configJson.background = '../../resource/defaultDark.jpg';
    }
    const style = document.createElement('style');
    style.textContent = `
        body {
            background-image: url("${configJson.background}");
        }
    `;
    document.head.appendChild(style);
}
loadStyle();