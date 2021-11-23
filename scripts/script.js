let previousFruit = "";
let currentFruit = "";
let previousReveal = -1;
let cards = [];
let stopReveal = false;
let endGame = false;
let ci;
let s;
let s2;

$(document).ready(function () {
    startGame();

    $('.mem-card').on('click', function (e) {
        if (!endGame) {
            //on demarre le chrono
            if ($('#mem-counter-click .mem-counter-number').html() === '0') {
                startCounter();
                changeProgress(0, 0, 0);
            }
            if (!stopReveal) {
                if (previousReveal !== $('.mem-card').index(this) && !$(this).hasClass('card-found')) {
                    //on compte les clicks
                    $('#mem-counter-click .mem-counter-number').html(parseInt($('#mem-counter-click .mem-counter-number').html()) + 1);
                    //on affecte les variables servant pour les tests de coherence du jeu
                    previousReveal = $('.mem-card').index(this);
                    currentFruit = cards[$('.mem-card').index(this)];
                    revealFruit($('.mem-card').index(this), currentFruit);
                    //si on est sur la premiere carte revelee, on affecte seulement une variable de coherence
                    if (previousFruit === '') {
                        previousFruit = cards[$('.mem-card').index(this)];
                    } else {
                        //si on est a la deuxieme carte revelee, on verifie si c'est une paire
                        //si oui
                        if (cards[$('.mem-card').index(this)] === previousFruit) {
                            //on indique la paire revelee
                            $('.mem-card.reveal-tmp').removeClass('reveal-tmp').addClass('card-found');
                            previousFruit = "";
                            previousReveal = "";
                            //si toutes les cartes sont revelees, c'est la fin du game en mode win
                            if ($('.mem-card.reveal').length === 28) {
                                finishGame(true);
                                clearInterval(ci);
                            }
                        } else {
                            //si ce n'est pas une paire, on bloque le jeu,
                            //le temps de laisser la paire affichée pour contempler l'echec de la personne
                            stopReveal = true;
                            s2 = setTimeout(() => {
                                //on cache la non-paire revelee et on remet les variables de coherence par defaut
                                hideFruit();
                                stopReveal = false;
                                previousFruit = "";
                                previousReveal = "";
                                clearTimeout(s2);
                            }, 1000);
                        }
                    }
                }
            }
        }
    });

    //une nouvelle partie
    $('#mem-message-end-restart').on('click', function (e) {
        startGame();
    });

});

function revealFruit(i, fruit) {
    //Revelation du fruit clique
    $($('.mem-card')[i]).find('.mem-card-front').addClass(fruit);
    $($('.mem-card')[i]).addClass('reveal').addClass('reveal-tmp');
}

function hideFruit() {
    //Cache des fruits qui ne sont pas en paire
    $('.mem-card.reveal-tmp').addClass('hide-card');
    //le timeout permet de garder l'effet de transition css
    s = setTimeout(() => {
        $('.mem-card.hide-card .mem-card-front').removeClass().addClass('mem-card-front');
        $('.mem-card.hide-card').removeClass('hide-card').removeClass('reveal').removeClass('reveal-tmp');
        $('.mem-card.card-found:not(.reveal)').removeClass('card-found');
        clearTimeout(s);
    }, 500);
}
function startCounter() {
    //demarrage du chrono avec un interval a une seconde
    ci = setInterval(() => {
        if (changeTime($('#mem-counter-second'), parseInt($('#mem-counter-second').html()) + 1) === 0) {
            if (changeTime($('#mem-counter-minute'), parseInt($('#mem-counter-minute').html()) + 1) === 0) {
                changeTime($('#mem-counter-hour'), parseInt($('#mem-counter-hour').html()) + 1);
            }
        }
        changeProgress(parseInt($('#mem-counter-hour').html()), parseInt($('#mem-counter-minute').html()), parseInt($('#mem-counter-second').html()));
    }, 1000);
}

function changeTime(element, n) {
    if (n === 60) {
        n = 0;
    }
    $(element).html((n < 10 ? '0' : '') + n);
    return n;
}

function changeProgress(hour, minute, second) {
    //max time defini ici a 2 minutes
    const maxTime = 0 * 3600 + 2 * 60 + 0;
    const percentTime = parseFloat((hour * 3600 + minute * 60 + second) * 100 / maxTime).toFixed(5);
    //progression de la barre recalculee a chaque seconde
    //si le temps est ecoule, fin du game en mode perdu
    if (hour * 3600 + minute * 60 + second > maxTime) {
        $("#mem-progress").css({ 'width': '100%' });
        clearInterval(ci);
        finishGame(false);
    } else {
        $("#mem-progress").css({ 'width': percentTime + '%' });
    }
}

function finishGame(win) {
    clearTimeout(s);
    clearTimeout(s2);
    endGame = true;
    if (win) {
        $('#mem-message-end-title').html("Tu déchires !");
        $('#mem-message-end-text').html("En vrai, on pourrait croire qu'on exagère mais trop pas !<br/>Tu veux retenter le doss' ?");
        $.ajax({
            type: "GET",
            url: '/api/routes.php',
            data: { "method": 'save', "seconds": parseInt($('#mem-counter-hour').html()) * 3600 + parseInt($('#mem-counter-minute').html()) * 60 + parseInt($('#mem-counter-second').html()), "click": parseInt($('#mem-counter-click .mem-counter-number').html()) },
            success: function (data) {

            },
            error: function () {
                console('Save game error');
            }
        });
    } else {
        $('#mem-message-end-title').html("Pas fou...");
        $('#mem-message-end-text').html("Le talent est quelque chose qu'on a ou qu'on n'a pas.<br/>Visiblement, toi, tu ne l'as pas...");
    }
    $('#mem-message-background').show();
    $('#mem-message-end').show();
}

function startGame() {
    //reinitialisation de toutes les variables utilisees a chaque partie
    endGame = false;
    previousFruit = "";
    currentFruit = "";
    previousReveal = -1;
    stopReveal = false;

    //tableau de fruits
    let fruits = ['fruit-1', 'fruit-2',
        'fruit-4', 'fruit-3',
        'fruit-5', 'fruit-6',
        'fruit-8', 'fruit-7',
        'fruit-9', 'fruit-10',
        'fruit-11', 'fruit-12',
        'fruit-13', 'fruit-14',
        'fruit-1', 'fruit-2',
        'fruit-4', 'fruit-3',
        'fruit-5', 'fruit-6',
        'fruit-8', 'fruit-7',
        'fruit-9', 'fruit-10',
        'fruit-11', 'fruit-12',
        'fruit-13', 'fruit-14'
    ];

    //tirage aleatoire des cartes de fruits
    cards = [];
    while (fruits.length > 0) {
        const i = Math.floor(Math.random() * fruits.length);
        cards.push(fruits[i]);
        fruits.splice(i, 1);
    }

    //remise a 0 des counters
    $("#mem-progress").css({ 'width': '0%' });
    $('#mem-counter-click .mem-counter-number').html('0');
    $('#mem-counter-second').html('00');
    $('#mem-counter-minute').html('00');
    $('#mem-counter-hour').html('00');

    //nettoyage du plateau de cartes
    $(".mem-card").removeClass('hide-card').removeClass('reveal').removeClass('reveal-tmp').removeClass('card-found');
    $(".mem-card-front").removeClass().addClass("mem-card-front");

    //pop up de fin de jeu cache
    $('#mem-message-background').hide();
    $('#mem-message-end').hide();

    //recuperation du record en temps du jeu
    $.ajax({
        type: "GET",
        url: '/api/routes.php',
        data: { "method": 'record' },
        success: function (data) {
            data = JSON.parse(data);
            if (data.record !== '00:00:00') {
                $('#mem-counter-record .mem-counter-number').html(data.record);
            } else {
                $('#mem-counter-record .mem-counter-number').html('Aucun record établi');
            }

        },
        error: function () {
            console('Get record game error');
        }
    });
}