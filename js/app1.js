/*Api request is loaded Asynchronously */
/*
Code consist of 6 functions and designed as per Neighborhood Map rubrics criteria
*/

//My location object contains location information: latitude and longitude, title, pokemon chances and an id for third party api use
//This will be used to locate the place 
var locations = [
	{
		title: 'Marathalli Bridge',
		location:{
			lat: 12.959368,
			lng: 77.701168,
			},
		chance:["17 pokemon/hour"],
		id: '4e6ee078d1647b1137b83e8c',
	},{
		title: 'Eco Space',
		location:{
			lat: 12.926190,
			lng: 77.681170
			},
		chance:["10 pokemon/hour"],
		id: '4b594ee0f964a520a68428e3',
	},{
		title: 'Silk Board',
		location:{
			lat: 12.916636,
			lng: 77.623508
			},
		chance:["25 pokemon/hour"],
		id: '50ae2160e4b0ed6fa7b5dabb',
	},{
		title: 'Tin Factory traffic jam',
		location:{
			lat: 12.997988,
			lng: 77.671107
			},
		chance:["20 pokemon/hour"],
		id: '51a6cb05498ec49099258ed2',
	},{
		title: 'Graphite India traffic jam',
		location:{
			lat: 12.979771,
			lng: 77.710304
			},
		chance:["12 pokemon/hour"],
		id: '5231c49311d26dde3cad36c5',
	},{
		title: 'Domlur',
		location:{
			lat: 12.9606694,
			lng: 77.6417112
			},
		chance:["7 pokemon/hour"],
		id: '4da83a046e81162ae7a20113',
	}
]

function mapError(){
	viewModelobj.mapDetails("<em>The map couldn't be loaded. Try after some time</em>");
}

var locationModel = function(data){
	var self = this;
	self.show = ko.observable(true);
	self.title = data.title;
	self.location = data.location;
	self.chance = data.chance;
	self.id = data.id;
};


/*

1)A instance viewModel function will append to the knockout model in html
2)A instance of locationModel is used to populate locationList array
3)It will search and filter out list and marker by toggling the show property
*/
var viewModel = function(){
	var self = this;
	self.search = ko.observable('');
	self.locationList = ko.observableArray();
	self.mapDetails = ko.observable();
	self.apiDetails = ko.observable();
	for (var i = 0 ; i < locations.length; i++) {
		var loc = new locationModel(locations[i]);
		self.locationList.push(loc);
	}
	self.filterSearch = ko.computed(function(){
		var userInput = self.search().toLowerCase();
		for (var i = 0; i < self.locationList().length; i++){
			if(self.locationList()[i].title.toLowerCase().indexOf(userInput) > -1){
				self.locationList()[i].show(true);
				if (self.locationList()[i].marker) {
				self.locationList()[i].markerModel.setVisible(true);
				}
			}else{
				self.locationList()[i].show(false);//else don't show
				if (self.locationList()[i].marker) {
				self.locationList()[i].markerModel.setVisible(false);
				}
			}
		}
	});
		self.listClick = function(locations) {
		google.maps.event.trigger(locations.markerModel, 'click');
	};

};
//Creating a new google map object
//Customizing the feature 

var mapFeature = function() {
	var map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 12.959368, lng: 77.701168},
		zoom: 12,
		mapTypeControl: false
	});
	
	for(var i=0; i < viewModelobj.locationList().length; i++){
		var markerPosition = viewModelobj.locationList()[i].location;
		var markerTitle = viewModelobj.locationList()[i].title;
		var markerChance = viewModelobj.locationList()[i].chance;
		var markerId = viewModelobj.locationList()[i].id;
		var beforeIcon = markerToggler('initial');
		var afterIcon = markerToggler('after');
		
		var marker = new google.maps.Marker({
		map: map,
		position: markerPosition,
		title: markerTitle,
		chance: markerChance,
		id: markerId,
		animation: google.maps.Animation.DROP,
		icon: beforeIcon,
		afterIcon: afterIcon,
		beforeIcon: beforeIcon
		});
		viewModelobj.locationList()[i].markerModel = marker;
		markerAction(marker);
		
}
}
/* 
This function controls the marker animation
It acts on current marker 
 */
var infoWindow;//It is declared outside 
function markerAction(marker){
	infoWindow = new google.maps.InfoWindow();
	marker.addListener('click', function(){
		var currentMarker = this;
		currentMarker.setAnimation(google.maps.Animation.BOUNCE);
		setTimeout(function() {
			currentMarker.setAnimation(null);
		}, 2000);
		populateInfoWindow(this, infoWindow)
	})
	marker.addListener('mouseover', function(){
		this.setIcon(this.afterIcon);
	});
	marker.addListener('mouseout', function(){
		this.setIcon(this.beforeIcon);
	});
}

//reference:- https://developers.google.com/maps/documentation/javascript/markers
function markerToggler(toggle){
	var markerImage = new google.maps.MarkerImage(	'images/' + toggle + '.png',
        new google.maps.Size(64, 64),
        new google.maps.Point(0, 0),
        new google.maps.Point(32, 64),
        new google.maps.Size(64, 64));
        return markerImage;
}

function populateInfoWindow(selectedMarker, selectedInfoWindow){
	if (selectedInfoWindow.selectedMarker != selectedMarker) {
			selectedInfoWindow.setContent('');
			selectedInfoWindow.selectedMarker = selectedMarker;
			selectedInfoWindow.addListener('closeclick', function() {
				selectedInfoWindow.selectedMarker = null;
			});
          
        var CLIENT_ID_Foursquare = '?client_id=AOGD2RDYRJC2QBFLUDJVE5IH00KRS1PVVGOARUQZUSF5OVIM';
		var CLIENT_SECRET_Foursquare = '&client_secret=K2Z1IEBIK1NDQMHSJFZQ0NVPHRJBA2TB5ZKZU5XQWV2CQP43';
		
		/*reference: foursquare for developers
		https://developer.foursquare.com/ */
		$.ajax({
				type: "GET",
				dataType: 'json',
				cache: false,
				url: 'https://api.foursquare.com/v2/venues/' + selectedMarker.id + CLIENT_ID_Foursquare + CLIENT_SECRET_Foursquare + '&v=20170115',
				async: true,
				success: function(data) {
						var venuename = data.response.venue.name;
						var formattedAddress = data.response.venue.location.formattedAddress;
						selectedInfoWindow.open(map, selectedMarker);
						selectedInfoWindow.setContent('<div>'+ venuename + '<br>'+ formattedAddress + '<br>' + selectedMarker.chance +'</div>');
						if (!data.response) {
								data.response = 'No rating in foursquare';
						}
				},
				error: function () {
    				viewModelobj.apiDetails("<em>The map couldn't be loaded. Try after some time</em>");
    			}
		})
		
		viewModelobj.apiDetails("welcome to Api");
        }
}

var viewModelobj = new viewModel();
ko.applyBindings(viewModelobj);

