"use strict"

define("scriptLoader", ["jquery", "dataConnect", "bootstrap", "bootstrap-datepicker"], function ($, dataConnect) {

    var userData = [{
        "id": 1,
        "name": "Cesar",
        "hourlyRate": 45.5,
        "role": "Back-end developer",
        "level": "L2",
        "rating": 4,
        "activeProject": null
    }, {
        "id": 2,
        "name": "Caio",
        "hourlyRate": 50.0,
        "role": "Full-stack developer",
        "level": "L3",
        "rating": 4,
        "activeProject": null
    }];

    var cartData = {
        added: [],
        total: 0.0
    };

    $(document).ready(function () {
        //mount bootstrap components
        $('.datepicker').datepicker({
            format: 'mm/dd/yyyy',
        });

        setCallbacks();
        UpdateList();
        UpdateCart();
        DoQuery();
    });

    function setCallbacks() {
        // add callback
        $(".shopWidget-products-container .card-columns").click((event) => {
            var target = $(event.target);
            if (target.is(".card-add-button")) {
                AddToCardCallback(target);
            }
        });

        // remove callback
        $("#cart-list").click((event) => {
            var target = $(event.target);
            if (target.is("a.dropdown-item")) {
                RemoveFromCartCallback(target);
            }
        });

        //filters callback
        $("#shopWidget-filterForm input").click(DoQuery);

        //cart go-back
        $(".cart-go-button").click(CartGoCallback);
    }

    function CartGoCallback() {

        var cartDataToCheckout = [];

        for (var i = 0; i < cartData.added.length; i++) {
            for (var j = 0; j < userData.length; j++) {
                if (userData[j].id === cartData.added[i]) {
                    cartDataToCheckout.push(userData[j]);
                }
            }
        }

        localStorage.setItem('cart', JSON.stringify(cartDataToCheckout));

        window.location.href = "cart.html";
    }

    function RemoveFromCartCallback(target) {
        var user = target.data("userid");

        var filtered = cartData.added.filter(function (value, index, arr) {
            return value !== user;
        });

        cartData.added = filtered;
        UpdateCart();
    }

    function AddToCardCallback(target) {
        var user = target.data("userid");
        var addToCart = true;

        for (var i = 0; i < cartData.added.length; i++) {
            if (cartData.added[i] == user) {
                addToCart = false;
                break;
            }
        }

        if (addToCart) {
            cartData.added.push(user);
        } else {
            alert("Already in cart.");
        }

        UpdateCart();
    }

    function UpdateList() {
        var listHtml = "";
        var modalHtml = "";

        $.each(userData, (i, val) => {
            listHtml += BuildCardComponment(val);
            modalHtml += BuildModalComponent(val);
        });

        $(".shopWidget-products-container .card-columns").html(listHtml);
        $(".shopWidget-products-modals").html(modalHtml);
    }

    function UpdateCart() {
        var cartHtml = "";
        cartData.total = 0.0;

        $.each(cartData.added, (i, val) => {
            var name = val;

            for (var i = 0; i < userData.length; i++) {
                if (userData[i].id == val) {
                    name = userData[i].name;
                    cartData.total += userData[i].hourlyRate;
                    break;
                }
            }

            cartHtml += `<a class="dropdown-item" data-userid=${val}>${name}</a>`;
        });


        $("#cart-list").html(cartHtml);

        $("#cart-total").html(`<p id="card-total" class="card-total-divider dropdown-item">$${cartData.total}/hour</p>`);

        $("#cart-button").html(`Cart (${cartData.added.length})`);
    }

    function BuildCardComponment(user) {

        var cardHtml = `<div id="card-${user.id}" class='card'>
        <img class='card-img-top' src='img/personLogo.png' alt='Card image cap'>
            <div class='card-body'>
                <h5 class='card-title'>${user.name}</h5>
                <p class='card-text'>${user.role}</p>
                <p class='card-text'><small class='text-muted'>$${user.hourlyRate}/hour</small></p>
                <button data-userId ='${user.id}' class='btn btn-primary card-add-button'>Add to list</button>
                <button data-userId ='${user.id}' class='btn btn-secondary' data-toggle="modal" data-target="#modal-${user.id}">More</abutton>
            </div>
        </div>`;

        return cardHtml;
    }

    function BuildModalComponent(user) {

        var modalHtml =
            `<div id=modal-${user.id} class='modal' tabindex='-1' role='dialog'>
        <div class='modal-dialog' role='document'>
            <div class='modal-content'>
            <div class='modal-header'>
                <h5 class='modal-title'>${user.name}</h5>
                <button type='button' class='close' data-dismiss='modal' aria-label='Close'>
                <span aria-hidden='true'>&times;</span>
                </button>
            </div>
            <div class='modal-body'>
                <h3>Role:</h3>
                <p>${user.role}</p>
                <h3>Level:</h3>
                <p>${user.level}</p>
                <h3>Rating:</h3>
                <p>${user.rating} stars</p>
                <h3>Hourly rate:</h3>
                <p>$${user.hourlyRate}/hour</p>
                <div></div>
            </div>
            <div class='modal-footer'>
                <button type='button' class='btn btn-secondary' data-dismiss='modal'>Close</button>
            </div>
            </div>
        </div>
    </div>`;

        return modalHtml;
    }

    function BuildQuery() {
        var request = {};

        $("#shopWidget-filterForm input[type='checkbox']:checked").each(function (index) {

            var filter = $(this).attr("name");
            var value = $(this).val();

            if (request.hasOwnProperty(filter)) {
                request[filter] = request[filter] + "&" + value;

            } else {
                request[filter] = value;
            }

        });

        return request;
    }

    function DoQuery() {
        var queryParameters = BuildQuery();

        $("#loading-spinner-mask").show();

        dataConnect.queryUsers(queryParameters, (data) => {

            console.log(data);

            //userData = JSON.parse(data);

            setTimeout(function () {
                $("#loading-spinner-mask").hide();
            }, 500);
        });
    }

});


(function ($) {
    require(['scriptLoader'], function () {});
})(jQuery);