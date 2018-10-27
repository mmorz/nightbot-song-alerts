import {
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
import { delay } from 'redux-saga';

import {
  addChannel,
  startPollingChannels,
  removeChannel,
  createNotification,
} from './notification.ducks';
import { fetchNightbotId, checkSongQueue } from './nightbot.api';

function* pollChannel(channel) {
  const id = yield call(fetchNightbotId, channel);
  if (!id) {
    console.error('skipping polling because couldnt find id...');
    return;
  }

  while (true) {
    const username = yield select(state => state.get('username'));
    let pollInterval = 60 * 1000;

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

      if (idForNotification) {
        yield put(createNotification({ id: idForNotification, channel }));
      }

      pollInterval = nextSongIsOurs ? 5 * 1000 : 60 * 1000;
    } catch (e) {
      console.error('error polling:', e);
    } finally {
      yield call(delay, pollInterval);
    }
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
    const { payload: removedChannel } = yield take(removeChannel);

    if (removedChannel === channel) {
      yield cancel(task);
      break;
    }
  }
}

function* addSingleChannel({ payload }) {
  yield fork(startWatchingChannel, payload);
}

function* pollChannels({ payload }) {
  for (const channel of payload) {
    yield fork(startWatchingChannel, channel);
  }
}

function* main() {
  yield all([
    yield takeEvery(addChannel, addSingleChannel),
    yield takeEvery(startPollingChannels, pollChannels),
  ]);
}

export default main;
