import { nginx } from './common';
import path from 'path';

export default test('Create Custom Certificates', async () => {
  const result = await nginx.createCustomCertificates({
    name: 'thiemtanphat2',
    certificate: path.resolve('assets/cert.pem'),
    certificate_key: path.resolve('assets/cert.key'),
    intermediate_certificate: path.resolve('assets/ca.crt'),
  });
  console.log('result', result);
});
