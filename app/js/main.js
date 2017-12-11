var App = function () {

    const test = () => {
        console.log(test);
    };

    function init () {
        test();
    }

    return {
        init: init
    }
}();

document.addEventListener('DOMContentLoaded', function() {
    App.init();
});
