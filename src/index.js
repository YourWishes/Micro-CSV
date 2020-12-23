function parseCSV(csv, onLine) {
  const lines = csv.split(/\r?\n/);
  let headers = null;

  for(let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();
    if(!line.length) continue;

    let lineArray = [];
    let currentValue = '';
    let encapsulated = false;

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
    lineArray.push(currentValue);

    //Is this the headers?
    if(!headers) {
      headers = lineArray;
      continue;
    }

    //This is a line
    let x = {};
    for(let j = 0; j < headers.length; j++) {
      x[headers[j]] = lineArray[j] || '';
    }
    onLine(x);
  }
}