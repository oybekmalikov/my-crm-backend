import { Module } from "@nestjs/common";
import { FileUploadService } from "./services/file-upload.service";
import { ResumeUploadService } from "./services/resume-upload.service";

@Module({
  providers: [FileUploadService, ResumeUploadService],
  exports: [FileUploadService, ResumeUploadService],
})
export class CommonModule {}
