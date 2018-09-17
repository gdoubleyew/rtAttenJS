const React = require('react')
const ReactDOM = require('react-dom')
const { remote, ipcRenderer } = require('electron')
const fs = require('fs')
const path = require('path')
const _ = require('lodash')

const elem = React.createElement

class StatusPane extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      config: {imgDir: '/tmp/img'},
      runNum: '',
      scanNum: '',
      files: [],
    }

    this.runNumOnChange = this.runNumOnChange.bind(this)
    this.scanNumOnChange = this.scanNumOnChange.bind(this)
    this.runBttnOnClick = this.runBttnOnClick.bind(this)
  }

  runNumOnChange(event) {
    this.setState({ runNum: event.target.value })
  }

  scanNumOnChange(event) {
    this.setState({ scanNum: event.target.value })
  }

  runBttnOnClick(event) {
    // TODO: Watch the mriImgDir for new files created matching the run and scan numbers
    console.log(`Run ${this.state.runNum}: Watch directory ${this.state.config.imgDir} for new scans`)
    fs.watch(this.state.config.imgDir, (eventType, filename) => {
      console.log(`event ${eventType}, filename ${filename}`)
      this.state.files.push(filename)
      this.setState({ files: this.state.files })
    })
  }

  componentDidMount() {
    // const self = this
    ipcRenderer.on('settingsChange', (event, message) => {
      if (!_.isEqual(this.state.config, message.config)) {
        console.log('state changed: %j', message)
        this.setState(message)
      } else {
        console.log('state unchanged: %j', message)
      }
    })
  }

  render() {
    const fileList = this.state.files.map((file, idx) =>
      elem('li', { key: idx }, file)
    )
    return elem('div', {},
      elem('p', {}, `MRI Scans Directory: ${this.state.config.imgDir}`),
      elem('hr'),
      elem('p', {}, 'Run #: ',
        elem('input', { value: this.state.runNum, onChange: this.runNumOnChange }),
      ),
      elem('p', {}, 'Scan #: ',
        elem('input', { value: this.state.scanNum, onChange: this.scanNumOnChange }),
      ),
      elem('button', { onClick: this.runBttnOnClick }, 'Run'),
      elem('hr'),
      elem('ul', {}, fileList),
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