export interface ProcessData {
    progressBarPercentage: number;
    reminderIntervals?: number[];
    countUpInterval?: number;
    isDeletingIntake?: boolean;
    notification?: Notification;
}