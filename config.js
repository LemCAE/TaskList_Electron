const fs = require("fs");
const path = require("path");

// 配置文件目录
const configDir = path.join(__dirname, "./config");

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
        "autoCheckUpdate": true,
        "autoDownloadUpdate": true,
        "extension": {
          "writingBGM": {
            "enable": false,
            "lasting": "10",
            "volume": "100",
            "startTime": "19:00",
            "BGMFolder": "",
            "preCountdownDuration": "3",
            "systemVolumeSet": true,
            "systemVolume": "20"
          }
        }
    },
    list: {
        "cn": [],
        "ma": [],
        "en": [],
        "ph": [],
        "ch": [],
        "bi": [],
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
            "sl": "自习",
            "pe": "体育",
            "me": "心理",
            "ls": "文体",
            "cm": "班会"
        },
        "classlist": {
            "Monday": ["cn", "cn", "ph", "bi", "ma", "pe", "en", "ch"],
            "Tuesday": ["ph", "ph", "cn", "en", "ma", "bi", "ch", "ls"],
            "Wednesday": ["cn", "en", "ma", "ma", "ch", "pe", "bi", "ph"],
            "Thursday": ["cn", "ph", "bi", "ch", "me", "en", "ma", "sl"],
            "Friday": ["cn", "cn", "en", "ma", "bi", "ph", "ch", "cm"], 
            "Saturday": ["en", "en", "ma", "ma", "ch", "ph", "bi", "cn"],
            "Sunday": ["", "", "", "", "sl", "sl", "sl", "sl"]
        }
    }
};

// 读取单个配置文件
function checkAndReadConfig(fileName) {
    // 使用相对路径来指向根目录下的 config 文件夹
    const configPath = path.join(process.cwd(), `./config/${fileName}.json`); // 修改此行
    if (fs.existsSync(configPath)) {
        return JSON.parse(fs.readFileSync(configPath));
    } else {
        const defaultConfig = defaultConfigs[fileName] || {};
        fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2));
        return defaultConfig;
    }
}

module.exports = {
    checkAndReadConfig,
};
