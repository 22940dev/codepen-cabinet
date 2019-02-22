const { React, ReactDOM } = window
const { useEffect, useState, Fragment } = React
const { render } = ReactDOM
const rootNode = document.getElementById('app')

const colors = {
  Sea: '#a2ccb6',
  Sand: '#fceeb5',
  Peach: '#ee786e',
}

const App = () => {
  const [color, setColor] = useState(colors.Sea)
  const [count, setCount] = useState(0)
  // Only run when color is updated 👍
  useEffect(
    () => {
      // Color changed!
      document.body.style.background = color
    },
    [color]
  )
  return (
    <Fragment>
      <select value={color} onChange={e => setColor(e.target.value)}>
        {Object.entries(colors).map(c => (
          <option key={`color--${c[0]}`} value={c[1]}>
            {c[0]}
          </option>
        ))}
      </select>
      <h1>{color}</h1>
      <h1>{`Count: ${count}`}</h1>
      <button onClick={() => setCount(count + 1)}>Increment Count</button>
    </Fragment>
  )
}
render(<App />, rootNode)
