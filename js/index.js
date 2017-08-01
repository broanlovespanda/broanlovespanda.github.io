paper.install(window);
var SQRT_3 = Math.pow(3, 0.5);
var triangle, D, mousePos, position;
var count = 75;

backgroundColorsHex = ['#145051', '#9BA2FF', '#00B9AE', '#23C9FF', '#8DA9C4'];
backgroundColors = [];

for(var i=0; i<backgroundColorsHex.length; i++) {
  rgbColor = new Color(backgroundColorsHex[i]);
  hueColor = rgbColor.convert('hsb')
  backgroundColors.push(hueColor)
}

currentColorSpot = 0
currentColor = backgroundColors.pop()
nextColor = backgroundColors.pop()

var xRatio = .52
var yRatio = .48

window.onload = function() {
  paper.setup('space');

  D = Math.max(paper.view.getSize().width, paper.view.getSize().height);

  mousePos = paper.view.center.add([view.bounds.width / 3, 100]);
  position = paper.view.center;

  // Draw the BG
  var background = new Path.Rectangle(view.bounds);
  background.fillColor = '#145051';

  mousePos.x = xRatio*paper.view.getSize().width;
  mousePos.y = yRatio*paper.view.getSize().height;

  // height 729
  // width 1440
  buildStars();

  paper.view.draw();

  paper.view.onFrame = function(event) {
    position = position.add( (mousePos.subtract(position).divide(10) ) );
    var vector = (view.center.subtract(position)).divide(10);
    moveStars(vector.multiply(3));

    if (parseInt(background.fillColor.hue) != parseInt(nextColor.hue)) {
      background.fillColor.hue += .3;
    } else {
      backgroundColors.push(currentColor)
      currentColor = nextColor
      nextColor = backgroundColors.pop()

    }
  };
};



// ---------------------------------------------------
//  Helpers
// ---------------------------------------------------
window.onresize = function() {
  project.clear();
  D = Math.max(paper.view.getSize().width, paper.view.getSize().height);
  // Draw the BG
  var background = new Path.Rectangle(view.bounds);
      background.fillColor = '#3B3251';
  buildStars();

  mousePos.x = xRatio*paper.view.getSize().width;
  mousePos.y = yRatio*paper.view.getSize().height;
};

var random = function(minimum, maximum) {
  return Math.round(Math.random() * (maximum - minimum) + minimum);
};

var map = function (n, start1, stop1, start2, stop2) {
  return (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;
};

// ---------------------------------------------------
//  Stars (from paperjs.org examples section)
// ---------------------------------------------------
// window.onmousemove = function(event) {
//   mousePos.x = event.x;
//   mousePos.y = event.y;
//
// };

var buildStars = function() {
  // Create a symbol, which we will use to place instances of later:
  var path = new Path.Circle({
    center: [0, 0],
    radius: 5,
    fillColor: 'white',
    strokeColor: 'white'
  });

  var symbol = new Symbol(path);

  // Place the instances of the symbol:
  for (var i = 0; i < count; i++) {
    // The center position is a random point in the view:
    var center = Point.random().multiply(paper.view.size);
    var placed = symbol.place(center);
    placed.scale(i / count + 0.01);
    placed.data = {
      vector: new Point({
        angle: Math.random() * 360,
        length : (i / count) * Math.random() / 5
      })
    };
  }

  var vector = new Point({
    angle: 45,
    length: 0
  });
};

var keepInView = function(item) {
  var position = item.position;
  var viewBounds = paper.view.bounds;
  if (position.isInside(viewBounds))
    return;
  var itemBounds = item.bounds;
  if (position.x > viewBounds.width + 5) {
    position.x = -item.bounds.width;
  }

  if (position.x < -itemBounds.width - 5) {
    position.x = viewBounds.width;
  }

  if (position.y > viewBounds.height + 5) {
    position.y = -itemBounds.height;
  }

  if (position.y < -itemBounds.height - 5) {
    position.y = viewBounds.height
  }
};

var moveStars = function(vector) {
  // Run through the active layer's children list and change
  // the position of the placed symbols:
  var layer = project.activeLayer;
  for (var i = 1; i < count + 1; i++) {
    var item = layer.children[i];
    var size = item.bounds.size;
    var length = vector.length / 10 * size.width / 10;
    item.position = item.position.add( vector.normalize(length).add(item.data.vector));
    keepInView(item);
  }
};

// Smooth Scrolling javascript taken from: http://stackoverflow.com/questions/7717527/jquery-smooth-scrolling-when-clicking-an-anchor-link
var $root = $('html, body');
$('a').click(function() {
    $root.animate({
        scrollTop: $( $.attr(this, 'href') ).offset().top
    }, 500);
    return false;
});

$(window).bind('scroll', function() {
  var navHeight = $(window).height() - 400;
  if ($(window).scrollTop() > navHeight) {
    $('.navbar-default').addClass('on');
  } else {
    $('.navbar-default').removeClass('on');
  }
});
