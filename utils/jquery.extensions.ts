/* eslint-disable object-shorthand */
import $ from 'jquery'

$.fn.extend({
  button: function (action: 'loading' | 'reset'): void {
    const $this = $(this)
    const loadingText = $this.data('loading-text')
    const originalText = $this.data('original-text') ?? $this.html()

    if (action === 'loading' && $this.html() !== loadingText) {
      $this.data('original-text', originalText)
      $this.prop('disabled', true)
      $this.html(loadingText)
      return
    }

    if (action === 'reset' && $this.html() !== originalText) {
      $this.html(originalText)
      $this.prop('disabled', false)
    }
  },
})
