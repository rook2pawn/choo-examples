const mr = require('mrcolor');
const invert = require('invert-color');

const getColor = mr();
const getRandomColor = function() {
  var color = getColor().rgb();

  var foregroundColor= invert(color)
  var backgroundColor = `rgb(${color.join(',')})`;
  return {color:foregroundColor, backgroundColor}
}

module.exports = exports = getRandomColor
