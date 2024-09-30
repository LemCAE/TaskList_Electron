const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("fileAPI", {
    readConfig: (fileName) => ipcRenderer.invoke("read-config", fileName),
    writeConfig: (fileName, data) => ipcRenderer.invoke("write-config", { fileName, data }),
    getResourcePath: (fileName) => ipcRenderer.invoke("get-resource-path", fileName),
    selectImage: () => ipcRenderer.invoke("dialog:selectImage"),
    importFile: () => ipcRenderer.invoke("dialog:importFile"),
    exportFile: (data) => ipcRenderer.invoke("dialog:exportFile", data),
    selectFolder: () => ipcRenderer.invoke('select-folder'),
    getMusicFiles: (folderPath) => ipcRenderer.invoke('getMusic', folderPath),
});

contextBridge.exposeInMainWorld("wAPI", {
    minimize: () => ipcRenderer.send("minimize"),
    maximize: () => ipcRenderer.send("maximize"),
    close: () => ipcRenderer.send("close"),
    onWindowMaximized: (callback) => ipcRenderer.on("window-maximized", callback),
    onWindowUnmaximized: (callback) => ipcRenderer.on("window-unmaximized", callback),
    toggleAutoLaunch: (autoLaunch) => ipcRenderer.send("toggle-auto-launch", autoLaunch),
    exit: () => ipcRenderer.send("exit-app"),
    getVolume: () => ipcRenderer.invoke('getSystemVolume'),
    setVolume: (volume) => ipcRenderer.invoke('setSystemVolume', volume),
    setMuted: (muted) => ipcRenderer.invoke('setMuted', muted),
    getMuted: () => ipcRenderer.invoke('getMuted'),
});

contextBridge.exposeInMainWorld("infoAPI", {
    showWarningDialog: (detailText) => ipcRenderer.invoke("dialog:showWarning", detailText),
});
