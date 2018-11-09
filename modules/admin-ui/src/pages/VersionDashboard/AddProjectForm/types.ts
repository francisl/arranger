import {
  Boolean,
  String,
  Array as RT_Array,
  Record,
  Union,
  Dictionary,
  Static,
  Undefined,
  Null,
} from 'runtypes';

/****************
 * Index data import struct, using runtypes for runtime type validation
 ****************/
const RT_Column = Record({
  field: String,
  accessor: Union(Undefined, Union(Null, String)),
  show: Boolean,
  type: String,
  sortable: Boolean,
  canChangeShow: Boolean,
  jsonPath: Union(Null, String),
  query: Union(Null, String),
});

const RT_ColumnsState = Record({
  type: String,
  keyField: String,
  defaultSorted: RT_Array(Record({ id: String, desc: Boolean })),
  columns: RT_Array(RT_Column),
});

const RT_AggsState = RT_Array(
  Record({
    active: Boolean,
    field: String,
    show: Boolean,
  }),
);

const RT_ExtendedMapping = RT_Array(
  Record({
    active: Boolean,
    displayName: String,
    displayValues: Dictionary(String, 'string'),
    field: String,
    isArray: Boolean,
    primaryKey: Boolean,
    quickSearchEnabled: Boolean,
    type: String,
    unit: Union(Null, String),
  }),
);

const RT_Matchbox = Record({
  displayName: String,
  field: String,
  isActive: Boolean,
  keyField: Union(Null, String),
  searchFields: RT_Array(String),
});

const RT_MatchboxState = RT_Array(RT_Matchbox);

export const RT_IndexConfigImportDataRunType = Record({
  aggsState: Union(Undefined, RT_AggsState),
  columnsState: Union(Undefined, RT_ColumnsState),
  extended: Union(Undefined, RT_ExtendedMapping),
  matchboxState: Union(Undefined, RT_MatchboxState),
});

export interface IIndexConfigImportData
  extends Static<typeof RT_IndexConfigImportDataRunType> {}

/********
 * Local state types
 ********/
export interface IProjectIndexConfig extends IIndexConfigImportData {}
export interface INewIndexArgs {
  newIndexMutationInput: INewIndexInput;
  config: IProjectIndexConfig | null;
}
export interface ILocalFormState {
  projectId: string;
  indices: INewIndexArgs[];
  error: Error | null;
}
export interface ILocalFormMutations {
  setProjectId: (id: string) => void;
  addIndex: (indexConfig: INewIndexArgs) => void;
  removeIndex: (indexPosition: number) => void;
  setIndexMutationInput: (
    indexPosition: number,
  ) => (mutationInput: INewIndexInput) => void;
  setIndexConfig: (
    indexPosition: number,
  ) => (indexConfig: IProjectIndexConfig | null) => void;
  setError: (error: Error) => Promise<Error>;
}
export interface IFormStateProps {
  formState: {
    state: ILocalFormState;
    mutations: ILocalFormMutations;
  };
}

/********
 * Server data types
 ********/
export interface INewIndexInput {
  // TODO: this should be imported from '@arranger/admin
  projectId: string;
  graphqlField: string;
  esIndex: string;
  esType: string;
}
export interface IMutationResponseData {
  newProject: {
    id: string;
  }[];
}
export interface IMutationVariables {
  projectId: string;
  indexConfigs: INewIndexArgs[];
}
export interface IPropsWithMutation {
  addProject: (args: IMutationVariables) => Promise<void>;
}

/*******
 * layout component Types
 *******/
export interface IInjectedProps extends IFormStateProps, IPropsWithMutation {}
export interface IExternalProps {
  onCancel: () => void;
}
export interface ILayoutProps extends IInjectedProps, IExternalProps {}
