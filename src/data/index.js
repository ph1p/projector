import unitsData from './units';
import usersData from './users';
import positionsData from './positions';
import knowHowData from './knowHow';

const mappedUsers = usersData.map(user => ({
  ...user,
  unit: unitsData.filter(unit => unit.id === user.unit)[0],
  position: positionsData.filter(position => position.id === user.position)[0],
  knowHow: knowHowData.filter(kh => user.knowHow.indexOf(kh.id) !== -1),
  isChecked: false
}));

export const users = mappedUsers;
export const units = unitsData;
export const positions = positionsData;

export default {
  users,
  units,
  positions
};
