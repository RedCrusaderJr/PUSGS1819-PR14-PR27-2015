import { Station } from './Station';

export class Line {
    orderNumber : string;
    rowVersion : [];
    isUrban : boolean;
    stations : Station[];
    path : string;

}