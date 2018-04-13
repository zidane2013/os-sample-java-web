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
	$scope.list_charge = [];
	$scope.charge = [];
	$scope.tva_unites = ['\u20ac','%'];
	$scope.selectedTva = '0';
	$scope.currentIndex = 0;

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
	$scope.loadAllCharge = function(startDate){
		//$scope.list_charge = [];
		var last_day = new Date($scope.year, $scope.month -1 , 0,0,0,0,0);
		for(var i = 1; i<=(last_day.getUTCDate());i++){
			var d = new Date($scope.year, $scope.month-1 ,i, 0, 0, 0, 0);
			if(startDate >= d.getDate()){
				continue;
			}
			if(d.getDay() != 0 && d.getDay() !=6){
				$scope.list_charge.push({
					tva : 10,
					tva_unit : $scope.selectedTva,
					htc : 0,
					ttc : 0,
					date : d
				});
				break;
			}else{
				continue;
			}
		}

	}

	$scope.loadChargesTTC  = function() {
		//$scope.load_charges_ttc = !$scope.load_charges_ttc;
		$scope.load_charges_htc = false;
		$scope.list_charge = [];
		if($scope.load_charges_ttc || $scope.load_charges_htc){
			$scope.loadAllCharge(0);
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
		$scope.list_charge = [];
		if($scope.load_charges_ttc || $scope.load_charges_htc){
			$scope.loadAllCharge(0);
		}		
	}
	$scope.getCharges  = function() {
		return $scope.list_charge;
	};
	
	$scope.onCalc  = function() {
		$scope.sommeTTC = 0;
		$scope.sommeHTC = 0;
		angular.forEach($scope.list_charge, function(cchr) {
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
		$scope.list_charge[index].date = event;
	};
	$scope.updateTTC  = function(index,event) {
		$scope.list_charge[index].ttc = Number(event.target.value);
	};
	$scope.updateHTC  = function(index,event) {
		$scope.list_charge[index].htc = Number(event.target.value);
	};
	$scope.updateTVA  = function(index,event) {
		$scope.list_charge[index].tva = Number(event.target.value);;
	};
	
	$scope.update_tva_unit   = function(index){
		selectedTva = index;
		angular.forEach($scope.list_charge, function(cchr) {
			cchr.tva_unit = index;
		});
	}
	
	$scope.deleteDay = function(index) {
		$scope.list_charge.splice(val, 1);

	};	
	
	$scope.duplicateDay = function(index) {
		val = {};
		val.tva = $scope.list_charge[index].tva;
		val.tva_unit = $scope.list_charge[index].tva_unit;
		val.htc = $scope.list_charge[index].htc;
		val.ttc = $scope.list_charge[index].ttc;
		val.date = $scope.list_charge[index].date;
		$scope.list_charge.splice(index+1,0,val);
	};
	

	$scope.add = function() {
		
		if($scope.list_charge==undefined || $scope.list_charge.length==0){
			$scope.loadAllCharge(0);
		}else{
			var startDate = $scope.list_charge[$scope.list_charge.length-1].date;
			$scope.loadAllCharge(startDate.getDate());
		}
	};
	$scope.last_width=0; 
	$scope.unHidenDate = function(visibile){
		var index = 0;
		if(visibile && $scope.last_width==0){
			var list = document.getElementsByName("calender");
			$scope.last_width = list[index].offsetWidth;
		}
		angular.forEach($scope.list_charge, function(cchr) {
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
	 
	$scope.saut_ligne = 10; 
	$scope.export = function(){
		var doc = new jsPDF();
		
		var saut_ligne_next = $scope.saut_ligne;
		var header = 'Les Charges de ' + $scope.translation($scope.month) + ' ' + $scope.year;
		doc.text(header, 10, saut_ligne_next);saut_ligne_next +=$scope.saut_ligne;
		doc.text('TTC   |    HTC   |    TVA   |    DATE', 10, saut_ligne_next);saut_ligne_next +=5;
		doc.text('____      _____      _____      ______', 10, saut_ligne_next);saut_ligne_next +=$scope.saut_ligne;
		angular.forEach($scope.list_charge, function(cchr) {
			var text = cchr.ttc +'      |     '+ cchr.htc +'     |     '+ cchr.tva +'     |        '+ cchr.date.getFullYear()+'-'+(cchr.date.getMonth()<9 ? '0'+(cchr.date.getMonth()+1) : (cchr.date.getMonth()+1))+'-'+(cchr.date.getDate()<10? '0'+cchr.date.getDate(): cchr.date.getDate());
			doc.text(text, 10, saut_ligne_next);saut_ligne_next +=$scope.saut_ligne;
		});
		doc.save('a4.pdf')
     }
	
});

