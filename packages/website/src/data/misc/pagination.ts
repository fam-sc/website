import { Document } from 'mongodb';

export function pagination(index: number, size: number): Document {
  return {
    $facet: {
      metadata: [{ $count: 'totalCount' }],
      data: [{ $skip: index * size }, { $limit: size }],
    },
  };
}
