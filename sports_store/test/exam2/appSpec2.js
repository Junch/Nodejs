'use strict';

describe("Controller Test", function(){
	var $scope, $httpBackend;

	beforeEach(angular.mock.module("appEx2"));

	beforeEach(angular.mock.inject(function(_$httpBackend_){
		$httpBackend = _$httpBackend_;
		$httpBackend.expect("GET", "productData.json").respond(
			[{name: "Apples", category: "Fruit", price: 1.20 },
			 {name: "Bananas", category: "Fruit", price: 2.42 },
			 {name: "Pears", category: "Fruit", price: 2.02 }]);
	}));

	beforeEach(angular.mock.inject(function($controller, $http){
		$scope = {};
		$controller("defaultCtrl", {
			$scope: $scope,
			$http: $http
		});
		$httpBackend.flush();
	}));

	it("Create variable", function() {
		expect($scope.counter).toEqual(0);
	});

	it("Increments counter", function() {
		$scope.incrementCounter();
		expect($scope.counter).toEqual(1);
	});

	it("Makes an Ajax request", function(){
		$httpBackend.verifyNoOutstandingExpectation();
	});

	it("Process the data", function(){
		expect($scope.products).toBeDefined();
		expect($scope.products.length).toEqual(3);
	});

	it("Preserve the data order", function(){
		expect($scope.products[0].name).toEqual("Apples");
		expect($scope.products[1].name).toEqual("Bananas");
		expect($scope.products[2].name).toEqual("Pears");
	});
});
