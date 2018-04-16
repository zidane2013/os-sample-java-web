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
	$scope.libelle_fr = ['---Veuillez s\u00e9lectionner select---','Janvier','F\u00e9vrier','Mars','Avril','Mai','Juin','Juillet','Ao\u00fbt','Septembre','Octobre','Novembre','D\u00e9cembre'];
	$scope.libelle_en = ['---Please select---','January','February','March','Avril','May','June','July','August','September','October','November','December'];
	$scope.libelle_code = ['0','1','2','3','4','5','6','7','8','9','10','11','12'];
	$scope.months = ['0','1','2','3','4','5','6','7','8','9','10','11','12'];
	$scope.langues = ['en','fr'];
	$scope.langue = 'fr';
	$scope.list_charge = [];
	$scope.charge = [];
	$scope.tva_unites = ['\u20ac','%'];
	$scope.selectedTva = '0';
	$scope.currentIndex = 0;
	$scope.ttc_length = 1;
	$scope.htc_length = 1;
	$scope.tva_length = 1;
	$scope.date_length = 0;

	$scope.translation = function(code) {
		// wich langue ?
		if($scope.langue=='fr'){
			//console.log($scope.libelle_fr[code-1]);
			return $scope.libelle_fr[code];
		}else if($scope.langue=='en'){
			//console.log($scope.libelle_fr[code-1]);
			return $scope.libelle_en[code];
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
					cchr.ttc = cchr.htc!= 0 ? (cchr.htc + cchr.tva) : 0;
					$scope.sommeTTC  +=  cchr.ttc;
				}else if(cchr.tva_unit == 1){// pourcentage
					cchr.ttc = cchr.htc!= 0 ? (cchr.htc + (cchr.htc * cchr.tva / 100)) : 0;
					$scope.sommeTTC  += cchr.ttc;
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
		console.log('index:'+index+',value:'+event.target.value+',ttc:'+$scope.list_charge[index].ttc);
	};
	$scope.updateHTC  = function(index,event) {
		$scope.list_charge[index].htc = Number(event.target.value);
		console.log('index:'+index+',value:'+event.target.value+',htc:'+$scope.list_charge[index].htc);
	};
	$scope.updateTVA  = function(index,event) {
		$scope.list_charge[index].tva = Number(event.target.value);;
		console.log('index:'+index+',value:'+event.target.value+',tva:'+$scope.list_charge[index].tva);
	};
	
	$scope.update_tva_unit   = function(index){
		selectedTva = index;
		angular.forEach($scope.list_charge, function(cchr) {
			cchr.tva_unit = index;
		});
	}
	
	$scope.deleteDay = function(index) {
		$scope.list_charge.splice(index,1);
		var str = '';
		for(var i=0;i<$scope.list_charge.length-1;i++)
			str+=$scope.list_charge[i].ttc+',';
		if (typeof $scope.list_charge !== 'undefined' && $scope.list_charge.length > 0) {
			str+=$scope.list_charge[$scope.list_charge.length-1].ttc;
		}
		console.log('index:'+index+',list:'+str);

	};	
	
	$scope.duplicateDay = function(index) {
		val = {};
		val.tva = $scope.list_charge[index].tva;
		val.tva_unit = $scope.list_charge[index].tva_unit;
		val.htc = $scope.list_charge[index].htc;
		val.ttc = $scope.list_charge[index].ttc;
		val.date = $scope.list_charge[index].date;
		$scope.list_charge.splice(index,0,val);
		var str = '';
		for(var i=0;i<$scope.list_charge.length-1;i++)
			str+=$scope.list_charge[i].ttc+',';
		if (typeof $scope.list_charge !== 'undefined' && $scope.list_charge.length > 0) {
			str+=$scope.list_charge[$scope.list_charge.length-1].ttc;
		}
		console.log('val:{'+val.ttc+','+val.date+'},list:'+str);
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
		$scope.onCalc();
		angular.forEach($scope.list_charge, function(cchr) {
			if(cchr.ttc.toString().length > $scope.ttc_length){$scope.ttc_length = cchr.ttc.toString().length; }
			if(cchr.htc.toString().length > $scope.htc_length){$scope.htc_length = cchr.htc.toString().length; }
			if(cchr.tva.toString().length > $scope.tva_length){$scope.tva_length = cchr.tva.toString().length; }
		});
		console.log("$scope.ttc_length:"+$scope.ttc_length);
		console.log("$scope.htc_length:"+$scope.htc_length);
		console.log("$scope.tva_length:"+$scope.tva_length);

		var ttc_length_blanc=witeSpace1($scope.ttc_length);
		var htc_length_blanc=witeSpace1($scope.htc_length);
		var tva_length_blanc=witeSpace1($scope.tva_length);

		var saut_ligne_next = $scope.saut_ligne;
		var header = '******Les Charges de ' + $scope.translation($scope.month) + ' ' + $scope.year+'******';
		doc.text(header, 10, saut_ligne_next);saut_ligne_next +=$scope.saut_ligne;
		//doc.text('  TTC'+ttc_length_blanc+'|  '+'HTC'+htc_length_blanc+'|  '+'TVA'+tva_length_blanc+'|  '+'DATE', 10, saut_ligne_next);saut_ligne_next +=5;
		doc.text('TTC', 10, saut_ligne_next);
		doc.text('TTC', 50, saut_ligne_next);
		doc.text('TTC', 90, saut_ligne_next);
		doc.text('TTC', 120, saut_ligne_next);saut_ligne_next +=5;
		doc.text('_________________________________________________', 10, saut_ligne_next);saut_ligne_next +=$scope.saut_ligne;
		angular.forEach($scope.list_charge, function(cchr) {
			var dt1 = cchr.date.getFullYear()+'-'+(cchr.date.getMonth()<9 ? '0'+(cchr.date.getMonth()+1) : (cchr.date.getMonth()+1))+'-'+(cchr.date.getDate()<10? '0'+cchr.date.getDate(): cchr.date.getDate()); 
			//var text = '  '+cchr.ttc +witeSpace(cchr.ttc,'TTC'+ttc_length_blanc)+cchr.htc + witeSpace(cchr.htc,'HTC'+htc_length_blanc)+ cchr.tva + witeSpace(cchr.tva,'TVA'+tva_length_blanc)+dt1;
			doc.text(cchr.ttc+'', 10, saut_ligne_next);
			doc.text(cchr.htc+'', 50, saut_ligne_next);
			doc.text(cchr.tva+'', 90, saut_ligne_next);
			doc.text(dt1, 120, saut_ligne_next);
			saut_ligne_next +=$scope.saut_ligne;
		});
		doc.text('_________________________________________________', 10, saut_ligne_next);saut_ligne_next +=$scope.saut_ligne;
		doc.text('TTC TOTAL : '+$scope.sommeTTC, 10, saut_ligne_next);saut_ligne_next +=$scope.saut_ligne;
		doc.text('HTC TOTAL : '+$scope.sommeHTC, 10, saut_ligne_next);saut_ligne_next +=$scope.saut_ligne;
		doc.save('a4.pdf')
     }
	 
	 witeSpace = function(valNumber,maxValNumber){
		var length_blanc = '';
		/*for(var i=0;i<valNumber.toString().length;i++){
			length_blanc+=' ';
		}*/
		for(var i=0 ;i<=(maxValNumber.length - valNumber.toString().length);i++){
			length_blanc+=' ';
		}
		console.log(valNumber.toString().length+"'"+length_blanc+"'"+maxValNumber.length);
		//console.log("'"+length_blanc+"'");
		return length_blanc+'|  ';
		
	 }
	 
	 witeSpace1 = function(maxValNumber){
		var length_blanc = '';
		for(var i=0 ;i<maxValNumber;i++){
			length_blanc+=' ';
		}
		console.log("'"+length_blanc+"'"+maxValNumber);
		return length_blanc;
		
	 }
		 
	
});

