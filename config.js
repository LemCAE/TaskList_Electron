const fs = require('fs');
const path = require('path');
const os = require('os');

const configJson = {
    "backgroundSource": "defaultDark",
    "background": "../resource/defaultDark.jpg",
    "backgroundFolder": "",
    "randomBackgroundModeDaily": false,
    "lastChangeDate": "2025-01-01",
    "avoidRepeat": true,
    "showedImage": [],
    "changeToFolder": false,
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
      "focusingMode": {
        "enable": false,
        "focusingModeMask": "0.95",
        "focusingModeClockBlur": false,
        "foucsingModePeriod": []
      }
    }
}

const listJson = {
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
}

const classlistJson = {
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

// 获取用户配置文件路径
function getUserConfigFilePath(fileName) {
  return path.join(os.homedir(), 'AppData', 'Roaming', 'tasklist', 'config', fileName);
}

// 检查并更新配置文件
function checkAndUpdateConfig(fileName, template) {
  const userConfigPath = getUserConfigFilePath(fileName);

  if (!fs.existsSync(userConfigPath)) {
    console.log(`配置文件 ${fileName} 不存在，创建新文件`);
    fs.writeFileSync(userConfigPath, JSON.stringify(template, null, 2), 'utf-8');
    return template;
  }

  try {
    const userConfig = JSON.parse(fs.readFileSync(userConfigPath, 'utf-8'));
    const updatedConfig = mergeConfig(template, userConfig);

    fs.writeFileSync(userConfigPath, JSON.stringify(updatedConfig, null, 2), 'utf-8');
    return updatedConfig;
  } catch (error) {
    console.error(`解析 ${fileName} 失败，使用默认模板`, error);
    fs.writeFileSync(userConfigPath, JSON.stringify(template, null, 2), 'utf-8');
    return template;
  }
}

// 递归合并配置，保留用户已有值
function mergeConfig(template, userConfig, fileName) {
    for (const key in template) {
      if (!(key in userConfig)) {
        console.log(`补充缺失的键: ${key}`);
        userConfig[key] = template[key]; // 直接补充缺失的键
      } else if (Array.isArray(template[key])) {
        console.log(`检查数组字段: ${key}`);
  
        if (key === 'enabledSubject' && Array.isArray(userConfig[key])) {
          // **1. 处理 enabledSubject，防止重复**
          const existingSubjects = userConfig[key].map(subj => Object.keys(subj)[0]); // 获取现有科目名称
          template[key].forEach(subj => {
            const subjKey = Object.keys(subj)[0]; // 获取模板科目键
            if (!existingSubjects.includes(subjKey)) {
              console.log(`为 enabledSubject 添加缺失科目: ${subjKey}`);
              userConfig[key].push(subj); // 只添加缺失的科目
            }
          });
        } else if (fileName === 'config.json' && template[key].length > 0) {
          // **2. 其他数组（config.json），合并但不重复**
          const templateValues = new Set(template[key].map(item => JSON.stringify(item)));
          const userValues = new Set(userConfig[key].map(item => JSON.stringify(item)));
          const mergedArray = [...userValues, ...templateValues].map(item => JSON.parse(item));
          userConfig[key] = mergedArray;
        } else if (fileName === 'list.json' || fileName === 'classlist.json') {
          // **3. 仅确保数组长度匹配**
          if (userConfig[key].length < template[key].length) {
            console.log(`补充 ${fileName} 的 ${key}，目标长度: ${template[key].length}`);
            userConfig[key] = userConfig[key].concat(template[key].slice(userConfig[key].length));
          }
        }
      } else if (typeof template[key] === 'object' && template[key] !== null) {
        console.log(`递归检查对象字段: ${key}`);
        // 递归合并对象
        userConfig[key] = mergeConfig(template[key], userConfig[key], fileName);
      }
    }
    return userConfig;
  }
  

// 统一检查所有配置文件
function checkAllConfigs() {
  return {
    config: checkAndUpdateConfig('config.json', configJson),
    list: checkAndUpdateConfig('list.json', listJson),
    classlist: checkAndUpdateConfig('classlist.json', classlistJson)
  };
}

module.exports = { checkAllConfigs };
