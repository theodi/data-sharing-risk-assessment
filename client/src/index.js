import React from 'react'
import ReactDOM from 'react-dom'

import './assets/scss/app.scss'; // Tell webpack that Button.js uses these styles

import App from './App'
import store from './store'
import { Provider } from 'react-redux'
import { ModalProvider } from './context/modal-context'


ReactDOM.render(
    <Provider store={store}>
      <ModalProvider>

        <App />
      </ModalProvider>

    </Provider>,
  document.getElementById('root')
)
