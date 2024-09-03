import { useEffect, useState } from 'react'
import classNames from 'classnames'
import './index.css'

export default function Loading ({ loadingText }) {
    // state
    const [ticker, setTicker] = useState(0)
    // param
    const blocks = []
    let vertical = []
    let horizontal = []
    let leftSlash = []
    let rightSlash = []
    // compute blocks
    const computeBlocks = (number, increment = 7, time = 13) => {
        const blockList = []
        for (let i = 0; i < time; i++) {
        blockList.push(number)
        number += increment
        }
        return blockList
    }
    leftSlash = computeBlocks(1, 14, 13) // \
    rightSlash = computeBlocks(13, 12, 13) // /
    horizontal = computeBlocks(79, 1, 13) // - 
    vertical = computeBlocks(7, 13, 13) // |
    // set blocks
    for (let i = 1; i < 169 + 1; i++) blocks.push(i)

    useEffect(() => {
      const callback = () => {
          if (ticker === 7) setTicker(0)
          else setTicker(ticker + 1)
      }
      let id = setInterval(callback, 50)
      return () => clearInterval(id)
    }, [ticker]);

    return (
        <div className='Loading-container'>
        <div className='Loading-ticker'>
        {
            blocks.map(block =>
            <div
                className={classNames(
                    'Loading-block',
                    leftSlash.slice(0, 7).includes(block) && ticker === 0 && 'Top-left',
                    vertical.slice(0, 7).includes(block)
                    && ticker === 1 && 'Top',
                    rightSlash.slice(0, 7).includes(block)
                    && ticker === 2 && 'Top-right',
                    horizontal.slice(6).includes(block)
                    && ticker === 3 && 'Right',
                    leftSlash.slice(6).includes(block)
                    && ticker === 4 && 'Bottom-right',
                    vertical.slice(6).includes(block)
                    && ticker === 5 && 'Bottom',
                    rightSlash.slice(6).includes(block)
                    && ticker === 6 && 'Bottom-left',
                    horizontal.slice(0, 7).includes(block)
                    && ticker === 7 && 'Left',
                )}
                key={block}>
                {block}
            </div>)
        }
        </div>
        <div className='Loading-text'>{loadingText}</div>
        </div>
  )
}