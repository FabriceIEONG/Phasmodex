var name;
var id;
var listEvi;
var potential;
var eviA, eviB, eviC;
var strength;
var weak;

function Ghost(name, id, eviA, eviB, eviC, strength, weak) {
    this.name = name;
    this.id = id;

    this.listEvi = [false, false, false, false, false, false];
    this.listEvi[eviA.id-1] = true;
    this.listEvi[eviB.id-1] = true;
    this.listEvi[eviC.id-1] = true;

    this.eviA = eviA;
    this.eviB = eviB;
    this.eviC = eviC;

    this.strength = strength;
    this.weak = weak;
}