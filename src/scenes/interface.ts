import { Scenes } from "telegraf";

export interface MySceneSession extends Scenes.WizardSessionData {
    videoMessageID: string;
}