let gamePaused = false;

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
    $("#settings-box").hide();
    if (!showMoves)
        $(".pause").hide();
    $(".home-content").hide();
    $("#yourTurn").hide();

    $(".boton").click(function () {
        $("#button-container").fadeOut(200);
        $("#button-pause").fadeOut(200);
        $("#settings-box").fadeOut(200);
    });

    $("#about").click(function () {
        setTimeout(function () {
            $("#about-box").fadeIn(200);
        }, 200);
    });

    $("#back").click(function () {
        $("#about-box").fadeOut(200, function () {
            $("#button-container").fadeIn(200);
        });
    });

    $("#quit").click(function () {
        window.location.href = "https://www.google.com";
    });

    $("#pause").click(function () {
        setTimeout(function () {
            $("#pause-box").fadeIn(200);
        }, 200);
        gamePaused = true;
    });

    $("#resume").click(function () {
        $("#pause-box").fadeOut(200, function () {
            $("#button-pause").fadeIn(200);
        });
        gamePaused = false;
    });

    $("#settings").click(function () {
        setTimeout(function () {
            $("#settings-box").fadeIn(200);
            $("#pause-box").fadeOut(200);
        }, 200);
    });

    $("#home").click(function () {
        window.location.href = '/main';
    });

    $("#ok").click(function () {
        setTimeout(function () {
            $("#pause-box").fadeIn(200);
        }, 200);
    });
});