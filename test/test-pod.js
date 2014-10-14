var start = QUnit.start;

function createAudio() {
  var audio = this.audio = pod(document.createElement('audio'));
  audio.src = 'blank.mp3';
  audio.volume = 1;
  audio.play();
  return audio;
}

function later(fn, time) {
  setTimeout(function() {
    fn();
  }, time || 100);
}

function on(obj, event, fn) {
  obj.addEventListener(event, fn);
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

module('pod');

test('return same element', 1, function() {
  var audio = document.createElement('audio');
  strictEqual(audio, pod(audio));
});


module('stop', {setup: createAudio});

test('trigger `stop` event', 2, function() {
  var audio = this.audio;
  later(function() {
    audio.stop();
  });
  on(audio, 'stop', function() {
    equal(audio.currentTime, 0);
    ok(audio.paused);
    start();
  });
}, true);

test('do not change src after new src set and play() called', 1, function() {
  this.audio.stop();
  this.audio.src = 'blank2.mp3';
  this.audio.play();
  ok(this.audio.src.indexOf('blank2.mp3') > 0);
});


module('mute', {setup: createAudio});

test('set volume async to zero when playing', 2, function() {
  var ts = new Date();
  this.audio.mute(function() {
    ok((new Date() - ts) > 500);
    equal(this.volume, 0);
    start();
  });
}, true);

test('set volume sync to zero when paused', 1, function() {
  var audio = this.audio;
  later(function() {
    equal(audio.volume, 0);
    start();
  });
  audio.pause();
  audio.mute();
}, true);

test('trigger `mute` event', 1, function() {
  var audio = this.audio;
  on(audio, 'mute', function() {
    equal(audio.volume, 0);
    start();
  });
  audio.mute();
}, true);


module('unmute', {setup: createAudio});

test('set volume async to 1 when muted', 2, function() {
  var ts = new Date();
  this.audio.volume = 0;
  this.audio.unmute(function() {
    ok((new Date() - ts) > 500);
    equal(this.volume, 1);
    start();
  });
}, true);

test('do nothing if volume isnt 0', 1, function() {
  var audio = this.audio;
  later(function() {
    equal(audio.volume, 1);
    start();
  });
  audio.unmute();
}, true);

test('trigger `unmute` event', 1, function() {
  var audio = this.audio;
  audio.volume = 0;
  on(audio, 'unmute', function() {
    equal(audio.volume, 1);
    start();
  });
  audio.unmute();
}, true);


module('next', {setup: createAudio});

test('call callback', 1, function() {
  var audio = this.audio;
  audio.next('blank2.mp3', function() {
    ok(audio.src.indexOf('blank2.mp3') > 0);
    start();
  });
}, true);

test('trigger `next` event', 1, function() {
  var audio = this.audio;
  on(audio, 'next', function() {
    ok(audio.src.indexOf('blank2.mp3') > 0);
    start();
  });
  audio.next('blank2.mp3');
}, true);
