var App = function () {

    function test () {

    }

    function init () {
        test();
    }

    return {
        init: init
    }
}();

$(document).ready(function () {
   App.init();
});

$(window).on('load', function () {

});

