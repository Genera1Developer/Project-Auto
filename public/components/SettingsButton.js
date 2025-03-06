import React, { useState, useCallback } from 'react';
import Settings from './Settings';

function SettingsButton() {
    const [showSettings, setShowSettings] = useState(false);

    const toggleSettings = useCallback(() => {
        setShowSettings((prevShowSettings) => !prevShowSettings);
    }, []);

    return (
        <>
            <button onClick={toggleSettings}>
                {showSettings ? 'Hide Settings' : 'Show Settings'}
            </button>
            {showSettings && <Settings />}
        </>
    );
}

export default SettingsButton;