import { renderHook } from '@testing-library/react-hooks';

import {
  createMultiSearchResponse,
  createSearchClient,
} from '../../../../test/utils';
import { RecommendationModel } from '../types';
import { useRecommendations } from '../useRecommendations';

const hit = {
  name: 'Landoh 4-Pocket Jumpsuit',
  category: 'Women - Jumpsuits-Overalls',
  price: 250,
  url: 'women/jumpsuits-overalls/d06270-9132-995',
  hierarchical_categories: {
    lvl0: 'women',
    lvl1: 'women > jeans & bottoms',
    lvl2: 'women > jeans & bottoms > jumpsuits & overalls',
  },
  keywords: [
    'women',
    'jeans & bottoms',
    'jumpsuits & overalls',
    'Jumpsuits',
    'Loose',
    'Woven',
    'Long sleeve',
    'Grey',
  ],
  objectID: 'D06270-9132-995',
};

function createRecommendationsClient() {
  const index = {
    getObjects: jest.fn(() => Promise.resolve({ results: [hit] })),
  };
  const searchClient = createSearchClient({
    // @ts-expect-error `initIndex` is not part of the lite bundle
    initIndex: jest.fn(() => index),
    search: jest.fn(() =>
      Promise.resolve(
        createMultiSearchResponse({
          hits: [hit],
        })
      )
    ),
  });

  return {
    index,
    searchClient,
  };
}

describe('useRecommendations', () => {
  test('calls the correct index for "related-products"', async () => {
    const { index, searchClient } = createRecommendationsClient();
    const props = {
      model: 'related-products' as RecommendationModel,
      searchClient,
      indexName: 'indexName',
      objectIDs: ['objectID'],
    };

    const { waitForNextUpdate } = renderHook(() => useRecommendations(props));
    await waitForNextUpdate();

    expect(searchClient.initIndex).toHaveBeenCalledTimes(1);
    expect(searchClient.initIndex).toHaveBeenCalledWith(
      'ai_recommend_related-products_indexName'
    );

    expect(index.getObjects).toHaveBeenCalledTimes(1);
    expect(index.getObjects).toHaveBeenCalledWith(['objectID']);

    expect(searchClient.search).toHaveBeenCalledTimes(1);
    expect(searchClient.search).toHaveBeenCalledWith([
      {
        indexName: 'indexName',
        params: {
          analytics: false,
          analyticsTags: ['alg-recommend_related-products'],
          clickAnalytics: false,
          enableABTest: false,
          filters: 'NOT objectID:objectID',
          hitsPerPage: 0,
          optionalFilters: [],
          ruleContexts: ['alg-recommend_related-products_objectID'],
          typoTolerance: false,
        },
      },
    ]);
  });

  test('calls the correct index for "bought-together"', async () => {
    const { index, searchClient } = createRecommendationsClient();
    const props = {
      model: 'bought-together' as RecommendationModel,
      searchClient,
      indexName: 'indexName',
      objectIDs: ['objectID'],
    };

    const { waitForNextUpdate } = renderHook(() => useRecommendations(props));
    await waitForNextUpdate();

    expect(searchClient.initIndex).toHaveBeenCalledTimes(1);
    expect(searchClient.initIndex).toHaveBeenCalledWith(
      'ai_recommend_bought-together_indexName'
    );

    expect(index.getObjects).toHaveBeenCalledTimes(1);
    expect(index.getObjects).toHaveBeenCalledWith(['objectID']);

    expect(searchClient.search).toHaveBeenCalledTimes(1);
    expect(searchClient.search).toHaveBeenCalledWith([
      {
        indexName: 'indexName',
        params: {
          analytics: false,
          analyticsTags: ['alg-recommend_bought-together'],
          clickAnalytics: false,
          enableABTest: false,
          filters: 'NOT objectID:objectID',
          hitsPerPage: 0,
          optionalFilters: [],
          ruleContexts: ['alg-recommend_bought-together_objectID'],
          typoTolerance: false,
        },
      },
    ]);
  });

  test('returns recommended hits', async () => {
    const { searchClient } = createRecommendationsClient();
    const props = {
      model: 'related-products' as RecommendationModel,
      searchClient,
      indexName: 'indexName',
      objectIDs: ['objectID'],
    };

    const { result, waitForNextUpdate } = renderHook(() =>
      useRecommendations(props)
    );
    await waitForNextUpdate();

    expect(result.current.recommendations).toEqual([
      {
        __indexName: 'indexName',
        __position: 1,
        __queryID: undefined,
        __recommendScore: null,
        category: 'Women - Jumpsuits-Overalls',
        hierarchical_categories: {
          lvl0: 'women',
          lvl1: 'women > jeans & bottoms',
          lvl2: 'women > jeans & bottoms > jumpsuits & overalls',
        },
        keywords: [
          'women',
          'jeans & bottoms',
          'jumpsuits & overalls',
          'Jumpsuits',
          'Loose',
          'Woven',
          'Long sleeve',
          'Grey',
        ],
        name: 'Landoh 4-Pocket Jumpsuit',
        objectID: 'D06270-9132-995',
        price: 250,
        url: 'women/jumpsuits-overalls/d06270-9132-995',
      },
    ]);
  });
});