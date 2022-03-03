import common from './common';

it('Strings normalization', () => {
  expect(common.normalize('Hubert Félix Thiéfaine'))
      .toBe('hubertfelixthiefaine');
});
