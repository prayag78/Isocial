export type Post = {
  id: string;
  content: string | null;
  image: string | null;
  createdAt: Date;
  author: {
    id: string;
    username: string;
    image: string | null;
    name: string | null;
  };
  comments: Array<{
    id: string;
    content: string;
    createdAt: Date;
    author: {
      id: string;
      username: string;
      image: string | null;
      name: string | null;
    };
  }>;
  likes: Array<{ userId: string }>;
  _count: {
    likes: number;
    comments: number;
  };
};

export type DbPost = {
  id: string;
  content: string | null;
  image: string | null;
  createdAt: Date;
  author: {
    id: string;
    username: string;
    image: string | null;
    name: string | null;
  };
  comments: Array<{
    id: string;
    content: string;
    createdAt: Date;
    author: {
      id: string;
      username: string;
      image: string | null;
      name: string | null;
    };
  }>;
  likes: Array<{ userId: string }>;
  _count: {
    likes: number;
    comments: number;
  };
};
