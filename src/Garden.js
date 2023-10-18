
class Garden {
  static get minigame() { return Game.Objects['Farm'].minigame; }
  static get isActive() { return this.minigame !== undefined; }

  static get CpSMult() {
    var res = 1
    for (let key in Game.buffs) {
        if (typeof Game.buffs[key].multCpS != 'undefined') {
            res *= Game.buffs[key].multCpS;
        }
    }
    return res;
  }

  static get secondsBeforeNextTick() {
    return (this.minigame.nextStep-Date.now()) / 1000;
  }

  static get selectedSeed() { return this.minigame.seedSelected; }
  static set selectedSeed(seedId) { this.minigame.seedSelected = seedId; }

  static clonePlot() {
    let plot = clone(this.minigame.plot);
    for (let x=0; x<6; x++) {
      for (let y=0; y<6; y++) {
        let [seedId, age] = plot[x][y];
        let plant = this.getPlant(seedId);
        if (plant != undefined && !plant.plantable) {
          plot[x][y] = [0, 0];
        }
      }
    }
    return plot;
  }

  static getPlant(id) { return this.minigame.plantsById[id - 1]; }
  static getTile(x, y) {
    let tile = this.minigame.getTile(x, y);
    return { seedId: tile[0], age: tile[1] };
  }

  static getPlantStage(tile) {
    let plant = this.getPlant(tile.seedId);
    if (tile.age < plant.mature) {
      return 'young';
    } else {
      if ((tile.age + Math.ceil(plant.ageTick + plant.ageTickR)) < 100) {
        return 'mature';
      } else {
        return 'dying';
      }
    }
  }

  static tileIsEmpty(x, y) { return this.getTile(x, y).seedId == 0; }

  static plantSeed(seedId, x, y) {
    let plant = this.getPlant(seedId + 1);
    if (plant.plantable) {
      this.minigame.useTool(seedId, x, y);
    }
  }

  static forEachTile(callback) {
    for (let x=0; x<6; x++) {
      for (let y=0; y<6; y++) {
        if (this.minigame.isTileUnlocked(x, y)) {
          callback(x, y);
        }
      }
    }
  }

  static harvest(x, y) { this.minigame.harvest(x, y); }

  static fillGardenWithSelectedSeed() {
    if (this.selectedSeed > -1) {
      this.forEachTile((x, y) => {
        if (this.tileIsEmpty(x, y)) {
          this.plantSeed(this.selectedSeed, x, y);
        }
      });
    }
  }

  static handleYoung(config, plant, x, y) {
    if (plant.weed && config.autoHarvestWeeds) {
      this.harvest(x, y);
    }
    let [seedId, age] = config.savedPlot[y][x];
    seedId--;
    if (config.autoHarvestCleanGarden &&
        ((plant.unlocked && seedId == -1) ||
         (seedId > -1 && seedId != plant.id))
        ) {
      this.harvest(x, y);
    }
  }

  static handleMature(config, plant, x, y) {
    if (!plant.unlocked && config.autoHarvestNewSeeds) {
      this.harvest(x, y);
      UI.buildLocked();
    } else if (config.autoHarvestCheckCpSMult &&
               this.CpSMult >= config.autoHarvestMiniCpSMult.value) {
      this.harvest(x, y);
    }
  }

  static handleDying(config, plant, x, y) {
    if (config.autoHarvestCheckCpSMultDying &&
        this.CpSMult >= config.autoHarvestMiniCpSMultDying.value) {
      this.harvest(x, y);
    } else if (config.autoHarvestDying &&
        this.secondsBeforeNextTick <= config.autoHarvestDyingSeconds) {
      this.harvest(x, y);
    }
  }

  static getLocked(){
    let plants = this.minigame.plants;
    let result = [];
    for (var i in plants){
      if (!plants[i].unlocked){
        result.push(plants[i]);
      } 
    }
    return result;
  }

  static parentsUnlocked(plant){
    let plants = this.plants[plant.key].parents;

    for(var i = 0; i < plants.length; i++) {
      let parent = plants[i]; 
      if(!Garden.minigame.plants[parent].unlocked){
        return false;
      }
    }

    return true;
  }

  static getParentIds(plant){
    let result = [];

    let parents = this.plants[plant.key].parents;
    
    parents.forEach(function (key){
      result.push(Garden.minigame.plants[key].id + 1);  
    });

    return result;
  }

  static plantMutate(seedId){
    let lvl = this.getLevel();
    console.log('plot: ' + seedId + ' ' + lvl);
    let plot = SeedMap.getPlot(seedId, lvl);
    Main.savePlot(plot);
  }

  static getLevel(){
    return Math.max(1,Math.min(this.minigame.plotLimits.length,this.minigame.parent.level));
  }

  static run(config) {
    this.forEachTile((x, y) => {
      if (config.autoHarvest && !this.tileIsEmpty(x, y)) {
        let tile = this.getTile(x, y);
        let plant = this.getPlant(tile.seedId);

        if (plant.immortal && config.autoHarvestAvoidImmortals) {
          // do nothing
        } else {
          let stage = this.getPlantStage(tile);
          switch (stage) {
            case 'young':
              this.handleYoung(config, plant, x, y);
              break;
            case 'mature':
              this.handleMature(config, plant, x, y);
              break;
            case 'dying':
              this.handleDying(config, plant, x, y);
              break;
            default:
              console.log(`Unexpected plant stage: ${stage}`);
          }
        }
      }

      if (config.autoPlant &&
          (!config.autoPlantCheckCpSMult ||
          this.CpSMult <= config.autoPlantMaxiCpSMult.value) &&
          this.tileIsEmpty(x, y) &&
          config.savedPlot.length > 0
        ) {
        let [seedId, age] = config.savedPlot[y][x];
        if (seedId > 0) {
          this.plantSeed(seedId - 1, x, y);
        }
      }
    });
  }

  static plants = {
      'bakerWheat':{
          name:'Baker\'s wheat',
          icon:0,
          parents: []
      },
      'thumbcorn':{
          name:'Thumbcorn',
          icon:1,
          parents: ['bakerWheat']
      },
      'cronerice':{
          name:'Cronerice',
          icon:2,
          parents: ['bakerWheat','thumbcorn']
      },
      'gildmillet':{
          name:'Gildmillet',
          icon:3,
          parents: ['cronerice','thumbcorn']
      },
      'clover':{
          name:'Ordinary clover',
          icon:4,
          parents: ['bakerWheat','gildmillet']
      },
      'goldenClover':{
          name:'Golden clover',
          icon:5,
          parents: ['bakerWheat','gildmillet']
      },
      'shimmerlily':{
          name:'Shimmerlily',
          icon:6,
          parents: ['gildmillet','clover']
      },
      'elderwort':{
          name:'Elderwort',
          icon:7,
          parents: ['shimmerlily','wrinklegill']
      },
      'bakeberry':{
          name:'Bakeberry',
          icon:8,
          parents: ['bakerWheat']
      },
      'chocoroot':{
          name:'Chocoroot',
          icon:9,
          parents: ['bakerWheat','brownMold']
      },
      'whiteChocoroot':{
          name:'White chocoroot',
          icon:10,
          parents: ['chocoroot','whiteMildew']
      },
      'whiteMildew':{
          name:'White mildew',
          icon:26,
          parents: ['brownMold']
      },
      'brownMold':{
          name:'Brown mold',
          icon:27,
          parents: ['meddleweed']
      },
      'meddleweed':{
          name:'Meddleweed',
          icon:29,
          parents: []
      },
      'whiskerbloom':{
          name:'Whiskerbloom',
          icon:11,
          parents: ['shimmerlily','whiteChocoroot']
      },
      'chimerose':{
          name:'Chimerose',
          icon:12,
          parents: ['shimmerlily', 'whiskerbloom']
      },
      'nursetulip':{
          name:'Nursetulip',
          icon:13,
          parents: ['whiskerbloom']
      },
      'drowsyfern':{
          name:'Drowsyfern',
          icon:14,
          parents: ['chocoroot','keenmoss']
      },
      'wardlichen':{
          name:'Wardlichen',
          icon:15,
          parents: ['keenmoss','cronerice']
      },
      'keenmoss':{
          name:'Keenmoss',
          icon:16,
          parents: ['greenRot','brownMold']
      },
      'queenbeet':{
          name:'Queenbeet',
          icon:17,
          parents: ['bakeberry','chocoroot']
      },
      'queenbeetLump':{
          name:'Juicy queenbeet',
          icon:18,
          parents: ['queenbeet']
      },
      'duketater':{
          name:'Duketater',
          icon:19,
          parents: ['queenbeet']
      },
      'crumbspore':{
          name:'Crumbspore',
          icon:20,
          parents: []
      },
      'doughshroom':{
          name:'Doughshroom',
          icon:21,
          parents: ['crumbspore']
      },
      'glovemorel':{
          name:'Glovemorel',
          icon:22,
          parents: ['thumbcorn','crumbspore']
      },
      'cheapcap':{
          name:'Cheapcap',
          icon:22,
          parents: ['crumbspore','shimmerlily']
      },
      'foolBolete':{
          name:'Fool\'s bolete',
          icon:23,
          parents: ['doughshroom','greenRot']
      },
      'wrinklegill':{
          name:'Wrinklegill',
          icon:25,
          parents: ['crumbspore','brownMold']
      },
      'greenRot':{
          name:'Green rot',
          icon:28,
          parents: ['clover','whiteMildew']
      },
      'shriekbulb':{
          name:'Shriekbulb',
          icon:30,
          parents: ['duketater']
      },
      'tidygrass':{
          name:'Tidygrass',
          icon:31,
          parents: ['bakerWheat','whiteChocoroot']
      },
      'everdaisy':{
          name:'Everdaisy',
          icon:32,
          parents: ['tidygrass','elderwort']
      },
      'ichorpuff':{
          name:'Ichorpuff',
          icon:33,
          parents: ['elderwort','crumbspore']
      },
    };
}
