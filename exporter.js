// ==UserScript==
// @name       Movescount Batch Exporter
// @namespace  http://alexbr.com
// @version    0.2
// @description  Batch export moves from Movescount. Based on http://userscripts-mirror.org/scripts/show/155662
// @match      http://*.movescount.com/summary
// @include    htt*://*.movescount.com/summary
// @require http://code.jquery.com/jquery-2.1.4.min.js
// @require https://cdn.jsdelivr.net/npm/lodash@4.17.11/lodash.min.js
// ==/UserScript==
(function() {
"use strict";

function exportMoves(format) {
    var moveIds = [];
    var wins = [];
    $('a[data-id^="move-"] i.active').each(function() {
        moveIds.push($(this).parent().attr('data-id').substring(5));
    });

    if (confirm("This will export " + moveIds.length + " in format: " + format + ". Press Ok to export or Cancel to abort.")) {
        _.each(moveIds, function(moveId) {
            var urlstring = 'http://www.movescount.com/move/export?id=' + moveId + '&format=';
            if (format === 'all') {
                _.forOwn(formats, function(f) {
                    if (f !== 'all') {
                        try {
                            wins.push(window.open(urlstring + f));
                        } catch (err) {
                            window.alert("Error: " + err.toString );
                        }
                    }
                });
            } else {
                try {
                    wins.push(window.open(urlstring + format));
                } catch (err) {
                    window.alert("Error: " + err.toString);
                }
            }
        });
    } else {
        window.alert("Cancelled!");
    }
}

var formats = {
    GPX: 'gpx',
    KML: 'kml',
    XLSX: 'xlsx',
    FIT: 'fit',
    TCX: 'tcx',
    'All Formats': 'all',
};

setInterval(function() {
    var toolsItem = $('a[data-action="addPlannedMove"]');
    console.warn(toolsItem);
    var sentinel = toolsItem.closest('div').parent().children('div.batchExporter');
    if (!sentinel || sentinel.length === 0) {
        _.forOwn(formats, function(format, name) {
            var div = $('<div class="text--center batchExporter"></div>');
            var link = $('<a style="text-align: left;">Export selected as ' + name + '.</a>');
            link.click(function() {
                exportMoves(format);
                return false;
            });
            div.append(link);
            toolsItem.closest('div').parent().append(div);
        });
    }
}, 1000);
})();
