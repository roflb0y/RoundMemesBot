import { Scenes } from "telegraf";
import { Video } from "telegraf/typings/core/types/typegram";

// это полный пиздец
export interface ChooseMemeSession extends Scenes.WizardSessionData {
	video: Video;
}