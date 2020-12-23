# Micro CSV
Micro CSV Parser for JavaScript and Google Script. Designed to be small, 
efficient and no dependencies.

## Usage
Only one method is provided;
```js
const csv = 'Name,Age,Location\nDom,26,Sydney\nSteve,30,New York';
parseCSV(csv, function(headers, line, index) {
  console.log(index, '-', line[headers.indexOf('Name')]);//1 - Dom
  return true;//Return false to break loop
})
```
To stay efficient we ask for a callback that is fired for every line parsed.