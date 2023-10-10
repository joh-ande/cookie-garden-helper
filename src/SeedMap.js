class SeedMap {
    static s4_4 = [[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],[[0,0],[1,0],[4,0],[4,0],[1,0],[0,0]],[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]]];
    static s4 = ['','','',this.s4_4];

    static mutateMap = [
        [],
        [],
        [],
        this.s4
    ]

    init(){
        console.log(this.xx);
        let seedMap = new Map();
        
        let seed = new Map();
        seed.set('4', this.s4_4);

        seedMap.set('4', seed);
        this.seedMap = seedMap;
    }

    static getPlot(seedId, lvl){
        return this.mutateMap[seedId-1][lvl-1];
    }

    static test(){
        console.log(this.xx);
    }

    static getEmptyLvl4(){
        return [
            [[0,0],[0,0],[0,0],[0,0],[0,0,[0,0]],
            [[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],
            [[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],
            [[0,0],[1,0],[4,0],[4,0],[1,0],[0,0]],
            [[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],
            [[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]]]
          ]; 
    }

}