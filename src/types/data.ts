export interface useData {
  resourceUrl?: string;
  line?: number | unknown;
  col?: number | unknown;
  target?: string;
  type?: string;
}

export interface sendData {
  apiKey?: string;
  time?: number | Date;
  msg?: string;
  type?: string;
  note?: string;
  title?: string;
  curUrl?: string;
  data?: useData | any;
}