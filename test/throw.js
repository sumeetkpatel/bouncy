var test = require('tap').test;
var bouncy = require('../');
var http = require('http');
var Stream = require('net').Stream;

test('write() that throws', function (t) {
    var port = Math.floor(Math.random() * (Math.pow(2,16) - 1e4) + 1e4);
    t.plan(4);
    var s = bouncy(function (req, bounce) {
        var stream = new Stream;
        stream.writable = true;
        stream.readable = true;
        
        stream.write = function (buf) {
            throw new Error('!');
        };
        
        stream.end = function () {};
        
        bounce(stream);
        
        stream.emit('data', [
            'HTTP/1.1 200 200 OK',
            'Content-Type: text/plain',
            'Connection: close',
            '',
            'oh hello'
        ].join('\r\n'));
    });
    
    s.listen(port, function () {
        var opts = {
            method : 'POST',
            host : 'localhost',
            port : port,
            path : '/'
        };
        var req = http.request(opts);
        req.write('beep');
        req.end();
    });
});
