(function() {
    var body = document.querySelector('body')
    var menuTrigger = document.querySelector('#toggle-main-menu-mobile');
    var menuContainer = document.querySelector('#main-menu-mobile');

    if (menuTrigger && menuContainer) {
        menuTrigger.onclick = function() {
            menuContainer.classList.toggle('open');
            menuTrigger.classList.toggle('is-active')
            body.classList.toggle('lock-scroll')
        }
    }

    function trackAnalyticsEvent(eventName, params) {
        if (typeof window.gtag !== 'function') {
            return false;
        }

        window.gtag('event', eventName, params || {});
        return true;
    }

    function trackGumroadClicks() {
        var gumroadButtons = document.querySelectorAll('[data-analytics-event="gumroad_button_click"]');

        Array.prototype.forEach.call(gumroadButtons, function(button) {
            button.addEventListener('click', function(event) {
                var linkUrl = button.href;
                var shouldNavigateAfterTracking = linkUrl &&
                    !event.defaultPrevented &&
                    !event.metaKey &&
                    !event.ctrlKey &&
                    !event.shiftKey &&
                    !event.altKey &&
                    event.button === 0 &&
                    !button.target;
                var eventParams = {
                    event_category: 'engagement',
                    event_label: button.getAttribute('data-analytics-location') || 'gumroad',
                    link_text: (button.textContent || '').trim(),
                    link_url: linkUrl,
                    outbound: true,
                    transport_type: 'beacon'
                };
                var hasGtag = typeof window.gtag === 'function';
                var hasNavigated = false;

                if (!hasGtag) {
                    return;
                }

                if (shouldNavigateAfterTracking) {
                    event.preventDefault();

                    var continueNavigation = function() {
                        if (hasNavigated) {
                            return;
                        }

                        hasNavigated = true;
                        window.location.href = linkUrl;
                    };

                    eventParams.event_callback = continueNavigation;
                    eventParams.event_timeout = 1000;
                    trackAnalyticsEvent('gumroad_button_click', eventParams);
                    window.setTimeout(continueNavigation, 1000);
                    return;
                }

                trackAnalyticsEvent('gumroad_button_click', eventParams);
            });
        });
    }

    function initSubscribeForm() {
        var form = document.querySelector('#subscribeForm form');
        if (!form) {
            return;
        }

        var emailInput = form.querySelector('input[name="email"]');
        var status = form.querySelector('.subscribe-status');
        var submitButton = form.querySelector('button[type="submit"]');

        function setStatus(message, isError) {
            if (!status) {
                return;
            }
            status.textContent = message;
            status.style.color = isError ? '#b00020' : '#1f5d3d';
        }

        function setLoading(isLoading) {
            if (submitButton) {
                submitButton.disabled = isLoading;
            }
        }

        form.addEventListener('submit', function(event) {
            event.preventDefault();

            if (!emailInput) {
                return;
            }

            var email = emailInput.value.trim();
            if (!email || !emailInput.checkValidity()) {
                setStatus('Please enter a valid email address.', true);
                emailInput.focus();
                return;
            }

            setLoading(true);
            setStatus('Submitting…', false);

            fetch('https://readmore-two.vercel.app/api/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    source: 'landing'
                })
            }).then(function(response) {
                if (response.status === 201) {
                    window.location.href = 'https://readmore-two.vercel.app/login';
                    return;
                }
                return response.json().then(function(body) {
                    var errorMessage = body && body.error ? body.error : 'Subscription failed. Please try again.';
                    throw new Error(errorMessage);
                });
            }).catch(function(error) {
                setLoading(false);
                setStatus(error.message || 'Subscription failed. Please try again.', true);
            });
        });
    }

    function getVideoUrl(video) {
        var source = video.querySelector('source');

        return video.currentSrc || video.src || (source && source.src) || '';
    }

    function trackVideoEvents() {
        var videos = document.querySelectorAll('[data-analytics-video-title]');

        Array.prototype.forEach.call(videos, function(video) {
            var title = video.getAttribute('data-analytics-video-title');
            var progressMilestones = [25, 50, 75];
            var sentMilestones = {};
            var hasStarted = false;

            function videoParams(extraParams) {
                var params = {
                    video_title: title,
                    video_url: getVideoUrl(video)
                };

                Object.keys(extraParams || {}).forEach(function(key) {
                    params[key] = extraParams[key];
                });

                return params;
            }

            function trackVideoStart() {
                if (hasStarted) {
                    return;
                }

                hasStarted = true;
                trackAnalyticsEvent('video_start', videoParams({
                    video_duration: Math.round(video.duration || 0)
                }));
            }

            video.addEventListener('play', function() {
                trackVideoStart();
            });

            video.addEventListener('timeupdate', function() {
                if (!video.duration) {
                    return;
                }

                var percentPlayed = Math.floor((video.currentTime / video.duration) * 100);

                progressMilestones.forEach(function(milestone) {
                    if (percentPlayed >= milestone && !sentMilestones[milestone]) {
                        sentMilestones[milestone] = true;
                        trackAnalyticsEvent('video_progress', videoParams({
                            video_percent: milestone
                        }));
                    }
                });
            });

            video.addEventListener('pause', function() {
                if (video.ended) {
                    return;
                }

                trackAnalyticsEvent('video_pause', videoParams({
                    video_current_time: Math.round(video.currentTime || 0)
                }));
            });

            video.addEventListener('ended', function() {
                trackAnalyticsEvent('video_complete', videoParams({
                    video_percent: 100
                }));
            });

            if (!video.paused || video.currentTime > 0) {
                trackVideoStart();
            }
        });
    }

    trackGumroadClicks();
    initSubscribeForm();
    trackVideoEvents();
})();
