const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')
// const {inspect} = require('util')

var mainWindow
var settingsWindow
var subjectWindow
var subjectDisplayInterval

function createWindow () {
  BrowserWindow.addDevToolsExtension('./react_dev_tools')

  global.sharedObject = {
    mriImgDir: '',
    subImgDir: '../images/female_happy',
  }

  // Create the main browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600})
  mainWindow.loadFile('html/mainWindow.html')

  mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

  // Create the settings window
  settingsWindow = new BrowserWindow()
  settingsWindow.loadFile('html/settingsWindow.html')
  settingsWindow.webContents.openDevTools()
  mainWindow.addTabbedWindow(settingsWindow)

  // Create the subject display window
  subjectWindow = new BrowserWindow({ width: 900, height: 600, x: 0, y: 0 })
  subjectWindow.loadFile('html/subjectWindow.html')
  subjectWindow.webContents.openDevTools()

  console.log('start interval timer')
  // show a different subject image every n seconds
  let intervalMillisec = 1000
  let imageNum = 0
  subjectDisplayInterval = setInterval(() => {
    imageName = path.join(global.sharedObject.subImgDir, String(imageNum + 1) + '.jpg')
    console.log('show image %s', imageName)
    subjectWindow.webContents.send('showSubjectImage', { subjectImage: imageName })
    imageNum = (imageNum + 1) % 45
  }, intervalMillisec)

}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

ipcMain.on('settingsChange', (event, message) => {
  // JSON.stringify(event, null, 2)
  // console.log(`message: ${message}, event: ${inspect(event)}`)
  console.log('message: %j, event %j, dir %s', message, event, global.sharedObject.mriImgDir)
  mainWindow.webContents.send('settingsChange', message)
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
