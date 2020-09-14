export declare const destinations: {
    sqs: (config: import("../types").SQSDestinationConfig) => import("../types").Destination;
    http: (config: import("axios").AxiosRequestConfig) => import("../types").Destination;
    consoleLog: (config?: import("../types").ConsoleLogDestinationConfig | undefined) => import("../types").Destination;
};
