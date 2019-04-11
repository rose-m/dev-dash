import * as React from "react";
import {useContext, useEffect, useState} from "react";
import {Circle} from "../context";
import {BuildDetails} from "../api";

import './FailingBuilds.css';

export interface CircleFailingBuildsProps {
    username: string;
    project: string;
    matcher?: string;
}

export function CircleFailingBuilds(props: CircleFailingBuildsProps): React.ReactElement {
    const api = useContext(Circle);
    const [builds, setBuilds] = useState<BuildDetails[]>([]);
    const [lastUpdated, setLastUpdated] = useState<Date | undefined>(undefined);
    const [error, setError] = useState(false);

    useEffect(() => {
        let timeout: number | null = null;
        startTimeout();
        return () => {
            if (timeout) {
                clearTimeout(timeout);
            }
        };

        function startTimeout(t = 0) {
            if (timeout) {
                clearTimeout(timeout);
            }
            setTimeout(() => {
                fetchData().then(() => {
                    setError(false);
                }).catch(() => {
                    setError(true);
                }).finally(() => {
                    startTimeout(10000);
                });
            }, t);
        }
    }, [api]);

    const failedBuilds = builds.filter(b => isFailedBuild(b));
    const successBuilds = builds.length - failedBuilds.length;

    let failedBuildsView = null;
    if (failedBuilds.length) {
        failedBuildsView = (
            <ul className={'circleci-failing-builds__list'}>
                {failedBuilds.map(b => (
                    <li key={b.build_url}>
                        <span className={'circleci-failing-builds__list__buildnum ' + getBuildStatus(b)}>
                            #{b.build_num}
                        </span>
                        <div className={'circleci-failing-builds__list__build-details'}>
                            <a href={b.build_url} target={'_blank'}>{b.branch}</a>
                            <span className={'circleci-failing-builds__list__build-responsible'}>
                                ➡️ {b.committer_name || (<span className={'unknown'}>automatic</span>)}
                            </span>
                        </div>
                    </li>
                ))}
            </ul>
        );
    } else {
        failedBuildsView = (
            <p>
                😀️ There are no failed builds.
            </p>
        )
    }

    return (
        <div className={'circleci-failing-builds'}>
            <h3>Builds for {props.username}/{props.project}</h3>
            <div className={'circleci-failing-builds__lastupdate'}>
                Last updated: {getDateString(lastUpdated)}
            </div>

            {error && (
                <p className={'alert alert-warning'}>
                    Failed to update status from CircleCI.
                </p>
            )}

            {builds.length > 0 ? (
                <>
                    {failedBuildsView}
                    <hr/>
                    <p>
                        ✅ Tracking further {successBuilds} builds.
                    </p>
                </>
            ) : (
                <p>No builds...</p>
            )}
        </div>
    );

    async function fetchData() {
        try {
            let result = await api.getProjectBuilds(props.username, props.project);

            if (props.matcher) {
                const m = new RegExp(props.matcher);
                result = result.filter(b => m.test(b.branch));
            }

            const seenBranches = new Set<string>();
            result = result.filter(b => {
                if (seenBranches.has(b.branch)) {
                    return false;
                } else if (!isPendingBuild(b)) {
                    seenBranches.add(b.branch);
                }
                return true;
            });

            setBuilds(result);
            setLastUpdated(new Date());
        } catch (e) {
            console.error('failed to get CircleAPI data', e);
            throw e;
        }
    }

    function getDateString(d?: Date) {
        if (!d) {
            return 'never';
        }
        return `${d.getFullYear()}-${twoDigits(d.getMonth())}-${twoDigits(d.getDay())}`
            + ` ${twoDigits(d.getHours())}:${twoDigits(d.getMinutes())}:${twoDigits(d.getSeconds())}`;
    }

    function twoDigits(num: number) {
        return num.toString().padStart(2, '0');
    }

    function getBuildStatus(b: BuildDetails) {
        switch (b.status) {
            case 'failed':
            case 'infrastructure_fail':
            case 'timedout':
                for (const other of builds) {
                    if (other === b) {
                        return 'failed';
                    } else if (isPendingBuild(other) && other.branch === b.branch) {
                        return 'pending';
                    }
                }
                return 'failed';
            case 'success':
                return 'success';
            default:
                return '';
        }
    }

    function isPendingBuild(b: BuildDetails) {
        return b.status === 'running'
            || b.status === 'queued'
            || b.status === "scheduled";
    }

    function isFailedBuild(b: BuildDetails) {
        return b.status === 'failed'
            || b.status === 'infrastructure_fail'
            || b.status === 'timedout';
    }
}
