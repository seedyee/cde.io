import 'babel-polyfill'

import React from 'react'
import ReactDOM from 'react-dom'

import styles from './app.css'
import Header from './components/header'

ReactDOM.render(
  <div className={styles.myBgColor}><Header /></div>,
  document.querySelector('#app'))
