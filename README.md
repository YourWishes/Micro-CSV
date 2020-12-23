# Micro CSV
Micro CSV Parser for JavaScript and Google Script. Designed to be small, 
efficient and no dependencies.

## Usage
Only one method is provided;
```js
const csv = 'Name,Age,Location\nDom,26,"Sydney, Australia"\nSteve,30,"New York, USA"';
parseCSV(csv, function(headers, line, index) {
  console.log(index, '-', line[headers.indexOf('Name')]);//1 - Dom
  return true;//Return false to break loop
})
```
To stay efficient we ask for a callback that is fired for every line parsed.

## Options
Options can be provided if necessary;
```js
parseCSV(csv, (headers,line,index) => true, {
  skipBlanks: false
});
```

Current Options;
```
skipBlanks - True or False, whether or not to skip blank lines
```

## Testing
Tests are written in jest. Run `yarn test`