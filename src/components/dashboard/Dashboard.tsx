import {CircleFailingBuilds} from "../../integrations/circleci/components";
import React, {useContext, useEffect, useState} from "react";
import {Global} from "../../global";

import './Dashboard.css';
import {Config} from "..";

export function Dashboard(): React.ReactElement {
    const global = useContext(Global);
    const [showConfig, setShowConfig] = useState(false);
    const [repos, setRepos] = useState<any[]>(() => {
        const data = localStorage.getItem('v1.config.repos');
        return !!data ? JSON.parse(data) : [];
    });

    useEffect(() => {
        localStorage.setItem('v1.config.repos', !!repos ? JSON.stringify(repos) : '');
    }, [repos]);

    const statusIcon = <span className={'app-dashboard__status'}>{getStatusIcon()}</span>;
    return (
        <div className={'app-dashboard'}>
            {showConfig && (
                <Config repositories={JSON.stringify(repos)}
                        onClose={() => setShowConfig(false)}
                        onUpdateToken={(t) => ({})}
                        onUpdateRepositories={r => setRepos(r)}
                />
            )}

            <header className={`app-dashboard__header ${global.getStatus()}`}>
                <h1>
                    {statusIcon}
                    Developer Dashboard
                    {statusIcon}
                </h1>
            </header>

            <div className={'app-dashboard__integrations'}>
                {repos.map(r => (
                    <CircleFailingBuilds key={`${r.username}-${r.project}`}
                                         username={r.username}
                                         project={r.project}
                                         matcher={r.matcher}/>
                ))}
            </div>

            <footer className={'app-dashboard__footer'}>
                <button onClick={() => setShowConfig(true)}>
                    ⚙️ Configure
                </button>
            </footer>
        </div>
    );

    function getStatusIcon() {
        switch (global.getStatus()) {
            case "success":
                return "✅";
            case "warning":
                return "⚠️";
            case "error":
            default:
                return "🚨";
        }
    }
}
