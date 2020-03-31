import createFieldAggregation from '../../src/buildAggregations/createFieldAggregation';

test('it should handle multiple aggregation types per field', () => {
  const input = {
    field: 'sequencing_experiments.mean_depth',
    graphqlField: {
      stats: { max: {} },
      histogram: {
        buckets: { doc_count: {}, key: {} },
        __arguments: [{ interval: { kind: 'IntValue', value: '5' } }],
      },
    },
    isNested: 1,
  };

  const output = {
    'sequencing_experiments.mean_depth:stats': {
      stats: { field: 'sequencing_experiments.mean_depth' },
    },
    'sequencing_experiments.mean_depth:histogram': {
      histogram: {
        field: 'sequencing_experiments.mean_depth',
        interval: '5',
      },
    },
  };

  expect(createFieldAggregation(input)).toEqual(output);
});

test('it should compute aggregation cardinality (for field files.kf_id)', () => {
  const input = {
    field: 'files.kf_id',
    graphqlField: {
      cardinality: {},
    },
    isNested: 1,
  };
  const output = {
    'files.kf_id:cardinality': {
      cardinality: { field: 'files.kf_id', precision_threshold: 40000 },
    },
  };
  expect(createFieldAggregation(input)).toEqual(output);
});

test('it should compute aggregation cardinality (for field family_id)', () => {
  const input = {
    field: 'family_id',
    graphqlField: {
      cardinality: {},
    },
    isNested: 0,
  };
  const output = {
    'family_id:cardinality': {
      cardinality: { field: 'family_id', precision_threshold: 40000 },
    },
  };
  expect(createFieldAggregation(input)).toEqual(output);
});

test('it should compute top hits aggregation', () => {
  const input = {
    field: 'observed_phenotype.name',
    size: 1,
    source: ['observed_Phenotype.parents'],
    graphqlField: {
      buckets: {
        key: {},
        doc_count: {},
        top_hits: {
          __arguments: [
            {
              _source: {
                kind: 'StringValue',
                value: 'observed_phenotype.parents',
              },
            },
            {
              size: {
                kind: 'IntValue',
                value: 1,
              },
            },
          ],
        },
      },
    },
  };
  const output = {
    'observed_phenotype.name': {
      terms: {
        field: 'observed_phenotype.name',
        size: 300000,
      },
      aggs: {
        'observed_phenotype.name.hits': {
          top_hits: {
            _source: ['observed_phenotype.parents'],
            size: 1,
          },
        },
      },
    },
    'observed_phenotype.name:missing': {
      missing: {
        field: 'observed_phenotype.name',
      },
    },
  };
  expect(createFieldAggregation(input)).toEqual(output);
});
