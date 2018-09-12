const React = require('react')
const ReactDOM = require('react-dom')
const {remote, ipcRenderer} = require('electron')

const elem = React.createElement

class SettingsForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      imgDir: '',
    }
    this.imgDirOnChange = this.imgDirOnChange.bind(this)
    this.submitOnClick = this.submitOnClick.bind(this)
  }

  imgDirOnChange(event) {
    this.setState({imgDir: event.target.value})
  }

  submitOnClick(event) {
    console.log(`image direcory ${this.state.imgDir} submitted`)
    remote.getGlobal('sharedObject').imgDir = this.state.imgDir
    ipcRenderer.send('settingsChange', {imgDir: this.state.imgDir, other: 'todo'})
  }

  render() {
    console.log('Render called')
    const form = 
      elem('div', {},
        elem('p', {}, 'Enter Image Directory'),
        elem('input', { value: this.state.imgDir, onChange: this.imgDirOnChange }),
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