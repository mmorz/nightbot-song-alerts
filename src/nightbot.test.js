import { strict as assert } from 'assert';
import { fetchNightbotId, checkSongQueue } from './nightbot.api';

const testId = '5a8afd44280d2872dd8f3b7f';

test('fetchNightbotId', async () => {
  const id = await fetchNightbotId('lirik');
  assert(id.length > 5);

  const res = await fetchNightbotId('doesntexists');
  assert(res === null);
});

test('checkSongQueue', async () => {
  const queue = await checkSongQueue(testId, 'fakeusername');

  assert(queue.get('nextSongIsOurs') === false);
  assert(queue.get('idForNotification') === null);
});
