import React from 'react'
import './Footer.css'

export default function Footer() {
  return (
    <div className="footer">
      <ul>
        <li>
          Zwift Workout v1.7
          (<a href="https://github.com/breiko83/zwo-editor/blob/master/LICENSE.md" target="blank">open source / MIT license</a>)
        </li>
        <li><a href="https://github.com/breiko83/zwo-editor/issues" target="blank">Report an issue</a></li>
      </ul>
    </div>
  )
}