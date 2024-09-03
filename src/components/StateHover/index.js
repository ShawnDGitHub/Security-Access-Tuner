import classNames from 'classnames'
import Loading from '../Loading'

export default function StateHover ({ hoverState, hoverText,
  hoverCaption, timeoutFlag = false }) {

  return (
    <div className={classNames(
      'Accessor-state-hover',
      hoverState && 'show'
    )}>
      {
        timeoutFlag
        ? <Loading loadingText="Reseting..." />
          : (
            <div className='Accessor-state-container'>
              <div className={
                classNames(
                  'Accessor-state-title',
                  hoverText === 'Code not accepted' && 'Not-accepted'
                )
              }>{hoverText}</div>
              <div className='Accessor-state-caption'>{ hoverCaption }</div>
            </div>
          )      
      }
      

    </div>
  )
}