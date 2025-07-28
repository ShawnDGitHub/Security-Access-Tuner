import { memo } from 'react'
import classNames from 'classnames'
import Loading from '../Loading'

const StateHoverComponent = memo(function StateHover ({
    state: hoverState,
    text: hoverText,
    timeout: timeoutFlag,
    hoverCaption
  }) {
    return (
      <div className={classNames(
        'Accessor-state-hover',
        hoverState && 'show'
      )}>
        {
          timeoutFlag
          ? <Loading loadingText="Resetting..." />
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
)
export default StateHoverComponent