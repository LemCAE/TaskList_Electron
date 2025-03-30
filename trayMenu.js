const { Menu } = require('electron')
const path = require("path")

// 接收注入的依赖对象
function createMenuTemplate(di) {
    const config = di.checkAllConfigs().config
  return [
    {
      label: "显示窗口",
      click: () => {
        const mainWindow = di.getMainWindow()
        if (mainWindow && !mainWindow.isDestroyed()) {
          mainWindow.show()
        }
      }
    },
    { type: 'separator' },
    {
      label: '小工具',
      enabled: false,
    },
    {
      label: '工具页',
      click: () => di.createToolWindow('tools.html')
    },
    {
      label: '倒计时',
      click: () => di.createToolWindow('countdown.html')
    },
    {
      label: '随机抽取',
      click: () => di.createToolWindow('randomchoose.html')
    },
    {
      label: '字体编辑',
      click: () => di.createToolWindow('fontstyle.html')
    },
    {
      label: "专注模式",
      submenu: [
        {
          label: "进入专注模式", 
          click: () => {
            const mainWindow = di.getMainWindow()
            mainWindow.webContents.send("tray-command", "enterFocusingMode")
          }
        },
        {
          label: "退出专注模式",
          click: () => {
            const mainWindow = di.getMainWindow()
            mainWindow.webContents.send("tray-command", "exitFocusingMode")
          }
        }
      ]
    },
    { type: 'separator' },
    {
      label: "开机启动",
      submenu: [
        {
          label: "开机启动",
          type: "checkbox",
          checked: config.autoLaunch,
          click: () => {
            const mainWindow = di.getMainWindow()
            config.autoLaunch = !config.autoLaunch
            di.saveConfig()
            di.setStartup(config.autoLaunch)
            if (mainWindow && !mainWindow.isDestroyed()) {
              mainWindow.webContents.send('auto-launch-updated', config.autoLaunch)
            }
          }
        },
        {
          label: "自启动时最小化到系统托盘",
          type: "checkbox",
          checked: config.autoMinimizeWhenAutoLaunch,
          click: () => {
            const mainWindow = di.getMainWindow()
            config.autoMinimizeWhenAutoLaunch = !config.autoMinimizeWhenAutoLaunch
            di.saveConfig()
            if (mainWindow && !mainWindow.isDestroyed()) {
              mainWindow.webContents.send('auto-launch-min-updated', config.autoMinimizeWhenAutoLaunch)
            }
          }
        }
      ]
    },
    { type: 'separator' },
    {
      label: "说明文档",
      click: () => di.createDocsWindow()
    },
    {
      label: "更多",
      submenu:[
        {
          label: "切换至开发者模式",
          click: () => {
            const mainWindow = di.getMainWindow()
            mainWindow.webContents.openDevTools()
        }
        },
        {
          label: "打开配置文件夹",
          click: () => {
            const configPath = path.join(di.app.getPath('appData'), "TaskList/config")
            di.shell.openPath(configPath)
          }
        },
        {
          label: "重启应用",
          click: () => {
            di.app.relaunch()
            di.app.exit(0)
          }
        }
      ]
    },
    { type: 'separator' },
    {
      label: "退出应用",
      click: () => di.app.quit()
    }
  ]
}

module.exports = {
  buildTrayMenu: (di) => Menu.buildFromTemplate(createMenuTemplate(di))
}