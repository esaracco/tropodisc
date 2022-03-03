import {extractStyles} from './discogs';

it('Styles extractions', () => {
  expect(extractStyles({
    123: {styles: ['Pop', 'Rock']},
    456: {styles: ['Classic']},
    789: {styles: ['Folk']},
  }))
      .toEqual(['Classic', 'Folk', 'Pop', 'Rock']);
});
