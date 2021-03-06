import * as SQS from 'aws-sdk/clients/sqs';
export interface LagerConfiguration {
    levels?: Array<string>;
    props?: LogProps;
    propsRoot?: string;
    computed?: LogComputedProps;
    transports?: Array<Transport>;
    errorKey?: string;
}
export interface LagerChildOptions {
    replaceTransports?: boolean;
    replaceProps?: boolean;
    replaceComputed?: boolean;
}
export interface Log {
    level?: string;
    message?: string;
    [x: string]: any;
}
export interface LogProps {
    [x: string]: any;
}
export interface LogComputedProps {
    [x: string]: Function;
}
export interface Logger {
    props: Function;
    flush: Function;
    [x: string]: Function;
}
export interface Transport {
    destination?: Destination;
    handler?: Function;
    level?: string;
    levelNumber?: number;
}
export interface Destination {
    send(log?: Log): void | Promise<any>;
}
export interface ConsoleType {
    debug: Function;
    info: Function;
    warn: Function;
    error: Function;
}
export interface ConsoleLogDestinationConfig {
    consoleLevel?: string | null;
}
export interface SQSDestinationConfig {
    sqsOptions?: SQS.Types.ClientConfiguration;
    queueUrl: string;
}
export interface RunTransportsConfig {
    log: Log;
    level: string;
    transports: Array<Transport>;
}
export interface HttpDestinationOptions {
    logProperty?: string;
}
