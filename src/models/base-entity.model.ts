import {Entity, property} from '@loopback/repository';


export abstract class BaseEntity extends Entity {

  @property({
    id: true,
    type: 'String',
    required: false,
    index: {unique: true},
    // settings below are needed
    generated: true,
    useDefaultIdType: false,
    postgresql: {
      dataType: 'uuid',
    },
  })
  id?: string;

  @property({
    type: 'date',
    default: () => new Date(),
  })
  createdOn?: Date;

  @property({
    type: 'date',
    default: () => new Date(),
    jsonSchema: {
      nullable: true,
    },
  })
  updatedOn?: Date;

}
