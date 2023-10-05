class Grimoire{
    static get minigame() { return Game.Objects['Wizard tower'].minigame; }
    static get isActive() { return this.minigame !== undefined; }

    static run(config) {        
        if(config.autoForceHand && this.minigame.magic >= this.minigame.magicM){
            console.log("Clicking Force Hand!");
            var element = document.getElementById('grimoireSpell1');
            if(element !== undefined) {
                Main.doEvent(element, "click");
             }
        }
    }
/*
    Game.goldenCookieChoices=[
        "Frenzy","frenzy",
        "Lucky","multiply cookies",
        "Ruin","ruin cookies",
        "Elder frenzy","blood frenzy",
        "Clot","clot",
        "Click frenzy","click frenzy",
        "Cursed finger","cursed finger",
        "Cookie chain","chain cookie",
        "Cookie storm","cookie storm",
        "Building special","building special",
        "Dragon Harvest","dragon harvest",
        "Dragonflight","dragonflight",
        "Sweet","free sugar lump",
        "Blab","blab"
    ];
    Game.goldenCookieBuildingBuffs={
        'Cursor':['High-five','Slap to the face'],
        'Grandma':['Congregation','Senility'],
        'Farm':['Luxuriant harvest','Locusts'],
        'Mine':['Ore vein','Cave-in'],
        'Factory':['Oiled-up','Jammed machinery'],
        'Bank':['Juicy profits','Recession'],
        'Temple':['Fervent adoration','Crisis of faith'],
        'Wizard tower':['Manabloom','Magivores'],
        'Shipment':['Delicious lifeforms','Black holes'],
        'Alchemy lab':['Breakthrough','Lab disaster'],
        'Portal':['Righteous cataclysm','Dimensional calamity'],
        'Time machine':['Golden ages','Time jam'],
        'Antimatter condenser':['Extra cycles','Predictable tragedy'],
        'Prism':['Solar flare','Eclipse'],
        'Chancemaker':['Winning streak','Dry spell'],
        'Fractal engine':['Macrocosm','Microcosm'],
        'Javascript console':['Refactoring','Antipattern'],
        'Idleverse':['Cosmic nursery','Big crunch'],
        'Cortex baker':['Brainstorm','Brain freeze'],
        'You':['Deduplication','Clone strike'],
    };

    buff=Game.gainBuff('click frenzy',Math.ceil(13*effectDurMod),777);
    <div id="CMTimerBarBuffTimers"><div id="Clot" style="height: 12px; margin: 0px 10px; position: relative;"><div style="width: 100%; height: 10px; margin: auto; position: absolute; inset: 0px;"><span style="display: inline-block; text-align: right; font-size: 10px; width: 108px; margin-right: 5px; vertical-align: text-top;">Clot</span><span id="ClotBar" class="CMBackRed" style="display: inline-block; height: 10px; vertical-align: text-top; text-align: center; border-top-right-radius: 10px; border-bottom-right-radius: 10px; color: black; width: 370px;">61%</span><span id="ClotTime" style="margin-left: 5px; vertical-align: text-top;">92</span></div></div></div>
*/
}