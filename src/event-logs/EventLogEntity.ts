import {
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  RelationId,
} from 'typeorm';
import { Field, ObjectType, ID } from 'type-graphql';
import { EventEntity } from '../events/EventEntity';
import { addSeconds, isPast } from 'date-fns'

@Entity({ name: 'event_logs' })
@ObjectType()
export class EventLogEntity {
  @PrimaryGeneratedColumn()
  @Field(type => ID)
  id!: number;

  @Field(type => EventEntity)
  @ManyToOne(type => EventEntity, event => event.eventLogs)
  event: EventEntity;

  @Field()
  @RelationId((eventLog: EventLogEntity) => eventLog.event)
  eventId: number;

  @Column({ type: 'timestamptz' })
  windowStartAt: Date;

  @Column({ type: 'int' })
  windowCount: number;

  @Column({ type: 'boolean' })
  warningSent: boolean;

  addToWindow(): boolean {
    this.windowCount += 1
    return this.isWindowFull()
  }

  isWindowFull(): boolean {
    return !this.isWindowExpired() && this.windowCount > this.windowMaxCount()
  }

  isWindowExpired(): boolean {
    return isPast(this.windowEndAt())
  }

  windowEndAt(): Date {
    return addSeconds(this.windowStartAt, this.windowDuration())
  }

  windowDuration(): number {
    return process.env.EVENT_WINDOW_DURATION_SECONDS ? parseInt(process.env.EVENT_WINDOW_DURATION_SECONDS, 10) : 300
  }

  windowMaxCount(): number {
    return process.env.EVENT_WINDOW_MAX_COUNT ? parseInt(process.env.EVENT_WINDOW_MAX_COUNT, 10) : 5
  }

  resetWindow() {
    this.warningSent = false
    this.windowCount = 0;
    this.windowStartAt = new Date()
  }

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
