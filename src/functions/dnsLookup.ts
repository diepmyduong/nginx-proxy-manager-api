import dns from 'dns';

export default async function dnsLookup(params: { domain: string }) {
  const { domain } = params;
  return new Promise<string>((resolve, reject) => {
    dns.lookup(domain, (err, address, _) => {
      if (err) {
        return reject(err);
      }
      console;
      resolve(address);
    });
  });
}
