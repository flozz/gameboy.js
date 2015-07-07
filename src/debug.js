var GameboyJS;
(function (GameboyJS) {
"use strict";

var Debug = {};
// Output a range of 16 memory addresses
Debug.view_memory = function(addr, memory) {
    addr = addr & 0xFFF0;
    var pad = '00';
    var str = addr.toString(16) + ':';
    for (var i = addr; i < addr + 0x10; i++) {
        if ((i & 0x1) == 0) {
            str += ' ';
        }
        var val = memory[i] || 0;

        val = val.toString(16);
        str += pad.substring(val.length) + val;
    }

    return str;
};

Debug.view_tile = function(screen, index, dataStart) {
    dataStart = dataStart || 0x8800;
    var tileData = screen.readTileData(index, dataStart);

    var pixelData = new Array(8 * 8)
    for (var line = 0; line < 8; line++) {
        var b1 = tileData.shift();
        var b2 = tileData.shift();

        for (var pixel = 0; pixel < 8; pixel++) {
            var mask = (1 << (7-pixel));
            var colorValue = ((b1 & mask) >> (7-pixel)) + ((b2 & mask) >> (7-pixel))*2;
            pixelData[line * 8 + pixel] = colorValue;
        }
    }

    var i = 0;
    while (pixelData.length) {
        console.log(i++ + ' ' + pixelData.splice(0, 8).join(''));
    }
};

Debug.list_visible_sprites = function(memory) {
    var indexes = new Array();
    for (var i = 0xFE00; i < 0xFE9F; i += 4) {
        var x = memory.oamram(i + 1);
        var tileIndex = memory.oamram(i + 2);
        if (x == 0 || x >= 168) {
            continue;
        }
        indexes.push(tileIndex);
    }

    return indexes;
};
GameboyJS.Debug = Debug;
}(GameboyJS || (GameboyJS = {})));
