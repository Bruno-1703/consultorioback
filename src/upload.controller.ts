import { Controller, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { File as MulterFile } from 'multer';

@Controller('upload')
export class UploadController {
  @Post('estudio-images')
  @UseInterceptors(
    FileFieldsInterceptor(
      [{ name: 'images', maxCount: 10 }],
      {
        storage: diskStorage({
          destination: './uploads/estudios',
          filename: (req, file, cb) => {
            const uniqueSuffix =
              Date.now() + '-' + Math.round(Math.random() * 1e9);
            cb(null, uniqueSuffix + extname(file.originalname));
          },
        }),
      },
    ),
  )
  uploadEstudioImages(
    @UploadedFiles() files: { images?: MulterFile[] },
  ) {
    return {
      images: files.images?.map(f => f.filename) || [],
    };
  }
}
