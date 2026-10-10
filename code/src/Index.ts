require('dotenv').config();

import './Utils/MonkeyPatches';
import './Providers/SQL';

import BotManager from './Managers/BotManager';
import Discord from './Providers/Discord';

class Main {

    constructor() {
        Discord.SetEventReadyCallback(BotManager.OnReady);
        Discord.SetEventGuildCreateCallback(BotManager.OnAddedToGuild);
        Discord.SetEventGuildDeleteCallback(BotManager.OnKickedFromGuild);
        Discord.SetEventInteractionCallback(BotManager.OnInteraction);
        Discord.Init();
    }
}

new Main();