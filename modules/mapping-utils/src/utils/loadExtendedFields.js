import getIndexPrefix from './getIndexPrefix';
import mapHits from './mapHits';
import { get } from 'lodash';

export default async ({ projectId, index, es }) => {
  const id = projectId.toLowerCase();
  const lowerCaseIndex = index.toLowerCase();
  const indexPrefix = getIndexPrefix({ projectId: id, index: lowerCaseIndex });
  try {
    const { hits: { total } } = await es.search({
      index: indexPrefix,
      type: indexPrefix,
      size: 0,
      _source: false,
    });
    const fields = mapHits(
      await es.search({
        index: indexPrefix,
        type: indexPrefix,
        size: total,
      }),
    );
    return fields;
  } catch (err) {
    const metaData = await es.search({
      index: `arranger-projects-${projectId}`,
      type: `arranger-projects-${projectId}`,
    });
    const config = get(metaData, 'hits.hits[0]._source.config');
    return config.extended;
  }
};
