import React from 'react';
import ReactDOM from 'react-dom';
import { UserGames } from './UserGames';
it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<UserGames player={{ fullName: 'Glenn', id: 123 }} games={[]}/>, div);
});