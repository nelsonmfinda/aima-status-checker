/**
 * Configuration type definitions
 */

export interface ProxyConfig {
  server: string;
  username?: string;
  password?: string;
}

export interface AimaCredentials {
  email: string;
  password: string;
}

export interface EmailConfig {
  apiKey: string;
  senderEmail: string;
  recipientEmail: string;
}

export interface AppDebugConfig {
  debug: boolean;
}

export interface AppConfig {
  aima: AimaCredentials;
  email: EmailConfig;
  proxy?: ProxyConfig;
  cronSecret?: string;
  debug: boolean;
}
