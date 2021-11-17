import { nginx, waitForNginxReady } from './common';
import path from 'path';

export default test('Validate Certificate', async () => {
  await waitForNginxReady(nginx);

  const result = await nginx.validateCertificates({
    certificate: path.resolve('assets/cert.pem'),
    certificate_key: path.resolve('assets/cert.key'),
    intermediate_certificate: path.resolve('assets/ca.crt'),
  });
  console.log('result', result);
});
