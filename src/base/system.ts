import {ApiConnection} from '../common/connection.ts';
import {joinUrl} from '../common/utils.ts';
import type {
  backupStatus,
  debugStatus,
  systemStatus,
  memUsage,
  updateStatus,
  versionFile,
} from '../common/types.ts';

export class ManagerSystem extends ApiConnection {
  constructor(baseUrl: string) {
    super(joinUrl(baseUrl, `v2/system`));
  }

  /**
   * Get system information
   *
   * @returns Information about the software on the system
   */
  async info(): Promise<versionFile> {
    return await this.get<versionFile>('info');
  }

  async getHiddenServiceUrl(): Promise<string> {
    return (await this.get<{url: string}>('dashboard-hidden-service')).url;
  }

  async domain(): Promise<string | undefined> {
    return (await this.get<{url: string | undefined}>('dashboard-domain')).url;
  }


  async getUpdate(): Promise<false | versionFile> {
    const data = await this.get<{update: versionFile | string}>(
      'get-update-details',
    );
    return typeof data.update === 'string' ? false : data.update;
  }

  async startUpdate(): Promise<void> {
    await this.post('update');
  }

  async startQuickUpdate(): Promise<void> {
    await this.post('quick-update');
  }

  updateStatus() {
    return this.get<updateStatus>('update-status');
  }

  async backupStatus(): Promise<backupStatus> {
    return await this.get<backupStatus>('backup-status');
  }

  async debugResult(): Promise<debugStatus> {
    return await this.get<debugStatus>('debug-result');
  }

  async debug(): Promise<debugStatus> {
    return await this.post<debugStatus>('debug');
  }

  async shutdown(): Promise<systemStatus> {
    return await this.post<systemStatus>('shutdown');
  }

  async reboot(): Promise<systemStatus> {
    return await this.post<systemStatus>('reboot');
  }

  async storage(): Promise<memUsage> {
    return await this.get<memUsage>('storage');
  }

  async memory(): Promise<memUsage> {
    return await this.get<memUsage>('memory');
  }

  async temperature(): Promise<number> {
    return (await this.get<{temperature: number}>('temperature')).temperature;
  }

  async uptime(): Promise<number> {
    return (await this.get<{uptime: number}>('uptime')).uptime;
  }

  async disk(): Promise<'unknown' | 'nvme'> {
    return (await this.get<{externalStorage: 'unknown' | 'nvme'}>('disk-type'))
      .externalStorage;
  }

  async getUpdateChannel(): Promise<string> {
    return (await this.get<{channel: string}>('update-channel')).channel;
  }

  setUpdateChannel(channel: string): Promise<void> {
    return this.put('update-channel', {
      channel,
    });
  }

  async isCitadelOS(): Promise<boolean> {
    return (
      (await this.get<{os: 'Citadel OS' | 'unknown'}>('/')).os === 'Citadel OS'
    );
  }

  async i2pCredentials() {
    return await this.get<{
      username: string;
      password: string;
    }>('i2p');
  }
}
