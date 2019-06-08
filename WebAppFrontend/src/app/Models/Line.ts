import { Station } from './Station';

export class Line {
    orderNumber : string;
    isUrban : boolean;
    stations : Station[];
    path : string;
}