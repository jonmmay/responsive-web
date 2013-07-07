var CORE = (function() {
	var moduleData = {}, debug = true;
	
	return {
		debug: function(on) {
			debug = on ? true : false;
		},
		create_module: function(moduleID, creator) {
			var temp;
			if(typeof moduleID === 'string' && typeof creator === 'function') {
				temp = creator(Sandbox.create(this, moduleID)); //create a temporary sandbox for validation
				if(temp.init && temp.destroy && typeof temp.init === 'function' && typeof temp.destroy === 'function') {
					moduleData[moduleID] = {
						create: creator,
						instance: null
					};
					temp = null;
				} else {
					this.log(1, "");
				}
			} else {
				this.log(1, "");
			}
		},
		
		start: function(moduleID) {
			var mod = moduleData[moduleID];
			if(mod) {
				mod.instance = mod.create(Sandbox.create(this, moduleID));
				mod.instance.init();
			}
		},
		start_all: function() {
			var moduleID;
			for(moduleID in moduleData) {
				if(moduleData.hasOwnProperty(moduleID)) { //this should always be used with for in loops
					this.start(moduleID);
				}
			}
		},
		
		stop: function(moduleID) {
			var data;
			if(data = moduleData[moduleID] && data.instance) {
				data.instance.destroy();
				data.instance = null;
			}
			else {
				this.log(1, "");
			}
		},
		stop_all: function() {
			var moduleID;
			for(moduleID in moduleData) {
				if(moduleData.hasOwnProperty(moduleID)) { //this should always be used with for in loops
					this.stop(moduleID);
				}
			}
		},
		registerEvents: function(evts, mod) {
			if(this.is_obj(evts) && mod) {
				if(moduleData[mod]) {
					moduleData[mod].events = evts;
				} else {
					this.log(1,'');
				}
			} else {
				this.log(1, "");
			}
		},
		triggerEvent: function(evt) {
			var mod;
			for(mod in moduleData) {
				if(moduleData.hasOwnProperty(mod)) {
					mod = moduleData[mod];
					if(mod.events && mod.events[evt.type]) {
						mod.events[evt.type](evt.data);
					}
				}
			}
		},
		removeEvent: function(evts, mod) {
			var i = 0, evt;
			if(this.is_arr(evts) && mod && (mod = moduleData[mod]) && mod.events) {
				for(; evt = evts[i++];) {
					delete mod.events[evt];
				}
			}
		},
		log: function(severity, message) {
			if(debug) {
				console[(severity === 1) ? 'log' : (severity === 2) ? 'warn' : 'error'](message);
			} else {
				//send to the server
			}
		},
		dom: {
			query: function(selector, context) {
				var ret = {}, that = this, jqEls, i = 0;
				
				if(context && context.find) {
					jqEls = context.find(selector);
				} else {
					jqEls = jQuery(selector);
				}
				
				ret = jqEls.get();
				ret.length = jqEls.length;
				ret.query = function(sel) {
					return that.query(sel, jqEls);
				};
				return ret; //jQuery object is reduced to a more standard object
			},
			bind: function(element, evt, fn) {
				if(element && evt) {
					if(typeof evt === 'function') {
						fn = evt;
						evt = 'click';
					}
					jQuery(element).bind(evt, fn);
				} else {}
			},
			unbind: function(element, evt, fn) {
				if(element && evt) {
					if(typeof evt === 'function') {
						fn = evt;
						evt = 'click';
					}
					jQuery(element).unbind(evt, fn);
				} else {}
			},
			create: function(el) {
				return document.createElement(el);
			},
			apply_attrs: function(el, attrs) {
				jQuery(el).attr(attrs);
			}
		},
		
		
		is_arr: function(arr) {
			return jQuery.isArray(arr);
		},
		is_obj: function (obj) {
			return jQuery.isPlainObject(obj);
		}
	};
}());