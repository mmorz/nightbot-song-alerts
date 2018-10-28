import {
  race,
  put,
  cancel,
  takeEvery,
  call,
  all,
  fork,
  take,
  cancelled,
  select,
} from 'redux-saga/effects';
import { Map } from 'immutable';
import { delay } from 'redux-saga';

import {
  addChannel,
  startPollingChannels,
  removeChannel,
  createNotification,
  toggleNotifications,
} from './notification.ducks';
import { fetchNightbotId, checkSongQueue } from './nightbot.api';

function* pollChannel(channel) {
  const id = yield call(fetchNightbotId, channel);
  if (!id) {
    console.error('skipping polling because couldnt find id...');
    new Notification('Cannot find song requests for ' + channel);
    return;
  }

  while (true) {
    const username = yield select(state => state.get('username'));
    let pollInterval = 60 * 1000;

    const oldNotifications = yield select(state =>
      state.get('oldNotifications'),
    );

    try {
      const { idForNotification, nextSongIsOurs } = yield call(
        checkSongQueue,
        id,
        username,
      );
      console.log(
        // eslint-disable-next-line
        `poll for ${channel}: next: ${nextSongIsOurs}, idfornotif: ${idForNotification}`
      );

      if (idForNotification && !oldNotifications.has(idForNotification)) {
        yield put(createNotification(Map({ id: idForNotification, channel })));
      }

      pollInterval = nextSongIsOurs ? 5 * 1000 : 60 * 1000;
    } catch (e) {
      console.error('error polling:', channel, e);
    }

    yield call(delay, pollInterval);
  }
}

function* startPollingChannel(channel) {
  try {
    console.log('started polling for:', channel);
    yield call(pollChannel, channel);
  } finally {
    if (yield cancelled()) {
      console.log('ended polling', channel);
    }
  }
}

function* startWatchingChannel(channel) {
  const task = yield fork(startPollingChannel, channel);

  while (true) {
    const { remove } = yield race({
      remove: take(removeChannel),
      toggleEnable: take(toggleNotifications),
    });

    const isEnabled = yield select(state => state.get('enabled'));
    const removedThis = remove && remove.payload === channel;

    if (!isEnabled || removedThis) {
      yield cancel(task);
    }
  }
}

function* watchForNewChannel({ payload: channel }) {
  const enabled = yield select(state => state.get('enabled'));

  if (enabled) {
    yield call(forkChannels, Map({ payload: [channel] }));
  }
}

function* forkChannels({ payload: channels }) {
  for (const channel of channels) {
    yield fork(startWatchingChannel, channel);
  }
}

function* watchNotification() {
  while (true) {
    const { payload } = yield take(createNotification);
    new Notification(
      `channel ${payload.get('channel')} is now playing your song!`,
    );
  }
}

function* watchEnable() {
  while (true) {
    yield take(toggleNotifications);
    const isEnabled = yield select(state => state.get('enabled'));

    if (isEnabled) {
      const channels = yield select(state => state.get('channels'));

      yield fork(forkChannels, Map({ payload: channels }));
    }
  }
}

function* main() {
  yield all([
    call(watchEnable),
    takeEvery(addChannel, watchForNewChannel),
    takeEvery(startPollingChannels, forkChannels),
    call(watchNotification),
  ]);
}

export default main;
