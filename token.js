var andToken = '&&';
var orToken = '||';
var notToken = '!';
var trueToken = 'true';
var falseToken = 'false';
var absToken = 'abs';
var maxToken = 'max';
var minToken = 'min';

//var andToken = 'and';
//var orToken = 'or';
//var notToken = 'not';

var OPEN = 0;
var CLOSE = 1;
var X = 2;
var Y = 3;
var XOR = 4;
var AND = 5;
var OR = 6;
var EQUALS = 7;
var NOT_EQUALS = 8;
var GREATER_THAN = 9;
var GREATER_THAN_EQUALS = 10;
var LESS_THAN = 11;
var LESS_THAN_EQUALS = 12;
var NOT = 13;
var INTEGER = 14;
var EOF = 15;
var ADD = 16;
var MULTIPLY = 17;
var DIVIDE = 18;
var REMAINDER = 19;
var MINUS = 20;
var LITERAL_TRUE = 21;
var LITERAL_FALSE = 22;
var ABSOLUTE_VALUE = 23;
var BITWISE_AND = 24;
var BITWISE_OR = 25;
var MAX = 26;
var MIN = 27;
var COMMA = 28;

function Token(type, text, startIndex, endIndex) {
  this.type = type;
  this.text = text;
  this.startIndex = startIndex;
  this.endIndex = endIndex;
  return this;
}
