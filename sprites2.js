/*
  Sprites2: animated CSS Sprites based navigation bars.
  
  Based on original A List Apart article by Dave Shea - http://www.alistapart.com/articles/sprites2
  
  version:	1.0
  released: February 18, 2009
  author: gonchuki
  url: http://blog.gonchuki.com
  
  This work is licensed under a Creative Commons Attribution-Share Alike 3.0 License.
    http://creativecommons.org/licenses/by-sa/3.0/
*/

var Sprites2 = new Class({
  Implements: [Options],
  
  options: {
    item_selector: 'ul.nav a',
    mode: 'fade',
    duration: 250
  },
  
  initialize: function(options) {
    this.setOptions(options);
    var self = this;
    
    document.getElements(self.options.item_selector).each(function(item) {
      var li = item.getParent('li');
      
      var fx_element = new Element('div', {
        'class': 'effect',
        'tween': { duration: self.options.duration }
      }).inject(li, 'top');
      
      self.effects[self.options.mode].call(self, fx_element);
      item.addEvents({
        mouseover: function() { if (!li.hasClass('current')) self.show_fn(fx_element); },
        mouseout: function() { if (!li.hasClass('current')) { self.hide_fn(fx_element); fx_element.removeClass('mousedown') }; },
        mousedown: function() { fx_element.addClass('mousedown'); },
        mouseup: function() { fx_element.removeClass('mousedown'); },
        mouseleave: function() { fx_element.removeClass('mousedown'); }
      });
      
      if (!li.hasClass('current')) item.setStyle('background', 'none');
    });
  },
  
  effects: {
    fade: function(fx_element) {
      fx_element.fade('hide');
      
      this.show_fn = function(fx_element) { fx_element.fade('in'); };
      this.hide_fn = function(fx_element) { fx_element.fade('out'); };
    },
  
    slide: function(fx_element) {
      fx_element.store('height', fx_element.getSize().y).setStyle('height', 0);
      
      this.show_fn = function(fx_element) { fx_element.tween('height', fx_element.retrieve('height')); };
      this.hide_fn = function(fx_element) { fx_element.tween('height', 0); };
    },
  
    animate: function(fx_element) {
      fx_element.setStyles({'height': 0, 'top': fx_element.retrieve('height', fx_element.getSize().y), 'opacity': 0})
                .set('morph', {
                  'duration': this.options.duration / 2,
                  'onComplete': function() { if (fx_element.getSize().y == 0) fx_element.setStyles({'top': fx_element.retrieve('height'), 'opacity': 0}); }
                });
      
      this.show_fn = function(fx_element) { fx_element.morph({'height': fx_element.retrieve('height'), 'top': 0, 'opacity': 1}); };
      this.hide_fn = function(fx_element) { fx_element.morph({'height': 0, 'opacity': 0.5}); };
    }
  }
});