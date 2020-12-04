import { CatalogBuilder, DataBank } from '@retinue/databank';
import embeddedJson from '@retinue/databank/data.json';
import { Roster, RosterRecord } from '../src/index';

const catalog = (() => {
  const builder = new CatalogBuilder();
  const dataBank = embeddedJson as DataBank;
  builder.addData(dataBank);
  return builder.build();
})();

test('should resolve a roster', () => {
  const record: RosterRecord = {
    name: 'Roster',
    faction: 'Galactic Empire',
    units: [
      {
        name: 'Darth Vader',
        title: 'Dark Lord of the Sith',
      },
      {
        name: 'Stormtroopers',
        upgrades: ['DLT-19 Stormtrooper'],
      },
    ],
  };
  const roster = Roster.resolve(record, catalog);
  expect(roster.units[0].card.name).toEqual('Darth Vader');
  expect(roster.units[0].card.rank).toEqual('Commander');
  expect(roster.units[1].card.name).toEqual('Stormtroopers');
  expect(roster.units[1].upgrades[0].name).toEqual('DLT-19 Stormtrooper');

  // Original points without errata or adjustments.
  expect(roster.name).toEqual('Roster');
  expect(roster.points).toEqual(264);
});
