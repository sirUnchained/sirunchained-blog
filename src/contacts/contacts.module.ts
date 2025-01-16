import { Module } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { ContactsController } from './contacts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactEntity } from './entities/contact.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ContactEntity])],
  controllers: [ContactsController],
  providers: [ContactsService],
})
export class ContactsModule {}
