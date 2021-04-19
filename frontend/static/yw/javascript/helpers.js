function assert(exp, optMsg) {
	if (!exp) {
		throw new Error(optMsg || "Assertion failed");
	}
}

function intmax(ints) {
	if(typeof ints == "number") ints = [ints];
	for(var i = 0; i < ints.length; i++)
		if(ints[i] > Number.MAX_SAFE_INTEGER || ints[i] < Number.MIN_SAFE_INTEGER) return false;
	return true;
}

function clipIntMax(x) {
	if(x < Number.MIN_SAFE_INTEGER) x = Number.MIN_SAFE_INTEGER;
	if(x > Number.MAX_SAFE_INTEGER) x = Number.MAX_SAFE_INTEGER;
	return x;
}

function lineGen(x0, y0, x1, y1, max) {
	if(!max) max = 2000;
	var list = [];
	var x0 = Math.floor(x0);
	var y0 = Math.floor(y0);
	var x1 = Math.floor(x1);
	var y1 = Math.floor(y1);
	var dx = Math.abs(x1 - x0);
	var dy = Math.abs(y1 - y0);
	var sx = (x0 < x1) ? 1 : -1;
	var sy = (y0 < y1) ? 1 : -1;
	var err = dx - dy;
	for(var i = 0; i < max; i++) {
		list.push([x0, y0]);
		if ((x0 == x1) && (y0 == y1)) break;
		var e2 = 2 * err;
		if (e2 > -dy) {
			err -= dy;
			x0 += sx;
		}
		if (e2 < dx) {
			err += dx;
			y0 += sy;
		}
	}
	return list;
}

function byId(a) {
	return document.getElementById(a);
}

function getDate() {
	return Date.now();
}

var keydownTable = {};
function keydownTableDown(e) {
	var key = e.key;
	if(!key) return;
	keydownTable[key] = 1;
}
function keydownTableUp(e) {
	var key = e.key;
	if(!key) return;
	if(keydownTable[key]) {
		delete keydownTable[key]
	}
}
document.addEventListener("keydown", keydownTableDown);
document.addEventListener("keyup", keydownTableUp);

// Element references
var elm = {};
function defineElements(list) {
	for(var el in list) {
		elm[el] = list[el];
	}
}

var keyCodeTbl = {
	"BACKSPACE":8, "TAB":9, "ENTER":13, "SHIFTRIGHT":16, "CONTROLLEFT":17, "CAPSLOCK":20, "ESCAPE":27, 
	"SPACE":32, "PAGEUP":33, "PAGEDOWN":34, "END":35, "HOME":36, "ARROWLEFT":37, "ARROWUP":38, "ARROWRIGHT":39, 
	"ARROWDOWN":40, "DELETE":46, "DIGIT0":48, "DIGIT1":49, "DIGIT2":50, "DIGIT3":51, "DIGIT4":52, "DIGIT5":53, 
	"DIGIT6":54, "DIGIT7":55, "DIGIT8":56, "DIGIT9":57, "KEYA":65, "KEYB":66, "KEYC":67, "KEYD":68, "KEYE":69, 
	"KEYF":70, "KEYG":71, "KEYH":72, "KEYI":73, "KEYJ":74, "KEYK":75, "KEYL":76, "KEYM":77, "KEYN":78, "KEYO":79, 
	"KEYP":80, "KEYQ":81, "KEYR":82, "KEYS":83, "KEYT":84, "KEYU":85, "KEYV":86, "KEYW":87, "KEYX":88, "KEYY":89, 
	"KEYZ":90, "CONTEXTMENU":93, "NUMPAD0":96, "NUMPAD1":97, "NUMPAD2":98, "NUMPAD3":99, "NUMPAD4":100, 
	"NUMPAD5":101, "NUMPAD6":102, "NUMPAD7":103, "NUMPAD8":104, "NUMPAD9":105, "NUMPADMULTIPLY":106, 
	"NUMPADADD":107, "NUMPADSUBTRACT":109, "NUMPADDECIMAL":110, "NUMPADDIVIDE":111, "F1":112, "F2":113, 
	"F3":114, "F4":115, "F5":116, "F6":117, "F7":118, "F8":119, "F9":120, "F10":121, "F11":122, "F12":123,
	"SEMICOLON":186, "COMMA":188, "MINUS":189, "PERIOD":190, "SLASH":191, "BACKQUOTE":192, "BRACKETLEFT":219,
	"BACKSLASH":220, "BRACKETRIGHT":221, "QUOTE":222
};

function getKeyCode(e) {
	if(e.keyCode != void 0) return e.keyCode;
	if(e.which != void 0) return e.which;
	if(e.code != void 0) return keyCodeTbl[e.code.toUpperCase()];
	return 0;
}

function escapeQuote(text) { // escapes " and ' and \
	return text.replace(/\\/g, "\\\\").replace(/\"/g, "\\\"").replace(/\'/g, "\\'");
}

function escapeURLQuote(url) {
	try {
		var decode = decodeURIComponent(url);
	} catch(e) {
		return "";
	}
	return encodeURIComponent(escapeQuote(decode));
}

function html_tag_esc(str, non_breaking_space, newline_br) {
	str += "";
	str = str.replace(/\&/g, "&amp;");
	str = str.replace(/\</g, "&lt;");
	str = str.replace(/\>/g, "&gt;");
	str = str.replace(/\0/g, " ");
	if(newline_br) {
		str = str.replace(/\r\n/g, "<br>");
		str = str.replace(/\n/g, "<br>");
		str = str.replace(/\r/g, "<br>");
	} else {
		str = str.replace(/\r/g, " ");
		str = str.replace(/\n/g, " ");
	}
	str = str.replace(/\"/g, "&quot;");
	str = str.replace(/\'/g, "&#39;");
	str = str.replace(/\`/g, "&#96;");
	str = str.replace(/\//g, "&#x2F;");
	str = str.replace(/\\/g, "&#x5C;");
	str = str.replace(/\=/g, "&#61;");
	if(non_breaking_space) str = str.replace(/\u0020/g, "&nbsp;");
	if(str.indexOf(">") > -1 || str.indexOf("<") > -1) return "";
	return str;
}

function convertToDate(epoch) {
	var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	var str = "";
	var date = new Date(epoch);
	var month = date.getMonth();
	var day = date.getDate();
	var year = date.getFullYear();
	var hour = date.getHours();
	var minute = date.getMinutes();
	str += year + " " + months[month] + " " + day + " ";
	var per = "AM";
	if(hour >= 12) {
		per = "PM";
	}
	if(hour > 12) {
		hour = hour - 12;
	}
	if(hour == 0) {
		hour = 12;
	}
	str += hour + ":" + ("0" + minute).slice(-2) + " " + per;
	return str;
}

if (!Math.trunc) {
	Math.trunc = function(v) {
		v = +v;
		return (v - v % 1) || (!isFinite(v) || v === 0 ? v : v < 0 ? -0 : 0);
	}
}

if (typeof Object.assign != "function") {
	Object.defineProperty(Object, "assign", {
		value: function assign(target, varArgs) {
			"use strict";
			if (target == null) {
				throw new TypeError("Cannot convert undefined or null to object");
			}
			var to = Object(target);
			for (var index = 1; index < arguments.length; index++) {
				var nextSource = arguments[index];
				if (nextSource != null) {
					for (var nextKey in nextSource) {
						if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
							to[nextKey] = nextSource[nextKey];
						}
					}
				}
			}
			return to;
		},
		writable: true,
		configurable: true
	});
}

if(!Array.prototype.fill) {
	Array.prototype.fill = function(val) {
		var ar = this;
		for(var i = 0; i < ar.length; i++) {
			ar[i] = val;
		}
		return ar;
	}
}

if (!String.prototype.startsWith) {
	String.prototype.startsWith = function(search, pos) {
		return this.substr(!pos || pos < 0 ? 0 : +pos, search.length) === search;
	}
}

function ReconnectingWebSocket(url) {
	this.binaryType = "blob";
	this.onopen = null;
	this.onclose = null;
	this.onmessage = null;
	this.onerror = null;
	var closed = false;
	var self = this;
	function connect() {
		self.socket = new WebSocket(url);
		self.socket.onclose = function(r) {
			if(self.onclose) self.onclose(r);
			if(closed) return;
			setTimeout(connect, 1000);
		}
		self.socket.onopen = function(e) {
			self.socket.binaryType = self.binaryType;
			if(self.onopen) self.onopen(e);
		}
		self.socket.onmessage = function(m) {
			if(self.onmessage) self.onmessage(m);
		}
		self.socket.onerror = function(m) {
			if(self.onerror) self.onerror(m);
		}
	}
	connect();
	this.send = function(data) {
		this.socket.send(data);
	}
	this.close = function() {
		closed = true;
		this.socket.close();
	}
	this.refresh = function() {
		this.socket.close();
	}
	return this;
}

// split a mixed string with surrogates and combining characters
function advancedSplit(str, noSurrog, noComb, norm) {
	if(str && str.constructor == Array) return str;
	var chars = [];
	var buffer = "";
	var surrogMode = false;
	var charMode = false;
	for(var i = 0; i < str.length; i++) {
		var char = str[i];
		var code = char.charCodeAt();
		if(code >= 0xDC00 && code <= 0xDFFF) {
			if(surrogMode) {
				buffer += char;
			} else {
				buffer = "";
				chars.push("?");
			}
			surrogMode = false;
			continue;
		} else if(surrogMode) {
			buffer = "";
			chars.push("?");
			surrogMode = false;
			continue;
		}
		if(!noSurrog && code >= 0xD800 && code <= 0xDBFF) {
			if(charMode) {
				chars.push(buffer);
			}
			charMode = true;
			surrogMode = true;
			buffer = char;
			continue;
		}
		if(!norm && ((code >= 0x0300 && code <= 0x036F) ||
		  (code >= 0x1DC0 && code <= 0x1DFF) ||
		  (code >= 0x20D0 && code <= 0x20FF) ||
		  (code >= 0xFE20 && code <= 0xFE2F))) {
			if(!noComb && charMode) buffer += char;
			continue;
		} else {
			if(charMode) {
				chars.push(buffer);
			}
			charMode = true;
			buffer = char;
		}
	}
	if(buffer) {
		chars.push(buffer);
	}
	return chars;
}

var w = {
	loadScript: function(url, callback) {
		var script = document.createElement("script");
		if(callback === true) {
			// synchronous
			ajaxRequest({
				type: "GET",
				url: url,
				async: true,
				done: function(e) {
					script.innerText = e;
					document.head.appendChild(script);
				}
			});
		} else {
			script.src = url;
			document.head.appendChild(script);
			script.onload = callback;
		}
	},
	clipboard: {
		textarea: null,
		init: function() {
			var area = document.createElement("textarea");
			area.value = ""
			area.style.width = "1px";
			area.style.height = "1px";
			area.style.position = "absolute";
			area.style.left = "-1000px";
			document.body.appendChild(area);
			w.clipboard.textarea = area;
		},
		copy: function(string) {
			w.clipboard.textarea.value = string;
			w.clipboard.textarea.select();
			document.execCommand("copy");
			w.clipboard.textarea.value = "";
		}
	},
	events: {},
	on: function(type, call) {
		if(typeof call != "function") {
			throw "Callback is not a function";
		}
		type = type.toLowerCase();
		if(!OWOT.events[type]) {
			OWOT.events[type] = [];
		}
		OWOT.events[type].push(call);
	},
	off: function(type, call) {
		type = type.toLowerCase();
		if(!OWOT.events[type]) return;
		while(true) {
			var idx = OWOT.events[type].indexOf(call);
			if(idx == -1) break;
			OWOT.events[type].splice(idx, 1);
		}
	},
	emit: function(type, data) {
		type = type.toLowerCase();
		var evt = OWOT.events[type];
		if(!evt) return;
		for(var e = 0; e < evt.length; e++) {
			var func = evt[e];
			func(data);
		}
	},
	listening: function(type) {
		type = type.toLowerCase();
		return !!OWOT.events[type];
	},
	split: advancedSplit
};

var OWOT = w;
w.clipboard.init();
