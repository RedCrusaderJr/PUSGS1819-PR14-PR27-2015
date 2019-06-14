import { Line } from './Line';

export class TimetableEntry {
    TimetableEntryId : string;
    Day : number;
    LineId : string;
    Line : Line;
    TimeOfDeparture : string;
    Version : number;
}