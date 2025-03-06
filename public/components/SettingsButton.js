import React, { useState, useCallback } from 'react';
import Settings from './Settings';

function SettingsButton() {
    const [showSettings, setShowSettings] = useState(false);

    const toggleSettings = useCallback(() => {
        setShowSettings(prevShowSettings => !prevShowSettings);
    }, []);

    return (
        <div>
            <button onClick={toggleSettings}>
                {showSettings ? 'Hide Settings' : 'Show Settings'}
            </button>
            {showSettings && <Settings />}
        </div>
    );
}

export default SettingsButton;