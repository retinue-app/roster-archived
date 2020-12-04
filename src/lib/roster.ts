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
export class Unit {
  constructor(
    readonly card: UnitCard,
    readonly upgrades: UpgradeCard[],
    readonly loadout?: UpgradeCard[],
  ) {}

  toRecord(): UnitRecord {
    return {
      name: this.card.name,
      title: this.card.title,
      upgrades: this.upgrades.map((u) => u.name),
      loadout: this.loadout?.map((u) => u.name),
    };
  }
}

/**
 * Represents a resolved @see RosterRecord.
 */
export class Roster {
  /**
   * Creates a roster by resolving a record in context of a catalog.
   *
   * @param record
   * @param catalog
   */
  static resolve(record: RosterRecord, catalog: Catalog): Roster {
    const units: Unit[] = [];
    for (const rUnit of record.units) {
      const cUnit = catalog.lookupUnit(rUnit.name, {
        title: rUnit.title,
        faction: record.faction,
      });
      if (cUnit) {
        const cUpgrades = rUnit.upgrades?.map((u) => catalog.lookupUpgrade(u));
        const cLoadout = rUnit.loadout?.map((u) => catalog.lookupUpgrade(u));
        units.push(
          new Unit(
            cUnit,
            (cUpgrades?.filter((u) => u) as UpgradeCard[] | undefined) || [],
            (cLoadout?.filter((u) => u) as UpgradeCard[] | undefined) || [],
          ),
        );
      }
    }
    return new Roster(
      record.name,
      record.faction,
      units,
      units.reduce(
        (a, c) =>
          a + c.card.points + c.upgrades.reduce((a, c) => a + c.points, 0),
        0,
      ),
    );
  }

  constructor(
    readonly name: string,
    readonly faction: Faction | undefined,
    readonly units: Unit[],
    readonly points: number,
  ) {}

  toRecord(): RosterRecord {
    return {
      name: this.name,
      faction: this.faction,
      units: this.units.map((u) => u.toRecord()),
    };
  }
}
