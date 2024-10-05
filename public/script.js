['minimize', 'maximize', 'close'].forEach(action => {
    document.getElementById(action).addEventListener('click', () => {
        window.wAPI[action]();
    });
});

const maximizeSVG = `
<svg t="1725463363630" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4129" width="200" height="200">
    <path d="M836.224 917.333333h-644.266667a85.589333 85.589333 0 0 1-85.333333-85.333333V187.733333a85.589333 85.589333 0 0 1 85.333333-85.333333h644.266667a85.589333 85.589333 0 0 1 85.333333 85.333333v644.266667a91.690667 91.690667 0 0 1-85.333333 85.333333zM191.957333 170.666667a22.869333 22.869333 0 0 0-21.333333 21.333333v644.266667a22.869333 22.869333 0 0 0 21.333333 21.333333h644.266667a22.869333 22.869333 0 0 0 21.333333-21.333333V192a22.869333 22.869333 0 0 0-21.333333-21.333333z" p-id="4130"></path>
</svg>`;
const unmaximizeSVG = `
<svg t="1725463429338" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4293" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200">
    <path d="M836.224 106.666667h-490.666667a85.589333 85.589333 0 0 0-85.333333 85.333333V256h-64a85.589333 85.589333 0 0 0-85.333333 85.333333v490.666667a85.589333 85.589333 0 0 0 85.333333 85.333333h490.666667a85.589333 85.589333 0 0 0 85.333333-85.333333V768h64a85.589333 85.589333 0 0 0 85.333333-85.333333V192a85.589333 85.589333 0 0 0-85.333333-85.333333z m-132.266667 725.333333a20.138667 20.138667 0 0 1-21.333333 21.333333h-490.666667a20.138667 20.138667 0 0 1-21.333333-21.333333V341.333333a20.138667 20.138667 0 0 1 21.333333-21.333333h494.933334a20.138667 20.138667 0 0 1 21.333333 21.333333v490.666667z m153.6-149.333333a20.138667 20.138667 0 0 1-21.333333 21.333333h-64V341.333333a85.589333 85.589333 0 0 0-85.333333-85.333333h-362.666667V192a20.138667 20.138667 0 0 1 21.333333-21.333333h490.666667a20.138667 20.138667 0 0 1 21.333333 21.333333z" p-id="4294"></path>
</svg>`;


const maximizeButton = document.getElementById('maximize');

window.wAPI.onWindowMaximized(() => {
    maximizeButton.innerHTML = unmaximizeSVG;
    const svg = maximizeButton.querySelector('svg');
    svg.style.height = '20px';
    svg.style.width = '20px';
});

window.wAPI.onWindowUnmaximized(() => {
    maximizeButton.innerHTML = maximizeSVG;
    const svg = maximizeButton.querySelector('svg');
    svg.style.height = '20px';
    svg.style.width = '20px';
});

['minimize', 'maximize', 'close'].forEach(action => {
    const svg = document.getElementById(action).querySelector('svg');
    if (svg) {
        svg.style.width = '20px';
        svg.style.height = '20px';
    }
});

const styleElements = [
    { selector: '.titlebar', style: { height: '25px' } },
    { selector: '#classTable', style: { marginTop: '26px' } },
    { selector: '.configs', style: { marginTop: '26px' } },
    { selector: '#taskList', style: { marginTop: '26px' } }
];
styleElements.forEach(({ selector, style }) => {
    Object.assign(document.querySelector(selector).style, style);
});

function updateTime() {
    const now = new Date();
    const formatTime = time => (time < 10 ? '0' + time : time);
    const timeString = `${formatTime(now.getHours())}:${formatTime(now.getMinutes())}`;
    document.getElementById('time').textContent = timeString;
}

// 样式处理及预加载
function hideTitles(elements, titleSelector) {
    elements.forEach(element => {
        element.style.display = 'none';
        element.parentNode.querySelector(titleSelector).style.borderBottom = 'none';
    });
}

function setCheckbox(id, checked) {
    document.getElementById(id).checked = checked;
}
function setInputValue(id, value) {
    document.getElementById(id).querySelector('input').value = value;
}

document.getElementById("editList").classList.add("innerControlShow");
document.getElementById('configsBox').style.transform = 'translateX(95%)';
hideTitles(document.querySelectorAll(".editListContent"), ".editListTitle");
hideTitles(document.querySelectorAll(".settingContent"), ".settingTitle");
hideTitles(document.querySelectorAll(".extendContent"), ".extendTitle");
async function loadStyleSetting() {
    const configJson = await window.fileAPI.readConfig('config.json');

    document.getElementById('backgroundSource').value = configJson.backgroundSource;
    const fileInput = document.getElementById('fileInputContainerLocal');
    const urlInput = document.getElementById('fileInputContainerURL');
    const fileInputText = document.getElementById('backgroundLocal');
    const urlInputText = document.getElementById('backgroundURLInput');

    setInputValue('backgroundMask', configJson.backgroundMask);
    setInputValue('fontSize', configJson.fontSize);
    setInputValue('listBlurChange', configJson.listBlur);
    setInputValue('refreshTimeChange', configJson.refreshTime);
    setInputValue('configBlurChange', configJson.configBlur);
    setInputValue('configMaskChange', configJson.configMask);

    if (configJson.backgroundSource === 'local'){
        fileInputContainer.classList.remove('hidden');
        fileInput.classList.remove('hidden');
        fileInputText.value = decodeURIComponent(configJson.background.replace(/^'(.*)'$/, '$1').replace(/^file:\/\//, ''));
    } else if (configJson.backgroundSource === 'url') {
        fileInputContainer.classList.remove('hidden');
        urlInput.classList.remove('hidden');
        urlInputText.value = decodeURIComponent(configJson.background.replace(/^'(.*)'$/, '$1').replace(/^file:\/\//, ''));
    };
    setCheckbox('darkMode', configJson.darkMode);
    setCheckbox('showTime', configJson.showTime);
    if (configJson.showTime) {
        updateTime();
        setInterval(updateTime, configJson.refreshTime);
    };
    setCheckbox('CheckboxAnimine', configJson.CheckboxAnimine);
    setCheckbox('configAnimine', configJson.configAnimine);
    setCheckbox('autoColseAfterSave', configJson.autoColseAfterSave);   
    if (configJson.autoColseAfterSave) {
        document.getElementById('saveList').addEventListener('click', function () {
            var element=document.getElementById('configsBox');
            element.style.transform==='translateX(95%)' ? element.style.transform='translateX(0)': element.style.transform='translateX(95%)';
            var icons=document.getElementById('icons');
            icons.classList.toggle('show');
        })
    };
    document.getElementById('reorderMethod').value = configJson.reorderMethod;//拖动方式
    setCheckbox('autoLaunch', configJson.autoLaunch);
    if (!configJson.autoLaunch) {
        document.getElementById('autoMinimizeWhenAutoLaunchChange').style.display = 'none';
    };
    setCheckbox('autoMinimizeWhenAutoLaunch',configJson.autoMinimizeWhenAutoLaunch)
    setCheckbox('showClassList', configJson.showClassList);
    if (!configJson.showClassList) {
        document.getElementById('showTimeChange').style.display = 'none';
        document.getElementById('refreshTimeChange').style.display = 'none';
    };
    setCheckbox('taskListHoverAnimine', configJson.taskListHoverAnimine);
    setCheckbox('autoCheckUpdate', configJson.autoCheckUpdate);
    if (!configJson.autoCheckUpdate) {
            document.getElementById('autoDownloadUpdateChange').style.display = 'none';
    };
    setCheckbox('autoDownloadUpdate', configJson.autoDownloadUpdate)
    document.getElementById('updateSource').value = configJson.updateSource;
    //拓展部分
    setCheckbox('enableWritingBGM', configJson.extension.writingBGM.enable);
    setInputValue('writingBGMLasting', configJson.extension.writingBGM.lasting);
    setInputValue('writingBGMVolume', configJson.extension.writingBGM.volume); 
    setInputValue('preCountdownDuration', configJson.extension.writingBGM.preCountdownDuration);
    setCheckbox('systemVolumeSet', configJson.extension.writingBGM.systemVolumeSet);
    document.getElementById('writingBGMStartTime').value = configJson.extension.writingBGM.startTime;
    document.getElementById('BGMFolderInput').value = configJson.extension.writingBGM.BGMFolder;
    if (!configJson.extension.writingBGM.systemVolumeSet) {
        document.getElementById('systemVolumeChange').style.display = 'none';
    };
    document.getElementById('systemVolume').querySelector('input').value = configJson.extension.writingBGM.systemVolume;
}
document.addEventListener('DOMContentLoaded', loadStyleSetting);

// 操作栏弹入弹出
function changeMenuShow() {
var element=document.getElementById('configsBox');
element.style.transform==='translateX(95%)' ? element.style.transform='translateX(0)': element.style.transform='translateX(95%)';
var icons=document.getElementById('icons');
icons.classList.toggle('show');
}

// 操作栏自动回弹
var divElement=document.getElementById('configsBox');

document.addEventListener('click', function (event) {
    var targetElement=event.target;

    if ( !divElement.contains(targetElement)) {
        if (divElement.style.transform !='translateX(95%)') {
            divElement.style.transform='translateX(95%)';
            document.getElementById("openMenu").classList.toggle("change");
            document.getElementById('icons').classList.toggle('show');
        }
    }
});

document.getElementById("openMenu").addEventListener("click", function () {
    this.classList.toggle("change");
});

// 操作栏目录更改

document.getElementById('openMenu').addEventListener('click', function () {
    changeMenuShow();
});

// 读取课表
async function readClassTable() {
    const weekday=new Date().toLocaleDateString('en-US', {
        weekday: 'long'
    });
    try {
        const data=await window.fileAPI.readConfig('classlist.json');
        const classlist=data.classlist;
        if (classlist.hasOwnProperty(weekday)) {
            for (let i=0; i < 8; i++) {
                if (classlist[weekday][i] !== "") {
                    const shortname=classlist[weekday][i];
                    document.getElementById(`name${i + 1}`).querySelector('.A').innerText=data.subject[shortname];
                    document.getElementById(`name${i + 1}`).classList.add(shortname);
                }
            }
        }
        else {
            console.log('没有找到该天的课程表');
        }
        }
    catch (error) {
        console.error('处理课程数据时出错:', error);
    }
}
readClassTable();
function getCurrentDate() {
    const now=new Date();
    const month=now.getMonth()+1;
    const day=now.getDate();
    return `${month < 10 ? '0' + month : month}/${day < 10 ? '0' + day : day}`;
}
document.getElementById('date').innerText=getCurrentDate();
document.getElementById('weekdays').innerText=new Date().toLocaleDateString('zh-CN', {weekday: 'long'});
setInterval(60000,function () {
    if (document.getElementById('date').innerText !== getCurrentDate()) {
        document.getElementById('date').innerText=getCurrentDate();
        document.getElementById('weekdays').innerText=new Date().toLocaleDateString('zh-CN', {weekday: 'long'});
        readClassTable();
    } else {
        null
    }
})

// 读取任务列表
function createlist(inner) {
    const div=document.createElement('div');
    div.classList.add('listItem');
    div.innerHTML=` <div class="singleLine"><p>${inner}</p></div>`;
    return div;
}

async function readTaskList(jsonFile) {
    try {
        const tasklist=await window.fileAPI.readConfig(`${jsonFile}`);
        for (const key in tasklist) {
            if (tasklist.hasOwnProperty(key)) {
                const listElement=document.getElementById(`${key}list`);
                if ( !listElement) {
                    console.error(`无法找到元素: ${key}list`);
                    continue;
                }
                const listContent=listElement.querySelector(".listContent");
                if ( !listContent) {
                    console.error(`无法找到 .listContent 在: ${key}list`);
                    continue;
                }
                tasklist[key].forEach(element=> {
                    listContent.appendChild(createlist(element));
                });
            }
        }
    }
    catch (error) {
        console.error('处理任务数据时出错:', error);
    }
}

readTaskList("list.json");

async function getListToEdit(jsonFile) {
    try {
        const tasklist=await window.fileAPI.readConfig(`${jsonFile}`);
        if ( !tasklist) return;
        for (const key in tasklist) {
            if (tasklist.hasOwnProperty(key)) {
                const container=document.getElementById(`editList${key}`).querySelector(".editListContent");
                // 清空现有的输入框，但保留 "createNewTask" 按钮
                container.innerHTML='<div draggable="false" class="createNewTask">+</div>';
                tasklist[key].forEach(element=> {
                    element = element.replace(/"/g, '&quot;');
                    const inputWrapper=document.createElement('div');
                    inputWrapper.classList.add("input-wrapper");
                    inputWrapper.innerHTML=` <span class="handle" >⁝⁝</span> <input value="${element}" class="editListContentInput" > <span class="removeTask" >⨉</span> `;
                    container.insertBefore(inputWrapper, container.querySelector('.createNewTask'));
                });
                initializeSortable(container);
            }
        }
    }
    catch (error) {
        console.error('处理任务数据时出错:', error);
    }
}

getListToEdit("list.json");

function hideEditListContent(id) {
    var element=document.getElementById(id).querySelector(".editListContent");
    element.style.display=element.style.display==="none" ? "flex": "none";
    var titleElement=document.getElementById(id).querySelector(".editListTitle");
    titleElement.style.borderBottom=titleElement.style.borderBottom==="none" ? "1px dashed #ffffff": "none";
}
document.addEventListener('click', function (event) {
    if (event.target.matches('.editListTitle')) {
        hideEditListContent(event.target.parentElement.id);
    }
});

function hideSettingContent(id) {
    var element=document.getElementById(id).querySelector(".settingContent");
    element.style.display=element.style.display==="none" ? "flex": "none";
    var titleElement=document.getElementById(id).querySelector(".settingTitle");
    titleElement.style.borderBottom=titleElement.style.borderBottom==="none" ? "1px dashed #ffffff": "none";
}
document.addEventListener('click', function (event) {
    if (event.target.matches('.settingTitle')) {
        hideSettingContent(event.target.parentElement.id);
    }
});

function hideExtendContent(id) {
    var element=document.getElementById(id).querySelector(".extendContent");
    element.style.display=element.style.display==="none" ? "flex": "none";
    var titleElement=document.getElementById(id).querySelector(".extendTitle");
    titleElement.style.borderBottom=titleElement.style.borderBottom==="none" ? "1px dashed #ffffff": "none";
}
document.addEventListener('click', function (event) {
    if (event.target.matches('.extendTitle')) {
        hideExtendContent(event.target.parentElement.id);
    }
});
function reloadTaskList(jsonFile) {
// 清空当前的任务列表内容
document.querySelectorAll('.listContent').forEach(container=> {
        container.innerHTML=''; // 清空内容
    });
    readTaskList(jsonFile);
}

async function reloadEditListContent(jsonFile) {
    // 清空当前的编辑列表内容，保留 "createNewTask" 按钮
    document.querySelectorAll('.editListContent').forEach(container=> {
            container.innerHTML='<div draggable="false" class="createNewTask">+</div>'; // 重置内容，保留按钮
        });
    // 重新读取并加载编辑输入框内容
    await getListToEdit(jsonFile);
    initializeSorting()
}

document.getElementById('saveList').addEventListener('click', async () => {
    const data = {
        cn: [],
        ma: [],
        en: [],
        ph: [],
        ch: [],
        bi: [],
        ot: []
    };
    // 遍历每个编辑列表区块
    document.querySelectorAll('.editListinner').forEach(section => {
        const key = section.id.replace('editList', '').toLowerCase();
        const inputs = section.querySelectorAll('.editListContentInput');
        const values = Array.from(inputs).map(input => input.value).filter(value => value.trim() !== '');
        
        data[key] = values;
    });
    console.log('Final data to save:', data);
    await window.fileAPI.writeConfig('list.json', data);
    console.log('Data saved successfully');
    reloadTaskList('list.json');
    reloadEditListContent('list.json');
});

function initializeSortable(container) {
    return new Sortable(container, {
        handle: '.handle', // 通过手柄拖拽
        draggable: '.input-wrapper', // 只允许拖拽 input-wrapper 元素
        animation: 150,
        ghostClass: 'sortable-ghost',
        filter: '.createNewTask', // 过滤掉 "createNewTask" 元素
        preventOnFilter: true, // 禁止拖动过滤的元素
        onEnd: function (evt) {
            // 确保 ".createNewTask" 元素始终在最后
            const createNewTask=container.querySelector('.createNewTask');
            if (createNewTask) {
                container.appendChild(createNewTask);
            }
        }
    });
}
function initializeButtonSorting(container) {
    container.querySelectorAll('.input-wrapper').forEach(wrapper => {
        // 添加向上和向下按钮
        const upButton = document.createElement('button');
        upButton.innerText = '∧';
        upButton.classList.add('moveUp');
        
        const downButton = document.createElement('button');
        downButton.innerText = '∨';
        downButton.classList.add('moveDown');

        wrapper.insertBefore(downButton, wrapper.firstChild);
        wrapper.insertBefore(upButton, wrapper.firstChild);

        // 添加点击事件处理
        upButton.addEventListener('click', () => moveUp(wrapper));
        downButton.addEventListener('click', () => moveDown(wrapper));
    });
}
function moveUp(wrapper) {
    const prev = wrapper.previousElementSibling;
    if (prev && prev.classList.contains('input-wrapper')) {
        wrapper.parentNode.insertBefore(wrapper, prev);
    }
}
function moveDown(wrapper) {
    const next = wrapper.nextElementSibling;
    if (next && next.classList.contains('input-wrapper')) {
        wrapper.parentNode.insertBefore(next, wrapper);
    }
}
async function initializeSorting() {
    const config = await window.fileAPI.readConfig('config.json');
    if (config.reorderMethod === "drag") {
        // 使用拖拽方式
        document.querySelectorAll('.editListContent').forEach(container => {
            initializeSortable(container);
        });
    } else {
        // 使用按钮方式
        document.querySelectorAll('.editListContent').forEach(container => {
            initializeButtonSorting(container);
        });
    }
}
document.addEventListener('DOMContentLoaded', async function () {
    initializeSorting()
});


document.addEventListener('click', function (event) {
    if (event.target.matches('.createNewTask')) {
        const container=event.target.closest('.editListContent');
        if (container) {
            const inputWrapper=document.createElement('div');
            inputWrapper.classList.add('input-wrapper');
            inputWrapper.innerHTML=` <span class="handle">⁝⁝</span> <input value="" class="editListContentInput" > <span class="removeTask" >⨉</span> `;
            container.insertBefore(inputWrapper, event.target);
            const upButton = document.createElement('button');
            upButton.innerText = '∧';
            upButton.classList.add('moveUp');
            const downButton = document.createElement('button');
            downButton.innerText = '∨';
            downButton.classList.add('moveDown');
            inputWrapper.insertBefore(downButton, inputWrapper.firstChild);
            inputWrapper.insertBefore(upButton,inputWrapper.firstChild);
            upButton.addEventListener('click', () => moveUp(inputWrapper));
            downButton.addEventListener('click', () => moveDown(inputWrapper));
        }
    }
});

document.addEventListener('click', function (event) {
    if (event.target.matches('.removeTask')) {
        const inputWrapper=event.target.closest('.input-wrapper');
        if (inputWrapper) {
            inputWrapper.remove();
        }
    }
});

document.getElementById('iconEditDiv').addEventListener('click', function() {
    for (let i = 0; i < 4; i++) {
        let element = ["editList","setting","extend","info"][i];
        if (document.getElementById(element).classList.contains("innerControlShow")) {
            document.getElementById(element).classList.remove("innerControlShow")
        }
    };
    document.getElementById("editList").classList.add("innerControlShow")
})
document.getElementById('iconSettingDiv').addEventListener('click', function() {
    for (let i = 0; i < 4; i++) {
        let element = ["editList","setting","extend","info"][i];
        if (document.getElementById(element).classList.contains("innerControlShow")) {
            document.getElementById(element).classList.remove("innerControlShow")
        }
    };
    document.getElementById("setting").classList.add("innerControlShow")
})
document.getElementById('iconExtendDiv').addEventListener('click', function() {
    for (let i = 0; i < 4; i++) {
        let element = ["editList","setting","extend","info"][i];
        if (document.getElementById(element).classList.contains("innerControlShow")) {
            document.getElementById(element).classList.remove("innerControlShow")
        }
    };
    document.getElementById("extend").classList.add("innerControlShow")
})
document.getElementById('iconInfoDiv').addEventListener('click', function() {
    for (let i = 0; i < 4; i++) {
        let element = ["editList","setting","extend","info"][i];
        if (document.getElementById(element).classList.contains("innerControlShow")) {
            document.getElementById(element).classList.remove("innerControlShow")
        }
    };
    document.getElementById("info").classList.add("innerControlShow")
})

document.getElementById('saveSetting').addEventListener('click', async () => {
    // 读取现有的 JSON 数据
    const existingConfig = await window.fileAPI.readConfig('config.json') || {};
    
    // 获取设置值
    const fontSize = document.getElementById('fontSize').querySelector('input').value;
    const darkMode = document.getElementById('darkMode').checked;
    const backgroundMask = document.getElementById('backgroundMask').querySelector('input').value;
    const configAnimine = document.getElementById('configAnimine').checked;
    const configBlur = document.getElementById('configBlur').querySelector('input').value;
    const configMask = document.getElementById('configMask').querySelector('input').value;
    const backgroundSource = document.getElementById('backgroundSource').value;
    const showTime = document.getElementById('showTime').checked;
    const CheckboxAnimine = document.getElementById('CheckboxAnimine').checked;
    const refreshTime = document.getElementById('refreshTime').querySelector('input').value;
    const autoColseAfterSave = document.getElementById('autoColseAfterSave').checked;
    const reorderMethod = document.getElementById('reorderMethod').value;
    const autoLaunch = document.getElementById('autoLaunch').checked;
    const autoMinimizeWhenAutoLaunch = document.getElementById('autoMinimizeWhenAutoLaunch').checked;
    const showClassList = document.getElementById('showClassList').checked;
    const taskListHoverAnimine = document.getElementById('taskListHoverAnimine').checked;
    const listBlur = document.getElementById('listBlur').querySelector('input').value;
    const updateSource = document.getElementById('updateSource').value;
    const autoCheckUpdate = document.getElementById('autoCheckUpdate').checked;
    const autoDownloadUpdate = document.getElementById('autoDownloadUpdate').checked;
    
    let background = '';
    if (backgroundSource === 'defaultLight') {
        background = '../resource/default.jpg';
    } else if (backgroundSource === 'defaultDark') {
        background = '../resource/defaultDark.jpg';
    } else if (backgroundSource === 'local') {
        background = "'" + encodeURI("file://" + document.getElementById('backgroundLocal').value.replace(/\\/g, '/')) + "'"; 
        console.log (background);
    } else if (backgroundSource === 'url') {
        background = document.getElementById('backgroundURLInput').value; // 读取URL链接
    }
    // 合并新设置和现有的扩展设置（保持嵌套结构）
    const newConfig = {
        ...existingConfig,
        fontSize: fontSize,
        darkMode: darkMode,
        backgroundMask: backgroundMask,
        backgroundSource: backgroundSource,
        showTime: showTime,
        background: background,
        configAnimine: configAnimine,
        configBlur: configBlur,
        configMask: configMask,
        CheckboxAnimine: CheckboxAnimine,
        refreshTime: refreshTime,
        autoColseAfterSave: autoColseAfterSave,
        reorderMethod: reorderMethod,
        autoLaunch: autoLaunch,
        autoMinimizeWhenAutoLaunch: autoMinimizeWhenAutoLaunch,
        showClassList: showClassList,
        taskListHoverAnimine: taskListHoverAnimine,
        listBlur: listBlur,
        updateSource: updateSource,
        autoCheckUpdate: autoCheckUpdate,
        autoDownloadUpdate: autoDownloadUpdate,
        extension: {
            ...existingConfig.extension,
        }
    };

    console.log('Final config to save:', newConfig);

    // 保存数据并在写入完成后再执行操作
    await window.fileAPI.writeConfig('config.json', newConfig);
    console.log('Config saved successfully');


    window.wAPI.toggleAutoLaunch(autoLaunch); // 直接传递autoLaunch的状态
    window.location.reload();
});

document.getElementById('saveExtensionSetting').addEventListener('click', async () => {
    // 读取现有的 JSON 数据
    const existingConfig = await window.fileAPI.readConfig('config.json') || {};
    const writingBGMEnable = document.getElementById('enableWritingBGM').checked;
    const writingBGMLasting = document.getElementById('writingBGMLasting').querySelector('input').value;
    const writingBGMVolume = document.getElementById('writingBGMVolume').querySelector('input').value;
    const writingBGMStartTime = document.getElementById('writingBGMStartTime').value;
    const writingBGMBGMFolder = document.getElementById('BGMFolderInput').value;
    const preCountdownDuration = document.getElementById('preCountdownDuration').querySelector('input').value;
    const systemVolumeSet = document.getElementById('systemVolumeSet').checked;
    const systemVolume = document.getElementById('systemVolume').querySelector('input').value;
    // 合并新设置和现有的扩展设置（保持嵌套结构）
    const newConfig = {
        ...existingConfig,
        extension: {
            ...existingConfig.extension,  // 保持已有的 extension 设置
            writingBGM: {
                enable: writingBGMEnable,
                lasting: writingBGMLasting,
                volume: writingBGMVolume,
                startTime: writingBGMStartTime,
                BGMFolder: writingBGMBGMFolder,
                preCountdownDuration: preCountdownDuration,
                systemVolumeSet: systemVolumeSet,
                systemVolume: systemVolume
            }
        }
    };

    console.log('Final config to save:', newConfig);
    await window.fileAPI.writeConfig('config.json', newConfig);
    console.log('Config saved successfully');
    window.location.reload();
});
document.getElementById('backgroundSource').addEventListener('change', function() {
    const selectedOption = this.value;
    const fileInputContainer = document.getElementById('fileInputContainer');
    const fileInput = document.getElementById('fileInputContainerLocal');
    const urlInput = document.getElementById('fileInputContainerURL');

    if (selectedOption === 'local') {
        fileInputContainer.classList.remove('hidden'); 
        fileInput.classList.remove('hidden');
        urlInput.classList.add('hidden');
    } else if (selectedOption === 'url') {
        fileInputContainer.classList.remove('hidden'); 
        urlInput.classList.remove('hidden');
        fileInput.classList.add('hidden');
    } else {
        fileInputContainer.classList.add('hidden');
        fileInput.classList.add('hidden');
        urlInput.classList.add('hidden');
    }
});

document.getElementById('selectLocalImage').addEventListener('click', async () => {
    const filePath = await window.fileAPI.selectImage();
    if (filePath) {
        document.getElementById('backgroundLocal').value = filePath; // 将路径显示在输入框中
    }
});

document.getElementById('selectBGMFolder').addEventListener('click', async () => {
    const folderPaths = await window.fileAPI.selectFolder();
    if (folderPaths) {
        document.getElementById('BGMFolderInput').value = folderPaths; // 将路径显示在输入框中
    }
});
document.getElementById('showClassList').addEventListener('change', function() {
    const showClassList = document.getElementById('showClassList').checked;
    if (showClassList) {
        document.getElementById('showTimeChange').style.display = 'flex';
        document.getElementById('refreshTimeChange').style.display = 'flex';
    } else {
        document.getElementById('showTimeChange').style.display = 'none';
        document.getElementById('refreshTimeChange').style.display = 'none';
    }
})

document.getElementById('autoLaunch').addEventListener('change', function() {
    const autoLaunch = document.getElementById('autoLaunch').checked;
    if (autoLaunch) {
        console.log('autoLaunch');
        document.getElementById('autoMinimizeWhenAutoLaunchChange').style.display = 'flex';
    } else {
        console.log('no autoLaunch');
        document.getElementById('autoMinimizeWhenAutoLaunchChange').style.display = 'none';
    }
})

document.getElementById('autoCheckUpdate').addEventListener('change', function() {
    const autoCheckUpdate = document.getElementById('autoCheckUpdate').checked;
    if (autoCheckUpdate) {
        document.getElementById('autoDownloadUpdateChange').style.display = 'flex';
    } else {
        document.getElementById('autoDownloadUpdateChange').style.display = 'none';
    }
})

document.getElementById('systemVolumeSet').addEventListener('change', function() {
    const systemVolumeSet = document.getElementById('systemVolumeSet').checked;
    if (systemVolumeSet) {
        document.getElementById('systemVolumeChange').style.display = 'flex';
    } else {
        document.getElementById('systemVolumeChange').style.display = 'none';
    }
})
document.addEventListener("DOMContentLoaded", function () {
    // 通用的加减函数
    function initializeNumberInput(containerId) {
        const container = document.querySelector(`#${containerId}`);
        const input = container.querySelector("input[type='number']");
        const plusButton = container.querySelector(".plus");
        const minusButton = container.querySelector(".minus");
        // 增加输入框的数值
        plusButton.addEventListener("click", function () {
            let currentSize = parseFloat(input.value);
            let step = parseFloat(input.step);
            let newSize = parseFloat((currentSize + step).toFixed(2));
            if (newSize <= parseFloat(input.max)) {
                input.value = newSize;
            }
        });
        // 减少输入框的数值
        minusButton.addEventListener("click", function () {
            let currentSize = parseFloat(input.value);
            let step = parseFloat(input.step);
            let newSize = parseFloat((currentSize - step).toFixed(2));
            if (newSize >= parseFloat(input.min)) {
                input.value = newSize;
            }
        });
        // 输入框直接修改数值
        input.addEventListener("input", function () {
            let currentSize = parseFloat(input.value);
            if (currentSize > parseFloat(input.max)) {
                input.value = input.max;
            } else if (currentSize < parseFloat(input.min)) {
                input.value = input.min;
            }
        });
    }
    initializeNumberInput("fontSizeChange");
    initializeNumberInput("backgroundMaskChange");
    initializeNumberInput("configBlurChange");
    initializeNumberInput("configMaskChange");
    initializeNumberInput("refreshTimeChange");
    initializeNumberInput("writingBGMLastingChange");
    initializeNumberInput("writingBGMVolumeChange");
    initializeNumberInput("preCountdownDurationChange");
    initializeNumberInput("listBlurChange");
    initializeNumberInput("systemVolume");
});
document.getElementById('clearTaskButton').addEventListener('click', async () => {
    const detailText = '现有任务列表将被清除';
    const ifContinue = await window.infoAPI.showWarningDialog(detailText);
    if (ifContinue === 0) {
        const data= {
            cn: [],
            ma: [],
            en: [],
            ph: [],
            ch: [],
            bi: [],
            ot: []
        };
        await window.fileAPI.writeConfig('list.json', data);
        reloadTaskList('list.json');
        reloadEditListContent('list.json');
    } else {
        null
    }
});
document.getElementById('importTaskButton').addEventListener('click', async () => {
    const result = await window.fileAPI.importFile();
    if (result.success) {
        const detailText = '现有任务列表将被覆盖';
        const ifContinue = await window.infoAPI.showWarningDialog(detailText);
        if (ifContinue === 0) {
            await window.fileAPI.writeConfig('list.json', result.data);
            reloadTaskList('list.json');
            reloadEditListContent('list.json');
            alert('文件导入成功！');
        } else {
            null
        }
    } else {
        alert(`导入失败: ${result.error}`);
    }
});
document.getElementById('exportTaskButton').addEventListener('click', async () => {
    const dataToExport = {
        cn: [],
        ma: [],
        en: [],
        ph: [],
        ch: [],
        bi: [],
        ot: []
    };
    const data = await window.fileAPI.readConfig('list.json');
    for (const key in data) {
        dataToExport[key] = data[key];
    }
    const result = await window.fileAPI.exportFile(dataToExport);
    if (result.success) {
        alert('文件导出成功！');
    } else {
        alert(`导出失败: ${result.error}`);
    }
});
document.getElementById('quitAppButton').addEventListener('click', async () => {
    const detailText = '';
    const ifContinue = await window.infoAPI.showWarningDialog(detailText);
    if (ifContinue === 0) {
        window.wAPI.exit();
    } else {
        null
    }
});

document.getElementById('checkUpdateButton').addEventListener('click', async () => {
    const result = await window.wAPI.checkForUpdates();
    if (result.success) {
        if (result.hasUpdate) {
            console.log('Update check completed:', result.message);
        } else {
            console.log('Update check completed:', result.message);
            alert(result.message);
        }
    } else {
        console.error('Update check failed:', result.message);
        alert('Error checking for updates: ' + result.message);
    }
});

window.wAPI.onUpdateProgress((percent) => {
    document.getElementById('progress-bar').style.width = `${percent}%`;
});