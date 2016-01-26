var isMac = require('os').type() == 'Darwin' || require('os').type().indexOf('Windows') > -1;
var spawn = require('child_process').spawn
var PassThrough = require('stream').PassThrough;

var ps = null;
var audioStream = new PassThrough;
var infoStream = new PassThrough;

var start = function(options) {
    options = options || {};
    var endian = options.endian || 'little';
    var bitwidth = options.bitwidth || '16';
    var encoding = options.encoding || 'signed-integer';
    var format = options.format || 'S16_LE';
    var rate = options.rate || '16000';
    var channels = options.channels || '1';
    var device = options.device || 'plughw:1,0';
    isMac = true;
    if(ps == null) {
        ps = isMac
            ? spawn('rec', ['-b', 16, '--endian', 'little', '-c', channels, '-r', rate, '-e', 'signed-integer', '-t', 'raw', '-'])
	    : spawn('arecord', ['-c', channels, '-r', rate, '-f', format, '-D', device]);
        ps.stdout.pipe(audioStream);
        ps.stderr.pipe(infoStream);
    }
};

var stop = function() {
    if(ps) {
        ps.kill();
        ps = null;
    }
};

exports.audioStream = audioStream;
exports.infoStream = infoStream;
exports.startCapture = start;
exports.stopCapture = stop;