'use strict';

angular.module('myApp.filters', [])
    .filter('number', function(){
        return function(num, decimalPlaces){

            if(!num){
                return 0;
            }

            num = parseFloat(num);
            if(isNaN(num))
                return 0;
            else if(num == Number.POSITIVE_INFINITY || num == Number.NEGATIVE_INFINITY){
                return "&infin;"
            }

            // Round to the number of decimal places we want
            var mult = Math.pow(10,decimalPlaces);
            num *= mult;
            num = Math.round(num);
            num /= mult;

            return num+"";
        }
    })

/**
 * We have to write special filters for objects because otherwise angular's "filter" filter will
 * search every field and cascade to other objects and gets itself into an infinite loop when it hits a
 * bi-directional relationship.
 */
    .filter('byName', function(){
        return function(items, searchText){
            var filtered = [];

            angular.forEach(items, function(obj){
                if(!searchText){
                    filtered.push(obj);
                }
                else{
                    if(obj.name && obj.name.toLowerCase().indexOf(searchText.toLowerCase()) >= 0)
                        filtered.push(obj);
                }


            });

            return filtered;
        }
    })
;
