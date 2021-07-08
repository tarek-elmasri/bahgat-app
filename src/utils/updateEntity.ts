import { EntityTarget, FindConditions, getConnection } from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";

export const updateEntity = async <T>(
  EntityTarget: EntityTarget<T>,
  criteria: FindConditions<T>,
  partial: QueryDeepPartialEntity<T>
): Promise<T | undefined> => {
  await getConnection().getRepository(EntityTarget).update(criteria, partial);
  return await getConnection().getRepository(EntityTarget).findOne(criteria);
};
