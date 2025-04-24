type NameWithLink = {
  name: string;
  link: string;
};

export type Teacher = NameWithLink;
export type Discipline = NameWithLink;

type NamedBlock<C extends string, Props> = {
  id: number;
  collection: C;
  props: Props;
};

type BlockPropsMap = {
  teachers_blocks: { people: Teacher[] };
  discipline_list_blocks: { disciplines: Discipline[] };
};

export type BlockCollection = keyof BlockPropsMap;

export type Block<C extends string = string> = C extends BlockCollection
  ? NamedBlock<C, BlockPropsMap[C]>
  : NamedBlock<string, unknown>;

export type PageData = {
  props: {
    pageProps: {
      preparedBlocks: Block[];
    };
  };
};
