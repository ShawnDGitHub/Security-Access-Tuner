import {
  useEffect,
  useState,
  useRef,
  useCallback,
  useReducer
} from 'react'
import Letter from './components/Letter';
import Keyboard from './components/Keyboard';
import StateHover from './components/StateHover';
import './App.css';

function Device () {
  const limitTime = 5 // Set how many seconds for timer, within seconds
  const serverCode = '1024' // Set your check code
  const passwordBlockRef = useRef(null) // Keyboard reference
  const passwordBlocks = '12345678<09'// Number keyboard keys
  /** This means whether the program has verified the code
   * If true, the timer will stop
   * If changed to false, the timer will start
   */  
  const [verifyState, setVerifyState] = useState(false)
  const [code, setCode] = useState('____') // Display code
  const [codePointer, setCodePointer] = useState(0) // Value 4 means 
  const [currentKey, setCurrentKey] = useState('10') // Highlight key
  const [second, setSecond] = useState(limitTime)
  const [millisecond, setMillisecond] = useState(0)
  const timerId = useRef(null)

  // Reducer
  const initialState = {
    state: false,
    text: 'Code accepted',
    tk_indicator: '#02c820',
    tk_state_hover: '#02c820',
    timeoutFlag: false,
  }
  const [HoverState, dispatch] = useReducer(
    stateHoverReducer,
    initialState
  )
  function stateHoverReducer (state, action) {
    switch (action.type) {
      case 'SET_HOVER_STATE':
        return {
          ...state,
          state: action.state,
          text: action.text,
          tk_state_hover: action.tk_state_hover,
          tk_indicator: action.tk_indicator,
          timeoutFlag: false
        }
      default:
        return state
    }
  }
  // Change the :root element Color token in css
  function setRootToken (name, value) {
    document.documentElement.style
      .setProperty(`--sys-color-${name}`, value)
  }
  function checkCode (code) {
    if (code === serverCode) {
      dispatch({
        type: 'SET_HOVER_STATE',
        text: 'Code accepted',
        state: true,
        tk_state_hover: '#02c820',
        tk_indicator: '#02c820'
      })
      setVerifyState(true)
    } else {
      dispatch({
        type: 'SET_HOVER_STATE',
        text: 'Code not accepted',
        state: true,
        tk_state_hover: 'rgb(196, 196, 196)',
        tk_indicator: '#02c820'
      })
      setVerifyState(true)
    }
    
    setSecond(limitTime)
    setMillisecond(60)

    setTimeout(
      () => dispatch({
        type: 'SET_HOVER_STATE',
        ...HoverState,
        state: false
      }), 
      1000
    )
  }
  function inputPassword (input) {
    if (codePointer === 4) return // Verifying, do not  accept input
    const key = parseInt(input) // transform string to int
    const inputCode = code.split('') // divide string letters to array

    if (!isNaN(key)) { // is number
      inputCode[codePointer] = input
      const newCode = inputCode.join('')
      setCode(newCode)

      if (codePointer === 3) { // start verifying
        checkCode(newCode)

        setTimeout(() => { // reset
          setCode("____")
          setCodePointer(0)
        }, 700)
      }

      setCodePointer(codePointer + 1) // move input to next place   
    } else return
  }
  function deletePassword () {
    if (codePointer === 0) return
    const currentCodeArr = code.split('')
    currentCodeArr[codePointer - 1] = '_'
    const newCode = currentCodeArr.join('')
    setCodePointer(codePointer - 1)
    setCode(newCode)
  }
  const handlePasswordBlockClick = ({ target }) => {
    // when countdown stopped, this can trigger verification
    if (verifyState) setVerifyState(false)
    if (target.dataset.tag === '<') deletePassword()
    else inputPassword(target.dataset.tag)
  }
  const handlePasswordBlockKeyboard = ({ key }) => {
    if (verifyState) setVerifyState(false)
    if (key === 'Backspace') deletePassword()
    else inputPassword(key)
    setCurrentKey(key)
    setTimeout(() => setCurrentKey('10'), 400)
  }
  const handleTimeout = useCallback(
    () =>  {
      console.log('Timeout reached, resetting code and state')
      dispatch({
        type: 'SET_HOVER_STATE',
        text: 'Timeout',
        state: true,
        tk_state_hover: '#2a2a2a',
        tk_indicator: 'transparent',
        timeoutFlag: true
      })

      setCode('____') // clear code display
      setCodePointer(0) // reset code pointer

      setVerifyState(true) // avoid keeping verifying

      setTimeout(() => {
        dispatch({
          type: 'SET_HOVER_STATE',
          text: 'Code accepted',
          state: false,
          tk_state_hover: '#02c820',
          tk_indicator: '#02c820',
          timeoutFlag: false
        })
        setSecond(limitTime)
        setMillisecond(60)
      }, 1000)
    }, []
  )
  useEffect(() => {
      setRootToken('state-hover', HoverState.tk_state_hover)
      setRootToken('indicate', HoverState.tk_indicator)
  }, [
    HoverState.tk_state_hover,
    HoverState.tk_indicator
  ])
  useEffect(() => {
    const passwordBlockRefBackup = passwordBlockRef.current
    const handleKeyDown = (e) => {
      e.preventDefault()
      passwordBlockRefBackup && passwordBlockRefBackup.focus()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])
  // Main logic
  useEffect(() => {
    console.log('The useEffect: verifyState')
    if (verifyState) {
      console.log('Verification in progress, stopping timer')      
      if (timerId.current) clearTimeout(timerId.current)
      setCurrentKey('10')
      return
    }

    let startTime = Date.now() // Start time in milliseconds
    let totalCountdownTime = limitTime * 1000 // Whole countdown time in milliseconds

    const updateTimer = () => {
      const elapsed = Date.now() - startTime // Time has passed since start
      const remainingTime = totalCountdownTime - elapsed // Rest time in milliseconds

      if (remainingTime <= 10) {
        handleTimeout()
        if (timerId.current) clearTimeout(timerId.current)
        return
      }

      const currentSeconds = Math.floor(remainingTime / 1000)
      // Calculate milliseconds, display 2 digits
      const currentMilliseconds = Math.floor((remainingTime % 1000) / 10)

      setSecond(currentSeconds)
      setMillisecond(currentMilliseconds)

      if (remainingTime < totalCountdownTime * 0.4) {
        setRootToken('indicate', '#e4c80c')
      }
      // Keep updating every 10 milliseconds, this is better than interval
      timerId.current = setTimeout(updateTimer, 10)
    }

    // Start point
    if (!verifyState) {
      console.log('First start')
      updateTimer()
    } else {
      console.log('The process has ended')
      setCurrentKey('10')
    }
  }, [
    verifyState,
    handleTimeout
  ])
  
  return (
    <div className="Device-border">
      <div className='Signal-indicator'></div>
      <div className="Accessor-container none-select">
        <StateHover
          state={HoverState.state}
          text={HoverState.text}
          timeout={HoverState.timeoutFlag}
          hoverCaption='System information'
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
  )
  
}

export default Device
