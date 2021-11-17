import { nginx, waitForNginxReady } from './common';

export default test('Get Certificates', async () => {
  await waitForNginxReady(nginx);

  const result = await nginx.getCertificates();
  result.forEach(c => console.log('ssl', c.nice_name));
});
