function HikingService($http, $q) {
    const service = this;
    service.favoriteArray = [];
    service.hikingBuddy = null;
    service.key = '200488347-7449e5616f0f75c446c24d3c0da3ba39';
    service.geoKey = 'AIzaSyAzWLrTiTrHUeTKCGNNpPkFLVrJ-ncycK0';
    service.weatherKey = 'd3b1d3b9eac060080c71477c330b65e0';

    service.getTrails = (search, distance, length, stars) => {
        return $q(function (resolve, reject) {

        service.getGeocode(search)
        .then((results) => {
            service.trailLat = results.lat;
            service.trailLon = results.lon;
            service.formatLocation = results.formatLocation;
        
            let url = 'https://www.hikingproject.com/data/get-trails';
            let apiParam = {
                lat: service.trailLat,
                lon: service.trailLon,
                maxDistance: distance,
                minLength: length,
                minStars: stars,
                sort: 'distance',
                key: service.key
            };

            $http({
                url: url,
                method: 'GET',
                params: apiParam,
            })
                .then((response) => {
                    service.globalLocation = response.data.trails;
                    console.log(response);
                    resolve(response.data.trails);
                })
                .catch((err) => {
                    reject(error);
                })
        })
    })
    }

    service.getCamping = (locationLat, localtionLon) => {
        let url = 'https://www.hikingproject.com/data/get-campgrounds';
        let apiParam = {
            lat: locationLat,
            lon: localtionLon,
            sort: 'distance',
            key: service.key
        }
        return $q(function (resolve, reject) {
            $http({
                url: url,
                method: 'GET',
                params: apiParam,
            })
                .then((response) => {
                    resolve(response.data.campgrounds);
                })
                .catch((err) => {
                    reject(error);
                })
        })
    }

    service.getGeocode = (search) => {
        let url = 'https://maps.googleapis.com/maps/api/geocode/json';
        let apiParam = {
            address: search,
            key: service.geoKey
        }

        return $q(function (resolve, reject) {
            $http({
                url: url,
                method: 'GET',
                params: apiParam,
            })
                .then((response) => {
                    console.log(response);
                    let location = {
                        formatLocation: response.data.results[0].formatted_address,
                        lat:  response.data.results[0].geometry.location.lat,
                        lon: response.data.results[0].geometry.location.lng
                    }
                    resolve(location);
                })
                .catch( (err) => {
                    reject(error);
                })
        })
    }

    service.setHikingBuddy = (data) => {
        service.hikingBuddy = data;
    }

    service.getHikingBuddy = () => {
        return service.hikingBuddy;
    }

    service.setFavorites = (favoriteParam) => {
        service.favoriteArray.push(favoriteParam);
    }
    service.setRemoveFavorites = (removeParam) =>{
        service.favoriteArray.splice(service.favoriteArray.indexOf(removeParam), 1);
    }

   
 }

angular
    .module('HikingApp')
    .service('hikingService', HikingService);