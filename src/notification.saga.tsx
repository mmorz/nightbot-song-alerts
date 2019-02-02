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

import { delay } from 'redux-saga';

import { actions, Store } from './notification.ducks';
import { fetchNightbotId, checkSongQueue } from './nightbot.api';

function* storeSelect(selector: (a: Store) => any) {
  return select<Store>(selector);
}

function* pollChannel(channel) {
  const id = yield call(fetchNightbotId, channel);
  if (!id) {
    console.error('skipping polling because couldnt find id...');
    new Notification('Cannot find song requests for ' + channel);
    return;
  }

  while (true) {
    const username = yield storeSelect(state => state.username);
    let pollInterval = 60 * 1000;

    const oldNotifications = yield storeSelect(state =>
      state.oldNotifications
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
        yield put(actions.createNotification({ id: idForNotification, channel }));
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

function* startWatchingChannel(channel: string) {
  const task = yield fork(startPollingChannel, channel);

  while (true) {
    const { remove } = yield race({
      remove: take(actions.removeChannel),
      toggleEnable: take(actions.toggleNotifications),
    });

    const isEnabled = yield storeSelect(state => state.enabled);
    const removedThis = remove && remove.payload === channel;

    if (!isEnabled || removedThis) {
      yield cancel(task);
    }
  }
}

function* watchForNewChannel({ payload: channel } : { payload: string, type: string }) {
  const enabled = yield storeSelect(state => state.enabled);

  if (enabled) {
    yield call(forkChannels, { payload: [channel] });
  }
}

function* forkChannels({ payload: channels }: { type: string, payload: string[] }) {
  for (const channel of channels) {
    yield fork(startWatchingChannel, channel);
  }
}

function* watchNotification() {
  while (true) {
    const { payload } = yield take(actions.createNotification);
    new Notification(
      `channel ${payload.get('channel')} is now playing your song!`,
    );
  }
}

function* watchEnable() {
  while (true) {
    yield take(actions.toggleNotifications);
    const isEnabled = yield select<Store>(state => state.enabled);

    if (isEnabled) {
      const channels = yield select<Store>(state => state.channels);

      yield fork(forkChannels, { payload: channels });
    }
  }
}

function* main() {
  yield all([
    call(watchEnable),
    takeEvery(actions.addChannel, watchForNewChannel),
    takeEvery(actions.startPollingChannels, forkChannels),
    call(watchNotification),
  ]);
}

export default main;
