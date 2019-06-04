import { Line } from './Line';

export class TimetableEntry {
    timetableEntryId : string;
    day : number;
    lineId : string;
    line : Line;
    timeOfDeparture : string;
}