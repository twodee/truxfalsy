$(document).ready(function() {
  Cookies.set('session', -1, { path: '' });
  $.getJSON('new_session.php', function(data) {
    console.log(data);
    Cookies.set('session', data['session_id'], { path: '' });
  });
});

function snapshot(generation, litter, expression, nright, nstars) {
  var session = Cookies.get('session');
  if (session) {
    session = parseInt(session);
  } else {
    session = -1;
  }
  var params = {
    generation: generation,
    litter: litter,
    expression: expression,
    nright: nright,
    nstars: nstars,
    session: session,
    nright: nright,
    nstars: nstars
  };
  $.post('snapshot.php', params);
}
