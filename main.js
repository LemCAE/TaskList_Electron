const { app, BrowserWindow, ipcMain, dialog, Tray, Menu, shell } = require("electron");
const path = require("path");
const WinReg = require("winreg");
const fs = require("fs");
const loudness = require('loudness');
const { autoUpdater } = require('electron-updater');
//const { checkAndReadConfig } = require('./config0');
const { checkAllConfigs } = require('./config');
const { logToFile } = require('./log');
const iconv = require("iconv-lite");
const { exec } = require("child_process");
const { buildTrayMenu } = require('./trayMenu');

async function loadInput() {
    const dev = await import('electron-is-dev');
    return dev.default;
}

let isDev;
autoUpdater.forceDevUpdateConfig = true;
loadInput().then(dev => {
    isDev = dev; 
}).catch(error => {
    logToFile("main.js",`Failed to load isDev:', ${error}`);
});

let mainWindow;
let tray;
let config;

config = checkAllConfigs().config;//checkAndReadConfig()会返回{classlist:{...}, config:{...}, list:{...}}
//config = checkAndReadConfig('config');
//checkAndReadConfig('list');
//checkAndReadConfig('classlist');

const updateSource = config.updateSource;
const currentVersion = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'))).version;

function showUpdateDialog(title, message) {
    return dialog.showMessageBox({
        type: 'info',
        title: title,
        message: message,
        buttons: ['是', '否']
    });
}

function configureUpdater() {
    autoUpdater.autoDownload = false;
    if (updateSource === 'Gitee') {
        autoUpdater.setFeedURL({
            provider: 'generic',
            url: 'https://gitee.com/LemCAE/TaskList_Electron/releases'
        });
    } else if (updateSource === 'GitHub') {
        autoUpdater.setFeedURL({
            provider: 'github',
            owner: 'LemCAE',
            repo: 'TaskList_Electron'
        });
    }
}

function saveConfig() {
    const configFilePath = path.join(app.getPath('appData'), "TaskList/config/config.json");
    fs.writeFileSync(configFilePath, JSON.stringify(config, null, 2), 'utf-8');
}

autoUpdater.on('update-available', async () => {
    logToFile("main.js",'Update available')
    if (!config.autoDownloadUpdate) {
        const result = await showUpdateDialog('可用更新', '检测到新版本，是否立即更新？');
        if (result.response === 0) {
            autoUpdater.downloadUpdate(); // 用户确认后才下载
        } else {
            logToFile("main.js",'Update canceled');
        }
    } else {
        autoUpdater.downloadUpdate()
    }
});

autoUpdater.on('download-progress', (progressObj) => {
    const { percent } = progressObj;
    console.log(`Download progress: ${percent}%`);
    mainWindow.webContents.send('update-progress', percent);
});

autoUpdater.on('update-downloaded', async () => {
    const result = await showUpdateDialog('更新已下载', '新版本已下载，是否立即安装？');
    if (result.response === 0) {
        autoUpdater.quitAndInstall();
    }
});

autoUpdater.on('error', (error) => {
    logToFile("main.js",`Update error:' ${error}`);
    dialog.showErrorBox('Update Error', error.message);
});

// 启动时检查更新
app.on('ready', () => {
    configureUpdater();
    if (!isDev && config.autoCheckUpdate) {
        const checkUpdates = async () => {
            try {
                const updateCheckResult = await autoUpdater.checkForUpdates();
                logToFile("main.js",`${updateCheckResult.updateInfo.version} ${currentVersion}`);
            } catch (error) {
                logToFile("main.js",`Update check error:'${error}`);
            }
        };
        checkUpdates();
    }
});

// 处理渲染进程的请求
ipcMain.handle('checkUpdates', async () => {
    try {
        const updateCheckResult = await autoUpdater.checkForUpdates();
        if (updateCheckResult && updateCheckResult.updateInfo && updateCheckResult.updateInfo.version !== currentVersion) {
            return { success: true, hasUpdate: true, message: '有可用更新' };
        } else {
            return { success: true, hasUpdate: false, message: '暂无可用更新' };
        }
    } catch (error) {
        return { success: false, message: `Error initiating update check: ${error.message}` };
    }
});


const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
    app.quit();
} else {
    app.on("second-instance", (event, commandLine, workingDirectory) => {
        if (mainWindow) {
            if (mainWindow.isMinimized()) {
                mainWindow.restore(); // 还原窗口
            }
            mainWindow.show(); // 确保窗口显示
            mainWindow.focus(); // 确保窗口获得焦点
        }
    });
    function createWindow() {
        mainWindow = new BrowserWindow({
            width: 1280,
            height: 720,
            minWidth: 640,
            minHeight: 360,
            autoHideMenuBar: true,
            frame: false,
            webPreferences: {
                preload: path.join(__dirname, "preload.js"),
                contextIsolation: true,
                enableRemoteModule: false,
                nodeIntegration: false,
            },
        });
        mainWindow.loadFile(path.join(__dirname, "public", "index.html"));
        tray = new Tray(path.join(__dirname, "./resource/icon.ico"));
        refreshTray();
        tray.setToolTip("TaskList");
        mainWindow.on("close", (event) => {
            if (!app.isQuiting) {
                event.preventDefault();
                mainWindow.hide();
            }
        });
        tray.on("click", () => {
            mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
        });
        ipcMain.on("minimize", () => {
            mainWindow.minimize();
        });
        ipcMain.on("maximize", () => {
            if (mainWindow.isMaximized()) {
                mainWindow.unmaximize();
            } else {
                mainWindow.maximize();
            }
        });
        ipcMain.on("close", () => {
            mainWindow.close();
        });
        mainWindow.on("maximize", () => {
            mainWindow.webContents.send("window-maximized");
        });
        mainWindow.on("unmaximize", () => {
            mainWindow.webContents.send("window-unmaximized");
        });
        // 处理设置自动启动的 IPC 事件
        ipcMain.on("toggle-auto-launch", (event, enable) => {
            setStartup(enable);
        });
        ipcMain.handle('toggle-fullscreen', () => {
            if (mainWindow) {
              const isFullScreen = mainWindow.isFullScreen();
              mainWindow.setFullScreen(!isFullScreen);
              return !isFullScreen; // 返回切换后的全屏状态
            }
            return false;
          });
          logToFile("main.js",'==================== App started ====================');
    }
    const configFilePath = path.join(app.getPath('appData'), "TaskList/config/config.json");
    app.whenReady().then(() => {
        createWindow();
        // 读取配置文件
        fs.readFile(configFilePath, "utf8", (err, data) => {
            if (err) {
                logToFile("main.js",`failed to read config file: ${err}`);
                return;
            }
            const config = JSON.parse(data);
            const ifMinimize = config.autoMinimizeWhenAutoLaunch;
            // 检查命令行参数是否包含 --autostart
            const isCommandLineAutoStart = process.argv.includes("--autostart");
            if (ifMinimize && isCommandLineAutoStart) {
                mainWindow.hide();
            }
        });
        // 程序启动时设置自动启动
        console.log("Auto launch:", config.autoLaunch);
        setStartup(config.autoLaunch);
        app.on("activate", () => {
            if (BrowserWindow.getAllWindows().length === 0) {
                createWindow();
            }
        });
    });

    function setStartup(enable) {
        const exePath = `"${app.getPath("exe")} --autostart"`;
        if (enable) {
            exec(`reg add "HKEY_CURRENT_USER\\Software\\Microsoft\\Windows\\CurrentVersion\\Run" /v TaskList /t REG_SZ /d ${exePath} /f`,
                { encoding: "buffer" },
                (error, stdout, stderr) => {
                    if (error) {
                        logToFile("main.js",`Error 自启动项添加${iconv.decode(stderr, "gbk").trim()}`);
                    } else {
                        logToFile("main.js",`成功添加自启动项`);
                    }
                }
            )
        } else {
            exec('reg delete "HKEY_CURRENT_USER\\Software\\Microsoft\\Windows\\CurrentVersion\\Run" /v TaskList /f', 
                { encoding: "buffer" }, 
                (error, stdout, stderr) => {
                    if (error) {
                        logToFile("main.js", `Error 自启动项移除${iconv.decode(stderr, "gbk").trim()}`);
                    } else {
                        logToFile("main.js", `成功移除自启动项`);
                    }
            });
        }
    }
    app.on("window-all-closed", () => {
        if (process.platform !== "darwin") {
            app.quit();
        }
    });
    app.on("before-quit", () => {
        app.isQuiting = true;
    });
}


let toolWindow; // 声明在外部作用域以便于跟踪窗口状态

function createToolWindow(fileName) {
  // 如果窗口已经存在，直接聚焦
  if (toolWindow) {
    toolWindow.focus();
    return;
  }
  toolWindow = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth: 640,
    minHeight: 360,
    frame: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false,
    },
  });
  toolWindow.loadFile(path.join(__dirname, "public", "subpage", fileName)); // 加载子窗口的 HTML 文件
  // 绑定窗口关闭事件
  toolWindow.on("closed", () => {
    toolWindow = null; // 清空引用，防止内存泄漏
    ipcMain.removeAllListeners("subminimize"); // 清理事件监听
    ipcMain.removeAllListeners("submaximize");
    ipcMain.removeAllListeners("subclose");
  });
  // 监听 IPC 事件
  ipcMain.on("subminimize", () => {
    if (toolWindow) {
      toolWindow.minimize();
    }
  });
  ipcMain.on("submaximize", () => {
    if (toolWindow) {
      if (toolWindow.isMaximized()) {
        toolWindow.unmaximize();
      } else {
        toolWindow.maximize();
      }
    }
  });
  ipcMain.on("subclose", () => {
    if (toolWindow) {
      toolWindow.close();
    }
  });
  toolWindow.on("maximize", () => {
    if (toolWindow) {
      toolWindow.webContents.send("subwindow-maximized");
    }
  });
  toolWindow.on("unmaximize", () => {
    if (toolWindow) {
      toolWindow.webContents.send("subwindow-unmaximized");
    }
  });
}
/////////////////
let docsWindow; // 声明在外部作用域以便于跟踪窗口状态

function createDocsWindow() {
  // 如果窗口已经存在，直接聚焦
  if (docsWindow) {
    docsWindow.focus();
    return;
  }
  docsWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    minWidth: 640,
    minHeight: 360,
    frame: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false,
    },
  });
  docsWindow.loadFile(path.join(__dirname, "public", "docs", "index.html")); // 加载子窗口的 HTML 文件
  // 绑定窗口关闭事件
  docsWindow.on("closed", () => {
    docsWindow = null; // 清空引用，防止内存泄漏
    ipcMain.removeAllListeners("docsminimize"); // 清理事件监听
    ipcMain.removeAllListeners("docsmaximize");
    ipcMain.removeAllListeners("docsclose");
  });
  // 监听 IPC 事件
  ipcMain.on("docsminimize", () => {
    if (docsWindow) {
        docsWindow.minimize();
    }
  });
  ipcMain.on("docsmaximize", () => {
    if (docsWindow) {
      if (docsWindow.isMaximized()) {
        docsWindow.unmaximize();
      } else {
        docsWindow.maximize();
      }
    }
  });
  ipcMain.on("docsclose", () => {
    if (docsWindow) {
        docsWindow.close();
    }
  });
  docsWindow.on("maximize", () => {
    if (docsWindow) {
        docsWindow.webContents.send("docswindow-maximized");
    }
  });
  docsWindow.on("unmaximize", () => {
    if (docsWindow) {
        docsWindow.webContents.send("docswindow-unmaximized");
    }
  });
}

/////////////////
ipcMain.handle('createToolWindow', async (event, fileName) => {
  createToolWindow(fileName);
});
ipcMain.handle('createDocsWindow', async (event) => {
  createDocsWindow();
});
ipcMain.handle('isWindowMaximized', async (event) => {
    return toolWindow.isMaximized(); 
});

ipcMain.handle("read-config", async (event, fileName) => {
    try {
        const filePath = path.join(app.getPath('appData'), "TaskList/config", fileName);
        const data = await fs.promises.readFile(filePath, "utf-8");
        return JSON.parse(data);
    } catch (error) {
        logToFile("main.js",`Error reading config file:" ${error}`);
        throw error;
    }
});

ipcMain.handle("readJson", async (event, filePath) => {
    try {
        const data = await fs.promises.readFile(filePath, "utf-8");
        return JSON.parse(data);
    } catch (error) {
        logToFile("main.js",`Error reading config file:", ${error}`);
        throw error;
    }
});


ipcMain.handle("write-config", async (event, { fileName, data }) => {
    try {
        const filePath = path.join(app.getPath('appData'), "TaskList/config", fileName);
        await fs.promises.writeFile(
            filePath,
            JSON.stringify(data, null, 2),
            "utf-8"
        );
    } catch (error) {
        logToFile("main.js",`Error writing config file: ${error}`);
        throw error;
    }
});


ipcMain.handle("get-resource-path", (event, fileName) => {
    if (!fileName) {
      throw new Error("Invalid file name. Ensure the file name is provided.");
    }
    // 根据环境构建路径
    const resourcePath = app.isPackaged
      ? path.join(process.resourcesPath, 'app.asar', 'resource', fileName) // 打包环境
      : path.join(__dirname, 'resource', fileName); // 开发环境
  
    return resourcePath;
  });

ipcMain.handle("dialog:selectImage", async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
        properties: ["openFile"],
        filters: [
            {
                name: "Images",
                extensions: ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'svg', 'ico'],
            },
        ],
    });
    if (canceled) {
        return null;
    } else {
        return filePaths[0];
    }
});

ipcMain.handle("dialog:selectJson", async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
        properties: ["openFile"],
        filters: [
            {
                name: "Images",
                extensions: ["json"],
            },
        ],
    });
    if (canceled) {
        return null;
    } else {
        return filePaths[0];
    }
});

ipcMain.handle('select-folder', async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ['openDirectory']
    });
    return result.filePaths;
  });

ipcMain.handle("dialog:showWarning", async (event, detailText) => {
    const result = await dialog.showMessageBox(mainWindow, {
        type: "warning",
        buttons: ["确认", "取消"],
        defaultId: 0,
        cancelId: 1,
        title: "警告",
        message: "确定要继续吗？",
        detail: detailText,
    });
    return result.response;
});

ipcMain.handle("dialog:showError", async (event, detailText) => {
    const result = await dialog.showMessageBox(mainWindow, {
        type: "error",
        buttons: ["确认"],
        defaultId: 0,
        title: "错误",
        detail: detailText,
    });
    return result.response;
});

ipcMain.handle("dialog:showInfo", async (event, detailText) => {
    const result = await dialog.showMessageBox(mainWindow, {
        type: "info",
        buttons: ["确认"],
        defaultId: 0,
        title: "通知",
        detail: detailText,
    });
    return result.response;
});

ipcMain.handle("dialog:importFile", async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
        properties: ["openFile"],
        filters: [{ name: "JSON Files", extensions: ["json"] }],
    });
    if (canceled || filePaths.length === 0) {
        return { success: false, error: "No file selected" };
    }
    const filePath = filePaths[0];
    try {
        const fileContent = await fs.promises.readFile(filePath, "utf-8");
        const data = JSON.parse(fileContent);
        const requiredKeys = ["cn", "ma", "en", "ph", "ch", "bi", "ot"];
        const missingKeys = requiredKeys.filter(
            (key) => !Object.hasOwn(data, key)
        );
        if (missingKeys.length > 0) {
            return {
                success: false,
                error: `Missing keys: ${missingKeys.join(", ")}`,
            };
        }
        return { success: true, data };
    } catch (error) {
        return { success: false, error: "Error reading or parsing JSON file" };
    }
});

ipcMain.handle("dialog:exportFile", async (event, data) => {
    const { canceled, filePath } = await dialog.showSaveDialog({
        title: "Export JSON File",
        defaultPath: "list.json", // 默认文件名
        filters: [{ name: "JSON Files", extensions: ["json"] }],
    });
    if (canceled || !filePath) {
        return {
            success: false,
            error: "Export canceled or no file path selected",
        };
    }
    try {
        // 将数据写入选定的文件路径
        await fs.promises.writeFile(
            filePath,
            JSON.stringify(data, null, 2),
            "utf-8"
        );
        return { success: true };
    } catch (error) {
        return { success: false, error: "Error writing JSON file" };
    }
});

ipcMain.handle('getMusic', (event, folderPath) => {
    const supportedFormats = ['.mp3', '.wav', '.ogg', '.flac', '.m4a'];
    const files = fs.readdirSync(folderPath);
    const musicFiles = files.filter(file => supportedFormats.includes(path.extname(file).toLowerCase()));
    return musicFiles.map(file => path.join(folderPath, file)); // 返回完整路径
});

ipcMain.handle('getImage', (event, folderPath) => {
    const supportedFormats = ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp', '.svg', '.ico'];
    const files = fs.readdirSync(folderPath);
    const imageFiles = files.filter(file => supportedFormats.includes(path.extname(file).toLowerCase()));
    return imageFiles.map(file => path.join(folderPath, file).replace(/\\/g, "/")); // 返回完整路径
});

ipcMain.on('exit-app', () => {
    app.quit();
});

ipcMain.handle('setSystemVolume', async (event, volume) => {
    await loudness.setVolume(volume);
});

ipcMain.handle('getSystemVolume', async (event) => {
    const volume = await loudness.getVolume();
    return volume;
})

ipcMain.handle('setMuted', async (event, muted) => {
    await loudness.setMuted(muted);
});

ipcMain.handle('getMuted', async (event) => {
    const muted = await loudness.getMuted();
    return muted;
})

ipcMain.on('open-external-link', (event, url) => {
    logToFile("main.js",`Extrrnal link received in Main: ${url}`);
    if (url) {
        shell.openExternal(url);
    }
});

ipcMain.on('write-log', (event, fileName, message) => {
    if (message) {
        logToFile(fileName, message);
    }
});

ipcMain.on('reload-tray-menu', () => {
        refreshTray();
    } 
);

const dependencies = {
    app,                  // 从 electron 引入
    shell,                // 从 electron 引入
    config,               // 配置对象
    getMainWindow: () => mainWindow,           // 主窗口实例
    saveConfig,
    setStartup,           // 开机启动设置函数
    createToolWindow,
    createDocsWindow,
    checkAllConfigs,
  }

function refreshTray() {
    tray.setContextMenu(buildTrayMenu(dependencies)) // 始终使用最新模板
}