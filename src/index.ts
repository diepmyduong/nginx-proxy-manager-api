import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import { TypedEmitter } from 'tiny-typed-emitter';

import concatBuffer from './functions/concatBuffer';
import dnsLookup from './functions/dnsLookup';
import { Certificate, ProxyHost } from './type';

interface NginxProxyManagerEvent {
  ready: () => any;
}

type Config = {
  host: string;
  username: string;
  password: string;
};
export default class NginxProxyManager extends TypedEmitter<
  NginxProxyManagerEvent
> {
  private _api: AxiosInstance;
  private _token: string = '';
  private _tokenExpired: Date = new Date();

  isReady: boolean = false;
  constructor(private _cfg: Config) {
    super();
    this._api = axios.create({
      baseURL: _cfg.host,
      headers: {
        // 'content-type': 'application/json',
      },
    });
    this._api.interceptors.response.use(
      response => response,
      error => {
        if (error?.response?.data?.error)
          if (error?.response?.data?.error.message) {
            throw Error(error?.response?.data?.error.message);
          } else {
            throw Error(error?.response?.data?.error);
          }
        console.log('request', error.request);
        throw error;
      }
    );
    this.getToken();
  }

  private async tokenHeader() {
    if (!this._token || this._tokenExpired < new Date()) {
      await this.getToken();
    }
    return {
      authorization: `Bearer ${this._token}`,
    };
  }

  private async getToken() {
    const result = await this._api.post('/api/tokens', {
      identity: this._cfg.username,
      secret: this._cfg.password,
    });
    this._token = result.data.token;
    this._tokenExpired = new Date(result.data.expires);
    this.isReady = true;
    this.emit('ready');
  }

  async getProxyHosts() {
    return await this._api
      .get('/api/nginx/proxy-hosts?expand=owner,access_list,certificate', {
        headers: await this.tokenHeader(),
      })
      .then(res => {
        return res.data as ProxyHost[];
      });
  }

  async createProxyHosts(data: ProxyHost) {
    return await this._api({
      method: 'post',
      url: `/api/nginx/proxy-hosts`,
      headers: await this.tokenHeader(),
      data,
    }).then(res => res.data as ProxyHost);
  }

  async deleteProxyHost(id: number) {
    return await this._api.delete('/api/nginx/proxy-hosts/' + id, {
      headers: await this.tokenHeader(),
    });
  }

  async getCertificates() {
    return await this._api
      .get('/api/nginx/certificates?expand=owner', {
        headers: await this.tokenHeader(),
      })
      .then(res => res.data as Certificate[]);
  }

  async validateCertificates(params: {
    certificate: string;
    certificate_key: string;
    intermediate_certificate: string;
  }) {
    const { certificate, certificate_key, intermediate_certificate } = params;
    console.log('params', params);
    var data = new FormData();
    data.append('certificate', fs.createReadStream(certificate), 'cert.pem');
    data.append(
      'certificate_key',
      fs.createReadStream(certificate_key),
      'cert.key'
    );
    data.append(
      'intermediate_certificate',
      fs.createReadStream(intermediate_certificate),
      'ca.crt'
    );
    const concatenated = await concatBuffer(data);

    const config: AxiosRequestConfig = {
      method: 'post',
      url: '/api/nginx/certificates/validate',
      headers: {
        ...(await this.tokenHeader()),
        ...data.getHeaders(),
      },
      data: concatenated,
    };

    return await this._api(config).then(res => res.data);
  }

  async deleteCertificate(id: number) {
    return await this._api.delete('/api/nginx/certificates/' + id, {
      headers: await this.tokenHeader(),
    });
  }

  async createCustomCertificates(params: {
    name: string;
    certificate: string;
    certificate_key: string;
    intermediate_certificate: string;
  }) {
    const {
      name,
      certificate,
      certificate_key,
      intermediate_certificate,
    } = params;
    const cert = await this._api({
      method: 'post',
      url: `/api/nginx/certificates`,
      headers: await this.tokenHeader(),
      data: { nice_name: name, provider: 'other' },
    }).then(res => res.data as Certificate);

    try {
      await this.uploadCertificates({
        id: cert.id,
        certificate,
        certificate_key,
        intermediate_certificate,
      });
    } catch (err) {
      await this.deleteCertificate(cert.id).catch(err =>
        console.log('delete error', err.message)
      );
    }
    return cert;
  }

  async uploadCertificates(params: {
    id: number;
    certificate: string;
    certificate_key: string;
    intermediate_certificate: string;
  }) {
    const {
      id,
      certificate,
      certificate_key,
      intermediate_certificate,
    } = params;
    var data = new FormData();
    data.append('certificate', fs.createReadStream(certificate), 'cert.pem');
    data.append(
      'certificate_key',
      fs.createReadStream(certificate_key),
      'cert.key'
    );
    data.append(
      'intermediate_certificate',
      fs.createReadStream(intermediate_certificate),
      'ca.crt'
    );

    const concatenated = await concatBuffer(data);

    return await this._api({
      method: 'post',
      url: `/api/nginx/certificates/${id}/upload`,
      headers: {
        ...(await this.tokenHeader()),
        ...data.getHeaders(),
      },
      data: concatenated,
    }).then(res => res.data);
  }
}

export const DNSLookup = dnsLookup;
