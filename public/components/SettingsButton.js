import React, { useState, useCallback } from 'react';
import Settings from './Settings'; //DOES NOT EXIST, USE SOMETHING ELSE
import './SettingsButton.css'; //DOES NOT EXIST, USE SOMETHING ELSE
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
