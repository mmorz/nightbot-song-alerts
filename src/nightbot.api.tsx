import axios from 'axios';

const NIGHTBOT_ID_API = 'https://api.nightbot.tv/1/channels/t/';
const NIGHTBOT_QUEUE_URL = 'https://api.nightbot.tv/1/song_requests/queue';

export const fetchNightbotId = async (channel: string) => {
  try {
    const { data } = await axios.get(NIGHTBOT_ID_API + channel);

    return data.channel._id;
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

export const checkSongQueue = async (channelId: string, username: string) => {
  try {
    const { data } = await axios.get(NIGHTBOT_QUEUE_URL, {
      headers: {
        'nightbot-channel': channelId,
      },
    });

    const _id = data._currentSong._id;
    const currentName = data._currentSong.user.name;
    const nextName = data.queue[0].user.name;

    return {
      idForNotification:
        !!currentName && currentName.toLowerCase() === username ? _id : null,
      nextSongIsOurs: !!nextName && nextName.toLowerCase() === username,
    };

  } catch (e) {
    console.error('e', e);
    return null;
  }
};
