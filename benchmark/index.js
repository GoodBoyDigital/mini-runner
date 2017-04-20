var Benchmark = require('benchmark');
var Runner = require('../mini-runner');
var Signal = require('signals');
var MiniSignal = require('mini-signals');
var EventEmitter = require('EventEmitter3');

var updateRunner = new Runner('update');
var updateRunnerAdhoc = new Runner('update');
var updateSignal = new Signal();
var updateMiniSignal = new MiniSignal();
var updateEvent = new EventEmitter();

var numListeners = 10;
var numCycles = 2000;
var numRuns = 100;
var timings = {};

var Listener = function ()
{
    this.time = 0;
};

Listener.prototype.update = function ()
{
    this.time++;
};

for (var i = 0; i < numListeners; i++) {

    var listener = new Listener();

    updateRunner.add(listener);
    updateRunnerAdhoc.add({ time: 0, update: Listener.prototype.update });
    updateSignal.add(listener.update, listener);
    updateMiniSignal.add(listener.update, listener);
    updateEvent.on('update', listener.update, listener);
}

// bench helper
function doBench(name, fn) {
    timings[name] = {
        runs: [],
        total: 0,
        avg: 0,
    };

    console.log('\nbenchmarking ' + name + '...');

    for (var r = 0; r < numRuns; ++r) {
        var start = performance.now();

        for (var i = 0; i < numCycles; i++) {
            fn();
        }

        time = performance.now() - start;
        time /= 1000;
        timings[name].runs.push(time);
        timings[name].total += time;
    }

    timings[name].avg = timings[name].total / numRuns;

    console.log(name + ': ' + timings[name].avg);
}

log('Number of listeners: ' + numListeners);
log('Number of runs each: ' + numRuns);
log('Number of cycles per run: ' + numCycles);

/////// SIGNALS ///////
doBench('signals', function () {
    updateSignal.dispatch();
});

/////// MINI-SIGNALS ///////
doBench('miniSignals', function () {
    updateMiniSignal.dispatch();
});

/////// EVENTS ///////
doBench('events', function () {
    updateEvent.emit('update');
});

//////// RUNNER ///////
doBench('runner', function () {
    updateRunner.emit();
});

//////// RUNNER ADHOC ///////
doBench('runnerAdHoc', function () {
    updateRunnerAdhoc.emit();
});

//////// RESULTS ///////
console.log('\n');
function log(msg) {
    console.log(msg);
    /* jshint ignore:start */
    document.write('<pre>' + msg + '</pre>');
    /* jshint ignore:end */
}

log('mini-runner is ' + (timings.signals.avg/timings.runner.avg) + 'x faster than signals');
log('mini-runner is ' + (timings.miniSignals.avg/timings.runner.avg) + 'x faster than mini-signals');
log('mini-runner is ' + (timings.events.avg/timings.runner.avg) + 'x faster than events');
log('\n');
log('mini-runner (adhoc) is ' + (timings.signals.avg/timings.runnerAdHoc.avg) + 'x faster than signals');
log('mini-runner (adhoc) is ' + (timings.miniSignals.avg/timings.runnerAdHoc.avg) + 'x faster than mini-signals');
log('mini-runner (adhoc) is ' + (timings.events.avg/timings.runnerAdHoc.avg) + 'x faster than events');