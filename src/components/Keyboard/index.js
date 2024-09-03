import classNames from 'classnames'

export default function Keyboard ({
    passwordBlocks,
    currentKey,
    passwordBlockRef,
    handlePasswordBlockClick,
    handlePasswordBlockKeyboard
  }) {
    return (
      <div 
      ref={passwordBlockRef}
      className="Password-area" 
      tabIndex="0"
      onClick={handlePasswordBlockClick}
      onKeyDown={handlePasswordBlockKeyboard}>
        {
          passwordBlocks.split('').map(block => {
            return (
              <div key={block}
                className={classNames(
                  'Password-block',
                  currentKey === block && 'active',
                  currentKey === 'Backspace'
                    && block === '<' && 'active',
                  block === '9' && 'Nine',
                  block === '0' && 'Zero'
                )} 
                data-tag={block}>
                  {block}
              </div>
            )
          })
        }
      </div>
    )
  }