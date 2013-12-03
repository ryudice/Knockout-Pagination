describe('Pagination', function () {  
	var TestViewModel = function(){
    	this.dummy = ko.observable(1);
        this.collection = ko.observableArray([]);
        //this.TotalPages = ko.observable(10);
    };
	
    var page1 = [ "Civic", "Accord", "Pilot", "CRV", "S2000"];
    var page2 = ["328i", "550i", "335i", "328xi"];


    var viewModel;

    beforeEach(function(){
		spyOn(jQuery, "ajax").andCallFake(function(params){
			var parameters = JSON.parse(params.data);
			var result;
			if (parameters.page === 1) {
				result = page1;
			}
			else
			{
				result = page2;

			}
			

    		params.success({
    			Result: result,
    			TotalPages: 10
    		});
    	});    	

    	viewModel = new TestViewModel();

    	ko.pagination.initialize(viewModel, {
        	dataUrl: '/dummy',
        	dataSetter: viewModel.collection
        });

        viewModel.changePage(1);
    });

    it('adds observables', function () {  
        expect(viewModel.changePage).toBeDefined();
    });

    it('changes page', function(){
    	viewModel.changePage(2);

    	expect(viewModel.currentPage()).toBe(2);
    });

    it('moves to first page', function(){
    	viewModel.changePage(4);

    	expect(viewModel.currentPage()).toBe(4);

    	viewModel.firstPage();

    	expect(viewModel.currentPage()).toBe(1);
    });

    it('moves to last page', function(){
    	viewModel.lastPage();

    	expect(viewModel.currentPage()).toBe(10);
    });

    it('moves to next page', function(){
    	viewModel.nextPage();

    	expect(viewModel.currentPage()).toBe(2);
    });

    it('moves to previous page', function(){

    	viewModel.changePage(7);
    	
    	viewModel.prevPage();

    	expect(viewModel.currentPage()).toBe(6);

    });

    it('doesnt move to next page if already on last page', function(){

    	viewModel.lastPage();
    	

    	viewModel.nextPage();

    	expect(viewModel.currentPage()).toBe(10);

    });

    it('updates observable collection with paginated result after page changed', function(){
    	viewModel.changePage(2);

    	expect(viewModel.collection()).toEqual(page2);

    });


});  