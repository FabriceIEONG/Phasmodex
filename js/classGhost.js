var name;
var listEvi;
var eviA, eviB, eviC;
var strength;
var weak;

function Ghost(name, eviA, eviB, eviC, strength, weak) {
    this.name = name;

    this.listEvi = [false, false, false, false, false, false];
    this.listEvi[eviA] = true;
    this.listEvi[eviB] = true;
    this.listEvi[eviC] = true;

    this.eviA = eviA;
    this.eviB = eviB;
    this.eviC = eviC;

    this.strength = strength;
    this.weak = weak;
}