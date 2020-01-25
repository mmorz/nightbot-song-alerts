import axios, { AxiosError } from "axios";

const NIGHTBOT_ID_API = "https://api.nightbot.tv/1/channels/t/";
const NIGHTBOT_QUEUE_URL = "https://api.nightbot.tv/1/song_requests/queue";

interface Channel {
  readonly _id: string;
}

interface IdSuccess {
  readonly channel: Channel;
}

export const fetchNightbotId = async (
  channel: string
): Promise<string | null> => {
  if (channel === "sentrymockerror") {
    throw new Error("sentry mocked error");
  }

  try {
    const { data } = await axios.get<IdSuccess>(NIGHTBOT_ID_API + channel);

    return data.channel._id;
  } catch (err) {
    if ((err as AxiosError).response?.status === 404) {
      console.warn("http 404 when fetchin id for", channel);
      return null;
    } else {
      throw err;
    }
  }
};

interface User {
  readonly name: string;
}

interface Song {
  readonly _id: string;
  readonly user: User;
}

interface QeueuResponse {
  readonly _currentSong?: Song;
  readonly queue: ReadonlyArray<Song>;
}

export interface NightbotStatus {
  readonly idForNotification: string | null;
  readonly nextSongIsOurs: boolean;
}

export const checkSongQueue = async (
  channelId: string,
  username: string
): Promise<NightbotStatus> => {
  const { data } = await axios.get<QeueuResponse>(NIGHTBOT_QUEUE_URL, {
    headers: {
      "nightbot-channel": channelId
    }
  });

  const id = data._currentSong ? data._currentSong._id : null;
  const currentName = data._currentSong ? data._currentSong.user.name : null;
  const nextName = data.queue.length ? data.queue[0].user.name : null;

  return {
    idForNotification:
      !!currentName && currentName.toLowerCase() === username ? id : null,
    nextSongIsOurs: !!nextName && nextName.toLowerCase() === username
  };
};
