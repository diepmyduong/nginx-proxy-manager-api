import { DNSLookup } from '../src';

export default test('DNS Lookup', async () => {
  const hostname = '3mshop.s1.mcom.app';

  const result = await DNSLookup({ domain: hostname });
  console.log('result', result);
});
