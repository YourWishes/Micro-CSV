# Micro CSV
Micro CSV Parser for JavaScript and Google Script. Designed to be small, 
efficient and no dependencies.

## Usage
Only one method is provided;
```js
const csv = 'Name,Age,Location\nDom,26,Sydney\nSteve,30,New York';
parseCSV(csv, function(line) {
  console.log(line.name);//Dom then Steve
})
```
To stay efficient we ask for a callback that is fired for every line parsed.