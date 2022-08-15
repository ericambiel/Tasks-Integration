import Buffer from 'buffer';
import fs from 'fs';
import { singleton } from 'tsyringe';
import path from 'path';

@singleton()
export default class FilesHandlerHelper {
  // TODO: Use path to verify correct S.O.
  async readFile(filePath: string): Promise<Buffer> {
    return new Promise<Buffer>((resolve, reject) => {
      fs.readFile(filePath, (err, data) => {
        if (err) reject(err);
        console.log(`Reading file: ${filePath}`);
        resolve(data);
      });
    });
  }

  // TODO: Use path to verify correct S.O.
  async readDir(filePath: string): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
      fs.readdir(filePath, (err, files) => {
        if (err) reject(err);
        console.log(`Reading files in: ${filePath}`);
        resolve(files);
      });
    });
  }

  // TODO: Use path to verify correct S.O.
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

  // TODO: Use path to verify correct S.O.
  async readJSONFilesInDir(filePath: string) {
    // Looking for files in directory
    const filesPath: string[] = await this.readDir(filePath);

    // Filter only json files
    const filteredJSONFilesPath = filesPath
      .filter(nameFile => path.extname(nameFile) === '.json')
      .map(nameFile => path.join(filePath, nameFile));

    return Promise.all(
      filteredJSONFilesPath.map(filterJSONFilePath =>
        // Read files and convert to JSON to Object
        this.readFile(filterJSONFilePath).then(data =>
          JSON.parse(data.toString()),
        ),
      ),
    );
  }
}
