import React, { useState } from 'react'
import SettingsPopup from './SettingsPopup';

const SettingsButton = ( {onNameUpdate} ) => {
  const [isOpen, setIsOpen] = useState(false);

  const onOpen = () => {
    setIsOpen(true);
  }
 
  const onClose = () => {
    setIsOpen(false)
  }

  return (
    <>
    <button className='block w-full text-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100' onClick={onOpen}>
        Settings
    </button>
    {
      isOpen && (
        <SettingsPopup onClose={onClose} onNameUpdate={onNameUpdate}></SettingsPopup>
      )
    }
    </>
  )
}

export default SettingsButton