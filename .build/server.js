/******/ (function(modules) { // webpackBootstrap
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadUpdateChunk(chunkId) {
/******/ 		var chunk = require("./" + "" + chunkId + "." + hotCurrentHash + ".hot-update.js");
/******/ 		hotAddUpdateChunk(chunk.id, chunk.modules);
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadManifest() {
/******/ 		try {
/******/ 			var update = require("./" + "" + hotCurrentHash + ".hot-update.json");
/******/ 		} catch (e) {
/******/ 			return Promise.resolve();
/******/ 		}
/******/ 		return Promise.resolve(update);
/******/ 	}
/******/
/******/ 	//eslint-disable-next-line no-unused-vars
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "5c6f2415b3c1373c647f"; // eslint-disable-line no-unused-vars
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateRequire(moduleId) {
/******/ 		var me = installedModules[moduleId];
/******/ 		if (!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if (me.hot.active) {
/******/ 				if (installedModules[request]) {
/******/ 					if (installedModules[request].parents.indexOf(moduleId) === -1)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if (me.children.indexOf(request) === -1) me.children.push(request);
/******/ 			} else {
/******/ 				console.warn(
/******/ 					"[HMR] unexpected require(" +
/******/ 						request +
/******/ 						") from disposed module " +
/******/ 						moduleId
/******/ 				);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for (var name in __webpack_require__) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(__webpack_require__, name) &&
/******/ 				name !== "e"
/******/ 			) {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if (hotStatus === "ready") hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if (hotStatus === "prepare") {
/******/ 					if (!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if (hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateModule(moduleId) {
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if (typeof dep === "undefined") hot._selfAccepted = true;
/******/ 				else if (typeof dep === "function") hot._selfAccepted = dep;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if (typeof dep === "undefined") hot._selfDeclined = true;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if (idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if (!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if (idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for (var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = +id + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/
/******/ 	function hotCheck(apply) {
/******/ 		if (hotStatus !== "idle")
/******/ 			throw new Error("check() is only allowed in idle status");
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if (!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = "main";
/******/ 			{
/******/ 				// eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if (
/******/ 				hotStatus === "prepare" &&
/******/ 				hotChunksLoading === 0 &&
/******/ 				hotWaitingFiles === 0
/******/ 			) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) {
/******/ 		if (!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for (var moduleId in moreModules) {
/******/ 			if (Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if (--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if (!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if (!deferred) return;
/******/ 		if (hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve()
/******/ 				.then(function() {
/******/ 					return hotApply(hotApplyOnUpdate);
/******/ 				})
/******/ 				.then(
/******/ 					function(result) {
/******/ 						deferred.resolve(result);
/******/ 					},
/******/ 					function(err) {
/******/ 						deferred.reject(err);
/******/ 					}
/******/ 				);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for (var id in hotUpdate) {
/******/ 				if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotApply(options) {
/******/ 		if (hotStatus !== "ready")
/******/ 			throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while (queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if (!module || module.hot._selfAccepted) continue;
/******/ 				if (module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if (module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for (var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if (!parent) continue;
/******/ 					if (parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if (outdatedModules.indexOf(parentId) !== -1) continue;
/******/ 					if (parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if (!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/
/******/ 		function addAllToSet(a, b) {
/******/ 			for (var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if (a.indexOf(item) === -1) a.push(item);
/******/ 			}
/******/ 		}
/******/
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn(
/******/ 				"[HMR] unexpected require(" + result.moduleId + ") to disposed module"
/******/ 			);
/******/ 		};
/******/
/******/ 		for (var id in hotUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				/** @type {TODO} */
/******/ 				var result;
/******/ 				if (hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				/** @type {Error|false} */
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if (result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch (result.type) {
/******/ 					case "self-declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of self decline: " +
/******/ 									result.moduleId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of declined dependency: " +
/******/ 									result.moduleId +
/******/ 									" in " +
/******/ 									result.parentId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if (options.onUnaccepted) options.onUnaccepted(result);
/******/ 						if (!options.ignoreUnaccepted)
/******/ 							abortError = new Error(
/******/ 								"Aborted because " + moduleId + " is not accepted" + chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if (options.onAccepted) options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if (options.onDisposed) options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if (abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if (doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for (moduleId in result.outdatedDependencies) {
/******/ 						if (
/******/ 							Object.prototype.hasOwnProperty.call(
/******/ 								result.outdatedDependencies,
/******/ 								moduleId
/******/ 							)
/******/ 						) {
/******/ 							if (!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(
/******/ 								outdatedDependencies[moduleId],
/******/ 								result.outdatedDependencies[moduleId]
/******/ 							);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if (doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for (i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if (
/******/ 				installedModules[moduleId] &&
/******/ 				installedModules[moduleId].hot._selfAccepted
/******/ 			)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if (hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while (queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if (!module) continue;
/******/
/******/ 			var data = {};
/******/
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for (j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/
/******/ 			// remove "parents" references from all children
/******/ 			for (j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if (!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if (idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for (j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if (idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/
/******/ 		// insert new code
/******/ 		for (moduleId in appliedUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for (i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if (cb) {
/******/ 							if (callbacks.indexOf(cb) !== -1) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for (i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch (err) {
/******/ 							if (options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if (!options.ignoreErrored) {
/******/ 								if (!error) error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Load self accepted modules
/******/ 		for (i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch (err) {
/******/ 				if (typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch (err2) {
/******/ 						if (options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if (!options.ignoreErrored) {
/******/ 							if (!error) error = err2;
/******/ 						}
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if (options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if (!options.ignoreErrored) {
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if (error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/static/";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(0)(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./api/config/database.js":
/*!********************************!*\
  !*** ./api/config/database.js ***!
  \********************************/
/*! exports provided: connectMongoose */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "connectMongoose", function() { return connectMongoose; });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constants */ "./api/constants.js");


// DB Config. Requires Express.js
var connectMongoose = function connectMongoose(api) {

	/* Requires */
	var mongoose = __webpack_require__(/*! mongoose */ "mongoose");
	var Grid = __webpack_require__(/*! gridfs-stream */ "gridfs-stream");

	// Config
	mongoose.Promise = global.Promise;
	Grid.mongo = mongoose.mongo;

	// Define Error Handler for All Mongo Errors into JSON.
	mongoose.Model.MongoErrors = function (errs) {
		var data = [];
		var counter = 0;
		for (var label in errs.errors) {
			console.log(errs);
			var msg = errs.errors[label].properties.message;
			data[counter] = msg;
			counter++;
		}
		return data;
	};

	// Connect to MongoDB
	mongoose.connect(_constants__WEBPACK_IMPORTED_MODULE_0__["MONGO_DB_URI"], function (err, res) {
		// mongoose.connection.db.dropDatabase();
		if (err) {
			console.log('[DB] Connection to MongoDB failed!. ' + err);
		} else {
			console.log('[DB] Successfully connected to MongoDB Server');

			// On Success, connect GridFS to mongoose.db instance.
			var gridfs = new Grid(mongoose.connection.db);

			// Make it available to express.
			api.set('gridfs', gridfs);

			// Setup GridFS Mongoose Model for Other Models to reference.
			var GFS = __webpack_require__(/*! ../models/GridFSModel */ "./api/models/GridFSModel.js");
		}
	});
};

/***/ }),

/***/ "./api/config/helpers.js":
/*!*******************************!*\
  !*** ./api/config/helpers.js ***!
  \*******************************/
/*! exports provided: validateToken, generateToken, generateAndStoreToken, verify */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "validateToken", function() { return validateToken; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "generateToken", function() { return generateToken; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "generateAndStoreToken", function() { return generateAndStoreToken; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "verify", function() { return verify; });
/* harmony import */ var uuid_v4__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! uuid/v4 */ "uuid/v4");
/* harmony import */ var uuid_v4__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(uuid_v4__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var jsonwebtoken__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! jsonwebtoken */ "jsonwebtoken");
/* harmony import */ var jsonwebtoken__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(jsonwebtoken__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../constants */ "./api/constants.js");




// Token Expiry default
var expiresDefault = '1d';

// Validation middleware to check for a token in the req.header.
function validateToken(req, res, next) {
  // Ensure a token was provided.
  if (!req.headers.authorization) {
    console.log('[REQUEST VERIFICATION] -- Bad request headers!', req.headers);
    res.json({ error: true, errors: ['This request did not have a valid token!'] });
  } else if (!req.headers.authorization.split(' ')[0] === 'Token') {
    console.log('[REQUEST VERIFICATION] -- Missing Token in auth header!', req.headers);
    res.json({ error: true, errors: ['This request did not have a valid token!'] });
  } else {

    // Parse token from string
    var token = req.headers.authorization.split(' ')[1];
    // Verify the token
    if (verify(token)) {
      console.log('[REQUEST VERIFICATION] -- Token verified!');
      next(); // pass to next middleware
    } else {
      console.log('[REQUEST VERIFICATION] -- Token verification failed! Session destoryed!');
      // Destroy passport session.
      req.logout();
      req.session.destroy();
      // Tell the user what happened.
      res.json({ error: true, errors: ['Invalid Token'] });
    }
  }
}

// create JWT
function generateToken(req, GUID, opts) {
  opts = opts || {};
  var token = jsonwebtoken__WEBPACK_IMPORTED_MODULE_1___default.a.sign({
    auth: GUID,
    agent: req.headers['user-agent']
  }, _constants__WEBPACK_IMPORTED_MODULE_2__["SECRET"], { expiresIn: opts.expires || expiresDefault });
  console.log('[REQUEST VERIFICATION] -- token generated: ', token);
  return token;
}

// Store the token in the user's metaData.
function generateAndStoreToken(req, user, opts) {
  var GUID = uuid_v4__WEBPACK_IMPORTED_MODULE_0___default()(); // Generate UUIDv4.
  var token = generateToken(req, GUID, opts); // Generate Token

  // Define a schema friendly object for the user.
  var record = {
    key: token,
    valid: true,
    created_at: new Date().getTime()
  };

  // Save token to user.
  user.set('token', record);
  user.save(function (err, user) {
    console.log('[REQUEST VERIFICATION] -- Token saved to user!');
    if (err || !user) return err;
    if (user) {}
  });
  // Return token
  return record.key;
}

// Token verifier
function verify(token) {
  var decoded = false;

  // Attempt to decode our token and verify.
  try {
    decoded = jsonwebtoken__WEBPACK_IMPORTED_MODULE_1___default.a.verify(token, _constants__WEBPACK_IMPORTED_MODULE_2__["SECRET"]);
  } catch (e) {
    decoded = false; // still false
  }

  // Did we decode properly?
  return decoded;
}

/***/ }),

/***/ "./api/config/passport.js":
/*!********************************!*\
  !*** ./api/config/passport.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* Necessary Models */
var Users = __webpack_require__(/*! ../models/UserModel */ "./api/models/UserModel.js").UserModel;

// Passort.js
var passport = __webpack_require__(/*! passport */ "passport");
var LocalStrategy = __webpack_require__(/*! passport-local */ "passport-local").Strategy;

/* Validation Library */

var _require = __webpack_require__(/*! express-validator/check */ "express-validator/check"),
    check = _require.check,
    validationResult = _require.validationResult;

var _require2 = __webpack_require__(/*! express-validator/filter */ "express-validator/filter"),
    matchedData = _require2.matchedData;

// Serialize The User.


passport.serializeUser(function (user, done) {
  done(null, user);
});

// Deserialize The User
passport.deserializeUser(function (user, done) {
  done(null, user);
});

// Proccess user login
/* Accepets:
  Username @string
  Password @string
*/
passport.use(new LocalStrategy({ usernameField: 'email' }, function (username, password, done) {

  // Grab our user from the database by their username
  Users.findOne({ email: username }).select('+salt').exec(function (err, user) {
    // If the User is not Found
    if (err) {
      return done('User Not Found');
    }

    // Check for user data
    if (!user) {
      return done(null, false, 'Incorrect username.');
    }

    // Validate PW
    user.validPassword(password, function (err, isMatch) {
      // If the password was false
      if (err) return done(null, false, 'Authentication Error');

      // If the password was correct
      if (isMatch) {
        // Send Success Message, along with the user data
        return done(null, user, 'Login Successful');
      } else {
        return done(null, false, 'Incorrect Password');
      }
    });
  });
}));

module.exports = passport;

/***/ }),

/***/ "./api/constants.js":
/*!**************************!*\
  !*** ./api/constants.js ***!
  \**************************/
/*! exports provided: PORT, MONGO_DB_URI, SECRET, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PORT", function() { return PORT; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MONGO_DB_URI", function() { return MONGO_DB_URI; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SECRET", function() { return SECRET; });
/* harmony import */ var envalid__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! envalid */ "envalid");
/* harmony import */ var envalid__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(envalid__WEBPACK_IMPORTED_MODULE_0__);


var env = Object(envalid__WEBPACK_IMPORTED_MODULE_0__["cleanEnv"])(Object({"BUILD_TARGET":"server","NODE_ENV":"development"}), {
  PORT: Object(envalid__WEBPACK_IMPORTED_MODULE_0__["num"])({ default: Object({"BUILD_TARGET":"server","NODE_ENV":"development"}).PORT || 3000 }),
  MONGO_DB_URI: Object(envalid__WEBPACK_IMPORTED_MODULE_0__["str"])(),
  SECRET: Object(envalid__WEBPACK_IMPORTED_MODULE_0__["str"])()
});

var PORT = env.PORT,
    MONGO_DB_URI = env.MONGO_DB_URI,
    SECRET = env.SECRET;



/* harmony default export */ __webpack_exports__["default"] = (env);

/***/ }),

/***/ "./api/index.js":
/*!**********************!*\
  !*** ./api/index.js ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var http__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! http */ "http");
/* harmony import */ var http__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(http__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _server__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./server */ "./api/server.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./constants */ "./api/constants.js");




console.log('[SERVER] Bed\'N\'Blockchain API starting....');
var SERVER_START = '[SERVER] Bed\'N\'Blockchain API sucessfully started on ' + _constants__WEBPACK_IMPORTED_MODULE_2__["PORT"] + '!';
console.time(SERVER_START);
var server = Object(http__WEBPACK_IMPORTED_MODULE_0__["createServer"])(_server__WEBPACK_IMPORTED_MODULE_1__["default"]);
server.listen(_constants__WEBPACK_IMPORTED_MODULE_2__["PORT"], function () {
  return console.timeEnd(SERVER_START);
});

if (true) {
  var currentApp = _server__WEBPACK_IMPORTED_MODULE_1__["default"];
  module.hot.accept(/*! ./server */ "./api/server.js", function(__WEBPACK_OUTDATED_DEPENDENCIES__) { /* harmony import */ _server__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./server */ "./api/server.js");
(function () {
    server.removeListener('request', currentApp);
    var hotApp = __webpack_require__(/*! ./server */ "./api/server.js").default;
    server.on('request', hotApp);
    currentApp = hotApp;
  })(__WEBPACK_OUTDATED_DEPENDENCIES__); });
}

/***/ }),

/***/ "./api/models/BookingsModel.js":
/*!*************************************!*\
  !*** ./api/models/BookingsModel.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* Requires */
var mongoose = __webpack_require__(/*! mongoose */ "mongoose");
var validators = __webpack_require__(/*! mongoose-validators */ "mongoose-validators");
var Schema = mongoose.Schema;

// Define Booking Schema
var BookingsSchema = new Schema({
	ownerId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Users',
		required: [true, 'An ownerId is required!']
	},
	roomId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Rooms',
		required: [true, 'A roomId is required!']
	},
	buyerId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Users',
		required: [true, 'A buyerId is required!']
	},
	price: { type: Number, required: [true, 'A price is required!'] },
	guests: {
		adults: { type: Number, required: [true, 'Number of adult guests is required!'] },
		children: { type: Number, required: [true, 'Number of children guests is required!'] }
	},
	created_at: Date,
	updated_at: Date
});

// Before a booking is saved into the Database
BookingsSchema.pre('save', function (next) {

	// Grab the booking during this request
	var booking = this;

	console.log(booking);

	// change the updated_at field to current date
	var currentDate = new Date();
	booking.updated_at = currentDate;

	// if created_at doesn't exist, add to that field
	if (!booking.created_at) booking.created_at = currentDate;

	next();
});

// Export Models
exports.BookingsModel = mongoose.model('Bookings', BookingsSchema);

/***/ }),

/***/ "./api/models/GridFSModel.js":
/*!***********************************!*\
  !*** ./api/models/GridFSModel.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* Requires */
var mongoose = __webpack_require__(/*! mongoose */ "mongoose");
var Schema = mongoose.Schema;

// Export Models
exports.GridFSModel = mongoose.model("GridFS", new Schema({}, { strict: false }), "fs.files");

/***/ }),

/***/ "./api/models/RoomsModel.js":
/*!**********************************!*\
  !*** ./api/models/RoomsModel.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* Requires */
var mongoose = __webpack_require__(/*! mongoose */ "mongoose");
var validators = __webpack_require__(/*! mongoose-validators */ "mongoose-validators");
var Schema = mongoose.Schema;

// Valid Select Field Types
var HomeTypes = ['Entire Place', 'Private Room', 'Shared Room'];
var PropertyTypes = ['House', 'Bed and Breakfast', 'Bungalow', 'Chalet', 'Cottage', 'Guesthouse', 'Guest suite', 'Hotel', 'Resort', 'Loft', 'Townhouse', 'Villa'];

// Define Room Schema
var RoomsSchema = new Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
  title: { type: String, required: [true, 'A title is required!'] },
  description: { type: String, required: [true, 'A description is required!'] },
  propertyType: { type: String, required: [true, 'A Property Type is required!'] },
  roomType: { type: String, required: [true, 'A Room Type is required!'] },
  location: {
    formatted_address: { type: String, required: [true, 'A formatted address is required!'] },
    lat: { type: Number, required: [true, 'A latitude is required!'] },
    lng: { type: Number, required: [true, 'A longtitude is required!'] }
  },
  price: { type: Number, required: [true, 'A price is required!'] },
  guests: {
    adults: { type: Number, required: [true, 'Number of adult guests is required!'] },
    children: { type: Number, required: [true, 'Number of children guests is required!'] }
  },
  features: String,
  booked: { type: Boolean, default: false },
  availability: {
    start: Date,
    end: Date
  },
  featuredImageId: { type: mongoose.Schema.Types.ObjectId, ref: 'GridFS' },
  created_at: Date,
  updated_at: Date
});

// Before a room is saved into the Database
RoomsSchema.pre('save', function (next) {

  // Grab the room during this request
  var room = this;

  console.log(room);

  // change the updated_at field to current date
  var currentDate = new Date();
  room.updated_at = currentDate;

  // if created_at doesn't exist, add to that field
  if (!room.created_at) room.created_at = currentDate;

  next();
});

// Export Models
exports.RoomsModel = mongoose.model('Rooms', RoomsSchema);

/***/ }),

/***/ "./api/models/UserModel.js":
/*!*********************************!*\
  !*** ./api/models/UserModel.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* Requires */
var mongoose = __webpack_require__(/*! mongoose */ "mongoose");
var validators = __webpack_require__(/*! mongoose-validators */ "mongoose-validators");
var Schema = mongoose.Schema;

/* Utilities */
var bcrypt = __webpack_require__(/*! bcrypt */ "bcrypt");
var SALT_WORK_FACTOR = 10;

// Define User Schema
var UserSchema = new Schema({
	token: {
		key: String,
		valid: { type: Boolean, select: false },
		created_at: { type: Date, select: false }
	},
	firstname: { type: String, trim: true },
	lastname: { type: String, trim: true },
	email: {
		type: String,
		required: [true, 'An email is required!'],
		unique: [true, 'Email already taken!'],
		trim: true,
		lowercase: true,
		validate: [validators.isEmail({ message: 'Invalid Email' })]
	},
	password: { type: String, required: true },
	salt: { type: String, select: false },
	avatar: {
		data: Buffer,
		contentType: String
	},
	admin: Boolean,
	meta: {
		age: Number,
		website: String
	},
	created_at: Date,
	updated_at: Date
});

// Before a user is saved into the Database
UserSchema.pre('save', function (next) {

	// Grab the user during this request
	var user = this;

	// change the updated_at field to current date
	var currentDate = new Date();
	user.updated_at = currentDate;

	// if created_at doesn't exist, add to that field
	if (!user.created_at) user.created_at = currentDate;

	// only hash the password if it has been modified (or is new)
	if (!user.isModified('password')) return next();

	// generate a salt
	bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {

		if (err) return next(err);

		// hash the password using our new salt
		bcrypt.hash(user.password, salt, function (err, hash) {
			if (err) return next(err);

			// Update the user's password and salt fields for database entry.
			user.password = hash;
			user.salt = salt;
			next();
		});
	});
});

// Password Verification
UserSchema.methods.validPassword = function (candidatePassword, cb) {
	// Grab the user's Salt
	var salt = this.salt;
	// Grab the user's hashed password
	var password = this.password;

	// If we are going to return data to another server process
	if (cb && cb instanceof Function) {

		// Hash the Candiate Password to Compare against our salt.
		bcrypt.hash(candidatePassword, salt, function (err, candidateHash) {
			// Hashing Error
			if (err) return cb(err);

			// Comparison Check
			if (candidateHash === password) {
				cb(null, true); // True
			} else {
				cb(err, false); // False
			}
		});
		// Else, we just send a true/false.
	} else {

		// Generate a hash from the attempted password
		var hash = bcrypt.hashSync(candidatePassword, salt);

		// Comparison Check
		if (hash === password) {
			return true; // True
		} else {
			return false; // False
		}
	}
};

// Export Models
exports.UserModel = mongoose.model('Users', UserSchema);

/***/ }),

/***/ "./api/routes/auth.js":
/*!****************************!*\
  !*** ./api/routes/auth.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* Express Router */
var express = __webpack_require__(/*! express */ "express");
var auth = express.Router();

/* Necessary Models */
var Users = __webpack_require__(/*! ../models/UserModel */ "./api/models/UserModel.js").UserModel;

/* User Auth Library */
var passport = __webpack_require__(/*! passport */ "passport");

/* Validation Library */

var _require = __webpack_require__(/*! express-validator/check */ "express-validator/check"),
    check = _require.check,
    validationResult = _require.validationResult;

var _require2 = __webpack_require__(/*! express-validator/filter */ "express-validator/filter"),
    matchedData = _require2.matchedData;

/* Helpers */


var helpers = __webpack_require__(/*! ../config/helpers.js */ "./api/config/helpers.js");
var extend = __webpack_require__(/*! util */ "util")._extend;

// Login Submit Handling
auth.post('/login', function (req, res, next) {
	passport.authenticate('local', function (err, user, message) {
		// Throw Any Errors
		if (err) return res.json({ error: true, errors: [message] });

		// Incorrect Username Error
		if (!user) return res.json({ error: true, errors: [message] });

		// Submit login request using the user found in this request.
		req.logIn(user, function (err) {
			if (err) return next(err);
			var payload = { user: {
					id: user._id,
					email: user.email,
					token: helpers.generateAndStoreToken(req, user),
					created_at: user.created_at,
					updated_at: user.updated_at
				} };
			return res.json({ payload: payload });
		});
	})(req, res, next);
});

auth.get('/', helpers.validateToken, function (req, res, next) {
	var token = req.headers.authorization.split(' ')[1];

	Users.findOne({ 'token.key': token }).lean().exec(function (err, user) {
		if (err || !user) {
			res.json({ error: true, errors: ['Token not associated to a User!'] });
		}
		if (user) {
			var payload = { user: {
					id: user._id,
					email: user.email,
					token: user.token.key,
					created_at: user.created_at,
					updated_at: user.updated_at
				} };
			res.json({ payload: payload });
		}
	});
});

// Register a new User
auth.post('/signup', function (req, res, next) {
	var errors = [];
	if (!req.body.email) errors.push({ key: 'email', message: 'This field is required' });
	if (!req.body.password) errors.push({ key: 'password', message: 'This field is required' });
	if (!req.body.passwordConfirm) errors.push({ key: 'passwordConfirm', message: 'This field is required' });

	// If we had errors
	if (errors.length > 0) {
		return res.json(errors);
		// If Passwords didnt Match
	} else if (req.body.password !== req.body.passwordConfirm) {
		errors.push({ key: 'password', message: 'Passwords Do Not Match' });
		errors.push({ key: 'passwordConfirm', message: 'Passwords Do Not Match' });
		return res.json({ error: true, payload: { errors: errors } });
	} else {

		// Delete the confirmed password and pass req.body
		delete req.body.passwordConfirm;

		// Create the user
		Users.create(req.body, function (err, user) {
			if (err) {
				if (err.code === 11000) {
					return res.json({ error: true, errors: ['Email Already Registered!'] });
				} else {
					return res.json({ error: true, errors: [Users.MongoErrors(err)] });
				}
			}
			if (user.created_at) {
				// Authenticate them through Passport.js through our API.
				req.login(user, function (err) {
					if (!err) {
						var payload = { user: {
								id: user._id,
								email: user.email,
								updated_at: user.updated_at,
								created_at: user.created_at,
								token: helpers.generateAndStoreToken(req, user)
							} };
						return res.json({ payload: payload });
					} else {
						return res.json({
							error: true,
							payload: { errors: 'Something Unexpected Happened' }
						});
					}
				});
			}
		});
	}
});

module.exports = auth;

/***/ }),

/***/ "./api/routes/bookings.js":
/*!********************************!*\
  !*** ./api/routes/bookings.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* Express Router */
var express = __webpack_require__(/*! express */ "express");
var bookings = express.Router();

/* Necessary Models */
var Bookings = __webpack_require__(/*! ../models/BookingsModel */ "./api/models/BookingsModel.js").BookingsModel;
var Rooms = __webpack_require__(/*! ../models/RoomsModel */ "./api/models/RoomsModel.js").RoomsModel;

/* Helpers */
var helpers = __webpack_require__(/*! ../config/helpers.js */ "./api/config/helpers.js");

// Add a new booking
bookings.put('/add', helpers.validateToken, function (req, res, next) {
		console.log('req body data', req.body);
		// Define a schema safe object
		var bookingData = {
				ownerId: req.body.ownerId,
				roomId: req.body.roomId,
				buyerId: req.body.buyerId,
				price: req.body.price,
				guests: req.body.guests
		};
		// console.log('We got req data and stuff', req.body, bookingData);
		// Create a booking
		Bookings.create(bookingData, function (err, booking) {
				// console.log(err, booking);
				if (err || !booking) return res.json({ error: true, errors: Bookings.MongoErrors(err) });
				if (booking) {
						// Quick update the Room booked to have a {booked: true} status.
						Rooms.findByIdAndUpdate(booking.roomId, { $set: { booked: true } }, { new: true, runValidators: true }).exec(function (err, room) {
								if (err || !room) return res.json({ error: true, errors: Rooms.MongoErrors(err) });
								if (room) {
										// If we Successfully updated the room, then save our booking.
										booking.save(function (err) {
												if (err) return res.json({ error: true, errors: Rooms.MongoErrors(err) });
												var payload = {
														booking: booking
												};
												console.log('PAYLOAD', payload);
												res.json({ payload: payload });
										});
								}
						});
				}
		});
});

// Edit a booking
bookings.post('/edit/:bookingId', helpers.validateToken, function (req, res, next) {
		console.log(req.params);
		if (!req.params.bookingId) return res.json({ error: true, errors: ['No RoomID Provided!'] });
		if (req.params.bookingId) {
				var bookingData = {
						ownerId: req.body.ownerId,
						roomId: req.body.roomId,
						buyerId: req.body.buyerId,
						price: req.body.price,
						guests: req.body.guests
				};
				console.log('before update', req.params.bookingId);
				Bookings.findByIdAndUpdate(req.params.bookingId, { $set: bookingData }, { new: true, runValidators: true }).exec(function (err, booking) {
						if (err || !booking) return res.json({ error: true, errors: Bookings.MongoErrors(err) });
						if (booking) {
								var payload = {
										booking: booking
								};
								res.json({ payload: payload });
						}
				});
		}
});

// Retrieve a booking by ID
bookings.get('/:bookingId', function (req, res, next) {
		if (!req.params.bookingId) return res.json('A bookingId is required!');
		if (req.params.bookingId) {
				Bookings.findOne({ _id: req.params.bookingId }).populate('ownerId').populate('buyerId').populate('roomId').exec(function (err, booking) {
						console.log(err, booking);
						if (err || !booking) return res.json({ error: true, errors: Bookings.MongoErrors(err) });
						if (booking) {
								var _booking = {
										id: _booking._id,
										ownerId: _booking.ownerId,
										roomId: _booking.roomId,
										buyerId: _booking.buyerId,
										price: _booking.price,
										guests: _booking.guests,
										updated_at: _booking.updated_at,
										created_at: _booking.created_at
								};
								return res.json({ payload: { booking: _booking } });
						}
				});
		}
});

// Get a booking by buyerID (User)
bookings.get('/buyerId/:buyerId', function (req, res, next) {
		if (!req.params.buyerId) return res.json('A buyerId is required!');
		if (req.params.buyerId) {
				Bookings.find({ buyerId: req.params.buyerId })
				// .populate('featuredImageId')
				.populate('roomId').exec(function (err, bookings) {
						console.log(err, bookings);
						if (err || !bookings) return res.json({ error: false, errors: Bookings.MongoErrors(err) });
						if (bookings) {
								var payload = bookings.map(function (booking, index) {
										return {
												id: booking._id,
												buyerId: booking.buyerId,
												room: booking.roomId,
												ownerId: booking.ownerId,
												price: booking.price,
												guests: booking.guests,
												updated_at: booking.updated_at,
												created_at: booking.created_at
										};
								});
								return res.json({ payload: { bookings: payload } });
						}
				});
		}
});

// Delete a booking
bookings.delete('/delete/:bookingId', helpers.validateToken, function (req, res, next) {
		if (!req.params.bookingId) return res.json('A bookingId is required!');
		if (req.params.bookingId) {
				Bookings.findOne({ _id: req.params.bookingId }).exec(function (err, booking) {
						console.log(err);
						if (err || !booking) return res.json({ error: true, errors: Bookings.MongoErrors(err) });
						if (booking) {
								Rooms.findByIdAndUpdate(booking.roomId, { $set: { booked: false } }, { new: true, runValidators: true }).exec(function (err, room) {
										if (err || !room) return res.json({ error: true, errors: Rooms.MongoErrors(err) });
										if (room) {
												Bookings.deleteOne({ _id: req.params.bookingId }).exec(function (err) {
														if (err) return res.json({ error: true, errors: Rooms.MongoErrors(err) });
														if (!err) {
																console.log('Deleted', req.params.bookingId);
																return res.status(200).send({ payload: { success: true } });
														}
												});
										}
								});
						}
				});
		}
});

module.exports = bookings;

/***/ }),

/***/ "./api/routes/index.js":
/*!*****************************!*\
  !*** ./api/routes/index.js ***!
  \*****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! express */ "express");
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _auth__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./auth */ "./api/routes/auth.js");
/* harmony import */ var _auth__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_auth__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _rooms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./rooms */ "./api/routes/rooms.js");
/* harmony import */ var _rooms__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_rooms__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _bookings__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./bookings */ "./api/routes/bookings.js");
/* harmony import */ var _bookings__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_bookings__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _uploads__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./uploads */ "./api/routes/uploads.js");
/* harmony import */ var _uploads__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_uploads__WEBPACK_IMPORTED_MODULE_4__);


// Grab all our routes





var router = express__WEBPACK_IMPORTED_MODULE_0___default.a.Router();

// // Define Routes
router.use('/api/auth/', _auth__WEBPACK_IMPORTED_MODULE_1___default.a);
router.use('/api/rooms/', _rooms__WEBPACK_IMPORTED_MODULE_2___default.a);
router.use('/api/bookings/', _bookings__WEBPACK_IMPORTED_MODULE_3___default.a);
router.use('/api/uploads/', _uploads__WEBPACK_IMPORTED_MODULE_4___default.a);

/* harmony default export */ __webpack_exports__["default"] = (router);

/***/ }),

/***/ "./api/routes/rooms.js":
/*!*****************************!*\
  !*** ./api/routes/rooms.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/* Express Router */
var express = __webpack_require__(/*! express */ "express");
var rooms = express.Router();

/* Necessary Models */
var Rooms = __webpack_require__(/*! ../models/RoomsModel */ "./api/models/RoomsModel.js").RoomsModel;

/* Helpers */
var helpers = __webpack_require__(/*! ../config/helpers.js */ "./api/config/helpers.js");

// Return all rooms in collection.
rooms.get('/all', function (req, res, next) {
		// Grab all rooms
		Rooms.find({})
		// .populate('featuredImageId').populate('ownerId')
		.exec(function (err, rooms) {
				// Throw errors
				if (err || !rooms) return res.json(_defineProperty({ errors: true }, 'errors', Rooms.MongoErrors(err)));

				// If we recieved a valid Room array
				if (rooms) {
						var payload = rooms.map(function (room, index) {
								return {
										id: room._id,
										ownerId: room.ownerId,
										featuredImageId: room.featuredImageId,
										title: room.title,
										description: room.description,
										propertyType: room.propertyType,
										roomType: room.roomType,
										location: room.location,
										price: room.price,
										guests: room.guests,
										booked: room.booked,
										updated_at: room.updated_at,
										created_at: room.created_at
								};
						});
						return res.json({ payload: { rooms: payload } });
				}
		});
});

// Add A Room
rooms.put('/add', helpers.validateToken, function (req, res, next) {
		// Define a schema safe object
		var roomData = {
				ownerId: req.body.ownerId,
				featuredImageId: req.body.featuredImageId,
				title: req.body.title,
				description: req.body.desc,
				propertyType: req.body.propertyType,
				roomType: req.body.roomType,
				location: req.body.location,
				price: req.body.price,
				guests: req.body.guests
		};

		// Create the room
		Rooms.create(roomData, function (err, room) {
				if (err || !room) return res.json(_defineProperty({ errors: true }, 'errors', Rooms.MongoErrors(err)));
				if (room) {
						room.save(function (err) {
								if (err) res.send('Idk');
								var payload = {
										success: true,
										room: room
								};
								res.send({ payload: payload });
						});
				}
		});
});

// Check Token for current Users request.
rooms.post('/edit/:roomId', helpers.validateToken, function (req, res, next) {
		console.log(req.params);
		if (!req.params.roomId) return res.json({ error: true, errors: ['No RoomID Provided!'] });
		if (req.params.roomId) {
				// Define a schema safe object
				var roomData = {
						featuredImageId: req.body.featuredImageId,
						title: req.body.title,
						description: req.body.desc,
						propertyType: req.body.propertyType,
						roomType: req.body.roomType,
						location: req.body.location,
						price: req.body.price,
						guests: req.body.guests
				};
				console.log('before update', req.params.roomId);
				Rooms.findByIdAndUpdate(req.params.roomId, { $set: roomData }, { new: true, runValidators: true }, function (err, room) {
						if (err || !room) return res.json({ error: true, errors: Rooms.MongoErrors(err) });
						if (room) {
								var payload = {
										room: room
								};
								res.send({ payload: payload });
						}
				});
		}
});

// Find room by param ID
rooms.get('/:roomId', function (req, res, next) {
		if (!req.params.roomId) return res.json('A roomId is required!');
		if (req.params.roomId) {
				Rooms.findOne({ _id: req.params.roomId }).populate('ownerId').exec(function (err, room) {
						if (err || !room) return res.json({ error: true, errors: Rooms.MongoErrors(err) });
						if (room) {
								var payload = { room: {
												id: room._id,
												ownerId: room.ownerId,
												featuredImageId: room.featuredImageId,
												title: room.title,
												description: room.description,
												propertyType: room.propertyType,
												roomType: room.roomType,
												location: room.location,
												price: room.price,
												guests: room.guests,
												booked: room.booked,
												updated_at: room.updated_at,
												created_at: room.created_at
										} };
								return res.json({ payload: payload });
						}
				});
		}
});

// Get Rooms by the owner's ID
rooms.get('/ownerId/:ownerId', function (req, res, next) {
		if (!req.params.ownerId) return res.json('An ownerId is required!');
		if (req.params.ownerId) {
				Rooms.find({ ownerId: req.params.ownerId })
				// .populate('featuredImageId').populate('ownerId')
				.exec(function (err, rooms) {
						if (err || !rooms) return res.json({ error: true, errors: Rooms.MongoErrors(err) });
						if (rooms) {
								var payload = rooms.map(function (room, index) {
										return {
												id: room._id,
												ownerId: room.ownerId,
												featuredImageId: room.featuredImageId,
												title: room.title,
												description: room.description,
												propertyType: room.propertyType,
												roomType: room.roomType,
												location: room.location,
												price: room.price,
												guests: room.guests,
												booked: room.booked,
												updated_at: room.updated_at,
												created_at: room.created_at
										};
								});
								return res.json({ payload: { rooms: payload } });
						}
				});
		}
});

// Delete a room by ID
rooms.delete('/delete/:roomId', helpers.validateToken, function (req, res, next) {
		if (!req.params.roomId) return res.json('A roomId is required!');
		if (req.params.roomId) {
				Rooms.deleteOne({ _id: req.params.roomId }).exec(function (err) {
						console.log(err);
						if (err) return res.json({ error: true, errors: Rooms.MongoErrors(err) });
						if (!err) {
								console.log('Deleted', req.params.roomId);
								return res.status(200).send({ payload: { error: false } });
						}
				});
		}
});

// Export router
module.exports = rooms;

/***/ }),

/***/ "./api/routes/uploads.js":
/*!*******************************!*\
  !*** ./api/routes/uploads.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* Express Router */
var express = __webpack_require__(/*! express */ "express");
var uploads = express.Router();

/* Upload Parsing Libs*/
var multer = __webpack_require__(/*! multer */ "multer");
var upload = multer({ storage: multer.memoryStorage() });

/* Models */
var Users = __webpack_require__(/*! ../models/UserModel */ "./api/models/UserModel.js").UserModel;

/* Utilities */
var moment = __webpack_require__(/*! moment */ "moment");

/* Helpers */
var helpers = __webpack_require__(/*! ../config/helpers.js */ "./api/config/helpers.js");

// Upload a file
uploads.post('/', helpers.validateToken, upload.single('file'), function (req, res, next) {
	console.log('req.file', req.file);
	if (!req.file) return res.send({ error: true, errors: ['File uploaded failed to be retrieved by the server.'] });

	// Grab GridFS for file parsing into MongoDB
	var gridfs = req.app.get('gridfs');

	// Define a filename that is unique.
	var filename = req.file.originalname.split('.')[0] + moment().format("YYYY-MM-DD-HHmmss") + req.file.originalname.split('.')[1];

	// Begin writing data from reqest into a writeStream
	var writeStream = gridfs.createWriteStream({
		filename: filename,
		mode: 'w',
		content_type: req.file.mimetype
	});

	writeStream.on('close', function (file) {
		console.log(file);
		// Send data back to the user
		var payload = {
			file_id: file._id,
			file_name: file.filename
		}; // Finished writing the file to gridfs.

		// Finish this request
		res.send({ payload: { file: payload } });
	});

	// write current file buffer to our GridFS writeStream
	writeStream.write(req.file.buffer, function () {
		writeStream.end(); // On complete, end the stream.
	});

	// Loop until the stream ends.
	req.pipe(writeStream);
});

// Fetch a file
uploads.get('/:fileId', function (req, res, next) {
	// Grab GridFS for file parsing into MongoDB
	var gridfs = req.app.get('gridfs');

	// Find the requested file by it's ID
	gridfs.findOne({ _id: req.params.fileId }, function (err, file) {
		if (err) return res.status(400).send(err);
		if (!file) return res.status(404);

		var fileMeta = file;

		// Begin Reading data from gridfs into a stream.
		var readStream = gridfs.createReadStream({
			_id: fileMeta._id
		});

		var chunks = [];

		readStream.on('open', function () {
			console.log("Reading File from DB");
		}); // On stream start

		readStream.on('data', function (chunk) {
			chunks.push(chunk);
		}); //loading

		readStream.on("end", function () {
			console.log("File ready!");
			// Create a single buffer from the array of chunks(buffers).
			var buff = Buffer.concat(chunks);
			// Convert to base64 string
			var base64 = buff.toString('base64');
			// Return browser readable data
			var file = 'data:' + fileMeta.contentType + ';base64,' + base64;
			// End this request
			res.end(file);
		}); // On stream end.

		readStream.on('error', function (err) {
			console.log(err);
		}); // Catch errors

		// Loop until the stream ends.
		readStream.pipe(res);
	});
});

// Export
module.exports = uploads;

/***/ }),

/***/ "./api/server.js":
/*!***********************!*\
  !*** ./api/server.js ***!
  \***********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(__dirname) {/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! path */ "path");
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! express */ "express");
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var cors__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! cors */ "cors");
/* harmony import */ var cors__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(cors__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var body_parser__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! body-parser */ "body-parser");
/* harmony import */ var body_parser__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(body_parser__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var morgan__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! morgan */ "morgan");
/* harmony import */ var morgan__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(morgan__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var express_session__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! express-session */ "express-session");
/* harmony import */ var express_session__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(express_session__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _config_database_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./config/database.js */ "./api/config/database.js");
/* harmony import */ var _config_passport__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./config/passport */ "./api/config/passport.js");
/* harmony import */ var _config_passport__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_config_passport__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./constants */ "./api/constants.js");
/* harmony import */ var _ssr__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./ssr */ "./api/ssr.js");
/* harmony import */ var _routes___WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./routes/ */ "./api/routes/index.js");




 // logger


 // User auth





// Setup Express API Server
var api = express__WEBPACK_IMPORTED_MODULE_1___default()();

// Setup MongoDB
Object(_config_database_js__WEBPACK_IMPORTED_MODULE_6__["connectMongoose"])(api);
//
// // Attach our mongodb to express session data
// const MongoStore = require('connect-mongo')(session);

// Set Global Express vars
api.set('port', _constants__WEBPACK_IMPORTED_MODULE_8__["PORT"]);
api.set('secret', _constants__WEBPACK_IMPORTED_MODULE_8__["SECRET"]);

// Setup Session
api.use(express_session__WEBPACK_IMPORTED_MODULE_5___default()({
  maxAge: 100 * 60 * 60,
  secret: api.get('secret'),
  resave: false,
  saveUninitialized: false
  // store: new MongoStore({url: MONGO_DB_URI})
}));
api.use(_config_passport__WEBPACK_IMPORTED_MODULE_7___default.a.initialize()); // Passport.js Init
api.use(_config_passport__WEBPACK_IMPORTED_MODULE_7___default.a.session()); // Session Init

// Request Body Parsing Middleware
api.use(body_parser__WEBPACK_IMPORTED_MODULE_3___default.a.urlencoded({ extended: true })); // Parse application/x-www-form-urlencoded
api.use(body_parser__WEBPACK_IMPORTED_MODULE_3___default.a.json()); // Parse application/json

// CORS Configuration is done here!
var corsOptions = {
  origin: ['http://localhost:' + _constants__WEBPACK_IMPORTED_MODULE_8__["PORT"]],
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
};
// Pass all routes through this middleware
api.all('*', cors__WEBPACK_IMPORTED_MODULE_2___default()(corsOptions), function (req, res, next) {
  req.accepts('application/json');
  console.log('Path: ', req.path);
  console.log('Method: ', req.method);
  console.log('Params: ', req.params);
  console.log('Body: ', req.body);
  console.log('Headers: ', req.headers);
  next();
});

/*
	Apply webpack Hot reloading middleware to
	listen to changes in our api server
	if we're in development mode.
*/
console.log("development");
if (true) {

  // Bind our webpack compiler to our express webpack Hot Middleware
  var webpack = __webpack_require__(/*! webpack */ "webpack");
  var webpackDevMiddleware = __webpack_require__(/*! webpack-dev-middleware-webpack-2 */ "webpack-dev-middleware-webpack-2");
  var webpackHotMiddleware = __webpack_require__(/*! webpack-hot-middleware */ "webpack-hot-middleware");
  var webpackConfig = __webpack_require__(/*! config/webpack.client.dev */ "./config/webpack.client.dev.js");
  var compiler = webpack(webpackConfig);

  api.use(webpackHotMiddleware(compiler));
  api.use(webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: webpackConfig.output.publicPath
  }));

  // Tell express where to find files while in development
  api.use('/static', express__WEBPACK_IMPORTED_MODULE_1___default.a.static(__dirname + '../.build'));

  // Logging
  var _morgan = __webpack_require__(/*! morgan */ "morgan");
  api.use(_morgan('dev'));
} else {}

// Grab all api routes after we've setup express
api.use(_routes___WEBPACK_IMPORTED_MODULE_10__["default"]);

// And finally if no other route is matched,
// then send our react app.
api.get('/', function (req, res) {
  console.log('iran');
  if (false) { var _page; }
  var template = __webpack_require__(/*! ../client/index.html */ "./client/index.html");
  var CONSTANT = __webpack_require__(/*! ../client/constants */ "./client/constants.js");
  var page = template.replace('"-- CONFIG --"', JSON.stringify(CONSTANT));
  return res.send(page);
});

/* harmony default export */ __webpack_exports__["default"] = (api);
/* WEBPACK VAR INJECTION */}.call(this, "/"))

/***/ }),

/***/ "./api/ssr.js":
/*!********************!*\
  !*** ./api/ssr.js ***!
  \********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-redux */ "react-redux");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_redux__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_dom_server__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-dom/server */ "react-dom/server");
/* harmony import */ var react_dom_server__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_dom_server__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var history_createMemoryHistory__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! history/createMemoryHistory */ "history/createMemoryHistory");
/* harmony import */ var history_createMemoryHistory__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(history_createMemoryHistory__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var react_router_redux__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-router-redux */ "react-router-redux");
/* harmony import */ var react_router_redux__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_router_redux__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var client_store__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! client/store */ "./client/store.js");
/* harmony import */ var client_containers_App__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! client/containers/App */ "./client/containers/App.js");
/* harmony import */ var client_index_html__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! client/index.html */ "./client/index.html");
/* harmony import */ var client_index_html__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(client_index_html__WEBPACK_IMPORTED_MODULE_7__);







// Application View Component



/* harmony default export */ __webpack_exports__["default"] = (function () {
  var history = history_createMemoryHistory__WEBPACK_IMPORTED_MODULE_3___default()();
  var store = Object(client_store__WEBPACK_IMPORTED_MODULE_5__["default"])(history);
  var state = store.getState();

  var rendered = Object(react_dom_server__WEBPACK_IMPORTED_MODULE_2__["renderToString"])(react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
    react_redux__WEBPACK_IMPORTED_MODULE_1__["Provider"],
    { store: store },
    react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
      react_router_redux__WEBPACK_IMPORTED_MODULE_4__["ConnectedRouter"],
      { history: history },
      react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Route, { component: client_containers_App__WEBPACK_IMPORTED_MODULE_6__["default"] })
    )
  ));
  var page = client_index_html__WEBPACK_IMPORTED_MODULE_7___default.a.replace('<!-- CONTENT -->', rendered).replace('"-- STORES --"', JSON.stringify(state));

  return page;
});

/***/ }),

/***/ "./client/actions.js":
/*!***************************!*\
  !*** ./client/actions.js ***!
  \***************************/
/*! exports provided: LOAD_PAGE, UNLOAD_PAGE, APP, ASYNC, AUTH, ROOMS, BOOKINGS, ROOMEDITOR, SETTINGS */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LOAD_PAGE", function() { return LOAD_PAGE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UNLOAD_PAGE", function() { return UNLOAD_PAGE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "APP", function() { return APP; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ASYNC", function() { return ASYNC; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AUTH", function() { return AUTH; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ROOMS", function() { return ROOMS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BOOKINGS", function() { return BOOKINGS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ROOMEDITOR", function() { return ROOMEDITOR; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SETTINGS", function() { return SETTINGS; });
// Page Loaders
var LOAD_PAGE = {
  HOME: 'LOAD_HOME_PAGE',
  LOGIN: 'LOAD_LOGIN_PAGE',
  SIGNUP: 'LOAD_SIGNUP_PAGE',
  ROOM: 'LOAD_ROOM_PAGE',
  ROOMS: 'LOAD_ROOMS_PAGE',
  ROOMEDITOR: 'LOAD_ROOMEDITOR_PAGE',
  YOURROOMS: 'LOAD_YOURROOMS_PAGE',
  BOOKINGS: 'LOAD_BOOKINGS_PAGE',
  SETTINGS: 'LOAD_SETTINGS_PAGE'
};

// Page Unloaders
var UNLOAD_PAGE = {
  HOME: 'UNLOAD_HOME_PAGE',
  LOGIN: 'UNLOAD_LOGIN_PAGE',
  SIGNUP: 'UNLOAD_SIGNUP_PAGE',
  ROOM: 'UNLOAD_ROOM_PAGE',
  ROOMS: 'UNLOAD_ROOMS_PAGE',
  ROOMEDITOR: 'UNLOAD_ROOMEDITOR_PAGE',
  YOURROOMS: 'UNLOAD_YOURROOMS_PAGE',
  BOOKINGS: 'UNLOAD_BOOKINGS_PAGE',
  SETTINGS: 'UNLOAD_SETTINGS_PAGE'
};

// App general
var APP = {
  LOAD: 'APP_LOAD',
  REDIRECT: 'REDIRECT',
  CLOSE_ERROR: 'GLOBAL_CLOSE_ERROR',
  DELETE_TOKEN: 'DELETE_TOKEN'
};

// Async related
var ASYNC = {
  START: 'ASYNC_START',
  END: 'ASYNC_END',
  ERROR: 'ASYNC_ERROR',
  CONNECTION_ERROR: 'ASYNC_CONNECTION_ERROR'
};

// Authentication related
var AUTH = {
  LOGIN: 'LOGIN',
  SIGNUP: 'SIGNUP',
  LOGOUT: 'LOGOUT',
  FIELD_ERROR: 'AUTH_FIELD_ERROR',
  UPDATE_FIELD: 'AUTH_UPDATE_FIELD',
  CLOSE_ERROR: 'AUTH_CLOSE_ERROR',
  FieldError: function FieldError(key, message, inputState, value) {
    return {
      type: AUTH.FIELD_ERROR,
      key: key,
      message: message,
      inputState: inputState,
      value: value
    };
  }
};

// Room related
var ROOMS = {
  CLOSE_ERROR: 'ROOMS_CLOSE_ERROR',
  FIELD_ERROR: 'ROOMS_FIELD_ERROR',
  INCREMENT_GUESTS: 'ROOMS_INCREMENT_GUESTS',
  DECREMENT_GUESTS: 'ROOMS_DECREMENT_GUESTS',
  SELECT_DATES: 'ROOMS_SELECT_DATES',
  UPDATE_CALENDAR_TYPE: 'ROOMS_UPDATE_CALENDAR_TYPE',
  ADD: 'ADD_ROOM',
  EDIT: 'EDIT_ROOM',
  BOOK: 'BOOK_ROOM',
  DELETE: 'DELETE_ROOM',
  FieldError: function FieldError(key, message, inputState, value) {
    return {
      type: ROOMS.FIELD_ERROR,
      key: key,
      message: message,
      inputState: inputState,
      value: value
    };
  }
};

// Booking related
var BOOKINGS = {
  ADD: 'ADD_BOOKING',
  EDIT: 'EDIT_BOOKING',
  DELETE: 'DELETE_BOOKING'
};

// RoomEditor related
var ROOMEDITOR = {
  CLOSE_ERROR: 'SETTINGS_CLOSE_ERROR',
  FIELD_ERROR: 'ROOMEDITOR_FIELD_ERROR',
  UPDATE_FIELD: 'ROOMEDITOR_UPDATE_FIELD',
  INCREMENT_GUESTS: 'ROOMEDITOR_INCREMENT_GUESTS',
  DECREMENT_GUESTS: 'ROOMEDITOR_DECREMENT_GUESTS',
  UPLOAD_FEATURED_IMAGE: 'ROOMEDITOR_UPLOAD_FEATURED_IMAGE',
  FETCH_GMAPS_RESULTS: 'ROOMEDITOR_FETCH_GMAPS_RESULTS',
  UPDATE_LOCATION_FROM_SUGGESTION: 'ROOMEDITOR_UPDATE_LOCATION_FROM_SUGGESTION',
  SELECT_DATE_TYPE: 'ROOMEDITOR_SELECT_DATE_TYPE',
  FieldError: function FieldError(key, message, inputState, value) {
    return {
      type: ROOMEDITOR.FIELD_ERROR,
      key: key,
      message: message,
      inputState: inputState,
      value: value
    };
  }
};

// Setings related
var SETTINGS = {
  UPDATE_FIELD: 'SETTINGS_UPDATE_FIELD',
  FIELD_ERROR: 'SETTINGS_FIELD_ERROR',
  CLOSE_ERROR: 'SETTINGS_CLOSE_ERROR',
  FieldError: function FieldError(key, message, inputState, value) {
    return {
      type: SETTINGS.FIELD_ERROR,
      key: key,
      message: message,
      inputState: inputState,
      value: value
    };
  }
};

/***/ }),

/***/ "./client/agent.js":
/*!*************************!*\
  !*** ./client/agent.js ***!
  \*************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var superagent__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! superagent */ "superagent");
/* harmony import */ var superagent__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(superagent__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var superagent_promise__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! superagent-promise */ "superagent-promise");
/* harmony import */ var superagent_promise__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(superagent_promise__WEBPACK_IMPORTED_MODULE_1__);
// Grab Superagent for handling outbound requests.



// Promisifiy superagent
var superagent = superagent_promise__WEBPACK_IMPORTED_MODULE_1___default()(superagent__WEBPACK_IMPORTED_MODULE_0___default.a, global.Promise);

// Define constants
var API_ROOT = 'http://localhost:3000/api';
var GMAPS_ROOT = 'https://maps.googleapis.com/maps/api/geocode/';
// const encode = encodeURIComponent;
var responseBody = function responseBody(res) {
  return res.body;
};
var token = null;
var GMAPSKEY = 'AIzaSyAeUUJdV1tvsAu8J63PvZVFEQAKvg8thVI';

// Used to add a token to request headers.
var tokenPlugin = function tokenPlugin(req) {
  if (token) {
    req.set('authorization', 'Token ' + token);
  }
};

// Define a general request handler to add the user's token if it exists.
var requests = {
  del: function del(url) {
    return superagent.del('' + API_ROOT + url).use(tokenPlugin).then(responseBody);
  },
  get: function get(url) {
    return superagent.get('' + API_ROOT + url).use(tokenPlugin).then(responseBody);
  },
  put: function put(url, body) {
    return superagent.put('' + API_ROOT + url, body).use(tokenPlugin).then(responseBody);
  },
  post: function post(url, body) {
    return superagent.post('' + API_ROOT + url, body).use(tokenPlugin).then(responseBody);
  }
};

// Define general GMAPS requests for standardized calls to the API
var GMapsAPIRequest = {
  post: function post(address) {
    return superagent.post(GMAPS_ROOT + 'json?address=' + address + '&key=' + GMAPSKEY);
  },
  get: function get(address) {
    return superagent.get(GMAPS_ROOT + 'json?address=' + address + '&key=' + GMAPSKEY);
  }
};

// Authentication requests
var Auth = {
  current: function current() {
    return requests.get('/auth');
  },
  login: function login(email, password) {
    return requests.post('/auth/login', { email: email, password: password });
  },
  signup: function signup(email, password, passwordConfirm) {
    return requests.post('/auth/signup', { email: email, password: password, passwordConfirm: passwordConfirm });
  },
  save: function save(user) {
    return requests.put('/user', { user: user });
  }
};

// Handle requests to GMaps API
var Maps = {
  findAddress: function findAddress(value) {
    var json = encodeURIComponent(JSON.stringify(value));
    return GMapsAPIRequest.get(json);
  }
};

// Room Requests
var Rooms = {
  all: function all() {
    return requests.get('/rooms/all');
  },
  add: function add(ownerId, title, desc, propertyType, roomType, location, price, guests, featuredImageId) {
    return requests.put('/rooms/add', { ownerId: ownerId, title: title, desc: desc, propertyType: propertyType, roomType: roomType, location: location, price: price, guests: guests, featuredImageId: featuredImageId });
  },
  editRoom: function editRoom(roomId, title, desc, propertyType, roomType, location, price, guests, featuredImageId) {
    return requests.post('/rooms/edit/' + roomId, { title: title, desc: desc, propertyType: propertyType, roomType: roomType, location: location, price: price, guests: guests, featuredImageId: featuredImageId });
  },
  getRoom: function getRoom(id) {
    return requests.get('/rooms/' + id);
  },
  roomByUserId: function roomByUserId(id) {
    return requests.get('/rooms/ownerId/' + id);
  },
  deleteRoom: function deleteRoom(id) {
    return requests.del('/rooms/delete/' + id);
  }
};

// Bookings Requests
var Bookings = {
  all: function all() {
    return requests.get('/bookings/all');
  },
  bookRoom: function bookRoom(buyerId, ownerId, roomId, price, guests) {
    return requests.put('/bookings/add', { buyerId: buyerId, ownerId: ownerId, roomId: roomId, price: price, guests: guests });
  },
  editBooking: function editBooking(bookingId, guests) {
    return requests.post('/rooms/edit/' + bookingId, { guests: guests });
  },
  getBooking: function getBooking(id) {
    return requests.get('/bookings/' + id);
  },
  bookingsByBuyerId: function bookingsByBuyerId(buyerId) {
    return requests.get('/bookings/buyerId/' + buyerId);
  },
  deleteBooking: function deleteBooking(bookingId) {
    return requests.del('/bookings/delete/' + bookingId);
  }
};

// Requests to the file server
var Uploads = {
  asyncFileUpload: function asyncFileUpload(file) {
    return superagent.post(API_ROOT + '/uploads/').use(tokenPlugin).send(file).on('progress', function (event) {
      console.log(event);
    }).then(responseBody);
  },
  getFile: function getFile(id) {
    return superagent.get(API_ROOT + '/uploads/' + id).use(tokenPlugin).on('progress', function (event) {
      console.log(event);
    }).then(responseBody);
  }
};

// Exports
/* harmony default export */ __webpack_exports__["default"] = ({
  Auth: Auth,
  Rooms: Rooms,
  Bookings: Bookings,
  Maps: Maps,
  Uploads: Uploads,
  setToken: function setToken(_token) {
    token = _token;
  }
});

/***/ }),

/***/ "./client/assets/banner.jpg":
/*!**********************************!*\
  !*** ./client/assets/banner.jpg ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "client/assets/banner_1JofY.jpg";

/***/ }),

/***/ "./client/assets/banner6.jpg":
/*!***********************************!*\
  !*** ./client/assets/banner6.jpg ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "client/assets/banner6_dJDky.jpg";

/***/ }),

/***/ "./client/assets/defaultUserAvatar.png":
/*!*********************************************!*\
  !*** ./client/assets/defaultUserAvatar.png ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "client/assets/defaultUserAvatar_3CjaF.png";

/***/ }),

/***/ "./client/assets/loader.gif":
/*!**********************************!*\
  !*** ./client/assets/loader.gif ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "client/assets/loader_1m-PP.gif";

/***/ }),

/***/ "./client/components/404.js":
/*!**********************************!*\
  !*** ./client/components/404.js ***!
  \**********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-router-dom */ "react-router-dom");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_router_dom__WEBPACK_IMPORTED_MODULE_1__);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }




var Four_Oh_Four = function (_React$Component) {
  _inherits(Four_Oh_Four, _React$Component);

  function Four_Oh_Four() {
    _classCallCheck(this, Four_Oh_Four);

    return _possibleConstructorReturn(this, (Four_Oh_Four.__proto__ || Object.getPrototypeOf(Four_Oh_Four)).apply(this, arguments));
  }

  _createClass(Four_Oh_Four, [{
    key: 'componentWillMount',
    value: function componentWillMount() {}
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {}
  }, {
    key: 'render',
    value: function render() {
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
        'section',
        { id: '404', className: 'hero is-dark is-bold is-fullheight' },
        react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
          'div',
          { className: 'hero-body' },
          react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
            'div',
            { className: 'container has-text-centered' },
            react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
              'h1',
              { className: 'title is-1' },
              'Uh oh! This page was not found!'
            ),
            react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement('br', null),
            react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
              react_router_dom__WEBPACK_IMPORTED_MODULE_1__["Link"],
              { className: 'button is-info is-large', to: '/' },
              'Return Home'
            )
          )
        )
      );
    }
  }]);

  return Four_Oh_Four;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component);

/* harmony default export */ __webpack_exports__["default"] = (Four_Oh_Four);

/***/ }),

/***/ "./client/components/ErrorList.js":
/*!****************************************!*\
  !*** ./client/components/ErrorList.js ***!
  \****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }



var ErrorsList = function (_Component) {
  _inherits(ErrorsList, _Component);

  function ErrorsList() {
    _classCallCheck(this, ErrorsList);

    return _possibleConstructorReturn(this, (ErrorsList.__proto__ || Object.getPrototypeOf(ErrorsList)).apply(this, arguments));
  }

  _createClass(ErrorsList, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      if (this.props.errors) {
        return this.props.errors.map(function (error, index) {
          console.log(error, index);
          return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
            "div",
            { key: index, className: "notification is-danger" },
            react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", { className: "delete", onClick: function onClick() {
                return _this2.props.handleClose(index);
              } }),
            react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
              "span",
              null,
              error
            )
          );
        }, this);
      }
      return null;
    }
  }]);

  return ErrorsList;
}(react__WEBPACK_IMPORTED_MODULE_0__["Component"]);

/* harmony default export */ __webpack_exports__["default"] = (ErrorsList);

/***/ }),

/***/ "./client/components/Field.js":
/*!************************************!*\
  !*** ./client/components/Field.js ***!
  \************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _Input__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Input */ "./client/components/Input.js");
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }





// Wrap the Label for cleaner syntax in the Field Component
var Label = function Label(props) {
	if (!props.label) return null;
	if (props.label) {
		return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
			'label',
			{ className: props.className },
			props.label
		);
	}
	return null;
};

// Wrap the message and apply the inputState for styles
var Message = function Message(props) {
	if (props.message) {
		return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
			'p',
			{ className: 'help ' + props.inputState },
			props.message
		);
	}
	return null;
};

/*
*		Define a Wrapper component that will change the appearance
* 	of the form based on props provided.
*		{
*			isHorizontal: Boolean, // this makes the form horizontal
*			children: Component // this injects the field into the styled form
*		}
*/
var FieldWrapper = function FieldWrapper(props) {
	if (props.isHorizontal) {
		return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
			'div',
			{ className: 'field is-horizontal' },
			props.label ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Label, { label: props.label, className: 'field-label is-normal' }) : null,
			react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
				'div',
				{ className: 'field-body' },
				react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
					'div',
					{ className: 'field is-expanded' },
					react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
						'div',
						{ className: 'field' + (props.hasAddonLeft || props.hasAddonRight ? ' has-addons' : '') },
						props.children
					)
				)
			)
		);
	} else {
		return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
			'div',
			{ className: 'field' + (props.hasAddonLeft || props.hasAddonRight ? ' has-addons' : '') },
			props.label ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Label, { label: props.label, className: 'label' }) : null,
			props.children
		);
	}
};

var BulmaField = function (_Component) {
	_inherits(BulmaField, _Component);

	function BulmaField() {
		_classCallCheck(this, BulmaField);

		return _possibleConstructorReturn(this, (BulmaField.__proto__ || Object.getPrototypeOf(BulmaField)).apply(this, arguments));
	}

	_createClass(BulmaField, [{
		key: 'render',
		value: function render() {
			var _this2 = this;

			return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
				FieldWrapper,
				{
					label: this.props.label ? this.props.label : null,
					hasAddonLeft: this.props.hasAddonLeft,
					hasAddonRight: this.props.hasAddonRight,
					isHorizontal: this.props.isHorizontal,
					inputState: this.props.inputState,
					message: this.props.message
				},
				this.props.hasAddonLeft ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
					'div',
					{ className: 'control' },
					this.props.hasAddonLeft
				) : null,
				react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
					'div',
					{ className: 'control' + (this.props.size ? ' ' + this.props.size : '') + (this.props.hasIconRight ? ' has-icons-right' : '') + (this.props.hasIconLeft ? ' has-icons-left' : '') + (this.props.isLoading ? ' is-loading' : '') },
					react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_Input__WEBPACK_IMPORTED_MODULE_1__["default"], {
						type: this.props.type,
						size: this.props.size,
						placeholder: this.props.placeholder,
						value: this.props.value,
						disabled: this.props.disabled,
						inputState: this.props.inputState,
						onChange: this.props.onChange,
						onClick: this.props.onClick,
						active: this.props.active,
						results: this.props.results,
						opts: this.props.opts
					}),
					this.props.type === 'search' ? this.props.results ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
						'div',
						{ className: 'results' },
						this.props.results.map(function (room, index) {
							var searchObj = {
								resultId: index
							};
							return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement('div', {
								key: index,
								className: 'suggestion',
								onClick: function onClick() {
									return _this2.props.onClick(searchObj.resultId);
								}
							});
						}, this)
					) : null : null,
					this.props.results ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
						'div',
						{ className: 'results' },
						this.props.results.map(function (result, key) {
							var locationObj = {
								resultId: key,
								lat: result.geometry.location.lat,
								lng: result.geometry.location.lng,
								formatted_address: result.formatted_address
							};
							return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
								'div',
								{ key: key, className: 'suggestion', onClick: function onClick() {
										return _this2.props.onClick(locationObj);
									} },
								locationObj.formatted_address
							);
						}, this)
					) : null,
					this.props.hasIconLeft ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
						'span',
						{ className: 'icon is-left' },
						react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement('i', { className: 'fa fa-' + this.props.hasIconLeft })
					) : null,
					this.props.hasIconRight ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
						'span',
						{ className: 'icon is-right' },
						react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement('i', { className: 'fa fa-' + this.props.hasIconRight })
					) : null,
					react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Message, { inputState: this.props.inputState, message: this.props.message })
				),
				this.props.hasAddonRight ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
					'div',
					{ className: 'control' },
					this.props.hasAddonRight
				) : null
			);
		}
	}]);

	return BulmaField;
}(react__WEBPACK_IMPORTED_MODULE_0__["Component"]);

/* harmony default export */ __webpack_exports__["default"] = (BulmaField);

/***/ }),

/***/ "./client/components/GlobalErrors.js":
/*!*******************************************!*\
  !*** ./client/components/GlobalErrors.js ***!
  \*******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);


var GlobalErrors = function GlobalErrors(props) {
	if (props.errors && props.handleClose) {
		return props.errors.map(function (error, index) {
			return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
				"div",
				{ key: index, id: "global", className: "notification is-danger" },
				react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", { onClick: function onClick() {
						return props.handleClose(index);
					}, className: "delete" }),
				error
			);
		});
	}
	return null;
};

/* harmony default export */ __webpack_exports__["default"] = (GlobalErrors);

/***/ }),

/***/ "./client/components/Input.js":
/*!************************************!*\
  !*** ./client/components/Input.js ***!
  \************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }


// import Calendar from 'react-calendar';

var BulmaInput = function (_Component) {
  _inherits(BulmaInput, _Component);

  function BulmaInput(props) {
    _classCallCheck(this, BulmaInput);

    var _this = _possibleConstructorReturn(this, (BulmaInput.__proto__ || Object.getPrototypeOf(BulmaInput)).call(this, props));

    _this.onFocus = _this.onFocus.bind(_this);
    _this.onBlur = _this.onBlur.bind(_this);
    _this.onHover = _this.onHover.bind(_this);
    _this.offHover = _this.offHover.bind(_this);
    _this.state = {
      focused: false,
      hover: false
    };
    return _this;
  }

  _createClass(BulmaInput, [{
    key: 'onFocus',
    value: function onFocus() {
      this.setState({ focused: true });
    }
  }, {
    key: 'onBlur',
    value: function onBlur() {
      this.setState({ focused: false });
    }
  }, {
    key: 'onHover',
    value: function onHover() {
      this.setState({ hover: true });
    }
  }, {
    key: 'offHover',
    value: function offHover() {
      this.setState({ hover: false });
    }
  }, {
    key: 'render',
    value: function render() {
      switch (this.props.type) {
        case 'calendar':
          if (this.props.active) {
            return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement('div', null)
            // <Calendar
            // 	minDate={new Date(Date.now())}
            // 	selectRange={true}
            // 	onChange={this.props.onChange}
            // 	value={this.props.value.length > 0 ? this.props.value : null}
            // />
            ;
          } else {
            return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
              'div',
              { className: 'field is-expanded' },
              react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                'div',
                { className: 'field has-addons' },
                react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                  'div',
                  { className: 'control' },
                  react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                    'a',
                    { className: 'button is-static' },
                    react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement('i', { className: 'fa fa-calendar' })
                  )
                ),
                react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                  'div',
                  { className: 'control' },
                  react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                    'div',
                    { onClick: this.props.onClick, className: 'input' },
                    this.props.value[0] ? this.props.value[0].getMonth() + '/' + this.props.value[0].getDate() : 'mm/dd ',
                    react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement('i', { className: 'calendar-input-icon fa fa-arrow-right' }),
                    this.props.value[1] ? this.props.value[1].getMonth() + '/' + this.props.value[1].getDate() : ' mm/dd'
                  )
                )
              )
            );
          }
        case 'file':
          return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
            'div',
            { className: 'file is-info' },
            react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
              'label',
              { className: 'file-label' },
              react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement('input', {
                name: this.props.key,
                className: 'file-input',
                type: 'file',
                onChange: this.props.onChange
              }),
              react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                'span',
                { className: 'file-cta' },
                react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                  'span',
                  { className: 'file-icon' },
                  react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement('i', { className: 'fa fa-upload' })
                ),
                react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                  'span',
                  { className: 'file-label' },
                  'Click To Upload'
                )
              ),
              react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                'span',
                { className: 'file-name' },
                this.props.value.file_name || ''
              )
            )
          );
        case 'location':
        case 'search':
          return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement('input', { type: this.props.type,
            className: 'input' + (this.props.size ? ' ' + this.props.size : '') + (this.props.inputState ? ' ' + this.props.inputState : '') + (this.state.focus ? ' is-focused' : '') + (this.state.hover ? ' is-hovered' : ''),
            value: this.props.value,
            placeholder: this.props.placeholder,
            onChange: this.props.onChange,
            onMouseOver: this.onHover,
            onMouseLeave: this.offHover,
            onBlur: this.onBlur,
            onFocus: this.onFocus
          });
        case 'text':
        case 'number':
        case 'password':
        case 'email':
        case 'date':
          return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement('input', {
            type: this.props.type,
            className: 'input' + (this.props.size ? ' ' + this.props.size : '') + (this.props.inputState ? ' ' + this.props.inputState : '') + (this.state.focus ? ' is-focused' : '') + (this.state.hover ? ' is-hovered' : ''),
            value: this.props.value,
            placeholder: this.props.placeholder,
            onChange: this.props.onChange,
            onMouseOver: this.onHover,
            onMouseLeave: this.offHover,
            onBlur: this.onBlur,
            onFocus: this.onFocus
          });
        case 'textarea':
          return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement('textarea', {
            type: this.props.type,
            className: 'textarea' + (this.props.size ? ' ' + this.props.size : '') + (this.props.inputState.length > 0 ? ' ' + this.props.inputState : '') + (this.state.focus ? ' is-focused' : '') + (this.state.hover ? ' is-hovered' : ''),
            value: this.props.value,
            placeholder: this.props.placeholder,
            onChange: this.props.onChange,
            onMouseOver: this.onHover,
            onMouseLeave: this.offHover,
            onBlur: this.onBlur,
            onFocus: this.onFocus
          });
        case 'select':
          return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
            'div',
            {
              className: 'select' + (this.props.size ? ' ' + this.props.size : '') + (this.props.inputState.length > 0 ? ' ' + this.props.inputState : '') + (this.state.focus ? ' is-focused' : '') + (this.state.hover ? ' is-hovered' : ''),
              onMouseOver: this.onHover,
              onMouseLeave: this.offHover,
              onBlur: this.onBlur,
              onFocus: this.onFocus
            },
            react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
              'select',
              { value: this.props.value, onChange: this.props.onChange },
              this.props.placeholder.length > 0 ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                'option',
                { value: '', disabled: true },
                this.props.placeholder
              ) : react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement('option', { value: '', disabled: true }),
              this.props.opts.map(function (key, val) {
                return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                  'option',
                  { key: val },
                  key
                );
              })
            )
          );
        case 'incrementer':
          return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
            'div',
            { className: 'button is-static' },
            this.props.value
          );
        default:
          return null;
      }
    }
  }]);

  return BulmaInput;
}(react__WEBPACK_IMPORTED_MODULE_0__["Component"]);

/* harmony default export */ __webpack_exports__["default"] = (BulmaInput);

/***/ }),

/***/ "./client/components/Loading.js":
/*!**************************************!*\
  !*** ./client/components/Loading.js ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }



var Loading = function (_Component) {
  _inherits(Loading, _Component);

  function Loading() {
    _classCallCheck(this, Loading);

    return _possibleConstructorReturn(this, (Loading.__proto__ || Object.getPrototypeOf(Loading)).apply(this, arguments));
  }

  _createClass(Loading, [{
    key: "render",
    value: function render() {
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
        "section",
        { id: "loader", className: "hero is-fullheight" },
        react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
          "h2",
          { className: "title is-2" },
          "This will just take a moment..."
        ),
        react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("img", { src: __webpack_require__(/*! ../assets/loader.gif */ "./client/assets/loader.gif"), alt: "Loading..." }),
        react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
          "h2",
          { className: "subtitle is-2" },
          "Loading. . ."
        )
      );
    }
  }]);

  return Loading;
}(react__WEBPACK_IMPORTED_MODULE_0__["Component"]);

/* harmony default export */ __webpack_exports__["default"] = (Loading);

/***/ }),

/***/ "./client/components/Modal.js":
/*!************************************!*\
  !*** ./client/components/Modal.js ***!
  \************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);


var Modal = function Modal(props) {
  if (props.isActive) {
    return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
      'div',
      { className: 'modal is-active' },
      react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement('div', { className: 'modal-background' }),
      react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
        'div',
        { className: 'modal-card' },
        react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
          'header',
          { className: 'modal-card-head' },
          react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement('button', { onClick: props.onClose, className: 'modal-close is-large', 'aria-label': 'close' })
        ),
        react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
          'section',
          { className: 'modal-card-body' },
          props.content
        ),
        react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
          'div',
          { className: 'modal-card-foot' },
          react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
            'div',
            { className: 'buttons' },
            react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
              'button',
              { onClick: props.onClickConfirm, className: 'button is-danger ' + (props.isLoading ? 'is-loading' : '') },
              props.confirmText
            ),
            react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
              'button',
              { onClick: props.onClose, className: 'button' },
              'Cancel'
            )
          )
        )
      )
    );
  } else {
    return null;
  }
};

/* harmony default export */ __webpack_exports__["default"] = (Modal);

/***/ }),

/***/ "./client/components/Room.js":
/*!***********************************!*\
  !*** ./client/components/Room.js ***!
  \***********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-router-dom */ "react-router-dom");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_router_dom__WEBPACK_IMPORTED_MODULE_1__);



var Room = function Room(props) {
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
    'div',
    { className: 'card room ' + (props.preview ? 'preview' : '') },
    props.preview ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
      'div',
      { className: 'card-image' },
      react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
        'figure',
        { className: 'image is-4by3' },
        react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement('img', { src: props.featuredImage ? 'http://localhost:3001/api/uploads/' + props.featuredImage : 'https://bulma.io/images/placeholders/640x480.png', alt: 'Placeholder' })
      )
    ) : react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
      react_router_dom__WEBPACK_IMPORTED_MODULE_1__["Link"],
      { to: '/room/' + props.roomId, className: 'card-image' },
      react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
        'figure',
        { className: 'image is-4by3' },
        react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement('img', { src: props.featuredImage ? 'http://localhost:3001/api/uploads/' + props.featuredImage : 'https://bulma.io/images/placeholders/640x480.png', alt: 'Placeholder' })
      )
    ),
    react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
      'div',
      { className: 'card-content' },
      react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
        'div',
        { className: 'details-header' },
        react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
          'span',
          { style: { flexDirection: 'column' } },
          react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
            'h5',
            { className: 'title is-5' },
            props.title ? props.title : 'An Example Title!'
          ),
          react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
            'h6',
            { className: 'subtitle room-type is-6' },
            props.roomType ? props.roomType : 'Entire Place',
            ' | ',
            props.propertyType ? props.propertyType : 'Bungalow'
          )
        ),
        react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
          'span',
          { className: 'price' },
          '$' + (props.price ? props.price : '0') + '/ Day'
        )
      ),
      react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
        'div',
        { className: 'details-body' },
        react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
          'div',
          { className: 'location' },
          react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
            'span',
            null,
            props.location[0] ? props.location[0] + ', ' + props.location[1] : 'Toronto, Canada'
          )
        ),
        react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
          'div',
          { className: 'guests' },
          react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
            'span',
            { id: 'adult', className: 'guest' },
            react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement('i', { className: 'fa fa-male' }),
            react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
              'span',
              null,
              props.guests.adults
            )
          ),
          react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
            'span',
            { id: 'child', className: 'guest' },
            react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement('i', { className: 'fa fa-child' }),
            react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
              'span',
              null,
              props.guests.children
            )
          )
        ),
        props.currentUser ? props.currentUser.id !== props.ownerId ? props.booked ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
          'button',
          { className: 'button is-warning', disabled: 'disabled' },
          'Booked!'
        ) : react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
          react_router_dom__WEBPACK_IMPORTED_MODULE_1__["Link"],
          { to: '/room/' + props.roomId, className: 'button is-info' },
          'Customize'
        ) : react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
          'button',
          { className: 'button is-text', disabled: 'disabled' },
          'You own this!'
        ) : props.preview ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
          'button',
          { className: 'button is-primary', disabled: 'disabled' },
          'Instant Book'
        ) : react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
          'div',
          null,
          react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
            'a',
            { title: 'Signup Required!', className: 'button is-primary', disabled: 'disabled' },
            'Instant Book'
          ),
          react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
            'p',
            { className: 'help is-danger' },
            '*Signup Required!'
          )
        )
      )
    )
  );
};

/* harmony default export */ __webpack_exports__["default"] = (Room);

/***/ }),

/***/ "./client/constants.js":
/*!*****************************!*\
  !*** ./client/constants.js ***!
  \*****************************/
/*! exports provided: VERSION, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "VERSION", function() { return VERSION; });
/* harmony import */ var envalid__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! envalid */ "envalid");
/* harmony import */ var envalid__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(envalid__WEBPACK_IMPORTED_MODULE_0__);
/* This is used to pass down env vars from the server into react. */


var env = Object(envalid__WEBPACK_IMPORTED_MODULE_0__["cleanEnv"])(Object({"BUILD_TARGET":"server","NODE_ENV":"development"}), {
  VERSION: Object(envalid__WEBPACK_IMPORTED_MODULE_0__["str"])({ default: '5.0.0' })
});

var VERSION = env.VERSION;



/* harmony default export */ __webpack_exports__["default"] = (env);

/***/ }),

/***/ "./client/containers/App.js":
/*!**********************************!*\
  !*** ./client/containers/App.js ***!
  \**********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-redux */ "react-redux");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_redux__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-router-dom */ "react-router-dom");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_router_dom__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react_router_transition__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-router-transition */ "react-router-transition");
/* harmony import */ var react_router_transition__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_router_transition__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _Header__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Header */ "./client/containers/Header.js");
/* harmony import */ var _components_GlobalErrors__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../components/GlobalErrors */ "./client/components/GlobalErrors.js");
/* harmony import */ var _pages_Home__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./pages/Home */ "./client/containers/pages/Home.js");
/* harmony import */ var _pages_Login__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./pages/Login */ "./client/containers/pages/Login.js");
/* harmony import */ var _pages_Signup__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./pages/Signup */ "./client/containers/pages/Signup.js");
/* harmony import */ var _pages_Rooms__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./pages/Rooms */ "./client/containers/pages/Rooms.js");
/* harmony import */ var _pages_Room__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./pages/Room */ "./client/containers/pages/Room.js");
/* harmony import */ var _pages_YourRooms__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./pages/YourRooms */ "./client/containers/pages/YourRooms.js");
/* harmony import */ var _pages_RoomEditor__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./pages/RoomEditor */ "./client/containers/pages/RoomEditor.js");
/* harmony import */ var _pages_Bookings__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./pages/Bookings */ "./client/containers/pages/Bookings.js");
/* harmony import */ var _pages_Settings__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./pages/Settings */ "./client/containers/pages/Settings.js");
/* harmony import */ var _components_404__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../components/404 */ "./client/components/404.js");
/* harmony import */ var _components_Loading__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../components/Loading */ "./client/components/Loading.js");
/* harmony import */ var _styles_styles_scss__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ../styles/styles.scss */ "./client/styles/styles.scss");
/* harmony import */ var _styles_styles_scss__WEBPACK_IMPORTED_MODULE_17___default = /*#__PURE__*/__webpack_require__.n(_styles_styles_scss__WEBPACK_IMPORTED_MODULE_17__);
/* harmony import */ var _actions__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ../actions */ "./client/actions.js");
/* harmony import */ var _agent__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ../agent */ "./client/agent.js");
/* harmony import */ var react_router_redux__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! react-router-redux */ "react-router-redux");
/* harmony import */ var react_router_redux__WEBPACK_IMPORTED_MODULE_20___default = /*#__PURE__*/__webpack_require__.n(react_router_redux__WEBPACK_IMPORTED_MODULE_20__);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// React





// Components



// Routes












// styles
// import '../styles/Bulma.scss';


// Actions


// HTTP Request agent


// Location and State history
// import { store } from '../store';


// Assign Global State to Props
var mapStateToProps = function mapStateToProps(state) {
  return {
    appLoaded: state.common.appLoaded,
    appName: state.common.appName,
    currentUser: state.common.currentUser,
    redirectTo: state.common.redirectTo,
    errors: state.common.errors
  };
};

// Assign Redux Actions to Props
var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return {
    closeError: function closeError(index) {
      return dispatch({ type: _actions__WEBPACK_IMPORTED_MODULE_18__["APP"].CLOSE_ERROR, index: index });
    },
    onRedirect: function onRedirect() {
      return dispatch({ type: _actions__WEBPACK_IMPORTED_MODULE_18__["APP"].REDIRECT });
    },
    onLoad: function onLoad(payload, token) {
      dispatch({ type: _actions__WEBPACK_IMPORTED_MODULE_18__["APP"].LOAD, payload: payload, token: token, skipTracking: true });
    }
  };
};

/*
* 	Application Wrapper component.
* 	This is the first component to render a view for bednblockchain.
*/

var App = function (_React$Component) {
  _inherits(App, _React$Component);

  function App() {
    _classCallCheck(this, App);

    return _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).apply(this, arguments));
  }

  _createClass(App, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.redirectTo) {
        // store.dispatch(push(nextProps.redirectTo));
        this.props.onRedirect();
      }
    }
  }, {
    key: 'componentWillMount',
    value: function componentWillMount() {
      // Grab a user token if it exists
      var token = window.localStorage.getItem('jwt');

      // If there was a token
      if (token) {
        // Tell our request agent to use it for all requests.
        _agent__WEBPACK_IMPORTED_MODULE_19__["default"].setToken(token);
      }
      // Fetch the user from the server and load the app.
      this.props.onLoad(token ? _agent__WEBPACK_IMPORTED_MODULE_19__["default"].Auth.current() : null, token);
    }
  }, {
    key: 'render',
    value: function render() {
      // wrap the `spring` helper to use a bouncy config
      var bounce = function bounce(val) {
        return Object(react_router_transition__WEBPACK_IMPORTED_MODULE_3__["spring"])(val, {
          stiffness: 330,
          damping: 22
        });
      };

      var bounceTransition = {
        // start in a transparent, upscaled state
        atEnter: {
          opacity: 0,
          scale: 1
        },
        // leave in a transparent, downscaled state
        atLeave: {
          opacity: bounce(0),
          scale: bounce(0.9)
        },
        // and rest at an opaque, normally-scaled state
        atActive: {
          opacity: bounce(1),
          scale: bounce(1)
        }
      };

      var mapStyles = function mapStyles(styles) {
        return {
          opacity: styles.opacity,
          transform: 'scale(' + styles.scale + ')'
        };
      };

      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
        'div',
        { className: 'app' },
        react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_Header__WEBPACK_IMPORTED_MODULE_4__["default"], {
          appName: this.props.appName,
          currentUser: this.props.currentUser,
          appLoaded: this.props.appLoaded
        }),
        this.props.errors ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_GlobalErrors__WEBPACK_IMPORTED_MODULE_5__["default"], { errors: this.props.errors, handleClose: this.props.closeError }) : null,
        this.props.currentUser ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
          react_router_transition__WEBPACK_IMPORTED_MODULE_3__["AnimatedSwitch"],
          {
            atEnter: bounceTransition.atEnter,
            atLeave: bounceTransition.atLeave,
            atActive: bounceTransition.atActive,
            mapStyles: mapStyles,
            className: 'route-wrapper'
          },
          this.props.appLoaded ? null : react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_2__["Route"], { component: _components_Loading__WEBPACK_IMPORTED_MODULE_16__["default"] }),
          react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_2__["Route"], { exact: true, path: '/', component: _pages_Home__WEBPACK_IMPORTED_MODULE_6__["default"] }),
          react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_2__["Route"], { exact: true, path: '/signup', component: _pages_Signup__WEBPACK_IMPORTED_MODULE_8__["default"] }),
          react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_2__["Route"], { exact: true, path: '/login', component: _pages_Login__WEBPACK_IMPORTED_MODULE_7__["default"] }),
          react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_2__["Route"], { exact: true, path: '/rooms', component: _pages_Rooms__WEBPACK_IMPORTED_MODULE_9__["default"] }),
          react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_2__["Route"], { exact: true, path: '/room/:roomId', component: _pages_Room__WEBPACK_IMPORTED_MODULE_10__["default"] }),
          react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_2__["Route"], { exact: true, path: '/bookings', component: _pages_Bookings__WEBPACK_IMPORTED_MODULE_13__["default"] }),
          react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_2__["Route"], { exact: true, path: '/settings', component: _pages_Settings__WEBPACK_IMPORTED_MODULE_14__["default"] }),
          react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_2__["Route"], { exact: true, path: '/your-rooms', component: _pages_YourRooms__WEBPACK_IMPORTED_MODULE_11__["default"] }),
          react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_2__["Route"], { exact: true, path: '/your-rooms/add', component: _pages_RoomEditor__WEBPACK_IMPORTED_MODULE_12__["default"] }),
          react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_2__["Route"], { exact: true, path: '/your-rooms/edit/:roomId', component: _pages_RoomEditor__WEBPACK_IMPORTED_MODULE_12__["default"] }),
          react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_2__["Route"], { component: _components_404__WEBPACK_IMPORTED_MODULE_15__["default"] })
        ) : react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
          react_router_transition__WEBPACK_IMPORTED_MODULE_3__["AnimatedSwitch"],
          {
            atEnter: bounceTransition.atEnter,
            atLeave: bounceTransition.atLeave,
            atActive: bounceTransition.atActive,
            mapStyles: mapStyles,
            className: 'route-wrapper'
          },
          this.props.appLoaded ? null : react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_2__["Route"], { component: _components_Loading__WEBPACK_IMPORTED_MODULE_16__["default"] }),
          react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_2__["Route"], { exact: true, path: '/', component: _pages_Home__WEBPACK_IMPORTED_MODULE_6__["default"] }),
          react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_2__["Route"], { exact: true, path: '/signup', component: _pages_Signup__WEBPACK_IMPORTED_MODULE_8__["default"] }),
          react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_2__["Route"], { exact: true, path: '/login', component: _pages_Login__WEBPACK_IMPORTED_MODULE_7__["default"] }),
          react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_2__["Route"], { exact: true, path: '/rooms', component: _pages_Rooms__WEBPACK_IMPORTED_MODULE_9__["default"] }),
          react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_2__["Route"], { exact: true, path: '/room/:roomId', component: _pages_Room__WEBPACK_IMPORTED_MODULE_10__["default"] }),
          react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_2__["Route"], { component: _components_404__WEBPACK_IMPORTED_MODULE_15__["default"] })
        ),
        react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
          'footer',
          { className: 'footer' },
          react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
            'div',
            { className: 'container has-text-centered' },
            react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
              'nav',
              { className: 'level' },
              react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                'div',
                { className: 'level-item has-text-centered' },
                react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                  'h4',
                  { className: 'subtitle is-4' },
                  'Created By'
                ),
                react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement('br', null),
                react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                  'p',
                  null,
                  'Tristan Navarrete'
                ),
                react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                  'a',
                  { href: 'https://tristannavarrete.com/' },
                  'https://tristannavarrete.com/'
                ),
                react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                  'a',
                  { href: 'https://github.com/Wisedemic/' },
                  react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement('i', { className: 'fa fa-github' })
                )
              ),
              react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                'div',
                { className: 'level-item has-text-centered' },
                react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                  'h4',
                  { className: 'subtitle is-4' },
                  'Made With'
                ),
                react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement('br', null),
                react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                  'p',
                  { className: 'content' },
                  'React, Redux, Express.js, Webpack'
                )
              )
            )
          )
        )
      );
    }
  }]);

  return App;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component);

/* harmony default export */ __webpack_exports__["default"] = (Object(react_redux__WEBPACK_IMPORTED_MODULE_1__["connect"])(mapStateToProps, mapDispatchToProps)(App));

/***/ }),

/***/ "./client/containers/Header.js":
/*!*************************************!*\
  !*** ./client/containers/Header.js ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-redux */ "react-redux");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_redux__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-router-dom */ "react-router-dom");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_router_dom__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _actions__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../actions */ "./client/actions.js");
/* harmony import */ var _components_Field__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../components/Field */ "./client/components/Field.js");
/* harmony import */ var _assets_defaultUserAvatar_png__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../assets/defaultUserAvatar.png */ "./client/assets/defaultUserAvatar.png");
/* harmony import */ var _assets_defaultUserAvatar_png__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_assets_defaultUserAvatar_png__WEBPACK_IMPORTED_MODULE_5__);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// React + Redux




// Actions




// Assets


var mapStateToProps = function mapStateToProps(state) {
  return {
    results: state.common.search.results,
    searchValue: state.common.search.value
  };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return {
    handleLogout: function handleLogout() {
      return dispatch({ type: _actions__WEBPACK_IMPORTED_MODULE_3__["AUTH"].LOGOUT });
    }
  };
};

var Avatar = function Avatar(props) {
  if (props.avatar) {
    return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement('img', { src: props.avatar, alt: 'User Avatar' });
  } else {
    return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement('img', { src: _assets_defaultUserAvatar_png__WEBPACK_IMPORTED_MODULE_5___default.a, alt: 'User Avatar' });
  }
};

var SearchBar = function SearchBar(props) {
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
    'div',
    { className: 'navbar-item', id: 'search' },
    react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_Field__WEBPACK_IMPORTED_MODULE_4__["default"], {
      key: 'search',
      type: 'search',
      size: 'is-medium',
      value: props.value,
      placeholder: 'Location, city, address',
      hasIconLeft: 'search',
      onChange: props.onSearch,
      onClick: props.onClickResult,
      results: props.results,
      isLoading: props.loading
    })
  );
};

var NavButtons = function NavButtons(props) {
  if (props.appLoaded && props.currentUser) {
    return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
      'div',
      { className: 'navbar-end' },
      react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
        'div',
        { className: 'navbar-item' },
        react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
          'div',
          { className: 'field' },
          react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
            'p',
            { className: 'control' },
            react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
              react_router_dom__WEBPACK_IMPORTED_MODULE_2__["Link"],
              { className: 'button is-outlined is-info', to: '/rooms/' },
              react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                'span',
                { className: 'icon' },
                react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement('i', { className: 'fa fa-bed' })
              ),
              react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                'span',
                null,
                'Book Now!'
              )
            )
          )
        )
      ),
      react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
        'div',
        { className: 'navbar-item has-dropdown is-hoverable' },
        react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
          'p',
          { className: 'navbar-link' },
          react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Avatar, { avatar: props.currentUser.avatar })
        ),
        react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
          'div',
          { className: 'navbar-dropdown is-right is-boxed' },
          react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
            react_router_dom__WEBPACK_IMPORTED_MODULE_2__["Link"],
            { className: 'navbar-item', to: '/your-rooms/add' },
            'Add Room'
          ),
          react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
            react_router_dom__WEBPACK_IMPORTED_MODULE_2__["Link"],
            { className: 'navbar-item', to: '/your-rooms' },
            'Your Rooms'
          ),
          react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
            react_router_dom__WEBPACK_IMPORTED_MODULE_2__["Link"],
            { className: 'navbar-item', to: '/bookings' },
            'Your Bookings'
          ),
          react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
            react_router_dom__WEBPACK_IMPORTED_MODULE_2__["Link"],
            { className: 'navbar-item', to: '/settings' },
            'Settings'
          ),
          react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement('div', { className: 'navbar-divider' }),
          react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
            'a',
            { className: 'navbar-item', onClick: props.handleLogout },
            'Logout'
          )
        )
      )
    );
  } else {
    return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
      'div',
      { className: 'navbar-end' },
      react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
        'div',
        { className: 'navbar-item' },
        react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
          'div',
          { className: 'field is-grouped' },
          react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
            'p',
            { className: 'control' },
            react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
              react_router_dom__WEBPACK_IMPORTED_MODULE_2__["Link"],
              { className: 'button', to: '/signup' },
              'Sign Up'
            )
          ),
          react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
            'p',
            { className: 'control' },
            react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
              react_router_dom__WEBPACK_IMPORTED_MODULE_2__["Link"],
              { className: 'button is-primary', to: '/login' },
              'Log In'
            )
          )
        )
      )
    );
  }
};

var Header = function (_Component) {
  _inherits(Header, _Component);

  function Header(props) {
    _classCallCheck(this, Header);

    var _this = _possibleConstructorReturn(this, (Header.__proto__ || Object.getPrototypeOf(Header)).call(this, props));

    _this.state = {
      toggled: false
    };
    _this.onClickMenu = _this.onClickMenu.bind(_this);
    return _this;
  }

  _createClass(Header, [{
    key: 'onClickMenu',
    value: function onClickMenu() {
      this.setState(function (prevState) {
        return { toggled: !prevState.toggled };
      });
    }
  }, {
    key: 'render',
    value: function render() {
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
        'nav',
        { className: 'navbar is-fixed-top' },
        react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
          'div',
          { className: 'navbar-brand' },
          react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
            react_router_dom__WEBPACK_IMPORTED_MODULE_2__["Link"],
            { to: '/', className: 'navbar-item' },
            this.props.appName
          ),
          react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
            'div',
            {
              className: 'navbar-burger burger' + (this.state.toggled ? ' is-active' : ''),
              'data-target': 'navbarMenu',
              onClick: this.onClickMenu
            },
            react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement('span', null),
            react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement('span', null),
            react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement('span', null)
          )
        ),
        react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
          'div',
          { id: 'navbarMenu', className: 'navbar-menu' + (this.state.toggled ? ' is-active' : '') },
          react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
            'div',
            { className: 'navbar-start' },
            react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
              'div',
              { className: 'navbar-item has-dropdown is-hoverable' },
              react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                react_router_dom__WEBPACK_IMPORTED_MODULE_2__["Link"],
                { className: 'navbar-item', to: '/rooms' },
                'Browse'
              )
            ),
            react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(SearchBar, null)
          ),
          react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(NavButtons, {
            appLoaded: this.props.appLoaded,
            handleLogout: this.props.handleLogout,
            currentUser: this.props.currentUser
          })
        )
      );
    }
  }]);

  return Header;
}(react__WEBPACK_IMPORTED_MODULE_0__["Component"]);

/* harmony default export */ __webpack_exports__["default"] = (Object(react_redux__WEBPACK_IMPORTED_MODULE_1__["connect"])(mapStateToProps, mapDispatchToProps)(Header));

/***/ }),

/***/ "./client/containers/pages/Bookings.js":
/*!*********************************************!*\
  !*** ./client/containers/pages/Bookings.js ***!
  \*********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-redux */ "react-redux");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_redux__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-router-dom */ "react-router-dom");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_router_dom__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _components_Modal__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../components/Modal */ "./client/components/Modal.js");
/* harmony import */ var _agent__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../agent */ "./client/agent.js");
/* harmony import */ var _actions__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../actions */ "./client/actions.js");
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }











var mapStateToProps = function mapStateToProps(state) {
  return {
    yourBookings: state.bookings.yourBookings,
    userId: state.common.currentUser ? state.common.currentUser.id : null,
    loading: state.bookings.loading,
    reload: state.bookings.reload
  };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return {
    onLoad: function onLoad(userId) {
      var payload = _agent__WEBPACK_IMPORTED_MODULE_4__["default"].Bookings.bookingsByBuyerId(userId);
      dispatch({ type: _actions__WEBPACK_IMPORTED_MODULE_5__["LOAD_PAGE"].BOOKINGS, payload: payload });
    },
    onUnload: function onUnload() {
      return dispatch({ type: _actions__WEBPACK_IMPORTED_MODULE_5__["UNLOAD_PAGE"].BOOKINGS });
    },
    closeError: function closeError() {
      return dispatch({ type: _actions__WEBPACK_IMPORTED_MODULE_5__["BOOKINGS"].CLOSE_ERROR });
    },
    deleteBooking: function deleteBooking(bookingId) {
      var payload = _agent__WEBPACK_IMPORTED_MODULE_4__["default"].Bookings.deleteBooking(bookingId);
      dispatch({ type: _actions__WEBPACK_IMPORTED_MODULE_5__["BOOKINGS"].DELETE, payload: payload });
    }
  };
};

var Bookings = function (_Component) {
  _inherits(Bookings, _Component);

  function Bookings() {
    _classCallCheck(this, Bookings);

    var _this = _possibleConstructorReturn(this, (Bookings.__proto__ || Object.getPrototypeOf(Bookings)).call(this));

    _this.state = {
      isModalActive: false,
      bookingId: ''
    };

    _this.closeModal = function () {
      _this.setState({ isModalActive: false, bookingId: '' });
    };

    _this.activateModal = function (bookingId) {
      _this.setState({ isModalActive: true, bookingId: bookingId });
    };

    _this.editBooking = function (id) {
      return _this.props.editBooking(id);
    };
    _this.deleteBooking = function (id) {
      return _this.props.deleteBooking(id);
    };
    return _this;
  }

  _createClass(Bookings, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.reload === true) {
        this.props.onLoad(this.props.userId);
        this.setState({ isModalActive: false });
      }
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      console.log(this.props);
      this.props.onLoad(this.props.userId);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.props.onUnload();
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
        'section',
        { id: 'bookings', className: 'hero is-light is-bold is-fullheight' },
        react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_Modal__WEBPACK_IMPORTED_MODULE_3__["default"], {
          isActive: this.state.isModalActive,
          isLoading: this.props.loading,
          content: 'Are you sure you would like to cancel this booking?',
          confirmText: 'Confirm',
          onClose: this.closeModal,
          onClickConfirm: function onClickConfirm() {
            return _this2.props.deleteBooking(_this2.state.bookingId);
          }
        }),
        react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
          'div',
          { className: 'hero-body' },
          react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
            'div',
            { className: 'container has-text-centered' },
            react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
              'h2',
              { className: 'title is-2' },
              'Your Bookings'
            ),
            react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
              'div',
              { className: 'bookings' },
              this.props.yourBookings.length > 0 ? this.props.yourBookings.map(function (booking, index) {
                return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                  'div',
                  { className: 'box', key: index },
                  react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                    'figure',
                    { className: 'image' },
                    react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement('img', { src: 'http://localhost:3001/api/uploads/' + booking.room.featuredImageId, alt: 'Placeholder' })
                  ),
                  react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                    'div',
                    { className: 'details' },
                    react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                      'h3',
                      { id: 'title', className: 'title is-5' },
                      booking.room.title
                    ),
                    react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                      'h4',
                      { id: 'roomType', className: 'subtitle booking-type is-6' },
                      booking.room.roomType,
                      ' | ',
                      booking.room.propertyType
                    ),
                    react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                      'h4',
                      { id: 'price', className: 'title is-5' },
                      '$',
                      booking.price,
                      ' ',
                      react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                        'span',
                        { className: 'units', style: { fontSize: '20px' } },
                        '/ Day'
                      )
                    )
                  ),
                  react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                    'p',
                    { className: 'buttons' },
                    react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                      react_router_dom__WEBPACK_IMPORTED_MODULE_2__["Link"],
                      { to: '/room/' + booking.room._id, className: 'button is-info' },
                      react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                        'span',
                        null,
                        'View Room Details'
                      )
                    ),
                    react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                      react_router_dom__WEBPACK_IMPORTED_MODULE_2__["Link"],
                      { to: '/bookings/edit/' + booking.id, className: 'button is-info' },
                      react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                        'span',
                        null,
                        'Edit Booking'
                      )
                    ),
                    react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                      'button',
                      { onClick: function onClick() {
                          return _this2.activateModal(booking.id);
                        }, className: 'button is-danger is-outlined' },
                      react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                        'span',
                        { className: 'icon' },
                        react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement('i', { className: 'fa fa-exclamation-triangle' })
                      ),
                      react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                        'span',
                        null,
                        'Cancel'
                      )
                    )
                  )
                );
              }, this) : react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                'div',
                { className: 'box has-text-centered', style: { flexDirection: 'column' } },
                react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                  'p',
                  { className: 'content' },
                  'You haven\'t booked a room yet!'
                ),
                react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                  react_router_dom__WEBPACK_IMPORTED_MODULE_2__["Link"],
                  { to: '/rooms', className: 'button is-info' },
                  'Book a room!'
                )
              )
            )
          )
        )
      );
    }
  }]);

  return Bookings;
}(react__WEBPACK_IMPORTED_MODULE_0__["Component"]);

/* harmony default export */ __webpack_exports__["default"] = (Object(react_redux__WEBPACK_IMPORTED_MODULE_1__["connect"])(mapStateToProps, mapDispatchToProps)(Bookings));

/***/ }),

/***/ "./client/containers/pages/Home.js":
/*!*****************************************!*\
  !*** ./client/containers/pages/Home.js ***!
  \*****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-redux */ "react-redux");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_redux__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-router-dom */ "react-router-dom");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_router_dom__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _components_Room__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../components/Room */ "./client/components/Room.js");
/* harmony import */ var _agent__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../agent */ "./client/agent.js");
/* harmony import */ var _actions__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../actions */ "./client/actions.js");
/* harmony import */ var _assets_banner_jpg__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../assets/banner.jpg */ "./client/assets/banner.jpg");
/* harmony import */ var _assets_banner_jpg__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_assets_banner_jpg__WEBPACK_IMPORTED_MODULE_6__);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }













var mapStateToProps = function mapStateToProps(state) {
  return {
    currentUser: state.common.currentUser,
    appName: state.common.appName,
    token: state.common.token,
    roomsList: state.rooms.roomsList,
    reload: state.rooms.reload
  };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return {
    onLoad: function onLoad() {
      var payload = _agent__WEBPACK_IMPORTED_MODULE_4__["default"].Rooms.all();
      dispatch({ type: _actions__WEBPACK_IMPORTED_MODULE_5__["LOAD_PAGE"].HOME, payload: payload });
    },
    onUnload: function onUnload() {
      return dispatch({ type: _actions__WEBPACK_IMPORTED_MODULE_5__["UNLOAD_PAGE"].HOME });
    },
    bookRoom: function bookRoom(buyerId, ownerId, roomId, price, guests) {
      console.log('Booking room', buyerId, ownerId, roomId, price, guests);
      var payload = _agent__WEBPACK_IMPORTED_MODULE_4__["default"].Bookings.bookRoom(buyerId, ownerId, roomId, price, guests);
      dispatch({ type: _actions__WEBPACK_IMPORTED_MODULE_5__["ROOMS"].BOOK, payload: payload });
    }
  };
};

var Home = function (_Component) {
  _inherits(Home, _Component);

  function Home() {
    _classCallCheck(this, Home);

    var _this = _possibleConstructorReturn(this, (Home.__proto__ || Object.getPrototypeOf(Home)).call(this));

    _this.bookRoom = function (ownerId, roomId, price, guests) {
      return _this.props.bookRoom(_this.props.currentUser.id, ownerId, roomId, price, guests);
    };
    return _this;
  }

  _createClass(Home, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.props.onLoad();
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.props.onUnload();
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.reload === true) {
        this.props.onLoad();
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
        'div',
        null,
        react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
          'section',
          { id: 'home', className: 'hero is-light is-fullheight' },
          react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement('div', { className: 'banner', style: { backgroundImage: 'url(' + _assets_banner_jpg__WEBPACK_IMPORTED_MODULE_6___default.a + ')' } }),
          react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
            'div',
            { className: 'hero-body' },
            react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
              'div',
              { className: 'container has-text-centered' },
              react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                'h1',
                { className: 'title is-1' },
                'Find a Room, or List One'
              ),
              react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                'h4',
                { className: 'subtitle is-4' },
                this.props.appName,
                ' does it all!'
              ),
              react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                'div',
                { className: 'columns is-mobile is-centered' },
                react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                  'div',
                  { className: 'column is-narrow' },
                  react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                    'div',
                    { className: 'field has-addons' },
                    react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                      'p',
                      { className: 'control' },
                      react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                        react_router_dom__WEBPACK_IMPORTED_MODULE_2__["Link"],
                        { className: 'button is-info is-outlined is-medium', to: this.props.token ? '/rooms' : '/login' },
                        react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                          'span',
                          null,
                          'Book Now'
                        )
                      )
                    ),
                    react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                      'p',
                      { className: 'control' },
                      react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                        react_router_dom__WEBPACK_IMPORTED_MODULE_2__["Link"],
                        { className: 'button is-danger is-outlined is-medium', to: this.props.token ? '/your-rooms/add' : '/login' },
                        react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                          'span',
                          null,
                          'List A Property'
                        )
                      )
                    )
                  )
                )
              )
            )
          )
        ),
        react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
          'section',
          { id: 'featured', className: 'hero is-fullheight' },
          react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
            'div',
            { className: 'hero-body' },
            react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
              'div',
              { className: 'container has-text-centered' },
              react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                'h2',
                { className: 'title is-2' },
                'Featured Rooms'
              ),
              react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                'div',
                { id: 'rooms' },
                this.props.roomsList.length > 0 ? this.props.roomsList.map(function (room, index) {
                  var locationObj = room.location.formatted_address.split(', ');
                  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_Room__WEBPACK_IMPORTED_MODULE_3__["default"], {
                    key: index,
                    onClick: _this2.bookRoom,
                    roomId: room.id,
                    ownerId: room.ownerId,
                    title: room.title,
                    featuredImage: room.featuredImageId,
                    roomType: room.roomType,
                    propertyType: room.propertyType,
                    price: room.price,
                    guests: room.guests,
                    location: locationObj,
                    booked: room.booked,
                    currentUser: _this2.props.currentUser
                  });
                }, this) : react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                  'div',
                  { className: 'box' },
                  react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                    'code',
                    null,
                    'No Rooms Found'
                  )
                )
              )
            )
          )
        )
      );
    }
  }]);

  return Home;
}(react__WEBPACK_IMPORTED_MODULE_0__["Component"]);

/* harmony default export */ __webpack_exports__["default"] = (Object(react_redux__WEBPACK_IMPORTED_MODULE_1__["connect"])(mapStateToProps, mapDispatchToProps)(Home));

/***/ }),

/***/ "./client/containers/pages/Login.js":
/*!******************************************!*\
  !*** ./client/containers/pages/Login.js ***!
  \******************************************/
/*! exports provided: Login, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Login", function() { return Login; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-router-dom */ "react-router-dom");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_router_dom__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _agent__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../agent */ "./client/agent.js");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-redux */ "react-redux");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_redux__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _components_ErrorList__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../components/ErrorList */ "./client/components/ErrorList.js");
/* harmony import */ var _components_Field__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../components/Field */ "./client/components/Field.js");
/* harmony import */ var _actions__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../actions */ "./client/actions.js");
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }











// Mapping Global Redux State to React Props
var mapStateToProps = function mapStateToProps(state) {
	return Object.assign({}, state.auth, {
		email: state.auth.email,
		password: state.auth.password,
		errors: state.auth.errors
	});
};

// Action Creators
var mapDispatchToProps = function mapDispatchToProps(dispatch) {
	return {
		closeError: function closeError(index) {
			return dispatch({ type: _actions__WEBPACK_IMPORTED_MODULE_6__["AUTH"].CLOSE_ERROR, index: index });
		},
		onLoad: function onLoad() {
			return dispatch({ type: _actions__WEBPACK_IMPORTED_MODULE_6__["LOAD_PAGE"].LOGIN });
		},
		unLoad: function unLoad() {
			return dispatch({ type: _actions__WEBPACK_IMPORTED_MODULE_6__["UNLOAD_PAGE"].LOGIN });
		},
		onChangeEmail: function onChangeEmail(value) {
			var key = 'email';
			if (value.length === 0) {
				dispatch(_actions__WEBPACK_IMPORTED_MODULE_6__["AUTH"].FieldError(key, 'Email cannot be blank!', 'is-danger', value));
			} else if (!/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(String(value).toLowerCase())) {
				dispatch(_actions__WEBPACK_IMPORTED_MODULE_6__["AUTH"].FieldError(key, 'Must be a proper email! Ex. elon@spacex.com', 'is-danger', value));
			} else {
				dispatch({ type: _actions__WEBPACK_IMPORTED_MODULE_6__["AUTH"].UPDATE_FIELD, key: key, value: value });
			}
		},
		onChangePassword: function onChangePassword(value) {
			var key = 'password';
			if (value.length === 0) {
				dispatch(_actions__WEBPACK_IMPORTED_MODULE_6__["AUTH"].FieldError(key, 'Password cannot be blank!', 'is-danger', value));
			} else if (value.length > 16 || value.length < 6) {
				dispatch(_actions__WEBPACK_IMPORTED_MODULE_6__["AUTH"].FieldError(key, 'Password length must be between 6-16 characters!', 'is-warning', value));
			} else {
				dispatch({ type: _actions__WEBPACK_IMPORTED_MODULE_6__["AUTH"].UPDATE_FIELD, key: key, value: value });
			}
		},
		handleSubmit: function handleSubmit(email, password) {
			var payload = _agent__WEBPACK_IMPORTED_MODULE_2__["default"].Auth.login(email, password);
			console.log('PAYLOAD', payload);
			dispatch({ type: _actions__WEBPACK_IMPORTED_MODULE_6__["AUTH"].LOGIN, payload: payload });
		}
	};
};

var Login = function (_Component) {
	_inherits(Login, _Component);

	function Login() {
		_classCallCheck(this, Login);

		// Grab the input on input Change Events
		var _this = _possibleConstructorReturn(this, (Login.__proto__ || Object.getPrototypeOf(Login)).call(this));

		_this.onChangeEmail = function (ev) {
			return _this.props.onChangeEmail(ev.target.value);
		};
		_this.onChangePassword = function (ev) {
			return _this.props.onChangePassword(ev.target.value);
		};

		// Form Submit Handling
		_this.submitForm = function (email, password, passwordConfirm) {
			return function (ev) {
				ev.preventDefault();
				_this.props.handleSubmit(email, password);
			};
		};
		return _this;
	}

	_createClass(Login, [{
		key: 'componentWillMount',
		value: function componentWillMount() {
			this.props.onLoad();
		}
	}, {
		key: 'componentWillUnmount',
		value: function componentWillUnmount() {
			this.props.unLoad();
		}
	}, {
		key: 'render',
		value: function render() {
			var email = this.props.email.value;
			var password = this.props.password.value;
			return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
				'section',
				{ id: 'signup', className: 'hero is-light is-fullheight' },
				react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
					'div',
					{ className: 'hero-body' },
					react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
						'div',
						{ className: 'columns is-centered', style: { flexGrow: 1 } },
						react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
							'div',
							{ className: 'column is-half' },
							react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_ErrorList__WEBPACK_IMPORTED_MODULE_4__["default"], {
								handleClose: this.props.closeError,
								errors: this.props.errors }),
							react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
								'h2',
								{ className: 'title is-2' },
								'Log In'
							),
							react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
								'form',
								{ onSubmit: this.submitForm(email, password) },
								react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_Field__WEBPACK_IMPORTED_MODULE_5__["default"], {
									key: 'email',
									type: 'text',
									value: this.props.email.value,
									placeholder: 'Enter your email',
									onChange: this.onChangeEmail,
									inputState: this.props.email.inputState,
									message: this.props.email.message
								}),
								react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_Field__WEBPACK_IMPORTED_MODULE_5__["default"], {
									key: 'password',
									type: 'password',
									value: this.props.password.value,
									placeholder: 'Enter your password',
									onChange: this.onChangePassword,
									inputState: this.props.password.inputState,
									message: this.props.password.message
								}),
								react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
									'div',
									{ className: 'field is-grouped' },
									react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
										'p',
										{ className: 'control' },
										react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
											'button',
											{
												className: 'button is-primary' + (this.props.inProgress ? ' is-loading' : '') + (this.props.email.valid && this.props.password.valid ? '' : ' is-outlined'),
												onClick: this.submitForm,
												disabled: this.props.email.valid && this.props.password.valid ? false : 'disabled'
											},
											'Log In'
										)
									),
									react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
										'p',
										{ className: 'or' },
										'or'
									),
									react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
										'p',
										{ className: 'control' },
										react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
											react_router_dom__WEBPACK_IMPORTED_MODULE_1__["Link"],
											{ className: 'button is-text', to: '/signup' },
											'Sign Up'
										)
									)
								)
							)
						)
					)
				)
			);
		}
	}]);

	return Login;
}(react__WEBPACK_IMPORTED_MODULE_0__["Component"]);

/* harmony default export */ __webpack_exports__["default"] = (Object(react_redux__WEBPACK_IMPORTED_MODULE_3__["connect"])(mapStateToProps, mapDispatchToProps)(Login));

/***/ }),

/***/ "./client/containers/pages/Room.js":
/*!*****************************************!*\
  !*** ./client/containers/pages/Room.js ***!
  \*****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-redux */ "react-redux");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_redux__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-router-dom */ "react-router-dom");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_router_dom__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _components_Field__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../components/Field */ "./client/components/Field.js");
/* harmony import */ var _agent__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../agent */ "./client/agent.js");
/* harmony import */ var _actions__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../actions */ "./client/actions.js");
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }











var mapStateToProps = function mapStateToProps(state) {
  return {
    currentUser: state.common.currentUser,
    currentRoom: state.rooms.currentRoomInView,
    reload: state.rooms.reload,
    loading: state.rooms.loading,
    guests: state.rooms.guests,
    dates: state.rooms.dates
  };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return {
    onLoad: function onLoad(id) {
      var payload = _agent__WEBPACK_IMPORTED_MODULE_4__["default"].Rooms.getRoom(id);
      dispatch({ type: _actions__WEBPACK_IMPORTED_MODULE_5__["LOAD_PAGE"].ROOM, payload: payload });
    },
    onUnload: function onUnload() {
      return dispatch({ type: _actions__WEBPACK_IMPORTED_MODULE_5__["UNLOAD_PAGE"].ROOM });
    },
    incrementGuests: function incrementGuests(guestType) {
      return dispatch({ type: _actions__WEBPACK_IMPORTED_MODULE_5__["ROOMS"].INCREMENT_GUESTS, guestType: guestType });
    },
    decrementGuests: function decrementGuests(guestType) {
      return dispatch({ type: _actions__WEBPACK_IMPORTED_MODULE_5__["ROOMS"].DECREMENT_GUESTS, guestType: guestType });
    },
    changeDates: function changeDates(dates) {
      dispatch({ type: _actions__WEBPACK_IMPORTED_MODULE_5__["ROOMS"].SELECT_DATES, dates: dates });
    },
    bookRoom: function bookRoom(buyerId, ownerId, roomId, price, guests) {
      console.log('Booking room', buyerId, ownerId, roomId, price, guests);
      var payload = _agent__WEBPACK_IMPORTED_MODULE_4__["default"].Bookings.bookRoom(buyerId, ownerId, roomId, price, guests);
      dispatch({ type: _actions__WEBPACK_IMPORTED_MODULE_5__["ROOMS"].BOOK, payload: payload });
    }
  };
};

var Room = function (_Component) {
  _inherits(Room, _Component);

  function Room() {
    _classCallCheck(this, Room);

    var _this = _possibleConstructorReturn(this, (Room.__proto__ || Object.getPrototypeOf(Room)).call(this));

    _this.state = {
      isCalendarActive: false,
      dates: []
    };

    _this.deactivateCalendar = function () {
      return _this.setState({ isCalendarActive: true });
    };
    _this.incrementGuests = function (type) {
      return _this.props.incrementGuests(type);
    };
    _this.decrementGusts = function (type) {
      return _this.props.decrementGuests(type);
    };
    _this.bookRoom = function (price, guests) {
      return _this.props.bookRoom(_this.props.currentUser.id, _this.props.currentRoom.ownerId._id, _this.props.currentRoom.id, price, guests);
    };
    _this.onChangeDates = function (dates) {
      _this.props.changeDates(dates);
      _this.setState({ isCalendarActive: false });
    };

    return _this;
  }

  _createClass(Room, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.props.onLoad(this.props.match.params.roomId);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.props.onUnload();
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var guests = this.props.guests.value;
      var price = 0;
      // let dates = [];
      if (this.props.currentRoom) {
        price = this.props.currentRoom.price;
      }
      if (this.props.currentRoom) {
        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
          'div',
          null,
          react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
            'section',
            { id: 'room-header', className: 'hero is-bold' },
            react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement('div', { className: 'banner room-banner', style: { backgroundImage: 'url(http://localhost:3001/api/uploads/' + this.props.currentRoom.featuredImageId + ')' } }),
            react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
              'div',
              { className: 'hero-body' },
              react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                'div',
                { className: 'container has-text-centered' },
                react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                  'h1',
                  { className: 'title is-1' },
                  this.props.currentRoom.title
                ),
                react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                  'h4',
                  { className: 'subtitle is-4' },
                  this.props.currentRoom.propertyType,
                  ' | ',
                  this.props.currentRoom.roomType
                )
              )
            )
          ),
          react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
            'section',
            { id: 'room-details', className: 'hero is-light is-fullheight' },
            react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
              'div',
              { className: 'hero-body' },
              react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                'div',
                { className: 'container is-fluid' },
                react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                  'div',
                  { className: 'columns' },
                  react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                    'div',
                    { className: 'column' },
                    react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                      'h2',
                      { id: 'price', className: 'title is-2' },
                      '$',
                      this.props.currentRoom.price,
                      ' ',
                      react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                        'span',
                        { className: 'units', style: { fontSize: '20px' } },
                        '/ Day'
                      )
                    ),
                    react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                      'p',
                      { id: 'address', className: 'content' },
                      react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                        'strong',
                        null,
                        'Address: '
                      ),
                      this.props.currentRoom.location.formatted_address
                    ),
                    react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement('hr', null),
                    react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                      'div',
                      { id: 'details' },
                      react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                        'h5',
                        { className: 'subtitle is-5' },
                        'Room Details'
                      ),
                      react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                        'p',
                        { className: 'content' },
                        this.props.currentRoom.description
                      )
                    )
                  ),
                  react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                    'div',
                    { className: 'column sidebar is-one-third' },
                    react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                      'div',
                      { className: 'card' },
                      react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                        'div',
                        { className: 'card-content' },
                        react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                          'h5',
                          { id: 'booked', className: 'title is-5' },
                          this.props.currentRoom.booked ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                            'span',
                            { style: { color: '#e84c3d' } },
                            'This room is booked!'
                          ) : 'Available for booking!'
                        ),
                        this.props.currentRoom.booked ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                          react_router_dom__WEBPACK_IMPORTED_MODULE_2__["Link"],
                          { to: '/rooms/', className: 'button is-info' },
                          'Browse Rooms'
                        ) : this.props.currentUser ? this.props.currentUser.id === this.props.currentRoom.ownerId._id ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                          'button',
                          { className: 'button is-text', disabled: 'disabled' },
                          'You own this property!'
                        ) : react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                          'form',
                          null,
                          react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                            'h6',
                            { className: 'subtitle is-6' },
                            'Customize your booking'
                          ),
                          react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_Field__WEBPACK_IMPORTED_MODULE_3__["default"], {
                            key: 'calendar',
                            label: 'Select Dates',
                            type: 'calendar',
                            value: this.props.dates.value,
                            isHorizontal: true,
                            active: this.state.isCalendarActive,
                            onChange: this.onChangeDates,
                            onClick: this.deactivateCalendar
                          }),
                          react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_Field__WEBPACK_IMPORTED_MODULE_3__["default"], {
                            key: 'adults',
                            label: 'Adults',
                            type: 'incrementer',
                            value: this.props.guests.value.adults,
                            isHorizontal: true,
                            hasAddonRight: react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                              'div',
                              null,
                              react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                                'a',
                                {
                                  className: 'button',
                                  disabled: this.props.guests.value.adults === this.props.currentRoom.guests.adults ? 'disabled' : false,
                                  onClick: this.props.guests.value.adults === this.props.currentRoom.guests.adults ? null : function () {
                                    return _this2.props.incrementGuests('adults');
                                  } },
                                '+'
                              ),
                              react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                                'span',
                                { className: 'incrementer-max' },
                                'Max: ',
                                this.props.currentRoom.guests.adults
                              )
                            ),
                            hasAddonLeft: react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                              'a',
                              {
                                className: 'button',
                                disabled: this.props.guests.value.adults === 0 ? 'disabled' : false,
                                onClick: this.props.guests.value.adults === 0 ? null : function () {
                                  return _this2.props.decrementGuests('adults');
                                } },
                              '-'
                            )
                          }),
                          react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_Field__WEBPACK_IMPORTED_MODULE_3__["default"], {
                            key: 'children',
                            label: 'Children',
                            type: 'incrementer',
                            value: this.props.guests.value.children,
                            isHorizontal: true,
                            hasAddonRight: react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                              'div',
                              null,
                              react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                                'a',
                                {
                                  className: 'button',
                                  disabled: this.props.guests.value.children === this.props.currentRoom.guests.children ? 'disabled' : false,
                                  onClick: this.props.guests.value.children === this.props.currentRoom.guests.children ? null : function () {
                                    return _this2.props.incrementGuests('children');
                                  } },
                                '+'
                              ),
                              react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                                'span',
                                { className: 'incrementer-max' },
                                'Max: ',
                                this.props.currentRoom.guests.children
                              )
                            ),
                            hasAddonLeft: react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                              'a',
                              {
                                className: 'button',
                                disabled: this.props.guests.value.children === 0 ? 'disabled' : false,
                                onClick: this.props.guests.value.children === 0 ? null : function () {
                                  return _this2.props.decrementGuests('children');
                                } },
                              '-'
                            )
                          }),
                          react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                            'div',
                            { className: 'field is-horizontal' },
                            react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                              'label',
                              { className: 'field-label is-normal' },
                              'Price'
                            ),
                            react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                              'div',
                              { className: 'field-body' },
                              react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement('p', { className: 'content' })
                            )
                          ),
                          react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                            'div',
                            { className: 'field' },
                            react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                              'p',
                              { className: 'control' },
                              react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                                'button',
                                {
                                  className: 'button is-success' + (this.props.loading ? ' is-loading' : '') + (this.props.guests.valid ? '' : ' is-outlined'),
                                  onClick: function onClick() {
                                    return _this2.bookRoom(price, guests);
                                  },
                                  disabled: this.props.guests.valid ? false : 'disabled'
                                },
                                'Submit'
                              )
                            ),
                            react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                              'p',
                              { className: 'help is-success' },
                              this.props.message ? this.props.message : null
                            )
                          )
                        ) : react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                          react_router_dom__WEBPACK_IMPORTED_MODULE_2__["Link"],
                          { to: '/signup/', className: 'button is-info' },
                          'Signup to Book!'
                        )
                      )
                    )
                  )
                )
              )
            )
          )
        );
      } else {
        return null;
      }
    }
  }]);

  return Room;
}(react__WEBPACK_IMPORTED_MODULE_0__["Component"]);

/* harmony default export */ __webpack_exports__["default"] = (Object(react_redux__WEBPACK_IMPORTED_MODULE_1__["connect"])(mapStateToProps, mapDispatchToProps)(Room));

/***/ }),

/***/ "./client/containers/pages/RoomEditor.js":
/*!***********************************************!*\
  !*** ./client/containers/pages/RoomEditor.js ***!
  \***********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-redux */ "react-redux");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_redux__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _components_ErrorList__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../components/ErrorList */ "./client/components/ErrorList.js");
/* harmony import */ var _components_Field__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../components/Field */ "./client/components/Field.js");
/* harmony import */ var _components_Room__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../components/Room */ "./client/components/Room.js");
/* harmony import */ var _agent__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../agent */ "./client/agent.js");
/* harmony import */ var _actions__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../actions */ "./client/actions.js");
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }












var dateTypeOptions = ['Always Available', 'Select Date Range', 'Select Unavailable Dates'];

var HomeTypes = ['Entire Place', 'Private Room', 'Shared Room'];

var PropertyTypes = ['House', 'Bed and Breakfast', 'Bungalow', 'Chalet', 'Cottage', 'Guesthouse', 'Guest suite', 'Hotel', 'Resort', 'Loft', 'Townhouse', 'Villa'];

var mapStateToProps = function mapStateToProps(state) {
  return Object.assign({}, state, {
    userId: state.common.currentUser.id,
    mode: state.roomEditor.mode,
    message: state.roomEditor.message,
    title: state.roomEditor.title,
    desc: state.roomEditor.desc,
    propertyType: state.roomEditor.propertyType,
    roomType: state.roomEditor.roomType,
    location: state.roomEditor.location,
    price: state.roomEditor.price,
    guests: state.roomEditor.guests,
    featuredImage: state.roomEditor.featuredImage
  });
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return {
    onLoad: function onLoad(url) {
      console.log(url);
      if (url.path === '/your-rooms/add') {
        dispatch({ type: _actions__WEBPACK_IMPORTED_MODULE_6__["LOAD_PAGE"].ROOMEDITOR, mode: 'add' });
      } else if (url.params.roomId) {
        var payload = _agent__WEBPACK_IMPORTED_MODULE_5__["default"].Rooms.getRoom(url.params.roomId);
        dispatch({ type: _actions__WEBPACK_IMPORTED_MODULE_6__["LOAD_PAGE"].ROOMEDITOR, mode: 'edit', payload: payload });
      } else {
        // Something wrong
        console.log(url);
      }
    },
    onUnload: function onUnload() {
      return dispatch({ type: _actions__WEBPACK_IMPORTED_MODULE_6__["UNLOAD_PAGE"].ROOMEDITOR });
    },
    closeError: function closeError(index) {
      return dispatch({ type: _actions__WEBPACK_IMPORTED_MODULE_6__["ROOMEDITOR"].CLOSE_ERROR, index: index });
    },
    handleSubmit: function handleSubmit(userId, title, desc, propertyType, roomType, location, price, guests, featuredImageId, mode, roomId) {

      if (mode === 'edit') {
        var payload = _agent__WEBPACK_IMPORTED_MODULE_5__["default"].Rooms.editRoom(roomId, title, desc, propertyType, roomType, location, price, guests, featuredImageId);
        dispatch({ type: _actions__WEBPACK_IMPORTED_MODULE_6__["ROOMS"].EDIT, payload: payload });
      } else if (mode === 'add') {
        var _payload = _agent__WEBPACK_IMPORTED_MODULE_5__["default"].Rooms.add(userId, title, desc, propertyType, roomType, location, price, guests, featuredImageId);
        dispatch({ type: _actions__WEBPACK_IMPORTED_MODULE_6__["ROOMS"].ADD, payload: _payload });
      }
    },
    onChangeTitle: function onChangeTitle(value) {
      var key = 'title';
      if (value.length === 0) {
        dispatch(_actions__WEBPACK_IMPORTED_MODULE_6__["ROOMEDITOR"].FieldError(key, 'Title cannot be blank!', 'is-danger', value));
      } else if (value.length < 6 || value.length > 90) {
        dispatch(_actions__WEBPACK_IMPORTED_MODULE_6__["ROOMEDITOR"].FieldError(key, 'Title cannot be blank!', 'is-danger', value));
      } else {
        dispatch({ type: _actions__WEBPACK_IMPORTED_MODULE_6__["ROOMEDITOR"].UPDATE_FIELD, key: key, value: value });
      }
    },
    onChangeDesc: function onChangeDesc(value) {
      var key = 'desc';
      if (value.length === 0) {
        dispatch(_actions__WEBPACK_IMPORTED_MODULE_6__["ROOMEDITOR"].FieldError(key, 'Description cannot be blank!', 'is-danger', value));
      } else if (value.length < 6 || value.length > 1000) {
        dispatch(_actions__WEBPACK_IMPORTED_MODULE_6__["ROOMEDITOR"].FieldError(key, 'Must be between 6-1000 characters!', 'is-warning', value));
      } else {
        dispatch({ type: _actions__WEBPACK_IMPORTED_MODULE_6__["ROOMEDITOR"].UPDATE_FIELD, key: key, value: value });
      }
    },
    onChangePropertyType: function onChangePropertyType(value) {
      var key = 'propertyType';
      if (!PropertyTypes.includes(value)) {
        dispatch(_actions__WEBPACK_IMPORTED_MODULE_6__["ROOMEDITOR"].FieldError(key, 'NO TAMPERING FIELDS!', 'is-danger', value));
      } else {
        dispatch({ type: _actions__WEBPACK_IMPORTED_MODULE_6__["ROOMEDITOR"].UPDATE_FIELD, key: key, value: value });
      }
    },
    onChangeHomeType: function onChangeHomeType(value) {
      var key = 'roomType';
      if (!HomeTypes.includes(value)) {
        dispatch(_actions__WEBPACK_IMPORTED_MODULE_6__["ROOMEDITOR"].FieldError(key, 'NO TAMPERING FIELDS!', 'is-danger', value));
      } else {
        dispatch({ type: _actions__WEBPACK_IMPORTED_MODULE_6__["ROOMEDITOR"].UPDATE_FIELD, key: key, value: value });
      }
    },
    incrementGuests: function incrementGuests(guestType) {
      return dispatch({ type: _actions__WEBPACK_IMPORTED_MODULE_6__["ROOMEDITOR"].INCREMENT_GUESTS, guestType: guestType });
    },
    decrementGuests: function decrementGuests(guestType) {
      return dispatch({ type: _actions__WEBPACK_IMPORTED_MODULE_6__["ROOMEDITOR"].DECREMENT_GUESTS, guestType: guestType });
    },
    onChangeLocation: function onChangeLocation(value) {
      var key = 'location';
      if (value.length === 0) {
        dispatch(_actions__WEBPACK_IMPORTED_MODULE_6__["ROOMEDITOR"].FieldError(key, 'Location cannot be blank!', 'is-danger', { formatted_address: '' }));
      } else {
        var payload = _agent__WEBPACK_IMPORTED_MODULE_5__["default"].Maps.findAddress(value);
        dispatch({ type: _actions__WEBPACK_IMPORTED_MODULE_6__["ROOMEDITOR"].UPDATE_FIELD, key: key, value: value });
        dispatch({ type: _actions__WEBPACK_IMPORTED_MODULE_6__["ROOMEDITOR"].FETCH_GMAPS_RESULTS, payload: payload });
      }
    },
    onClickLocation: function onClickLocation(value) {
      dispatch({ type: _actions__WEBPACK_IMPORTED_MODULE_6__["ROOMEDITOR"].UPDATE_LOCATION_FROM_SUGGESTION, value: value });
    },
    onChangePrice: function onChangePrice(value) {
      var key = 'price';
      if (!value || value === 0) {
        dispatch(_actions__WEBPACK_IMPORTED_MODULE_6__["ROOMEDITOR"].FieldError(key, 'A price is required!', 'is-danger', value));
      } else if (value > 100000) {
        dispatch(_actions__WEBPACK_IMPORTED_MODULE_6__["ROOMEDITOR"].FieldError(key, 'Price is too high!', 'is-warning', value));
      } else {
        dispatch({ type: _actions__WEBPACK_IMPORTED_MODULE_6__["ROOMEDITOR"].UPDATE_FIELD, key: key, value: value });
      }
    },
    onChangeCalendarType: function onChangeCalendarType(type) {
      var key = 'dates';
      if (!dateTypeOptions.includes(type)) {
        dispatch(_actions__WEBPACK_IMPORTED_MODULE_6__["ROOMEDITOR"].FieldError(key, 'NO TAMPERING FIELDS!', 'is-danger', []));
      } else {
        dispatch(_defineProperty({ type: _actions__WEBPACK_IMPORTED_MODULE_6__["ROOMS"].UPDATE_CALENDAR_TYPE }, 'type', type));
      }
    },
    onChangeFeaturedImage: function onChangeFeaturedImage(file) {
      var key = 'featuredImage';
      if (!file) {
        console.log('No File!');
        return;
      }
      if (file.size > 16000000) {
        dispatch(_actions__WEBPACK_IMPORTED_MODULE_6__["ROOMEDITOR"].FieldError(key, 'File size can be no larger than 16MB\'s', 'is-danger', { file_id: '', file_name: '', image: '' }));
      } else if (file.size < 20) {
        dispatch(RoomEditor(key, 'Must upload a featured image!', 'is-danger', {
          file_id: '',
          file_name: '',
          image: ''
        }));
      } else {
        var formData = new FormData();
        formData.append('file', file);
        var payload = _agent__WEBPACK_IMPORTED_MODULE_5__["default"].Uploads.asyncFileUpload(formData);
        console.log('PAYLOAD', payload);
        dispatch({ type: _actions__WEBPACK_IMPORTED_MODULE_6__["ROOMEDITOR"].UPLOAD_FEATURED_IMAGE, payload: payload });
      }
    }
  };
};

var RoomEditor = function (_Component) {
  _inherits(RoomEditor, _Component);

  function RoomEditor() {
    _classCallCheck(this, RoomEditor);

    var _this = _possibleConstructorReturn(this, (RoomEditor.__proto__ || Object.getPrototypeOf(RoomEditor)).call(this));

    _this.onChangeTitle = function (ev) {
      return _this.props.onChangeTitle(ev.target.value);
    };
    _this.onChangeDesc = function (ev) {
      return _this.props.onChangeDesc(ev.target.value);
    };
    _this.onChangePropertyType = function (ev) {
      return _this.props.onChangePropertyType(ev.target.value);
    };
    _this.onChangeHomeType = function (ev) {
      return _this.props.onChangeHomeType(ev.target.value);
    };
    _this.onChangeLocation = function (ev) {
      return _this.props.onChangeLocation(ev.target.value);
    };
    _this.onClickLocation = function (value) {
      return _this.props.onClickLocation(value);
    };
    _this.onChangePrice = function (ev) {
      return _this.props.onChangePrice(ev.target.value);
    };
    _this.incrementGuests = function (type) {
      return _this.props.incrementGuests(type);
    };
    _this.decrementGusts = function (type) {
      return _this.props.decrementGuests(type);
    };
    _this.onChangeFeaturedImage = function (ev) {
      return _this.props.onChangeFeaturedImage(ev.target.files[0]);
    };
    _this.deactivateCalendar = function () {
      return _this.setState({ isCalendarActive: true });
    };
    _this.onChangeDates = function (dates) {
      _this.props.changeDates(dates);
      _this.setState({ isCalendarActive: false });
    };

    _this.submitForm = function (title, desc, propertyType, roomType, location, price, guests, featuredImageId) {
      return function (ev) {
        ev.preventDefault();
        // Don't send form if required fields aren't filled out.
        if (_this.props.title.valid && _this.props.desc.valid && _this.props.propertyType.valid && _this.props.roomType.valid && _this.props.location.valid && _this.props.price.valid && _this.props.featuredImage.valid) {
          if (_this.props.match.params.roomId) {
            _this.props.handleSubmit(_this.props.userId, title, desc, propertyType, roomType, location, price, guests, featuredImageId, _this.props.mode, _this.props.match.params.roomId);
          } else {
            _this.props.handleSubmit(_this.props.userId, title, desc, propertyType, roomType, location, price, guests, featuredImageId, _this.props.mode);
          }
        }
      };
    };
    return _this;
  }

  _createClass(RoomEditor, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.props.onLoad(this.props.match);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.props.onUnload();
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var title = this.props.title.value;
      var desc = this.props.desc.value;
      var propertyType = this.props.propertyType.value;
      var roomType = this.props.roomType.value;
      var location = this.props.location.value;
      var price = this.props.price.value;
      var guests = this.props.guests.value;
      var featuredImageId = this.props.featuredImage.value.file_id;
      var locationObj = this.props.location.value.formatted_address.split(', ');

      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
        'section',
        { id: 'roomEditor', className: 'hero is-light is-bold is-fullheight' },
        react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
          'div',
          { className: 'hero-body' },
          react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
            'div',
            { className: 'container' },
            react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
              'h2',
              { className: 'title is-2' },
              'Add A Room'
            ),
            react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
              'div',
              { className: 'box' },
              react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_ErrorList__WEBPACK_IMPORTED_MODULE_2__["default"], { handleClose: this.props.closeError, errors: this.props.errors }),
              react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                'form',
                { onSubmit: this.submitForm(title, desc, propertyType, roomType, location, price, guests, featuredImageId) },
                react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                  'div',
                  { id: 'previewer', className: 'field is-horizontal' },
                  react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                    'label',
                    { className: 'field-label is-normal' },
                    'Preview'
                  ),
                  react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                    'div',
                    { className: 'field-body' },
                    react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_Room__WEBPACK_IMPORTED_MODULE_4__["default"], {
                      preview: true,
                      title: this.props.title.value,
                      featuredImage: this.props.featuredImage.value.file_id,
                      roomType: this.props.roomType.value,
                      propertyType: this.props.propertyType.value,
                      price: this.props.price.value,
                      guests: this.props.guests.value,
                      location: locationObj
                    })
                  )
                ),
                react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_Field__WEBPACK_IMPORTED_MODULE_3__["default"], {
                  key: 'title',
                  type: 'text',
                  label: 'Title',
                  value: this.props.title.value,
                  isHorizontal: true,
                  placeholder: 'A Stunning Two Bedroom Home!',
                  onChange: this.onChangeTitle,
                  inputState: this.props.title.inputState,
                  message: this.props.title.message
                }),
                react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_Field__WEBPACK_IMPORTED_MODULE_3__["default"], {
                  key: 'desc',
                  label: 'Description',
                  type: 'textarea',
                  value: this.props.desc.value,
                  isHorizontal: true,
                  placeholder: 'This gorgeous home has everything you need...',
                  onChange: this.onChangeDesc,
                  inputState: this.props.desc.inputState,
                  message: this.props.desc.message
                }),
                react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_Field__WEBPACK_IMPORTED_MODULE_3__["default"], {
                  key: 'propertyType',
                  label: 'Property Type',
                  type: 'select',
                  value: this.props.propertyType.value,
                  opts: PropertyTypes,
                  isHorizontal: true,
                  placeholder: 'Please Select',
                  onChange: this.onChangePropertyType,
                  inputState: this.props.propertyType.inputState,
                  message: this.props.propertyType.message
                }),
                react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_Field__WEBPACK_IMPORTED_MODULE_3__["default"], {
                  key: 'roomType',
                  label: 'Home Type',
                  type: 'select',
                  value: this.props.roomType.value,
                  opts: HomeTypes,
                  placeholder: 'Please Select',
                  isHorizontal: true,
                  onChange: this.onChangeHomeType,
                  inputState: this.props.roomType.inputState,
                  message: this.props.roomType.message
                }),
                react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_Field__WEBPACK_IMPORTED_MODULE_3__["default"], {
                  key: 'location',
                  label: 'Location',
                  type: 'location',
                  size: 'is-medium',
                  value: this.props.location.value.formatted_address,
                  placeholder: 'Type the address to search...',
                  isHorizontal: true,
                  hasIconLeft: 'search',
                  onChange: this.onChangeLocation,
                  onClick: this.onClickLocation,
                  inputState: this.props.location.inputState,
                  message: this.props.location.message,
                  results: this.props.location.results,
                  isLoading: this.props.location.loading
                }),
                react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_Field__WEBPACK_IMPORTED_MODULE_3__["default"], {
                  key: 'price',
                  label: 'Price',
                  type: 'number',
                  value: this.props.price.value,
                  isHorizontal: true,
                  hasAddonLeft: react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                    'a',
                    { className: 'button is-static' },
                    '$'
                  ),
                  hasAddonRight: react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                    'a',
                    { className: 'button is-static' },
                    '/ Day'
                  ),
                  placeholder: '180',
                  onChange: this.onChangePrice,
                  inputState: this.props.price.inputState,
                  message: this.props.price.message
                }),
                react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_Field__WEBPACK_IMPORTED_MODULE_3__["default"], {
                  key: 'calendarType',
                  label: 'Availability Type',
                  type: 'select',
                  value: this.props.dates.type,
                  opts: dateTypeOptions,
                  isHorizontal: true,
                  placeholder: 'Please Select',
                  onChange: this.onChangeCalendarType,
                  inputState: this.props.dates.inputState,
                  message: this.props.dates.message
                }),
                this.props.dates.type ? null : react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_Field__WEBPACK_IMPORTED_MODULE_3__["default"], {
                  key: 'calendar',
                  label: 'Availability',
                  type: 'calendar',
                  value: this.props.dates.value,
                  isHorizontal: true,
                  active: this.isCalendarActive,
                  onChange: this.onChangeDates,
                  onClick: this.deactivateCalendar
                }),
                react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_Field__WEBPACK_IMPORTED_MODULE_3__["default"], {
                  key: 'children',
                  label: 'Max Children',
                  type: 'incrementer',
                  value: this.props.guests.value.children,
                  isHorizontal: true,
                  hasAddonLeft: react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                    'a',
                    { className: 'button', onClick: function onClick() {
                        return _this2.props.incrementGuests('children');
                      } },
                    '+'
                  ),
                  hasAddonRight: react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                    'a',
                    { className: 'button', onClick: function onClick() {
                        return _this2.props.decrementGuests('children');
                      } },
                    '-'
                  )
                }),
                react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_Field__WEBPACK_IMPORTED_MODULE_3__["default"], {
                  key: 'featuredImage',
                  label: 'Featured Image',
                  type: 'file',
                  value: this.props.featuredImage.value,
                  isLoading: this.props.featuredImage.loading,
                  isHorizontal: true,
                  onChange: this.onChangeFeaturedImage,
                  inputState: this.props.featuredImage.inputState,
                  message: this.props.featuredImage.message
                }),
                react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                  'div',
                  { className: 'field' },
                  react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                    'p',
                    { className: 'control' },
                    react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                      'button',
                      {
                        className: 'button is-success' + (this.props.inProgress ? ' is-loading' : '') + (this.props.title.valid && this.props.desc.valid && this.props.roomType.valid && this.props.propertyType.valid && this.props.location.valid && this.props.price.valid && this.props.featuredImage.valid ? '' : ' is-outlined'),
                        onClick: this.submitForm,
                        disabled: this.props.title.valid && this.props.desc.valid && this.props.roomType.valid && this.props.propertyType.valid && this.props.location.valid && this.props.price.valid && this.props.featuredImage.valid ? false : 'disabled'
                      },
                      'Submit'
                    )
                  ),
                  react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                    'p',
                    { className: 'help is-success' },
                    this.props.message ? this.props.message : null
                  )
                )
              )
            )
          )
        )
      );
    }
  }]);

  return RoomEditor;
}(react__WEBPACK_IMPORTED_MODULE_0__["Component"]);

/* harmony default export */ __webpack_exports__["default"] = (Object(react_redux__WEBPACK_IMPORTED_MODULE_1__["connect"])(mapStateToProps, mapDispatchToProps)(RoomEditor));

/***/ }),

/***/ "./client/containers/pages/Rooms.js":
/*!******************************************!*\
  !*** ./client/containers/pages/Rooms.js ***!
  \******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-redux */ "react-redux");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_redux__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _agent__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../agent */ "./client/agent.js");
/* harmony import */ var _components_Room__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../components/Room */ "./client/components/Room.js");
/* harmony import */ var _assets_banner6_jpg__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../assets/banner6.jpg */ "./client/assets/banner6.jpg");
/* harmony import */ var _assets_banner6_jpg__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_assets_banner6_jpg__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _actions__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../actions */ "./client/actions.js");
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }



// import { Link } from 'react-router-dom';








var mapStateToProps = function mapStateToProps(state) {
  return {
    currentUser: state.common.currentUser,
    roomsList: state.rooms.roomsList,
    reload: state.rooms.reload
  };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return {
    onLoad: function onLoad() {
      var payload = _agent__WEBPACK_IMPORTED_MODULE_2__["default"].Rooms.all();
      dispatch({ type: _actions__WEBPACK_IMPORTED_MODULE_5__["LOAD_PAGE"].ROOMS, payload: payload });
    },
    onUnload: function onUnload() {
      return dispatch({ type: _actions__WEBPACK_IMPORTED_MODULE_5__["UNLOAD_PAGE"].ROOMS });
    },
    bookRoom: function bookRoom(buyerId, ownerId, roomId, price, guests) {
      console.log('Booking room', buyerId, ownerId, roomId, price, guests);
      var payload = _agent__WEBPACK_IMPORTED_MODULE_2__["default"].Bookings.bookRoom(buyerId, ownerId, roomId, price, guests);
      dispatch({ type: _actions__WEBPACK_IMPORTED_MODULE_5__["ROOMS"].BOOK, payload: payload });
    }
  };
};

var Rooms = function (_Component) {
  _inherits(Rooms, _Component);

  function Rooms() {
    _classCallCheck(this, Rooms);

    var _this = _possibleConstructorReturn(this, (Rooms.__proto__ || Object.getPrototypeOf(Rooms)).call(this));

    _this.bookRoom = function (ownerId, roomId, price, guests) {
      return _this.props.bookRoom(_this.props.currentUser.id, ownerId, roomId, price, guests);
    };
    return _this;
  }

  _createClass(Rooms, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.props.onLoad();
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.props.onUnload();
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.reload === true) {
        this.props.onLoad();
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
        'section',
        { id: 'browse', className: 'hero is-light is-bold is-fullheight' },
        react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
          'div',
          { className: 'hero-head' },
          react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement('div', { className: 'hero-banner', style: { backgroundImage: 'url(' + _assets_banner6_jpg__WEBPACK_IMPORTED_MODULE_4___default.a + ')' } }),
          react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
            'div',
            { className: 'container has-text-centered' },
            react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
              'h2',
              { className: 'title is-2' },
              'Browse Rooms'
            )
          )
        ),
        react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
          'div',
          { className: 'hero-body' },
          react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
            'div',
            { className: 'container' },
            react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
              'div',
              { id: 'rooms' },
              this.props.roomsList.length > 0 ? this.props.roomsList.map(function (room, index) {
                var locationObj = room.location.formatted_address.split(', ');
                return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_Room__WEBPACK_IMPORTED_MODULE_3__["default"], {
                  key: index,
                  onClick: _this2.bookRoom,
                  roomId: room.id,
                  ownerId: room.ownerId,
                  title: room.title,
                  featuredImage: room.featuredImageId,
                  roomType: room.roomType,
                  propertyType: room.propertyType,
                  price: room.price,
                  guests: room.guests,
                  location: locationObj,
                  booked: room.booked,
                  currentUser: _this2.props.currentUser
                });
              }, this) : react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                'div',
                { className: 'box' },
                react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                  'code',
                  null,
                  'No Rooms Found'
                )
              )
            )
          )
        )
      );
    }
  }]);

  return Rooms;
}(react__WEBPACK_IMPORTED_MODULE_0__["Component"]);

/* harmony default export */ __webpack_exports__["default"] = (Object(react_redux__WEBPACK_IMPORTED_MODULE_1__["connect"])(mapStateToProps, mapDispatchToProps)(Rooms));

/***/ }),

/***/ "./client/containers/pages/Settings.js":
/*!*********************************************!*\
  !*** ./client/containers/pages/Settings.js ***!
  \*********************************************/
/*! exports provided: Settings, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Settings", function() { return Settings; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _agent__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../agent */ "./client/agent.js");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-redux */ "react-redux");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_redux__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _components_ErrorList__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../components/ErrorList */ "./client/components/ErrorList.js");
/* harmony import */ var _actions__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../actions */ "./client/actions.js");
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }


// import { Link } from 'react-router-dom';




// import Field from '../../components/Field';



// Mapping Global Redux State to React Props
var mapStateToProps = function mapStateToProps(state) {
	return Object.assign({}, state.auth, {
		email: state.auth.email,
		password: state.auth.password,
		passwordConfirm: state.auth.passwordConfirm
	});
};

// Action Creators
var mapDispatchToProps = function mapDispatchToProps(dispatch) {
	return {
		closeError: function closeError(index) {
			return dispatch({ type: _actions__WEBPACK_IMPORTED_MODULE_4__["SETTINGS"].CLOSE_ERROR, index: index });
		},
		onLoad: function onLoad() {
			return dispatch({ type: _actions__WEBPACK_IMPORTED_MODULE_4__["LOAD_PAGE"].SETTINGS });
		},
		onUnload: function onUnload() {
			return dispatch({ type: _actions__WEBPACK_IMPORTED_MODULE_4__["UNLOAD_PAGE"].SETTINGS });
		},
		onChangeEmail: function onChangeEmail(value) {
			var key = 'email';
			if (value.length === 0) {
				dispatch({
					type: _actions__WEBPACK_IMPORTED_MODULE_4__["SETTINGS"].FIELD_ERROR,
					key: key,
					message: 'Email cannot be blank!',
					inputState: 'is-danger',
					value: value
				});
			} else if (!/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(String(value).toLowerCase())) {
				dispatch({
					type: _actions__WEBPACK_IMPORTED_MODULE_4__["SETTINGS"].FIELD_ERROR,
					key: key,
					message: 'Must be a proper email! Ex. elon@spacex.com',
					inputState: 'is-danger',
					value: value
				});
			} else {
				dispatch({ type: _actions__WEBPACK_IMPORTED_MODULE_4__["SETTINGS"].UPDATE_FIELD, key: key, value: value });
			}
		},
		onChangePassword: function onChangePassword(value) {
			var key = 'password';
			if (value.length === 0) {
				dispatch({
					type: _actions__WEBPACK_IMPORTED_MODULE_4__["SETTINGS"].FIELD_ERROR,
					key: key,
					message: 'Password cannot be blank!',
					inputState: 'is-danger',
					value: value
				});
			} else if (value.length > 16 || value.length < 6) {
				dispatch({
					type: _actions__WEBPACK_IMPORTED_MODULE_4__["SETTINGS"].FIELD_ERROR,
					key: key,
					message: 'Password length must be between 6-16 characters!',
					inputState: 'is-warning',
					value: value
				});
			} else {
				dispatch({ type: _actions__WEBPACK_IMPORTED_MODULE_4__["SETTINGS"].UPDATE_FIELD, key: key, value: value });
			}
		},
		onChangePasswordConfirm: function onChangePasswordConfirm(password, passwordConfirm) {
			var key = 'passwordConfirm';
			if (passwordConfirm.length === 0) {
				dispatch({
					type: _actions__WEBPACK_IMPORTED_MODULE_4__["SETTINGS"].FIELD_ERROR,
					key: key,
					message: 'Password cannot be blank!',
					inputState: 'is-danger',
					value: passwordConfirm
				});
			} else if (passwordConfirm.length > 16 || passwordConfirm.length < 6) {
				dispatch({
					type: _actions__WEBPACK_IMPORTED_MODULE_4__["SETTINGS"].FIELD_ERROR,
					key: key,
					message: 'Password length must be between 6-16 characters!',
					inputState: 'is-warning',
					value: passwordConfirm
				});
			} else if (password !== passwordConfirm) {
				dispatch({
					type: _actions__WEBPACK_IMPORTED_MODULE_4__["SETTINGS"].FIELD_ERROR,
					key: key,
					message: 'Passwords Must Match!',
					inputState: 'is-danger',
					value: passwordConfirm
				});
			} else {
				dispatch({ type: _actions__WEBPACK_IMPORTED_MODULE_4__["SETTINGS"].UPDATE_FIELD, key: key, value: passwordConfirm });
			}
		},
		handleSubmit: function handleSubmit(email, password, passwordConfirm) {
			var payload = _agent__WEBPACK_IMPORTED_MODULE_1__["default"].Auth.signup(email, password, passwordConfirm);
			console.log('PAYLOAD', payload);
			dispatch({ type: _actions__WEBPACK_IMPORTED_MODULE_4__["SETTINGS"].UPDATE_SETTINGS, payload: payload });
		}
	};
};

var Settings = function (_Component) {
	_inherits(Settings, _Component);

	function Settings() {
		_classCallCheck(this, Settings);

		// Grab the input on input Change Events
		var _this = _possibleConstructorReturn(this, (Settings.__proto__ || Object.getPrototypeOf(Settings)).call(this));

		_this.onChangeEmail = function (ev) {
			return _this.props.onChangeEmail(ev.target.value);
		};
		_this.onChangePassword = function (ev) {
			return _this.props.onChangePassword(ev.target.value);
		};
		_this.onChangePasswordConfirm = function (ev) {
			return _this.props.onChangePasswordConfirm(_this.props.password.value, ev.target.value);
		};

		// Form Submit Handling
		_this.submitForm = function (email, password, passwordConfirm) {
			return function (ev) {
				ev.preventDefault();
				_this.props.handleSubmit(email, password, passwordConfirm);
			};
		};
		return _this;
	}

	_createClass(Settings, [{
		key: 'componentWillMount',
		value: function componentWillMount() {
			this.props.onLoad();
		}
	}, {
		key: 'componentWillUnmount',
		value: function componentWillUnmount() {
			this.props.onUnload();
		}
	}, {
		key: 'render',
		value: function render() {
			// const email = this.props.email.value;
			// const password = this.props.password.value;
			// const passwordConfirm = this.props.passwordConfirm.value;
			return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
				'section',
				{ id: 'settings', className: 'hero is-light is-fullheight' },
				react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
					'div',
					{ className: 'hero-body' },
					react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
						'div',
						{ className: 'columns is-centered', style: { flexGrow: 1 } },
						react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
							'div',
							{ className: 'column is-half' },
							react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_ErrorList__WEBPACK_IMPORTED_MODULE_3__["default"], {
								handleClose: this.props.closeError,
								errors: this.props.errors }),
							react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
								'h1',
								{ className: 'title is-1' },
								'Settings'
							),
							react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement('div', { className: 'box' })
						)
					)
				)
			);
		}
	}]);

	return Settings;
}(react__WEBPACK_IMPORTED_MODULE_0__["Component"]);

/* harmony default export */ __webpack_exports__["default"] = (Object(react_redux__WEBPACK_IMPORTED_MODULE_2__["connect"])(mapStateToProps, mapDispatchToProps)(Settings));

/***/ }),

/***/ "./client/containers/pages/Signup.js":
/*!*******************************************!*\
  !*** ./client/containers/pages/Signup.js ***!
  \*******************************************/
/*! exports provided: Signup, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Signup", function() { return Signup; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-router-dom */ "react-router-dom");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_router_dom__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _agent__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../agent */ "./client/agent.js");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-redux */ "react-redux");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_redux__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _components_ErrorList__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../components/ErrorList */ "./client/components/ErrorList.js");
/* harmony import */ var _components_Field__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../components/Field */ "./client/components/Field.js");
/* harmony import */ var _actions__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../actions */ "./client/actions.js");
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }











// Mapping Global Redux State to React Props
var mapStateToProps = function mapStateToProps(state) {
	return Object.assign({}, state.auth, {
		email: state.auth.email,
		password: state.auth.password,
		passwordConfirm: state.auth.passwordConfirm,
		errors: state.auth.errors
	});
};

// Action Creators
var mapDispatchToProps = function mapDispatchToProps(dispatch) {
	return {
		closeError: function closeError(index) {
			return dispatch({ type: _actions__WEBPACK_IMPORTED_MODULE_6__["AUTH"].CLOSE_ERROR, index: index });
		},
		onLoad: function onLoad() {
			return dispatch({ type: _actions__WEBPACK_IMPORTED_MODULE_6__["LOAD_PAGE"].SIGNUP });
		},
		onUnload: function onUnload() {
			return dispatch({ type: _actions__WEBPACK_IMPORTED_MODULE_6__["UNLOAD_PAGE"].SIGNUP });
		},
		onChangeEmail: function onChangeEmail(value) {
			var key = 'email';
			if (value.length === 0) {
				dispatch(_actions__WEBPACK_IMPORTED_MODULE_6__["AUTH"].FieldError(key, 'Email cannot be blank!', 'is-danger', value));
			} else if (!/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(String(value).toLowerCase())) {
				dispatch(_actions__WEBPACK_IMPORTED_MODULE_6__["AUTH"].FieldError(key, 'Must be a proper email! Ex. elon@spacex.com', 'is-danger', value));
			} else {
				dispatch({ type: _actions__WEBPACK_IMPORTED_MODULE_6__["AUTH"].UPDATE_FIELD, key: key, value: value });
			}
		},
		onChangePassword: function onChangePassword(value) {
			var key = 'password';
			if (value.length === 0) {
				dispatch(_actions__WEBPACK_IMPORTED_MODULE_6__["AUTH"].FieldError(key, 'Password cannot be blank!', 'is-danger', value));
			} else if (value.length > 16 || value.length < 6) {
				dispatch(_actions__WEBPACK_IMPORTED_MODULE_6__["AUTH"].FieldError(key, 'Password length must be between 6-16 characters!', 'is-warning', value));
			} else {
				dispatch({ type: _actions__WEBPACK_IMPORTED_MODULE_6__["AUTH"].UPDATE_FIELD, key: key, value: value });
			}
		},
		onChangePasswordConfirm: function onChangePasswordConfirm(password, passwordConfirm) {
			var key = 'passwordConfirm';
			if (passwordConfirm.length === 0) {
				dispatch(_actions__WEBPACK_IMPORTED_MODULE_6__["AUTH"].FieldError(key, 'Password cannot be blank', 'is-danger', passwordConfirm));
			} else if (passwordConfirm.length > 16 || passwordConfirm.length < 6) {
				dispatch(_actions__WEBPACK_IMPORTED_MODULE_6__["AUTH"].FieldError(key, 'Password length must be between 6-16 characters!', 'is-warning', passwordConfirm));
			} else if (password !== passwordConfirm) {
				dispatch(_actions__WEBPACK_IMPORTED_MODULE_6__["AUTH"].FieldError(key, 'Passwords must match!', 'is-danger', passwordConfirm));
			} else {
				dispatch({ type: _actions__WEBPACK_IMPORTED_MODULE_6__["AUTH"].UPDATE_FIELD, key: key, value: passwordConfirm });
			}
		},
		handleSubmit: function handleSubmit(email, password, passwordConfirm) {
			var payload = _agent__WEBPACK_IMPORTED_MODULE_2__["default"].Auth.signup(email, password, passwordConfirm);
			console.log('PAYLOAD', payload);
			dispatch({ type: _actions__WEBPACK_IMPORTED_MODULE_6__["AUTH"].SIGNUP, payload: payload });
		}
	};
};

var Signup = function (_Component) {
	_inherits(Signup, _Component);

	function Signup() {
		_classCallCheck(this, Signup);

		// Grab the input on input Change Events
		var _this = _possibleConstructorReturn(this, (Signup.__proto__ || Object.getPrototypeOf(Signup)).call(this));

		_this.onChangeEmail = function (ev) {
			return _this.props.onChangeEmail(ev.target.value);
		};
		_this.onChangePassword = function (ev) {
			return _this.props.onChangePassword(ev.target.value);
		};
		_this.onChangePasswordConfirm = function (ev) {
			return _this.props.onChangePasswordConfirm(_this.props.password.value, ev.target.value);
		};

		// Form Submit Handling
		_this.submitForm = function (email, password, passwordConfirm) {
			return function (ev) {
				ev.preventDefault();
				_this.props.handleSubmit(email, password, passwordConfirm);
			};
		};
		return _this;
	}

	_createClass(Signup, [{
		key: 'componentWillMount',
		value: function componentWillMount() {
			this.props.onLoad();
		}
	}, {
		key: 'componentWillUnmount',
		value: function componentWillUnmount() {
			this.props.onUnload();
		}
	}, {
		key: 'render',
		value: function render() {
			var email = this.props.email.value;
			var password = this.props.password.value;
			var passwordConfirm = this.props.passwordConfirm.value;
			return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
				'section',
				{ id: 'signup', className: 'hero is-light is-fullheight' },
				react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
					'div',
					{ className: 'hero-body' },
					react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
						'div',
						{ className: 'columns is-centered', style: { flexGrow: 1 } },
						react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
							'div',
							{ className: 'column is-half' },
							react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_ErrorList__WEBPACK_IMPORTED_MODULE_4__["default"], {
								handleClose: this.props.closeError,
								errors: this.props.errors }),
							react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
								'h1',
								{ className: 'title is-1' },
								'Sign Up'
							),
							react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
								'form',
								{ onSubmit: this.submitForm(email, password, passwordConfirm) },
								react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_Field__WEBPACK_IMPORTED_MODULE_5__["default"], {
									key: 'email',
									type: 'text',
									value: this.props.email.value,
									placeholder: 'Enter your email',
									onChange: this.onChangeEmail,
									inputState: this.props.email.inputState,
									message: this.props.email.message
								}),
								react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_Field__WEBPACK_IMPORTED_MODULE_5__["default"], {
									key: 'password',
									type: 'password',
									value: this.props.password.value,
									placeholder: 'Enter your password',
									onChange: this.onChangePassword,
									inputState: this.props.password.inputState,
									message: this.props.password.message
								}),
								react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_Field__WEBPACK_IMPORTED_MODULE_5__["default"], {
									key: 'passwordConfirm',
									type: 'password',
									value: this.props.passwordConfirm.value,
									placeholder: 'Re-enter password',
									onChange: this.onChangePasswordConfirm,
									inputState: this.props.passwordConfirm.inputState,
									message: this.props.passwordConfirm.message
								}),
								react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
									'div',
									{ className: 'field is-grouped' },
									react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
										'p',
										{ className: 'control' },
										react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
											'button',
											{
												className: 'button is-primary' + (this.props.inProgress ? ' is-loading' : '') + (this.props.email.valid && this.props.password.valid && this.props.passwordConfirm.valid ? '' : ' is-outlined'),
												onClick: this.submitForm,
												disabled: this.props.email.valid && this.props.password.valid && this.props.passwordConfirm.valid ? false : 'disabled'
											},
											'Sign Up'
										)
									),
									react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
										'p',
										{ className: 'or' },
										'or'
									),
									react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
										'p',
										{ className: 'control' },
										react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
											react_router_dom__WEBPACK_IMPORTED_MODULE_1__["Link"],
											{ className: 'button is-text', to: '/login' },
											'Log In'
										)
									)
								)
							)
						)
					)
				)
			);
		}
	}]);

	return Signup;
}(react__WEBPACK_IMPORTED_MODULE_0__["Component"]);

/* harmony default export */ __webpack_exports__["default"] = (Object(react_redux__WEBPACK_IMPORTED_MODULE_3__["connect"])(mapStateToProps, mapDispatchToProps)(Signup));

/***/ }),

/***/ "./client/containers/pages/YourRooms.js":
/*!**********************************************!*\
  !*** ./client/containers/pages/YourRooms.js ***!
  \**********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-redux */ "react-redux");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_redux__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-router-dom */ "react-router-dom");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_router_dom__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _components_Modal__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../components/Modal */ "./client/components/Modal.js");
/* harmony import */ var _agent__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../agent */ "./client/agent.js");
/* harmony import */ var _actions__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../actions */ "./client/actions.js");
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }











var mapStateToProps = function mapStateToProps(state) {
  return {
    yourRooms: state.rooms.yourRooms,
    userId: state.common.currentUser ? state.common.currentUser.id : null,
    loading: state.rooms.loading,
    reload: state.rooms.reload
  };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return {
    onLoad: function onLoad(userId) {
      var payload = _agent__WEBPACK_IMPORTED_MODULE_4__["default"].Rooms.roomByUserId(userId);
      dispatch({ type: _actions__WEBPACK_IMPORTED_MODULE_5__["LOAD_PAGE"].YOURROOMS, payload: payload });
    },
    onUnload: function onUnload() {
      return dispatch({ type: _actions__WEBPACK_IMPORTED_MODULE_5__["UNLOAD_PAGE"].YOURROOMS });
    },
    closeError: function closeError(index) {
      return dispatch({ type: _actions__WEBPACK_IMPORTED_MODULE_5__["ROOMS"].CLOSE_ERROR, index: index });
    },
    deleteRoom: function deleteRoom(id) {
      var payload = _agent__WEBPACK_IMPORTED_MODULE_4__["default"].Rooms.deleteRoom(id);
      dispatch({ type: _actions__WEBPACK_IMPORTED_MODULE_5__["ROOMS"].DELETE, payload: payload });
    }
  };
};

var YourRooms = function (_Component) {
  _inherits(YourRooms, _Component);

  function YourRooms() {
    _classCallCheck(this, YourRooms);

    var _this = _possibleConstructorReturn(this, (YourRooms.__proto__ || Object.getPrototypeOf(YourRooms)).call(this));

    _this.state = {
      isModalActive: false,
      roomId: ''
    };

    _this.closeModal = function () {
      _this.setState({ isModalActive: false, roomId: '' });
    };

    _this.activateModal = function (roomId) {
      _this.setState({ isModalActive: true, roomId: roomId });
    };

    _this.editRoom = function (id) {
      return _this.props.editRoom(id);
    };
    _this.deleteRoom = function (id) {
      return _this.props.deleteRoom(id);
    };
    return _this;
  }

  _createClass(YourRooms, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.reload === true) {
        this.props.onLoad(this.props.userId);
        this.setState({ isModalActive: false });
      }
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      console.log(this.props);
      this.props.onLoad(this.props.userId);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.props.onUnload();
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
        'section',
        { id: 'yourRooms', className: 'hero is-light is-bold is-fullheight' },
        react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_Modal__WEBPACK_IMPORTED_MODULE_3__["default"], {
          isActive: this.state.isModalActive,
          isLoading: this.props.loading,
          content: 'Are you sure you would like to cancel this booking?',
          confirmText: 'Confirm',
          onClose: this.closeModal,
          onClickConfirm: function onClickConfirm() {
            return _this2.props.deleteRoom(_this2.state.roomId);
          }
        }),
        react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
          'div',
          { className: 'hero-body' },
          react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
            'div',
            { className: 'container has-text-centered' },
            react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
              'h2',
              { className: 'title is-2' },
              'Your Rooms'
            ),
            react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
              'div',
              { className: 'rooms' },
              this.props.yourRooms.length > 0 ? this.props.yourRooms.map(function (room, index) {
                return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                  'div',
                  { className: 'box', key: index },
                  react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                    'figure',
                    { className: 'image' },
                    react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement('img', { src: 'http://localhost:3001/api/uploads/' + room.featuredImageId, alt: 'Placeholder' })
                  ),
                  react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                    'div',
                    { className: 'details' },
                    react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                      'h5',
                      { className: 'title is-5' },
                      room.title
                    ),
                    react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                      'h6',
                      { className: 'subtitle room-type is-6' },
                      room.roomType,
                      ' | ',
                      room.propertyType
                    )
                  ),
                  react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                    'p',
                    { className: 'buttons' },
                    react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                      react_router_dom__WEBPACK_IMPORTED_MODULE_2__["Link"],
                      { to: '/your-rooms/edit/' + room.id, className: 'button is-info' },
                      react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                        'span',
                        null,
                        'Edit Room'
                      )
                    ),
                    react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                      'button',
                      { onClick: function onClick() {
                          return _this2.activateModal(room.id);
                        }, className: 'button is-danger is-outlined' },
                      react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                        'span',
                        { className: 'icon' },
                        react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement('i', { className: 'fa fa-exclamation-triangle' })
                      ),
                      react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                        'span',
                        null,
                        'Delete'
                      )
                    )
                  )
                );
              }, this) : react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                'div',
                { className: 'box has-text-centered', style: { flexDirection: 'column' } },
                react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                  'p',
                  { className: 'content' },
                  'You haven\'t added any rooms!'
                ),
                react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                  react_router_dom__WEBPACK_IMPORTED_MODULE_2__["Link"],
                  { to: '/your-rooms/add', className: 'button is-info' },
                  'Add A Room'
                )
              )
            )
          )
        )
      );
    }
  }]);

  return YourRooms;
}(react__WEBPACK_IMPORTED_MODULE_0__["Component"]);

/* harmony default export */ __webpack_exports__["default"] = (Object(react_redux__WEBPACK_IMPORTED_MODULE_1__["connect"])(mapStateToProps, mapDispatchToProps)(YourRooms));

/***/ }),

/***/ "./client/index.html":
/*!***************************!*\
  !*** ./client/index.html ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<!DOCTYPE html>\r\n<html lang=\"en\" class=\"has-navbar-fixed-top\">\r\n  <head>\r\n    <meta charset=\"utf-8\">\r\n\t  <meta name=\"apple-mobile-web-app-capable\" content=\"yes\">\r\n\t  <meta name=\"apple-touch-fullscreen\" content=\"yes\">\r\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1, shrink-to-fit=no\">\r\n    <meta name=\"theme-color\" content=\"#000000\">\r\n    <link rel=\"manifest\" href=\"/static/manifest.json\">\r\n    <link rel=\"shortcut icon\" href=\"/static/favicon.ico.png\">\r\n    <link rel=\"stylesheet\" type=\"text/css\" href=\"/static/main.css\">\r\n    <link rel=\"stylesheet\" href=\"https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css\">\r\n    <title>Bed'N'Blockchain</title>\r\n  </head>\r\n\t<body>\r\n\t  <div id=\"root\"><!-- CONTENT --></div>\r\n\t  <script type=\"text/javascript\">\r\n\t    window.initialStoreData = \"-- STORES --\";\r\n\t  </script>\r\n\t  <script type=\"text/javascript\">\r\n\t    window.CONFIG = \"-- CONFIG --\";\r\n\t  </script>\r\n\t  <script src=\"/client.js\"></script>\r\n\t</body>\r\n</html>\r\n";

/***/ }),

/***/ "./client/middleware.js":
/*!******************************!*\
  !*** ./client/middleware.js ***!
  \******************************/
/*! exports provided: promiseMiddleware, localStorageMiddleware */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "promiseMiddleware", function() { return promiseMiddleware; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "localStorageMiddleware", function() { return localStorageMiddleware; });
/* harmony import */ var _agent__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./agent */ "./client/agent.js");
/* harmony import */ var _actions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./actions */ "./client/actions.js");
// Grab Requests Agent so we can add the users token if found.


// Actions


// Allow an action to a Promise
var promiseMiddleware = function promiseMiddleware(store) {
  return function (next) {
    return function (action) {
      console.log(action);
      // If the action has a payload that is a promise.
      if (isPromise(action.payload)) {
        // Tell react that we started an ASYNC action with it's subtype.
        store.dispatch({ type: _actions__WEBPACK_IMPORTED_MODULE_1__["ASYNC"].START, subtype: action.type });
        var currentView = store.getState().viewChangeCounter;

        // Check if the action requested to skipTracking
        var skipTracking = action.skipTracking;

        // Await the response from the promise
        action.payload.then(function (res) {
          var currentState = store.getState();
          if (!skipTracking && currentState.viewChangeCounter !== currentView) {
            return;
          }
          console.log('RESULT', res);

          // Grab a known payload if it exists.
          action.payload = res.payload || res.body;

          // Tell the react the request finished.
          store.dispatch({ type: _actions__WEBPACK_IMPORTED_MODULE_1__["ASYNC"].END, subtype: action.type, promise: action.payload });

          // Send an error to react/redux.
          if (res.error) {
            action.error = true;
            action.errors = res.errors;
            if (action.errors[0] === 'Invalid Token') {
              action.errors[0] = 'You\'ve been signed out!';
              store.dispatch({ type: _actions__WEBPACK_IMPORTED_MODULE_1__["APP"].DELETE_TOKEN });
            }
            store.dispatch({ type: _actions__WEBPACK_IMPORTED_MODULE_1__["ASYNC"].ERROR, subtype: action.type, errors: action.errors });
          } else {
            store.dispatch(action);
          }
        }, function (error) {
          var currentState = store.getState();
          if (!skipTracking && currentState.viewChangeCounter !== currentView) {
            return;
          }
          console.log('ERROR', error);
          action.error = true;
          action.errors = ['A connection error occured! If this continues, please report it!'];
          action.payload = { error: action.error, errors: action.errors };
          store.dispatch({ type: _actions__WEBPACK_IMPORTED_MODULE_1__["ASYNC"].END, subtype: action.type, promise: action.payload });
          store.dispatch({ type: _actions__WEBPACK_IMPORTED_MODULE_1__["ASYNC"].CONNECTION_ERROR, errors: action.errors });
        });
      } else {
        next(action);
      }
    };
  };
};

// Ensure the user's token was removed on logout, and added on login.
var localStorageMiddleware = function localStorageMiddleware(store) {
  return function (next) {
    return function (action) {
      if (action.type === _actions__WEBPACK_IMPORTED_MODULE_1__["AUTH"].SIGNUP || action.type === _actions__WEBPACK_IMPORTED_MODULE_1__["AUTH"].LOGIN) {
        if (!action.error) {
          window.localStorage.setItem('jwt', action.payload.user.token);
          action.token = action.payload.user.token;
          _agent__WEBPACK_IMPORTED_MODULE_0__["default"].setToken(action.payload.user.token);
        }
      } else if (action.type === _actions__WEBPACK_IMPORTED_MODULE_1__["AUTH"].LOGOUT || action.type === _actions__WEBPACK_IMPORTED_MODULE_1__["APP"].DELETE_TOKEN) {
        window.localStorage.setItem('jwt', '');
        _agent__WEBPACK_IMPORTED_MODULE_0__["default"].setToken(null);
      }
      next(action);
    };
  };
};

function isPromise(v) {
  return v && typeof v.then === 'function';
}



/***/ }),

/***/ "./client/reducers/auth.js":
/*!*********************************!*\
  !*** ./client/reducers/auth.js ***!
  \*********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _actions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../actions */ "./client/actions.js");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



var defaultInputState = {
  value: '',
  message: '',
  inputState: '',
  valid: false
};

var defaultState = {
  email: Object.assign({}, defaultInputState),
  password: Object.assign({}, defaultInputState),
  passwordConfirm: Object.assign({}, defaultInputState),
  inProgress: false,
  errors: []
};

/* harmony default export */ __webpack_exports__["default"] = (function () {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultState;
  var action = arguments[1];

  switch (action.type) {
    case _actions__WEBPACK_IMPORTED_MODULE_0__["LOAD_PAGE"].LOGIN:
    case _actions__WEBPACK_IMPORTED_MODULE_0__["LOAD_PAGE"].SIGNUP:
      return defaultState;
    case _actions__WEBPACK_IMPORTED_MODULE_0__["AUTH"].LOGIN:
    case _actions__WEBPACK_IMPORTED_MODULE_0__["AUTH"].SIGNUP:
      return Object.assign({}, state, {
        inProgress: false,
        errors: action.error ? action.payload.errors : null
      });
    case _actions__WEBPACK_IMPORTED_MODULE_0__["ASYNC"].START:
      if (action.subtype === _actions__WEBPACK_IMPORTED_MODULE_0__["AUTH"].LOGIN || action.subtype === _actions__WEBPACK_IMPORTED_MODULE_0__["AUTH"].SIGNUP) {
        return Object.assign({}, state, { inProgress: true, errors: null });
      }
      break;
    case _actions__WEBPACK_IMPORTED_MODULE_0__["ASYNC"].END:
      if (action.subtype === _actions__WEBPACK_IMPORTED_MODULE_0__["AUTH"].LOGIN || action.subtype === _actions__WEBPACK_IMPORTED_MODULE_0__["AUTH"].SIGNUP) {
        return Object.assign({}, state, { inProgress: false });
      }
      break;
    case _actions__WEBPACK_IMPORTED_MODULE_0__["AUTH"].CLOSE_ERROR:
      return Object.assign({}, state, { errors: state.errors.filter(function (item, index) {
          return action.index !== index;
        }) });
    case _actions__WEBPACK_IMPORTED_MODULE_0__["AUTH"].FIELD_ERROR:
      return Object.assign({}, state, _defineProperty({}, action.key, {
        message: action.message,
        inputState: action.inputState,
        value: action.value,
        valid: false
      }));
    case _actions__WEBPACK_IMPORTED_MODULE_0__["AUTH"].UPDATE_FIELD:
      return Object.assign({}, state, _defineProperty({}, action.key, {
        value: action.value,
        inputState: '',
        message: '',
        valid: true
      }));
    case _actions__WEBPACK_IMPORTED_MODULE_0__["ASYNC"].ERROR:
      if (action.subtype === _actions__WEBPACK_IMPORTED_MODULE_0__["AUTH"].SIGNUP || action.subtype === _actions__WEBPACK_IMPORTED_MODULE_0__["AUTH"].LOGIN) {
        return Object.assign({}, state, { errors: action.errors });
      }
      break;
    case _actions__WEBPACK_IMPORTED_MODULE_0__["UNLOAD_PAGE"].LOGIN:
    case _actions__WEBPACK_IMPORTED_MODULE_0__["UNLOAD_PAGE"].SIGNUP:
      return defaultState;
    default:
      return state;
  }
  return state;
});

/***/ }),

/***/ "./client/reducers/bookings.js":
/*!*************************************!*\
  !*** ./client/reducers/bookings.js ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _actions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../actions */ "./client/actions.js");


var defaultState = {
  reload: false,
  errors: null,
  yourBookings: [],
  loading: false
};

/* harmony default export */ __webpack_exports__["default"] = (function () {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultState;
  var action = arguments[1];

  switch (action.type) {
    case _actions__WEBPACK_IMPORTED_MODULE_0__["LOAD_PAGE"].BOOKINGS:
      return Object.assign({}, state, {
        reload: false,
        yourBookings: action.payload.bookings ? action.payload.bookings : []
      });
    case _actions__WEBPACK_IMPORTED_MODULE_0__["ASYNC"].START:
      if (action.subtype === _actions__WEBPACK_IMPORTED_MODULE_0__["BOOKINGS"].DELETE) {
        return Object.assign({}, state, {
          loading: true
        });
      }
      return Object.assign({}, state);
    case _actions__WEBPACK_IMPORTED_MODULE_0__["ASYNC"].END:
      return Object.assign({}, state, {
        loading: false
      });
    case _actions__WEBPACK_IMPORTED_MODULE_0__["BOOKINGS"].DELETE:
      return Object.assign({}, state, {
        reload: action.payload.error ? false : true,
        errors: action.payload.error ? action.payload.errors : null
      });
    case _actions__WEBPACK_IMPORTED_MODULE_0__["UNLOAD_PAGE"].BOOKINGS:
      return state;
    default:
      return state;
  }
});

/***/ }),

/***/ "./client/reducers/common.js":
/*!***********************************!*\
  !*** ./client/reducers/common.js ***!
  \***********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _actions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../actions */ "./client/actions.js");


var defaultState = {
  appName: "Bed'N'Blockchain",
  token: null,
  viewChangeCounter: 0,
  errors: [],
  search: {
    loading: false,
    value: '',
    results: []
  }
};

/* harmony default export */ __webpack_exports__["default"] = (function () {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultState;
  var action = arguments[1];

  switch (action.type) {
    case _actions__WEBPACK_IMPORTED_MODULE_0__["APP"].CLOSE_ERROR:
      return Object.assign({}, state, {
        errors: state.errors.filter(function (item, index) {
          return action.index !== index;
        })
      });
    case _actions__WEBPACK_IMPORTED_MODULE_0__["ASYNC"].CONNECTION_ERROR:
      return Object.assign({}, state, {
        errors: action.errors || []
      });
    case _actions__WEBPACK_IMPORTED_MODULE_0__["ASYNC"].ERROR:
      if (action.subtype === _actions__WEBPACK_IMPORTED_MODULE_0__["APP"].LOAD) {
        return Object.assign({}, state, {
          token: null,
          appLoaded: true,
          currentUser: null,
          errors: action.errors
        });
      }
      return Object.assign({}, state);
    case _actions__WEBPACK_IMPORTED_MODULE_0__["APP"].LOAD:
      return Object.assign({}, state, {
        token: action.token || null,
        appLoaded: true,
        currentUser: action.payload ? action.payload.user : null,
        errors: action.error ? action.errors : []
      });
    case _actions__WEBPACK_IMPORTED_MODULE_0__["APP"].REDIRECT:
      return Object.assign({}, state, { redirectTo: null });
    case _actions__WEBPACK_IMPORTED_MODULE_0__["AUTH"].LOGOUT:
      return Object.assign({}, state, { redirectTo: '/', token: null, currentUser: null });
    case _actions__WEBPACK_IMPORTED_MODULE_0__["ROOMS"].ADD:
      return Object.assign({}, state, {
        redirectTo: action.error ? null : '/your-rooms'
      });
    case _actions__WEBPACK_IMPORTED_MODULE_0__["AUTH"].LOGIN:
    case _actions__WEBPACK_IMPORTED_MODULE_0__["AUTH"].SIGNUP:
      return Object.assign({}, state, {
        redirectTo: action.error ? null : '/bookings',
        token: action.error ? null : action.payload.user.token,
        currentUser: action.error ? null : action.payload.user
      });
    default:
      return Object.assign({}, state);
  }
});

/***/ }),

/***/ "./client/reducers/home.js":
/*!*********************************!*\
  !*** ./client/reducers/home.js ***!
  \*********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _actions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../actions */ "./client/actions.js");


/* harmony default export */ __webpack_exports__["default"] = (function () {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var action = arguments[1];

  switch (action.type) {
    case _actions__WEBPACK_IMPORTED_MODULE_0__["LOAD_PAGE"].HOME:
      return state;
    case _actions__WEBPACK_IMPORTED_MODULE_0__["UNLOAD_PAGE"].HOME:
      return {};
    default:
      return state;
  }
});

/***/ }),

/***/ "./client/reducers/index.js":
/*!**********************************!*\
  !*** ./client/reducers/index.js ***!
  \**********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var redux__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! redux */ "redux");
/* harmony import */ var redux__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(redux__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_router_redux__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-router-redux */ "react-router-redux");
/* harmony import */ var react_router_redux__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_router_redux__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _auth__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./auth */ "./client/reducers/auth.js");
/* harmony import */ var _common__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./common */ "./client/reducers/common.js");
/* harmony import */ var _home__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./home */ "./client/reducers/home.js");
/* harmony import */ var _rooms__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./rooms */ "./client/reducers/rooms.js");
/* harmony import */ var _roomEditor__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./roomEditor */ "./client/reducers/roomEditor.js");
/* harmony import */ var _bookings__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./bookings */ "./client/reducers/bookings.js");








// import profile from './profile';
// import settings from './settings';

/* harmony default export */ __webpack_exports__["default"] = (Object(redux__WEBPACK_IMPORTED_MODULE_0__["combineReducers"])({
  auth: _auth__WEBPACK_IMPORTED_MODULE_2__["default"],
  common: _common__WEBPACK_IMPORTED_MODULE_3__["default"],
  home: _home__WEBPACK_IMPORTED_MODULE_4__["default"],
  rooms: _rooms__WEBPACK_IMPORTED_MODULE_5__["default"],
  roomEditor: _roomEditor__WEBPACK_IMPORTED_MODULE_6__["default"],
  bookings: _bookings__WEBPACK_IMPORTED_MODULE_7__["default"],
  // profile,
  // settings,
  router: react_router_redux__WEBPACK_IMPORTED_MODULE_1__["routerReducer"]
}));

/***/ }),

/***/ "./client/reducers/roomEditor.js":
/*!***************************************!*\
  !*** ./client/reducers/roomEditor.js ***!
  \***************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _actions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../actions */ "./client/actions.js");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



var defaultInputState = {
	value: '',
	message: '',
	inputState: '',
	valid: false
};

var defaultState = {
	mode: 'add',
	message: '',
	title: Object.assign({}, defaultInputState),
	desc: Object.assign({}, defaultInputState),
	propertyType: Object.assign({}, defaultInputState),
	roomType: Object.assign({}, defaultInputState),
	location: Object.assign({}, defaultInputState, {
		loading: false,
		results: [],
		value: { lat: 0, lng: 0, formatted_address: '' }
	}),
	price: Object.assign({}, defaultInputState),
	guests: { value: { adults: 0, children: 0 } },
	featuredImage: Object.assign({}, defaultInputState, {
		value: {
			file_id: '',
			image: '',
			file_name: ''
		},
		loading: false,
		message: '',
		inputState: '',
		valid: false
	}),
	dates: {
		value: [],
		message: '',
		inputState: '',
		types: 'range',
		valid: false,
		active: false
	}
};

/* harmony default export */ __webpack_exports__["default"] = (function () {
	var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultState;
	var action = arguments[1];

	switch (action.type) {
		case _actions__WEBPACK_IMPORTED_MODULE_0__["ROOMS"].ADD:
			return Object.assign({}, state, {
				inProgress: false,
				errors: action.error ? action.payload.errors : null
			});

		case _actions__WEBPACK_IMPORTED_MODULE_0__["ROOMS"].EDIT:
			return Object.assign({}, state, {
				inProgress: false,
				errors: action.error ? action.payload.errors : null,
				message: 'Room Updated Successfully!'
			});
		case _actions__WEBPACK_IMPORTED_MODULE_0__["LOAD_PAGE"].ROOMEDITOR:
			if (action.mode === 'edit') {
				return Object.assign({}, state, {
					mode: 'edit',
					title: Object.assign({}, state.title, {
						value: action.payload.room.title,
						valid: true
					}),
					desc: Object.assign({}, state.desc, {
						value: action.payload.room.description,
						valid: true
					}),
					propertyType: Object.assign({}, state.propertyType, {
						value: action.payload.room.propertyType,
						valid: true
					}),
					roomType: Object.assign({}, state.roomType, {
						value: action.payload.room.roomType,
						valid: true
					}),
					location: Object.assign({}, state.location, {
						value: action.payload.room.location,
						valid: true
					}),
					price: Object.assign({}, state.price, {
						value: action.payload.room.price,
						valid: true
					}),
					guests: Object.assign({}, state.guests, {
						value: action.payload.room.guests,
						valid: true
					}),
					featuredImage: Object.assign({}, state.featuredImage, {
						value: Object.assign({}, state.featuredImage.value, {
							file_id: action.payload.room.featuredImageId
						}),
						valid: true
					})

				});
			} else {
				return Object.assign({}, state, {
					mode: 'add'
				});
			}
		case _actions__WEBPACK_IMPORTED_MODULE_0__["ROOMEDITOR"].INCREMENT_GUESTS:
			return Object.assign({}, state, {
				guests: Object.assign({}, state.guests, {
					value: Object.assign({}, state.guests.value, _defineProperty({}, action.guestType, ++state.guests.value[action.guestType]))
				})
			});
		case _actions__WEBPACK_IMPORTED_MODULE_0__["ROOMEDITOR"].DECREMENT_GUESTS:
			return Object.assign({}, state, {
				guests: Object.assign({}, state.guests, {
					value: Object.assign({}, state.guests.value, _defineProperty({}, action.guestType, state.guests.value[action.guestType] <= 0 ? 0 : --state.guests.value[action.guestType]))
				})
			});
		case _actions__WEBPACK_IMPORTED_MODULE_0__["ROOMEDITOR"].FIELD_ERROR:
			return Object.assign({}, state, _defineProperty({}, action.key, {
				value: action.value,
				inputState: action.inputState,
				message: action.message,
				valid: false
			}));
		case _actions__WEBPACK_IMPORTED_MODULE_0__["ROOMEDITOR"].UPDATE_FIELD:
			if (action.key === 'location') {
				return Object.assign({}, state, {
					location: Object.assign({}, state.location, {
						value: Object.assign({}, state.location.value, { formatted_address: action.value }),
						inputState: '',
						message: '',
						valid: true
					})
				});
			} else {
				return Object.assign({}, state, _defineProperty({}, action.key, {
					value: action.value,
					inputState: '',
					message: '',
					valid: true
				}));
			}
		case _actions__WEBPACK_IMPORTED_MODULE_0__["ROOMEDITOR"].FETCH_GMAPS_RESULTS:
			return Object.assign({}, state, {
				location: Object.assign({}, state.location, {
					results: action.payload.results
				})
			});
		case _actions__WEBPACK_IMPORTED_MODULE_0__["ROOMEDITOR"].UPDATE_LOCATION_FROM_SUGGESTION:
			return Object.assign({}, state, {
				location: Object.assign({}, state.location, {
					results: [],
					value: {
						formatted_address: action.value.formatted_address,
						lat: action.value.lat,
						lng: action.value.lng
					}
				})
			});
		case _actions__WEBPACK_IMPORTED_MODULE_0__["ROOMEDITOR"].UPLOAD_FEATURED_IMAGE:
			return Object.assign({}, state, {
				featuredImage: Object.assign({}, state.featuredImage, {
					value: Object.assign({}, state.featuredImage.value, {
						file_id: action.payload.file.file_id,
						file_name: action.payload.file.file_name
					}),
					inputState: 'is-success',
					message: 'Upload Successful!',
					valid: true
				})
			});

		case _actions__WEBPACK_IMPORTED_MODULE_0__["ASYNC"].START:
			if (action.subtype === _actions__WEBPACK_IMPORTED_MODULE_0__["ROOMEDITOR"].FETCH_GMAPS_RESULTS) {
				return Object.assign({}, state, {
					location: Object.assign({}, state.location, {
						loading: true
					})
				});
			} else if (action.subtype === _actions__WEBPACK_IMPORTED_MODULE_0__["ROOMEDITOR"].UPLOAD_FEATURED_IMAGE) {
				return Object.assign({}, state, {
					featuredImage: Object.assign({}, state.featuredImage, {
						loading: true,
						message: 'Uploading...'
					})
				});
			} else {
				return Object.assign({}, state);
			}
		case _actions__WEBPACK_IMPORTED_MODULE_0__["ASYNC"].END:
			return Object.assign({}, state, {
				location: Object.assign({}, state.location, {
					loading: false
				}),
				featuredImage: Object.assign({}, state.featuredImage, {
					loading: false
				})
			});
		case _actions__WEBPACK_IMPORTED_MODULE_0__["ASYNC"].ERROR:
			if (action.subtype === _actions__WEBPACK_IMPORTED_MODULE_0__["ROOMEDITOR"].FETCH_GMAPS_RESULTS) {
				return Object.assign({}, state, {
					errors: action.errors
				});
			} else if (action.subtype === _actions__WEBPACK_IMPORTED_MODULE_0__["ROOMEDITOR"].UPLOAD_FEATURED_IMAGE) {
				return Object.assign({}, state, {
					errors: action.errors
				});
			} else {
				return state;
			}
		case _actions__WEBPACK_IMPORTED_MODULE_0__["UNLOAD_PAGE"].ROOMEDITOR:
			return defaultState;
		default:
			return state;
	}
});

/***/ }),

/***/ "./client/reducers/rooms.js":
/*!**********************************!*\
  !*** ./client/reducers/rooms.js ***!
  \**********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _actions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../actions */ "./client/actions.js");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



var defaultState = {
  reload: false,
  roomsList: [],
  currentRoomInView: null,
  yourRooms: [],
  errors: null,
  loading: false,
  guests: {
    value: { adults: 0, children: 0 },
    message: '',
    inputState: '',
    valid: false
  },
  dates: {
    value: [],
    message: '',
    inputState: '',
    valid: false,
    active: false
  }
};

/* harmony default export */ __webpack_exports__["default"] = (function () {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultState;
  var action = arguments[1];

  switch (action.type) {
    case _actions__WEBPACK_IMPORTED_MODULE_0__["LOAD_PAGE"].ROOM:
      return Object.assign({}, state, {
        reload: false,
        currentRoomInView: action.payload.room
      });
    case _actions__WEBPACK_IMPORTED_MODULE_0__["LOAD_PAGE"].HOME:
    case _actions__WEBPACK_IMPORTED_MODULE_0__["LOAD_PAGE"].ROOMS:
      return Object.assign({}, state, {
        reload: false,
        currentRoomInView: null,
        roomsList: action.payload.rooms ? action.payload.rooms : []
      });
    case _actions__WEBPACK_IMPORTED_MODULE_0__["LOAD_PAGE"].YOURROOMS:
      return Object.assign({}, state, {
        reload: false,
        currentRoomInView: null,
        yourRooms: action.payload.rooms ? action.payload.rooms : []
      });

    case _actions__WEBPACK_IMPORTED_MODULE_0__["ASYNC"].START:
      if (action.subtype === _actions__WEBPACK_IMPORTED_MODULE_0__["ROOMS"].DELETE || action.subtype === _actions__WEBPACK_IMPORTED_MODULE_0__["ROOMS"].BOOK) {
        return Object.assign({}, state, {
          loading: true
        });
      }
      return state;
    case _actions__WEBPACK_IMPORTED_MODULE_0__["ASYNC"].END:
      return Object.assign({}, state, {
        loading: false,
        reload: false
      });
    case _actions__WEBPACK_IMPORTED_MODULE_0__["ASYNC"].CONNECTION_ERROR:
      return Object.assign({}, state, {
        loading: false,
        reload: false
      });
    case _actions__WEBPACK_IMPORTED_MODULE_0__["ROOMS"].INCREMENT_GUESTS:
      return Object.assign({}, state, {
        guests: Object.assign({}, state.guests, {
          value: Object.assign({}, state.guests.value, _defineProperty({}, action.guestType, ++state.guests.value[action.guestType])),
          valid: true
        })
      });
    case _actions__WEBPACK_IMPORTED_MODULE_0__["ROOMS"].DECREMENT_GUESTS:
      return Object.assign({}, state, {
        guests: Object.assign({}, state.guests, {
          value: Object.assign({}, state.guests.value, _defineProperty({}, action.guestType, state.guests.value[action.guestType] <= 0 ? 0 : --state.guests.value[action.guestType])),
          valid: state.guests.value.children > 0 || state.guests.value.adults > 0 ? true : false
        })
      });
    case _actions__WEBPACK_IMPORTED_MODULE_0__["ROOMS"].SELECT_DATES:
      return Object.assign({}, state, {
        dates: Object.assign({}, state.dates, {
          value: action.dates
        })
      });
    case _actions__WEBPACK_IMPORTED_MODULE_0__["ROOMS"].DELETE:
    case _actions__WEBPACK_IMPORTED_MODULE_0__["ROOMS"].BOOK:
      return Object.assign({}, state, {
        // reload: action.payload.error ? false : true,
        errors: action.payload.error ? action.payload.errors : null
      });
    case _actions__WEBPACK_IMPORTED_MODULE_0__["UNLOAD_PAGE"].ROOMS:
    case _actions__WEBPACK_IMPORTED_MODULE_0__["UNLOAD_PAGE"].ROOM:
    case _actions__WEBPACK_IMPORTED_MODULE_0__["UNLOAD_PAGE"].YOURROOMS:
      return Object.assign({}, state, {
        guests: {
          value: { adults: 0, children: 0 },
          message: '',
          inputState: '',
          valid: false
        }
      });

    default:
      return state;
  }
});

/***/ }),

/***/ "./client/store.js":
/*!*************************!*\
  !*** ./client/store.js ***!
  \*************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return setupStore; });
/* harmony import */ var redux__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! redux */ "redux");
/* harmony import */ var redux__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(redux__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_router_redux__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-router-redux */ "react-router-redux");
/* harmony import */ var react_router_redux__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_router_redux__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _middleware__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./middleware */ "./client/middleware.js");
/* harmony import */ var _reducers___WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./reducers/ */ "./client/reducers/index.js");





function setupStore(history) {
  var middleware = [Object(react_router_redux__WEBPACK_IMPORTED_MODULE_1__["routerMiddleware"])(history), _middleware__WEBPACK_IMPORTED_MODULE_2__["promiseMiddleware"], _middleware__WEBPACK_IMPORTED_MODULE_2__["localStorageMiddleware"]];

  if (true) {
    var _require = __webpack_require__(/*! redux-devtools-extension */ "redux-devtools-extension"),
        composeWithDevTools = _require.composeWithDevTools;

    var _require2 = __webpack_require__(/*! redux-logger */ "redux-logger"),
        createLogger = _require2.createLogger;

    var enhancer = composeWithDevTools(redux__WEBPACK_IMPORTED_MODULE_0__["applyMiddleware"].apply(undefined, middleware.concat([createLogger()])));
    var store = Object(redux__WEBPACK_IMPORTED_MODULE_0__["createStore"])(_reducers___WEBPACK_IMPORTED_MODULE_3__["default"], enhancer);

    if (true) {
      module.hot.accept(/*! ./reducers/ */ "./client/reducers/index.js", function(__WEBPACK_OUTDATED_DEPENDENCIES__) { /* harmony import */ _reducers___WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./reducers/ */ "./client/reducers/index.js");
(function () {
        var nextRootReducer = __webpack_require__(/*! ./reducers/ */ "./client/reducers/index.js").default;
        store.replaceReducer(nextRootReducer);
      })(__WEBPACK_OUTDATED_DEPENDENCIES__); });
    }

    return store;
  }

  return redux__WEBPACK_IMPORTED_MODULE_0__["applyMiddleware"].apply(undefined, middleware)(redux__WEBPACK_IMPORTED_MODULE_0__["createStore"])(_reducers___WEBPACK_IMPORTED_MODULE_3__["default"]);
}

/***/ }),

/***/ "./client/styles/styles.scss":
/*!***********************************!*\
  !*** ./client/styles/styles.scss ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./config/webpack.client.dev.js":
/*!**************************************!*\
  !*** ./config/webpack.client.dev.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var path = __webpack_require__(/*! path */ "path");
var webpack = __webpack_require__(/*! webpack */ "webpack");
var MiniCssExtractPlugin = __webpack_require__(/*! mini-css-extract-plugin */ "mini-css-extract-plugin");
var autoprefixer = __webpack_require__(/*! autoprefixer */ "autoprefixer");

module.exports = {
  devtool: 'cheap-module-source-map',
  target: 'web',
  mode: 'development',
  entry: ['babel-polyfill', 'webpack-hot-middleware/client?timeout=2000', path.resolve('./client/index.js')],
  output: {
    path: path.resolve('.build'),
    filename: 'client.js',
    publicPath: '/'
  },
  resolve: {
    modules: [path.resolve('../client'), // to resolve path liek '/components' on client
    'node_modules']
  },
  module: {
    rules: [{
      test: /\.js$/,
      use: ['babel-loader'],
      exclude: /node_modules/
    }, {
      test: /\.md$/,
      use: 'raw-loader'
    }, {
      test: /\.s?css$/,
      use: [MiniCssExtractPlugin.loader, {
        loader: 'css-loader'
      }, {
        loader: 'resolve-url-loader'
      }, {
        loader: 'sass-loader'
      }, {
        loader: 'postcss-loader',
        options: {
          autoprefixer: {
            browsers: ['last 2 versions']
          },
          plugins: function plugins() {
            return [autoprefixer];
          }
        }
      }]
    }, {
      test: /\.(png|jpg|jpeg|gif|woff|woff2|svg|eot|ttf|otf|wav|mp3)$/,
      use: [{
        loader: 'file-loader',
        options: {
          name: '[path][name]_[hash:base64:5].[ext]'
        }
      }]
    }]
  },
  plugins: [new MiniCssExtractPlugin({
    filename: '[name].css',
    chunkFilename: '[id].css'
  }), new webpack.HotModuleReplacementPlugin(), new webpack.NamedModulesPlugin(), new webpack.NoEmitOnErrorsPlugin(), new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify('development')
    }
  })],
  stats: {
    colors: true,
    modules: false,
    version: false,
    hash: false,
    timings: false
  }
};

/***/ }),

/***/ "./node_modules/webpack/hot/log-apply-result.js":
/*!*****************************************!*\
  !*** (webpack)/hot/log-apply-result.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
module.exports = function(updatedModules, renewedModules) {
	var unacceptedModules = updatedModules.filter(function(moduleId) {
		return renewedModules && renewedModules.indexOf(moduleId) < 0;
	});
	var log = __webpack_require__(/*! ./log */ "./node_modules/webpack/hot/log.js");

	if (unacceptedModules.length > 0) {
		log(
			"warning",
			"[HMR] The following modules couldn't be hot updated: (They would need a full reload!)"
		);
		unacceptedModules.forEach(function(moduleId) {
			log("warning", "[HMR]  - " + moduleId);
		});
	}

	if (!renewedModules || renewedModules.length === 0) {
		log("info", "[HMR] Nothing hot updated.");
	} else {
		log("info", "[HMR] Updated modules:");
		renewedModules.forEach(function(moduleId) {
			if (typeof moduleId === "string" && moduleId.indexOf("!") !== -1) {
				var parts = moduleId.split("!");
				log.groupCollapsed("info", "[HMR]  - " + parts.pop());
				log("info", "[HMR]  - " + moduleId);
				log.groupEnd("info");
			} else {
				log("info", "[HMR]  - " + moduleId);
			}
		});
		var numberIds = renewedModules.every(function(moduleId) {
			return typeof moduleId === "number";
		});
		if (numberIds)
			log(
				"info",
				"[HMR] Consider using the NamedModulesPlugin for module names."
			);
	}
};


/***/ }),

/***/ "./node_modules/webpack/hot/log.js":
/*!****************************!*\
  !*** (webpack)/hot/log.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

var logLevel = "info";

function dummy() {}

function shouldLog(level) {
	var shouldLog =
		(logLevel === "info" && level === "info") ||
		(["info", "warning"].indexOf(logLevel) >= 0 && level === "warning") ||
		(["info", "warning", "error"].indexOf(logLevel) >= 0 && level === "error");
	return shouldLog;
}

function logGroup(logFn) {
	return function(level, msg) {
		if (shouldLog(level)) {
			logFn(msg);
		}
	};
}

module.exports = function(level, msg) {
	if (shouldLog(level)) {
		if (level === "info") {
			console.log(msg);
		} else if (level === "warning") {
			console.warn(msg);
		} else if (level === "error") {
			console.error(msg);
		}
	}
};

var group = console.group || dummy;
var groupCollapsed = console.groupCollapsed || dummy;
var groupEnd = console.groupEnd || dummy;

module.exports.group = logGroup(group);

module.exports.groupCollapsed = logGroup(groupCollapsed);

module.exports.groupEnd = logGroup(groupEnd);

module.exports.setLogLevel = function(level) {
	logLevel = level;
};


/***/ }),

/***/ "./node_modules/webpack/hot/poll.js?1000":
/*!**********************************!*\
  !*** (webpack)/hot/poll.js?1000 ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(__resourceQuery) {/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
/*globals __resourceQuery */
if (true) {
	var hotPollInterval = +__resourceQuery.substr(1) || 10 * 60 * 1000;
	var log = __webpack_require__(/*! ./log */ "./node_modules/webpack/hot/log.js");

	var checkForUpdate = function checkForUpdate(fromUpdate) {
		if (module.hot.status() === "idle") {
			module.hot
				.check(true)
				.then(function(updatedModules) {
					if (!updatedModules) {
						if (fromUpdate) log("info", "[HMR] Update applied.");
						return;
					}
					__webpack_require__(/*! ./log-apply-result */ "./node_modules/webpack/hot/log-apply-result.js")(updatedModules, updatedModules);
					checkForUpdate(true);
				})
				.catch(function(err) {
					var status = module.hot.status();
					if (["abort", "fail"].indexOf(status) >= 0) {
						log("warning", "[HMR] Cannot apply update.");
						log("warning", "[HMR] " + err.stack || err.message);
						log("warning", "[HMR] You need to restart the application!");
					} else {
						log("warning", "[HMR] Update failed: " + err.stack || err.message);
					}
				});
		}
	};
	setInterval(checkForUpdate, hotPollInterval);
} else {}

/* WEBPACK VAR INJECTION */}.call(this, "?1000"))

/***/ }),

/***/ 0:
/*!**************************************************************!*\
  !*** multi babel-polyfill webpack/hot/poll?1000 ./api/index ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! babel-polyfill */"babel-polyfill");
__webpack_require__(/*! webpack/hot/poll?1000 */"./node_modules/webpack/hot/poll.js?1000");
module.exports = __webpack_require__(/*! C:\NODE\BedNBlockchainV5\api\index */"./api/index.js");


/***/ }),

/***/ "autoprefixer":
/*!*******************************!*\
  !*** external "autoprefixer" ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("autoprefixer");

/***/ }),

/***/ "babel-polyfill":
/*!*********************************!*\
  !*** external "babel-polyfill" ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("babel-polyfill");

/***/ }),

/***/ "bcrypt":
/*!*************************!*\
  !*** external "bcrypt" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("bcrypt");

/***/ }),

/***/ "body-parser":
/*!******************************!*\
  !*** external "body-parser" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("body-parser");

/***/ }),

/***/ "cors":
/*!***********************!*\
  !*** external "cors" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("cors");

/***/ }),

/***/ "envalid":
/*!**************************!*\
  !*** external "envalid" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("envalid");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),

/***/ "express-session":
/*!**********************************!*\
  !*** external "express-session" ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("express-session");

/***/ }),

/***/ "express-validator/check":
/*!******************************************!*\
  !*** external "express-validator/check" ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("express-validator/check");

/***/ }),

/***/ "express-validator/filter":
/*!*******************************************!*\
  !*** external "express-validator/filter" ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("express-validator/filter");

/***/ }),

/***/ "gridfs-stream":
/*!********************************!*\
  !*** external "gridfs-stream" ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("gridfs-stream");

/***/ }),

/***/ "history/createMemoryHistory":
/*!**********************************************!*\
  !*** external "history/createMemoryHistory" ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("history/createMemoryHistory");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("http");

/***/ }),

/***/ "jsonwebtoken":
/*!*******************************!*\
  !*** external "jsonwebtoken" ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("jsonwebtoken");

/***/ }),

/***/ "mini-css-extract-plugin":
/*!******************************************!*\
  !*** external "mini-css-extract-plugin" ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("mini-css-extract-plugin");

/***/ }),

/***/ "moment":
/*!*************************!*\
  !*** external "moment" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("moment");

/***/ }),

/***/ "mongoose":
/*!***************************!*\
  !*** external "mongoose" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("mongoose");

/***/ }),

/***/ "mongoose-validators":
/*!**************************************!*\
  !*** external "mongoose-validators" ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("mongoose-validators");

/***/ }),

/***/ "morgan":
/*!*************************!*\
  !*** external "morgan" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("morgan");

/***/ }),

/***/ "multer":
/*!*************************!*\
  !*** external "multer" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("multer");

/***/ }),

/***/ "passport":
/*!***************************!*\
  !*** external "passport" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("passport");

/***/ }),

/***/ "passport-local":
/*!*********************************!*\
  !*** external "passport-local" ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("passport-local");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("react");

/***/ }),

/***/ "react-dom/server":
/*!***********************************!*\
  !*** external "react-dom/server" ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("react-dom/server");

/***/ }),

/***/ "react-redux":
/*!******************************!*\
  !*** external "react-redux" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("react-redux");

/***/ }),

/***/ "react-router-dom":
/*!***********************************!*\
  !*** external "react-router-dom" ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("react-router-dom");

/***/ }),

/***/ "react-router-redux":
/*!*************************************!*\
  !*** external "react-router-redux" ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("react-router-redux");

/***/ }),

/***/ "react-router-transition":
/*!******************************************!*\
  !*** external "react-router-transition" ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("react-router-transition");

/***/ }),

/***/ "redux":
/*!************************!*\
  !*** external "redux" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("redux");

/***/ }),

/***/ "redux-devtools-extension":
/*!*******************************************!*\
  !*** external "redux-devtools-extension" ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("redux-devtools-extension");

/***/ }),

/***/ "redux-logger":
/*!*******************************!*\
  !*** external "redux-logger" ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("redux-logger");

/***/ }),

/***/ "superagent":
/*!*****************************!*\
  !*** external "superagent" ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("superagent");

/***/ }),

/***/ "superagent-promise":
/*!*************************************!*\
  !*** external "superagent-promise" ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("superagent-promise");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("util");

/***/ }),

/***/ "uuid/v4":
/*!**************************!*\
  !*** external "uuid/v4" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("uuid/v4");

/***/ }),

/***/ "webpack":
/*!**************************!*\
  !*** external "webpack" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("webpack");

/***/ }),

/***/ "webpack-dev-middleware-webpack-2":
/*!***************************************************!*\
  !*** external "webpack-dev-middleware-webpack-2" ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("webpack-dev-middleware-webpack-2");

/***/ }),

/***/ "webpack-hot-middleware":
/*!*****************************************!*\
  !*** external "webpack-hot-middleware" ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("webpack-hot-middleware");

/***/ })

/******/ });
//# sourceMappingURL=server.js.map