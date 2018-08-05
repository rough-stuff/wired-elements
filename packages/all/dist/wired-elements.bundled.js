var WiredElements = (function (exports) {
  'use strict';

  /**
  @license
  Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
  This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
  The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
  The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
  Code distributed by Google as part of the polymer project is also
  subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
  */

  window.JSCompiler_renameProperty = function(prop) { return prop; };

  /**
  @license
  Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
  This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
  The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
  The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
  Code distributed by Google as part of the polymer project is also
  subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
  */

  // unique global id for deduping mixins.
  let dedupeId = 0;

  /* eslint-disable valid-jsdoc */
  /**
   * Wraps an ES6 class expression mixin such that the mixin is only applied
   * if it has not already been applied its base argument. Also memoizes mixin
   * applications.
   *
   * @template T
   * @param {T} mixin ES6 class expression mixin to wrap
   * @return {T}
   * @suppress {invalidCasts}
   */
  const dedupingMixin = function(mixin) {
    let mixinApplications = /** @type {!MixinFunction} */(mixin).__mixinApplications;
    if (!mixinApplications) {
      mixinApplications = new WeakMap();
      /** @type {!MixinFunction} */(mixin).__mixinApplications = mixinApplications;
    }
    // maintain a unique id for each mixin
    let mixinDedupeId = dedupeId++;
    function dedupingMixin(base) {
      let baseSet = /** @type {!MixinFunction} */(base).__mixinSet;
      if (baseSet && baseSet[mixinDedupeId]) {
        return base;
      }
      let map = mixinApplications;
      let extended = map.get(base);
      if (!extended) {
        extended = /** @type {!Function} */(mixin)(base);
        map.set(base, extended);
      }
      // copy inherited mixin set from the extended class, or the base class
      // NOTE: we avoid use of Set here because some browser (IE11)
      // cannot extend a base Set via the constructor.
      let mixinSet = Object.create(/** @type {!MixinFunction} */(extended).__mixinSet || baseSet || null);
      mixinSet[mixinDedupeId] = true;
      /** @type {!MixinFunction} */(extended).__mixinSet = mixinSet;
      return extended;
    }

    return /** @type {T} */ (dedupingMixin);
  };
  /* eslint-enable valid-jsdoc */

  /**
  @license
  Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
  This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
  The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
  The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
  Code distributed by Google as part of the polymer project is also
  subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
  */

  // Microtask implemented using Mutation Observer
  let microtaskCurrHandle = 0;
  let microtaskLastHandle = 0;
  let microtaskCallbacks = [];
  let microtaskNodeContent = 0;
  let microtaskNode = document.createTextNode('');
  new window.MutationObserver(microtaskFlush).observe(microtaskNode, {characterData: true});

  function microtaskFlush() {
    const len = microtaskCallbacks.length;
    for (let i = 0; i < len; i++) {
      let cb = microtaskCallbacks[i];
      if (cb) {
        try {
          cb();
        } catch (e) {
          setTimeout(() => { throw e; });
        }
      }
    }
    microtaskCallbacks.splice(0, len);
    microtaskLastHandle += len;
  }

  /**
   * Async interface wrapper around `setTimeout`.
   *
   * @namespace
   * @summary Async interface wrapper around `setTimeout`.
   */
  const timeOut = {
    /**
     * Returns a sub-module with the async interface providing the provided
     * delay.
     *
     * @memberof timeOut
     * @param {number=} delay Time to wait before calling callbacks in ms
     * @return {!AsyncInterface} An async timeout interface
     */
    after(delay) {
      return {
        run(fn) { return window.setTimeout(fn, delay); },
        cancel(handle) {
          window.clearTimeout(handle);
        }
      };
    },
    /**
     * Enqueues a function called in the next task.
     *
     * @memberof timeOut
     * @param {!Function} fn Callback to run
     * @param {number=} delay Delay in milliseconds
     * @return {number} Handle used for canceling task
     */
    run(fn, delay) {
      return window.setTimeout(fn, delay);
    },
    /**
     * Cancels a previously enqueued `timeOut` callback.
     *
     * @memberof timeOut
     * @param {number} handle Handle returned from `run` of callback to cancel
     * @return {void}
     */
    cancel(handle) {
      window.clearTimeout(handle);
    }
  };

  /**
   * Async interface for enqueuing callbacks that run at microtask timing.
   *
   * Note that microtask timing is achieved via a single `MutationObserver`,
   * and thus callbacks enqueued with this API will all run in a single
   * batch, and not interleaved with other microtasks such as promises.
   * Promises are avoided as an implementation choice for the time being
   * due to Safari bugs that cause Promises to lack microtask guarantees.
   *
   * @namespace
   * @summary Async interface for enqueuing callbacks that run at microtask
   *   timing.
   */
  const microTask = {

    /**
     * Enqueues a function called at microtask timing.
     *
     * @memberof microTask
     * @param {!Function=} callback Callback to run
     * @return {number} Handle used for canceling task
     */
    run(callback) {
      microtaskNode.textContent = microtaskNodeContent++;
      microtaskCallbacks.push(callback);
      return microtaskCurrHandle++;
    },

    /**
     * Cancels a previously enqueued `microTask` callback.
     *
     * @memberof microTask
     * @param {number} handle Handle returned from `run` of callback to cancel
     * @return {void}
     */
    cancel(handle) {
      const idx = handle - microtaskLastHandle;
      if (idx >= 0) {
        if (!microtaskCallbacks[idx]) {
          throw new Error('invalid async handle: ' + handle);
        }
        microtaskCallbacks[idx] = null;
      }
    }

  };

  /**
  @license
  Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
  This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
  The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
  The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
  Code distributed by Google as part of the polymer project is also
  subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
  */

  /** @const {!AsyncInterface} */
  const microtask = microTask;

  /**
   * Element class mixin that provides basic meta-programming for creating one
   * or more property accessors (getter/setter pair) that enqueue an async
   * (batched) `_propertiesChanged` callback.
   *
   * For basic usage of this mixin, call `MyClass.createProperties(props)`
   * once at class definition time to create property accessors for properties
   * named in props, implement `_propertiesChanged` to react as desired to
   * property changes, and implement `static get observedAttributes()` and
   * include lowercase versions of any property names that should be set from
   * attributes. Last, call `this._enableProperties()` in the element's
   * `connectedCallback` to enable the accessors.
   *
   * @mixinFunction
   * @polymer
   * @summary Element class mixin for reacting to property changes from
   *   generated property accessors.
   */
  const PropertiesChanged = dedupingMixin(superClass => {

    /**
     * @polymer
     * @mixinClass
     * @extends {superClass}
     * @implements {Polymer_PropertiesChanged}
     * @unrestricted
     */
    class PropertiesChanged extends superClass {

      /**
       * Creates property accessors for the given property names.
       * @param {!Object} props Object whose keys are names of accessors.
       * @return {void}
       * @protected
       */
      static createProperties(props) {
        const proto = this.prototype;
        for (let prop in props) {
          // don't stomp an existing accessor
          if (!(prop in proto)) {
            proto._createPropertyAccessor(prop);
          }
        }
      }

      /**
       * Returns an attribute name that corresponds to the given property.
       * The attribute name is the lowercased property name. Override to
       * customize this mapping.
       * @param {string} property Property to convert
       * @return {string} Attribute name corresponding to the given property.
       *
       * @protected
       */
      static attributeNameForProperty(property) {
        return property.toLowerCase();
      }

      /**
       * Override point to provide a type to which to deserialize a value to
       * a given property.
       * @param {string} name Name of property
       *
       * @protected
       */
      static typeForProperty(name) { } //eslint-disable-line no-unused-vars

      /**
       * Creates a setter/getter pair for the named property with its own
       * local storage.  The getter returns the value in the local storage,
       * and the setter calls `_setProperty`, which updates the local storage
       * for the property and enqueues a `_propertiesChanged` callback.
       *
       * This method may be called on a prototype or an instance.  Calling
       * this method may overwrite a property value that already exists on
       * the prototype/instance by creating the accessor.
       *
       * @param {string} property Name of the property
       * @param {boolean=} readOnly When true, no setter is created; the
       *   protected `_setProperty` function must be used to set the property
       * @return {void}
       * @protected
       */
      _createPropertyAccessor(property, readOnly) {
        this._addPropertyToAttributeMap(property);
        if (!this.hasOwnProperty('__dataHasAccessor')) {
          this.__dataHasAccessor = Object.assign({}, this.__dataHasAccessor);
        }
        if (!this.__dataHasAccessor[property]) {
          this.__dataHasAccessor[property] = true;
          this._definePropertyAccessor(property, readOnly);
        }
      }

      /**
       * Adds the given `property` to a map matching attribute names
       * to property names, using `attributeNameForProperty`. This map is
       * used when deserializing attribute values to properties.
       *
       * @param {string} property Name of the property
       */
      _addPropertyToAttributeMap(property) {
        if (!this.hasOwnProperty('__dataAttributes')) {
          this.__dataAttributes = Object.assign({}, this.__dataAttributes);
        }
        if (!this.__dataAttributes[property]) {
          const attr = this.constructor.attributeNameForProperty(property);
          this.__dataAttributes[attr] = property;
        }
      }

      /**
       * Defines a property accessor for the given property.
       * @param {string} property Name of the property
       * @param {boolean=} readOnly When true, no setter is created
       * @return {void}
       */
       _definePropertyAccessor(property, readOnly) {
        Object.defineProperty(this, property, {
          /* eslint-disable valid-jsdoc */
          /** @this {PropertiesChanged} */
          get() {
            return this._getProperty(property);
          },
          /** @this {PropertiesChanged} */
          set: readOnly ? function () {} : function (value) {
            this._setProperty(property, value);
          }
          /* eslint-enable */
        });
      }

      constructor() {
        super();
        this.__dataEnabled = false;
        this.__dataReady = false;
        this.__dataInvalid = false;
        this.__data = {};
        this.__dataPending = null;
        this.__dataOld = null;
        this.__dataInstanceProps = null;
        this.__serializing = false;
        this._initializeProperties();
      }

      /**
       * Lifecycle callback called when properties are enabled via
       * `_enableProperties`.
       *
       * Users may override this function to implement behavior that is
       * dependent on the element having its property data initialized, e.g.
       * from defaults (initialized from `constructor`, `_initializeProperties`),
       * `attributeChangedCallback`, or values propagated from host e.g. via
       * bindings.  `super.ready()` must be called to ensure the data system
       * becomes enabled.
       *
       * @return {void}
       * @public
       */
      ready() {
        this.__dataReady = true;
        this._flushProperties();
      }

      /**
       * Initializes the local storage for property accessors.
       *
       * Provided as an override point for performing any setup work prior
       * to initializing the property accessor system.
       *
       * @return {void}
       * @protected
       */
      _initializeProperties() {
        // Capture instance properties; these will be set into accessors
        // during first flush. Don't set them here, since we want
        // these to overwrite defaults/constructor assignments
        for (let p in this.__dataHasAccessor) {
          if (this.hasOwnProperty(p)) {
            this.__dataInstanceProps = this.__dataInstanceProps || {};
            this.__dataInstanceProps[p] = this[p];
            delete this[p];
          }
        }
      }

      /**
       * Called at ready time with bag of instance properties that overwrote
       * accessors when the element upgraded.
       *
       * The default implementation sets these properties back into the
       * setter at ready time.  This method is provided as an override
       * point for customizing or providing more efficient initialization.
       *
       * @param {Object} props Bag of property values that were overwritten
       *   when creating property accessors.
       * @return {void}
       * @protected
       */
      _initializeInstanceProperties(props) {
        Object.assign(this, props);
      }

      /**
       * Updates the local storage for a property (via `_setPendingProperty`)
       * and enqueues a `_proeprtiesChanged` callback.
       *
       * @param {string} property Name of the property
       * @param {*} value Value to set
       * @return {void}
       * @protected
       */
      _setProperty(property, value) {
        if (this._setPendingProperty(property, value)) {
          this._invalidateProperties();
        }
      }

      /**
       * Returns the value for the given property.
       * @param {string} property Name of property
       * @return {*} Value for the given property
       * @protected
       */
      _getProperty(property) {
        return this.__data[property];
      }

      /* eslint-disable no-unused-vars */
      /**
       * Updates the local storage for a property, records the previous value,
       * and adds it to the set of "pending changes" that will be passed to the
       * `_propertiesChanged` callback.  This method does not enqueue the
       * `_propertiesChanged` callback.
       *
       * @param {string} property Name of the property
       * @param {*} value Value to set
       * @param {boolean=} ext Not used here; affordance for closure
       * @return {boolean} Returns true if the property changed
       * @protected
       */
      _setPendingProperty(property, value, ext) {
        let old = this.__data[property];
        let changed = this._shouldPropertyChange(property, value, old);
        if (changed) {
          if (!this.__dataPending) {
            this.__dataPending = {};
            this.__dataOld = {};
          }
          // Ensure old is captured from the last turn
          if (this.__dataOld && !(property in this.__dataOld)) {
            this.__dataOld[property] = old;
          }
          this.__data[property] = value;
          this.__dataPending[property] = value;
        }
        return changed;
      }
      /* eslint-enable */

      /**
       * Marks the properties as invalid, and enqueues an async
       * `_propertiesChanged` callback.
       *
       * @return {void}
       * @protected
       */
      _invalidateProperties() {
        if (!this.__dataInvalid && this.__dataReady) {
          this.__dataInvalid = true;
          microtask.run(() => {
            if (this.__dataInvalid) {
              this.__dataInvalid = false;
              this._flushProperties();
            }
          });
        }
      }

      /**
       * Call to enable property accessor processing. Before this method is
       * called accessor values will be set but side effects are
       * queued. When called, any pending side effects occur immediately.
       * For elements, generally `connectedCallback` is a normal spot to do so.
       * It is safe to call this method multiple times as it only turns on
       * property accessors once.
       *
       * @return {void}
       * @protected
       */
      _enableProperties() {
        if (!this.__dataEnabled) {
          this.__dataEnabled = true;
          if (this.__dataInstanceProps) {
            this._initializeInstanceProperties(this.__dataInstanceProps);
            this.__dataInstanceProps = null;
          }
          this.ready();
        }
      }

      /**
       * Calls the `_propertiesChanged` callback with the current set of
       * pending changes (and old values recorded when pending changes were
       * set), and resets the pending set of changes. Generally, this method
       * should not be called in user code.
       *
       * @return {void}
       * @protected
       */
      _flushProperties() {
        const props = this.__data;
        const changedProps = this.__dataPending;
        const old = this.__dataOld;
        if (this._shouldPropertiesChange(props, changedProps, old)) {
          this.__dataPending = null;
          this.__dataOld = null;
          this._propertiesChanged(props, changedProps, old);
        }
      }

      /**
       * Called in `_flushProperties` to determine if `_propertiesChanged`
       * should be called. The default implementation returns true if
       * properties are pending. Override to customize when
       * `_propertiesChanged` is called.
       * @param {!Object} currentProps Bag of all current accessor values
       * @param {!Object} changedProps Bag of properties changed since the last
       *   call to `_propertiesChanged`
       * @param {!Object} oldProps Bag of previous values for each property
       *   in `changedProps`
       * @return {boolean} true if changedProps is truthy
       */
      _shouldPropertiesChange(currentProps, changedProps, oldProps) { // eslint-disable-line no-unused-vars
        return Boolean(changedProps);
      }

      /**
       * Callback called when any properties with accessors created via
       * `_createPropertyAccessor` have been set.
       *
       * @param {!Object} currentProps Bag of all current accessor values
       * @param {!Object} changedProps Bag of properties changed since the last
       *   call to `_propertiesChanged`
       * @param {!Object} oldProps Bag of previous values for each property
       *   in `changedProps`
       * @return {void}
       * @protected
       */
      _propertiesChanged(currentProps, changedProps, oldProps) { // eslint-disable-line no-unused-vars
      }

      /**
       * Method called to determine whether a property value should be
       * considered as a change and cause the `_propertiesChanged` callback
       * to be enqueued.
       *
       * The default implementation returns `true` if a strict equality
       * check fails. The method always returns false for `NaN`.
       *
       * Override this method to e.g. provide stricter checking for
       * Objects/Arrays when using immutable patterns.
       *
       * @param {string} property Property name
       * @param {*} value New property value
       * @param {*} old Previous property value
       * @return {boolean} Whether the property should be considered a change
       *   and enqueue a `_proeprtiesChanged` callback
       * @protected
       */
      _shouldPropertyChange(property, value, old) {
        return (
          // Strict equality check
          (old !== value &&
            // This ensures (old==NaN, value==NaN) always returns false
            (old === old || value === value))
        );
      }

      /**
       * Implements native Custom Elements `attributeChangedCallback` to
       * set an attribute value to a property via `_attributeToProperty`.
       *
       * @param {string} name Name of attribute that changed
       * @param {?string} old Old attribute value
       * @param {?string} value New attribute value
       * @param {?string} namespace Attribute namespace.
       * @return {void}
       * @suppress {missingProperties} Super may or may not implement the callback
       */
      attributeChangedCallback(name, old, value, namespace) {
        if (old !== value) {
          this._attributeToProperty(name, value);
        }
        if (super.attributeChangedCallback) {
          super.attributeChangedCallback(name, old, value, namespace);
        }
      }

      /**
       * Deserializes an attribute to its associated property.
       *
       * This method calls the `_deserializeValue` method to convert the string to
       * a typed value.
       *
       * @param {string} attribute Name of attribute to deserialize.
       * @param {?string} value of the attribute.
       * @param {*=} type type to deserialize to, defaults to the value
       * returned from `typeForProperty`
       * @return {void}
       */
      _attributeToProperty(attribute, value, type) {
        if (!this.__serializing) {
          const map = this.__dataAttributes;
          const property = map && map[attribute] || attribute;
          this[property] = this._deserializeValue(value, type ||
            this.constructor.typeForProperty(property));
        }
      }

      /**
       * Serializes a property to its associated attribute.
       *
       * @suppress {invalidCasts} Closure can't figure out `this` is an element.
       *
       * @param {string} property Property name to reflect.
       * @param {string=} attribute Attribute name to reflect to.
       * @param {*=} value Property value to refect.
       * @return {void}
       */
      _propertyToAttribute(property, attribute, value) {
        this.__serializing = true;
        value = (arguments.length < 3) ? this[property] : value;
        this._valueToNodeAttribute(/** @type {!HTMLElement} */(this), value,
          attribute || this.constructor.attributeNameForProperty(property));
        this.__serializing = false;
      }

      /**
       * Sets a typed value to an HTML attribute on a node.
       *
       * This method calls the `_serializeValue` method to convert the typed
       * value to a string.  If the `_serializeValue` method returns `undefined`,
       * the attribute will be removed (this is the default for boolean
       * type `false`).
       *
       * @param {Element} node Element to set attribute to.
       * @param {*} value Value to serialize.
       * @param {string} attribute Attribute name to serialize to.
       * @return {void}
       */
      _valueToNodeAttribute(node, value, attribute) {
        const str = this._serializeValue(value);
        if (str === undefined) {
          node.removeAttribute(attribute);
        } else {
          node.setAttribute(attribute, str);
        }
      }

      /**
       * Converts a typed JavaScript value to a string.
       *
       * This method is called when setting JS property values to
       * HTML attributes.  Users may override this method to provide
       * serialization for custom types.
       *
       * @param {*} value Property value to serialize.
       * @return {string | undefined} String serialized from the provided
       * property  value.
       */
      _serializeValue(value) {
        switch (typeof value) {
          case 'boolean':
            return value ? '' : undefined;
          default:
            return value != null ? value.toString() : undefined;
        }
      }

      /**
       * Converts a string to a typed JavaScript value.
       *
       * This method is called when reading HTML attribute values to
       * JS properties.  Users may override this method to provide
       * deserialization for custom `type`s. Types for `Boolean`, `String`,
       * and `Number` convert attributes to the expected types.
       *
       * @param {?string} value Value to deserialize.
       * @param {*=} type Type to deserialize the string to.
       * @return {*} Typed value deserialized from the provided string.
       */
      _deserializeValue(value, type) {
        switch (type) {
          case Boolean:
            return (value !== null);
          case Number:
            return Number(value);
          default:
            return value;
        }
      }

    }

    return PropertiesChanged;
  });

  /**
  @license
  Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
  This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
  The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
  The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
  Code distributed by Google as part of the polymer project is also
  subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
  */

  /**
   * Creates a copy of `props` with each property normalized such that
   * upgraded it is an object with at least a type property { type: Type}.
   *
   * @param {Object} props Properties to normalize
   * @return {Object} Copy of input `props` with normalized properties that
   * are in the form {type: Type}
   * @private
   */
  function normalizeProperties(props) {
    const output = {};
    for (let p in props) {
      const o = props[p];
      output[p] = (typeof o === 'function') ? {type: o} : o;
    }
    return output;
  }

  /**
   * Mixin that provides a minimal starting point to using the PropertiesChanged
   * mixin by providing a mechanism to declare properties in a static
   * getter (e.g. static get properties() { return { foo: String } }). Changes
   * are reported via the `_propertiesChanged` method.
   *
   * This mixin provides no specific support for rendering. Users are expected
   * to create a ShadowRoot and put content into it and update it in whatever
   * way makes sense. This can be done in reaction to properties changing by
   * implementing `_propertiesChanged`.
   *
   * @mixinFunction
   * @polymer
   * @appliesMixin PropertiesChanged
   * @summary Mixin that provides a minimal starting point for using
   * the PropertiesChanged mixin by providing a declarative `properties` object.
   */
  const PropertiesMixin = dedupingMixin(superClass => {

   /**
    * @constructor
    * @extends {superClass}
    * @implements {Polymer_PropertiesChanged}
    */
   const base = PropertiesChanged(superClass);

   /**
    * Returns the super class constructor for the given class, if it is an
    * instance of the PropertiesMixin.
    *
    * @param {!PropertiesMixinConstructor} constructor PropertiesMixin constructor
    * @return {PropertiesMixinConstructor} Super class constructor
    */
   function superPropertiesClass(constructor) {
     const superCtor = Object.getPrototypeOf(constructor);

     // Note, the `PropertiesMixin` class below only refers to the class
     // generated by this call to the mixin; the instanceof test only works
     // because the mixin is deduped and guaranteed only to apply once, hence
     // all constructors in a proto chain will see the same `PropertiesMixin`
     return (superCtor.prototype instanceof PropertiesMixin) ?
       /** @type {PropertiesMixinConstructor} */ (superCtor) : null;
   }

   /**
    * Returns a memoized version of the `properties` object for the
    * given class. Properties not in object format are converted to at
    * least {type}.
    *
    * @param {PropertiesMixinConstructor} constructor PropertiesMixin constructor
    * @return {Object} Memoized properties object
    */
   function ownProperties(constructor) {
     if (!constructor.hasOwnProperty(JSCompiler_renameProperty('__ownProperties', constructor))) {
       let props = null;

       if (constructor.hasOwnProperty(JSCompiler_renameProperty('properties', constructor)) && constructor.properties) {
         props = normalizeProperties(constructor.properties);
       }

       constructor.__ownProperties = props;
     }
     return constructor.__ownProperties;
   }

   /**
    * @polymer
    * @mixinClass
    * @extends {base}
    * @implements {Polymer_PropertiesMixin}
    * @unrestricted
    */
   class PropertiesMixin extends base {

     /**
      * Implements standard custom elements getter to observes the attributes
      * listed in `properties`.
      * @suppress {missingProperties} Interfaces in closure do not inherit statics, but classes do
      */
     static get observedAttributes() {
       const props = this._properties;
       return props ? Object.keys(props).map(p => this.attributeNameForProperty(p)) : [];
     }

     /**
      * Finalizes an element definition, including ensuring any super classes
      * are also finalized. This includes ensuring property
      * accessors exist on the element prototype. This method calls
      * `_finalizeClass` to finalize each constructor in the prototype chain.
      * @return {void}
      */
     static finalize() {
       if (!this.hasOwnProperty(JSCompiler_renameProperty('__finalized', this))) {
         const superCtor = superPropertiesClass(/** @type {PropertiesMixinConstructor} */(this));
         if (superCtor) {
           superCtor.finalize();
         }
         this.__finalized = true;
         this._finalizeClass();
       }
     }

     /**
      * Finalize an element class. This includes ensuring property
      * accessors exist on the element prototype. This method is called by
      * `finalize` and finalizes the class constructor.
      *
      * @protected
      */
     static _finalizeClass() {
       const props = ownProperties(/** @type {PropertiesMixinConstructor} */(this));
       if (props) {
         this.createProperties(props);
       }
     }

     /**
      * Returns a memoized version of all properties, including those inherited
      * from super classes. Properties not in object format are converted to
      * at least {type}.
      *
      * @return {Object} Object containing properties for this class
      * @protected
      */
     static get _properties() {
       if (!this.hasOwnProperty(
         JSCompiler_renameProperty('__properties', this))) {
         const superCtor = superPropertiesClass(/** @type {PropertiesMixinConstructor} */(this));
         this.__properties = Object.assign({},
           superCtor && superCtor._properties,
           ownProperties(/** @type {PropertiesMixinConstructor} */(this)));
       }
       return this.__properties;
     }

     /**
      * Overrides `PropertiesChanged` method to return type specified in the
      * static `properties` object for the given property.
      * @param {string} name Name of property
      * @return {*} Type to which to deserialize attribute
      *
      * @protected
      */
     static typeForProperty(name) {
       const info = this._properties[name];
       return info && info.type;
     }

     /**
      * Overrides `PropertiesChanged` method and adds a call to
      * `finalize` which lazily configures the element's property accessors.
      * @override
      * @return {void}
      */
     _initializeProperties() {
       this.constructor.finalize();
       super._initializeProperties();
     }

     /**
      * Called when the element is added to a document.
      * Calls `_enableProperties` to turn on property system from
      * `PropertiesChanged`.
      * @suppress {missingProperties} Super may or may not implement the callback
      * @return {void}
      */
     connectedCallback() {
       if (super.connectedCallback) {
         super.connectedCallback();
       }
       this._enableProperties();
     }

     /**
      * Called when the element is removed from a document
      * @suppress {missingProperties} Super may or may not implement the callback
      * @return {void}
      */
     disconnectedCallback() {
       if (super.disconnectedCallback) {
         super.disconnectedCallback();
       }
     }

   }

   return PropertiesMixin;

  });

  /**
  @license
  Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
  This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
  The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
  The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
  Code distributed by Google as part of the polymer project is also
  subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
  */

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  // The first argument to JS template tags retain identity across multiple
  // calls to a tag for the same literal, so we can cache work done per literal
  // in a Map.
  const templateCaches = new Map();
  /**
   * The return type of `html`, which holds a Template and the values from
   * interpolated expressions.
   */
  class TemplateResult {
      constructor(strings, values, type, partCallback = defaultPartCallback) {
          this.strings = strings;
          this.values = values;
          this.type = type;
          this.partCallback = partCallback;
      }
      /**
       * Returns a string of HTML used to create a <template> element.
       */
      getHTML() {
          const l = this.strings.length - 1;
          let html = '';
          let isTextBinding = true;
          for (let i = 0; i < l; i++) {
              const s = this.strings[i];
              html += s;
              // We're in a text position if the previous string closed its tags.
              // If it doesn't have any tags, then we use the previous text position
              // state.
              const closing = findTagClose(s);
              isTextBinding = closing > -1 ? closing < s.length : isTextBinding;
              html += isTextBinding ? nodeMarker : marker;
          }
          html += this.strings[l];
          return html;
      }
      getTemplateElement() {
          const template = document.createElement('template');
          template.innerHTML = this.getHTML();
          return template;
      }
  }
  /**
   * An expression marker with embedded unique key to avoid collision with
   * possible text in templates.
   */
  const marker = `{{lit-${String(Math.random()).slice(2)}}}`;
  /**
   * An expression marker used text-positions, not attribute positions,
   * in template.
   */
  const nodeMarker = `<!--${marker}-->`;
  const markerRegex = new RegExp(`${marker}|${nodeMarker}`);
  /**
   * This regex extracts the attribute name preceding an attribute-position
   * expression. It does this by matching the syntax allowed for attributes
   * against the string literal directly preceding the expression, assuming that
   * the expression is in an attribute-value position.
   *
   * See attributes in the HTML spec:
   * https://www.w3.org/TR/html5/syntax.html#attributes-0
   *
   * "\0-\x1F\x7F-\x9F" are Unicode control characters
   *
   * " \x09\x0a\x0c\x0d" are HTML space characters:
   * https://www.w3.org/TR/html5/infrastructure.html#space-character
   *
   * So an attribute is:
   *  * The name: any character except a control character, space character, ('),
   *    ("), ">", "=", or "/"
   *  * Followed by zero or more space characters
   *  * Followed by "="
   *  * Followed by zero or more space characters
   *  * Followed by:
   *    * Any character except space, ('), ("), "<", ">", "=", (`), or
   *    * (") then any non-("), or
   *    * (') then any non-(')
   */
  const lastAttributeNameRegex = /[ \x09\x0a\x0c\x0d]([^\0-\x1F\x7F-\x9F \x09\x0a\x0c\x0d"'>=/]+)[ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*)$/;
  /**
   * Finds the closing index of the last closed HTML tag.
   * This has 3 possible return values:
   *   - `-1`, meaning there is no tag in str.
   *   - `string.length`, meaning the last opened tag is unclosed.
   *   - Some positive number < str.length, meaning the index of the closing '>'.
   */
  function findTagClose(str) {
      const close = str.lastIndexOf('>');
      const open = str.indexOf('<', close + 1);
      return open > -1 ? str.length : close;
  }
  /**
   * A placeholder for a dynamic expression in an HTML template.
   *
   * There are two built-in part types: AttributePart and NodePart. NodeParts
   * always represent a single dynamic expression, while AttributeParts may
   * represent as many expressions are contained in the attribute.
   *
   * A Template's parts are mutable, so parts can be replaced or modified
   * (possibly to implement different template semantics). The contract is that
   * parts can only be replaced, not removed, added or reordered, and parts must
   * always consume the correct number of values in their `update()` method.
   *
   * TODO(justinfagnani): That requirement is a little fragile. A
   * TemplateInstance could instead be more careful about which values it gives
   * to Part.update().
   */
  class TemplatePart {
      constructor(type, index, name, rawName, strings) {
          this.type = type;
          this.index = index;
          this.name = name;
          this.rawName = rawName;
          this.strings = strings;
      }
  }
  const isTemplatePartActive = (part) => part.index !== -1;
  /**
   * An updateable Template that tracks the location of dynamic parts.
   */
  class Template {
      constructor(result, element) {
          this.parts = [];
          this.element = element;
          const content = this.element.content;
          // Edge needs all 4 parameters present; IE11 needs 3rd parameter to be null
          const walker = document.createTreeWalker(content, 133 /* NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_COMMENT |
                 NodeFilter.SHOW_TEXT */, null, false);
          let index = -1;
          let partIndex = 0;
          const nodesToRemove = [];
          // The actual previous node, accounting for removals: if a node is removed
          // it will never be the previousNode.
          let previousNode;
          // Used to set previousNode at the top of the loop.
          let currentNode;
          while (walker.nextNode()) {
              index++;
              previousNode = currentNode;
              const node = currentNode = walker.currentNode;
              if (node.nodeType === 1 /* Node.ELEMENT_NODE */) {
                  if (!node.hasAttributes()) {
                      continue;
                  }
                  const attributes = node.attributes;
                  // Per https://developer.mozilla.org/en-US/docs/Web/API/NamedNodeMap,
                  // attributes are not guaranteed to be returned in document order. In
                  // particular, Edge/IE can return them out of order, so we cannot assume
                  // a correspondance between part index and attribute index.
                  let count = 0;
                  for (let i = 0; i < attributes.length; i++) {
                      if (attributes[i].value.indexOf(marker) >= 0) {
                          count++;
                      }
                  }
                  while (count-- > 0) {
                      // Get the template literal section leading up to the first
                      // expression in this attribute
                      const stringForPart = result.strings[partIndex];
                      // Find the attribute name
                      const attributeNameInPart = lastAttributeNameRegex.exec(stringForPart)[1];
                      // Find the corresponding attribute
                      // TODO(justinfagnani): remove non-null assertion
                      const attribute = attributes.getNamedItem(attributeNameInPart);
                      const stringsForAttributeValue = attribute.value.split(markerRegex);
                      this.parts.push(new TemplatePart('attribute', index, attribute.name, attributeNameInPart, stringsForAttributeValue));
                      node.removeAttribute(attribute.name);
                      partIndex += stringsForAttributeValue.length - 1;
                  }
              }
              else if (node.nodeType === 3 /* Node.TEXT_NODE */) {
                  const nodeValue = node.nodeValue;
                  if (nodeValue.indexOf(marker) < 0) {
                      continue;
                  }
                  const parent = node.parentNode;
                  const strings = nodeValue.split(markerRegex);
                  const lastIndex = strings.length - 1;
                  // We have a part for each match found
                  partIndex += lastIndex;
                  // Generate a new text node for each literal section
                  // These nodes are also used as the markers for node parts
                  for (let i = 0; i < lastIndex; i++) {
                      parent.insertBefore((strings[i] === '')
                          ? document.createComment('')
                          : document.createTextNode(strings[i]), node);
                      this.parts.push(new TemplatePart('node', index++));
                  }
                  parent.insertBefore(strings[lastIndex] === '' ?
                      document.createComment('') :
                      document.createTextNode(strings[lastIndex]), node);
                  nodesToRemove.push(node);
              }
              else if (node.nodeType === 8 /* Node.COMMENT_NODE */ &&
                  node.nodeValue === marker) {
                  const parent = node.parentNode;
                  // Add a new marker node to be the startNode of the Part if any of the
                  // following are true:
                  //  * We don't have a previousSibling
                  //  * previousSibling is being removed (thus it's not the
                  //    `previousNode`)
                  //  * previousSibling is not a Text node
                  //
                  // TODO(justinfagnani): We should be able to use the previousNode here
                  // as the marker node and reduce the number of extra nodes we add to a
                  // template. See https://github.com/PolymerLabs/lit-html/issues/147
                  const previousSibling = node.previousSibling;
                  if (previousSibling === null || previousSibling !== previousNode ||
                      previousSibling.nodeType !== Node.TEXT_NODE) {
                      parent.insertBefore(document.createComment(''), node);
                  }
                  else {
                      index--;
                  }
                  this.parts.push(new TemplatePart('node', index++));
                  nodesToRemove.push(node);
                  // If we don't have a nextSibling add a marker node.
                  // We don't have to check if the next node is going to be removed,
                  // because that node will induce a new marker if so.
                  if (node.nextSibling === null) {
                      parent.insertBefore(document.createComment(''), node);
                  }
                  else {
                      index--;
                  }
                  currentNode = previousNode;
                  partIndex++;
              }
          }
          // Remove text binding nodes after the walk to not disturb the TreeWalker
          for (const n of nodesToRemove) {
              n.parentNode.removeChild(n);
          }
      }
  }
  /**
   * Returns a value ready to be inserted into a Part from a user-provided value.
   *
   * If the user value is a directive, this invokes the directive with the given
   * part. If the value is null, it's converted to undefined to work better
   * with certain DOM APIs, like textContent.
   */
  const getValue = (part, value) => {
      // `null` as the value of a Text node will render the string 'null'
      // so we convert it to undefined
      if (isDirective(value)) {
          value = value(part);
          return noChange;
      }
      return value === null ? undefined : value;
  };
  const isDirective = (o) => typeof o === 'function' && o.__litDirective === true;
  /**
   * A sentinel value that signals that a value was handled by a directive and
   * should not be written to the DOM.
   */
  const noChange = {};
  const isPrimitiveValue = (value) => value === null ||
      !(typeof value === 'object' || typeof value === 'function');
  class AttributePart {
      constructor(instance, element, name, strings) {
          this.instance = instance;
          this.element = element;
          this.name = name;
          this.strings = strings;
          this.size = strings.length - 1;
          this._previousValues = [];
      }
      _interpolate(values, startIndex) {
          const strings = this.strings;
          const l = strings.length - 1;
          let text = '';
          for (let i = 0; i < l; i++) {
              text += strings[i];
              const v = getValue(this, values[startIndex + i]);
              if (v && v !== noChange &&
                  (Array.isArray(v) || typeof v !== 'string' && v[Symbol.iterator])) {
                  for (const t of v) {
                      // TODO: we need to recursively call getValue into iterables...
                      text += t;
                  }
              }
              else {
                  text += v;
              }
          }
          return text + strings[l];
      }
      _equalToPreviousValues(values, startIndex) {
          for (let i = startIndex; i < startIndex + this.size; i++) {
              if (this._previousValues[i] !== values[i] ||
                  !isPrimitiveValue(values[i])) {
                  return false;
              }
          }
          return true;
      }
      setValue(values, startIndex) {
          if (this._equalToPreviousValues(values, startIndex)) {
              return;
          }
          const s = this.strings;
          let value;
          if (s.length === 2 && s[0] === '' && s[1] === '') {
              // An expression that occupies the whole attribute value will leave
              // leading and trailing empty strings.
              value = getValue(this, values[startIndex]);
              if (Array.isArray(value)) {
                  value = value.join('');
              }
          }
          else {
              value = this._interpolate(values, startIndex);
          }
          if (value !== noChange) {
              this.element.setAttribute(this.name, value);
          }
          this._previousValues = values;
      }
  }
  class NodePart {
      constructor(instance, startNode, endNode) {
          this.instance = instance;
          this.startNode = startNode;
          this.endNode = endNode;
          this._previousValue = undefined;
      }
      setValue(value) {
          value = getValue(this, value);
          if (value === noChange) {
              return;
          }
          if (isPrimitiveValue(value)) {
              // Handle primitive values
              // If the value didn't change, do nothing
              if (value === this._previousValue) {
                  return;
              }
              this._setText(value);
          }
          else if (value instanceof TemplateResult) {
              this._setTemplateResult(value);
          }
          else if (Array.isArray(value) || value[Symbol.iterator]) {
              this._setIterable(value);
          }
          else if (value instanceof Node) {
              this._setNode(value);
          }
          else if (value.then !== undefined) {
              this._setPromise(value);
          }
          else {
              // Fallback, will render the string representation
              this._setText(value);
          }
      }
      _insert(node) {
          this.endNode.parentNode.insertBefore(node, this.endNode);
      }
      _setNode(value) {
          if (this._previousValue === value) {
              return;
          }
          this.clear();
          this._insert(value);
          this._previousValue = value;
      }
      _setText(value) {
          const node = this.startNode.nextSibling;
          value = value === undefined ? '' : value;
          if (node === this.endNode.previousSibling &&
              node.nodeType === Node.TEXT_NODE) {
              // If we only have a single text node between the markers, we can just
              // set its value, rather than replacing it.
              // TODO(justinfagnani): Can we just check if _previousValue is
              // primitive?
              node.textContent = value;
          }
          else {
              this._setNode(document.createTextNode(value));
          }
          this._previousValue = value;
      }
      _setTemplateResult(value) {
          const template = this.instance._getTemplate(value);
          let instance;
          if (this._previousValue && this._previousValue.template === template) {
              instance = this._previousValue;
          }
          else {
              instance = new TemplateInstance(template, this.instance._partCallback, this.instance._getTemplate);
              this._setNode(instance._clone());
              this._previousValue = instance;
          }
          instance.update(value.values);
      }
      _setIterable(value) {
          // For an Iterable, we create a new InstancePart per item, then set its
          // value to the item. This is a little bit of overhead for every item in
          // an Iterable, but it lets us recurse easily and efficiently update Arrays
          // of TemplateResults that will be commonly returned from expressions like:
          // array.map((i) => html`${i}`), by reusing existing TemplateInstances.
          // If _previousValue is an array, then the previous render was of an
          // iterable and _previousValue will contain the NodeParts from the previous
          // render. If _previousValue is not an array, clear this part and make a new
          // array for NodeParts.
          if (!Array.isArray(this._previousValue)) {
              this.clear();
              this._previousValue = [];
          }
          // Lets us keep track of how many items we stamped so we can clear leftover
          // items from a previous render
          const itemParts = this._previousValue;
          let partIndex = 0;
          for (const item of value) {
              // Try to reuse an existing part
              let itemPart = itemParts[partIndex];
              // If no existing part, create a new one
              if (itemPart === undefined) {
                  // If we're creating the first item part, it's startNode should be the
                  // container's startNode
                  let itemStart = this.startNode;
                  // If we're not creating the first part, create a new separator marker
                  // node, and fix up the previous part's endNode to point to it
                  if (partIndex > 0) {
                      const previousPart = itemParts[partIndex - 1];
                      itemStart = previousPart.endNode = document.createTextNode('');
                      this._insert(itemStart);
                  }
                  itemPart = new NodePart(this.instance, itemStart, this.endNode);
                  itemParts.push(itemPart);
              }
              itemPart.setValue(item);
              partIndex++;
          }
          if (partIndex === 0) {
              this.clear();
              this._previousValue = undefined;
          }
          else if (partIndex < itemParts.length) {
              const lastPart = itemParts[partIndex - 1];
              // Truncate the parts array so _previousValue reflects the current state
              itemParts.length = partIndex;
              this.clear(lastPart.endNode.previousSibling);
              lastPart.endNode = this.endNode;
          }
      }
      _setPromise(value) {
          this._previousValue = value;
          value.then((v) => {
              if (this._previousValue === value) {
                  this.setValue(v);
              }
          });
      }
      clear(startNode = this.startNode) {
          removeNodes(this.startNode.parentNode, startNode.nextSibling, this.endNode);
      }
  }
  const defaultPartCallback = (instance, templatePart, node) => {
      if (templatePart.type === 'attribute') {
          return new AttributePart(instance, node, templatePart.name, templatePart.strings);
      }
      else if (templatePart.type === 'node') {
          return new NodePart(instance, node, node.nextSibling);
      }
      throw new Error(`Unknown part type ${templatePart.type}`);
  };
  /**
   * An instance of a `Template` that can be attached to the DOM and updated
   * with new values.
   */
  class TemplateInstance {
      constructor(template, partCallback, getTemplate) {
          this._parts = [];
          this.template = template;
          this._partCallback = partCallback;
          this._getTemplate = getTemplate;
      }
      update(values) {
          let valueIndex = 0;
          for (const part of this._parts) {
              if (!part) {
                  valueIndex++;
              }
              else if (part.size === undefined) {
                  part.setValue(values[valueIndex]);
                  valueIndex++;
              }
              else {
                  part.setValue(values, valueIndex);
                  valueIndex += part.size;
              }
          }
      }
      _clone() {
          // Clone the node, rather than importing it, to keep the fragment in the
          // template's document. This leaves the fragment inert so custom elements
          // won't upgrade until after the main document adopts the node.
          const fragment = this.template.element.content.cloneNode(true);
          const parts = this.template.parts;
          if (parts.length > 0) {
              // Edge needs all 4 parameters present; IE11 needs 3rd parameter to be
              // null
              const walker = document.createTreeWalker(fragment, 133 /* NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_COMMENT |
                     NodeFilter.SHOW_TEXT */, null, false);
              let index = -1;
              for (let i = 0; i < parts.length; i++) {
                  const part = parts[i];
                  const partActive = isTemplatePartActive(part);
                  // An inactive part has no coresponding Template node.
                  if (partActive) {
                      while (index < part.index) {
                          index++;
                          walker.nextNode();
                      }
                  }
                  this._parts.push(partActive ? this._partCallback(this, part, walker.currentNode) : undefined);
              }
          }
          return fragment;
      }
  }
  /**
   * Removes nodes, starting from `startNode` (inclusive) to `endNode`
   * (exclusive), from `container`.
   */
  const removeNodes = (container, startNode, endNode = null) => {
      let node = startNode;
      while (node !== endNode) {
          const n = node.nextSibling;
          container.removeChild(node);
          node = n;
      }
  };

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  const walkerNodeFilter = NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_COMMENT |
      NodeFilter.SHOW_TEXT;
  /**
   * Removes the list of nodes from a Template safely. In addition to removing
   * nodes from the Template, the Template part indices are updated to match
   * the mutated Template DOM.
   *
   * As the template is walked the removal state is tracked and
   * part indices are adjusted as needed.
   *
   * div
   *   div#1 (remove) <-- start removing (removing node is div#1)
   *     div
   *       div#2 (remove)  <-- continue removing (removing node is still div#1)
   *         div
   * div <-- stop removing since previous sibling is the removing node (div#1, removed 4 nodes)
   */
  function removeNodesFromTemplate(template, nodesToRemove) {
      const { element: { content }, parts } = template;
      const walker = document.createTreeWalker(content, walkerNodeFilter, null, false);
      let partIndex = 0;
      let part = parts[0];
      let nodeIndex = -1;
      let removeCount = 0;
      const nodesToRemoveInTemplate = [];
      let currentRemovingNode = null;
      while (walker.nextNode()) {
          nodeIndex++;
          const node = walker.currentNode;
          // End removal if stepped past the removing node
          if (node.previousSibling === currentRemovingNode) {
              currentRemovingNode = null;
          }
          // A node to remove was found in the template
          if (nodesToRemove.has(node)) {
              nodesToRemoveInTemplate.push(node);
              // Track node we're removing
              if (currentRemovingNode === null) {
                  currentRemovingNode = node;
              }
          }
          // When removing, increment count by which to adjust subsequent part indices
          if (currentRemovingNode !== null) {
              removeCount++;
          }
          while (part !== undefined && part.index === nodeIndex) {
              // If part is in a removed node deactivate it by setting index to -1 or
              // adjust the index as needed.
              part.index = currentRemovingNode !== null ? -1 : part.index - removeCount;
              part = parts[++partIndex];
          }
      }
      nodesToRemoveInTemplate.forEach((n) => n.parentNode.removeChild(n));
  }
  const countNodes = (node) => {
      let count = 1;
      const walker = document.createTreeWalker(node, walkerNodeFilter, null, false);
      while (walker.nextNode()) {
          count++;
      }
      return count;
  };
  const nextActiveIndexInTemplateParts = (parts, startIndex = -1) => {
      for (let i = startIndex + 1; i < parts.length; i++) {
          const part = parts[i];
          if (isTemplatePartActive(part)) {
              return i;
          }
      }
      return -1;
  };
  /**
   * Inserts the given node into the Template, optionally before the given
   * refNode. In addition to inserting the node into the Template, the Template
   * part indices are updated to match the mutated Template DOM.
   */
  function insertNodeIntoTemplate(template, node, refNode = null) {
      const { element: { content }, parts } = template;
      // If there's no refNode, then put node at end of template.
      // No part indices need to be shifted in this case.
      if (refNode === null || refNode === undefined) {
          content.appendChild(node);
          return;
      }
      const walker = document.createTreeWalker(content, walkerNodeFilter, null, false);
      let partIndex = nextActiveIndexInTemplateParts(parts);
      let insertCount = 0;
      let walkerIndex = -1;
      while (walker.nextNode()) {
          walkerIndex++;
          const walkerNode = walker.currentNode;
          if (walkerNode === refNode) {
              refNode.parentNode.insertBefore(node, refNode);
              insertCount = countNodes(node);
          }
          while (partIndex !== -1 && parts[partIndex].index === walkerIndex) {
              // If we've inserted the node, simply adjust all subsequent parts
              if (insertCount > 0) {
                  while (partIndex !== -1) {
                      parts[partIndex].index += insertCount;
                      partIndex = nextActiveIndexInTemplateParts(parts, partIndex);
                  }
                  return;
              }
              partIndex = nextActiveIndexInTemplateParts(parts, partIndex);
          }
      }
  }

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  // Get a key to lookup in `templateCaches`.
  const getTemplateCacheKey = (type, scopeName) => `${type}--${scopeName}`;
  /**
   * Template factory which scopes template DOM using ShadyCSS.
   * @param scopeName {string}
   */
  const shadyTemplateFactory = (scopeName) => (result) => {
      const cacheKey = getTemplateCacheKey(result.type, scopeName);
      let templateCache = templateCaches.get(cacheKey);
      if (templateCache === undefined) {
          templateCache = new Map();
          templateCaches.set(cacheKey, templateCache);
      }
      let template = templateCache.get(result.strings);
      if (template === undefined) {
          const element = result.getTemplateElement();
          if (typeof window.ShadyCSS === 'object') {
              window.ShadyCSS.prepareTemplateDom(element, scopeName);
          }
          template = new Template(result, element);
          templateCache.set(result.strings, template);
      }
      return template;
  };
  const TEMPLATE_TYPES = ['html', 'svg'];
  /**
   * Removes all style elements from Templates for the given scopeName.
   */
  function removeStylesFromLitTemplates(scopeName) {
      TEMPLATE_TYPES.forEach((type) => {
          const templates = templateCaches.get(getTemplateCacheKey(type, scopeName));
          if (templates !== undefined) {
              templates.forEach((template) => {
                  const { element: { content } } = template;
                  const styles = content.querySelectorAll('style');
                  removeNodesFromTemplate(template, new Set(Array.from(styles)));
              });
          }
      });
  }
  const shadyRenderSet = new Set();
  /**
   * For the given scope name, ensures that ShadyCSS style scoping is performed.
   * This is done just once per scope name so the fragment and template cannot
   * be modified.
   * (1) extracts styles from the rendered fragment and hands them to ShadyCSS
   * to be scoped and appended to the document
   * (2) removes style elements from all lit-html Templates for this scope name.
   *
   * Note, <style> elements can only be placed into templates for the
   * initial rendering of the scope. If <style> elements are included in templates
   * dynamically rendered to the scope (after the first scope render), they will
   * not be scoped and the <style> will be left in the template and rendered output.
   */
  const ensureStylesScoped = (fragment, template, scopeName) => {
      // only scope element template once per scope name
      if (!shadyRenderSet.has(scopeName)) {
          shadyRenderSet.add(scopeName);
          const styleTemplate = document.createElement('template');
          Array.from(fragment.querySelectorAll('style')).forEach((s) => {
              styleTemplate.content.appendChild(s);
          });
          window.ShadyCSS.prepareTemplateStyles(styleTemplate, scopeName);
          // Fix templates: note the expectation here is that the given `fragment`
          // has been generated from the given `template` which contains
          // the set of templates rendered into this scope.
          // It is only from this set of initial templates from which styles
          // will be scoped and removed.
          removeStylesFromLitTemplates(scopeName);
          // ApplyShim case
          if (window.ShadyCSS.nativeShadow) {
              const style = styleTemplate.content.querySelector('style');
              if (style !== null) {
                  // Insert style into rendered fragment
                  fragment.insertBefore(style, fragment.firstChild);
                  // Insert into lit-template (for subsequent renders)
                  insertNodeIntoTemplate(template, style.cloneNode(true), template.element.content.firstChild);
              }
          }
      }
  };
  // NOTE: We're copying code from lit-html's `render` method here.
  // We're doing this explicitly because the API for rendering templates is likely
  // to change in the near term.
  function render$1(result, container, scopeName) {
      const templateFactory = shadyTemplateFactory(scopeName);
      const template = templateFactory(result);
      let instance = container.__templateInstance;
      // Repeat render, just call update()
      if (instance !== undefined && instance.template === template &&
          instance._partCallback === result.partCallback) {
          instance.update(result.values);
          return;
      }
      // First render, create a new TemplateInstance and append it
      instance =
          new TemplateInstance(template, result.partCallback, templateFactory);
      container.__templateInstance = instance;
      const fragment = instance._clone();
      instance.update(result.values);
      const host = container instanceof ShadowRoot ?
          container.host :
          undefined;
      // If there's a shadow host, do ShadyCSS scoping...
      if (host !== undefined && typeof window.ShadyCSS === 'object') {
          ensureStylesScoped(fragment, template, scopeName);
          window.ShadyCSS.styleElement(host);
      }
      removeNodes(container, container.firstChild);
      container.appendChild(fragment);
  }

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  /**
   * Interprets a template literal as a lit-extended HTML template.
   */
  const html$1 = (strings, ...values) => new TemplateResult(strings, values, 'html', extendedPartCallback);
  /**
   * A PartCallback which allows templates to set properties and declarative
   * event handlers.
   *
   * Properties are set by default, instead of attributes. Attribute names in
   * lit-html templates preserve case, so properties are case sensitive. If an
   * expression takes up an entire attribute value, then the property is set to
   * that value. If an expression is interpolated with a string or other
   * expressions then the property is set to the string result of the
   * interpolation.
   *
   * To set an attribute instead of a property, append a `$` suffix to the
   * attribute name.
   *
   * Example:
   *
   *     html`<button class$="primary">Buy Now</button>`
   *
   * To set an event handler, prefix the attribute name with `on-`:
   *
   * Example:
   *
   *     html`<button on-click=${(e)=> this.onClickHandler(e)}>Buy Now</button>`
   *
   */
  const extendedPartCallback = (instance, templatePart, node) => {
      if (templatePart.type === 'attribute') {
          if (templatePart.rawName.substr(0, 3) === 'on-') {
              const eventName = templatePart.rawName.slice(3);
              return new EventPart(instance, node, eventName);
          }
          const lastChar = templatePart.name.substr(templatePart.name.length - 1);
          if (lastChar === '$') {
              const name = templatePart.name.slice(0, -1);
              return new AttributePart(instance, node, name, templatePart.strings);
          }
          if (lastChar === '?') {
              const name = templatePart.name.slice(0, -1);
              return new BooleanAttributePart(instance, node, name, templatePart.strings);
          }
          return new PropertyPart(instance, node, templatePart.rawName, templatePart.strings);
      }
      return defaultPartCallback(instance, templatePart, node);
  };
  /**
   * Implements a boolean attribute, roughly as defined in the HTML
   * specification.
   *
   * If the value is truthy, then the attribute is present with a value of
   * ''. If the value is falsey, the attribute is removed.
   */
  class BooleanAttributePart extends AttributePart {
      setValue(values, startIndex) {
          const s = this.strings;
          if (s.length === 2 && s[0] === '' && s[1] === '') {
              const value = getValue(this, values[startIndex]);
              if (value === noChange) {
                  return;
              }
              if (value) {
                  this.element.setAttribute(this.name, '');
              }
              else {
                  this.element.removeAttribute(this.name);
              }
          }
          else {
              throw new Error('boolean attributes can only contain a single expression');
          }
      }
  }
  class PropertyPart extends AttributePart {
      setValue(values, startIndex) {
          const s = this.strings;
          let value;
          if (this._equalToPreviousValues(values, startIndex)) {
              return;
          }
          if (s.length === 2 && s[0] === '' && s[1] === '') {
              // An expression that occupies the whole attribute value will leave
              // leading and trailing empty strings.
              value = getValue(this, values[startIndex]);
          }
          else {
              // Interpolation, so interpolate
              value = this._interpolate(values, startIndex);
          }
          if (value !== noChange) {
              this.element[this.name] = value;
          }
          this._previousValues = values;
      }
  }
  class EventPart {
      constructor(instance, element, eventName) {
          this.instance = instance;
          this.element = element;
          this.eventName = eventName;
      }
      setValue(value) {
          const listener = getValue(this, value);
          if (listener === this._listener) {
              return;
          }
          if (listener == null) {
              this.element.removeEventListener(this.eventName, this);
          }
          else if (this._listener == null) {
              this.element.addEventListener(this.eventName, this);
          }
          this._listener = listener;
      }
      handleEvent(event) {
          if (typeof this._listener === 'function') {
              this._listener.call(this.element, event);
          }
          else if (typeof this._listener.handleEvent === 'function') {
              this._listener.handleEvent(event);
          }
      }
  }

  class LitElement extends PropertiesMixin(HTMLElement) {
      constructor() {
          super(...arguments);
          this.__renderComplete = null;
          this.__resolveRenderComplete = null;
          this.__isInvalid = false;
          this.__isChanging = false;
      }
      /**
       * Override which sets up element rendering by calling* `_createRoot`
       * and `_firstRendered`.
       */
      ready() {
          this._root = this._createRoot();
          super.ready();
          this._firstRendered();
      }
      connectedCallback() {
          if (window.ShadyCSS && this._root) {
              window.ShadyCSS.styleElement(this);
          }
          super.connectedCallback();
      }
      /**
       * Called after the element DOM is rendered for the first time.
       * Implement to perform tasks after first rendering like capturing a
       * reference to a static node which must be directly manipulated.
       * This should not be commonly needed. For tasks which should be performed
       * before first render, use the element constructor.
       */
      _firstRendered() { }
      /**
       * Implement to customize where the element's template is rendered by
       * returning an element into which to render. By default this creates
       * a shadowRoot for the element. To render into the element's childNodes,
       * return `this`.
       * @returns {Element|DocumentFragment} Returns a node into which to render.
       */
      _createRoot() {
          return this.attachShadow({ mode: 'open' });
      }
      /**
       * Override which returns the value of `_shouldRender` which users
       * should implement to control rendering. If this method returns false,
       * _propertiesChanged will not be called and no rendering will occur even
       * if property values change or `requestRender` is called.
       * @param _props Current element properties
       * @param _changedProps Changing element properties
       * @param _prevProps Previous element properties
       * @returns {boolean} Default implementation always returns true.
       */
      _shouldPropertiesChange(_props, _changedProps, _prevProps) {
          const shouldRender = this._shouldRender(_props, _changedProps, _prevProps);
          if (!shouldRender && this.__resolveRenderComplete) {
              this.__resolveRenderComplete(false);
          }
          return shouldRender;
      }
      /**
       * Implement to control if rendering should occur when property values
       * change or `requestRender` is called. By default, this method always
       * returns true, but this can be customized as an optimization to avoid
       * rendering work when changes occur which should not be rendered.
       * @param _props Current element properties
       * @param _changedProps Changing element properties
       * @param _prevProps Previous element properties
       * @returns {boolean} Default implementation always returns true.
       */
      _shouldRender(_props, _changedProps, _prevProps) {
          return true;
      }
      /**
       * Override which performs element rendering by calling
       * `_render`, `_applyRender`, and finally `_didRender`.
       * @param props Current element properties
       * @param changedProps Changing element properties
       * @param prevProps Previous element properties
       */
      _propertiesChanged(props, changedProps, prevProps) {
          super._propertiesChanged(props, changedProps, prevProps);
          const result = this._render(props);
          if (result && this._root !== undefined) {
              this._applyRender(result, this._root);
          }
          this._didRender(props, changedProps, prevProps);
          if (this.__resolveRenderComplete) {
              this.__resolveRenderComplete(true);
          }
      }
      _flushProperties() {
          this.__isChanging = true;
          this.__isInvalid = false;
          super._flushProperties();
          this.__isChanging = false;
      }
      /**
       * Override which warns when a user attempts to change a property during
       * the rendering lifecycle. This is an anti-pattern and should be avoided.
       * @param property {string}
       * @param value {any}
       * @param old {any}
       */
      // tslint:disable-next-line no-any
      _shouldPropertyChange(property, value, old) {
          const change = super._shouldPropertyChange(property, value, old);
          if (change && this.__isChanging) {
              console.trace(`Setting properties in response to other properties changing ` +
                  `considered harmful. Setting '${property}' from ` +
                  `'${this._getProperty(property)}' to '${value}'.`);
          }
          return change;
      }
      /**
       * Implement to describe the DOM which should be rendered in the element.
       * Ideally, the implementation is a pure function using only props to describe
       * the element template. The implementation must return a `lit-html`
       * TemplateResult. By default this template is rendered into the element's
       * shadowRoot. This can be customized by implementing `_createRoot`. This
       * method must be implemented.
       * @param {*} _props Current element properties
       * @returns {TemplateResult} Must return a lit-html TemplateResult.
       */
      _render(_props) {
          throw new Error('_render() not implemented');
      }
      /**
       * Renders the given lit-html template `result` into the given `node`.
       * Implement to customize the way rendering is applied. This is should not
       * typically be needed and is provided for advanced use cases.
       * @param result {TemplateResult} `lit-html` template result to render
       * @param node {Element|DocumentFragment} node into which to render
       */
      _applyRender(result, node) {
          render$1(result, node, this.localName);
      }
      /**
       * Called after element DOM has been rendered. Implement to
       * directly control rendered DOM. Typically this is not needed as `lit-html`
       * can be used in the `_render` method to set properties, attributes, and
       * event listeners. However, it is sometimes useful for calling methods on
       * rendered elements, like calling `focus()` on an element to focus it.
       * @param _props Current element properties
       * @param _changedProps Changing element properties
       * @param _prevProps Previous element properties
       */
      _didRender(_props, _changedProps, _prevProps) { }
      /**
       * Call to request the element to asynchronously re-render regardless
       * of whether or not any property changes are pending.
       */
      requestRender() { this._invalidateProperties(); }
      /**
       * Override which provides tracking of invalidated state.
       */
      _invalidateProperties() {
          this.__isInvalid = true;
          super._invalidateProperties();
      }
      /**
       * Returns a promise which resolves after the element next renders.
       * The promise resolves to `true` if the element rendered and `false` if the
       * element did not render.
       * This is useful when users (e.g. tests) need to react to the rendered state
       * of the element after a change is made.
       * This can also be useful in event handlers if it is desireable to wait
       * to send an event until after rendering. If possible implement the
       * `_didRender` method to directly respond to rendering within the
       * rendering lifecycle.
       */
      get renderComplete() {
          if (!this.__renderComplete) {
              this.__renderComplete = new Promise((resolve) => {
                  this.__resolveRenderComplete = (value) => {
                      this.__resolveRenderComplete = this.__renderComplete = null;
                      resolve(value);
                  };
              });
              if (!this.__isInvalid && this.__resolveRenderComplete) {
                  Promise.resolve().then(() => this.__resolveRenderComplete(false));
              }
          }
          return this.__renderComplete;
      }
  }

  const __maxRandomnessOffset = 2;
  const __roughness = 1;
  const __bowing = 0.85;
  const __curveTightness = 0;
  const __curveStepCount = 9;

  class Wires {
    _svgNode(tagName, attributes) {
      const n = document.createElementNS("http://www.w3.org/2000/svg", tagName);
      if (attributes) {
        for (const p in attributes) {
          if (attributes.hasOwnProperty(p)) {
            n.setAttributeNS(null, p, attributes[p]);
          }
        }
      }
      return n;
    }

    line(svg, x1, y1, x2, y2) {
      const path = this._line(x1, y1, x2, y2);
      const node = this._svgNode("path", { d: path.value });
      svg.appendChild(node);
      return node;
    }

    rectangle(svg, x, y, width, height) {
      x = x + 2;
      y = y + 2;
      width = width - 4;
      height = height - 4;
      let path = this._line(x, y, x + width, y);
      path = this._line(x + width, y, x + width, y + height, path);
      path = this._line(x + width, y + height, x, y + height, path);
      path = this._line(x, y + height, x, y, path);
      const node = this._svgNode("path", { d: path.value });
      svg.appendChild(node);
      return node;
    }

    polygon(svg, vertices) {
      let path = null;
      const vCount = vertices.length;
      if (vCount > 2) {
        for (let i = 0; i < 2; i++) {
          let move = true;
          for (let i = 1; i < vCount; i++) {
            path = this._continuousLine(vertices[i - 1][0], vertices[i - 1][1], vertices[i][0], vertices[i][1], move, i > 0, path);
            move = false;
          }
          path = this._continuousLine(vertices[vCount - 1][0], vertices[vCount - 1][1], vertices[0][0], vertices[0][1], move, i > 0, path);
        }
      } else if (vCount == 2) {
        path = this._line(vertices[0][0], vertices[0][1], vertices[1][0], vertices[1][1]);
      } else {
        path = new WiresPath();
      }

      const node = this._svgNode("path", { d: path.value });
      svg.appendChild(node);
      return node;
    }

    ellipse(svg, x, y, width, height) {
      width = Math.max(width > 10 ? width - 4 : width - 1, 1);
      height = Math.max(height > 10 ? height - 4 : height - 1, 1);
      const ellipseInc = (Math.PI * 2) / __curveStepCount;
      let rx = Math.abs(width / 2);
      let ry = Math.abs(height / 2);
      rx += this._getOffset(-rx * 0.05, rx * 0.05);
      ry += this._getOffset(-ry * 0.05, ry * 0.05);
      let path = this._ellipse(ellipseInc, x, y, rx, ry, 1, ellipseInc * this._getOffset(0.1, this._getOffset(0.4, 1)));
      path = this._ellipse(ellipseInc, x, y, rx, ry, 1.5, 0, path);
      const node = this._svgNode("path", { d: path.value });
      svg.appendChild(node);
      return node;
    }

    _ellipse(ellipseInc, cx, cy, rx, ry, offset, overlap, existingPath) {
      const radOffset = this._getOffset(-0.5, 0.5) - Math.PI / 2;
      const points = [];
      points.push([
        this._getOffset(-offset, offset) + cx + 0.9 * rx * Math.cos(radOffset - ellipseInc),
        this._getOffset(-offset, offset) + cy + 0.9 * ry * Math.sin(radOffset - ellipseInc)
      ]);
      for (let angle = radOffset; angle < (Math.PI * 2 + radOffset - 0.01); angle = angle + ellipseInc) {
        points.push([
          this._getOffset(-offset, offset) + cx + rx * Math.cos(angle),
          this._getOffset(-offset, offset) + cy + ry * Math.sin(angle)
        ]);
      }
      points.push([
        this._getOffset(-offset, offset) + cx + rx * Math.cos(radOffset + Math.PI * 2 + overlap * 0.5),
        this._getOffset(-offset, offset) + cy + ry * Math.sin(radOffset + Math.PI * 2 + overlap * 0.5)
      ]);
      points.push([
        this._getOffset(-offset, offset) + cx + 0.98 * rx * Math.cos(radOffset + overlap),
        this._getOffset(-offset, offset) + cy + 0.98 * ry * Math.sin(radOffset + overlap)
      ]);
      points.push([
        this._getOffset(-offset, offset) + cx + 0.9 * rx * Math.cos(radOffset + overlap * 0.5),
        this._getOffset(-offset, offset) + cy + 0.9 * ry * Math.sin(radOffset + overlap * 0.5)
      ]);
      return this._curve(points, existingPath);
    }

    _getOffset(min, max) {
      return __roughness * ((Math.random() * (max - min)) + min);
    }

    _line(x1, y1, x2, y2, existingPath) {
      const lengthSq = Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2);
      let offset = __maxRandomnessOffset;
      if ((offset * offset * 100) > lengthSq) {
        offset = Math.sqrt(lengthSq) / 10;
      }
      const halfOffset = offset / 2;
      const divergePoint = 0.2 + Math.random() * 0.2;
      let midDispX = __bowing * __maxRandomnessOffset * (y2 - y1) / 200;
      let midDispY = __bowing * __maxRandomnessOffset * (x1 - x2) / 200;
      midDispX = this._getOffset(-midDispX, midDispX);
      midDispY = this._getOffset(-midDispY, midDispY);

      let path = existingPath || new WiresPath();
      path.moveTo(x1 + this._getOffset(-offset, offset), y1 + this._getOffset(-offset, offset));
      path.bcurveTo(midDispX + x1 + (x2 - x1) * divergePoint + this._getOffset(-offset, offset),
        midDispY + y1 + (y2 - y1) * divergePoint + this._getOffset(-offset, offset),
        midDispX + x1 + 2 * (x2 - x1) * divergePoint + this._getOffset(-offset, offset),
        midDispY + y1 + 2 * (y2 - y1) * divergePoint + this._getOffset(-offset, offset),
        x2 + this._getOffset(-offset, offset),
        y2 + this._getOffset(-offset, offset)
      );
      path.moveTo(x1 + this._getOffset(-halfOffset, halfOffset), y1 + this._getOffset(-halfOffset, halfOffset));
      path.bcurveTo(midDispX + x1 + (x2 - x1) * divergePoint + this._getOffset(-halfOffset, halfOffset),
        midDispY + y1 + (y2 - y1) * divergePoint + this._getOffset(-halfOffset, halfOffset),
        midDispX + x1 + 2 * (x2 - x1) * divergePoint + this._getOffset(-halfOffset, halfOffset),
        midDispY + y1 + 2 * (y2 - y1) * divergePoint + this._getOffset(-halfOffset, halfOffset),
        x2 + this._getOffset(-halfOffset, halfOffset),
        y2 + this._getOffset(-halfOffset, halfOffset)
      );
      return path;
    }

    _continuousLine(x1, y1, x2, y2, move, overwrite, path) {
      path = path || new WiresPath();
      const lengthSq = Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2);
      let offset = __maxRandomnessOffset;
      if ((offset * offset * 100) > lengthSq) {
        offset = Math.sqrt(lengthSq) / 10;
      }
      const halfOffset = offset / 2;
      const divergePoint = 0.2 + Math.random() * 0.2;
      let midDispX = __bowing * __maxRandomnessOffset * (y2 - y1) / 200;
      let midDispY = __bowing * __maxRandomnessOffset * (x2) / 200;
      midDispX = this._getOffset(-midDispX, midDispX);
      midDispY = this._getOffset(-midDispY, midDispY);
      if (move) {
        path.moveTo(x1 + this._getOffset(-offset, offset), y1 + this._getOffset(-offset, offset));
      }
      if (!overwrite) {
        path.bcurveTo(midDispX + x1 + (x2 - x1) * divergePoint + this._getOffset(-offset, offset),
          midDispY + y1 + (y2 - y1) * divergePoint + this._getOffset(-offset, offset),
          midDispX + x1 + 2 * (x2 - x1) * divergePoint + this._getOffset(-offset, offset),
          midDispY + y1 + 2 * (y2 - y1) * divergePoint + this._getOffset(-offset, offset),
          x2 + this._getOffset(-offset, offset),
          y2 + this._getOffset(-offset, offset)
        );
      } else {
        path.bcurveTo(midDispX + x1 + (x2 - x1) * divergePoint + this._getOffset(-halfOffset, halfOffset),
          midDispY + y1 + (y2 - y1) * divergePoint + this._getOffset(-halfOffset, halfOffset),
          midDispX + x1 + 2 * (x2 - x1) * divergePoint + this._getOffset(-halfOffset, halfOffset),
          midDispY + y1 + 2 * (y2 - y1) * divergePoint + this._getOffset(-halfOffset, halfOffset),
          x2 + this._getOffset(-halfOffset, halfOffset),
          y2 + this._getOffset(-halfOffset, halfOffset)
        );
      }
      return path;
    }

    _curve(vertArray, existingPath) {
      const vertArrayLength = vertArray.length;
      let path = existingPath || new WiresPath();
      if (vertArrayLength > 3) {
        const b = [];
        const s = 1 - __curveTightness;
        path.moveTo(vertArray[1][0], vertArray[1][1]);
        for (let i = 1; (i + 2) < vertArrayLength; i++) {
          const cachedVertArray = vertArray[i];
          b[0] = [cachedVertArray[0], cachedVertArray[1]];
          b[1] = [cachedVertArray[0] + (s * vertArray[i + 1][0] - s * vertArray[i - 1][0]) / 6, cachedVertArray[1] + (s * vertArray[i + 1][1] - s * vertArray[i - 1][1]) / 6];
          b[2] = [vertArray[i + 1][0] + (s * vertArray[i][0] - s * vertArray[i + 2][0]) / 6, vertArray[i + 1][1] + (s * vertArray[i][1] - s * vertArray[i + 2][1]) / 6];
          b[3] = [vertArray[i + 1][0], vertArray[i + 1][1]];
          path.bcurveTo(b[1][0], b[1][1], b[2][0], b[2][1], b[3][0], b[3][1]);
        }
      } else if (vertArrayLength === 3) {
        path.moveTo(vertArray[0][0], vertArray[0][1]);
        path.bcurveTo(vertArray[1][0], vertArray[1][1],
          vertArray[2][0], vertArray[2][1],
          vertArray[2][0], vertArray[2][1]);
      } else if (vertArrayLength == 2) {
        path = this._line(vertArray[0][0], vertArray[0][1], vertArray[1][0], vertArray[1][1], path);
      }
      return path;
    }
  }

  class WiresPath {
    constructor() {
      this.p = "";
    }

    get value() {
      return this.p.trim();
    }

    moveTo(x, y) {
      this.p += "M " + x + " " + y + " ";
    }

    bcurveTo(cp1x, cp1y, cp2x, cp2y, x, y) {
      this.p += "C " + cp1x + " " + cp1y + ", " + cp2x + " " + cp2y + ", " + x + " " + y + " ";
    }
  }

  const wired = new Wires();

  class WiredButton extends LitElement {
    static get properties() {
      return {
        elevation: Number,
        disabled: Boolean
      };
    }

    constructor() {
      super();
      this.elevation = 1;
      this.disabled = false;
    }

    _createRoot() {
      const root = this.attachShadow({ mode: 'open' });
      this.classList.add('pending');
      return root;
    }

    _render({ text, elevation, disabled }) {
      this._onDisableChange();
      return html$1`
    <style>
      :host {
        display: inline-block;
        font-family: inherit;
        cursor: pointer;
        padding: 8px 10px;
        position: relative;
        text-align: center;
        -moz-user-select: none;
        -ms-user-select: none;
        -webkit-user-select: none;
        user-select: none;
        justify-content: center;
        flex-direction: column;
        text-align: center;
        display: inline-flex;
      }

      :host(.pending) {
        opacity: 0;
      }

      :host(:active) path {
        transform: scale(0.97) translate(1.5%, 1.5%);
      }

      :host(.disabled) {
        opacity: 0.6 !important;
        background: rgba(0, 0, 0, 0.07);
        cursor: default;
        pointer-events: none;
      }

      .overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        pointer-events: none;
      }

      svg {
        display: block;
      }

      path {
        stroke: currentColor;
        stroke-width: 0.7;
        fill: transparent;
        transition: transform 0.05s ease;
      }
    </style>
    <slot></slot>
    <div class="overlay">
      <svg id="svg"></svg>
    </div>
    `;
    }

    _onDisableChange() {
      if (this.disabled) {
        this.classList.add("disabled");
      } else {
        this.classList.remove("disabled");
      }
      this.tabIndex = this.disabled ? -1 : (this.getAttribute('tabindex') || 0);
    }

    _clearNode(node) {
      while (node.hasChildNodes()) {
        node.removeChild(node.lastChild);
      }
    }

    connectedCallback() {
      super.connectedCallback();
      setTimeout(() => this._didRender());
      this.addEventListener('keydown', (event) => {
        if ((event.keyCode === 13) || (event.keyCode === 32)) {
          event.preventDefault();
          this.click();
        }
      });
      this.setAttribute('role', 'button');
      this.setAttribute('aria-label', this.innerHTML);
    }

    _didRender() {
      const svg = this.shadowRoot.getElementById('svg');
      this._clearNode(svg);
      const s = this.getBoundingClientRect();
      const elev = Math.min(Math.max(1, this.elevation), 5);
      const w = s.width + ((elev - 1) * 2);
      const h = s.height + ((elev - 1) * 2);
      svg.setAttribute("width", w);
      svg.setAttribute("height", h);
      wired.rectangle(svg, 0, 0, s.width, s.height);
      for (var i = 1; i < elev; i++) {
        (wired.line(svg, (i * 2), s.height + (i * 2), s.width + (i * 2), s.height + (i * 2))).style.opacity = (75 - (i * 10)) / 100;
        (wired.line(svg, s.width + (i * 2), s.height + (i * 2), s.width + (i * 2), i * 2)).style.opacity = (75 - (i * 10)) / 100;
        (wired.line(svg, (i * 2), s.height + (i * 2), s.width + (i * 2), s.height + (i * 2))).style.opacity = (75 - (i * 10)) / 100;
        (wired.line(svg, s.width + (i * 2), s.height + (i * 2), s.width + (i * 2), i * 2)).style.opacity = (75 - (i * 10)) / 100;
      }
      this.classList.remove('pending');
    }
  }

  customElements.define('wired-button', WiredButton);

  class WiredCard extends LitElement {
    static get properties() {
      return {
        elevation: Number
      };
    }

    constructor() {
      super();
      this.elevation = 1;
    }

    _createRoot() {
      const root = this.attachShadow({ mode: 'open' });
      this.classList.add('pending');
      return root;
    }

    _render() {
      return html$1`
    <style>
      :host {
        display: inline-block;
        position: relative;
        padding: 5px;
      }
    
      :host(.pending) {
        opacity: 0;
      }
    
      .overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        pointer-events: none;
      }
    
      svg {
        display: block;
      }
    
      path {
        stroke: currentColor;
        stroke-width: 0.7;
        fill: transparent;
      }
    </style>
    <div>
      <slot on-slotchange="${() => this.requestRender()}"></slot>
    </div>
    <div class="overlay">
      <svg id="svg"></svg>
    </div>
    `;
    }

    _clearNode(node) {
      while (node.hasChildNodes()) {
        node.removeChild(node.lastChild);
      }
    }

    connectedCallback() {
      super.connectedCallback();
      setTimeout(() => this._didRender());
    }

    _didRender() {
      const svg = this.shadowRoot.getElementById('svg');
      this._clearNode(svg);
      var s = this.getBoundingClientRect();
      var elev = Math.min(Math.max(1, this.elevation), 5);
      var w = s.width + ((elev - 1) * 2);
      var h = s.height + ((elev - 1) * 2);
      svg.setAttribute("width", w);
      svg.setAttribute("height", h);
      wired.rectangle(svg, 0, 0, s.width, s.height);
      for (var i = 1; i < elev; i++) {
        (wired.line(svg, (i * 2), s.height + (i * 2), s.width + (i * 2), s.height + (i * 2))).style.opacity = (85 - (i * 10)) / 100;
        (wired.line(svg, s.width + (i * 2), s.height + (i * 2), s.width + (i * 2), i * 2)).style.opacity = (85 - (i * 10)) / 100;
        (wired.line(svg, (i * 2), s.height + (i * 2), s.width + (i * 2), s.height + (i * 2))).style.opacity = (85 - (i * 10)) / 100;
        (wired.line(svg, s.width + (i * 2), s.height + (i * 2), s.width + (i * 2), i * 2)).style.opacity = (85 - (i * 10)) / 100;
      }
      this.classList.remove('pending');
    }
  }
  customElements.define('wired-card', WiredCard);

  class WiredCheckbox extends LitElement {
    static get properties() {
      return {
        checked: Boolean,
        text: String,
        disabled: Boolean
      };
    }

    constructor() {
      super();
      this.disabled = false;
      this.checked = false;
    }

    _createRoot() {
      const root = this.attachShadow({ mode: 'open' });
      this.classList.add('pending');
      return root;
    }

    _render({ text }) {
      this._onDisableChange();
      return html$1`
    <style>
      :host {
        display: block;
        font-family: inherit;
        outline: none;
      }
    
      :host(.disabled) {
        opacity: 0.6 !important;
        cursor: default;
        pointer-events: none;
      }
    
      :host(.disabled) svg {
        background: rgba(0, 0, 0, 0.07);
      }
    
      :host(.pending) {
        opacity: 0;
      }
    
      :host(:focus) #checkPanel {
        outline: 3px solid var(--wired-focused-background, rgba(0, 0, 255, 0.2));
      }
    
      #container {
        display: inline-block;
        white-space: nowrap;
      }
    
      .inline {
        display: inline-block;
        vertical-align: middle;
      }
    
      #checkPanel {
        cursor: pointer;
      }
    
      svg {
        display: block;
      }
    
      path {
        stroke: var(--wired-checkbox-icon-color, currentColor);
        stroke-width: 0.7;
      }
    </style>
    <div id="container" on-click="${() => this._toggleCheck()}">
      <div id="checkPanel" class="inline">
        <svg id="svg" width="0" height="0"></svg>
      </div>
      <div class="inline">${text}</div>
    </div>
    `;
    }

    _onDisableChange() {
      if (this.disabled) {
        this.classList.add("disabled");
      } else {
        this.classList.remove("disabled");
      }
      this._refreshTabIndex();
    }

    _refreshTabIndex() {
      this.tabIndex = this.disabled ? -1 : (this.getAttribute('tabindex') || 0);
    }

    _setAria() {
      this.setAttribute('role', 'checkbox');
      this.setAttribute('aria-checked', this.checked);
      this.setAttribute('aria-label', this.text);
    }

    _toggleCheck() {
      this.checked = !(this.checked || false);
      const event = new CustomEvent('change', { bubbles: true, composed: true, checked: this.checked, detail: { checked: this.checked } });
      this.dispatchEvent(event);
    }

    _clearNode(node) {
      while (node.hasChildNodes()) {
        node.removeChild(node.lastChild);
      }
    }

    _didRender() {
      const svg = this.shadowRoot.getElementById('svg');
      this._clearNode(svg);
      const s = { width: 24, height: 24 };
      svg.setAttribute("width", s.width);
      svg.setAttribute("height", s.height);
      wired.rectangle(svg, 0, 0, s.width, s.height);
      const checkpaths = [];
      checkpaths.push(wired.line(svg, s.width * 0.3, s.height * 0.4, s.width * 0.5, s.height * 0.7));
      checkpaths.push(wired.line(svg, s.width * 0.5, s.height * 0.7, s.width + 5, -5));
      checkpaths.forEach((d) => {
        d.style.strokeWidth = 2.5;
      });
      if (this.checked) {
        checkpaths.forEach((d) => {
          d.style.display = "";
        });
      } else {
        checkpaths.forEach((d) => {
          d.style.display = "none";
        });
      }
      this.classList.remove('pending');

      this._setAria();
      this._attachEvents();
    }


    _attachEvents() {
      if (!this._keyboardAttached) {
        this.addEventListener('keydown', (event) => {
          if ((event.keyCode === 13) || (event.keyCode === 32)) {
            event.preventDefault();
            this._toggleCheck();
          }
        });
        this._keyboardAttached = true;
      }
    }

  }
  customElements.define('wired-checkbox', WiredCheckbox);

  class WiredItem extends LitElement {
    static get properties() {
      return {
        text: String,
        value: String
      };
    }

    _render({ text }) {
      return html$1`
    <style>
      :host {
        display: block;
        padding: 8px;
        font-family: inherit;
      }
    </style>
    <span>${text}</span>
    `;
    }

    connectedCallback() {
      super.connectedCallback();
      this._itemClickHandler = (event) => {
        this._onClick(event);
      };
      this.addEventListener("click", this._itemClickHandler);
    }

    disconnectedCallback() {
      super.disconnectedCallback();
      if (this._itemClickHandler) {
        this.removeEventListener("click", this._itemClickHandler);
        this._itemClickHandler = null;
      }
    }

    _onClick(e) {
      const event = new CustomEvent('item-click', { bubbles: true, composed: true, detail: { text: this.text, value: this.value } });
      this.dispatchEvent(event);
    }
  }
  customElements.define('wired-item', WiredItem);

  class WiredCombo extends LitElement {
    static get properties() {
      return {
        value: Object,
        selected: String,
        disabled: Boolean
      };
    }

    constructor() {
      super();
      this.disabled = false;
      this._cardShowing = false;
      this._itemNodes = [];
    }

    _createRoot() {
      const root = this.attachShadow({ mode: 'open' });
      this.classList.add('pending');
      return root;
    }

    _render({ value }) {
      this._onDisableChange();
      return html$1`
    <style>
      :host {
        display: inline-block;
        font-family: inherit;
        position: relative;
      }
    
      :host(.disabled) {
        opacity: 0.5 !important;
        cursor: default;
        pointer-events: none;
        background: rgba(0, 0, 0, 0.02);
      }
    
      :host(.pending) {
        opacity: 0;
      }
    
      #container {
        white-space: nowrap;
        position: relative;
      }
    
      .inline {
        display: inline-block;
        vertical-align: top
      }
    
      #textPanel {
        min-width: 90px;
        min-height: 18px;
        padding: 8px;
      }
    
      #dropPanel {
        width: 34px;
        cursor: pointer;
      }
    
      .overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        pointer-events: none;
      }
    
      svg {
        display: block;
      }
    
      path {
        stroke: currentColor;
        stroke-width: 0.7;
        fill: transparent;
      }
    
      #card {
        position: absolute;
        background: var(--wired-combo-popup-bg, white);
        z-index: 1;
        box-shadow: 1px 5px 15px -6px rgba(0, 0, 0, 0.8);
      }

      ::slotted(.selected-item) {
        background: var(--wired-combo-item-selected-bg, rgba(0, 0, 200, 0.1));
      }
    
      ::slotted(wired-item) {
        cursor: pointer;
        white-space: nowrap;
      }
    
      ::slotted(wired-item:hover) {
        background: var(--wired-combo-item-hover-bg, rgba(0, 0, 0, 0.1));
      }
    </style>
    <div id="container" on-click="${(e) => this._onCombo(e)}">
      <div id="textPanel" class="inline">
        <span>${value && value.text}</span>
      </div>
      <div id="dropPanel" class="inline"></div>
      <div class="overlay">
        <svg id="svg"></svg>
      </div>
    </div>
    <wired-card id="card" role="listbox" on-item-click="${(e) => this._onItemClick(e)}" style="display: none;">
      <slot id="slot"></slot>
    </wired-card>
    `;
    }

    _onDisableChange() {
      if (this.disabled) {
        this.classList.add("disabled");
      } else {
        this.classList.remove("disabled");
      }
      this._refreshTabIndex();
    }

    _refreshTabIndex() {
      this.tabIndex = this.disabled ? -1 : (this.getAttribute('tabindex') || 0);
    }

    _setAria() {
      this.setAttribute('role', 'combobox');
      this.setAttribute('aria-haspopup', 'listbox');
      this.setAttribute('aria-expanded', this._cardShowing);
      if (!this._itemNodes.length) {
        this._itemNodes = [];
        const nodes = this.shadowRoot.getElementById('slot').assignedNodes();
        if (nodes && nodes.length) {
          for (let i = 0; i < nodes.length; i++) {
            if (nodes[i].tagName === "WIRED-ITEM") {
              nodes[i].setAttribute('role', 'option');
              this._itemNodes.push(nodes[i]);
            }
          }
        }
      }
    }

    _clearNode(node) {
      while (node.hasChildNodes()) {
        node.removeChild(node.lastChild);
      }
    }

    _firstRendered() {
      this._refreshSelection();
    }

    _didRender() {
      const svg = this.shadowRoot.getElementById('svg');
      this._clearNode(svg);
      const s = this.shadowRoot.getElementById('container').getBoundingClientRect();
      svg.setAttribute("width", s.width);
      svg.setAttribute("height", s.height);
      const textBounds = this.shadowRoot.getElementById('textPanel').getBoundingClientRect();
      this.shadowRoot.getElementById('dropPanel').style.minHeight = textBounds.height + "px";
      wired.rectangle(svg, 0, 0, textBounds.width, textBounds.height);
      const dropx = textBounds.width - 4;
      wired.rectangle(svg, dropx, 0, 34, textBounds.height);
      const dropOffset = Math.max(0, Math.abs((textBounds.height - 24) / 2));
      const poly = wired.polygon(svg, [
        [dropx + 8, 5 + dropOffset],
        [dropx + 26, 5 + dropOffset],
        [dropx + 17, dropOffset + Math.min(textBounds.height, 18)]
      ]);
      poly.style.fill = "currentColor";
      poly.style.pointerEvents = this.disabled ? 'none' : 'auto';
      poly.style.cursor = "pointer";
      this.classList.remove('pending');
      this._setAria();
      this._attachEvents();
    }

    _refreshSelection() {
      if (this.lastSelectedItem) {
        this.lastSelectedItem.classList.remove("selected-item");
        this.lastSelectedItem.removeAttribute('aria-selected');
      }
      const slot = this.shadowRoot.getElementById('slot');
      const nodes = slot.assignedNodes();
      if (nodes) {
        let selectedItem = null;
        for (let i = 0; i < nodes.length; i++) {
          if (nodes[i].tagName === "WIRED-ITEM") {
            const value = nodes[i].value || "";
            if (this.selected && (value === this.selected)) {
              selectedItem = nodes[i];
              break;
            }
          }
        }
        this.lastSelectedItem = selectedItem;
        if (this.lastSelectedItem) {
          this.lastSelectedItem.classList.add("selected-item");
          this.lastSelectedItem.setAttribute('aria-selected', 'true');
        }
        if (selectedItem) {
          this.value = {
            value: selectedItem.value,
            text: selectedItem.text
          };
        } else {
          this.value = null;
        }
      }
    }

    _onCombo(event) {
      event.stopPropagation();
      this._setCardShowing(!this._cardShowing);
    }

    _setCardShowing(showing) {
      this._cardShowing = showing;
      const card = this.shadowRoot.getElementById('card');
      card.style.display = showing ? "" : "none";
      if (showing) {
        setTimeout(() => {
          card.requestRender();
        }, 10);
      }
      this.setAttribute('aria-expanded', this._cardShowing);
    }

    _onItemClick(event) {
      event.stopPropagation();
      this._setCardShowing(false);
      this.selected = event.detail.value;
      this._refreshSelection();
      this._fireSelected();
    }

    _fireSelected() {
      const selectedEvent = new CustomEvent('selected', { bubbles: true, composed: true, checked: this.checked, detail: { selected: this.selected } });
      this.dispatchEvent(selectedEvent);
    }

    _attachEvents() {
      if (!this._keyboardAttached) {
        this.addEventListener('blur', () => {
          if (this._cardShowing) {
            this._setCardShowing(false);
          }
        });
        this.addEventListener('keydown', (event) => {
          switch (event.keyCode) {
            case 37:
            case 38:
              event.preventDefault();
              this._selectPrevious();
              break;
            case 39:
            case 40:
              event.preventDefault();
              this._selectNext();
              break;
            case 27:
              event.preventDefault();
              if (this._cardShowing) {
                this._setCardShowing(false);
              }
              break;
            case 13:
              event.preventDefault();
              this._setCardShowing(!this._cardShowing);
              break;
            case 32:
              event.preventDefault();
              if (!this._cardShowing) {
                this._setCardShowing(true);
              }
              break;
          }
        });
        this._keyboardAttached = true;
      }
    }

    _selectPrevious() {
      const list = this._itemNodes;
      if (list.length) {
        let index = -1;
        for (let i = 0; i < list.length; i++) {
          if (list[i] === this.lastSelectedItem) {
            index = i;
            break;
          }
        }
        if (index < 0) {
          index = 0;
        } else if (index === 0) {
          index = list.length - 1;
        } else {
          index--;
        }
        this.selected = list[index].value || '';
        this._refreshSelection();
        this._fireSelected();
      }
    }

    _selectNext() {
      const list = this._itemNodes;
      if (list.length) {
        let index = -1;
        for (let i = 0; i < list.length; i++) {
          if (list[i] === this.lastSelectedItem) {
            index = i;
            break;
          }
        }
        if (index < 0) {
          index = 0;
        } else if (index >= (list.length - 1)) {
          index = 0;
        } else {
          index++;
        }
        this.selected = list[index].value || '';
        this._refreshSelection();
        this._fireSelected();
      }
    }
  }
  customElements.define('wired-combo', WiredCombo);

  /**
  @license
  Copyright 2018 Google Inc. All Rights Reserved.

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
  */

  const style = html$1`<style>:host{font-family:var(--mdc-icon-font, "Material Icons");font-weight:normal;font-style:normal;font-size:var(--mdc-icon-size, 24px);line-height:1;letter-spacing:normal;text-transform:none;display:inline-block;white-space:nowrap;word-wrap:normal;direction:ltr;-webkit-font-feature-settings:'liga';-webkit-font-smoothing:antialiased}
</style>`;

  /**
  @license
  Copyright 2018 Google Inc. All Rights Reserved.

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
  */

  // load material icons font
  const fontEl = document.createElement('link');
  fontEl.rel = 'stylesheet';
  fontEl.href = 'https://fonts.googleapis.com/icon?family=Material+Icons';
  document.head.appendChild(fontEl);

  /**
  @license
  Copyright 2018 Google Inc. All Rights Reserved.

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
  */

  class Icon extends LitElement {
    _renderStyle() {
      return style;
    }
    _render() {
      return html$1`${this._renderStyle()}<slot></slot>`;
    }
  }

  customElements.define('mwc-icon', Icon);

  class WiredIconButton extends LitElement {
    static get properties() {
      return {
        disabled: Boolean
      };
    }

    constructor() {
      super();
      this.disabled = false;
    }

    _createRoot() {
      const root = this.attachShadow({ mode: 'open' });
      this.classList.add('pending');
      return root;
    }

    _render() {
      this._onDisableChange();
      return html$1`
    <style>
      :host {
        display: -ms-inline-flexbox;
        display: -webkit-inline-flex;
        display: inline-flex;
        -ms-flex-align: center;
        -webkit-align-items: center;
        align-items: center;
        -ms-flex-pack: center;
        -webkit-justify-content: center;
        justify-content: center;
        position: relative;
        vertical-align: middle;
        padding: 8px;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        cursor: pointer;
        z-index: 0;
        line-height: 1;
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        -webkit-tap-highlight-color: transparent;
        box-sizing: border-box !important;
      }
    
      :host(.pending) {
        opacity: 0;
      }
    
      :host(.disabled) {
        opacity: 0.45 !important;
        cursor: default;
        background: rgba(0, 0, 0, 0.07);
        border-radius: 50%;
        pointer-events: none;
      }
    
      :host(:active) path {
        transform: scale(0.96) translate(2%, 2%);
      }
    
      .overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        pointer-events: none;
      }
    
      svg {
        display: block;
      }
    
      path {
        stroke: currentColor;
        stroke-width: 0.7;
        fill: var(--wired-icon-bg-color, transparent);
        transition: transform 0.05s ease;
      }
    
      mwc-icon {
        position: relative;
        font-size: var(--wired-icon-size, 24px);
      }
    </style>
    <div class="overlay">
      <svg id="svg"></svg>
    </div>
    <mwc-icon>
      <slot></slot>
    </mwc-icon>
    `;
    }

    _onDisableChange() {
      if (this.disabled) {
        this.classList.add("disabled");
      } else {
        this.classList.remove("disabled");
      }
      this._refreshTabIndex();
    }

    _refreshTabIndex() {
      this.tabIndex = this.disabled ? -1 : (this.getAttribute('tabindex') || 0);
    }

    _setAria() {
      this.setAttribute('role', 'button');
      this.setAttribute('aria-label', this.textContent);
    }

    _clearNode(node) {
      while (node.hasChildNodes()) {
        node.removeChild(node.lastChild);
      }
    }

    _didRender() {
      const svg = this.shadowRoot.getElementById('svg');
      this._clearNode(svg);
      const s = this.getBoundingClientRect();
      const min = Math.min(s.width, s.height);
      svg.setAttribute("width", min);
      svg.setAttribute("height", min);
      wired.ellipse(svg, min / 2, min / 2, min, min);
      this.classList.remove('pending');
      this._setAria();
      this._attachEvents();
    }

    _attachEvents() {
      if (!this._keyboardAttached) {
        this.addEventListener('keydown', (event) => {
          if ((event.keyCode === 13) || (event.keyCode === 32)) {
            event.preventDefault();
            this.click();
          }
        });
        this._keyboardAttached = true;
      }
    }

    connectedCallback() {
      super.connectedCallback();
      setTimeout(() => this._didRender());
    }
  }
  customElements.define('wired-icon-button', WiredIconButton);

  class WiredInput extends LitElement {
    static get properties() {
      return {
        placeholder: String,
        name: String,
        disabled: Boolean,
        type: String,
        required: Boolean,
        autocomplete: String,
        autofocus: Boolean,
        minlength: Number,
        maxlength: Number,
        min: String,
        max: String,
        step: String,
        readonly: Boolean,
        size: Number,
        autocapitalize: String,
        autocorrect: String,
        value: String
      };
    }

    constructor() {
      super();
      this.disabled = false;
    }

    _createRoot() {
      const root = this.attachShadow({ mode: 'open', delegatesFocus: true });
      this.classList.add('pending');
      return root;
    }

    _render({ type, placeholder, disabled, required, autocomplete, autofocus, minlength, maxlength, min, max, step, readonly, size, autocapitalize, autocorrect, name }) {
      this._onDisableChange();
      return html$1`
    <style>
      :host {
        display: inline-block;
        position: relative;
        padding: 5px;
        font-family: sans-serif;
        width: 150px;
        outline: none;
      }
    
      :host(.pending) {
        opacity: 0;
      }
    
      :host(.disabled) {
        opacity: 0.6 !important;
        cursor: default;
        pointer-events: none;
      }
    
      :host(.disabled) svg {
        background: rgba(0, 0, 0, 0.07);
      }
    
      .overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        pointer-events: none;
      }
    
      svg {
        display: block;
      }
    
      path {
        stroke: currentColor;
        stroke-width: 0.7;
        fill: transparent;
      }
    
      input {
        display: block;
        width: 100%;
        box-sizing: border-box;
        outline: none;
        border: none;
        font-family: inherit;
        font-size: inherit;
        font-weight: inherit;
        color: inherit;
      }
    </style>
    <input id="txt" name$="${name}" type$="${type}" placeholder$="${placeholder}" disabled?="${disabled}" required?="${required}"
      autocomplete$="${autocomplete}" autofocus?="${autofocus}" minlength$="${minlength}" maxlength$="${maxlength}" min$="${min}"
      max$="${max}" step$="${step}" readonly?="${readonly}" size$="${size}" autocapitalize$="${autocapitalize}" autocorrect$="${autocorrect}"
      on-change="${(e) => this._onChange(e)}">
    <div class="overlay">
      <svg id="svg"></svg>
    </div>
    `;
    }

    get input() {
      return this.shadowRoot.getElementById('txt');
    }

    get value() {
      const input = this.input;
      return (input && input.value) || '';
    }

    set value(v) {
      if (this.shadowRoot) {
        const input = this.input;
        if (input) {
          input.value = v;
        }
      } else {
        this._value = v;
      }
    }

    _onDisableChange() {
      if (this.disabled) {
        this.classList.add("disabled");
      } else {
        this.classList.remove("disabled");
      }
    }

    _onChange(event) {
      event.stopPropagation();
      const newEvent = new CustomEvent(event.type, { bubbles: true, composed: true, cancelable: event.cancelable, detail: { sourceEvent: event } });
      this.dispatchEvent(newEvent);
    }

    _clearNode(node) {
      while (node.hasChildNodes()) {
        node.removeChild(node.lastChild);
      }
    }

    _didRender() {
      const svg = this.shadowRoot.getElementById('svg');
      this._clearNode(svg);
      const s = this.getBoundingClientRect();
      svg.setAttribute("width", s.width);
      svg.setAttribute("height", s.height);
      wired.rectangle(svg, 0, 0, s.width, s.height);
      this.classList.remove('pending');
      if (typeof this._value !== 'undefined') {
        this.input.value = this._value;
        delete this._value;
      }
    }
  }
  customElements.define('wired-input', WiredInput);

  class WiredListbox extends LitElement {
    static get properties() {
      return {
        value: Object,
        selected: String,
        horizontal: Boolean
      }
    }

    constructor() {
      super();
      this.horizontal = false;
      this._itemNodes = [];
    }

    _createRoot() {
      const root = this.attachShadow({ mode: 'open' });
      this.classList.add('pending');
      return root;
    }

    _render({ horizontal }) {
      if (horizontal) {
        this.classList.add('horizontal');
      } else {
        this.classList.remove('horizontal');
      }
      this.tabIndex = (this.getAttribute('tabindex') || 0);
      return html$1`
      <style>
        :host {
          display: inline-block;
          font-family: inherit;
          position: relative;
          padding: 5px;
        }
      
        :host(.pending) {
          opacity: 0;
        }
      
        .overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
        }
      
        svg {
          display: block;
        }
      
        path {
          stroke: currentColor;
          stroke-width: 0.7;
          fill: transparent;
        }
      
        ::slotted(.selected-item) {
          background: var(--wired-combo-item-selected-bg, rgba(0, 0, 200, 0.1));
        }
      
        ::slotted(wired-item) {
          cursor: pointer;
          white-space: nowrap;
          display: block;
        }
      
        :host(.horizontal) ::slotted(wired-item) {
          display: inline-block;
        }
      
        ::slotted(wired-item:hover) {
          background: var(--wired-combo-item-hover-bg, rgba(0, 0, 0, 0.1));
        }
      </style>
      <slot id="slot" on-slotchange="${() => this.requestRender()}"></slot>
      <div class="overlay">
        <svg id="svg"></svg>
      </div>`;
    }

    connectedCallback() {
      super.connectedCallback();
      this._itemClickHandler = (event) => {
        this._onItemClick(event);
      };
      this.addEventListener("item-click", this._itemClickHandler);
      setTimeout(() => this._didRender());
    }

    disconnectedCallback() {
      super.disconnectedCallback();
      if (this._itemClickHandler) {
        this.removeEventListener("item-click", this._itemClickHandler);
        this._itemClickHandler = null;
      }
    }

    _clearNode(node) {
      while (node.hasChildNodes()) {
        node.removeChild(node.lastChild);
      }
    }

    _firstRendered() {
      this._refreshSelection();
    }

    _didRender() {
      const svg = this.shadowRoot.getElementById('svg');
      this._clearNode(svg);
      const s = this.getBoundingClientRect();
      svg.setAttribute("width", s.width);
      svg.setAttribute("height", s.height);
      wired.rectangle(svg, 0, 0, s.width, s.height);
      this.classList.remove('pending');
      this._setAria();
      this._attachEvents();
    }

    _setAria() {
      this.setAttribute('role', 'listbox');
      if (!this._itemNodes.length) {
        this._itemNodes = [];
        const nodes = this.shadowRoot.getElementById('slot').assignedNodes();
        if (nodes && nodes.length) {
          for (let i = 0; i < nodes.length; i++) {
            if (nodes[i].tagName === "WIRED-ITEM") {
              nodes[i].setAttribute('role', 'option');
              this._itemNodes.push(nodes[i]);
            }
          }
        }
      }
    }

    _refreshSelection() {
      if (this.lastSelectedItem) {
        this.lastSelectedItem.classList.remove("selected-item");
        this.lastSelectedItem.removeAttribute('aria-selected');
      }
      const nodes = this.shadowRoot.getElementById('slot').assignedNodes();
      if (nodes) {
        let selectedItem = null;
        for (let i = 0; i < nodes.length; i++) {
          if (nodes[i].tagName === "WIRED-ITEM") {
            const value = nodes[i].value || "";
            if (this.selected && (value === this.selected)) {
              selectedItem = nodes[i];
              break;
            }
          }
        }
        this.lastSelectedItem = selectedItem;
        if (this.lastSelectedItem) {
          this.lastSelectedItem.setAttribute('aria-selected', 'true');
        }
        if (selectedItem) {
          this.lastSelectedItem.classList.add("selected-item");
          this.value = {
            value: selectedItem.value,
            text: selectedItem.text
          };
        } else {
          this.value = null;
        }
      }
    }

    _onItemClick(event) {
      event.stopPropagation();
      this.selected = event.detail.value;
      this._refreshSelection();
      this._fireSelected();
    }

    _fireSelected() {
      const selectedEvent = new CustomEvent('selected', { bubbles: true, composed: true, checked: this.checked, detail: { selected: this.selected } });
      this.dispatchEvent(selectedEvent);
    }

    _attachEvents() {
      if (!this._keyboardAttached) {
        this.addEventListener('keydown', (event) => {
          switch (event.keyCode) {
            case 37:
            case 38:
              event.preventDefault();
              this._selectPrevious();
              break;
            case 39:
            case 40:
              event.preventDefault();
              this._selectNext();
              break;
          }
        });
        this._keyboardAttached = true;
      }
    }

    _selectPrevious() {
      const list = this._itemNodes;
      if (list.length) {
        let index = -1;
        for (let i = 0; i < list.length; i++) {
          if (list[i] === this.lastSelectedItem) {
            index = i;
            break;
          }
        }
        if (index < 0) {
          index = 0;
        } else if (index === 0) {
          index = list.length - 1;
        } else {
          index--;
        }
        this.selected = list[index].value || '';
        this._refreshSelection();
        this._fireSelected();
      }
    }

    _selectNext() {
      const list = this._itemNodes;
      if (list.length) {
        let index = -1;
        for (let i = 0; i < list.length; i++) {
          if (list[i] === this.lastSelectedItem) {
            index = i;
            break;
          }
        }
        if (index < 0) {
          index = 0;
        } else if (index >= (list.length - 1)) {
          index = 0;
        } else {
          index++;
        }
        this.selected = list[index].value || '';
        this._refreshSelection();
        this._fireSelected();
      }
    }
  }

  customElements.define('wired-listbox', WiredListbox);

  class WiredProgress extends LitElement {
    static get properties() {
      return {
        value: Number,
        min: Number,
        max: Number,
        percentage: Boolean
      };
    }

    constructor() {
      super();
      this.percentage = false;
      this.max = 100;
      this.min = 0;
      this.value = 0;
    }

    _createRoot() {
      const root = this.attachShadow({ mode: 'open' });
      this.classList.add('pending');
      return root;
    }

    _render() {
      return html$1`
    <style>
      :host {
        display: inline-block;
        position: relative;
        width: 400px;
        height: 42px;
        font-family: sans-serif;
      }
    
      :host(.pending) {
        opacity: 0;
      }
    
      svg {
        display: block;
      }
    
      path {
        stroke: currentColor;
        stroke-width: 0.7;
        fill: transparent;
      }
    
      .overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        pointer-events: none;
      }
    
      .labelContainer {
        display: flex;
        align-items: center;
        justify-content: center;
      }
    
      .progressLabel {
        color: var(--wired-progress-label-color, #000);
        font-size: var(--wired-progress-font-size, 18px);
      }
    
      .progbox {
        fill: var(--wired-progress-color, rgba(0, 0, 200, 0.1));
        stroke-opacity: 0.6;
        stroke-width: 0.4;
      }
    </style>
    <div class="overlay">
      <svg id="svg"></svg>
    </div>
    <div class="overlay labelContainer">
      <div class="progressLabel">${this._getProgressLabel()}</div>
    </div>
    `;
    }

    _getProgressLabel() {
      if (this.percentage) {
        if (this.max == this.min) {
          return '%';
        } else {
          var pct = Math.floor(((this.value - this.min) / (this.max - this.min)) * 100);
          return (pct + "%");
        }
      } else {
        return ("" + this.value);
      }
    }

    _clearNode(node) {
      while (node.hasChildNodes()) {
        node.removeChild(node.lastChild);
      }
    }

    _didRender() {
      const svg = this.shadowRoot.getElementById('svg');
      this._clearNode(svg);
      var s = this.getBoundingClientRect();
      svg.setAttribute("width", s.width);
      svg.setAttribute("height", s.height);
      wired.rectangle(svg, 0, 0, s.width, s.height);

      let pct = 0;
      if (this.max > this.min) {
        pct = (this.value - this.min) / (this.max - this.min);
        const progWidth = s.width * Math.max(0, Math.min(pct, 100));
        const progBox = wired.polygon(svg, [
          [0, 0],
          [progWidth, 0],
          [progWidth, s.height],
          [0, s.height]
        ]);
        progBox.classList.add("progbox");
      }
      this.classList.remove('pending');
    }
  }
  customElements.define('wired-progress', WiredProgress);

  class WiredRadio extends LitElement {
    static get properties() {
      return {
        checked: Boolean,
        name: String,
        text: String,
        iconsize: Number,
        disabled: Boolean
      };
    }

    constructor() {
      super();
      this.disabled = false;
      this.checked = false;
      this.iconsize = 24;
    }

    _createRoot() {
      const root = this.attachShadow({ mode: 'open' });
      this.classList.add('pending');
      return root;
    }

    _render({ text }) {
      this._onDisableChange();
      return html$1`
    <style>
      :host {
        display: inline-block;
        position: relative;
        padding: 5px;
        font-family: inherit;
        width: 150px;
        outline: none;
      }
    
      :host(.pending) {
        opacity: 0;
      }
    
      :host(.disabled) {
        opacity: 0.45 !important;
        cursor: default;
        pointer-events: none;
      }
    
      :host(:focus) #checkPanel {
        outline: 3px solid var(--wired-focused-background, rgba(0, 0, 255, 0.2));
      }
    
      #container {
        display: inline-block;
        white-space: nowrap;
      }
    
      .inline {
        display: inline-block;
        vertical-align: middle;
      }
    
      #checkPanel {
        cursor: pointer;
      }
    
      svg {
        display: block;
      }
    
      path {
        stroke: var(--wired-radio-icon-color, currentColor);
        stroke-width: 0.7;
        fill: transparent;
      }
    
      .filledPath {
        fill: var(--wired-radio-icon-color, currentColor);
      }
    </style>
    <div id="container" on-click="${() => this._toggleCheck()}">
      <div id="checkPanel" class="inline">
        <svg id="svg" width="0" height="0"></svg>
      </div>
      <div class="inline">${text}</div>
    </div>
    `;
    }

    _onDisableChange() {
      if (this.disabled) {
        this.classList.add("disabled");
      } else {
        this.classList.remove("disabled");
      }
      this._refreshTabIndex();
    }

    _refreshTabIndex() {
      this.tabIndex = this.disabled ? -1 : (this.getAttribute('tabindex') || 0);
    }

    _setAria() {
      this.setAttribute('role', 'radio');
      this.setAttribute('aria-checked', this.checked);
      this.setAttribute('aria-label', this.text);
    }

    _toggleCheck() {
      this.checked = !(this.checked || false);
      const event = new CustomEvent('change', { bubbles: true, composed: true, checked: this.checked, detail: { checked: this.checked } });
      this.dispatchEvent(event);
    }

    _clearNode(node) {
      while (node.hasChildNodes()) {
        node.removeChild(node.lastChild);
      }
    }

    _didRender() {
      const svg = this.shadowRoot.getElementById('svg');
      this._clearNode(svg);
      this._dot = null;
      const s = { width: this.iconsize || 24, height: this.iconsize || 24 };
      svg.setAttribute("width", s.width);
      svg.setAttribute("height", s.height);
      wired.ellipse(svg, s.width / 2, s.height / 2, s.width, s.height);

      const iw = Math.max(s.width * 0.6, 5);
      const ih = Math.max(s.height * 0.6, 5);
      this._dot = wired.ellipse(svg, s.width / 2, s.height / 2, iw, ih);
      this._dot.classList.add("filledPath");
      this._dot.style.display = this.checked ? "" : "none";
      this.classList.remove('pending');

      this._setAria();
      this._attachEvents();
    }

    _attachEvents() {
      if (!this._keyboardAttached) {
        this.addEventListener('keydown', (event) => {
          if ((event.keyCode === 13) || (event.keyCode === 32)) {
            event.preventDefault();
            this._toggleCheck();
          }
        });
        this._keyboardAttached = true;
      }
    }
  }
  customElements.define('wired-radio', WiredRadio);

  class WiredRadioGroup extends LitElement {
    static get properties() {
      return {
        selected: String
      };
    }

    _render({ selected }) {
      return html$1`
    <style>
      :host {
        display: inline-block;
      }
    
      :host ::slotted(*) {
        padding: var(--wired-radio-group-item-padding, 5px);
      }
    </style>
    <slot id="slot" on-slotchange="${() => this.slotChange()}"></slot>
    `;
    }

    constructor() {
      super();
      this._radioNodes = [];
      this._checkListener = this._handleChecked.bind(this);
    }

    connectedCallback() {
      super.connectedCallback();
      this.addEventListener('change', this._checkListener);
    }

    disconnectedCallback() {
      super.disconnectedCallback();
      this.removeEventListener('checked', this._checkListener);
    }

    _handleChecked(event) {
      const checked = event.detail.checked;
      const name = event.target.name;
      if (!checked) {
        event.target.checked = true;
      } else {
        this.selected = (checked && name) || '';
        this._fireSelected();
      }
    }

    _fireSelected() {
      const ce = new CustomEvent('selected', { bubbles: true, composed: true, checked: this.checked, detail: { selected: this.selected } });
      this.dispatchEvent(ce);
    }

    slotChange() {
      this.requestRender();
    }

    _didRender() {
      const slot = this.shadowRoot.getElementById('slot');
      const nodes = slot.assignedNodes();
      this._radioNodes = [];
      if (nodes && nodes.length) {
        for (let i = 0; i < nodes.length; i++) {
          if (nodes[i].tagName === "WIRED-RADIO") {
            this._radioNodes.push(nodes[i]);
            const name = nodes[i].name || '';
            if (this.selected && (name === this.selected)) {
              nodes[i].checked = true;
            } else {
              nodes[i].checked = false;
            }
          }
        }
      }
      this.setAttribute('role', 'radiogroup');
      this.tabIndex = this.getAttribute('tabindex') || 0;
      this._attachEvents();
    }

    _attachEvents() {
      if (!this._keyboardAttached) {
        this.addEventListener('keydown', (event) => {
          switch (event.keyCode) {
            case 37:
            case 38:
              event.preventDefault();
              this._selectPrevious();
              break;
            case 39:
            case 40:
              event.preventDefault();
              this._selectNext();
              break;
          }
        });
        this._keyboardAttached = true;
      }
    }

    _selectPrevious() {
      const list = this._radioNodes;
      if (list.length) {
        let radio = null;
        let index = -1;
        if (this.selected) {
          for (let i = 0; i < list.length; i++) {
            const n = list[i];
            if (n.name === this.selected) {
              index = i;
              break;
            }
          }
          if (index < 0) {
            radio = list[0];
          } else {
            index--;
            if (index < 0) {
              index = list.length - 1;
            }
            radio = list[index];
          }
        } else {
          radio = list[0];
        }
        if (radio) {
          radio.focus();
          this.selected = radio.name;
          this._fireSelected();
        }
      }
    }

    _selectNext() {
      const list = this._radioNodes;
      if (list.length) {
        let radio = null;
        let index = -1;
        if (this.selected) {
          for (let i = 0; i < list.length; i++) {
            const n = list[i];
            if (n.name === this.selected) {
              index = i;
              break;
            }
          }
          if (index < 0) {
            radio = list[0];
          } else {
            index++;
            if (index >= list.length) {
              index = 0;
            }
            radio = list[index];
          }
        } else {
          radio = list[0];
        }
        if (radio) {
          radio.focus();
          this.selected = radio.name;
          this._fireSelected();
        }
      }
    }
  }
  customElements.define('wired-radio-group', WiredRadioGroup);

  /**
  @license
  Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
  This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
  The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
  The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
  Code distributed by Google as part of the polymer project is also
  subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
  */

  /**
   * @summary Collapse multiple callbacks into one invocation after a timer.
   */
  const Debouncer = class Debouncer {
    constructor() {
      this._asyncModule = null;
      this._callback = null;
      this._timer = null;
    }
    /**
     * Sets the scheduler; that is, a module with the Async interface,
     * a callback and optional arguments to be passed to the run function
     * from the async module.
     *
     * @param {!AsyncInterface} asyncModule Object with Async interface.
     * @param {function()} callback Callback to run.
     * @return {void}
     */
    setConfig(asyncModule, callback) {
      this._asyncModule = asyncModule;
      this._callback = callback;
      this._timer = this._asyncModule.run(() => {
        this._timer = null;
        this._callback();
      });
    }
    /**
     * Cancels an active debouncer and returns a reference to itself.
     *
     * @return {void}
     */
    cancel() {
      if (this.isActive()) {
        this._asyncModule.cancel(this._timer);
        this._timer = null;
      }
    }
    /**
     * Flushes an active debouncer and returns a reference to itself.
     *
     * @return {void}
     */
    flush() {
      if (this.isActive()) {
        this.cancel();
        this._callback();
      }
    }
    /**
     * Returns true if the debouncer is active.
     *
     * @return {boolean} True if active.
     */
    isActive() {
      return this._timer != null;
    }
    /**
     * Creates a debouncer if no debouncer is passed as a parameter
     * or it cancels an active debouncer otherwise. The following
     * example shows how a debouncer can be called multiple times within a
     * microtask and "debounced" such that the provided callback function is
     * called once. Add this method to a custom element:
     *
     * ```js
     * import {microtask} from '@polymer/polymer/lib/utils/async.js';
     * import {Debouncer} from '@polymer/polymer/lib/utils/debounce.js';
     * // ...
     *
     * _debounceWork() {
     *   this._debounceJob = Debouncer.debounce(this._debounceJob,
     *       microTask, () => this._doWork());
     * }
     * ```
     *
     * If the `_debounceWork` method is called multiple times within the same
     * microtask, the `_doWork` function will be called only once at the next
     * microtask checkpoint.
     *
     * Note: In testing it is often convenient to avoid asynchrony. To accomplish
     * this with a debouncer, you can use `enqueueDebouncer` and
     * `flush`. For example, extend the above example by adding
     * `enqueueDebouncer(this._debounceJob)` at the end of the
     * `_debounceWork` method. Then in a test, call `flush` to ensure
     * the debouncer has completed.
     *
     * @param {Debouncer?} debouncer Debouncer object.
     * @param {!AsyncInterface} asyncModule Object with Async interface
     * @param {function()} callback Callback to run.
     * @return {!Debouncer} Returns a debouncer object.
     */
    static debounce(debouncer, asyncModule, callback) {
      if (debouncer instanceof Debouncer) {
        debouncer.cancel();
      } else {
        debouncer = new Debouncer();
      }
      debouncer.setConfig(asyncModule, callback);
      return debouncer;
    }
  };

  /**
  @license
  Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
  This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
  The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
  The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
  Code distributed by Google as part of the polymer project is also
  subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
  */

  /**
   * Returns a path from a given `url`. The path includes the trailing
   * `/` from the url.
   *
   * @param {string} url Input URL to transform
   * @return {string} resolved path
   */
  function pathFromUrl(url) {
    return url.substring(0, url.lastIndexOf('/') + 1);
  }

  /**
  @license
  Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
  This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
  The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
  The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
  Code distributed by Google as part of the polymer project is also
  subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
  */
  const useShadow = !(window.ShadyDOM);
  const useNativeCSSProperties = Boolean(!window.ShadyCSS || window.ShadyCSS.nativeCss);
  const useNativeCustomElements = !(window.customElements.polyfillWrapFlushCallback);


  /**
   * Globally settable property that is automatically assigned to
   * `ElementMixin` instances, useful for binding in templates to
   * make URL's relative to an application's root.  Defaults to the main
   * document URL, but can be overridden by users.  It may be useful to set
   * `rootPath` to provide a stable application mount path when
   * using client side routing.
   */
  let rootPath = undefined ||
    pathFromUrl(document.baseURI || window.location.href);

  /**
   * Globally settable property to make Polymer Gestures use passive TouchEvent listeners when recognizing gestures.
   * When set to `true`, gestures made from touch will not be able to prevent scrolling, allowing for smoother
   * scrolling performance.
   * Defaults to `false` for backwards compatibility.
   */
  let passiveTouchGestures = false;

  /**
  @license
  Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
  This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
  The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
  The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
  Code distributed by Google as part of the polymer project is also
  subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
  */

  // detect native touch action support
  let HAS_NATIVE_TA = typeof document.head.style.touchAction === 'string';
  let GESTURE_KEY = '__polymerGestures';
  let HANDLED_OBJ = '__polymerGesturesHandled';
  let TOUCH_ACTION = '__polymerGesturesTouchAction';
  // radius for tap and track
  let TAP_DISTANCE = 25;
  let TRACK_DISTANCE = 5;
  // number of last N track positions to keep
  let TRACK_LENGTH = 2;

  // Disabling "mouse" handlers for 2500ms is enough
  let MOUSE_TIMEOUT = 2500;
  let MOUSE_EVENTS = ['mousedown', 'mousemove', 'mouseup', 'click'];
  // an array of bitmask values for mapping MouseEvent.which to MouseEvent.buttons
  let MOUSE_WHICH_TO_BUTTONS = [0, 1, 4, 2];
  let MOUSE_HAS_BUTTONS = (function() {
    try {
      return new MouseEvent('test', {buttons: 1}).buttons === 1;
    } catch (e) {
      return false;
    }
  })();

  /**
   * @param {string} name Possible mouse event name
   * @return {boolean} true if mouse event, false if not
   */
  function isMouseEvent(name) {
    return MOUSE_EVENTS.indexOf(name) > -1;
  }

  /* eslint no-empty: ["error", { "allowEmptyCatch": true }] */
  // check for passive event listeners
  let SUPPORTS_PASSIVE = false;
  (function() {
    try {
      let opts = Object.defineProperty({}, 'passive', {get() {SUPPORTS_PASSIVE = true;}});
      window.addEventListener('test', null, opts);
      window.removeEventListener('test', null, opts);
    } catch(e) {}
  })();

  /**
   * Generate settings for event listeners, dependant on `passiveTouchGestures`
   *
   * @param {string} eventName Event name to determine if `{passive}` option is
   *   needed
   * @return {{passive: boolean} | undefined} Options to use for addEventListener
   *   and removeEventListener
   */
  function PASSIVE_TOUCH(eventName) {
    if (isMouseEvent(eventName) || eventName === 'touchend') {
      return;
    }
    if (HAS_NATIVE_TA && SUPPORTS_PASSIVE && passiveTouchGestures) {
      return {passive: true};
    } else {
      return;
    }
  }

  // Check for touch-only devices
  let IS_TOUCH_ONLY = navigator.userAgent.match(/iP(?:[oa]d|hone)|Android/);

  // keep track of any labels hit by the mouseCanceller
  /** @type {!Array<!HTMLLabelElement>} */
  const clickedLabels = [];

  /** @type {!Object<boolean>} */
  const labellable = {
    'button': true,
    'input': true,
    'keygen': true,
    'meter': true,
    'output': true,
    'textarea': true,
    'progress': true,
    'select': true
  };

  /**
   * @param {HTMLElement} el Element to check labelling status
   * @return {boolean} element can have labels
   */
  function canBeLabelled(el) {
    return labellable[el.localName] || false;
  }

  /**
   * @param {HTMLElement} el Element that may be labelled.
   * @return {!Array<!HTMLLabelElement>} Relevant label for `el`
   */
  function matchingLabels(el) {
    let labels = Array.prototype.slice.call(/** @type {HTMLInputElement} */(el).labels || []);
    // IE doesn't have `labels` and Safari doesn't populate `labels`
    // if element is in a shadowroot.
    // In this instance, finding the non-ancestor labels is enough,
    // as the mouseCancellor code will handle ancstor labels
    if (!labels.length) {
      labels = [];
      let root = el.getRootNode();
      // if there is an id on `el`, check for all labels with a matching `for` attribute
      if (el.id) {
        let matching = root.querySelectorAll(`label[for = ${el.id}]`);
        for (let i = 0; i < matching.length; i++) {
          labels.push(/** @type {!HTMLLabelElement} */(matching[i]));
        }
      }
    }
    return labels;
  }

  // touch will make synthetic mouse events
  // `preventDefault` on touchend will cancel them,
  // but this breaks `<input>` focus and link clicks
  // disable mouse handlers for MOUSE_TIMEOUT ms after
  // a touchend to ignore synthetic mouse events
  let mouseCanceller = function(mouseEvent) {
    // Check for sourceCapabilities, used to distinguish synthetic events
    // if mouseEvent did not come from a device that fires touch events,
    // it was made by a real mouse and should be counted
    // http://wicg.github.io/InputDeviceCapabilities/#dom-inputdevicecapabilities-firestouchevents
    let sc = mouseEvent.sourceCapabilities;
    if (sc && !sc.firesTouchEvents) {
      return;
    }
    // skip synthetic mouse events
    mouseEvent[HANDLED_OBJ] = {skip: true};
    // disable "ghost clicks"
    if (mouseEvent.type === 'click') {
      let clickFromLabel = false;
      let path = mouseEvent.composedPath && mouseEvent.composedPath();
      if (path) {
        for (let i = 0; i < path.length; i++) {
          if (path[i].nodeType === Node.ELEMENT_NODE) {
            if (path[i].localName === 'label') {
              clickedLabels.push(path[i]);
            } else if (canBeLabelled(path[i])) {
              let ownerLabels = matchingLabels(path[i]);
              // check if one of the clicked labels is labelling this element
              for (let j = 0; j < ownerLabels.length; j++) {
                clickFromLabel = clickFromLabel || clickedLabels.indexOf(ownerLabels[j]) > -1;
              }
            }
          }
          if (path[i] === POINTERSTATE.mouse.target) {
            return;
          }
        }
      }
      // if one of the clicked labels was labelling the target element,
      // this is not a ghost click
      if (clickFromLabel) {
        return;
      }
      mouseEvent.preventDefault();
      mouseEvent.stopPropagation();
    }
  };

  /**
   * @param {boolean=} setup True to add, false to remove.
   * @return {void}
   */
  function setupTeardownMouseCanceller(setup) {
    let events = IS_TOUCH_ONLY ? ['click'] : MOUSE_EVENTS;
    for (let i = 0, en; i < events.length; i++) {
      en = events[i];
      if (setup) {
        // reset clickLabels array
        clickedLabels.length = 0;
        document.addEventListener(en, mouseCanceller, true);
      } else {
        document.removeEventListener(en, mouseCanceller, true);
      }
    }
  }

  function ignoreMouse(e) {
    if (!POINTERSTATE.mouse.mouseIgnoreJob) {
      setupTeardownMouseCanceller(true);
    }
    let unset = function() {
      setupTeardownMouseCanceller();
      POINTERSTATE.mouse.target = null;
      POINTERSTATE.mouse.mouseIgnoreJob = null;
    };
    POINTERSTATE.mouse.target = e.composedPath()[0];
    POINTERSTATE.mouse.mouseIgnoreJob = Debouncer.debounce(
          POINTERSTATE.mouse.mouseIgnoreJob
        , timeOut.after(MOUSE_TIMEOUT)
        , unset);
  }

  /**
   * @param {MouseEvent} ev event to test for left mouse button down
   * @return {boolean} has left mouse button down
   */
  function hasLeftMouseButton(ev) {
    let type = ev.type;
    // exit early if the event is not a mouse event
    if (!isMouseEvent(type)) {
      return false;
    }
    // ev.button is not reliable for mousemove (0 is overloaded as both left button and no buttons)
    // instead we use ev.buttons (bitmask of buttons) or fall back to ev.which (deprecated, 0 for no buttons, 1 for left button)
    if (type === 'mousemove') {
      // allow undefined for testing events
      let buttons = ev.buttons === undefined ? 1 : ev.buttons;
      if ((ev instanceof window.MouseEvent) && !MOUSE_HAS_BUTTONS) {
        buttons = MOUSE_WHICH_TO_BUTTONS[ev.which] || 0;
      }
      // buttons is a bitmask, check that the left button bit is set (1)
      return Boolean(buttons & 1);
    } else {
      // allow undefined for testing events
      let button = ev.button === undefined ? 0 : ev.button;
      // ev.button is 0 in mousedown/mouseup/click for left button activation
      return button === 0;
    }
  }

  function isSyntheticClick(ev) {
    if (ev.type === 'click') {
      // ev.detail is 0 for HTMLElement.click in most browsers
      if (ev.detail === 0) {
        return true;
      }
      // in the worst case, check that the x/y position of the click is within
      // the bounding box of the target of the event
      // Thanks IE 10 >:(
      let t = _findOriginalTarget(ev);
      // make sure the target of the event is an element so we can use getBoundingClientRect,
      // if not, just assume it is a synthetic click
      if (!t.nodeType || /** @type {Element} */(t).nodeType !== Node.ELEMENT_NODE) {
        return true;
      }
      let bcr = /** @type {Element} */(t).getBoundingClientRect();
      // use page x/y to account for scrolling
      let x = ev.pageX, y = ev.pageY;
      // ev is a synthetic click if the position is outside the bounding box of the target
      return !((x >= bcr.left && x <= bcr.right) && (y >= bcr.top && y <= bcr.bottom));
    }
    return false;
  }

  let POINTERSTATE = {
    mouse: {
      target: null,
      mouseIgnoreJob: null
    },
    touch: {
      x: 0,
      y: 0,
      id: -1,
      scrollDecided: false
    }
  };

  function firstTouchAction(ev) {
    let ta = 'auto';
    let path = ev.composedPath && ev.composedPath();
    if (path) {
      for (let i = 0, n; i < path.length; i++) {
        n = path[i];
        if (n[TOUCH_ACTION]) {
          ta = n[TOUCH_ACTION];
          break;
        }
      }
    }
    return ta;
  }

  function trackDocument(stateObj, movefn, upfn) {
    stateObj.movefn = movefn;
    stateObj.upfn = upfn;
    document.addEventListener('mousemove', movefn);
    document.addEventListener('mouseup', upfn);
  }

  function untrackDocument(stateObj) {
    document.removeEventListener('mousemove', stateObj.movefn);
    document.removeEventListener('mouseup', stateObj.upfn);
    stateObj.movefn = null;
    stateObj.upfn = null;
  }

  // use a document-wide touchend listener to start the ghost-click prevention mechanism
  // Use passive event listeners, if supported, to not affect scrolling performance
  document.addEventListener('touchend', ignoreMouse, SUPPORTS_PASSIVE ? {passive: true} : false);

  const gestures = {};
  const recognizers = [];

  /**
   * Finds the element rendered on the screen at the provided coordinates.
   *
   * Similar to `document.elementFromPoint`, but pierces through
   * shadow roots.
   *
   * @param {number} x Horizontal pixel coordinate
   * @param {number} y Vertical pixel coordinate
   * @return {Element} Returns the deepest shadowRoot inclusive element
   * found at the screen position given.
   */
  function deepTargetFind(x, y) {
    let node = document.elementFromPoint(x, y);
    let next = node;
    // this code path is only taken when native ShadowDOM is used
    // if there is a shadowroot, it may have a node at x/y
    // if there is not a shadowroot, exit the loop
    while (next && next.shadowRoot && !window.ShadyDOM) {
      // if there is a node at x/y in the shadowroot, look deeper
      let oldNext = next;
      next = next.shadowRoot.elementFromPoint(x, y);
      // on Safari, elementFromPoint may return the shadowRoot host
      if (oldNext === next) {
        break;
      }
      if (next) {
        node = next;
      }
    }
    return node;
  }

  /**
   * a cheaper check than ev.composedPath()[0];
   *
   * @private
   * @param {Event} ev Event.
   * @return {EventTarget} Returns the event target.
   */
  function _findOriginalTarget(ev) {
    // shadowdom
    if (ev.composedPath) {
      const targets = /** @type {!Array<!EventTarget>} */(ev.composedPath());
      // It shouldn't be, but sometimes targets is empty (window on Safari).
      return targets.length > 0 ? targets[0] : ev.target;
    }
    // shadydom
    return ev.target;
  }

  /**
   * @private
   * @param {Event} ev Event.
   * @return {void}
   */
  function _handleNative(ev) {
    let handled;
    let type = ev.type;
    let node = ev.currentTarget;
    let gobj = node[GESTURE_KEY];
    if (!gobj) {
      return;
    }
    let gs = gobj[type];
    if (!gs) {
      return;
    }
    if (!ev[HANDLED_OBJ]) {
      ev[HANDLED_OBJ] = {};
      if (type.slice(0, 5) === 'touch') {
        ev = /** @type {TouchEvent} */(ev); // eslint-disable-line no-self-assign
        let t = ev.changedTouches[0];
        if (type === 'touchstart') {
          // only handle the first finger
          if (ev.touches.length === 1) {
            POINTERSTATE.touch.id = t.identifier;
          }
        }
        if (POINTERSTATE.touch.id !== t.identifier) {
          return;
        }
        if (!HAS_NATIVE_TA) {
          if (type === 'touchstart' || type === 'touchmove') {
            _handleTouchAction(ev);
          }
        }
      }
    }
    handled = ev[HANDLED_OBJ];
    // used to ignore synthetic mouse events
    if (handled.skip) {
      return;
    }
    // reset recognizer state
    for (let i = 0, r; i < recognizers.length; i++) {
      r = recognizers[i];
      if (gs[r.name] && !handled[r.name]) {
        if (r.flow && r.flow.start.indexOf(ev.type) > -1 && r.reset) {
          r.reset();
        }
      }
    }
    // enforce gesture recognizer order
    for (let i = 0, r; i < recognizers.length; i++) {
      r = recognizers[i];
      if (gs[r.name] && !handled[r.name]) {
        handled[r.name] = true;
        r[type](ev);
      }
    }
  }

  /**
   * @private
   * @param {TouchEvent} ev Event.
   * @return {void}
   */
  function _handleTouchAction(ev) {
    let t = ev.changedTouches[0];
    let type = ev.type;
    if (type === 'touchstart') {
      POINTERSTATE.touch.x = t.clientX;
      POINTERSTATE.touch.y = t.clientY;
      POINTERSTATE.touch.scrollDecided = false;
    } else if (type === 'touchmove') {
      if (POINTERSTATE.touch.scrollDecided) {
        return;
      }
      POINTERSTATE.touch.scrollDecided = true;
      let ta = firstTouchAction(ev);
      let prevent = false;
      let dx = Math.abs(POINTERSTATE.touch.x - t.clientX);
      let dy = Math.abs(POINTERSTATE.touch.y - t.clientY);
      if (!ev.cancelable) ; else if (ta === 'none') {
        prevent = true;
      } else if (ta === 'pan-x') {
        prevent = dy > dx;
      } else if (ta === 'pan-y') {
        prevent = dx > dy;
      }
      if (prevent) {
        ev.preventDefault();
      } else {
        prevent('track');
      }
    }
  }

  /**
   * Adds an event listener to a node for the given gesture type.
   *
   * @param {!Node} node Node to add listener on
   * @param {string} evType Gesture type: `down`, `up`, `track`, or `tap`
   * @param {!function(!Event):void} handler Event listener function to call
   * @return {boolean} Returns true if a gesture event listener was added.
   * @this {Gestures}
   */
  function addListener(node, evType, handler) {
    if (gestures[evType]) {
      _add(node, evType, handler);
      return true;
    }
    return false;
  }

  /**
   * automate the event listeners for the native events
   *
   * @private
   * @param {!HTMLElement} node Node on which to add the event.
   * @param {string} evType Event type to add.
   * @param {function(!Event)} handler Event handler function.
   * @return {void}
   * @this {Gestures}
   */
  function _add(node, evType, handler) {
    let recognizer = gestures[evType];
    let deps = recognizer.deps;
    let name = recognizer.name;
    let gobj = node[GESTURE_KEY];
    if (!gobj) {
      node[GESTURE_KEY] = gobj = {};
    }
    for (let i = 0, dep, gd; i < deps.length; i++) {
      dep = deps[i];
      // don't add mouse handlers on iOS because they cause gray selection overlays
      if (IS_TOUCH_ONLY && isMouseEvent(dep) && dep !== 'click') {
        continue;
      }
      gd = gobj[dep];
      if (!gd) {
        gobj[dep] = gd = {_count: 0};
      }
      if (gd._count === 0) {
        node.addEventListener(dep, _handleNative, PASSIVE_TOUCH(dep));
      }
      gd[name] = (gd[name] || 0) + 1;
      gd._count = (gd._count || 0) + 1;
    }
    node.addEventListener(evType, handler);
    if (recognizer.touchAction) {
      setTouchAction(node, recognizer.touchAction);
    }
  }

  /**
   * Registers a new gesture event recognizer for adding new custom
   * gesture event types.
   *
   * @param {!GestureRecognizer} recog Gesture recognizer descriptor
   * @return {void}
   * @this {Gestures}
   */
  function register(recog) {
    recognizers.push(recog);
    for (let i = 0; i < recog.emits.length; i++) {
      gestures[recog.emits[i]] = recog;
    }
  }

  /**
   * @private
   * @param {string} evName Event name.
   * @return {Object} Returns the gesture for the given event name.
   * @this {Gestures}
   */
  function _findRecognizerByEvent(evName) {
    for (let i = 0, r; i < recognizers.length; i++) {
      r = recognizers[i];
      for (let j = 0, n; j < r.emits.length; j++) {
        n = r.emits[j];
        if (n === evName) {
          return r;
        }
      }
    }
    return null;
  }

  /**
   * Sets scrolling direction on node.
   *
   * This value is checked on first move, thus it should be called prior to
   * adding event listeners.
   *
   * @param {!Element} node Node to set touch action setting on
   * @param {string} value Touch action value
   * @return {void}
   */
  function setTouchAction(node, value) {
    if (HAS_NATIVE_TA) {
      // NOTE: add touchAction async so that events can be added in
      // custom element constructors. Otherwise we run afoul of custom
      // elements restriction against settings attributes (style) in the
      // constructor.
      microTask.run(() => {
        node.style.touchAction = value;
      });
    }
    node[TOUCH_ACTION] = value;
  }

  /**
   * Dispatches an event on the `target` element of `type` with the given
   * `detail`.
   * @private
   * @param {!EventTarget} target The element on which to fire an event.
   * @param {string} type The type of event to fire.
   * @param {!Object=} detail The detail object to populate on the event.
   * @return {void}
   */
  function _fire(target, type, detail) {
    let ev = new Event(type, { bubbles: true, cancelable: true, composed: true });
    ev.detail = detail;
    target.dispatchEvent(ev);
    // forward `preventDefault` in a clean way
    if (ev.defaultPrevented) {
      let preventer = detail.preventer || detail.sourceEvent;
      if (preventer && preventer.preventDefault) {
        preventer.preventDefault();
      }
    }
  }

  /**
   * Prevents the dispatch and default action of the given event name.
   *
   * @param {string} evName Event name.
   * @return {void}
   * @this {Gestures}
   */
  function prevent(evName) {
    let recognizer = _findRecognizerByEvent(evName);
    if (recognizer.info) {
      recognizer.info.prevent = true;
    }
  }

  /* eslint-disable valid-jsdoc */

  register({
    name: 'downup',
    deps: ['mousedown', 'touchstart', 'touchend'],
    flow: {
      start: ['mousedown', 'touchstart'],
      end: ['mouseup', 'touchend']
    },
    emits: ['down', 'up'],

    info: {
      movefn: null,
      upfn: null
    },

    /**
     * @this {GestureRecognizer}
     * @return {void}
     */
    reset: function() {
      untrackDocument(this.info);
    },

    /**
     * @this {GestureRecognizer}
     * @param {MouseEvent} e
     * @return {void}
     */
    mousedown: function(e) {
      if (!hasLeftMouseButton(e)) {
        return;
      }
      let t = _findOriginalTarget(e);
      let self = this;
      let movefn = function movefn(e) {
        if (!hasLeftMouseButton(e)) {
          self._fire('up', t, e);
          untrackDocument(self.info);
        }
      };
      let upfn = function upfn(e) {
        if (hasLeftMouseButton(e)) {
          self._fire('up', t, e);
        }
        untrackDocument(self.info);
      };
      trackDocument(this.info, movefn, upfn);
      this._fire('down', t, e);
    },
    /**
     * @this {GestureRecognizer}
     * @param {TouchEvent} e
     * @return {void}
     */
    touchstart: function(e) {
      this._fire('down', _findOriginalTarget(e), e.changedTouches[0], e);
    },
    /**
     * @this {GestureRecognizer}
     * @param {TouchEvent} e
     * @return {void}
     */
    touchend: function(e) {
      this._fire('up', _findOriginalTarget(e), e.changedTouches[0], e);
    },
    /**
     * @param {string} type
     * @param {!EventTarget} target
     * @param {Event} event
     * @param {Function} preventer
     * @return {void}
     */
    _fire: function(type, target, event, preventer) {
      _fire(target, type, {
        x: event.clientX,
        y: event.clientY,
        sourceEvent: event,
        preventer: preventer,
        prevent: function(e) {
          return prevent(e);
        }
      });
    }
  });

  register({
    name: 'track',
    touchAction: 'none',
    deps: ['mousedown', 'touchstart', 'touchmove', 'touchend'],
    flow: {
      start: ['mousedown', 'touchstart'],
      end: ['mouseup', 'touchend']
    },
    emits: ['track'],

    info: {
      x: 0,
      y: 0,
      state: 'start',
      started: false,
      moves: [],
      /** @this {GestureRecognizer} */
      addMove: function(move) {
        if (this.moves.length > TRACK_LENGTH) {
          this.moves.shift();
        }
        this.moves.push(move);
      },
      movefn: null,
      upfn: null,
      prevent: false
    },

    /**
     * @this {GestureRecognizer}
     * @return {void}
     */
    reset: function() {
      this.info.state = 'start';
      this.info.started = false;
      this.info.moves = [];
      this.info.x = 0;
      this.info.y = 0;
      this.info.prevent = false;
      untrackDocument(this.info);
    },

    /**
     * @this {GestureRecognizer}
     * @param {number} x
     * @param {number} y
     * @return {boolean}
     */
    hasMovedEnough: function(x, y) {
      if (this.info.prevent) {
        return false;
      }
      if (this.info.started) {
        return true;
      }
      let dx = Math.abs(this.info.x - x);
      let dy = Math.abs(this.info.y - y);
      return (dx >= TRACK_DISTANCE || dy >= TRACK_DISTANCE);
    },
    /**
     * @this {GestureRecognizer}
     * @param {MouseEvent} e
     * @return {void}
     */
    mousedown: function(e) {
      if (!hasLeftMouseButton(e)) {
        return;
      }
      let t = _findOriginalTarget(e);
      let self = this;
      let movefn = function movefn(e) {
        let x = e.clientX, y = e.clientY;
        if (self.hasMovedEnough(x, y)) {
          // first move is 'start', subsequent moves are 'move', mouseup is 'end'
          self.info.state = self.info.started ? (e.type === 'mouseup' ? 'end' : 'track') : 'start';
          if (self.info.state === 'start') {
            // if and only if tracking, always prevent tap
            prevent('tap');
          }
          self.info.addMove({x: x, y: y});
          if (!hasLeftMouseButton(e)) {
            // always _fire "end"
            self.info.state = 'end';
            untrackDocument(self.info);
          }
          self._fire(t, e);
          self.info.started = true;
        }
      };
      let upfn = function upfn(e) {
        if (self.info.started) {
          movefn(e);
        }

        // remove the temporary listeners
        untrackDocument(self.info);
      };
      // add temporary document listeners as mouse retargets
      trackDocument(this.info, movefn, upfn);
      this.info.x = e.clientX;
      this.info.y = e.clientY;
    },
    /**
     * @this {GestureRecognizer}
     * @param {TouchEvent} e
     * @return {void}
     */
    touchstart: function(e) {
      let ct = e.changedTouches[0];
      this.info.x = ct.clientX;
      this.info.y = ct.clientY;
    },
    /**
     * @this {GestureRecognizer}
     * @param {TouchEvent} e
     * @return {void}
     */
    touchmove: function(e) {
      let t = _findOriginalTarget(e);
      let ct = e.changedTouches[0];
      let x = ct.clientX, y = ct.clientY;
      if (this.hasMovedEnough(x, y)) {
        if (this.info.state === 'start') {
          // if and only if tracking, always prevent tap
          prevent('tap');
        }
        this.info.addMove({x: x, y: y});
        this._fire(t, ct);
        this.info.state = 'track';
        this.info.started = true;
      }
    },
    /**
     * @this {GestureRecognizer}
     * @param {TouchEvent} e
     * @return {void}
     */
    touchend: function(e) {
      let t = _findOriginalTarget(e);
      let ct = e.changedTouches[0];
      // only trackend if track was started and not aborted
      if (this.info.started) {
        // reset started state on up
        this.info.state = 'end';
        this.info.addMove({x: ct.clientX, y: ct.clientY});
        this._fire(t, ct, e);
      }
    },

    /**
     * @this {GestureRecognizer}
     * @param {!EventTarget} target
     * @param {Touch} touch
     * @return {void}
     */
    _fire: function(target, touch) {
      let secondlast = this.info.moves[this.info.moves.length - 2];
      let lastmove = this.info.moves[this.info.moves.length - 1];
      let dx = lastmove.x - this.info.x;
      let dy = lastmove.y - this.info.y;
      let ddx, ddy = 0;
      if (secondlast) {
        ddx = lastmove.x - secondlast.x;
        ddy = lastmove.y - secondlast.y;
      }
      _fire(target, 'track', {
        state: this.info.state,
        x: touch.clientX,
        y: touch.clientY,
        dx: dx,
        dy: dy,
        ddx: ddx,
        ddy: ddy,
        sourceEvent: touch,
        hover: function() {
          return deepTargetFind(touch.clientX, touch.clientY);
        }
      });
    }

  });

  register({
    name: 'tap',
    deps: ['mousedown', 'click', 'touchstart', 'touchend'],
    flow: {
      start: ['mousedown', 'touchstart'],
      end: ['click', 'touchend']
    },
    emits: ['tap'],
    info: {
      x: NaN,
      y: NaN,
      prevent: false
    },
    /**
     * @this {GestureRecognizer}
     * @return {void}
     */
    reset: function() {
      this.info.x = NaN;
      this.info.y = NaN;
      this.info.prevent = false;
    },
    /**
     * @this {GestureRecognizer}
     * @param {MouseEvent} e
     * @return {void}
     */
    save: function(e) {
      this.info.x = e.clientX;
      this.info.y = e.clientY;
    },
    /**
     * @this {GestureRecognizer}
     * @param {MouseEvent} e
     * @return {void}
     */
    mousedown: function(e) {
      if (hasLeftMouseButton(e)) {
        this.save(e);
      }
    },
    /**
     * @this {GestureRecognizer}
     * @param {MouseEvent} e
     * @return {void}
     */
    click: function(e) {
      if (hasLeftMouseButton(e)) {
        this.forward(e);
      }
    },
    /**
     * @this {GestureRecognizer}
     * @param {TouchEvent} e
     * @return {void}
     */
    touchstart: function(e) {
      this.save(e.changedTouches[0], e);
    },
    /**
     * @this {GestureRecognizer}
     * @param {TouchEvent} e
     * @return {void}
     */
    touchend: function(e) {
      this.forward(e.changedTouches[0], e);
    },
    /**
     * @this {GestureRecognizer}
     * @param {Event | Touch} e
     * @param {Event=} preventer
     * @return {void}
     */
    forward: function(e, preventer) {
      let dx = Math.abs(e.clientX - this.info.x);
      let dy = Math.abs(e.clientY - this.info.y);
      // find original target from `preventer` for TouchEvents, or `e` for MouseEvents
      let t = _findOriginalTarget((preventer || e));
      if (!t || t.disabled) {
        return;
      }
      // dx,dy can be NaN if `click` has been simulated and there was no `down` for `start`
      if (isNaN(dx) || isNaN(dy) || (dx <= TAP_DISTANCE && dy <= TAP_DISTANCE) || isSyntheticClick(e)) {
        // prevent taps from being generated if an event has canceled them
        if (!this.info.prevent) {
          _fire(t, 'tap', {
            x: e.clientX,
            y: e.clientY,
            sourceEvent: e,
            preventer: preventer
          });
        }
      }
    }
  });

  class WiredSlider extends LitElement {
    static get properties() {
      return {
        _value: Number,
        min: Number,
        max: Number,
        knobradius: Number,
        disabled: Boolean
      };
    }

    constructor() {
      super();
      this.disabled = false;
      this._value = 0;
      this.min = 0;
      this.max = 100;
      this.knobradius = 10;
      this.step = 1;
    }

    _createRoot() {
      const root = this.attachShadow({ mode: 'open' });
      this.classList.add('pending');
      return root;
    }

    _render() {
      this._onDisableChange();
      return html$1`
    <style>
      :host {
        display: inline-block;
        position: relative;
        width: 300px;
        height: 40px;
        outline: none;
        box-sizing: border-box;
      }
    
      :host(.disabled) {
        opacity: 0.45 !important;
        cursor: default;
        pointer-events: none;
        background: rgba(0, 0, 0, 0.07);
        border-radius: 5px;
      }
    
      :host(.disabled) .knob {
        pointer-events: none !important;
      }
    
      :host(:focus) .knob {
        cursor: move;
        stroke: var(--wired-slider-knob-outline-color, #000);
        fill-opacity: 0.8;
      }
    
      .overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        pointer-events: none;
      }
    
      svg {
        display: block;
      }
    
      path {
        stroke-width: 0.7;
        fill: transparent;
      }
    
      .knob {
        pointer-events: auto;
        fill: var(--wired-slider-knob-zero-color, gray);
        stroke: var(--wired-slider-knob-zero-color, gray);
        transition: transform 0.15s ease;
        cursor: pointer;
      }
    
      .hasValue {
        fill: var(--wired-slider-knob-color, rgb(51, 103, 214));
        stroke: var(--wired-slider-knob-color, rgb(51, 103, 214));
      }
    
      .bar {
        stroke: var(--wired-slider-bar-color, rgb(0, 0, 0));
      }
    
      :host(.pending) {
        opacity: 0;
      }
    </style>
    <div class="overlay">
      <svg id="svg"></svg>
    </div>
    `;
    }

    get value() {
      return this._value;
    }

    set value(v) {
      this._setValue(v, true);
    }

    _onDisableChange() {
      if (this.disabled) {
        this.classList.add("disabled");
      } else {
        this.classList.remove("disabled");
      }
      this._refreshTabIndex();
    }

    _clearNode(node) {
      while (node.hasChildNodes()) {
        node.removeChild(node.lastChild);
      }
    }

    connectedCallback() {
      super.connectedCallback();
      setTimeout(() => this._firstRendered(), 100);
    }

    _firstRendered() {
      const svg = this.shadowRoot.getElementById('svg');
      this._clearNode(svg);
      const s = this.getBoundingClientRect();
      svg.setAttribute("width", s.width);
      svg.setAttribute("height", s.height);
      let radius = this.knobradius || 10;
      this._barWidth = s.width - (2 * radius);
      this._bar = wired.line(svg, radius, s.height / 2, s.width - radius, s.height / 2);
      this._bar.classList.add("bar");
      this._knobGroup = wired._svgNode("g");
      svg.appendChild(this._knobGroup);
      this._knob = wired.ellipse(this._knobGroup, radius, s.height / 2, radius * 2, radius * 2);
      this._knob.classList.add("knob");
      this._onValueChange();
      this.classList.remove('pending');
      this._knobAttached = false;

      this._setAria();
      this._attachEvents();
    }

    _setAria() {
      this.setAttribute('role', 'slider');
      this.setAttribute('aria-valuemax', this.max);
      this.setAttribute('aria-valuemin', this.min);
      this._setAriaValue();
      this._refreshTabIndex();
    }

    _refreshTabIndex() {
      this.tabIndex = this.disabled ? -1 : (this.getAttribute('tabindex') || 0);
    }

    _setAriaValue() {
      this.setAttribute('aria-valuenow', this.value);
    }

    _setValue(v, skipEvent) {
      this._value = v;
      this._setAriaValue();
      this._onValueChange();
      if (!skipEvent) {
        const event = new CustomEvent('change', { bubbles: true, composed: true, detail: { value: this._intermediateValue } });
        this.dispatchEvent(event);
      }
    }

    _incremenent() {
      const newValue = Math.min(this.max, Math.round(this.value + this.step));
      if (newValue != this.value) {
        this._setValue(newValue);
      }
    }

    _decrement() {
      const newValue = Math.max(this.min, Math.round(this.value - this.step));
      if (newValue != this.value) {
        this._setValue(newValue);
      }
    }

    _attachEvents() {
      if (!this._knobAttached) {
        addListener(this._knob, 'down', (event) => {
          if (!this.disabled) {
            this._knobdown(event);
          }
        });
        addListener(this._knob, 'up', (event) => {
          if (!this.disabled) {
            this._resetKnob(event);
          }
        });
        addListener(this._knob, 'track', (event) => {
          if (!this.disabled) {
            this._onTrack(event);
          }
        });
        this._knobAttached = true;
      }
      if (!this._keyboardAttached) {
        this.addEventListener('keydown', (event) => {
          switch (event.keyCode) {
            case 38:
            case 39:
              this._incremenent();
              break;
            case 37:
            case 40:
              this._decrement();
              break;
            case 36:
              this._setValue(this.min);
              break;
            case 35:
              this._setValue(this.max);
              break;
          }
        });
        this._keyboardAttached = true;
      }
    }

    _onValueChange() {
      if (!this._knob) {
        return;
      }
      let pct = 0;
      if (this.max > this.min) {
        pct = Math.min(1, Math.max((this.value - this.min) / (this.max - this.min), 0));
      }
      this._pct = pct;
      if (pct) {
        this._knob.classList.add("hasValue");
      } else {
        this._knob.classList.remove("hasValue");
      }
      let knobOffset = pct * this._barWidth;
      this._knobGroup.style.transform = "translateX(" + Math.round(knobOffset) + "px)";
    }

    _knobdown(event) {
      this._knobExpand(true);
      event.preventDefault();
      this.focus();
    }

    _resetKnob(event) {
      this._knobExpand(false);
    }

    _knobExpand(value) {
      if (this._knob) {
        if (value) {
          this._knob.classList.add("expanded");
        } else {
          this._knob.classList.remove("expanded");
        }
      }
    }

    _onTrack(event) {
      event.stopPropagation();
      switch (event.detail.state) {
        case 'start':
          this._trackStart(event);
          break;
        case 'track':
          this._trackX(event);
          break;
        case 'end':
          this._trackEnd();
          break;
      }
    }

    _trackStart(event) {
      this._intermediateValue = this.value;
      this._startx = this._pct * this._barWidth;
      this._knobstartx = this._startx;
      this._minx = -this._startx;
      this._maxx = this._barWidth - this._startx;
      this._dragging = true;
    }

    _trackX(event) {
      if (!this._dragging) {
        this._trackStart(event);
      }
      var dx = event.detail.dx || 0;
      var newX = Math.max(Math.min(this._startx + dx, this._barWidth), 0);
      this._knobGroup.style.transform = "translateX(" + Math.round(newX) + "px)";
      var newPct = newX / this._barWidth;
      this._intermediateValue = this.min + newPct * (this.max - this.min);
    }

    _trackEnd() {
      this._dragging = false;
      this._resetKnob();
      this._setValue(this._intermediateValue);
      this._pct = (this.value - this.min) / (this.max - this.min);
    }
  }
  customElements.define('wired-slider', WiredSlider);

  class WiredTextarea extends LitElement {
    static get properties() {
      return {
        rows: Number,
        maxrows: Number,
        autocomplete: String,
        autofocus: Boolean,
        inputmode: String,
        placeholder: String,
        readonly: Boolean,
        required: Boolean,
        minlength: Number,
        maxlength: Number,
        disabled: Boolean
      };
    }

    constructor() {
      super();
      this.disabled = false;
      this.rows = 1;
      this.maxrows = 0;
    }

    _createRoot() {
      const root = this.attachShadow({ mode: 'open', delegatesFocus: true });
      this.classList.add('pending');
      return root;
    }

    _render({ rows, maxrows, autocomplete, autofocus, inputmode, placeholder, readonly, required, minlength, maxlength, disabled }) {
      this._onDisableChange();
      return html$1`
    <style>
      :host {
        display: inline-block;
        position: relative;
        padding: 5px;
        font-family: sans-serif;
        width: 400px;
        -moz-appearance: textarea;
        -webkit-appearance: textarea;
        outline: none;
      }
    
      :host(.pending) {
        opacity: 0;
      }
    
      :host(.disabled) {
        opacity: 0.6 !important;
        cursor: default;
        pointer-events: none;
      }
    
      :host(.disabled) svg {
        background: rgba(0, 0, 0, 0.07);
      }
    
      .fit {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
      }
    
      .overlay {
        pointer-events: none;
      }
    
      svg {
        display: block;
      }
    
      path {
        stroke: currentColor;
        stroke-width: 0.7;
        fill: transparent;
      }
    
      .mirror-text {
        visibility: hidden;
        word-wrap: break-word;
      }
    
      textarea {
        position: relative;
        outline: none;
        border: none;
        resize: none;
        background: inherit;
        color: inherit;
        width: 100%;
        height: 100%;
        font-size: inherit;
        font-family: inherit;
        line-height: inherit;
        text-align: inherit;
        padding: 5px;
        box-sizing: border-box;
      }
    </style>
    <div id="mirror" class="mirror-text">&#160;</div>
    <div class="fit">
      <textarea id="textarea" autocomplete$="${autocomplete}" autofocus?="${autofocus}" inputmode$="${inputmode}" placeholder$="${placeholder}"
        readonly?="${readonly}" required?="${required}" disabled?="${disabled}" rows$="${rows}" minlength$="${minlength}" maxlength$="${maxlength}"
        on-input="${() => this._onInput()}"></textarea>
    </div>
    <div class="fit overlay">
      <svg id="svg"></svg>
    </div>
    `;
    }

    connectedCallback() {
      super.connectedCallback();
      this.value = this.value || '';
    }

    get textarea() {
      return this.shadowRoot.getElementById('textarea');
    }

    get mirror() {
      return this.shadowRoot.getElementById('mirror');
    }

    get value() {
      const input = this.textarea;
      return (input && input.value) || '';
    }

    set value(v) {
      const textarea = this.textarea;
      if (!textarea) {
        return;
      }
      if (textarea.value !== v) {
        textarea.value = !(v || v === 0) ? '' : v;
      }
      this.mirror.innerHTML = this._valueForMirror();
      this.requestRender();
    }

    _constrain(tokens) {
      var _tokens;
      tokens = tokens || [''];
      if (this.maxRows > 0 && tokens.length > this.maxRows) {
        _tokens = tokens.slice(0, this.maxRows);
      } else {
        _tokens = tokens.slice(0);
      }
      while (this.rows > 0 && _tokens.length < this.rows) {
        _tokens.push('');
      }
      return _tokens.join('<br/>') + '&#160;';
    }

    _valueForMirror() {
      var input = this.textarea;
      if (!input) {
        return;
      }
      this.tokens = (input && input.value) ? input.value.replace(/&/gm, '&amp;').replace(/"/gm, '&quot;').replace(/'/gm, '&#39;').replace(/</gm, '&lt;').replace(/>/gm, '&gt;').split('\n') : [''];
      return this._constrain(this.tokens);
    }

    _onDisableChange() {
      if (this.disabled) {
        this.classList.add("disabled");
      } else {
        this.classList.remove("disabled");
      }
    }

    _updateCached() {
      this.mirror.innerHTML = this._constrain(this.tokens);
    }

    _onInput(event) {
      this.value = this.textarea.value;
    }

    _clearNode(node) {
      while (node.hasChildNodes()) {
        node.removeChild(node.lastChild);
      }
    }

    _needsLayout() {
      var s = this.getBoundingClientRect();
      if (s.height != this._prevHeight) {
        this.requestRender();
      }
    }

    _didRender() {
      const s = this.getBoundingClientRect();
      const svg = this.shadowRoot.getElementById('svg');

      if (this._prevHeight !== s.height) {
        this._clearNode(svg);
        svg.setAttribute('width', s.width);
        svg.setAttribute('height', s.height);
        wired.rectangle(svg, 2, 2, s.width - 2, s.height - 2);

        this._prevHeight = s.height;
      }

      this.classList.remove('pending');
      this._updateCached();
    }
  }
  customElements.define('wired-textarea', WiredTextarea);

  class WiredToggle extends LitElement {
    static get properties() {
      return {
        checked: Boolean,
        disabled: Boolean
      };
    }

    constructor() {
      super();
      this.disabled = false;
      this.checked = false;
    }

    _createRoot() {
      const root = this.attachShadow({ mode: 'open' });
      this.classList.add('pending');
      return root;
    }

    _render() {
      this._onDisableChange();
      return html$1`
    <style>
      :host {
        display: inline-block;
        cursor: pointer;
        position: relative;
      }
    
      :host(.pending) {
        opacity: 0;
      }
    
      :host(.disabled) {
        opacity: 0.4 !important;
        cursor: default;
        pointer-events: none;
      }
    
      :host(.disabled) svg {
        background: rgba(0, 0, 0, 0.07);
      }
    
      svg {
        display: block;
      }
    
      path {
        stroke: currentColor;
        stroke-width: 0.7;
        fill: transparent;
      }
    
      .unchecked {
        fill: var(--wired-toggle-off-color, gray);
      }
    
      .checked {
        fill: var(--wired-toggle-on-color, rgb(63, 81, 181));
      }
    </style>
    <div on-click="${() => this._toggleCheck()}">
      <svg id="svg"></svg>
    </div>
    `;
    }

    _clearNode(node) {
      while (node.hasChildNodes()) {
        node.removeChild(node.lastChild);
      }
    }

    _toggleCheck() {
      this.checked = !(this.checked || false);
      const event = new CustomEvent('change', { bubbles: true, composed: true, checked: this.checked, detail: { checked: this.checked } });
      this.dispatchEvent(event);
    }

    _onDisableChange() {
      if (this.disabled) {
        this.classList.add("disabled");
      } else {
        this.classList.remove("disabled");
      }
      this._refreshTabIndex();
    }

    _refreshTabIndex() {
      this.tabIndex = this.disabled ? -1 : (this.getAttribute('tabindex') || 0);
    }

    _setAria() {
      this.setAttribute('role', 'switch');
      this.setAttribute('aria-checked', this.checked);
    }

    _didRender() {
      const svg = this.shadowRoot.getElementById('svg');
      this._clearNode(svg);
      const s = { width: (this.height || 32) * 2.5, height: this.height || 32 };
      svg.setAttribute("width", s.width);
      svg.setAttribute("height", s.height);
      wired.rectangle(svg, 0, 0, s.width, s.height);
      this.knob = wired.ellipse(svg, s.height / 2, s.height / 2, s.height, s.height);
      this.knobOffset = s.width - s.height;
      this.knob.style.transition = "all 0.3s ease";
      this.knob.style.transform = this.checked ? ("translateX(" + this.knobOffset + "px)") : "";
      const cl = this.knob.classList;
      if (this.checked) {
        cl.remove("unchecked");
        cl.add("checked");
      } else {
        cl.remove("checked");
        cl.add("unchecked");
      }
      this.classList.remove('pending');
      this._setAria();
      this._attachEvents();
    }

    _attachEvents() {
      if (!this._keyboardAttached) {
        this.addEventListener('keydown', (event) => {
          if ((event.keyCode === 13) || (event.keyCode === 32)) {
            event.preventDefault();
            this._toggleCheck();
          }
        });
        this._keyboardAttached = true;
      }
    }
  }
  customElements.define('wired-toggle', WiredToggle);

  class WiredTooltip extends LitElement {
    static get properties() {
      return {
        for: String,
        position: String,
        text: String,
        offset: Number
      };
    }

    constructor() {
      super();
      this._dirty = false;
      this._showing = false;
      this._target = null;
      this.offset = 14;
      this.position = 'bottom';
    }

    _render({ text }, changedProps) {
      if (changedProps && (changedProps.position || changedProps.text)) {
        this._dirty = true;
      }
      if ((!this._target) || (changedProps && changedProps.for)) {
        this._refreshTarget();
      }
      return html$1`
    <style>
      :host {
        display: block;
        position: absolute;
        outline: none;
        z-index: 1002;
        -moz-user-select: none;
        -ms-user-select: none;
        -webkit-user-select: none;
        user-select: none;
        cursor: default;
        font-family: inherit;
        font-size: 9pt;
        line-height: 1;
      }
    
      .overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        pointer-events: none;
      }
    
      svg {
        display: block;
      }
    
      path {
        stroke-width: 0.7;
        stroke: var(--wired-tooltip-border-color, currentColor);
        fill: var(--wired-tooltip-background, rgba(255, 255, 255, 0.9));
      }
    
      #container {
        position: relative;
        padding: 8px;
      }
    </style>
    <div id="container" style="display: none;">
      <div class="overlay">
        <svg id="svg"></svg>
      </div>
      <span style="position: relative;">${text}</span>
    </div>
    `;
    }

    get target() {
      if (this._target) {
        return this._target;
      }
      var parent = this.parentNode;
      var owner = (this.getRootNode ? this.getRootNode() : null) || this.getOwnerDocument();
      var t;
      if (this.for) {
        t = owner.querySelector('#' + this.for);
      } else {
        t = parent.nodeType == Node.DOCUMENT_FRAGMENT_NODE ? owner.host : parent;
      }
      return t;
    }

    _detachListeners() {
      if (this._showHandler && this._hideHandler) {
        if (this._target) {
          this._target.removeEventListener('mouseenter', this._showHandler);
          this._target.removeEventListener('focus', this._showHandler);
          this._target.removeEventListener('mouseleave', this._hideHandler);
          this._target.removeEventListener('blur', this._hideHandler);
          this._target.removeEventListener('click', this._hideHandler);
        }
        this.removeEventListener('mouseenter', this._hideHandler);
      }
    }

    _attachListeners() {
      this._showHandler = () => {
        this.show();
      };
      this._hideHandler = () => {
        this.hide();
      };
      if (this._target) {
        this._target.addEventListener('mouseenter', this._showHandler);
        this._target.addEventListener('focus', this._showHandler);
        this._target.addEventListener('mouseleave', this._hideHandler);
        this._target.addEventListener('blur', this._hideHandler);
        this._target.addEventListener('click', this._hideHandler);
      }
      this.addEventListener('mouseenter', this._hideHandler);
    }

    _refreshTarget() {
      this._detachListeners();
      this._target = null;
      this._target = this.target;
      this._attachListeners();
      this._dirty = true;
    }

    _clearNode(node) {
      while (node.hasChildNodes()) {
        node.removeChild(node.lastChild);
      }
    }

    _layout() {
      const svg = this.shadowRoot.getElementById('svg');
      this._clearNode(svg);
      var s = this.getBoundingClientRect();
      var w = s.width;
      var h = s.height;
      switch (this.position) {
        case "left":
        case "right":
          w = w + this.offset;
          break;
        default:
          h = h + this.offset;
          break;
      }
      svg.setAttribute("width", w);
      svg.setAttribute("height", h);
      var points = [];
      switch (this.position) {
        case "top":
          points = [
            [2, 2], [w - 2, 2], [w - 2, h - this.offset],
            [w / 2 + 8, h - this.offset], [w / 2, h - this.offset + 8], [w / 2 - 8, h - this.offset],
            [0, h - this.offset]
          ];
          break;
        case "left":
          points = [
            [2, 2], [w - this.offset, 2],
            [w - this.offset, h / 2 - 8], [w - this.offset + 8, h / 2], [w - this.offset, h / 2 + 8],
            [w - this.offset, h], [2, h - 2]
          ];
          break;
        case "right":
          points = [
            [this.offset, 2], [w - 2, 2], [w - 2, h - 2], [this.offset, h - 2],
            [this.offset, h / 2 + 8], [this.offset - 8, h / 2], [this.offset, h / 2 - 8]
          ];
          svg.style.transform = "translateX(" + (-this.offset) + "px)";
          break;
        default:
          points = [
            [2, this.offset], [0, h - 2], [w - 2, h - 2], [w - 2, this.offset],
            [w / 2 + 8, this.offset], [w / 2, this.offset - 8], [w / 2 - 8, this.offset]
          ];
          svg.style.transform = "translateY(" + (-this.offset) + "px)";
          break;
      }
      wired.polygon(svg, points);
      this._dirty = false;
    }

    _firstRendered() {
      this._layout();
    }

    _didRender() {
      if (this._dirty) {
        this._layout();
      }
    }

    show() {
      if (this._showing) {
        return;
      }
      this._showing = true;
      this.shadowRoot.getElementById('container').style.display = "";
      this.updatePosition();
      setTimeout(() => {
        this._layout();
      }, 1);
    }

    hide() {
      if (!this._showing) {
        return;
      }
      this._showing = false;
      this.shadowRoot.getElementById('container').style.display = "none";
    }

    updatePosition() {
      if (!this._target || !this.offsetParent) {
        return;
      }
      var offset = this.offset;
      var parentRect = this.offsetParent.getBoundingClientRect();
      var targetRect = this._target.getBoundingClientRect();
      var tipRect = this.getBoundingClientRect();
      var horizontalCenterOffset = (targetRect.width - tipRect.width) / 2;
      var verticalCenterOffset = (targetRect.height - tipRect.height) / 2;
      var targetLeft = targetRect.left - parentRect.left;
      var targetTop = targetRect.top - parentRect.top;

      var tooltipLeft, tooltipTop;
      switch (this.position) {
        case 'top':
          tooltipLeft = targetLeft + horizontalCenterOffset;
          tooltipTop = targetTop - tipRect.height - offset;
          break;
        case 'bottom':
          tooltipLeft = targetLeft + horizontalCenterOffset;
          tooltipTop = targetTop + targetRect.height + offset;
          break;
        case 'left':
          tooltipLeft = targetLeft - tipRect.width - offset;
          tooltipTop = targetTop + verticalCenterOffset;
          break;
        case 'right':
          tooltipLeft = targetLeft + targetRect.width + offset;
          tooltipTop = targetTop + verticalCenterOffset;
          break;
      }

      this.style.left = tooltipLeft + 'px';
      this.style.top = tooltipTop + 'px';
    }

  }
  customElements.define('wired-tooltip', WiredTooltip);

  exports.WiredButton = WiredButton;
  exports.WiredCard = WiredCard;
  exports.WiredCheckbox = WiredCheckbox;
  exports.WiredCombo = WiredCombo;
  exports.WiredIconButton = WiredIconButton;
  exports.WiredInput = WiredInput;
  exports.WiredItem = WiredItem;
  exports.WiredListbox = WiredListbox;
  exports.WiredProgress = WiredProgress;
  exports.WiredRadio = WiredRadio;
  exports.WiredRadioGroup = WiredRadioGroup;
  exports.WiredSlider = WiredSlider;
  exports.WiredTextarea = WiredTextarea;
  exports.WiredToggle = WiredToggle;
  exports.WiredTooltip = WiredTooltip;

  return exports;

}({}));
