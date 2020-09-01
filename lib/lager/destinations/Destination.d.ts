import { Log } from '../types/Log';
export interface Destination {
    send(log: Log): void | Promise<any>;
}
