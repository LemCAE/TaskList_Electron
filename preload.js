const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("fileAPI", {
    readConfig: (fileName) => ipcRenderer.invoke("read-config", fileName),
    writeConfig: (fileName, data) => ipcRenderer.invoke("write-config", { fileName, data }),
    readJson: (fileName) => ipcRenderer.invoke("readJson", fileName),
    getResourcePath: (fileName) => ipcRenderer.invoke("get-resource-path", fileName),
    selectImage: () => ipcRenderer.invoke("dialog:selectImage"),
    selectJson: () => ipcRenderer.invoke("dialog:selectJson"),
    importFile: () => ipcRenderer.invoke("dialog:importFile"),
    exportFile: (data) => ipcRenderer.invoke("dialog:exportFile", data),
    selectFolder: () => ipcRenderer.invoke('select-folder'),
    getMusicFiles: (folderPath) => ipcRenderer.invoke('getMusic', folderPath),
    getImageFiles: (folderPath) => ipcRenderer.invoke('getImage', folderPath),
    openUrlInBrowser: (url) => {
        console.log('Preload received:', url);
        ipcRenderer.send('open-external-link', url);
    }
});

contextBridge.exposeInMainWorld("wAPI", {
    minimize: () => ipcRenderer.send("minimize"),
    maximize: () => ipcRenderer.send("maximize"),
    close: () => ipcRenderer.send("close"),
    onWindowMaximized: (callback) => ipcRenderer.on("window-maximized", callback),
    onWindowUnmaximized: (callback) => ipcRenderer.on("window-unmaximized", callback),
    toggleFullscreen: async () => ipcRenderer.invoke('toggle-fullscreen'),
    toggleAutoLaunch: (autoLaunch) => ipcRenderer.send("toggle-auto-launch", autoLaunch),
    exit: () => ipcRenderer.send("exit-app"),
    getVolume: () => ipcRenderer.invoke('getSystemVolume'),
    setVolume: (volume) => ipcRenderer.invoke('setSystemVolume', volume),
    setMuted: (muted) => ipcRenderer.invoke('setMuted', muted),
    getMuted: () => ipcRenderer.invoke('getMuted'),
    checkForUpdates: () => ipcRenderer.invoke('checkUpdates'),
    onUpdateProgress: (callback) => ipcRenderer.on('update-progress', (event, percent) => {
        callback(percent);
    }),
});

contextBridge.exposeInMainWorld("subwAPI", {
    create: (fileName) => ipcRenderer.invoke("createToolWindow", fileName),
    minimize: () => ipcRenderer.send("subminimize"),
    maximize: () => ipcRenderer.send("submaximize"),
    close: () => ipcRenderer.send("subclose"),
    onWindowMaximized: (callback) => ipcRenderer.on("subwindow-maximized", callback),
    onWindowUnmaximized: (callback) => ipcRenderer.on("subwindow-unmaximized", callback),
    isWindowMaximized: () => {
        return ipcRenderer.invoke('isWindowMaximized');
    },
})
contextBridge.exposeInMainWorld("docswAPI", {
    create: () => ipcRenderer.invoke("createDocsWindow"),
    minimize: () => ipcRenderer.send("docsminimize"),
    maximize: () => ipcRenderer.send("docsmaximize"),
    close: () => ipcRenderer.send("docsclose"),
    onWindowMaximized: (callback) => ipcRenderer.on("docswindow-maximized", callback),
    onWindowUnmaximized: (callback) => ipcRenderer.on("docswindow-unmaximized", callback),
    isWindowMaximized: () => {
        return ipcRenderer.invoke('isWindowMaximized');
    },
})

contextBridge.exposeInMainWorld("infoAPI", {
    showWarningDialog: (detailText) => ipcRenderer.invoke("dialog:showWarning", detailText),
    showErrorDialog: (detailText) => ipcRenderer.invoke("dialog:showError", detailText),
    showInfoDialog: (detailText) => ipcRenderer.invoke("dialog:showInfo", detailText),
    sendToMain: (channel, data) => ipcRenderer.send(channel, data),
    onFromMain: (channel, callback) => ipcRenderer.on(channel, (event, ...args) => callback(...args)),
});
