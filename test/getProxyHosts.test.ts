import { nginx, waitForNginxReady } from './common';

export default test('Nginx Proxy Manager', async () => {
  await waitForNginxReady(nginx);
  console.log('getProxyHosts');
  const hosts = await nginx.getProxyHosts();
  hosts.forEach(h => {
    if (h.certificate?.nice_name == '*.mcom.app') {
      console.log('host', h);
    }
  });
});
