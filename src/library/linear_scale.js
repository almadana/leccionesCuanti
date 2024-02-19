function linear_scale(minx, maxx, miny, maxy) {
  var a = (maxy-miny)/(maxx-minx);
  var b = miny-a*minx;
  return (x) => (a*x+b);
}

export {linear_scale}
