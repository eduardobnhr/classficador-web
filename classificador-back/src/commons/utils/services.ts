import { HttpException, Injectable } from '@nestjs/common';
import * as os from 'os';

@Injectable()
export class ServicesUtils {
  static getLocalIp() {
    const interfaces = os.networkInterfaces();

    for (const name of Object.keys(interfaces)) {
      for (const iface of interfaces[name] || []) {
        if (iface.family === 'IPv4' && !iface.internal) {
          return iface.address;
        }
      }
    }

    return 'localhost';
  }

  public validateObjectConditions(conditions: {
    [key: string]: { validate: boolean; message: string; status: number };
  }) {
    Object.keys(conditions).forEach((key) => {
      if (conditions[key].validate) {
        throw new HttpException(
          conditions[key].message,
          conditions[key].status,
        );
      }
    });
  }
}
