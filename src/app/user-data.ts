import { Activity } from "./activity";
import { Cup } from "./cup";

export interface UserData {
    goal: number;
    intake: number;
    selectedCup?: string;
    reminder?: number;
    activity: Activity;
    currentDay?: number;
    cups?: Cup[];
}
