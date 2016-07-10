paper.install(window);
window.onload = function() {
  paper.setup('canvas');
  //dessine(205,30,64,15,30); // pièce 4 (la toute fine)
  //dessine(205,39,128,15,30);  // pièce 3 (la petite)
  dessine(205,39,80,15,30);  // pièce 3 - variante
  //dessine(205,83,187,15,30);  // pièce 2 (la moyenne)
  //dessine(205,155,235,15,30); // pièce 1 (la grande)
  paper.view.zoom = 472/133.2; // pour que 1 pixel mesure 1 milimètre après import dans inkscape
  var svg = project.exportSVG({ asString: true });
  saveSVG(svg,"dessin.svg");
}

function dessine(distance,grandRayonInterne,grandRayonExterne,petitRayonInterne,petitRayonExterne) {
  project.currentStyle = {
    strokeColor: '#00ff00',
    strokeWidth: 1
  }

  var centre1 = view.center.add(new Point(-distance/2,0));
  var centre2 = view.center.add(new Point( distance/2,0));

  if (grandRayonExterne >= (distance + petitRayonExterne)) {
    var grandRound = new Path.Circle({
        center: centre1,
        radius: grandRayonExterne
    });
  } else goutte(distance,centre1,grandRayonExterne,centre2,petitRayonExterne);

  project.currentStyle.strokeColor = '#ff0000';

  var grandTrou = new Path.Circle({
      center: centre1,
      radius: grandRayonInterne
  });
  var petitTrou = new Path.Circle({
      center: centre2,
      radius: petitRayonInterne
  });
}

function goutte(distance, centre1, rayon1, centre2, rayon2) {
  var grandCercle = new Path.Circle({
      center: centre1.add(centre2).divide(2),
      radius: distance/2,
      strokeColor: 'black'
  });

  var petitCercle = new Path.Circle({
      center: centre1,
      radius: rayon1-rayon2,
      strokeColor: 'black'
  });

  var intersections = grandCercle.getIntersections(petitCercle);
  grandCercle.remove();
  petitCercle.remove();
  var vecteurs = intersections.map( function(intersection) {
    return intersection.point.subtract(centre1).normalize(rayon2);
  });
  var pointA = intersections[0].point.add(vecteurs[0]),
      pointB = centre2.add(vecteurs[0]),
      pointC = intersections[1].point.add(vecteurs[1]),
      pointD = centre2.add(vecteurs[1]),
      pointE = centre1.add(new Point(-rayon1,0)),
      pointF = centre2.add(new Point( rayon2,0));
  new Path.Line(pointA, pointB);
  new Path.Line(pointC, pointD);
  new Path.Arc(pointA, pointE, pointC);
  new Path.Arc(pointB, pointF, pointD);
}

function saveSVG (svg, fileName) {
  var blob = new Blob([svg], {type: "image/svg+xml"}),
      url = window.URL.createObjectURL(blob),
      a = document.createElement("a");
  document.body.appendChild(a);
  a.style = "display: none";
  a.href = url;
  a.download = fileName;
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}
