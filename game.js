var isShown = false;
var isGotEm = false;
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

function onLevelEnd() {
  hideBalloon();

  // Show level end message square in the middle to distinguish one
  // level from another.
  $('body').showBalloon({
    position: null,
    offsetX: 0,
    offsetY: 0,
    tipSize: 0,
    html: true,
    minLifetime: 0,
    hideComplete: function() {
    },
    css: {
      fontSize: '18pt',
      fontFamily: 'sans-serif',
      width: 500
    },
    classname: 'balloon',
    contents: localize(worlds[state.currentWorld].message),
  });

  $('#guess').prop('disabled', true);
  if (document.activeElement) {
    document.activeElement.blur();
  }

  // Hit Enter to go on to the next generation.
  $('body').on('keyup', handleKey);
  
  return false;
}

function hideBalloon() {
  $('#guess').hideBalloon();
  isShown = false;
}

var intro = [
  {selector: 'body', message: 'Welcome to Trux Falsy, a game where Space and Logic marry and have somewhere between 0 and 100 kids. You, a gene therapist, will help them have the ones they want. Hit Enter to proceed.', position: null, width: 500},
  {selector: '#expectedGrid', message: 'On the left you see highlighted the kids they want to have. Each has a particular <code>xy</code> chromosome.'},
  {selector: '#bookmark82', message: 'For example, this kid\'s <code>x</code> chromosome is 2 and its <code>y</code> chromosome is 8. The eager parents want this kid to be born.', width: 250, position: 'bottom', offsetY: 15},
  {selector: '#bookmark37', message: 'Check out this kid. Its <code>x</code> chromosome is 7 and its <code>y</code> chromosome is 3. The eager parents aren\'t yet ready for this kid to be born. But don\'t feel too bad. In future litters, kid 7-3 will see the light of day.', width: 250, position: 'top', offsetY: -15},
  {selector: '#actualGrid', message: 'On the right are the kids that will actually be born given the couple\'s current Genetic Expression, which you craft.'},
  {selector: '#guess', message: 'In the box above, enter a Genetic Expression that selects out all the kids whose <code>x</code> chromosome is less than 5 by typing <code>x &lt; 5</code>.'},
];
var iIntro = 0;

function advanceIntro() {
  if (iIntro > 0) {
    $(intro[iIntro].selector).hideBalloon();
    if (iIntro == intro.length - 1) {
      document.getElementById('guess').disabled = false;
      document.getElementById('guess').focus();
    }
  } else {
    document.getElementById('guess').disabled = true;
  }

  var offsetX = intro[iIntro].hasOwnProperty('offsetX') ? intro[iIntro].offsetX : 0;
  var offsetY = intro[iIntro].hasOwnProperty('offsetY') ? intro[iIntro].offsetY : 0;
  var width = 0;

  var width;
  if (intro[iIntro].hasOwnProperty('width')) {
    width = intro[iIntro].width;
  } else {
    width = $(intro[iIntro].selector).width();
  }

  var position;
  if (intro[iIntro].hasOwnProperty('position')) {
    position = intro[iIntro].position;
  } else {
    position = 'bottom';
  }

  if (iIntro == intro.length - 1) {
    showBalloon(intro[iIntro].message);
  } else {
    $(intro[iIntro].selector).showBalloon({
      position: position,
      offsetX: offsetX,
      offsetY: offsetY,
      tipSize: iIntro == 0 ? 0 : 20,
      html: true,
      minLifetime: 0,
      hideComplete: function() {
        ++iIntro;
        advanceIntro();
      },
      css: {
        fontSize: '18pt',
        fontFamily: 'sans-serif',
        width: width
      },
      classname: 'balloon',
      contents: localize(intro[iIntro].message),
    });
  }

  if (iIntro < intro.length - 1) {
    $('body').on('keyup', function(e) {
      if (!e) e = window.event;
      var keyCode = e.keyCode || e.which;
      if (keyCode == '13') {
        $(intro[iIntro].selector).hideBalloon();
      }
    });
  } else {
    $('body').off('keyup');
    document.getElementById('guess').focus();
  }
}

$(document).ready(function() {
  if (typeof(Storage) !== 'undefined') {
    if (localStorage.getItem('state') !== null) {
      state = JSON.parse(localStorage.getItem('state'));
    }
    if (state.currentWorld < 0 || state.currentWorld >= worlds.length ||
        state.currentLevel < 0 || state.currentLevel >= worlds[state.currentWorld].levels.length) {
      state.currentWorld = 0;
      state.currentLevel = 0;
    }

    if (!state.hasOwnProperty('syntax') || state.syntax == 'c') {
      switchToCSyntax();
    } else {
      switchToPythonSyntax();
    }
  } else {
    alert('Trux Falsy requires a web browser that supports HTML5. Without it, your progress cannot be saved.');
  }

  load();

  // Let's create a div to overlay kid 82 in the expected SVG grid. We need one
  // because we want to put a balloon under that kid during the tutorial, but
  // the balloon library doesn't like attaching to non-DOM SVG elements.
  var node82 = document.getElementById('expectedBottom82');
  var rect = node82.getBoundingClientRect();

  var bookmark82 = document.createElement("div");
  bookmark82.id = 'bookmark82';
  bookmark82.style.position = 'absolute';
  bookmark82.style.left = rect.left + 'px';
  bookmark82.style.top = (rect.top + window.scrollY) + 'px';
  bookmark82.style.width = rect.width + 'px';
  bookmark82.style.height = rect.height + 'px';
  $('body').append(bookmark82);

  // Let's do something similar for an unhighlighted child, say 37.
  var node37 = document.getElementById('expectedTop37');
  var rect = node37.getBoundingClientRect();

  var bookmark37 = document.createElement("div");
  bookmark37.id = 'bookmark37';
  bookmark37.style.position = 'absolute';
  bookmark37.style.left = rect.left + 'px';
  bookmark37.style.top = (rect.top + window.scrollY) + 'px';
  bookmark37.style.width = rect.width + 'px';
  bookmark37.style.height = rect.height + 'px';
  $('body').append(bookmark37);

  // If window resizes, the bookmarks move. We won't try to update
  // the balloons if they're already displayed.
  $(window).resize(function() {
    var node82 = document.getElementById('expectedBottom82');
    var rect = node82.getBoundingClientRect();
    var bookmark82 = document.getElementById('bookmark82');
    console.log(rect.left + ' ' + rect.top);
    bookmark82.style.left = rect.left + 'px';
    bookmark82.style.top = (rect.top + window.scrollY) + 'px';
    bookmark82.style.width = rect.width + 'px';
    bookmark82.style.height = rect.height + 'px';

    var node37 = document.getElementById('expectedTop37');
    var rect = node37.getBoundingClientRect();
    var bookmark37 = document.getElementById('bookmark37');
    bookmark37.style.left = rect.left + 'px';
    bookmark37.style.top = (rect.top + window.scrollY) + 'px';
    bookmark37.style.width = rect.width + 'px';
    bookmark37.style.height = rect.height + 'px';
  });

  $('#gear').click(showMenu);
  $('#settings').dialog({
    modal: true,
    autoOpen: false,
    maxHeight: 0.75 * $('body').height()
  });

  $('#gear').hover(function() {
    $(this).attr('src', 'gear_hi.png');
  }, function() {
    $(this).attr('src', 'gear_lo.png');
  });
});

function reset() {
  localStorage.removeItem('state');
  $('#settings').dialog('close');
  location.reload();
  return false;
}

function switchToCSyntax() {
  andToken = '&&';
  orToken = '||';
  notToken = '!';
  trueToken = 'true';
  falseToken = 'false';
  state.syntax = 'c';
  localStorage.setItem('state', JSON.stringify(state));
}

function switchToPythonSyntax() {
  andToken = 'and';
  orToken = 'or';
  notToken = 'not';
  trueToken = 'True';
  falseToken = 'False';
  state.syntax = 'python';
  localStorage.setItem('state', JSON.stringify(state));
}

function showMenu() {
  var html = '<h4>Syntax</h4>'
  html += '<div style="margin-left: 15px; margin-top: 10px;">';
  html += '<input type="radio" name="syntax" id="c_syntax"><label for="c_syntax"><code>&amp;&amp;</code> <code>||</code> <code>!</code> <code>true</code> <code>false</code></label><br>';
  html += '<input type="radio" name="syntax" id="python_syntax"><label for="python_syntax"><code>and</code> <code>or</code> <code>not</code> <code>True</code> <code>False</code></label>';
  html += '</div>';
  html += '<h4>Levels</h4><ul style="margin-left: 0px; padding-left: 15px; list-style: none;">'
  for (var world = 0; world <= state.maxWorld; ++world) {
    var nlevels = world == state.maxWorld ? state.maxLevel : worlds[world].levels.length - 1;
    for (var level = 0; level <= nlevels; ++level) {
      var stars = '';
      if (state.hasOwnProperty('nstars-' + world + '-' + level)) {
        stars = rating(state['nstars-' + world + '-' + level]);
      } else {
        stars = rating(0);
      }
      html += '<li>' + stars + ' <a href="#" onclick="jumpToLevel(' + world + ', ' + level + ')">Generation ' + world + ', Litter ' + level + '</a></li>';
    }
  }
  html += '</ul>';
  html += '<a href="#" onclick="reset()">Clear History</a>';
  $('#settings').html(html);

  if (!state.hasOwnProperty('syntax') || state.syntax == 'c') {
    $('#c_syntax').prop('checked', true);
  } else {
    $('#python_syntax').prop('checked', true);
  }
  
  $('#c_syntax').click(switchToCSyntax);
  $('#python_syntax').click(switchToPythonSyntax);
  $('#settings').dialog('open');
}

function jumpToLevel(world, level) {
  $('#settings').dialog('close');
  
  state.currentWorld = world;
  state.currentLevel = level;
  load();

  return false;
}

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
  return s.replace(/AND/g, andToken).replace(/OR/g, orToken).replace(/NOT/g, notToken).replace(/FALSE/, falseToken).replace(/TRUE/, trueToken);
}

document.getElementById('guess').onkeyup = function(e) {
  if (!e) e = window.event;
  var keyCode = e.keyCode || e.which;
  if (keyCode == '13' && nRight == 100) {
    if (state.currentLevel == worlds[state.currentWorld].levels.length - 1) {
      onLevelEnd();
    } else {
      next(); 
    }
    e.stopPropagation();
  }
}

function handleKey(e) {
  if (!e) e = window.event;
  var keyCode = e.keyCode || e.which;
  if (keyCode == '13') {
    hideBodyBalloon();
    next();
  }
}

function hideBodyBalloon() {
  $('body').hideBalloon();
  $('body').off('keyup');
  $('#guess').prop('disabled', false);
  document.getElementById('guess').focus();
}

var nRight = 0;

function showGuess() {
  var src = document.getElementById('guess').value;
  state['solution-' + state.currentWorld + '-' + state.currentLevel] = src;
  state['nstars-' + state.currentWorld + '-' + state.currentLevel] = 0;

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
    var ast = parser.parse(state.syntax == 'python');
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
        if (result.isBoolean && result.toBoolean() === leval(state.currentWorld, state.currentLevel, x, y)) {
          wrong.style['stroke-opacity'] = 0.0;
          ++nRight;
        } else {
          wrong.style['stroke-opacity'] = 0.2;
        }
      }
    }

    document.getElementById('percentage').innerHTML = nRight + '/100 right';
  } catch (e) {
    document.getElementById('percentage').innerHTML = localize('' + e);
  }

  if (!isGotEm && nRight == 100) {
    var nchars = src.replace(/\s/g, '').length;
    var stars = worlds[state.currentWorld].levels[state.currentLevel].stars;
    for (var n = 1; n < 3 && nchars <= stars[n - 1]; ++n) {
    }
    state['nstars-' + state.currentWorld + '-' + state.currentLevel] = n;
    showBalloon('Got \'em! Your expression earned ' + rating(n) + '. Hit Enter to continue. ' + nchars);
    isGotEm = true;
  } else if (isGotEm && nRight != 100) {
    hideBalloon();
    isGotEm = false;
  }
  localStorage.setItem('state', JSON.stringify(state));

  return true;
}

function rating(n) {
  var stars = '';
  for (var i = 0; i < 3; ++i) {
    var clazz = i < n ? 'filled' : 'empty';
    stars += '<span class="' + clazz + '">&#x2605;</span>';
  }
  return stars;
}

function next() {
  document.getElementById('percentage').innerHTML = '&nbsp;';
  document.getElementById('guess').value = ''; 

  if (state.currentLevel == worlds[state.currentWorld].levels.length - 1) {
    state.currentWorld = (state.currentWorld + 1) % worlds.length;
    state.currentLevel = 0;
  } else {
    ++state.currentLevel;
  }
  
  if (state.currentWorld > state.maxWorld || (state.currentWorld == state.maxWorld && state.currentLevel > state.maxLevel)) {
    state.maxWorld = state.currentWorld;
    state.maxLevel = state.currentLevel;
  }

  localStorage.setItem('state', JSON.stringify(state));

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
document.getElementById('expectedGrid').appendChild(text);
text = createTextNode('y', charWidth * 0.5, gridHeight - bottomMargin - 4.5 * tileDiameter - tileRadius);
document.getElementById('actualGrid').appendChild(text);

for (var y = 0; y < 10; ++y) {
  for (var x = 0; x < 10; ++x) {
    var i = y * 10 + x;

    var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttributeNS(null, 'id', 'expectedTop' + i);
    path.setAttributeNS(null, 'd', 'M' + (leftMargin + x * tileDiameter) + ',' + (gridHeight - bottomMargin - y * tileDiameter - tileRadius) + ' a' + tileRadius + ',' + tileRadius + ' 0, 0,1 ' + tileDiameter + ',0');
    path.style['stroke-width'] = 0;
    path.style.fill = '#FFFFFF';
    document.getElementById('expectedGrid').appendChild(path);

    path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttributeNS(null, 'id', 'expectedBottom' + i);
    path.setAttributeNS(null, 'd', 'M' + (leftMargin + x * tileDiameter) + ',' + (gridHeight - bottomMargin - y * tileDiameter - tileRadius) + ' a' + tileRadius + ',' + tileRadius + ' 0, 0,0 ' + tileDiameter + ',0');
    path.style['stroke-width'] = 0;
    path.style.fill = '#FFFFFF';
    document.getElementById('expectedGrid').appendChild(path);

    var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttributeNS(null, 'id', 'actualTop' + i);
    path.setAttributeNS(null, 'd', 'M' + (leftMargin + x * tileDiameter) + ',' + (gridHeight - bottomMargin - y * tileDiameter - tileRadius) + ' a' + tileRadius + ',' + tileRadius + ' 0, 0,1 ' + tileDiameter + ',0');
    path.style['stroke-width'] = 0;
    path.style.fill = '#FFFFFF';
    document.getElementById('actualGrid').appendChild(path);

    path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttributeNS(null, 'id', 'actualBottom' + i);
    path.setAttributeNS(null, 'd', 'M' + (leftMargin + x * tileDiameter) + ',' + (gridHeight - bottomMargin - y * tileDiameter - tileRadius) + ' a' + tileRadius + ',' + tileRadius + ' 0, 0,0 ' + tileDiameter + ',0');
    path.style['stroke-width'] = 0;
    path.style.fill = '#FFFFFF';
    document.getElementById('actualGrid').appendChild(path);

    wrong = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    wrong.setAttributeNS(null, 'id', 'wrong' + i);
    wrong.setAttributeNS(null, 'd', 'M' + (leftMargin + x * tileDiameter + tileRadius) + ',' + (gridHeight - bottomMargin - y * tileDiameter - tileRadius) + ' m' + -strikeHalfSide + ',' + -strikeHalfSide + ' l' + strikeSide + ',' + strikeSide + ' m' + -strikeHalfSide + ',' + -strikeHalfSide + ' m' + -strikeHalfSide + ',' + strikeHalfSide + ' l' + strikeSide + ',' + -strikeSide);
    wrong.style['stroke-width'] = 5;
    wrong.style.stroke = '#000000';
    wrong.style['stroke-opacity'] = 0;
    document.getElementById('actualGrid').appendChild(wrong);
  }
}

function leval(world, level, x, y) {
  if (world >= 0 && world < worlds.length && level >= 0 && level < worlds[world].levels.length) {
    return worlds[world].levels[level].configuration.charAt(y * 10 + x) == '1';
  } else {
    return false;
  }
}

var state = new Object();
state.currentWorld = 0;
state.currentLevel = 0;
state.maxWorld = 0;
state.maxLevel = 0;

function load() {
  // In case the level completed message is showing...
  hideBodyBalloon();

  isGotEm = false;
  nRight = 0;
  document.getElementById('levelName').innerHTML = 'Generation ' + state.currentWorld + ', Litter ' + state.currentLevel;
  for (var y = 0; y < 10; ++y) {
    for (var x = 0; x < 10; ++x) {
      var i = y * 10 + x;
      var expectedTop = document.getElementById('expectedTop' + i);
      var expectedBottom = document.getElementById('expectedBottom' + i);
      var actualTop = document.getElementById('actualTop' + i);
      var actualBottom = document.getElementById('actualBottom' + i);
      if (leval(state.currentWorld, state.currentLevel, x, y)) {
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

  var key = 'solution-' + state.currentWorld + '-' + state.currentLevel;
  if (key in state) {
    var src = document.getElementById('guess');
    if (state[key].length > 0) {
      src.value = state[key];
      src.focus();
      // hideBalloon();
      showGuess();
    }
  }

  if (nRight != 100) {
    if (state.currentWorld == 0 && state.currentLevel == 0) {
      advanceIntro();
    }

    if (worlds[state.currentWorld].levels[state.currentLevel].hasOwnProperty('message')) {
      showBalloon(localize(worlds[state.currentWorld].levels[state.currentLevel].message));
    } else {
      hideBalloon();
    }
  }
}
