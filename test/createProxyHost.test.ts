import { nginx, waitForNginxReady } from './common';

export default test('Create Proxy Host', async () => {
  await waitForNginxReady(nginx);

  const result = await nginx.createProxyHosts({
    access_list_id: 0,
    advanced_config: `location = / { 
      proxy_pass http://$server:$port/ChoCuaU$request_uri; 
     }
     location ~ ^\\/(?!ChoCuaU|_next|graphql|api|assets|not-found-page|shop)(\\w+)(.*) {
     rewrite ^\\/(\\w+)[\\/]?(.*) /$2 permanent;
     } `,
    domain_names: ['chocuau.mcom.app'],
    forward_scheme: 'http',
    forward_host: '3mshop_dev',
    forward_port: 5555,
    allow_websocket_upgrade: true,
    block_exploits: false,
    caching_enabled: false,
    certificate_id: 119,
    ssl_forced: true,
    http2_support: true,
    hsts_enabled: false,
    hsts_subdomains: false,
    meta: {
      letsencrypt_agree: false,
      dns_challenge: false,
    },
    locations: [],
  });
  console.log('result', result);
});
