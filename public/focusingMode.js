function updateFocusingTime() {
    const now = new Date();
    const formatTime = time => (time < 10 ? '0' + time : time);
    const timeString = `${formatTime(now.getHours())}:${formatTime(now.getMinutes())}:${formatTime(now.getSeconds())}`;
    document.getElementById('focusingClock').textContent = timeString;
}
updateFocusingTime();

let updateFocusingTimeInterval = "" // 时间更新的定时器

////// 淡入淡出效果
function fadeOut(Element) {
    const element = document.getElementById(Element);
    // 设置过渡效果
    element.style.opacity = 0;
    // 在过渡完成后将 display 设置为 none
    setTimeout(() => {
        element.style.display = 'none';
    }, 5000); // 与过渡时间一致
}
function fadeIn(Element) {
    const element = document.getElementById(Element);
    element.style.display = 'flex';
    setTimeout(() => {
        element.style.opacity = 1;
    }, 100);
}

//////操作-进入/退出专注模式
async function enterFocusingMode() {
    document.getElementById('configsBox').style.transform = "translateX(95%)"
    document.getElementById('icons').classList.remove('show');
    updateFocusingTime();
    updateFocusingTimeInterval = setInterval(updateFocusingTime, 1000);
    fadeIn("focusingModeContainer")
}
async function exitFocusingMode() {
    fadeOut("focusingModeContainer");
    setTimeout(() => {
        clearInterval(updateFocusingTimeInterval);
    }, 6000);
}
////// 按键监听-进入/退出专注模式
//进入
let focusingStartPressCount = 0;   // 记录按键次数
let focusingStartLastPressTime = 0;  // 记录上次按键的时间
window.addEventListener('keydown', (event) => {
    const currentTime = Date.now();
    // 判断是否按下了 Ctrl + Q
    if (event.ctrlKey && event.key === 'q') {
        // 如果距离上次按键的时间太短（小于1秒），认为是连续按键
        if (currentTime - focusingStartLastPressTime < 1000) {
            focusingStartPressCount++;
        } else {
            focusingStartPressCount = 1; // 重置计数器，因为按键间隔过长
        }
        focusingStartLastPressTime = currentTime; // 更新上次按键时间
        // 当按下三次 Ctrl+E 时触发
        if (focusingStartPressCount === 3) {
            enterFocusingMode();
            focusingStartPressCount = 0;  // 重置计数器
        }
    }
});
//退出
let focusingExitPressCount = 0;   // 记录按键次数
let focusingExitLastPressTime = 0;  // 记录上次按键的时间
window.addEventListener('keydown', (event) => {
    const currentTime = Date.now();
    // 判断是否按下了 Ctrl + E
    if (event.ctrlKey && event.key === 'e') {
        // 如果距离上次按键的时间太短（小于1秒），认为是连续按键
        if (currentTime - focusingExitLastPressTime < 1000) {
            focusingExitPressCount++;
        } else {
            focusingExitPressCount = 1; // 重置计数器，因为按键间隔过长
        }
        focusingExitLastPressTime = currentTime; // 更新上次按键时间
        // 当按下三次 Ctrl+E 时触发
        if (focusingExitPressCount === 3) {
            exitFocusingMode();
            focusingExitPressCount = 0;  // 重置计数器
        }
    }
});

//////专注模式-设置
function addNewFoucsingModePeriod(content) {
    const inputWrapper = document.createElement('div');
    inputWrapper.classList.add("input-wrapper");
    inputWrapper.innerHTML = `
                <input type="time" class="timeInputer focusingTimeInputer startTimeInputer">&emsp;-&emsp;
                <input type="time" class="timeInputer focusingTimeInputer endTimeInputer">&emsp;
                <span class="removeTask">⨉</span>
    `;
    return inputWrapper;
}

document.addEventListener('click', function (event) {
    if (event.target.matches('#addNewFoucsingModePeriod')) {
        const container = document.getElementById('autoFoucsingModePeriodValueArea');
        if (container) {
            // 创建并添加新时间段
            const inputWrapper = createNewTimePeriod();
            container.appendChild(inputWrapper);
            sortTimePeriods(container); // 添加后触发排序
        }
    }
});

// 创建新的时间段输入框
function createNewTimePeriod() {
    const inputWrapper = document.createElement('div');
    inputWrapper.classList.add('input-wrapper');
    inputWrapper.innerHTML = `
        <input type="time" class="timeInputer focusingTimeInputer startTimeInputer">
        &emsp;-&emsp;
        <input type="time" class="timeInputer focusingTimeInputer endTimeInputer">
        &emsp;
        <span class="removeTask">⨉</span>
    `;

    const startTimeInput = inputWrapper.querySelector('.startTimeInputer');
    const endTimeInput = inputWrapper.querySelector('.endTimeInputer');

    // 监听时间输入变化
    startTimeInput.addEventListener('input', () => {
        adjustStartTime(startTimeInput, endTimeInput, getExistingTimePeriods(inputWrapper));
        sortTimePeriods(document.getElementById('autoFoucsingModePeriodValueArea'));
    });

    endTimeInput.addEventListener('input', () => {
        adjustEndTime(startTimeInput, endTimeInput, getExistingTimePeriods(inputWrapper));
        sortTimePeriods(document.getElementById('autoFoucsingModePeriodValueArea'));
    });

    // 删除按钮

    
    document.addEventListener('click', function (event) {
        if (event.target.matches('.removeTask')) {
            const inputWrapper=event.target.closest('.input-wrapper');
            if (inputWrapper) {
                inputWrapper.remove();
            sortTimePeriods(document.getElementById('autoFoucsingModePeriodValueArea'));
            }
        }
    });

    return inputWrapper;
}

// 获取所有已设置的时间段
function getExistingTimePeriods(currentWrapper) {
    const wrappers = Array.from(document.querySelectorAll('.input-wrapper'));
    return wrappers
        .filter(wrapper => wrapper !== currentWrapper) // 排除当前操作的时间段
        .map(wrapper => {
            const startTime = wrapper.querySelector('.startTimeInputer')?.value;
            const endTime = wrapper.querySelector('.endTimeInputer')?.value;

            if (startTime && endTime) {
                return { start: startTime, end: endTime };
            }
            return null;
        })
        .filter(period => period !== null);
}

// 调整开始时间
function adjustStartTime(startTimeInput, endTimeInput, existingPeriods) {
    const startTime = startTimeInput.value;

    if (startTime) {
        // 检查是否与其他时间段冲突
        const conflictingPeriod = existingPeriods.find(
            period => startTime >= period.start && startTime < period.end
        );

        // 如果冲突，调整到冲突段的结束时间
        if (conflictingPeriod) {
            const newStartTime = conflictingPeriod.end;
            startTimeInput.value = newStartTime;
        }

        // 设置结束时间的最小值
        endTimeInput.min = startTimeInput.value;

        // 检查结束时间是否合法
        if (endTimeInput.value && endTimeInput.value <= startTimeInput.value) {
            endTimeInput.value = ''; // 清空非法结束时间
        }
    }
}

// 调整结束时间
function adjustEndTime(startTimeInput, endTimeInput, existingPeriods) {
    const startTime = startTimeInput.value;
    let endTime = endTimeInput.value;

    if (!startTime) return; // 如果开始时间无效，直接返回

    const startMinutes = timeToMinutes(startTime);
    let endMinutes = timeToMinutes(endTime);

    // 如果结束时间小于或等于开始时间，默认延后40分钟
    if (!endTime || endMinutes <= startMinutes) {
        endMinutes = startMinutes + 40;
    }

    // 检查结束时间是否与下一段冲突
    const nextPeriods = existingPeriods
        .filter(period => timeToMinutes(period.start) > startMinutes)
        .sort((a, b) => timeToMinutes(a.start) - timeToMinutes(b.start));

    const closestNextStart = nextPeriods.length > 0 ? timeToMinutes(nextPeriods[0].start) : timeToMinutes('23:59');

    if (endMinutes >= closestNextStart) {
        endMinutes = closestNextStart; // 调整结束时间到最近开始时间之前
    }

    // 防止超出一天的限制
    if (endMinutes > timeToMinutes('23:59')) {
        endMinutes = timeToMinutes('23:59');
    }

    endTimeInput.value = minutesToTime(endMinutes);
}

// 排序时间段
function sortTimePeriods(container) {
    const wrappers = Array.from(container.querySelectorAll('.input-wrapper'));
    wrappers.sort((a, b) => {
        const aStartValue = a.querySelector('.startTimeInputer')?.value;
        const bStartValue = b.querySelector('.startTimeInputer')?.value;

        // 如果一个值为空，则放到后面
        if (!aStartValue && bStartValue) {
            return 1;
        }
        if (aStartValue && !bStartValue) {
            return -1;
        }
        if (!aStartValue && !bStartValue) {
            return 0;
        }

        // 都不为空时，按时间升序排序
        const aStart = timeToMinutes(aStartValue);
        const bStart = timeToMinutes(bStartValue);
        return aStart - bStart;
    });

    // 按排序结果重新排列
    wrappers.forEach(wrapper => container.appendChild(wrapper));
}


// 工具函数：时间字符串转分钟数
function timeToMinutes(time) {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
}

// 工具函数：分钟数转时间字符串
function minutesToTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const remainderMinutes = minutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(remainderMinutes).padStart(2, '0')}`;
}

// 添加监听器：对新增和修改的时间段进行排序
function addSortEventListeners(container) {
    container.addEventListener('input', (event) => {
        if (event.target.matches('.startTimeInputer') || event.target.matches('.endTimeInputer')) {
            sortTimePeriods(container);
        }
    });
}

//////////
async function loadFocusingModePeriods(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container with ID "${containerId}" not found.`);
        return;
    }

    try {
        // 调用自定义 API 读取配置文件
        const configJson = await window.fileAPI.readConfig('config.json');

        const periods = configJson.extension.focusingMode.foucsingModePeriod || [];

        // 动态生成时间输入框
        periods.forEach(period => {
            const inputWrapper = createNewTimePeriod(container);
            const startTimeInput = inputWrapper.querySelector('.startTimeInputer');
            const endTimeInput = inputWrapper.querySelector('.endTimeInputer');

            // 设置值
            startTimeInput.value = period.start;
            endTimeInput.value = period.end;

            // 添加到容器
            container.appendChild(inputWrapper);
        });

        // 排序时间段（可选）
        sortTimePeriods(container);
    } catch (error) {
        console.error('Error loading focusing mode periods:', error);
    }
}

// 示例：启动时调用加载函数
document.addEventListener('DOMContentLoaded', () => {
    loadFocusingModePeriods('autoFoucsingModePeriodValueArea');
});
