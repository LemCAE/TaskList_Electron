async function loadStyle() {
    const configJson = await window.fileAPI.readConfig('config.json');
    const style = document.createElement('style');
    style.textContent = `
        body {
            background-image: url("${configJson.background}");
        }
        body::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,${configJson.backgroundMask}); 
            z-index: -1;
        }
        .listContent {
            font-size: ${configJson.fontSize}vw; 
        }
        .listinfo {
            backdrop-filter: blur(${configJson.listBlur}px);
        }
        .configs{
            backdrop-filter: blur(${configJson.configBlur}px);
        }
        #inControl {
            background-color: rgba(255, 255, 255, ${configJson.configMask});
        }
        #focusingModeContainer {
            background-image: url("${configJson.background}");
        }
    `;
    document.head.appendChild(style);
    if (configJson.darkMode === true) {
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
            #openMenu {
                background-color: #ffffff;
                border-top: 0.20vw solid #ffffff;
                border-bottom: 0.20vw solid #ffffff;
            }
            .editListContentInput {
                color: #ffffff;
            }
            .editListContent{
                .editListContentInput:focus {
                    outline:none;
                    background-color: #ffffff2f;
                }
            }
            #selectChangeContainer{
                color: #ffffff;
            }
            #backgroundLocal, #backgroundURL {
                color: #ffffff;
            }
            #selectLocalImage{
                color: #ffffff;
            }
            #backgroundSource:hover{
                cursor: pointer;
                background-color: #ffffff2f;
            }
            #inControl {
                background-color: rgba(0, 0, 0, ${configJson.configMask});
            }
            .moveUp, .moveDown {
                color: #ffffff;
            }
            input[type="time"]::-webkit-calendar-picker-indicator {
                color: #ffffff;
            }
            #focusingModeContainer::before {
                background-color: rgba(0, 0, 0, ${configJson.extension.focusingMode.focusingModeMask}); 
            }
        `;
        document.head.appendChild(darkMode);
    }
    if (configJson.configAnimine === false) {
        const configAnimine = document.createElement('style');
        configAnimine.textContent = `
            .configs {
                transition: 0s;
            }
            #icons {
                transition: 0s;
            }
        `
        document.head.appendChild(configAnimine);
    }
    if (configJson.showTime === false) {
        const showTime = document.createElement('style');
        showTime.textContent = `
            #time {
                display: none;
            }
            #date {
                font-size: 1.6vw;
            }
        `
        document.head.appendChild(showTime);
    }
    if (configJson.CheckboxAnimine === false) {
        const checkboxAnimine = document.createElement('style');
        checkboxAnimine.textContent = `
            .slider {
                transition: 0s;
            }
            .slider:before {
                transition: 0s;
            }
        `
        document.head.appendChild(checkboxAnimine);
    }
    if (configJson.reorderMethod === "button") {
        const reorderMethod = document.createElement('style');
        reorderMethod.textContent = `
            .handle {
                display: none;
            }
        `
        document.head.appendChild(reorderMethod);
    } else if (configJson.reorderMethod === "drag") {
        const reorderMethod = document.createElement('style');
        reorderMethod.textContent = `
            .moveUp , .moveDown {
                display: none;
            }
        `
        document.head.appendChild(reorderMethod);
    }
    if (configJson.showClassList === false) {
        const showClassList = document.createElement('style');
        showClassList.textContent = `
            #classTable {
                display: none;
            }
            #taskList {
                padding: 1vw 1vw 0 1vw;
                width: 95vw;
            }
        `
        document.head.appendChild(showClassList);
    }
    if (configJson.taskListHoverAnimine === false) {
        const taskListHoverAnimine = document.createElement('style');
        taskListHoverAnimine.textContent = `
            .listinfo:hover {
                transform:scale(1)
            }
        `
        document.head.appendChild(taskListHoverAnimine);
    }
    if (configJson.extension.focusingMode.focusingModeClockBlur) {
        const focusingModeClockBlur = document.createElement('style');
        focusingModeClockBlur.textContent = `
            #focusingClockContainer {
                display: flex;
                font-size: 20px;
                margin: 1vw;
                padding: 2vw;
                align-items: center;
                justify-content: center;
                flex-direction: column;
                height: fit-content;
                width: fit-content;
                backdrop-filter: blur(5px);
                border-radius:5px;
                border: 1px solid #ffffffa1;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
            }
        `
        document.head.appendChild(focusingModeClockBlur);
    }
}
loadStyle();
