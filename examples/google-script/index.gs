/**
 *  Google Script Example
 *    Shows how you can use the micro CSV parser within a google script for
 *    fetching data. This example is used for fetching my games collection from
 *    github and then parsing it into Google Data Studio.
 */

//Start by including the Micro CSV Parser
function parseCSV(csv, onLine, options) {
  //Split lines by delim, don't worry about \r here
  const lines = csv.split('\n');
  let headers = null;
  let index = 0;
  options = options || {
    skipBlanks: true
  };

  //For each line...
  for(let i = 0; i < lines.length; i++) {
    //Shave off trailing whitespaces
    let line = lines[i].trim();

    if(options.skipBlanks && !line.replace(/\s/g, '').length) continue;//Skip blank lines

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
    if(options.skipBlanks && (!lineArray.length || lineArray.every(e => !e.length))) continue;

    //Is this the headers line?
    if(!headers) {
      headers = lineArray;
      continue;
    }
    index++;//Count real lines

    //Callback
    let r = onLine(headers, lineArray, index);
    if(!r) break;//If r != true then break loop
  }
}

// Function to just get the headers line from the CSV
function getGitHeaders(raw) {
  let headers = [];
  parseCSV(raw, function(h, line) {
    headers = h;
    return false;
  });
  return headers;
}

// Example CSV Fetching
function getGitRaw() {
  return UrlFetchApp.fetch('https://raw.githubusercontent.com/YourWishes/Games-List/master/public/data.csv').getContentText();
}


// Google Data Studio things...
var cc = DataStudioApp.createCommunityConnector();
function getAuthType() {
  var AuthTypes = cc.AuthType;
  return cc
    .newAuthTypeResponse()
    .setAuthType(AuthTypes.NONE)
    .build();
}

function isAdminUser() {
  return;
}

function getConfig(request) {
  var config = cc.getConfig()
  return config.build();
} 

// Google Data Studio Requesting the fields, we get this from the CSV data
function getFields(request, headers) {
  var cc = DataStudioApp.createCommunityConnector();
  var fields = cc.getFields();
  var types = cc.FieldType;
  var aggregations = cc.AggregationType;
  
  fields.newDimension()
    .setId('Row index')
    .setType(types.NUMBER)
  ;

  if(headers.length) {
    headers.forEach(key => {
      fields.newDimension()
        .setId(key)
        .setType(types.TEXT)
      ;
    });
  }
  
  return fields;
}
  
function getSchema(request) {
  // Load the CSV data and parse the headers out
  const raw = getGitRaw();
  const fields = getFields(request, getGitHeaders(raw)).build();
  return { schema: fields };
}

function getData(request) {
  // Get the data and headers
  const raw = getGitRaw();
  const headers = getGitHeaders(raw);

  // Determine the requested fields
  const requestedFieldIds = request.fields.map(field => field.name);
  const requestedFields = getFields(request, headers).forIds(requestedFieldIds);
  const reqFieldsArr = requestedFields.asArray();

  // Determine the indexes requested, since google asks for IDs (strings)
  let headerIds = [];
  reqFieldsArr.forEach(function(field) {
    const key = headers.indexOf(field.getId());
    headerIds.push(key);
  });

  //Now Parse the CSV full
  const rows = [];
  parseCSV(raw, function(h, line, index) {
    //Construct just the values
    const row = [];
    headerIds.forEach(key => {
      if(key === -1) return rows.push(index);//If key === -1 then Row Index was requested
      row.push(line[key]||'')
    });
    rows.push({ values: row });
    return true;
  });
  
  return { schema: requestedFields.build(), rows }
}

