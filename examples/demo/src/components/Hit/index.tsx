import React from 'react';
import { InsightsClient } from 'search-insights';

import { indexName } from '../../config';
import { ProductHit } from '../../types';

import './style.css';

type HitProps = {
  hit: ProductHit;
  insights: InsightsClient;
  onSelect(hit: ProductHit): void;
};

export function Hit({ hit, onSelect, insights }: HitProps) {
  return (
    <a
      className="Hit Hit-link"
      href={hit.url}
      onClick={(event) => {
        event.preventDefault();

        onSelect(hit);
        insights('clickedObjectIDs', {
          objectIDs: [hit.objectID],
          eventName: 'Product Clicked',
          index: indexName,
        });
      }}
    >
      <div className="Hit-Image">
        <img src={hit.image_urls[0]} alt={hit.name} className="product-image" />
      </div>

      <div className="Hit-Content">
        <div className="Hit-Name">{hit.name}</div>
        <div className="Hit-Description">{hit.objectID}</div>

        <div className="Hit-Price">${hit.price.value}</div>

        <button
          className="Hit-Button"
          onClick={(event) => {
            event.preventDefault();
            insights('convertedObjectIDsAfterSearch', {
              eventName: 'Product Added To Cart',
              objectIDs: [hit.objectID],
              index: indexName,
              queryID: hit.__queryID,
            });
          }}
        >
          <span className="Hit-ButtonIcon">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M15 15.5625C14.8964 15.5625 14.8125 15.6464 14.8125 15.75C14.8125 15.8536 14.8964 15.9375 15 15.9375C15.1036 15.9375 15.1875 15.8536 15.1875 15.75C15.1875 15.6464 15.1036 15.5625 15 15.5625ZM13.6875 15.75C13.6875 15.0251 14.2751 14.4375 15 14.4375C15.7249 14.4375 16.3125 15.0251 16.3125 15.75C16.3125 16.4749 15.7249 17.0625 15 17.0625C14.2751 17.0625 13.6875 16.4749 13.6875 15.75Z"
                fill="#3C4FE0"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6.75 15.5625C6.64645 15.5625 6.5625 15.6464 6.5625 15.75C6.5625 15.8536 6.64645 15.9375 6.75 15.9375C6.85355 15.9375 6.9375 15.8536 6.9375 15.75C6.9375 15.6464 6.85355 15.5625 6.75 15.5625ZM5.4375 15.75C5.4375 15.0251 6.02513 14.4375 6.75 14.4375C7.47487 14.4375 8.0625 15.0251 8.0625 15.75C8.0625 16.4749 7.47487 17.0625 6.75 17.0625C6.02513 17.0625 5.4375 16.4749 5.4375 15.75Z"
                fill="#3C4FE0"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M0.1875 0.75C0.1875 0.43934 0.43934 0.1875 0.75 0.1875H3.75C4.0181 0.1875 4.24894 0.376717 4.30156 0.639605L4.96163 3.9375H17.25C17.4176 3.9375 17.5765 4.01227 17.6834 4.14144C17.7903 4.2706 17.8339 4.4407 17.8025 4.60537L16.6017 10.9021C16.5074 11.3769 16.2491 11.8034 15.8721 12.1069C15.4965 12.4092 15.027 12.5704 14.545 12.5625H7.26498C6.78304 12.5704 6.31349 12.4092 5.93793 12.1069C5.56105 11.8035 5.30282 11.3773 5.20841 10.9028C5.20837 10.9025 5.20846 10.903 5.20841 10.9028L3.95442 4.63746C3.95004 4.62004 3.94648 4.60229 3.94377 4.58426L3.28893 1.3125H0.75C0.43934 1.3125 0.1875 1.06066 0.1875 0.75ZM5.1868 5.0625L6.31172 10.6829C6.35459 10.8987 6.47199 11.0926 6.64338 11.2306C6.81478 11.3685 7.02924 11.4418 7.24922 11.4376L7.26 11.4375H14.55L14.5608 11.4376C14.7808 11.4418 14.9952 11.3685 15.1666 11.2306C15.3375 11.093 15.4548 10.8998 15.4979 10.6847C15.498 10.6841 15.4982 10.6835 15.4983 10.6829L16.5701 5.0625H5.1868Z"
                fill="#3C4FE0"
              />
            </svg>
          </span>
          Add to cart
        </button>
      </div>
    </a>
  );
}
