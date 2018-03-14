# oe-ui-misc

`oe-ui-misc` is collection of miscellaneous [oe-ui](https://github.com/EdgeVerve/oe-ui) Polymer components.

This repo contains the following elements
1. oe-hbox
2. oe-vbox
3. oe-markdown-link
4. oe-resource-link
5. oe-resource-page
6. oe-icons
7. oe-tap-emitter

### oe-hbox
`oe-hbox` displays content horizontally. child elements occupy their default width and wrap around when 'oe-hbox'
width is not sufficient.

### oe-vbox
`oe-vbox` displays content stacked vertically. The child elements occupy 100% width.

### oe-markdown-link
`oe-markdown-link` loads a mark-down file and displays as content. Uses Polymer's [marked-element](https://elements.polymer-project.org/elements/marked-element) for rendering. A wrapper is required since  [marked-element](https://elements.polymer-project.org/elements/marked-element) does not allow specifying a url.

### oe-resource-link
`oe-resource-link` loads a server resource like app-theme or CSS. Usage is similar to a html link tag, but possible need of authentication on `UIResource` record warranted special implementation.

### oe-resource-page
`oe-resource-page` loads a server resource and displays as a child. It is useful for displaying page-partials specially when stored as `UIResource` model. 

### oe-tap-emitter
`oe-tap-emitter` is a non-visual wrapper that emits the specified event when `content` element is tapped.