import { Injectable } from '@nestjs/common';
import { Storage } from '@google-cloud/storage';
import { FileUpload } from 'graphql-upload';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { File } from './entities/file.entity';

let count = 0;
interface Ifile {
  files: FileUpload[];
}

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,
  ) {}
  //

  async upload({ files }: Ifile) {
    const fileImage = await this.fileRepository.findOne({
      order: {
        number: 'DESC',
      },
    });
    if (fileImage) {
      count = fileImage.number;
    }

    const storage = new Storage({
      keyFilename: 'tnh.json',
      projectId: 'awesome-tensor-353913',
    }).bucket('tnh');

    //일단 먼저 다 받기
    const waitedFiles = await Promise.all(files);

    //URL 을 고쳐줘야 gcp 에 잘 들어간다
    waitedFiles.forEach((el, i) => {
      if (el.filename === '') {
        waitedFiles.splice(i, 1);
      }
      const fix_file = el.filename.split('.');
      const data_type = fix_file[fix_file.length - 1];
      el.filename = `${count}.${data_type}`;
      count++;
    });

    const directory = await Promise.all(
      waitedFiles.map((el) => {
        return new Promise((resolve, reject) => {
          el.createReadStream()
            .pipe(storage.file(el.filename).createWriteStream()) //pipe 업로드를 하고 난 후 2차적인 작업을 하고 싶을때
            .on('finish', () => resolve(`awesome-tensor-353913/${el.filename}`))
            .on('error', () => reject());
        });
      }),
    ); //[file,file,file,file...]

    const URL = 'https://storage.googleapis.com/tnh/';

    const fixedURL = directory.map((e: string) => e.replace('tnh/', URL));
    const final_directory = directory.map((e: string) => e.replace('tnh/', ''));
    const results = ['GCPdirectory:', ...final_directory, 'URL:', ...fixedURL];

    for (let i = 0; i < fixedURL.length; i++) {
      await this.fileRepository.save({
        number: count,
        url: fixedURL[i],
      });
    }

    return results;
  }

  async delete({ files }) {
    const storage = new Storage({
      keyFilename: 'tnh.json',
      projectId: 'awesome-tensor-353913',
    }).bucket('tnh');

    try {
      await storage.file(files).delete();
      return 'deleted';
    } catch (error) {
      throw error;
    }
  }
}
