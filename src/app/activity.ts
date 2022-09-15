export interface Activity {
    [key: string]: ActivityData[];
}

export interface ActivityData {
    id: string;
    hour: string;
    intake: number;
}