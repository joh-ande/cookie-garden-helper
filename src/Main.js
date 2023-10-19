
class Main {
  static init() {
    this.timerInterval = 1000;
    this.config = Config.load();
    UI.build(this.config);

    // sacrifice garden
    let oldConvert = Garden.minigame.convert;
    Garden.minigame.convert = () => {
      this.config.savedPlot = [];
      UI.labelToggleState('plotIsSaved', false);
      this.handleToggle('autoHarvest');
      this.handleToggle('autoPlant');
      this.save();
      oldConvert();
    }

    for(i = 1; i < 35; i++)

    this.start();

    window.setTimeout(this.clickId, 25, "bigCookie");
    window.setTimeout(this.clickClass, 25, "shimmer");
  }

  static start() {
    this.timerId = window.setInterval(
      () => Garden.run(this.config),
      this.timerInterval
    );

    this.timerId2 = window.setInterval(
      () => Grimoire.run(this.config),
      this.timerInterval
    );
  }

  static stop() { window.clearInterval(this.timerId); }

  static save() { Config.save(this.config); }

  static handleChange(key, value) {
    if (this.config[key].value !== undefined) {
      this.config[key].value = value;
    } else {
      this.config[key] = value;
    }
    this.save();
  }

  static handleToggle(key) {
    this.config[key] = !this.config[key];
    this.save();
    UI.toggleButton(key);
  }

  static handleClick(key) {
    if (key == 'fillGardenWithSelectedSeed') {
      Garden.fillGardenWithSelectedSeed();
      this.save();
    } else if (key == 'savePlot') {
      this.savePlot(Garden.clonePlot());
    }
  }

  static savePlot(plot){
      this.config['savedPlot'] = plot;
      UI.labelToggleState('plotIsSaved', true);
      this.save();
  }

  static handleMouseoutPlotIsSaved(element) {
    Game.tooltip.shouldHide=1;
  }

  static handleMouseoverPlotIsSaved(element) {
    if (this.config.savedPlot.length > 0) {
      let content = UI.buildSavedPlot(this.config.savedPlot);
      Game.tooltip.draw(element, window.escape(content));
    }
  }

  static clickId(id) {
    var element = document.getElementById(id);
    if(element !== undefined) {
      Main.doEvent(element, "click");
    }
    window.setTimeout(Main.clickId, 25, id);
  }
  static clickClass(id) {
    var elements = document.getElementsByClassName(id);
    if(elements !== undefined && elements.length > 0) {
      Main.doEvent(elements[0], "click");
    }
    window.setTimeout(Main.clickClass, 25, id);
  }
  static doEvent(element, type) {
      var trigger = document.createEvent('HTMLEvents');
      trigger.initEvent(type, true, true);
      element.dispatchEvent(trigger);
  }
}
