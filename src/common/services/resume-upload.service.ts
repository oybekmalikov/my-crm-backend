import { BadRequestException, Injectable } from "@nestjs/common";
import * as fs from "fs";
import { diskStorage } from "multer";
import * as path from "path";
import { extname } from "path";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class ResumeUploadService {
  private readonly uploadPath = "assets/resumes";

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
        // Allow PDF, DOC, and DOCX files
        const allowedMimeTypes = [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ];

        const allowedExtensions = [".pdf", ".doc", ".docx"];
        const fileExtension = extname(file.originalname).toLowerCase();

        if (
          !allowedMimeTypes.includes(file.mimetype) &&
          !allowedExtensions.includes(fileExtension)
        ) {
          return cb(
            new BadRequestException(
              "Only PDF, DOC, and DOCX files are allowed!",
            ),
            false,
          );
        }
        cb(null, true);
      },
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit for resume files
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
    return `/assets/resumes/${filename}`;
  }

  getFilePath(filename: string): string {
    return path.join(this.uploadPath, filename);
  }

  async saveResumeFile(
    file: Express.Multer.File,
  ): Promise<{ filename: string; originalName: string; fileUrl: string }> {
    if (!file) {
      throw new BadRequestException("No file uploaded");
    }

    const fileExtension = path.extname(file.originalname);
    const uniqueFilename = `${uuidv4()}${fileExtension}`;
    const filePath = path.join(this.uploadPath, uniqueFilename);
    fs.writeFileSync(filePath, file.buffer);

    return {
      filename: uniqueFilename,
      originalName: file.originalname,
      fileUrl: this.getFileUrl(uniqueFilename),
    };
  }
}
