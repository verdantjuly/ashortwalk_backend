import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ReportRepository } from '../repositories/reports.repository';
import { CreateReportDto } from '../dto/create-report.dto';
import { ReportEntity } from '../entities';
import { HttpService } from '@nestjs/axios';

import { firstValueFrom } from 'rxjs';

@Injectable()
export class ReportService {
  constructor(
    private readonly reportsRepository: ReportRepository,
    private readonly httpService: HttpService,
  ) {}

  async createReport(
    userId: string,
    createReportDto: CreateReportDto,
  ): Promise<ReportEntity> {
    return await this.reportsRepository.createReport(userId, createReportDto);
  }

  async deleteReport(
    authorization: string,
    reportId: string,
  ): Promise<boolean> {
    const report = await this.reportsRepository.findReport(reportId);
    const { contentType, contentId } = report;
    try {
      const response = await firstValueFrom(
        this.httpService.delete(
          `http://127.0.0.1:8000/api/${contentType}/${contentId}`,
          {
            headers: {
              Authorization: authorization,
              'Content-Type': 'application/json',
            },
          },
        ),
      );
      if (response.status >= 300) {
        throw new BadRequestException();
      }
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }
    return await this.reportsRepository.deleteReport(reportId);
  }
}
