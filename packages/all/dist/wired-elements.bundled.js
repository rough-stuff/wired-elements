var WiredElements = (function (exports) {
    'use strict';

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
    const rewritesStyleAttribute = (() => {
        const el = document.createElement('div');
        el.setAttribute('style', '{{bad value}}');
        return el.getAttribute('style') !== '{{bad value}}';
    })();
    /**
     * An updateable Template that tracks the location of dynamic parts.
     */
    class Template {
        constructor(result, element) {
            this.parts = [];
            this.element = element;
            let index = -1;
            let partIndex = 0;
            const nodesToRemove = [];
            const _prepareTemplate = (template) => {
                const content = template.content;
                // Edge needs all 4 parameters present; IE11 needs 3rd parameter to be
                // null
                const walker = document.createTreeWalker(content, 133 /* NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_COMMENT |
                       NodeFilter.SHOW_TEXT */, null, false);
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
                        if (node.hasAttributes()) {
                            const attributes = node.attributes;
                            // Per
                            // https://developer.mozilla.org/en-US/docs/Web/API/NamedNodeMap,
                            // attributes are not guaranteed to be returned in document order.
                            // In particular, Edge/IE can return them out of order, so we cannot
                            // assume a correspondance between part index and attribute index.
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
                                const name = lastAttributeNameRegex.exec(stringForPart)[2];
                                // Find the corresponding attribute
                                // If the attribute name contains special characters, lower-case
                                // it so that on XML nodes with case-sensitive getAttribute() we
                                // can still find the attribute, which will have been lower-cased
                                // by the parser.
                                //
                                // If the attribute name doesn't contain special character, it's
                                // important to _not_ lower-case it, in case the name is
                                // case-sensitive, like with XML attributes like "viewBox".
                                const attributeLookupName = (rewritesStyleAttribute && name === 'style') ?
                                    'style$' :
                                    /^[a-zA-Z-]*$/.test(name) ? name : name.toLowerCase();
                                const attributeValue = node.getAttribute(attributeLookupName);
                                const strings = attributeValue.split(markerRegex);
                                this.parts.push({ type: 'attribute', index, name, strings });
                                node.removeAttribute(attributeLookupName);
                                partIndex += strings.length - 1;
                            }
                        }
                        if (node.tagName === 'TEMPLATE') {
                            _prepareTemplate(node);
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
                            parent.insertBefore((strings[i] === '') ? createMarker() :
                                document.createTextNode(strings[i]), node);
                            this.parts.push({ type: 'node', index: index++ });
                        }
                        parent.insertBefore(strings[lastIndex] === '' ?
                            createMarker() :
                            document.createTextNode(strings[lastIndex]), node);
                        nodesToRemove.push(node);
                    }
                    else if (node.nodeType === 8 /* Node.COMMENT_NODE */) {
                        if (node.nodeValue === marker) {
                            const parent = node.parentNode;
                            // Add a new marker node to be the startNode of the Part if any of
                            // the following are true:
                            //  * We don't have a previousSibling
                            //  * previousSibling is being removed (thus it's not the
                            //    `previousNode`)
                            //  * previousSibling is not a Text node
                            //
                            // TODO(justinfagnani): We should be able to use the previousNode
                            // here as the marker node and reduce the number of extra nodes we
                            // add to a template. See
                            // https://github.com/PolymerLabs/lit-html/issues/147
                            const previousSibling = node.previousSibling;
                            if (previousSibling === null || previousSibling !== previousNode ||
                                previousSibling.nodeType !== Node.TEXT_NODE) {
                                parent.insertBefore(createMarker(), node);
                            }
                            else {
                                index--;
                            }
                            this.parts.push({ type: 'node', index: index++ });
                            nodesToRemove.push(node);
                            // If we don't have a nextSibling add a marker node.
                            // We don't have to check if the next node is going to be removed,
                            // because that node will induce a new marker if so.
                            if (node.nextSibling === null) {
                                parent.insertBefore(createMarker(), node);
                            }
                            else {
                                index--;
                            }
                            currentNode = previousNode;
                            partIndex++;
                        }
                        else {
                            let i = -1;
                            while ((i = node.nodeValue.indexOf(marker, i + 1)) !== -1) {
                                // Comment node has a binding marker inside, make an inactive part
                                // The binding won't work, but subsequent bindings will
                                // TODO (justinfagnani): consider whether it's even worth it to
                                // make bindings in comments work
                                this.parts.push({ type: 'node', index: -1 });
                            }
                        }
                    }
                }
            };
            _prepareTemplate(element);
            // Remove text binding nodes after the walk to not disturb the TreeWalker
            for (const n of nodesToRemove) {
                n.parentNode.removeChild(n);
            }
        }
    }
    const isTemplatePartActive = (part) => part.index !== -1;
    // Allows `document.createComment('')` to be renamed for a
    // small manual size-savings.
    const createMarker = () => document.createComment('');
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
    const lastAttributeNameRegex = /([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F \x09\x0a\x0c\x0d"'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;

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
    const walkerNodeFilter = NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_COMMENT | NodeFilter.SHOW_TEXT;
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
     * div <-- stop removing since previous sibling is the removing node (div#1,
     * removed 4 nodes)
     */
    function removeNodesFromTemplate(template, nodesToRemove) {
        const { element: { content }, parts } = template;
        const walker = document.createTreeWalker(content, walkerNodeFilter, null, false);
        let partIndex = nextActiveIndexInTemplateParts(parts);
        let part = parts[partIndex];
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
                // go to the next active part.
                partIndex = nextActiveIndexInTemplateParts(parts, partIndex);
                part = parts[partIndex];
            }
        }
        nodesToRemoveInTemplate.forEach((n) => n.parentNode.removeChild(n));
    }
    const countNodes = (node) => {
        let count = (node.nodeType === Node.DOCUMENT_FRAGMENT_NODE) ? 0 : 1;
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
                insertCount = countNodes(node);
                refNode.parentNode.insertBefore(node, refNode);
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
    const isCEPolyfill = window.customElements !== undefined &&
        window.customElements.polyfillWrapFlushCallback !== undefined;
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
    const directives = new WeakMap();
    const isDirective = (o) => typeof o === 'function' && directives.has(o);

    /**
     * A sentinel value that signals that a value was handled by a directive and
     * should not be written to the DOM.
     */
    const noChange = {};

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
     * An instance of a `Template` that can be attached to the DOM and updated
     * with new values.
     */
    class TemplateInstance {
        constructor(template, processor, getTemplate) {
            this._parts = [];
            this.template = template;
            this.processor = processor;
            this._getTemplate = getTemplate;
        }
        update(values) {
            let i = 0;
            for (const part of this._parts) {
                if (part !== undefined) {
                    part.setValue(values[i]);
                }
                i++;
            }
            for (const part of this._parts) {
                if (part !== undefined) {
                    part.commit();
                }
            }
        }
        _clone() {
            // When using the Custom Elements polyfill, clone the node, rather than
            // importing it, to keep the fragment in the template's document. This
            // leaves the fragment inert so custom elements won't upgrade and
            // potentially modify their contents by creating a polyfilled ShadowRoot
            // while we traverse the tree.
            const fragment = isCEPolyfill ?
                this.template.element.content.cloneNode(true) :
                document.importNode(this.template.element.content, true);
            const parts = this.template.parts;
            let partIndex = 0;
            let nodeIndex = 0;
            const _prepareInstance = (fragment) => {
                // Edge needs all 4 parameters present; IE11 needs 3rd parameter to be
                // null
                const walker = document.createTreeWalker(fragment, 133 /* NodeFilter.SHOW_{ELEMENT|COMMENT|TEXT} */, null, false);
                let node = walker.nextNode();
                // Loop through all the nodes and parts of a template
                while (partIndex < parts.length && node !== null) {
                    const part = parts[partIndex];
                    // Consecutive Parts may have the same node index, in the case of
                    // multiple bound attributes on an element. So each iteration we either
                    // increment the nodeIndex, if we aren't on a node with a part, or the
                    // partIndex if we are. By not incrementing the nodeIndex when we find a
                    // part, we allow for the next part to be associated with the current
                    // node if neccessasry.
                    if (!isTemplatePartActive(part)) {
                        this._parts.push(undefined);
                        partIndex++;
                    }
                    else if (nodeIndex === part.index) {
                        if (part.type === 'node') {
                            const part = this.processor.handleTextExpression(this._getTemplate);
                            part.insertAfterNode(node);
                            this._parts.push(part);
                        }
                        else {
                            this._parts.push(...this.processor.handleAttributeExpressions(node, part.name, part.strings));
                        }
                        partIndex++;
                    }
                    else {
                        nodeIndex++;
                        if (node.nodeName === 'TEMPLATE') {
                            _prepareInstance(node.content);
                        }
                        node = walker.nextNode();
                    }
                }
            };
            _prepareInstance(fragment);
            if (isCEPolyfill) {
                document.adoptNode(fragment);
                customElements.upgrade(fragment);
            }
            return fragment;
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
    /**
     * The return type of `html`, which holds a Template and the values from
     * interpolated expressions.
     */
    class TemplateResult {
        constructor(strings, values, type, processor) {
            this.strings = strings;
            this.values = values;
            this.type = type;
            this.processor = processor;
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
                const close = s.lastIndexOf('>');
                // We're in a text position if the previous string closed its last tag, an
                // attribute position if the string opened an unclosed tag, and unchanged
                // if the string had no brackets at all:
                //
                // "...>...": text position. open === -1, close > -1
                // "...<...": attribute position. open > -1
                // "...": no change. open === -1, close === -1
                isTextBinding =
                    (close > -1 || isTextBinding) && s.indexOf('<', close + 1) === -1;
                if (!isTextBinding && rewritesStyleAttribute) {
                    html = html.replace(lastAttributeNameRegex, (match, p1, p2, p3) => {
                        return (p2 === 'style') ? `${p1}style$${p3}` : match;
                    });
                }
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
    const isPrimitive = (value) => (value === null ||
        !(typeof value === 'object' || typeof value === 'function'));
    /**
     * Sets attribute values for AttributeParts, so that the value is only set once
     * even if there are multiple parts for an attribute.
     */
    class AttributeCommitter {
        constructor(element, name, strings) {
            this.dirty = true;
            this.element = element;
            this.name = name;
            this.strings = strings;
            this.parts = [];
            for (let i = 0; i < strings.length - 1; i++) {
                this.parts[i] = this._createPart();
            }
        }
        /**
         * Creates a single part. Override this to create a differnt type of part.
         */
        _createPart() {
            return new AttributePart(this);
        }
        _getValue() {
            const strings = this.strings;
            const l = strings.length - 1;
            let text = '';
            for (let i = 0; i < l; i++) {
                text += strings[i];
                const part = this.parts[i];
                if (part !== undefined) {
                    const v = part.value;
                    if (v != null &&
                        (Array.isArray(v) || typeof v !== 'string' && v[Symbol.iterator])) {
                        for (const t of v) {
                            text += typeof t === 'string' ? t : String(t);
                        }
                    }
                    else {
                        text += typeof v === 'string' ? v : String(v);
                    }
                }
            }
            text += strings[l];
            return text;
        }
        commit() {
            if (this.dirty) {
                this.dirty = false;
                this.element.setAttribute(this.name, this._getValue());
            }
        }
    }
    class AttributePart {
        constructor(comitter) {
            this.value = undefined;
            this.committer = comitter;
        }
        setValue(value) {
            if (value !== noChange && (!isPrimitive(value) || value !== this.value)) {
                this.value = value;
                // If the value is a not a directive, dirty the committer so that it'll
                // call setAttribute. If the value is a directive, it'll dirty the
                // committer if it calls setValue().
                if (!isDirective(value)) {
                    this.committer.dirty = true;
                }
            }
        }
        commit() {
            while (isDirective(this.value)) {
                const directive$$1 = this.value;
                this.value = noChange;
                directive$$1(this);
            }
            if (this.value === noChange) {
                return;
            }
            this.committer.commit();
        }
    }
    class NodePart {
        constructor(templateFactory) {
            this.value = undefined;
            this._pendingValue = undefined;
            this.templateFactory = templateFactory;
        }
        /**
         * Inserts this part into a container.
         *
         * This part must be empty, as its contents are not automatically moved.
         */
        appendInto(container) {
            this.startNode = container.appendChild(createMarker());
            this.endNode = container.appendChild(createMarker());
        }
        /**
         * Inserts this part between `ref` and `ref`'s next sibling. Both `ref` and
         * its next sibling must be static, unchanging nodes such as those that appear
         * in a literal section of a template.
         *
         * This part must be empty, as its contents are not automatically moved.
         */
        insertAfterNode(ref) {
            this.startNode = ref;
            this.endNode = ref.nextSibling;
        }
        /**
         * Appends this part into a parent part.
         *
         * This part must be empty, as its contents are not automatically moved.
         */
        appendIntoPart(part) {
            part._insert(this.startNode = createMarker());
            part._insert(this.endNode = createMarker());
        }
        /**
         * Appends this part after `ref`
         *
         * This part must be empty, as its contents are not automatically moved.
         */
        insertAfterPart(ref) {
            ref._insert(this.startNode = createMarker());
            this.endNode = ref.endNode;
            ref.endNode = this.startNode;
        }
        setValue(value) {
            this._pendingValue = value;
        }
        commit() {
            while (isDirective(this._pendingValue)) {
                const directive$$1 = this._pendingValue;
                this._pendingValue = noChange;
                directive$$1(this);
            }
            const value = this._pendingValue;
            if (value === noChange) {
                return;
            }
            if (isPrimitive(value)) {
                if (value !== this.value) {
                    this._commitText(value);
                }
            }
            else if (value instanceof TemplateResult) {
                this._commitTemplateResult(value);
            }
            else if (value instanceof Node) {
                this._commitNode(value);
            }
            else if (Array.isArray(value) || value[Symbol.iterator]) {
                this._commitIterable(value);
            }
            else if (value.then !== undefined) {
                this._commitPromise(value);
            }
            else {
                // Fallback, will render the string representation
                this._commitText(value);
            }
        }
        _insert(node) {
            this.endNode.parentNode.insertBefore(node, this.endNode);
        }
        _commitNode(value) {
            if (this.value === value) {
                return;
            }
            this.clear();
            this._insert(value);
            this.value = value;
        }
        _commitText(value) {
            const node = this.startNode.nextSibling;
            value = value == null ? '' : value;
            if (node === this.endNode.previousSibling &&
                node.nodeType === Node.TEXT_NODE) {
                // If we only have a single text node between the markers, we can just
                // set its value, rather than replacing it.
                // TODO(justinfagnani): Can we just check if this.value is primitive?
                node.textContent = value;
            }
            else {
                this._commitNode(document.createTextNode(typeof value === 'string' ? value : String(value)));
            }
            this.value = value;
        }
        _commitTemplateResult(value) {
            const template = this.templateFactory(value);
            if (this.value && this.value.template === template) {
                this.value.update(value.values);
            }
            else {
                // Make sure we propagate the template processor from the TemplateResult
                // so that we use it's syntax extension, etc. The template factory comes
                // from the render function so that it can control caching.
                const instance = new TemplateInstance(template, value.processor, this.templateFactory);
                const fragment = instance._clone();
                instance.update(value.values);
                this._commitNode(fragment);
                this.value = instance;
            }
        }
        _commitIterable(value) {
            // For an Iterable, we create a new InstancePart per item, then set its
            // value to the item. This is a little bit of overhead for every item in
            // an Iterable, but it lets us recurse easily and efficiently update Arrays
            // of TemplateResults that will be commonly returned from expressions like:
            // array.map((i) => html`${i}`), by reusing existing TemplateInstances.
            // If _value is an array, then the previous render was of an
            // iterable and _value will contain the NodeParts from the previous
            // render. If _value is not an array, clear this part and make a new
            // array for NodeParts.
            if (!Array.isArray(this.value)) {
                this.value = [];
                this.clear();
            }
            // Lets us keep track of how many items we stamped so we can clear leftover
            // items from a previous render
            const itemParts = this.value;
            let partIndex = 0;
            let itemPart;
            for (const item of value) {
                // Try to reuse an existing part
                itemPart = itemParts[partIndex];
                // If no existing part, create a new one
                if (itemPart === undefined) {
                    itemPart = new NodePart(this.templateFactory);
                    itemParts.push(itemPart);
                    if (partIndex === 0) {
                        itemPart.appendIntoPart(this);
                    }
                    else {
                        itemPart.insertAfterPart(itemParts[partIndex - 1]);
                    }
                }
                itemPart.setValue(item);
                itemPart.commit();
                partIndex++;
            }
            if (partIndex < itemParts.length) {
                // Truncate the parts array so _value reflects the current state
                itemParts.length = partIndex;
                this.clear(itemPart && itemPart.endNode);
            }
        }
        _commitPromise(value) {
            this.value = value;
            value.then((v) => {
                if (this.value === value) {
                    this.setValue(v);
                    this.commit();
                }
            });
        }
        clear(startNode = this.startNode) {
            removeNodes(this.startNode.parentNode, startNode.nextSibling, this.endNode);
        }
    }
    /**
     * Implements a boolean attribute, roughly as defined in the HTML
     * specification.
     *
     * If the value is truthy, then the attribute is present with a value of
     * ''. If the value is falsey, the attribute is removed.
     */
    class BooleanAttributePart {
        constructor(element, name, strings) {
            this.value = undefined;
            this._pendingValue = undefined;
            if (strings.length !== 2 || strings[0] !== '' || strings[1] !== '') {
                throw new Error('Boolean attributes can only contain a single expression');
            }
            this.element = element;
            this.name = name;
            this.strings = strings;
        }
        setValue(value) {
            this._pendingValue = value;
        }
        commit() {
            while (isDirective(this._pendingValue)) {
                const directive$$1 = this._pendingValue;
                this._pendingValue = noChange;
                directive$$1(this);
            }
            if (this._pendingValue === noChange) {
                return;
            }
            const value = !!this._pendingValue;
            if (this.value !== value) {
                if (value) {
                    this.element.setAttribute(this.name, '');
                }
                else {
                    this.element.removeAttribute(this.name);
                }
            }
            this.value = value;
            this._pendingValue = noChange;
        }
    }
    /**
     * Sets attribute values for PropertyParts, so that the value is only set once
     * even if there are multiple parts for a property.
     *
     * If an expression controls the whole property value, then the value is simply
     * assigned to the property under control. If there are string literals or
     * multiple expressions, then the strings are expressions are interpolated into
     * a string first.
     */
    class PropertyCommitter extends AttributeCommitter {
        constructor(element, name, strings) {
            super(element, name, strings);
            this.single =
                (strings.length === 2 && strings[0] === '' && strings[1] === '');
        }
        _createPart() {
            return new PropertyPart(this);
        }
        _getValue() {
            if (this.single) {
                return this.parts[0].value;
            }
            return super._getValue();
        }
        commit() {
            if (this.dirty) {
                this.dirty = false;
                this.element[this.name] = this._getValue();
            }
        }
    }
    class PropertyPart extends AttributePart {
    }
    class EventPart {
        constructor(element, eventName) {
            this.value = undefined;
            this._pendingValue = undefined;
            this.element = element;
            this.eventName = eventName;
        }
        setValue(value) {
            this._pendingValue = value;
        }
        commit() {
            while (isDirective(this._pendingValue)) {
                const directive$$1 = this._pendingValue;
                this._pendingValue = noChange;
                directive$$1(this);
            }
            if (this._pendingValue === noChange) {
                return;
            }
            if ((this._pendingValue == null) !== (this.value == null)) {
                if (this._pendingValue == null) {
                    this.element.removeEventListener(this.eventName, this);
                }
                else {
                    this.element.addEventListener(this.eventName, this);
                }
            }
            this.value = this._pendingValue;
            this._pendingValue = noChange;
        }
        handleEvent(event) {
            if (typeof this.value === 'function') {
                this.value.call(this.element, event);
            }
            else if (typeof this.value.handleEvent === 'function') {
                this.value.handleEvent(event);
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
    /**
     * The default TemplateFactory which caches Templates keyed on
     * result.type and result.strings.
     */
    function templateFactory(result) {
        let templateCache = templateCaches.get(result.type);
        if (templateCache === undefined) {
            templateCache = new Map();
            templateCaches.set(result.type, templateCache);
        }
        let template = templateCache.get(result.strings);
        if (template === undefined) {
            template = new Template(result, result.getTemplateElement());
            templateCache.set(result.strings, template);
        }
        return template;
    }
    // The first argument to JS template tags retain identity across multiple
    // calls to a tag for the same literal, so we can cache work done per literal
    // in a Map.
    const templateCaches = new Map();

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
    const parts = new WeakMap();
    /**
     * Renders a template to a container.
     *
     * To update a container with new values, reevaluate the template literal and
     * call `render` with the new result.
     *
     * @param result a TemplateResult created by evaluating a template tag like
     *     `html` or `svg`.
     * @param container A DOM parent to render to. The entire contents are either
     *     replaced, or efficiently updated if the same result type was previous
     *     rendered there.
     * @param templateFactory a function to create a Template or retreive one from
     *     cache.
     */
    function render(result, container, templateFactory$$1 = templateFactory) {
        let part = parts.get(container);
        if (part === undefined) {
            removeNodes(container, container.firstChild);
            parts.set(container, part = new NodePart(templateFactory$$1));
            part.appendInto(container);
        }
        part.setValue(result);
        part.commit();
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
     * Creates Parts when a template is instantiated.
     */
    class DefaultTemplateProcessor {
        /**
         * Create parts for an attribute-position binding, given the event, attribute
         * name, and string literals.
         *
         * @param element The element containing the binding
         * @param name  The attribute name
         * @param strings The string literals. There are always at least two strings,
         *   event for fully-controlled bindings with a single expression.
         */
        handleAttributeExpressions(element, name, strings) {
            const prefix = name[0];
            if (prefix === '.') {
                const comitter = new PropertyCommitter(element, name.slice(1), strings);
                return comitter.parts;
            }
            if (prefix === '@') {
                return [new EventPart(element, name.slice(1))];
            }
            if (prefix === '?') {
                return [new BooleanAttributePart(element, name.slice(1), strings)];
            }
            const comitter = new AttributeCommitter(element, name, strings);
            return comitter.parts;
        }
        /**
         * Create parts for a text-position binding.
         * @param templateFactory
         */
        handleTextExpression(templateFactory) {
            return new NodePart(templateFactory);
        }
    }
    const defaultTemplateProcessor = new DefaultTemplateProcessor();

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
     * Interprets a template literal as an HTML template that can efficiently
     * render to and update a container.
     */
    const html = (strings, ...values) => new TemplateResult(strings, values, 'html', defaultTemplateProcessor);

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
    let compatibleShadyCSSVersion = true;
    if (typeof window.ShadyCSS === 'undefined') {
        compatibleShadyCSSVersion = false;
    }
    else if (typeof window.ShadyCSS.prepareTemplateDom === 'undefined') {
        console.warn(`Incompatible ShadyCSS version detected.` +
            `Please update to at least @webcomponents/webcomponentsjs@2.0.2 and` +
            `@webcomponents/shadycss@1.3.1.`);
        compatibleShadyCSSVersion = false;
    }
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
            if (compatibleShadyCSSVersion) {
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
                    // IE 11 doesn't support the iterable param Set constructor
                    const styles = new Set();
                    Array.from(content.querySelectorAll('style')).forEach((s) => {
                        styles.add(s);
                    });
                    removeNodesFromTemplate(template, styles);
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
     * not be scoped and the <style> will be left in the template and rendered
     * output.
     */
    const prepareTemplateStyles = (renderedDOM, template, scopeName) => {
        shadyRenderSet.add(scopeName);
        // Move styles out of rendered DOM and store.
        const styles = renderedDOM.querySelectorAll('style');
        // If there are no styles, there's no work to do.
        if (styles.length === 0) {
            return;
        }
        const condensedStyle = document.createElement('style');
        // Collect styles into a single style. This helps us make sure ShadyCSS
        // manipulations will not prevent us from being able to fix up template
        // part indices.
        // NOTE: collecting styles is inefficient for browsers but ShadyCSS
        // currently does this anyway. When it does not, this should be changed.
        for (let i = 0; i < styles.length; i++) {
            const style = styles[i];
            style.parentNode.removeChild(style);
            condensedStyle.textContent += style.textContent;
        }
        // Remove styles from nested templates in this scope.
        removeStylesFromLitTemplates(scopeName);
        // And then put the condensed style into the "root" template passed in as
        // `template`.
        insertNodeIntoTemplate(template, condensedStyle, template.element.content.firstChild);
        // Note, it's important that ShadyCSS gets the template that `lit-html`
        // will actually render so that it can update the style inside when
        // needed (e.g. @apply native Shadow DOM case).
        window.ShadyCSS.prepareTemplateStyles(template.element, scopeName);
        if (window.ShadyCSS.nativeShadow) {
            // When in native Shadow DOM, re-add styling to rendered content using
            // the style ShadyCSS produced.
            const style = template.element.content.querySelector('style');
            renderedDOM.insertBefore(style.cloneNode(true), renderedDOM.firstChild);
        }
        else {
            // When not in native Shadow DOM, at this point ShadyCSS will have
            // removed the style from the lit template and parts will be broken as a
            // result. To fix this, we put back the style node ShadyCSS removed
            // and then tell lit to remove that node from the template.
            // NOTE, ShadyCSS creates its own style so we can safely add/remove
            // `condensedStyle` here.
            template.element.content.insertBefore(condensedStyle, template.element.content.firstChild);
            const removes = new Set();
            removes.add(condensedStyle);
            removeNodesFromTemplate(template, removes);
        }
    };
    function render$1(result, container, scopeName) {
        const hasRendered = parts.has(container);
        render(result, container, shadyTemplateFactory(scopeName));
        // When rendering a TemplateResult, scope the template with ShadyCSS
        if (container instanceof ShadowRoot && compatibleShadyCSSVersion &&
            result instanceof TemplateResult) {
            // Scope the element template one time only for this scope.
            if (!shadyRenderSet.has(scopeName)) {
                const part = parts.get(container);
                const instance = part.value;
                prepareTemplateStyles(container, instance.template, scopeName);
            }
            // Update styling if this is the initial render to this container.
            if (!hasRendered) {
                window.ShadyCSS.styleElement(container.host);
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
    // serializer/deserializers for boolean attribute
    const fromBooleanAttribute = (value) => value !== null;
    const toBooleanAttribute = (value) => value ? '' : null;
    /**
     * Change function that returns true if `value` is different from `oldValue`.
     * This method is used as the default for a property's `hasChanged` function.
     */
    const notEqual = (value, old) => {
        // This ensures (old==NaN, value==NaN) always returns false
        return old !== value && (old === old || value === value);
    };
    const defaultPropertyDeclaration = {
        attribute: true,
        type: String,
        reflect: false,
        hasChanged: notEqual
    };
    const microtaskPromise = new Promise((resolve) => resolve(true));
    const STATE_HAS_UPDATED = 1;
    const STATE_UPDATE_REQUESTED = 1 << 2;
    const STATE_IS_REFLECTING = 1 << 3;
    /**
     * Base element class which manages element properties and attributes. When
     * properties change, the `update` method is asynchronously called. This method
     * should be supplied by subclassers to render updates as desired.
     */
    class UpdatingElement extends HTMLElement {
        constructor() {
            super();
            this._updateState = 0;
            this._instanceProperties = undefined;
            this._updatePromise = microtaskPromise;
            /**
             * Map with keys for any properties that have changed since the last
             * update cycle with previous values.
             */
            this._changedProperties = new Map();
            /**
             * Map with keys of properties that should be reflected when updated.
             */
            this._reflectingProperties = undefined;
            this.initialize();
        }
        /**
         * Returns a list of attributes corresponding to the registered properties.
         */
        static get observedAttributes() {
            // note: piggy backing on this to ensure we're _finalized.
            this._finalize();
            const attributes = [];
            for (const [p, v] of this._classProperties) {
                const attr = this._attributeNameForProperty(p, v);
                if (attr !== undefined) {
                    this._attributeToPropertyMap.set(attr, p);
                    attributes.push(attr);
                }
            }
            return attributes;
        }
        /**
         * Creates a property accessor on the element prototype if one does not exist.
         * The property setter calls the property's `hasChanged` property option
         * or uses a strict identity check to determine whether or not to request
         * an update.
         */
        static createProperty(name, options = defaultPropertyDeclaration) {
            // ensure private storage for property declarations.
            if (!this.hasOwnProperty('_classProperties')) {
                this._classProperties = new Map();
                // NOTE: Workaround IE11 not supporting Map constructor argument.
                const superProperties = Object.getPrototypeOf(this)._classProperties;
                if (superProperties !== undefined) {
                    superProperties.forEach((v, k) => this._classProperties.set(k, v));
                }
            }
            this._classProperties.set(name, options);
            // Allow user defined accessors by not replacing an existing own-property
            // accessor.
            if (this.prototype.hasOwnProperty(name)) {
                return;
            }
            const key = typeof name === 'symbol' ? Symbol() : `__${name}`;
            Object.defineProperty(this.prototype, name, {
                get() { return this[key]; },
                set(value) {
                    const oldValue = this[name];
                    this[key] = value;
                    this._requestPropertyUpdate(name, oldValue, options);
                },
                configurable: true,
                enumerable: true
            });
        }
        /**
         * Creates property accessors for registered properties and ensures
         * any superclasses are also finalized.
         */
        static _finalize() {
            if (this.hasOwnProperty('_finalized') && this._finalized) {
                return;
            }
            // finalize any superclasses
            const superCtor = Object.getPrototypeOf(this);
            if (typeof superCtor._finalize === 'function') {
                superCtor._finalize();
            }
            this._finalized = true;
            // initialize Map populated in observedAttributes
            this._attributeToPropertyMap = new Map();
            // make any properties
            const props = this.properties;
            // support symbols in properties (IE11 does not support this)
            const propKeys = [
                ...Object.getOwnPropertyNames(props),
                ...(typeof Object.getOwnPropertySymbols === 'function')
                    ? Object.getOwnPropertySymbols(props)
                    : []
            ];
            for (const p of propKeys) {
                // note, use of `any` is due to TypeSript lack of support for symbol in
                // index types
                this.createProperty(p, props[p]);
            }
        }
        /**
         * Returns the property name for the given attribute `name`.
         */
        static _attributeNameForProperty(name, options) {
            const attribute = options !== undefined && options.attribute;
            return attribute === false
                ? undefined
                : (typeof attribute === 'string'
                    ? attribute
                    : (typeof name === 'string' ? name.toLowerCase()
                        : undefined));
        }
        /**
         * Returns true if a property should request an update.
         * Called when a property value is set and uses the `hasChanged`
         * option for the property if present or a strict identity check.
         */
        static _valueHasChanged(value, old, hasChanged = notEqual) {
            return hasChanged(value, old);
        }
        /**
         * Returns the property value for the given attribute value.
         * Called via the `attributeChangedCallback` and uses the property's `type`
         * or `type.fromAttribute` property option.
         */
        static _propertyValueFromAttribute(value, options) {
            const type = options && options.type;
            if (type === undefined) {
                return value;
            }
            // Note: special case `Boolean` so users can use it as a `type`.
            const fromAttribute = type === Boolean
                ? fromBooleanAttribute
                : (typeof type === 'function' ? type : type.fromAttribute);
            return fromAttribute ? fromAttribute(value) : value;
        }
        /**
         * Returns the attribute value for the given property value. If this
         * returns undefined, the property will *not* be reflected to an attribute.
         * If this returns null, the attribute will be removed, otherwise the
         * attribute will be set to the value.
         * This uses the property's `reflect` and `type.toAttribute` property options.
         */
        static _propertyValueToAttribute(value, options) {
            if (options === undefined || options.reflect === undefined) {
                return;
            }
            // Note: special case `Boolean` so users can use it as a `type`.
            const toAttribute = options.type === Boolean
                ? toBooleanAttribute
                : (options.type &&
                    options.type.toAttribute ||
                    String);
            return toAttribute(value);
        }
        /**
         * Performs element initialization. By default this calls `createRenderRoot`
         * to create the element `renderRoot` node and captures any pre-set values for
         * registered properties.
         */
        initialize() {
            this.renderRoot = this.createRenderRoot();
            this._saveInstanceProperties();
        }
        /**
         * Fixes any properties set on the instance before upgrade time.
         * Otherwise these would shadow the accessor and break these properties.
         * The properties are stored in a Map which is played back after the
         * constructor runs. Note, on very old versions of Safari (<=9) or Chrome
         * (<=41), properties created for native platform properties like (`id` or
         * `name`) may not have default values set in the element constructor. On
         * these browsers native properties appear on instances and therefore their
         * default value will overwrite any element default (e.g. if the element sets
         * this.id = 'id' in the constructor, the 'id' will become '' since this is
         * the native platform default).
         */
        _saveInstanceProperties() {
            for (const [p] of this.constructor
                ._classProperties) {
                if (this.hasOwnProperty(p)) {
                    const value = this[p];
                    delete this[p];
                    if (!this._instanceProperties) {
                        this._instanceProperties = new Map();
                    }
                    this._instanceProperties.set(p, value);
                }
            }
        }
        /**
         * Applies previously saved instance properties.
         */
        _applyInstanceProperties() {
            for (const [p, v] of this._instanceProperties) {
                this[p] = v;
            }
            this._instanceProperties = undefined;
        }
        /**
         * Returns the node into which the element should render and by default
         * creates and returns an open shadowRoot. Implement to customize where the
         * element's DOM is rendered. For example, to render into the element's
         * childNodes, return `this`.
         * @returns {Element|DocumentFragment} Returns a node into which to render.
         */
        createRenderRoot() {
            return this.attachShadow({ mode: 'open' });
        }
        /**
         * Uses ShadyCSS to keep element DOM updated.
         */
        connectedCallback() {
            if ((this._updateState & STATE_HAS_UPDATED)) {
                if (window.ShadyCSS !== undefined) {
                    window.ShadyCSS.styleElement(this);
                }
            }
            else {
                this.requestUpdate();
            }
        }
        /**
         * Synchronizes property values when attributes change.
         */
        attributeChangedCallback(name, old, value) {
            if (old !== value) {
                this._attributeToProperty(name, value);
            }
        }
        _propertyToAttribute(name, value, options = defaultPropertyDeclaration) {
            const ctor = this.constructor;
            const attrValue = ctor._propertyValueToAttribute(value, options);
            if (attrValue !== undefined) {
                const attr = ctor._attributeNameForProperty(name, options);
                if (attr !== undefined) {
                    // Track if the property is being reflected to avoid
                    // setting the property again via `attributeChangedCallback`. Note:
                    // 1. this takes advantage of the fact that the callback is synchronous.
                    // 2. will behave incorrectly if multiple attributes are in the reaction
                    // stack at time of calling. However, since we process attributes
                    // in `update` this should not be possible (or an extreme corner case
                    // that we'd like to discover).
                    // mark state reflecting
                    this._updateState = this._updateState | STATE_IS_REFLECTING;
                    if (attrValue === null) {
                        this.removeAttribute(attr);
                    }
                    else {
                        this.setAttribute(attr, attrValue);
                    }
                    // mark state not reflecting
                    this._updateState = this._updateState & ~STATE_IS_REFLECTING;
                }
            }
        }
        _attributeToProperty(name, value) {
            // Use tracking info to avoid deserializing attribute value if it was
            // just set from a property setter.
            if (!(this._updateState & STATE_IS_REFLECTING)) {
                const ctor = this.constructor;
                const propName = ctor._attributeToPropertyMap.get(name);
                if (propName !== undefined) {
                    const options = ctor._classProperties.get(propName);
                    this[propName] =
                        ctor._propertyValueFromAttribute(value, options);
                }
            }
        }
        /**
         * Requests an update which is processed asynchronously. This should
         * be called when an element should update based on some state not triggered
         * by setting a property. In this case, pass no arguments. It should also be
         * called when manually implementing a property setter. In this case, pass the
         * property `name` and `oldValue` to ensure that any configured property
         * options are honored. Returns the `updateComplete` Promise which is resolved
         * when the update completes.
         *
         * @param name {PropertyKey} (optional) name of requesting property
         * @param oldValue {any} (optional) old value of requesting property
         * @returns {Promise} A Promise that is resolved when the update completes.
         */
        requestUpdate(name, oldValue) {
            if (name !== undefined) {
                const options = this.constructor
                    ._classProperties.get(name) ||
                    defaultPropertyDeclaration;
                return this._requestPropertyUpdate(name, oldValue, options);
            }
            return this._invalidate();
        }
        /**
         * Requests an update for a specific property and records change information.
         * @param name {PropertyKey} name of requesting property
         * @param oldValue {any} old value of requesting property
         * @param options {PropertyDeclaration}
         */
        _requestPropertyUpdate(name, oldValue, options) {
            if (!this.constructor
                ._valueHasChanged(this[name], oldValue, options.hasChanged)) {
                return this.updateComplete;
            }
            // track old value when changing.
            if (!this._changedProperties.has(name)) {
                this._changedProperties.set(name, oldValue);
            }
            // add to reflecting properties set
            if (options.reflect === true) {
                if (this._reflectingProperties === undefined) {
                    this._reflectingProperties = new Map();
                }
                this._reflectingProperties.set(name, options);
            }
            return this._invalidate();
        }
        /**
         * Invalidates the element causing it to asynchronously update regardless
         * of whether or not any property changes are pending. This method is
         * automatically called when any registered property changes.
         */
        async _invalidate() {
            if (!this._hasRequestedUpdate) {
                // mark state updating...
                this._updateState = this._updateState | STATE_UPDATE_REQUESTED;
                let resolver;
                const previousValidatePromise = this._updatePromise;
                this._updatePromise = new Promise((r) => resolver = r);
                await previousValidatePromise;
                this._validate();
                resolver(!this._hasRequestedUpdate);
            }
            return this.updateComplete;
        }
        get _hasRequestedUpdate() {
            return (this._updateState & STATE_UPDATE_REQUESTED);
        }
        /**
         * Validates the element by updating it.
         */
        _validate() {
            // Mixin instance properties once, if they exist.
            if (this._instanceProperties) {
                this._applyInstanceProperties();
            }
            if (this.shouldUpdate(this._changedProperties)) {
                const changedProperties = this._changedProperties;
                this.update(changedProperties);
                this._markUpdated();
                if (!(this._updateState & STATE_HAS_UPDATED)) {
                    this._updateState = this._updateState | STATE_HAS_UPDATED;
                    this.firstUpdated(changedProperties);
                }
                this.updated(changedProperties);
            }
            else {
                this._markUpdated();
            }
        }
        _markUpdated() {
            this._changedProperties = new Map();
            this._updateState = this._updateState & ~STATE_UPDATE_REQUESTED;
        }
        /**
         * Returns a Promise that resolves when the element has completed updating.
         * The Promise value is a boolean that is `true` if the element completed the
         * update without triggering another update. The Promise result is `false` if
         * a property was set inside `updated()`. This getter can be implemented to
         * await additional state. For example, it is sometimes useful to await a
         * rendered element before fulfilling this Promise. To do this, first await
         * `super.updateComplete` then any subsequent state.
         *
         * @returns {Promise} The Promise returns a boolean that indicates if the
         * update resolved without triggering another update.
         */
        get updateComplete() { return this._updatePromise; }
        /**
         * Controls whether or not `update` should be called when the element requests
         * an update. By default, this method always returns `true`, but this can be
         * customized to control when to update.
         *
         * * @param _changedProperties Map of changed properties with old values
         */
        shouldUpdate(_changedProperties) {
            return true;
        }
        /**
         * Updates the element. This method reflects property values to attributes.
         * It can be overridden to render and keep updated DOM in the element's
         * `renderRoot`. Setting properties inside this method will *not* trigger
         * another update.
         *
         * * @param _changedProperties Map of changed properties with old values
         */
        update(_changedProperties) {
            if (this._reflectingProperties !== undefined &&
                this._reflectingProperties.size > 0) {
                for (const [k, v] of this._reflectingProperties) {
                    this._propertyToAttribute(k, this[k], v);
                }
                this._reflectingProperties = undefined;
            }
        }
        /**
         * Invoked whenever the element is updated. Implement to perform
         * post-updating tasks via DOM APIs, for example, focusing an element.
         *
         * Setting properties inside this method will trigger the element to update
         * again after this update cycle completes.
         *
         * * @param _changedProperties Map of changed properties with old values
         */
        updated(_changedProperties) { }
        /**
         * Invoked when the element is first updated. Implement to perform one time
         * work on the element after update.
         *
         * Setting properties inside this method will trigger the element to update
         * again after this update cycle completes.
         *
         * * @param _changedProperties Map of changed properties with old values
         */
        firstUpdated(_changedProperties) { }
    }
    /**
     * Maps attribute names to properties; for example `foobar` attribute
     * to `fooBar` property.
     */
    UpdatingElement._attributeToPropertyMap = new Map();
    /**
     * Marks class as having finished creating properties.
     */
    UpdatingElement._finalized = true;
    /**
     * Memoized list of all class properties, including any superclass properties.
     */
    UpdatingElement._classProperties = new Map();
    UpdatingElement.properties = {};

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

    class LitElement extends UpdatingElement {
        /**
         * Updates the element. This method reflects property values to attributes
         * and calls `render` to render DOM via lit-html. Setting properties inside
         * this method will *not* trigger another update.
         * * @param _changedProperties Map of changed properties with old values
         */
        update(changedProperties) {
            super.update(changedProperties);
            if (typeof this.render === 'function') {
                this.constructor
                    .render(this.render(), this.renderRoot, this.localName);
            }
            else {
                throw new Error('render() not implemented');
            }
        }
    }
    /**
     * Render method used to render the lit-html TemplateResult to the element's
     * DOM.
     * @param {TemplateResult} Template to render.
     * @param {Element|DocumentFragment} Node into which to render.
     * @param {String} Element name.
     */
    LitElement.render = render$1;

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
          elevation: { type: Number },
          disabled: { type: Boolean }
        };
      }

      constructor() {
        super();
        this.elevation = 1;
        this.disabled = false;
      }

      createRenderRoot() {
        const root = super.createRenderRoot();
        this.classList.add('pending');
        return root;
      }

      render() {
        this._onDisableChange();
        return html`
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
        outline: none;
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

      :host(:focus) path {
        stroke-width: 1.5;
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
        setTimeout(() => this.updated());
        this.addEventListener('keydown', (event) => {
          if ((event.keyCode === 13) || (event.keyCode === 32)) {
            event.preventDefault();
            this.click();
          }
        });
        this.setAttribute('role', 'button');
        this.setAttribute('aria-label', this.innerHTML);
      }

      updated() {
        const svg$$1 = this.shadowRoot.getElementById('svg');
        this._clearNode(svg$$1);
        const s = this.getBoundingClientRect();
        const elev = Math.min(Math.max(1, this.elevation), 5);
        const w = s.width + ((elev - 1) * 2);
        const h = s.height + ((elev - 1) * 2);
        svg$$1.setAttribute("width", w);
        svg$$1.setAttribute("height", h);
        wired.rectangle(svg$$1, 0, 0, s.width, s.height);
        for (var i = 1; i < elev; i++) {
          (wired.line(svg$$1, (i * 2), s.height + (i * 2), s.width + (i * 2), s.height + (i * 2))).style.opacity = (75 - (i * 10)) / 100;
          (wired.line(svg$$1, s.width + (i * 2), s.height + (i * 2), s.width + (i * 2), i * 2)).style.opacity = (75 - (i * 10)) / 100;
          (wired.line(svg$$1, (i * 2), s.height + (i * 2), s.width + (i * 2), s.height + (i * 2))).style.opacity = (75 - (i * 10)) / 100;
          (wired.line(svg$$1, s.width + (i * 2), s.height + (i * 2), s.width + (i * 2), i * 2)).style.opacity = (75 - (i * 10)) / 100;
        }
        this.classList.remove('pending');
      }
    }

    customElements.define('wired-button', WiredButton);

    class WiredCard extends LitElement {
      static get properties() {
        return {
          elevation: { type: Number }
        };
      }

      constructor() {
        super();
        this.elevation = 1;
      }

      createRenderRoot() {
        const root = super.createRenderRoot();
        this.classList.add('pending');
        return root;
      }

      render() {
        return html`
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
      <slot @slotchange="${() => this.requestUpdate()}"></slot>
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
        if (!this.resizeHandler) {
          this.resizeHandler = this._debounce(this.updated.bind(this), 200, false, this);
          window.addEventListener('resize', this.resizeHandler);
        }
        setTimeout(() => this.updated());
      }

      disconnectedCallback() {
        if (super.disconnectedCallback) super.disconnectedCallback();
        if (this.resizeHandler) {
          window.removeEventListener('resize', this.resizeHandler);
          delete this.resizeHandler;
        }
      }

      updated() {
        const svg$$1 = this.shadowRoot.getElementById('svg');
        this._clearNode(svg$$1);
        var s = this.getBoundingClientRect();
        var elev = Math.min(Math.max(1, this.elevation), 5);
        var w = s.width + ((elev - 1) * 2);
        var h = s.height + ((elev - 1) * 2);
        svg$$1.setAttribute("width", w);
        svg$$1.setAttribute("height", h);
        wired.rectangle(svg$$1, 0, 0, s.width, s.height);
        for (var i = 1; i < elev; i++) {
          (wired.line(svg$$1, (i * 2), s.height + (i * 2), s.width + (i * 2), s.height + (i * 2))).style.opacity = (85 - (i * 10)) / 100;
          (wired.line(svg$$1, s.width + (i * 2), s.height + (i * 2), s.width + (i * 2), i * 2)).style.opacity = (85 - (i * 10)) / 100;
          (wired.line(svg$$1, (i * 2), s.height + (i * 2), s.width + (i * 2), s.height + (i * 2))).style.opacity = (85 - (i * 10)) / 100;
          (wired.line(svg$$1, s.width + (i * 2), s.height + (i * 2), s.width + (i * 2), i * 2)).style.opacity = (85 - (i * 10)) / 100;
        }
        this.classList.remove('pending');
      }

      _debounce(func, wait, immediate, context) {
        let timeout = 0;
        return () => {
          const args = arguments;
          const later = () => {
            timeout = 0;
            if (!immediate) {
              func.apply(context, args);
            }
          };
          const callNow = immediate && !timeout;
          clearTimeout(timeout);
          timeout = window.setTimeout(later, wait);
          if (callNow) {
            func.apply(context, args);
          }
        };
      }
    }
    customElements.define('wired-card', WiredCard);

    class WiredCheckbox extends LitElement {
      static get properties() {
        return {
          checked: { type: Boolean },
          text: { type: String },
          disabled: { type: Boolean }
        };
      }

      constructor() {
        super();
        this.disabled = false;
        this.checked = false;
      }

      createRenderRoot() {
        const root = super.createRenderRoot();
        this.classList.add('pending');
        return root;
      }

      render() {
        this._onDisableChange();
        return html`
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
    
      :host(:focus) path {
        stroke-width: 1.5;
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
    <div id="container" @click="${() => this._toggleCheck()}">
      <div id="checkPanel" class="inline">
        <svg id="svg" width="0" height="0"></svg>
      </div>
      <div class="inline">${this.text}</div>
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

      updated() {
        const svg$$1 = this.shadowRoot.getElementById('svg');
        this._clearNode(svg$$1);
        const s = { width: 24, height: 24 };
        svg$$1.setAttribute("width", s.width);
        svg$$1.setAttribute("height", s.height);
        wired.rectangle(svg$$1, 0, 0, s.width, s.height);
        const checkpaths = [];
        checkpaths.push(wired.line(svg$$1, s.width * 0.3, s.height * 0.4, s.width * 0.5, s.height * 0.7));
        checkpaths.push(wired.line(svg$$1, s.width * 0.5, s.height * 0.7, s.width + 5, -5));
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
          text: { type: String },
          value: { type: String }
        };
      }

      render() {
        return html`
    <style>
      :host {
        display: block;
        padding: 8px;
        font-family: inherit;
      }
    </style>
    <span>${this.text}</span>
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
        if (super.disconnectedCallback) super.disconnectedCallback();
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
          value: { type: Object },
          selected: { type: String },
          disabled: { type: Boolean }
        };
      }

      constructor() {
        super();
        this.disabled = false;
        this._cardShowing = false;
        this._itemNodes = [];
      }

      createRenderRoot() {
        const root = super.createRenderRoot();
        this.classList.add('pending');
        return root;
      }

      render() {
        this._onDisableChange();
        return html`
    <style>
      :host {
        display: inline-block;
        font-family: inherit;
        position: relative;
        outline: none;
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

      :host(:focus) path {
        stroke-width: 1.5;
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
    <div id="container" @click="${(e) => this._onCombo(e)}">
      <div id="textPanel" class="inline">
        <span>${this.value && this.value.text}</span>
      </div>
      <div id="dropPanel" class="inline"></div>
      <div class="overlay">
        <svg id="svg"></svg>
      </div>
    </div>
    <wired-card id="card" role="listbox" @item-click="${(e) => this._onItemClick(e)}" style="display: none;">
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

      firstUpdated() {
        this._refreshSelection();
      }

      updated() {
        const svg$$1 = this.shadowRoot.getElementById('svg');
        this._clearNode(svg$$1);
        const s = this.shadowRoot.getElementById('container').getBoundingClientRect();
        svg$$1.setAttribute("width", s.width);
        svg$$1.setAttribute("height", s.height);
        const textBounds = this.shadowRoot.getElementById('textPanel').getBoundingClientRect();
        this.shadowRoot.getElementById('dropPanel').style.minHeight = textBounds.height + "px";
        wired.rectangle(svg$$1, 0, 0, textBounds.width, textBounds.height);
        const dropx = textBounds.width - 4;
        wired.rectangle(svg$$1, dropx, 0, 34, textBounds.height);
        const dropOffset = Math.max(0, Math.abs((textBounds.height - 24) / 2));
        const poly = wired.polygon(svg$$1, [
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
            card.requestUpdate();
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

    const style = html`<style>:host{font-family:var(--mdc-icon-font, "Material Icons");font-weight:normal;font-style:normal;font-size:var(--mdc-icon-size, 24px);line-height:1;letter-spacing:normal;text-transform:none;display:inline-block;white-space:nowrap;word-wrap:normal;direction:ltr;-webkit-font-feature-settings:'liga';-webkit-font-smoothing:antialiased}
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
      renderStyle() {
        return style;
      }
      render() {
        return html`${this.renderStyle()}<slot></slot>`;
      }
    }

    customElements.define('mwc-icon', Icon);

    class WiredIconButton extends LitElement {
      static get properties() {
        return {
          disabled: { type: Boolean }
        };
      }

      constructor() {
        super();
        this.disabled = false;
      }

      createRenderRoot() {
        const root = super.createRenderRoot();
        this.classList.add('pending');
        return root;
      }

      render() {
        this._onDisableChange();
        return html`
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
        outline: none;
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

      :host(:focus) path {
        stroke-width: 1.5;
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

      updated() {
        const svg$$1 = this.shadowRoot.getElementById('svg');
        this._clearNode(svg$$1);
        const s = this.getBoundingClientRect();
        const min = Math.min(s.width, s.height);
        svg$$1.setAttribute("width", min);
        svg$$1.setAttribute("height", min);
        wired.ellipse(svg$$1, min / 2, min / 2, min, min);
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
        setTimeout(() => this.updated());
      }
    }
    customElements.define('wired-icon-button', WiredIconButton);

    class WiredInput extends LitElement {
      static get properties() {
        return {
          placeholder: { type: String },
          name: { type: String },
          disabled: { type: Boolean },
          type: { type: String },
          required: { type: Boolean },
          autocomplete: { type: String },
          autofocus: { type: Boolean },
          minlength: { type: Number },
          maxlength: { type: Number },
          min: { type: String },
          max: { type: String },
          step: { type: String },
          readonly: { type: Boolean },
          size: { type: Number },
          autocapitalize: { type: String },
          autocorrect: { type: String }
        };
      }

      constructor() {
        super();
        this.disabled = false;
      }

      createRenderRoot() {
        const root = this.attachShadow({ mode: 'open', delegatesFocus: true });
        this.classList.add('pending');
        return root;
      }

      render() {
        this._onDisableChange();
        return html`
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
    <input id="txt" name="${this.name}" type="${this.type}" placeholder="${this.placeholder}" ?disabled="${this.disabled}" ?required="${this.required}"
      autocomplete="${this.autocomplete}" ?autofocus="${this.autofocus}" minlength="${this.minlength}" maxlength="${this.maxlength}" min="${this.min}"
      max="${this.max}" step="${this.step}" ?readonly="${this.readonly}" size="${this.size}" autocapitalize="${this.autocapitalize}" autocorrect="${this.autocorrect}"
      @change="${(e) => this._onChange(e)}">
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

      updated() {
        const svg$$1 = this.shadowRoot.getElementById('svg');
        this._clearNode(svg$$1);
        const s = this.getBoundingClientRect();
        svg$$1.setAttribute("width", s.width);
        svg$$1.setAttribute("height", s.height);
        wired.rectangle(svg$$1, 0, 0, s.width, s.height);
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
          value: { type: Object },
          selected: { type: String },
          horizontal: { type: Boolean }
        }
      }

      constructor() {
        super();
        this.horizontal = false;
        this._itemNodes = [];
      }

      createRenderRoot() {
        const root = super.createRenderRoot();
        this.classList.add('pending');
        return root;
      }

      render() {
        if (this.horizontal) {
          this.classList.add('horizontal');
        } else {
          this.classList.remove('horizontal');
        }
        this.tabIndex = (this.getAttribute('tabindex') || 0);
        return html`
      <style>
        :host {
          display: inline-block;
          font-family: inherit;
          position: relative;
          padding: 5px;
          outline: none;
        }
      
        :host(.pending) {
          opacity: 0;
        }

        :host(:focus) path {
          stroke-width: 1.5;
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
      <slot id="slot" @slotchange="${() => this.requestUpdate()}"></slot>
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
        setTimeout(() => this.updated());
      }

      disconnectedCallback() {
        if (super.disconnectedCallback) super.disconnectedCallback();
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

      firstUpdated() {
        this._refreshSelection();
      }

      updated() {
        const svg$$1 = this.shadowRoot.getElementById('svg');
        this._clearNode(svg$$1);
        const s = this.getBoundingClientRect();
        svg$$1.setAttribute("width", s.width);
        svg$$1.setAttribute("height", s.height);
        wired.rectangle(svg$$1, 0, 0, s.width, s.height);
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
          value: { type: Number },
          min: { type: Number },
          max: { type: Number },
          percentage: { type: Boolean }
        };
      }

      constructor() {
        super();
        this.percentage = false;
        this.max = 100;
        this.min = 0;
        this.value = 0;
      }

      createRenderRoot() {
        const root = super.createRenderRoot();
        this.classList.add('pending');
        return root;
      }

      render() {
        return html`
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

      updated() {
        const svg$$1 = this.shadowRoot.getElementById('svg');
        this._clearNode(svg$$1);
        var s = this.getBoundingClientRect();
        svg$$1.setAttribute("width", s.width);
        svg$$1.setAttribute("height", s.height);
        wired.rectangle(svg$$1, 0, 0, s.width, s.height);

        let pct = 0;
        if (this.max > this.min) {
          pct = (this.value - this.min) / (this.max - this.min);
          const progWidth = s.width * Math.max(0, Math.min(pct, 100));
          const progBox = wired.polygon(svg$$1, [
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
          checked: { type: Boolean },
          name: { type: String },
          text: { type: String },
          iconsize: { type: Number },
          disabled: { type: Boolean }
        };
      }

      constructor() {
        super();
        this.disabled = false;
        this.checked = false;
        this.iconsize = 24;
      }

      createRenderRoot() {
        const root = super.createRenderRoot();
        this.classList.add('pending');
        return root;
      }

      render() {
        this._onDisableChange();
        return html`
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

      :host(:focus) path {
        stroke-width: 1.5;
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
    <div id="container" @click="${() => this._toggleCheck()}">
      <div id="checkPanel" class="inline">
        <svg id="svg" width="0" height="0"></svg>
      </div>
      <div class="inline">${this.text}</div>
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

      updated() {
        const svg$$1 = this.shadowRoot.getElementById('svg');
        this._clearNode(svg$$1);
        this._dot = null;
        const s = { width: this.iconsize || 24, height: this.iconsize || 24 };
        svg$$1.setAttribute("width", s.width);
        svg$$1.setAttribute("height", s.height);
        wired.ellipse(svg$$1, s.width / 2, s.height / 2, s.width, s.height);

        const iw = Math.max(s.width * 0.6, 5);
        const ih = Math.max(s.height * 0.6, 5);
        this._dot = wired.ellipse(svg$$1, s.width / 2, s.height / 2, iw, ih);
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
          selected: { type: String }
        };
      }

      render() {
        return html`
    <style>
      :host {
        display: inline-block;
      }
    
      :host ::slotted(*) {
        padding: var(--wired-radio-group-item-padding, 5px);
      }
    </style>
    <slot id="slot" @slotchange="${() => this.slotChange()}"></slot>
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
        if (super.disconnectedCallback) super.disconnectedCallback();
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
        this.requestUpdate();
      }

      updated() {
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
       * import {microTask} from '@polymer/polymer/lib/utils/async.js';
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
    let rootPath = pathFromUrl(document.baseURI || window.location.href);

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

    // Defined at https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#enabling-and-disabling-form-controls:-the-disabled-attribute
    /** @type {!Object<boolean>} */
    const canBeDisabled = {
      'button': true,
      'command': true,
      'fieldset': true,
      'input': true,
      'keygen': true,
      'optgroup': true,
      'option': true,
      'select': true,
      'textarea': true
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
     * @param {Event|Touch} ev Event.
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
        let shouldPrevent = false;
        let dx = Math.abs(POINTERSTATE.touch.x - t.clientX);
        let dy = Math.abs(POINTERSTATE.touch.y - t.clientY);
        if (!ev.cancelable) ; else if (ta === 'none') {
          shouldPrevent = true;
        } else if (ta === 'pan-x') {
          shouldPrevent = dy > dx;
        } else if (ta === 'pan-y') {
          shouldPrevent = dx > dy;
        }
        if (shouldPrevent) {
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
     * @param {!Node} node Node on which to add the event.
     * @param {string} evType Event type to add.
     * @param {function(!Event)} handler Event handler function.
     * @return {void}
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
     * @param {!Node} node Node to set touch action setting on
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
            downupFire('up', t, e);
            untrackDocument(self.info);
          }
        };
        let upfn = function upfn(e) {
          if (hasLeftMouseButton(e)) {
            downupFire('up', t, e);
          }
          untrackDocument(self.info);
        };
        trackDocument(this.info, movefn, upfn);
        downupFire('down', t, e);
      },
      /**
       * @this {GestureRecognizer}
       * @param {TouchEvent} e
       * @return {void}
       */
      touchstart: function(e) {
        downupFire('down', _findOriginalTarget(e), e.changedTouches[0], e);
      },
      /**
       * @this {GestureRecognizer}
       * @param {TouchEvent} e
       * @return {void}
       */
      touchend: function(e) {
        downupFire('up', _findOriginalTarget(e), e.changedTouches[0], e);
      }
    });

    /**
     * @param {string} type
     * @param {EventTarget} target
     * @param {Event|Touch} event
     * @param {Event=} preventer
     * @return {void}
     */
    function downupFire(type, target, event, preventer) {
      if (!target) {
        return;
      }
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
        /** @this {GestureInfo} */
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
          if (trackHasMovedEnough(self.info, x, y)) {
            // first move is 'start', subsequent moves are 'move', mouseup is 'end'
            self.info.state = self.info.started ? (e.type === 'mouseup' ? 'end' : 'track') : 'start';
            if (self.info.state === 'start') {
              // if and only if tracking, always prevent tap
              prevent('tap');
            }
            self.info.addMove({x: x, y: y});
            if (!hasLeftMouseButton(e)) {
              // always fire "end"
              self.info.state = 'end';
              untrackDocument(self.info);
            }
            if (t) {
              trackFire(self.info, t, e);
            }
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
        if (trackHasMovedEnough(this.info, x, y)) {
          if (this.info.state === 'start') {
            // if and only if tracking, always prevent tap
            prevent('tap');
          }
          this.info.addMove({x: x, y: y});
          trackFire(this.info, t, ct);
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
          trackFire(this.info, t, ct);
        }
      }
    });

    /**
     * @param {!GestureInfo} info
     * @param {number} x
     * @param {number} y
     * @return {boolean}
     */
    function trackHasMovedEnough(info, x, y) {
      if (info.prevent) {
        return false;
      }
      if (info.started) {
        return true;
      }
      let dx = Math.abs(info.x - x);
      let dy = Math.abs(info.y - y);
      return (dx >= TRACK_DISTANCE || dy >= TRACK_DISTANCE);
    }

    /**
     * @param {!GestureInfo} info
     * @param {?EventTarget} target
     * @param {Touch} touch
     * @return {void}
     */
    function trackFire(info, target, touch) {
      if (!target) {
        return;
      }
      let secondlast = info.moves[info.moves.length - 2];
      let lastmove = info.moves[info.moves.length - 1];
      let dx = lastmove.x - info.x;
      let dy = lastmove.y - info.y;
      let ddx, ddy = 0;
      if (secondlast) {
        ddx = lastmove.x - secondlast.x;
        ddy = lastmove.y - secondlast.y;
      }
      _fire(target, 'track', {
        state: info.state,
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
      mousedown: function(e) {
        if (hasLeftMouseButton(e)) {
          this.info.x = e.clientX;
          this.info.y = e.clientY;
        }
      },
      /**
       * @this {GestureRecognizer}
       * @param {MouseEvent} e
       * @return {void}
       */
      click: function(e) {
        if (hasLeftMouseButton(e)) {
          trackForward(this.info, e);
        }
      },
      /**
       * @this {GestureRecognizer}
       * @param {TouchEvent} e
       * @return {void}
       */
      touchstart: function(e) {
        const touch = e.changedTouches[0];
        this.info.x = touch.clientX;
        this.info.y = touch.clientY;
      },
      /**
       * @this {GestureRecognizer}
       * @param {TouchEvent} e
       * @return {void}
       */
      touchend: function(e) {
        trackForward(this.info, e.changedTouches[0], e);
      }
    });

    /**
     * @param {!GestureInfo} info
     * @param {Event | Touch} e
     * @param {Event=} preventer
     * @return {void}
     */
    function trackForward(info, e, preventer) {
      let dx = Math.abs(e.clientX - info.x);
      let dy = Math.abs(e.clientY - info.y);
      // find original target from `preventer` for TouchEvents, or `e` for MouseEvents
      let t = _findOriginalTarget((preventer || e));
      if (!t || (canBeDisabled[/** @type {!HTMLElement} */(t).localName] && t.hasAttribute('disabled'))) {
        return;
      }
      // dx,dy can be NaN if `click` has been simulated and there was no `down` for `start`
      if (isNaN(dx) || isNaN(dy) || (dx <= TAP_DISTANCE && dy <= TAP_DISTANCE) || isSyntheticClick(e)) {
        // prevent taps from being generated if an event has canceled them
        if (!info.prevent) {
          _fire(t, 'tap', {
            x: e.clientX,
            y: e.clientY,
            sourceEvent: e,
            preventer: preventer
          });
        }
      }
    }

    class WiredSlider extends LitElement {
      static get properties() {
        return {
          _value: { type: Number },
          min: { type: Number },
          max: { type: Number },
          knobradius: { type: Number },
          disabled: { type: Boolean }
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

      createRenderRoot() {
        const root = super.createRenderRoot();
        this.classList.add('pending');
        return root;
      }

      render() {
        this._onDisableChange();
        return html`
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
        setTimeout(() => this.firstUpdated(), 100);
      }

      firstUpdated() {
        const svg$$1 = this.shadowRoot.getElementById('svg');
        this._clearNode(svg$$1);
        const s = this.getBoundingClientRect();
        svg$$1.setAttribute("width", s.width);
        svg$$1.setAttribute("height", s.height);
        let radius = this.knobradius || 10;
        this._barWidth = s.width - (2 * radius);
        this._bar = wired.line(svg$$1, radius, s.height / 2, s.width - radius, s.height / 2);
        this._bar.classList.add("bar");
        this._knobGroup = wired._svgNode("g");
        svg$$1.appendChild(this._knobGroup);
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
          rows: { type: Number },
          maxrows: { type: Number },
          autocomplete: { type: String },
          autofocus: { type: Boolean },
          inputmode: { type: String },
          placeholder: { type: String },
          readonly: { type: Boolean },
          required: { type: Boolean },
          minlength: { type: Number },
          maxlength: { type: Number },
          disabled: { type: Boolean }
        };
      }

      constructor() {
        super();
        this.disabled = false;
        this.rows = 1;
        this.maxrows = 0;
      }

      createRenderRoot() {
        const root = this.attachShadow({ mode: 'open', delegatesFocus: true });
        this.classList.add('pending');
        return root;
      }

      render() {
        this._onDisableChange();
        return html`
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
      <textarea id="textarea" autocomplete="${this.autocomplete}" ?autofocus="${this.autofocus}" inputmode="${this.inputmode}" placeholder="${this.placeholder}"
        ?readonly="${this.readonly}" ?required="${this.required}" ?disabled="${this.disabled}" rows="${this.rows}" minlength="${this.minlength}" maxlength="${this.maxlength}"
        @input="${() => this._onInput()}"></textarea>
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
        this.requestUpdate();
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
          this.requestUpdate();
        }
      }

      updated() {
        const s = this.getBoundingClientRect();
        const svg$$1 = this.shadowRoot.getElementById('svg');

        if (this._prevHeight !== s.height) {
          this._clearNode(svg$$1);
          svg$$1.setAttribute('width', s.width);
          svg$$1.setAttribute('height', s.height);
          wired.rectangle(svg$$1, 2, 2, s.width - 2, s.height - 2);

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
          checked: { type: Boolean },
          disabled: { type: Boolean }
        };
      }

      constructor() {
        super();
        this.disabled = false;
        this.checked = false;
      }

      createRenderRoot() {
        const root = super.createRenderRoot();
        this.classList.add('pending');
        return root;
      }

      render() {
        this._onDisableChange();
        return html`
    <style>
      :host {
        display: inline-block;
        cursor: pointer;
        position: relative;
        outline: none;
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

      :host(:focus) path {
        stroke-width: 1.5;
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
    <div @click="${() => this._toggleCheck()}">
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

      updated() {
        const svg$$1 = this.shadowRoot.getElementById('svg');
        this._clearNode(svg$$1);
        const s = { width: (this.height || 32) * 2.5, height: this.height || 32 };
        svg$$1.setAttribute("width", s.width);
        svg$$1.setAttribute("height", s.height);
        wired.rectangle(svg$$1, 0, 0, s.width, s.height);
        this.knob = wired.ellipse(svg$$1, s.height / 2, s.height / 2, s.height, s.height);
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
          for: { type: String },
          position: { type: String },
          text: { type: String },
          offset: { type: Number }
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

      render() {
        return html`
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
      <span style="position: relative;">${this.text}</span>
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
        const svg$$1 = this.shadowRoot.getElementById('svg');
        this._clearNode(svg$$1);
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
        svg$$1.setAttribute("width", w);
        svg$$1.setAttribute("height", h);
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
            svg$$1.style.transform = "translateX(" + (-this.offset) + "px)";
            break;
          default:
            points = [
              [2, this.offset], [0, h - 2], [w - 2, h - 2], [w - 2, this.offset],
              [w / 2 + 8, this.offset], [w / 2, this.offset - 8], [w / 2 - 8, this.offset]
            ];
            svg$$1.style.transform = "translateY(" + (-this.offset) + "px)";
            break;
        }
        wired.polygon(svg$$1, points);
        this._dirty = false;
      }

      firstUpdated() {
        this._layout();
      }

      updated(changedProps) {
        if (changedProps && (changedProps.position || changedProps.text)) {
          this._dirty = true;
        }
        if ((!this._target) || (changedProps && changedProps.for)) {
          this._refreshTarget();
        }
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
