function Parser(tokens) {
  this.tokens = tokens;

  this.parse = function(is_python) {
    this.is_python = is_python;
    this.expressions = [];
    this.i = 0;
    this.expressionOr();
    if (this.expressions.length == 0) {
      return null;
    } else if (this.tokens[this.i].type != EOF) {
      throw 'I thought your expression was complete, but then I found a stray ' + this.tokens[this.i].text + '.';
    } else if (this.expressions.length == 1) {
      return this.expressions.pop();
    } else {
      throw 'too many!';
    }
  };

  this.expressionOr = function() {
    this.expressionAnd();
    while (this.isUp(OR)) {
      ++this.i;
      this.expressionAnd();
      var r = this.expressions.pop(); 
      var l = this.expressions.pop(); 
      this.expressions.push(new ExpressionOr(l, r));
    }
  };

  this.expressionAnd = function() {
    // In Python, not has lower precedence than the relational operators but
    // higher precedence than AND.
    if (this.is_python) {
      this.expressionPythonNot();
    } else {
      this.expressionBitwiseOr();
    }

    while (this.isUp(AND)) {
      ++this.i;

      if (this.is_python) {
        this.expressionPythonNot();
      } else {
        this.expressionBitwiseOr();
      }

      var r = this.expressions.pop(); 
      var l = this.expressions.pop(); 
      this.expressions.push(new ExpressionAnd(l, r));
    }
  };

  this.expressionPythonNot = function() {
    if (this.isUp(NOT)) {
      ++this.i;
      this.expressionBitwiseOr();
      var r = this.expressions.pop(); 
      this.expressions.push(new ExpressionNot(r));
    } else {
      this.expressionBitwiseOr();
    }
  };

  this.expressionBitwiseOr = function() {
    this.expressionXor();
    while (this.isUp(BITWISE_OR)) {
      ++this.i;
      this.expressionXor();
      var r = this.expressions.pop(); 
      var l = this.expressions.pop(); 
      this.expressions.push(new ExpressionBitwiseOr(l, r));
    }
  };

  this.expressionXor = function() {
    this.expressionBitwiseAnd();
    while (this.isUp(XOR)) {
      ++this.i;
      this.expressionBitwiseAnd();
      var r = this.expressions.pop(); 
      var l = this.expressions.pop(); 
      this.expressions.push(new ExpressionXor(l, r));
    }
  };

  this.expressionBitwiseAnd = function() {
    this.expressionEqual();
    while (this.isUp(BITWISE_AND)) {
      ++this.i;
      this.expressionEqual();
      var r = this.expressions.pop(); 
      var l = this.expressions.pop(); 
      this.expressions.push(new ExpressionBitwiseAnd(l, r));
    }
  };

  this.expressionEqual = function() {
    this.expressionRelational();
    while (!this.is_python && (this.isUp(EQUALS) || this.isUp(NOT_EQUALS))) {
      var type = this.tokens[this.i].type;
      ++this.i;
      this.expressionRelational();
      var r = this.expressions.pop(); 
      var l = this.expressions.pop(); 
      if (type == EQUALS) {
        this.expressions.push(new ExpressionEquals(l, r));
      } else {
        this.expressions.push(new ExpressionNotEquals(l, r));
      }
    }
  };

  this.expressionRelational = function() {
    this.expressionAdditive();
    while (this.isUp(GREATER_THAN) || this.isUp(GREATER_THAN_EQUALS) || this.isUp(LESS_THAN) || this.isUp(LESS_THAN_EQUALS) || (this.is_python && (this.isUp(EQUALS) || this.isUp(NOT_EQUALS)))) {
      var type = this.tokens[this.i].type;
      ++this.i;
      this.expressionAdditive();
      var r = this.expressions.pop(); 
      var l = this.expressions.pop(); 
      if (type == GREATER_THAN) {
        this.expressions.push(new ExpressionGreaterThan(l, r));
      } else if (type == GREATER_THAN_EQUALS) {
        this.expressions.push(new ExpressionGreaterThanEquals(l, r));
      } else if (type == LESS_THAN) {
        this.expressions.push(new ExpressionLessThan(l, r));
      } else if (type == LESS_THAN_EQUALS) {
        this.expressions.push(new ExpressionLessThanEquals(l, r));
      } else if (this.is_python && type == EQUALS) {
        this.expressions.push(new ExpressionEquals(l, r));
      } else if (this.is_python && type == NOT_EQUALS) {
        this.expressions.push(new ExpressionNotEquals(l, r));
      } else {
        console.log('UHOH');
      }
    }
  };

  this.expressionAdditive = function() {
    this.expressionMultiplicative();
    while (this.isUp(ADD) || this.isUp(MINUS)) {
      var type = this.tokens[this.i].type;
      ++this.i;
      this.expressionMultiplicative();
      var r = this.expressions.pop(); 
      var l = this.expressions.pop(); 
      if (type == ADD) {
        this.expressions.push(new ExpressionAdd(l, r));
      } else {
        this.expressions.push(new ExpressionSubtract(l, r));
      }
    }
  };

  this.expressionMultiplicative = function() {
    this.expressionNegative();
    while (this.isUp(MULTIPLY) || this.isUp(DIVIDE) || this.isUp(REMAINDER)) {
      var type = this.tokens[this.i].type;
      ++this.i;
      this.expressionNegative();
      var r = this.expressions.pop(); 
      var l = this.expressions.pop(); 
      if (type == MULTIPLY) {
        this.expressions.push(new ExpressionMultiply(l, r));
      } else if (type == DIVIDE) {
        this.expressions.push(new ExpressionDivide(l, r));
      } else {
        this.expressions.push(new ExpressionRemainder(l, r));
      }
    }
  };

  this.expressionNegative = function() {
    if (this.isUp(MINUS)) {
      ++this.i;
      this.expressionAtom();
      var r = this.expressions.pop(); 
      this.expressions.push(new ExpressionNegative(r));
    } else if (!this.is_python && this.isUp(NOT)) {
      ++this.i;
      this.expressionAtom();
      var r = this.expressions.pop(); 
      this.expressions.push(new ExpressionNot(r));
    } else if (this.isUp(ABSOLUTE_VALUE)) {
      ++this.i;
      this.expressionAtom();
      var r = this.expressions.pop(); 
      this.expressions.push(new ExpressionAbs(r));
    } else if (this.isUp(MAX) || this.isUp(MIN)) {
      var isMin = this.isUp(MIN);

      ++this.i;
      if (this.isUp(OPEN)) {
        ++this.i;
      } else {
        throw 'I expected (.';
      }
      this.expressionOr();
      if (this.isUp(COMMA)) {
        ++this.i;
      } else {
        throw 'I expected ,.';
      }
      this.expressionOr();
      if (this.isUp(CLOSE)) {
        ++this.i;
      } else {
        throw 'I expected ).';
      }

      var r = this.expressions.pop(); 
      var l = this.expressions.pop(); 

      if (isMin) {
        this.expressions.push(new ExpressionMin(l, r));
      } else {
        this.expressions.push(new ExpressionMax(l, r));
      }
    } else {
      this.expressionAtom();
    }
  };

  this.expressionAtom = function() {
    if (this.isUp(X)) {
      ++this.i;
      this.expressions.push(new ExpressionX());
    } else if (this.isUp(LITERAL_TRUE)) {
      ++this.i;
      this.expressions.push(new ExpressionBoolean(true));
    } else if (this.isUp(LITERAL_FALSE)) {
      ++this.i;
      this.expressions.push(new ExpressionBoolean(false));
    } else if (this.isUp(Y)) {
      ++this.i;
      this.expressions.push(new ExpressionY());
    } else if (this.isUp(INTEGER)) {
      this.expressions.push(new ExpressionInteger(parseInt(this.tokens[this.i].text)));
      ++this.i;
    } else if (this.isUp(OPEN)) {
      ++this.i;
      this.expressionOr();
      if (this.isUp(CLOSE)) {
        ++this.i;
      } else {
        throw 'missing right';
      }
    } else {
      throw 'Whoa. I ran into ' + this.tokens[this.i].text + ' and really didn\'t expect that.';
    }
  };

  this.isUp = function(expected) {
    return this.i < this.tokens.length && this.tokens[this.i].type == expected;
  };
}
