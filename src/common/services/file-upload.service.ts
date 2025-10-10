import { BadRequestException, Injectable } from "@nestjs/common";
import * as fs from "fs";
import { diskStorage } from "multer";
import * as path from "path";
import { extname } from "path";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class FileUploadService {
  private readonly uploadPath = "assets/user-profile-images";
  constructor() {
    this.ensureUploadDirectory();
  }
  private ensureUploadDirectory() {
    if (!fs.existsSync(this.uploadPath)) {
      fs.mkdirSync(this.uploadPath, { recursive: true });
    }
  }
  getMulterConfig() {
    return {
      storage: diskStorage({
        destination: (req, file, cb) => {
          cb(null, this.uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueName = `${uuidv4()}${extname(file.originalname)}`;
          cb(null, uniqueName);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/^image\/(jpg|jpeg|png|gif|webp)$/)) {
          return cb(
            new BadRequestException("Only image files are allowed!"),
            false,
          );
        }
        cb(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    };
  }
  async deleteFile(filename: string): Promise<void> {
    const filePath = path.join(this.uploadPath, filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
  getFileUrl(filename: string): string {
    return `/assets/user-profile-images/${filename}`;
  }
  getFilePath(filename: string): string {
    return path.join(this.uploadPath, filename);
  }
}
