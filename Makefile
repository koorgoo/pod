JSHINT=node_modules/jshint/bin/jshint
BROWSER=open -a "/Applications/Google Chrome.app"

test t:
	$(BROWSER) test/index.html

lint l:
	$(JSHINT) lib/pod.js test/test-pod.js

.PHONY: test lint
