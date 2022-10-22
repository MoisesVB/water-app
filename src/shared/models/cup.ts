import { CupIcon } from "./cup-icon";

export interface Cup {
    id: string;
    capacity: number;
    isCustom: boolean;
    icon: CupIcon | string
}
