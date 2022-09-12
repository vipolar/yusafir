
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function action_destroyer(action_result) {
        return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function xlink_attr(node, attribute, value) {
        node.setAttributeNS('http://www.w3.org/1999/xlink', attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
        else if (callback) {
            callback();
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.50.0' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src/components/Navigationbar.svelte generated by Svelte v3.50.0 */

    const file$8 = "src/components/Navigationbar.svelte";

    function create_fragment$8(ctx) {
    	let div;
    	let img;
    	let img_src_value;
    	let t0;
    	let nav;
    	let ul;
    	let li0;
    	let a0;
    	let svg0;
    	let g1;
    	let g0;
    	let path0;
    	let path1;
    	let t1;
    	let span0;
    	let t3;
    	let li1;
    	let a1;
    	let svg1;
    	let g3;
    	let g2;
    	let path2;
    	let t4;
    	let span1;
    	let t6;
    	let li2;
    	let a2;
    	let svg2;
    	let g5;
    	let g4;
    	let path3;
    	let g7;
    	let g6;
    	let path4;
    	let g9;
    	let g8;
    	let path5;
    	let g11;
    	let g10;
    	let path6;
    	let t7;
    	let span2;
    	let t9;
    	let li3;
    	let a3;
    	let svg3;
    	let path7;
    	let t10;
    	let span3;

    	const block = {
    		c: function create() {
    			div = element("div");
    			img = element("img");
    			t0 = space();
    			nav = element("nav");
    			ul = element("ul");
    			li0 = element("li");
    			a0 = element("a");
    			svg0 = svg_element("svg");
    			g1 = svg_element("g");
    			g0 = svg_element("g");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			t1 = space();
    			span0 = element("span");
    			span0.textContent = "Home";
    			t3 = space();
    			li1 = element("li");
    			a1 = element("a");
    			svg1 = svg_element("svg");
    			g3 = svg_element("g");
    			g2 = svg_element("g");
    			path2 = svg_element("path");
    			t4 = space();
    			span1 = element("span");
    			span1.textContent = "News";
    			t6 = space();
    			li2 = element("li");
    			a2 = element("a");
    			svg2 = svg_element("svg");
    			g5 = svg_element("g");
    			g4 = svg_element("g");
    			path3 = svg_element("path");
    			g7 = svg_element("g");
    			g6 = svg_element("g");
    			path4 = svg_element("path");
    			g9 = svg_element("g");
    			g8 = svg_element("g");
    			path5 = svg_element("path");
    			g11 = svg_element("g");
    			g10 = svg_element("g");
    			path6 = svg_element("path");
    			t7 = space();
    			span2 = element("span");
    			span2.textContent = "Contact";
    			t9 = space();
    			li3 = element("li");
    			a3 = element("a");
    			svg3 = svg_element("svg");
    			path7 = svg_element("path");
    			t10 = space();
    			span3 = element("span");
    			span3.textContent = "About";
    			attr_dev(img, "alt", "logo");
    			if (!src_url_equal(img.src, img_src_value = "./static/logo.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "class", "svelte-15px6l2");
    			add_location(img, file$8, 1, 4, 25);
    			attr_dev(path0, "d", "M74.165,294.769v9.483V572.86h244.512V367.341h129.282v205.512h87.592V304.253v-9.483L304.858,122.543L74.165,294.769z\n                                    M250.74,475.699H142.388V367.341h108.358v108.358H250.74z");
    			add_location(path0, file$8, 9, 32, 466);
    			attr_dev(path1, "d", "M605.726,259.844l-69.035-45.952c0-58.911,0-127.232,0-127.232h-80.915c0,0,0,29.529,0,66.486L303.912,39.14\n                                    L6.191,259.892c-6.897,5.251-8.233,15.1-2.988,21.991c5.245,6.897,15.088,8.245,21.991,2.988l278.84-206.403l282.853,206.464\n                                    c2.824,2.122,6.129,3.141,9.41,3.141c4.763,0,9.477-2.165,12.563-6.269C614.056,274.876,612.66,265.046,605.726,259.844z");
    			add_location(path1, file$8, 11, 32, 717);
    			add_location(g0, file$8, 8, 28, 430);
    			add_location(g1, file$8, 7, 24, 398);
    			attr_dev(svg0, "version", "1.1");
    			attr_dev(svg0, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg0, "xmlns:xlink", "http://www.w3.org/1999/xlink");
    			attr_dev(svg0, "x", "0px");
    			attr_dev(svg0, "y", "0px");
    			attr_dev(svg0, "viewBox", "0 0 612 612");
    			set_style(svg0, "enable-background", "new 0 0 612 612");
    			attr_dev(svg0, "xml:space", "preserve");
    			attr_dev(svg0, "class", "svelte-15px6l2");
    			add_location(svg0, file$8, 6, 20, 174);
    			attr_dev(span0, "class", "svelte-15px6l2");
    			add_location(span0, file$8, 17, 20, 1253);
    			attr_dev(a0, "class", "active svelte-15px6l2");
    			attr_dev(a0, "href", "#home");
    			add_location(a0, file$8, 5, 16, 122);
    			attr_dev(li0, "class", "svelte-15px6l2");
    			add_location(li0, file$8, 4, 12, 101);
    			attr_dev(path2, "d", "M22,5.75 L22,20.5 C22,20.7761424 22.2238576,21 22.5,21 C22.7454599,21 22.9496084,20.8231248 22.9919443,20.5898756 L23,20.5 L23,7 L24.25,7 C25.1681734,7 25.9211923,7.70711027 25.9941988,8.60647279 L26,8.75 L26,20.75 C26,22.4830315 24.6435452,23.8992459 22.9344239,23.9948552 L22.75,24 L5.25,24 C3.51696854,24 2.10075407,22.6435452 2.00514479,20.9344239 L2,20.75 L2,5.75 C2,4.8318266 2.70711027,4.07880766 3.60647279,4.0058012 L3.75,4 L20.25,4 C21.1681734,4 21.9211923,4.70711027 21.9941988,5.60647279 L22,5.75 L22,20.5 L22,5.75 Z M9.74652744,13.0034726 L7.25,13.0034726 C6.3318266,13.0034726 5.57880766,13.7105828 5.5058012,14.6099454 L5.5,14.7534726 L5.5,17.25 C5.5,18.1681734 6.20711027,18.9211923 7.10647279,18.9941988 L7.25,19 L9.74652744,19 C10.6647008,19 11.4177198,18.2928897 11.4907262,17.3935272 L11.4965274,17.25 L11.4965274,14.7534726 C11.4965274,13.8352992 10.7894172,13.0822802 9.89005465,13.0092738 L9.74652744,13.0034726 Z M17.75,17.5 L14.25,17.5 L14.1482294,17.5068466 C13.7821539,17.556509 13.5,17.8703042 13.5,18.25 C13.5,18.6296958 13.7821539,18.943491 14.1482294,18.9931534 L14.25,19 L17.75,19 L17.8517706,18.9931534 C18.2178461,18.943491 18.5,18.6296958 18.5,18.25 C18.5,17.8703042 18.2178461,17.556509 17.8517706,17.5068466 L17.75,17.5 Z M7.25,14.5034726 L9.74652744,14.5034726 C9.86487417,14.5034726 9.96401426,14.585706 9.98992476,14.6961499 L9.99652744,14.7534726 L9.99652744,17.25 C9.99652744,17.3683467 9.91429402,17.4674868 9.80385014,17.4933973 L9.74652744,17.5 L7.25,17.5 C7.13165327,17.5 7.03251318,17.4177666 7.00660268,17.3073227 L7,17.25 L7,14.7534726 C7,14.6351258 7.08223341,14.5359857 7.19267729,14.5100752 L7.25,14.5034726 L9.74652744,14.5034726 L7.25,14.5034726 Z M17.75,13.0034726 L14.25,13.0034726 L14.1482294,13.0103192 C13.7821539,13.0599816 13.5,13.3737768 13.5,13.7534726 C13.5,14.1331683 13.7821539,14.4469635 14.1482294,14.4966259 L14.25,14.5034726 L17.75,14.5034726 L17.8517706,14.4966259 C18.2178461,14.4469635 18.5,14.1331683 18.5,13.7534726 C18.5,13.3737768 18.2178461,13.0599816 17.8517706,13.0103192 L17.75,13.0034726 Z M17.75,8.49665793 L6.25,8.49665793 L6.14822944,8.50350455 C5.78215388,8.55316697 5.5,8.86696217 5.5,9.24665793 C5.5,9.6263537 5.78215388,9.94014889 6.14822944,9.98981132 L6.25,9.99665793 L17.75,9.99665793 L17.8517706,9.98981132 C18.2178461,9.94014889 18.5,9.6263537 18.5,9.24665793 C18.5,8.86696217 18.2178461,8.55316697 17.8517706,8.50350455 L17.75,8.49665793 Z");
    			add_location(path2, file$8, 25, 32, 1641);
    			add_location(g2, file$8, 24, 28, 1605);
    			attr_dev(g3, "stroke", "none");
    			attr_dev(g3, "stroke-width", "1");
    			attr_dev(g3, "fill-rule", "evenodd");
    			add_location(g3, file$8, 23, 24, 1522);
    			attr_dev(svg1, "viewBox", "0 0 28 28");
    			attr_dev(svg1, "version", "1.1");
    			attr_dev(svg1, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg1, "xmlns:xlink", "http://www.w3.org/1999/xlink");
    			attr_dev(svg1, "class", "svelte-15px6l2");
    			add_location(svg1, file$8, 22, 20, 1380);
    			attr_dev(span1, "class", "svelte-15px6l2");
    			add_location(span1, file$8, 29, 20, 4203);
    			attr_dev(a1, "href", "#news");
    			attr_dev(a1, "class", "svelte-15px6l2");
    			add_location(a1, file$8, 21, 16, 1343);
    			attr_dev(li1, "class", "svelte-15px6l2");
    			add_location(li1, file$8, 20, 12, 1322);
    			attr_dev(path3, "d", "M508.65,115.988L363.186,261.451l141.875,141.979c4.295-7.385,6.939-15.85,6.939-24.992V133.563\n                                    C512,127.357,510.722,121.476,508.65,115.988z");
    			add_location(path3, file$8, 37, 32, 4625);
    			add_location(g4, file$8, 36, 28, 4589);
    			add_location(g5, file$8, 35, 24, 4557);
    			attr_dev(path4, "d", "M461.913,83.476H50.087c-8.327,0-16.066,2.236-22.982,5.847L245.76,307.976c6.344,6.344,17.363,6.344,23.596,0\n                                    l217.626-217.52C479.58,86.133,471.088,83.476,461.913,83.476z");
    			add_location(path4, file$8, 43, 32, 4965);
    			add_location(g6, file$8, 42, 28, 4929);
    			add_location(g7, file$8, 41, 24, 4897);
    			attr_dev(path5, "d", "M4.201,113.611C1.527,119.733,0,126.465,0,133.563v244.875c0,8.997,2.573,17.327,6.743,24.632l143.407-143.51\n                                    L4.201,113.611z");
    			add_location(path5, file$8, 49, 32, 5335);
    			add_location(g8, file$8, 48, 28, 5299);
    			add_location(g9, file$8, 47, 24, 5267);
    			attr_dev(path6, "d", "M339.478,285.159l-46.414,46.525c-19.496,19.275-51.084,19.591-70.901,0l-48.306-48.417L32.006,425.017\n                                    c5.625,2.192,11.69,3.507,18.081,3.507h411.826c6.235,0,12.146-1.284,17.657-3.376L339.478,285.159z");
    			add_location(path6, file$8, 55, 32, 5659);
    			add_location(g10, file$8, 54, 28, 5623);
    			add_location(g11, file$8, 53, 24, 5591);
    			attr_dev(svg2, "version", "1.1");
    			attr_dev(svg2, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg2, "xmlns:xlink", "http://www.w3.org/1999/xlink");
    			attr_dev(svg2, "x", "0px");
    			attr_dev(svg2, "y", "0px");
    			attr_dev(svg2, "viewBox", "0 0 512 512");
    			set_style(svg2, "enable-background", "new 0 0 512 512");
    			attr_dev(svg2, "xml:space", "preserve");
    			attr_dev(svg2, "class", "svelte-15px6l2");
    			add_location(svg2, file$8, 34, 20, 4333);
    			attr_dev(span2, "class", "svelte-15px6l2");
    			add_location(span2, file$8, 60, 20, 6013);
    			attr_dev(a2, "href", "#contact");
    			attr_dev(a2, "class", "svelte-15px6l2");
    			add_location(a2, file$8, 33, 16, 4293);
    			attr_dev(li2, "class", "svelte-15px6l2");
    			add_location(li2, file$8, 32, 12, 4272);
    			attr_dev(path7, "d", "M21 2H6a2 2 0 0 0-2 2v3H2v2h2v2H2v2h2v2H2v2h2v3a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1zm-8 2.999c1.648 0 3 1.351 3 3A3.012 3.012 0 0 1 13 11c-1.647 0-3-1.353-3-3.001 0-1.649 1.353-3 3-3zM19 18H7v-.75c0-2.219 2.705-4.5 6-4.5s6 2.281 6 4.5V18z");
    			add_location(path7, file$8, 66, 24, 6229);
    			attr_dev(svg3, "viewBox", "0 0 24 24");
    			attr_dev(svg3, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg3, "class", "svelte-15px6l2");
    			add_location(svg3, file$8, 65, 20, 6144);
    			attr_dev(span3, "class", "svelte-15px6l2");
    			add_location(span3, file$8, 68, 20, 6538);
    			attr_dev(a3, "href", "#about");
    			attr_dev(a3, "class", "svelte-15px6l2");
    			add_location(a3, file$8, 64, 16, 6106);
    			attr_dev(li3, "class", "svelte-15px6l2");
    			add_location(li3, file$8, 63, 12, 6085);
    			attr_dev(ul, "class", "svelte-15px6l2");
    			add_location(ul, file$8, 3, 8, 84);
    			attr_dev(nav, "class", "svelte-15px6l2");
    			add_location(nav, file$8, 2, 4, 70);
    			attr_dev(div, "class", "banner svelte-15px6l2");
    			add_location(div, file$8, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, img);
    			append_dev(div, t0);
    			append_dev(div, nav);
    			append_dev(nav, ul);
    			append_dev(ul, li0);
    			append_dev(li0, a0);
    			append_dev(a0, svg0);
    			append_dev(svg0, g1);
    			append_dev(g1, g0);
    			append_dev(g0, path0);
    			append_dev(g0, path1);
    			append_dev(a0, t1);
    			append_dev(a0, span0);
    			append_dev(ul, t3);
    			append_dev(ul, li1);
    			append_dev(li1, a1);
    			append_dev(a1, svg1);
    			append_dev(svg1, g3);
    			append_dev(g3, g2);
    			append_dev(g2, path2);
    			append_dev(a1, t4);
    			append_dev(a1, span1);
    			append_dev(ul, t6);
    			append_dev(ul, li2);
    			append_dev(li2, a2);
    			append_dev(a2, svg2);
    			append_dev(svg2, g5);
    			append_dev(g5, g4);
    			append_dev(g4, path3);
    			append_dev(svg2, g7);
    			append_dev(g7, g6);
    			append_dev(g6, path4);
    			append_dev(svg2, g9);
    			append_dev(g9, g8);
    			append_dev(g8, path5);
    			append_dev(svg2, g11);
    			append_dev(g11, g10);
    			append_dev(g10, path6);
    			append_dev(a2, t7);
    			append_dev(a2, span2);
    			append_dev(ul, t9);
    			append_dev(ul, li3);
    			append_dev(li3, a3);
    			append_dev(a3, svg3);
    			append_dev(svg3, path7);
    			append_dev(a3, t10);
    			append_dev(a3, span3);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Navigationbar', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Navigationbar> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Navigationbar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Navigationbar",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    var EntriesJSON$1 = [
    	{
    		title: "Don't miss this deal!",
    		desc: "Travel to Tbilisi at great price!",
    		date: "22.08.2022",
    		link: "#news1",
    		thumb: "./static/newsImages/thumb1.jpg"
    	},
    	{
    		title: "News!",
    		desc: "New tourist destinations added!",
    		date: "12.09.2022",
    		link: "#news2",
    		thumb: "./static/newsImages/thumb2.jpg"
    	},
    	{
    		title: "Change!",
    		desc: "Due to change in regulations traveling to Georgia has been made even easier! Due to change in regulations traveling to Georgia has been made even easier!",
    		date: "04.10.2022",
    		link: "#news3",
    		thumb: "./static/newsImages/thumb3.jpg"
    	},
    	{
    		title: "Deal!",
    		desc: "Travel to Kutaisi at great price!",
    		date: "28.06.2022",
    		link: "#news4",
    		thumb: "./static/newsImages/thumb4.jpg"
    	},
    	{
    		title: "Deal!",
    		desc: "Travel to Tbilisi at great price!",
    		date: "22.08.2022",
    		link: "#news5",
    		thumb: "./static/newsImages/thumb5.jpg"
    	},
    	{
    		title: "Deal!",
    		desc: "Travel to Kutaisi at great price!",
    		date: "28.06.2022",
    		link: "#news6",
    		thumb: "./static/newsImages/thumb6.jpg"
    	},
    	{
    		title: "Deal!",
    		desc: "Travel to Kutaisi at great price!",
    		date: "28.06.2022",
    		link: "#news7",
    		thumb: "./static/newsImages/thumb7.jpg"
    	},
    	{
    		title: "Deal!",
    		desc: "Travel to Kutaisi at great price!",
    		date: "28.06.2022",
    		link: "#news8",
    		thumb: "./static/newsImages/thumb8.jpg"
    	}
    ];

    /* src/components/Newsbar.svelte generated by Svelte v3.50.0 */
    const file$7 = "src/components/Newsbar.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    // (71:12) {#each EntryList as liEntry}
    function create_each_block$1(ctx) {
    	let li;
    	let a1;
    	let img;
    	let img_src_value;
    	let t0;
    	let div;
    	let h4;
    	let t1_value = /*liEntry*/ ctx[1].date + "";
    	let t1;
    	let t2;
    	let h3;
    	let t3_value = /*liEntry*/ ctx[1].title + "";
    	let t3;
    	let t4;
    	let h5;
    	let t5_value = /*liEntry*/ ctx[1].desc + "";
    	let t5;
    	let t6;
    	let h6;
    	let a0;
    	let t7;
    	let t8;

    	const block = {
    		c: function create() {
    			li = element("li");
    			a1 = element("a");
    			img = element("img");
    			t0 = space();
    			div = element("div");
    			h4 = element("h4");
    			t1 = text(t1_value);
    			t2 = space();
    			h3 = element("h3");
    			t3 = text(t3_value);
    			t4 = space();
    			h5 = element("h5");
    			t5 = text(t5_value);
    			t6 = space();
    			h6 = element("h6");
    			a0 = element("a");
    			t7 = text("Learn more...");
    			t8 = space();
    			attr_dev(img, "alt", /*liEntry*/ ctx[1].title);
    			if (!src_url_equal(img.src, img_src_value = /*liEntry*/ ctx[1].thumb)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "class", "svelte-sq5zrn");
    			add_location(img, file$7, 73, 24, 2161);
    			attr_dev(h4, "class", "svelte-sq5zrn");
    			add_location(h4, file$7, 75, 28, 2265);
    			attr_dev(h3, "class", "svelte-sq5zrn");
    			add_location(h3, file$7, 76, 28, 2317);
    			attr_dev(h5, "class", "svelte-sq5zrn");
    			add_location(h5, file$7, 77, 28, 2370);
    			attr_dev(a0, "href", /*liEntry*/ ctx[1].link);
    			add_location(a0, file$7, 78, 32, 2426);
    			attr_dev(h6, "class", "svelte-sq5zrn");
    			add_location(h6, file$7, 78, 28, 2422);
    			attr_dev(div, "class", "svelte-sq5zrn");
    			add_location(div, file$7, 74, 24, 2231);
    			attr_dev(a1, "draggable", "false");
    			attr_dev(a1, "href", /*liEntry*/ ctx[1].link);
    			attr_dev(a1, "class", "svelte-sq5zrn");
    			add_location(a1, file$7, 72, 20, 2095);
    			attr_dev(li, "class", "svelte-sq5zrn");
    			add_location(li, file$7, 71, 16, 2070);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, a1);
    			append_dev(a1, img);
    			append_dev(a1, t0);
    			append_dev(a1, div);
    			append_dev(div, h4);
    			append_dev(h4, t1);
    			append_dev(div, t2);
    			append_dev(div, h3);
    			append_dev(h3, t3);
    			append_dev(div, t4);
    			append_dev(div, h5);
    			append_dev(h5, t5);
    			append_dev(div, t6);
    			append_dev(div, h6);
    			append_dev(h6, a0);
    			append_dev(a0, t7);
    			append_dev(li, t8);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(71:12) {#each EntryList as liEntry}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let div2;
    	let h4;
    	let t1;
    	let section;
    	let ul;
    	let t2;
    	let div0;
    	let svg0;
    	let path0;
    	let t3;
    	let div1;
    	let svg1;
    	let path1;
    	let mounted;
    	let dispose;
    	let each_value = /*EntryList*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			h4 = element("h4");
    			h4.textContent = "News from TravelToGeorgia";
    			t1 = space();
    			section = element("section");
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t2 = space();
    			div0 = element("div");
    			svg0 = svg_element("svg");
    			path0 = svg_element("path");
    			t3 = space();
    			div1 = element("div");
    			svg1 = svg_element("svg");
    			path1 = svg_element("path");
    			attr_dev(h4, "id", "header");
    			attr_dev(h4, "class", "svelte-sq5zrn");
    			add_location(h4, file$7, 67, 4, 1896);
    			attr_dev(ul, "id", "newslist");
    			attr_dev(ul, "class", "svelte-sq5zrn");
    			add_location(ul, file$7, 69, 8, 1965);
    			attr_dev(path0, "d", "M297.2,478l20.7-21.6L108.7,256L317.9,55.6L297.2,34L65.5,256L297.2,478z M194.1,256L425.8,34l20.7,21.6L237.3,256  l209.2,200.4L425.8,478L194.1,256z");
    			add_location(path0, file$7, 86, 16, 2796);
    			attr_dev(svg0, "viewBox", "0 0 512 512");
    			attr_dev(svg0, "xml:space", "preserve");
    			attr_dev(svg0, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg0, "xmlns:xlink", "http://www.w3.org/1999/xlink");
    			attr_dev(svg0, "class", "svelte-sq5zrn");
    			add_location(svg0, file$7, 85, 12, 2653);
    			attr_dev(div0, "id", "leftscroll");
    			attr_dev(div0, "class", "svelte-sq5zrn");
    			add_location(div0, file$7, 84, 8, 2592);
    			attr_dev(path1, "d", "M214.78,478l-20.67-21.57L403.27,256,194.11,55.57,214.78,34,446.46,256ZM317.89,256,86.22,34,65.54,55.57,274.7,256,65.54,456.43,86.22,478Z");
    			add_location(path1, file$7, 91, 16, 3202);
    			attr_dev(svg1, "viewBox", "0 0 512 512");
    			attr_dev(svg1, "xml:space", "preserve");
    			attr_dev(svg1, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg1, "xmlns:xlink", "http://www.w3.org/1999/xlink");
    			attr_dev(svg1, "class", "svelte-sq5zrn");
    			add_location(svg1, file$7, 90, 12, 3059);
    			attr_dev(div1, "id", "rightscroll");
    			attr_dev(div1, "class", "svelte-sq5zrn");
    			add_location(div1, file$7, 89, 8, 2996);
    			attr_dev(section, "class", "svelte-sq5zrn");
    			add_location(section, file$7, 68, 4, 1947);
    			attr_dev(div2, "id", "newsbar");
    			attr_dev(div2, "class", "svelte-sq5zrn");
    			add_location(div2, file$7, 66, 0, 1873);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, h4);
    			append_dev(div2, t1);
    			append_dev(div2, section);
    			append_dev(section, ul);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}

    			append_dev(section, t2);
    			append_dev(section, div0);
    			append_dev(div0, svg0);
    			append_dev(svg0, path0);
    			append_dev(section, t3);
    			append_dev(section, div1);
    			append_dev(div1, svg1);
    			append_dev(svg1, path1);

    			if (!mounted) {
    				dispose = [
    					listen_dev(ul, "scroll", handleNewsScroll, false, false, false),
    					listen_dev(div0, "click", handleClickLeft, false, false, false),
    					listen_dev(div1, "click", handleClickRight, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*EntryList*/ 1) {
    				each_value = /*EntryList*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function handleNewsScroll() {
    	const eList = document.getElementById("newslist");
    	const leftScroll = document.getElementById("leftscroll");
    	const rightScroll = document.getElementById("rightscroll");
    	if (eList.scrollLeft === 0) leftScroll.style.display = "none"; else leftScroll.style.display = "inline-block";
    	if (eList.scrollLeft === eList.scrollLeftMax) rightScroll.style.display = "none"; else rightScroll.style.display = "inline-block";
    }

    function handleClickLeft() {
    	const eList = document.getElementById("newslist");
    	const eListPos = eList.scrollLeft;
    	let scrollvar = 0;
    	if (eListPos % 252 !== 0) scrollvar = eListPos - eListPos % 252; else scrollvar = eListPos - 252;

    	if ('scrollBehavior' in eList.style) eList.scroll({
    		behavior: 'smooth',
    		left: scrollvar,
    		top: 0
    	}); else eList.scroll(scrollvar, 0);
    }

    function handleClickRight() {
    	const eList = document.getElementById("newslist");
    	const eListPos = eList.scrollLeft;
    	let scrollvar = 0;
    	if (eListPos % 252 !== 0) scrollvar = eListPos + (252 - eListPos % 252); else scrollvar = eListPos + 252;

    	if ('scrollBehavior' in eList.style) eList.scroll({
    		behavior: 'smooth',
    		left: scrollvar,
    		top: 0
    	}); else eList.scroll(scrollvar, 0);
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Newsbar', slots, []);
    	let EntryList = EntriesJSON$1;

    	onMount(() => {
    		handleNewsScroll();
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Newsbar> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		EntriesJSON: EntriesJSON$1,
    		onMount,
    		EntryList,
    		handleNewsScroll,
    		handleClickLeft,
    		handleClickRight
    	});

    	$$self.$inject_state = $$props => {
    		if ('EntryList' in $$props) $$invalidate(0, EntryList = $$props.EntryList);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [EntryList];
    }

    class Newsbar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Newsbar",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    var EntriesJSON = [
    	{
    		title: "Adventure in Svaneti!",
    		author: "Khatia Maghradze",
    		date: "22.09.2022",
    		link: "#post1",
    		authlink: "#author1",
    		authimg: "./static/authImages/auth1.jpg",
    		authcover: "./static/authImages/cover1.jpg",
    		thumb: "./static/postImages/thumb1.jpg"
    	},
    	{
    		title: "Celebration of 'Mariamoba' in Tbilisi",
    		author: "Khatia Maghradze",
    		date: "01.09.2022",
    		link: "#post2",
    		authlink: "#author1",
    		authimg: "./static/authImages/auth1.jpg",
    		authcover: "./static/authImages/cover1.jpg",
    		thumb: "./static/postImages/thumb2.jpg"
    	},
    	{
    		title: "On the 'Wine Road!' Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum luctus augue sit amet iaculis vulputate. Donec finibus varius egestas. Mauris pulvinar lectus id gravida tempus.",
    		author: "Khatia Maghradze",
    		date: "30.09.2022",
    		link: "#post3",
    		authlink: "#author1",
    		authimg: "./static/authImages/auth1.jpg",
    		authcover: "./static/authImages/cover1.jpg",
    		thumb: "./static/postImages/thumb3.jpg"
    	},
    	{
    		title: "Winter in Georgia",
    		author: "Khatia Maghradze",
    		date: "01.11.2022",
    		link: "#post4",
    		authlink: "#author1",
    		authimg: "./static/authImages/auth1.jpg",
    		authcover: "./static/authImages/cover1.jpg",
    		thumb: "./static/postImages/thumb4.jpg"
    	},
    	{
    		title: "On the road Khevsureti!",
    		author: "Khatia Maghradze",
    		date: "19.07.2022",
    		link: "#post5",
    		authlink: "#author1",
    		authimg: "./static/authImages/auth1.jpg",
    		authcover: "./static/authImages/cover1.jpg",
    		thumb: "./static/postImages/thumb5.jpg"
    	},
    	{
    		title: "Arriving to Georgia for the first time!",
    		author: "Khatia Maghradze",
    		date: "21.08.2022",
    		link: "#post6",
    		authlink: "#author1",
    		authimg: "./static/authImages/auth1.jpg",
    		authcover: "./static/authImages/cover1.jpg",
    		thumb: "./static/postImages/thumb6.jpg"
    	},
    	{
    		title: "Discovering the Georgian cuisine!",
    		author: "Khatia Maghradze",
    		date: "22.09.2022",
    		link: "#post7",
    		authlink: "#author1",
    		authimg: "./static/authImages/auth1.jpg",
    		authcover: "./static/authImages/cover1.jpg",
    		thumb: "./static/postImages/thumb7.jpg"
    	},
    	{
    		title: "Fun on the road to Khashuri!",
    		author: "Khatia Maghradze",
    		date: "31.02.2022",
    		link: "#post8",
    		authlink: "#author1",
    		authimg: "./static/authImages/auth1.jpg",
    		authcover: "./static/authImages/cover1.jpg",
    		thumb: "./static/postImages/thumb8.jpg"
    	}
    ];

    /**
     * Svelte action that dispatches a custom stuck event when a node becomes stuck or unstuck (position: sticky is having an effect)
     * @param node  - the node the action is placed on
     * @param params.callback - function to execute when the node becomes stuck or unstuck
     */
     function sticky(node, { stickToTop }) {
        const intersectionCallback = function (entries) {
            // only observing one item at a time
            const entry = entries[0];

            let isStuck = false;
            if (!entry.isIntersecting && isValidYPosition(entry)) {
                isStuck = true;
            }

            node.dispatchEvent(new CustomEvent('stuck', {
                detail: { isStuck }
            }));
        };

        const isValidYPosition = function ({ target, boundingClientRect }) {
            if (target === stickySentinelTop) {
                return boundingClientRect.y < 0;
            } else {
                return boundingClientRect.y > 0;
            }
        };

        const mutationCallback = function (mutations) {
            // If something changes and the sentinel nodes are no longer first and last child, put them back in position
            mutations.forEach(function (mutation) {
                const { parentNode: topParent } = stickySentinelTop;
                const { parentNode: bottomParent } = stickySentinelBottom;

                if (stickySentinelTop !== topParent.firstChild) {
                    topParent.prepend(stickySentinelTop);
                }
                if (stickySentinelBottom !== bottomParent.lastChild) {
                    bottomParent.append(stickySentinelBottom);
                }
            });
        };

        const intersectionObserver = new IntersectionObserver(
            intersectionCallback,
            {}
        );
        const mutationObserver = new MutationObserver(mutationCallback);

        // we insert and observe a sentinel node immediately after the target
        // when it is visible, the target node cannot be sticking
    		const sentinelStyle = 'position: absolute; height: 1px;';
        const stickySentinelTop = document.createElement('div');
        stickySentinelTop.classList.add('stickySentinelTop');
    	  // without setting a height, Safari breaks
    	  stickySentinelTop.style = sentinelStyle;
        node.parentNode.prepend(stickySentinelTop);

        const stickySentinelBottom = document.createElement('div');
        stickySentinelBottom.classList.add('stickySentinelBottom');
    	  stickySentinelBottom.style = sentinelStyle;
        node.parentNode.append(stickySentinelBottom);

        if (stickToTop) {
            intersectionObserver.observe(stickySentinelTop);
        } else {
            intersectionObserver.observe(stickySentinelBottom);
        }

        mutationObserver.observe(node.parentNode, { childList: true });

        return {
            update({ stickToTop }) {
                // change which sentinel we are observing
                if (stickToTop) {
                    intersectionObserver.unobserve(stickySentinelBottom);
                    intersectionObserver.observe(stickySentinelTop);
                } else {
                    intersectionObserver.unobserve(stickySentinelTop);
                    intersectionObserver.observe(stickySentinelBottom);
                }
            },

            destroy() {
                intersectionObserver.disconnect();
                mutationObserver.disconnect();
            }
        };
    }

    /* src/components/Stick.svelte generated by Svelte v3.50.0 */

    const { console: console_1, window: window_1 } = globals;
    const file$6 = "src/components/Stick.svelte";

    function create_fragment$6(ctx) {
    	let div2;
    	let div0;
    	let t1;
    	let a0;
    	let svg0;
    	let defs;
    	let path0;
    	let linearGradient0;
    	let stop0;
    	let stop1;
    	let use;
    	let g0;
    	let path1;
    	let t2;
    	let span0;
    	let t4;
    	let a1;
    	let svg1;
    	let g1;
    	let linearGradient1;
    	let stop2;
    	let stop3;
    	let stop4;
    	let stop5;
    	let path2;
    	let linearGradient2;
    	let stop6;
    	let stop7;
    	let stop8;
    	let stop9;
    	let path3;
    	let linearGradient3;
    	let stop10;
    	let stop11;
    	let stop12;
    	let stop13;
    	let circle0;
    	let t5;
    	let span1;
    	let t7;
    	let a2;
    	let svg2;
    	let circle1;
    	let path4;
    	let path5;
    	let path6;
    	let t8;
    	let span2;
    	let t10;
    	let a3;
    	let svg3;
    	let path7;
    	let t11;
    	let span3;
    	let t13;
    	let a4;
    	let svg4;
    	let path8;
    	let g3;
    	let g2;
    	let rect0;
    	let rect1;
    	let polygon;
    	let t14;
    	let span4;
    	let t16;
    	let div1;
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			div0.textContent = "Contact us";
    			t1 = space();
    			a0 = element("a");
    			svg0 = svg_element("svg");
    			defs = svg_element("defs");
    			path0 = svg_element("path");
    			linearGradient0 = svg_element("linearGradient");
    			stop0 = svg_element("stop");
    			stop1 = svg_element("stop");
    			use = svg_element("use");
    			g0 = svg_element("g");
    			path1 = svg_element("path");
    			t2 = space();
    			span0 = element("span");
    			span0.textContent = "Whatsapp";
    			t4 = space();
    			a1 = element("a");
    			svg1 = svg_element("svg");
    			g1 = svg_element("g");
    			linearGradient1 = svg_element("linearGradient");
    			stop2 = svg_element("stop");
    			stop3 = svg_element("stop");
    			stop4 = svg_element("stop");
    			stop5 = svg_element("stop");
    			path2 = svg_element("path");
    			linearGradient2 = svg_element("linearGradient");
    			stop6 = svg_element("stop");
    			stop7 = svg_element("stop");
    			stop8 = svg_element("stop");
    			stop9 = svg_element("stop");
    			path3 = svg_element("path");
    			linearGradient3 = svg_element("linearGradient");
    			stop10 = svg_element("stop");
    			stop11 = svg_element("stop");
    			stop12 = svg_element("stop");
    			stop13 = svg_element("stop");
    			circle0 = svg_element("circle");
    			t5 = space();
    			span1 = element("span");
    			span1.textContent = "Instagram";
    			t7 = space();
    			a2 = element("a");
    			svg2 = svg_element("svg");
    			circle1 = svg_element("circle");
    			path4 = svg_element("path");
    			path5 = svg_element("path");
    			path6 = svg_element("path");
    			t8 = space();
    			span2 = element("span");
    			span2.textContent = "Facebook";
    			t10 = space();
    			a3 = element("a");
    			svg3 = svg_element("svg");
    			path7 = svg_element("path");
    			t11 = space();
    			span3 = element("span");
    			span3.textContent = "Twitter";
    			t13 = space();
    			a4 = element("a");
    			svg4 = svg_element("svg");
    			path8 = svg_element("path");
    			g3 = svg_element("g");
    			g2 = svg_element("g");
    			rect0 = svg_element("rect");
    			rect1 = svg_element("rect");
    			polygon = svg_element("polygon");
    			t14 = space();
    			span4 = element("span");
    			span4.textContent = "eMail";
    			t16 = space();
    			div1 = element("div");
    			button = element("button");
    			button.textContent = "Back to top";
    			attr_dev(div0, "class", "socialsheader svelte-14ra6vj");
    			add_location(div0, file$6, 30, 4, 765);
    			attr_dev(path0, "id", "a");
    			attr_dev(path0, "d", "M1023.941 765.153c0 5.606-.171 17.766-.508 27.159-.824 22.982-2.646 52.639-5.401 66.151-4.141 20.306-10.392 39.472-18.542 55.425-9.643 18.871-21.943 35.775-36.559 50.364-14.584 14.56-31.472 26.812-50.315 36.416-16.036 8.172-35.322 14.426-55.744 18.549-13.378 2.701-42.812 4.488-65.648 5.3-9.402.336-21.564.505-27.15.505l-504.226-.081c-5.607 0-17.765-.172-27.158-.509-22.983-.824-52.639-2.646-66.152-5.4-20.306-4.142-39.473-10.392-55.425-18.542-18.872-9.644-35.775-21.944-50.364-36.56-14.56-14.584-26.812-31.471-36.415-50.314-8.174-16.037-14.428-35.323-18.551-55.744-2.7-13.378-4.487-42.812-5.3-65.649-.334-9.401-.503-21.563-.503-27.148l.08-504.228c0-5.607.171-17.766.508-27.159.825-22.983 2.646-52.639 5.401-66.151 4.141-20.306 10.391-39.473 18.542-55.426C34.154 93.24 46.455 76.336 61.07 61.747c14.584-14.559 31.472-26.812 50.315-36.416 16.037-8.172 35.324-14.426 55.745-18.549 13.377-2.701 42.812-4.488 65.648-5.3 9.402-.335 21.565-.504 27.149-.504l504.227.081c5.608 0 17.766.171 27.159.508 22.983.825 52.638 2.646 66.152 5.401 20.305 4.141 39.472 10.391 55.425 18.542 18.871 9.643 35.774 21.944 50.363 36.559 14.559 14.584 26.812 31.471 36.415 50.315 8.174 16.037 14.428 35.323 18.551 55.744 2.7 13.378 4.486 42.812 5.3 65.649.335 9.402.504 21.564.504 27.15l-.082 504.226z");
    			add_location(path0, file$6, 34, 16, 1036);
    			add_location(defs, file$6, 33, 12, 1013);
    			attr_dev(stop0, "offset", "0");
    			attr_dev(stop0, "stop-color", "#61fd7d");
    			add_location(stop0, file$6, 37, 16, 2484);
    			attr_dev(stop1, "offset", "1");
    			attr_dev(stop1, "stop-color", "#2bb826");
    			add_location(stop1, file$6, 38, 16, 2540);
    			attr_dev(linearGradient0, "id", "b");
    			attr_dev(linearGradient0, "gradientUnits", "userSpaceOnUse");
    			attr_dev(linearGradient0, "x1", "512.001");
    			attr_dev(linearGradient0, "y1", ".978");
    			attr_dev(linearGradient0, "x2", "512.001");
    			attr_dev(linearGradient0, "y2", "1025.023");
    			add_location(linearGradient0, file$6, 36, 12, 2363);
    			xlink_attr(use, "xlink:href", "#a");
    			attr_dev(use, "overflow", "visible");
    			attr_dev(use, "fill", "url(#b)");
    			add_location(use, file$6, 40, 12, 2622);
    			attr_dev(path1, "fill", "#FFF");
    			attr_dev(path1, "d", "M783.302 243.246c-69.329-69.387-161.529-107.619-259.763-107.658-202.402 0-367.133 164.668-367.214 367.072-.026 64.699 16.883 127.854 49.017 183.522l-52.096 190.229 194.665-51.047c53.636 29.244 114.022 44.656 175.482 44.682h.151c202.382 0 367.128-164.688 367.21-367.094.039-98.087-38.121-190.319-107.452-259.706zM523.544 808.047h-.125c-54.767-.021-108.483-14.729-155.344-42.529l-11.146-6.612-115.517 30.293 30.834-112.592-7.259-11.544c-30.552-48.579-46.688-104.729-46.664-162.379.066-168.229 136.985-305.096 305.339-305.096 81.521.031 158.154 31.811 215.779 89.482s89.342 134.332 89.312 215.859c-.066 168.243-136.984 305.118-305.209 305.118zm167.415-228.515c-9.177-4.591-54.286-26.782-62.697-29.843-8.41-3.062-14.526-4.592-20.645 4.592-6.115 9.182-23.699 29.843-29.053 35.964-5.352 6.122-10.704 6.888-19.879 2.296-9.176-4.591-38.74-14.277-73.786-45.526-27.275-24.319-45.691-54.359-51.043-63.543-5.352-9.183-.569-14.146 4.024-18.72 4.127-4.109 9.175-10.713 13.763-16.069 4.587-5.355 6.117-9.183 9.175-15.304 3.059-6.122 1.529-11.479-.765-16.07-2.293-4.591-20.644-49.739-28.29-68.104-7.447-17.886-15.013-15.466-20.645-15.747-5.346-.266-11.469-.322-17.585-.322s-16.057 2.295-24.467 11.478-32.113 31.374-32.113 76.521c0 45.147 32.877 88.764 37.465 94.885 4.588 6.122 64.699 98.771 156.741 138.502 21.892 9.45 38.982 15.094 52.308 19.322 21.98 6.979 41.982 5.995 57.793 3.634 17.628-2.633 54.284-22.189 61.932-43.615 7.646-21.427 7.646-39.791 5.352-43.617-2.294-3.826-8.41-6.122-17.585-10.714z");
    			add_location(path1, file$6, 42, 16, 2711);
    			add_location(g0, file$6, 41, 12, 2691);
    			attr_dev(svg0, "width", "1024px");
    			attr_dev(svg0, "height", "1024px");
    			attr_dev(svg0, "viewBox", "0 0 1024 1024");
    			attr_dev(svg0, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg0, "xmlns:xlink", "http://www.w3.org/1999/xlink");
    			attr_dev(svg0, "class", "svelte-14ra6vj");
    			add_location(svg0, file$6, 32, 8, 862);
    			attr_dev(span0, "class", "svelte-14ra6vj");
    			add_location(span0, file$6, 45, 8, 4263);
    			attr_dev(a0, "class", "socialswapp svelte-14ra6vj");
    			attr_dev(a0, "href", "#whatsapp");
    			add_location(a0, file$6, 31, 4, 813);
    			attr_dev(stop2, "offset", "0");
    			set_style(stop2, "stop-color", "#E09B3D");
    			add_location(stop2, file$6, 51, 20, 4805);
    			attr_dev(stop3, "offset", "0.3");
    			set_style(stop3, "stop-color", "#C74C4D");
    			add_location(stop3, file$6, 52, 20, 4872);
    			attr_dev(stop4, "offset", "0.6");
    			set_style(stop4, "stop-color", "#C21975");
    			add_location(stop4, file$6, 53, 20, 4941);
    			attr_dev(stop5, "offset", "1");
    			set_style(stop5, "stop-color", "#7024C4");
    			add_location(stop5, file$6, 54, 20, 5010);
    			attr_dev(linearGradient1, "id", "XMLID_2_");
    			attr_dev(linearGradient1, "gradientUnits", "userSpaceOnUse");
    			attr_dev(linearGradient1, "x1", "275.517");
    			attr_dev(linearGradient1, "y1", "4.5714");
    			attr_dev(linearGradient1, "x2", "275.517");
    			attr_dev(linearGradient1, "y2", "549.7202");
    			attr_dev(linearGradient1, "gradientTransform", "matrix(1 0 0 -1 0 554)");
    			add_location(linearGradient1, file$6, 50, 20, 4628);
    			attr_dev(path2, "id", "XMLID_17_");
    			set_style(path2, "fill", "url(#XMLID_2_)");
    			attr_dev(path2, "d", "M386.878,0H164.156C73.64,0,0,73.64,0,164.156v222.722\n                    c0,90.516,73.64,164.156,164.156,164.156h222.722c90.516,0,164.156-73.64,164.156-164.156V164.156\n                    C551.033,73.64,477.393,0,386.878,0z M495.6,386.878c0,60.045-48.677,108.722-108.722,108.722H164.156\n                    c-60.045,0-108.722-48.677-108.722-108.722V164.156c0-60.046,48.677-108.722,108.722-108.722h222.722\n                    c60.045,0,108.722,48.676,108.722,108.722L495.6,386.878L495.6,386.878z");
    			add_location(path2, file$6, 56, 16, 5107);
    			attr_dev(stop6, "offset", "0");
    			set_style(stop6, "stop-color", "#E09B3D");
    			add_location(stop6, file$6, 63, 20, 5872);
    			attr_dev(stop7, "offset", "0.3");
    			set_style(stop7, "stop-color", "#C74C4D");
    			add_location(stop7, file$6, 64, 20, 5939);
    			attr_dev(stop8, "offset", "0.6");
    			set_style(stop8, "stop-color", "#C21975");
    			add_location(stop8, file$6, 65, 20, 6008);
    			attr_dev(stop9, "offset", "1");
    			set_style(stop9, "stop-color", "#7024C4");
    			add_location(stop9, file$6, 66, 20, 6077);
    			attr_dev(linearGradient2, "id", "XMLID_3_");
    			attr_dev(linearGradient2, "gradientUnits", "userSpaceOnUse");
    			attr_dev(linearGradient2, "x1", "275.517");
    			attr_dev(linearGradient2, "y1", "4.5714");
    			attr_dev(linearGradient2, "x2", "275.517");
    			attr_dev(linearGradient2, "y2", "549.7202");
    			attr_dev(linearGradient2, "gradientTransform", "matrix(1 0 0 -1 0 554)");
    			add_location(linearGradient2, file$6, 62, 20, 5695);
    			attr_dev(path3, "id", "XMLID_81_");
    			set_style(path3, "fill", "url(#XMLID_3_)");
    			attr_dev(path3, "d", "M275.517,133C196.933,133,133,196.933,133,275.516\n                    s63.933,142.517,142.517,142.517S418.034,354.1,418.034,275.516S354.101,133,275.517,133z M275.517,362.6\n                    c-48.095,0-87.083-38.988-87.083-87.083s38.989-87.083,87.083-87.083c48.095,0,87.083,38.988,87.083,87.083\n                    C362.6,323.611,323.611,362.6,275.517,362.6z");
    			add_location(path3, file$6, 68, 16, 6174);
    			attr_dev(stop10, "offset", "0");
    			set_style(stop10, "stop-color", "#E09B3D");
    			add_location(stop10, file$6, 74, 20, 6803);
    			attr_dev(stop11, "offset", "0.3");
    			set_style(stop11, "stop-color", "#C74C4D");
    			add_location(stop11, file$6, 75, 20, 6870);
    			attr_dev(stop12, "offset", "0.6");
    			set_style(stop12, "stop-color", "#C21975");
    			add_location(stop12, file$6, 76, 20, 6939);
    			attr_dev(stop13, "offset", "1");
    			set_style(stop13, "stop-color", "#7024C4");
    			add_location(stop13, file$6, 77, 20, 7008);
    			attr_dev(linearGradient3, "id", "XMLID_4_");
    			attr_dev(linearGradient3, "gradientUnits", "userSpaceOnUse");
    			attr_dev(linearGradient3, "x1", "418.306");
    			attr_dev(linearGradient3, "y1", "4.5714");
    			attr_dev(linearGradient3, "x2", "418.306");
    			attr_dev(linearGradient3, "y2", "549.7202");
    			attr_dev(linearGradient3, "gradientTransform", "matrix(1 0 0 -1 0 554)");
    			add_location(linearGradient3, file$6, 73, 20, 6626);
    			attr_dev(circle0, "id", "XMLID_83_");
    			set_style(circle0, "fill", "url(#XMLID_4_)");
    			attr_dev(circle0, "cx", "418.306");
    			attr_dev(circle0, "cy", "134.072");
    			attr_dev(circle0, "r", "34.149");
    			add_location(circle0, file$6, 79, 16, 7105);
    			attr_dev(g1, "id", "XMLID_13_");
    			add_location(g1, file$6, 49, 12, 4589);
    			attr_dev(svg1, "version", "1.1");
    			attr_dev(svg1, "id", "Layer_1");
    			attr_dev(svg1, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg1, "xmlns:xlink", "http://www.w3.org/1999/xlink");
    			attr_dev(svg1, "x", "0px");
    			attr_dev(svg1, "y", "0px");
    			attr_dev(svg1, "viewBox", "0 0 551.034 551.034");
    			set_style(svg1, "enable-background", "new 0 0 551.034 551.034");
    			attr_dev(svg1, "xml:space", "preserve");
    			attr_dev(svg1, "class", "svelte-14ra6vj");
    			add_location(svg1, file$6, 48, 8, 4348);
    			attr_dev(span1, "class", "svelte-14ra6vj");
    			add_location(span1, file$6, 82, 8, 7244);
    			attr_dev(a1, "class", "socialsgram svelte-14ra6vj");
    			attr_dev(a1, "href", "#instagram");
    			add_location(a1, file$6, 47, 4, 4298);
    			set_style(circle1, "fill", "#3A5A98");
    			attr_dev(circle1, "cx", "237.111");
    			attr_dev(circle1, "cy", "236.966");
    			attr_dev(circle1, "r", "236.966");
    			add_location(circle1, file$6, 86, 12, 7570);
    			set_style(path4, "fill", "#345387");
    			attr_dev(path4, "d", "M404.742,69.754c92.541,92.541,92.545,242.586-0.004,335.134\n                c-92.545,92.541-242.593,92.541-335.134,0L404.742,69.754z");
    			add_location(path4, file$6, 87, 12, 7652);
    			set_style(path5, "fill", "#2E4D72");
    			attr_dev(path5, "d", "M472.543,263.656L301.129,92.238l-88.998,88.998l5.302,5.302l-50.671,50.667l41.474,41.474\n                l-5.455,5.452l44.901,44.901l-51.764,51.764l88.429,88.429C384.065,449.045,461.037,366.255,472.543,263.656z");
    			add_location(path5, file$6, 89, 12, 7830);
    			set_style(path6, "fill", "#FFFFFF");
    			attr_dev(path6, "d", "M195.682,148.937c0,7.27,0,39.741,0,39.741h-29.115v48.598h29.115v144.402h59.808V237.276h40.134\n                c0,0,3.76-23.307,5.579-48.781c-5.224,0-45.485,0-45.485,0s0-28.276,0-33.231c0-4.962,6.518-11.641,12.965-11.641\n                c6.436,0,20.015,0,32.587,0c0-6.623,0-29.481,0-50.592c-16.786,0-35.883,0-44.306,0C194.201,93.028,195.682,141.671,195.682,148.937\n                z");
    			add_location(path6, file$6, 91, 12, 8086);
    			attr_dev(svg2, "version", "1.1");
    			attr_dev(svg2, "id", "Layer_1");
    			attr_dev(svg2, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg2, "xmlns:xlink", "http://www.w3.org/1999/xlink");
    			attr_dev(svg2, "x", "0px");
    			attr_dev(svg2, "y", "0px");
    			attr_dev(svg2, "viewBox", "0 0 474.294 474.294");
    			set_style(svg2, "enable-background", "new 0 0 474.294 474.294");
    			attr_dev(svg2, "xml:space", "preserve");
    			attr_dev(svg2, "class", "svelte-14ra6vj");
    			add_location(svg2, file$6, 85, 8, 7329);
    			attr_dev(span2, "class", "svelte-14ra6vj");
    			add_location(span2, file$6, 96, 8, 8533);
    			attr_dev(a2, "class", "socialsface svelte-14ra6vj");
    			attr_dev(a2, "href", "#facebook");
    			add_location(a2, file$6, 84, 4, 7280);
    			attr_dev(path7, "fill", "#1DA1F2");
    			attr_dev(path7, "fill-rule", "evenodd");
    			attr_dev(path7, "d", "M24,4.3086 C23.117,4.7006 22.168,4.9646 21.172,5.0836 C22.188,4.4746 22.969,3.5096 23.337,2.3596 C22.386,2.9246 21.332,3.3336 20.21,3.5556 C19.312,2.5976 18.032,1.9996 16.616,1.9996 C13.897,1.9996 11.692,4.2046 11.692,6.9236 C11.692,7.3096 11.736,7.6856 11.82,8.0456 C7.728,7.8406 4.099,5.8806 1.671,2.9006 C1.247,3.6286 1.004,4.4736 1.004,5.3766 C1.004,7.0846 1.873,8.5926 3.195,9.4756 C2.388,9.4486 1.628,9.2276 0.964,8.8596 L0.964,8.9206 C0.964,11.3066 2.661,13.2966 4.914,13.7486 C4.501,13.8626 4.065,13.9216 3.617,13.9216 C3.299,13.9216 2.991,13.8906 2.69,13.8336 C3.317,15.7896 5.135,17.2136 7.29,17.2536 C5.604,18.5736 3.481,19.3606 1.175,19.3606 C0.777,19.3606 0.385,19.3376 0,19.2926 C2.179,20.6886 4.767,21.5046 7.548,21.5046 C16.605,21.5046 21.557,14.0016 21.557,7.4946 C21.557,7.2816 21.552,7.0696 21.543,6.8586 C22.505,6.1636 23.34,5.2966 24,4.3086");
    			add_location(path7, file$6, 100, 12, 8716);
    			attr_dev(svg3, "width", "24px");
    			attr_dev(svg3, "height", "24px");
    			attr_dev(svg3, "viewBox", "0 0 24 24");
    			attr_dev(svg3, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg3, "class", "svelte-14ra6vj");
    			add_location(svg3, file$6, 99, 8, 8616);
    			attr_dev(span3, "class", "svelte-14ra6vj");
    			add_location(span3, file$6, 102, 8, 9660);
    			attr_dev(a3, "class", "socialstwtr svelte-14ra6vj");
    			attr_dev(a3, "href", "#twitter");
    			add_location(a3, file$6, 98, 4, 8568);
    			set_style(path8, "fill", "#c71610");
    			attr_dev(path8, "d", "M503.68,430.917h-448c-17.6,0-32-14.4-32-32V122.789c0-17.6,14.4-32,32-32h448c17.6,0,32,14.4,32,32\n                v276.144C535.68,416.517,521.28,430.917,503.68,430.917z");
    			add_location(path8, file$6, 106, 12, 9977);
    			attr_dev(rect0, "x", "118.177");
    			attr_dev(rect0, "y", "199.345");
    			attr_dev(rect0, "transform", "matrix(-0.8145 -0.5801 0.5801 -0.8145 28.9379 698.8115)");
    			set_style(rect0, "fill", "#FFFFFF");
    			attr_dev(rect0, "width", "15.999");
    			attr_dev(rect0, "height", "290.869");
    			add_location(rect0, file$6, 110, 20, 10235);
    			attr_dev(rect1, "x", "287.855");
    			attr_dev(rect1, "y", "337.468");
    			attr_dev(rect1, "transform", "matrix(-0.5802 -0.8145 0.8145 -0.5802 403.3148 898.8185)");
    			set_style(rect1, "fill", "#FFFFFF");
    			attr_dev(rect1, "width", "290.886");
    			attr_dev(rect1, "height", "16");
    			add_location(rect1, file$6, 112, 20, 10430);
    			set_style(polygon, "fill", "#FFFFFF");
    			attr_dev(polygon, "points", "279.68,271.733 0,124.357 7.472,110.197 279.68,253.637 551.888,110.197 559.36,124.357");
    			add_location(polygon, file$6, 113, 20, 10601);
    			add_location(g2, file$6, 109, 16, 10211);
    			add_location(g3, file$6, 108, 12, 10191);
    			attr_dev(svg4, "version", "1.1");
    			attr_dev(svg4, "id", "Layer_1");
    			attr_dev(svg4, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg4, "xmlns:xlink", "http://www.w3.org/1999/xlink");
    			attr_dev(svg4, "x", "0px");
    			attr_dev(svg4, "y", "0px");
    			attr_dev(svg4, "viewBox", "0 0 559.36 559.36");
    			set_style(svg4, "enable-background", "new 0 0 559.36 559.36");
    			attr_dev(svg4, "xml:space", "preserve");
    			attr_dev(svg4, "class", "svelte-14ra6vj");
    			add_location(svg4, file$6, 105, 8, 9740);
    			attr_dev(span4, "class", "svelte-14ra6vj");
    			add_location(span4, file$6, 117, 8, 10789);
    			attr_dev(a4, "class", "socialsmail svelte-14ra6vj");
    			attr_dev(a4, "href", "#email");
    			add_location(a4, file$6, 104, 4, 9694);
    			attr_dev(button, "class", "gototop svelte-14ra6vj");
    			add_location(button, file$6, 120, 8, 10854);
    			attr_dev(div1, "class", "gototopdiv svelte-14ra6vj");
    			add_location(div1, file$6, 119, 4, 10821);
    			attr_dev(div2, "id", "targid");
    			attr_dev(div2, "class", "socialscontainer svelte-14ra6vj");
    			add_location(div2, file$6, 29, 0, 692);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div2, t1);
    			append_dev(div2, a0);
    			append_dev(a0, svg0);
    			append_dev(svg0, defs);
    			append_dev(defs, path0);
    			append_dev(svg0, linearGradient0);
    			append_dev(linearGradient0, stop0);
    			append_dev(linearGradient0, stop1);
    			append_dev(svg0, use);
    			append_dev(svg0, g0);
    			append_dev(g0, path1);
    			append_dev(a0, t2);
    			append_dev(a0, span0);
    			append_dev(div2, t4);
    			append_dev(div2, a1);
    			append_dev(a1, svg1);
    			append_dev(svg1, g1);
    			append_dev(g1, linearGradient1);
    			append_dev(linearGradient1, stop2);
    			append_dev(linearGradient1, stop3);
    			append_dev(linearGradient1, stop4);
    			append_dev(linearGradient1, stop5);
    			append_dev(g1, path2);
    			append_dev(g1, linearGradient2);
    			append_dev(linearGradient2, stop6);
    			append_dev(linearGradient2, stop7);
    			append_dev(linearGradient2, stop8);
    			append_dev(linearGradient2, stop9);
    			append_dev(g1, path3);
    			append_dev(g1, linearGradient3);
    			append_dev(linearGradient3, stop10);
    			append_dev(linearGradient3, stop11);
    			append_dev(linearGradient3, stop12);
    			append_dev(linearGradient3, stop13);
    			append_dev(g1, circle0);
    			append_dev(a1, t5);
    			append_dev(a1, span1);
    			append_dev(div2, t7);
    			append_dev(div2, a2);
    			append_dev(a2, svg2);
    			append_dev(svg2, circle1);
    			append_dev(svg2, path4);
    			append_dev(svg2, path5);
    			append_dev(svg2, path6);
    			append_dev(a2, t8);
    			append_dev(a2, span2);
    			append_dev(div2, t10);
    			append_dev(div2, a3);
    			append_dev(a3, svg3);
    			append_dev(svg3, path7);
    			append_dev(a3, t11);
    			append_dev(a3, span3);
    			append_dev(div2, t13);
    			append_dev(div2, a4);
    			append_dev(a4, svg4);
    			append_dev(svg4, path8);
    			append_dev(svg4, g3);
    			append_dev(g3, g2);
    			append_dev(g2, rect0);
    			append_dev(g2, rect1);
    			append_dev(g2, polygon);
    			append_dev(a4, t14);
    			append_dev(a4, span4);
    			append_dev(div2, t16);
    			append_dev(div2, div1);
    			append_dev(div1, button);

    			if (!mounted) {
    				dispose = [
    					listen_dev(window_1, "scroll", handleScroll, false, false, false),
    					listen_dev(button, "click", handleGoToTop, false, false, false),
    					action_destroyer(sticky.call(null, div2, { stickToTop }))
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const stickToTop = true;

    function handleScroll() {
    	const elSocails = document.getElementById("targid");
    	const elAbout = elSocails.parentElement;
    	const elMain = elAbout.parentElement;
    	elAbout.style.height = elMain.clientHeight + "px";
    }

    function handleGoToTop() {
    	if ('scrollBehavior' in document.body.style) window.scroll({ behavior: 'smooth', left: 0, top: 0 }); else {
    		window.scroll(0, 0);
    		console.log("nope");
    	}
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Stick', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<Stick> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		sticky,
    		stickToTop,
    		handleScroll,
    		handleGoToTop
    	});

    	return [];
    }

    class Stick extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Stick",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src/components/PMInfo.svelte generated by Svelte v3.50.0 */
    const file$5 = "src/components/PMInfo.svelte";

    function create_fragment$5(ctx) {
    	let div4;
    	let h40;
    	let t1;
    	let div3;
    	let div0;
    	let img0;
    	let img0_src_value;
    	let t2;
    	let img1;
    	let img1_src_value;
    	let t3;
    	let h41;
    	let t5;
    	let div1;
    	let t7;
    	let div2;
    	let t8;
    	let sticky;
    	let current;
    	sticky = new Stick({ $$inline: true });

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			h40 = element("h4");
    			h40.textContent = "About";
    			t1 = space();
    			div3 = element("div");
    			div0 = element("div");
    			img0 = element("img");
    			t2 = space();
    			img1 = element("img");
    			t3 = space();
    			h41 = element("h4");
    			h41.textContent = "Lorem ipsum dolor...";
    			t5 = space();
    			div1 = element("div");
    			div1.textContent = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse dapibus leo magna, lacinia gravida velit rhoncus ac. Nulla euismod leo a turpis sodales, sed pharetra lectus dictum. Aenean sagittis tortor ac pretium accumsan. Maecenas odio lorem, molestie sit amet viverra ac, molestie vitae leo. Sed dictum odio libero, ut vehicula risus iaculis sed. Morbi ac erat commodo, elementum sapien nec, molestie dolor.";
    			t7 = space();
    			div2 = element("div");
    			t8 = space();
    			create_component(sticky.$$.fragment);
    			attr_dev(h40, "class", "aboutheader svelte-1kohsqs");
    			add_location(h40, file$5, 7, 4, 178);
    			attr_dev(img0, "class", "cover svelte-1kohsqs");
    			attr_dev(img0, "alt", /*auth*/ ctx[0].author);
    			if (!src_url_equal(img0.src, img0_src_value = /*auth*/ ctx[0].authcover)) attr_dev(img0, "src", img0_src_value);
    			add_location(img0, file$5, 10, 12, 294);
    			attr_dev(img1, "class", "prof svelte-1kohsqs");
    			attr_dev(img1, "alt", /*auth*/ ctx[0].author);
    			if (!src_url_equal(img1.src, img1_src_value = /*auth*/ ctx[0].authimg)) attr_dev(img1, "src", img1_src_value);
    			add_location(img1, file$5, 11, 12, 365);
    			attr_dev(div0, "class", "covercontainer svelte-1kohsqs");
    			add_location(div0, file$5, 9, 8, 253);
    			attr_dev(h41, "class", "infoheader svelte-1kohsqs");
    			add_location(h41, file$5, 13, 8, 444);
    			attr_dev(div1, "class", "infoinfo svelte-1kohsqs");
    			add_location(div1, file$5, 14, 8, 501);
    			attr_dev(div2, "class", "infolink svelte-1kohsqs");
    			add_location(div2, file$5, 15, 8, 954);
    			attr_dev(div3, "class", "infocontainer svelte-1kohsqs");
    			add_location(div3, file$5, 8, 4, 217);
    			attr_dev(div4, "class", "about svelte-1kohsqs");
    			add_location(div4, file$5, 6, 0, 154);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, h40);
    			append_dev(div4, t1);
    			append_dev(div4, div3);
    			append_dev(div3, div0);
    			append_dev(div0, img0);
    			append_dev(div0, t2);
    			append_dev(div0, img1);
    			append_dev(div3, t3);
    			append_dev(div3, h41);
    			append_dev(div3, t5);
    			append_dev(div3, div1);
    			append_dev(div3, t7);
    			append_dev(div3, div2);
    			append_dev(div4, t8);
    			mount_component(sticky, div4, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(sticky.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(sticky.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			destroy_component(sticky);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('PMInfo', slots, []);
    	let auth = EntriesJSON[0];
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<PMInfo> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ EntriesJSON, Sticky: Stick, auth });

    	$$self.$inject_state = $$props => {
    		if ('auth' in $$props) $$invalidate(0, auth = $$props.auth);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [auth];
    }

    class PMInfo extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PMInfo",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src/components/PostsCBar.svelte generated by Svelte v3.50.0 */

    const file$4 = "src/components/PostsCBar.svelte";

    function create_fragment$4(ctx) {
    	let div7;
    	let div0;
    	let svg;
    	let defs;
    	let path0;
    	let clipPath;
    	let use;
    	let path1;
    	let t0;
    	let div6;
    	let div5;
    	let div2;
    	let button0;
    	let span0;
    	let t2;
    	let i0;
    	let t3;
    	let div1;
    	let a0;
    	let t5;
    	let a1;
    	let t7;
    	let a2;
    	let t9;
    	let div4;
    	let button1;
    	let span1;
    	let t11;
    	let i1;
    	let t12;
    	let div3;
    	let a3;
    	let t14;
    	let a4;
    	let t16;
    	let a5;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div7 = element("div");
    			div0 = element("div");
    			svg = svg_element("svg");
    			defs = svg_element("defs");
    			path0 = svg_element("path");
    			clipPath = svg_element("clipPath");
    			use = svg_element("use");
    			path1 = svg_element("path");
    			t0 = space();
    			div6 = element("div");
    			div5 = element("div");
    			div2 = element("div");
    			button0 = element("button");
    			span0 = element("span");
    			span0.textContent = "Everywhere";
    			t2 = space();
    			i0 = element("i");
    			t3 = space();
    			div1 = element("div");
    			a0 = element("a");
    			a0.textContent = "Link 1";
    			t5 = space();
    			a1 = element("a");
    			a1.textContent = "Link 2";
    			t7 = space();
    			a2 = element("a");
    			a2.textContent = "Link 3";
    			t9 = space();
    			div4 = element("div");
    			button1 = element("button");
    			span1 = element("span");
    			span1.textContent = "Posts";
    			t11 = space();
    			i1 = element("i");
    			t12 = space();
    			div3 = element("div");
    			a3 = element("a");
    			a3.textContent = "Link 1";
    			t14 = space();
    			a4 = element("a");
    			a4.textContent = "Link 2";
    			t16 = space();
    			a5 = element("a");
    			a5.textContent = "Link 3";
    			attr_dev(path0, "id", "a");
    			attr_dev(path0, "d", "M-22 2.24h42V22h-42z");
    			add_location(path0, file$4, 29, 16, 927);
    			add_location(defs, file$4, 28, 12, 904);
    			xlink_attr(use, "xlink:href", "#a");
    			attr_dev(use, "overflow", "visible");
    			add_location(use, file$4, 32, 16, 1033);
    			attr_dev(clipPath, "id", "b");
    			add_location(clipPath, file$4, 31, 12, 999);
    			attr_dev(path1, "d", "M16.543 8.028c-.023 1.503-.523 3.538-2.867 4.327.734-1.746.846-3.417.326-4.979-.695-2.097-3.014-3.735-4.557-4.627-.527-.306-1.203.074-1.193.683.02 1.112-.318 2.737-1.959 4.378C4.107 9.994 3 12.251 3 14.517 3 17.362 5 21 9 21c-4.041-4.041-1-7.483-1-7.483C8.846 19.431 12.988 21 15 21c1.711 0 5-1.25 5-6.448 0-3.133-1.332-5.511-2.385-6.899-.347-.458-1.064-.198-1.072.375");
    			add_location(path1, file$4, 34, 12, 1111);
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "xmlns:xlink", "http://www.w3.org/1999/xlink");
    			attr_dev(svg, "class", "svelte-1cgcfdt");
    			add_location(svg, file$4, 27, 8, 788);
    			attr_dev(div0, "class", "hot svelte-1cgcfdt");
    			add_location(div0, file$4, 26, 4, 762);
    			attr_dev(span0, "class", "svelte-1cgcfdt");
    			add_location(span0, file$4, 41, 20, 1699);
    			attr_dev(i0, "class", "svelte-1cgcfdt");
    			add_location(i0, file$4, 42, 20, 1743);
    			attr_dev(button0, "class", "dropbtn svelte-1cgcfdt");
    			add_location(button0, file$4, 40, 16, 1626);
    			attr_dev(a0, "href", "#lnk1");
    			attr_dev(a0, "class", "svelte-1cgcfdt");
    			add_location(a0, file$4, 45, 16, 1862);
    			attr_dev(a1, "href", "#lnk2");
    			attr_dev(a1, "class", "svelte-1cgcfdt");
    			add_location(a1, file$4, 46, 16, 1905);
    			attr_dev(a2, "href", "#lnk3");
    			attr_dev(a2, "class", "svelte-1cgcfdt");
    			add_location(a2, file$4, 47, 16, 1948);
    			attr_dev(div1, "id", "locationDropdown");
    			attr_dev(div1, "class", "dropdown-content svelte-1cgcfdt");
    			add_location(div1, file$4, 44, 16, 1793);
    			attr_dev(div2, "class", "location svelte-1cgcfdt");
    			add_location(div2, file$4, 39, 12, 1587);
    			attr_dev(span1, "class", "svelte-1cgcfdt");
    			add_location(span1, file$4, 52, 20, 2133);
    			attr_dev(i1, "class", "svelte-1cgcfdt");
    			add_location(i1, file$4, 53, 20, 2172);
    			attr_dev(button1, "class", "dropbtn svelte-1cgcfdt");
    			add_location(button1, file$4, 51, 16, 2064);
    			attr_dev(a3, "href", "#lnk1");
    			attr_dev(a3, "class", "svelte-1cgcfdt");
    			add_location(a3, file$4, 56, 16, 2287);
    			attr_dev(a4, "href", "#lnk2");
    			attr_dev(a4, "class", "svelte-1cgcfdt");
    			add_location(a4, file$4, 57, 16, 2330);
    			attr_dev(a5, "href", "#lnk3");
    			attr_dev(a5, "class", "svelte-1cgcfdt");
    			add_location(a5, file$4, 58, 16, 2373);
    			attr_dev(div3, "id", "typeDropdown");
    			attr_dev(div3, "class", "dropdown-content svelte-1cgcfdt");
    			add_location(div3, file$4, 55, 16, 2222);
    			attr_dev(div4, "class", "type svelte-1cgcfdt");
    			add_location(div4, file$4, 50, 12, 2029);
    			attr_dev(div5, "class", "buttons svelte-1cgcfdt");
    			add_location(div5, file$4, 38, 8, 1553);
    			attr_dev(div6, "class", "controls svelte-1cgcfdt");
    			add_location(div6, file$4, 37, 4, 1522);
    			attr_dev(div7, "class", "postscontrol svelte-1cgcfdt");
    			add_location(div7, file$4, 25, 0, 731);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div7, anchor);
    			append_dev(div7, div0);
    			append_dev(div0, svg);
    			append_dev(svg, defs);
    			append_dev(defs, path0);
    			append_dev(svg, clipPath);
    			append_dev(clipPath, use);
    			append_dev(svg, path1);
    			append_dev(div7, t0);
    			append_dev(div7, div6);
    			append_dev(div6, div5);
    			append_dev(div5, div2);
    			append_dev(div2, button0);
    			append_dev(button0, span0);
    			append_dev(button0, t2);
    			append_dev(button0, i0);
    			append_dev(div2, t3);
    			append_dev(div2, div1);
    			append_dev(div1, a0);
    			append_dev(div1, t5);
    			append_dev(div1, a1);
    			append_dev(div1, t7);
    			append_dev(div1, a2);
    			append_dev(div5, t9);
    			append_dev(div5, div4);
    			append_dev(div4, button1);
    			append_dev(button1, span1);
    			append_dev(button1, t11);
    			append_dev(button1, i1);
    			append_dev(div4, t12);
    			append_dev(div4, div3);
    			append_dev(div3, a3);
    			append_dev(div3, t14);
    			append_dev(div3, a4);
    			append_dev(div3, t16);
    			append_dev(div3, a5);

    			if (!mounted) {
    				dispose = [
    					listen_dev(window, "click", cancelDropdown, false, false, false),
    					listen_dev(button0, "click", locationDropdown, false, false, false),
    					listen_dev(button1, "click", typeDropdown, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div7);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function locationDropdown(e) {
    	document.getElementById("locationDropdown").style.display = "block";
    }

    function typeDropdown(e) {
    	document.getElementById("typeDropdown").style.display = "block";
    }

    function cancelDropdown(e) {
    	if (!e.target.matches('.dropbtn')) {
    		const dropdowns = document.getElementsByClassName("dropdown-content");

    		for (let i = 0; i < dropdowns.length; i++) {
    			let openDropdown = dropdowns[i];

    			if (openDropdown.style.display == "block") {
    				openDropdown.style.display = "none";
    			}
    		}
    	}
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('PostsCBar', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<PostsCBar> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		locationDropdown,
    		typeDropdown,
    		cancelDropdown
    	});

    	return [];
    }

    class PostsCBar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PostsCBar",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src/components/PostsIndividual.svelte generated by Svelte v3.50.0 */

    const file$3 = "src/components/PostsIndividual.svelte";

    function create_fragment$3(ctx) {
    	let div5;
    	let div0;
    	let t0;
    	let a9;
    	let div2;
    	let a0;
    	let img0;
    	let img0_alt_value;
    	let img0_src_value;
    	let t1;
    	let img1;
    	let img1_alt_value;
    	let img1_src_value;
    	let a0_href_value;
    	let t2;
    	let div1;
    	let a1;
    	let h3;
    	let t3_value = /*liEntry*/ ctx[0].title + "";
    	let t3;
    	let a1_href_value;
    	let t4;
    	let a2;
    	let b;
    	let t5_value = /*liEntry*/ ctx[0].author + "";
    	let t5;
    	let t6;
    	let span0;
    	let t8;
    	let span1;
    	let t9_value = /*liEntry*/ ctx[0].date + "";
    	let t9;
    	let a2_href_value;
    	let t10;
    	let article;
    	let img2;
    	let img2_alt_value;
    	let img2_src_value;
    	let t11;
    	let div3;
    	let t13;
    	let aside;
    	let a3;
    	let svg0;
    	let g0;
    	let path0;
    	let path1;
    	let t14;
    	let a4;
    	let svg1;
    	let g1;
    	let path2;
    	let path3;
    	let path4;
    	let path5;
    	let path6;
    	let circle;
    	let t15;
    	let a5;
    	let svg2;
    	let g2;
    	let path7;
    	let t16;
    	let div4;
    	let a6;
    	let svg3;
    	let g4;
    	let g3;
    	let path8;
    	let t17;
    	let span2;
    	let a6_href_value;
    	let t19;
    	let a7;
    	let svg4;
    	let g6;
    	let g5;
    	let path9;
    	let t20;
    	let span3;
    	let a7_href_value;
    	let t22;
    	let a8;
    	let svg5;
    	let path10;
    	let path11;
    	let path12;
    	let t23;
    	let span4;
    	let a8_href_value;
    	let a9_href_value;

    	const block = {
    		c: function create() {
    			div5 = element("div");
    			div0 = element("div");
    			t0 = space();
    			a9 = element("a");
    			div2 = element("div");
    			a0 = element("a");
    			img0 = element("img");
    			t1 = space();
    			img1 = element("img");
    			t2 = space();
    			div1 = element("div");
    			a1 = element("a");
    			h3 = element("h3");
    			t3 = text(t3_value);
    			t4 = space();
    			a2 = element("a");
    			b = element("b");
    			t5 = text(t5_value);
    			t6 = space();
    			span0 = element("span");
    			span0.textContent = "·";
    			t8 = space();
    			span1 = element("span");
    			t9 = text(t9_value);
    			t10 = space();
    			article = element("article");
    			img2 = element("img");
    			t11 = space();
    			div3 = element("div");
    			div3.textContent = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris vel fringilla nibh, vitae congue dolor. Praesent placerat faucibus sapien, eget interdum dui euismod vel. Interdum et malesuada fames ac ante ipsum primis in faucibus. Aliquam ullamcorper vestibulum suscipit. Pellentesque dignissim nulla eget justo mollis blandit. Integer rutrum blandit feugiat. Donec vehicula venenatis velit a accumsan. Duis vel pellentesque lacus. Nunc imperdiet risus non dolor accumsan pellentesque. Sed maximus blandit semper. Proin mollis sapien ut massa sodales, vel euismod lacus aliquam. Aliquam malesuada ultrices augue ac placerat.";
    			t13 = space();
    			aside = element("aside");
    			a3 = element("a");
    			svg0 = svg_element("svg");
    			g0 = svg_element("g");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			t14 = space();
    			a4 = element("a");
    			svg1 = svg_element("svg");
    			g1 = svg_element("g");
    			path2 = svg_element("path");
    			path3 = svg_element("path");
    			path4 = svg_element("path");
    			path5 = svg_element("path");
    			path6 = svg_element("path");
    			circle = svg_element("circle");
    			t15 = space();
    			a5 = element("a");
    			svg2 = svg_element("svg");
    			g2 = svg_element("g");
    			path7 = svg_element("path");
    			t16 = space();
    			div4 = element("div");
    			a6 = element("a");
    			svg3 = svg_element("svg");
    			g4 = svg_element("g");
    			g3 = svg_element("g");
    			path8 = svg_element("path");
    			t17 = space();
    			span2 = element("span");
    			span2.textContent = "Comments";
    			t19 = space();
    			a7 = element("a");
    			svg4 = svg_element("svg");
    			g6 = svg_element("g");
    			g5 = svg_element("g");
    			path9 = svg_element("path");
    			t20 = space();
    			span3 = element("span");
    			span3.textContent = "Share";
    			t22 = space();
    			a8 = element("a");
    			svg5 = svg_element("svg");
    			path10 = svg_element("path");
    			path11 = svg_element("path");
    			path12 = svg_element("path");
    			t23 = space();
    			span4 = element("span");
    			span4.textContent = "See more";
    			attr_dev(div0, "class", "postpadding svelte-7owxrf");
    			add_location(div0, file$3, 5, 4, 76);
    			attr_dev(img0, "class", "authcover svelte-7owxrf");
    			attr_dev(img0, "alt", img0_alt_value = /*liEntry*/ ctx[0].author);
    			if (!src_url_equal(img0.src, img0_src_value = /*liEntry*/ ctx[0].authcover)) attr_dev(img0, "src", img0_src_value);
    			add_location(img0, file$3, 9, 16, 262);
    			attr_dev(img1, "class", "authimg svelte-7owxrf");
    			attr_dev(img1, "alt", img1_alt_value = /*liEntry*/ ctx[0].author);
    			if (!src_url_equal(img1.src, img1_src_value = /*liEntry*/ ctx[0].authimg)) attr_dev(img1, "src", img1_src_value);
    			add_location(img1, file$3, 10, 16, 347);
    			attr_dev(a0, "class", "postauthor svelte-7owxrf");
    			attr_dev(a0, "href", a0_href_value = /*liEntry*/ ctx[0].authlink);
    			add_location(a0, file$3, 8, 12, 199);
    			attr_dev(h3, "class", "title svelte-7owxrf");
    			add_location(h3, file$3, 14, 20, 524);
    			attr_dev(a1, "href", a1_href_value = /*liEntry*/ ctx[0].link);
    			attr_dev(a1, "class", "svelte-7owxrf");
    			add_location(a1, file$3, 13, 16, 480);
    			attr_dev(b, "class", "author svelte-7owxrf");
    			add_location(b, file$3, 17, 20, 648);
    			attr_dev(span0, "class", "separator svelte-7owxrf");
    			add_location(span0, file$3, 18, 20, 707);
    			attr_dev(span1, "class", "date svelte-7owxrf");
    			add_location(span1, file$3, 19, 20, 765);
    			attr_dev(a2, "href", a2_href_value = /*liEntry*/ ctx[0].authlink);
    			attr_dev(a2, "class", "svelte-7owxrf");
    			add_location(a2, file$3, 16, 16, 600);
    			attr_dev(div1, "class", "postinfo svelte-7owxrf");
    			add_location(div1, file$3, 12, 12, 441);
    			attr_dev(div2, "class", "postdetails svelte-7owxrf");
    			add_location(div2, file$3, 7, 8, 161);
    			attr_dev(img2, "class", "thumb svelte-7owxrf");
    			attr_dev(img2, "alt", img2_alt_value = /*liEntry*/ ctx[0].title);
    			if (!src_url_equal(img2.src, img2_src_value = /*liEntry*/ ctx[0].thumb)) attr_dev(img2, "src", img2_src_value);
    			add_location(img2, file$3, 24, 12, 904);
    			attr_dev(div3, "class", "preview svelte-7owxrf");
    			add_location(div3, file$3, 25, 12, 976);
    			attr_dev(path0, "d", "M 45 86.474 c -1.134 0 -2.269 -0.433 -3.134 -1.298 L 28.588 71.898 H 13.821 C 6.2 71.898 0 65.698 0 58.077 V 17.348 C 0 9.727 6.2 3.526 13.821 3.526 h 62.356 C 83.8 3.526 90 9.727 90 17.348 v 40.729 c 0 7.621 -6.2 13.821 -13.822 13.821 H 61.412 L 48.134 85.175 C 47.269 86.041 46.134 86.474 45 86.474 z");
    			set_style(path0, "stroke", "none");
    			set_style(path0, "stroke-width", "1");
    			set_style(path0, "stroke-dasharray", "none");
    			set_style(path0, "stroke-linecap", "butt");
    			set_style(path0, "stroke-linejoin", "miter");
    			set_style(path0, "stroke-miterlimit", "10");
    			set_style(path0, "fill", "rgb(255,37,123)");
    			set_style(path0, "fill-rule", "nonzero");
    			set_style(path0, "opacity", "1");
    			attr_dev(path0, "transform", " matrix(1 0 0 1 0 0) ");
    			attr_dev(path0, "stroke-linecap", "round");
    			add_location(path0, file$3, 30, 28, 2205);
    			attr_dev(path1, "d", "M 61.434 26.084 c -4.021 -3.509 -10.711 -2.915 -14.484 0.86 L 45 28.896 l -2.105 -2.105 c -3.496 -3.496 -9.041 -4.314 -13.168 -1.59 c -5.673 3.746 -6.238 11.492 -1.695 16.035 L 43.077 56.28 c 1.062 1.062 2.784 1.062 3.846 0 l 14.714 -14.714 c 1.769 -1.769 3.044 -4.043 3.306 -6.53 C 65.302 31.61 64.011 28.333 61.434 26.084 z");
    			set_style(path1, "stroke", "none");
    			set_style(path1, "stroke-width", "1");
    			set_style(path1, "stroke-dasharray", "none");
    			set_style(path1, "stroke-linecap", "butt");
    			set_style(path1, "stroke-linejoin", "miter");
    			set_style(path1, "stroke-miterlimit", "10");
    			set_style(path1, "fill", "rgb(255,255,255)");
    			set_style(path1, "fill-rule", "nonzero");
    			set_style(path1, "opacity", "1");
    			attr_dev(path1, "transform", " matrix(1 0 0 1 0 0) ");
    			attr_dev(path1, "stroke-linecap", "round");
    			add_location(path1, file$3, 31, 28, 2793);
    			set_style(g0, "stroke", "none");
    			set_style(g0, "stroke-width", "0");
    			set_style(g0, "stroke-dasharray", "none");
    			set_style(g0, "stroke-linecap", "butt");
    			set_style(g0, "stroke-linejoin", "miter");
    			set_style(g0, "stroke-miterlimit", "10");
    			set_style(g0, "fill", "none");
    			set_style(g0, "fill-rule", "nonzero");
    			set_style(g0, "opacity", "1");
    			attr_dev(g0, "transform", "translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)");
    			add_location(g0, file$3, 29, 24, 1918);
    			attr_dev(svg0, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg0, "xmlns:xlink", "http://www.w3.org/1999/xlink");
    			attr_dev(svg0, "version", "1.1");
    			attr_dev(svg0, "width", "256");
    			attr_dev(svg0, "height", "256");
    			attr_dev(svg0, "viewBox", "0 0 256 256");
    			attr_dev(svg0, "xml:space", "preserve");
    			attr_dev(svg0, "class", "svelte-7owxrf");
    			add_location(svg0, file$3, 28, 20, 1728);
    			attr_dev(a3, "href", "#likeInstagram");
    			attr_dev(a3, "class", "svelte-7owxrf");
    			add_location(a3, file$3, 27, 16, 1682);
    			attr_dev(path2, "d", "M 84.377 58.667 h -0.244 c 3.093 0 5.623 -2.53 5.623 -5.623 v -1.121 c 0 -3.093 -2.53 -5.623 -5.623 -5.623 h -0.669 c 3.093 0 5.623 -2.53 5.623 -5.623 v -1.121 c 0 -3.093 -2.53 -5.623 -5.623 -5.623 L 59.955 33.97 c 2.481 -23.725 -2.337 -29.513 -11.895 -27.292 c -0.641 13.441 -9.152 31.766 -17.814 32.267 v -2.304 c 0 -1.645 -1.508 -2.99 -3.35 -2.99 l -23.545 0 c -1.843 0 -3.35 1.346 -3.35 2.99 l 0 44.127 c 0 1.645 1.508 2.99 3.35 2.99 l 23.545 0 c 1.843 0 3.35 -1.346 3.35 -2.99 l 0 -2.686 c 3.09 3.399 10.625 5.499 17.788 5.319 l 31.699 0 c 3.093 0 5.623 -2.53 5.623 -5.623 v -1.121 c 0 -3.093 -2.53 -5.623 -5.623 -5.623 h 4.644 c 3.093 0 5.623 -2.53 5.623 -5.623 v -1.121 C 90 61.198 87.47 58.667 84.377 58.667 z");
    			set_style(path2, "stroke", "none");
    			set_style(path2, "stroke-width", "1");
    			set_style(path2, "stroke-dasharray", "none");
    			set_style(path2, "stroke-linecap", "butt");
    			set_style(path2, "stroke-linejoin", "miter");
    			set_style(path2, "stroke-miterlimit", "10");
    			set_style(path2, "fill", "rgb(251,206,157)");
    			set_style(path2, "fill-rule", "nonzero");
    			set_style(path2, "opacity", "1");
    			attr_dev(path2, "transform", " matrix(1 0 0 1 0 0) ");
    			attr_dev(path2, "stroke-linecap", "round");
    			add_location(path2, file$3, 38, 28, 3992);
    			attr_dev(path3, "d", "M 30.246 80.769 c 0 1.645 -1.508 2.99 -3.35 2.99 l -23.545 0 c -1.843 0 -3.35 -1.346 -3.35 -2.99 l 0 -44.127 c 0 -1.645 1.508 -2.99 3.35 -2.99 l 23.545 0 c 1.843 0 3.35 1.346 3.35 2.99 L 30.246 80.769 z");
    			set_style(path3, "stroke", "none");
    			set_style(path3, "stroke-width", "1");
    			set_style(path3, "stroke-dasharray", "none");
    			set_style(path3, "stroke-linecap", "butt");
    			set_style(path3, "stroke-linejoin", "miter");
    			set_style(path3, "stroke-miterlimit", "10");
    			set_style(path3, "fill", "rgb(60,90,153)");
    			set_style(path3, "fill-rule", "nonzero");
    			set_style(path3, "opacity", "1");
    			attr_dev(path3, "transform", " matrix(1 0 0 1 0 0) ");
    			attr_dev(path3, "stroke-linecap", "round");
    			add_location(path3, file$3, 39, 28, 4996);
    			attr_dev(path4, "d", "M 83.464 47.323 h -9.337 c -0.565 0 -1.023 -0.457 -1.023 -1.023 c 0 -0.565 0.457 -1.023 1.023 -1.023 h 9.337 c 0.565 0 1.023 0.458 1.023 1.023 C 84.487 46.866 84.029 47.323 83.464 47.323 z");
    			set_style(path4, "stroke", "none");
    			set_style(path4, "stroke-width", "1");
    			set_style(path4, "stroke-dasharray", "none");
    			set_style(path4, "stroke-linecap", "butt");
    			set_style(path4, "stroke-linejoin", "miter");
    			set_style(path4, "stroke-miterlimit", "10");
    			set_style(path4, "fill", "rgb(231,187,139)");
    			set_style(path4, "fill-rule", "nonzero");
    			set_style(path4, "opacity", "1");
    			attr_dev(path4, "transform", " matrix(1 0 0 1 0 0) ");
    			attr_dev(path4, "stroke-linecap", "round");
    			add_location(path4, file$3, 40, 28, 5483);
    			attr_dev(path5, "d", "M 84.132 59.69 H 74.127 c -0.565 0 -1.023 -0.457 -1.023 -1.023 s 0.457 -1.023 1.023 -1.023 h 10.006 c 0.565 0 1.023 0.457 1.023 1.023 S 84.698 59.69 84.132 59.69 z");
    			set_style(path5, "stroke", "none");
    			set_style(path5, "stroke-width", "1");
    			set_style(path5, "stroke-dasharray", "none");
    			set_style(path5, "stroke-linecap", "butt");
    			set_style(path5, "stroke-linejoin", "miter");
    			set_style(path5, "stroke-miterlimit", "10");
    			set_style(path5, "fill", "rgb(231,187,139)");
    			set_style(path5, "fill-rule", "nonzero");
    			set_style(path5, "opacity", "1");
    			attr_dev(path5, "transform", " matrix(1 0 0 1 0 0) ");
    			attr_dev(path5, "stroke-linecap", "round");
    			add_location(path5, file$3, 41, 28, 5958);
    			attr_dev(path6, "d", "M 79.733 72.057 h -5.606 c -0.565 0 -1.023 -0.457 -1.023 -1.023 c 0 -0.565 0.457 -1.023 1.023 -1.023 h 5.606 c 0.565 0 1.023 0.457 1.023 1.023 C 80.756 71.6 80.298 72.057 79.733 72.057 z");
    			set_style(path6, "stroke", "none");
    			set_style(path6, "stroke-width", "1");
    			set_style(path6, "stroke-dasharray", "none");
    			set_style(path6, "stroke-linecap", "butt");
    			set_style(path6, "stroke-linejoin", "miter");
    			set_style(path6, "stroke-miterlimit", "10");
    			set_style(path6, "fill", "rgb(231,187,139)");
    			set_style(path6, "fill-rule", "nonzero");
    			set_style(path6, "opacity", "1");
    			attr_dev(path6, "transform", " matrix(1 0 0 1 0 0) ");
    			attr_dev(path6, "stroke-linecap", "round");
    			add_location(path6, file$3, 42, 28, 6408);
    			attr_dev(circle, "cx", "15.481000000000002");
    			attr_dev(circle, "cy", "70.271");
    			attr_dev(circle, "r", "5.101");
    			set_style(circle, "stroke", "none");
    			set_style(circle, "stroke-width", "1");
    			set_style(circle, "stroke-dasharray", "none");
    			set_style(circle, "stroke-linecap", "butt");
    			set_style(circle, "stroke-linejoin", "miter");
    			set_style(circle, "stroke-miterlimit", "10");
    			set_style(circle, "fill", "rgb(249,249,249)");
    			set_style(circle, "fill-rule", "nonzero");
    			set_style(circle, "opacity", "1");
    			attr_dev(circle, "transform", "  matrix(1 0 0 1 0 0) ");
    			add_location(circle, file$3, 43, 28, 6881);
    			set_style(g1, "stroke", "none");
    			set_style(g1, "stroke-width", "0");
    			set_style(g1, "stroke-dasharray", "none");
    			set_style(g1, "stroke-linecap", "butt");
    			set_style(g1, "stroke-linejoin", "miter");
    			set_style(g1, "stroke-miterlimit", "10");
    			set_style(g1, "fill", "none");
    			set_style(g1, "fill-rule", "nonzero");
    			set_style(g1, "opacity", "1");
    			attr_dev(g1, "transform", "translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)");
    			add_location(g1, file$3, 37, 24, 3705);
    			attr_dev(svg1, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg1, "xmlns:xlink", "http://www.w3.org/1999/xlink");
    			attr_dev(svg1, "version", "1.1");
    			attr_dev(svg1, "width", "256");
    			attr_dev(svg1, "height", "256");
    			attr_dev(svg1, "viewBox", "0 0 256 256");
    			attr_dev(svg1, "xml:space", "preserve");
    			attr_dev(svg1, "class", "svelte-7owxrf");
    			add_location(svg1, file$3, 36, 20, 3515);
    			attr_dev(a4, "href", "#likeFacebook");
    			attr_dev(a4, "class", "svelte-7owxrf");
    			add_location(a4, file$3, 35, 16, 3470);
    			attr_dev(path7, "d", "M 84.646 11.504 C 75.554 1.233 58.335 -0.041 45 13.074 C 31.665 -0.041 14.446 1.233 5.354 11.504 c -9.671 10.926 -5.609 31.318 7.123 47.615 C 18.931 67.38 34.874 80.832 45 86.481 c 10.126 -5.649 26.069 -19.101 32.523 -27.362 C 90.255 42.822 94.318 22.43 84.646 11.504 z");
    			set_style(path7, "stroke", "none");
    			set_style(path7, "stroke-width", "1");
    			set_style(path7, "stroke-dasharray", "none");
    			set_style(path7, "stroke-linecap", "butt");
    			set_style(path7, "stroke-linejoin", "miter");
    			set_style(path7, "stroke-miterlimit", "10");
    			set_style(path7, "fill", "rgb(248,48,95)");
    			set_style(path7, "fill-rule", "nonzero");
    			set_style(path7, "opacity", "1");
    			attr_dev(path7, "transform", " matrix(1 0 0 1 0 0) ");
    			attr_dev(path7, "stroke-linecap", "round");
    			add_location(path7, file$3, 50, 28, 7774);
    			set_style(g2, "stroke", "none");
    			set_style(g2, "stroke-width", "0");
    			set_style(g2, "stroke-dasharray", "none");
    			set_style(g2, "stroke-linecap", "butt");
    			set_style(g2, "stroke-linejoin", "miter");
    			set_style(g2, "stroke-miterlimit", "10");
    			set_style(g2, "fill", "none");
    			set_style(g2, "fill-rule", "nonzero");
    			set_style(g2, "opacity", "1");
    			attr_dev(g2, "transform", "translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)");
    			add_location(g2, file$3, 49, 24, 7487);
    			attr_dev(svg2, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg2, "xmlns:xlink", "http://www.w3.org/1999/xlink");
    			attr_dev(svg2, "version", "1.1");
    			attr_dev(svg2, "width", "256");
    			attr_dev(svg2, "height", "256");
    			attr_dev(svg2, "viewBox", "0 0 256 256");
    			attr_dev(svg2, "xml:space", "preserve");
    			attr_dev(svg2, "class", "svelte-7owxrf");
    			add_location(svg2, file$3, 48, 20, 7297);
    			attr_dev(a5, "href", "#likeTwitter");
    			attr_dev(a5, "class", "svelte-7owxrf");
    			add_location(a5, file$3, 47, 16, 7253);
    			attr_dev(aside, "class", "sidebar svelte-7owxrf");
    			add_location(aside, file$3, 26, 12, 1642);
    			attr_dev(article, "class", "post svelte-7owxrf");
    			add_location(article, file$3, 23, 8, 869);
    			attr_dev(path8, "d", "M5.25,18 C3.45507456,18 2,16.5449254 2,14.75 L2,6.25 C2,4.45507456 3.45507456,3 5.25,3 L18.75,3 C20.5449254,3 22,4.45507456 22,6.25 L22,14.75 C22,16.5449254 20.5449254,18 18.75,18 L13.0124851,18 L7.99868152,21.7506795 C7.44585139,22.1641649 6.66249789,22.0512036 6.2490125,21.4983735 C6.08735764,21.2822409 6,21.0195912 6,20.7499063 L5.99921427,18 L5.25,18 Z M12.5135149,16.5 L18.75,16.5 C19.7164983,16.5 20.5,15.7164983 20.5,14.75 L20.5,6.25 C20.5,5.28350169 19.7164983,4.5 18.75,4.5 L5.25,4.5 C4.28350169,4.5 3.5,5.28350169 3.5,6.25 L3.5,14.75 C3.5,15.7164983 4.28350169,16.5 5.25,16.5 L7.49878573,16.5 L7.49899997,17.2497857 L7.49985739,20.2505702 L12.5135149,16.5 Z");
    			add_location(path8, file$3, 61, 28, 8819);
    			attr_dev(g3, "fill-rule", "nonzero");
    			add_location(g3, file$3, 60, 24, 8767);
    			attr_dev(g4, "stroke", "none");
    			attr_dev(g4, "stroke-width", "1");
    			attr_dev(g4, "fill-rule", "evenodd");
    			add_location(g4, file$3, 59, 20, 8688);
    			attr_dev(svg3, "viewBox", "0 0 24 24");
    			attr_dev(svg3, "version", "1.1");
    			attr_dev(svg3, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg3, "xmlns:xlink", "http://www.w3.org/1999/xlink");
    			attr_dev(svg3, "class", "svelte-7owxrf");
    			add_location(svg3, file$3, 58, 16, 8550);
    			attr_dev(span2, "class", "svelte-7owxrf");
    			add_location(span2, file$3, 65, 16, 9600);
    			attr_dev(a6, "class", "comment svelte-7owxrf");
    			attr_dev(a6, "draggable", "false");
    			attr_dev(a6, "href", a6_href_value = /*liEntry*/ ctx[0].link);
    			add_location(a6, file$3, 57, 12, 8476);
    			attr_dev(path9, "d", "M6.746704,4 L10.2109085,4 C10.625122,4 10.9609085,4.33578644 10.9609085,4.75 C10.9609085,5.12969577 10.6787546,5.44349096 10.312679,5.49315338 L10.2109085,5.5 L6.746704,5.5 C5.55584001,5.5 4.58105908,6.42516159 4.50189481,7.59595119 L4.496704,7.75 L4.496704,17.25 C4.496704,18.440864 5.42186559,19.4156449 6.59265519,19.4948092 L6.746704,19.5 L16.247437,19.5 C17.438301,19.5 18.4130819,18.5748384 18.4922462,17.4040488 L18.497437,17.25 L18.497437,16.752219 C18.497437,16.3380054 18.8332234,16.002219 19.247437,16.002219 C19.6271328,16.002219 19.940928,16.2843728 19.9905904,16.6504484 L19.997437,16.752219 L19.997437,17.25 C19.997437,19.2542592 18.4250759,20.8912737 16.4465956,20.994802 L16.247437,21 L6.746704,21 C4.74244483,21 3.10543026,19.4276389 3.00190201,17.4491586 L2.996704,17.25 L2.996704,7.75 C2.996704,5.74574083 4.56906505,4.10872626 6.54754543,4.00519801 L6.746704,4 L10.2109085,4 L6.746704,4 Z M14.5006976,6.51985416 L14.5006976,3.75 C14.5006976,3.12602964 15.20748,2.7899466 15.6876724,3.13980165 L15.7698701,3.20874226 L21.7644714,8.95874226 C22.0442311,9.22708681 22.0696965,9.65811353 21.8408438,9.95607385 L21.7645584,10.0411742 L15.7699571,15.7930263 C15.3196822,16.2250675 14.5877784,15.9476738 14.5078455,15.3589039 L14.5006976,15.2518521 L14.5006976,12.5265324 L14.1572053,12.5566444 C11.7575155,12.8069657 9.45747516,13.8878535 7.24265269,15.8173548 C6.72354372,16.2695904 5.9204142,15.8420034 6.00578894,15.1588473 C6.67057872,9.83929778 9.45245108,6.90729635 14.2013326,6.53950096 L14.5006976,6.51985416 L14.5006976,3.75 L14.5006976,6.51985416 Z M16.0006976,5.50864341 L16.0006976,7.25 C16.0006976,7.66421356 15.6649111,8 15.2506976,8 C11.3772927,8 8.97667396,9.67612932 7.93942891,13.1571821 L7.86037164,13.4357543 L8.21256044,13.1989337 C10.4490427,11.7371925 12.7984587,11 15.2506976,11 C15.6303934,11 15.9441885,11.2821539 15.993851,11.6482294 L16.0006976,11.75 L16.0006976,13.4928166 L20.1619348,9.50008715 L16.0006976,5.50864341 Z");
    			add_location(path9, file$3, 71, 28, 9992);
    			attr_dev(g5, "fill-rule", "nonzero");
    			add_location(g5, file$3, 70, 24, 9940);
    			attr_dev(g6, "stroke", "none");
    			attr_dev(g6, "stroke-width", "1");
    			attr_dev(g6, "fill-rule", "evenodd");
    			add_location(g6, file$3, 69, 20, 9861);
    			attr_dev(svg4, "viewBox", "0 0 24 24");
    			attr_dev(svg4, "version", "1.1");
    			attr_dev(svg4, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg4, "xmlns:xlink", "http://www.w3.org/1999/xlink");
    			attr_dev(svg4, "class", "svelte-7owxrf");
    			add_location(svg4, file$3, 68, 16, 9723);
    			attr_dev(span3, "class", "svelte-7owxrf");
    			add_location(span3, file$3, 75, 16, 12068);
    			attr_dev(a7, "class", "share svelte-7owxrf");
    			attr_dev(a7, "draggable", "false");
    			attr_dev(a7, "href", a7_href_value = /*liEntry*/ ctx[0].link);
    			add_location(a7, file$3, 67, 12, 9651);
    			attr_dev(path10, "d", "M16.5 3C17.7426 3 18.75 4.00736 18.75 5.25V5.5H17.25V5.25C17.25 4.83579 16.9142 4.5 16.5 4.5H4.25C3.83579 4.5 3.5 4.83579 3.5 5.25V14.75C3.5 15.1642 3.83579 15.5 4.25 15.5H4.5V17H4.25C3.00736 17 2 15.9926 2 14.75V5.25C2 4.00736 3.00736 3 4.25 3H16.5Z");
    			add_location(path10, file$3, 79, 20, 12280);
    			attr_dev(path11, "d", "M7.5 8H20C20.2761 8 20.5 8.22386 20.5 8.5V11.7322C21.051 12.0194 21.5557 12.3832 22 12.8096V8.5C22 7.39543 21.1046 6.5 20 6.5H7.5C6.39543 6.5 5.5 7.39543 5.5 8.5V18.5C5.5 19.6046 6.39543 20.5 7.5 20.5H11.7322C11.4876 20.0307 11.2986 19.5278 11.1739 19H7.5C7.22386 19 7 18.7761 7 18.5V8.5C7 8.22386 7.22386 8 7.5 8Z");
    			add_location(path11, file$3, 80, 20, 12563);
    			attr_dev(path12, "d", "M23 17.5C23 20.5376 20.5376 23 17.5 23C14.4624 23 12 20.5376 12 17.5C12 14.4624 14.4624 12 17.5 12C20.5376 12 23 14.4624 23 17.5ZM14.5 17C14.2239 17 14 17.2239 14 17.5C14 17.7761 14.2239 18 14.5 18H19.2929L17.6464 19.6464C17.4512 19.8417 17.4512 20.1583 17.6464 20.3536C17.8417 20.5488 18.1583 20.5488 18.3536 20.3536L20.8536 17.8536C21.0488 17.6583 21.0488 17.3417 20.8536 17.1464L18.3536 14.6464C18.1583 14.4512 17.8417 14.4512 17.6464 14.6464C17.4512 14.8417 17.4512 15.1583 17.6464 15.3536L19.2929 17H14.5Z");
    			add_location(path12, file$3, 81, 20, 12910);
    			attr_dev(svg5, "viewBox", "0 0 24 24");
    			attr_dev(svg5, "fill", "none");
    			attr_dev(svg5, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg5, "class", "svelte-7owxrf");
    			add_location(svg5, file$3, 78, 16, 12187);
    			attr_dev(span4, "class", "svelte-7owxrf");
    			add_location(span4, file$3, 83, 16, 13472);
    			attr_dev(a8, "class", "more svelte-7owxrf");
    			attr_dev(a8, "draggable", "false");
    			attr_dev(a8, "href", a8_href_value = /*liEntry*/ ctx[0].link);
    			add_location(a8, file$3, 77, 12, 12116);
    			attr_dev(div4, "class", "actionbar svelte-7owxrf");
    			add_location(div4, file$3, 56, 8, 8440);
    			attr_dev(a9, "class", "postlink svelte-7owxrf");
    			attr_dev(a9, "href", a9_href_value = /*liEntry*/ ctx[0].link);
    			add_location(a9, file$3, 6, 4, 112);
    			attr_dev(div5, "class", "postcontainer svelte-7owxrf");
    			add_location(div5, file$3, 4, 0, 44);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div5, anchor);
    			append_dev(div5, div0);
    			append_dev(div5, t0);
    			append_dev(div5, a9);
    			append_dev(a9, div2);
    			append_dev(div2, a0);
    			append_dev(a0, img0);
    			append_dev(a0, t1);
    			append_dev(a0, img1);
    			append_dev(div2, t2);
    			append_dev(div2, div1);
    			append_dev(div1, a1);
    			append_dev(a1, h3);
    			append_dev(h3, t3);
    			append_dev(div1, t4);
    			append_dev(div1, a2);
    			append_dev(a2, b);
    			append_dev(b, t5);
    			append_dev(a2, t6);
    			append_dev(a2, span0);
    			append_dev(a2, t8);
    			append_dev(a2, span1);
    			append_dev(span1, t9);
    			append_dev(a9, t10);
    			append_dev(a9, article);
    			append_dev(article, img2);
    			append_dev(article, t11);
    			append_dev(article, div3);
    			append_dev(article, t13);
    			append_dev(article, aside);
    			append_dev(aside, a3);
    			append_dev(a3, svg0);
    			append_dev(svg0, g0);
    			append_dev(g0, path0);
    			append_dev(g0, path1);
    			append_dev(aside, t14);
    			append_dev(aside, a4);
    			append_dev(a4, svg1);
    			append_dev(svg1, g1);
    			append_dev(g1, path2);
    			append_dev(g1, path3);
    			append_dev(g1, path4);
    			append_dev(g1, path5);
    			append_dev(g1, path6);
    			append_dev(g1, circle);
    			append_dev(aside, t15);
    			append_dev(aside, a5);
    			append_dev(a5, svg2);
    			append_dev(svg2, g2);
    			append_dev(g2, path7);
    			append_dev(a9, t16);
    			append_dev(a9, div4);
    			append_dev(div4, a6);
    			append_dev(a6, svg3);
    			append_dev(svg3, g4);
    			append_dev(g4, g3);
    			append_dev(g3, path8);
    			append_dev(a6, t17);
    			append_dev(a6, span2);
    			append_dev(div4, t19);
    			append_dev(div4, a7);
    			append_dev(a7, svg4);
    			append_dev(svg4, g6);
    			append_dev(g6, g5);
    			append_dev(g5, path9);
    			append_dev(a7, t20);
    			append_dev(a7, span3);
    			append_dev(div4, t22);
    			append_dev(div4, a8);
    			append_dev(a8, svg5);
    			append_dev(svg5, path10);
    			append_dev(svg5, path11);
    			append_dev(svg5, path12);
    			append_dev(a8, t23);
    			append_dev(a8, span4);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*liEntry*/ 1 && img0_alt_value !== (img0_alt_value = /*liEntry*/ ctx[0].author)) {
    				attr_dev(img0, "alt", img0_alt_value);
    			}

    			if (dirty & /*liEntry*/ 1 && !src_url_equal(img0.src, img0_src_value = /*liEntry*/ ctx[0].authcover)) {
    				attr_dev(img0, "src", img0_src_value);
    			}

    			if (dirty & /*liEntry*/ 1 && img1_alt_value !== (img1_alt_value = /*liEntry*/ ctx[0].author)) {
    				attr_dev(img1, "alt", img1_alt_value);
    			}

    			if (dirty & /*liEntry*/ 1 && !src_url_equal(img1.src, img1_src_value = /*liEntry*/ ctx[0].authimg)) {
    				attr_dev(img1, "src", img1_src_value);
    			}

    			if (dirty & /*liEntry*/ 1 && a0_href_value !== (a0_href_value = /*liEntry*/ ctx[0].authlink)) {
    				attr_dev(a0, "href", a0_href_value);
    			}

    			if (dirty & /*liEntry*/ 1 && t3_value !== (t3_value = /*liEntry*/ ctx[0].title + "")) set_data_dev(t3, t3_value);

    			if (dirty & /*liEntry*/ 1 && a1_href_value !== (a1_href_value = /*liEntry*/ ctx[0].link)) {
    				attr_dev(a1, "href", a1_href_value);
    			}

    			if (dirty & /*liEntry*/ 1 && t5_value !== (t5_value = /*liEntry*/ ctx[0].author + "")) set_data_dev(t5, t5_value);
    			if (dirty & /*liEntry*/ 1 && t9_value !== (t9_value = /*liEntry*/ ctx[0].date + "")) set_data_dev(t9, t9_value);

    			if (dirty & /*liEntry*/ 1 && a2_href_value !== (a2_href_value = /*liEntry*/ ctx[0].authlink)) {
    				attr_dev(a2, "href", a2_href_value);
    			}

    			if (dirty & /*liEntry*/ 1 && img2_alt_value !== (img2_alt_value = /*liEntry*/ ctx[0].title)) {
    				attr_dev(img2, "alt", img2_alt_value);
    			}

    			if (dirty & /*liEntry*/ 1 && !src_url_equal(img2.src, img2_src_value = /*liEntry*/ ctx[0].thumb)) {
    				attr_dev(img2, "src", img2_src_value);
    			}

    			if (dirty & /*liEntry*/ 1 && a6_href_value !== (a6_href_value = /*liEntry*/ ctx[0].link)) {
    				attr_dev(a6, "href", a6_href_value);
    			}

    			if (dirty & /*liEntry*/ 1 && a7_href_value !== (a7_href_value = /*liEntry*/ ctx[0].link)) {
    				attr_dev(a7, "href", a7_href_value);
    			}

    			if (dirty & /*liEntry*/ 1 && a8_href_value !== (a8_href_value = /*liEntry*/ ctx[0].link)) {
    				attr_dev(a8, "href", a8_href_value);
    			}

    			if (dirty & /*liEntry*/ 1 && a9_href_value !== (a9_href_value = /*liEntry*/ ctx[0].link)) {
    				attr_dev(a9, "href", a9_href_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div5);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('PostsIndividual', slots, []);
    	let { liEntry } = $$props;
    	const writable_props = ['liEntry'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<PostsIndividual> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('liEntry' in $$props) $$invalidate(0, liEntry = $$props.liEntry);
    	};

    	$$self.$capture_state = () => ({ liEntry });

    	$$self.$inject_state = $$props => {
    		if ('liEntry' in $$props) $$invalidate(0, liEntry = $$props.liEntry);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [liEntry];
    }

    class PostsIndividual extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { liEntry: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PostsIndividual",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*liEntry*/ ctx[0] === undefined && !('liEntry' in props)) {
    			console.warn("<PostsIndividual> was created without expected prop 'liEntry'");
    		}
    	}

    	get liEntry() {
    		throw new Error("<PostsIndividual>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set liEntry(value) {
    		throw new Error("<PostsIndividual>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/Posts.svelte generated by Svelte v3.50.0 */
    const file$2 = "src/components/Posts.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    // (13:12) {#each EntryList as liEntry}
    function create_each_block(ctx) {
    	let li;
    	let postsindividual;
    	let t;
    	let current;

    	postsindividual = new PostsIndividual({
    			props: { liEntry: /*liEntry*/ ctx[1] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			li = element("li");
    			create_component(postsindividual.$$.fragment);
    			t = space();
    			attr_dev(li, "class", "postcontainer");
    			add_location(li, file$2, 13, 16, 460);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			mount_component(postsindividual, li, null);
    			append_dev(li, t);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(postsindividual.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(postsindividual.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			destroy_component(postsindividual);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(13:12) {#each EntryList as liEntry}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let div;
    	let h4;
    	let t1;
    	let section;
    	let postscontrolbar;
    	let t2;
    	let ul;
    	let current;
    	postscontrolbar = new PostsCBar({ $$inline: true });
    	let each_value = /*EntryList*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div = element("div");
    			h4 = element("h4");
    			h4.textContent = "Posts from TravelToGeorgia";
    			t1 = space();
    			section = element("section");
    			create_component(postscontrolbar.$$.fragment);
    			t2 = space();
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(h4, "class", "postsheader svelte-nntvj5");
    			add_location(h4, file$2, 8, 4, 261);
    			attr_dev(ul, "class", "entrylist svelte-nntvj5");
    			add_location(ul, file$2, 11, 8, 380);
    			attr_dev(section, "class", "posts svelte-nntvj5");
    			add_location(section, file$2, 9, 4, 321);
    			attr_dev(div, "class", "postscontainer svelte-nntvj5");
    			add_location(div, file$2, 7, 0, 228);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h4);
    			append_dev(div, t1);
    			append_dev(div, section);
    			mount_component(postscontrolbar, section, null);
    			append_dev(section, t2);
    			append_dev(section, ul);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*EntryList*/ 1) {
    				each_value = /*EntryList*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(ul, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(postscontrolbar.$$.fragment, local);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(postscontrolbar.$$.fragment, local);
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(postscontrolbar);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Posts', slots, []);
    	let EntryList = EntriesJSON;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Posts> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		PostsControlBar: PostsCBar,
    		PostsIndividual,
    		EntriesJSON,
    		EntryList
    	});

    	$$self.$inject_state = $$props => {
    		if ('EntryList' in $$props) $$invalidate(0, EntryList = $$props.EntryList);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [EntryList];
    }

    class Posts extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Posts",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src/components/zFooter.svelte generated by Svelte v3.50.0 */

    const file$1 = "src/components/zFooter.svelte";

    function create_fragment$1(ctx) {
    	let div1;
    	let div0;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			div0.textContent = "© 2022 TTGeorgia, Inc. All rights reserved.";
    			attr_dev(div0, "class", "footer svelte-17tms9p");
    			add_location(div0, file$1, 1, 4, 34);
    			attr_dev(div1, "class", "footercontainer svelte-17tms9p");
    			add_location(div1, file$1, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ZFooter', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ZFooter> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class ZFooter extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ZFooter",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.50.0 */
    const file = "src/App.svelte";

    function create_fragment(ctx) {
    	let header;
    	let navigationbar;
    	let t0;
    	let newsbar;
    	let t1;
    	let main;
    	let pminfo;
    	let t2;
    	let posts;
    	let t3;
    	let footer1;
    	let footer0;
    	let current;
    	navigationbar = new Navigationbar({ $$inline: true });
    	newsbar = new Newsbar({ $$inline: true });
    	pminfo = new PMInfo({ $$inline: true });
    	posts = new Posts({ $$inline: true });
    	footer0 = new ZFooter({ $$inline: true });

    	const block = {
    		c: function create() {
    			header = element("header");
    			create_component(navigationbar.$$.fragment);
    			t0 = space();
    			create_component(newsbar.$$.fragment);
    			t1 = space();
    			main = element("main");
    			create_component(pminfo.$$.fragment);
    			t2 = space();
    			create_component(posts.$$.fragment);
    			t3 = space();
    			footer1 = element("footer");
    			create_component(footer0.$$.fragment);
    			add_location(header, file, 10, 0, 349);
    			attr_dev(main, "class", "svelte-1mj07z9");
    			add_location(main, file, 15, 0, 399);
    			attr_dev(footer1, "class", "svelte-1mj07z9");
    			add_location(footer1, file, 20, 0, 436);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, header, anchor);
    			mount_component(navigationbar, header, null);
    			append_dev(header, t0);
    			mount_component(newsbar, header, null);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, main, anchor);
    			mount_component(pminfo, main, null);
    			append_dev(main, t2);
    			mount_component(posts, main, null);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, footer1, anchor);
    			mount_component(footer0, footer1, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navigationbar.$$.fragment, local);
    			transition_in(newsbar.$$.fragment, local);
    			transition_in(pminfo.$$.fragment, local);
    			transition_in(posts.$$.fragment, local);
    			transition_in(footer0.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navigationbar.$$.fragment, local);
    			transition_out(newsbar.$$.fragment, local);
    			transition_out(pminfo.$$.fragment, local);
    			transition_out(posts.$$.fragment, local);
    			transition_out(footer0.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(header);
    			destroy_component(navigationbar);
    			destroy_component(newsbar);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(main);
    			destroy_component(pminfo);
    			destroy_component(posts);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(footer1);
    			destroy_component(footer0);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Navigationbar,
    		Newsbar,
    		PMInfo,
    		Posts,
    		Footer: ZFooter
    	});

    	return [];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    	//props: {
    	//	name: 'world'
    	//}
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
