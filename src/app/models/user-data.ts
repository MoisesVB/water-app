import { Activity } from "../../shared/models/activity";
import { Cup } from "../../shared/models/cup";

export interface UserData {
    goal: number;
    intake: number;
    selectedCup?: string;
    reminder?: number;
    activity: Activity;
    currentDay?: number;
    cups?: Cup[];
}
