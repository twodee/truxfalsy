// Escapes all wildcards in the given string.
// s -> String to escape.
// <- String suitable to convert to a regex.
function escapeRegexWildcards(s) {
  return s.replace(/([-.?*+$\[\]\/\\(){}|])/g, '\\$1');
}

function Lexer(src) {
  this.src = src;
  this.i = 0;
  this.soFar = '';
  this.soFarStartedAt;

  this.getToken = function() {

    // Skip over whitespace.
    while (this.i < this.src.length && this.src.charAt(this.i) == ' ') {
      ++this.i;
    }

    this.soFarStartedAt = this.i;
    var left = this.src.substr(this.i);

    if (this.i >= src.length) {
      return new Token(EOF, 'the end of your input', src.length, src.length); 
    } else if (left.match(/^true/)) {
      this.i += 4;
      return new Token(LITERAL_TRUE, 'true', this.soFarStartedAt, this.i);
    } else if (left.match(/^false/)) {
      this.i += 5;
      return new Token(LITERAL_FALSE, 'false', this.soFarStartedAt, this.i);
    } else if (left.match(new RegExp('^' + escapeRegexWildcards(absToken)))) {
      this.i += absToken.length;
      return new Token(ABSOLUTE_VALUE, absToken, this.soFarStartedAt, this.i);
    } else if (left.match(new RegExp('^' + escapeRegexWildcards(maxToken)))) {
      this.i += maxToken.length;
      return new Token(MAX, maxToken, this.soFarStartedAt, this.i);
    } else if (left.match(new RegExp('^' + escapeRegexWildcards(minToken)))) {
      this.i += minToken.length;
      return new Token(MIN, minToken, this.soFarStartedAt, this.i);
    } else if (left.match(/^,/)) {
      ++this.i;
      return new Token(COMMA, ',', this.soFarStartedAt, this.i);
    } else if (left.match(/^-/)) {
      ++this.i;
      return new Token(MINUS, '-', this.soFarStartedAt, this.i);
    } else if (left.match(/^x/)) {
      ++this.i;
      return new Token(X, 'x', this.soFarStartedAt, this.i);
    } else if (left.match(/^y/)) {
      ++this.i;
      return new Token(Y, 'y', this.soFarStartedAt, this.i);
    } else if (left.match(/^\(/)) {
      ++this.i;
      return new Token(OPEN, '(', this.soFarStartedAt, this.i);
    } else if (left.match(/^\)/)) {
      ++this.i;
      return new Token(CLOSE, ')', this.soFarStartedAt, this.i);
    } else if (left.match(/^!=/)) {
      this.i += 2;
      return new Token(NOT_EQUALS, '!=', this.soFarStartedAt, this.i);
    } else if (left.match(new RegExp('^' + escapeRegexWildcards(notToken)))) {
      this.i += notToken.length;
      return new Token(NOT, notToken, this.soFarStartedAt, this.i);
    } else if (left.match(/^\*/)) {
      ++this.i;
      return new Token(MULTIPLY, '*', this.soFarStartedAt, this.i);
    } else if (left.match(/^\//)) {
      ++this.i;
      return new Token(DIVIDE, '\/', this.soFarStartedAt, this.i);
    } else if (left.match(/^%/)) {
      ++this.i;
      return new Token(REMAINDER, '%', this.soFarStartedAt, this.i);
    } else if (left.match(/^\+/)) {
      ++this.i;
      return new Token(ADD, '+', this.soFarStartedAt, this.i);
    } else if (left.match(/^\^/)) {
      ++this.i;
      return new Token(XOR, '^', this.soFarStartedAt, this.i);
    } else if (left.match(/^<=/)) {
      this.i += 2;
      return new Token(LESS_THAN_EQUALS, '<=', this.soFarStartedAt, this.i);
    } else if (left.match(/^</)) {
      ++this.i;
      return new Token(LESS_THAN, '<', this.soFarStartedAt, this.i);
    } else if (left.match(/^>=/)) {
      this.i += 2;
      return new Token(GREATER_THAN_EQUALS, '>=', this.soFarStartedAt, this.i);
    } else if (left.match(/^>/)) {
      ++this.i;
      return new Token(GREATER_THAN, '>', this.soFarStartedAt, this.i);
    } else if (left.match(new RegExp('^' + escapeRegexWildcards(andToken)))) {
      this.i += andToken.length;
      return new Token(AND, andToken, this.soFarStartedAt, this.i);
    } else if (left.match(new RegExp('^' + escapeRegexWildcards(orToken)))) {
      this.i += orToken.length;
      return new Token(OR, orToken, this.soFarStartedAt, this.i);
    } else if (left.match(/^&/)) {
      ++this.i;
      return new Token(BITWISE_AND, '&', this.soFarStartedAt, this.i);
    } else if (left.match(/^\|/)) {
      ++this.i;
      return new Token(BITWISE_OR, '|', this.soFarStartedAt, this.i);
    } else if (left.match(/^==/)) {
      this.i += 2;
      return new Token(EQUALS, '==', this.soFarStartedAt, this.i);
    } else if (result = left.match(/^(-?\d+)/)) {
      this.i += result[1].length;
      return new Token(INTEGER, parseInt(result[1]), this.soFarStartedAt, this.i);
    }

    throw "I'm sorry. I don't know about " + this.src.charAt(this.i) + '.';
  }

  this.lex = function() {
    var tokens = [];

    var token;
    do {
      token = this.getToken();
      tokens.push(token);
    } while (token.type != EOF);

    return tokens;
  }

  return this;
}

