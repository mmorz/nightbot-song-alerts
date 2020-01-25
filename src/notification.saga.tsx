// https://github.com/redux-saga/redux-saga/issues/1504
/* tslint:disable:no-unsafe-any */

import {
  all,
  call,
  cancel,
  cancelled,
  delay,
  fork,
  put,
  race,
  select,
  take,
  takeEvery
} from "redux-saga/effects";

import { ActionType } from "typesafe-actions";

import { checkSongQueue, fetchNightbotId } from "./nightbot.api";
import { actions } from "./notification.ducks";
import { Store } from "./notification.types";

function* storeSelect(selector: (a: Store) => unknown) {
  const storeItem = yield select(selector);

  return storeItem;
}

function* pollChannel(channel: string) {
  const id: string = yield call(fetchNightbotId, channel);
  if (!id) {
    console.warn("skipping polling because couldnt find id...");

    // tslint:disable-next-line
    new Notification("Cannot find song requests for " + channel);
    return;
  }

  while (true) {
    const username = yield storeSelect(state => state.username);
    let pollInterval = 60 * 1000;

    const oldNotifications = yield storeSelect(state => state.oldNotifications);

    const { idForNotification, nextSongIsOurs } = yield call(
      checkSongQueue,
      id,
      username
    );
    console.log(
      `poll for ${channel}: next: ${nextSongIsOurs}, idfornotif: ${idForNotification}`  // tslint:disable-line
    );

    if (idForNotification && !oldNotifications.includes(idForNotification)) {
      yield put(
        actions.createNotification({ id: idForNotification, channel })
      );
    }

    pollInterval = nextSongIsOurs ? 5 * 1000 : 60 * 1000;

    yield delay(pollInterval);
  }
}

function* startPollingChannel(channel: string) {
  try {
    console.log("started polling for:", channel);
    yield call(pollChannel, channel);
  } finally {
    if (yield cancelled()) {
      console.log("ended polling", channel);
    }
  }
}

function* startWatchingChannel(channel: string) {
  const task = yield fork(startPollingChannel, channel);

  while (true) {
    const { remove } = yield race({
      remove: take(actions.removeChannel),
      toggleEnable: take(actions.toggleNotifications)
    });

    const isEnabled = yield storeSelect(state => state.enabled);
    const removedThis = remove && remove.payload === channel;

    if (!isEnabled || removedThis) {
      yield cancel(task);
    }
  }
}

function* watchForNewChannel({
  payload: channel
}: ActionType<typeof actions.addChannel>) {
  const enabled = yield storeSelect(state => state.enabled);
  if (enabled) {
    yield call(forkChannels, actions.startPollingChannels([channel]));
  }
}

function* forkChannels({
  payload: channels
}: ActionType<typeof actions.startPollingChannels>) {
  for (const channel of channels) {
    yield fork(startWatchingChannel, channel);
  }
}

function* watchNotification() {
  while (true) {
    const { payload } = yield take(actions.createNotification);

    // tslint:disable-next-line
    new Notification(
      `channel ${payload.get("channel")} is now playing your song!`
    );
  }
}

function* watchEnable() {
  while (true) {
    yield take(actions.toggleNotifications);
    const isEnabled = yield storeSelect(state => state.enabled);

    if (isEnabled) {
      const channels = yield storeSelect(state => state.channels);

      yield fork(forkChannels, actions.startPollingChannels(channels));
    }
  }
}

function* main() {
  yield all([
    call(watchEnable),
    takeEvery(actions.addChannel, watchForNewChannel),
    takeEvery(actions.startPollingChannels, forkChannels),
    call(watchNotification)
  ]);
}

export default main;
