import React, { useCallback, useEffect, useState } from 'react'

import DefaultModal from '../DefaultModal';
import ExplainModal from '../ExplainModal';

const ModalContext = React.createContext();

const Modal = ({ modal, unSetModal }) => {
  useEffect(() => {
    const bind = e => {
      if (e.keyCode !== 27) {
        return
      }

      if (document.activeElement && ['INPUT', 'SELECT'].includes(document.activeElement.tagName)) {
        return
      }

      unSetModal()
    }

    document.addEventListener('keyup', bind)
    return () => document.removeEventListener('keyup', bind)
  }, [modal, unSetModal])





  return (
    <div className="modal">
      <button className="modal__close" onClick={unSetModal} />
      <div className="modal__inner">
        <button className="modal__close-btn" onClick={unSetModal}>
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 3L33 33M33 3L3 33" stroke="white" strokeWidth="5" strokeLinecap="round"/>
          </svg>
        </button>
        {(() => {

            switch (modal.type) {
              case 'explain':
                return <ExplainModal data={modal}/>;
                break;
              default:
                return <DefaultModal data={modal}/>;
            }
          })()}

      </div>
    </div>
  )
}



const ModalProvider = props => {
  const [modal, setModal] = useState()
  const unSetModal = useCallback(() => {
    setModal()
  }, [setModal])

  return (
    <ModalContext.Provider value={{ unSetModal, setModal }} {...props} >
      {props.children}
      {modal && <Modal modal={modal} unSetModal={unSetModal} />}
    </ModalContext.Provider>
  )
}

const useModal = () => {
  const context = React.useContext(ModalContext)
  if (context === undefined) {
    throw new Error('useModal must be used within a UserProvider')
  }

  return context
}

export { ModalProvider, useModal }
