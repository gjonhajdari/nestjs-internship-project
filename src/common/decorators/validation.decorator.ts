import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import AppDataSource from '../db/dataSource/data-source.initialize';

export function SameAs(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: 'SameAs',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const relatedValue = (args.object as any)[args.constraints[0]];
          return value === relatedValue;
        },
      },
    });
  };
}

@ValidatorConstraint({ name: 'customIsUnique', async: false })
export class IsUnique implements ValidatorConstraintInterface {
  async validate(field: string, args: ValidationArguments) {
    const entity = args.constraints[0];
    const column = args.property;
    const count = await AppDataSource.getRepository(entity).count({
      where: { [column]: field },
    });
    if (count === 0) return true;
    return false;
  }
  defaultMessage(args: ValidationArguments) {
    return '$property already exists';
  }
}
