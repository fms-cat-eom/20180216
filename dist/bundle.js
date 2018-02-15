(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/Yutaka/Dropbox/pro/_Projects/_eom/20180216/src/script/cube.js":[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var pos = [];
var nor = [];

var _loop = function _loop(i) {
  var p = [[-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, -1, 1], [1, 1, 1], [-1, 1, 1]];
  var n = [[0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, 1]];

  if (i !== 0) {
    var func = function func(v) {
      if (i < 4) {
        var t = i * Math.PI / 2.0;
        var x = v[0];
        var z = v[2];
        v[0] = Math.cos(t) * x - Math.sin(t) * z;
        v[2] = Math.sin(t) * x + Math.cos(t) * z;
      } else {
        var _t = (i - 0.5) * Math.PI;
        var y = v[1];
        var _z = v[2];
        v[1] = Math.cos(_t) * y - Math.sin(_t) * _z;
        v[2] = Math.sin(_t) * y + Math.cos(_t) * _z;
      }
    };

    p.map(func);
    n.map(func);
  }

  p.map(function (v) {
    return pos.push.apply(pos, _toConsumableArray(v));
  });
  n.map(function (v) {
    return nor.push.apply(nor, _toConsumableArray(v));
  });
};

for (var i = 0; i < 6; i++) {
  _loop(i);
}

exports.default = {
  pos: pos,
  nor: nor
};

},{}],"/Users/Yutaka/Dropbox/pro/_Projects/_eom/20180216/src/script/libs/glcat-path-gui.js":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _glcatPath = require('./glcat-path');

var _glcatPath2 = _interopRequireDefault(_glcatPath);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }



var requiredFields = function requiredFields(object, nanithefuck, fields) {
  fields.map(function (field) {
    if (typeof object[field] === "undefined") {
      throw "GLCat-Path: " + field + " is required for " + nanithefuck;
    }
  });
};

var PathGUI = function (_Path) {
  _inherits(PathGUI, _Path);

  function PathGUI(glCat, params) {
    _classCallCheck(this, PathGUI);

    var _this = _possibleConstructorReturn(this, (PathGUI.__proto__ || Object.getPrototypeOf(PathGUI)).call(this, glCat, params));

    var it = _this;

    requiredFields(params, "params", ["canvas", "el"]);

    it.gui = { parent: it.params.el };

    it.gui.info = document.createElement("span");
    it.gui.parent.appendChild(it.gui.info);

    it.gui.range = document.createElement("input");
    it.gui.range.type = "range";
    it.gui.range.min = 0;
    it.gui.range.max = 0;
    it.gui.range.step = 1;
    it.gui.parent.appendChild(it.gui.range);

    it.dateList = new Array(30).fill(0);
    it.dateListIndex = 0;
    it.totalFrames = 0;
    it.fps = 0;
    it.currentIndex = 0;
    it.viewName = "";
    it.viewIndex = 0;

    var gl = glCat.gl;
    var vboQuad = glCat.createVertexbuffer([-1, -1, 1, -1, -1, 1, 1, 1]);
    it.add({
      __PathGuiReturn: {
        width: it.params.canvas.width,
        height: it.params.canvas.height,
        vert: "attribute vec2 p;void main(){gl_Position=vec4(p,0,1);}",
        frag: "precision highp float;uniform vec2 r;uniform sampler2D s;void main(){gl_FragColor=texture2D(s,gl_FragCoord.xy/r);}",
        blend: [gl.ONE, gl.ONE],
        clear: [0.0, 0.0, 0.0, 1.0],
        func: function func(_p, params) {
          gl.viewport(0, 0, it.params.canvas.width, it.params.canvas.height);
          glCat.uniform2fv('r', [it.params.canvas.width, it.params.canvas.height]);

          glCat.attribute('p', vboQuad, 2);
          glCat.uniformTexture('s', params.input, 0);
          gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        }
      }
    });
    return _this;
  }

  _createClass(PathGUI, [{
    key: 'begin',
    value: function begin() {
      var it = this;

      it.currentIndex = 0;
    }
  }, {
    key: 'end',
    value: function end() {
      var it = this;

      it.gui.range.max = Math.max(it.gui.range.max, it.currentIndex);
      it.currentIndex = 0;

      var now = +new Date() * 1E-3;
      it.dateList[it.dateListIndex] = now;
      it.dateListIndex = (it.dateListIndex + 1) % it.dateList.length;
      it.fps = ((it.dateList.length - 1) / (now - it.dateList[it.dateListIndex])).toFixed(1);

      it.totalFrames++;

      it.gui.info.innerText = "Path: " + it.viewName + " (" + it.viewIndex + ")\n" + it.fps + " FPS\n" + it.totalFrames + " frames\n";
    }
  }, {
    key: 'render',
    value: function render(name, params) {
      var it = this;

      it.currentIndex++;
      var view = parseInt(it.gui.range.value);

      if (it.currentIndex <= view || view === 0) {
        it.viewName = view === 0 ? "*Full*" : name;
        it.viewIndex = it.currentIndex;

        _get(PathGUI.prototype.__proto__ || Object.getPrototypeOf(PathGUI.prototype), 'render', this).call(this, name, params);

        if (it.currentIndex === view) {
          var t = params && params.target ? params.target : it.paths[name].framebuffer;

          if (t && t.framebuffer) {
            var i = t.textures ? t.textures[0] : t.texture;
            if (it.params.stretch) {
              _get(PathGUI.prototype.__proto__ || Object.getPrototypeOf(PathGUI.prototype), 'render', this).call(this, "__PathGuiReturn", {
                target: PathGUI.nullFb,
                input: i,
                width: it.params.canvas.width,
                height: it.params.canvas.height
              });
            } else {
              it.params.canvas.width = (params ? params.width : 0) || it.paths[name].width || it.params.width;
              it.params.canvas.height = (params ? params.height : 0) || it.paths[name].height || it.params.height;
              _get(PathGUI.prototype.__proto__ || Object.getPrototypeOf(PathGUI.prototype), 'render', this).call(this, "__PathGuiReturn", {
                target: PathGUI.nullFb,
                input: i
              });
            }
          }
        }
      }
    }
  }]);

  return PathGUI;
}(_glcatPath2.default);

exports.default = PathGUI;

},{"./glcat-path":"/Users/Yutaka/Dropbox/pro/_Projects/_eom/20180216/src/script/libs/glcat-path.js"}],"/Users/Yutaka/Dropbox/pro/_Projects/_eom/20180216/src/script/libs/glcat-path.js":[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }



var requiredFields = function requiredFields(object, nanithefuck, fields) {
  fields.map(function (field) {
    if (typeof object[field] === "undefined") {
      throw "GLCat-Path: " + field + " is required for " + nanithefuck;
    }
  });
};

var Path = function () {
  function Path(glCat, params) {
    _classCallCheck(this, Path);

    var it = this;

    it.glCat = glCat;
    it.gl = glCat.gl;

    it.paths = {};
    it.globalFunc = function () {};
    it.params = params || {};
  }

  _createClass(Path, [{
    key: "add",
    value: function add(paths) {
      var it = this;

      for (var name in paths) {
        var path = paths[name];
        requiredFields(path, "path object", ["width", "height", "vert", "frag"]);
        it.paths[name] = path;

        if (typeof path.depthTest === "undefined") {
          path.depthTest = true;
        }
        if (typeof path.blend === "undefined") {
          path.blend = [it.gl.SRC_ALPHA, it.gl.ONE_MINUS_SRC_ALPHA];
        }
        if (typeof path.cull === "undefined") {
          path.cull = true;
        }

        if (path.framebuffer) {
          if (path.drawbuffers) {
            path.framebuffer = it.glCat.createDrawBuffers(path.width, path.height, path.drawbuffers);
          } else if (path.float) {
            path.framebuffer = it.glCat.createFloatFramebuffer(path.width, path.height);
          } else {
            path.framebuffer = it.glCat.createFramebuffer(path.width, path.height);
          }
        }

        path.program = it.glCat.createProgram(path.vert, path.frag);
      }
    }
  }, {
    key: "render",
    value: function render(name, params) {
      var _it$gl;

      var it = this;

      var path = it.paths[name];
      if (!path) {
        throw "GLCat-Path: The path called " + name + " is not defined!";
      }

      if (!params) {
        params = {};
      }
      params.framebuffer = typeof params.target !== "undefined" ? params.target.framebuffer : path.framebuffer ? path.framebuffer.framebuffer : null;

      var width = params.width || path.width;
      var height = params.height || path.height;

      it.gl.viewport(0, 0, width, height);
      it.glCat.useProgram(path.program);
      path.cull ? it.gl.enable(it.gl.CULL_FACE) : it.gl.disable(it.gl.CULL_FACE);
      it.gl.bindFramebuffer(it.gl.FRAMEBUFFER, params.framebuffer);
      if (it.params.drawbuffers) {
        it.glCat.drawBuffers(path.drawbuffers ? path.drawbuffers : params.framebuffer === null ? [it.gl.BACK] : [it.gl.COLOR_ATTACHMENT0]);
      }
      (_it$gl = it.gl).blendFunc.apply(_it$gl, _toConsumableArray(path.blend));
      if (path.clear) {
        var _it$glCat;

        (_it$glCat = it.glCat).clear.apply(_it$glCat, _toConsumableArray(path.clear));
      }
      path.depthTest ? it.gl.enable(it.gl.DEPTH_TEST) : it.gl.disable(it.gl.DEPTH_TEST);

      it.glCat.uniform2fv('resolution', [width, height]);
      it.globalFunc(path, params);

      if (path.func) {
        path.func(path, params);
      }
    }
  }, {
    key: "resize",
    value: function resize(name, width, height) {
      var it = this;

      var path = it.paths[name];

      path.width = width;
      path.height = height;

      if (path.framebuffer) {
        if (it.params.drawbuffers && path.drawbuffers) {
          path.framebuffer = it.glCat.createDrawBuffers(path.width, path.height, path.drawbuffers);
        } else if (path.float) {
          it.glCat.resizeFloatFramebuffer(path.framebuffer, path.width, path.height);
        } else {
          it.glCat.resizeFramebuffer(path.framebuffer, path.width, path.height);
        }
      }

      if (typeof path.onresize === "function") {
        path.onresize(path, width, height);
      }
    }
  }, {
    key: "setGlobalFunc",
    value: function setGlobalFunc(func) {
      this.globalFunc = func;
    }
  }, {
    key: "fb",
    value: function fb(name) {
      if (!this.paths[name]) {
        throw "glcat-path.fb: path called " + name + " is not defined";
      }
      if (!this.paths[name].framebuffer) {
        throw "glcat-path.fb: there is no framebuffer for the path " + name;
      }

      return this.paths[name].framebuffer;
    }
  }]);

  return Path;
}();

Path.nullFb = { framebuffer: null };

exports.default = Path;

},{}],"/Users/Yutaka/Dropbox/pro/_Projects/_eom/20180216/src/script/libs/glcat.js":[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GLCat = function () {
	function GLCat(_gl) {
		_classCallCheck(this, GLCat);

		var it = this;

		it.gl = _gl;
		var gl = it.gl;

		gl.enable(gl.DEPTH_TEST);
		gl.depthFunc(gl.LEQUAL);
		gl.enable(gl.BLEND);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

		it.extensions = {};

		it.currentProgram = null;
	}

	_createClass(GLCat, [{
		key: "getExtension",
		value: function getExtension(_name, _throw) {
			var it = this;
			var gl = it.gl;

			if ((typeof _name === "undefined" ? "undefined" : _typeof(_name)) === "object" && _name.isArray()) {
				return _name.every(function (name) {
					return it.getExtension(name, _throw);
				});
			} else if (typeof _name === "string") {
				if (it.extensions[_name]) {
					return it.extensions[_name];
				} else {
					it.extensions[_name] = gl.getExtension(_name);
					if (it.extensions[_name]) {
						return it.extensions[_name];
					} else {
						if (_throw) {
							throw console.error("The extension \"" + _name + "\" is not supported");
						}
						return false;
					}
				}
				return !!it.extensions[_name];
			} else {
				throw "GLCat.getExtension: _name must be string or array";
			}
		}
	}, {
		key: "createProgram",
		value: function createProgram(_vert, _frag, _onError) {
			var it = this;
			var gl = it.gl;

			var error = void 0;
			if (typeof _onError === 'function') {
				error = _onError;
			} else {
				error = function error(_str) {
					console.error(_str);
				};
			}

			var vert = gl.createShader(gl.VERTEX_SHADER);
			gl.shaderSource(vert, _vert);
			gl.compileShader(vert);
			if (!gl.getShaderParameter(vert, gl.COMPILE_STATUS)) {
				error(gl.getShaderInfoLog(vert));
				return null;
			}

			var frag = gl.createShader(gl.FRAGMENT_SHADER);
			gl.shaderSource(frag, _frag);
			gl.compileShader(frag);
			if (!gl.getShaderParameter(frag, gl.COMPILE_STATUS)) {
				error(gl.getShaderInfoLog(frag));
				return null;
			}

			var program = gl.createProgram();
			gl.attachShader(program, vert);
			gl.attachShader(program, frag);
			gl.linkProgram(program);
			if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
				program.locations = {};
				return program;
			} else {
				error(gl.getProgramInfoLog(program));
				return null;
			}
		}
	}, {
		key: "useProgram",
		value: function useProgram(_program) {
			var it = this;
			var gl = it.gl;

			gl.useProgram(_program);
			it.currentProgram = _program;
		}
	}, {
		key: "createVertexbuffer",
		value: function createVertexbuffer(_array) {
			var it = this;
			var gl = it.gl;

			var buffer = gl.createBuffer();

			if (_array) {
				it.setVertexbuffer(buffer, _array);
			}

			return buffer;
		}
	}, {
		key: "setVertexbuffer",
		value: function setVertexbuffer(_buffer, _array, _mode) {
			var it = this;
			var gl = it.gl;

			var mode = _mode || gl.STATIC_DRAW;

			gl.bindBuffer(gl.ARRAY_BUFFER, _buffer);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(_array), mode);
			gl.bindBuffer(gl.ARRAY_BUFFER, null);

			_buffer.length = _array.length;
		}
	}, {
		key: "createIndexbuffer",
		value: function createIndexbuffer(_array) {
			var it = this;
			var gl = it.gl;

			var buffer = gl.createBuffer();

			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
			gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Int16Array(_array), gl.STATIC_DRAW);
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

			buffer.length = _array.length;
			return buffer;
		}
	}, {
		key: "getAttribLocation",
		value: function getAttribLocation(_name) {
			var it = this;
			var gl = it.gl;

			var location = void 0;
			if (it.currentProgram.locations[_name]) {
				location = it.currentProgram.locations[_name];
			} else {
				location = gl.getAttribLocation(it.currentProgram, _name);
				it.currentProgram.locations[_name] = location;
			}

			return location;
		}
	}, {
		key: "attribute",
		value: function attribute(_name, _buffer, _stride, _div) {
			var it = this;
			var gl = it.gl;

			if (_div) {
				it.getExtension("ANGLE_instanced_arrays", true);
			}

			var location = it.getAttribLocation(_name);

			gl.bindBuffer(gl.ARRAY_BUFFER, _buffer);
			gl.enableVertexAttribArray(location);
			gl.vertexAttribPointer(location, _stride, gl.FLOAT, false, 0, 0);

			var ext = it.getExtension("ANGLE_instanced_arrays");
			if (ext) {
				var div = _div || 0;
				ext.vertexAttribDivisorANGLE(location, div);
			}

			gl.bindBuffer(gl.ARRAY_BUFFER, null);
		}
	}, {
		key: "getUniformLocation",
		value: function getUniformLocation(_name) {
			var it = this;
			var gl = it.gl;

			var location = void 0;

			if (typeof it.currentProgram.locations[_name] !== "undefined") {
				location = it.currentProgram.locations[_name];
			} else {
				location = gl.getUniformLocation(it.currentProgram, _name);
				it.currentProgram.locations[_name] = location;
			}

			return location;
		}
	}, {
		key: "uniform1i",
		value: function uniform1i(_name, _value) {
			var it = this;
			var gl = it.gl;

			var location = it.getUniformLocation(_name);
			gl.uniform1i(location, _value);
		}
	}, {
		key: "uniform1f",
		value: function uniform1f(_name, _value) {
			var it = this;
			var gl = it.gl;

			var location = it.getUniformLocation(_name);
			gl.uniform1f(location, _value);
		}
	}, {
		key: "uniform2fv",
		value: function uniform2fv(_name, _value) {
			var it = this;
			var gl = it.gl;

			var location = it.getUniformLocation(_name);
			gl.uniform2fv(location, _value);
		}
	}, {
		key: "uniform3fv",
		value: function uniform3fv(_name, _value) {
			var it = this;
			var gl = it.gl;

			var location = it.getUniformLocation(_name);
			gl.uniform3fv(location, _value);
		}
	}, {
		key: "uniform4fv",
		value: function uniform4fv(_name, _value) {
			var it = this;
			var gl = it.gl;

			var location = it.getUniformLocation(_name);
			gl.uniform4fv(location, _value);
		}
	}, {
		key: "uniformMatrix4fv",
		value: function uniformMatrix4fv(_name, _value, _transpose) {
			var it = this;
			var gl = it.gl;

			var location = it.getUniformLocation(_name);
			gl.uniformMatrix4fv(location, _transpose || false, _value);
		}
	}, {
		key: "uniformCubemap",
		value: function uniformCubemap(_name, _texture, _number) {
			var it = this;
			var gl = it.gl;

			var location = it.getUniformLocation(_name);
			gl.activeTexture(gl.TEXTURE0 + _number);
			gl.bindTexture(gl.TEXTURE_CUBE_MAP, _texture);
			gl.uniform1i(location, _number);
		}
	}, {
		key: "uniformTexture",
		value: function uniformTexture(_name, _texture, _number) {
			var it = this;
			var gl = it.gl;

			var location = it.getUniformLocation(_name);
			gl.activeTexture(gl.TEXTURE0 + _number);
			gl.bindTexture(gl.TEXTURE_2D, _texture);
			gl.uniform1i(location, _number);
		}
	}, {
		key: "createTexture",
		value: function createTexture() {
			var it = this;
			var gl = it.gl;

			var texture = gl.createTexture();
			gl.bindTexture(gl.TEXTURE_2D, texture);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
			gl.bindTexture(gl.TEXTURE_2D, null);

			return texture;
		}
	}, {
		key: "textureFilter",
		value: function textureFilter(_texture, _filter) {
			var it = this;
			var gl = it.gl;

			gl.bindTexture(gl.TEXTURE_2D, _texture);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, _filter);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, _filter);
			gl.bindTexture(gl.TEXTURE_2D, null);
		}
	}, {
		key: "textureWrap",
		value: function textureWrap(_texture, _wrap) {
			var it = this;
			var gl = it.gl;

			gl.bindTexture(gl.TEXTURE_2D, _texture);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, _wrap);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, _wrap);
			gl.bindTexture(gl.TEXTURE_2D, null);
		}
	}, {
		key: "setTexture",
		value: function setTexture(_texture, _image) {
			var it = this;
			var gl = it.gl;

			gl.bindTexture(gl.TEXTURE_2D, _texture);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, _image);
			gl.bindTexture(gl.TEXTURE_2D, null);
		}
	}, {
		key: "setTextureFromArray",
		value: function setTextureFromArray(_texture, _width, _height, _array) {
			var it = this;
			var gl = it.gl;

			gl.bindTexture(gl.TEXTURE_2D, _texture);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, _width, _height, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(_array));
			gl.bindTexture(gl.TEXTURE_2D, null);
		}
	}, {
		key: "setTextureFromFloatArray",
		value: function setTextureFromFloatArray(_texture, _width, _height, _array) {
			var it = this;
			var gl = it.gl;

			it.getExtension("OES_texture_float", true);

			gl.bindTexture(gl.TEXTURE_2D, _texture);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, _width, _height, 0, gl.RGBA, gl.FLOAT, new Float32Array(_array));
			if (!it.getExtension("OES_texture_float_linear")) {
				it.textureFilter(_texture, gl.NEAREST);
			}
			gl.bindTexture(gl.TEXTURE_2D, null);
		}
	}, {
		key: "copyTexture",
		value: function copyTexture(_texture, _width, _height) {
			var it = this;
			var gl = it.gl;

			gl.bindTexture(gl.TEXTURE_2D, _texture);
			gl.copyTexImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 0, 0, _width, _height, 0);
			gl.bindTexture(gl.TEXTURE_2D, null);
		}
	}, {
		key: "createCubemap",
		value: function createCubemap(_arrayOfImage) {
			var it = this;
			var gl = it.gl;

			// order : X+, X-, Y+, Y-, Z+, Z-
			var texture = gl.createTexture();

			gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
			for (var i = 0; i < 6; i++) {
				gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, _arrayOfImage[i]);
			}
			gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
			gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);

			return texture;
		}
	}, {
		key: "createFramebuffer",
		value: function createFramebuffer(_width, _height) {
			var it = this;
			var gl = it.gl;

			var framebuffer = {};
			framebuffer.framebuffer = gl.createFramebuffer();
			gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer.framebuffer);

			framebuffer.depth = gl.createRenderbuffer();
			gl.bindRenderbuffer(gl.RENDERBUFFER, framebuffer.depth);
			gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, _width, _height);
			gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, framebuffer.depth);

			framebuffer.texture = it.createTexture();
			gl.bindTexture(gl.TEXTURE_2D, framebuffer.texture);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, _width, _height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
			gl.bindTexture(gl.TEXTURE_2D, null);

			gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, framebuffer.texture, 0);
			gl.bindFramebuffer(gl.FRAMEBUFFER, null);

			return framebuffer;
		}
	}, {
		key: "resizeFramebuffer",
		value: function resizeFramebuffer(_framebuffer, _width, _height) {
			var it = this;
			var gl = it.gl;

			gl.bindFramebuffer(gl.FRAMEBUFFER, _framebuffer.framebuffer);

			gl.bindRenderbuffer(gl.RENDERBUFFER, _framebuffer.depth);
			gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, _width, _height);
			gl.bindRenderbuffer(gl.RENDERBUFFER, null);

			gl.bindTexture(gl.TEXTURE_2D, _framebuffer.texture);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, _width, _height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
			gl.bindTexture(gl.TEXTURE_2D, null);

			gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		}
	}, {
		key: "createFloatFramebuffer",
		value: function createFloatFramebuffer(_width, _height) {
			var it = this;
			var gl = it.gl;

			it.getExtension("OES_texture_float", true);

			var framebuffer = {};
			framebuffer.framebuffer = gl.createFramebuffer();
			gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer.framebuffer);

			framebuffer.depth = gl.createRenderbuffer();
			gl.bindRenderbuffer(gl.RENDERBUFFER, framebuffer.depth);
			gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, _width, _height);
			gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, framebuffer.depth);

			framebuffer.texture = it.createTexture();
			gl.bindTexture(gl.TEXTURE_2D, framebuffer.texture);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, _width, _height, 0, gl.RGBA, gl.FLOAT, null);
			if (!it.getExtension("OES_texture_float_linear")) {
				it.textureFilter(framebuffer.texture, gl.NEAREST);
			}
			gl.bindTexture(gl.TEXTURE_2D, null);

			gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, framebuffer.texture, 0);
			gl.bindFramebuffer(gl.FRAMEBUFFER, null);

			return framebuffer;
		}
	}, {
		key: "resizeFloatFramebuffer",
		value: function resizeFloatFramebuffer(_framebuffer, _width, _height) {
			var it = this;
			var gl = it.gl;

			gl.bindFramebuffer(gl.FRAMEBUFFER, _framebuffer.framebuffer);

			gl.bindRenderbuffer(gl.RENDERBUFFER, _framebuffer.depth);
			gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, _width, _height);
			gl.bindRenderbuffer(gl.RENDERBUFFER, null);

			gl.bindTexture(gl.TEXTURE_2D, _framebuffer.texture);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, _width, _height, 0, gl.RGBA, gl.FLOAT, null);
			gl.bindTexture(gl.TEXTURE_2D, null);

			gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		}
	}, {
		key: "createDrawBuffers",
		value: function createDrawBuffers(_width, _height, _numDrawBuffers) {
			var it = this;
			var gl = it.gl;

			it.getExtension('OES_texture_float', true);
			var ext = it.getExtension('WEBGL_draw_buffers', true);

			if (ext.MAX_DRAW_BUFFERS_WEBGL < _numDrawBuffers) {
				throw "createDrawBuffers: MAX_DRAW_BUFFERS_WEBGL is " + ext.MAX_DRAW_BUFFERS_WEBGL;
			}

			var framebuffer = {};
			framebuffer.framebuffer = gl.createFramebuffer();
			gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer.framebuffer);

			framebuffer.depth = gl.createRenderbuffer();
			gl.bindRenderbuffer(gl.RENDERBUFFER, framebuffer.depth);
			gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, _width, _height);
			gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, framebuffer.depth);

			framebuffer.textures = [];
			for (var i = 0; i < _numDrawBuffers; i++) {
				framebuffer.textures[i] = it.createTexture();
				gl.bindTexture(gl.TEXTURE_2D, framebuffer.textures[i]);
				gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, _width, _height, 0, gl.RGBA, gl.FLOAT, null);
				if (!it.getExtension("OES_texture_float_linear")) {
					it.textureFilter(framebuffer.textures[i], gl.NEAREST);
				}
				gl.bindTexture(gl.TEXTURE_2D, null);

				gl.framebufferTexture2D(gl.FRAMEBUFFER, ext.COLOR_ATTACHMENT0_WEBGL + i, gl.TEXTURE_2D, framebuffer.textures[i], 0);
			}

			var status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
			if (status !== gl.FRAMEBUFFER_COMPLETE) {
				throw "createDrawBuffers: gl.checkFramebufferStatus( gl.FRAMEBUFFER ) returns " + status;
			}
			gl.bindFramebuffer(gl.FRAMEBUFFER, null);

			return framebuffer;
		}
	}, {
		key: "resizeDrawBuffers",
		value: function resizeDrawBuffers(_framebuffer, _width, height) {
			var it = this;
			var gl = it.gl;

			gl.bindFramebuffer(gl.FRAMEBUFFER, _framebuffer.framebuffer);

			gl.bindRenderbuffer(gl.RENDERBUFFER, _framebuffer.depth);
			gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, _width, _height);
			gl.bindRenderbuffer(gl.RENDERBUFFER, null);

			for (var i = 0; i < _framebuffer.textures.length; i++) {
				gl.bindTexture(gl.TEXTURE_2D, _framebuffer.textures[i]);
				gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, _width, _height, 0, gl.RGBA, gl.FLOAT, null);
				gl.bindTexture(gl.TEXTURE_2D, null);
			}

			gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		}
	}, {
		key: "drawBuffers",
		value: function drawBuffers(_numDrawBuffers) {
			var it = this;
			var gl = it.gl;

			var ext = it.getExtension("WEBGL_draw_buffers", true);

			var array = [];
			if (typeof _numDrawBuffers === "number") {
				for (var i = 0; i < _numDrawBuffers; i++) {
					array.push(ext.COLOR_ATTACHMENT0_WEBGL + i);
				}
			} else {
				array = array.concat(_numDrawBuffers);
			}
			ext.drawBuffersWEBGL(array);
		}
	}, {
		key: "clear",
		value: function clear(_r, _g, _b, _a, _d) {
			var it = this;
			var gl = it.gl;

			var r = _r || 0.0;
			var g = _g || 0.0;
			var b = _b || 0.0;
			var a = typeof _a === 'number' ? _a : 1.0;
			var d = typeof _d === 'number' ? _d : 1.0;

			gl.clearColor(r, g, b, a);
			gl.clearDepth(d);
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		}
	}]);

	return GLCat;
}();

exports.default = GLCat;

},{}],"/Users/Yutaka/Dropbox/pro/_Projects/_eom/20180216/src/script/libs/mathcat.js":[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
// にゃーん

var MathCat = {};

/**
 * adds a two vec
 * @param {array} a - vec
 * @param {array} b - vec
 */
MathCat.vecAdd = function (a, b) {
  return a.map(function (e, i) {
    return e + b[i];
  });
};

/**
 * substracts a vec from an another vec
 * @param {array} a - vec
 * @param {array} b - vec
 */
MathCat.vecSub = function (a, b) {
  return a.map(function (e, i) {
    return e - b[i];
  });
};

/**
 * returns a cross of two vec3s
 * @param {array} a - vec3
 * @param {array} b - vec3
 */
MathCat.vec3Cross = function (a, b) {
  return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
};

/**
 * scales a vec by scalar
 * @param {number} s - scalar
 * @param {array} v - vec
 */
MathCat.vecScale = function (s, v) {
  return v.map(function (e) {
    return e * s;
  });
};

/**
 * returns length of a vec
 * @param {array} v - vec
 */
MathCat.vecLength = function (v) {
  return Math.sqrt(v.reduce(function (p, c) {
    return p + c * c;
  }, 0.0));
};

/**
 * normalizes a vec
 * @param {array} v - vec
 */
MathCat.vecNormalize = function (v) {
  return MathCat.vecScale(1.0 / MathCat.vecLength(v), v);
};

/**
 * applies two mat4s
 * @param {array} a - mat4
 * @param {array} b - mat4
 */
MathCat.mat4Apply = function (a, b) {
  return [a[0] * b[0] + a[4] * b[1] + a[8] * b[2] + a[12] * b[3], a[1] * b[0] + a[5] * b[1] + a[9] * b[2] + a[13] * b[3], a[2] * b[0] + a[6] * b[1] + a[10] * b[2] + a[14] * b[3], a[3] * b[0] + a[7] * b[1] + a[11] * b[2] + a[15] * b[3], a[0] * b[4] + a[4] * b[5] + a[8] * b[6] + a[12] * b[7], a[1] * b[4] + a[5] * b[5] + a[9] * b[6] + a[13] * b[7], a[2] * b[4] + a[6] * b[5] + a[10] * b[6] + a[14] * b[7], a[3] * b[4] + a[7] * b[5] + a[11] * b[6] + a[15] * b[7], a[0] * b[8] + a[4] * b[9] + a[8] * b[10] + a[12] * b[11], a[1] * b[8] + a[5] * b[9] + a[9] * b[10] + a[13] * b[11], a[2] * b[8] + a[6] * b[9] + a[10] * b[10] + a[14] * b[11], a[3] * b[8] + a[7] * b[9] + a[11] * b[10] + a[15] * b[11], a[0] * b[12] + a[4] * b[13] + a[8] * b[14] + a[12] * b[15], a[1] * b[12] + a[5] * b[13] + a[9] * b[14] + a[13] * b[15], a[2] * b[12] + a[6] * b[13] + a[10] * b[14] + a[14] * b[15], a[3] * b[12] + a[7] * b[13] + a[11] * b[14] + a[15] * b[15]];
};

/**
 * transpose a mat4
 * @param {array} m - mat4
 */
MathCat.mat4Transpose = function (m) {
  return [m[0], m[4], m[8], m[12], m[1], m[5], m[9], m[13], m[2], m[6], m[10], m[14], m[3], m[7], m[11], m[15]];
};

/**
 * returns an indentity mat4
 */
MathCat.mat4Identity = function () {
  return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
};

MathCat.mat4Translate = function (v) {
  return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, v[0], v[1], v[2], 1];
};

MathCat.mat4Scale = function (v) {
  return [v[0], 0, 0, 0, 0, v[1], 0, 0, 0, 0, v[2], 0, 0, 0, 0, 1];
};

MathCat.mat4ScaleXYZ = function (s) {
  return [s, 0, 0, 0, 0, s, 0, 0, 0, 0, s, 0, 0, 0, 0, 1];
};

MathCat.mat4RotateX = function (t) {
  return [1, 0, 0, 0, 0, Math.cos(t), -Math.sin(t), 0, 0, Math.sin(t), Math.cos(t), 0, 0, 0, 0, 1];
};

MathCat.mat4RotateY = function (t) {
  return [Math.cos(t), 0, Math.sin(t), 0, 0, 1, 0, 0, -Math.sin(t), 0, Math.cos(t), 0, 0, 0, 0, 1];
};

MathCat.mat4RotateZ = function (t) {
  return [Math.cos(t), -Math.sin(t), 0, 0, Math.sin(t), Math.cos(t), 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
};

MathCat.mat4LookAt = function (pos, tar, air, rot) {
  var dir = MathCat.vecNormalize(MathCat.vecSub(tar, pos));
  var sid = MathCat.vecNormalize(MathCat.vec3Cross(dir, air));
  var top = MathCat.vec3Cross(sid, dir);
  sid = MathCat.vecAdd(MathCat.vecScale(Math.cos(rot), sid), MathCat.vecScale(Math.sin(rot), top));
  top = MathCat.vec3Cross(sid, dir);

  return [sid[0], top[0], dir[0], 0.0, sid[1], top[1], dir[1], 0.0, sid[2], top[2], dir[2], 0.0, -sid[0] * pos[0] - sid[1] * pos[1] - sid[2] * pos[2], -top[0] * pos[0] - top[1] * pos[1] - top[2] * pos[2], -dir[0] * pos[0] - dir[1] * pos[1] - dir[2] * pos[2], 1.0];
};

MathCat.mat4Perspective = function (fov, aspect, near, far) {
  var p = 1.0 / Math.tan(fov * Math.PI / 360.0);
  var d = far - near;
  return [p / aspect, 0.0, 0.0, 0.0, 0.0, p, 0.0, 0.0, 0.0, 0.0, (far + near) / d, 1.0, 0.0, 0.0, -2 * far * near / d, 0.0];
};

exports.default = MathCat;

},{}],"/Users/Yutaka/Dropbox/pro/_Projects/_eom/20180216/src/script/libs/tweak.js":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Tweak = function () {
  function Tweak(_el) {
    _classCallCheck(this, Tweak);

    var it = this;

    it.parent = _el;
    it.values = {};
    it.elements = {};
  }

  _createClass(Tweak, [{
    key: 'button',
    value: function button(_name, _props) {
      var it = this;

      var props = _props || {};

      if (typeof it.values[_name] === 'undefined') {
        var div = document.createElement('div');
        it.parent.appendChild(div);

        var input = document.createElement('input');
        div.appendChild(input);
        input.type = 'button';
        input.value = _name;

        input.addEventListener('click', function () {
          it.values[_name] = true;
        });

        it.elements[_name] = {
          div: div,
          input: input
        };
      }

      var tempvalue = it.values[_name];
      it.values[_name] = false;
      if (typeof props.set === 'boolean') {
        it.values[_name] = props.set;
      }

      return tempvalue;
    }
  }, {
    key: 'checkbox',
    value: function checkbox(_name, _props) {
      var it = this;

      var props = _props || {};

      var value = void 0;

      if (typeof it.values[_name] === 'undefined') {
        value = props.value || false;

        var div = document.createElement('div');
        it.parent.appendChild(div);

        var name = document.createElement('span');
        div.appendChild(name);
        name.innerText = _name;

        var input = document.createElement('input');
        div.appendChild(input);
        input.type = 'checkbox';
        input.checked = value;

        it.elements[_name] = {
          div: div,
          name: name,
          input: input
        };
      } else {
        value = it.elements[_name].input.checked;
      }

      if (typeof props.set === 'boolean') {
        value = props.set;
      }

      it.elements[_name].input.checked = value;
      it.values[_name] = value;

      return it.values[_name];
    }
  }, {
    key: 'range',
    value: function range(_name, _props) {
      var it = this;

      var props = _props || {};

      var value = void 0;

      if (typeof it.values[_name] === 'undefined') {
        var min = props.min || 0.0;
        var max = props.max || 1.0;
        var step = props.step || 0.001;
        value = props.value || min;

        var div = document.createElement('div');
        it.parent.appendChild(div);

        var name = document.createElement('span');
        div.appendChild(name);
        name.innerText = _name;

        var input = document.createElement('input');
        div.appendChild(input);
        input.type = 'range';
        input.value = value;
        input.min = min;
        input.max = max;
        input.step = step;

        var val = document.createElement('span');
        val.innerText = value.toFixed(3);
        div.appendChild(val);
        input.addEventListener('input', function (_event) {
          var value = parseFloat(input.value);
          val.innerText = value.toFixed(3);
        });

        it.elements[_name] = {
          div: div,
          name: name,
          input: input,
          val: val
        };
      } else {
        value = parseFloat(it.elements[_name].input.value);
      }

      if (typeof props.set === 'number') {
        value = props.set;
      }

      it.values[_name] = value;
      it.elements[_name].input.value = value;

      return it.values[_name];
    }
  }]);

  return Tweak;
}();

exports.default = Tweak;

},{}],"/Users/Yutaka/Dropbox/pro/_Projects/_eom/20180216/src/script/libs/xorshift.js":[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var seed = void 0;
var xorshift = function xorshift(_seed) {
  seed = _seed || seed || 1;
  seed = seed ^ seed << 13;
  seed = seed ^ seed >>> 17;
  seed = seed ^ seed << 5;
  return seed / Math.pow(2, 32) + 0.5;
};

exports.default = xorshift;

},{}],"/Users/Yutaka/Dropbox/pro/_Projects/_eom/20180216/src/script/main.js":[function(require,module,exports){
"use strict";

var _xorshift = require("./libs/xorshift");

var _xorshift2 = _interopRequireDefault(_xorshift);

var _tweak = require("./libs/tweak");

var _tweak2 = _interopRequireDefault(_tweak);

var _glcat = require("./libs/glcat");

var _glcat2 = _interopRequireDefault(_glcat);

var _glcatPathGui = require("./libs/glcat-path-gui");

var _glcatPathGui2 = _interopRequireDefault(_glcatPathGui);

var _mathcat = require("./libs/mathcat");

var _mathcat2 = _interopRequireDefault(_mathcat);

var _cube = require("./cube");

var _cube2 = _interopRequireDefault(_cube);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }



// ------

(0, _xorshift2.default)(326789157890);

// ------

var tweak = new _tweak2.default(divTweak);

// ------

var mouseX = 0.0;
var mouseY = 0.0;

canvas.addEventListener("mousemove", function (event) {
  mouseX = event.offsetX;
  mouseY = event.offsetY;
});

// ------

var clamp = function clamp(v, b, t) {
  return Math.min(Math.max(v, b), t);
};
var lerp = function lerp(a, b, x) {
  return a + (b - a) * x;
};
var saturate = function saturate(v) {
  return clamp(v, 0.0, 1.0);
};

// ------

var width = canvas.width = 360;
var height = canvas.height = 360;

var renderA = document.createElement("a");

var saveFrame = function saveFrame() {
  renderA.href = canvas.toDataURL();
  renderA.download = ("0000" + totalFrame).slice(-5) + ".png";
  renderA.click();
};

// ------

var totalFrame = 0;
var init = false;
var frames = 200;

var automaton = new Automaton({
  gui: divAutomaton,
  fps: frames,
  data: "\n  {\"v\":\"1.1.1\",\"length\":1,\"resolution\":1000,\"params\":{\"focus\":[{\"time\":0,\"value\":5.257099646677832,\"mode\":1,\"params\":{},\"mods\":[false,false,false,false]},{\"time\":1,\"value\":7.5,\"mode\":0,\"params\":{},\"mods\":[false,false,false,false]}],\"cameraPosY\":[{\"time\":0,\"value\":0,\"mode\":1,\"params\":{},\"mods\":[false,false,false,false]},{\"time\":1,\"value\":0,\"mode\":0,\"params\":{},\"mods\":[false,false,false,false]}],\"cameraRoll\":[{\"time\":0,\"value\":0,\"mode\":1,\"params\":{},\"mods\":[false,false,false,false]},{\"time\":1,\"value\":0,\"mode\":1,\"params\":{},\"mods\":[false,false,false,false]}],\"cameraTheta\":[{\"time\":0,\"value\":0,\"mode\":1,\"params\":{},\"mods\":[false,false,false,false]},{\"time\":0.11346153846153846,\"value\":0.35340270917539346,\"mode\":4,\"params\":{\"rate\":500,\"damp\":1},\"mods\":[false,false,false,false]},{\"time\":0.27307692307692305,\"value\":0.5985561220492128,\"mode\":4,\"params\":{\"rate\":500,\"damp\":1},\"mods\":[false,false,false,false]},{\"time\":0.4519230769230769,\"value\":0.8593103117094845,\"mode\":4,\"params\":{\"rate\":500,\"damp\":1},\"mods\":[false,false,false,false]},{\"time\":0.5903846153846154,\"value\":1.2285760782513069,\"mode\":4,\"params\":{\"rate\":500,\"damp\":1},\"mods\":[false,false,false,false]},{\"time\":0.7403846153846154,\"value\":1.4903358586455182,\"mode\":4,\"params\":{\"rate\":500,\"damp\":1},\"mods\":[false,false,false,false]},{\"time\":0.8461538461538461,\"value\":1.7253462854829902,\"mode\":4,\"params\":{\"rate\":500,\"damp\":1},\"mods\":[false,false,false,false]},{\"time\":1,\"value\":2.049166360759497,\"mode\":4,\"params\":{\"rate\":500,\"damp\":1},\"mods\":[false,false,false,false]}],\"cameraRadius\":[{\"time\":0,\"value\":5,\"mode\":1,\"params\":{},\"mods\":[false,false,false,false]},{\"time\":1,\"value\":1,\"mode\":0,\"params\":{},\"mods\":[false,false,false,false]}]},\"gui\":{\"snap\":{\"enable\":false,\"bpm\":120,\"offset\":0}}}\n"
});
var auto = automaton.auto;

// ------

var cameraPos = [0.0, 0.0, 8.0];
var cameraTar = [0.0, 0.0, 0.0];
var cameraRoll = 0.0;
var cameraFov = 90.0;

var cameraNear = 0.1;
var cameraFar = 100.0;

var lightPos = [10.0, 10.0, 10.0];

var matP = void 0;
var matV = void 0;
var matPL = void 0;
var matVL = void 0;

var updateMatrices = function updateMatrices() {
  var cameraTheta = auto("cameraTheta") * Math.PI * 2.0;
  var cameraRadius = auto("cameraRadius");
  cameraPos[0] = cameraRadius * Math.sin(cameraTheta);
  cameraPos[1] = auto("cameraPosY");
  cameraPos[2] = cameraRadius * Math.cos(cameraTheta);
  cameraRoll = auto("cameraRoll");

  lightPos[0] = 10.0 * Math.sin(cameraTheta + 1.0);
  lightPos[2] = 10.0 * Math.cos(cameraTheta + 1.0);

  matP = _mathcat2.default.mat4Perspective(cameraFov, width / height, cameraNear, cameraFar);
  matV = _mathcat2.default.mat4LookAt(cameraPos, cameraTar, [0.0, 1.0, 0.0], cameraRoll);

  matPL = _mathcat2.default.mat4Perspective(cameraFov, 1.0, cameraNear, cameraFar);
  matVL = _mathcat2.default.mat4LookAt(lightPos, cameraTar, [0.0, 1.0, 0.0], 0.0);
};
updateMatrices();

// ------

var gl = canvas.getContext("webgl");
gl.enable(gl.CULL_FACE);

var glCat = new _glcat2.default(gl);

glCat.getExtension("OES_texture_float", true);
glCat.getExtension("OES_texture_float_linear", true);
glCat.getExtension("EXT_frag_depth", true);
glCat.getExtension("WEBGL_draw_buffers", true);
glCat.getExtension("ANGLE_instanced_arrays", true);

var glCatPath = new _glcatPathGui2.default(glCat, {
  drawbuffers: true,
  el: divPath,
  canvas: canvas,
  stretch: true
});

// ------

var vboQuad = glCat.createVertexbuffer([-1, -1, 1, -1, -1, 1, 1, 1]);
var vboQuadUV = glCat.createVertexbuffer([0, 1, 1, 1, 0, 0, 1, 0]);
var vboQuad3 = glCat.createVertexbuffer([-1, -1, 0, 1, -1, 0, -1, 1, 0, 1, 1, 0]);
var vboQuad3Nor = glCat.createVertexbuffer([0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1]);

// ------

var vboCubePos = glCat.createVertexbuffer(_cube2.default.pos);
var vboCubeNor = glCat.createVertexbuffer(_cube2.default.nor);

// ------

var particlePixels = 3;
var particlesSqrt = 64;
var particles = particlesSqrt * particlesSqrt;
var vertsPerParticle = vboCubePos.length / 3;

var vboParticleUV = glCat.createVertexbuffer(function () {
  var ret = [];
  for (var i = 0; i < particles; i++) {
    var ix = i % particlesSqrt;
    var iy = Math.floor(i / particlesSqrt);

    ret.push(ix * particlePixels);
    ret.push(iy);
  }
  return ret;
}());

// ------

var terrainSize = 64;
var terrainVertices = terrainSize * terrainSize;

var terrainTriLength = (terrainSize - 1) * (terrainSize - 1) * 2;
var terrainUV = [];
var terrainTriIndex = [];

for (var iy = 0; iy < terrainSize - 1; iy++) {
  for (var ix = 0; ix < terrainSize - 1; ix++) {
    terrainUV.push((ix + 0.5) / terrainSize, (iy + 0.5) / terrainSize, (ix + 1.5) / terrainSize, (iy + 0.5) / terrainSize, (ix + 0.5) / terrainSize, (iy + 1.5) / terrainSize, (ix + 0.5) / terrainSize, (iy + 1.5) / terrainSize, (ix + 1.5) / terrainSize, (iy + 0.5) / terrainSize, (ix + 1.5) / terrainSize, (iy + 1.5) / terrainSize);

    var i = ix + iy * (terrainSize - 1);
    terrainTriIndex.push((i * 2 + 0.5) / terrainTriLength, (i * 2 + 0.5) / terrainTriLength, (i * 2 + 0.5) / terrainTriLength, (i * 2 + 1.5) / terrainTriLength, (i * 2 + 1.5) / terrainTriLength, (i * 2 + 1.5) / terrainTriLength);
  }
}

var vboTerrainUV = glCat.createVertexbuffer(terrainUV);
var vboTerrainTriIndex = glCat.createVertexbuffer(terrainTriIndex);

var textureTerrainUV = glCat.createTexture();
glCat.setTextureFromFloatArray(textureTerrainUV, 3, terrainTriLength, function () {
  var ret = new Float32Array(terrainTriLength * 3 * 4);
  for (var _i = 0; _i < terrainTriLength * 3; _i++) {
    ret[_i * 4] = terrainUV[_i * 2];
    ret[_i * 4 + 1] = terrainUV[_i * 2 + 1];
    ret[_i * 4 + 2] = 0.0;
    ret[_i * 4 + 3] = 1.0;
  }
  return ret;
}());

// ------

var textureDummy = glCat.createTexture();
glCat.setTextureFromArray(textureDummy, 1, 1, [1, 0, 1, 1]);

var textureRandomSize = 32;
var textureRandomUpdate = function textureRandomUpdate(_tex) {
  glCat.setTextureFromArray(_tex, textureRandomSize, textureRandomSize, function () {
    var len = textureRandomSize * textureRandomSize * 4;
    var ret = new Uint8Array(len);
    for (var _i2 = 0; _i2 < len; _i2++) {
      ret[_i2] = Math.floor((0, _xorshift2.default)() * 256.0);
    }
    return ret;
  }());
};

var textureRandomStatic = glCat.createTexture();
glCat.textureWrap(textureRandomStatic, gl.REPEAT);
textureRandomUpdate(textureRandomStatic);

var textureRandom = glCat.createTexture();
glCat.textureWrap(textureRandom, gl.REPEAT);

// ------

var framebuffersGauss = [glCat.createFloatFramebuffer(width / 4, height / 4), glCat.createFloatFramebuffer(width / 4, height / 4), glCat.createFloatFramebuffer(width / 4, height / 4)];

var framebufferPreDof = glCat.createFloatFramebuffer(width, height);

var framebufferMotionPrev = glCat.createFramebuffer(width, height);
var framebufferMotionMosh = glCat.createFramebuffer(width, height);

var shadowSize = 512;

// ------

var bgColor = [0.01, 0.01, 0.01, 1.0];

// ------

glCatPath.setGlobalFunc(function () {
  glCat.uniform1i("init", init);
  glCat.uniform1f("time", automaton.time);
  glCat.uniform1f("deltaTime", automaton.deltaTime);

  glCat.uniform1f("frame", automaton.frame);
  glCat.uniform1f("frames", frames);

  glCat.uniform2fv("mouse", [mouseX, mouseY]);

  glCat.uniform3fv("cameraPos", cameraPos);
  glCat.uniform3fv("cameraTar", cameraTar);
  glCat.uniform1f("cameraRoll", cameraRoll);
  glCat.uniform1f("cameraFov", cameraFov);
  glCat.uniform1f("cameraNear", cameraNear);
  glCat.uniform1f("cameraFar", cameraFar);
  glCat.uniform3fv("lightPos", lightPos);

  glCat.uniform1f("particlesSqrt", particlesSqrt);
  glCat.uniform1f("particlePixels", particlePixels);

  glCat.uniformMatrix4fv("matP", matP);
  glCat.uniformMatrix4fv("matV", matV);
  glCat.uniformMatrix4fv("matPL", matPL);
  glCat.uniformMatrix4fv("matVL", matVL);
  glCat.uniform4fv("bgColor", bgColor);
});

glCatPath.add({
  return: {
    width: width,
    height: height,
    vert: "#define GLSLIFY 1\nattribute vec2 p;\n\nvoid main() {\n  gl_Position = vec4( p, 0.0, 1.0 );\n}\n",
    frag: "precision highp float;\n#define GLSLIFY 1\n\nuniform vec2 resolution;\nuniform sampler2D sampler0;\n\nvoid main() {\n  vec2 uv = gl_FragCoord.xy / resolution;\n  gl_FragColor = texture2D( sampler0, uv );\n}\n",
    blend: [gl.ONE, gl.ZERO],
    clear: [0.0, 0.0, 0.0, 1.0],
    func: function func(path, params) {
      glCat.attribute("p", vboQuad, 2);
      glCat.uniformTexture("sampler0", params.input, 0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
  },

  inspector: {
    width: width,
    height: height,
    vert: "#define GLSLIFY 1\nattribute vec2 p;\n\nvoid main() {\n  gl_Position = vec4( p, 0.0, 1.0 );\n}\n",
    frag: "#define RADIUS 40.0\n\nprecision highp float;\n#define GLSLIFY 1\n\nuniform vec2 resolution;\nuniform vec2 mouse;\nuniform vec3 circleColor;\nuniform sampler2D sampler0;\n\nbool print( in vec2 _coord, float _in ) {\n  vec2 coord = _coord;\n\n  // vertical restriction\n  if ( coord.y <= 0.0 || 5.0 <= coord.y ) { return false; }\n  \n  // dot\n  if ( 0.0 < coord.x && coord.x < 2.0 ) {\n    return coord.x < 1.0 && coord.y < 1.0;\n  }\n\n  // padded by dot\n  if ( 2.0 < coord.x ) { coord.x -= 2.0; }\n  \n  // determine digit\n  float ci = floor( coord.x / 5.0 ) + 1.0;\n\n  // too low / too high\n  if ( 4.0 < ci ) { return false; }\n  if ( ci < -4.0 ) { return false; }\n\n  // x of char\n  float cfx = floor( mod( coord.x, 5.0 ) );\n\n  // width is 4\n  if ( 4.0 == cfx ) { return false; }\n\n  // y of char\n  float cfy = floor( coord.y );\n\n  // bit of char\n  float cf = cfx + 4.0 * cfy;\n\n  // determine char  \n  float num = 0.0;\n  if ( 0.0 < ci ) {\n    float n = abs( _in );\n    for ( int i = 0; i < 6; i ++ ) {\n      if ( ci < float( i ) ) { break; }\n      \n      num = mod( floor( n ), 10.0 );\n      n -= num;\n      n *= 10.0;\n    }\n  } else {\n    float n = abs( _in );\n    for ( int i = 0; i < 6; i ++ ) {\n      if ( -ci < float( i ) ) { break; }\n      \n      if ( ci != 0.0 && n < 1.0 ) {\n        // minus\n        return float( i ) == -ci && _in < 0.0 && cfy == 2.0 && 0.0 < cfx;\n      }\n      num = mod( floor( n ), 10.0 );\n      n -= num;\n      n /= 10.0;\n    }\n  }\n\n  bool a;\n  a = 1.0 == mod( floor( (\n    num == 0.0 ? 432534.0 :\n    num == 1.0 ? 410692.0 :\n    num == 2.0 ? 493087.0 :\n    num == 3.0 ? 493191.0 :\n    num == 4.0 ? 630408.0 :\n    num == 5.0 ? 989063.0 :\n    num == 6.0 ? 399254.0 :\n    num == 7.0 ? 1016898.0 :\n    num == 8.0 ? 431766.0 :\n    433798.0\n  ) / pow( 2.0, cf ) ), 2.0 );\n  \n  return a ? true : false;\n}\n\nvoid main() {\n  vec2 uv = gl_FragCoord.xy / resolution;\n\n  vec2 m = floor( vec2( 0.0, resolution.y ) + vec2( 1.0, -1.0 ) * mouse );\n  vec2 center = floor( m + vec2( 1.0, 0.7 ) * RADIUS );\n  float circle = length( gl_FragCoord.xy - center ) - RADIUS;\n\n  vec4 col = texture2D( sampler0, uv );\n  vec4 mcol = texture2D( sampler0, ( m + 0.5 ) / resolution );\n  vec4 bcol = vec4( circleColor, 1.0 );\n\n  col = mix(\n    col,\n    mix(\n      bcol,\n      mcol,\n      smoothstep( 1.0, 0.0, circle + 5.0 )\n    ),\n    smoothstep( 1.0, 0.0, circle )\n  );\n\n  if ( circle < 0.0 ) {\n    col = print( gl_FragCoord.xy - center - vec2( 0.0, 8.0 ), mcol.x ) ? bcol : col;\n    col = print( gl_FragCoord.xy - center - vec2( 0.0, 0.0 ), mcol.y ) ? bcol : col;\n    col = print( gl_FragCoord.xy - center - vec2( 0.0, -8.0 ), mcol.z ) ? bcol : col;\n    col = print( gl_FragCoord.xy - center - vec2( 0.0, -16.0 ), mcol.w ) ? bcol : col;\n  }\n\n  gl_FragColor = col;\n}",
    blend: [gl.ONE, gl.ZERO],
    clear: [0.0, 0.0, 0.0, 1.0],
    func: function func(path, params) {
      glCat.attribute("p", vboQuad, 2);
      glCat.uniform3fv("circleColor", [1.0, 1.0, 1.0]);
      glCat.uniformTexture("sampler0", params.input, 0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
  },

  gaussTable: {
    width: 6, // radius of dof
    height: 256,
    vert: "#define GLSLIFY 1\nattribute vec2 p;\n\nvoid main() {\n  gl_Position = vec4( p, 0.0, 1.0 );\n}\n",
    frag: "#define GAUSS_MAX 10.0\n#define T_SAMPLES 6\n#define R_SAMPLES 6\n\n#define saturate(i) clamp(i,0.,1.)\n#define lofi(i,j) floor((i)/(j))*(j)\n#define PI 3.14159265\n#define TAU 6.28318531\n\n// ------\n\nprecision highp float;\n#define GLSLIFY 1\n\nuniform vec2 resolution;\n\nfloat gaussian( float x, float s ) {\n  return 1.0 / sqrt( 2.0 * PI * s ) * exp( - x * x / 2.0 / s );\n}\n\nvoid main() {\n  float sum = 0.0;\n  float val = 0.0;\n  int target = int( gl_FragCoord.x );\n\n  float sigma = GAUSS_MAX * gl_FragCoord.y / resolution.y;\n\n  for ( int i = 0; i < R_SAMPLES; i ++ ) {\n    float v = gaussian( float( i ), sigma );\n    sum += v * ( ( i != 0 ) ? float( T_SAMPLES ) : 1.0 );\n    if ( target == i ) { val = v; }\n  }\n\n  gl_FragColor = vec4( val / sum, 0.0, 0.0, 1.0 );\n}\n",
    blend: [gl.ONE, gl.ZERO],
    clear: [0.0, 0.0, 0.0, 1.0],
    framebuffer: true,
    float: true,
    func: function func(path, params) {
      glCat.attribute("p", vboQuad, 2);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
  },

  "🐬": {
    width: width,
    height: height,
    vert: "#define GLSLIFY 1\nattribute vec2 p;\n\nvoid main() {\n  gl_Position = vec4( p, 0.0, 1.0 );\n}\n",
    frag: "#extension GL_EXT_frag_depth : require\n#extension GL_EXT_draw_buffers : require\nprecision highp float;\n#define GLSLIFY 1\n\nuniform vec4 bgColor;\n\nuniform float cameraFar;\n\n// ------\n\nvoid main() {\n  gl_FragData[ 0 ] = bgColor;\n  gl_FragData[ 1 ] = vec4( cameraFar, 0.0, 0.0, 1.0 );\n  gl_FragDepthEXT = 1.0;\n}",
    blend: [gl.ONE, gl.ZERO],
    clear: [0.0, 0.0, 0.0, 1.0],
    framebuffer: true,
    drawbuffers: 2,
    float: true,
    func: function func() {
      glCat.attribute("p", vboQuad, 2);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
  },

  "影": {
    width: shadowSize,
    height: shadowSize,
    vert: "#define GLSLIFY 1\nattribute vec2 p;\n\nvoid main() {\n  gl_Position = vec4( p, 0.0, 1.0 );\n}\n",
    frag: "precision highp float;\n#define GLSLIFY 1\n\nuniform vec2 resolution;\nuniform sampler2D sampler0;\n\nvoid main() {\n  vec2 uv = gl_FragCoord.xy / resolution;\n  gl_FragColor = texture2D( sampler0, uv );\n}\n",
    blend: [gl.ONE, gl.ZERO],
    clear: [cameraFar, 0.0, 0.0, 1.0],
    framebuffer: true,
    drawbuffers: 2,
    float: true,
    func: function func() {}
  },

  raymarch: {
    width: width,
    height: height,
    vert: "#define GLSLIFY 1\nattribute vec2 p;\n\nvoid main() {\n  gl_Position = vec4( p, 0.0, 1.0 );\n}\n",
    frag: "#define MARCH_ITER 60\n#define MARCH_MULT 0.7\n\n#define PI 3.14159265\n#define saturate(i) clamp(i,0.,1.)\n#define lofi(i,m) (floor((i)/(m))*(m))\n\n#extension GL_EXT_frag_depth : require\n#extension GL_EXT_draw_buffers : require\nprecision highp float;\n#define GLSLIFY 1\n\nuniform float time;\nuniform vec2 resolution;\nuniform vec3 color;\n\nuniform vec3 cameraPos;\nuniform vec3 cameraTar;\nuniform float cameraFov;\nuniform float cameraNear;\nuniform float cameraFar;\nuniform float cameraRoll;\nuniform vec3 lightPos;\n\nuniform float circleRotate;\nuniform float circleExpand;\nuniform float circleInterval;\n\nuniform mat4 matPL;\nuniform mat4 matVL;\n\nuniform bool isShadow;\n\nuniform sampler2D samplerShadow;\n\n// ------\n\nmat2 rotate2D( float _t ) {\n  return mat2(\n    cos( _t ), sin( _t ),\n    -sin( _t ), cos( _t )\n  );\n}\n\nfloat random( vec2 _uv ) {\n  return fract( sin( dot( vec2( 12.563, 21.864 ), _uv ) ) * 194.5134 );\n}\n\n// ------\n\nstruct Camera {\n  vec3 pos;\n  vec3 dir;\n  vec3 sid;\n  vec3 top;\n};\n\nstruct Ray {\n  vec3 dir;\n  vec3 ori;\n};\n\n// ------\n\nCamera camInit( in vec3 _pos, in vec3 _tar, in float _roll ) {\n  Camera cam;\n  cam.pos = _pos;\n  cam.dir = normalize( _tar - _pos );\n  cam.sid = normalize( cross( cam.dir, vec3( 0.0, 1.0, 0.0 ) ) );\n  cam.top = normalize( cross( cam.sid, cam.dir ) );\n  cam.sid = cos( _roll ) * cam.sid + sin( _roll ) * cam.top;\n  cam.top = normalize( cross( cam.sid, cam.dir ) );\n\n  return cam;\n}\n\nRay rayInit( in vec3 _ori, in vec3 _dir ) {\n  Ray ray;\n  ray.dir = _dir;\n  ray.ori = _ori;\n  return ray;\n}\n\nRay rayFromCam( in vec2 _p, in Camera _cam, in float _fov ) {\n  vec3 dir = normalize(\n    _p.x * _cam.sid\n    + _p.y * _cam.top\n    + _cam.dir / tan( _fov * PI / 360.0 )\n  );\n  return rayInit( _cam.pos, dir );\n}\n\n// ------\n\nfloat distFuncSphere( vec3 _p, float _r ) {\n  return length( _p ) - _r;\n}\n\nfloat distFuncBox( vec3 _p, vec3 _s ) {\n  vec3 d = abs( _p ) - _s;\n  return min( max( d.x, max( d.y, d.z ) ), 0.0 ) + length( max( d, 0.0 ) );\n}\n\nvec3 circleRep( vec3 _p, float _r, float _c ) {\n  vec3 p = _p;\n  float intrv = PI * 2.0 / _c;\n  p.zx = rotate2D( floor( atan( p.z, p.x ) / intrv ) * intrv ) * p.zx;\n  p.zx = rotate2D( intrv / 2.0 ) * p.zx;\n  p.x -= _r;\n  return p;\n}\n\nfloat distFunc( vec3 _p ) {\n  float dist = 1E9;\n\n  { // grid\n    float m = 5.0;\n    vec3 p = mod( _p, m ) - m / 2.0;\n    dist = min(\n      distFuncBox( p, vec3( 0.40, 0.04, 0.04 ) ),\n      distFuncBox( p, vec3( 0.04, 0.40, 0.04 ) )\n    );\n  }\n\n  return dist;\n}\n\nvec3 normalFunc( in vec3 _p ) {\n  vec2 d = vec2( 0.0, 1.0 ) * 1E-4;\n  return normalize( vec3(\n    distFunc( _p + d.yxx ) - distFunc( _p - d.yxx ),\n    distFunc( _p + d.xyx ) - distFunc( _p - d.xyx ),\n    distFunc( _p + d.xxy ) - distFunc( _p - d.xxy )\n  ) );\n}\n\n// ------\n\nfloat shadow( vec3 p, float d ) {\n  float dc = length( p - lightPos );\n\n  vec4 posFromLight = matPL * matVL * vec4( p, 1.0 );\n  vec2 shadowCoord = posFromLight.xy / posFromLight.w * 0.5 + 0.5;\n\n  float ret = 0.0;\n  for ( int iy = -1; iy <= 1; iy ++ ) {\n    for ( int ix = -1; ix <= 1; ix ++ ) {\n      vec2 uv = shadowCoord + vec2( float( ix ), float ( iy ) ) * 0.01;\n      float proj = texture2D( samplerShadow, uv ).x;\n      float bias = 0.1 + ( 1.0 - d ) * 0.3;\n\n      float dif = smoothstep( bias * 2.0, bias, ( dc - proj ) );\n      ret += dif / 9.0;\n    }\n  }\n  return ret;\n}\n\nvoid main() {\n  vec2 p = ( gl_FragCoord.xy * 2.0 - resolution ) / resolution.y;\n\n  Camera cam = camInit( cameraPos, cameraTar, cameraRoll );\n  if ( isShadow ) { cam = camInit( lightPos, cameraTar, 0.0 ); }\n  Ray ray = rayFromCam( p, cam, cameraFov );\n\n  float rayLen = cameraNear;\n  vec3 rayPos = ray.ori + rayLen * ray.dir;\n  float dist = 0.0;\n\n  for ( int i = 0; i < MARCH_ITER; i ++ ) {\n    dist = distFunc( rayPos );\n    rayLen += dist * MARCH_MULT;\n    rayPos = ray.ori + rayLen * ray.dir;\n\n    if ( cameraFar < rayLen ) { break; }\n    if ( abs( dist ) < 1E-5 ) { break; }\n  }\n\n  if ( 1E-2 < dist ) { discard; }\n\n  if ( isShadow ) {\n    float depth = length( rayPos - lightPos );\n    gl_FragData[ 0 ] = vec4( depth, 0.0, 0.0, 1.0 );\n\n    {\n      float a = ( cameraFar + cameraNear ) / ( cameraFar - cameraNear );\n      float b = 2.0 * cameraFar * cameraNear / ( cameraFar - cameraNear );\n      float z = dot( cam.dir, rayPos - cam.pos );\n      gl_FragDepthEXT = ( a - b / z ) * 0.5 + 0.5;\n    }\n    return;\n  }\n\n  // vec3 nor = normalFunc( rayPos );\n\n  // vec3 ld = normalize( rayPos - lightPos );\n  // vec3 dif = 200.0 * color * (\n  //   saturate( dot( -nor, ld ) )\n  //   / pow( length( rayPos - lightPos ), 2.0 )\n  //   * mix( 0.2, 1.0, shadow( rayPos, dot( -nor, ld ) ) )\n  // );\n\n  gl_FragData[ 0 ] = vec4( color, 1.0 );\n  gl_FragData[ 1 ] = vec4( rayLen, 0.0, 0.0, 1.0 );\n\n  {\n    float a = ( cameraFar + cameraNear ) / ( cameraFar - cameraNear );\n    float b = 2.0 * cameraFar * cameraNear / ( cameraFar - cameraNear );\n    float z = dot( cam.dir, rayPos - cam.pos );\n    gl_FragDepthEXT = ( a - b / z ) * 0.5 + 0.5;\n  }\n}\n",
    drawbuffers: 2,
    blend: [gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA],
    func: function func(path, params) {
      glCat.attribute("p", vboQuad, 2);

      glCat.uniform1i("isShadow", params.isShadow);
      if (!params.isShadow) {
        glCat.uniformTexture("samplerShadow", glCatPath.fb("影").textures[0], 0);
      } else {
        glCat.uniformTexture("samplerShadow", textureDummy, 0);
      }

      glCat.uniform3fv("color", [0.5, 0.5, 0.5]); // illegal
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
  },

  terrainCompute: {
    width: terrainSize,
    height: terrainSize,
    vert: "#define GLSLIFY 1\nattribute vec2 p;\n\nvoid main() {\n  gl_Position = vec4( p, 0.0, 1.0 );\n}\n",
    frag: "#define PHASE_DIV 12.0\n#define RANDOM_TEXTURE_RESO 64.0\n\nprecision highp float;\n#define GLSLIFY 1\n\nuniform float time;\nuniform vec2 resolution;\nuniform sampler2D samplerRandom;\nuniform sampler2D samplerRandomStatic;\n\n//\n// Description : Array and textureless GLSL 2D/3D/4D simplex\n//               noise functions.\n//      Author : Ian McEwan, Ashima Arts.\n//  Maintainer : ijm\n//     Lastmod : 20110822 (ijm)\n//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.\n//               Distributed under the MIT License. See LICENSE file.\n//               https://github.com/ashima/webgl-noise\n//\n\nvec4 mod289(vec4 x) {\n  return x - floor(x * (1.0 / 289.0)) * 289.0; }\n\nfloat mod289(float x) {\n  return x - floor(x * (1.0 / 289.0)) * 289.0; }\n\nvec4 permute(vec4 x) {\n     return mod289(((x*34.0)+1.0)*x);\n}\n\nfloat permute(float x) {\n     return mod289(((x*34.0)+1.0)*x);\n}\n\nvec4 taylorInvSqrt(vec4 r)\n{\n  return 1.79284291400159 - 0.85373472095314 * r;\n}\n\nfloat taylorInvSqrt(float r)\n{\n  return 1.79284291400159 - 0.85373472095314 * r;\n}\n\nvec4 grad4(float j, vec4 ip)\n  {\n  const vec4 ones = vec4(1.0, 1.0, 1.0, -1.0);\n  vec4 p,s;\n\n  p.xyz = floor( fract (vec3(j) * ip.xyz) * 7.0) * ip.z - 1.0;\n  p.w = 1.5 - dot(abs(p.xyz), ones.xyz);\n  s = vec4(lessThan(p, vec4(0.0)));\n  p.xyz = p.xyz + (s.xyz*2.0 - 1.0) * s.www;\n\n  return p;\n  }\n\n// (sqrt(5) - 1)/4 = F4, used once below\n#define F4 0.309016994374947451\n\nfloat snoise(vec4 v)\n  {\n  const vec4  C = vec4( 0.138196601125011,  // (5 - sqrt(5))/20  G4\n                        0.276393202250021,  // 2 * G4\n                        0.414589803375032,  // 3 * G4\n                       -0.447213595499958); // -1 + 4 * G4\n\n// First corner\n  vec4 i  = floor(v + dot(v, vec4(F4)) );\n  vec4 x0 = v -   i + dot(i, C.xxxx);\n\n// Other corners\n\n// Rank sorting originally contributed by Bill Licea-Kane, AMD (formerly ATI)\n  vec4 i0;\n  vec3 isX = step( x0.yzw, x0.xxx );\n  vec3 isYZ = step( x0.zww, x0.yyz );\n//  i0.x = dot( isX, vec3( 1.0 ) );\n  i0.x = isX.x + isX.y + isX.z;\n  i0.yzw = 1.0 - isX;\n//  i0.y += dot( isYZ.xy, vec2( 1.0 ) );\n  i0.y += isYZ.x + isYZ.y;\n  i0.zw += 1.0 - isYZ.xy;\n  i0.z += isYZ.z;\n  i0.w += 1.0 - isYZ.z;\n\n  // i0 now contains the unique values 0,1,2,3 in each channel\n  vec4 i3 = clamp( i0, 0.0, 1.0 );\n  vec4 i2 = clamp( i0-1.0, 0.0, 1.0 );\n  vec4 i1 = clamp( i0-2.0, 0.0, 1.0 );\n\n  //  x0 = x0 - 0.0 + 0.0 * C.xxxx\n  //  x1 = x0 - i1  + 1.0 * C.xxxx\n  //  x2 = x0 - i2  + 2.0 * C.xxxx\n  //  x3 = x0 - i3  + 3.0 * C.xxxx\n  //  x4 = x0 - 1.0 + 4.0 * C.xxxx\n  vec4 x1 = x0 - i1 + C.xxxx;\n  vec4 x2 = x0 - i2 + C.yyyy;\n  vec4 x3 = x0 - i3 + C.zzzz;\n  vec4 x4 = x0 + C.wwww;\n\n// Permutations\n  i = mod289(i);\n  float j0 = permute( permute( permute( permute(i.w) + i.z) + i.y) + i.x);\n  vec4 j1 = permute( permute( permute( permute (\n             i.w + vec4(i1.w, i2.w, i3.w, 1.0 ))\n           + i.z + vec4(i1.z, i2.z, i3.z, 1.0 ))\n           + i.y + vec4(i1.y, i2.y, i3.y, 1.0 ))\n           + i.x + vec4(i1.x, i2.x, i3.x, 1.0 ));\n\n// Gradients: 7x7x6 points over a cube, mapped onto a 4-cross polytope\n// 7*7*6 = 294, which is close to the ring size 17*17 = 289.\n  vec4 ip = vec4(1.0/294.0, 1.0/49.0, 1.0/7.0, 0.0) ;\n\n  vec4 p0 = grad4(j0,   ip);\n  vec4 p1 = grad4(j1.x, ip);\n  vec4 p2 = grad4(j1.y, ip);\n  vec4 p3 = grad4(j1.z, ip);\n  vec4 p4 = grad4(j1.w, ip);\n\n// Normalise gradients\n  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));\n  p0 *= norm.x;\n  p1 *= norm.y;\n  p2 *= norm.z;\n  p3 *= norm.w;\n  p4 *= taylorInvSqrt(dot(p4,p4));\n\n// Mix contributions from the five corners\n  vec3 m0 = max(0.6 - vec3(dot(x0,x0), dot(x1,x1), dot(x2,x2)), 0.0);\n  vec2 m1 = max(0.6 - vec2(dot(x3,x3), dot(x4,x4)            ), 0.0);\n  m0 = m0 * m0;\n  m1 = m1 * m1;\n  return 49.0 * ( dot(m0*m0, vec3( dot( p0, x0 ), dot( p1, x1 ), dot( p2, x2 )))\n               + dot(m1*m1, vec2( dot( p3, x3 ), dot( p4, x4 ) ) ) ) ;\n\n  }\n\nvec3 iRandom( vec2 uv, float rep ) {\n  vec2 d = vec2( 0.0, 1.0 ) / RANDOM_TEXTURE_RESO;\n  vec2 uvi = floor( uv * RANDOM_TEXTURE_RESO ) / RANDOM_TEXTURE_RESO;\n  vec2 uvf = ( uv - uvi ) * RANDOM_TEXTURE_RESO;\n  vec2 uvfs = vec2(\n    smoothstep( 0.0, 1.0, uvf.x ),\n    smoothstep( 0.0, 1.0, uvf.y )\n  );\n\n  vec3 v00 = texture2D( samplerRandomStatic, mod( uvi, rep ) ).xyz;\n  vec3 v10 = texture2D( samplerRandomStatic, mod( uvi + d.yx, rep ) ).xyz;\n  vec3 v01 = texture2D( samplerRandomStatic, mod( uvi + d.xy, rep ) ).xyz;\n  vec3 v11 = texture2D( samplerRandomStatic, mod( uvi + d.yy, rep ) ).xyz;\n\n  return mix(\n    mix( v00, v10, uvfs.x ),\n    mix( v01, v11, uvfs.x ),\n    uvfs.y\n  ) - 0.5;\n}\n\nvoid main() {\n  vec2 uv = gl_FragCoord.xy / resolution;\n\n  vec3 pos = vec3( ( uv - 0.5 ) * 32.0, -5.0 + 20.0 * pow( length( uv - 0.5 ), 2.0 ) );\n  pos.yz = vec2( 1.0, -1.0 ) * pos.zy;\n\n  for ( int i = 0; i < 4; i ++ ) {\n    float m = 0.25 * pow( 2.0, float( i ) );\n    float d = 0.125 + 0.5 * float( i );\n    pos += 1.0 * iRandom( uv * m + time * vec2( 0.0, d ), 1.0 * d ) / m;\n  }\n\n  gl_FragColor = vec4( pos, 1.0 );\n}",
    blend: [gl.ONE, gl.ZERO],
    clear: [0.0, 0.0, 0.0, 0.0],
    framebuffer: true,
    float: true,
    func: function func(path, params) {
      glCat.attribute("p", vboQuad, 2);
      glCat.uniformTexture("samplerRandom", textureRandom, 0);
      glCat.uniformTexture("samplerRandomStatic", textureRandomStatic, 1);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
  },

  terrainRender: {
    width: width,
    height: height,
    vert: "#define GLSLIFY 1\n#define HUGE 9E16\n#define PI 3.14159265\n#define V vec3(0.,1.,-1.)\n#define saturate(i) clamp(i,0.,1.)\n#define lofi(i,m) (floor((i)/(m))*(m))\n\n// ------\n\nattribute vec2 uv;\nattribute float triIndex;\n\nvarying vec3 vPos;\nvarying vec3 vNor;\nvarying vec2 vShadowCoord;\n\nuniform float time;\nuniform vec2 resolution;\nuniform vec3 cameraPos;\nuniform float cameraFov;\n\nuniform mat4 matP;\nuniform mat4 matV;\nuniform mat4 matPL;\nuniform mat4 matVL;\nuniform mat4 matM;\n\nuniform bool isShadow;\n\nuniform sampler2D samplerTerrain;\nuniform sampler2D samplerUV;\n\n// ------\n\nvec3 calcNormal( vec3 v0, vec3 v1, vec3 v2 ) {\n  vec3 a = normalize( v1 - v0 );\n  vec3 b = normalize( v2 - v0 );\n  return normalize( cross( a, b ) );\n}\n\nvoid main() {\n  vec4 p = matM * texture2D( samplerTerrain, uv );\n  vPos = p.xyz;\n\n  vec4 outPos;\n  if ( isShadow ) {\n    outPos = matPL * matVL * p;\n  } else {\n    outPos = matP * matV * p;\n\n    vec3 v0 = texture2D( samplerTerrain, texture2D( samplerUV, vec2( 0.5 / 3.0, triIndex ) ).xy ).xyz;\n    vec3 v1 = texture2D( samplerTerrain, texture2D( samplerUV, vec2( 1.5 / 3.0, triIndex ) ).xy ).xyz;\n    vec3 v2 = texture2D( samplerTerrain, texture2D( samplerUV, vec2( 2.5 / 3.0, triIndex ) ).xy ).xyz;\n    vNor = calcNormal( v0, v1, v2 );\n\n    vec4 posFromLight = matPL * matVL * p;\n    vShadowCoord = posFromLight.xy / posFromLight.w * 0.5 + 0.5;\n  }\n  gl_Position = outPos;\n}",
    frag: "#define saturate(i) clamp(i,0.,1.)\n\n#extension GL_EXT_draw_buffers : require\nprecision highp float;\n#define GLSLIFY 1\n\nvarying vec3 vPos;\nvarying vec3 vNor;\nvarying vec2 vShadowCoord;\n\nuniform vec4 bgColor;\nuniform vec3 color;\nuniform vec3 cameraPos;\nuniform vec3 lightPos;\n\nuniform bool isShadow;\n\nuniform sampler2D samplerShadow;\n\n// ------\n\nfloat shadow( float d ) {\n  float dc = length( vPos - lightPos );\n  float ret = 0.0;\n  for ( int iy = -1; iy <= 1; iy ++ ) {\n    for ( int ix = -1; ix <= 1; ix ++ ) {\n      vec2 uv = vShadowCoord + vec2( float( ix ), float ( iy ) ) * 0.001;\n      float proj = texture2D( samplerShadow, uv ).x;\n      float bias = 0.1 + ( 1.0 - d ) * 0.3;\n\n      float dif = smoothstep( bias * 2.0, bias, ( dc - proj ) );\n      ret += dif / 9.0;\n    }\n  }\n  return ret;\n}\n\nvoid main() {\n  if ( isShadow ) {\n    float depth = length( vPos - lightPos );\n    gl_FragData[ 0 ] = vec4( depth, 0.0, 0.0, 1.0 );\n    return;\n  }\n\n  vec3 ld = normalize( vPos - lightPos );\n  vec3 dif = 200.0 * color * (\n    saturate( 0.2 + 0.8 * dot( -vNor, ld ) )\n    / pow( length( vPos - lightPos ), 2.0 )\n    * mix( 0.2, 1.0, shadow( dot( -vNor, ld ) ) )\n  );\n\n  float depth = length( vPos - cameraPos );\n\n  gl_FragData[ 0 ] = vec4( dif, 1.0 );\n  gl_FragData[ 1 ] = vec4( depth, 0.0, 0.0, 1.0 );\n}",
    drawbuffers: 2,
    blend: [gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA],
    func: function func(path, params) {
      glCat.attribute("uv", vboTerrainUV, 2);
      glCat.attribute("triIndex", vboTerrainTriIndex, 1);

      var matM = _mathcat2.default.mat4Identity();
      glCat.uniformMatrix4fv("matM", matM);

      glCat.uniformTexture("samplerTerrain", glCatPath.fb("terrainCompute").texture, 0);
      glCat.uniformTexture("samplerUV", textureTerrainUV, 1);

      glCat.uniform1i("isShadow", params.isShadow);
      if (!params.isShadow) {
        glCat.uniformTexture("samplerShadow", glCatPath.fb("影").textures[0], 2);
      } else {
        glCat.uniformTexture("samplerShadow", textureDummy, 2);
      }
      glCat.uniform3fv("color", [0.8, 0.8, 0.8]);
      gl.drawArrays(gl.TRIANGLES, 0, vboTerrainUV.length / 2);
    }
  },

  cube: {
    width: width,
    height: height,
    vert: "#define GLSLIFY 1\n#define HUGE 9E16\n#define PI 3.14159265\n#define V vec3(0.,1.,-1.)\n#define saturate(i) clamp(i,0.,1.)\n#define lofi(i,m) (floor((i)/(m))*(m))\n\n// ------\n\nattribute vec3 pos;\nattribute vec3 nor;\nattribute vec2 uv;\n\nvarying vec3 vPos;\nvarying vec3 vNor;\nvarying vec2 vUv;\nvarying vec2 vShadowCoord;\n\nuniform float time;\nuniform vec2 resolution;\nuniform vec3 cameraPos;\nuniform float cameraFov;\n\nuniform mat4 matP;\nuniform mat4 matV;\nuniform mat4 matPL;\nuniform mat4 matVL;\nuniform mat4 matM;\n\nuniform bool isShadow;\n\n// ------\n\nvoid main() {\n  vec4 p = matM * vec4( pos, 1.0 );\n  vPos = p.xyz;\n\n  mat4 matN = matM;\n  matN[ 0 ] = normalize( matN[ 0 ] );\n  matN[ 1 ] = normalize( matN[ 1 ] );\n  matN[ 2 ] = normalize( matN[ 2 ] );\n  matN[ 3 ] = vec4( 0.0, 0.0, 0.0, 1.0 );\n  vNor = ( matN * vec4( nor, 1.0 ) ).xyz;\n\n  vUv = uv;\n\n  vec4 outPos;\n  if ( isShadow ) {\n    outPos = matPL * matVL * p;\n  } else {\n    outPos = matP * matV * p;\n\n    vec4 posFromLight = matPL * matVL * p;\n    vShadowCoord = posFromLight.xy / posFromLight.w * 0.5 + 0.5;\n  }\n  gl_Position = outPos;\n}",
    frag: "#define saturate(i) clamp(i,0.,1.)\n\n#extension GL_EXT_draw_buffers : require\nprecision highp float;\n#define GLSLIFY 1\n\nvarying vec3 vPos;\nvarying vec3 vNor;\n\nuniform vec3 cameraPos;\nuniform vec3 lightPos;\nuniform bool isShadow;\n\n// ------\n\nvoid main() {\n  if ( isShadow ) {\n    float depth = length( vPos - lightPos );\n    gl_FragData[ 0 ] = vec4( depth, 0.0, 0.0, 1.0 );\n    return;\n  }\n\n  float depth = length( vPos - cameraPos );\n\n  gl_FragData[ 0 ] = vec4( vNor * 0.5 + 0.5, 1.0 );\n  gl_FragData[ 1 ] = vec4( depth, 0.0, 0.0, 1.0 );\n}",
    drawbuffers: 2,
    blend: [gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA],
    func: function func(path, params) {
      glCat.attribute("pos", vboCubePos, 3);
      glCat.attribute("nor", vboCubeNor, 3);

      var matM = _mathcat2.default.mat4Identity();
      matM = _mathcat2.default.mat4Apply(_mathcat2.default.mat4ScaleXYZ(1.0), matM);
      matM = _mathcat2.default.mat4Apply(_mathcat2.default.mat4RotateZ(-auto("cameraTheta") * Math.PI * 1.0), matM);
      matM = _mathcat2.default.mat4Apply(_mathcat2.default.mat4RotateX(auto("cameraTheta") * Math.PI * 2.0), matM);
      matM = _mathcat2.default.mat4Apply(_mathcat2.default.mat4RotateY(-auto("cameraTheta") * Math.PI * 1.0), matM);
      glCat.uniformMatrix4fv("matM", matM);

      glCat.uniform1i("isShadow", params.isShadow);
      if (!params.isShadow) {
        glCat.uniformTexture("samplerShadow", glCatPath.fb("影").textures[0], 0);
      } else {
        glCat.uniformTexture("samplerShadow", textureDummy, 0);
      }
      gl.drawArrays(gl.TRIANGLES, 0, vboCubePos.length / 3);
    }
  },

  particlesComputeReturn: {
    width: particlesSqrt * particlePixels,
    height: particlesSqrt,
    vert: "#define GLSLIFY 1\nattribute vec2 p;\n\nvoid main() {\n  gl_Position = vec4( p, 0.0, 1.0 );\n}\n",
    frag: "precision highp float;\n#define GLSLIFY 1\n\nuniform vec2 resolution;\nuniform sampler2D sampler0;\n\nvoid main() {\n  vec2 uv = gl_FragCoord.xy / resolution;\n  gl_FragColor = texture2D( sampler0, uv );\n}\n",
    blend: [gl.ONE, gl.ZERO],
    clear: [0.0, 0.0, 0.0, 0.0],
    framebuffer: true,
    float: true,
    func: function func(path, params) {
      glCat.attribute("p", vboQuad, 2);
      glCat.uniformTexture("sampler0", glCatPath.fb("particlesCompute").texture, 0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
  },

  particlesCompute: {
    width: particlesSqrt * particlePixels,
    height: particlesSqrt,
    vert: "#define GLSLIFY 1\nattribute vec2 p;\n\nvoid main() {\n  gl_Position = vec4( p, 0.0, 1.0 );\n}\n",
    frag: "#define PARTICLE_LIFE_SPEED 1.0\n\n#define HUGE 9E16\n#define PI 3.14159265\n#define V vec3(0.,1.,-1.)\n#define saturate(i) clamp(i,0.,1.)\n#define lofi(i,m) (floor((i)/(m))*(m))\n#define lofir(i,m) (floor((i)/(m)+.5)*(m))\n\n// ------\n\nprecision highp float;\n#define GLSLIFY 1\n\nuniform float time;\nuniform float particlesSqrt;\nuniform float particlePixels;\nuniform float frame;\nuniform float frames;\nuniform float charShuffle;\nuniform bool init;\nuniform float deltaTime;\nuniform vec2 resolution;\nuniform vec3 cameraPos;\n\nuniform float fukitobasu;\n\nuniform sampler2D samplerPcompute;\nuniform sampler2D samplerRandom;\n\n// ------\n\nvec2 vInvert( vec2 _uv ) {\n  return vec2( 0.0, 1.0 ) + vec2( 1.0, -1.0 ) * _uv;\n}\n\n// ------\n\nmat2 rotate2D( float _t ) {\n  return mat2( cos( _t ), sin( _t ), -sin( _t ), cos( _t ) );\n}\n\nvec4 random( vec2 _uv ) {\n  return texture2D( samplerRandom, _uv );\n}\n\n//\n// Description : Array and textureless GLSL 2D/3D/4D simplex\n//               noise functions.\n//      Author : Ian McEwan, Ashima Arts.\n//  Maintainer : ijm\n//     Lastmod : 20110822 (ijm)\n//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.\n//               Distributed under the MIT License. See LICENSE file.\n//               https://github.com/ashima/webgl-noise\n//\n\nvec4 mod289(vec4 x) {\n  return x - floor(x * (1.0 / 289.0)) * 289.0; }\n\nfloat mod289(float x) {\n  return x - floor(x * (1.0 / 289.0)) * 289.0; }\n\nvec4 permute(vec4 x) {\n     return mod289(((x*34.0)+1.0)*x);\n}\n\nfloat permute(float x) {\n     return mod289(((x*34.0)+1.0)*x);\n}\n\nvec4 taylorInvSqrt(vec4 r)\n{\n  return 1.79284291400159 - 0.85373472095314 * r;\n}\n\nfloat taylorInvSqrt(float r)\n{\n  return 1.79284291400159 - 0.85373472095314 * r;\n}\n\nvec4 grad4(float j, vec4 ip)\n  {\n  const vec4 ones = vec4(1.0, 1.0, 1.0, -1.0);\n  vec4 p,s;\n\n  p.xyz = floor( fract (vec3(j) * ip.xyz) * 7.0) * ip.z - 1.0;\n  p.w = 1.5 - dot(abs(p.xyz), ones.xyz);\n  s = vec4(lessThan(p, vec4(0.0)));\n  p.xyz = p.xyz + (s.xyz*2.0 - 1.0) * s.www;\n\n  return p;\n  }\n\n// (sqrt(5) - 1)/4 = F4, used once below\n#define F4 0.309016994374947451\n\nfloat snoise(vec4 v)\n  {\n  const vec4  C = vec4( 0.138196601125011,  // (5 - sqrt(5))/20  G4\n                        0.276393202250021,  // 2 * G4\n                        0.414589803375032,  // 3 * G4\n                       -0.447213595499958); // -1 + 4 * G4\n\n// First corner\n  vec4 i  = floor(v + dot(v, vec4(F4)) );\n  vec4 x0 = v -   i + dot(i, C.xxxx);\n\n// Other corners\n\n// Rank sorting originally contributed by Bill Licea-Kane, AMD (formerly ATI)\n  vec4 i0;\n  vec3 isX = step( x0.yzw, x0.xxx );\n  vec3 isYZ = step( x0.zww, x0.yyz );\n//  i0.x = dot( isX, vec3( 1.0 ) );\n  i0.x = isX.x + isX.y + isX.z;\n  i0.yzw = 1.0 - isX;\n//  i0.y += dot( isYZ.xy, vec2( 1.0 ) );\n  i0.y += isYZ.x + isYZ.y;\n  i0.zw += 1.0 - isYZ.xy;\n  i0.z += isYZ.z;\n  i0.w += 1.0 - isYZ.z;\n\n  // i0 now contains the unique values 0,1,2,3 in each channel\n  vec4 i3 = clamp( i0, 0.0, 1.0 );\n  vec4 i2 = clamp( i0-1.0, 0.0, 1.0 );\n  vec4 i1 = clamp( i0-2.0, 0.0, 1.0 );\n\n  //  x0 = x0 - 0.0 + 0.0 * C.xxxx\n  //  x1 = x0 - i1  + 1.0 * C.xxxx\n  //  x2 = x0 - i2  + 2.0 * C.xxxx\n  //  x3 = x0 - i3  + 3.0 * C.xxxx\n  //  x4 = x0 - 1.0 + 4.0 * C.xxxx\n  vec4 x1 = x0 - i1 + C.xxxx;\n  vec4 x2 = x0 - i2 + C.yyyy;\n  vec4 x3 = x0 - i3 + C.zzzz;\n  vec4 x4 = x0 + C.wwww;\n\n// Permutations\n  i = mod289(i);\n  float j0 = permute( permute( permute( permute(i.w) + i.z) + i.y) + i.x);\n  vec4 j1 = permute( permute( permute( permute (\n             i.w + vec4(i1.w, i2.w, i3.w, 1.0 ))\n           + i.z + vec4(i1.z, i2.z, i3.z, 1.0 ))\n           + i.y + vec4(i1.y, i2.y, i3.y, 1.0 ))\n           + i.x + vec4(i1.x, i2.x, i3.x, 1.0 ));\n\n// Gradients: 7x7x6 points over a cube, mapped onto a 4-cross polytope\n// 7*7*6 = 294, which is close to the ring size 17*17 = 289.\n  vec4 ip = vec4(1.0/294.0, 1.0/49.0, 1.0/7.0, 0.0) ;\n\n  vec4 p0 = grad4(j0,   ip);\n  vec4 p1 = grad4(j1.x, ip);\n  vec4 p2 = grad4(j1.y, ip);\n  vec4 p3 = grad4(j1.z, ip);\n  vec4 p4 = grad4(j1.w, ip);\n\n// Normalise gradients\n  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));\n  p0 *= norm.x;\n  p1 *= norm.y;\n  p2 *= norm.z;\n  p3 *= norm.w;\n  p4 *= taylorInvSqrt(dot(p4,p4));\n\n// Mix contributions from the five corners\n  vec3 m0 = max(0.6 - vec3(dot(x0,x0), dot(x1,x1), dot(x2,x2)), 0.0);\n  vec2 m1 = max(0.6 - vec2(dot(x3,x3), dot(x4,x4)            ), 0.0);\n  m0 = m0 * m0;\n  m1 = m1 * m1;\n  return 49.0 * ( dot(m0*m0, vec3( dot( p0, x0 ), dot( p1, x1 ), dot( p2, x2 )))\n               + dot(m1*m1, vec2( dot( p3, x3 ), dot( p4, x4 ) ) ) ) ;\n\n  }\n\nfloat GPURnd(inout vec4 n)\n{\n\t// Based on the post http://gpgpu.org/forums/viewtopic.php?t=2591&sid=17051481b9f78fb49fba5b98a5e0f1f3\n\t// (The page no longer exists as of March 17th, 2015. Please let me know if you see why this code works.)\n\tconst vec4 q = vec4(   1225.0,    1585.0,    2457.0,    2098.0);\n\tconst vec4 r = vec4(   1112.0,     367.0,      92.0,     265.0);\n\tconst vec4 a = vec4(   3423.0,    2646.0,    1707.0,    1999.0);\n\tconst vec4 m = vec4(4194287.0, 4194277.0, 4194191.0, 4194167.0);\n\n\tvec4 beta = floor(n / q);\n\tvec4 p = a * (n - beta * q) - beta * r;\n\tbeta = (sign(-p) + vec4(1.0)) * vec4(0.5) * m;\n\tn = (p + beta);\n\n\treturn fract(dot(n / m, vec4(1.0, -1.0, 1.0, -1.0)));\n}\n\nvec3 randomSphere( inout vec4 seed ) {\n  vec3 v;\n  for ( int i = 0; i < 10; i ++ ) {\n    v = vec3(\n      GPURnd( seed ),\n      GPURnd( seed ),\n      GPURnd( seed )\n    ) * 2.0 - 1.0;\n    if ( length( v ) < 1.0 ) { break; }\n  }\n  return v;\n}\n\nvec2 randomCircle( inout vec4 seed ) {\n  vec2 v;\n  for ( int i = 0; i < 10; i ++ ) {\n    v = vec2(\n      GPURnd( seed ),\n      GPURnd( seed )\n    ) * 2.0 - 1.0;\n    if ( length( v ) < 1.0 ) { break; }\n  }\n  return v;\n}\n\nvec3 randomBox( inout vec4 seed ) {\n  vec3 v;\n  v = vec3(\n    GPURnd( seed ),\n    GPURnd( seed ),\n    GPURnd( seed )\n  ) * 2.0 - 1.0;\n  return v;\n}\n\n// ------\n\nvoid main() {\n  vec2 uv = gl_FragCoord.xy / resolution;\n  vec2 puv = vec2( ( floor( gl_FragCoord.x / particlePixels ) * particlePixels + 0.5 ) / resolution.x, uv.y );\n  float number = ( ( gl_FragCoord.x - 0.5 ) / particlePixels ) + ( ( gl_FragCoord.y - 0.5 ) * particlesSqrt );\n  float mode = mod( gl_FragCoord.x, particlePixels );\n  vec2 dpix = vec2( 1.0 ) / resolution;\n\n  vec4 seed = texture2D( samplerRandom, puv );\n  GPURnd( seed );\n\n  vec4 pos = texture2D( samplerPcompute, puv );\n  vec4 vel = texture2D( samplerPcompute, puv + dpix * vec2( 1.0, 0.0 ) );\n  vec4 rot = texture2D( samplerPcompute, puv + dpix * vec2( 2.0, 0.0 ) );\n\n  float dt = deltaTime;\n    \n  float timing = number / particlesSqrt / particlesSqrt;\n  float timingI = floor( timing * frames / PARTICLE_LIFE_SPEED );\n  float timingF = fract( timing * frames / PARTICLE_LIFE_SPEED );\n  if ( timingI == mod( frame, frames / PARTICLE_LIFE_SPEED ) ) {\n    pos.xyz = 10.0 * randomSphere( seed );\n    pos.xyz = normalize( pos.xyz ) * ( length( pos.xyz ) + 1.0 );\n    pos.w = 1.0;\n\n    vel.xyz = vec3( 0.0 );\n    vel.w = pow( GPURnd( seed ), 20.0 );\n\n    rot = vec4(\n      1.0 * ( GPURnd( seed ) - 0.5 ),\n      1.0 * ( GPURnd( seed ) - 0.5 ),\n      40.0 * ( GPURnd( seed ) - 0.5 ),\n      40.0 * ( GPURnd( seed ) - 0.5 )\n    );\n\n    dt = deltaTime * ( 1.0 - timingF );\n  }\n\n  vel.xyz += 2E2 * dt * vec3(\n    snoise( vec4( pos.xyz * 0.37 + 61.51 + 0.1 * sin( 2.0 * PI * time ), 20.04 ) ),\n    snoise( vec4( pos.xyz * 0.37 + 15.31 + 0.1 * sin( 2.0 * PI * time ), 41.21 ) ),\n    snoise( vec4( pos.xyz * 0.37 + 28.79 + 0.1 * sin( 2.0 * PI * time ), 32.95 ) )\n  );\n  vel.xyz += 1E3 * dt * normalize( pos.xyz ) * exp( -length( pos.xyz ) );\n\n  pos.xyz += vel.xyz * dt;\n  pos.w -= dt * PARTICLE_LIFE_SPEED;\n\n  rot.xy += dt * rot.zw;\n\n  gl_FragColor = (\n    mode < 1.0 ? pos :\n    mode < 2.0 ? vel :\n    rot\n  );\n}",
    blend: [gl.ONE, gl.ZERO],
    clear: [0.0, 0.0, 0.0, 0.0],
    framebuffer: true,
    float: true,
    func: function func(path, params) {
      glCat.attribute("p", vboQuad, 2);
      glCat.uniformTexture("samplerPcompute", glCatPath.fb("particlesComputeReturn").texture, 0);
      glCat.uniformTexture("samplerRandom", textureRandom, 1);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
  },

  particlesRender: {
    width: width,
    height: height,
    vert: "#define GLSLIFY 1\n#define HUGE 9E16\n#define PI 3.14159265\n#define V vec3(0.,1.,-1.)\n#define saturate(i) clamp(i,0.,1.)\n#define lofi(i,m) (floor((i)/(m))*(m))\n\n// ------\n\nattribute vec2 computeUV;\nattribute vec3 primPos;\nattribute vec3 primNor;\n\nvarying vec3 vPos;\nvarying vec3 vNor;\nvarying vec3 vPrimPos;\nvarying vec3 vPrimNor;\nvarying float vLife;\nvarying float vSize;\nvarying vec2 vShadowCoord;\n\nuniform vec2 resolution;\nuniform vec2 resolutionPcompute;\nuniform vec3 cameraPos;\nuniform float cameraFov;\nuniform mat4 matP;\nuniform mat4 matV;\nuniform mat4 matPL;\nuniform mat4 matVL;\n\nuniform bool isShadow;\n\nuniform sampler2D samplerPcompute;\n\n// ------\n\nmat2 rotate2D( float _t ) {\n  return mat2( cos( _t ), sin( _t ), -sin( _t ), cos( _t ) );\n}\n\nvoid main() {\n  vec2 puv = ( computeUV.xy + 0.5 ) / resolutionPcompute;\n  vec2 dppix = vec2( 1.0 ) / resolutionPcompute;\n\n  vec4 pos = texture2D( samplerPcompute, puv );\n  vec4 vel = texture2D( samplerPcompute, puv + dppix * vec2( 1.0, 0.0 ) );\n  vec4 rot = texture2D( samplerPcompute, puv + dppix * vec2( 2.0, 0.0 ) );\n\n  vec3 primPosD = primPos;\n  vec3 primNorD = primNor;\n\n  vPrimPos = primPos;\n  vPrimNor = primNor;\n\n  primPosD.zx = rotate2D( rot.y ) * primPosD.zx;\n  primPosD.yz = rotate2D( rot.x ) * primPosD.yz;\n  primPosD.xy = rotate2D( PI / 4.0 ) * primPosD.xy;\n  primNorD.zx = rotate2D( rot.y ) * primNorD.zx;\n  primNorD.yz = rotate2D( rot.x ) * primNorD.yz;\n  primNorD.xy = rotate2D( PI / 4.0 ) * primNorD.xy;\n\n  primPosD.xyz *= 0.3 * (\n    vel.w * sin( PI * pos.w ) *\n    ( 1.0 - exp( -length( cameraPos - pos.xyz ) ) )\n  );\n  pos.xyz += primPosD.xyz;\n\n  vPos = pos.xyz;\n  vNor = primNorD.xyz;\n  vLife = pos.w;\n  vSize = vel.w;\n\n  vec4 outPos;\n  if ( isShadow ) {\n    outPos = matPL * matVL * vec4( pos.xyz, 1.0 );\n  } else {\n    outPos = matP * matV * vec4( pos.xyz, 1.0 );\n\n    vec4 posFromLight = matPL * matVL * vec4( pos.xyz, 1.0 );\n    vShadowCoord = posFromLight.xy / posFromLight.w * 0.5 + 0.5;\n  }\n\n  gl_Position = outPos;\n}",
    frag: "#define saturate(i) clamp(i,0.,1.)\n\n#extension GL_EXT_draw_buffers : require\nprecision highp float;\n#define GLSLIFY 1\n\nvarying vec3 vPos;\nvarying vec3 vNor;\nvarying vec2 vShadowCoord;\n\nuniform vec4 bgColor;\nuniform vec3 color;\nuniform vec3 cameraPos;\nuniform vec3 lightPos;\n\nuniform bool isShadow;\n\nuniform sampler2D samplerShadow;\n\n// ------\n\nfloat shadow( float d ) {\n  float dc = length( vPos - lightPos );\n  float ret = 0.0;\n  for ( int iy = -1; iy <= 1; iy ++ ) {\n    for ( int ix = -1; ix <= 1; ix ++ ) {\n      vec2 uv = vShadowCoord + vec2( float( ix ), float ( iy ) ) * 0.001;\n      float proj = texture2D( samplerShadow, uv ).x;\n      float bias = 0.1 + ( 1.0 - d ) * 0.3;\n\n      float dif = smoothstep( bias * 2.0, bias, ( dc - proj ) );\n      ret += dif / 9.0;\n    }\n  }\n  return ret;\n}\n\nvoid main() {\n  if ( isShadow ) {\n    float depth = length( vPos - lightPos );\n    gl_FragData[ 0 ] = vec4( depth, 0.0, 0.0, 1.0 );\n    return;\n  }\n\n  vec3 ld = normalize( vPos - lightPos );\n  vec3 dif = 200.0 * color * (\n    saturate( 0.2 + 0.8 * dot( -vNor, ld ) )\n    / pow( length( vPos - lightPos ), 2.0 )\n    * mix( 0.2, 1.0, shadow( dot( -vNor, ld ) ) )\n  );\n\n  float depth = length( vPos - cameraPos );\n\n  gl_FragData[ 0 ] = vec4( dif, 1.0 );\n  gl_FragData[ 1 ] = vec4( depth, 0.0, 0.0, 1.0 );\n}",
    drawbuffers: 2,
    blend: [gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA],
    func: function func(path, params) {
      glCat.attribute("computeUV", vboParticleUV, 2, 1);
      glCat.attribute("primPos", vboCubePos, 3);
      glCat.attribute("primNor", vboCubeNor, 3);

      glCat.uniform2fv("resolutionPcompute", [particlesSqrt * particlePixels, particlesSqrt]);
      glCat.uniformTexture("samplerPcompute", glCatPath.fb("particlesCompute").texture, 1);

      glCat.uniform1i("isShadow", params.isShadow);
      if (!params.isShadow) {
        glCat.uniformTexture("samplerShadow", glCatPath.fb("影").textures[0], 0);
      } else {
        glCat.uniformTexture("samplerShadow", textureDummy, 0);
      }

      glCat.uniform3fv("color", [0.8, 0.8, 0.8]);

      var ext = glCat.getExtension("ANGLE_instanced_arrays");
      ext.drawArraysInstancedANGLE(gl.TRIANGLES, 0, vertsPerParticle, particles);
    }
  },

  fxaa: {
    width: width,
    height: height,
    vert: "#define GLSLIFY 1\nattribute vec2 p;\n\nvoid main() {\n  gl_Position = vec4( p, 0.0, 1.0 );\n}\n",
    frag: "#define PI 3.14159265\n#define V vec3(0.,1.,-1.)\n\n#define FXAA_REDUCE_MIN (1.0 / 128.0)\n#define FXAA_REDUCE_MUL (1.0 / 8.0)\n#define FXAA_SPAN_MAX 16.0\n\n// ------\n\nprecision highp float;\n#define GLSLIFY 1\n\nuniform vec2 resolution;\n\nuniform sampler2D texture;\n\n// ------\n\nvoid main() {\n  vec2 uv = gl_FragCoord.xy / resolution;\n\n  #define T(v) texture2D( texture, (v) / resolution ).xyz\n  vec3 rgb11 = T( gl_FragCoord.xy );\n  vec3 rgb00 = T( gl_FragCoord.xy + V.zz );\n  vec3 rgb02 = T( gl_FragCoord.xy + V.zy );\n  vec3 rgb20 = T( gl_FragCoord.xy + V.yz );\n  vec3 rgb22 = T( gl_FragCoord.xy + V.yy );\n  #undef T\n\n  vec3 luma = vec3( 0.299, 0.587, 0.114 );\n  #define L(c) dot( c, luma )\n  float luma11 = L( rgb11 );\n  float luma00 = L( rgb00 );\n  float luma02 = L( rgb02 );\n  float luma20 = L( rgb20 );\n  float luma22 = L( rgb22 );\n  #undef L\n\n  float lumaMin = min( luma00, min( min( luma00, luma02 ), min( luma20, luma22 ) ) );\n  float lumaMax = max( luma00, max( max( luma00, luma02 ), max( luma20, luma22 ) ) );\n\n  vec2 dir = vec2(\n    -( ( luma00 + luma20 ) - ( luma02 + luma22 ) ),\n    ( ( luma00 + luma02 ) - ( luma20 + luma22 ) )\n  );\n\n  float dirReduce = max(\n    ( luma00 + luma02 + luma20 + luma22 ) * 0.25 * FXAA_REDUCE_MUL,\n    FXAA_REDUCE_MIN\n  );\n  float rcpDirMin = 1.0 / ( min( abs( dir.x ), abs( dir.y ) ) + dirReduce );\n  dir = min(\n    vec2( FXAA_SPAN_MAX ),\n    max(\n      vec2( -FXAA_SPAN_MAX ),\n      dir * rcpDirMin\n    )\n  ) / resolution;\n\n  vec3 rgbA = 0.5 * (\n    texture2D( texture, uv + dir * ( 1.0 / 3.0 - 0.5 ) ).xyz +\n    texture2D( texture, uv + dir * ( 2.0 / 3.0 - 0.5 ) ).xyz\n  );\n  vec3 rgbB = rgbA * 0.5 + 0.25 * (\n    texture2D( texture, uv - dir * 0.5 ).xyz +\n    texture2D( texture, uv + dir * 0.5 ).xyz\n  );\n\n  float lumaB = dot( rgbB, luma );\n  gl_FragColor = (\n    ( ( lumaB < lumaMin ) || ( lumaMax < lumaB ) ) ?\n    vec4( rgbA, 1.0 ) :\n    vec4( rgbB, 1.0 )\n  );\n}",
    clear: [0.0, 0.0, 0.0, 1.0],
    framebuffer: true,
    float: true,
    blend: [gl.ONE, gl.ZERO],
    func: function func(path, params) {
      glCat.attribute("p", vboQuad, 2);
      glCat.uniformTexture("sampler0", params.input, 0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
  },

  gauss: {
    width: width,
    height: height,
    vert: "#define GLSLIFY 1\nattribute vec2 p;\n\nvoid main() {\n  gl_Position = vec4( p, 0.0, 1.0 );\n}\n",
    frag: "#define saturate(i) clamp(i,0.,1.)\n#define PI 3.14159265\n#define SAMPLES 10\n\n// ------\n\nprecision highp float;\n#define GLSLIFY 1\n\nuniform vec2 resolution;\nuniform bool isVert;\nuniform sampler2D sampler0;\n\nuniform float var;\n\nfloat gaussian( float _x, float _v ) {\n  return 1.0 / sqrt( 2.0 * PI * _v ) * exp( - _x * _x / 2.0 / _v );\n}\n\nvoid main() {\n  vec2 uv = gl_FragCoord.xy / resolution;\n  vec2 bv = ( isVert ? vec2( 0.0, 1.0 ) : vec2( 1.0, 0.0 ) ) / resolution;\n\n  vec3 sum = vec3( 0.0 );\n  for ( int i = -SAMPLES; i <= SAMPLES; i ++ ) {\n    vec2 v = saturate( uv + bv * float( i ) );\n    vec3 tex = texture2D( sampler0, v ).xyz;\n    float mul = gaussian( abs( float( i ) ), var );\n    sum += tex * mul;\n  }\n\n  gl_FragColor = vec4( sum, 1.0 );\n}\n",
    clear: [0.0, 0.0, 0.0, 1.0],
    tempFb: glCat.createFloatFramebuffer(width, height),
    blend: [gl.ONE, gl.ZERO],
    func: function func(path, params) {
      if (params.width && params.height) {
        glCat.resizeFloatFramebuffer(path.tempFb, params.width, params.height);
      }

      gl.bindFramebuffer(gl.FRAMEBUFFER, path.tempFb.framebuffer);
      glCat.clear.apply(glCat, _toConsumableArray(path.clear));

      glCat.attribute("p", vboQuad, 2);
      glCat.uniformTexture("sampler0", params.input, 0);
      glCat.uniform1f("var", params.var);
      glCat.uniform1i("isVert", 0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      gl.bindFramebuffer(gl.FRAMEBUFFER, params.framebuffer);

      glCat.attribute("p", vboQuad, 2);
      glCat.uniformTexture("sampler0", path.tempFb.texture, 0);
      glCat.uniform1f("var", params.var);
      glCat.uniform1i("isVert", 1);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
  },

  dof: {
    width: width,
    height: height,
    vert: "#define GLSLIFY 1\nattribute vec2 p;\n\nvoid main() {\n  gl_Position = vec4( p, 0.0, 1.0 );\n}\n",
    frag: "#define GAUSS_RATE 0.4\n#define FOG 0.05\n#define R_SAMPLES 6\n#define R_INTERVAL 2.0\n#define T_OFFSET 0.3\n#define T_SAMPLES 6\n\n#define V vec2(0.,1.)\n#define saturate(i) clamp(i,0.,1.)\n#define lofi(i,j) floor((i)/(j))*(j)\n#define PI 3.14159265\n#define TAU 6.28318531\n\n// ------\n\nprecision highp float;\n#define GLSLIFY 1\n\nuniform vec2 resolution;\nuniform sampler2D sampler0;\nuniform sampler2D samplerPreDof;\nuniform sampler2D samplerDepth;\nuniform sampler2D samplerGaussTable;\nuniform vec4 bgColor;\nuniform float focus;\n\nvoid main() {\n  vec2 uv = gl_FragCoord.xy / resolution;\n\n  vec3 sum = V.xxx;\n  vec3 ccol = vec3( 0.0 );\n  float clen = 1E9;\n  for ( int ir = 0; ir < R_SAMPLES; ir ++ ) {\n    for ( int it = 0; it < T_SAMPLES; it ++ ) {\n      float theta = T_OFFSET + TAU * float( it ) / float( T_SAMPLES );\n      vec2 delta = R_INTERVAL * float( ir ) * vec2( cos( theta ), sin( theta ) );\n      bool center = ir == 0;\n      vec2 v = saturate( uv + delta / resolution );\n\n      float len = texture2D( samplerDepth, v ).x;\n\n      float gauss = min( GAUSS_RATE * abs( 1.0 / focus - 1.0 / len ), 1.0 );\n      float mul = texture2D( samplerGaussTable, vec2( ( float( ir ) + 0.5 ) / float( R_SAMPLES ), gauss ) ).x;\n\n      vec3 tex = mix(\n        texture2D( samplerPreDof, v ),\n        texture2D( sampler0, v ),\n        smoothstep( 0.0, 0.2, mul )\n      ).xyz;\n      vec3 col = mix( bgColor.xyz, tex, exp( -len * FOG ) );\n\n      sum += col * saturate( mul );\n\n      if ( center ) {\n        break;\n      }\n    }\n  }\n\n  gl_FragColor = vec4( sum, 1.0 );\n}\n",
    blend: [gl.ONE, gl.ZERO],
    clear: [0.0, 0.0, 0.0, 0.0],
    framebuffer: true,
    float: true,
    func: function func(path, params) {
      glCat.attribute("p", vboQuad, 2);
      glCat.uniform1f("focus", auto("focus"));
      glCat.uniformTexture("samplerDry", params.dry, 0);
      glCat.uniformTexture("samplerPreDof", params.predof, 1);
      glCat.uniformTexture("samplerDepth", params.depth, 2);
      glCat.uniformTexture("samplerGaussTable", glCatPath.fb("gaussTable").texture, 3);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
  },

  "Gowrock - bloom": {
    width: width / 4.0,
    height: height / 4.0,
    vert: "#define GLSLIFY 1\nattribute vec2 p;\n\nvoid main() {\n  gl_Position = vec4( p, 0.0, 1.0 );\n}\n",
    frag: "#define V vec2(0.,1.)\n#define saturate(i) clamp(i,0.,1.)\n#define PI 3.14159265\n#define SAMPLES 20\n\n// ------\n\nprecision highp float;\n#define GLSLIFY 1\n\nuniform vec2 resolution;\nuniform bool isVert;\nuniform sampler2D sampler0;\nuniform sampler2D samplerDry;\n\nuniform float gaussVar;\n\nfloat gaussian( float _x, float _v ) {\n  return 1.0 / sqrt( 2.0 * PI * _v ) * exp( - _x * _x / 2.0 / _v );\n}\n\nvoid main() {\n  vec2 uv = gl_FragCoord.xy / resolution;\n  vec2 bv = ( isVert ? vec2( 0.0, 1.0 ) : vec2( 1.0, 0.0 ) ) / resolution;\n\n  vec3 sum = V.xxx;\n  for ( int i = -SAMPLES; i <= SAMPLES; i ++ ) {\n    vec2 v = saturate( uv + bv * float( i ) );\n    vec3 tex = texture2D( sampler0, v ).xyz;\n    float mul = gaussian( abs( float( i ) ), gaussVar );\n    sum += tex * mul;\n  }\n\n  gl_FragColor = vec4( sum, 1.0 );\n}\n",
    blend: [gl.ONE, gl.ZERO],
    clear: [0.0, 0.0, 0.0, 0.0],
    tempFb: glCat.createFloatFramebuffer(width / 4.0, height / 4.0),
    framebuffer: true,
    float: true,
    func: function func(path, params) {
      for (var _i3 = 0; _i3 < 3; _i3++) {
        var gaussVar = [5.0, 15.0, 40.0][_i3];
        gl.bindFramebuffer(gl.FRAMEBUFFER, path.tempFb.framebuffer);
        glCat.clear.apply(glCat, _toConsumableArray(path.clear));

        glCat.attribute("p", vboQuad, 2);
        glCat.uniform1i("isVert", false);
        glCat.uniform1f("gaussVar", gaussVar);
        glCat.uniformTexture("sampler0", params.input, 0);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

        gl.bindFramebuffer(gl.FRAMEBUFFER, params.framebuffer);

        glCat.attribute("p", vboQuad, 2);
        glCat.uniform1i("isVert", true);
        glCat.uniform1f("gaussVar", gaussVar);
        glCat.uniformTexture("sampler0", path.tempFb.texture, 0);
        glCat.uniformTexture("samplerDry", params.input, 1);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      }
    }
  },

  bloomFinalize: {
    width: width,
    height: height,
    vert: "#define GLSLIFY 1\nattribute vec2 p;\n\nvoid main() {\n  gl_Position = vec4( p, 0.0, 1.0 );\n}\n",
    frag: "precision highp float;\n#define GLSLIFY 1\n\nuniform vec2 resolution;\nuniform sampler2D samplerDry;\nuniform sampler2D samplerWet;\n\nvoid main() {\n  vec2 uv = gl_FragCoord.xy / resolution;\n  vec3 dry = texture2D( samplerDry, uv ).xyz;\n  vec3 wet = texture2D( samplerWet, uv ).xyz;\n  gl_FragColor.xyz = (\n    dry +\n    max( vec3( 0.0 ), ( wet - 0.8 ) / 2.0 )\n  );\n  gl_FragColor.w = 1.0;\n}\n",
    blend: [gl.ONE, gl.ZERO],
    clear: [0.0, 0.0, 0.0, 0.0],
    framebuffer: true,
    float: true,
    func: function func(path, params) {
      glCat.attribute("p", vboQuad, 2);
      glCat.uniformTexture("samplerDry", params.dry, 0);
      glCat.uniformTexture("samplerWet", params.wet, 1);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
  },

  おたくはすぐポストエフェクトを挿す: {
    width: width,
    height: height,
    vert: "#define GLSLIFY 1\nattribute vec2 p;\n\nvoid main() {\n  gl_Position = vec4( p, 0.0, 1.0 );\n}\n",
    frag: "#define HUGE 9E16\n#define PI 3.14159265\n#define V vec3(0.,1.,-1.)\n#define saturate(i) clamp(i,0.,1.)\n#define lofi(i,m) (floor((i)/(m))*(m))\n\n// ------\n\nprecision highp float;\n#define GLSLIFY 1\n\nuniform float time;\nuniform vec2 resolution;\n\nuniform sampler2D sampler0;\n\n// ------\n\nvec3 barrel( float amp, vec2 uv ) {\n\tfloat corn = length( vec2( 0.5 ) );\n\tfloat a = min( 3.0 * sqrt( amp ), corn * PI );\n\tfloat zoom = corn / ( tan( corn * a ) + corn );\n\tvec2 p = saturate(\n    ( uv + normalize( uv - 0.5 ) * tan( length( uv - 0.5 ) * a ) ) * zoom +\n    0.5 * ( 1.0 - zoom )\n  );\n\treturn texture2D( sampler0, vec2( p.x, p.y ) ).xyz;\n}\n\n// ------\n\nvoid main() {\n  vec2 uv = gl_FragCoord.xy / resolution;\n  vec2 p = ( gl_FragCoord.xy * 2.0 - resolution ) / resolution.y;\n  float vig = 1.14 - length( p ) * 0.4;\n\n  vec3 tex = vec3( 0.0 );\n\n  for ( int i = 0; i < 10; i ++ ) {\n    float fi = float( i ) / 9.0;\n    vec3 a = saturate( vec3(\n      fi < 1.0 / 6.0 ? 1.0 : 1.0 - 3.0 * abs( 1.0 / 6.0 - fi ),\n      1.0 - 3.0 * abs( 1.0 / 2.0 - fi ),\n      5.0 / 6.0 < fi ? 1.0 : 1.0 - 3.0 * abs( 5.0 / 6.0 - fi )\n    ) ) / 10.0 * 3.0;\n    tex += a * barrel( 0.0 + 0.05 * fi, uv );\n  }\n\n  tex = mix(\n    vec3( 0.0 ),\n    tex,\n    vig\n  );\n\n  vec3 col = pow( saturate( tex.xyz ), vec3( 1.0 / 2.2 ) );\n  col = vec3(\n    smoothstep( -0.1, 1.1, col.x ),\n    smoothstep( 0.0, 1.0, col.y ),\n    smoothstep( -0.2, 1.2, col.z )\n  );\n\n  gl_FragColor = vec4( col, 1.0 );\n}",
    blend: [gl.ONE, gl.ZERO],
    clear: [0.0, 0.0, 0.0, 0.0],
    framebuffer: true,
    func: function func(path, params) {
      glCat.attribute("p", vboQuad, 2);
      glCat.uniformTexture("sampler0", params.input, 0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
  }
});

// ------

var updateUI = function updateUI() {
  var now = new Date();
  var deadline = new Date(2018, 1, 16, 0, 0);

  divCountdown.innerText = "Deadline: " + Math.floor((deadline - now) / 1000);
};

// ------

glCatPath.render("gaussTable");

var update = function update() {
  if (!tweak.checkbox("play", { value: true })) {
    setTimeout(update, 100);
    return;
  }

  automaton.update();

  if (automaton.frame === 0) {
    (0, _xorshift2.default)(179067891367);
  }

  updateUI();
  updateMatrices();

  textureRandomUpdate(textureRandom);

  // ------

  glCatPath.begin();

  glCatPath.render("🐬");
  glCatPath.render("影");

  // ------

  glCatPath.render("particlesComputeReturn");
  glCatPath.render("particlesCompute");

  glCatPath.render("terrainCompute");

  // ------

  glCatPath.render("cube", {
    target: glCatPath.fb("影"),
    isShadow: true,
    width: shadowSize,
    height: shadowSize
  });

  glCatPath.render("terrainRender", {
    target: glCatPath.fb("影"),
    isShadow: true,
    width: shadowSize,
    height: shadowSize
  });

  glCatPath.render("raymarch", {
    target: glCatPath.fb("影"),
    isShadow: true,
    width: shadowSize,
    height: shadowSize
  });

  glCatPath.render("particlesRender", {
    target: glCatPath.fb("影"),
    isShadow: true,
    width: shadowSize,
    height: shadowSize
  });

  glCatPath.render("cube", {
    target: glCatPath.fb("🐬"),
    isShadow: false
  });

  glCatPath.render("terrainRender", {
    target: glCatPath.fb("🐬"),
    isShadow: false
  });

  glCatPath.render("raymarch", {
    target: glCatPath.fb("🐬"),
    isShadow: false
  });

  glCatPath.render("particlesRender", {
    target: glCatPath.fb("🐬")
  });

  glCatPath.render("fxaa", {
    input: glCatPath.fb("🐬").textures[0]
  });

  glCatPath.render("gauss", {
    target: framebufferPreDof,
    input: glCatPath.fb("fxaa").texture,
    width: width,
    height: height,
    var: 5.0
  });

  glCatPath.render("dof", {
    dry: glCatPath.fb("fxaa").texture,
    predof: framebufferPreDof.texture,
    depth: glCatPath.fb("🐬").textures[1]
  });

  glCatPath.render("Gowrock - bloom", {
    input: framebufferPreDof.texture
  });
  glCatPath.render("bloomFinalize", {
    dry: glCatPath.fb("dof").texture,
    wet: glCatPath.fb("Gowrock - bloom").texture
  });

  glCatPath.render("おたくはすぐポストエフェクトを挿す", {
    target: _glcatPathGui2.default.nullFb,
    input: glCatPath.fb("bloomFinalize").texture
  });

  glCatPath.end();

  init = false;
  totalFrame++;

  // ------

  if (tweak.checkbox("save", { value: false })) {
    saveFrame();
  }

  requestAnimationFrame(update);
};

update();

// ------

window.addEventListener("keydown", function (_e) {
  if (_e.which === 27) {
    tweak.checkbox("play", { set: false });
  }
});

},{"./cube":"/Users/Yutaka/Dropbox/pro/_Projects/_eom/20180216/src/script/cube.js","./libs/glcat":"/Users/Yutaka/Dropbox/pro/_Projects/_eom/20180216/src/script/libs/glcat.js","./libs/glcat-path-gui":"/Users/Yutaka/Dropbox/pro/_Projects/_eom/20180216/src/script/libs/glcat-path-gui.js","./libs/mathcat":"/Users/Yutaka/Dropbox/pro/_Projects/_eom/20180216/src/script/libs/mathcat.js","./libs/tweak":"/Users/Yutaka/Dropbox/pro/_Projects/_eom/20180216/src/script/libs/tweak.js","./libs/xorshift":"/Users/Yutaka/Dropbox/pro/_Projects/_eom/20180216/src/script/libs/xorshift.js"}]},{},["/Users/Yutaka/Dropbox/pro/_Projects/_eom/20180216/src/script/main.js"])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvc2NyaXB0L2N1YmUuanMiLCJzcmMvc2NyaXB0L2xpYnMvZ2xjYXQtcGF0aC1ndWkuanMiLCJzcmMvc2NyaXB0L2xpYnMvZ2xjYXQtcGF0aC5qcyIsInNyYy9zY3JpcHQvbGlicy9nbGNhdC5qcyIsInNyYy9zY3JpcHQvbGlicy9tYXRoY2F0LmpzIiwic3JjL3NjcmlwdC9saWJzL3R3ZWFrLmpzIiwic3JjL3NjcmlwdC9saWJzL3hvcnNoaWZ0LmpzIiwic3JjL3NjcmlwdC9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7QUNBQSxJQUFJLE1BQU0sRUFBVjtBQUNBLElBQUksTUFBTSxFQUFWOzsyQkFFVSxDO0FBQ1IsTUFBSSxJQUFJLENBQ04sQ0FBRSxDQUFDLENBQUgsRUFBTSxDQUFDLENBQVAsRUFBVyxDQUFYLENBRE0sRUFFTixDQUFHLENBQUgsRUFBTSxDQUFDLENBQVAsRUFBVyxDQUFYLENBRk0sRUFHTixDQUFHLENBQUgsRUFBTyxDQUFQLEVBQVcsQ0FBWCxDQUhNLEVBSU4sQ0FBRSxDQUFDLENBQUgsRUFBTSxDQUFDLENBQVAsRUFBVyxDQUFYLENBSk0sRUFLTixDQUFHLENBQUgsRUFBTyxDQUFQLEVBQVcsQ0FBWCxDQUxNLEVBTU4sQ0FBRSxDQUFDLENBQUgsRUFBTyxDQUFQLEVBQVcsQ0FBWCxDQU5NLENBQVI7QUFRQSxNQUFJLElBQUksQ0FDTixDQUFFLENBQUYsRUFBSyxDQUFMLEVBQVEsQ0FBUixDQURNLEVBRU4sQ0FBRSxDQUFGLEVBQUssQ0FBTCxFQUFRLENBQVIsQ0FGTSxFQUdOLENBQUUsQ0FBRixFQUFLLENBQUwsRUFBUSxDQUFSLENBSE0sRUFJTixDQUFFLENBQUYsRUFBSyxDQUFMLEVBQVEsQ0FBUixDQUpNLEVBS04sQ0FBRSxDQUFGLEVBQUssQ0FBTCxFQUFRLENBQVIsQ0FMTSxFQU1OLENBQUUsQ0FBRixFQUFLLENB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ekIsRUFBb0MsVUFBRSxFQUFGLEVBQVU7QUFDNUMsTUFBSyxHQUFHLEtBQUgsS0FBYSxFQUFsQixFQUF1QjtBQUNyQixVQUFNLFFBQU4sQ0FBZ0IsTUFBaEIsRUFBd0IsRUFBRSxLQUFLLEtBQVAsRUFBeEI7QUFDRDtBQUNGLENBSkQiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwibGV0IHBvcyA9IFtdO1xubGV0IG5vciA9IFtdO1xuXG5mb3IgKCBsZXQgaSA9IDA7IGkgPCA2OyBpICsrICkge1xuICBsZXQgcCA9IFtcbiAgICBbIC0xLCAtMSwgIDEgXSxcbiAgICBbICAxLCAtMSwgIDEgXSxcbiAgICBbICAxLCAgMSwgIDEgXSxcbiAgICBbIC0xLCAtMSwgIDEgXSxcbiAgICBbICAxLCAgMSwgIDEgXSxcbiAgICBbIC0xLCAgMSwgIDEgXVxuICBdO1xuICBsZXQgbiA9IFtcbiAgICBbIDAsIDAsIDEgXSxcbiAgICBbIDAsIDAsIDEgXSxcbiAgICBbIDAsIDAsIDEgXSxcbiAgICBbIDAsIDAsIDEgXSxcbiAgICBbIDAsIDAsIDEgXSxcbiAgICBbIDAsIDAsIDEgXVxuICBdO1xuXG4gIGlmICggaSAhPT0gMCApIHtcbiAgICBsZXQgZnVuYyA9ICggdiApID0+IHtcbiAgICAgIGlmICggaSA8IDQgKSB7XG4gICAgICAgIGxldCB0ID0gaSAqIE1hdGguUEkgLyAyLjA7XG4gICAgICAgIGxldCB4ID0gdlsgMCBdO1xuICAgICAgICBsZXQgeiA9IHZbIDIgXTtcbiAgICAgICAgdlsgMCBdID0gTWF0aC5jb3MoIHQgKSAqIHggLSBNYXRoLnNpbiggdCApICogejtcbiAgICAgICAgdlsgMiBdID0gTWF0aC5zaW4oIHQgKSAqIHggKyBNYXRoLmNvcyggdCApICogejtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxldCB0ID0gKCBpIC0gMC41ICkgKiBNYXRoLlBJO1xuICAgICAgICBsZXQgeSA9IHZbIDEgXTtcbiAgICAgICAgbGV0IHogPSB2WyAyIF07XG4gICAgICAgIHZbIDEgXSA9IE1hdGguY29zKCB0ICkgKiB5IC0gTWF0aC5zaW4oIHQgKSAqIHo7XG4gICAgICAgIHZbIDIgXSA9IE1hdGguc2luKCB0ICkgKiB5ICsgTWF0aC5jb3MoIHQgKSAqIHo7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHAubWFwKCBmdW5jICk7XG4gICAgbi5tYXAoIGZ1bmMgKTtcbiAgfVxuXG4gIHAubWFwKCB2ID0+IHBvcy5wdXNoKCAuLi52ICkgKTtcbiAgbi5tYXAoIHYgPT4gbm9yLnB1c2goIC4uLnYgKSApO1xufVxuXG5leHBvcnQgZGVmYXVsdCB7XG4gIHBvczogcG9zLFxuICBub3I6IG5vclxufSIsImltcG9ydCBQYXRoIGZyb20gJy4vZ2xjYXQtcGF0aCc7XG5cbmNvbnN0IGdsc2xpZnkgPSByZXF1aXJlKCAnZ2xzbGlmeScgKTtcblxubGV0IHJlcXVpcmVkRmllbGRzID0gKCBvYmplY3QsIG5hbml0aGVmdWNrLCBmaWVsZHMgKSA9PiB7XG4gIGZpZWxkcy5tYXAoIGZpZWxkID0+IHtcbiAgICBpZiAoIHR5cGVvZiBvYmplY3RbIGZpZWxkIF0gPT09IFwidW5kZWZpbmVkXCIgKSB7XG4gICAgICB0aHJvdyBcIkdMQ2F0LVBhdGg6IFwiICsgZmllbGQgKyBcIiBpcyByZXF1aXJlZCBmb3IgXCIgKyBuYW5pdGhlZnVjaztcbiAgICB9XG4gIH0gKTtcbn07XG5cbmxldCBQYXRoR1VJID0gY2xhc3MgZXh0ZW5kcyBQYXRoIHtcbiAgY29uc3RydWN0b3IoIGdsQ2F0LCBwYXJhbXMgKSB7XG4gICAgc3VwZXIoIGdsQ2F0LCBwYXJhbXMgKTtcbiAgICBsZXQgaXQgPSB0aGlzO1xuXG4gICAgcmVxdWlyZWRGaWVsZHMoIHBhcmFtcywgXCJwYXJhbXNcIiwgW1xuICAgICAgXCJjYW52YXNcIixcbiAgICAgIFwiZWxcIlxuICAgIF0gKTtcblxuICAgIGl0Lmd1aSA9IHsgcGFyZW50OiBpdC5wYXJhbXMuZWwgfTtcblxuICAgIGl0Lmd1aS5pbmZvID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggXCJzcGFuXCIgKTtcbiAgICBpdC5ndWkucGFyZW50LmFwcGVuZENoaWxkKCBpdC5ndWkuaW5mbyApO1xuICAgIFxuICAgIGl0Lmd1aS5yYW5nZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoIFwiaW5wdXRcIiApO1xuICAgIGl0Lmd1aS5yYW5nZS50eXBlID0gXCJyYW5nZVwiO1xuICAgIGl0Lmd1aS5yYW5nZS5taW4gPSAwO1xuICAgIGl0Lmd1aS5yYW5nZS5tYXggPSAwO1xuICAgIGl0Lmd1aS5yYW5nZS5zdGVwID0gMTtcbiAgICBpdC5ndWkucGFyZW50LmFwcGVuZENoaWxkKCBpdC5ndWkucmFuZ2UgKTtcblxuICAgIGl0LmRhdGVMaXN0ID0gbmV3IEFycmF5KCAzMCApLmZpbGwoIDAgKTtcbiAgICBpdC5kYXRlTGlzdEluZGV4ID0gMDtcbiAgICBpdC50b3RhbEZyYW1lcyA9IDA7XG4gICAgaXQuZnBzID0gMDtcbiAgICBpdC5jdXJyZW50SW5kZXggPSAwO1xuICAgIGl0LnZpZXdOYW1lID0gXCJcIjtcbiAgICBpdC52aWV3SW5kZXggPSAwO1xuXG4gICAgbGV0IGdsID0gZ2xDYXQuZ2w7XG4gICAgbGV0IHZib1F1YWQgPSBnbENhdC5jcmVhdGVWZXJ0ZXhidWZmZXIoIFsgLTEsIC0xLCAxLCAtMSwgLTEsIDEsIDEsIDEgXSApO1xuICAgIGl0LmFkZCgge1xuICAgICAgX19QYXRoR3VpUmV0dXJuOiB7XG4gICAgICAgIHdpZHRoOiBpdC5wYXJhbXMuY2FudmFzLndpZHRoLFxuICAgICAgICBoZWlnaHQ6IGl0LnBhcmFtcy5jYW52YXMuaGVpZ2h0LFxuICAgICAgICB2ZXJ0OiBcImF0dHJpYnV0ZSB2ZWMyIHA7dm9pZCBtYWluKCl7Z2xfUG9zaXRpb249dmVjNChwLDAsMSk7fVwiLFxuICAgICAgICBmcmFnOiBcInByZWNpc2lvbiBoaWdocCBmbG9hdDt1bmlmb3JtIHZlYzIgcjt1bmlmb3JtIHNhbXBsZXIyRCBzO3ZvaWQgbWFpbigpe2dsX0ZyYWdDb2xvcj10ZXh0dXJlMkQocyxnbF9GcmFnQ29vcmQueHkvcik7fVwiLFxuICAgICAgICBibGVuZDogWyBnbC5PTkUsIGdsLk9ORSBdLFxuICAgICAgICBjbGVhcjogWyAwLjAsIDAuMCwgMC4wLCAxLjAgXSxcbiAgICAgICAgZnVuYzogKCBfcCwgcGFyYW1zICkgPT4ge1xuICAgICAgICAgIGdsLnZpZXdwb3J0KCAwLCAwLCBpdC5wYXJhbXMuY2FudmFzLndpZHRoLCBpdC5wYXJhbXMuY2FudmFzLmhlaWdodCApO1xuICAgICAgICAgIGdsQ2F0LnVuaWZvcm0yZnYoICdyJywgWyBpdC5wYXJhbXMuY2FudmFzLndpZHRoLCBpdC5wYXJhbXMuY2FudmFzLmhlaWdodCBdICk7XG4gICAgXG4gICAgICAgICAgZ2xDYXQuYXR0cmlidXRlKCAncCcsIHZib1F1YWQsIDIgKTtcbiAgICAgICAgICBnbENhdC51bmlmb3JtVGV4dHVyZSggJ3MnLCBwYXJhbXMuaW5wdXQsIDAgKTtcbiAgICAgICAgICBnbC5kcmF3QXJyYXlzKCBnbC5UUklBTkdMRV9TVFJJUCwgMCwgNCApO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgIH0gKTtcbiAgfVxuXG4gIGJlZ2luKCkge1xuICAgIGxldCBpdCA9IHRoaXM7XG5cbiAgICBpdC5jdXJyZW50SW5kZXggPSAwO1xuICB9XG5cbiAgZW5kKCkge1xuICAgIGxldCBpdCA9IHRoaXM7XG5cbiAgICBpdC5ndWkucmFuZ2UubWF4ID0gTWF0aC5tYXgoIGl0Lmd1aS5yYW5nZS5tYXgsIGl0LmN1cnJlbnRJbmRleCApO1xuICAgIGl0LmN1cnJlbnRJbmRleCA9IDA7XG5cbiAgICBsZXQgbm93ID0gK25ldyBEYXRlKCkgKiAxRS0zO1xuICAgIGl0LmRhdGVMaXN0WyBpdC5kYXRlTGlzdEluZGV4IF0gPSBub3c7XG4gICAgaXQuZGF0ZUxpc3RJbmRleCA9ICggaXQuZGF0ZUxpc3RJbmRleCArIDEgKSAlIGl0LmRhdGVMaXN0Lmxlbmd0aDtcbiAgICBpdC5mcHMgPSAoXG4gICAgICAoIGl0LmRhdGVMaXN0Lmxlbmd0aCAtIDEgKVxuICAgICAgLyAoIG5vdyAtIGl0LmRhdGVMaXN0WyBpdC5kYXRlTGlzdEluZGV4IF0gKVxuICAgICkudG9GaXhlZCggMSApO1xuICAgIFxuICAgIGl0LnRvdGFsRnJhbWVzICsrO1xuXG4gICAgaXQuZ3VpLmluZm8uaW5uZXJUZXh0ID0gKFxuICAgICAgXCJQYXRoOiBcIiArIGl0LnZpZXdOYW1lICsgXCIgKFwiICsgaXQudmlld0luZGV4ICsgXCIpXFxuXCJcbiAgICAgICsgaXQuZnBzICsgXCIgRlBTXFxuXCJcbiAgICAgICsgaXQudG90YWxGcmFtZXMgKyBcIiBmcmFtZXNcXG5cIlxuICAgICk7XG4gIH1cblxuICByZW5kZXIoIG5hbWUsIHBhcmFtcyApIHtcbiAgICBsZXQgaXQgPSB0aGlzO1xuICAgIFxuICAgIGl0LmN1cnJlbnRJbmRleCArKztcbiAgICBsZXQgdmlldyA9IHBhcnNlSW50KCBpdC5ndWkucmFuZ2UudmFsdWUgKTtcblxuICAgIGlmICggaXQuY3VycmVudEluZGV4IDw9IHZpZXcgfHwgdmlldyA9PT0gMCApIHtcbiAgICAgIGl0LnZpZXdOYW1lID0gdmlldyA9PT0gMCA/IFwiKkZ1bGwqXCIgOiBuYW1lO1xuICAgICAgaXQudmlld0luZGV4ID0gaXQuY3VycmVudEluZGV4O1xuXG4gICAgICBzdXBlci5yZW5kZXIoIG5hbWUsIHBhcmFtcyApO1xuXG4gICAgICBpZiAoIGl0LmN1cnJlbnRJbmRleCA9PT0gdmlldyApIHtcbiAgICAgICAgbGV0IHQgPSAoXG4gICAgICAgICAgKCBwYXJhbXMgJiYgcGFyYW1zLnRhcmdldCApXG4gICAgICAgICAgPyBwYXJhbXMudGFyZ2V0XG4gICAgICAgICAgOiBpdC5wYXRoc1sgbmFtZSBdLmZyYW1lYnVmZmVyXG4gICAgICAgICk7XG5cbiAgICAgICAgaWYgKCB0ICYmIHQuZnJhbWVidWZmZXIgKSB7XG4gICAgICAgICAgbGV0IGkgPSB0LnRleHR1cmVzID8gdC50ZXh0dXJlc1sgMCBdIDogdC50ZXh0dXJlO1xuICAgICAgICAgIGlmICggaXQucGFyYW1zLnN0cmV0Y2ggKSB7XG4gICAgICAgICAgICBzdXBlci5yZW5kZXIoIFwiX19QYXRoR3VpUmV0dXJuXCIsIHtcbiAgICAgICAgICAgICAgdGFyZ2V0OiBQYXRoR1VJLm51bGxGYixcbiAgICAgICAgICAgICAgaW5wdXQ6IGksXG4gICAgICAgICAgICAgIHdpZHRoOiBpdC5wYXJhbXMuY2FudmFzLndpZHRoLFxuICAgICAgICAgICAgICBoZWlnaHQ6IGl0LnBhcmFtcy5jYW52YXMuaGVpZ2h0XG4gICAgICAgICAgICB9ICk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGl0LnBhcmFtcy5jYW52YXMud2lkdGggPSAoIHBhcmFtcyA/IHBhcmFtcy53aWR0aCA6IDAgKSB8fCBpdC5wYXRoc1sgbmFtZSBdLndpZHRoIHx8IGl0LnBhcmFtcy53aWR0aDtcbiAgICAgICAgICAgIGl0LnBhcmFtcy5jYW52YXMuaGVpZ2h0ID0gKCBwYXJhbXMgPyBwYXJhbXMuaGVpZ2h0IDogMCApIHx8IGl0LnBhdGhzWyBuYW1lIF0uaGVpZ2h0IHx8IGl0LnBhcmFtcy5oZWlnaHQ7XG4gICAgICAgICAgICBzdXBlci5yZW5kZXIoIFwiX19QYXRoR3VpUmV0dXJuXCIsIHtcbiAgICAgICAgICAgICAgdGFyZ2V0OiBQYXRoR1VJLm51bGxGYixcbiAgICAgICAgICAgICAgaW5wdXQ6IGlcbiAgICAgICAgICAgIH0gKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IFBhdGhHVUk7IiwiY29uc3QgZ2xzbGlmeSA9IHJlcXVpcmUoICdnbHNsaWZ5JyApO1xuXG5sZXQgcmVxdWlyZWRGaWVsZHMgPSAoIG9iamVjdCwgbmFuaXRoZWZ1Y2ssIGZpZWxkcyApID0+IHtcbiAgZmllbGRzLm1hcCggZmllbGQgPT4ge1xuICAgIGlmICggdHlwZW9mIG9iamVjdFsgZmllbGQgXSA9PT0gXCJ1bmRlZmluZWRcIiApIHtcbiAgICAgIHRocm93IFwiR0xDYXQtUGF0aDogXCIgKyBmaWVsZCArIFwiIGlzIHJlcXVpcmVkIGZvciBcIiArIG5hbml0aGVmdWNrO1xuICAgIH1cbiAgfSApO1xufTtcblxubGV0IFBhdGggPSBjbGFzcyB7XG4gIGNvbnN0cnVjdG9yKCBnbENhdCwgcGFyYW1zICkge1xuICAgIGxldCBpdCA9IHRoaXM7XG5cbiAgICBpdC5nbENhdCA9IGdsQ2F0O1xuICAgIGl0LmdsID0gZ2xDYXQuZ2w7XG5cbiAgICBpdC5wYXRocyA9IHt9O1xuICAgIGl0Lmdsb2JhbEZ1bmMgPSAoKSA9PiB7fTtcbiAgICBpdC5wYXJhbXMgPSBwYXJhbXMgfHwge307XG4gIH1cblxuICBhZGQoIHBhdGhzICkge1xuICAgIGxldCBpdCA9IHRoaXM7XG5cbiAgICBmb3IgKCBsZXQgbmFtZSBpbiBwYXRocyApIHtcbiAgICAgIGxldCBwYXRoID0gcGF0aHNbIG5hbWUgXTtcbiAgICAgIHJlcXVpcmVkRmllbGRzKCBwYXRoLCBcInBhdGggb2JqZWN0XCIsIFtcbiAgICAgICAgXCJ3aWR0aFwiLFxuICAgICAgICBcImhlaWdodFwiLFxuICAgICAgICBcInZlcnRcIixcbiAgICAgICAgXCJmcmFnXCJcbiAgICAgIF0gKTtcbiAgICAgIGl0LnBhdGhzWyBuYW1lIF0gPSBwYXRoO1xuXG4gICAgICBpZiAoIHR5cGVvZiBwYXRoLmRlcHRoVGVzdCA9PT0gXCJ1bmRlZmluZWRcIiApIHsgcGF0aC5kZXB0aFRlc3QgPSB0cnVlOyB9XG4gICAgICBpZiAoIHR5cGVvZiBwYXRoLmJsZW5kID09PSBcInVuZGVmaW5lZFwiICkgeyBwYXRoLmJsZW5kID0gWyBpdC5nbC5TUkNfQUxQSEEsIGl0LmdsLk9ORV9NSU5VU19TUkNfQUxQSEEgXTsgfVxuICAgICAgaWYgKCB0eXBlb2YgcGF0aC5jdWxsID09PSBcInVuZGVmaW5lZFwiICkgeyBwYXRoLmN1bGwgPSB0cnVlOyB9XG4gICAgICBcbiAgICAgIGlmICggcGF0aC5mcmFtZWJ1ZmZlciApIHtcbiAgICAgICAgaWYgKCBwYXRoLmRyYXdidWZmZXJzICkge1xuICAgICAgICAgIHBhdGguZnJhbWVidWZmZXIgPSBpdC5nbENhdC5jcmVhdGVEcmF3QnVmZmVycyggcGF0aC53aWR0aCwgcGF0aC5oZWlnaHQsIHBhdGguZHJhd2J1ZmZlcnMgKTtcbiAgICAgICAgfSBlbHNlIGlmICggcGF0aC5mbG9hdCApIHtcbiAgICAgICAgICBwYXRoLmZyYW1lYnVmZmVyID0gaXQuZ2xDYXQuY3JlYXRlRmxvYXRGcmFtZWJ1ZmZlciggcGF0aC53aWR0aCwgcGF0aC5oZWlnaHQgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBwYXRoLmZyYW1lYnVmZmVyID0gaXQuZ2xDYXQuY3JlYXRlRnJhbWVidWZmZXIoIHBhdGgud2lkdGgsIHBhdGguaGVpZ2h0ICk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcGF0aC5wcm9ncmFtID0gaXQuZ2xDYXQuY3JlYXRlUHJvZ3JhbSggcGF0aC52ZXJ0LCBwYXRoLmZyYWcgKTtcbiAgICB9XG4gIH1cblxuICByZW5kZXIoIG5hbWUsIHBhcmFtcyApIHtcbiAgICBsZXQgaXQgPSB0aGlzO1xuIFxuICAgIGxldCBwYXRoID0gaXQucGF0aHNbIG5hbWUgXTtcbiAgICBpZiAoICFwYXRoICkgeyB0aHJvdyBcIkdMQ2F0LVBhdGg6IFRoZSBwYXRoIGNhbGxlZCBcIiArIG5hbWUgKyBcIiBpcyBub3QgZGVmaW5lZCFcIjsgfVxuICAgIFxuICAgIGlmICggIXBhcmFtcyApIHsgcGFyYW1zID0ge307IH1cbiAgICBwYXJhbXMuZnJhbWVidWZmZXIgPSB0eXBlb2YgcGFyYW1zLnRhcmdldCAhPT0gXCJ1bmRlZmluZWRcIiA/IHBhcmFtcy50YXJnZXQuZnJhbWVidWZmZXIgOiBwYXRoLmZyYW1lYnVmZmVyID8gcGF0aC5mcmFtZWJ1ZmZlci5mcmFtZWJ1ZmZlciA6IG51bGw7XG5cbiAgICBsZXQgd2lkdGggPSBwYXJhbXMud2lkdGggfHwgcGF0aC53aWR0aDtcbiAgICBsZXQgaGVpZ2h0ID0gcGFyYW1zLmhlaWdodCB8fCBwYXRoLmhlaWdodDtcbiAgICBcbiAgICBpdC5nbC52aWV3cG9ydCggMCwgMCwgd2lkdGgsIGhlaWdodCApO1xuICAgIGl0LmdsQ2F0LnVzZVByb2dyYW0oIHBhdGgucHJvZ3JhbSApO1xuICAgIHBhdGguY3VsbCA/IGl0LmdsLmVuYWJsZSggaXQuZ2wuQ1VMTF9GQUNFICkgOiBpdC5nbC5kaXNhYmxlKCBpdC5nbC5DVUxMX0ZBQ0UgKTtcbiAgICBpdC5nbC5iaW5kRnJhbWVidWZmZXIoIGl0LmdsLkZSQU1FQlVGRkVSLCBwYXJhbXMuZnJhbWVidWZmZXIgKTtcbiAgICBpZiAoIGl0LnBhcmFtcy5kcmF3YnVmZmVycyApIHtcbiAgICAgIGl0LmdsQ2F0LmRyYXdCdWZmZXJzKCBwYXRoLmRyYXdidWZmZXJzID8gcGF0aC5kcmF3YnVmZmVycyA6IHBhcmFtcy5mcmFtZWJ1ZmZlciA9PT0gbnVsbCA/IFsgaXQuZ2wuQkFDSyBdIDogWyBpdC5nbC5DT0xPUl9BVFRBQ0hNRU5UMCBdICk7XG4gICAgfVxuICAgIGl0LmdsLmJsZW5kRnVuYyggLi4ucGF0aC5ibGVuZCApO1xuICAgIGlmICggcGF0aC5jbGVhciApIHsgaXQuZ2xDYXQuY2xlYXIoIC4uLnBhdGguY2xlYXIgKTsgfVxuICAgIHBhdGguZGVwdGhUZXN0ID8gaXQuZ2wuZW5hYmxlKCBpdC5nbC5ERVBUSF9URVNUICkgOiBpdC5nbC5kaXNhYmxlKCBpdC5nbC5ERVBUSF9URVNUICk7XG4gXG4gICAgaXQuZ2xDYXQudW5pZm9ybTJmdiggJ3Jlc29sdXRpb24nLCBbIHdpZHRoLCBoZWlnaHQgXSApO1xuICAgIGl0Lmdsb2JhbEZ1bmMoIHBhdGgsIHBhcmFtcyApO1xuXG4gICAgaWYgKCBwYXRoLmZ1bmMgKSB7IHBhdGguZnVuYyggcGF0aCwgcGFyYW1zICk7IH1cbiAgfVxuXG4gIHJlc2l6ZSggbmFtZSwgd2lkdGgsIGhlaWdodCApIHtcbiAgICBsZXQgaXQgPSB0aGlzO1xuXG4gICAgbGV0IHBhdGggPSBpdC5wYXRoc1sgbmFtZSBdO1xuXG4gICAgcGF0aC53aWR0aCA9IHdpZHRoO1xuICAgIHBhdGguaGVpZ2h0ID0gaGVpZ2h0O1xuXG4gICAgaWYgKCBwYXRoLmZyYW1lYnVmZmVyICkge1xuICAgICAgaWYgKCBpdC5wYXJhbXMuZHJhd2J1ZmZlcnMgJiYgcGF0aC5kcmF3YnVmZmVycyApIHtcbiAgICAgICAgcGF0aC5mcmFtZWJ1ZmZlciA9IGl0LmdsQ2F0LmNyZWF0ZURyYXdCdWZmZXJzKCBwYXRoLndpZHRoLCBwYXRoLmhlaWdodCwgcGF0aC5kcmF3YnVmZmVycyApO1xuICAgICAgfSBlbHNlIGlmICggcGF0aC5mbG9hdCApIHtcbiAgICAgICAgaXQuZ2xDYXQucmVzaXplRmxvYXRGcmFtZWJ1ZmZlciggcGF0aC5mcmFtZWJ1ZmZlciwgcGF0aC53aWR0aCwgcGF0aC5oZWlnaHQgKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGl0LmdsQ2F0LnJlc2l6ZUZyYW1lYnVmZmVyKCBwYXRoLmZyYW1lYnVmZmVyLCBwYXRoLndpZHRoLCBwYXRoLmhlaWdodCApO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICggdHlwZW9mIHBhdGgub25yZXNpemUgPT09IFwiZnVuY3Rpb25cIiApIHtcbiAgICAgIHBhdGgub25yZXNpemUoIHBhdGgsIHdpZHRoLCBoZWlnaHQgKTtcbiAgICB9XG4gIH1cblxuICBzZXRHbG9iYWxGdW5jKCBmdW5jICkgeyB0aGlzLmdsb2JhbEZ1bmMgPSBmdW5jOyB9XG5cbiAgZmIoIG5hbWUgKSB7XG4gICAgaWYgKCAhdGhpcy5wYXRoc1sgbmFtZSBdICkgeyB0aHJvdyBcImdsY2F0LXBhdGguZmI6IHBhdGggY2FsbGVkIFwiICsgbmFtZSArIFwiIGlzIG5vdCBkZWZpbmVkXCI7IH1cbiAgICBpZiAoICF0aGlzLnBhdGhzWyBuYW1lIF0uZnJhbWVidWZmZXIgKSB7IHRocm93IFwiZ2xjYXQtcGF0aC5mYjogdGhlcmUgaXMgbm8gZnJhbWVidWZmZXIgZm9yIHRoZSBwYXRoIFwiICsgbmFtZTsgfVxuXG4gICAgcmV0dXJuIHRoaXMucGF0aHNbIG5hbWUgXS5mcmFtZWJ1ZmZlcjtcbiAgfVxufTtcblxuUGF0aC5udWxsRmIgPSB7IGZyYW1lYnVmZmVyOiBudWxsIH07XG5cbmV4cG9ydCBkZWZhdWx0IFBhdGg7IiwibGV0IEdMQ2F0ID0gY2xhc3Mge1xuXHRjb25zdHJ1Y3RvciggX2dsICkge1xuXHRcdGxldCBpdCA9IHRoaXM7XG5cblx0XHRpdC5nbCA9IF9nbDtcbiAgICBsZXQgZ2wgPSBpdC5nbDtcblxuXHQgIGdsLmVuYWJsZSggZ2wuREVQVEhfVEVTVCApO1xuXHQgIGdsLmRlcHRoRnVuYyggZ2wuTEVRVUFMICk7XG5cdCAgZ2wuZW5hYmxlKCBnbC5CTEVORCApO1xuXHQgIGdsLmJsZW5kRnVuYyggZ2wuU1JDX0FMUEhBLCBnbC5PTkVfTUlOVVNfU1JDX0FMUEhBICk7XG5cblx0XHRpdC5leHRlbnNpb25zID0ge307XG5cblx0XHRpdC5jdXJyZW50UHJvZ3JhbSA9IG51bGw7XG5cdH1cblxuXHRnZXRFeHRlbnNpb24oIF9uYW1lLCBfdGhyb3cgKSB7XG4gICAgbGV0IGl0ID0gdGhpcztcbiAgICBsZXQgZ2wgPSBpdC5nbDtcblxuXHRcdGlmICggdHlwZW9mIF9uYW1lID09PSBcIm9iamVjdFwiICYmIF9uYW1lLmlzQXJyYXkoKSApIHtcblx0XHRcdHJldHVybiBfbmFtZS5ldmVyeSggbmFtZSA9PiBpdC5nZXRFeHRlbnNpb24oIG5hbWUsIF90aHJvdyApICk7XG5cdFx0fSBlbHNlIGlmICggdHlwZW9mIF9uYW1lID09PSBcInN0cmluZ1wiICkge1xuXHRcdFx0aWYgKCBpdC5leHRlbnNpb25zWyBfbmFtZSBdICkge1xuXHRcdFx0XHRyZXR1cm4gaXQuZXh0ZW5zaW9uc1sgX25hbWUgXTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGl0LmV4dGVuc2lvbnNbIF9uYW1lIF0gPSBnbC5nZXRFeHRlbnNpb24oIF9uYW1lICk7XG5cdFx0XHRcdGlmICggaXQuZXh0ZW5zaW9uc1sgX25hbWUgXSApIHtcblx0XHRcdFx0XHRyZXR1cm4gaXQuZXh0ZW5zaW9uc1sgX25hbWUgXTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRpZiAoIF90aHJvdyApIHtcblx0XHRcdFx0XHRcdHRocm93IGNvbnNvbGUuZXJyb3IoIFwiVGhlIGV4dGVuc2lvbiBcXFwiXCIgKyBfbmFtZSArIFwiXFxcIiBpcyBub3Qgc3VwcG9ydGVkXCIgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gISEoIGl0LmV4dGVuc2lvbnNbIF9uYW1lIF0gKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhyb3cgXCJHTENhdC5nZXRFeHRlbnNpb246IF9uYW1lIG11c3QgYmUgc3RyaW5nIG9yIGFycmF5XCJcblx0XHR9XG5cdH1cblxuXHRjcmVhdGVQcm9ncmFtKCBfdmVydCwgX2ZyYWcsIF9vbkVycm9yICkge1xuXHRcdGxldCBpdCA9IHRoaXM7XG5cdFx0bGV0IGdsID0gaXQuZ2w7XG5cblx0XHRsZXQgZXJyb3I7XG5cdFx0aWYgKCB0eXBlb2YgX29uRXJyb3IgPT09ICdmdW5jdGlvbicgKSB7XG5cdFx0XHRlcnJvciA9IF9vbkVycm9yO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRlcnJvciA9ICggX3N0ciApID0+IHsgY29uc29sZS5lcnJvciggX3N0ciApOyB9XG5cdFx0fVxuXG5cdFx0bGV0IHZlcnQgPSBnbC5jcmVhdGVTaGFkZXIoIGdsLlZFUlRFWF9TSEFERVIgKTtcblx0XHRnbC5zaGFkZXJTb3VyY2UoIHZlcnQsIF92ZXJ0ICk7XG5cdFx0Z2wuY29tcGlsZVNoYWRlciggdmVydCApO1xuXHRcdGlmICggIWdsLmdldFNoYWRlclBhcmFtZXRlciggdmVydCwgZ2wuQ09NUElMRV9TVEFUVVMgKSApIHtcblx0XHRcdGVycm9yKCBnbC5nZXRTaGFkZXJJbmZvTG9nKCB2ZXJ0ICkgKTtcblx0XHRcdHJldHVybiBudWxsO1xuXHRcdH1cblxuXHRcdGxldCBmcmFnID0gZ2wuY3JlYXRlU2hhZGVyKCBnbC5GUkFHTUVOVF9TSEFERVIgKTtcblx0XHRnbC5zaGFkZXJTb3VyY2UoIGZyYWcsIF9mcmFnICk7XG5cdFx0Z2wuY29tcGlsZVNoYWRlciggZnJhZyApO1xuXHRcdGlmICggIWdsLmdldFNoYWRlclBhcmFtZXRlciggZnJhZywgZ2wuQ09NUElMRV9TVEFUVVMgKSApIHtcblx0XHRcdGVycm9yKCBnbC5nZXRTaGFkZXJJbmZvTG9nKCBmcmFnICkgKTtcblx0XHRcdHJldHVybiBudWxsO1xuXHRcdH1cblxuXHRcdGxldCBwcm9ncmFtID0gZ2wuY3JlYXRlUHJvZ3JhbSgpO1xuXHRcdGdsLmF0dGFjaFNoYWRlciggcHJvZ3JhbSwgdmVydCApO1xuXHRcdGdsLmF0dGFjaFNoYWRlciggcHJvZ3JhbSwgZnJhZyApO1xuXHRcdGdsLmxpbmtQcm9ncmFtKCBwcm9ncmFtICk7XG5cdFx0aWYgKCBnbC5nZXRQcm9ncmFtUGFyYW1ldGVyKCBwcm9ncmFtLCBnbC5MSU5LX1NUQVRVUyApICkge1xuXHQgICAgcHJvZ3JhbS5sb2NhdGlvbnMgPSB7fTtcblx0XHRcdHJldHVybiBwcm9ncmFtO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRlcnJvciggZ2wuZ2V0UHJvZ3JhbUluZm9Mb2coIHByb2dyYW0gKSApO1xuXHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0fVxuXHR9XG5cblx0dXNlUHJvZ3JhbSggX3Byb2dyYW0gKSB7XG5cdFx0bGV0IGl0ID0gdGhpcztcblx0XHRsZXQgZ2wgPSBpdC5nbDtcblxuXHRcdGdsLnVzZVByb2dyYW0oIF9wcm9ncmFtICk7XG5cdFx0aXQuY3VycmVudFByb2dyYW0gPSBfcHJvZ3JhbTtcblx0fVxuXG5cdGNyZWF0ZVZlcnRleGJ1ZmZlciggX2FycmF5ICkge1xuXHRcdGxldCBpdCA9IHRoaXM7XG5cdFx0bGV0IGdsID0gaXQuZ2w7XG5cblx0ICBsZXQgYnVmZmVyID0gZ2wuY3JlYXRlQnVmZmVyKCk7XG5cblx0XHRpZiAoIF9hcnJheSApIHsgaXQuc2V0VmVydGV4YnVmZmVyKCBidWZmZXIsIF9hcnJheSApOyB9XG5cblx0ICByZXR1cm4gYnVmZmVyO1xuXHR9XG5cblx0c2V0VmVydGV4YnVmZmVyKCBfYnVmZmVyLCBfYXJyYXksIF9tb2RlICkge1xuXHRcdGxldCBpdCA9IHRoaXM7XG5cdFx0bGV0IGdsID0gaXQuZ2w7XG5cblx0XHRsZXQgbW9kZSA9IF9tb2RlIHx8IGdsLlNUQVRJQ19EUkFXO1xuXG5cdCAgZ2wuYmluZEJ1ZmZlciggZ2wuQVJSQVlfQlVGRkVSLCBfYnVmZmVyICk7XG5cdCAgZ2wuYnVmZmVyRGF0YSggZ2wuQVJSQVlfQlVGRkVSLCBuZXcgRmxvYXQzMkFycmF5KCBfYXJyYXkgKSwgbW9kZSApO1xuXHQgIGdsLmJpbmRCdWZmZXIoIGdsLkFSUkFZX0JVRkZFUiwgbnVsbCApO1xuXG5cdCAgX2J1ZmZlci5sZW5ndGggPSBfYXJyYXkubGVuZ3RoO1xuXHR9XG5cblx0Y3JlYXRlSW5kZXhidWZmZXIoIF9hcnJheSApIHtcblx0XHRsZXQgaXQgPSB0aGlzO1xuXHRcdGxldCBnbCA9IGl0LmdsO1xuXG5cdCAgbGV0IGJ1ZmZlciA9IGdsLmNyZWF0ZUJ1ZmZlcigpO1xuXG5cdCAgZ2wuYmluZEJ1ZmZlciggZ2wuRUxFTUVOVF9BUlJBWV9CVUZGRVIsIGJ1ZmZlciApO1xuXHQgIGdsLmJ1ZmZlckRhdGEoIGdsLkVMRU1FTlRfQVJSQVlfQlVGRkVSLCBuZXcgSW50MTZBcnJheSggX2FycmF5ICksIGdsLlNUQVRJQ19EUkFXICk7XG5cdCAgZ2wuYmluZEJ1ZmZlciggZ2wuRUxFTUVOVF9BUlJBWV9CVUZGRVIsIG51bGwgKTtcblxuXHQgIGJ1ZmZlci5sZW5ndGggPSBfYXJyYXkubGVuZ3RoO1xuXHQgIHJldHVybiBidWZmZXI7XG5cdH1cblxuXHRnZXRBdHRyaWJMb2NhdGlvbiggX25hbWUgKSB7XG5cdFx0bGV0IGl0ID0gdGhpcztcblx0XHRsZXQgZ2wgPSBpdC5nbDtcblxuXHRcdGxldCBsb2NhdGlvbjtcblx0ICBpZiAoIGl0LmN1cnJlbnRQcm9ncmFtLmxvY2F0aW9uc1sgX25hbWUgXSApIHtcblx0ICAgIGxvY2F0aW9uID0gaXQuY3VycmVudFByb2dyYW0ubG9jYXRpb25zWyBfbmFtZSBdO1xuXHQgIH0gZWxzZSB7XG5cdCAgICBsb2NhdGlvbiA9IGdsLmdldEF0dHJpYkxvY2F0aW9uKCBpdC5jdXJyZW50UHJvZ3JhbSwgX25hbWUgKTtcblx0ICAgIGl0LmN1cnJlbnRQcm9ncmFtLmxvY2F0aW9uc1sgX25hbWUgXSA9IGxvY2F0aW9uO1xuXHQgIH1cblxuXHRcdHJldHVybiBsb2NhdGlvbjtcblx0fVxuXG5cdGF0dHJpYnV0ZSggX25hbWUsIF9idWZmZXIsIF9zdHJpZGUsIF9kaXYgKSB7XG5cdFx0bGV0IGl0ID0gdGhpcztcblx0XHRsZXQgZ2wgPSBpdC5nbDtcblxuXHRcdGlmICggX2RpdiApIHtcblx0XHRcdGl0LmdldEV4dGVuc2lvbiggXCJBTkdMRV9pbnN0YW5jZWRfYXJyYXlzXCIsIHRydWUgKTtcblx0XHR9XG5cblx0ICBsZXQgbG9jYXRpb24gPSBpdC5nZXRBdHRyaWJMb2NhdGlvbiggX25hbWUgKTtcblxuXHQgIGdsLmJpbmRCdWZmZXIoIGdsLkFSUkFZX0JVRkZFUiwgX2J1ZmZlciApO1xuXHQgIGdsLmVuYWJsZVZlcnRleEF0dHJpYkFycmF5KCBsb2NhdGlvbiApO1xuXHQgIGdsLnZlcnRleEF0dHJpYlBvaW50ZXIoIGxvY2F0aW9uLCBfc3RyaWRlLCBnbC5GTE9BVCwgZmFsc2UsIDAsIDAgKTtcblxuXHRcdGxldCBleHQgPSBpdC5nZXRFeHRlbnNpb24oIFwiQU5HTEVfaW5zdGFuY2VkX2FycmF5c1wiICk7XG5cdFx0aWYgKCBleHQgKSB7XG5cdFx0XHRsZXQgZGl2ID0gX2RpdiB8fCAwO1xuXHRcdFx0ZXh0LnZlcnRleEF0dHJpYkRpdmlzb3JBTkdMRSggbG9jYXRpb24sIGRpdiApO1xuXHRcdH1cblxuXHQgIGdsLmJpbmRCdWZmZXIoIGdsLkFSUkFZX0JVRkZFUiwgbnVsbCApO1xuXHR9XG5cblx0Z2V0VW5pZm9ybUxvY2F0aW9uKCBfbmFtZSApIHtcblx0XHRsZXQgaXQgPSB0aGlzO1xuXHRcdGxldCBnbCA9IGl0LmdsO1xuXG5cdCAgbGV0IGxvY2F0aW9uO1xuXG5cdFx0aWYgKCB0eXBlb2YgaXQuY3VycmVudFByb2dyYW0ubG9jYXRpb25zWyBfbmFtZSBdICE9PSBcInVuZGVmaW5lZFwiICkge1xuXHRcdFx0bG9jYXRpb24gPSBpdC5jdXJyZW50UHJvZ3JhbS5sb2NhdGlvbnNbIF9uYW1lIF07XG5cdFx0fSBlbHNlIHtcblx0XHRcdGxvY2F0aW9uID0gZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKCBpdC5jdXJyZW50UHJvZ3JhbSwgX25hbWUgKTtcblx0XHRcdGl0LmN1cnJlbnRQcm9ncmFtLmxvY2F0aW9uc1sgX25hbWUgXSA9IGxvY2F0aW9uO1xuXHRcdH1cblxuXHQgIHJldHVybiBsb2NhdGlvbjtcblx0fVxuXG5cdHVuaWZvcm0xaSggX25hbWUsIF92YWx1ZSApIHtcblx0XHRsZXQgaXQgPSB0aGlzO1xuXHRcdGxldCBnbCA9IGl0LmdsO1xuXG5cdFx0bGV0IGxvY2F0aW9uID0gaXQuZ2V0VW5pZm9ybUxvY2F0aW9uKCBfbmFtZSApO1xuXHRcdGdsLnVuaWZvcm0xaSggbG9jYXRpb24sIF92YWx1ZSApO1xuXHR9XG5cblx0dW5pZm9ybTFmKCBfbmFtZSwgX3ZhbHVlICkge1xuXHRcdGxldCBpdCA9IHRoaXM7XG5cdFx0bGV0IGdsID0gaXQuZ2w7XG5cblx0XHRsZXQgbG9jYXRpb24gPSBpdC5nZXRVbmlmb3JtTG9jYXRpb24oIF9uYW1lICk7XG5cdFx0Z2wudW5pZm9ybTFmKCBsb2NhdGlvbiwgX3ZhbHVlICk7XG5cdH1cblxuXHR1bmlmb3JtMmZ2KCBfbmFtZSwgX3ZhbHVlICkge1xuXHRcdGxldCBpdCA9IHRoaXM7XG5cdFx0bGV0IGdsID0gaXQuZ2w7XG5cblx0XHRsZXQgbG9jYXRpb24gPSBpdC5nZXRVbmlmb3JtTG9jYXRpb24oIF9uYW1lICk7XG5cdFx0Z2wudW5pZm9ybTJmdiggbG9jYXRpb24sIF92YWx1ZSApO1xuXHR9XG5cblx0dW5pZm9ybTNmdiggX25hbWUsIF92YWx1ZSApIHtcblx0XHRsZXQgaXQgPSB0aGlzO1xuXHRcdGxldCBnbCA9IGl0LmdsO1xuXG5cdFx0bGV0IGxvY2F0aW9uID0gaXQuZ2V0VW5pZm9ybUxvY2F0aW9uKCBfbmFtZSApO1xuXHRcdGdsLnVuaWZvcm0zZnYoIGxvY2F0aW9uLCBfdmFsdWUgKTtcblx0fVxuXG5cdHVuaWZvcm00ZnYoIF9uYW1lLCBfdmFsdWUgKSB7XG5cdFx0bGV0IGl0ID0gdGhpcztcblx0XHRsZXQgZ2wgPSBpdC5nbDtcblxuXHRcdGxldCBsb2NhdGlvbiA9IGl0LmdldFVuaWZvcm1Mb2NhdGlvbiggX25hbWUgKTtcblx0XHRnbC51bmlmb3JtNGZ2KCBsb2NhdGlvbiwgX3ZhbHVlICk7XG5cdH1cblxuXHR1bmlmb3JtTWF0cml4NGZ2KCBfbmFtZSwgX3ZhbHVlLCBfdHJhbnNwb3NlICkge1xuXHRcdGxldCBpdCA9IHRoaXM7XG5cdFx0bGV0IGdsID0gaXQuZ2w7XG5cblx0XHRsZXQgbG9jYXRpb24gPSBpdC5nZXRVbmlmb3JtTG9jYXRpb24oIF9uYW1lICk7XG5cdFx0Z2wudW5pZm9ybU1hdHJpeDRmdiggbG9jYXRpb24sIF90cmFuc3Bvc2UgfHwgZmFsc2UsIF92YWx1ZSApO1xuXHR9XG5cblx0dW5pZm9ybUN1YmVtYXAoIF9uYW1lLCBfdGV4dHVyZSwgX251bWJlciApIHtcblx0XHRsZXQgaXQgPSB0aGlzO1xuXHRcdGxldCBnbCA9IGl0LmdsO1xuXG5cdFx0bGV0IGxvY2F0aW9uID0gaXQuZ2V0VW5pZm9ybUxvY2F0aW9uKCBfbmFtZSApO1xuXHQgIGdsLmFjdGl2ZVRleHR1cmUoIGdsLlRFWFRVUkUwICsgX251bWJlciApO1xuXHQgIGdsLmJpbmRUZXh0dXJlKCBnbC5URVhUVVJFX0NVQkVfTUFQLCBfdGV4dHVyZSApO1xuXHQgIGdsLnVuaWZvcm0xaSggbG9jYXRpb24sIF9udW1iZXIgKTtcblx0fVxuXG5cdHVuaWZvcm1UZXh0dXJlKCBfbmFtZSwgX3RleHR1cmUsIF9udW1iZXIgKSB7XG5cdFx0bGV0IGl0ID0gdGhpcztcblx0XHRsZXQgZ2wgPSBpdC5nbDtcblxuXHRcdGxldCBsb2NhdGlvbiA9IGl0LmdldFVuaWZvcm1Mb2NhdGlvbiggX25hbWUgKTtcblx0ICBnbC5hY3RpdmVUZXh0dXJlKCBnbC5URVhUVVJFMCArIF9udW1iZXIgKTtcblx0ICBnbC5iaW5kVGV4dHVyZSggZ2wuVEVYVFVSRV8yRCwgX3RleHR1cmUgKTtcblx0ICBnbC51bmlmb3JtMWkoIGxvY2F0aW9uLCBfbnVtYmVyICk7XG5cdH1cblxuXHRjcmVhdGVUZXh0dXJlKCkge1xuXHRcdGxldCBpdCA9IHRoaXM7XG5cdFx0bGV0IGdsID0gaXQuZ2w7XG5cblx0XHRsZXQgdGV4dHVyZSA9IGdsLmNyZWF0ZVRleHR1cmUoKTtcblx0XHRnbC5iaW5kVGV4dHVyZSggZ2wuVEVYVFVSRV8yRCwgdGV4dHVyZSApO1xuXHQgIGdsLnRleFBhcmFtZXRlcmkoIGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfTUFHX0ZJTFRFUiwgZ2wuTElORUFSICk7XG5cdCAgZ2wudGV4UGFyYW1ldGVyaSggZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9NSU5fRklMVEVSLCBnbC5MSU5FQVIgKTtcblx0ICBnbC50ZXhQYXJhbWV0ZXJpKCBnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX1dSQVBfUywgZ2wuQ0xBTVBfVE9fRURHRSApO1xuXHQgIGdsLnRleFBhcmFtZXRlcmkoIGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfV1JBUF9ULCBnbC5DTEFNUF9UT19FREdFICk7XG5cdFx0Z2wuYmluZFRleHR1cmUoIGdsLlRFWFRVUkVfMkQsIG51bGwgKTtcblxuXHRcdHJldHVybiB0ZXh0dXJlO1xuXHR9XG5cblx0dGV4dHVyZUZpbHRlciggX3RleHR1cmUsIF9maWx0ZXIgKSB7XG5cdFx0bGV0IGl0ID0gdGhpcztcblx0XHRsZXQgZ2wgPSBpdC5nbDtcblxuXHRcdGdsLmJpbmRUZXh0dXJlKCBnbC5URVhUVVJFXzJELCBfdGV4dHVyZSApO1xuXHQgIGdsLnRleFBhcmFtZXRlcmkoIGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfTUFHX0ZJTFRFUiwgX2ZpbHRlciApO1xuXHQgIGdsLnRleFBhcmFtZXRlcmkoIGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfTUlOX0ZJTFRFUiwgX2ZpbHRlciApO1xuXHRcdGdsLmJpbmRUZXh0dXJlKCBnbC5URVhUVVJFXzJELCBudWxsICk7XG5cdH1cblxuXHR0ZXh0dXJlV3JhcCggX3RleHR1cmUsIF93cmFwICkge1xuXHRcdGxldCBpdCA9IHRoaXM7XG5cdFx0bGV0IGdsID0gaXQuZ2w7XG5cblx0XHRnbC5iaW5kVGV4dHVyZSggZ2wuVEVYVFVSRV8yRCwgX3RleHR1cmUgKTtcblx0ICBnbC50ZXhQYXJhbWV0ZXJpKCBnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX1dSQVBfUywgX3dyYXAgKTtcblx0ICBnbC50ZXhQYXJhbWV0ZXJpKCBnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX1dSQVBfVCwgX3dyYXAgKTtcblx0XHRnbC5iaW5kVGV4dHVyZSggZ2wuVEVYVFVSRV8yRCwgbnVsbCApO1xuXHR9XG5cblx0c2V0VGV4dHVyZSggX3RleHR1cmUsIF9pbWFnZSApIHtcblx0XHRsZXQgaXQgPSB0aGlzO1xuXHRcdGxldCBnbCA9IGl0LmdsO1xuXG5cdFx0Z2wuYmluZFRleHR1cmUoIGdsLlRFWFRVUkVfMkQsIF90ZXh0dXJlICk7XG5cdFx0Z2wudGV4SW1hZ2UyRCggZ2wuVEVYVFVSRV8yRCwgMCwgZ2wuUkdCQSwgZ2wuUkdCQSwgZ2wuVU5TSUdORURfQllURSwgX2ltYWdlICk7XG5cdFx0Z2wuYmluZFRleHR1cmUoIGdsLlRFWFRVUkVfMkQsIG51bGwgKTtcblx0fVxuXG5cdHNldFRleHR1cmVGcm9tQXJyYXkoIF90ZXh0dXJlLCBfd2lkdGgsIF9oZWlnaHQsIF9hcnJheSApIHtcblx0XHRsZXQgaXQgPSB0aGlzO1xuXHRcdGxldCBnbCA9IGl0LmdsO1xuXG5cdFx0Z2wuYmluZFRleHR1cmUoIGdsLlRFWFRVUkVfMkQsIF90ZXh0dXJlICk7XG5cdFx0Z2wudGV4SW1hZ2UyRCggZ2wuVEVYVFVSRV8yRCwgMCwgZ2wuUkdCQSwgX3dpZHRoLCBfaGVpZ2h0LCAwLCBnbC5SR0JBLCBnbC5VTlNJR05FRF9CWVRFLCBuZXcgVWludDhBcnJheSggX2FycmF5ICkgKTtcblx0XHRnbC5iaW5kVGV4dHVyZSggZ2wuVEVYVFVSRV8yRCwgbnVsbCApO1xuXHR9XG5cblx0c2V0VGV4dHVyZUZyb21GbG9hdEFycmF5KCBfdGV4dHVyZSwgX3dpZHRoLCBfaGVpZ2h0LCBfYXJyYXkgKSB7XG5cdFx0bGV0IGl0ID0gdGhpcztcblx0XHRsZXQgZ2wgPSBpdC5nbDtcblxuXHRcdGl0LmdldEV4dGVuc2lvbiggXCJPRVNfdGV4dHVyZV9mbG9hdFwiLCB0cnVlICk7XG5cblx0XHRnbC5iaW5kVGV4dHVyZSggZ2wuVEVYVFVSRV8yRCwgX3RleHR1cmUgKTtcblx0XHRnbC50ZXhJbWFnZTJEKCBnbC5URVhUVVJFXzJELCAwLCBnbC5SR0JBLCBfd2lkdGgsIF9oZWlnaHQsIDAsIGdsLlJHQkEsIGdsLkZMT0FULCBuZXcgRmxvYXQzMkFycmF5KCBfYXJyYXkgKSApO1xuXHRcdGlmICggIWl0LmdldEV4dGVuc2lvbiggXCJPRVNfdGV4dHVyZV9mbG9hdF9saW5lYXJcIiApICkgeyBpdC50ZXh0dXJlRmlsdGVyKCBfdGV4dHVyZSwgZ2wuTkVBUkVTVCApOyB9XG5cdFx0Z2wuYmluZFRleHR1cmUoIGdsLlRFWFRVUkVfMkQsIG51bGwgKTtcblx0fVxuXG5cdGNvcHlUZXh0dXJlKCBfdGV4dHVyZSwgX3dpZHRoLCBfaGVpZ2h0ICkge1xuXHRcdGxldCBpdCA9IHRoaXM7XG5cdFx0bGV0IGdsID0gaXQuZ2w7XG5cblx0XHRnbC5iaW5kVGV4dHVyZSggZ2wuVEVYVFVSRV8yRCwgX3RleHR1cmUgKTtcblx0XHRnbC5jb3B5VGV4SW1hZ2UyRCggZ2wuVEVYVFVSRV8yRCwgMCwgZ2wuUkdCQSwgMCwgMCwgX3dpZHRoLCBfaGVpZ2h0LCAwICk7XG5cdFx0Z2wuYmluZFRleHR1cmUoIGdsLlRFWFRVUkVfMkQsIG51bGwgKTtcblx0fVxuXG5cdGNyZWF0ZUN1YmVtYXAoIF9hcnJheU9mSW1hZ2UgKSB7XG5cdFx0bGV0IGl0ID0gdGhpcztcblx0XHRsZXQgZ2wgPSBpdC5nbDtcblxuXHRcdC8vIG9yZGVyIDogWCssIFgtLCBZKywgWS0sIForLCBaLVxuXHRcdGxldCB0ZXh0dXJlID0gZ2wuY3JlYXRlVGV4dHVyZSgpO1xuXG5cdFx0Z2wuYmluZFRleHR1cmUoIGdsLlRFWFRVUkVfQ1VCRV9NQVAsIHRleHR1cmUgKTtcblx0XHRmb3IgKCBsZXQgaSA9IDA7IGkgPCA2OyBpICsrICkge1xuXHRcdFx0Z2wudGV4SW1hZ2UyRCggZ2wuVEVYVFVSRV9DVUJFX01BUF9QT1NJVElWRV9YICsgaSwgMCwgZ2wuUkdCQSwgZ2wuUkdCQSwgZ2wuVU5TSUdORURfQllURSwgX2FycmF5T2ZJbWFnZVsgaSBdICk7XG5cdFx0fVxuXHRcdGdsLnRleFBhcmFtZXRlcmkoIGdsLlRFWFRVUkVfQ1VCRV9NQVAsIGdsLlRFWFRVUkVfTUlOX0ZJTFRFUiwgZ2wuTElORUFSICk7XG5cdCAgZ2wudGV4UGFyYW1ldGVyaSggZ2wuVEVYVFVSRV9DVUJFX01BUCwgZ2wuVEVYVFVSRV9NQUdfRklMVEVSLCBnbC5MSU5FQVIgKTtcblx0ICBnbC50ZXhQYXJhbWV0ZXJpKCBnbC5URVhUVVJFX0NVQkVfTUFQLCBnbC5URVhUVVJFX1dSQVBfUywgZ2wuQ0xBTVBfVE9fRURHRSApO1xuXHQgIGdsLnRleFBhcmFtZXRlcmkoIGdsLlRFWFRVUkVfQ1VCRV9NQVAsIGdsLlRFWFRVUkVfV1JBUF9ULCBnbC5DTEFNUF9UT19FREdFICk7XG5cdFx0Z2wuYmluZFRleHR1cmUoIGdsLlRFWFRVUkVfQ1VCRV9NQVAsIG51bGwgKTtcblxuXHRcdHJldHVybiB0ZXh0dXJlO1xuXHR9XG5cblx0Y3JlYXRlRnJhbWVidWZmZXIoIF93aWR0aCwgX2hlaWdodCApIHtcblx0XHRsZXQgaXQgPSB0aGlzO1xuXHRcdGxldCBnbCA9IGl0LmdsO1xuXG5cdCAgbGV0IGZyYW1lYnVmZmVyID0ge307XG5cdFx0ZnJhbWVidWZmZXIuZnJhbWVidWZmZXIgPSBnbC5jcmVhdGVGcmFtZWJ1ZmZlcigpO1xuXHQgIGdsLmJpbmRGcmFtZWJ1ZmZlciggZ2wuRlJBTUVCVUZGRVIsIGZyYW1lYnVmZmVyLmZyYW1lYnVmZmVyICk7XG5cblx0XHRmcmFtZWJ1ZmZlci5kZXB0aCA9IGdsLmNyZWF0ZVJlbmRlcmJ1ZmZlcigpO1xuXHRcdGdsLmJpbmRSZW5kZXJidWZmZXIoIGdsLlJFTkRFUkJVRkZFUiwgZnJhbWVidWZmZXIuZGVwdGggKTtcblx0XHRnbC5yZW5kZXJidWZmZXJTdG9yYWdlKCBnbC5SRU5ERVJCVUZGRVIsIGdsLkRFUFRIX0NPTVBPTkVOVDE2LCBfd2lkdGgsIF9oZWlnaHQgKTtcblx0ICBnbC5mcmFtZWJ1ZmZlclJlbmRlcmJ1ZmZlciggZ2wuRlJBTUVCVUZGRVIsIGdsLkRFUFRIX0FUVEFDSE1FTlQsIGdsLlJFTkRFUkJVRkZFUiwgZnJhbWVidWZmZXIuZGVwdGggKTtcblxuXHRcdGZyYW1lYnVmZmVyLnRleHR1cmUgPSBpdC5jcmVhdGVUZXh0dXJlKCk7XG5cdCAgZ2wuYmluZFRleHR1cmUoIGdsLlRFWFRVUkVfMkQsIGZyYW1lYnVmZmVyLnRleHR1cmUgKTtcblx0ICBnbC50ZXhJbWFnZTJEKCBnbC5URVhUVVJFXzJELCAwLCBnbC5SR0JBLCBfd2lkdGgsIF9oZWlnaHQsIDAsIGdsLlJHQkEsIGdsLlVOU0lHTkVEX0JZVEUsIG51bGwgKTtcblx0ICBnbC5iaW5kVGV4dHVyZSggZ2wuVEVYVFVSRV8yRCwgbnVsbCApO1xuXG5cdCAgZ2wuZnJhbWVidWZmZXJUZXh0dXJlMkQoIGdsLkZSQU1FQlVGRkVSLCBnbC5DT0xPUl9BVFRBQ0hNRU5UMCwgZ2wuVEVYVFVSRV8yRCwgZnJhbWVidWZmZXIudGV4dHVyZSwgMCApO1xuXHQgIGdsLmJpbmRGcmFtZWJ1ZmZlciggZ2wuRlJBTUVCVUZGRVIsIG51bGwgKTtcblxuXHQgIHJldHVybiBmcmFtZWJ1ZmZlcjtcblx0fVxuXG5cdHJlc2l6ZUZyYW1lYnVmZmVyKCBfZnJhbWVidWZmZXIsIF93aWR0aCwgX2hlaWdodCApIHtcblx0XHRsZXQgaXQgPSB0aGlzO1xuXHRcdGxldCBnbCA9IGl0LmdsO1xuXG5cdFx0Z2wuYmluZEZyYW1lYnVmZmVyKCBnbC5GUkFNRUJVRkZFUiwgX2ZyYW1lYnVmZmVyLmZyYW1lYnVmZmVyICk7XG5cblx0XHRnbC5iaW5kUmVuZGVyYnVmZmVyKCBnbC5SRU5ERVJCVUZGRVIsIF9mcmFtZWJ1ZmZlci5kZXB0aCApO1xuXHRcdGdsLnJlbmRlcmJ1ZmZlclN0b3JhZ2UoIGdsLlJFTkRFUkJVRkZFUiwgZ2wuREVQVEhfQ09NUE9ORU5UMTYsIF93aWR0aCwgX2hlaWdodCApO1xuXHRcdGdsLmJpbmRSZW5kZXJidWZmZXIoIGdsLlJFTkRFUkJVRkZFUiwgbnVsbCApO1xuXHRcdFxuXHQgIGdsLmJpbmRUZXh0dXJlKCBnbC5URVhUVVJFXzJELCBfZnJhbWVidWZmZXIudGV4dHVyZSApO1xuXHRcdGdsLnRleEltYWdlMkQoIGdsLlRFWFRVUkVfMkQsIDAsIGdsLlJHQkEsIF93aWR0aCwgX2hlaWdodCwgMCwgZ2wuUkdCQSwgZ2wuVU5TSUdORURfQllURSwgbnVsbCApO1xuXHQgIGdsLmJpbmRUZXh0dXJlKCBnbC5URVhUVVJFXzJELCBudWxsICk7XG5cdFx0XG5cdFx0Z2wuYmluZEZyYW1lYnVmZmVyKCBnbC5GUkFNRUJVRkZFUiwgbnVsbCApO1xuXHR9XG5cblx0Y3JlYXRlRmxvYXRGcmFtZWJ1ZmZlciggX3dpZHRoLCBfaGVpZ2h0ICkge1xuXHRcdGxldCBpdCA9IHRoaXM7XG5cdFx0bGV0IGdsID0gaXQuZ2w7XG5cblx0XHRpdC5nZXRFeHRlbnNpb24oIFwiT0VTX3RleHR1cmVfZmxvYXRcIiwgdHJ1ZSApO1xuXG5cdCAgbGV0IGZyYW1lYnVmZmVyID0ge307XG5cdFx0ZnJhbWVidWZmZXIuZnJhbWVidWZmZXIgPSBnbC5jcmVhdGVGcmFtZWJ1ZmZlcigpO1xuXHQgIGdsLmJpbmRGcmFtZWJ1ZmZlciggZ2wuRlJBTUVCVUZGRVIsIGZyYW1lYnVmZmVyLmZyYW1lYnVmZmVyICk7XG5cblx0XHRmcmFtZWJ1ZmZlci5kZXB0aCA9IGdsLmNyZWF0ZVJlbmRlcmJ1ZmZlcigpO1xuXHRcdGdsLmJpbmRSZW5kZXJidWZmZXIoIGdsLlJFTkRFUkJVRkZFUiwgZnJhbWVidWZmZXIuZGVwdGggKTtcblx0XHRnbC5yZW5kZXJidWZmZXJTdG9yYWdlKCBnbC5SRU5ERVJCVUZGRVIsIGdsLkRFUFRIX0NPTVBPTkVOVDE2LCBfd2lkdGgsIF9oZWlnaHQgKTtcblx0ICBnbC5mcmFtZWJ1ZmZlclJlbmRlcmJ1ZmZlciggZ2wuRlJBTUVCVUZGRVIsIGdsLkRFUFRIX0FUVEFDSE1FTlQsIGdsLlJFTkRFUkJVRkZFUiwgZnJhbWVidWZmZXIuZGVwdGggKTtcblxuXHRcdGZyYW1lYnVmZmVyLnRleHR1cmUgPSBpdC5jcmVhdGVUZXh0dXJlKCk7XG5cdCAgZ2wuYmluZFRleHR1cmUoIGdsLlRFWFRVUkVfMkQsIGZyYW1lYnVmZmVyLnRleHR1cmUgKTtcblx0ICBnbC50ZXhJbWFnZTJEKCBnbC5URVhUVVJFXzJELCAwLCBnbC5SR0JBLCBfd2lkdGgsIF9oZWlnaHQsIDAsIGdsLlJHQkEsIGdsLkZMT0FULCBudWxsICk7XG5cdFx0aWYgKCAhaXQuZ2V0RXh0ZW5zaW9uKCBcIk9FU190ZXh0dXJlX2Zsb2F0X2xpbmVhclwiICkgKSB7IGl0LnRleHR1cmVGaWx0ZXIoIGZyYW1lYnVmZmVyLnRleHR1cmUsIGdsLk5FQVJFU1QgKTsgfVxuXHQgIGdsLmJpbmRUZXh0dXJlKCBnbC5URVhUVVJFXzJELCBudWxsICk7XG5cblx0ICBnbC5mcmFtZWJ1ZmZlclRleHR1cmUyRCggZ2wuRlJBTUVCVUZGRVIsIGdsLkNPTE9SX0FUVEFDSE1FTlQwLCBnbC5URVhUVVJFXzJELCBmcmFtZWJ1ZmZlci50ZXh0dXJlLCAwICk7XG5cdCAgZ2wuYmluZEZyYW1lYnVmZmVyKCBnbC5GUkFNRUJVRkZFUiwgbnVsbCApO1xuXG5cdCAgcmV0dXJuIGZyYW1lYnVmZmVyO1xuXHR9XG5cblx0cmVzaXplRmxvYXRGcmFtZWJ1ZmZlciggX2ZyYW1lYnVmZmVyLCBfd2lkdGgsIF9oZWlnaHQgKSB7XG5cdFx0bGV0IGl0ID0gdGhpcztcblx0XHRsZXQgZ2wgPSBpdC5nbDtcblxuXHRcdGdsLmJpbmRGcmFtZWJ1ZmZlciggZ2wuRlJBTUVCVUZGRVIsIF9mcmFtZWJ1ZmZlci5mcmFtZWJ1ZmZlciApO1xuXG5cdFx0Z2wuYmluZFJlbmRlcmJ1ZmZlciggZ2wuUkVOREVSQlVGRkVSLCBfZnJhbWVidWZmZXIuZGVwdGggKTtcblx0XHRnbC5yZW5kZXJidWZmZXJTdG9yYWdlKCBnbC5SRU5ERVJCVUZGRVIsIGdsLkRFUFRIX0NPTVBPTkVOVDE2LCBfd2lkdGgsIF9oZWlnaHQgKTtcblx0XHRnbC5iaW5kUmVuZGVyYnVmZmVyKCBnbC5SRU5ERVJCVUZGRVIsIG51bGwgKTtcblx0XHRcblx0ICBnbC5iaW5kVGV4dHVyZSggZ2wuVEVYVFVSRV8yRCwgX2ZyYW1lYnVmZmVyLnRleHR1cmUgKTtcblx0XHRnbC50ZXhJbWFnZTJEKCBnbC5URVhUVVJFXzJELCAwLCBnbC5SR0JBLCBfd2lkdGgsIF9oZWlnaHQsIDAsIGdsLlJHQkEsIGdsLkZMT0FULCBudWxsICk7XG5cdCAgZ2wuYmluZFRleHR1cmUoIGdsLlRFWFRVUkVfMkQsIG51bGwgKTtcblx0XHRcblx0XHRnbC5iaW5kRnJhbWVidWZmZXIoIGdsLkZSQU1FQlVGRkVSLCBudWxsICk7XG5cdH1cblxuXHRjcmVhdGVEcmF3QnVmZmVycyggX3dpZHRoLCBfaGVpZ2h0LCBfbnVtRHJhd0J1ZmZlcnMgKSB7XG5cdFx0bGV0IGl0ID0gdGhpcztcblx0XHRsZXQgZ2wgPSBpdC5nbDtcblxuXHRcdGl0LmdldEV4dGVuc2lvbiggJ09FU190ZXh0dXJlX2Zsb2F0JywgdHJ1ZSApO1xuXHRcdGxldCBleHQgPSBpdC5nZXRFeHRlbnNpb24oICdXRUJHTF9kcmF3X2J1ZmZlcnMnLCB0cnVlICk7XG5cblx0XHRpZiAoIGV4dC5NQVhfRFJBV19CVUZGRVJTX1dFQkdMIDwgX251bURyYXdCdWZmZXJzICkge1xuXHRcdFx0dGhyb3cgXCJjcmVhdGVEcmF3QnVmZmVyczogTUFYX0RSQVdfQlVGRkVSU19XRUJHTCBpcyBcIiArIGV4dC5NQVhfRFJBV19CVUZGRVJTX1dFQkdMO1xuXHRcdH1cblxuXHRcdGxldCBmcmFtZWJ1ZmZlciA9IHt9O1xuXHRcdGZyYW1lYnVmZmVyLmZyYW1lYnVmZmVyID0gZ2wuY3JlYXRlRnJhbWVidWZmZXIoKTtcblx0XHRnbC5iaW5kRnJhbWVidWZmZXIoIGdsLkZSQU1FQlVGRkVSLCBmcmFtZWJ1ZmZlci5mcmFtZWJ1ZmZlciApO1xuXG5cdFx0ZnJhbWVidWZmZXIuZGVwdGggPSBnbC5jcmVhdGVSZW5kZXJidWZmZXIoKTtcblx0XHRnbC5iaW5kUmVuZGVyYnVmZmVyKCBnbC5SRU5ERVJCVUZGRVIsIGZyYW1lYnVmZmVyLmRlcHRoICk7XG5cdFx0Z2wucmVuZGVyYnVmZmVyU3RvcmFnZSggZ2wuUkVOREVSQlVGRkVSLCBnbC5ERVBUSF9DT01QT05FTlQxNiwgX3dpZHRoLCBfaGVpZ2h0ICk7XG5cdFx0Z2wuZnJhbWVidWZmZXJSZW5kZXJidWZmZXIoIGdsLkZSQU1FQlVGRkVSLCBnbC5ERVBUSF9BVFRBQ0hNRU5ULCBnbC5SRU5ERVJCVUZGRVIsIGZyYW1lYnVmZmVyLmRlcHRoICk7XG5cblx0XHRmcmFtZWJ1ZmZlci50ZXh0dXJlcyA9IFtdO1xuXHRcdGZvciAoIGxldCBpID0gMDsgaSA8IF9udW1EcmF3QnVmZmVyczsgaSArKyApIHtcblx0XHRcdGZyYW1lYnVmZmVyLnRleHR1cmVzWyBpIF0gPSBpdC5jcmVhdGVUZXh0dXJlKCk7XG5cdFx0ICBnbC5iaW5kVGV4dHVyZSggZ2wuVEVYVFVSRV8yRCwgZnJhbWVidWZmZXIudGV4dHVyZXNbIGkgXSApO1xuXHRcdFx0Z2wudGV4SW1hZ2UyRCggZ2wuVEVYVFVSRV8yRCwgMCwgZ2wuUkdCQSwgX3dpZHRoLCBfaGVpZ2h0LCAwLCBnbC5SR0JBLCBnbC5GTE9BVCwgbnVsbCApO1xuXHRcdFx0aWYgKCAhaXQuZ2V0RXh0ZW5zaW9uKCBcIk9FU190ZXh0dXJlX2Zsb2F0X2xpbmVhclwiICkgKSB7IGl0LnRleHR1cmVGaWx0ZXIoIGZyYW1lYnVmZmVyLnRleHR1cmVzWyBpIF0sIGdsLk5FQVJFU1QgKTsgfVxuXHRcdCAgZ2wuYmluZFRleHR1cmUoIGdsLlRFWFRVUkVfMkQsIG51bGwgKTtcblxuXHRcdCAgZ2wuZnJhbWVidWZmZXJUZXh0dXJlMkQoIGdsLkZSQU1FQlVGRkVSLCBleHQuQ09MT1JfQVRUQUNITUVOVDBfV0VCR0wgKyBpLCBnbC5URVhUVVJFXzJELCBmcmFtZWJ1ZmZlci50ZXh0dXJlc1sgaSBdLCAwICk7XG5cdFx0fVxuXG5cdFx0bGV0IHN0YXR1cyA9IGdsLmNoZWNrRnJhbWVidWZmZXJTdGF0dXMoIGdsLkZSQU1FQlVGRkVSICk7XG5cdFx0aWYgKCBzdGF0dXMgIT09IGdsLkZSQU1FQlVGRkVSX0NPTVBMRVRFICkge1xuXHRcdFx0dGhyb3cgXCJjcmVhdGVEcmF3QnVmZmVyczogZ2wuY2hlY2tGcmFtZWJ1ZmZlclN0YXR1cyggZ2wuRlJBTUVCVUZGRVIgKSByZXR1cm5zIFwiICsgc3RhdHVzO1xuXHRcdH1cblx0XHRnbC5iaW5kRnJhbWVidWZmZXIoIGdsLkZSQU1FQlVGRkVSLCBudWxsICk7XG5cblx0XHRyZXR1cm4gZnJhbWVidWZmZXI7XG5cdH1cblxuXHRyZXNpemVEcmF3QnVmZmVycyggX2ZyYW1lYnVmZmVyLCBfd2lkdGgsIGhlaWdodCApIHtcblx0XHRsZXQgaXQgPSB0aGlzO1xuXHRcdGxldCBnbCA9IGl0LmdsO1xuXG5cdFx0Z2wuYmluZEZyYW1lYnVmZmVyKCBnbC5GUkFNRUJVRkZFUiwgX2ZyYW1lYnVmZmVyLmZyYW1lYnVmZmVyICk7XG5cblx0XHRnbC5iaW5kUmVuZGVyYnVmZmVyKCBnbC5SRU5ERVJCVUZGRVIsIF9mcmFtZWJ1ZmZlci5kZXB0aCApO1xuXHRcdGdsLnJlbmRlcmJ1ZmZlclN0b3JhZ2UoIGdsLlJFTkRFUkJVRkZFUiwgZ2wuREVQVEhfQ09NUE9ORU5UMTYsIF93aWR0aCwgX2hlaWdodCApO1xuXHRcdGdsLmJpbmRSZW5kZXJidWZmZXIoIGdsLlJFTkRFUkJVRkZFUiwgbnVsbCApO1xuXHRcdFxuXHRcdGZvciAoIGxldCBpID0gMDsgaSA8IF9mcmFtZWJ1ZmZlci50ZXh0dXJlcy5sZW5ndGg7IGkgKysgKSB7XG5cdFx0XHRnbC5iaW5kVGV4dHVyZSggZ2wuVEVYVFVSRV8yRCwgX2ZyYW1lYnVmZmVyLnRleHR1cmVzWyBpIF0gKTtcblx0XHRcdGdsLnRleEltYWdlMkQoIGdsLlRFWFRVUkVfMkQsIDAsIGdsLlJHQkEsIF93aWR0aCwgX2hlaWdodCwgMCwgZ2wuUkdCQSwgZ2wuRkxPQVQsIG51bGwgKTtcblx0XHRcdGdsLmJpbmRUZXh0dXJlKCBnbC5URVhUVVJFXzJELCBudWxsICk7XG5cdFx0fVxuXHRcdFxuXHRcdGdsLmJpbmRGcmFtZWJ1ZmZlciggZ2wuRlJBTUVCVUZGRVIsIG51bGwgKTtcblx0fVxuXG5cdGRyYXdCdWZmZXJzKCBfbnVtRHJhd0J1ZmZlcnMgKSB7XG5cdFx0bGV0IGl0ID0gdGhpcztcblx0XHRsZXQgZ2wgPSBpdC5nbDtcblx0XHRcblx0XHRsZXQgZXh0ID0gaXQuZ2V0RXh0ZW5zaW9uKCBcIldFQkdMX2RyYXdfYnVmZmVyc1wiLCB0cnVlICk7XG5cblx0XHRsZXQgYXJyYXkgPSBbXTtcblx0XHRpZiAoIHR5cGVvZiBfbnVtRHJhd0J1ZmZlcnMgPT09IFwibnVtYmVyXCIgKSB7XG5cdFx0XHRmb3IgKCBsZXQgaSA9IDA7IGkgPCBfbnVtRHJhd0J1ZmZlcnM7IGkgKysgKSB7XG5cdFx0XHRcdGFycmF5LnB1c2goIGV4dC5DT0xPUl9BVFRBQ0hNRU5UMF9XRUJHTCArIGkgKTtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0YXJyYXkgPSBhcnJheS5jb25jYXQoIF9udW1EcmF3QnVmZmVycyApO1xuXHRcdH1cblx0XHRleHQuZHJhd0J1ZmZlcnNXRUJHTCggYXJyYXkgKTtcblx0fVxuXG5cdGNsZWFyKCBfciwgX2csIF9iLCBfYSwgX2QgKSB7XG5cdFx0bGV0IGl0ID0gdGhpcztcblx0XHRsZXQgZ2wgPSBpdC5nbDtcblxuXHRcdGxldCByID0gX3IgfHwgMC4wO1xuXHRcdGxldCBnID0gX2cgfHwgMC4wO1xuXHRcdGxldCBiID0gX2IgfHwgMC4wO1xuXHRcdGxldCBhID0gdHlwZW9mIF9hID09PSAnbnVtYmVyJyA/IF9hIDogMS4wO1xuXHRcdGxldCBkID0gdHlwZW9mIF9kID09PSAnbnVtYmVyJyA/IF9kIDogMS4wO1xuXG5cdCAgZ2wuY2xlYXJDb2xvciggciwgZywgYiwgYSApO1xuXHQgIGdsLmNsZWFyRGVwdGgoIGQgKTtcblx0ICBnbC5jbGVhciggZ2wuQ09MT1JfQlVGRkVSX0JJVCB8IGdsLkRFUFRIX0JVRkZFUl9CSVQgKTtcblx0fVxufTtcblxuZXhwb3J0IGRlZmF1bHQgR0xDYXQ7XG4iLCIvLyDjgavjgoPjg7zjgpNcclxuXHJcbmxldCBNYXRoQ2F0ID0ge307XHJcblxyXG4vKipcclxuICogYWRkcyBhIHR3byB2ZWNcclxuICogQHBhcmFtIHthcnJheX0gYSAtIHZlY1xyXG4gKiBAcGFyYW0ge2FycmF5fSBiIC0gdmVjXHJcbiAqL1xyXG5NYXRoQ2F0LnZlY0FkZCA9ICggYSwgYiApID0+IGEubWFwKCAoIGUsIGkgKSA9PiBlICsgYltpXSApO1xyXG5cclxuLyoqXHJcbiAqIHN1YnN0cmFjdHMgYSB2ZWMgZnJvbSBhbiBhbm90aGVyIHZlY1xyXG4gKiBAcGFyYW0ge2FycmF5fSBhIC0gdmVjXHJcbiAqIEBwYXJhbSB7YXJyYXl9IGIgLSB2ZWNcclxuICovXHJcbk1hdGhDYXQudmVjU3ViID0gKCBhLCBiICkgPT4gYS5tYXAoICggZSwgaSApID0+IGUgLSBiW2ldICk7XHJcblxyXG4vKipcclxuICogcmV0dXJucyBhIGNyb3NzIG9mIHR3byB2ZWMzc1xyXG4gKiBAcGFyYW0ge2FycmF5fSBhIC0gdmVjM1xyXG4gKiBAcGFyYW0ge2FycmF5fSBiIC0gdmVjM1xyXG4gKi9cclxuTWF0aENhdC52ZWMzQ3Jvc3MgPSAoIGEsIGIgKSA9PiBbXHJcbiAgYVsxXSAqIGJbMl0gLSBhWzJdICogYlsxXSxcclxuICBhWzJdICogYlswXSAtIGFbMF0gKiBiWzJdLFxyXG4gIGFbMF0gKiBiWzFdIC0gYVsxXSAqIGJbMF1cclxuXTtcclxuXHJcbi8qKlxyXG4gKiBzY2FsZXMgYSB2ZWMgYnkgc2NhbGFyXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBzIC0gc2NhbGFyXHJcbiAqIEBwYXJhbSB7YXJyYXl9IHYgLSB2ZWNcclxuICovXHJcbk1hdGhDYXQudmVjU2NhbGUgPSAoIHMsIHYgKSA9PiB2Lm1hcCggZSA9PiBlICogcyApO1xyXG5cclxuLyoqXHJcbiAqIHJldHVybnMgbGVuZ3RoIG9mIGEgdmVjXHJcbiAqIEBwYXJhbSB7YXJyYXl9IHYgLSB2ZWNcclxuICovXHJcbk1hdGhDYXQudmVjTGVuZ3RoID0gdiA9PiBNYXRoLnNxcnQoIHYucmVkdWNlKCAoIHAsIGMgKSA9PiBwICsgYyAqIGMsIDAuMCApICk7XHJcblxyXG4vKipcclxuICogbm9ybWFsaXplcyBhIHZlY1xyXG4gKiBAcGFyYW0ge2FycmF5fSB2IC0gdmVjXHJcbiAqL1xyXG5NYXRoQ2F0LnZlY05vcm1hbGl6ZSA9IHYgPT4gTWF0aENhdC52ZWNTY2FsZSggMS4wIC8gTWF0aENhdC52ZWNMZW5ndGgoIHYgKSwgdiApO1xyXG5cclxuLyoqXHJcbiAqIGFwcGxpZXMgdHdvIG1hdDRzXHJcbiAqIEBwYXJhbSB7YXJyYXl9IGEgLSBtYXQ0XHJcbiAqIEBwYXJhbSB7YXJyYXl9IGIgLSBtYXQ0XHJcbiAqL1xyXG5NYXRoQ2F0Lm1hdDRBcHBseSA9ICggYSwgYiApID0+IHtcclxuICByZXR1cm4gW1xyXG4gICAgYVsgMF0gKiBiWyAwXSArIGFbIDRdICogYlsgMV0gKyBhWyA4XSAqIGJbIDJdICsgYVsxMl0gKiBiWyAzXSxcclxuICAgIGFbIDFdICogYlsgMF0gKyBhWyA1XSAqIGJbIDFdICsgYVsgOV0gKiBiWyAyXSArIGFbMTNdICogYlsgM10sXHJcbiAgICBhWyAyXSAqIGJbIDBdICsgYVsgNl0gKiBiWyAxXSArIGFbMTBdICogYlsgMl0gKyBhWzE0XSAqIGJbIDNdLFxyXG4gICAgYVsgM10gKiBiWyAwXSArIGFbIDddICogYlsgMV0gKyBhWzExXSAqIGJbIDJdICsgYVsxNV0gKiBiWyAzXSxcclxuXHJcbiAgICBhWyAwXSAqIGJbIDRdICsgYVsgNF0gKiBiWyA1XSArIGFbIDhdICogYlsgNl0gKyBhWzEyXSAqIGJbIDddLFxyXG4gICAgYVsgMV0gKiBiWyA0XSArIGFbIDVdICogYlsgNV0gKyBhWyA5XSAqIGJbIDZdICsgYVsxM10gKiBiWyA3XSxcclxuICAgIGFbIDJdICogYlsgNF0gKyBhWyA2XSAqIGJbIDVdICsgYVsxMF0gKiBiWyA2XSArIGFbMTRdICogYlsgN10sXHJcbiAgICBhWyAzXSAqIGJbIDRdICsgYVsgN10gKiBiWyA1XSArIGFbMTFdICogYlsgNl0gKyBhWzE1XSAqIGJbIDddLFxyXG5cclxuICAgIGFbIDBdICogYlsgOF0gKyBhWyA0XSAqIGJbIDldICsgYVsgOF0gKiBiWzEwXSArIGFbMTJdICogYlsxMV0sXHJcbiAgICBhWyAxXSAqIGJbIDhdICsgYVsgNV0gKiBiWyA5XSArIGFbIDldICogYlsxMF0gKyBhWzEzXSAqIGJbMTFdLFxyXG4gICAgYVsgMl0gKiBiWyA4XSArIGFbIDZdICogYlsgOV0gKyBhWzEwXSAqIGJbMTBdICsgYVsxNF0gKiBiWzExXSxcclxuICAgIGFbIDNdICogYlsgOF0gKyBhWyA3XSAqIGJbIDldICsgYVsxMV0gKiBiWzEwXSArIGFbMTVdICogYlsxMV0sXHJcbiAgICBcclxuICAgIGFbIDBdICogYlsxMl0gKyBhWyA0XSAqIGJbMTNdICsgYVsgOF0gKiBiWzE0XSArIGFbMTJdICogYlsxNV0sXHJcbiAgICBhWyAxXSAqIGJbMTJdICsgYVsgNV0gKiBiWzEzXSArIGFbIDldICogYlsxNF0gKyBhWzEzXSAqIGJbMTVdLFxyXG4gICAgYVsgMl0gKiBiWzEyXSArIGFbIDZdICogYlsxM10gKyBhWzEwXSAqIGJbMTRdICsgYVsxNF0gKiBiWzE1XSxcclxuICAgIGFbIDNdICogYlsxMl0gKyBhWyA3XSAqIGJbMTNdICsgYVsxMV0gKiBiWzE0XSArIGFbMTVdICogYlsxNV1cclxuICBdO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIHRyYW5zcG9zZSBhIG1hdDRcclxuICogQHBhcmFtIHthcnJheX0gbSAtIG1hdDRcclxuICovXHJcbk1hdGhDYXQubWF0NFRyYW5zcG9zZSA9ICggbSApID0+IFtcclxuICBtWyAwXSxtWyA0XSxtWyA4XSxtWzEyXSxcclxuICBtWyAxXSxtWyA1XSxtWyA5XSxtWzEzXSxcclxuICBtWyAyXSxtWyA2XSxtWzEwXSxtWzE0XSxcclxuICBtWyAzXSxtWyA3XSxtWzExXSxtWzE1XVxyXG5dO1xyXG5cclxuLyoqXHJcbiAqIHJldHVybnMgYW4gaW5kZW50aXR5IG1hdDRcclxuICovXHJcbk1hdGhDYXQubWF0NElkZW50aXR5ID0gKCkgPT4gWzEsMCwwLDAsMCwxLDAsMCwwLDAsMSwwLDAsMCwwLDFdO1xyXG5cclxuTWF0aENhdC5tYXQ0VHJhbnNsYXRlID0gKCB2ICkgPT4gWzEsMCwwLDAsMCwxLDAsMCwwLDAsMSwwLHZbMF0sdlsxXSx2WzJdLDFdO1xyXG5cclxuTWF0aENhdC5tYXQ0U2NhbGUgPSAoIHYgKSA9PiBbXHJcbiAgdlswXSwwLDAsMCxcclxuICAwLHZbMV0sMCwwLFxyXG4gIDAsMCx2WzJdLDAsXHJcbiAgMCwwLDAsMVxyXG5dO1xyXG5cclxuTWF0aENhdC5tYXQ0U2NhbGVYWVogPSAoIHMgKSA9PiBbXHJcbiAgcywwLDAsMCxcclxuICAwLHMsMCwwLFxyXG4gIDAsMCxzLDAsXHJcbiAgMCwwLDAsMVxyXG5dO1xyXG5cclxuTWF0aENhdC5tYXQ0Um90YXRlWCA9ICggdCApID0+IFtcclxuICAxLDAsMCwwLFxyXG4gIDAsTWF0aC5jb3ModCksLU1hdGguc2luKHQpLDAsXHJcbiAgMCxNYXRoLnNpbih0KSxNYXRoLmNvcyh0KSwwLFxyXG4gIDAsMCwwLDFcclxuXTtcclxuXHJcbk1hdGhDYXQubWF0NFJvdGF0ZVkgPSAoIHQgKSA9PiBbXHJcbiAgTWF0aC5jb3ModCksMCxNYXRoLnNpbih0KSwwLFxyXG4gIDAsMSwwLDAsXHJcbiAgLU1hdGguc2luKHQpLDAsTWF0aC5jb3ModCksMCxcclxuICAwLDAsMCwxXHJcbl07XHJcblxyXG5NYXRoQ2F0Lm1hdDRSb3RhdGVaID0gKCB0ICkgPT4gW1xyXG4gIE1hdGguY29zKHQpLC1NYXRoLnNpbih0KSwwLDAsXHJcbiAgTWF0aC5zaW4odCksTWF0aC5jb3ModCksMCwwLFxyXG4gIDAsMCwxLDAsXHJcbiAgMCwwLDAsMVxyXG5dO1xyXG5cclxuTWF0aENhdC5tYXQ0TG9va0F0ID0gKCBwb3MsIHRhciwgYWlyLCByb3QgKSA9PiB7XHJcbiAgbGV0IGRpciA9IE1hdGhDYXQudmVjTm9ybWFsaXplKCBNYXRoQ2F0LnZlY1N1YiggdGFyLCBwb3MgKSApO1xyXG4gIGxldCBzaWQgPSBNYXRoQ2F0LnZlY05vcm1hbGl6ZSggTWF0aENhdC52ZWMzQ3Jvc3MoIGRpciwgYWlyICkgKTtcclxuICBsZXQgdG9wID0gTWF0aENhdC52ZWMzQ3Jvc3MoIHNpZCwgZGlyICk7XHJcbiAgc2lkID0gTWF0aENhdC52ZWNBZGQoXHJcbiAgICBNYXRoQ2F0LnZlY1NjYWxlKCBNYXRoLmNvcyggcm90ICksIHNpZCApLFxyXG4gICAgTWF0aENhdC52ZWNTY2FsZSggTWF0aC5zaW4oIHJvdCApLCB0b3AgKVxyXG4gICk7XHJcbiAgdG9wID0gTWF0aENhdC52ZWMzQ3Jvc3MoIHNpZCwgZGlyICk7XHJcblxyXG4gIHJldHVybiBbXHJcbiAgICBzaWRbMF0sIHRvcFswXSwgZGlyWzBdLCAwLjAsXHJcbiAgICBzaWRbMV0sIHRvcFsxXSwgZGlyWzFdLCAwLjAsXHJcbiAgICBzaWRbMl0sIHRvcFsyXSwgZGlyWzJdLCAwLjAsXHJcbiAgICAtIHNpZFswXSAqIHBvc1swXSAtIHNpZFsxXSAqIHBvc1sxXSAtIHNpZFsyXSAqIHBvc1syXSxcclxuICAgIC0gdG9wWzBdICogcG9zWzBdIC0gdG9wWzFdICogcG9zWzFdIC0gdG9wWzJdICogcG9zWzJdLFxyXG4gICAgLSBkaXJbMF0gKiBwb3NbMF0gLSBkaXJbMV0gKiBwb3NbMV0gLSBkaXJbMl0gKiBwb3NbMl0sXHJcbiAgICAxLjBcclxuICBdO1xyXG59O1xyXG5cclxuTWF0aENhdC5tYXQ0UGVyc3BlY3RpdmUgPSAoIGZvdiwgYXNwZWN0LCBuZWFyLCBmYXIgKSA9PiB7XHJcbiAgbGV0IHAgPSAxLjAgLyBNYXRoLnRhbiggZm92ICogTWF0aC5QSSAvIDM2MC4wICk7XHJcbiAgbGV0IGQgPSAoIGZhciAtIG5lYXIgKTtcclxuICByZXR1cm4gW1xyXG4gICAgcCAvIGFzcGVjdCwgMC4wLCAwLjAsIDAuMCxcclxuICAgIDAuMCwgcCwgMC4wLCAwLjAsXHJcbiAgICAwLjAsIDAuMCwgKCBmYXIgKyBuZWFyICkgLyBkLCAxLjAsXHJcbiAgICAwLjAsIDAuMCwgLTIgKiBmYXIgKiBuZWFyIC8gZCwgMC4wXHJcbiAgXTtcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IE1hdGhDYXQ7IiwibGV0IFR3ZWFrID0gY2xhc3Mge1xuICBjb25zdHJ1Y3RvciggX2VsICkge1xuICAgIGxldCBpdCA9IHRoaXM7XG5cbiAgICBpdC5wYXJlbnQgPSBfZWw7XG4gICAgaXQudmFsdWVzID0ge307XG4gICAgaXQuZWxlbWVudHMgPSB7fTtcbiAgfVxuXG4gIGJ1dHRvbiggX25hbWUsIF9wcm9wcyApIHtcbiAgICBsZXQgaXQgPSB0aGlzO1xuXG4gICAgbGV0IHByb3BzID0gX3Byb3BzIHx8IHt9O1xuXG4gICAgaWYgKCB0eXBlb2YgaXQudmFsdWVzWyBfbmFtZSBdID09PSAndW5kZWZpbmVkJyApIHtcbiAgICAgIGxldCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnZGl2JyApO1xuICAgICAgaXQucGFyZW50LmFwcGVuZENoaWxkKCBkaXYgKTtcblxuICAgICAgbGV0IGlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggJ2lucHV0JyApO1xuICAgICAgZGl2LmFwcGVuZENoaWxkKCBpbnB1dCApO1xuICAgICAgaW5wdXQudHlwZSA9ICdidXR0b24nO1xuICAgICAgaW5wdXQudmFsdWUgPSBfbmFtZTtcblxuICAgICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lciggJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICBpdC52YWx1ZXNbIF9uYW1lIF0gPSB0cnVlO1xuICAgICAgfSApO1xuXG4gICAgICBpdC5lbGVtZW50c1sgX25hbWUgXSA9IHtcbiAgICAgICAgZGl2OiBkaXYsXG4gICAgICAgIGlucHV0OiBpbnB1dFxuICAgICAgfTtcbiAgICB9XG5cbiAgICBsZXQgdGVtcHZhbHVlID0gaXQudmFsdWVzWyBfbmFtZSBdO1xuICAgIGl0LnZhbHVlc1sgX25hbWUgXSA9IGZhbHNlO1xuICAgIGlmICggdHlwZW9mIHByb3BzLnNldCA9PT0gJ2Jvb2xlYW4nICkge1xuICAgICAgaXQudmFsdWVzWyBfbmFtZSBdID0gcHJvcHMuc2V0O1xuICAgIH1cblxuICAgIHJldHVybiB0ZW1wdmFsdWU7XG4gIH1cblxuICBjaGVja2JveCggX25hbWUsIF9wcm9wcyApIHtcbiAgICBsZXQgaXQgPSB0aGlzO1xuXG4gICAgbGV0IHByb3BzID0gX3Byb3BzIHx8IHt9O1xuXG4gICAgbGV0IHZhbHVlO1xuXG4gICAgaWYgKCB0eXBlb2YgaXQudmFsdWVzWyBfbmFtZSBdID09PSAndW5kZWZpbmVkJyApIHtcbiAgICAgIHZhbHVlID0gcHJvcHMudmFsdWUgfHwgZmFsc2U7XG5cbiAgICAgIGxldCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnZGl2JyApO1xuICAgICAgaXQucGFyZW50LmFwcGVuZENoaWxkKCBkaXYgKTtcblxuICAgICAgbGV0IG5hbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnc3BhbicgKTtcbiAgICAgIGRpdi5hcHBlbmRDaGlsZCggbmFtZSApO1xuICAgICAgbmFtZS5pbm5lclRleHQgPSBfbmFtZTtcblxuICAgICAgbGV0IGlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggJ2lucHV0JyApO1xuICAgICAgZGl2LmFwcGVuZENoaWxkKCBpbnB1dCApO1xuICAgICAgaW5wdXQudHlwZSA9ICdjaGVja2JveCc7XG4gICAgICBpbnB1dC5jaGVja2VkID0gdmFsdWU7XG5cbiAgICAgIGl0LmVsZW1lbnRzWyBfbmFtZSBdID0ge1xuICAgICAgICBkaXY6IGRpdixcbiAgICAgICAgbmFtZTogbmFtZSxcbiAgICAgICAgaW5wdXQ6IGlucHV0XG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICB2YWx1ZSA9IGl0LmVsZW1lbnRzWyBfbmFtZSBdLmlucHV0LmNoZWNrZWQ7XG4gICAgfVxuXG4gICAgaWYgKCB0eXBlb2YgcHJvcHMuc2V0ID09PSAnYm9vbGVhbicgKSB7XG4gICAgICB2YWx1ZSA9IHByb3BzLnNldDtcbiAgICB9XG5cbiAgICBpdC5lbGVtZW50c1sgX25hbWUgXS5pbnB1dC5jaGVja2VkID0gdmFsdWU7XG4gICAgaXQudmFsdWVzWyBfbmFtZSBdID0gdmFsdWU7XG5cbiAgICByZXR1cm4gaXQudmFsdWVzWyBfbmFtZSBdO1xuICB9XG5cbiAgcmFuZ2UoIF9uYW1lLCBfcHJvcHMgKSB7XG4gICAgbGV0IGl0ID0gdGhpcztcblxuICAgIGxldCBwcm9wcyA9IF9wcm9wcyB8fCB7fTtcblxuICAgIGxldCB2YWx1ZTtcblxuICAgIGlmICggdHlwZW9mIGl0LnZhbHVlc1sgX25hbWUgXSA9PT0gJ3VuZGVmaW5lZCcgKSB7XG4gICAgICBsZXQgbWluID0gcHJvcHMubWluIHx8IDAuMDtcbiAgICAgIGxldCBtYXggPSBwcm9wcy5tYXggfHwgMS4wO1xuICAgICAgbGV0IHN0ZXAgPSBwcm9wcy5zdGVwIHx8IDAuMDAxO1xuICAgICAgdmFsdWUgPSBwcm9wcy52YWx1ZSB8fCBtaW47XG5cbiAgICAgIGxldCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnZGl2JyApO1xuICAgICAgaXQucGFyZW50LmFwcGVuZENoaWxkKCBkaXYgKTtcblxuICAgICAgbGV0IG5hbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnc3BhbicgKTtcbiAgICAgIGRpdi5hcHBlbmRDaGlsZCggbmFtZSApO1xuICAgICAgbmFtZS5pbm5lclRleHQgPSBfbmFtZTtcblxuICAgICAgbGV0IGlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggJ2lucHV0JyApO1xuICAgICAgZGl2LmFwcGVuZENoaWxkKCBpbnB1dCApO1xuICAgICAgaW5wdXQudHlwZSA9ICdyYW5nZSc7XG4gICAgICBpbnB1dC52YWx1ZSA9IHZhbHVlO1xuICAgICAgaW5wdXQubWluID0gbWluO1xuICAgICAgaW5wdXQubWF4ID0gbWF4O1xuICAgICAgaW5wdXQuc3RlcCA9IHN0ZXA7XG5cbiAgICAgIGxldCB2YWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnc3BhbicgKTtcbiAgICAgIHZhbC5pbm5lclRleHQgPSB2YWx1ZS50b0ZpeGVkKCAzICk7XG4gICAgICBkaXYuYXBwZW5kQ2hpbGQoIHZhbCApO1xuICAgICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lciggJ2lucHV0JywgKCBfZXZlbnQgKSA9PiB7XG4gICAgICAgIGxldCB2YWx1ZSA9IHBhcnNlRmxvYXQoIGlucHV0LnZhbHVlICk7XG4gICAgICAgIHZhbC5pbm5lclRleHQgPSB2YWx1ZS50b0ZpeGVkKCAzICk7XG4gICAgICB9ICk7XG5cbiAgICAgIGl0LmVsZW1lbnRzWyBfbmFtZSBdID0ge1xuICAgICAgICBkaXY6IGRpdixcbiAgICAgICAgbmFtZTogbmFtZSxcbiAgICAgICAgaW5wdXQ6IGlucHV0LFxuICAgICAgICB2YWw6IHZhbFxuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFsdWUgPSBwYXJzZUZsb2F0KCBpdC5lbGVtZW50c1sgX25hbWUgXS5pbnB1dC52YWx1ZSApO1xuICAgIH1cblxuICAgIGlmICggdHlwZW9mIHByb3BzLnNldCA9PT0gJ251bWJlcicgKSB7XG4gICAgICB2YWx1ZSA9IHByb3BzLnNldDtcbiAgICB9XG5cbiAgICBpdC52YWx1ZXNbIF9uYW1lIF0gPSB2YWx1ZTtcbiAgICBpdC5lbGVtZW50c1sgX25hbWUgXS5pbnB1dC52YWx1ZSA9IHZhbHVlO1xuXG4gICAgcmV0dXJuIGl0LnZhbHVlc1sgX25hbWUgXTtcbiAgfTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IFR3ZWFrO1xuIiwibGV0IHNlZWQ7XG5sZXQgeG9yc2hpZnQgPSAoIF9zZWVkICkgPT4ge1xuICBzZWVkID0gX3NlZWQgfHwgc2VlZCB8fCAxO1xuICBzZWVkID0gc2VlZCBeICggc2VlZCA8PCAxMyApO1xuICBzZWVkID0gc2VlZCBeICggc2VlZCA+Pj4gMTcgKTtcbiAgc2VlZCA9IHNlZWQgXiAoIHNlZWQgPDwgNSApO1xuICByZXR1cm4gc2VlZCAvIE1hdGgucG93KCAyLCAzMiApICsgMC41O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgeG9yc2hpZnQ7XG4iLCJpbXBvcnQgeG9yc2hpZnQgZnJvbSBcIi4vbGlicy94b3JzaGlmdFwiO1xuaW1wb3J0IFR3ZWFrIGZyb20gXCIuL2xpYnMvdHdlYWtcIjtcbmltcG9ydCBHTENhdCBmcm9tIFwiLi9saWJzL2dsY2F0XCI7XG5pbXBvcnQgR0xDYXRQYXRoIGZyb20gXCIuL2xpYnMvZ2xjYXQtcGF0aC1ndWlcIjtcbmltcG9ydCBNYXRoQ2F0IGZyb20gXCIuL2xpYnMvbWF0aGNhdFwiO1xuXG5pbXBvcnQgY3ViZSBmcm9tIFwiLi9jdWJlXCI7XG5cbmxldCBnbHNsaWZ5ID0gcmVxdWlyZSggXCJnbHNsaWZ5XCIgKTtcblxuLy8gLS0tLS0tXG5cbnhvcnNoaWZ0KCAzMjY3ODkxNTc4OTAgKTtcblxuLy8gLS0tLS0tXG5cbmxldCB0d2VhayA9IG5ldyBUd2VhayggZGl2VHdlYWsgKTtcblxuLy8gLS0tLS0tXG5cbmxldCBtb3VzZVggPSAwLjA7XG5sZXQgbW91c2VZID0gMC4wO1xuXG5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lciggXCJtb3VzZW1vdmVcIiwgKCBldmVudCApID0+IHtcbiAgbW91c2VYID0gZXZlbnQub2Zmc2V0WDtcbiAgbW91c2VZID0gZXZlbnQub2Zmc2V0WTtcbn0gKTtcblxuLy8gLS0tLS0tXG5cbmxldCBjbGFtcCA9ICggdiwgYiwgdCApID0+IE1hdGgubWluKCBNYXRoLm1heCggdiwgYiApLCB0ICk7XG5sZXQgbGVycCA9ICggYSwgYiwgeCApID0+IGEgKyAoIGIgLSBhICkgKiB4O1xubGV0IHNhdHVyYXRlID0gKCB2ICkgPT4gY2xhbXAoIHYsIDAuMCwgMS4wICk7XG5cbi8vIC0tLS0tLVxuXG5sZXQgd2lkdGggPSBjYW52YXMud2lkdGggPSAzNjA7XG5sZXQgaGVpZ2h0ID0gY2FudmFzLmhlaWdodCA9IDM2MDtcblxubGV0IHJlbmRlckEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCBcImFcIiApO1xuXG5sZXQgc2F2ZUZyYW1lID0gKCkgPT4ge1xuICByZW5kZXJBLmhyZWYgPSBjYW52YXMudG9EYXRhVVJMKCk7XG4gIHJlbmRlckEuZG93bmxvYWQgPSAoIFwiMDAwMFwiICsgdG90YWxGcmFtZSApLnNsaWNlKCAtNSApICsgXCIucG5nXCI7XG4gIHJlbmRlckEuY2xpY2soKTtcbn07XG5cbi8vIC0tLS0tLVxuXG5sZXQgdG90YWxGcmFtZSA9IDA7XG5sZXQgaW5pdCA9IGZhbHNlO1xubGV0IGZyYW1lcyA9IDIwMDtcblxubGV0IGF1dG9tYXRvbiA9IG5ldyBBdXRvbWF0b24oIHtcbiAgZ3VpOiBkaXZBdXRvbWF0b24sXG4gIGZwczogZnJhbWVzLFxuICBkYXRhOiBgXG4gIHtcInZcIjpcIjEuMS4xXCIsXCJsZW5ndGhcIjoxLFwicmVzb2x1dGlvblwiOjEwMDAsXCJwYXJhbXNcIjp7XCJmb2N1c1wiOlt7XCJ0aW1lXCI6MCxcInZhbHVlXCI6NS4yNTcwOTk2NDY2Nzc4MzIsXCJtb2RlXCI6MSxcInBhcmFtc1wiOnt9LFwibW9kc1wiOltmYWxzZSxmYWxzZSxmYWxzZSxmYWxzZV19LHtcInRpbWVcIjoxLFwidmFsdWVcIjo3LjUsXCJtb2RlXCI6MCxcInBhcmFtc1wiOnt9LFwibW9kc1wiOltmYWxzZSxmYWxzZSxmYWxzZSxmYWxzZV19XSxcImNhbWVyYVBvc1lcIjpbe1widGltZVwiOjAsXCJ2YWx1ZVwiOjAsXCJtb2RlXCI6MSxcInBhcmFtc1wiOnt9LFwibW9kc1wiOltmYWxzZSxmYWxzZSxmYWxzZSxmYWxzZV19LHtcInRpbWVcIjoxLFwidmFsdWVcIjowLFwibW9kZVwiOjAsXCJwYXJhbXNcIjp7fSxcIm1vZHNcIjpbZmFsc2UsZmFsc2UsZmFsc2UsZmFsc2VdfV0sXCJjYW1lcmFSb2xsXCI6W3tcInRpbWVcIjowLFwidmFsdWVcIjowLFwibW9kZVwiOjEsXCJwYXJhbXNcIjp7fSxcIm1vZHNcIjpbZmFsc2UsZmFsc2UsZmFsc2UsZmFsc2VdfSx7XCJ0aW1lXCI6MSxcInZhbHVlXCI6MCxcIm1vZGVcIjoxLFwicGFyYW1zXCI6e30sXCJtb2RzXCI6W2ZhbHNlLGZhbHNlLGZhbHNlLGZhbHNlXX1dLFwiY2FtZXJhVGhldGFcIjpbe1widGltZVwiOjAsXCJ2YWx1ZVwiOjAsXCJtb2RlXCI6MSxcInBhcmFtc1wiOnt9LFwibW9kc1wiOltmYWxzZSxmYWxzZSxmYWxzZSxmYWxzZV19LHtcInRpbWVcIjowLjExMzQ2MTUzODQ2MTUzODQ2LFwidmFsdWVcIjowLjM1MzQwMjcwOTE3NTM5MzQ2LFwibW9kZVwiOjQsXCJwYXJhbXNcIjp7XCJyYXRlXCI6NTAwLFwiZGFtcFwiOjF9LFwibW9kc1wiOltmYWxzZSxmYWxzZSxmYWxzZSxmYWxzZV19LHtcInRpbWVcIjowLjI3MzA3NjkyMzA3NjkyMzA1LFwidmFsdWVcIjowLjU5ODU1NjEyMjA0OTIxMjgsXCJtb2RlXCI6NCxcInBhcmFtc1wiOntcInJhdGVcIjo1MDAsXCJkYW1wXCI6MX0sXCJtb2RzXCI6W2ZhbHNlLGZhbHNlLGZhbHNlLGZhbHNlXX0se1widGltZVwiOjAuNDUxOTIzMDc2OTIzMDc2OSxcInZhbHVlXCI6MC44NTkzMTAzMTE3MDk0ODQ1LFwibW9kZVwiOjQsXCJwYXJhbXNcIjp7XCJyYXRlXCI6NTAwLFwiZGFtcFwiOjF9LFwibW9kc1wiOltmYWxzZSxmYWxzZSxmYWxzZSxmYWxzZV19LHtcInRpbWVcIjowLjU5MDM4NDYxNTM4NDYxNTQsXCJ2YWx1ZVwiOjEuMjI4NTc2MDc4MjUxMzA2OSxcIm1vZGVcIjo0LFwicGFyYW1zXCI6e1wicmF0ZVwiOjUwMCxcImRhbXBcIjoxfSxcIm1vZHNcIjpbZmFsc2UsZmFsc2UsZmFsc2UsZmFsc2VdfSx7XCJ0aW1lXCI6MC43NDAzODQ2MTUzODQ2MTU0LFwidmFsdWVcIjoxLjQ5MDMzNTg1ODY0NTUxODIsXCJtb2RlXCI6NCxcInBhcmFtc1wiOntcInJhdGVcIjo1MDAsXCJkYW1wXCI6MX0sXCJtb2RzXCI6W2ZhbHNlLGZhbHNlLGZhbHNlLGZhbHNlXX0se1widGltZVwiOjAuODQ2MTUzODQ2MTUzODQ2MSxcInZhbHVlXCI6MS43MjUzNDYyODU0ODI5OTAyLFwibW9kZVwiOjQsXCJwYXJhbXNcIjp7XCJyYXRlXCI6NTAwLFwiZGFtcFwiOjF9LFwibW9kc1wiOltmYWxzZSxmYWxzZSxmYWxzZSxmYWxzZV19LHtcInRpbWVcIjoxLFwidmFsdWVcIjoyLjA0OTE2NjM2MDc1OTQ5NyxcIm1vZGVcIjo0LFwicGFyYW1zXCI6e1wicmF0ZVwiOjUwMCxcImRhbXBcIjoxfSxcIm1vZHNcIjpbZmFsc2UsZmFsc2UsZmFsc2UsZmFsc2VdfV0sXCJjYW1lcmFSYWRpdXNcIjpbe1widGltZVwiOjAsXCJ2YWx1ZVwiOjUsXCJtb2RlXCI6MSxcInBhcmFtc1wiOnt9LFwibW9kc1wiOltmYWxzZSxmYWxzZSxmYWxzZSxmYWxzZV19LHtcInRpbWVcIjoxLFwidmFsdWVcIjoxLFwibW9kZVwiOjAsXCJwYXJhbXNcIjp7fSxcIm1vZHNcIjpbZmFsc2UsZmFsc2UsZmFsc2UsZmFsc2VdfV19LFwiZ3VpXCI6e1wic25hcFwiOntcImVuYWJsZVwiOmZhbHNlLFwiYnBtXCI6MTIwLFwib2Zmc2V0XCI6MH19fVxuYFxufSApO1xubGV0IGF1dG8gPSBhdXRvbWF0b24uYXV0bztcblxuLy8gLS0tLS0tXG5cbmxldCBjYW1lcmFQb3MgPSBbIDAuMCwgMC4wLCA4LjAgXTtcbmxldCBjYW1lcmFUYXIgPSBbIDAuMCwgMC4wLCAwLjAgXTtcbmxldCBjYW1lcmFSb2xsID0gMC4wO1xubGV0IGNhbWVyYUZvdiA9IDkwLjA7XG5cbmxldCBjYW1lcmFOZWFyID0gMC4xO1xubGV0IGNhbWVyYUZhciA9IDEwMC4wO1xuXG5sZXQgbGlnaHRQb3MgPSBbIDEwLjAsIDEwLjAsIDEwLjAgXTtcblxubGV0IG1hdFA7XG5sZXQgbWF0VjtcbmxldCBtYXRQTDtcbmxldCBtYXRWTDtcblxubGV0IHVwZGF0ZU1hdHJpY2VzID0gKCkgPT4ge1xuICBsZXQgY2FtZXJhVGhldGEgPSBhdXRvKCBcImNhbWVyYVRoZXRhXCIgKSAqIE1hdGguUEkgKiAyLjA7XG4gIGxldCBjYW1lcmFSYWRpdXMgPSBhdXRvKCBcImNhbWVyYVJhZGl1c1wiICk7XG4gIGNhbWVyYVBvc1sgMCBdID0gY2FtZXJhUmFkaXVzICogTWF0aC5zaW4oIGNhbWVyYVRoZXRhICk7XG4gIGNhbWVyYVBvc1sgMSBdID0gYXV0byggXCJjYW1lcmFQb3NZXCIgKTtcbiAgY2FtZXJhUG9zWyAyIF0gPSBjYW1lcmFSYWRpdXMgKiBNYXRoLmNvcyggY2FtZXJhVGhldGEgKTtcbiAgY2FtZXJhUm9sbCA9IGF1dG8oIFwiY2FtZXJhUm9sbFwiICk7XG5cbiAgbGlnaHRQb3NbIDAgXSA9IDEwLjAgKiBNYXRoLnNpbiggY2FtZXJhVGhldGEgKyAxLjAgKTtcbiAgbGlnaHRQb3NbIDIgXSA9IDEwLjAgKiBNYXRoLmNvcyggY2FtZXJhVGhldGEgKyAxLjAgKTtcblxuICBtYXRQID0gTWF0aENhdC5tYXQ0UGVyc3BlY3RpdmUoIGNhbWVyYUZvdiwgd2lkdGggLyBoZWlnaHQsIGNhbWVyYU5lYXIsIGNhbWVyYUZhciApO1xuICBtYXRWID0gTWF0aENhdC5tYXQ0TG9va0F0KCBjYW1lcmFQb3MsIGNhbWVyYVRhciwgWyAwLjAsIDEuMCwgMC4wIF0sIGNhbWVyYVJvbGwgKTtcblxuICBtYXRQTCA9IE1hdGhDYXQubWF0NFBlcnNwZWN0aXZlKCBjYW1lcmFGb3YsIDEuMCwgY2FtZXJhTmVhciwgY2FtZXJhRmFyICk7XG4gIG1hdFZMID0gTWF0aENhdC5tYXQ0TG9va0F0KCBsaWdodFBvcywgY2FtZXJhVGFyLCBbIDAuMCwgMS4wLCAwLjAgXSwgMC4wICk7XG59O1xudXBkYXRlTWF0cmljZXMoKTtcblxuLy8gLS0tLS0tXG5cbmxldCBnbCA9IGNhbnZhcy5nZXRDb250ZXh0KCBcIndlYmdsXCIgKTtcbmdsLmVuYWJsZSggZ2wuQ1VMTF9GQUNFICk7XG5cbmxldCBnbENhdCA9IG5ldyBHTENhdCggZ2wgKTtcblxuZ2xDYXQuZ2V0RXh0ZW5zaW9uKCBcIk9FU190ZXh0dXJlX2Zsb2F0XCIsIHRydWUgKTtcbmdsQ2F0LmdldEV4dGVuc2lvbiggXCJPRVNfdGV4dHVyZV9mbG9hdF9saW5lYXJcIiwgdHJ1ZSApO1xuZ2xDYXQuZ2V0RXh0ZW5zaW9uKCBcIkVYVF9mcmFnX2RlcHRoXCIsIHRydWUgKTtcbmdsQ2F0LmdldEV4dGVuc2lvbiggXCJXRUJHTF9kcmF3X2J1ZmZlcnNcIiwgdHJ1ZSApO1xuZ2xDYXQuZ2V0RXh0ZW5zaW9uKCBcIkFOR0xFX2luc3RhbmNlZF9hcnJheXNcIiwgdHJ1ZSApO1xuXG5sZXQgZ2xDYXRQYXRoID0gbmV3IEdMQ2F0UGF0aCggZ2xDYXQsIHtcbiAgZHJhd2J1ZmZlcnM6IHRydWUsXG4gIGVsOiBkaXZQYXRoLFxuICBjYW52YXM6IGNhbnZhcyxcbiAgc3RyZXRjaDogdHJ1ZVxufSApO1xuXG4vLyAtLS0tLS1cblxubGV0IHZib1F1YWQgPSBnbENhdC5jcmVhdGVWZXJ0ZXhidWZmZXIoIFsgLTEsIC0xLCAxLCAtMSwgLTEsIDEsIDEsIDEgXSApO1xubGV0IHZib1F1YWRVViA9IGdsQ2F0LmNyZWF0ZVZlcnRleGJ1ZmZlciggWyAwLCAxLCAxLCAxLCAwLCAwLCAxLCAwIF0gKTtcbmxldCB2Ym9RdWFkMyA9IGdsQ2F0LmNyZWF0ZVZlcnRleGJ1ZmZlciggWyAtMSwgLTEsIDAsIDEsIC0xLCAwLCAtMSwgMSwgMCwgMSwgMSwgMCBdICk7XG5sZXQgdmJvUXVhZDNOb3IgPSBnbENhdC5jcmVhdGVWZXJ0ZXhidWZmZXIoIFsgMCwgMCwgMSwgMCwgMCwgMSwgMCwgMCwgMSwgMCwgMCwgMSBdICk7XG5cbi8vIC0tLS0tLVxuXG5sZXQgdmJvQ3ViZVBvcyA9IGdsQ2F0LmNyZWF0ZVZlcnRleGJ1ZmZlciggY3ViZS5wb3MgKTtcbmxldCB2Ym9DdWJlTm9yID0gZ2xDYXQuY3JlYXRlVmVydGV4YnVmZmVyKCBjdWJlLm5vciApO1xuXG4vLyAtLS0tLS1cblxubGV0IHBhcnRpY2xlUGl4ZWxzID0gMztcbmxldCBwYXJ0aWNsZXNTcXJ0ID0gNjQ7XG5sZXQgcGFydGljbGVzID0gcGFydGljbGVzU3FydCAqIHBhcnRpY2xlc1NxcnQ7XG5sZXQgdmVydHNQZXJQYXJ0aWNsZSA9IHZib0N1YmVQb3MubGVuZ3RoIC8gMztcblxubGV0IHZib1BhcnRpY2xlVVYgPSBnbENhdC5jcmVhdGVWZXJ0ZXhidWZmZXIoICggKCkgPT4ge1xuICBsZXQgcmV0ID0gW107XG4gIGZvciAoIGxldCBpID0gMDsgaSA8IHBhcnRpY2xlczsgaSArKyApIHtcbiAgICBsZXQgaXggPSBpICUgcGFydGljbGVzU3FydDtcbiAgICBsZXQgaXkgPSBNYXRoLmZsb29yKCBpIC8gcGFydGljbGVzU3FydCApO1xuICAgIFxuICAgIHJldC5wdXNoKCBpeCAqIHBhcnRpY2xlUGl4ZWxzICk7XG4gICAgcmV0LnB1c2goIGl5ICk7XG4gIH1cbiAgcmV0dXJuIHJldDtcbn0gKSgpICk7XG5cbi8vIC0tLS0tLVxuXG5sZXQgdGVycmFpblNpemUgPSA2NDtcbmxldCB0ZXJyYWluVmVydGljZXMgPSB0ZXJyYWluU2l6ZSAqIHRlcnJhaW5TaXplO1xuXG5sZXQgdGVycmFpblRyaUxlbmd0aCA9ICggdGVycmFpblNpemUgLSAxICkgKiAoIHRlcnJhaW5TaXplIC0gMSApICogMjtcbmxldCB0ZXJyYWluVVYgPSBbXTtcbmxldCB0ZXJyYWluVHJpSW5kZXggPSBbXTtcblxuZm9yICggbGV0IGl5ID0gMDsgaXkgPCB0ZXJyYWluU2l6ZSAtIDE7IGl5ICsrICkge1xuICBmb3IgKCBsZXQgaXggPSAwOyBpeCA8IHRlcnJhaW5TaXplIC0gMTsgaXggKysgKSB7XG4gICAgdGVycmFpblVWLnB1c2goXG4gICAgICAoIGl4ICsgMC41ICkgLyB0ZXJyYWluU2l6ZSxcbiAgICAgICggaXkgKyAwLjUgKSAvIHRlcnJhaW5TaXplLFxuICAgICAgKCBpeCArIDEuNSApIC8gdGVycmFpblNpemUsXG4gICAgICAoIGl5ICsgMC41ICkgLyB0ZXJyYWluU2l6ZSxcbiAgICAgICggaXggKyAwLjUgKSAvIHRlcnJhaW5TaXplLFxuICAgICAgKCBpeSArIDEuNSApIC8gdGVycmFpblNpemUsXG5cbiAgICAgICggaXggKyAwLjUgKSAvIHRlcnJhaW5TaXplLFxuICAgICAgKCBpeSArIDEuNSApIC8gdGVycmFpblNpemUsXG4gICAgICAoIGl4ICsgMS41ICkgLyB0ZXJyYWluU2l6ZSxcbiAgICAgICggaXkgKyAwLjUgKSAvIHRlcnJhaW5TaXplLFxuICAgICAgKCBpeCArIDEuNSApIC8gdGVycmFpblNpemUsXG4gICAgICAoIGl5ICsgMS41ICkgLyB0ZXJyYWluU2l6ZVxuICAgICk7XG5cbiAgICBsZXQgaSA9IGl4ICsgaXkgKiAoIHRlcnJhaW5TaXplIC0gMSApO1xuICAgIHRlcnJhaW5UcmlJbmRleC5wdXNoKFxuICAgICAgKCBpICogMiArIDAuNSApIC8gdGVycmFpblRyaUxlbmd0aCxcbiAgICAgICggaSAqIDIgKyAwLjUgKSAvIHRlcnJhaW5UcmlMZW5ndGgsXG4gICAgICAoIGkgKiAyICsgMC41ICkgLyB0ZXJyYWluVHJpTGVuZ3RoLFxuICAgICAgKCBpICogMiArIDEuNSApIC8gdGVycmFpblRyaUxlbmd0aCxcbiAgICAgICggaSAqIDIgKyAxLjUgKSAvIHRlcnJhaW5UcmlMZW5ndGgsXG4gICAgICAoIGkgKiAyICsgMS41ICkgLyB0ZXJyYWluVHJpTGVuZ3RoXG4gICAgKTtcbiAgfVxufVxuXG5sZXQgdmJvVGVycmFpblVWID0gZ2xDYXQuY3JlYXRlVmVydGV4YnVmZmVyKCB0ZXJyYWluVVYgKTtcbmxldCB2Ym9UZXJyYWluVHJpSW5kZXggPSBnbENhdC5jcmVhdGVWZXJ0ZXhidWZmZXIoIHRlcnJhaW5UcmlJbmRleCApO1xuXG5sZXQgdGV4dHVyZVRlcnJhaW5VViA9IGdsQ2F0LmNyZWF0ZVRleHR1cmUoKTtcbmdsQ2F0LnNldFRleHR1cmVGcm9tRmxvYXRBcnJheSggdGV4dHVyZVRlcnJhaW5VViwgMywgdGVycmFpblRyaUxlbmd0aCwgKCAoKSA9PiB7XG4gIGxldCByZXQgPSBuZXcgRmxvYXQzMkFycmF5KCB0ZXJyYWluVHJpTGVuZ3RoICogMyAqIDQgKTtcbiAgZm9yICggbGV0IGkgPSAwOyBpIDwgdGVycmFpblRyaUxlbmd0aCAqIDM7IGkgKysgKSB7XG4gICAgcmV0WyBpICogNCAgICAgXSA9IHRlcnJhaW5VVlsgaSAqIDIgICAgIF07XG4gICAgcmV0WyBpICogNCArIDEgXSA9IHRlcnJhaW5VVlsgaSAqIDIgKyAxIF07XG4gICAgcmV0WyBpICogNCArIDIgXSA9IDAuMDtcbiAgICByZXRbIGkgKiA0ICsgMyBdID0gMS4wO1xuICB9XG4gIHJldHVybiByZXQ7XG59ICkoKSApO1xuXG4vLyAtLS0tLS1cblxubGV0IHRleHR1cmVEdW1teSA9IGdsQ2F0LmNyZWF0ZVRleHR1cmUoKTtcbmdsQ2F0LnNldFRleHR1cmVGcm9tQXJyYXkoIHRleHR1cmVEdW1teSwgMSwgMSwgWyAxLCAwLCAxLCAxIF0gKTtcblxubGV0IHRleHR1cmVSYW5kb21TaXplID0gMzI7XG5sZXQgdGV4dHVyZVJhbmRvbVVwZGF0ZSA9ICggX3RleCApID0+IHtcbiAgZ2xDYXQuc2V0VGV4dHVyZUZyb21BcnJheSggX3RleCwgdGV4dHVyZVJhbmRvbVNpemUsIHRleHR1cmVSYW5kb21TaXplLCAoICgpID0+IHtcbiAgICBsZXQgbGVuID0gdGV4dHVyZVJhbmRvbVNpemUgKiB0ZXh0dXJlUmFuZG9tU2l6ZSAqIDQ7XG4gICAgbGV0IHJldCA9IG5ldyBVaW50OEFycmF5KCBsZW4gKTtcbiAgICBmb3IgKCBsZXQgaSA9IDA7IGkgPCBsZW47IGkgKysgKSB7XG4gICAgICByZXRbIGkgXSA9IE1hdGguZmxvb3IoIHhvcnNoaWZ0KCkgKiAyNTYuMCApO1xuICAgIH1cbiAgICByZXR1cm4gcmV0O1xuICB9ICkoKSApO1xufTtcblxubGV0IHRleHR1cmVSYW5kb21TdGF0aWMgPSBnbENhdC5jcmVhdGVUZXh0dXJlKCk7XG5nbENhdC50ZXh0dXJlV3JhcCggdGV4dHVyZVJhbmRvbVN0YXRpYywgZ2wuUkVQRUFUICk7XG50ZXh0dXJlUmFuZG9tVXBkYXRlKCB0ZXh0dXJlUmFuZG9tU3RhdGljICk7XG5cbmxldCB0ZXh0dXJlUmFuZG9tID0gZ2xDYXQuY3JlYXRlVGV4dHVyZSgpO1xuZ2xDYXQudGV4dHVyZVdyYXAoIHRleHR1cmVSYW5kb20sIGdsLlJFUEVBVCApO1xuXG4vLyAtLS0tLS1cblxubGV0IGZyYW1lYnVmZmVyc0dhdXNzID0gW1xuICBnbENhdC5jcmVhdGVGbG9hdEZyYW1lYnVmZmVyKCB3aWR0aCAvIDQsIGhlaWdodCAvIDQgKSxcbiAgZ2xDYXQuY3JlYXRlRmxvYXRGcmFtZWJ1ZmZlciggd2lkdGggLyA0LCBoZWlnaHQgLyA0ICksXG4gIGdsQ2F0LmNyZWF0ZUZsb2F0RnJhbWVidWZmZXIoIHdpZHRoIC8gNCwgaGVpZ2h0IC8gNCApXG5dO1xuXG5sZXQgZnJhbWVidWZmZXJQcmVEb2YgPSBnbENhdC5jcmVhdGVGbG9hdEZyYW1lYnVmZmVyKCB3aWR0aCwgaGVpZ2h0ICk7XG5cbmxldCBmcmFtZWJ1ZmZlck1vdGlvblByZXYgPSBnbENhdC5jcmVhdGVGcmFtZWJ1ZmZlciggd2lkdGgsIGhlaWdodCApO1xubGV0IGZyYW1lYnVmZmVyTW90aW9uTW9zaCA9IGdsQ2F0LmNyZWF0ZUZyYW1lYnVmZmVyKCB3aWR0aCwgaGVpZ2h0ICk7XG5cbmxldCBzaGFkb3dTaXplID0gNTEyO1xuXG4vLyAtLS0tLS1cblxubGV0IGJnQ29sb3IgPSBbIDAuMDEsIDAuMDEsIDAuMDEsIDEuMCBdO1xuXG4vLyAtLS0tLS1cblxuZ2xDYXRQYXRoLnNldEdsb2JhbEZ1bmMoICgpID0+IHtcbiAgZ2xDYXQudW5pZm9ybTFpKCBcImluaXRcIiwgaW5pdCApO1xuICBnbENhdC51bmlmb3JtMWYoIFwidGltZVwiLCBhdXRvbWF0b24udGltZSApO1xuICBnbENhdC51bmlmb3JtMWYoIFwiZGVsdGFUaW1lXCIsIGF1dG9tYXRvbi5kZWx0YVRpbWUgKTtcblxuICBnbENhdC51bmlmb3JtMWYoIFwiZnJhbWVcIiwgYXV0b21hdG9uLmZyYW1lICk7XG4gIGdsQ2F0LnVuaWZvcm0xZiggXCJmcmFtZXNcIiwgZnJhbWVzICk7XG5cbiAgZ2xDYXQudW5pZm9ybTJmdiggXCJtb3VzZVwiLCBbIG1vdXNlWCwgbW91c2VZIF0gKTtcblxuICBnbENhdC51bmlmb3JtM2Z2KCBcImNhbWVyYVBvc1wiLCBjYW1lcmFQb3MgKTtcbiAgZ2xDYXQudW5pZm9ybTNmdiggXCJjYW1lcmFUYXJcIiwgY2FtZXJhVGFyICk7XG4gIGdsQ2F0LnVuaWZvcm0xZiggXCJjYW1lcmFSb2xsXCIsIGNhbWVyYVJvbGwgKTtcbiAgZ2xDYXQudW5pZm9ybTFmKCBcImNhbWVyYUZvdlwiLCBjYW1lcmFGb3YgKTtcbiAgZ2xDYXQudW5pZm9ybTFmKCBcImNhbWVyYU5lYXJcIiwgY2FtZXJhTmVhciApO1xuICBnbENhdC51bmlmb3JtMWYoIFwiY2FtZXJhRmFyXCIsIGNhbWVyYUZhciApO1xuICBnbENhdC51bmlmb3JtM2Z2KCBcImxpZ2h0UG9zXCIsIGxpZ2h0UG9zICk7XG5cbiAgZ2xDYXQudW5pZm9ybTFmKCBcInBhcnRpY2xlc1NxcnRcIiwgcGFydGljbGVzU3FydCApO1xuICBnbENhdC51bmlmb3JtMWYoIFwicGFydGljbGVQaXhlbHNcIiwgcGFydGljbGVQaXhlbHMgKTtcblxuICBnbENhdC51bmlmb3JtTWF0cml4NGZ2KCBcIm1hdFBcIiwgbWF0UCApO1xuICBnbENhdC51bmlmb3JtTWF0cml4NGZ2KCBcIm1hdFZcIiwgbWF0ViApO1xuICBnbENhdC51bmlmb3JtTWF0cml4NGZ2KCBcIm1hdFBMXCIsIG1hdFBMICk7XG4gIGdsQ2F0LnVuaWZvcm1NYXRyaXg0ZnYoIFwibWF0VkxcIiwgbWF0VkwgKTtcbiAgZ2xDYXQudW5pZm9ybTRmdiggXCJiZ0NvbG9yXCIsIGJnQ29sb3IgKTtcbn0gKTtcblxuZ2xDYXRQYXRoLmFkZCgge1xuICByZXR1cm46IHtcbiAgICB3aWR0aDogd2lkdGgsXG4gICAgaGVpZ2h0OiBoZWlnaHQsXG4gICAgdmVydDogZ2xzbGlmeSggXCIuL3NoYWRlci9xdWFkLnZlcnRcIiApLFxuICAgIGZyYWc6IGdsc2xpZnkoIFwiLi9zaGFkZXIvcmV0dXJuLmZyYWdcIiApLFxuICAgIGJsZW5kOiBbIGdsLk9ORSwgZ2wuWkVSTyBdLFxuICAgIGNsZWFyOiBbIDAuMCwgMC4wLCAwLjAsIDEuMCBdLFxuICAgIGZ1bmM6ICggcGF0aCwgcGFyYW1zICkgPT4ge1xuICAgICAgZ2xDYXQuYXR0cmlidXRlKCBcInBcIiwgdmJvUXVhZCwgMiApO1xuICAgICAgZ2xDYXQudW5pZm9ybVRleHR1cmUoIFwic2FtcGxlcjBcIiwgcGFyYW1zLmlucHV0LCAwICk7XG4gICAgICBnbC5kcmF3QXJyYXlzKCBnbC5UUklBTkdMRV9TVFJJUCwgMCwgNCApO1xuICAgIH1cbiAgfSxcblxuICBpbnNwZWN0b3I6IHtcbiAgICB3aWR0aDogd2lkdGgsXG4gICAgaGVpZ2h0OiBoZWlnaHQsXG4gICAgdmVydDogZ2xzbGlmeSggXCIuL3NoYWRlci9xdWFkLnZlcnRcIiApLFxuICAgIGZyYWc6IGdsc2xpZnkoIFwiLi9zaGFkZXIvaW5zcGVjdG9yLmZyYWdcIiApLFxuICAgIGJsZW5kOiBbIGdsLk9ORSwgZ2wuWkVSTyBdLFxuICAgIGNsZWFyOiBbIDAuMCwgMC4wLCAwLjAsIDEuMCBdLFxuICAgIGZ1bmM6ICggcGF0aCwgcGFyYW1zICkgPT4ge1xuICAgICAgZ2xDYXQuYXR0cmlidXRlKCBcInBcIiwgdmJvUXVhZCwgMiApO1xuICAgICAgZ2xDYXQudW5pZm9ybTNmdiggXCJjaXJjbGVDb2xvclwiLCBbIDEuMCwgMS4wLCAxLjAgXSApO1xuICAgICAgZ2xDYXQudW5pZm9ybVRleHR1cmUoIFwic2FtcGxlcjBcIiwgcGFyYW1zLmlucHV0LCAwICk7XG4gICAgICBnbC5kcmF3QXJyYXlzKCBnbC5UUklBTkdMRV9TVFJJUCwgMCwgNCApO1xuICAgIH1cbiAgfSxcblxuICBnYXVzc1RhYmxlOiB7XG4gICAgd2lkdGg6IDYsIC8vIHJhZGl1cyBvZiBkb2ZcbiAgICBoZWlnaHQ6IDI1NixcbiAgICB2ZXJ0OiBnbHNsaWZ5KCBcIi4vc2hhZGVyL3F1YWQudmVydFwiICksXG4gICAgZnJhZzogZ2xzbGlmeSggXCIuL3NoYWRlci9nYXVzcy10YWJsZS5mcmFnXCIgKSxcbiAgICBibGVuZDogWyBnbC5PTkUsIGdsLlpFUk8gXSxcbiAgICBjbGVhcjogWyAwLjAsIDAuMCwgMC4wLCAxLjAgXSxcbiAgICBmcmFtZWJ1ZmZlcjogdHJ1ZSxcbiAgICBmbG9hdDogdHJ1ZSxcbiAgICBmdW5jOiAoIHBhdGgsIHBhcmFtcyApID0+IHtcbiAgICAgIGdsQ2F0LmF0dHJpYnV0ZSggXCJwXCIsIHZib1F1YWQsIDIgKTtcbiAgICAgIGdsLmRyYXdBcnJheXMoIGdsLlRSSUFOR0xFX1NUUklQLCAwLCA0ICk7XG4gICAgfVxuICB9LFxuXG4gIFwi8J+QrFwiOiB7XG4gICAgd2lkdGg6IHdpZHRoLFxuICAgIGhlaWdodDogaGVpZ2h0LFxuICAgIHZlcnQ6IGdsc2xpZnkoIFwiLi9zaGFkZXIvcXVhZC52ZXJ0XCIgKSxcbiAgICBmcmFnOiBnbHNsaWZ5KCBcIi4vc2hhZGVyL2JnLmZyYWdcIiApLFxuICAgIGJsZW5kOiBbIGdsLk9ORSwgZ2wuWkVSTyBdLFxuICAgIGNsZWFyOiBbIDAuMCwgMC4wLCAwLjAsIDEuMCBdLFxuICAgIGZyYW1lYnVmZmVyOiB0cnVlLFxuICAgIGRyYXdidWZmZXJzOiAyLFxuICAgIGZsb2F0OiB0cnVlLFxuICAgIGZ1bmM6ICgpID0+IHtcbiAgICAgIGdsQ2F0LmF0dHJpYnV0ZSggXCJwXCIsIHZib1F1YWQsIDIgKTtcbiAgICAgIGdsLmRyYXdBcnJheXMoIGdsLlRSSUFOR0xFX1NUUklQLCAwLCA0ICk7XG4gICAgfVxuICB9LFxuXG4gIFwi5b2xXCI6IHtcbiAgICB3aWR0aDogc2hhZG93U2l6ZSxcbiAgICBoZWlnaHQ6IHNoYWRvd1NpemUsXG4gICAgdmVydDogZ2xzbGlmeSggXCIuL3NoYWRlci9xdWFkLnZlcnRcIiApLFxuICAgIGZyYWc6IGdsc2xpZnkoIFwiLi9zaGFkZXIvcmV0dXJuLmZyYWdcIiApLFxuICAgIGJsZW5kOiBbIGdsLk9ORSwgZ2wuWkVSTyBdLFxuICAgIGNsZWFyOiBbIGNhbWVyYUZhciwgMC4wLCAwLjAsIDEuMCBdLFxuICAgIGZyYW1lYnVmZmVyOiB0cnVlLFxuICAgIGRyYXdidWZmZXJzOiAyLFxuICAgIGZsb2F0OiB0cnVlLFxuICAgIGZ1bmM6ICgpID0+IHt9XG4gIH0sXG5cbiAgcmF5bWFyY2g6IHtcbiAgICB3aWR0aDogd2lkdGgsXG4gICAgaGVpZ2h0OiBoZWlnaHQsXG4gICAgdmVydDogZ2xzbGlmeSggXCIuL3NoYWRlci9xdWFkLnZlcnRcIiApLFxuICAgIGZyYWc6IGdsc2xpZnkoIFwiLi9zaGFkZXIvcmF5bWFyY2guZnJhZ1wiICksXG4gICAgZHJhd2J1ZmZlcnM6IDIsXG4gICAgYmxlbmQ6IFsgZ2wuU1JDX0FMUEhBLCBnbC5PTkVfTUlOVVNfU1JDX0FMUEhBIF0sXG4gICAgZnVuYzogKCBwYXRoLCBwYXJhbXMgKSA9PiB7XG4gICAgICBnbENhdC5hdHRyaWJ1dGUoIFwicFwiLCB2Ym9RdWFkLCAyICk7XG4gICAgICBcbiAgICAgIGdsQ2F0LnVuaWZvcm0xaSggXCJpc1NoYWRvd1wiLCBwYXJhbXMuaXNTaGFkb3cgKTtcbiAgICAgIGlmICggIXBhcmFtcy5pc1NoYWRvdyApIHtcbiAgICAgICAgZ2xDYXQudW5pZm9ybVRleHR1cmUoIFwic2FtcGxlclNoYWRvd1wiLCBnbENhdFBhdGguZmIoIFwi5b2xXCIgKS50ZXh0dXJlc1sgMCBdLCAwICk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBnbENhdC51bmlmb3JtVGV4dHVyZSggXCJzYW1wbGVyU2hhZG93XCIsIHRleHR1cmVEdW1teSwgMCApO1xuICAgICAgfVxuICAgICAgXG4gICAgICBnbENhdC51bmlmb3JtM2Z2KCBcImNvbG9yXCIsIFsgMC41LCAwLjUsIDAuNSBdICk7IC8vIGlsbGVnYWxcbiAgICAgIGdsLmRyYXdBcnJheXMoIGdsLlRSSUFOR0xFX1NUUklQLCAwLCA0ICk7XG4gICAgfVxuICB9LFxuXG4gIHRlcnJhaW5Db21wdXRlOiB7XG4gICAgd2lkdGg6IHRlcnJhaW5TaXplLFxuICAgIGhlaWdodDogdGVycmFpblNpemUsXG4gICAgdmVydDogZ2xzbGlmeSggXCIuL3NoYWRlci9xdWFkLnZlcnRcIiApLFxuICAgIGZyYWc6IGdsc2xpZnkoIFwiLi9zaGFkZXIvdGVycmFpbi1jb21wdXRlLmZyYWdcIiApLFxuICAgIGJsZW5kOiBbIGdsLk9ORSwgZ2wuWkVSTyBdLFxuICAgIGNsZWFyOiBbIDAuMCwgMC4wLCAwLjAsIDAuMCBdLFxuICAgIGZyYW1lYnVmZmVyOiB0cnVlLFxuICAgIGZsb2F0OiB0cnVlLFxuICAgIGZ1bmM6ICggcGF0aCwgcGFyYW1zICkgPT4ge1xuICAgICAgZ2xDYXQuYXR0cmlidXRlKCBcInBcIiwgdmJvUXVhZCwgMiApO1xuICAgICAgZ2xDYXQudW5pZm9ybVRleHR1cmUoIFwic2FtcGxlclJhbmRvbVwiLCB0ZXh0dXJlUmFuZG9tLCAwICk7XG4gICAgICBnbENhdC51bmlmb3JtVGV4dHVyZSggXCJzYW1wbGVyUmFuZG9tU3RhdGljXCIsIHRleHR1cmVSYW5kb21TdGF0aWMsIDEgKTtcbiAgICAgIGdsLmRyYXdBcnJheXMoIGdsLlRSSUFOR0xFX1NUUklQLCAwLCA0ICk7XG4gICAgfVxuICB9LFxuXG4gIHRlcnJhaW5SZW5kZXI6IHtcbiAgICB3aWR0aDogd2lkdGgsXG4gICAgaGVpZ2h0OiBoZWlnaHQsXG4gICAgdmVydDogZ2xzbGlmeSggXCIuL3NoYWRlci90ZXJyYWluLXJlbmRlci52ZXJ0XCIgKSxcbiAgICBmcmFnOiBnbHNsaWZ5KCBcIi4vc2hhZGVyL3NoYWRlLmZyYWdcIiApLFxuICAgIGRyYXdidWZmZXJzOiAyLFxuICAgIGJsZW5kOiBbIGdsLlNSQ19BTFBIQSwgZ2wuT05FX01JTlVTX1NSQ19BTFBIQSBdLFxuICAgIGZ1bmM6ICggcGF0aCwgcGFyYW1zICkgPT4ge1xuICAgICAgZ2xDYXQuYXR0cmlidXRlKCBcInV2XCIsIHZib1RlcnJhaW5VViwgMiApO1xuICAgICAgZ2xDYXQuYXR0cmlidXRlKCBcInRyaUluZGV4XCIsIHZib1RlcnJhaW5UcmlJbmRleCwgMSApO1xuICAgICAgICBcbiAgICAgIGxldCBtYXRNID0gTWF0aENhdC5tYXQ0SWRlbnRpdHkoKTtcbiAgICAgIGdsQ2F0LnVuaWZvcm1NYXRyaXg0ZnYoIFwibWF0TVwiLCBtYXRNICk7XG5cbiAgICAgIGdsQ2F0LnVuaWZvcm1UZXh0dXJlKCBcInNhbXBsZXJUZXJyYWluXCIsIGdsQ2F0UGF0aC5mYiggXCJ0ZXJyYWluQ29tcHV0ZVwiICkudGV4dHVyZSwgMCApO1xuICAgICAgZ2xDYXQudW5pZm9ybVRleHR1cmUoIFwic2FtcGxlclVWXCIsIHRleHR1cmVUZXJyYWluVVYsIDEgKTtcblxuICAgICAgZ2xDYXQudW5pZm9ybTFpKCBcImlzU2hhZG93XCIsIHBhcmFtcy5pc1NoYWRvdyApO1xuICAgICAgaWYgKCAhcGFyYW1zLmlzU2hhZG93ICkge1xuICAgICAgICBnbENhdC51bmlmb3JtVGV4dHVyZSggXCJzYW1wbGVyU2hhZG93XCIsIGdsQ2F0UGF0aC5mYiggXCLlvbFcIiApLnRleHR1cmVzWyAwIF0sIDIgKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGdsQ2F0LnVuaWZvcm1UZXh0dXJlKCBcInNhbXBsZXJTaGFkb3dcIiwgdGV4dHVyZUR1bW15LCAyICk7XG4gICAgICB9XG4gICAgICBnbENhdC51bmlmb3JtM2Z2KCBcImNvbG9yXCIsIFsgMC44LCAwLjgsIDAuOCBdICk7XG4gICAgICBnbC5kcmF3QXJyYXlzKCBnbC5UUklBTkdMRVMsIDAsIHZib1RlcnJhaW5VVi5sZW5ndGggLyAyICk7XG4gICAgfVxuICB9LFxuXG4gIGN1YmU6IHtcbiAgICB3aWR0aDogd2lkdGgsXG4gICAgaGVpZ2h0OiBoZWlnaHQsXG4gICAgdmVydDogZ2xzbGlmeSggXCIuL3NoYWRlci9vYmplY3QudmVydFwiICksXG4gICAgZnJhZzogZ2xzbGlmeSggXCIuL3NoYWRlci9ub3JtYWwuZnJhZ1wiICksXG4gICAgZHJhd2J1ZmZlcnM6IDIsXG4gICAgYmxlbmQ6IFsgZ2wuU1JDX0FMUEhBLCBnbC5PTkVfTUlOVVNfU1JDX0FMUEhBIF0sXG4gICAgZnVuYzogKCBwYXRoLCBwYXJhbXMgKSA9PiB7XG4gICAgICBnbENhdC5hdHRyaWJ1dGUoIFwicG9zXCIsIHZib0N1YmVQb3MsIDMgKTtcbiAgICAgIGdsQ2F0LmF0dHJpYnV0ZSggXCJub3JcIiwgdmJvQ3ViZU5vciwgMyApO1xuICAgICAgICBcbiAgICAgIGxldCBtYXRNID0gTWF0aENhdC5tYXQ0SWRlbnRpdHkoKTtcbiAgICAgIG1hdE0gPSBNYXRoQ2F0Lm1hdDRBcHBseSggTWF0aENhdC5tYXQ0U2NhbGVYWVooIDEuMCApLCBtYXRNICk7XG4gICAgICBtYXRNID0gTWF0aENhdC5tYXQ0QXBwbHkoIE1hdGhDYXQubWF0NFJvdGF0ZVooIC1hdXRvKCBcImNhbWVyYVRoZXRhXCIgKSAqIE1hdGguUEkgKiAxLjAgKSwgbWF0TSApO1xuICAgICAgbWF0TSA9IE1hdGhDYXQubWF0NEFwcGx5KCBNYXRoQ2F0Lm1hdDRSb3RhdGVYKCBhdXRvKCBcImNhbWVyYVRoZXRhXCIgKSAqIE1hdGguUEkgKiAyLjAgKSwgbWF0TSApO1xuICAgICAgbWF0TSA9IE1hdGhDYXQubWF0NEFwcGx5KCBNYXRoQ2F0Lm1hdDRSb3RhdGVZKCAtYXV0byggXCJjYW1lcmFUaGV0YVwiICkgKiBNYXRoLlBJICogMS4wICksIG1hdE0gKTtcbiAgICAgIGdsQ2F0LnVuaWZvcm1NYXRyaXg0ZnYoIFwibWF0TVwiLCBtYXRNICk7XG5cbiAgICAgIGdsQ2F0LnVuaWZvcm0xaSggXCJpc1NoYWRvd1wiLCBwYXJhbXMuaXNTaGFkb3cgKTtcbiAgICAgIGlmICggIXBhcmFtcy5pc1NoYWRvdyApIHtcbiAgICAgICAgZ2xDYXQudW5pZm9ybVRleHR1cmUoIFwic2FtcGxlclNoYWRvd1wiLCBnbENhdFBhdGguZmIoIFwi5b2xXCIgKS50ZXh0dXJlc1sgMCBdLCAwICk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBnbENhdC51bmlmb3JtVGV4dHVyZSggXCJzYW1wbGVyU2hhZG93XCIsIHRleHR1cmVEdW1teSwgMCApO1xuICAgICAgfVxuICAgICAgZ2wuZHJhd0FycmF5cyggZ2wuVFJJQU5HTEVTLCAwLCB2Ym9DdWJlUG9zLmxlbmd0aCAvIDMgKTtcbiAgICB9XG4gIH0sXG5cbiAgcGFydGljbGVzQ29tcHV0ZVJldHVybjoge1xuICAgIHdpZHRoOiBwYXJ0aWNsZXNTcXJ0ICogcGFydGljbGVQaXhlbHMsXG4gICAgaGVpZ2h0OiBwYXJ0aWNsZXNTcXJ0LFxuICAgIHZlcnQ6IGdsc2xpZnkoIFwiLi9zaGFkZXIvcXVhZC52ZXJ0XCIgKSxcbiAgICBmcmFnOiBnbHNsaWZ5KCBcIi4vc2hhZGVyL3JldHVybi5mcmFnXCIgKSxcbiAgICBibGVuZDogWyBnbC5PTkUsIGdsLlpFUk8gXSxcbiAgICBjbGVhcjogWyAwLjAsIDAuMCwgMC4wLCAwLjAgXSxcbiAgICBmcmFtZWJ1ZmZlcjogdHJ1ZSxcbiAgICBmbG9hdDogdHJ1ZSxcbiAgICBmdW5jOiAoIHBhdGgsIHBhcmFtcyApID0+IHtcbiAgICAgIGdsQ2F0LmF0dHJpYnV0ZSggXCJwXCIsIHZib1F1YWQsIDIgKTtcbiAgICAgIGdsQ2F0LnVuaWZvcm1UZXh0dXJlKCBcInNhbXBsZXIwXCIsIGdsQ2F0UGF0aC5mYiggXCJwYXJ0aWNsZXNDb21wdXRlXCIgKS50ZXh0dXJlLCAwICk7XG4gICAgICBnbC5kcmF3QXJyYXlzKCBnbC5UUklBTkdMRV9TVFJJUCwgMCwgNCApO1xuICAgIH1cbiAgfSxcblxuICBwYXJ0aWNsZXNDb21wdXRlOiB7XG4gICAgd2lkdGg6IHBhcnRpY2xlc1NxcnQgKiBwYXJ0aWNsZVBpeGVscyxcbiAgICBoZWlnaHQ6IHBhcnRpY2xlc1NxcnQsXG4gICAgdmVydDogZ2xzbGlmeSggXCIuL3NoYWRlci9xdWFkLnZlcnRcIiApLFxuICAgIGZyYWc6IGdsc2xpZnkoIFwiLi9zaGFkZXIvcGFydGljbGVzLWNvbXB1dGUuZnJhZ1wiICksXG4gICAgYmxlbmQ6IFsgZ2wuT05FLCBnbC5aRVJPIF0sXG4gICAgY2xlYXI6IFsgMC4wLCAwLjAsIDAuMCwgMC4wIF0sXG4gICAgZnJhbWVidWZmZXI6IHRydWUsXG4gICAgZmxvYXQ6IHRydWUsXG4gICAgZnVuYzogKCBwYXRoLCBwYXJhbXMgKSA9PiB7XG4gICAgICBnbENhdC5hdHRyaWJ1dGUoIFwicFwiLCB2Ym9RdWFkLCAyICk7XG4gICAgICBnbENhdC51bmlmb3JtVGV4dHVyZSggXCJzYW1wbGVyUGNvbXB1dGVcIiwgZ2xDYXRQYXRoLmZiKCBcInBhcnRpY2xlc0NvbXB1dGVSZXR1cm5cIiApLnRleHR1cmUsIDAgKTtcbiAgICAgIGdsQ2F0LnVuaWZvcm1UZXh0dXJlKCBcInNhbXBsZXJSYW5kb21cIiwgdGV4dHVyZVJhbmRvbSwgMSApO1xuICAgICAgZ2wuZHJhd0FycmF5cyggZ2wuVFJJQU5HTEVfU1RSSVAsIDAsIDQgKTtcbiAgICB9XG4gIH0sXG4gIFxuICBwYXJ0aWNsZXNSZW5kZXI6IHtcbiAgICB3aWR0aDogd2lkdGgsXG4gICAgaGVpZ2h0OiBoZWlnaHQsXG4gICAgdmVydDogZ2xzbGlmeSggXCIuL3NoYWRlci9wYXJ0aWNsZXMtcmVuZGVyLnZlcnRcIiApLFxuICAgIGZyYWc6IGdsc2xpZnkoIFwiLi9zaGFkZXIvc2hhZGUuZnJhZ1wiICksXG4gICAgZHJhd2J1ZmZlcnM6IDIsXG4gICAgYmxlbmQ6IFsgZ2wuU1JDX0FMUEhBLCBnbC5PTkVfTUlOVVNfU1JDX0FMUEhBIF0sXG4gICAgZnVuYzogKCBwYXRoLCBwYXJhbXMgKSA9PiB7XG4gICAgICBnbENhdC5hdHRyaWJ1dGUoIFwiY29tcHV0ZVVWXCIsIHZib1BhcnRpY2xlVVYsIDIsIDEgKTtcbiAgICAgIGdsQ2F0LmF0dHJpYnV0ZSggXCJwcmltUG9zXCIsIHZib0N1YmVQb3MsIDMgKTtcbiAgICAgIGdsQ2F0LmF0dHJpYnV0ZSggXCJwcmltTm9yXCIsIHZib0N1YmVOb3IsIDMgKTtcblxuICAgICAgZ2xDYXQudW5pZm9ybTJmdiggXCJyZXNvbHV0aW9uUGNvbXB1dGVcIiwgWyBwYXJ0aWNsZXNTcXJ0ICogcGFydGljbGVQaXhlbHMsIHBhcnRpY2xlc1NxcnQgXSApO1xuICAgICAgZ2xDYXQudW5pZm9ybVRleHR1cmUoIFwic2FtcGxlclBjb21wdXRlXCIsIGdsQ2F0UGF0aC5mYiggXCJwYXJ0aWNsZXNDb21wdXRlXCIgKS50ZXh0dXJlLCAxICk7XG5cbiAgICAgIGdsQ2F0LnVuaWZvcm0xaSggXCJpc1NoYWRvd1wiLCBwYXJhbXMuaXNTaGFkb3cgKTtcbiAgICAgIGlmICggIXBhcmFtcy5pc1NoYWRvdyApIHtcbiAgICAgICAgZ2xDYXQudW5pZm9ybVRleHR1cmUoIFwic2FtcGxlclNoYWRvd1wiLCBnbENhdFBhdGguZmIoIFwi5b2xXCIgKS50ZXh0dXJlc1sgMCBdLCAwICk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBnbENhdC51bmlmb3JtVGV4dHVyZSggXCJzYW1wbGVyU2hhZG93XCIsIHRleHR1cmVEdW1teSwgMCApO1xuICAgICAgfVxuXG4gICAgICBnbENhdC51bmlmb3JtM2Z2KCBcImNvbG9yXCIsIFsgMC44LCAwLjgsIDAuOCBdICk7XG5cbiAgICAgIGxldCBleHQgPSBnbENhdC5nZXRFeHRlbnNpb24oIFwiQU5HTEVfaW5zdGFuY2VkX2FycmF5c1wiICk7XG4gICAgICBleHQuZHJhd0FycmF5c0luc3RhbmNlZEFOR0xFKCBnbC5UUklBTkdMRVMsIDAsIHZlcnRzUGVyUGFydGljbGUsIHBhcnRpY2xlcyApO1xuICAgIH1cbiAgfSxcbiAgXG4gIGZ4YWE6IHtcbiAgICB3aWR0aDogd2lkdGgsXG4gICAgaGVpZ2h0OiBoZWlnaHQsXG4gICAgdmVydDogZ2xzbGlmeSggXCIuL3NoYWRlci9xdWFkLnZlcnRcIiApLFxuICAgIGZyYWc6IGdsc2xpZnkoIFwiLi9zaGFkZXIvZnhhYS5mcmFnXCIgKSxcbiAgICBjbGVhcjogWyAwLjAsIDAuMCwgMC4wLCAxLjAgXSxcbiAgICBmcmFtZWJ1ZmZlcjogdHJ1ZSxcbiAgICBmbG9hdDogdHJ1ZSxcbiAgICBibGVuZDogWyBnbC5PTkUsIGdsLlpFUk8gXSxcbiAgICBmdW5jOiAoIHBhdGgsIHBhcmFtcyApID0+IHtcbiAgICAgIGdsQ2F0LmF0dHJpYnV0ZSggXCJwXCIsIHZib1F1YWQsIDIgKTtcbiAgICAgIGdsQ2F0LnVuaWZvcm1UZXh0dXJlKCBcInNhbXBsZXIwXCIsIHBhcmFtcy5pbnB1dCwgMCApO1xuICAgICAgZ2wuZHJhd0FycmF5cyggZ2wuVFJJQU5HTEVfU1RSSVAsIDAsIDQgKTtcbiAgICB9XG4gIH0sXG4gIFxuICBnYXVzczoge1xuICAgIHdpZHRoOiB3aWR0aCxcbiAgICBoZWlnaHQ6IGhlaWdodCxcbiAgICB2ZXJ0OiBnbHNsaWZ5KCBcIi4vc2hhZGVyL3F1YWQudmVydFwiICksXG4gICAgZnJhZzogZ2xzbGlmeSggXCIuL3NoYWRlci9nYXVzcy5mcmFnXCIgKSxcbiAgICBjbGVhcjogWyAwLjAsIDAuMCwgMC4wLCAxLjAgXSxcbiAgICB0ZW1wRmI6IGdsQ2F0LmNyZWF0ZUZsb2F0RnJhbWVidWZmZXIoIHdpZHRoLCBoZWlnaHQgKSxcbiAgICBibGVuZDogWyBnbC5PTkUsIGdsLlpFUk8gXSxcbiAgICBmdW5jOiAoIHBhdGgsIHBhcmFtcyApID0+IHtcbiAgICAgIGlmICggcGFyYW1zLndpZHRoICYmIHBhcmFtcy5oZWlnaHQgKSB7XG4gICAgICAgIGdsQ2F0LnJlc2l6ZUZsb2F0RnJhbWVidWZmZXIoIHBhdGgudGVtcEZiLCBwYXJhbXMud2lkdGgsIHBhcmFtcy5oZWlnaHQgKTtcbiAgICAgIH1cblxuICAgICAgZ2wuYmluZEZyYW1lYnVmZmVyKCBnbC5GUkFNRUJVRkZFUiwgcGF0aC50ZW1wRmIuZnJhbWVidWZmZXIgKTtcbiAgICAgIGdsQ2F0LmNsZWFyKCAuLi5wYXRoLmNsZWFyICk7XG5cbiAgICAgIGdsQ2F0LmF0dHJpYnV0ZSggXCJwXCIsIHZib1F1YWQsIDIgKTtcbiAgICAgIGdsQ2F0LnVuaWZvcm1UZXh0dXJlKCBcInNhbXBsZXIwXCIsIHBhcmFtcy5pbnB1dCwgMCApO1xuICAgICAgZ2xDYXQudW5pZm9ybTFmKCBcInZhclwiLCBwYXJhbXMudmFyICk7XG4gICAgICBnbENhdC51bmlmb3JtMWkoIFwiaXNWZXJ0XCIsIDAgKTtcbiAgICAgIGdsLmRyYXdBcnJheXMoIGdsLlRSSUFOR0xFX1NUUklQLCAwLCA0ICk7XG4gICAgICBcbiAgICAgIGdsLmJpbmRGcmFtZWJ1ZmZlciggZ2wuRlJBTUVCVUZGRVIsIHBhcmFtcy5mcmFtZWJ1ZmZlciApO1xuXG4gICAgICBnbENhdC5hdHRyaWJ1dGUoIFwicFwiLCB2Ym9RdWFkLCAyICk7XG4gICAgICBnbENhdC51bmlmb3JtVGV4dHVyZSggXCJzYW1wbGVyMFwiLCBwYXRoLnRlbXBGYi50ZXh0dXJlLCAwICk7XG4gICAgICBnbENhdC51bmlmb3JtMWYoIFwidmFyXCIsIHBhcmFtcy52YXIgKTtcbiAgICAgIGdsQ2F0LnVuaWZvcm0xaSggXCJpc1ZlcnRcIiwgMSApO1xuICAgICAgZ2wuZHJhd0FycmF5cyggZ2wuVFJJQU5HTEVfU1RSSVAsIDAsIDQgKTtcbiAgICB9XG4gIH0sXG4gIFxuICBkb2Y6IHtcbiAgICB3aWR0aDogd2lkdGgsXG4gICAgaGVpZ2h0OiBoZWlnaHQsXG4gICAgdmVydDogZ2xzbGlmeSggXCIuL3NoYWRlci9xdWFkLnZlcnRcIiApLFxuICAgIGZyYWc6IGdsc2xpZnkoIFwiLi9zaGFkZXIvZG9mLmZyYWdcIiApLFxuICAgIGJsZW5kOiBbIGdsLk9ORSwgZ2wuWkVSTyBdLFxuICAgIGNsZWFyOiBbIDAuMCwgMC4wLCAwLjAsIDAuMCBdLFxuICAgIGZyYW1lYnVmZmVyOiB0cnVlLFxuICAgIGZsb2F0OiB0cnVlLFxuICAgIGZ1bmM6ICggcGF0aCwgcGFyYW1zICkgPT4ge1xuICAgICAgZ2xDYXQuYXR0cmlidXRlKCBcInBcIiwgdmJvUXVhZCwgMiApO1xuICAgICAgZ2xDYXQudW5pZm9ybTFmKCBcImZvY3VzXCIsIGF1dG8oIFwiZm9jdXNcIiApICk7XG4gICAgICBnbENhdC51bmlmb3JtVGV4dHVyZSggXCJzYW1wbGVyRHJ5XCIsIHBhcmFtcy5kcnksIDAgKTtcbiAgICAgIGdsQ2F0LnVuaWZvcm1UZXh0dXJlKCBcInNhbXBsZXJQcmVEb2ZcIiwgcGFyYW1zLnByZWRvZiwgMSApO1xuICAgICAgZ2xDYXQudW5pZm9ybVRleHR1cmUoIFwic2FtcGxlckRlcHRoXCIsIHBhcmFtcy5kZXB0aCwgMiApO1xuICAgICAgZ2xDYXQudW5pZm9ybVRleHR1cmUoIFwic2FtcGxlckdhdXNzVGFibGVcIiwgZ2xDYXRQYXRoLmZiKCBcImdhdXNzVGFibGVcIiApLnRleHR1cmUsIDMgKTtcbiAgICAgIGdsLmRyYXdBcnJheXMoIGdsLlRSSUFOR0xFX1NUUklQLCAwLCA0ICk7XG4gICAgfVxuICB9LFxuICBcbiAgXCJHb3dyb2NrIC0gYmxvb21cIjoge1xuICAgIHdpZHRoOiB3aWR0aCAvIDQuMCxcbiAgICBoZWlnaHQ6IGhlaWdodCAvIDQuMCxcbiAgICB2ZXJ0OiBnbHNsaWZ5KCBcIi4vc2hhZGVyL3F1YWQudmVydFwiICksXG4gICAgZnJhZzogZ2xzbGlmeSggXCIuL3NoYWRlci9ibG9vbS5mcmFnXCIgKSxcbiAgICBibGVuZDogWyBnbC5PTkUsIGdsLlpFUk8gXSxcbiAgICBjbGVhcjogWyAwLjAsIDAuMCwgMC4wLCAwLjAgXSxcbiAgICB0ZW1wRmI6IGdsQ2F0LmNyZWF0ZUZsb2F0RnJhbWVidWZmZXIoIHdpZHRoIC8gNC4wLCBoZWlnaHQgLyA0LjAgKSxcbiAgICBmcmFtZWJ1ZmZlcjogdHJ1ZSxcbiAgICBmbG9hdDogdHJ1ZSxcbiAgICBmdW5jOiAoIHBhdGgsIHBhcmFtcyApID0+IHtcbiAgICAgIGZvciAoIGxldCBpID0gMDsgaSA8IDM7IGkgKysgKSB7XG4gICAgICAgIGxldCBnYXVzc1ZhciA9IFsgNS4wLCAxNS4wLCA0MC4wIF1bIGkgXTtcbiAgICAgICAgZ2wuYmluZEZyYW1lYnVmZmVyKCBnbC5GUkFNRUJVRkZFUiwgcGF0aC50ZW1wRmIuZnJhbWVidWZmZXIgKTtcbiAgICAgICAgZ2xDYXQuY2xlYXIoIC4uLnBhdGguY2xlYXIgKTtcblxuICAgICAgICBnbENhdC5hdHRyaWJ1dGUoIFwicFwiLCB2Ym9RdWFkLCAyICk7XG4gICAgICAgIGdsQ2F0LnVuaWZvcm0xaSggXCJpc1ZlcnRcIiwgZmFsc2UgKTtcbiAgICAgICAgZ2xDYXQudW5pZm9ybTFmKCBcImdhdXNzVmFyXCIsIGdhdXNzVmFyICk7XG4gICAgICAgIGdsQ2F0LnVuaWZvcm1UZXh0dXJlKCBcInNhbXBsZXIwXCIsIHBhcmFtcy5pbnB1dCwgMCApO1xuICAgICAgICBnbC5kcmF3QXJyYXlzKCBnbC5UUklBTkdMRV9TVFJJUCwgMCwgNCApO1xuICAgICAgICBcbiAgICAgICAgZ2wuYmluZEZyYW1lYnVmZmVyKCBnbC5GUkFNRUJVRkZFUiwgcGFyYW1zLmZyYW1lYnVmZmVyICk7XG5cbiAgICAgICAgZ2xDYXQuYXR0cmlidXRlKCBcInBcIiwgdmJvUXVhZCwgMiApO1xuICAgICAgICBnbENhdC51bmlmb3JtMWkoIFwiaXNWZXJ0XCIsIHRydWUgKTtcbiAgICAgICAgZ2xDYXQudW5pZm9ybTFmKCBcImdhdXNzVmFyXCIsIGdhdXNzVmFyICk7XG4gICAgICAgIGdsQ2F0LnVuaWZvcm1UZXh0dXJlKCBcInNhbXBsZXIwXCIsIHBhdGgudGVtcEZiLnRleHR1cmUsIDAgKTtcbiAgICAgICAgZ2xDYXQudW5pZm9ybVRleHR1cmUoIFwic2FtcGxlckRyeVwiLCBwYXJhbXMuaW5wdXQsIDEgKTtcbiAgICAgICAgZ2wuZHJhd0FycmF5cyggZ2wuVFJJQU5HTEVfU1RSSVAsIDAsIDQgKTtcbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIFxuICBibG9vbUZpbmFsaXplOiB7XG4gICAgd2lkdGg6IHdpZHRoLFxuICAgIGhlaWdodDogaGVpZ2h0LFxuICAgIHZlcnQ6IGdsc2xpZnkoIFwiLi9zaGFkZXIvcXVhZC52ZXJ0XCIgKSxcbiAgICBmcmFnOiBnbHNsaWZ5KCBcIi4vc2hhZGVyL2Jsb29tLWZpbmFsaXplLmZyYWdcIiApLFxuICAgIGJsZW5kOiBbIGdsLk9ORSwgZ2wuWkVSTyBdLFxuICAgIGNsZWFyOiBbIDAuMCwgMC4wLCAwLjAsIDAuMCBdLFxuICAgIGZyYW1lYnVmZmVyOiB0cnVlLFxuICAgIGZsb2F0OiB0cnVlLFxuICAgIGZ1bmM6ICggcGF0aCwgcGFyYW1zICkgPT4ge1xuICAgICAgZ2xDYXQuYXR0cmlidXRlKCBcInBcIiwgdmJvUXVhZCwgMiApO1xuICAgICAgZ2xDYXQudW5pZm9ybVRleHR1cmUoIFwic2FtcGxlckRyeVwiLCBwYXJhbXMuZHJ5LCAwICk7XG4gICAgICBnbENhdC51bmlmb3JtVGV4dHVyZSggXCJzYW1wbGVyV2V0XCIsIHBhcmFtcy53ZXQsIDEgKTtcbiAgICAgIGdsLmRyYXdBcnJheXMoIGdsLlRSSUFOR0xFX1NUUklQLCAwLCA0ICk7XG4gICAgfVxuICB9LFxuICBcbiAg44GK44Gf44GP44Gv44GZ44GQ44Od44K544OI44Ko44OV44Kn44Kv44OI44KS5oy/44GZOiB7XG4gICAgd2lkdGg6IHdpZHRoLFxuICAgIGhlaWdodDogaGVpZ2h0LFxuICAgIHZlcnQ6IGdsc2xpZnkoIFwiLi9zaGFkZXIvcXVhZC52ZXJ0XCIgKSxcbiAgICBmcmFnOiBnbHNsaWZ5KCBcIi4vc2hhZGVyL3Bvc3QuZnJhZ1wiICksXG4gICAgYmxlbmQ6IFsgZ2wuT05FLCBnbC5aRVJPIF0sXG4gICAgY2xlYXI6IFsgMC4wLCAwLjAsIDAuMCwgMC4wIF0sXG4gICAgZnJhbWVidWZmZXI6IHRydWUsXG4gICAgZnVuYzogKCBwYXRoLCBwYXJhbXMgKSA9PiB7XG4gICAgICBnbENhdC5hdHRyaWJ1dGUoIFwicFwiLCB2Ym9RdWFkLCAyICk7XG4gICAgICBnbENhdC51bmlmb3JtVGV4dHVyZSggXCJzYW1wbGVyMFwiLCBwYXJhbXMuaW5wdXQsIDAgKTtcbiAgICAgIGdsLmRyYXdBcnJheXMoIGdsLlRSSUFOR0xFX1NUUklQLCAwLCA0ICk7XG4gICAgfVxuICB9LFxufSApO1xuXG4vLyAtLS0tLS1cblxubGV0IHVwZGF0ZVVJID0gKCkgPT4ge1xuICBsZXQgbm93ID0gbmV3IERhdGUoKTtcbiAgbGV0IGRlYWRsaW5lID0gbmV3IERhdGUoIDIwMTgsIDEsIDE2LCAwLCAwICk7XG5cbiAgZGl2Q291bnRkb3duLmlubmVyVGV4dCA9IFwiRGVhZGxpbmU6IFwiICsgTWF0aC5mbG9vciggKCBkZWFkbGluZSAtIG5vdyApIC8gMTAwMCApO1xufTtcblxuLy8gLS0tLS0tXG5cbmdsQ2F0UGF0aC5yZW5kZXIoIFwiZ2F1c3NUYWJsZVwiICk7XG5cbmxldCB1cGRhdGUgPSAoKSA9PiB7XG4gIGlmICggIXR3ZWFrLmNoZWNrYm94KCBcInBsYXlcIiwgeyB2YWx1ZTogdHJ1ZSB9ICkgKSB7XG4gICAgc2V0VGltZW91dCggdXBkYXRlLCAxMDAgKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBhdXRvbWF0b24udXBkYXRlKCk7XG5cbiAgaWYgKCBhdXRvbWF0b24uZnJhbWUgPT09IDAgKSB7XG4gICAgeG9yc2hpZnQoIDE3OTA2Nzg5MTM2NyApO1xuICB9XG5cbiAgdXBkYXRlVUkoKTtcbiAgdXBkYXRlTWF0cmljZXMoKTtcblxuICB0ZXh0dXJlUmFuZG9tVXBkYXRlKCB0ZXh0dXJlUmFuZG9tICk7XG5cbiAgLy8gLS0tLS0tXG5cbiAgZ2xDYXRQYXRoLmJlZ2luKCk7XG5cbiAgZ2xDYXRQYXRoLnJlbmRlciggXCLwn5CsXCIgKTtcbiAgZ2xDYXRQYXRoLnJlbmRlciggXCLlvbFcIiApO1xuXG4gIC8vIC0tLS0tLVxuXG4gIGdsQ2F0UGF0aC5yZW5kZXIoIFwicGFydGljbGVzQ29tcHV0ZVJldHVyblwiICk7XG4gIGdsQ2F0UGF0aC5yZW5kZXIoIFwicGFydGljbGVzQ29tcHV0ZVwiICk7XG5cbiAgZ2xDYXRQYXRoLnJlbmRlciggXCJ0ZXJyYWluQ29tcHV0ZVwiICk7XG5cbiAgLy8gLS0tLS0tXG5cbiAgZ2xDYXRQYXRoLnJlbmRlciggXCJjdWJlXCIsIHtcbiAgICB0YXJnZXQ6IGdsQ2F0UGF0aC5mYiggXCLlvbFcIiApLFxuICAgIGlzU2hhZG93OiB0cnVlLFxuICAgIHdpZHRoOiBzaGFkb3dTaXplLFxuICAgIGhlaWdodDogc2hhZG93U2l6ZVxuICB9ICk7XG5cbiAgZ2xDYXRQYXRoLnJlbmRlciggXCJ0ZXJyYWluUmVuZGVyXCIsIHtcbiAgICB0YXJnZXQ6IGdsQ2F0UGF0aC5mYiggXCLlvbFcIiApLFxuICAgIGlzU2hhZG93OiB0cnVlLFxuICAgIHdpZHRoOiBzaGFkb3dTaXplLFxuICAgIGhlaWdodDogc2hhZG93U2l6ZVxuICB9ICk7XG5cbiAgZ2xDYXRQYXRoLnJlbmRlciggXCJyYXltYXJjaFwiLCB7XG4gICAgdGFyZ2V0OiBnbENhdFBhdGguZmIoIFwi5b2xXCIgKSxcbiAgICBpc1NoYWRvdzogdHJ1ZSxcbiAgICB3aWR0aDogc2hhZG93U2l6ZSxcbiAgICBoZWlnaHQ6IHNoYWRvd1NpemVcbiAgfSApO1xuXG4gIGdsQ2F0UGF0aC5yZW5kZXIoIFwicGFydGljbGVzUmVuZGVyXCIsIHtcbiAgICB0YXJnZXQ6IGdsQ2F0UGF0aC5mYiggXCLlvbFcIiApLFxuICAgIGlzU2hhZG93OiB0cnVlLFxuICAgIHdpZHRoOiBzaGFkb3dTaXplLFxuICAgIGhlaWdodDogc2hhZG93U2l6ZVxuICB9ICk7XG5cbiAgZ2xDYXRQYXRoLnJlbmRlciggXCJjdWJlXCIsIHtcbiAgICB0YXJnZXQ6IGdsQ2F0UGF0aC5mYiggXCLwn5CsXCIgKSxcbiAgICBpc1NoYWRvdzogZmFsc2VcbiAgfSApO1xuXG4gIGdsQ2F0UGF0aC5yZW5kZXIoIFwidGVycmFpblJlbmRlclwiLCB7XG4gICAgdGFyZ2V0OiBnbENhdFBhdGguZmIoIFwi8J+QrFwiICksXG4gICAgaXNTaGFkb3c6IGZhbHNlXG4gIH0gKTtcblxuICBnbENhdFBhdGgucmVuZGVyKCBcInJheW1hcmNoXCIsIHtcbiAgICB0YXJnZXQ6IGdsQ2F0UGF0aC5mYiggXCLwn5CsXCIgKSxcbiAgICBpc1NoYWRvdzogZmFsc2VcbiAgfSApO1xuXG4gIGdsQ2F0UGF0aC5yZW5kZXIoIFwicGFydGljbGVzUmVuZGVyXCIsIHtcbiAgICB0YXJnZXQ6IGdsQ2F0UGF0aC5mYiggXCLwn5CsXCIgKVxuICB9ICk7XG5cbiAgZ2xDYXRQYXRoLnJlbmRlciggXCJmeGFhXCIsIHtcbiAgICBpbnB1dDogZ2xDYXRQYXRoLmZiKCBcIvCfkKxcIiApLnRleHR1cmVzWyAwIF1cbiAgfSApO1xuXG4gIGdsQ2F0UGF0aC5yZW5kZXIoIFwiZ2F1c3NcIiwge1xuICAgIHRhcmdldDogZnJhbWVidWZmZXJQcmVEb2YsXG4gICAgaW5wdXQ6IGdsQ2F0UGF0aC5mYiggXCJmeGFhXCIgKS50ZXh0dXJlLFxuICAgIHdpZHRoOiB3aWR0aCxcbiAgICBoZWlnaHQ6IGhlaWdodCxcbiAgICB2YXI6IDUuMFxuICB9ICk7XG5cbiAgZ2xDYXRQYXRoLnJlbmRlciggXCJkb2ZcIiwge1xuICAgIGRyeTogZ2xDYXRQYXRoLmZiKCBcImZ4YWFcIiApLnRleHR1cmUsXG4gICAgcHJlZG9mOiBmcmFtZWJ1ZmZlclByZURvZi50ZXh0dXJlLFxuICAgIGRlcHRoOiBnbENhdFBhdGguZmIoIFwi8J+QrFwiICkudGV4dHVyZXNbIDEgXVxuICB9ICk7XG5cbiAgZ2xDYXRQYXRoLnJlbmRlciggXCJHb3dyb2NrIC0gYmxvb21cIiwge1xuICAgIGlucHV0OiBmcmFtZWJ1ZmZlclByZURvZi50ZXh0dXJlLFxuICB9ICk7XG4gIGdsQ2F0UGF0aC5yZW5kZXIoIFwiYmxvb21GaW5hbGl6ZVwiLCB7XG4gICAgZHJ5OiBnbENhdFBhdGguZmIoIFwiZG9mXCIgKS50ZXh0dXJlLFxuICAgIHdldDogZ2xDYXRQYXRoLmZiKCBcIkdvd3JvY2sgLSBibG9vbVwiICkudGV4dHVyZVxuICB9ICk7XG5cbiAgZ2xDYXRQYXRoLnJlbmRlciggXCLjgYrjgZ/jgY/jga/jgZnjgZDjg53jgrnjg4jjgqjjg5Xjgqfjgq/jg4jjgpLmjL/jgZlcIiwge1xuICAgIHRhcmdldDogR0xDYXRQYXRoLm51bGxGYixcbiAgICBpbnB1dDogZ2xDYXRQYXRoLmZiKCBcImJsb29tRmluYWxpemVcIiApLnRleHR1cmVcbiAgfSApO1xuXG4gIGdsQ2F0UGF0aC5lbmQoKTtcblxuICBpbml0ID0gZmFsc2U7XG4gIHRvdGFsRnJhbWUgKys7XG5cbiAgLy8gLS0tLS0tXG5cbiAgaWYgKCB0d2Vhay5jaGVja2JveCggXCJzYXZlXCIsIHsgdmFsdWU6IGZhbHNlIH0gKSApIHtcbiAgICBzYXZlRnJhbWUoKTtcbiAgfVxuXG4gIHJlcXVlc3RBbmltYXRpb25GcmFtZSggdXBkYXRlICk7XG59XG5cbnVwZGF0ZSgpO1xuXG4vLyAtLS0tLS1cblxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoIFwia2V5ZG93blwiLCAoIF9lICkgPT4ge1xuICBpZiAoIF9lLndoaWNoID09PSAyNyApIHtcbiAgICB0d2Vhay5jaGVja2JveCggXCJwbGF5XCIsIHsgc2V0OiBmYWxzZSB9ICk7XG4gIH1cbn0gKTtcbiJdfQ==
