if(!d3.geo2circle) d3.geo2circle = function(coordinates, radius) {

	//circle 生成用の変数
	var circle = [],
			length = 0,
			lengths = [length],
			polygon = d3.geom.polygon(coordinates),
			p0 = coordinates[0],
			p1,
			x,
			y,
			i = 0,
			n = coordinates.length;

	// coordinatesの前後間の距離を求める
	while (++i < n) {
		p1 = coordinates[i];
		//console.log(p1);
		x = p1[0] - p0[0];
		y = p1[1] - p0[1];
		lengths.push(length += Math.sqrt(x * x + y * y));
		p0 = p1;
	}

	var area = polygon.area(),
			radius = (radius) ? radius : Math.sqrt(Math.abs(area) / Math.PI),
			centroid = polygon.centroid(-1 / (6 * area)),
			angle,
			i = -1,
			k = 2 * Math.PI / lengths[lengths.length - 1];

	// 三角関数による円の描画
	while (++i < n) {
		angle =  lengths[i] * k;
		circle.push([
			centroid[0] + radius * Math.cos(angle),
			centroid[1] + radius * Math.sin(angle)
		]);
	}

	return circle;
};
