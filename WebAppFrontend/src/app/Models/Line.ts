import { Station } from './Station';

export class Line {
    orderNumber : string;
    version : number;
    isUrban : boolean;
    stations : Station[];
    path : string;

}