const React = require('react')
const ReactDOM = require('react-dom')
const {remote, ipcRenderer} = require('electron')

const elem = React.createElement

class SettingsForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      mriImgDir: '',
    }
    this.mriImgDirOnChange = this.mriImgDirOnChange.bind(this)
    this.submitOnClick = this.submitOnClick.bind(this)
  }

  mriImgDirOnChange(event) {
    this.setState({mriImgDir: event.target.value})
  }

  submitOnClick(event) {
    console.log(`image direcory ${this.state.mriImgDir} submitted`)
    remote.getGlobal('sharedObject').mriImgDir = this.state.mriImgDir
    ipcRenderer.send('settingsChange', {mriImgDir: this.state.mriImgDir, other: 'todo'})
  }

  render() {
    console.log('Render called')
    const form = 
      elem('div', {},
        elem('p', {}, 'Enter Image Directory'),
        elem('input', { value: this.state.mriImgDir, onChange: this.mriImgDirOnChange }),
        elem('button', { onClick: this.submitOnClick }, 'submit')
      )
    return form
  }
}

ReactDOM.render(
  elem('div', {},
    elem(SettingsForm)
  ),
  document.getElementById('app')
)