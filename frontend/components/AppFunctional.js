import React, { useState } from 'react'
import axios from 'axios'

const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 // the index the "B" is at

const apiEnd = 'http://localhost:9000/api/result'

export default function AppFunctional(props) {

  const [message, setMessage] = useState(initialMessage)
  const [email, setEmail] = useState(initialEmail)
  const [steps, setSteps] = useState(initialSteps)
  const [index, setIndex] = useState(initialIndex)

  function getXY(position) {
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

  function getXYMessage() {
    const cordinates = getXY(index)
    return `Coordinates (${cordinates[0]}, ${cordinates[1]})`
  }
  function getStepsMessage() {
    return `You moved ${steps} ${steps != 1 ? "times": "time"}`
  }
  function reset() {
    setMessage(initialMessage)
    setEmail(initialEmail)
    setSteps(initialSteps)
    setIndex(initialIndex)
  }

  function resetEmail() {
    setMessage(initialMessage)
    setEmail(initialEmail)
  }

  function getNextIndex(direction) {
    let position = index

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

  function move(evt) {
    const position = index
    const newIndex = getNextIndex(evt.target.id)
    setIndex(newIndex)
    if (position != newIndex) {
      setSteps(steps + 1)
      setMessage("")
    }
    else{
      setMessage(`You can't go ${evt.target.id}`)
    }
  }

  function onChange(evt) {
    evt.preventDefault()
    setEmail(evt.target.value)
  }

  function validateEmailAddressInput(email){
    return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)
  }

  function onSubmit(evt) {
    evt.preventDefault()
    const payload = {
      "x": getXY(index)[0],
      "y": getXY(index)[1],
      "steps": steps,
      "email": email
    }
    if (validateEmailAddressInput((email))){
      axios.post(apiEnd, payload)
      .then(res=> setMessage(res.data.message))
      .catch(err => setMessage(err.response.data.message))
      .finally(resetEmail())
    }
    else {
      if (!email.length){
        setMessage('Ouch: email is required')
      }
      else {
        setMessage('Ouch: email must be a valid email')
      }
    }
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates" data-testid="coordinates">{getXYMessage()}</h3>
        <h3 id="steps">{getStepsMessage()}</h3>
      </div>
      <div id="grid">
        {
          [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
            <div key={idx} className={`square${idx === index ? ' active' : ''}`}>
              {idx === index ? 'B' : null}
            </div>
          ))
        }
      </div>
      <div className="info">
        <h3 id="message">{message}</h3>
      </div>
      <div id="keypad">
        <button id="left" data-testid="left" onClick={(e) => move(e)}>LEFT</button>
        <button id="up" data-testid="up" onClick={(e) => move(e)}>UP</button>
        <button id="right" data-testid="right" onClick={(e) => move(e)}>RIGHT</button>
        <button id="down" data-testid="down" onClick={(e) => move(e)}>DOWN</button>
        <button id="reset" data-testid="reset" onClick={() => reset()}>reset</button>
      </div>
      <form onSubmit={(e) => onSubmit(e)}>
        <input id="email" data-testid="email" type="email" placeholder="type email" value={email} onChange={onChange}></input>
        <input id="submit" type="submit"></input>
      </form>
    </div>
  )
}
