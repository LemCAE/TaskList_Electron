const fs = require("fs");
const path = require("path");
const os = require("os");


const appDataDir = path.join(os.homedir(), 'AppData', 'Roaming', 'TaskList', 'config');
if (!fs.existsSync(appDataDir)) {
    fs.mkdirSync(appDataDir, { recursive: true });
}

const configDir = appDataDir;

// 默认配置
const defaultConfigs = {
    config: {
        "backgroundSource": "defaultDark",
        "background": "../resource/defaultDark.jpg",
        "darkMode": true,
        "backgroundMask": "0.4",
        "fontSize": "1.6",
        "listBlur": "5",
        "configAnimine": true,
        "configBlur": "10",
        "configMask": "0",
        "enabledSubject": [{"cn": true}, {"ma": true}, {"en": true}, {"ph": true}, {"ch": true}, {"bi": true}, {"po": true}, {"hi": true}, {"ge": true}, {"ot": true}],
        "taskListHoverAnimine": true,
        "CheckboxAnimine": true,
        "showClassList": true,
        "showTime": true,
        "refreshTime": "1000",
        "autoColseAfterSave": true,
        "reorderMethod": "drag",
        "autoLaunch": false,
        "autoMinimizeWhenAutoLaunch": false,
        "updateSource": "GitHub",
        "autoCheckUpdate": false,
        "autoDownloadUpdate": false,
        "extension": {
          "writingBGM": {
            "enable": false,
            "name": "Event",
            "lasting": "10",
            "volume": "100",
            "startTime": "19:00",
            "BGMFolder": "",
            "preCountdownDuration": "3",
            "systemVolumeSet": true,
            "systemVolume": "20"
          },
          "randomQuote": {
            "enable": false,
            "quoteFile": "",
            "quoteFontSizeScale": "0.8",
            "quoteTranslation": true
          },
          "dateCountdown": {
            "enable": false,
            "dateCountdownDetail": "Event",
            "dateCountdownTime": "2025-01-01"
          },
          "enable": false,
          "focusingModeMask": "0.95",
          "foucsingModePeriod": []
        }
    },
    list: {
        "cn": [],
        "ma": [],
        "en": [],
        "ph": [],
        "ch": [],
        "bi": [],
        "po": [],
        "hi": [],
        "ge": [],
        "ot": []
    },
    classlist: {
        "time": {
            "class1": "8:10-8:50",
            "class2": "9:00-9:40",
            "class3": "10:05-10:45",
            "class4": "11:10-11:50",
            "class5": "14:00-14:40",
            "class6": "14:50-15:30",
            "class7": "15:55-16:35",
            "class8": "16:45-17:25"
        },
        "subject": {
            "cn": "语文",
            "ma": "数学",
            "en": "英语",
            "ph": "物理",
            "ch": "化学",
            "bi": "生物",
            "po": "政治",
            "hi": "历史",
            "ge": "地理",
            "sl": "自习",
            "pe": "体育",
            "me": "心理",
            "ls": "文体",
            "cm": "班会"
        },
        "classlist": {
            "Monday": ["","","","","","","",""],
            "Tuesday": ["","","","","","","",""],
            "Wednesday": ["","","","","","","",""],
            "Thursday": ["","","","","","","",""],
            "Friday": ["","","","","","","",""],
            "Saturday": ["","","","","","","",""],
            "Sunday": ["","","","","","","",""]
        }
    }
};

// 读取单个配置文件

// 递归检查和添加默认键值对
function mergeDefaults(target, defaults) {
    for (const key in defaults) {
        if (typeof defaults[key] === 'object' && defaults[key] !== null) {
            if (!target[key]) {
                target[key] = {};
            }
            mergeDefaults(target[key], defaults[key]);
        } else {
            if (!target.hasOwnProperty(key)) {
                target[key] = defaults[key];
            }
        }
    }
}

// 读取单个配置文件
function checkAndReadConfig(fileName) {
    const configPath = path.join(configDir, `./${fileName}.json`);
    if (fs.existsSync(configPath)) {
        const config = JSON.parse(fs.readFileSync(configPath));
        const defaultConfig = defaultConfigs[fileName] || {};
        mergeDefaults(config, defaultConfig); // 合并默认配置
        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
        return config;
    } else {
        const defaultConfig = defaultConfigs[fileName] || {};
        fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2));
        return defaultConfig;
    }
}
module.exports = {
    checkAndReadConfig,
};
