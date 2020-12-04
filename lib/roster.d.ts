import { Catalog, Faction, UnitCard, UpgradeCard } from '@retinue/databank';
/**
 * A recorded "raw" unit.
 *
 * A UnitRecord should be treated as an immutable and unresolved data-exchange
 * format that, when paired with a game catalog, can be transformed into a final
 * @see Unit.
 */
export interface UnitRecord {
    /**
     * Name of the unit.
     */
    readonly name: string;
    /**
     * Optional; the title of a variant of a character.
     *
     * For example `'Jedi Knight'` for `Luke Skywalker: Jedi Knight`.
     */
    readonly title?: string;
    /**
     * Optional; names of upgrades applied to the unit.
     */
    readonly upgrades?: string[];
    /**
     * Optional; an alternative set of upgrades for the `Loadout` keyword.
     */
    readonly loadout?: string[];
}
/**
 * A recorded "raw" army list.
 *
 * A RosterRecord should be treated as an immutable and unresolved data-exchange
 * format that, when paired with a game catalog, can be transformed into a final
 * @see Roster.
 */
export interface RosterRecord {
    /**
     * Name of the roster.
     */
    readonly name: string;
    /**
     * Optional; which faction was selected when building this roster.
     *
     * Omitting this field indicates that this roster should be treated as a
     * custom" format where normal list-building rules do not apply (i.e. house
     * rules or homebrew).
     */
    readonly faction?: Faction;
    /**
     * Units in the list.
     */
    readonly units: UnitRecord[];
}
/**
 * Represents a resolved @see UnitRecord (a unit card and upgrades).
 */
export declare class Unit {
    readonly card: UnitCard;
    readonly upgrades: UpgradeCard[];
    readonly loadout?: UpgradeCard[] | undefined;
    constructor(card: UnitCard, upgrades: UpgradeCard[], loadout?: UpgradeCard[] | undefined);
    toRecord(): UnitRecord;
}
/**
 * Represents a resolved @see RosterRecord.
 */
export declare class Roster {
    readonly name: string;
    readonly faction: Faction | undefined;
    readonly units: Unit[];
    readonly points: number;
    /**
     * Creates a roster by resolving a record in context of a catalog.
     *
     * @param record
     * @param catalog
     */
    static resolve(record: RosterRecord, catalog: Catalog): Roster;
    constructor(name: string, faction: Faction | undefined, units: Unit[], points: number);
    toRecord(): RosterRecord;
}
