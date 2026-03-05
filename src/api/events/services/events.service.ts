import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';

export type UiEvent = { type: string; data?: any };

@Injectable()
export class EventsService {
  private readonly subject = new Subject<UiEvent>();

  emit(event: UiEvent) {
    this.subject.next(event);
  }

  observable() {
    return this.subject.asObservable();
  }
}