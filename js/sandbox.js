var Sandbox = {
	create: function(core, module_selector) {
		var CONTAINER = core.dom.query('#' + module_selector); //create the html sandbox based on module_selector
		
		//http://javascript.info/tutorial/animation#css-transitions
		function animate(opts) {
			var start = new Date;  
			var id = setInterval(function() {

				var timePassed = new Date - start;

				var progress = timePassed / opts.duration;
				if (progress > 1) progress = 1;
				var delta = opts.delta(progress);
				opts.step(delta);
				if (progress == 1) {
					clearInterval(id);
				}
			}, opts.delay || 10);
		}
		
		function linear(progress,x) {
		  return progress
		}
		function quad(progress) {
			return Math.pow(progress, 2)
		}


		return {
			find: function(selector) {
				return CONTAINER.query(selector); //returns only elements within the html sandbox
			},
			addEvent: function(element, evt, fn) {
				core.dom.bind(element, evt, fn);
			},
			removeEvent: function(element, evt, fn) {
				core.dom.unbind(element, evt, fn);
			},
			notify: function(evt) {
				if(core.is_obj(evt) && evt.type) {
					core.triggerEvent(evt);
				}
			},
			listen: function(evts) {
				if(core.is_obj(evts)) {
					core.registerEvents(evts, module_selector);
				}
			},
			ignore: function(evts) {
				if(core.is_arr(evts)) {
					core.removeEvents(evts, module_selector);
				}
			},
			create_element: function(el, config) {
				var i, text, img;
				el = core.dom.create(el); //indirect document.createElement(el)
				if(config) {
					if(config.children && core.is_arr(config.children)) {
						i = 0;
						while(config.children[i]) {
							el.appendChild(config.children[i]);
							i++;
						}
						
						delete config.children;
					} else if(config.text) {
						text = document.createTextNode(config.text);
						el.appendChild(text);
						
						delete config.text;
					} else if(config.src) {
						img = core.dom.create('img');
						img.src = config.src;
						el.appendChild(img);
						
						delete config.src;
					} 
					core.dom.apply_attrs(el, config);
				}
				return el;
			},
			fadeIn: function(element, duration, from, to) {
				to = to - from;
				element.style.opacity = from;
				
				animate({
					delay: 10,
					duration: duration || 1000, // 1 sec by default
					delta: quad,
					step: function(delta) {
						element.style.opacity = (to * delta) + from;
					}
				})

			}
		};
	}
};