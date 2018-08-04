import units from './units';
import users from './users';
import positions from './positions';
import knowHow from './knowHow';

export default {
  users: users.map(user => ({
    ...user,
    unit: units.filter(unit => unit.id === user.unit)[0],
    position: positions.filter(position => position.id === user.position)[0],
    knowHow: knowHow.filter(kh => user.knowHow.indexOf(kh.id) !== -1),
    isChecked: false
  })),
  units,
  positions
};
