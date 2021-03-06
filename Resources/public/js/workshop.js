/* jshint jquery:true */
/* exported RestAdmin */
/* globals CAPI, HttpBasicAuthAgent */
var RestAdmin = (function ($) {
    var api, restRoot = '/',
        $list = $('.list ul'),
        $content = $('.main-content'),
        _renderRoot, _renderList, _renderElement, _initEvent,
        _showDetails, _remove, _browse,
        init, render;

    _showDetails = function (contentId) {
        $content.html('');
        $content.append('<p>FIX ME show details of ' + contentId + '</p>');
        $content.append('<p>For instance, the section name and the name of the owner</p>');
    };

    _remove = function (contentId) {
        alert('FIX ME removal of ' + contentId);
    };

    _browse = function (childrenId) {
        alert('FIX ME browse to ' + childrenId);
    };

    _renderElement = function (Location, ContentInfo) {
        var $li = $('<li/>'),
            $a = $('<a class="browse"/>');

        $li.attr('data-content-id', ContentInfo.Content._href);
        $li.attr('data-location-id', Location.Location._href);
        $li.append('<button class="pure-button pure-button-primary details">Details</button>');
        $li.append('<button class="pure-button pure-button-primary remove">Remove</button>');
        $a.html(ContentInfo.Content.Name);
        $a.attr('href', Location.Location.Children._href);
        $li.append($a);
        $list.append($li);
    };

    _initEvent = function () {
        $list.on('click', '.details', function (e) {
            var $button = $(e.currentTarget);
            _showDetails($button.parent().attr('data-content-id'));
            e.preventDefault();
        });
        $list.on('click', '.remove', function (e) {
            var $button = $(e.currentTarget);
            _remove($button.parent().attr('data-content-id'));
            e.preventDefault();
        });
        $list.on('click', '.browse', function (e) {
            _browse($(e.currentTarget).attr('href'));
            e.preventDefault();
        });
    };

    _renderRoot = function () {
        var contentService = api.getContentService(),
            struct;

        contentService.loadRoot(restRoot, function (err, response) {
            if ( !err ) {
                struct = JSON.parse(response.body);
                _renderList(struct.Root.rootLocation._href);
            }
        });
    };

    _renderList = function (children) {
        var contentService = api.getContentService();

        contentService.loadLocationChildren(
            children,
            0, -1,
            function (err, response) {
                var struct;

                if ( err ) {
                    return;
                }
                struct = JSON.parse(response.body);
                struct.LocationList.Location.forEach(function (loc) {
                    contentService.loadLocation(
                        loc._href,
                        function (err, response) {
                            var Location;

                            if ( err ) {
                                return;
                            }
                            Location = JSON.parse(response.body);
                            contentService.loadContentInfo(
                                Location.Location.Content._href,
                                function (err, response) {
                                    var ContentInfo;

                                    if ( err ) {
                                        return;
                                    }
                                    ContentInfo = JSON.parse(response.body);
                                    _renderElement(Location, ContentInfo);
                                }
                            );
                        }
                    );
                });
            }
        );
    };

    init = function (siteUri, root, login, password) {
        restRoot = root;
        api = new CAPI(
            siteUri,
            new HttpBasicAuthAgent({
                login: login,
                password: password
            })
        );
    };

    render = function () {
        _initEvent();
        _renderRoot();
    };

    return {
        init: init,
        render: render
    };
})(jQuery);
