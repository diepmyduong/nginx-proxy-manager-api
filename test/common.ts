import NginxProxyManager from '../src';
import dotenv from 'dotenv';
dotenv.config();

export const nginx = new NginxProxyManager({
  host: 'https://dns.mcom.app',
  username: process.env.USERNAME || 'admin',
  password: process.env.PASSWORD || 'admin',
});

export function waitForNginxReady(nginx: NginxProxyManager) {
  if (nginx.isReady) return;
  return new Promise(resolve => {
    nginx.on('ready', () => {
      console.log('nginx ready');
      resolve(true);
    });
  });
}
