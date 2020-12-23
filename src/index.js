function parseCSV(csv, onLine) {
  //Split lines by delim, don't worry about \r here
  const lines = csv.split('\n');
  let headers = null;
  let index = 0;

  //For each line...
  for(let i = 0; i < lines.length; i++) {
    //Shave off trailing whitespaces
    let line = lines[i].trim();
    if(!line.replace(/\s/g, '').length) continue;//Skip blank lines
    index++;//Count real lines

    //Setup line array
    let lineArray;
    if(line.indexOf('"') !== -1) {//Only escape lines with strings
      let currentValue = '';//Store current value
      let encapsulated = false;//Track when we're inside a "
      lineArray = [];

      //Foreach char in the line...
      for(let j = 0; j < line.length; j++) {
        let c = line[j];
        if(!encapsulated && c == ',') {
          //Comma, make new cell
          lineArray.push(currentValue);
          currentValue = '';
          continue;
        } else if(c == '"') {
          //Quote, begin string encapsulation
          encapsulated = !encapsulated;
          continue;
        }
        currentValue += `${c}`;
      }

      //Add current value
      lineArray.push(currentValue);
    } else {
      lineArray = line.split(',');
    }

    //Is this the headers line?
    if(!headers) {
      headers = lineArray;
      continue;
    }

    //Callback
    let r = onLine(headers, lineArray, index);
    if(!r) break;//If r != true then break loop
  }
}