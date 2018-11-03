import axios from 'axios';
import { fromJS, Map } from 'immutable';

const NIGHTBOT_ID_API = 'https://api.nightbot.tv/1/channels/t/';
const NIGHTBOT_QUEUE_URL = 'https://api.nightbot.tv/1/song_requests/queue';

axios.interceptors.response.use(
  response => fromJS(response),
  error => Promise.reject(error),
);

export const fetchNightbotId = async channel => {
  try {
    const { data } = await axios.get(NIGHTBOT_ID_API + channel);

    return data.getIn(['channel', '_id']);
  } catch ({ response }) {
    console.error('response', response);
    if (response.status === 404) {
      console.error('http 404 when fetchin id for', channel);
    } else {
      console.error('error fetchin channel', channel, response);
    }
  }

  return null;
};

export const checkSongQueue = async (channelId, username) => {
  try {
    const { data } = await axios.get(NIGHTBOT_QUEUE_URL, {
      headers: {
        'nightbot-channel': channelId,
      },
    });

    const _id = data.getIn(['_currentSong', '_id']);
    const currentName = data.getIn(['_currentSong', 'user', 'name']);
    const nextName = data.getIn(['queue', 0, 'user', 'name']);

    return Map({
      idForNotification:
        !!currentName && currentName.toLowerCase() === username ? _id : null,
      nextSongIsOurs: !!nextName && nextName.toLowerCase() === username,
    });
  } catch (e) {
    console.error('e', e);
    return null;
  }
};
