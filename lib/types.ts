export type ThemeType = 'win98' | 'win98-desert' | 'win98-rose' | 'winme' | 'winxp' | 'winxp-silver';

export type ViewMode = 'large' | 'medium' | 'compact' | 'details';

export interface ClipartItem {
  id: string;
  name: string;
  title: string;
  filename: string;
  url: string;
  size: number;
  tags: string[];
  category: string;
  date?: string;
  md5?: string;
}

export interface CategoryInfo {
  id: string;
  name: string;
  icon: string;
  description: string;
  queryKeywords: string[];
  count?: number;
}

export interface DocumentCanvasItem {
  id: string;
  clipart: ClipartItem;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
}
