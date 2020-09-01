import { Levels } from './lager/enums/Levels';
import { LoggerConfiguration } from './types/LoggerConfiguration';
import { Logger } from './types/logger';
export declare const lager: {
    destinations: {
        sqs: (config: import("./lager/destinations/sqs").SQSDestinationConfig) => import("./lager/destinations/Destination").Destination;
    };
    levels: typeof Levels;
    /**
     * Return a logger object based on configuration
     */
    create({ levels, props, transports, errorKey }: LoggerConfiguration): Logger;
};
