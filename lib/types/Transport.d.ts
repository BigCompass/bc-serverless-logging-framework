import { Destination } from '../lager/destinations/Destination';
export interface Transport {
    destination?: Destination;
    handler?: Function;
}
