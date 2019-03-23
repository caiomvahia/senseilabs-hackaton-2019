"use strict"

define("cartScriptLoader", ["jquery", "bootstrap"], function ($) {

    var userData;

    $(document).ready(function () {
        userData = JSON.parse(localStorage.getItem('cart'));
        console.log(userData);
        addTeamList();
    });

    function addTeamList() {

        var html = "";
        var totalPrice = 0.0;

        for (let index = 0; index < userData.length; index++) {
            html += `<li class="list-group-item"><p>${userData[index].name}</p><p class="text-muted">${userData[index].role}</p></li>`;
            totalPrice += userData[index].hourlyRate;
        }

        $("#teamList").html(html);

        $("#totalPricelabel").html(`$${totalPrice}/hour`);

    }

});


(function ($) {
    require(['cartScriptLoader'], function () {});
})(jQuery);