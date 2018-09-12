const React = require('react')
const ReactDOM = require('react-dom')
const { remote, ipcRenderer } = require('electron')
const fs = require('fs')

const elem = React.createElement

class StatusPane extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      imgDir: '',
      files: [],
    }
  }

  componentDidMount() {
    const self = this
    ipcRenderer.on('settingsChange', (event, message) => {
      console.log('settingsChange: %j', message)
      // Object.assign(globalState, message)
      if (message.imgDir != this.state.imgDir) {
        // read in the file names from the image directory
        fs.readdir(message.imgDir, (err, files) => {
          if (err) {
            console.log(`readdir error: ${err}`)
            // self.setState({ imgDir: message.imgDir })
            return
          }
          self.setState({ imgDir: message.imgDir, files: files })
        })
      }
    })
  }

  render() {
    const files = this.state.files
    const fileList = files.map((file, idx) =>
      elem('li', {key: idx}, file)
    )
    return elem('div', {}, 
      elem('p', {}, `Files: ${this.state.imgDir}`),
      elem('hr'),
      elem('ul', {}, fileList)
    )
  }
}

function Render() {
  ReactDOM.render(
    elem('div', {},
      elem(StatusPane)
    ),
    document.getElementById('app')
  )
}

Render()
    
// elem('h3', {}, `Node version: ${process.versions.node}`),
// elem('h3', {}, `Chrome version: ${process.versions.chrome}`),
// elem('h3', {}, `Electron version: ${process.versions.electron}`)