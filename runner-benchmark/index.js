var Benchmark = require('benchmark');
var Runner = require('../runner');
var Signal = require('signals');
var MiniSignal = require('mini-signals');
var EventEmitter = require('EventEmitter3');

var updateRunner = new Runner('update');
var updateSignal = new Signal();
var updateMiniSignal = new MiniSignal();
var updateEvent = new EventEmitter();

var Listener = function(){

	this.time = 0;
}

Listener.prototype.update = function()
{
	this.time++;
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

start = performance.now();

console.log('\nbenchmarking signals...');
for (var i = 0; i < cycles; i++) {
	updateSignal.dispatch();
}

time = performance.now() - start;
time /= 1000;
signalTime = time;

console.log('signals ' + signalTime);

/////// MINI-SIGNALS ///////

start = performance.now();

console.log('\nbenchmarking mini-signals...');
for (var i = 0; i < cycles; i++) {
	updateMiniSignal.dispatch();
}

time = performance.now() - start;
time /= 1000;
miniSignalTime = time;

console.log('mini-signals ' + miniSignalTime);

/////// EVENTS ///////

start = performance.now();

console.log('\nbenchmarking events...');
for (var i = 0; i < cycles; i++) {
	updateEvent.emit('update');
}

time = performance.now() - start;
time /= 1000;
eventTime = time;

console.log('events ' + time);

//////// RUNNER ///////

console.log('\nbenchmarking runner...');
start = performance.now();

for (var i = 0; i < cycles; i++) {
	updateRunner.emit();
}

time = performance.now() - start;
time /= 1000;
runnerTime = time;

console.log('runner ' + runnerTime);

console.log('\nrunner is ' + (signalTime/runnerTime) + 'x faster than signals' );
console.log('runner is ' + (miniSignalTime/runnerTime) + 'x faster than mini-signals' );
console.log('runner is ' + (eventTime/runnerTime) + 'x faster than events' );