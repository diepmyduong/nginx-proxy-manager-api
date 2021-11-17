export type ProxyHost = {
  id?: number;
  created_on?: Date;
  modified_on?: Date;
  owner_user_id?: number;
  domain_names?: string[];
  forward_host?: string;
  forward_port?: number;
  access_list_id?: number;
  certificate_id?: number;
  ssl_forced?: boolean;
  caching_enabled?: boolean;
  block_exploits?: boolean;
  advanced_config?: string;
  meta?: {
    letsencrypt_email?: string;
    letsencrypt_agree?: boolean;
    dns_challenge?: boolean;
    nginx_online?: boolean;
    nginx_err?: string;
  };
  allow_websocket_upgrade?: boolean;
  http2_support?: boolean;
  forward_scheme?: 'http' | 'https';
  enabled?: boolean;
  locations?: any[];
  hsts_enabled?: boolean;
  hsts_subdomains?: boolean;
  owner?: Owner;
  access_list?: any;
  certificate?: Certificate;
};

export type Location = {
  path: string;
  advanced_config: string;
  forward_scheme: 'http' | 'https';
  forward_host: string;
  forward_port: number;
};

export type Owner = {
  is_disabled: number;
  name: string;
  nickname: string;
  avatar: string;
};

export type Certificate = {
  id: number;
  created_on: Date;
  modified_on: Date;
  owner_user_id: 1;
  provider: 'letsencrypt';
  nice_name: string;
  domain_names: string[];
  expires_on: Date;
  meta: {
    letsencrypt_email: string;
    dns_challenge: boolean;
    dns_provider: string;
    dns_provider_credentials: string;
    letsencrypt_agree: boolean;
  };
  owner: Owner;
};
