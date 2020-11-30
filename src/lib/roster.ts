import { Catalog, Faction } from '@retinue/databank';

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

export class Unit {}

export class Roster {
  static resolve(record: RosterRecord, catalog: Catalog): Roster {
    const units: Unit[] = [];

    for (const rUnit of record.units) {
      const cUnit = catalog.lookupUnit(rUnit.name, {
        title: rUnit.title,
        faction: record.faction,
      });
      if (cUnit) {
        units.push(new Unit());
      }
    }
  }

  constructor(public readonly units: Unit[]) {}
}
