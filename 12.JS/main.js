
$(document).ready(function(){

    $("button").click(function(){
        var el = $(".mydiv");
        if(el.hasClass("cm-hide")) {
            el.removeClass("cm-hide");
        } else {
            el.addClass("cm-hide");
        }
    });

    $(".mydiv").focusout(function() {
        var el = $(".mydiv");
        el.addClass("cm-hide");
    });
});
