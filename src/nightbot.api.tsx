import axios from 'axios';

const NIGHTBOT_ID_API = 'https://api.nightbot.tv/1/channels/t/';
const NIGHTBOT_QUEUE_URL = 'https://api.nightbot.tv/1/song_requests/queue';

export const fetchNightbotId = async (channel: string) => {
  try {
    const { data } = await axios.get(NIGHTBOT_ID_API + channel);

    return data.channel._id;
  } catch ({ response }) {
    if (response.status === 404) {
      console.error('http 404 when fetchin id for', channel);
    } else {
      console.error('error fetchin channel', channel, response);
    }
  }

  return null;
};

interface User {
  name: string;
}

interface Song {
  _id: string;
  user: User;
}

interface QeueuResponse {
  _currentSong?: Song;
  queue: Song[];
}

export const checkSongQueue = async (channelId: string, username: string) => {
  const { data } = await axios.get<QeueuResponse>(NIGHTBOT_QUEUE_URL, {
    headers: {
      'nightbot-channel': channelId,
    },
  });

  const _id = data._currentSong ? data._currentSong._id : null;
  const currentName = data._currentSong ? data._currentSong.user.name : null;
  const nextName = data.queue[0].user.name;

  return {
    idForNotification:
      !!currentName && currentName.toLowerCase() === username ? _id : null,
    nextSongIsOurs: !!nextName && nextName.toLowerCase() === username,
  };
};
