import models from '../models';

export async function CleanUp() {
  console.info('Cleaning');

  let transaction = await models.sequelize.transaction({ autocommit: false });
  var options = { raw: true, transaction, };
  await models.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, options);
  await models.SubEvent.truncate({}, {transaction});
  await models.Event.truncate({}, {transaction});
  await models.Team.truncate({}, {transaction});
  await models.Game.truncate({}, {transaction});
  await models.Player.truncate({}, {transaction});
  await models.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, options);
  await transaction.commit();
}

export async function Sync(force) {
  try {
    return await models.sequelize.sync({ force });
  } catch (err) {
    console.error('Something went wrong', err);
  }
}

export async function AddUser(user) {
  return await models.Player.findOrCreate({
    where: { id: user.id },
    defaults: user
  });
}

export async function AddEvent(event) {
  try {
    let [result, created] = await models.Event.findOrCreate({
      where: { league: event.league, division: event.division },
      defaults: event
    });
    return result;
  } catch (err) {
    console.error('Something went wrong', err);
  }
}

export async function AddEvents(events) {
  console.debug(`Importing ${events.length} events`);
  return await models.Event.bulkCreate(events, { ignoreDuplicates: true });
}

export async function AddSubEvent(event) {
  try {
    let [result, created] = await models.SubEvent.findOrCreate({
      where: { id: event.id ? event.id : null },
      defaults: event
    });
    return result;
  } catch (err) {
    console.error('Something went wrong', err);
  }
}

export async function AddUsers(users) {
  console.debug(`Importing ${users.length} players`);
  return await models.Player.bulkCreate(users, { ignoreDuplicates: true });
}

export async function AddGames(games) {
  try {
    return await models.Game.bulkCreate(games, {
      ignoreDuplicates: true
    });
  } catch (err) {
    console.error('Something went wrong', err);
  }
}

export async function GetUser(id) {
  return await models.Player.findByPk(id);
}
