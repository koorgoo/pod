(function() {
  'use strict';

  window.pod = pod;

  function pod(audio) {
    audio.stop = stop;
    audio.next = next;
    audio.mute = mute;
    audio.unmute = unmute;

    return audio;
  }

  function stop() {
    if (!this.paused) this.pause();
    this._src = this.src;
    this.src = '';
    this._url = this.src;  // Auto set page url

    this.play = function() {
      if (this._url == this.src) this.src = this._src;
      Object.getPrototypeOf(this).play.call(this);
    };

    _trigger.call(this, 'stop');
  }

  function next(source, callback) {
    this.mute(function() {
      this.pause();
      this.src = source;
      this.oncanplay = _once(function() {
        this.play();
        _trigger.call(this, 'next');
        this.unmute(callback);
      }.bind(this));
    });
  }

  function mute(callback) {
    this._premute = this.volume;

    var onMute = function() {
      _trigger.call(this, 'mute');
      if (_isFunc(callback)) callback.call(this);
    }.bind(this);

    if (this.paused) {
      this.volume = 0;
      onMute();
    } else {
      _volume.call(this, 0, onMute);
    }
  }

  function unmute(callback) {
    if (this.volume > 0) return;

    var onUnmute = function() {
      _trigger.call(this, 'unmute');
      if (_isFunc(callback)) callback.call(this);
    }.bind(this);

    _volume.call(this, this._premute || 1, onUnmute);
    this._premute = null;
  }

  var TIME_STEP = 10;
  var VOLUME_STEP = 0.02;

  function _volume(value, callback) {
    var volume = this.volume;

    if (volume <= value) {
      volume += VOLUME_STEP;
      this.volume = volume <= value ? volume : value;
    } else {
      volume -= VOLUME_STEP;
      this.volume = volume <= value ? value : volume;
    }

    if (this.volume === value) {
      callback.bind(this)();
    } else {
      var fn = _volume.bind(this);
      setTimeout(function() { fn(value, callback); }, TIME_STEP);
    }
  }

  function _once(fn) {
    var called = false;
    return function() {
      if (called) return;
      called = true;
      fn();
    };
  }

  function _isFunc(fn) {
    return typeof fn === 'function';
  }

  function _trigger(name) {
    this.dispatchEvent(new Event(name));
  }

})();
