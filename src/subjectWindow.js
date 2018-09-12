const React = require('react')
const ReactDOM = require('react-dom')
const { remote, ipcRenderer } = require('electron')
const fs = require('fs')

const elem = React.createElement
var refreshCount = 0
var startTime

class SubjectDisplay extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      subjectImage: '',
    }
  }

  componentDidMount() {
    const self = this
    ipcRenderer.on('showSubjectImage', (event, message) => {
      if (message.subjectImage != this.state.subjectImage) {
        // update the subject image display
        self.setState({ subjectImage: message.subjectImage })
      }
    })
  }

  render() {
    if (refreshCount > 100) {
      let elapsedTime = Date.now() - startTime
      console.log('Displayed 100 images in %d ms', elapsedTime)
      refreshCount = 0
    }
    if (refreshCount == 0) {
      startTime = Date.now()
    }
    refreshCount++
    return elem('div', {},
      elem('img', {src: this.state.subjectImage, alt: `No Image ${this.state.subjectImage}`}),
    )
  }
}

ReactDOM.render(
  elem('div', {},
    elem(SubjectDisplay)
  ),
  document.getElementById('app')
)