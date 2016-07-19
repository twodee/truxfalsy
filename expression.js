function ExpressionOr(l, r) {
  this.l = l;
  this.r = r;
  this.evaluate = function(env) {
    var ll = l.evaluate(env); 
    var rr = r.evaluate(env); 
    if (!ll.isBoolean) throw '<code>OR</code> expects boolean operands.';
    if (!rr.isBoolean) throw '<code>OR</code> expects boolean operands.';
    return new ExpressionBoolean(ll.toBoolean() || rr.toBoolean());
  }
}

function ExpressionAnd(l, r) {
  this.l = l;
  this.r = r;
  this.evaluate = function(env) {
    var ll = l.evaluate(env); 
    var rr = r.evaluate(env); 
    if (!ll.isBoolean) throw '<code>AND</code> expects boolean operands.';
    if (!rr.isBoolean) throw '<code>AND</code> expects boolean operands.';
    return new ExpressionBoolean(ll.toBoolean() && rr.toBoolean());
  }
}

function ExpressionBitwiseOr(l, r) {
  this.l = l;
  this.r = r;
  this.evaluate = function(env) {
    var ll = l.evaluate(env); 
    var rr = r.evaluate(env); 
    if (!ll.isInteger) throw '<code>|</code> expects integer operands.';
    if (!rr.isInteger) throw '<code>|</code> expects integer operands.';
    return new ExpressionInteger(ll.toInteger() | rr.toInteger());
  }
}

function ExpressionBitwiseAnd(l, r) {
  this.l = l;
  this.r = r;
  this.evaluate = function(env) {
    var ll = l.evaluate(env); 
    var rr = r.evaluate(env); 
    if (!ll.isInteger) throw '<code>&</code> expects integer operands.';
    if (!rr.isInteger) throw '<code>&</code> expects integer operands.';
    return new ExpressionInteger(ll.toInteger() & rr.toInteger());
  }
}

function ExpressionXor(l, r) {
  this.l = l;
  this.r = r;
  this.evaluate = function(env) {
    var ll = l.evaluate(env); 
    var rr = r.evaluate(env); 
    if (ll.isInteger && rr.isInteger) {
      return new ExpressionInteger(ll.toInteger() ^ rr.toInteger());
    } else if (ll.isBoolean && rr.isBoolean) {
      return new ExpressionBoolean(ll.toBoolean() != rr.toBoolean());
    } else {
      throw '<code>^</code> expects its operands to have the same type.';
    }
  }
}

function ExpressionNot(r) {
  this.r = r;
  this.evaluate = function(env) {
    var rr = r.evaluate(env); 
    if (!rr.isBoolean) throw '<code>NOT</code> expects boolean operands.';
    return new ExpressionBoolean(!rr.toBoolean());
  }
}

function ExpressionAbs(r) {
  this.r = r;
  this.evaluate = function(env) {
    var rr = r.evaluate(env); 
    if (!rr.isInteger) throw '<code>ABS</code> expects integer operands.';
    return new ExpressionInteger(Math.abs(rr.toInteger()));
  }
}

function ExpressionMax(l, r) {
  this.l = l;
  this.r = r;
  this.evaluate = function(env) {
    var ll = l.evaluate(env); 
    var rr = r.evaluate(env); 
    if (!ll.isInteger) throw '<code>max</code> expects integer operands.';
    if (!rr.isInteger) throw '<code>max</code> expects integer operands.';
    return new ExpressionInteger((ll.toInteger() > rr.toInteger()) ? ll.toInteger() : rr.toInteger());
  }
}

function ExpressionMin(l, r) {
  this.l = l;
  this.r = r;
  this.evaluate = function(env) {
    var ll = l.evaluate(env); 
    var rr = r.evaluate(env); 
    if (!ll.isInteger) throw '<code>min</code> expects integer operands.';
    if (!rr.isInteger) throw '<code>min</code> expects integer operands.';
    return new ExpressionInteger((ll.toInteger() < rr.toInteger()) ? ll.toInteger() : rr.toInteger());
  }
}

function ExpressionEquals(l, r) {
  this.l = l;
  this.r = r;
  this.evaluate = function(env) {
    var ll = l.evaluate(env); 
    var rr = r.evaluate(env); 
    if (ll.isInteger && rr.isInteger) {
      return new ExpressionBoolean(ll.toInteger() == rr.toInteger());
    } else if (ll.isBoolean && rr.isBoolean) {
      return new ExpressionBoolean(ll.toBoolean() == rr.toBoolean());
    } else {
      throw '<code>==</code> expects its operands to have the same type.';
    }
  }
}

function ExpressionNotEquals(l, r) {
  this.l = l;
  this.r = r;
  this.evaluate = function(env) {
    var ll = l.evaluate(env); 
    var rr = r.evaluate(env); 
    if (ll.isInteger && rr.isInteger) {
      return new ExpressionBoolean(ll.toInteger() != rr.toInteger());
    } else if (ll.isBoolean && rr.isBoolean) {
      return new ExpressionBoolean(ll.toBoolean() != rr.toBoolean());
    } else {
      throw '<code>!=</code> expects its operands to have the same type.';
    }
  }
}

function ExpressionGreaterThan(l, r) {
  this.l = l;
  this.r = r;
  this.evaluate = function(env) {
    var ll = l.evaluate(env); 
    var rr = r.evaluate(env); 
    if (!ll.isInteger) throw '<code>&gt;</code> expects integer operands.';
    if (!rr.isInteger) throw '<code>&gt;</code> expects integer operands.';
    return new ExpressionBoolean(ll.toInteger() > rr.toInteger());
  }
}

function ExpressionGreaterThanEquals(l, r) {
  this.l = l;
  this.r = r;
  this.evaluate = function(env) {
    var ll = l.evaluate(env); 
    var rr = r.evaluate(env); 
    if (!ll.isInteger) throw '<code>&gt;=</code> expects integer operands.';
    if (!rr.isInteger) throw '<code>&gt;=</code> expects integer operands.';
    return new ExpressionBoolean(ll.toInteger() >= rr.toInteger());
  }
}

function ExpressionLessThan(l, r) {
  this.l = l;
  this.r = r;
  this.evaluate = function(env) {
    var ll = l.evaluate(env); 
    var rr = r.evaluate(env); 
    if (!ll.isInteger) throw '<code>&lt;</code> expects integer operands.';
    if (!rr.isInteger) throw '<code>&lt;</code> expects integer operands.';
    return new ExpressionBoolean(ll.toInteger() < rr.toInteger());
  }
}

function ExpressionLessThanEquals(l, r) {
  this.l = l;
  this.r = r;
  this.evaluate = function(env) {
    var ll = l.evaluate(env); 
    var rr = r.evaluate(env); 
    if (!ll.isInteger) throw '<code>&lt;=</code> expects integer operands.';
    if (!rr.isInteger) throw '<code>&lt;=</code> expects integer operands.';
    return new ExpressionBoolean(ll.toInteger() <= rr.toInteger());
  }
}

function ExpressionAdd(l, r) {
  this.l = l;
  this.r = r;
  this.evaluate = function(env) {
    var ll = l.evaluate(env); 
    var rr = r.evaluate(env); 
    if (!ll.isInteger) throw '<code>+</code> expects integer operands.';
    if (!rr.isInteger) throw '<code>+</code> expects integer operands.';
    return new ExpressionInteger(ll.toInteger() + rr.toInteger());
  }
}

function ExpressionSubtract(l, r) {
  this.l = l;
  this.r = r;
  this.evaluate = function(env) {
    var ll = l.evaluate(env); 
    var rr = r.evaluate(env); 
    if (!ll.isInteger) throw '<code>-</code> expects integer operands.';
    if (!rr.isInteger) throw '<code>-</code> expects integer operands.';
    return new ExpressionInteger(ll.toInteger() - rr.toInteger());
  }
}

function ExpressionMultiply(l, r) {
  this.l = l;
  this.r = r;
  this.evaluate = function(env) {
    var ll = l.evaluate(env); 
    var rr = r.evaluate(env); 
    if (!ll.isInteger) throw '<code>*</code> expects integer operands.';
    if (!rr.isInteger) throw '<code>*</code> expects integer operands.';
    return new ExpressionInteger(ll.toInteger() * rr.toInteger());
  }
}

function ExpressionDivide(l, r) {
  this.l = l;
  this.r = r;
  this.evaluate = function(env) {
    var ll = l.evaluate(env); 
    var rr = r.evaluate(env); 
    if (!ll.isInteger) throw '<code>/</code> expects integer operands.';
    if (!rr.isInteger) throw '<code>/</code> expects integer operands.';
    return new ExpressionInteger(ll.toInteger() / rr.toInteger());
  }
}

function ExpressionRemainder(l, r) {
  this.l = l;
  this.r = r;
  this.evaluate = function(env) {
    var ll = l.evaluate(env); 
    var rr = r.evaluate(env); 
    if (!ll.isInteger) throw '<code>%</code> expects integer operands.';
    if (!rr.isInteger) throw '<code>%</code> expects integer operands.';
    return new ExpressionInteger(ll.toInteger() % rr.toInteger());
  }
}

function ExpressionNegative(r) {
  this.r = r;
  this.evaluate = function(env) {
    var rr = r.evaluate(env); 
    if (!rr.isInteger) throw '<code>-</code> exprects an integer operand.';
    return new ExpressionInteger(-rr);
  }
}

function ExpressionInteger(value) {
  this.value = parseInt(value);

  this.evaluate = function(env) {
    return this;
  }

  this.isBoolean = false;
  this.isInteger = true;

  this.toInteger = function() {
    return value;
  }
}

function ExpressionX() {
  this.evaluate = function(env) {
    return new ExpressionInteger(env.x);
  }
}

function ExpressionY() {
  this.evaluate = function(env) {
    return new ExpressionInteger(env.y);
  }
}

function ExpressionBoolean(value) {
  this.value = value;

  this.evaluate = function(env) {
    return this;
  }

  this.isBoolean = true;
  this.isInteger = false;

  this.toBoolean = function() {
    return value;
  }
}
