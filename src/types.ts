export type ID = number;

export type Point = {
  id: number;
  x: number;
  y: number;
};

export type Dimension = {
  width: number;
  height: number;
};

export type Text = {
  id: number;
  x: number;
  y: number;
  value: string;
  size?: number;
  color?: string;
  rotation?: number;
};

export type Region = {
  id: ID;
  closed: boolean;
  points: Point[];
  texts: Text[];
};

export type Store = {
  isReady: boolean;
  setReady: (isReady: boolean) => void;

  active: number | null;
  setActive: (active: number | null) => void;

  selected: number | null;
  setSelected: (selected: number | null) => void;

  isDrawing: boolean;
  setDrawing: (isDrawing: boolean) => void;

  regions: Array<Region>;
  setRegions: (regions: Array<Region>) => void;
  addRegion: (id: ID) => void;
  addRegionText: (id: ID, text: Text) => void;

  source: string;
  setSource: (source: string) => void;

  width: number;
  setWidth: (width: number) => void;

  height: number;
  setHeight: (height: number) => void;

  scale: number;
  setScale: (scale: number) => void;

  dimension: Dimension;
  setDimension: (dimension: Dimension) => void;
};
