var countriesMenu = document.querySelector("#modalLanguage");
var countriesTriggers = document.querySelectorAll("#isOpenModalLanguage");

countriesTriggers.forEach(function(trigger) {
    trigger.addEventListener('click', function() {
        toggleCountriesMenu();
    });
});

window.addEventListener('click', function(e) {
    var $isOuter = true;

    countriesTriggers.forEach(function(trigger) {
        if (trigger.contains(e.target)) {
            $isOuter = false;
        }
    });

    if (countriesMenu && countriesMenu.contains(e.target)) {
        $isOuter = false;
    }

    if ($isOuter) {
        hideCountriesMenu();
    }
});

var toggleCountriesMenu = function() {
    countriesMenu.classList.toggle('is-active');
};

var hideCountriesMenu = function() {
    countriesMenu.classList.remove('is-active');
};
