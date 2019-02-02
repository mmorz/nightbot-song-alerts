import { fetchNightbotId, checkSongQueue } from './nightbot.api';

const testId = '5a8afd44280d2872dd8f3b7f';

test('fetchNightbotId', async () => {
  const id = await fetchNightbotId('lirik');
  expect(id.length).toBeGreaterThan(5);

  const res = await fetchNightbotId('doesntexists');
  expect(res).toBeNull();
});

test('checkSongQueue', async () => {
  const queue = await checkSongQueue(testId, 'fakeusername');

  expect(queue.idForNotification).toBeNull();
  expect(queue.nextSongIsOurs).toBe(false);
});
