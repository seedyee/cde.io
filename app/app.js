import 'babel-polyfill'

import React from 'react'
import ReactDOM from 'react-dom'

import Header from './components/header'

import styles from './app.css'

ReactDOM.render(
  <div className={styles.myBgColor}>Hello World</div>,
  document.querySelector('#app'))
