/* ============================================================
 * bootstrap-magic-button.js v1.0
 * https://github.com/sp4ke/bootstrap-magic-button
 * ============================================================
 * Copyright 2012 Chakib Benziane
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Modified work : bootstrap-button.js v2.0.2
 * Copyright 2012 Twitter, Inc.
 * ============================================================ */

!function( $ ){

  "use strict"

 /* BUTTON PUBLIC CLASS DEFINITION
  * ============================== */

  var MagicBtn = function ( element, options ) {
    this.$element = $(element)
	
	// The parent Div
	this.$parentDiv = $(element).closest('div')
	this.$parentHeight = this.$parentDiv.outerHeight()
	this.$parentWidth = this.$parentDiv.outerWidth()
	this.$parentPosition = this.$parentDiv.position();
    this.options = $.extend({}, $.fn.magicBtn.defaults, options)
	
	// Store number of buttons on parent div
	if (!this.$parentDiv.data('nbMagicBtns'))
		this.$parentDiv.data('nbMagicBtns', 1)
	else
		this.$parentDiv.data().nbMagicBtns++;
		
	// Store the current button number
	this.$currentBtnNb = this.$parentDiv.data('nbMagicBtns')
	
	// store the currunt button size
	this.$height = this.$element.outerHeight() + this.options.betweenSpace / 2
	this.$width = this.$element.outerWidth()
	
	// current button image and toggle image if there is
	this.$imgUrl = 'url("' + this.$element.data('image') + '")'
	var toggleimg
	if (toggleimg = this.$element.data('toggle-image')) 
		this.$toggleImgUrl = 'url("' + toggleimg + '")'
	else
		this.$toggleImgUrl = this.$imgUrl
		
	
	this.$isToggled = false
	}
	
  MagicBtn.prototype = {

      constructor: MagicBtn
	
	// state is the option recieved from jQuery plugin
    , setState: function ( state ) {
        var d = 'disabled'
          , $el = this.$element
          , data = $el.data()
          , val = $el.is('input') ? 'val' : 'html'

        state = state + 'Text'
        data.resetText || $el.data('resetText', $el[val]())

        $el[val](data[state] || this.options[state])

        // push to event loop to allow forms to submit
        setTimeout(function () {
          state == 'loadingText' ?
            $el.addClass(d).attr(d, d) :
            $el.removeClass(d).removeAttr(d)
        }, 0)
      }
	  
	, calculatePosition: function(direction) {
		var space = (this.$currentBtnNb === 1) ?  0 : this.options.betweenSpace
		var left = this.$parentPosition.left + this.$parentWidth
		switch (this.options.alignement) {
			case 'top':
				this.$top = (this.$currentBtnNb * this.$height) - this.$height + this.$parentPosition.top + (space * (this.$currentBtnNb - 1))
				break;
			case 'center':
				{	
					if (this.$currentBtnNb === 1)
					{
						this.$top = (this.$parentHeight / 2) - (this.$height / 2) + this.$parentPosition.top 
						this.$parentDiv.data('top-space', this.$parentHeight / 2 - (this.$height /2))
						this.$parentDiv.data('bottom-space', this.$parentHeight / 2 - (this.$height /2))
					}
					else if (this.$currentBtnNb % 2 === 0) {
						this.$top = this.$parentDiv.data('top-space') - (this.$height) + this.$parentPosition.top 
						this.$parentDiv.data('top-space', this.$parentDiv.data('top-space') - this.$height )
					}
					
					else {
						this.$top = this.$parentHeight - this.$parentDiv.data('bottom-space') + this.$parentPosition.top 
						this.$parentDiv.data('bottom-space', this.$parentDiv.data('bottom-space') - this.$height )
					}
					break;
						
				}
				
		}
		
		this.$left = this.$parentPosition.left + this.$parentWidth
	}
	
	, show: function() {
		var $o = this.options
		this.$element.css({
			top: this.$top,
			left: this.$left,
			'background-image': this.$imgUrl,
		}).show()
	}
	
	, hide: function() {
		this.$element.hide()
	}

    , toggle: function () {
		var $el = this.$element
		$el.toggleClass('magicBtn-active')
		if (!this.$isToggled) {
			$el.css('background-image', this.$toggleImgUrl)
			this.$isToggled = true
		}
		else {
			$el.css('background-image', this.$imgUrl)
			this.$isToggled = false
		}	
      }

  }


 /* BUTTON PLUGIN DEFINITION
  * ======================== */

  $.fn.magicBtn = function ( option ) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('magicBtn')
        , options = typeof option == 'object' && option
      if (!data) $this.data('magicBtn', (data = new MagicBtn(this, options)))
	  data.calculatePosition('right')
      if (option == 'toggle') data.toggle()
	  if (option == 'show') data.show()
	  if (option == 'hide') data.hide()
      else if (option) data.setState(option)
	  
    })
  }

  $.fn.magicBtn.defaults = {
    loadingText: 'loading...',
	direction: 'right',
	betweenSpace: 2,
	alignement: 'top'
  }

  $.fn.magicBtn.Constructor = MagicBtn


 /* BUTTON DATA-API
  * =============== */

  $(function () {
    $('body').on('click.magicBtn.data-api', '[data-toggle^=magicBtn]', function ( e ) {
      var $btn = $(e.target)
      if (!$btn.hasClass('magicBtn')) $btn = $btn.closest('.magicBtn')
      $btn.magicBtn('toggle')
    })
  })

}( window.jQuery );