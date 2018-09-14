const { remote, ipcRenderer } = require('electron')
const React = require('react')
const ReactDOM = require('react-dom')
const toml = require('toml')
const fs = require('fs')

const elem = React.createElement


class SettingsForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      config: {},
      tomlFile: 'example.toml',
      tomlErrorMsg: '',
    }
    this.settingsInputForm = this.settingsInputForm.bind(this)
    this.tomlInputForm = this.tomlInputForm.bind(this)
    this.textInputField = this.textInputField.bind(this)
    this.loadTomlFile = this.loadTomlFile.bind(this)
    this.inputOnChange = this.inputOnChange.bind(this)
    this.submitOnClick = this.submitOnClick.bind(this)
  }

  tomlInputForm(props) {
    const form =
      elem('fieldset', {},
        elem('legend', {}, 'Select Toml File Configurations:'),
        elem('input', {
          size: 64,
          value: this.state.tomlFile,
          onChange: (event) => {
            this.setState({ tomlFile: event.target.value })
          },
        }),
        elem('button', { onClick: this.loadTomlFile }, 'Load'),
        elem('p', {}, this.state.tomlErrorMsg)
      )
    return form
  }

  loadTomlFile(event) {
    var tomlErrorMsg = ''
    if (fs.existsSync(this.state.tomlFile)) {
      try {
        const contents = fs.readFileSync(this.state.tomlFile)
        const configData = toml.parse(contents)
        this.setState({ config: configData, tomlErrorMsg: '' })
      } catch (err) {
        tomlErrorMsg = err.message
      }
    } else {
      tomlErrorMsg = `File \"${this.state.tomlFile}\" doesn't exist`
    }
    if (tomlErrorMsg) {
      // queue a rerender
      this.setState({ tomlErrorMsg: tomlErrorMsg })
    }
  }

  inputOnChange(event) {
    const section = event.target.attributes.section.value
    var revSection = Object.assign({}, this.state.config[section], { [event.target.name]: event.target.value })
    var revConfig = Object.assign({}, this.state.config, { [section]: revSection })
    this.setState({ config: revConfig })
  }

  textInputField(props) {
    return elem('p', { key: props.name },
      props.name + ': ',
      elem('input', Object.assign(props, { value: this.state.config[props.section][props.name], onChange: this.inputOnChange })),
    )
  }

  settingsInputForm(props) {
    var formSections = []
    for (let section in this.state.config) {
      let subform = Object.keys(this.state.config[section]).map(k =>
        this.textInputField({ name: k, section: section })
      )
      formSections.push(
        elem('fieldset', { key: section },
          elem('legend', {}, section),
          subform,
        )
      )
    }
    const form =
      elem('fieldset', {},
        elem('legend', {}, 'Configurations'),
        elem('p', { align: 'right' },
          elem('button', { onClick: this.submitOnClick, style: {align: 'right'} }, 'submit'),
        ),
        formSections,
      )
    return form
  }

  submitOnClick(event) {
    ipcRenderer.send('settingsChange', {
      config: this.state.config,
    }
    )
  }

  render() {
    // if (this.errorMsg) {
    // var errElem = elem('span', {}, this.errorMsg)
    // }
    return elem('div', {},
      this.tomlInputForm({}),
      elem('br'),
      this.settingsInputForm({})
    )
  }
}

ReactDOM.render(
  elem('div', {},
    elem(SettingsForm)
  ),
  document.getElementById('app')
)