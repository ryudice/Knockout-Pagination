## Knockout Pagination
A Knockout JS plugin for View Model Pagination.

Knockout Pagination aims to make viewmodel pagination easier.

## Usage
Ko.Pagination works by adding new observables into your view model. These observables are used to handle pagination. Some of the observables added are TotalPages() and currentPage().

To enable pagination on a view model you have to call ko.pagination.initialize(yourViewModelInstance, options), and pass your view model instance in the first parameter, the second parameter are the configuration options.

IMPORTANT the ko.pagination.initialize method has to be called before you applybindings, otherwise the pagination template will fail because it wont find the observables that are added by the initilization call.

###JSFiddle
You may find the JSFiddle useful, please be aware that the library's code has been modified to use JSFiddle JSON echo.

[http://jsfiddle.net/ryudice/62B4W/8/](http://jsfiddle.net/ryudice/62B4W/8/)


###Example
    var ViewModel = function () {
    
    this.collection = ko.observableArray([]); //The collection to paginate
    
    }
    var vm = new ViewModel();
    
	$(function() {
    	ko.pagination.initialize(vm, { dataUrl:'/echo/json/', dataSetter: vm.collection});
    	vm.changePage(1);
    	ko.applyBindings(vm);
    
    });

####Template
This is the sample pagination template to generate the page numbers, you can find the same template in the fiddle.
`

	<div class="ko-pager"  >
    <ul class="pagination">
    <li>
    	<a href="#"  data-bind="click: firstPage, visible: hasLessPages">First</a>
    </li>
    <li>
    	<a href="#"  data-bind="click: prevPage, visible: hasLessPages">Prev</a>
    </li>
    	<!-- ko foreach: Pages() -->
    <li>
    	<a href="#" data-bind="text: $data, click: $root.changePage, visible: $root.currentPage() !== $data"></a>
    	<span data-bind="visible: $root.currentPage() === $data, text: $data "></span>
    </li>
    	<!-- /ko -->
    <li> <a href="#" data-bind="click: nextPage, visible: hasMorePages">Next</a></li>
    <li><a href="#"  data-bind="click: lastPage, visible: hasMorePages">Last</a></li>
    </ul>
    </div>
`
	