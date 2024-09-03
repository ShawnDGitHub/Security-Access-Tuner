import classNames from 'classnames'

export default function StateHover ({ hoverState, hoverText, hoverCaption }) {
    return (
      <div className={classNames(
        'Accessor-state-hover',
        hoverState && 'show'
      )}>
        <div className='Accessor-state-container'>
          <div className='Accessor-state-title'>{hoverText}</div>
          <div className='Accessor-state-caption'>{ hoverCaption }</div>
        </div>
      </div>
    )
  }