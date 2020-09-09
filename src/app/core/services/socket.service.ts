import { Injectable } from '@angular/core';

import * as SocketCluster from 'socketcluster-client';

import { AppService } from './app.service';
import { LoggerService } from './logger.service';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  public socket: any = null;

  constructor(
    public appService: AppService,
    public logger: LoggerService
  ) { }

  getSocket() {
    if (!this.socket) {
      this.socket = SocketCluster.connect({
        hostname: this.appService.getConfigParam('SOCKET_CLUSTER_HOST'),
        port: this.appService.getConfigParam('SOCKET_CLUSTER_PORT')
        // secure: true
      });
    }
    return this.socket;
  }

  subscribe(channelName, watchFn) {
    const channel = this.socket.subscribe(channelName, {});
    channel.watch(watchFn);
    return channel;
  }

  emit(socket, eventName, data, cb) {
    this.logger.log('SENDING > ', eventName, ' > data > ', data);
    socket.emit(eventName, data, cb);
  }

  unsubscribe(socket, channel) {
    try {
      this.logger.log('UNSUBSCRIBING FROM', channel.name);
      channel.unwatch();
      channel.unsubscribe();
      socket.unwatch(channel.name);
      socket.destroyChannel(channel.name);
    } catch (e) {  }
  }

  destroySocket() {
    try {
      this.socket.off();
      this.socket.disconnect();
      this.socket = null;
    } catch (e) {  }
  }
}
