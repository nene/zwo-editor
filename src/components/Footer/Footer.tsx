import React from "react";
import { GITHUB_URL } from "../../const";
import "./Footer.css";

export default function Footer() {
  return (
    <div className="footer">
      <ul>
        <li>
          Zwift Workout v1.7 (
          <a href={`${GITHUB_URL}/blob/master/LICENSE.md`} target="blank">
            open source / MIT license
          </a>
          )
        </li>
        <li>
          <a href={`${GITHUB_URL}/issues`} target="blank">
            Report an issue
          </a>
        </li>
      </ul>
    </div>
  );
}
