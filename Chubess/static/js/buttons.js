$(document).ready(function () {
    $(".boton").each(function () {
        var $button = $(this);
        if (!$button.find(".botontext").length) {
            $button.wrapInner('<div class="botontext"></div>');
        }
        $button.find(".botontext").clone().appendTo($button);
        $button.append('<span class="twist"></span><span class="twist"></span><span class="twist"></span><span class="twist"></span>');
        $button.find(".twist").css("width", "25%").css("width", "+=3px");
    });

    $("#about-box").hide();

    $("#pause-box").hide();

    $(".boton").click(function () {
        $("#button-container .boton").fadeOut(500);
        $("#button-pause .boton").fadeOut(500);
    });

    $("#about").click(function () {
        setTimeout(function () {
            $("#about-box").fadeIn(500);
        }, 500);
    });

    $("#back").click(function () {
        $("#about-box").fadeOut(500, function () {
            $("#button-container .boton").fadeIn(500);
        });
    });

    $("#quit").click(function () {
        window.location.href = "https://www.google.com";
    });

    $("#pause").click(function () {
        setTimeout(function () {
            $("#pause-box").fadeIn(500);
        }, 500);
    });

    $("#resume").click(function () {
        $("#pause-box").fadeOut(500, function () {
            $("#button-pause .boton").fadeIn(500);
        });
    });

    $("#home").click(function () {
        window.location.href = '/';
    });
});