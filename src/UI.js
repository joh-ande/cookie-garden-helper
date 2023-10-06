
class UI {
  static makeId(id) { return moduleName + capitalize(id); }
  static get css() {
    return `
#game.onMenu #cookieGardenHelper {
  display: none;
}
#cookieGardenHelper {
  background: #000 url(img/darkNoise.jpg);
  display: none;
  padding: 1em;
  position: inherit;
}
#cookieGardenHelper.visible {
  border:2px solid red;
  display: block;
}
#cookieGardenHelperTools:after {
  content: "";
  display: table;
  clear: both;
}

.cookieGardenHelperPanel {
  float: left;
  width: 25%;
}
.cookieGardenHelperBigPanel {
  float: left;
  width: 50%;
}
.cookieGardenHelperSubPanel {
  float: left;
  width: 50%;
}

#cookieGardenMutatePane{

}

#cookieGardenGardenPanel {
  float: left;
  border: 1px solid red;
  width:394px;
  min-height:200px:

}

.cookieGardenGardenTileIcon {
  display: inline-block;
  transform: translate(0,0);
  pointer-events: none;
  transform-origin: 50% 40px;
  width: 48px;
  height: 48px;
  left: -4px;
  top: -12px;
  background: url(//cdn.dashnet.org/cookieclicker/img/gardenPlants.png?v=2.052);
  z-index: 1000;
}

#autoHarvestPanel { color: wheat; }
#autoHarvestPanel a { color: wheat; }

#autoPlantPanel { color: lightgreen; }
#autoPlantPanel a { color: lightgreen; }

#autoHarvestPanel a:hover,
#autoPlantPanel a:hover { color: white; }

#cookieGardenHelperTitle {
  color: grey;
  font-size: 2em;
  font-style: italic;
  margin-bottom: 0.5em;
  margin-top: -0.5em;
  text-align: center;
}
#cookieGardenHelper h2 {
  font-size: 1.5em;
  line-height: 2em;
}
#cookieGardenHelper h3 {
  color: lightgrey;
  font-style: italic;
  line-height: 2em;
}
#cookieGardenHelper p {
  text-indent: 0;
}
#cookieGardenHelper input[type=number] {
  width: 3em;
}

#cookieGardenHelper a.toggleBtn:not(.off) .toggleBtnOff,
#cookieGardenHelper a.toggleBtn.off .toggleBtnOn {
  display: none;
}
#cookieGardenHelper span.labelWithState:not(.active) .labelStateActive,
#cookieGardenHelper span.labelWithState.active .labelStateNotActive {
  display: none;
}

#cookieGardenHelperTooltip {
  width: 300px;
}
#cookieGardenHelperTooltip .gardenTileRow {
  height: 48px;
}
#cookieGardenHelperTooltip .tile {
  border: 1px inset dimgrey;
  display: inline-block;
  height: 48px;
  width: 48px;
}
#cookieGardenHelperTooltip .gardenTileIcon {
  position: inherit;
}

#cookieGardenHelper .warning {
    padding: 1em;
    font-size: 1.5em;
    background-color: orange;
    color: white;
}
#cookieGardenHelper .warning .closeWarning {
    font-weight: bold;
    float: right;
    font-size: 2em;
    line-height: 0.25em;
    cursor: pointer;
    transition: 0.3s;
}
#cookieGardenHelper .warning .closeWarning:hover {
    color: black;
}
`;
  }

  static numberInput(name, text, title, options) {
    let id = this.makeId(name);
    return `
<input type="number" name="${name}" id="${id}" value="${options.value}" step=0.5
  ${options.min !== undefined ? `min="${options.min}"` : ''}
  ${options.max !== undefined ? `max="${options.max}"` : ''} />
<label for="${id}" title="${title}">${text}</label>`;
  }

  static button(name, text, title, toggle, active) {
    if (toggle) {
      return `<a class="toggleBtn option ${active ? '' : 'off'}" name="${name}"
                 id="${this.makeId(name)}" title="${title}">
        ${text}
        <span class="toggleBtnOn">ON</span>
        <span class="toggleBtnOff">OFF</span>
      </a>`;
    }
    return `<a class="btn option" name="${name}" id="${this.makeId(name)}"
      title="${title}">${text}</a>`;
  }

  static toggleButton(name) {
    let btn = doc.qSel(`#cookieGardenHelper a.toggleBtn[name=${name}]`);
    btn.classList.toggle('off');
  }

  static labelWithState(name, text, textActive, active) {
    return `<span name="${name}" id="${this.makeId(name)}"
                  class="labelWithState ${active ? 'active' : ''}"">
      <span class="labelStateActive">${textActive}</span>
      <span class="labelStateNotActive">${text}</span>
    </span>`;
  }

  static labelToggleState(name, active) {
    let label = doc.qSel(`#cookieGardenHelper span.labelWithState[name=${name}]`);
    label.classList.toggle('active', active);
  }

  static createWarning(msg) {
    doc.elId('row2').insertAdjacentHTML('beforebegin', `
<div id="cookieGardenHelper">
  <style>${this.css}</style>
  <div class="warning">
    <span class="closeWarning">&times;</span>
    ${msg}
  </div>
</div>`);
    doc.qSel('#cookieGardenHelper .closeWarning').onclick = (event) => {
      doc.elId('cookieGardenHelper').remove();
    };
  }

  static get readmeLink() { return 'https://github.com/yannprada/'
      + 'cookie-garden-helper/blob/master/README.md#how-it-works'; }

  static build(config) {
    doc.qSel('#row2 .productButtons').insertAdjacentHTML('beforeend', `
        <div id="cookieGardenHelperProductButton" class="productButton">
          Cookie Garden Helper
        </div>`);
    doc.elId('row2').insertAdjacentHTML('beforeend', `
<div id="cookieGardenHelper">
  <style>${this.css}</style>
  <a href="${this.readmeLink}"
    target="new">how it works</a>
  <div id="cookieGardenHelperTitle" class="title">Cookie Garden Helper</div>
  <div id="cookieGardenHelperTools">
    <div class="cookieGardenHelperBigPanel" id="autoHarvestPanel">
      <h2>
        Auto-harvest
        ${this.button('autoHarvest', '', '', true, config.autoHarvest)}
      </h2>
      <div class="cookieGardenHelperSubPanel">
        <h3>immortal</h3>
        <p>
          ${this.button(
            'autoHarvestAvoidImmortals', 'Avoid immortals',
            'Do not harvest immortal plants', true,
            config.autoHarvestAvoidImmortals
          )}
        </p>
      </div>
      <div class="cookieGardenHelperSubPanel">
        <h3>young</h3>
        <p>
          ${this.button(
            'autoHarvestWeeds', 'Remove weeds',
            'Remove weeds as soon as they appear', true,
            config.autoHarvestWeeds
          )}
        </p>
        <p>
          ${this.button(
            'autoHarvestCleanGarden', 'Clean Garden',
            'Only allow saved and unlocked seeds', true,
            config.autoHarvestCleanGarden
          )}
        </p>
      </div>
      <div class="cookieGardenHelperSubPanel">
        <h3>mature</h3>
        <p>
          ${this.button(
            'autoHarvestNewSeeds', 'New seeds',
            'Harvest new seeds as soon as they are mature', true,
            config.autoHarvestNewSeeds
          )}
        </p>
        <p>
          ${this.button(
            'autoHarvestCheckCpSMult', 'Check CpS mult',
            'Check the CpS multiplier before harvesting (see below)', true,
            config.autoHarvestCheckCpSMult
          )}
        </p>
        <p>
          ${this.numberInput(
            'autoHarvestMiniCpSMult', 'Mini CpS multiplier',
            'Minimum CpS multiplier for the auto-harvest to happen',
            config.autoHarvestMiniCpSMult
          )}
        </p>
      </div>
      <div class="cookieGardenHelperSubPanel">
        <h3>dying</h3>
        <p>
          ${this.button(
            'autoHarvestDying', 'Dying plants',
            `Harvest dying plants, ${config.autoHarvestDyingSeconds}s before `
            + `the new tick occurs`, true,
            config.autoHarvestDying
          )}
        </p>
        <p>
          ${this.button(
            'autoHarvestCheckCpSMultDying', 'Check CpS mult',
            'Check the CpS multiplier before harvesting (see below)', true,
            config.autoHarvestCheckCpSMultDying
          )}
        </p>
        <p>
          ${this.numberInput(
            'autoHarvestMiniCpSMultDying', 'Mini CpS multiplier',
            'Minimum CpS multiplier for the auto-harvest to happen',
            config.autoHarvestMiniCpSMultDying
          )}
        </p>
      </div>
    </div>
    <div class="cookieGardenHelperPanel" id="autoPlantPanel">
      <h2>
        Auto-plant
        ${this.button('autoPlant', '', '', true, config.autoPlant)}
      </h2>
      <p>
        ${this.button(
          'autoPlantCheckCpSMult', 'Check CpS mult',
          'Check the CpS multiplier before planting (see below)', true,
          config.autoPlantCheckCpSMult
        )}
      </p>
      <p>
        ${this.numberInput(
          'autoPlantMaxiCpSMult', 'Maxi CpS multiplier',
          'Maximum CpS multiplier for the auto-plant to happen',
          config.autoPlantMaxiCpSMult
        )}
      </p>
      <p>
        ${this.button('savePlot', 'Save plot',
          'Save the current plot; these seeds will be replanted later')}
        ${this.labelWithState('plotIsSaved', 'No saved plot', 'Plot saved',
          Boolean(config.savedPlot.length))}
      </p>
    </div>
    <div class="cookieGardenHelperPanel" id="manualToolsPanel">
      <h2>Manual tools</h2>
      <p>
        ${this.button('fillGardenWithSelectedSeed', 'Plant selected seed',
        'Plant the selected seed on all empty tiles')}
      </p>
      <p>
      ${this.button(
        'autoForceHand', 'Auto Force Hand',
        'Auto Force Hand', true,
        config.autoForceHand
      )}
      </p>
    </div>
  </div>
  <div id="cookieGardenMutatePane">
    <h2>Mutate tools</h2>
    ${this.buildLocked()}
  </div>
</div>`);

    doc.elId('cookieGardenHelperProductButton').onclick = (event) => {
      doc.elId('cookieGardenHelper').classList.toggle('visible');
    };

    doc.qSelAll('#cookieGardenHelper input').forEach((input) => {
      input.onchange = (event) => {
        if (input.type == 'number') {
          let min = config[input.name].min;
          let max = config[input.name].max;
          if (min !== undefined && input.value < min) { input.value = min; }
          if (max !== undefined && input.value > max) { input.value = max; }
          Main.handleChange(input.name, input.value);
        }
      };
    });

    doc.qSelAll('#cookieGardenHelper a.toggleBtn').forEach((a) => {
      a.onclick = (event) => {
        Main.handleToggle(a.name);
      };
    });

    doc.qSelAll('#cookieGardenHelper a.btn').forEach((a) => {
      a.onclick = (event) => {
        Main.handleClick(a.name);
      };
    });

    doc.elId('cookieGardenHelperPlotIsSaved').onmouseout = (event) => {
      Main.handleMouseoutPlotIsSaved(this);
    }
    doc.elId('cookieGardenHelperPlotIsSaved').onmouseover = (event) => {
      Main.handleMouseoverPlotIsSaved(this);
    }
  }

  static getSeedIconY(seedId) {
    return Garden.getPlant(seedId).icon * -48;
  }

  static buildSavedPlot(savedPlot) {
    return `<div id="cookieGardenHelperTooltip">
      ${savedPlot.map((row) => `<div class="gardenTileRow">
        ${row.map((tile) => `<div class="tile">
          ${(tile[0] - 1) < 0 ? '' : `<div class="gardenTileIcon"
            style="background-position: 0 ${this.getSeedIconY(tile[0])}px;">
          </div>`}
        </div>`).join('')}
      </div>`).join('')}
    </div>`;
  }

  static buildLocked() {
    let self = this;
    let result = `<div id="cookieGardenGardenPanel">`;
    
    Garden.getLocked().forEach(function (plant){
      result += self.buildPlant(plant);
    });

    result += '</div>';

    return result;
  }

  static buildPlant(plant){
    return '<div class="cookieGardenGardenTile" onmouseover="' + plant.l.onmouseover + '" onmouseout="' + plant.l.onmouseout + '"><div class="cookieGardenGardenTileIcon" onclick="alert(' + plant.name + ')" style="background-position:'+(-0*48)+'px '+(-plant.icon*48)+'px;"></div></div>'; 
    //return '<div class="" onmouseover="' + plant.l.onmouseover + '" onmouseout="' + plant.l.onmouseout + '"><div class="cookieGardenGardenTileIcon" style="background-position:'+(-0*48)+'px '+(-plant.icon*48)+'px;">'; 
    //return <div id="gardenSeed-14" class="gardenSeed locked" onmouseout="Game.tooltip.shouldHide=1;" onmouseover="Game.tooltip.dynamic=1;Game.tooltip.draw(this,function(){return Game.ObjectsById[2].minigame.seedTooltip(14)();},'this');Game.tooltip.wobble();"><div id="gardenSeedIcon-14" class="gardenSeedIcon shadowFilter" style="background-position:0px -528px;"></div></div>
    //let str = 
    //str+='<div id="gardenSeed-'+me.id+'" class="gardenSeed'+(M.seedSelected==me.id?' on':'')+' locked" '+Game.getDynamicTooltip('Game.ObjectsById['+M.parent.id+'].minigame.seedTooltip('+me.id+')','this')+'>';
    //return '<div class="gardenSeed" ' +Game.getDynamicTooltip('Game.ObjectsById['+plant.parent.id+'].minigame.seedTooltip('+plant.id+')','this')+ '><div class="gardenSeedIcon" style="background-position:'+(-0*48)+'px '+(-plant.icon*48)+'px;"></div>Argh</div>'
    //return '<div class="cookieGardenGardenTileIcon" style="background-position: 0 ' + this.getSeedIconY(plant.icon + 2) + 'px;">' + plant.name + '</div>'; 
  }
}
