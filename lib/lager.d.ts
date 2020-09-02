import { Levels } from './lager/enums/Levels';
import { Logger, LagerConfiguration } from './lager/types';
export declare const lager: {
    destinations: {
        sqs: (config: import("./lager/types").SQSDestinationConfig) => import("./lager/types").Destination;
        consoleLog: (config?: import("./lager/types").ConsoleLogDestinationConfig | undefined) => import("./lager/types").Destination;
    };
    levels: typeof Levels;
    /**
     * Return a logger object based on configuration
     *
     */
    create({ levels, props, transports, errorKey }?: LagerConfiguration): Logger;
};
