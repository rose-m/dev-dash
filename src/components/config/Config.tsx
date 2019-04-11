import * as React from "react";
import {useState} from "react";

import './Config.css';

export interface ConfigProps {
    repositories: string;

    onClose(): void;

    onUpdateToken(token: string): void;

    onUpdateRepositories(repos: any[]): void;
}

export function Config(props: ConfigProps): React.ReactElement {
    const [reposInvalid, setReposInvalid] = useState(false);
    const [repos, setRepos] = useState(props.repositories);

    return (
        <div className={'dashboard-config'}>
            <h3>
                Configuration
                <span className={'dashboard-config__close'} onClick={props.onClose}>&times;</span>
            </h3>

            <hr/>

            <label>
                <p>
                    <b>CircleCI Token</b>&nbsp;
                    <small>(not shown - updated on blur)</small>
                </p>
                <input type={'text'} onBlur={(e) => props.onUpdateToken(e.target.value)}/>
            </label>

            <label>
                <p>
                    <b>Repositories</b>&nbsp;
                    <small>(paste JSON array - updated on blur)</small>
                </p>

                {reposInvalid && (
                    <p className={'alert alert-error'}>
                        Repositories field is not a valid JSON array.
                    </p>
                )}

                <textarea rows={10} value={repos}
                          onBlur={(e) => updateRepos(e.target.value)}
                          onChange={e => setRepos(e.target.value)}/>
            </label>
        </div>
    );

    function updateRepos(value: string) {
        try {
            const parsed = !!value ? JSON.parse(value) : '';
            props.onUpdateRepositories(parsed);
            setReposInvalid(false);
        } catch (e) {
            setReposInvalid(true);
        }
    }
}
