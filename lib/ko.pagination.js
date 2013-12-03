

ko.pagination = (function(){
    var defaults= {
        resultProperty: 'Result', // The name of the property in the AJAX response that contains your collection
        totalPagesProperty: 'TotalPages', // The name of the property in the AJAX response the
        totalProperty: 'Total' // The name of the property in the AJAX response the
    };

  
    var pagingMixin = function (dataUrl, dataSetter, parameters, mappings) {
        var _dataUrl = dataUrl;
        var _observable = dataSetter;
        var _self = this;
        var _parameters = parameters || {};
        var _mappings = mappings || {};


        this.currentPage = ko.observable(1);

        this.TotalPages = ko.observable(0);

        this.firstPage = function () {
            _self.changePage(1);
        };

        this.lastPage = function () {
            _self.changePage(_self.TotalPages());
        };

        this.hasMorePages = ko.computed(function () {
            if (_self.TotalPages() !== 0) {
                return _self.currentPage() !== _self.TotalPages();
            }
            return false;
        });

        this.hasLessPages = ko.computed(function () {
            return _self.currentPage() !== 1;
        });

        this.nextPage = function () {
            if (_self.hasMorePages()) {
                _self.changePage(_self.currentPage() + 1);
            }

        };

        this.prevPage = function () {
            if (_self.hasLessPages()) {
                _self.changePage(_self.currentPage() - 1);
            }

        };

        this.changePage = function (page) {
            var p = null;
            if (jQuery.isFunction(_parameters))
            {
                p = _parameters();
            }
            else {
                p = _parameters;
            }
            p['page'] = page;

            jQuery.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                url: _dataUrl,
                data: JSON.stringify(p),
                success: function (data) {
                    if (data.TotalPages) {
                        _self.TotalPages(data.TotalPages);

                    }


                    if (mappings == null) {

                        _observable(ko.mapping.fromJS(data)[defaults.resultProperty]());
                        // ko.mapping.fromJS(data.Result, _observable);
                    } else {
                        _observable(ko.mapping.fromJS(data, _mappings)[defaults.resultProperty]());
                    }
                    _self.currentPage(page);
                }
            });
        };
        this.Pages = function () {
            var from = 0, to = 0, pagesToShow = 2;
            from = _self.currentPage() - pagesToShow;
            if (from < 1) {
                to += Math.abs(from);
                from = 1;
            }

            to = _self.currentPage() + 2 + to;
            if (to > _self.TotalPages()){
                to = _self.TotalPages();
            }

            return ko.utils.range(from, to);
        };

    };

    /**
    * Initializes the pagination on the view model and loads the first page of data.
    @param {object} viewModel - The view model to paginate
    @param {string} options.dataUrl - The url that will be used to get new pages. This URL will be called whenever the page changes to get the data.
    @param {ko.observableArray} options.dataSetter - A ko.observableArray that stores the collection that will be paginated.
    @param {object,function} options.parameters - Additional parameters that need to be sent when executing the AJAX request to get a new page. This will be sent as the 'data' option in a $.ajax call.
    @param {object} options.mappings - Custom knockout mappings to be used for the result of the AJAX request
    */
    return {
        defaults: defaults,
        initialize: function(viewModel, options) {
            if (arguments.length > 1) {
                pagingMixin.call(viewModel, options.dataUrl, options.dataSetter, options.parameters, options.mappings);  
            }
            
        }
    };
})();


