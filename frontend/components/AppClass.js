import React from 'react'
import axios from 'axios'

const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 // the index the "B" is at

const initialState = {
  message: initialMessage,
  email: initialEmail,
  index: initialIndex,
  steps: initialSteps,
}

const apiEnd = 'http://localhost:9000/api/result'
export default class AppClass extends React.Component {

  constructor(){
    super()
    this.state = initialState
  }

  getXY = (position) => {
    let i = 0
    for (let y = 0; y < 3; ++y){
      for (let x = 0; x < 3; ++x){
        if (i === position){
          return `${x+1}${y+1}`
        }
        i++
      }
    }
  }

  getXYMessage = () => {
    const cordinates = this.getXY(this.state.index)
    return `Coordinates (${cordinates[0]}, ${cordinates[1]})`
  }

  getStepsMessage = () => {
    return `You moved ${this.state.steps} ${this.state.steps != 1 ? "times": "time"}`
  }

  reset = () => {
    this.setState(initialState)
  }

  resetEmail = () => {
    this.setState({...this.state, message: initialMessage, email: initialEmail})
  }

  getNextIndex = (direction) => {
    let position = this.state.index

    if (direction === "left"){
      return ((position )%3 === 0) ? position : position - 1
    }

    if (direction === "right"){
      return (position && ((position + 1)%3 === 0)) ? position : (position + 1)
    }

    if (direction === "up"){
      return (position < 3) ? position : (position - 3)
    }

    if (direction === "down"){
      return (position >= 6) ? position : (position + 3)
    }
  }

  move = (evt) => {
    const position = this.state.index
    const newIndex = this.getNextIndex(evt.target.id)
    let newState = {...this.state, index: newIndex}

    if (position != newIndex) {
      newState = ({...newState, steps: this.state.steps + 1, message: ''})
    }
    else{
      newState = ({...newState, message: `You can't go ${evt.target.id}`})
    }
    this.setState(newState)
  }

  onChange = (evt) => {
    evt.preventDefault()
    this.setState({...this.state, email: evt.target.value})
  }

  validateEmailAddressInput = (email) => {
    return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)
  }

  onSubmit = (evt) => {
    evt.preventDefault()
    const payload = {
      "x": this.getXY(this.state.index)[0],
      "y": this.getXY(this.state.index)[1],
      "steps": this.state.steps,
      "email": this.state.email
    }
    if (this.validateEmailAddressInput((this.state.email))){
      axios.post(apiEnd, payload)
      .then(res=>this.setState({...this.state, message: res.data.message}))
      .catch(err => this.setState({...this.state, message: err.response.data.message}))
      .finally(this.resetEmail())
    }
    else{
      if (!this.state.email.length){
        this.setState({...this.state, message: 'Ouch: email is required'})
      }
      else {
        this.setState({...this.state, message: 'Ouch: email must be a valid email'})
      }
    }
  }

  render() {
    const { className } = this.props
    return (
      <div id="wrapper" className={className}>
        <div className="info">
          <h3 id="coordinates">{this.getXYMessage()}</h3>
          <h3 id="steps">{this.getStepsMessage()}</h3>
        </div>
        <div id="grid">
          {
            [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
              <div key={idx} className={`square${idx === this.state.index ? ' active' : ''}`}>
                {idx === this.state.index ? 'B' : null}
              </div>
            ))
          }
        </div>
        <div className="info">
          <h3 id="message">{this.state.message}</h3>
        </div>
        <div id="keypad">
          <button id="left" onClick={(e) => this.move(e)}>LEFT</button>
          <button id="up" onClick={(e) => this.move(e)}>UP</button>
          <button id="right" onClick={(e) => this.move(e)}>RIGHT</button>
          <button id="down" onClick={(e) => this.move(e)}>DOWN</button>
          <button id="reset" onClick={() => this.reset()}>reset</button>
        </div>
        <form onSubmit={(e) => this.onSubmit(e)}>
          <input id="email" type="email" placeholder="type email" value={this.state.email} onChange={this.onChange}></input>
          <input id="submit" type="submit"></input>
        </form>
      </div>
    )
  }
}
