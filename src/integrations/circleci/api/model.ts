export type BuildOutcome = 'canceled' | 'infrastructure_fail' | 'timedout' | 'failed' | 'no_tests' | 'success';
export type BuildStatus =
    'retried'
    | 'canceled'
    | 'infrastructure_fail'
    | 'timedout'
    | 'not_run'
    | 'running'
    | 'failed';
export type BuildFilter = 'completed' | 'successful' | 'failed' | 'running';

export interface BuildDetails {
    vcs_url: string;
    build_url: string;
    build_num: number;
    branch: string;

    committer_name: string;
    committer_email: string;
    subject: string;

    outcome: BuildOutcome;
    status: BuildStatus;

    previous: {
        build_num: number;
        status: BuildStatus;
    }
}

export interface CircleAPI {
    setToken(token: string): void;

    getProjectBuilds(user: string, project: string, filter?: BuildFilter): Promise<BuildDetails[]>;

    getProjectBranchBuilds(user: string, project: string, branch: string, filter?: BuildFilter): Promise<BuildDetails[]>;
}
