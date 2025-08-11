// Copyright 2021 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
/* eslint-disable rulesdir/no-imperative-dom-api */
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _WidgetElement_instances, _WidgetElement_widgetClass, _WidgetElement_widgetParams, _WidgetElement_instantiateWidget, _Widget_instances, _Widget_shadowRoot, _Widget_visible, _Widget_isRoot, _Widget_isShowing, _Widget_children, _Widget_hideOnDetach, _Widget_notificationDepth, _Widget_invalidationsSuspended, _Widget_parentWidget, _Widget_defaultFocusedElement, _Widget_cachedConstraints, _Widget_constraints, _Widget_invalidationsRequested, _Widget_externallyManaged, _Widget_updateComplete, _Widget_updateCompleteResolve, _Widget_updateRequestID, _Widget_performUpdateCallback;
/*
 * Copyright (C) 2008 Apple Inc. All Rights Reserved.
 * Copyright (C) 2011 Google Inc. All Rights Reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 * 1. Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright
 *    notice, this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY APPLE INC. ``AS IS'' AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
 * PURPOSE ARE DISCLAIMED.  IN NO EVENT SHALL APPLE INC. OR
 * CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
 * PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 * PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
 * OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
import '../../core/dom_extension/dom_extension.js';
import * as Platform from '../../core/platform/platform.js';
import * as Lit from '../../ui/lit/lit.js';
import { Constraints, Size } from './Geometry.js';
import { createShadowRootWithCoreStyles } from './UIUtils.js';
import { XWidget } from './XWidget.js';
// Remember the original DOM mutation methods here, since we
// will override them below to sanity check the Widget system.
const originalAppendChild = Element.prototype.appendChild;
const originalInsertBefore = Element.prototype.insertBefore;
const originalRemoveChild = Element.prototype.removeChild;
const originalRemoveChildren = Element.prototype.removeChildren;
function assert(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}
export class WidgetConfig {
    constructor(widgetClass, widgetParams) {
        this.widgetClass = widgetClass;
        this.widgetParams = widgetParams;
    }
}
export function widgetConfig(widgetClass, widgetParams) {
    return new WidgetConfig(widgetClass, widgetParams);
}
export class WidgetElement extends HTMLElement {
    constructor() {
        super(...arguments);
        _WidgetElement_instances.add(this);
        _WidgetElement_widgetClass.set(this, void 0);
        _WidgetElement_widgetParams.set(this, void 0);
    }
    createWidget() {
        const widget = __classPrivateFieldGet(this, _WidgetElement_instances, "m", _WidgetElement_instantiateWidget).call(this);
        if (__classPrivateFieldGet(this, _WidgetElement_widgetParams, "f")) {
            Object.assign(widget, __classPrivateFieldGet(this, _WidgetElement_widgetParams, "f"));
        }
        widget.requestUpdate();
        return widget;
    }
    set widgetConfig(config) {
        const widget = Widget.get(this);
        if (widget) {
            let needsUpdate = false;
            for (const key in config.widgetParams) {
                if (config.widgetParams.hasOwnProperty(key) && config.widgetParams[key] !== __classPrivateFieldGet(this, _WidgetElement_widgetParams, "f")?.[key]) {
                    needsUpdate = true;
                }
            }
            if (needsUpdate) {
                Object.assign(widget, config.widgetParams);
                widget.requestUpdate();
            }
        }
        __classPrivateFieldSet(this, _WidgetElement_widgetClass, config.widgetClass, "f");
        __classPrivateFieldSet(this, _WidgetElement_widgetParams, config.widgetParams, "f");
    }
    getWidget() {
        return Widget.get(this);
    }
    connectedCallback() {
        const widget = Widget.getOrCreateWidget(this);
        if (!widget.element.parentElement) {
            widget.markAsRoot();
        }
        widget.show(this.parentElement, undefined, /* suppressOrphanWidgetError= */ true);
    }
    appendChild(child) {
        if (child instanceof HTMLElement && child.tagName !== 'STYLE') {
            Widget.getOrCreateWidget(child).show(this);
            return child;
        }
        return super.appendChild(child);
    }
    insertBefore(child, referenceChild) {
        if (child instanceof HTMLElement && child.tagName !== 'STYLE') {
            Widget.getOrCreateWidget(child).show(this, referenceChild, true);
            return child;
        }
        return super.insertBefore(child, referenceChild);
    }
    removeChild(child) {
        const childWidget = Widget.get(child);
        if (childWidget) {
            childWidget.detach();
            return child;
        }
        return super.removeChild(child);
    }
    removeChildren() {
        for (const child of this.children) {
            const childWidget = Widget.get(child);
            if (childWidget) {
                childWidget.detach();
            }
        }
        super.removeChildren();
    }
    cloneNode(deep) {
        const clone = super.cloneNode(deep);
        if (!__classPrivateFieldGet(this, _WidgetElement_widgetClass, "f")) {
            throw new Error('No widgetClass defined');
        }
        __classPrivateFieldSet(clone, _WidgetElement_widgetClass, __classPrivateFieldGet(this, _WidgetElement_widgetClass, "f"), "f");
        __classPrivateFieldSet(clone, _WidgetElement_widgetParams, __classPrivateFieldGet(this, _WidgetElement_widgetParams, "f"), "f");
        return clone;
    }
}
_WidgetElement_widgetClass = new WeakMap(), _WidgetElement_widgetParams = new WeakMap(), _WidgetElement_instances = new WeakSet(), _WidgetElement_instantiateWidget = function _WidgetElement_instantiateWidget() {
    if (!__classPrivateFieldGet(this, _WidgetElement_widgetClass, "f")) {
        throw new Error('No widgetClass defined');
    }
    if (Widget.isPrototypeOf(__classPrivateFieldGet(this, _WidgetElement_widgetClass, "f"))) {
        const ctor = __classPrivateFieldGet(this, _WidgetElement_widgetClass, "f");
        return new ctor(this);
    }
    const factory = __classPrivateFieldGet(this, _WidgetElement_widgetClass, "f");
    return factory(this);
};
customElements.define('devtools-widget', WidgetElement);
export function widgetRef(type, callback) {
    return Lit.Directives.ref((e) => {
        if (!(e instanceof HTMLElement)) {
            return;
        }
        const widget = Widget.getOrCreateWidget(e);
        if (!(widget instanceof type)) {
            throw new Error(`Expected an element with a widget of type ${type.name} but got ${e?.constructor?.name}`);
        }
        callback(widget);
    });
}
/**
 * Wraps CSS text in a @scope at-rule to encapsulate widget styles.
 *
 * This function relies on an implicit scope root (the parent element of the
 * <style> tag) and sets an explicit scope limit at `<devtools-widget>`.
 * This prevents a parent widget's styles from cascading into any nested
 * child widgets.
 *
 * @param styles The CSS rules to be scoped.
 * @returns The scoped CSS string.
 */
export function widgetScoped(styles) {
    return `@scope to (devtools-widget) { ${styles} }`;
}
const widgetCounterMap = new WeakMap();
const widgetMap = new WeakMap();
function incrementWidgetCounter(parentElement, childElement) {
    const count = (widgetCounterMap.get(childElement) || 0) + (widgetMap.get(childElement) ? 1 : 0);
    for (let el = parentElement; el; el = el.parentElementOrShadowHost()) {
        widgetCounterMap.set(el, (widgetCounterMap.get(el) || 0) + count);
    }
}
function decrementWidgetCounter(parentElement, childElement) {
    const count = (widgetCounterMap.get(childElement) || 0) + (widgetMap.get(childElement) ? 1 : 0);
    for (let el = parentElement; el; el = el.parentElementOrShadowHost()) {
        const elCounter = widgetCounterMap.get(el);
        if (elCounter) {
            widgetCounterMap.set(el, elCounter - count);
        }
    }
}
// The resolved `updateComplete` promise, which is used as a marker for the
// Widget's `#updateComplete` private property to indicate that there's no
// pending update.
const UPDATE_COMPLETE = Promise.resolve(true);
const UPDATE_COMPLETE_RESOLVE = (_result) => { };
export class Widget {
    constructor(useShadowDom, delegatesFocus, element) {
        _Widget_instances.add(this);
        this.defaultFocusedChild = null;
        _Widget_shadowRoot.set(this, void 0);
        _Widget_visible.set(this, false);
        _Widget_isRoot.set(this, false);
        _Widget_isShowing.set(this, false);
        _Widget_children.set(this, []);
        _Widget_hideOnDetach.set(this, false);
        _Widget_notificationDepth.set(this, 0);
        _Widget_invalidationsSuspended.set(this, 0);
        _Widget_parentWidget.set(this, null);
        _Widget_defaultFocusedElement.set(this, void 0);
        _Widget_cachedConstraints.set(this, void 0);
        _Widget_constraints.set(this, void 0);
        _Widget_invalidationsRequested.set(this, void 0);
        _Widget_externallyManaged.set(this, void 0);
        _Widget_updateComplete.set(this, UPDATE_COMPLETE);
        _Widget_updateCompleteResolve.set(this, UPDATE_COMPLETE_RESOLVE);
        _Widget_updateRequestID.set(this, 0);
        this.element = element || document.createElement('div');
        __classPrivateFieldSet(this, _Widget_shadowRoot, this.element.shadowRoot, "f");
        if (useShadowDom && !__classPrivateFieldGet(this, _Widget_shadowRoot, "f")) {
            this.element.classList.add('vbox');
            this.element.classList.add('flex-auto');
            __classPrivateFieldSet(this, _Widget_shadowRoot, createShadowRootWithCoreStyles(this.element, { delegatesFocus }), "f");
            this.contentElement = document.createElement('div');
            __classPrivateFieldGet(this, _Widget_shadowRoot, "f").appendChild(this.contentElement);
        }
        else {
            this.contentElement = this.element;
        }
        this.contentElement.classList.add('widget');
        widgetMap.set(this.element, this);
    }
    /**
     * Returns the {@link Widget} whose element is the given `node`, or `undefined`
     * if the `node` is not an element for a widget.
     *
     * @param node a DOM node.
     * @returns the {@link Widget} that is attached to the `node` or `undefined`.
     */
    static get(node) {
        return widgetMap.get(node);
    }
    static getOrCreateWidget(element) {
        const widget = Widget.get(element);
        if (widget) {
            return widget;
        }
        if (element instanceof WidgetElement) {
            return element.createWidget();
        }
        return new Widget(undefined, undefined, element);
    }
    markAsRoot() {
        assert(!this.element.parentElement, 'Attempt to mark as root attached node');
        __classPrivateFieldSet(this, _Widget_isRoot, true, "f");
    }
    parentWidget() {
        return __classPrivateFieldGet(this, _Widget_parentWidget, "f");
    }
    children() {
        return __classPrivateFieldGet(this, _Widget_children, "f");
    }
    childWasDetached(_widget) {
    }
    isShowing() {
        return __classPrivateFieldGet(this, _Widget_isShowing, "f");
    }
    shouldHideOnDetach() {
        if (!this.element.parentElement) {
            return false;
        }
        if (__classPrivateFieldGet(this, _Widget_hideOnDetach, "f")) {
            return true;
        }
        for (const child of __classPrivateFieldGet(this, _Widget_children, "f")) {
            if (child.shouldHideOnDetach()) {
                return true;
            }
        }
        return false;
    }
    setHideOnDetach() {
        __classPrivateFieldSet(this, _Widget_hideOnDetach, true, "f");
    }
    inNotification() {
        return Boolean(__classPrivateFieldGet(this, _Widget_notificationDepth, "f")) || Boolean(__classPrivateFieldGet(this, _Widget_parentWidget, "f")?.inNotification());
    }
    parentIsShowing() {
        if (__classPrivateFieldGet(this, _Widget_isRoot, "f")) {
            return true;
        }
        return __classPrivateFieldGet(this, _Widget_parentWidget, "f")?.isShowing() ?? false;
    }
    callOnVisibleChildren(method) {
        const copy = __classPrivateFieldGet(this, _Widget_children, "f").slice();
        for (let i = 0; i < copy.length; ++i) {
            if (__classPrivateFieldGet(copy[i], _Widget_parentWidget, "f") === this && __classPrivateFieldGet(copy[i], _Widget_visible, "f")) {
                method.call(copy[i]);
            }
        }
    }
    processWillShow() {
        this.callOnVisibleChildren(this.processWillShow);
        __classPrivateFieldSet(this, _Widget_isShowing, true, "f");
    }
    processWasShown() {
        if (this.inNotification()) {
            return;
        }
        this.restoreScrollPositions();
        this.notify(this.wasShown);
        this.callOnVisibleChildren(this.processWasShown);
    }
    processWillHide() {
        if (this.inNotification()) {
            return;
        }
        this.storeScrollPositions();
        this.callOnVisibleChildren(this.processWillHide);
        this.notify(this.willHide);
        __classPrivateFieldSet(this, _Widget_isShowing, false, "f");
    }
    processWasHidden() {
        this.callOnVisibleChildren(this.processWasHidden);
    }
    processOnResize() {
        if (this.inNotification()) {
            return;
        }
        if (!this.isShowing()) {
            return;
        }
        this.notify(this.onResize);
        this.callOnVisibleChildren(this.processOnResize);
    }
    notify(notification) {
        var _a, _b;
        __classPrivateFieldSet(this, _Widget_notificationDepth, (_a = __classPrivateFieldGet(this, _Widget_notificationDepth, "f"), ++_a), "f");
        try {
            notification.call(this);
        }
        finally {
            __classPrivateFieldSet(this, _Widget_notificationDepth, (_b = __classPrivateFieldGet(this, _Widget_notificationDepth, "f"), --_b), "f");
        }
    }
    wasShown() {
    }
    willHide() {
    }
    onResize() {
    }
    onLayout() {
    }
    onDetach() {
    }
    async ownerViewDisposed() {
    }
    show(parentElement, insertBefore, suppressOrphanWidgetError = false) {
        assert(parentElement, 'Attempt to attach widget with no parent element');
        if (!__classPrivateFieldGet(this, _Widget_isRoot, "f")) {
            // Update widget hierarchy.
            let currentParent = parentElement;
            let currentWidget = undefined;
            while (!currentWidget) {
                if (!currentParent) {
                    if (suppressOrphanWidgetError) {
                        __classPrivateFieldSet(this, _Widget_isRoot, true, "f");
                        this.show(parentElement, insertBefore);
                        return;
                    }
                    throw new Error('Attempt to attach widget to orphan node');
                }
                currentWidget = widgetMap.get(currentParent);
                currentParent = currentParent.parentElementOrShadowHost();
            }
            this.attach(currentWidget);
        }
        this.showWidgetInternal(parentElement, insertBefore);
    }
    attach(parentWidget) {
        if (parentWidget === __classPrivateFieldGet(this, _Widget_parentWidget, "f")) {
            return;
        }
        if (__classPrivateFieldGet(this, _Widget_parentWidget, "f")) {
            this.detach();
        }
        __classPrivateFieldSet(this, _Widget_parentWidget, parentWidget, "f");
        __classPrivateFieldGet(__classPrivateFieldGet(this, _Widget_parentWidget, "f"), _Widget_children, "f").push(this);
        __classPrivateFieldSet(this, _Widget_isRoot, false, "f");
    }
    showWidget() {
        if (__classPrivateFieldGet(this, _Widget_visible, "f")) {
            return;
        }
        if (!this.element.parentElement) {
            throw new Error('Attempt to show widget that is not hidden using hideWidget().');
        }
        this.showWidgetInternal(this.element.parentElement, this.element.nextSibling);
    }
    showWidgetInternal(parentElement, insertBefore) {
        let currentParent = parentElement;
        while (currentParent && !widgetMap.get(currentParent)) {
            currentParent = currentParent.parentElementOrShadowHost();
        }
        if (__classPrivateFieldGet(this, _Widget_isRoot, "f")) {
            assert(!currentParent, 'Attempt to show root widget under another widget');
        }
        else {
            assert(currentParent && widgetMap.get(currentParent) === __classPrivateFieldGet(this, _Widget_parentWidget, "f"), 'Attempt to show under node belonging to alien widget');
        }
        const wasVisible = __classPrivateFieldGet(this, _Widget_visible, "f");
        if (wasVisible && this.element.parentElement === parentElement) {
            return;
        }
        __classPrivateFieldSet(this, _Widget_visible, true, "f");
        if (!wasVisible && this.parentIsShowing()) {
            this.processWillShow();
        }
        this.element.classList.remove('hidden');
        // Reparent
        if (this.element.parentElement !== parentElement) {
            if (!__classPrivateFieldGet(this, _Widget_externallyManaged, "f")) {
                incrementWidgetCounter(parentElement, this.element);
            }
            if (insertBefore) {
                originalInsertBefore.call(parentElement, this.element, insertBefore);
            }
            else {
                originalAppendChild.call(parentElement, this.element);
            }
        }
        if (!wasVisible && this.parentIsShowing()) {
            this.processWasShown();
        }
        if (__classPrivateFieldGet(this, _Widget_parentWidget, "f") && this.hasNonZeroConstraints()) {
            __classPrivateFieldGet(this, _Widget_parentWidget, "f").invalidateConstraints();
        }
        else {
            this.processOnResize();
        }
    }
    hideWidget() {
        if (!__classPrivateFieldGet(this, _Widget_visible, "f")) {
            return;
        }
        this.hideWidgetInternal(false);
    }
    hideWidgetInternal(removeFromDOM) {
        __classPrivateFieldSet(this, _Widget_visible, false, "f");
        const { parentElement } = this.element;
        if (this.parentIsShowing()) {
            this.processWillHide();
        }
        if (removeFromDOM) {
            if (parentElement) {
                // Force legal removal
                decrementWidgetCounter(parentElement, this.element);
                originalRemoveChild.call(parentElement, this.element);
            }
            this.onDetach();
        }
        else {
            this.element.classList.add('hidden');
        }
        if (this.parentIsShowing()) {
            this.processWasHidden();
        }
        if (__classPrivateFieldGet(this, _Widget_parentWidget, "f") && this.hasNonZeroConstraints()) {
            __classPrivateFieldGet(this, _Widget_parentWidget, "f").invalidateConstraints();
        }
    }
    detach(overrideHideOnDetach) {
        if (!__classPrivateFieldGet(this, _Widget_parentWidget, "f") && !__classPrivateFieldGet(this, _Widget_isRoot, "f")) {
            return;
        }
        // Cancel any pending update.
        if (__classPrivateFieldGet(this, _Widget_updateRequestID, "f") !== 0) {
            cancelAnimationFrame(__classPrivateFieldGet(this, _Widget_updateRequestID, "f"));
            __classPrivateFieldGet(this, _Widget_updateCompleteResolve, "f").call(this, true);
            __classPrivateFieldSet(this, _Widget_updateCompleteResolve, UPDATE_COMPLETE_RESOLVE, "f");
            __classPrivateFieldSet(this, _Widget_updateComplete, UPDATE_COMPLETE, "f");
            __classPrivateFieldSet(this, _Widget_updateRequestID, 0, "f");
        }
        // hideOnDetach means that we should never remove element from dom - content
        // has iframes and detaching it will hurt.
        //
        // overrideHideOnDetach will override hideOnDetach and the client takes
        // responsibility for the consequences.
        const removeFromDOM = overrideHideOnDetach || !this.shouldHideOnDetach();
        if (__classPrivateFieldGet(this, _Widget_visible, "f")) {
            this.hideWidgetInternal(removeFromDOM);
        }
        else if (removeFromDOM) {
            const { parentElement } = this.element;
            if (parentElement) {
                // Force kick out from DOM.
                decrementWidgetCounter(parentElement, this.element);
                originalRemoveChild.call(parentElement, this.element);
            }
        }
        // Update widget hierarchy.
        if (__classPrivateFieldGet(this, _Widget_parentWidget, "f")) {
            const childIndex = __classPrivateFieldGet(__classPrivateFieldGet(this, _Widget_parentWidget, "f"), _Widget_children, "f").indexOf(this);
            assert(childIndex >= 0, 'Attempt to remove non-child widget');
            __classPrivateFieldGet(__classPrivateFieldGet(this, _Widget_parentWidget, "f"), _Widget_children, "f").splice(childIndex, 1);
            if (__classPrivateFieldGet(this, _Widget_parentWidget, "f").defaultFocusedChild === this) {
                __classPrivateFieldGet(this, _Widget_parentWidget, "f").defaultFocusedChild = null;
            }
            __classPrivateFieldGet(this, _Widget_parentWidget, "f").childWasDetached(this);
            __classPrivateFieldSet(this, _Widget_parentWidget, null, "f");
        }
        else {
            assert(__classPrivateFieldGet(this, _Widget_isRoot, "f"), 'Removing non-root widget from DOM');
        }
    }
    detachChildWidgets() {
        const children = __classPrivateFieldGet(this, _Widget_children, "f").slice();
        for (let i = 0; i < children.length; ++i) {
            children[i].detach();
        }
    }
    elementsToRestoreScrollPositionsFor() {
        return [this.element];
    }
    storeScrollPositions() {
        const elements = this.elementsToRestoreScrollPositionsFor();
        for (const container of elements) {
            storedScrollPositions.set(container, { scrollLeft: container.scrollLeft, scrollTop: container.scrollTop });
        }
    }
    restoreScrollPositions() {
        const elements = this.elementsToRestoreScrollPositionsFor();
        for (const container of elements) {
            const storedPositions = storedScrollPositions.get(container);
            if (storedPositions) {
                container.scrollLeft = storedPositions.scrollLeft;
                container.scrollTop = storedPositions.scrollTop;
            }
        }
    }
    doResize() {
        if (!this.isShowing()) {
            return;
        }
        // No matter what notification we are in, dispatching onResize is not needed.
        if (!this.inNotification()) {
            this.callOnVisibleChildren(this.processOnResize);
        }
    }
    doLayout() {
        if (!this.isShowing()) {
            return;
        }
        this.notify(this.onLayout);
        this.doResize();
    }
    registerRequiredCSS(...cssFiles) {
        for (const cssFile of cssFiles) {
            Platform.DOMUtilities.appendStyle(__classPrivateFieldGet(this, _Widget_shadowRoot, "f") ?? this.element, cssFile);
        }
    }
    // Unused, but useful for debugging.
    printWidgetHierarchy() {
        const lines = [];
        this.collectWidgetHierarchy('', lines);
        console.log(lines.join('\n')); // eslint-disable-line no-console
    }
    collectWidgetHierarchy(prefix, lines) {
        lines.push(prefix + '[' + this.element.className + ']' + (__classPrivateFieldGet(this, _Widget_children, "f").length ? ' {' : ''));
        for (let i = 0; i < __classPrivateFieldGet(this, _Widget_children, "f").length; ++i) {
            __classPrivateFieldGet(this, _Widget_children, "f")[i].collectWidgetHierarchy(prefix + '    ', lines);
        }
        if (__classPrivateFieldGet(this, _Widget_children, "f").length) {
            lines.push(prefix + '}');
        }
    }
    setDefaultFocusedElement(element) {
        __classPrivateFieldSet(this, _Widget_defaultFocusedElement, element, "f");
    }
    setDefaultFocusedChild(child) {
        assert(__classPrivateFieldGet(child, _Widget_parentWidget, "f") === this, 'Attempt to set non-child widget as default focused.');
        this.defaultFocusedChild = child;
    }
    focus() {
        if (!this.isShowing()) {
            return;
        }
        const element = __classPrivateFieldGet(this, _Widget_defaultFocusedElement, "f");
        if (element) {
            if (!element.hasFocus()) {
                element.focus();
            }
            return;
        }
        if (this.defaultFocusedChild && __classPrivateFieldGet(this.defaultFocusedChild, _Widget_visible, "f")) {
            this.defaultFocusedChild.focus();
        }
        else {
            for (const child of __classPrivateFieldGet(this, _Widget_children, "f")) {
                if (__classPrivateFieldGet(child, _Widget_visible, "f")) {
                    child.focus();
                    return;
                }
            }
            let child = this.contentElement.traverseNextNode(this.contentElement);
            while (child) {
                if (child instanceof XWidget) {
                    child.focus();
                    return;
                }
                child = child.traverseNextNode(this.contentElement);
            }
        }
    }
    hasFocus() {
        return this.element.hasFocus();
    }
    calculateConstraints() {
        return new Constraints();
    }
    constraints() {
        if (typeof __classPrivateFieldGet(this, _Widget_constraints, "f") !== 'undefined') {
            return __classPrivateFieldGet(this, _Widget_constraints, "f");
        }
        if (typeof __classPrivateFieldGet(this, _Widget_cachedConstraints, "f") === 'undefined') {
            __classPrivateFieldSet(this, _Widget_cachedConstraints, this.calculateConstraints(), "f");
        }
        return __classPrivateFieldGet(this, _Widget_cachedConstraints, "f");
    }
    setMinimumAndPreferredSizes(width, height, preferredWidth, preferredHeight) {
        __classPrivateFieldSet(this, _Widget_constraints, new Constraints(new Size(width, height), new Size(preferredWidth, preferredHeight)), "f");
        this.invalidateConstraints();
    }
    setMinimumSize(width, height) {
        this.minimumSize = new Size(width, height);
    }
    set minimumSize(size) {
        __classPrivateFieldSet(this, _Widget_constraints, new Constraints(size), "f");
        this.invalidateConstraints();
    }
    hasNonZeroConstraints() {
        const constraints = this.constraints();
        return Boolean(constraints.minimum.width || constraints.minimum.height || constraints.preferred.width ||
            constraints.preferred.height);
    }
    suspendInvalidations() {
        var _a;
        __classPrivateFieldSet(this, _Widget_invalidationsSuspended, (_a = __classPrivateFieldGet(this, _Widget_invalidationsSuspended, "f"), ++_a), "f");
    }
    resumeInvalidations() {
        var _a;
        __classPrivateFieldSet(this, _Widget_invalidationsSuspended, (_a = __classPrivateFieldGet(this, _Widget_invalidationsSuspended, "f"), --_a), "f");
        if (!__classPrivateFieldGet(this, _Widget_invalidationsSuspended, "f") && __classPrivateFieldGet(this, _Widget_invalidationsRequested, "f")) {
            this.invalidateConstraints();
        }
    }
    invalidateConstraints() {
        if (__classPrivateFieldGet(this, _Widget_invalidationsSuspended, "f")) {
            __classPrivateFieldSet(this, _Widget_invalidationsRequested, true, "f");
            return;
        }
        __classPrivateFieldSet(this, _Widget_invalidationsRequested, false, "f");
        const cached = __classPrivateFieldGet(this, _Widget_cachedConstraints, "f");
        __classPrivateFieldSet(this, _Widget_cachedConstraints, undefined, "f");
        const actual = this.constraints();
        if (!actual.isEqual(cached || null) && __classPrivateFieldGet(this, _Widget_parentWidget, "f")) {
            __classPrivateFieldGet(this, _Widget_parentWidget, "f").invalidateConstraints();
        }
        else {
            this.doLayout();
        }
    }
    // Excludes the widget from being tracked by its parents/ancestors via
    // widgetCounter because the widget is being handled by external code.
    // Widgets marked as being externally managed are responsible for
    // finishing out their own lifecycle (i.e. calling detach() before being
    // removed from the DOM). This is e.g. used for CodeMirror.
    //
    // Also note that this must be called before the widget is shown so that
    // so that its ancestor's widgetCounter is not incremented.
    markAsExternallyManaged() {
        assert(!__classPrivateFieldGet(this, _Widget_parentWidget, "f"), 'Attempt to mark widget as externally managed after insertion to the DOM');
        __classPrivateFieldSet(this, _Widget_externallyManaged, true, "f");
    }
    /**
     * Override this method in derived classes to perform the actual view update.
     *
     * This is not meant to be called directly, but invoked (indirectly) through
     * the `requestAnimationFrame` and executed with the animation frame. Instead,
     * use the `requestUpdate()` method to schedule an asynchronous update.
     *
     * @return can either return nothing or a promise; in that latter case, the
     *         update logic will await the resolution of the returned promise
     *         before proceeding.
     */
    performUpdate() {
    }
    /**
     * Schedules an asynchronous update for this widget.
     *
     * The update will be deduplicated and executed with the next animation
     * frame.
     */
    requestUpdate() {
        if (__classPrivateFieldGet(this, _Widget_updateComplete, "f") === UPDATE_COMPLETE) {
            __classPrivateFieldSet(this, _Widget_updateComplete, new Promise((resolve, reject) => {
                __classPrivateFieldSet(this, _Widget_updateCompleteResolve, resolve, "f");
                __classPrivateFieldSet(this, _Widget_updateRequestID, requestAnimationFrame(() => __classPrivateFieldGet(this, _Widget_instances, "m", _Widget_performUpdateCallback).call(this).then(resolve, reject)), "f");
            }), "f");
        }
    }
    /**
     * The `updateComplete` promise resolves when the widget has finished updating.
     *
     * Use `updateComplete` to wait for an update:
     * ```js
     * await widget.updateComplete;
     * // do stuff
     * ```
     *
     * This method is primarily useful for unit tests, to wait for widgets to build
     * their DOM. For example:
     * ```js
     * // Set up the test widget, and wait for the initial update cycle to complete.
     * const widget = new SomeWidget(someData);
     * widget.requestUpdate();
     * await widget.updateComplete;
     *
     * // Assert state of the widget.
     * assert.isTrue(widget.someDataLoaded);
     * ```
     *
     * @returns a promise that resolves to a `boolean` when the widget has finished
     *          updating, the value is `true` if there are no more pending updates,
     *          and `false` if the update cycle triggered another update.
     */
    get updateComplete() {
        return __classPrivateFieldGet(this, _Widget_updateComplete, "f");
    }
}
_Widget_shadowRoot = new WeakMap(), _Widget_visible = new WeakMap(), _Widget_isRoot = new WeakMap(), _Widget_isShowing = new WeakMap(), _Widget_children = new WeakMap(), _Widget_hideOnDetach = new WeakMap(), _Widget_notificationDepth = new WeakMap(), _Widget_invalidationsSuspended = new WeakMap(), _Widget_parentWidget = new WeakMap(), _Widget_defaultFocusedElement = new WeakMap(), _Widget_cachedConstraints = new WeakMap(), _Widget_constraints = new WeakMap(), _Widget_invalidationsRequested = new WeakMap(), _Widget_externallyManaged = new WeakMap(), _Widget_updateComplete = new WeakMap(), _Widget_updateCompleteResolve = new WeakMap(), _Widget_updateRequestID = new WeakMap(), _Widget_instances = new WeakSet(), _Widget_performUpdateCallback = async function _Widget_performUpdateCallback() {
    // Mark this update cycle as complete by assigning
    // the marker sentinel.
    __classPrivateFieldSet(this, _Widget_updateComplete, UPDATE_COMPLETE, "f");
    __classPrivateFieldSet(this, _Widget_updateCompleteResolve, UPDATE_COMPLETE_RESOLVE, "f");
    __classPrivateFieldSet(this, _Widget_updateRequestID, 0, "f");
    // Run the actual update logic.
    await this.performUpdate();
    // Resolve the `updateComplete` with `true` if no
    // new update was triggered during this cycle.
    return __classPrivateFieldGet(this, _Widget_updateComplete, "f") === UPDATE_COMPLETE;
};
const storedScrollPositions = new WeakMap();
export class VBox extends Widget {
    constructor(useShadowDom, delegatesFocus, element) {
        if (useShadowDom instanceof HTMLElement) {
            element = useShadowDom;
            useShadowDom = false;
        }
        super(useShadowDom, delegatesFocus, element);
        this.contentElement.classList.add('vbox');
    }
    calculateConstraints() {
        let constraints = new Constraints();
        function updateForChild() {
            const child = this.constraints();
            constraints = constraints.widthToMax(child);
            constraints = constraints.addHeight(child);
        }
        this.callOnVisibleChildren(updateForChild);
        return constraints;
    }
}
export class HBox extends Widget {
    constructor(useShadowDom) {
        super(useShadowDom);
        this.contentElement.classList.add('hbox');
    }
    calculateConstraints() {
        let constraints = new Constraints();
        function updateForChild() {
            const child = this.constraints();
            constraints = constraints.addWidth(child);
            constraints = constraints.heightToMax(child);
        }
        this.callOnVisibleChildren(updateForChild);
        return constraints;
    }
}
export class VBoxWithResizeCallback extends VBox {
    constructor(resizeCallback) {
        super();
        this.resizeCallback = resizeCallback;
    }
    onResize() {
        this.resizeCallback();
    }
}
export class WidgetFocusRestorer {
    constructor(widget) {
        this.widget = widget;
        this.previous = Platform.DOMUtilities.deepActiveElement(widget.element.ownerDocument);
        widget.focus();
    }
    restore() {
        if (!this.widget) {
            return;
        }
        if (this.widget.hasFocus() && this.previous) {
            this.previous.focus();
        }
        this.previous = null;
        this.widget = null;
    }
}
function domOperationError(funcName) {
    return new Error(`Attempt to modify widget with native DOM method \`${funcName}\``);
}
Element.prototype.appendChild = function (node) {
    if (widgetMap.get(node) && node.parentElement !== this) {
        throw domOperationError('appendChild');
    }
    return originalAppendChild.call(this, node);
};
Element.prototype.insertBefore = function (node, child) {
    if (widgetMap.get(node) && node.parentElement !== this) {
        throw domOperationError('insertBefore');
    }
    return originalInsertBefore.call(this, node, child);
};
Element.prototype.removeChild = function (child) {
    if (widgetCounterMap.get(child) || widgetMap.get(child)) {
        throw domOperationError('removeChild');
    }
    return originalRemoveChild.call(this, child);
};
Element.prototype.removeChildren = function () {
    if (widgetCounterMap.get(this)) {
        throw domOperationError('removeChildren');
    }
    return originalRemoveChildren.call(this);
};
//# sourceMappingURL=Widget.js.map