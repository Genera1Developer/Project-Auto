import React, { useState, useCallback } from 'react';
import Settings from './Settings';
import './SettingsButton.css';

function SettingsButton() {
    const [showSettings, setShowSettings] = useState(false);

    const toggleSettings = useCallback(() => {
        setShowSettings((prevShowSettings) => !prevShowSettings);
    }, []);

    return (
        <div className="settings-button-container">
            <button className="settings-button" onClick={toggleSettings}>
                {showSettings ? 'Hide Settings' : 'Show Settings'}
            </button>
            {showSettings && <Settings />}
        </div>
    );
}

export default SettingsButton;