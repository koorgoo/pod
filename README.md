pod
===

HTML5 audio element small extension


### Install

```shell
bower install koorgoo/pod
```


### API

```js
var audio = pod(document.getElementsByTagName('audio')[0]);

audio.stop()  // stop stream buffering
audio.mute([callback])
audio.unmute([callback])
audio.next(source, [callback])
```

After each method call an event with the same name is triggered.
