function $(e) { return document.getElementById(e); }
function $$(e) { return document.createElement(e); }

Element.prototype.hasClass=function(a){return this.className.match(new RegExp("(\\s|^)"+a+"(\\s|$)"))};
Element.prototype.addClass=function(a){if(!this.hasClass(a)){this.className+=" "+a}};
Element.prototype.removeClass=function(a){if(this.hasClass(a)){var b=new RegExp("(\\s|^)"+a+"(\\s|$)");this.className=this.className.replace(b," ")}};


Object.prototype.UpdateProp = function(key,val) {
	var path = key.split('.');
	
	var objTraversals = 0;
	
	function traverse(obj) {
		if(typeof obj == 'object') {
			for(var y in obj) {
				if(y == path[objTraversals]) {
					if(objTraversals == path.length - 1) {
						obj[y] = val;
						return true;
					} else {
						objTraversals++;
						return traverse(obj[y]);
					}
				}
			}
		}
		return false;
	}
	
	for(var x in this) {
		if(x == path[objTraversals]) {
			if(objTraversals == path.length - 1) {
				this[x] = val;
				return;
			} else {
				objTraversals++;
				return traverse(this[x]);	
			}
		}
	}
	this[key] = val;
}

function LocalDAL(storage) {

	if(!localStorage[storage] || typeof localStorage[storage] == 'undefined') {
		localStorage[storage] = JSON.stringify({});
		
	}

	this.set = function (key,val) {
		var localData = JSON.parse(localStorage[storage]);
		localData.UpdateProp(key,val);
		localStorage[storage] = JSON.stringify(localData);
	}

	this.get = function (key) {
		var localData = JSON.parse(localStorage[storage]);
		if(key) {
			return localData[key];
		}
		return localData;
	}
	
}