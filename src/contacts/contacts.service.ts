import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ContactEntity } from './entities/contact.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ContactsService {
  constructor(
    @InjectRepository(ContactEntity)
    private readonly contactRepo: Repository<ContactEntity>,
  ) {}

  async create(createContactDto: CreateContactDto) {
    try {
      const contact = this.contactRepo.create(createContactDto);
      await this.contactRepo.save(contact);

      return contact;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAll(queries: { limit: number; page: number }) {
    try {
      if (isNaN(queries.limit)) {
        queries.limit = 100;
      }
      if (isNaN(queries.page)) {
        queries.page = 1;
      }

      const contacts = await this.contactRepo.find({
        take: queries.limit,
        skip: (queries.page - 1) * queries.limit,
      });

      return contacts;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findOne(id: number) {
    try {
      if (!id && id <= 0) {
        throw new NotFoundException('contact not found.');
      }

      const contact = await this.contactRepo.findOne({
        where: { id },
      });
      if (!contact) {
        throw new NotFoundException('contact not found.');
      }

      return contact;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async remove(id: number) {
    try {
      if (!id) {
        throw new NotFoundException('contact not found.');
      }

      const result = await this.contactRepo.delete(id);
      if (!result.affected) {
        throw new NotFoundException('contact not found.');
      }

      return { message: 'contact removed.' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }
}
