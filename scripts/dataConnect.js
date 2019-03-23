define("dataConnect", ["jquery"], function ($) {

    return {
        queryUsers: function (query, cb) {

            console.log(query);

            //TODO: complete integration with back-end, sending the query parameter and receiving filtered users

            var url = "http://senseihackathonapi-env.jmyzau2wff.sa-east-1.elasticbeanstalk.com/api/talent";

            $.ajax({
                    url: url,
                    type: 'get',
                    beforeSend: function (xhr) {}
                })
                .done(function (data) {
                    cb(data);
                })
                .fail(function (jqXHR, textStatus, data) {
                    cb(data);
                });
        }
    }
});