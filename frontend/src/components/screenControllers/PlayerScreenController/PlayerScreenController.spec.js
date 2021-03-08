import React from 'react';
import renderer from 'react-test-renderer';

import PlayerScreenController from './PlayerScreenController';

describe('Player screen controller', () => {
  describe('render', () => {
    it('renders correctly', () => {
      const tree = renderer.create(<PlayerScreenController />).toJSON();

      expect(tree).toMatchSnapshot();
    });
  });
});
