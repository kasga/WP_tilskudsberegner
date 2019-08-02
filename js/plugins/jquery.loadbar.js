(function($){
    
    $.fn.loadbar = function(opt) {
        var options = $.extend({
            overlayClass: "loadbar-overlay",
            loadbarClass: "loading",
            percentageContainer: "loadbar-percentage",
            size: 64,
            lineWidth: 4,
            showPercentage: true,
            loadingTextClass: "loading-text",
            loadingText: "Loading...",
            strokeColor: "#fff"
        },opt);
        
        return this.each(function(){
            var $target = $(this);
            if (options.showPercentage) {
                var loadObject = $(
                    '<div class="' + options.overlayClass + '" style="display: none;">' +
                        '<canvas class="' + options.loadbarClass + '" width="' + options.size + '" height="' + options.size + '" />' +
                        '<div class="' + options.percentageContainer + '">' +
                            '<p><span class="value"></span>%</p>' +
                        '</div>' +
                    '</div>'
                );
            } else {
                var loadObject = $(
                    '<div class="' + options.overlayClass + '" style="display: none;">' +
                        '<canvas class="' + options.loadbarClass + '" width="' + options.size + '" height="' + options.size + '" />' +
                        '<div class="' + options.percentageContainer + '"></div>' +
                        '<div style="margin-top: ' + options.size/2 + 'px" class="' + options.loadingTextClass + '">' +
                            '<p>' + options.loadingText + '</p>' +
                        '</div>' +
                    '</div>'
                );
            }
            var value = 0,
                ie8 = document.all && !document.addEventListener ? true : false; // Checks if the browser is IE8 or below. The document.all is a IE only function, and document.addEventListener is only supported by IE9 and above.
            
            // Calculating degrees to radians
            var degreesToRadians = function(degrees) {
                return (degrees * Math.PI)/180;
            }
            
            // Function to draw the circle loadbar
            var drawSegment = function(canvas, context) {
                context.save();
                var lineWidth = options.lineWidth,
                    centerX = Math.floor(options.size / 2),
                    centerY = Math.floor(options.size / 2),
                    radius = Math.floor(options.size / 2) - lineWidth / 2;
            
                var startingAngle = degreesToRadians(0);
                var arcSize = degreesToRadians(360/100*value);
                var endingAngle = startingAngle + arcSize;
                
                context.translate(centerX, centerY);
                context.rotate(degreesToRadians(-90));
                context.translate(-centerX, -centerY);
                context.clearRect(0,0,options.size,options.size);
                context.beginPath();
                context.arc(centerX, centerY, radius, startingAngle, endingAngle, false);
                context.lineWidth = lineWidth;
                context.strokeStyle = options.strokeColor;
                context.stroke();
                context.restore();
            }
            
            // Function to hide and remove the loadbars
            var hideLoadbar = function() {
                $(loadObject).fadeOut(200, function() {
                    $(this).remove();
                });
            }
            
            // Appending the loadbar object to the target
            $(loadObject).appendTo($target);
            
            // Writing the value in the percentage box
            $target.find('.' + options.percentageContainer + ' .value').text(value);
            
            if (!ie8) {
                var $canvas = $target.find('.'+options.loadbarClass),
                    context = $canvas.get(0).getContext("2d");
                drawSegment($canvas, context);
            }
            
            $(loadObject).show();
            
            // Calculating the new value
            var interval = setInterval(function() {
                value += 1;
                if (options.showPercentage) {
                    $target.find('.' + options.percentageContainer + ' .value').text(value);
                }
                if (value === 100) {
                    clearInterval(interval);
                    hideLoadbar();
                }
                if (!ie8) {
                    drawSegment($canvas, context);
                }
            }, 10);
            
        });
    }
    
})(Orsted.jQuery.$);

jQuery.fn.loadbar = Orsted.jQuery.$.fn.loadbar;