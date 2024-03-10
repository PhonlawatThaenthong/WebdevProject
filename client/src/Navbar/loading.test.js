import React from 'react';
import renderer from 'react-test-renderer';
import LoadingIcon from './LoadingIcon';

test('renders LoadingIcon component', () => {
  const tree = renderer.create(<LoadingIcon />).toJSON();
  expect(tree).toMatchSnapshot();
});
