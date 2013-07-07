CORE.create_module('image-panel', function(sb) {
	var images;
	function eachImage(fn) {
		var i = 0, image;
		for(; image = images[i++];) {
			fn(image);
		}
	}
	function reset() {
		eachImage(function(image) {
			image.style.opacity = 1;
		});
	}
	return {
		init: function() {
			var that = this;
			images = sb.find('li'); //find all li elements within html sandbox (image-panel)
			//sb.listen();
			eachImage(function(images) {
				sb.addEvent(images, 'click', that.featureImage);
			});
		},
		reset: reset,
		destroy: function() {
			var that = this;
			eachImage(function(image) {
				sb.removeEvent(image, 'click', that.featureImage);
			});
			//sb.ignore([]);
		},
		featureImage: function(e) {
			var li = e.currentTarget;
			sb.notify({
				type: 'feature-image',
				data: {
					id: li.id, 
					title: li.getElementsByClassName('title')[0].innerHTML, 
					src: li.getElementsByClassName('showcase')[0].getAttribute('href'),
					date: li.getElementsByClassName('date')[0].innerHTML
				}
			});
		}
	};
});

CORE.create_module('feature-image', function(sb) {
	var featured,bkgd;
	
	function reset(el) {
		el.parentNode.style.display = 'none';
		while(el.hasChildNodes()) {
			el.removeChild(el.lastChild);	
		}
	}
	function centerImage(el) {
		if(el.nodeName.toLowerCase() === 'li') {
			var img = el.getElementsByTagName('img')[0], 
				parent = el.parentNode; 
		
			parent.style.marginLeft = -1 * img.width / 2 + "px";
			parent.style.marginTop = -1 * img.height / 2 + "px";		
			el.style.width = img.width + "px";
			el.style.height = img.height + "px";
		}
		
		return el
	}
	function createBkgd() {
		bkgd = sb.create_element('div', {'class': 'global_bkgd'});
		sb.addEvent(bkgd, function() {
			reset(featured);
		});
		return bkgd;
	}
	
	return {
		init: function() {
			featured = sb.find('ul')[0]; //find first ul element within html sandbox (feature-image)
			featured.parentNode.insertBefore(createBkgd(),featured);
			
			sb.listen({
				'feature-image': this.addImage
			});
		},
		destroy: function() {
			featured = null;
			sb.ignore(['feature-image']);
		},
		addImage: function(image) {
				var entry, img;
				
				entry = sb.create_element('li', {id: 'showcase-' + image.id, children: [
					sb.create_element('span', {'class': 'showcase-image', src: image.src}),
					sb.create_element('span', {'class': 'showcase-title', text: image.title}),
					sb.create_element('span', {'class': 'showcase-date', text: image.date})
				],
				'class': 'image-showcase'});
				
				sb.addEvent(entry, function () {
					reset(featured);
				});
				
				
				sb.fadeIn(bkgd, 1000, 0, 0.25) //this only loads the background once with the animation
				featured.parentNode.style.display = "block";
				
				img = entry.getElementsByTagName('img')[0];
				img.onload = function() {
					centerImage(entry);
				};
				
				featured.appendChild(entry);
				
		}
	};
});

CORE.start_all();