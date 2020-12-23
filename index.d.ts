type CSVOptions = {
  skipBlanks?:boolean;
};

type CSVCallback = (headers:string[], line:string[], index:number) => boolean;

type CSVParser = (csv:string, onLine:CSVCallback, options?:CSVOptions)=>void;

export const { parseCSV:CSVParser } 