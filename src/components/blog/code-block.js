import React from 'react'
import Highlight, { defaultProps } from 'prism-react-renderer'
import nightOwl from 'prism-react-renderer/themes/nightOwl'
import styles from './code-block.module.scss'

const rangeRegex = /{((\d|\d-\d)(?:,(\d|\d-\d))*)}/

const linesToHighlight = meta => {
  const match = rangeRegex.exec(meta)
  if (!match) {
    return () => false
  }
  const lines = match[1]
    .split(',')
    .map(n => n.split('-').map(n => parseInt(n, 10) - 1))

  return index =>
    lines.some(([start, end]) =>
      end ? index >= start && index <= end : index === start
    )
}

export default function CodeBlock({ children, className, metastring }) {
  const language = className.replace(/language-/, '') || ''
  const highlight = linesToHighlight(metastring)

  return (
    <Highlight
      {...defaultProps}
      code={children}
      language={language}
      theme={nightOwl}>
      {({ style, tokens, getLineProps, getTokenProps }) => (
        <pre className={styles.pre} style={{ ...style }}>
          {tokens.map((line, index) => {
            const lineProps = getLineProps({ line, key: index })
            // Ensure blank lines/spaces drop onto a new line
            if (index === tokens.length - 1 && !line.content) {
              return null
            }
            // Highlight the line
            if (highlight(index)) {
              lineProps.className += ' ' + styles.highlightLine
            }
            return (
              <div key={index} {...lineProps}>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token, key })} />
                ))}
              </div>
            )
          })}
        </pre>
      )}
    </Highlight>
  )
}
