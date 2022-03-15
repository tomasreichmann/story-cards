type SomeObject = {
  [key: string]: any;
};

export type ContentResponseItem = {
  data: SomeObject;
  nodeType: string;
  marks?: [];
  value?: string; // Not sure
  content?: ContentResponseItem[];
};

export type CardResponse = {
  id: string;
  title: string;
  sys?: any;
  image: {
    metadata?: {
      tags: [];
    };
    sys?: any;
    fields: {
      file: {
        url: string;
      };
    };
  };
  type: string[];
  description: {
    data: SomeObject;
    content: ContentResponseItem[];
  };
};

//---

export enum Sheet {
  Posts = 1,
}

export type Post = {
  iconUrl1: string;
  iconUrl2?: string;
  name: string;
  tags: string[];
  count: 10;
  runningCount: 65;
  iconName1: 'lorc/edge-crack';
  iconColor1: 0;
  iconBackground1: 'transparent';
  iconName2: 'delapouite/asian-lantern';
  iconColor2: 0;
  iconBackground2: 'transparent';
};

export enum CharacterTypeEnum {
  Player = 'Player',
  Guard = 'Guard',
  Cat = 'Cat',
}
