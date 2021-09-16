const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const ipc = ipcMain

function createWindow () {
    const win = new BrowserWindow({
    width: 1200,
    height: 680,
    minWidth: 940,
    minHeight: 560,
    frame: false,
    webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        devTools: true,
        preload: path.join(__dirname, 'preload.js')
    }
  })

  win.loadFile('src/index.html')
  win.setBackgroundColor('#343B48')

  ipc.on('minimizeApp', () => {
    win.minimize()
  })
  ipc.on('maximizeRestoreApp', () => {
    if(win.isMaximized()){
      win.restore()
      console.log('test2')
    } else {
      win.maximize()
      console.log('test2')
    }
  })

  win.on('maximize', () => {
    win.webContents.send('isMaximized')
  })
  win.on('unmaximize', () => {
    win.webContents.send('isRestored')
  })

  ipc.on('closeApp', () => {
    win.close()
  })
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})