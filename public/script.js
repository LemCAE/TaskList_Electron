document.getElementById('minimize').addEventListener('click', () => {
    window.wAPI.minimize();
});
document.getElementById('maximize').addEventListener('click', () => {
    window.wAPI.maximize();
});
document.getElementById('close').addEventListener('click', () => {
    window.wAPI.close();
});
const maximizeSVG = `
<svg t="1725463363630" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4129" width="200" height="200">
    <path d="M836.224 917.333333h-644.266667a85.589333 85.589333 0 0 1-85.333333-85.333333V187.733333a85.589333 85.589333 0 0 1 85.333333-85.333333h644.266667a85.589333 85.589333 0 0 1 85.333333 85.333333v644.266667a91.690667 91.690667 0 0 1-85.333333 85.333333zM191.957333 170.666667a22.869333 22.869333 0 0 0-21.333333 21.333333v644.266667a22.869333 22.869333 0 0 0 21.333333 21.333333h644.266667a22.869333 22.869333 0 0 0 21.333333-21.333333V192a22.869333 22.869333 0 0 0-21.333333-21.333333z" p-id="4130"></path>
</svg>`;
const unmaximizeSVG = `
<svg t="1725463429338" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4293" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200">
    <path d="M836.224 106.666667h-490.666667a85.589333 85.589333 0 0 0-85.333333 85.333333V256h-64a85.589333 85.589333 0 0 0-85.333333 85.333333v490.666667a85.589333 85.589333 0 0 0 85.333333 85.333333h490.666667a85.589333 85.589333 0 0 0 85.333333-85.333333V768h64a85.589333 85.589333 0 0 0 85.333333-85.333333V192a85.589333 85.589333 0 0 0-85.333333-85.333333z m-132.266667 725.333333a20.138667 20.138667 0 0 1-21.333333 21.333333h-490.666667a20.138667 20.138667 0 0 1-21.333333-21.333333V341.333333a20.138667 20.138667 0 0 1 21.333333-21.333333h494.933334a20.138667 20.138667 0 0 1 21.333333 21.333333v490.666667z m153.6-149.333333a20.138667 20.138667 0 0 1-21.333333 21.333333h-64V341.333333a85.589333 85.589333 0 0 0-85.333333-85.333333h-362.666667V192a20.138667 20.138667 0 0 1 21.333333-21.333333h490.666667a20.138667 20.138667 0 0 1 21.333333 21.333333z" p-id="4294"></path>
</svg>`;

window.wAPI.onWindowMaximized(() => {
    document.getElementById('maximize').innerHTML = unmaximizeSVG;
    document.getElementById('maximize').querySelector('svg').style.height = '20px';
    document.getElementById('maximize').querySelector('svg').style.width = '20px';
});
window.wAPI.onWindowUnmaximized(() => {
    document.getElementById('maximize').innerHTML = maximizeSVG;
    document.getElementById('maximize').querySelector('svg').style.height = '20px';
    document.getElementById('maximize').querySelector('svg').style.width = '20px';
});
document.querySelector('.titlebar').style.height = `25px`;
document.querySelector('.classList').style.marginTop = `26px`;
document.querySelector('.configs').style.marginTop = `26px`;
document.getElementById('minimize').querySelector('svg').style.height = '20px';
document.getElementById('maximize').querySelector('svg').style.height = '20px';
document.getElementById('close').querySelector('svg').style.height = '20px';
document.getElementById('minimize').querySelector('svg').style.width = '20px';
document.getElementById('maximize').querySelector('svg').style.width = '20px';
document.getElementById('close').querySelector('svg').style.width = '20px';
document.querySelector('.taskList').style.marginTop = `26px`;

function updateTime() {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    const timeString = `${hours}:${minutes}`;
    document.getElementById('time').textContent = timeString;
}

// 样式处理及预加载
document.getElementById("editList").classList.add("innerControlShow");
document.getElementById('configsBox').style.transform='translateX(95%)';
document.querySelectorAll(".editListContent").forEach(element=> {
    element.style.display='none';
    element.parentNode.querySelector(".editListTitle").style.borderBottom="none";
});
document.querySelectorAll(".settingContent").forEach(element=> {
    element.style.display='none';
    element.parentNode.querySelector(".settingTitle").style.borderBottom="none";
});
async function loadStyleSetting() {
    const configJson = await window.fileAPI.readConfig('config.json');
    document.getElementById('backgroundSource').value = configJson.backgroundSource;
    const fileInput = document.getElementById('fileInputContainerLocal');
    const urlInput = document.getElementById('fileInputContainerURL');
    const fileInputText = document.getElementById('backgroundLocal');
    const urlInputText = document.getElementById('backgroundURLInput');
    document.getElementById('backgroundMask').querySelector('input').value = configJson.backgroundMask;
    document.getElementById('fontSize').querySelector('input').value = configJson.fontSize;backgroundMask;
    document.getElementById('refreshTimeChange').querySelector('input').value = configJson.refreshTime;
    document.getElementById('configBlurChange').querySelector('input').value = configJson.configBlur;
    document.getElementById('configMaskChange').querySelector('input').value = configJson.configMask;
    if (configJson.backgroundSource === 'local'){
        fileInputContainer.classList.remove('hidden');
        fileInput.classList.remove('hidden');
        fileInputText.value = decodeURIComponent(configJson.background.replace(/^'(.*)'$/, '$1').replace(/^file:\/\//, ''));
    } else if (configJson.backgroundSource === 'url') {
        fileInputContainer.classList.remove('hidden');
        urlInput.classList.remove('hidden');
        urlInputText.value = decodeURIComponent(configJson.background.replace(/^'(.*)'$/, '$1').replace(/^file:\/\//, ''));
    };
    if (configJson.darkMode === false) {
        document.getElementById('darkMode').checked = false;
    } else {
        document.getElementById('darkMode').checked = true;
    };
    if (configJson.showTime === false) {
        document.getElementById('showTime').checked = false;
    } else {
        document.getElementById('showTime').checked = true;
        updateTime();
        setInterval(updateTime, configJson.refreshTime);
    };
    if (configJson.CheckboxAnimine === false) {
        document.getElementById('CheckboxAnimine').checked = false;
    } else {
        document.getElementById('CheckboxAnimine').checked = true;
    };
    if (configJson.configAnimine === false) {
        document.getElementById('configAnimine').checked = false;
    } else {
        document.getElementById('configAnimine').checked = true;
    };
    if (configJson.autoColseAfterSave === false) {
        document.getElementById('autoColseAfterSave').checked = false;
    } else {
        document.getElementById('autoColseAfterSave').checked = true;
        document.getElementById('saveList').addEventListener('click', function () {
            var element=document.getElementById('configsBox');
            element.style.transform==='translateX(95%)' ? element.style.transform='translateX(0)': element.style.transform='translateX(95%)';
            var icons=document.getElementById('icons');
            icons.classList.toggle('show');
        })
    };
    if (configJson.reorderMethod === 'drag') {
        document.getElementById('reorderMethod').value = 'drag';
    } else if (configJson.reorderMethod === 'button'){
        document.getElementById('reorderMethod').value = 'button';
    };
    if (configJson.autoLaunch === false) {
        document.getElementById('autoLaunch').checked = false;
    } else {
        document.getElementById('autoLaunch').checked = true;
    };
    if (configJson.showClassList === false) {
        document.getElementById('showClassList').checked = false;
        document.getElementById('showTimeChange').style.display = 'none';
        document.getElementById('refreshTimeChange').style.display = 'none';
    } else {
        document.getElementById('showClassList').checked = true;
    }
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
async function readTable() {
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

readTable();

function getCurrentDate() {
const now=new Date();
const month=now.getMonth()+1;
const day=now.getDate();
return `${month < 10 ? '0' + month : month}/${day < 10 ? '0' + day : day}`;}
document.getElementById('date').innerText=getCurrentDate();
document.getElementById('weekdays').innerText=new Date().toLocaleDateString('zh-CN', {weekday: 'long'});

// 读取任务列表
function createlist(inner) {
const div=document.createElement('div');
div.classList.add('listItem');
div.innerHTML=` <div class="singleLine"><p>${inner}</p></div>`;
return div;
}

async function readTaskList(jsonFile) {
    try {
        const tasklist=await window.fileAPI.readConfig(`lists/${jsonFile}`);
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
        const tasklist=await window.fileAPI.readConfig(`lists/${jsonFile}`);
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

    await window.fileAPI.writeConfig('lists/list.json', data);

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
    for (let i = 0; i < 3; i++) {
        let element = ["editList","setting","info"][i];
        if (document.getElementById(element).classList.contains("innerControlShow")) {
            document.getElementById(element).classList.remove("innerControlShow")
        }
    };
    document.getElementById("editList").classList.add("innerControlShow")
})
document.getElementById('iconSettingDiv').addEventListener('click', function() {
    for (let i = 0; i < 3; i++) {
        let element = ["editList","setting","info"][i];
        if (document.getElementById(element).classList.contains("innerControlShow")) {
            document.getElementById(element).classList.remove("innerControlShow")
        }
    };
    document.getElementById("setting").classList.add("innerControlShow")
})
document.getElementById('iconInfoDiv').addEventListener('click', function() {
    for (let i = 0; i < 3; i++) {
        let element = ["editList","setting","info"][i];
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
    const showClassList = document.getElementById('showClassList').checked;
    let background = '';
    if (backgroundSource === 'defaultLight') {
        background = '../resource/default.jpg';
    } else if (backgroundSource === 'defaultDark') {
        background = '../resource/defaultDark.jpg';
    }else if (backgroundSource === 'local') {
        background = "'" + encodeURI("file://" + document.getElementById('backgroundLocal').value.replace(/\\/g, '/')) + "'"; 
        console.log (background);
    } else if (backgroundSource === 'url') {
        background = document.getElementById('backgroundURLInput').value; // 读取URL链接
    }
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
        showClassList: showClassList
    };

    console.log('Final config to save:', newConfig);

    // 保存数据并在写入完成后再执行操作
    await window.fileAPI.writeConfig('config.json', newConfig);
    console.log('Config saved successfully');


    window.wAPI.toggleAutoLaunch(autoLaunch); // 直接传递autoLaunch的状态
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
        await window.fileAPI.writeConfig('lists/list.json', data);
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
            await window.fileAPI.writeConfig('lists/list.json', result.data);
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
    const data = await window.fileAPI.readConfig('lists/list.json');
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
