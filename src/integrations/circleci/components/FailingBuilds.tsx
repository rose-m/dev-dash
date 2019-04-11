import * as React from "react";
import {useContext, useEffect, useState} from "react";
import {Circle} from "../context";
import {BuildDetails} from "../api";

export interface CircleFailingBuildsProps {
    username: string;
    project: string;
}

export function CircleFailingBuilds(props: CircleFailingBuildsProps): React.ReactElement {
    const api = useContext(Circle);
    const [builds, setBuilds] = useState<BuildDetails[]>([]);

    useEffect(() => {
        fetchData();
    }, [api]);

    return (
        <div>
            <h1>Failing Builds for {props.username}/{props.project}</h1>

            {builds.length > 0 ? (
                <ul>
                    {builds.map(b => (
                        <li key={b.build_url}>
                            #{b.build_num}
                            <a href={b.build_url} target={'_blank'}>{b.branch}</a>
                            by {b.committer_name}:
                            <b>{b.status}</b>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No builds...</p>
            )}
        </div>
    );

    async function fetchData() {
        try {
            const result = await api.getProjectBuilds(props.username, props.project);
            setBuilds(result);
        } catch (e) {
            console.error('failed to get CircleAPI data', e);
        }
    }
}
