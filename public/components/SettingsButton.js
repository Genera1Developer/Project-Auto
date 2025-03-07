import React, { useState, useCallback } from 'react';
import SettingsModal from './SettingsModal';
import './SettingsButton.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';

function SettingsButton() {
    const [showSettings, setShowSettings] = useState(false);

    const toggleSettings = useCallback(() => {
        setShowSettings(prevShowSettings => !prevShowSettings);
    }, []);

    return (
        <>
            <button className="settings-button" onClick={toggleSettings}>
                <FontAwesomeIcon icon={faCog} className="settings-icon" />
                Settings
            </button>
            {showSettings && <SettingsModal onClose={toggleSettings} /> }
        </>
    );
}

export default SettingsButton;