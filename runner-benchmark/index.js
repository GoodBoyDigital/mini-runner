var Benchmark = require('benchmark');
var Runner = require('../mini-runner');
var Signal = require('signals');
var MiniSignal = require('mini-signals');
var EventEmitter = require('EventEmitter3');

var updateRunner = new Runner('update');
var updateSignal = new Signal();
var updateMiniSignal = new MiniSignal();
var updateEvent = new EventEmitter();

var Listener = function(){

	this.updates = 0;
}

Listener.prototype.update = function()
{
	this.updates++;
}

var listeners = [];

for (var i = 0; i < 10000; i++) {

	var listener = new Listener;

	updateRunner.add(listener);
	updateSignal.add(listener.update, listener);
	updateMiniSignal.add(listener.update, listener);
	updateEvent.on('update', listener.update, listener);

	listeners.push(listener);
}


var start
var time
var cycles = 2000

var signalTime;
var miniSignalTime;
var eventTime;
var runnerTime;

/////// SIGNALS ///////

console.log('\nbenchmarking signals...');
console.time('signals time');
start = performance.now();
for (var i = 0; i < cycles; i++) {
	updateSignal.dispatch();
}
time = performance.now() - start;
console.timeEnd('signals time');

signalTime = time / 1000;

console.log('signals performance time:', signalTime);
console.log('listener updates:', listener.updates);

/////// MINI-SIGNALS ///////

console.log('\nbenchmarking mini-signals...');
console.time('mini-signals time');
start = performance.now();
for (var i = 0; i < cycles; i++) {
	updateMiniSignal.dispatch();
}
time = performance.now() - start;
console.timeEnd('mini-signals time');

miniSignalTime = time / 1000;

console.log('mini-signals performance time:', miniSignalTime);
console.log('listener updates:', listener.updates);

/////// EVENTS ///////

console.log('\nbenchmarking events...');
console.time('events time');
start = performance.now();
for (var i = 0; i < cycles; i++) {
	updateEvent.emit('update');
}
time = performance.now() - start;
console.timeEnd('events time');

eventTime = time / 1000;

console.log('events performance time:', time);
console.log('listener updates:', listener.updates);

//////// RUNNER ///////

console.log('\nbenchmarking runner...');
console.time('runner time');
start = performance.now();
for (var i = 0; i < cycles; i++) {
	updateRunner.emit();
}
time = performance.now() - start;
console.timeEnd('runner time');

runnerTime = time / 1000;

console.log('runner performance time:', runnerTime);
console.log('listener updates:', listener.updates);

/////// END ///////

console.log('\nrunner is ' + (signalTime/runnerTime) + 'x faster than signals' );
console.log('runner is ' + (miniSignalTime/runnerTime) + 'x faster than mini-signals' );
console.log('runner is ' + (eventTime/runnerTime) + 'x faster than events' );
