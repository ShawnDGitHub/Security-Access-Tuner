import { useEffect, useState, useRef } from 'react'
import Letter from './components/Letter';
import Keyboard from './components/Keyboard';
import StateHover from './components/StateHover';
import './App.css';

function Device () {
  const [verifyState, setVerifyState] = useState(false)
  const limitTime = 5 // set how many second for timer, within seconds
  const serverCode = '1024' // set your code
  const passwordBlockRef = useRef(null) // keyboard reference
  const passwordBlocks = '12345678<09'// number keyboard key
  const [code, setCode] = useState('____')
  const [codePointer, setCodePointer] = useState(0)
  const [currentKey, setCurrentKey] = useState('10')
  const [second, setSecond] = useState(limitTime)
  const [millisecond, setMillisecond] = useState(60)
  const [hoverState, setHoverState] = useState(false)
  const [timeoutFlag, setTimeoutFlag] = useState(false)
  // StateHover component title
  const [hoverText, setHoverText] = useState('Code accepted')

  useEffect(() => {
    // state: boolean
    // false: timeout, true: can check code now
    function checkCode (state) {
      if (!state) {
        setHoverText('Timeout')
        // change the :root element --sys-color-state-hover in css
        document.documentElement.style
          .setProperty('--sys-color-state-hover', '#2a2a2a');
        setTimeoutFlag(true)
        setHoverState(true) // let StateHover component show
        setVerifyState(true)
        document.documentElement.style
          .setProperty('--sys-color-indicate', 'transparent');
        setTimeout(() => {
          document.documentElement.style
            .setProperty('--sys-color-indicate', '#02c820');
          setHoverState(false)
          setTimeoutFlag(false)
        }, 1000) // display StateHover
        setCode('____') // clear code display
        setCodePointer(0) // clear next input palce to start
        setCurrentKey('10') // display the highlight key
        return 
      }
      if (code === serverCode) {
        setHoverText('Code accepted')
        document.documentElement.style
          .setProperty('--sys-color-state-hover', '#02c820');
        setVerifyState(true)
        setSecond(limitTime) // reset timer
        setMillisecond(60) // same as above line
        // TODO:do something like page transition
      }
      else {
        setHoverText('Code not accepted')
        document.documentElement.style
          .setProperty('--sys-color-state-hover', 'rgb(196, 196, 196)');
        setSecond(limitTime)
        setMillisecond(60)
      }
      setCurrentKey('10')
      setHoverState(true)
      setTimeout(() => setHoverState(false), 1000)
      document.documentElement.style
        .setProperty('--sys-color-indicate', '#02c820');
    }
    // do not place other setTimeout or setInterval in useEffect,
    // because every 10 millisecond the whole useEffect will execute
    function setTimer () {
      setTimeout(() => {
        if ((second / limitTime) < 0.4) {
          document.documentElement.style
            .setProperty('--sys-color-indicate', '#e4c80c');
        }
        if (millisecond === 1) {
          if (second === 0) {
            checkCode(false) // timeout
            setSecond(limitTime) // reset
          }
          else setSecond(second - 1) // discount
          setMillisecond(60)
        }
        else setMillisecond(millisecond - 1)
      }, 10)
    }
    // make keyboard event available
    passwordBlockRef.current.focus()
    // if not verify not passed, continue the countdown
    if (!verifyState) setTimer()
    else setCurrentKey('10') // else should clear keyboard highlight

    // QUESTION: should I get serverCode here?

    // if code length is 4, start to check
    if (codePointer === 4) checkCode(true)
  }, [code, codePointer, second, millisecond, verifyState])


  function inputPassword (input) {
    if (codePointer === 4) return // Verifying, do not  accept input
    const key = parseInt(input) // transform string to int
    const inputCode = code.split('') // divide string letters to array

    if (!isNaN(key)) { // is number
      inputCode[codePointer] = input
      setCode(inputCode.join('')) // make array to string and set display code
      if (codePointer === 3) { // start verifying
        setCodePointer(codePointer + 1) // system is verifying
        setTimeout(() => { // reset
          setCode("____")
          setCodePointer(0)
        }, 700)
        return
      }
      setCodePointer(codePointer + 1) // move input to next place   
    } else return
  }
  function deletPassword () {
    if (codePointer === 0) return
    const currentCodeArr = code.split('')
    currentCodeArr[codePointer - 1] = '_'
    const newCode = currentCodeArr.join('')
    setCodePointer(codePointer - 1)
    setCode(newCode)
  }

  const handlePasswordBlockClick = ({ target }) => {
    setVerifyState(false) // display the keyboard highlight
    if (target.dataset.tag === '<') deletPassword()
    else inputPassword(target.dataset.tag)
  }
  const handlePasswordBlockKeyboard = ({ key }) => {
    setVerifyState(false)
    if (key === 'Backspace') deletPassword()
    else inputPassword(key)
    setCurrentKey(key)
    setTimeout(() => setCurrentKey('10'), 300)
  }

  return (
    <div className="Device-border">
      {/* TODO:should have indicator outside */}
      <div className='Signal-indicator'></div>
      <div className="Accessor-container none-select">
        <StateHover
          hoverState={hoverState}
          hoverText={hoverText}
          hoverCaption='System information'
          timeoutFlag={timeoutFlag}
        />

        <div className="group">
          <div className="Callback-code">
            <div className="Callback-code-title">
              <Letter content="CALLBACK  CODE" />
            </div>
            <div className="Callback-code-content">
              <Letter content={code} className='Single-code'/>
            </div>
          </div>
          <div className="Progress-bar">
            <div 
              className="Progress-bar-indicator"
              style={{width: `${(second / limitTime) * 100}%`}}
            ></div>
          </div>
          <div className="Timer">
            {
              verifyState
              ? 'Press key to verify'
                : `00:${second > 9 ? '' : 0}${second}:${millisecond > 9 ? '' : 0}${millisecond}`
            }
          </div>
        </div>

        <Keyboard
          passwordBlockRef={passwordBlockRef}
          passwordBlocks={passwordBlocks}
          currentKey={currentKey}
          handlePasswordBlockClick={handlePasswordBlockClick}
          handlePasswordBlockKeyboard={handlePasswordBlockKeyboard}
        />
      </div>
    </div>
  );
}

export default Device;
