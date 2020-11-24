import { Levels } from './bc-serverless-logging-framework/enums/Levels';
import { Logger, LagerConfiguration } from './bc-serverless-logging-framework/types';
export declare const bcLogger: {
    destinations: {
        sqs: (config: import("./bc-serverless-logging-framework/types").SQSDestinationConfig) => import("./bc-serverless-logging-framework/types").Destination;
        http: (config: import("axios").AxiosRequestConfig) => import("./bc-serverless-logging-framework/types").Destination;
        consoleLog: (config?: import("./bc-serverless-logging-framework/types").ConsoleLogDestinationConfig | undefined) => import("./bc-serverless-logging-framework/types").Destination;
    };
    levels: typeof Levels;
    /**
     * Return a logger object based on configuration
     *
     */
    create({ levels, props, computed, transports, errorKey, propsRoot }?: LagerConfiguration): Logger;
};
