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
            background-image: url(${configJson.background});
        }
        body::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
        }
    `;
    document.head.appendChild(style);
    if (configJson.darkMode === true) {
        console.log('Dark mode enabled');
        const darkMode = document.createElement('style');
        darkMode.textContent = `
            * {
                color: #dddddd;
            }
            .titlebar .title {
                color: #eeeeee;
            }.titlebar .controls button {
                svg {
                    fill: #eeeeee;
                }
                svg:hover {
                    fill: #ffffff;
                }
            }
            .icons {
                fill:#ffffff
            }
        `;
        document.head.appendChild(darkMode);
    }
}
loadStyle();