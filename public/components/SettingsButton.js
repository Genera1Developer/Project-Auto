import React, { useState, useCallback } from 'react';
import Settings from './Settings';
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
            {showSettings && <Settings />}
        </>
    );
}

export default SettingsButton;