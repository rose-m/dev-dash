import {CircleFailingBuilds} from "../integrations/circleci/components";
import React, {useContext} from "react";
import {Global} from "../global";

import './Dashboard.css';

export function Dashboard(): React.ReactElement {
    const global = useContext(Global);

    const statusIcon = <span className={'app-dashboard__status'}>{getStatusIcon()}</span>;

    return (
        <div className={'app-dashboard'}>
            <header className={`app-dashboard__header ${global.getStatus()}`}>
                <h1>
                    {statusIcon}
                    Developer Dashboard
                    {statusIcon}
                </h1>
            </header>

            <div className={'app-dashboard__integrations'}>
                <CircleFailingBuilds username={'collaborationFactory'}
                                     project={'cplace'}/>
            </div>
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
