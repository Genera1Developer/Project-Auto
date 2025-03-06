import React, { useState } from 'react';
import Settings from './Settings';

function SettingsButton() {
    const [showSettings, setShowSettings] = useState(false);

    const toggleSettings = () => {
        setShowSettings(!showSettings);
    };

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