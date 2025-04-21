export type Teacher = {
  name: string;
  link: string;
};

export type TeachersBlock = {
  id: number;
  collection: 'teachers_block';
  props: {
    people: Teacher[];
  };
};

export type Block =
  | {
      id: number;
      collection: string;
      props: unknown;
    }
  | TeachersBlock;

export type TeacherPageData = {
  props: {
    pageProps: {
      preparedBlocks: Block[];
    };
  };
};
