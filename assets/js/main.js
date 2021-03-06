(function($) {

	var $window = $(window),
		$document = $(document),
		$body = $('body'),
		$header = $('#header'),
		$header2 = $('#header2'),
		$footer = $('#footer'),
		$main = $('#main'),
		settings = {

			// Parallax background effect?
				parallax: true,

			// Parallax factor (lower = more intense, higher = less intense).
				parallaxFactor: 20

		};

	// Breakpoints.
		breakpoints({
			xlarge:  [ '1281px',  '1800px' ],
			large:   [ '981px',   '1280px' ],
			medium:  [ '737px',   '980px'  ],
			small:   [ '481px',   '736px'  ],
			xsmall:  [ null,      '480px'  ],
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Touch?
		if (browser.mobile) {

			// Turn on touch mode.
				$body.addClass('is-touch');

			// Height fix (mostly for iOS).
				window.setTimeout(function() {
					$window.scrollTop($window.scrollTop() + 1);
				}, 0);

		}

	// Footer.
		breakpoints.on('<=medium', function() {
			$footer.insertAfter($main);
		});

		breakpoints.on('>medium', function() {
			$footer.appendTo($header);
		});

	// Header.

		// Parallax background.

			// Disable parallax on IE (smooth scrolling is jerky), and on mobile platforms (= better performance).
				if (browser.name == 'ie'
				||	browser.mobile)
					settings.parallax = false;

			if (settings.parallax) {

				breakpoints.on('<=medium', function() {

					$window.off('scroll.strata_parallax');
					$header.css('background-position', '');

				});

				breakpoints.on('>medium', function() {

					$header.css('background-position', 'left 0px');

					$window.on('scroll.strata_parallax', function() {
						$header.css('background-position', 'left ' + (-1 * (parseInt($window.scrollTop()) / settings.parallaxFactor)) + 'px');
					});

				});

				$window.on('load', function() {
					$window.triggerHandler('scroll');
				});

			}

	// Header2 navbar.
		// $document.ready(function() {
		// 	$window.scroll(function() {
		// 		$header2.css('top', $window.scrollTop());
		// 	});
		// });

	// Main Sections: Two.

		// Lightbox gallery.
			$window.on('load', function() {

				$('#two').poptrox({
					caption: function($a) { return $a.next('h3').text(); },
					overlayColor: '#2c2c2c',
					overlayOpacity: 0.85,
					popupCloserText: '',
					popupLoaderText: '',
					selector: '.work-item a.image',
					usePopupCaption: true,
					usePopupDefaultStyling: false,
					usePopupEasyClose: false,
					usePopupNav: true,
					windowMargin: (breakpoints.active('<=small') ? 0 : 50)
				});

			});





			(function () {
				'use strict';
				var SectionScroller = {
					anchorTops: [],
			
					el: {
						anchors: document.querySelectorAll('.anchor'),
						anchorLinks: document.querySelectorAll('.anchor-link')
					},
					
					forEach: function(array, callback, scope) {
						for (var i = 0, ii = array.length; i < ii; i++) {
							callback.call(scope, i, array[i]);
						}
					},
			
					throttle: function (fn, threshhold, scope) {
					  threshhold = threshhold || (threshhold = 250);
					  var last;
					  var deferTimer;
					  return function () {
						var context = scope || this;
						var now = +new Date();
						var args = arguments;
						if (last && now < last + threshhold) {
						  // hold on to it
						  clearTimeout(deferTimer);
						  deferTimer = setTimeout(function () {
							last = now;
							fn.apply(context, args);
						  }, threshhold);
						} else {
						  last = now;
						  fn.apply(context, args);
						}
					  };
					},
					
					mathSign: function (x) {
						x = +x; // convert to a number
						if (x === 0 || isNaN(x)) {
							return x;
						}
						return x > 0 ? 1 : -1;
					},
			
					anchorGetter: function () {
						var SS = SectionScroller;
						for (var i = 0, max = SS.el.anchors.length; i < max; i++) {
							SS.anchorTops[i] = SS.el.anchors[i].offsetTop;
						}
						for (var j = 0, jj = SS.anchorTops.length; j < jj; j++) {
							if (SS.anchorTops[j] - 1 < window.scrollY) {
								for (var x = 0, xx = SS.el.anchors.length; x < xx; x++) {
									SS.el.anchorLinks[x].classList.remove('selected');
								}
								SS.el.anchorLinks[j].classList.add('selected');
							}
						}
					},
					
					smooth: function (e) {
						var id = e.currentTarget.getAttribute('href');
						var node = document.querySelector(id);
						var nodeTop = node.offsetTop;
						var winTop = window.scrollY;
						var sign = SectionScroller.mathSign(nodeTop);
						var scrollAmnt;
						var down; 
						if (nodeTop > winTop) {
							down = true;
							scrollAmnt = nodeTop - winTop;
						} else {
							down = false;
							scrollAmnt = Math.abs(winTop - nodeTop);
						}
						
						var scroller = function () {
							if (down) {
								window.scrollTo(0, window.scrollY + 1);
							} else {
								window.scrollTo(0, window.scrollY - 1);
							}
							scrollAmnt--;
							if (scrollAmnt > 0)  {
								window.requestAnimationFrame(scroller);
							}
						};
						window.requestAnimationFrame(scroller);
						e.preventDefault();
					},
					
					smoothScroll: function(e) {
						var id = e.currentTarget.getAttribute('href');
						var node = document.querySelector(id);
						var scrollContainer = node;
						do { //find scroll container
							scrollContainer = scrollContainer.parentNode;
							if (!scrollContainer) return;
							scrollContainer.scrollTop += 1;
						} while (scrollContainer.scrollTop === 0);
			
						var targetY = 0;
						do { //find the top of target relatively to the container
							if (node == scrollContainer) break;
							targetY += node.offsetTop;
						} while (node === node.offsetParent);
			
						var scroll = function(c, a, b, i) {
							i++; if (i > 30) return;
							c.scrollTop = a + (b - a) / 30 * i;
							setTimeout(function(){ scroll(c, a, b, i); }, 20);
						};
						// start scrolling
						scroll(scrollContainer, scrollContainer.scrollTop, targetY, 0);
						e.preventDefault();
					},
			
					events: function () {
						var SS = SectionScroller;
						window.addEventListener('scroll', SS.throttle(SS.anchorGetter, 150));
						SS.forEach(SS.el.anchorLinks, function (index, link) {
							link.addEventListener('click', SS.smooth);
						});
					},
			
					init: function () {
						SectionScroller.anchorGetter();
						SectionScroller.events();
					}
				};
			
				SectionScroller.init();
			})();









})(jQuery);