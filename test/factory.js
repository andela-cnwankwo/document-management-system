import factoryGirl from 'factory-girl';
import faker from 'faker';
import bluebird from 'bluebird';
import User from '../app/models/User';

const factory = factoryGirl.promisify(bluebird);

factory.define('user', User, {
  firstname: () => faker.name.firstName(),
  lastname: () => faker.name.lastName(),
  username: () => faker.internet.userName(),
  password: () => faker.internet.password(),
  role: () => 'regular' || 'admin',
});

export default factory;
