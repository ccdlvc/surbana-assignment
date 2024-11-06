import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

const window = new JSDOM('').window;
const purify = DOMPurify(window);

@Injectable()
export class SanitizeMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (req.body) {
      req.body = this.sanitizeObject(req.body);
    }
    next();
  }

  private sanitizeObject(obj: any) {
    for (const key in obj) {
      if (obj[key] && typeof obj[key] === 'object') {
        obj[key] = this.sanitizeObject(obj[key]);
      } else if (typeof obj[key] === 'string') {
        obj[key] = purify.sanitize(obj[key]);
      }
    }
    return obj;
  }
}
