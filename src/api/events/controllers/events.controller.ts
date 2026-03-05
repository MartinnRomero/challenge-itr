import { Controller, Sse } from '@nestjs/common';
import { map } from 'rxjs/operators';
import { EventsService } from '../services/events.service';

@Controller('events')
export class EventsController {
  constructor(private readonly events: EventsService) {}

  @Sse()
  stream() {
    return this.events.observable().pipe(
      map((evt) => ({ data: evt }))
    );
  }
}