import Buffer from 'buffer';
import fs from 'fs';
import { singleton } from 'tsyringe';

@singleton()
export default class FilesHandlerHelper {
  async readFile(filePath: string): Promise<Buffer> {
    return new Promise<Buffer>((resolve, reject) => {
      fs.readFile(filePath, (err, data) => {
        if (err) reject(err);
        console.log(`Reading file: ${filePath}`);
        resolve(data);
      });
    });
  }

  async writeFile(filePath: string, data: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      fs.writeFile(filePath, data, err => {
        if (err) reject(err);
        console.log(`File are storing to: ${filePath}`);
        resolve();
      });
    }).catch(err => {
      throw new Error(`Error in write to a file: ${err}`);
    });
  }
}
