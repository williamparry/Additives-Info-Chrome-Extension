var EAdditiveFilter;
var EAdditivesList;
var query = "select * from html where url=\"http://www.cspinet.org/reports/chemcuisine.htm\" and xpath='//div[@class=\"additive\"]'"
var DAL = new LocalDAL('additivesInfo');

function filterAdditives(e) {
	var q = EAdditivesFilter.value;
	var items = EAdditivesList.querySelectorAll('li');
	EAdditivesList.scrollTop = 0;
	for(var i = 0; i < items.length; i++) {
		items[i].style.display = 'block';
	}
	
	if(q) {
		for(var x = 0; x < items.length; x++) {
			if(items[x].querySelectorAll('h2')[0].innerHTML.toLowerCase().indexOf(q.toLowerCase()) === -1) {
				items[x].style.display = 'none';
			}
		}
	}
	
}

function init() {

	EAdditivesFilter = $('additives-filter');
	EAdditivesFilter.onkeyup = filterAdditives;
	
	EAdditivesList = $('additives-list');
	var additives = DAL.get('additives');
	if(additives) {
		refreshList(additives);
	}
	
	var s = document.createElement('script');
	s.src = 'http://query.yahooapis.com/v1/public/yql?q='+encodeURIComponent(query)+'&format=json&callback=massageData';
	document.body.appendChild(s);
	
	
}

function massageData(data) {
	
	var additives = [];
	
	var r = data.query.results.div;
	
	for(var i = 0; i < r.length; i++) {
	
		if(r[i].img && r[i].h5 && r[i].p) {
			
			var title;
			if(typeof r[i].h5 == 'string') {
				title = r[i].h5;
			} else if(r[i].h5.content) {
				title = r[i].h5.content;
			} else if(r[i].h5.a.content) {
				title = r[i].h5.a.content;
			} else if(r[i].h5.a) {
				title = r[i].h5.a[0].content;
			} else {
				title = "";
			}
			
			var obj = {
				title: title,
				rating: r[i].img.alt,
				teaser: "",
				found: "",
				content: ""
			}
			
			for(var x = 0; x < r[i].p.length; x++) {
				
				if(typeof r[i].p[x] == 'object') {
					
					if(r[i].p[x].strong) {
						var found;
						if(r[i].p[x].strong.a) {
							found = '- See ' + r[i].p[x].strong.a.content;
						} else {
							found = r[i].p[x].strong.content;
						}
						obj.found = found;
						
					} else {
						if(r[i].p[x].a) {
							var t = [];
							for(var n = 0; n < r[i].p[x].a.length; n++) {
								t.push(r[i].p[x].a[n].content);
							}
							obj.teaser = 'See also ' + t.join(' and ');
						} else {
							obj.teaser = r[i].p[x].content;
						}
					}
				} else {
					obj.content += r[i].p[x];
				}
				
			}
			
			additives.push(obj);
			
		}
		
	}
	
	DAL.set('additives',additives);
	refreshList(additives);
	
}

function refreshList(additives) {
	
	EAdditivesList.innerHTML = "";
	for(var i = 0; i < additives.length; i++) {
	
		var li = $$('li');
		
		var h2 = $$('h2');
		h2.innerHTML = additives[i].title;
		li.appendChild(h2);
		
		var teaser = $$('small');
		teaser.innerHTML = additives[i].teaser;
		li.appendChild(teaser);
		
		var info = $$('div');
		li.appendChild(info);
		
		if(additives[i].found) {
			var foundIn = $$('p');
			foundIn.innerHTML = '<strong>Found in: </strong> ' + additives[i].found;
			info.appendChild(foundIn);
		}
		
		var rating = $$('p');
		rating.innerHTML = '<strong>Rating: </strong> ' + additives[i].rating;
		info.appendChild(rating);
		
		if(additives[i].content) {
			var content = $$('p');
			content.innerHTML = '<strong>Description: </strong>' + additives[i].content;
			info.appendChild(content);
		}
		
		EAdditivesList.appendChild(li);
		
	}
	
}

window.onload = init;