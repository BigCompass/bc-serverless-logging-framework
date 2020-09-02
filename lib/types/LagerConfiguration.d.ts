import { Transport } from './Transport';
import { LogProps } from '../lager/types/LogProps';
export interface LagerConfiguration {
    levels?: Array<string>;
    props?: LogProps;
    transports?: Array<Transport>;
    errorKey?: string;
}
