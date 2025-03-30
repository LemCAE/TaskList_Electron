['minimize', 'maximize', 'close'].forEach(action => {
    document.getElementById(action).addEventListener('click', () => {
        window.wAPI[action]();
    });
});

// 随机背景图片
let selectedRandomBackgroundImage = "../resource/defaultDark.jpg";
let cleanShowedImageList = false;
let showImageListCleared = false;

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

let currentDate = "";
function updateTime() {
    const now = new Date();
    const formatTime = time => (time < 10 ? '0' + time : time);
    const timeString = `${formatTime(now.getHours())}:${formatTime(now.getMinutes())}`;
    document.getElementById('time').textContent = timeString;
    const formatDate = date => (date < 10 ? '0' + date : date);
    const dateString = `${formatDate(now.getMonth() + 1)}/${formatDate(now.getDate())}`;
    document.getElementById('date').textContent = dateString;
    const formatWeekday = weekday => {
        switch (weekday) {
            case 0:return '星期日';
            case 1:return '星期一';
            case 2:return '星期二';
            case 3:return '星期三';
            case 4:return '星期四';
            case 5:return '星期五';
            case 6:return '星期六';
            default:return '';
        }
    };
    const weekday = now.getDay();
    document.getElementById('weekdays').textContent = formatWeekday(weekday);
    if (currentDate !== dateString) {
        currentDate = dateString;
        updateDateCountDown();
    }
}

async function updateDateCountDown() {
    const configJson = await window.fileAPI.readConfig('config.json');
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
        let timeDifference = difference(date1, date2);
        if (configJson.extension.dateCountdown.ignoreToday) {
            timeDifference = timeDifference - 1;
            document.getElementById("dateCountdownDetail").innerHTML = configJson.extension.dateCountdown.dateCountdownDetail;
            document.getElementById("dateCountdownTime").innerHTML = `${timeDifference}天`;
            console.log(timeDifference);
            if (timeDifference == 0) {
                document.getElementById("dateCountDownText").style.display = "none";
                document.getElementById("dateCountdownTime").innerHTML = "明天";
            }
            if (timeDifference < 0) {
                document.getElementById("dateCountdown").style.display = "none";
            }
        } else {
            document.getElementById("dateCountdownDetail").innerHTML = configJson.extension.dateCountdown.dateCountdownDetail;
            document.getElementById("dateCountdownTime").innerHTML = `${timeDifference}天`;
            if (timeDifference == 1) {
                document.getElementById("dateCountDownText").style.display = "none";
                document.getElementById("dateCountdownTime").innerHTML = "明天";
            }
            if (timeDifference <= 0) {
                document.getElementById("dateCountdown").style.display = "none";
            }
        }
    }
    getDateDiff();
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
hideTitles(document.querySelectorAll(".editListContent"), ".editListTitle"); //貌似移到load.js里面才有效
hideTitles(document.querySelectorAll(".settingContent"), ".settingTitle");
hideTitles(document.querySelectorAll(".extendContent"), ".extendTitle");
async function loadStyleSetting() {
    const configJson = await window.fileAPI.readConfig('config.json');

    let allSubjects = ["cn", "ma", "en", "ph", "ch", "bi", "po" , "hi" , "ge" ,"ot"];
    const enabledSubjectList = configJson.enabledSubject; // ["cn", "ot"]等
    let enabledSubject = [];
    enabledSubjectList.forEach((subjectObj, index) => {
        let key = Object.keys(subjectObj)[0];
        let value = subjectObj[key];
        if (value) {
            enabledSubject.push(key);
        }
      });

    for (subject of allSubjects) {
        if (enabledSubject.includes(subject)) {
            document.getElementById(subject + "Enable").checked = true;
        }
    }
    document.getElementById('backgroundSource').value = configJson.backgroundSource;
    const fileInput = document.getElementById('fileInputContainerLocal');
    const folderInput = document.getElementById('fileInputContainerFolder');
    const urlInput = document.getElementById('fileInputContainerURL');
    const fileInputText = document.getElementById('backgroundLocal');
    const folderInputText = document.getElementById('backgroundFolder');
    const urlInputText = document.getElementById('backgroundURLInput');

    const avoidRepeatChange = document.getElementById("avoidRepeatChange")

    if (configJson.randomBackgroundModeDaily) {
        document.getElementById('RandomBackgroundStyle').value = "daily";
    } else {
        document.getElementById('RandomBackgroundStyle').value = "launch";
    }

    setInputValue('backgroundMask', configJson.backgroundMask);
    setInputValue('fontSize', configJson.fontSize);
    setInputValue('listBlurChange', configJson.listBlur);
    setInputValue('refreshTimeChange', configJson.refreshTime);
    setInputValue('configBlurChange', configJson.configBlur);
    setInputValue('configMaskChange', configJson.configMask);

    setCheckbox("avoidRepeat", configJson.avoidRepeat)

    if (configJson.backgroundSource === 'local'){
        fileInputContainer.classList.remove('hidden');
        fileInput.classList.remove('hidden');
    } else if (configJson.backgroundSource === 'folder') {
        try {
            const currentDate = new Date();
            const year = currentDate.getFullYear();
            const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // 月份从0开始
            const day = String(currentDate.getDate()).padStart(2, '0');
            const formattedDate = `${year}-${month}-${day}`;

            fileInputContainer.classList.remove('hidden');
            folderInput.classList.remove('hidden');
            avoidRepeatChange.classList.remove('hidden');

            console.log((configJson.randomBackgroundModeDaily && configJson.lastChangeDate !== formattedDate));

            if (!configJson.randomBackgroundModeDaily) {
                await pickRandomImageFromFolder();
                configJson.background = selectedRandomBackgroundImage.replace(/\\/g, '/');
            } else if ((configJson.randomBackgroundModeDaily && configJson.lastChangeDate !== formattedDate) || configJson.changeToFolder) {
                console.log('上次更换日期:', configJson.lastChangeDate);
                await pickRandomImageFromFolder();
                configJson.lastChangeDate = formattedDate;
                configJson.background = selectedRandomBackgroundImage.replace(/\\/g, '/');
                configJson.changeToFolder = false;
            } else if (configJson.randomBackgroundModeDaily && configJson.lastChangeDate === formattedDate) {
                selectedRandomBackgroundImage = configJson.background;
            }        
            
            if (configJson.avoidRepeat) {
                configJson.showedImage.push(selectedRandomBackgroundImage);
                configJson.showedImage = configJson.showedImage.filter((item, index) => configJson.showedImage.indexOf(item) === index)
                console.log('已移除背景图像于列表:'+selectedRandomBackgroundImage)
                if (cleanShowedImageList) {
                    configJson.showedImage = [];
                }
            }

            await window.fileAPI.writeConfig('config.json', configJson);
        } catch (error) {
            console.error('Error:', error);
        }
    } else if (configJson.backgroundSource === 'url') {
        fileInputContainer.classList.remove('hidden');
        urlInput.classList.remove('hidden');
        urlInputText.value = decodeURIComponent(configJson.background.replace(/^'(.*)'$/, '$1').replace(/^file:\/\//, ''));
    };

    folderInputText.value = decodeURIComponent(configJson.backgroundFolder.replace(/^'(.*)'$/, '$1').replace(/^file:\/\//, ''));
    if (configJson.backgroundSource !== 'url') {
        fileInputText.value = decodeURIComponent(configJson.background.replace(/^'(.*)'$/, '$1').replace(/^file:\/\//, ''));
    }

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
    //随机音乐
    setCheckbox('enableWritingBGM', configJson.extension.writingBGM.enable);
    setInputValue('writingBGMLasting', configJson.extension.writingBGM.lasting);
    setInputValue('writingBGMVolume', configJson.extension.writingBGM.volume); 
    setInputValue('preCountdownDuration', configJson.extension.writingBGM.preCountdownDuration);
    setCheckbox('systemVolumeSet', configJson.extension.writingBGM.systemVolumeSet);
    document.getElementById('writingBGMStartTime').value = configJson.extension.writingBGM.startTime;
    document.getElementById('BGMFolderInput').value = configJson.extension.writingBGM.BGMFolder;
    document.getElementById('writingBGMNameInput').value = configJson.extension.writingBGM.name;
    if (!configJson.extension.writingBGM.systemVolumeSet) {
        document.getElementById('systemVolumeChange').style.display = 'none';
    };
    document.getElementById('systemVolume').querySelector('input').value = configJson.extension.writingBGM.systemVolume;
    //随机一言
    document.getElementById('quoteFileInput').value = configJson.extension.randomQuote.quoteFile;
    setCheckbox('enableQuote', configJson.extension.randomQuote.enable);
    setInputValue('quoteFontSizeScale', configJson.extension.randomQuote.quoteFontSizeScale);
    setCheckbox('enableQuoteTranslation', configJson.extension.randomQuote.quoteTranslation);
    //倒计时
    setCheckbox('enableDateCountDown', configJson.extension.dateCountdown.enable);
    document.getElementById('dateCountdownNameInput').value = configJson.extension.dateCountdown.dateCountdownDetail;
    document.getElementById('dateCountDownInput').value = configJson.extension.dateCountdown.dateCountdownTime;
    setCheckbox('dateCountDownIgnoreToday', configJson.extension.dateCountdown.ignoreToday);
    //自动专注模式
    setCheckbox('enableAutoFoucsingMode', configJson.extension.focusingMode.enable);
    setInputValue('focusingModeMask', configJson.extension.focusingMode.focusingModeMask);
    setCheckbox('enableFoucsingModeColckBlur', configJson.extension.focusingMode.focusingModeClockBlur);
    if (!configJson.extension.focusingMode.enable) {
        document.getElementById('autoFoucsingModePeriodChange').style.display = 'none';
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
            window.fileAPI.writeLog('script.js', '没有找到该天的课程表');
        }
        }
    catch (error) {
        window.fileAPI.writeLog('script.js', '处理课程数据时出错:' + error);
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
    const configJson = await window.fileAPI.readConfig('config.json');
    const enabledSubjectList = configJson.enabledSubject; // ["cn", "ot"]等
    let enabledSubject = [];
    enabledSubjectList.forEach((subjectObj, index) => {
        let key = Object.keys(subjectObj)[0];
        let value = subjectObj[key];
        if (value) {
            enabledSubject.push(key);
        }
    });
    try {
        const tasklist=await window.fileAPI.readConfig(`${jsonFile}`);
        for (const key in tasklist) {
            if (tasklist.hasOwnProperty(key) && enabledSubject.includes(key)) {
                const listElement=document.getElementById(`${key}list`);
                if ( !listElement) {
                    console.error(`无法找到元素: ${key}list`);
                    window.fileAPI.writeLog('script.js', `无法找到元素: ${key}list`);
                    continue;
                }
                const listContent=listElement.querySelector(".listContent");
                if ( !listContent) {
                    console.error(`无法找到 .listContent 在: ${key}list`);
                    window.fileAPI.writeLog('script.js', `无法找到 .listContent 在: ${key}list`);
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
        window.fileAPI.writeLog('script.js', '处理任务数据时出错:' + error);
    }
}

readTaskList("list.json");

async function getListToEdit(jsonFile) {
    try {
        // 读取 JSON 数据
        const tasklist = await window.fileAPI.readConfig(jsonFile);
        const configJson = await window.fileAPI.readConfig('config.json');
        const enabledSubjectList = configJson.enabledSubject;
        if (!tasklist || !enabledSubjectList) {
            console.warn("Tasklist or enabledSubjectList is empty");
            return;
        }
        // 获取启用的学科列表
        const enabledSubject = enabledSubjectList
            .filter(subjectObj => Object.values(subjectObj)[0]) // 过滤值为 true 的对象
            .map(subjectObj => Object.keys(subjectObj)[0]); // 获取对应的键
        // 遍历任务列表，生成动态内容
        for (const key in tasklist) {
            if (tasklist.hasOwnProperty(key) && enabledSubject.includes(key)) {
                const container = document.getElementById(`editList${key}`).querySelector(".editListContent");
                if (!container) {
                    console.warn(`Container for key ${key} not found.`);
                    continue;
                }
                // 清空容器并添加 "createNewTask" 按钮
                container.innerHTML = '<div draggable="false" class="createNewTask">+</div>';
                // 动态生成任务输入框
                tasklist[key].forEach((element) => {
                    const sanitizedElement = element.replace(/"/g, '&quot;'); 
                    const inputWrapper = createTaskInput(sanitizedElement);
                    container.insertBefore(inputWrapper, container.querySelector('.createNewTask'));
                });
                // 初始化拖拽排序
                initializeSortable(container);
            }
        }
        monitorVisibilityAndAdjustTextareaHeight();
    } catch (error) {
        console.error('处理任务数据时出错:', error);
        window.fileAPI.writeLog('script.js', '处理任务数据时出错:' + error);
    }
}

// 创建任务输入框
function createTaskInput(content) {
    const inputWrapper = document.createElement('div');
    inputWrapper.classList.add("input-wrapper");
    inputWrapper.innerHTML = `
        <span class="handle">⁝⁝</span>
        <textarea class="editListContentInput" rows="1">${content}</textarea>
        <span class="removeTask">⨉</span>
    `;
    const textarea = inputWrapper.querySelector('.editListContentInput');
    // 自动调整 textarea 高度
    adjustTextareaHeight(textarea);
    textarea.addEventListener('input', () => adjustTextareaHeight(textarea));
    return inputWrapper;
}

// 调整 textarea 高度
function adjustTextareaHeight(textarea) {
    textarea.style.height = 'auto'; // 重置高度
    textarea.style.height = `${textarea.scrollHeight + 2}px`; // 设置新高度
}
function adjustTextareaHeightOnResize() {
    const textareas = document.querySelectorAll('.editListContentInput');
    textareas.forEach(adjustTextareaHeight);
}

window.addEventListener('resize', adjustTextareaHeightOnResize); // 窗口大小变化时调整

// 监控 textarea 可见性并调整高度
function monitorVisibilityAndAdjustTextareaHeight() {
    const textareas = document.querySelectorAll('.editListContentInput');
    if (!textareas.length) {
        console.warn("No textareas found to monitor.");
        return;
    }
    textareas.forEach((textarea) => {
        const parentElement = textarea.parentElement.parentElement;
        // 检查父元素的显示状态
        const observer = new MutationObserver(() => {
            const isVisible = window.getComputedStyle(parentElement).display !== 'none';
            if (isVisible) {
                adjustTextareaHeight(textarea);
                observer.disconnect(); // 停止观察
            }
        });
        observer.observe(parentElement, {
            attributes: true, // 监听属性变化
            attributeFilter: ['style'], // 仅监听 style 属性
        });
    });
}

// 执行任务列表初始化
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

document.addEventListener('click', async function (event) {
    if (event.target.matches('.extendTitle') && event.target.parentElement.id==="tools") {
        await window.subwAPI.create('tools.html');
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
    window.fileAPI.writeLog('script.js', '任务列表已重新加载');
}

async function reloadEditListContent(jsonFile) {
    // 清空编辑内容
    document.querySelectorAll('.editListContent').forEach(container => {
        container.innerHTML = '<div draggable="false" class="createNewTask">+</div>'; // 重置内容
    });
    // 重新加载内容
    await getListToEdit(jsonFile);
    await initializeSorting();
    setTimeout(() => {
        document.querySelectorAll('.editListContentInput').forEach(textarea => {
            adjustTextareaHeight(textarea);
        });
    }, 100);
}


document.getElementById('saveList').addEventListener('click', async () => {
    const data = {
        cn: [],
        ma: [],
        en: [],
        ph: [],
        ch: [],
        bi: [],
        ot: [],
        po: [],
        hi: [],
        ge: []
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
    window.fileAPI.writeLog('script.js', '任务列表已保存');
    reloadTaskList('list.json');
    reloadEditListContent('list.json');
    getQuote(); //来自randomQuote.js
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
    setTimeout(() => {
        const wrappers = container.querySelectorAll('.input-wrapper');
        if (wrappers.length === 0) {
            console.warn("No input-wrapper found, skipping initialization.");
            return;
        }
        wrappers.forEach(wrapper => {
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
    }, 50);
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
        const container = event.target.closest('.editListContent');
        if (container) {
            const inputWrapper = document.createElement('div');
            inputWrapper.classList.add('input-wrapper');
            inputWrapper.innerHTML = `
                <span class="handle">⁝⁝</span>
                <textarea class="editListContentInput" rows="1"></textarea>
                <span class="removeTask">⨉</span>
            `;
            container.insertBefore(inputWrapper, event.target);
            const upButton = document.createElement('button');
            upButton.innerText = '∧';
            upButton.classList.add('moveUp');
            const downButton = document.createElement('button');
            downButton.innerText = '∨';
            downButton.classList.add('moveDown');
            inputWrapper.insertBefore(downButton, inputWrapper.firstChild);
            inputWrapper.insertBefore(upButton, inputWrapper.firstChild);
            upButton.addEventListener('click', () => moveUp(inputWrapper));
            downButton.addEventListener('click', () => moveDown(inputWrapper));
            // 获取 textarea 并应用自动高度设置
            const textarea = inputWrapper.querySelector('.editListContentInput');
            adjustTextareaHeight(textarea);  // 调用函数应用自动高度
            // 监听 textarea 输入事件，实时调整高度
            textarea.addEventListener('input', () => adjustTextareaHeight(textarea));
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
    const existingClassList = await window.fileAPI.readConfig('classList.json') || {};
    
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
    
    let allSubjects = ["cn", "ma", "en", "ph", "ch", "bi", "po" , "hi" , "ge" ,"ot"];
    let enabledSubjects = [];
    for (let subject of allSubjects) {
        enabledSubjects.push({ [subject]: false });
        if (document.getElementById(subject + "Enable").checked) {
            enabledSubjects[enabledSubjects.length - 1][subject] = true;
        }
    }

    let background = '';
    if (backgroundSource === 'defaultLight') {
        background = '../resource/default.jpg';
    } else if (backgroundSource === 'defaultDark') {
        background = '../resource/defaultDark.jpg';
    } else if (backgroundSource === 'local') {
        background = document.getElementById('backgroundLocal').value.replace(/\\/g, '/'); 
        console.log (background);
    } else if (backgroundSource === 'url') {
        background = document.getElementById('backgroundURLInput').value; // 读取URL链接
    } else if (backgroundSource === 'folder') {
        console.log(selectedRandomBackgroundImage);
        background = selectedRandomBackgroundImage;
    }
    
    const backgroundFolder = document.getElementById('backgroundFolder').value.replace(/\\/g, '/');
    const avoidRepeat = document.getElementById('avoidRepeat').checked;
    let randomBackgroundModeDaily = false;
    if (document.getElementById('RandomBackgroundStyle').value === "launch") {
        randomBackgroundModeDaily = false;
    } else {
        randomBackgroundModeDaily = true;
    }

    let changeToFolder = false;
    let showedImage = configJson.showedImage
    if ((configJson.backgroundSource !== "folder" && backgroundSource === "folder") || (configJson.backgroundFolder !== backgroundFolder)) {
        changeToFolder = true;
        showedImage = []
    }
    if (showImageListCleared){
        showedImage = [];
    }


    // 合并新设置和现有的扩展设置（保持嵌套结构）
    const newConfig = {
        ...existingConfig,
        fontSize: fontSize,
        darkMode: darkMode,
        backgroundFolder: backgroundFolder,
        randomBackgroundModeDaily: randomBackgroundModeDaily,
        lastChangeDate: configJson.lastChangeDate,
        avoidRepeat: avoidRepeat,
        showedImage: showedImage,
        changeToFolder: changeToFolder,
        backgroundMask: backgroundMask,
        backgroundSource: backgroundSource,
        showTime: showTime,
        background: background,
        configAnimine: configAnimine,
        configBlur: configBlur,
        configMask: configMask,
        enabledSubject: enabledSubjects,
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

    const newClassList = {
        ...existingClassList,
        classlist: schedule
    }
    console.log('Final config to save:', newConfig);

    // 保存数据并在写入完成后再执行操作
    await window.fileAPI.writeConfig('config.json', newConfig);
    await window.fileAPI.writeConfig('classlist.json', newClassList);
    console.log('Config saved successfully');

    window.fileAPI.writeLog('script.js', '配置文件已保存');
    window.wAPI.toggleAutoLaunch(autoLaunch); // 直接传递autoLaunch的状态
    window.wAPI.relaodTrayMenu()
    window.location.reload();
});

//////////////////////////扩展设置保存//////////////////////////


function getFocusingModePeriods(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container with ID "${containerId}" not found.`);
        return [];
    }

    // 获取所有时间段
    const wrappers = Array.from(container.querySelectorAll('.input-wrapper'));
    const periods = wrappers
        .map(wrapper => {
            const startTime = wrapper.querySelector('.startTimeInputer')?.value;
            const endTime = wrapper.querySelector('.endTimeInputer')?.value;

            // 确保时间段完整（非空）
            if (startTime && endTime) {
                return { start: startTime, end: endTime };
            }
            return null; // 跳过不完整时间段
        })
        .filter(period => period !== null);

    // 按开始时间排序
    periods.sort((a, b) => timeToMinutes(a.start) - timeToMinutes(b.start));

    return periods;
}


document.getElementById('saveExtensionSetting').addEventListener('click', async () => {
    // 读取现有的 JSON 数据
    const existingConfig = await window.fileAPI.readConfig('config.json') || {};

    const writingBGMEnable = document.getElementById('enableWritingBGM').checked;
    const writingBGMName = document.getElementById('writingBGMNameInput').value;
    const writingBGMLasting = document.getElementById('writingBGMLasting').querySelector('input').value;
    const writingBGMVolume = document.getElementById('writingBGMVolume').querySelector('input').value;
    const writingBGMStartTime = document.getElementById('writingBGMStartTime').value;
    const writingBGMBGMFolder = document.getElementById('BGMFolderInput').value.replace(/\\/g, '/');
    const preCountdownDuration = document.getElementById('preCountdownDuration').querySelector('input').value;
    const systemVolumeSet = document.getElementById('systemVolumeSet').checked;
    const systemVolume = document.getElementById('systemVolume').querySelector('input').value;
    
    const randomQuoteEnable = document.getElementById('enableQuote').checked;
    const quoteFile = document.getElementById('quoteFileInput').value;
    const quoteFontSizeScale = document.getElementById('quoteFontSizeScale').querySelector('input').value;
    const quoteTranslation = document.getElementById('enableQuoteTranslation').checked;

    const dateCountdownEnable = document.getElementById('enableDateCountDown').checked;
    const dateCountdownDetail = document.getElementById('dateCountdownNameInput').value;
    const dateCountdownTime = document.getElementById('dateCountDownInput').value;
    const dateCountdownIgnoreToday = document.getElementById('dateCountDownIgnoreToday').checked;

    const foucsingModeEnable = document.getElementById('enableAutoFoucsingMode').checked;
    const focusingModeMask = document.getElementById('focusingModeMask').querySelector('input').value;
    const focusingModeClockBlur = document.getElementById('enableFoucsingModeColckBlur').checked ;
    const foucsingModePeriod = getFocusingModePeriods('autoFoucsingModePeriodValueArea');

    // 合并新设置和现有的扩展设置（保持嵌套结构）
    const newConfig = {
        ...existingConfig,
        extension: {
            ...existingConfig.extension,  // 保持已有的 extension 设置
            writingBGM: {
                enable: writingBGMEnable,
                name: writingBGMName,
                lasting: writingBGMLasting,
                volume: writingBGMVolume,
                startTime: writingBGMStartTime,
                BGMFolder: writingBGMBGMFolder,
                preCountdownDuration: preCountdownDuration,
                systemVolumeSet: systemVolumeSet,
                systemVolume: systemVolume
            },
            randomQuote: {
                enable: randomQuoteEnable,
                quoteFile: quoteFile,
                quoteFontSizeScale: quoteFontSizeScale,
                quoteTranslation: quoteTranslation
            },
            dateCountdown: {
                enable: dateCountdownEnable,
                dateCountdownDetail: dateCountdownDetail,
                dateCountdownTime: dateCountdownTime,
                ignoreToday: dateCountdownIgnoreToday
            },
            focusingMode: {
                enable: foucsingModeEnable,
                focusingModeMask: focusingModeMask,
                focusingModeClockBlur: focusingModeClockBlur,
                foucsingModePeriod: foucsingModePeriod
            }
        }
    };

    console.log('Final config to save:', newConfig);
    await window.fileAPI.writeConfig('config.json', newConfig);
    console.log('Config saved successfully');
    window.fileAPI.writeLog('script.js', '配置文件已保存');
    window.location.reload();
});
document.getElementById('backgroundSource').addEventListener('change', function() {
    const selectedOption = this.value;
    const fileInputContainer = document.getElementById('fileInputContainer');
    const fileInput = document.getElementById('fileInputContainerLocal');
    const folderInput = document.getElementById('fileInputContainerFolder');
    const urlInput = document.getElementById('fileInputContainerURL');
    const avoidRepeatChange = document.getElementById("avoidRepeatChange")

    if (selectedOption === 'local') {
        fileInputContainer.classList.remove('hidden'); 
        fileInput.classList.remove('hidden');
        folderInput.classList.add('hidden');
        urlInput.classList.add('hidden');
        avoidRepeatChange.classList.add('hidden');
    } else if (selectedOption === 'folder') {
        fileInputContainer.classList.remove('hidden'); 
        fileInput.classList.add('hidden');
        folderInput.classList.remove('hidden');
        avoidRepeatChange.classList.remove('hidden');
        urlInput.classList.add('hidden');
    } else if (selectedOption === 'url') {
        fileInputContainer.classList.remove('hidden'); 
        fileInput.classList.add('hidden');
        folderInput.classList.add('hidden');
        urlInput.classList.remove('hidden');
        avoidRepeatChange.classList.add('hidden');
    } else {
        fileInputContainer.classList.add('hidden');
        fileInput.classList.add('hidden');
        folderInput.classList.add('hidden');
        urlInput.classList.add('hidden');
        avoidRepeatChange.classList.add('hidden');
    }
});

document.getElementById('selectLocalImage').addEventListener('click', async () => {
    const filePath = await window.fileAPI.selectImage();
    if (filePath) {
        document.getElementById('backgroundLocal').value = filePath; // 将路径显示在输入框中
    }
});

document.getElementById('selectImageFolder').addEventListener('click', async () => {
    const folderPaths = await window.fileAPI.selectFolder();
    if (folderPaths) {
        document.getElementById('backgroundFolder').value = folderPaths; // 将路径显示在输入框中
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
//随机一言
document.getElementById('selectQuoteFile').addEventListener('click', async () => {
    const filePath = await window.fileAPI.selectJson();
    if (filePath) {
        document.getElementById('quoteFileInput').value = filePath; // 将路径显示在输入框中
    }
});
//自动专注模式
document.getElementById('enableAutoFoucsingMode').addEventListener('change', function() {
    const enableAutoFoucsingMode = document.getElementById('enableAutoFoucsingMode').checked;
    if (enableAutoFoucsingMode) {
        document.getElementById('autoFoucsingModePeriodChange').style.display = 'flex';
    } else {
        document.getElementById('autoFoucsingModePeriodChange').style.display = 'none';
    }
})


//
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
    initializeNumberInput("quoteFontSizeScale");
    initializeNumberInput("focusingModeMaskChange");
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
            ot: [],
            po: [],
            hi: [],
            ge: []
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
            window.infoAPI.showInfoDialog('文件导入成功！')
        } else {
            null
        }
    } else {
        window.infoAPI.showErrorDialog(`导入失败: ${result.error}`)
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
        ot: [],
        po: [],
        hi: [],
        ge: []
    };
    const data = await window.fileAPI.readConfig('list.json');
    for (const key in data) {
        dataToExport[key] = data[key];
    }
    const result = await window.fileAPI.exportFile(dataToExport);
    if (result.success) {
        window.infoAPI.showInfoDialog('文件导出成功！');
    } else {
        window.infoAPI.showErrorDialog(`导出失败: ${result.error}`);
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
            window.infoAPI.showInfoDialog(result.message);
        }
    } else {
        console.error('Update check failed:', result.message);
        window.infoAPI.showErrorDialog('Error checking for updates: ' + result.message);
    }
});

document.getElementById('switchFullScreenButton').addEventListener('click', async () => {
    const inFullScreen =  await window.wAPI.toggleFullscreen();
    if (inFullScreen) {
        document.getElementsByClassName('titlebar')[0].style.display = 'none';
        document.getElementById('classTable').style.marginTop = 0;
        document.getElementById('taskList').style.marginTop = 0;
        document.getElementById('configsBox').style.marginTop = 0;
    }
    else {
        document.getElementsByClassName('titlebar')[0].style.display = 'flex';
        styleElements.forEach(({ selector, style }) => {
            Object.assign(document.querySelector(selector).style, style);
        });
    }
})

document.addEventListener('keydown', async (event) => {
    if (event.key === 'F11') {
        event.preventDefault(); 
        const inFullScreen =  await window.wAPI.toggleFullscreen();
        if (inFullScreen) {
            document.getElementsByClassName('titlebar')[0].style.display = 'none';
            document.getElementById('classTable').style.marginTop = 0;
            document.getElementById('taskList').style.marginTop = 0;
            document.getElementById('configsBox').style.marginTop = 0;
        }
        else {
            document.getElementsByClassName('titlebar')[0].style.display = 'flex';
            styleElements.forEach(({ selector, style }) => {
                Object.assign(document.querySelector(selector).style, style);
            });
        }
    }
});

window.wAPI.onUpdateProgress((percent) => {
    document.getElementById('progress-bar').style.width = `${percent}%`;
});


//课程表设置
let schedule
let currentDay = "";
function showDay(day, button) {
    document.getElementById("classListWeekdays").querySelectorAll("button").forEach(btn => btn.style.backgroundColor = "");
    button.style.backgroundColor = "#a5e0fd9a";
    currentDay = day;
    const container = document.getElementById("scheduleContainer");
    container.innerHTML = "";
    schedule[day].forEach((subject, index) => {
        const label = document.createElement("label");
        label.textContent = `${index + 1}`;
        const select = document.createElement("select");
        select.innerHTML = `
            <option value="">空</option>
            <option value="cn">语文</option>
            <option value="ma">数学</option>
            <option value="en">英语</option>
            <option value="ph">物理</option>
            <option value="ch">化学</option>
            <option value="bi">生物</option>
            <option value="po">政治</option>
            <option value="hi">历史</option>
            <option value="ge">地理</option>
            <option value="sl">自习</option>
            <option value="pe">体育</option>
            <option value="me">心理</option>
            <option value="ls">文体</option>
            <option value="cm">班会</option>
        `;
        select.value = subject;
        select.onchange = () => updateSchedule(day, index, select.value);
        container.appendChild(label);
        container.appendChild(select);
        container.appendChild(document.createElement("br"));
        function updateSchedule(day, period, subject) {
            schedule[day][period] = subject;
        }
    });
}
function updateSchedule(day, period, subject) {
    schedule[day][period] = subject;
}
// JSON 数据
async function loadClassList() {
    schedule = await window.fileAPI.readConfig('classlist.json');
    schedule = schedule.classlist;
    showDay("Monday", document.getElementById("defaultDay"));
}
loadClassList()

// 随机背景图片
async function fetchImageFiles(folderPath) {
    const configJson = await window.fileAPI.readConfig('config.json');
    try {
        if (configJson.avoidRepeat){
            const rawImageFilesList = await window.fileAPI.getImageFiles(folderPath);
            console.log('原始背景图像列表:', rawImageFilesList);
            window.fileAPI.writeLog('script.js','获取原始背景图像列表: '+ rawImageFilesList);
            const showedImageFilesList = configJson.showedImage;
            console.log('已显示过的图像列表:', showedImageFilesList);
            const imageFilesList = rawImageFilesList.filter(file => !showedImageFilesList.includes(file));
            console.log('过滤后的背景图像列表:', imageFilesList);
            window.fileAPI.writeLog('script.js','过滤后的背景图像列表: '+ imageFilesList);
            if (imageFilesList.length === 0) {
                console.log("所有图片已轮换,已更新列表")
                window.fileAPI.writeLog('script.js','所有图片已轮换,已更新列表');
                cleanShowedImageList = true;
                return rawImageFilesList;
            } else {
                return imageFilesList;
            }
        } else {
            return await window.fileAPI.getImageFiles(folderPath);
        }
    } catch (error) {
        selectedRandomBackgroundImage = configJson.background;
        console.log(selectedRandomBackgroundImage);
        document.body.style.backgroundImage = configJson.background;
        console.error('读取背景图像列表失败:', error);
        window.fileAPI.writeLog('script.js','读取背景图像列表失败: '+ error);
        window.infoAPI.showErrorDialog('未找到指定的文件夹\n请检查文件夹路径是否正确');
    }
}
async function pickRandomImageFromFolder() {
    const configJson = await window.fileAPI.readConfig('config.json');
    let folderPath = configJson.backgroundFolder;

    try {
        let imageFilesList = await fetchImageFiles(folderPath);

        if (imageFilesList.length === 0) {
            window.infoAPI.showErrorDialog('指定的文件夹中没有图像文件\n请检查所选文件夹是否正确');
            window.fileAPI.writeLog('script.js','指定的文件夹中没有图像文件');
            selectedRandomBackgroundImage = configJson.background;
            console.log(selectedRandomBackgroundImage);
            document.body.style.backgroundImage = configJson.background;
            return;
        }

        const randomIndex = Math.floor(Math.random() * imageFilesList.length);
        const selectedFile = imageFilesList[randomIndex].replace(/\\/g, '/');
        console.log('选中的背景图像:', selectedFile);
        window.fileAPI.writeLog('script.js','选中图像: '+ selectedFile);
        document.body.style.backgroundImage = `url("file://${selectedFile}")`;
        document.getElementById('focusingModeContainer').style.backgroundImage = `url("file://${selectedFile}")`;
        selectedRandomBackgroundImage = selectedFile;


    } catch (error) {
        console.error('获取背景图像时出错:', error);
        window.fileAPI.writeLog('script.js','获取背景图像时出错: '+ error);
        throw error;
    }
}

document.getElementById("reomveShowedListButton").addEventListener("click", async function() {
    const configJson = await window.fileAPI.readConfig('config.json');
    configJson.showedImage = [];
    await window.fileAPI.writeConfig('config.json', configJson);
    showImageListCleared = true;
    window.infoAPI.showInfoDialog('已清空 已显示过的图像列表');
    window.fileAPI.writeLog('script.js','已清空已显示过的图像列表');
})

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.externalLink').forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault(); // 防止默认跳转
            const url = link.getAttribute('href');
            if (url) {
                console.log('openUrlInBrowser', url);
                window.fileAPI.openUrlInBrowser(url); // 这里传入变量 url，而不是字符串 "url"
            }
        });
    });
});

document.getElementById("openDocs").addEventListener("click", async function() {
    await window.docswAPI.create()
});

function openExtarnalUrl(url) {
    console.log('openUrlInBrowser', url);
    window.fileAPI.openUrlInBrowser(url); 
}

window.infoAPI.onAutoLaunchUpdate((isEnabled) => {
    document.getElementById('autoLaunch').checked = isEnabled
    if (!isEnabled) {
        document.getElementById('autoMinimizeWhenAutoLaunchChange').style.display = 'none';
    } else {
        document.getElementById('autoMinimizeWhenAutoLaunchChange').style.display = 'block';
    }
})

window.infoAPI.onAutoLaunchMinUpdate((isEnabled) => {
    document.getElementById('autoMinimizeWhenAutoLaunch').checked = isEnabled
})