import React, {useState} from 'react'
import './Footer.css'
import Privacy from '../Privacy/Privacy'
import Popup from '../Popup/Popup'

export default function Footer() {
  const [showPrivacy, setShowPrivacy] = useState(false)

  return (
    <div className="footer">
      <ul>
        <li>Zwift Workout v1.7 &copy; 2020 Sharpify Ltd All Rights Reserved</li>
        <li><a href="#privacy" onClick={() => setShowPrivacy(true)}>Privacy Policy</a></li>
        <li><a href="https://github.com/breiko83/zwo-editor/issues" target="blank">Report an issue</a></li>        
      </ul>
       
      {showPrivacy &&
        <Popup width="50%" height="50%" dismiss={() => setShowPrivacy(false)}>
          <Privacy />
        </Popup>
      }
    </div>
  )
}