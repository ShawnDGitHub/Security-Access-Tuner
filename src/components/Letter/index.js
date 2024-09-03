export default function Letter ({ content, className='' }) {
    const letters = content.split('')
      .map((letter, index) => <span 
        key={index}
        className={className}>{letter}
      </span>)
    return letters
}