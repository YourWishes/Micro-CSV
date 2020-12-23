const { expect, it } = require('@jest/globals');
const { parseCSV } = require('./../src/index');

describe('parseCSV', () => {
  it('should parse a csv file', () => {
    const csv = 'Name,Age,Location\nDom,26,"Sydney, Australia"\nSteve,30,"New York, USA"';

    parseCSV(csv, (headers,line,index) => {
      //Headers are parsed as arrays of strings
      expect(headers).toEqual([ 'Name', 'Age', 'Location' ]);

      switch(index) {
        case 1:
          expect(line).toEqual([ 'Dom', '26', 'Sydney, Australia' ]);
          break;
        case 2:
          expect(line).toEqual([ 'Steve', '30', 'New York, USA' ]);
          break;
      }

      return true;
    });
  });

  it('should skip blank lines', () => {
    //Line 2 is blank, Line 3 ends with a return carraige
    const csv = 'Name,Age,Location\n,,\nSteve,30,"New York, USA"\n\rDom,26,"Sydney, Australia"';

    parseCSV(csv, (headers,line,index) => {
      expect(headers).toEqual([ 'Name', 'Age', 'Location' ]);

      switch(index) {
        case 1:
          expect(line).toEqual([ 'Steve', '30', 'New York, USA' ]);
          break;
        case 2:
          expect(line).toEqual([ 'Dom', '26', 'Sydney, Australia' ]);
          break;
      }

      return;
    });
  });

  it('should break when returning false', () => {
    const csv = 'Name,Age,Location\nDom,26,"Sydney, Australia"\nSteve,30,"New York, USA"';

    parseCSV(csv, (headers,line,index) => {
      expect(line).toEqual([ 'Dom', '26', 'Sydney, Australia' ]);
      expect(index).not.toEqual(2);
      return false;
    });
  });

  it('should be allowed to not skip blanks', () => {
    
    //Line 2 is blank, Line 3 ends with a return carraige
    const csv = 'Name,Age,Location\n,,\nSteve,30,"New York, USA"\n\rDom,26,"Sydney, Australia"';

    parseCSV(csv, (headers,line,index) => {
      expect(headers).toEqual([ 'Name', 'Age', 'Location' ]);

      switch(index) {
        case 1:
          expect(line).toEqual([ '', '', '' ]);
          break;
        case 2:
          expect(line).toEqual([ 'Steve', '30', 'New York, USA' ]);
          break;
      }

      return;
    }, { skipBlanks: false });
  });
});