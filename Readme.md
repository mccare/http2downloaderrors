# Repository to reproduce http2 framing errors

## Failure case
* run `yarn fastifyserver`
* run `node performanceTest.js`

Result on my machine (MacOS 11.4 Intel, node 14.7.2) will be curl code 16 errors (intermittent), code 16 being HTTP2 framing errors


## Success case
When running with pure node http2 implementation

* run `yarn nodeserver`
* run `node performanceTest.js`

Result on my machine: no errors.

You can tweak the `PARALLEL_REQUESTS` number in performanceTest.js

