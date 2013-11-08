/*
 * Base form for all tools forms
 */

Ensembl.Panel.ToolsForm = Ensembl.Panel.ContentTools.extend({

  init: function() {

    var panel = this;

    this.base();

    // Form submit event
    this.elLk.form = this.el.find('form.tools_form').on('submit', function(event) {
      event.preventDefault();
      panel.toggleSpinner(true);

      panel.ajax($.extend({
        'url'       : this.action,
        'method'    : 'post',
        'complete'  : function() {
          this.toggleSpinner(false);
        }
      }, window.FormData === undefined ? {
        'iframe'      : true,
        'form'        : $(this)
      } : {
        'data'        : new FormData(this),
        'cache'       : false,
        'contentType' : false,
        'processData' : false
      }));
    });

    // Reset form button
    this.elLk.form.find('a._tools_form_reset').on('click', function(e) {
      e.preventDefault();
      panel.toggleSpinner(true);
      window.setTimeout(function() {
        panel.reset();
        panel.toggleSpinner(false);
      }, 100); // :(
    });
  },

  ticketSubmitted: function() {
  /*
   * Method called once ticket is successfully submitted via AJAX
   */
    Ensembl.EventManager.trigger('refreshActivitySummary');
    this.reset();
  },

  toggleSpinner: function(flag) {
  /*
   * Shows/hides the ensembl spinner on top of the form according to the flag
   */
    if (!this.elLk.overlayDiv) {
      var offset = this.elLk.form.offset();
      this.elLk.overlayDiv = $('<div class="form-overlay">').css({'left': offset.left, 'top': offset.top}).appendTo(document.body);
      this.elLk.spinnerDiv = this.elLk.overlayDiv.clone().prop('className', 'form-spinner spinner').appendTo(document.body);
    }
    this.elLk.overlayDiv.add(this.elLk.spinnerDiv).css(flag ? { 'height': this.elLk.form.height(), 'width': this.elLk.form.width() } : {}).toggle(flag);
  },

  reset: function() {
  /*
   * Reset the form
   */
    this.elLk.form[0].reset();
  },

  adjustDivsHeight: function() {
  /*
   * Adjusts heights of the selected divs according to the height of their current contents
   */
    this.elLk.adjustableDivs.clearQueue().each(function() {
      $(this).css({'minHeight': $(this).height()}).animate({'minHeight': 0}, '1000', 'easeInExpo', function() {
        $(this).css({'minHeight': $(this).height()});
      });
    });
  }
});

Ensembl.Panel.ToolsForm.SubElement = Base.extend({
/*
 * Base class for all sub elements
 */
  constructor: function() {
    this.elLk = {};
  },
  destructor: function() {
    var i;
    for (i in this.elLk) {
      this.elLk[i].remove();
      this.elLk[i] = null;
    }
    for (i in this) {
      this[i] = null;
    }
  }
});

Ensembl.Panel.ToolsForm.Dropdown = Ensembl.Panel.ToolsForm.SubElement.extend({ // TODO - modify the selectToToggle jQuery plugin to support this behaviour by default
/*
 *  No browser other than firefox allows to hide an option,
 *  so this class makes it easy to remove the options from a dropdown,
 *  and put them back in if needed.
 */
  constructor: function(el, panel) {
    this.el       = el;
    this.panel    = panel;
    this.children = this.el.children().clone();
  },

  reset: function() {
    var selectedValue = this.el.find('option:selected').val();
    this.el.empty().append(this.children.clone()).find('[value="' + selectedValue + '"]').prop('selected', true);
  },

  triggerSelectToToggle: function() {
    if (this.el.hasClass('_stt')) {
      this.el.selectToToggle('trigger');
      this.panel.adjustDivsHeight();
    }
  },

  removeDisabledOptions: function() {
    this.el.find('option:not(:enabled)').remove().end().find('optgroup:empty').remove();
  }
});

Ensembl.Panel.ToolsForm.SpeciesTag = Ensembl.Panel.ToolsForm.SubElement.extend({
  constructor: function(el, panel, existingTag, species) {
    var self = this;
    this.panel = panel;
    if (!el) {
      el = existingTag.el.clone().appendTo(existingTag.el.parent()).find('span').first().html(species.caption).end().end().find('input').val(species.value).end();
      el.css('backgroundImage', el.css('backgroundImage').replace(/[^\/]+\.png/, species.value + '.png'));
      this.species = species.value;
    } else {
      this.species = el.find('input').val();
    }
    this.el = el.find('span').last().on('click', function() {
      panel.elLk.speciesDropdown.find('input[value="' + self.species + '"]').prop('checked', false);
      panel.refreshSpecies();
    }).end().end();
  },

  disable: function(flag) {
    this.disabled = flag;
    this.el.toggleClass('disabled', flag);
  },

  remove: function() {
    this.el.remove();
    this.el = this.disabled = null;
  },

  setRemovable: function(flag) {
    this.el.find('span').last().toggle(flag);
  }
});
