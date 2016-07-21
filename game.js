var isShown = false;
var pendingMessage = null;

function showBalloon(msg) {
  if (isShown) {
    pendingMessage = msg;
    hideBalloon();
  } else {
    $('#guess').showBalloon({
      position: "bottom",
      tipSize: 10,
      html: true,
      minLifetime: 0,
      hideComplete: function() {
        if (pendingMessage != null) {
          showBalloon(pendingMessage);
          pendingMessage = null;
        }
      },
      css: {
        fontSize: '18pt',
        fontFamily: 'sans-serif',
        width: 1000,
      },
      contents: msg,
    });

    isShown = true;
  }
}

function hideBalloon() {
  $('#guess').hideBalloon();
  isShown = false;
}

var intro = [
  {selector: 'body', message: 'Welcome to Trux Falsy, a game where Space and Logic marry and have somewhere between 0 and 100 kids. You, a gene therapist, will help them have the ones they want. Click in this box to proceed.'},
  {selector: '#expectedGrid', message: 'On the left you see the kids they want to have. They are brightly colored. Each lives at a particular two-dimensional location.'},
  {selector: '#bookmark82', message: 'For example, this kid\'s x-coordinate is 2 and its y-coordinate is 8.'},
  {selector: '#actualGrid', message: 'On the right are the kids that will actually be born given the couple\'s current Genetic Expression.'},
  {selector: '#guess', message: 'In the box above, enter a Genetic Expression using the language of logic&mdash;that is, in terms of <code>x</code>, <code>y</code>, and various operators that you will learn about. For example, <code>y &gt;= 8</code> causes the top two rows to be born. Operators <code>&lt;</code>, <code>&lt;=</code>, and <code>&gt;</code> are also available. Express x and y values only for the kids shown in Expected.'},
];
var ii = 0;

function advanceIntro() {
  if (ii > 0) {
    $(intro[ii].selector).hideBalloon();
  }

  var offsetX = 0;
  var offsetY = 0;
  var position = "bottom";
  var width = 0;

  if (ii == 0) {
    width = 500;
    position = null;
  } else if (ii == 2) {
    width = 250;
  } else {
    width = $(intro[ii].selector).width();
  }

  if (ii == intro.length - 1) {
    showBalloon(intro[ii].message);
  } else {
    $(intro[ii].selector).showBalloon({
      position: position,
      offsetX: offsetX,
      offsetY: offsetY,
      tipSize: ii == 0 ? 0 : 10,
      html: true,
      minLifetime: 0,
      hideComplete: function() {
        ++ii;
        advanceIntro();
      },
      css: {
        fontSize: '18pt',
        fontFamily: 'sans-serif',
        width: width
      },
      classname: 'balloon',
      contents: localize(intro[ii].message),
    });
  }

  if (ii < intro.length - 1) {
    $('.balloon').on('click', function() {
      $(intro[ii].selector).hideBalloon();
    });
  } else {
    $('.balloon').off('click');
    document.getElementById('guess').focus();
  }
}

$(document).ready(function() {
  load();

  var node82 = document.getElementById('expectedBottom82');
  var rect = node82.getBoundingClientRect();

  // Let's create a div to overlay kid 82 in the expected SVG grid. We need one
  // because we want to put a balloon under that kid during the tutorial, but
  // the balloon library doesn't like attaching to non-DOM SVG elements.
  var bookmark82 = document.createElement("div");
  bookmark82.id = 'bookmark82';
  bookmark82.style.position = 'absolute';
  bookmark82.style.left = rect.left + 'px';
  bookmark82.style.top = (rect.top + window.scrollY) + 'px';
  bookmark82.style.width = rect.width + 'px';
  bookmark82.style.height = rect.height + 'px';
  $('body').append(bookmark82);
  
  advanceIntro();
});

var topTrueColor =  'hsl(306, 100%, 74%)';
var bottomTrueColor = 'hsl(306, 100%, 64%)';
var topFalseColor = 'hsl(0, 0%, 90%)';
var bottomFalseColor = 'hsl(0, 0%, 85%)';

// Converts operator placeholders with target language tokens. Any instances of
// AND, OR, and NOT in the given string will be replaced with the operator tokens
// for the current language.
// s -> String to convert.
// <- String with placeholders replaced by language tokens.
function localize(s) {
  return s.replace(/AND/g, andToken).replace(/OR/g, orToken).replace(/NOT/g, notToken);
}

document.getElementById('guess').onkeypress = function(e) {
  if (!e) e = window.event;
  var keyCode = e.keyCode || e.which;
  if (keyCode == '13' && nRight == 100) {
    next(); 
  }
}

var nRight = 0;

function showGuess() {
  var src = document.getElementById('guess').value;

  if (src == '') {
    document.getElementById('percentage').innerHTML = '&nbsp;';
    load();
    return;
  }
  nRight = 0;

  try {
    var lexer = new Lexer(src);
    var tokens = lexer.lex();
    var parser = new Parser(tokens);
    var ast = parser.parse();
    console.log(ast);

    for (var y = 0; y < 10; ++y) {
      for (var x = 0; x < 10; ++x) {
        var i = y * 10 + x;
        var actualTop = document.getElementById('actualTop' + i);    
        var actualBottom = document.getElementById('actualBottom' + i);    
        var result = ast.evaluate({'x': x, 'y': y});

        if (result.isBoolean) {
          if (result.toBoolean()) {
            actualTop.style.fill = topTrueColor;
            actualBottom.style.fill = bottomTrueColor;
          } else {
            actualTop.style.fill = topFalseColor;
            actualBottom.style.fill = bottomFalseColor;
          }
        } else {
          throw 'Your expression doesn\'t yield true or false.';
        }

        var wrong = document.getElementById('wrong' + i);    
        if (result.isBoolean && result.toBoolean() === leval(wi, li, x, y)) {
          wrong.style['stroke-opacity'] = 0.0;
          ++nRight;
        } else {
          wrong.style['stroke-opacity'] = 0.2;
        }
      }
    }

    document.getElementById('percentage').innerHTML = nRight + '/100 right';
    if (nRight == 100) {
      if (li == worlds[wi].levels.length - 1) {
        showBalloon(localize(worlds[wi].message));
      } else {
        showBalloon('Got \'em! Hit Enter for the next litter.');
      }
    }
  } catch (e) {
    document.getElementById('percentage').innerHTML = localize(e);
  }

  return true;
}

function next() {
  document.getElementById('percentage').innerHTML = '&nbsp;';
  if (li == worlds[wi].levels.length - 1) {
    wi = (wi + 1) % worlds.length;
    li = 0;
  } else {
    ++li;
  }
  document.getElementById('guess').value = ''; 
  load();
}

// Divide the grid up into 12 rows. The top 10 are for the tiles.
// The second-to-bottom is for the x tic marks. We don't allow
// these marks to be taller than the tiles. The bottom is the
// axis label.
var gridHeight = 450;
var tileDiameter = gridHeight / 12;
var tileRadius = tileDiameter * 0.5;
var strikeDiameter = 0.7 * tileDiameter;
var strikeSide = Math.sqrt(2 * Math.pow(strikeDiameter, 2)) * 0.5;
var strikeHalfSide = 0.5 * strikeSide;
var fontSizePixels = 0.5 * tileDiameter;

// Creates a text node whose pivot point/origin is in its center.
// This makes aligning it a bit easier.
function createTextNode(symbol, x, y) {
  var text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  text.setAttributeNS(null, 'font-size', fontSizePixels + 'px');
  text.setAttributeNS(null, 'font-family', 'monospace');
  text.setAttributeNS(null, 'fill', '#999999');
  text.setAttributeNS(null, 'alignment-baseline', 'central');
  text.setAttributeNS(null, 'text-anchor', 'middle');
  text.setAttributeNS(null, 'x', x);
  text.setAttributeNS(null, 'y', y);
  text.textContent = symbol;
  return text;
}

// Determine the size of a character. We will need these bounds to
// position the x and y tic marks.
var text = createTextNode('9', 0, 0);
document.getElementById('expectedGrid').appendChild(text);
var bbox = text.getBBox();
document.getElementById('expectedGrid').removeChild(text);

var charWidth = bbox.width;
var charHeight = bbox.height;
var leftMargin = 4 * charWidth;
var bottomMargin = 2 * tileDiameter;

for (var i = 0; i < 10; ++i) {
  var y = gridHeight - bottomMargin - i * tileDiameter - tileRadius;

  // Y labels.
  text = createTextNode('' + i, 2.5 * charWidth, y);
  document.getElementById('expectedGrid').appendChild(text);
  text = createTextNode('' + i, 2.5 * charWidth, y);
  document.getElementById('actualGrid').appendChild(text);

  // X labels.
  text = createTextNode('' + i, leftMargin + i * tileDiameter + tileRadius, gridHeight - tileDiameter - charHeight);
  document.getElementById('expectedGrid').appendChild(text);
  text = createTextNode('' + i, leftMargin + i * tileDiameter + tileRadius, gridHeight - tileDiameter - charHeight);
  document.getElementById('actualGrid').appendChild(text);
}

text = createTextNode('x', leftMargin + 4.5 * tileDiameter + tileRadius, gridHeight - charHeight * 1.5);
document.getElementById('expectedGrid').appendChild(text);
text = createTextNode('x', leftMargin + 4.5 * tileDiameter + tileRadius, gridHeight - charHeight * 1.5);
document.getElementById('actualGrid').appendChild(text);

text = createTextNode('y', charWidth * 0.5, gridHeight - bottomMargin - 4.5 * tileDiameter - tileRadius);
//text.setAttributeNS(null, 'transform', 'rotate(-90 ' + (charWidth * 0.5) + ' ' + (gridHeight - bottomMargin - 4.5 * tileDiameter - tileRadius) + ')');
document.getElementById('expectedGrid').appendChild(text);
text = createTextNode('y', charWidth * 0.5, gridHeight - bottomMargin - 4.5 * tileDiameter - tileRadius);
//text.setAttributeNS(null, 'transform', 'rotate(-90 ' + (charWidth * 0.5) + ' ' + (gridHeight - bottomMargin - 4.5 * tileDiameter - tileRadius) + ')');
document.getElementById('actualGrid').appendChild(text);

for (var y = 0; y < 10; ++y) {
  for (var x = 0; x < 10; ++x) {
    var i = y * 10 + x;

    var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttributeNS(null, 'id', 'expectedTop' + i);
    path.setAttributeNS(null, 'd', 'M' + (leftMargin + x * tileDiameter) + ',' + (gridHeight - bottomMargin - y * tileDiameter - tileRadius) + ' a' + tileRadius + ',' + tileRadius + ' 0, 0,1 ' + tileDiameter + ',0');
    path.style['stroke-width'] = 0;
    document.getElementById('expectedGrid').appendChild(path);

    path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttributeNS(null, 'id', 'expectedBottom' + i);
    path.setAttributeNS(null, 'd', 'M' + (leftMargin + x * tileDiameter) + ',' + (gridHeight - bottomMargin - y * tileDiameter - tileRadius) + ' a' + tileRadius + ',' + tileRadius + ' 0, 0,0 ' + tileDiameter + ',0');
    path.style['stroke-width'] = 0;
    document.getElementById('expectedGrid').appendChild(path);

    var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttributeNS(null, 'id', 'actualTop' + i);
    path.setAttributeNS(null, 'd', 'M' + (leftMargin + x * tileDiameter) + ',' + (gridHeight - bottomMargin - y * tileDiameter - tileRadius) + ' a' + tileRadius + ',' + tileRadius + ' 0, 0,1 ' + tileDiameter + ',0');
    path.style['stroke-width'] = 0;
    document.getElementById('actualGrid').appendChild(path);

    path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttributeNS(null, 'id', 'actualBottom' + i);
    path.setAttributeNS(null, 'd', 'M' + (leftMargin + x * tileDiameter) + ',' + (gridHeight - bottomMargin - y * tileDiameter - tileRadius) + ' a' + tileRadius + ',' + tileRadius + ' 0, 0,0 ' + tileDiameter + ',0');
    path.style['stroke-width'] = 0;
    document.getElementById('actualGrid').appendChild(path);

    wrong = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    wrong.setAttributeNS(null, 'id', 'wrong' + i);
    wrong.setAttributeNS(null, 'd', 'M' + (leftMargin + x * tileDiameter + tileRadius) + ',' + (gridHeight - bottomMargin - y * tileDiameter - tileRadius) + ' m' + -strikeHalfSide + ',' + -strikeHalfSide + ' l' + strikeSide + ',' + strikeSide + ' m' + -strikeHalfSide + ',' + -strikeHalfSide + ' m' + -strikeHalfSide + ',' + strikeHalfSide + ' l' + strikeSide + ',' + -strikeSide);
    wrong.style['stroke-width'] = 5;
    wrong.style.stroke = '#000000';
    document.getElementById('actualGrid').appendChild(wrong);
  }
}

function leval(wi, li, x, y) {
  return worlds[wi].levels[li].configuration.charAt(y * 10 + x) == '1';
}

var wi = 0;
var li = 0;

function load() {
  nRight = 0;
  document.getElementById('levelName').innerHTML = 'Generation ' + wi + ', Litter ' + li + ': ' + worlds[wi].levels[li].name;
  for (var y = 0; y < 10; ++y) {
    for (var x = 0; x < 10; ++x) {
      var i = y * 10 + x;
      var expectedTop = document.getElementById('expectedTop' + i);
      var expectedBottom = document.getElementById('expectedBottom' + i);
      var actualTop = document.getElementById('actualTop' + i);
      var actualBottom = document.getElementById('actualBottom' + i);
      if (leval(wi, li, x, y)) {
        expectedTop.style.fill = topTrueColor;
        expectedBottom.style.fill = bottomTrueColor;
      } else {
        expectedTop.style.fill = topFalseColor;
        expectedBottom.style.fill = bottomFalseColor;
      }
      actualTop.style.fill = topFalseColor;
      actualBottom.style.fill = bottomFalseColor;
      var wrong = document.getElementById('wrong' + i);
      wrong.style['stroke-opacity'] = 0;
    }
  }

  if (worlds[wi].levels[li].hasOwnProperty('message')) {
    showBalloon(localize(worlds[wi].levels[li].message));
  } else {
    hideBalloon();
  }
}
