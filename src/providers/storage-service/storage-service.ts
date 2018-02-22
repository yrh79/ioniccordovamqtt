import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

export class Config {

  mqttserver: string;
  mqttport: number;
  username: string;
  password: string;

  constructor() {
    this.mqttserver = "";
    this.mqttport = 8083;
    this.username = "";
    this.password = "";
  }
}
/*
  Generated class for the StorageServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class StorageServiceProvider {

  private config: Config;

  constructor(private storage: Storage) {
    // console.log('Hello StorageServiceProvider Provider');
    this.config = new Config();
  }

  saveConfig(mqttserver: string, mqttport: number, username: string, password: string) {
    this.config = new Config();

    this.config.mqttserver = mqttserver;
    this.config.mqttport = mqttport;
    this.config.username = username;
    this.config.password = password;

    this.storage.set('config', this.config);
  }

  getConfig() {
    return this.storage.get('config').then((res) => {
      this.config = res == null ? new Config() : res; return this.config;
    });

  }

}
