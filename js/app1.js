//My location object contains location information like latitude and longitude, some hardcoded info and an id for third party api use
//This will be used to locate the place 
var locations = [
	{
		title: 'Marathalli Bridge',
		location:{
			lat: 12.959368,
			lng: 77.701168,
			},
		chance:["5 pokemon/hour"],
		id: '4e6ee078d1647b1137b83e8c',
	},{
		title: 'Eco Space',
		location:{
			lat: 12.926190,
			lng: 77.681170
			},
		chance:["5 pokemon/hour"],
		id: '4b594ee0f964a520a68428e3',
	},{
		title: 'Silk Board',
		location:{
			lat: 12.916636,
			lng: 77.623508
			},
		chance:["5 pokemon/hour"],
		id: '50ae2160e4b0ed6fa7b5dabb',
	},{
		title: 'Tin Factory traffic jam',
		location:{
			lat: 12.997988,
			lng: 77.671107
			},
		chance:["5 pokemon/hour"],
		id: '51a6cb05498ec49099258ed2',
	},{
		title: 'Graphite India traffic jam',
		location:{
			lat: 12.979771,
			lng: 77.710304
			},
		chance:["5 pokemon/hour"],
		id: '5231c49311d26dde3cad36c5',
	},{
		title: 'Domlur',
		location:{
			lat: 12.9606694,
			lng: 77.6417112
			},
		chance:["5 pokemon/hour"],
		id: '4da83a046e81162ae7a20113',
	}
]

var locationModel = function(data){
	var self = this;
	self.show = ko.observable(true);
	self.id = data.id;
	self.chance = data.chance;
	self.location = data.location;
	self.title = data.title;
};


//viewmodel function will append to the knockout model in html
var ViewModel = function(){
					var self = this;
					self.search = ko.observable('');
					self.locationList = ko.observableArray();//Locationlist array is defined to hold the data from locations object
					self.oldlocationList = ko.observableArray();
					for (var i = 0 ; i < locations.length; i++) {//iterating through the locations object
						var loc = new locationModel(locations[i]);
						self.locationList.push(loc);//adding the locations in filteredLocations array
						self.oldlocationList.push(loc);
					}
					
					self.filterSearch = ko.computed(function(){
						var userInput = self.search();//this will hold the user input
						if(self.search()!=''){
							for(var i=0; i<self.locationList().length; i++) {
								if(self.locationList()[i].title.toLowerCase().indexOf(userInput.toLowerCase()) > -1){ //if the iterated locationlist element matches to the user input
									self.locationList()[i].show(true);
									console.log('In there');
								}
								else{
									console.log('Not in there');
									self.locationList()[i].show(false);
								}
							}
						}
					});
};

//Creating a new google map object
//Customizing the feature 
var map;
var marker;
function mapFeature() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 12.959368, lng: 77.701168},
		zoom: 12,
		mapTypeControl: false
	});
	
	locations.forEach(function(loc){
		var markerPosition = loc.location;
		var markerTitle = loc.title;
		var markerChance = loc.chance;
		
		marker = new google.maps.Marker({
		map: map,
		position: markerPosition,
		title: markerTitle,
		chance: markerChance,
		animation: google.maps.Animation.DROP
	});
})
}

var viewmodel = new ViewModel();
ko.applyBindings(viewmodel);
