var React = require('react')
var TokenInput = require('react-tokeninput')
var ComboboxOption = require('react-tokeninput').Option

var without = require('lodash-node/modern/arrays/without')
var uniq = require('lodash-node/modern/arrays/uniq')
var names = require('./names')

var App = React.createClass({displayName: 'App',
  getInitialState: function() {
    return {
      selected: [],
      options: names
    };
  },

  handleChange: function(value) {
    this.setState({
      selected: value
    })
  },

  handleRemove: function(value) {
    var selectedOptions = uniq(without(this.state.selected,value))
    this.handleChange(selectedOptions)
  },

  handleSelect: function(value, combobox) {
    if(typeof value === 'string') {
      value = {id: value, name: value};
    }

    var selected = uniq(this.state.selected.concat([value]))
    this.setState({
      selected: selected,
      selectedToken: null
    })

    this.handleChange(selected)
  },

  handleInput: function(userInput) {
    // this.setState({selectedStateId: null});
    this.filterTags(userInput);
  },

  filterTags: function(userInput) {
    if (userInput === '')
      return this.setState({options: []});
    var filter = new RegExp('^'+userInput, 'i');
    this.setState({options: names.filter(function(state) {
      return filter.test(state.name) || filter.test(state.id);
    })});
  },

  renderComboboxOptions: function() {
    return this.state.options.map(function(flavor) {
      return (
        ComboboxOption({
          key: flavor.id,
          value: flavor
        }, flavor.name)
      );
    });
  },

  render: function() {
    var selectedFlavors = this.state.selected.map(function(tag) {
      return React.DOM.li({key: tag.id}, tag.name)
    })

    var options = this.state.options.length ?
      this.renderComboboxOptions() : [];

    return (
      React.DOM.div(null,
        React.DOM.h1(null, "React TokenInput Example"),

        TokenInput({
            onChange: this.handleChange,
            onInput: this.handleInput,
            onSelect: this.handleSelect,
            onRemove: this.handleRemove,
            selected: this.state.selected,
            menuContent: options}),

        React.DOM.h2(null, "Selected"),
        React.DOM.ul(null,
          selectedFlavors
        )
      )
    );
  }
})

React.renderComponent(App(null), document.body)
