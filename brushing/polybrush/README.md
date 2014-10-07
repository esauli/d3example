Here's a d3 plugin that allows you to create a polygon selection.  You instantiate it just like d3.svg.brush.
```javascript
var brush = d3.svg.polybrush();
```
It has an extra public method that 'brush' does not, and that's 'isWithinExtent(x, y)'.  You can use this method to test if a given point falls within the drawn extent.
```javascript
if (brush.isWithinExtent(x, y)) {
  console.log("I'm inside!");
}
```

Usage:<br/>
Click to add an anchor point, double click to close the selection.<br/>
Drag the selection to reposition it.<br/>
Double click outside the selection to clear it.<br/>

Areas For Improvement:<br/>
1. Add anchor handles to allow the repositioning of an anchor point.<br/>
2. Better viewport edge detection.  Right now it simply stops moving if you try to move the selection out of the viewport.