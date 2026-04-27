export interface Comic {
  id: number;
  title: string;
  image: string;
  desc: string;
  width: number;
  height: number;
  imgtitle: string;
  share: string;
}

export interface RenderContext {
  comic: Comic;
  isFirst: boolean;
  isLast: boolean;
  lastId: number;
  siteUrl: string;
  canonicalPath: string;
}
