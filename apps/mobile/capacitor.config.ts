import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.dnaxi.com',
  appName: 'dnaxi',
  webDir: 'dist',
  server: {
    cleartext:true,
    url: 'http://192.168.100.16:3000/'
  }
};

export default config;
