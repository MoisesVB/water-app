export interface History {
    [key: string]: HistoryData[];
}

export interface HistoryData {
    id: string;
    hour: string;
    intake: number;
}