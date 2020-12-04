"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Roster = exports.Unit = void 0;
/**
 * Represents a resolved @see UnitRecord (a unit card and upgrades).
 */
class Unit {
    constructor(card, upgrades, loadout) {
        this.card = card;
        this.upgrades = upgrades;
        this.loadout = loadout;
    }
    toRecord() {
        var _a;
        return {
            name: this.card.name,
            title: this.card.title,
            upgrades: this.upgrades.map((u) => u.name),
            loadout: (_a = this.loadout) === null || _a === void 0 ? void 0 : _a.map((u) => u.name),
        };
    }
}
exports.Unit = Unit;
/**
 * Represents a resolved @see RosterRecord.
 */
class Roster {
    constructor(name, faction, units, points) {
        this.name = name;
        this.faction = faction;
        this.units = units;
        this.points = points;
    }
    /**
     * Creates a roster by resolving a record in context of a catalog.
     *
     * @param record
     * @param catalog
     */
    static resolve(record, catalog) {
        var _a, _b;
        const units = [];
        for (const rUnit of record.units) {
            const cUnit = catalog.lookupUnit(rUnit.name, {
                title: rUnit.title,
                faction: record.faction,
            });
            if (cUnit) {
                const cUpgrades = (_a = rUnit.upgrades) === null || _a === void 0 ? void 0 : _a.map((u) => catalog.lookupUpgrade(u));
                const cLoadout = (_b = rUnit.loadout) === null || _b === void 0 ? void 0 : _b.map((u) => catalog.lookupUpgrade(u));
                units.push(new Unit(cUnit, (cUpgrades === null || cUpgrades === void 0 ? void 0 : cUpgrades.filter((u) => u)) || [], (cLoadout === null || cLoadout === void 0 ? void 0 : cLoadout.filter((u) => u)) || []));
            }
        }
        return new Roster(record.name, record.faction, units, units.reduce((a, c) => a + c.card.points + c.upgrades.reduce((a, c) => a + c.points, 0), 0));
    }
    toRecord() {
        return {
            name: this.name,
            faction: this.faction,
            units: this.units.map((u) => u.toRecord()),
        };
    }
}
exports.Roster = Roster;
