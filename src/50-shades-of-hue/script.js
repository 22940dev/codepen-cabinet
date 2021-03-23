import React, { useRef, useState } from 'https://cdn.skypack.dev/react'
import T from 'https://cdn.skypack.dev/prop-types'
import { render } from 'https://cdn.skypack.dev/react-dom'
import { Range } from 'https://cdn.skypack.dev/react-range'

const { Prism } = window

const ROOT_NODE = document.querySelector('#app')

const getCode = (hue, saturation, lightness, shades) => {
  const LIGHT_STEP = (lightness[1] - lightness[0]) / shades
  const SAT_STEP = (saturation[1] - saturation[0]) / shades
  let RESULT = `:root {\n`
  for (let s = 0; s < shades + 1; s++) {
    const LIGHTNESS = Math.floor(lightness[1] - s * LIGHT_STEP)
    const SATURATION = Math.floor(saturation[1] - s * SAT_STEP)
    RESULT += `  --shade-${s +
      1}: hsl(${hue}, ${SATURATION}%, ${LIGHTNESS}%);\n`
  }
  return (RESULT += '}')
}

const Slider = ({ min = 0, max, values, onChange }) => (
  <Range
    step={1}
    min={min}
    max={max}
    values={values}
    onChange={onChange}
    renderTrack={({ props, children }) => (
      <div
        {...props}
        className="slider-track"
        style={{
          ...props.style,
        }}>
        {children}
      </div>
    )}
    renderThumb={({ props }) => (
      <div
        {...props}
        className="slider-thumb"
        style={{
          ...props.style,
          borderRadius: '50%',
          outline: 'transparent',
          height: '44px',
          width: '44px',
        }}
      />
    )}
  />
)
Slider.propTypes = {
  style: T.object,
  min: T.number,
  max: T.number,
  values: T.Array,
  onChange: T.func,
}

const getCodeMarkup = code => {
  return Prism.highlight(code, Prism.languages.css, 'css')
}

const App = () => {
  const [hue, setHue] = useState([Math.floor(Math.random() * 360)])
  const [saturation, setSaturation] = useState([0, 100])
  const [lightness, setLightness] = useState([0, 100])
  const [shades, setShades] = useState([7])
  const styleRef = useRef(getCode(hue[0], saturation, lightness, shades[0]))
  const cssRef = useRef(getCodeMarkup(styleRef.current))

  return (
    <div
      className="scene"
      style={{
        '--hue': hue[0],
      }}>
      <div className="result">
        <pre>
          <code
            className="language-css"
            dangerouslySetInnerHTML={{ __html: cssRef.current }}
          />
        </pre>
        <div
          className="palette"
          style={{
            '--shades': shades[0],
          }}>
          {new Array(shades[0] + 1).fill().map((shade, index) => (
            <div
              key={index}
              className="palette__shade"
              style={{
                '--shade': `var(--shade-${index + 1})`,
              }}></div>
          ))}
        </div>
      </div>
      <style dangerouslySetInnerHTML={{ __html: styleRef.current }} />
      <div className="controls">
        <label>Hue</label>
        <Slider
          max={360}
          values={hue}
          onChange={values => {
            styleRef.current = getCode(
              values[0],
              saturation,
              lightness,
              shades[0]
            )
            cssRef.current = getCodeMarkup(styleRef.current)
            setHue(values)
          }}
        />
        <label>Saturation</label>
        <Slider
          max={100}
          values={saturation}
          onChange={values => {
            styleRef.current = getCode(hue[0], values, lightness, shades[0])
            cssRef.current = getCodeMarkup(styleRef.current)
            setSaturation(values)
          }}
        />
        <label>Lightness</label>
        <Slider
          max={100}
          values={lightness}
          onChange={values => {
            styleRef.current = getCode(hue[0], saturation, values, shades[0])
            cssRef.current = getCodeMarkup(styleRef.current)
            setLightness(values)
          }}
        />
        <label>Steps</label>
        <Slider
          min={2}
          max={50}
          values={shades}
          onChange={values => {
            styleRef.current = getCode(hue[0], saturation, lightness, values[0])
            cssRef.current = getCodeMarkup(styleRef.current)
            setShades(values)
          }}
        />
      </div>
    </div>
  )
}

render(<App />, ROOT_NODE)
