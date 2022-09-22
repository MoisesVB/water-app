import { Activity } from "./activity";

export interface UserData {
    goal: number;
    intake: number;
    selectedCup?: string;
    selectedReminder: number;
    activity: Activity;
    currentDay?: number;
}
