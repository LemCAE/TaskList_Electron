const { app, BrowserWindow, ipcMain, dialog, Tray, Menu } = require("electron");
const path = require("path");
const WinReg = require("winreg");
const fs = require("fs");

let mainWindow;
let tray;
let config;

// 读取配置文件
function readConfig() {
    const configPath = path.join(__dirname, "./config/config.json");
    if (fs.existsSync(configPath)) {
        config = JSON.parse(fs.readFileSync(configPath)); 
    }
    return {};
}

readConfig();
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
        const contextMenu = Menu.buildFromTemplate([
            {
                label: "还原窗口",
                click: () => {
                    mainWindow.show();
                },
            },
            {
                label: "退出应用",
                click: () => {
                    app.quit();
                },
            },
        ]);
        tray.setToolTip("TaskList");
        tray.setContextMenu(contextMenu);

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
    }

    const configFilePath = path.join(__dirname, "./config/config.json");

    app.whenReady().then(() => {
        createWindow();

        // 读取配置文件
        fs.readFile(configFilePath, "utf8", (err, data) => {
            if (err) {
                console.error("failed to read config file:", err);
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
        setStartup(config.autoLaunch);

        app.on("activate", () => {
            if (BrowserWindow.getAllWindows().length === 0) {
                createWindow();
            }
        });
    });

    function setStartup(enable) {
        const key = new WinReg({
            hive: WinReg.HKCU,
            key: "\\Software\\Microsoft\\Windows\\CurrentVersion\\Run",
        });

        const appName = "TaskList";
        const exePath = `"${app.getPath("exe")} --autostart"`;

        if (enable) {
            key.set(appName, WinReg.REG_SZ, exePath, (err) => {
                if (err) {
                    console.error("failed to set startup item:", err);
                } else {
                    console.log("startup item set successfully");
                }
            });
        } else {
            key.remove(appName, (err) => {
                if (err) {
                    console.error("failed to remove startup item:", err);
                } else {
                    console.log("startup item removed successfully");
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

ipcMain.handle("read-config", async (event, fileName) => {
    try {
        const filePath = path.join(__dirname, "config", fileName);
        const data = await fs.promises.readFile(filePath, "utf-8");
        return JSON.parse(data);
    } catch (error) {
        console.error("Error reading config file:", error);
        throw error;
    }
});

ipcMain.handle("write-config", async (event, { fileName, data }) => {
    try {
        const filePath = path.join(__dirname, "config", fileName);
        await fs.promises.writeFile(
            filePath,
            JSON.stringify(data, null, 2),
            "utf-8"
        );
    } catch (error) {
        console.error("Error writing config file:", error);
        throw error;
    }
});

ipcMain.handle("get-resource-path", (event, fileName) => {
    return path.join(__dirname, "resource", fileName);
});

ipcMain.handle("dialog:selectImage", async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
        properties: ["openFile"],
        filters: [
            {
                name: "Images",
                extensions: ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"],
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