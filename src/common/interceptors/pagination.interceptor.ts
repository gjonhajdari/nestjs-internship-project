import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class PaginationInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { page = 1, limit = 10 }: { page: number; limit: number } =
      request.query;

    const offset = (page - 1) * limit;
    return next.handle().pipe(
      map((data) => {
        const slicedData = data.slice(offset, offset + limit);

        const totalCount = data.length;
        const lastPage = Math.ceil(totalCount / limit);
        const currentPage = page;
        return {
          data: slicedData,
          totalCount,
          lastPage,
          currentPage,
        };
      }),
    );
  }
}
