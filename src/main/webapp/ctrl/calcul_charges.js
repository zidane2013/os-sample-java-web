/*
 AngularJS v1.6.1
 (c) 2010-2016 Google, Inc. http://angularjs.org
 License: MIT
 */
 var charges = angular.module('charges', []);
 
charges.service('$scope', function () {
		$scope.month = '';
		$scope.year = '';

        return {
            getProperty: function () {
                return property;
            },
            setProperty: function(value) {
                property = value;
            }
        };
 });
	
 charges.controller('ChargesController', function($scope) {
	$scope.sommeTTC = 0;
	$scope.sommeHTC = 0;
	$scope.selected = false;
	$scope.month = '';
	$scope.year = '';
	$scope.libelle_fr = ['Janvier','F\u00e9vrier','Mars','Avril','Mai','Juin','Juillet','Ao\u00fbt','Septembre','Octobre','Novembre','D\u00e9cembre'];
	$scope.libelle_en = ['January','February','March','Avril','May','June','July','August','September','October','November','December'];
	$scope.libelle_code = ['0','1','2','3','4','5','6','7','8','9','10','11','12'];
	$scope.months = ['0','1','2','3','4','5','6','7','8','9','10','11','12'];
	$scope.langues = ['en','fr'];
	$scope.langue = 'fr';
	var list_charge = [];
	$scope.charge = [];
	$scope.cnt = 0;
	$scope.tva_unites = ['\u20ac','%'];
	$scope.selectedTva = '0';

	$scope.translation = function(code) {
		// wich langue ?
		if($scope.langue=='fr'){
			//console.log($scope.libelle_fr[code-1]);
			return $scope.libelle_fr[code-1];
		}else if($scope.langue=='en'){
			//console.log($scope.libelle_fr[code-1]);
			return $scope.libelle_en[code-1];
		}
	};
	
	$scope.isMontYearSelected  = function() {
		$scope.selected = $scope.month && $scope.year;
		return $scope.selected;
	}
	$scope.load_charges_ttc = false;
	$scope.load_charges_htc = false;
	$scope.tva = 10;
	$scope.loadAllCharge = function(){
		var last_day = new Date($scope.year, $scope.month -1 , 0,0,0,0,0);
		for(var i = 1; i<=(last_day.getUTCDate());i++){
			var d = new Date($scope.year, $scope.month-1 , i, 0, 0, 0, 0);
			if(d.getDay() != 0 && d.getDay() !=6){
				list_charge.push({
					tva : 10,
					tva_unit : $scope.selectedTva,
					htc : 0,
					ttc : 0,
					date : d
				});
			}
		}
	}

	$scope.loadChargesTTC  = function() {
		//$scope.load_charges_ttc = !$scope.load_charges_ttc;
		$scope.load_charges_htc = false;
		list_charge = [];
		if($scope.load_charges_ttc || $scope.load_charges_htc){
			$scope.loadAllCharge();
		}		
	}
	$scope.isHTC = function() {
		return $scope.load_charges_htc;
	}
	$scope.isTTC = function() {
		return $scope.load_charges_ttc;
	}
	$scope.loadChargesHTC  = function() {
		$scope.load_charges_ttc = false;
		//$scope.load_charges_htc = !$scope.load_charges_htc;
		list_charge = [];
		if($scope.load_charges_ttc || $scope.load_charges_htc){
			$scope.loadAllCharge();
		}		
	}
	$scope.getCharges  = function() {
		return list_charge;
	};
	
	$scope.onCalc  = function() {
		$scope.sommeTTC = 0;
		$scope.sommeHTC = 0;
		angular.forEach(list_charge, function(cchr) {
			if($scope.load_charges_ttc){
				if(cchr.tva_unit == 0){ // euros
					$scope.sommeTTC  += cchr.ttc;
					$scope.sommeHTC  += cchr.ttc !=0 ? ( cchr.ttc -  cchr.tva) : 0;
				}else if(cchr.tva_unit == 1){ // pourcentage
					$scope.sommeTTC  += cchr.ttc;
					$scope.sommeHTC  += cchr.ttc !=0 ? (cchr.ttc - (cchr.ttc * cchr.tva / 100)) : 0;
				}
				if($scope.sommeTTC==0){
					$scope.sommeHTC=0;
				}
			}
			if($scope.load_charges_htc){
				if(cchr.tva_unit == 0){// euros
					$scope.sommeTTC  += cchr.htc!= 0 ? (cchr.htc + cchr.tva) : 0 ;
				}else if(cchr.tva_unit == 1){// pourcentage
					$scope.sommeTTC  += cchr.htc!= 0 ? (cchr.htc + (cchr.htc * cchr.tva / 100)) : 0;
				}
				$scope.sommeHTC  += cchr.htc;
				if($scope.sommeHTC==0){
					$scope.sommeTTC=0;
				}
			}
		});
	};

	$scope.updateDATE  = function(index,event) {
		list_charge[index].date = event;
	};
	$scope.updateTTC  = function(index,event) {
		list_charge[index].ttc = Number(event.target.value);
	};
	$scope.updateHTC  = function(index,event) {
		list_charge[index].htc = Number(event.target.value);
	};
	$scope.updateTVA  = function(index,event) {
		list_charge[index].tva = Number(event.target.value);;
	};
	
	$scope.update_tva_unit   = function(index){
		selectedTva = index;
		angular.forEach(list_charge, function(cchr) {
			cchr.tva_unit = index;
		});
	}
	
	$scope.deleteDay = function(val) {
		list_charge.splice(val, 1);
		$scope.onCalc();
	};
	

	$scope.add = function() {
		list_charge.push({
			tva : 10,
			tva_unit : $scope.selectedTva,
			htc : 0,
			ttc : 0,
			date : ''
		});
	};
	$scope.last_width=0; 
	$scope.unHidenDate = function(visibile){
		var index = 0;
		if(visibile && $scope.last_width==0){
			var list = document.getElementsByName("calender");
			$scope.last_width = list[index].offsetWidth;
		}
		angular.forEach(list_charge, function(cchr) {
			if(visibile){
				//document.getElementsByName("span_date")[index].style.visibility = "visible"; 
				document.getElementsByName("calender")[index].style.visibility = "hidden"; 
				document.getElementsByName("calender")[index].style.width = "2px"; 		
			}else{
				//document.getElementsByName("span_date")[index].style.visibility = "hidden"; 
				document.getElementsByName("calender")[index].style.visibility = "visible"; 
				document.getElementsByName("calender")[index].style.width = $scope.last_width+"px";
			}
			index++;
		});
		if(!visibile){
			$scope.last_width = 0;
		}
	}
	
	 $scope.data=  ['kjkcvwx'];
	 
	$scope.export = function(){
		// unhiden date to a fiche it in pdf
		//$scope.unHidenDate(true);
        html2canvas(document.getElementById('exportthis'), {
            onrendered: function (canvas) {
                //var data = canvas.toDataURL();
                var docDefinition = {
                    content: [{
                        image: $scope.data,
                        width: 1000,
                    }]
                };
                pdfMake.createPdf(docDefinition).download("test.pdf");
				//$scope.unHidenDate(false);
            }
        });
     }
	
});

