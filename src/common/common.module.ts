import { Module } from "@nestjs/common";
import { FileUploadService } from "./services/file-upload.service";
import { ResumeUploadService } from "./services/resume-upload.service";
import { EmailService } from "./services/email.service";

@Module({
  providers: [FileUploadService, ResumeUploadService, EmailService],
  exports: [FileUploadService, ResumeUploadService, EmailService],
})
export class CommonModule {}
