var layoutMouseUpHandler = function(e) {
    console.log('window.mouseup');
};

Template.layout.onCreated(function() {
    $(window).on('scroll', layoutMouseUpHandler);
});

Template.layout.onDestroyed(function() {
    $(window).off('scroll', layoutMouseUpHandler);
});