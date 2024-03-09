'use server';

import { NewAddress, db } from '@/db/database';
import { jsonObjectFrom } from 'kysely/helpers/postgres';
import { DefaultSession } from 'next-auth';

export const saveAddress = async (user: DefaultSession['user'], {
  streetNumber,
  route,
  city,
  state,
  zip,
}: NewAddress) => {
  const existingUser = await db.selectFrom('User')
    .where('email', '=', user?.email!)
    .selectAll()
    .executeTakeFirst();

  if (!existingUser) {
    return false;
  }

  const existingAddress = await db.selectFrom('Address')
    .where('userId', '=', existingUser.id)
    .selectAll()
    .executeTakeFirst();

  if (existingAddress) {
    existingAddress.streetNumber = streetNumber;
    existingAddress.route = route;
    existingAddress.city = city;
    existingAddress.state = state;
    existingAddress.zip = zip;

    await db.updateTable('Address')
      .where('id', '=', existingAddress.id)
      .set(existingAddress)
      .execute();
  } else {
    await db.insertInto('Address').values({
      userId: existingUser.id,
      streetNumber,
      route,
      city,
      state,
      zip,
    }).execute();
  }

  return await db.selectFrom('Address')
    .where('userId', '=', existingUser.id)
    .selectAll()
    .executeTakeFirst();
}

export const getPoll = async () => {
  const questions = await db.selectFrom('Question')
    .innerJoin('Locality', 'Locality.id', 'Question.localityId')
    .innerJoin('Category', 'Category.id', 'Question.categoryId')
    .selectAll('Question')
    .select((eb) => [
      jsonObjectFrom(
        eb
          .selectFrom('Locality')
          .selectAll('Locality')
          .whereRef('Locality.id', '=', 'Question.localityId')
      ).as('locality'),
      jsonObjectFrom(
        eb
          .selectFrom('Category')
          .selectAll('Category')
          .whereRef('Category.id', '=', 'Question.categoryId')
      ).as('category'),
    ])
    .orderBy(['Locality.position asc', 'Category.name asc'])
    .execute();

  return questions;
}
