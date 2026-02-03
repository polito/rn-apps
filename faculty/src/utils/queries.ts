import { ResponseError } from '@polito/api-client/runtime';
import {
  InfiniteData,
  InfiniteQueryObserverResult,
} from '@tanstack/react-query';

import { DateTime } from 'luxon';

import { SuccessResponse } from '../core/types/api';

/**
 * Pluck data from API response
 *
 * @param response
 */
export const pluckData = <T>(response: SuccessResponse<T>) => {
  return response.data;
};

/**
 * Take the last page of data currently persisted in store by the infinite query
 */
const popPage = <TPage>(data: InfiniteData<TPage> | undefined): TPage => {
  return [...data!.pages].pop()!;
};

/**
 * Take the first page of data currently persisted in store by the infinite query
 */
const shiftPage = <TPage>(data: InfiniteData<TPage> | undefined): TPage => {
  return [...data!.pages].shift()!;
};

export const getPageByPageParam = async <TItem>(
  infiniteQuery: InfiniteQueryObserverResult<InfiniteData<TItem[]>>,
  pageParam: DateTime,
): Promise<TItem[]> => {
  const pageIndex = infiniteQuery.data?.pageParams.findIndex(
    item => item === pageParam,
  );

  if (pageIndex && pageIndex >= 0) {
    return Promise.resolve([...infiniteQuery.data!.pages[pageIndex]!]);
  }

  // fetch page by its pageParam
  if (
    infiniteQuery.data?.pageParams[0] &&
    pageParam < infiniteQuery.data.pageParams[0]
  ) {
    await infiniteQuery.fetchPreviousPage();
    return shiftPage(infiniteQuery.data);
  }

  await infiniteQuery.fetchNextPage();
  return popPage(infiniteQuery.data);
};

/**
 * Ignore 404 ResponseErrors
 */
export const ignoreNotFound = (e: Error): null => {
  if (e instanceof ResponseError && e.response.status === 404) return null;
  throw e;
};
