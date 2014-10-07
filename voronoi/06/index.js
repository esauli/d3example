var map;　//　地図オブジェクト
var voloLayer; //ボロノイレイヤーオブジェクト


/*********************************************************
*  地図(leaflet.js)
*********************************************************/
//leaflet初期化
 function mapInit(){
	//Leaflet初期設定
	var lmap = L.mapbox.map('map', 'examples.map-i875mjb7');

	/*  osm タイル読み込み (今回mapboxタイルを使用)
	var lmap = L.mapbox.map('map');
	L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);
	*/
	
	lmap.setView([36.322356, 139.013057], 17);
	return lmap;
}


/*********************************************************
*  処理開始
*********************************************************/
main();

function main(){
	//マップ初期化
	map = mapInit();
	// オーバーレイレイヤ追加
	map._initPathRoot();
	var svg = d3.select("#map").select("svg");
	
	//ボロノイレイヤ―追加
	voloLayer = svg.append("g")
		.attr("class", "leaflet-zoom-hide")
		.attr("id", "voloLayer");
	
	url = "http://search.olp.yahooapis.jp/OpenLocalPlatform/V1/localSearch?";
	YOLPAppKey = "dj0zaiZpPXBLS3I1eWJ4cFBzeSZkPVlXazlSbEphWTAxS05USW1jR285TUEtLSZzPWNvbnN1bWVyc2VjcmV0Jng9ZWM-"; 
	url += "appid=" + YOLPAppKey;
	url += "&lat=36.322356";
	url += "&lon=139.013057";
	url += "&dist=5";
	url += "&output=json&callback=YOLPcallback&results=100";
	//url += "&query=%E3%83%A9%E3%83%BC%E3%83%A1%E3%83%B3";

	//xhrリクエスト送信
	d3.jsonp(url);	
				
}

/*********************************************************
*  YOLPからデータ取得後の処理
*********************************************************/
function  YOLPcallback(d){
	
	//取得したYOLPのデータを整形
	var shop = parseYOLPdata(d, map);	
	
	//wifi(YOLP)マーカー設置	
	shop.forEach(function(d, i){
		d.id = i;
		d.connected = Math.floor(Math.random() * 50);
		L.marker(d.latlng).addTo(map)
		.bindPopup(d.name)
	});
	
	
	volo(shop);	
	map.on("viewreset moveend", function(){
		d3.selectAll(".saitan").remove()
		volo(shop);	//ボロノイ図アップデート
	});
		
	var volonoi_toggle = function(){
		console.log(this.value)
		if(this.value === "true"){
			d3.selectAll(".volonoi").attr("stroke-opacity", 1)
		}else{
			d3.selectAll(".volonoi").attr("stroke-opacity", 0)			
		};
	}
	
	var elm = d3.selectAll('input[name=volonoi_togle]');
	elm.on("change", volonoi_toggle);    

	
}

/*********************************************************
*  ボロノイ図を描画
*********************************************************/
function volo(data){
	
	
	
	data.forEach(function(d){
		d.x = map.latLngToLayerPoint(d.latlng).x
		d.y = map.latLngToLayerPoint(d.latlng).y
	});

	//ボロノイジェネレーター
	var voronoi = d3.geom.voronoi()
		.x(function(d) { return d.x; })
		.y(function(d) { return d.y; });
	
	//ボロノイ変換関数
	var polygons = voronoi(data);
	polygons.forEach(function(v) { v.cell = v; });

	//前ボロノイPathを削除
	voloLayer.selectAll(".volonoi").remove();
	
	//path要素を追加
	voloLayer.selectAll("path")
		.data(polygons)
		.enter()
		.append("svg:path")
		.attr("class", "volonoi")
		.attr("id", function(d, i){
			return "volo"+ i;
		})
		.attr({
			"d": function(d) {
				if(!d) return null; 
				return "M" + d.cell.join("L") + "Z";
			},
			"stroke":"black",
			"fill":"white",
			"fill-opacity": 0
		})
		.on("click", function(d){		
			addCircle(d.point.x, d.point.y, 20);
			var mouseXY = d3.mouse(this);
			addLine(d.point.x, d.point.y, mouseXY[0], mouseXY[1])
			addCircle(mouseXY[0], mouseXY[1], 4);						
		});
		
		
	 var elm = document.querySelector('input[name=volonoi_togle]:checked');
	 console.log(elm.value)
		if(elm.value === "true"){
			d3.selectAll(".volonoi").attr("stroke-opacity", 1)
		}else{
			d3.selectAll(".volonoi").attr("stroke-opacity", 0)			
		};
		
		
}


/*********************************************************
*  円を地図上に描画
*********************************************************/
function addCircle(x, y, r){
		var circle = voloLayer.append("circle")
			.attr("class", "saitan")
			.attr({
				r:0
			})
			
		circle.transition().attr({
			"cx":x,
			"cy":y,
			"r":r,
			"fill": "none",
			"stroke": "red",
			"stroke-width":5
		});	
}

/*********************************************************
*  線を地図上に描画
*********************************************************/
function addLine(x1, y1, x2, y2){
		var line = voloLayer.append("line")
			.attr("class", "saitan")
			
		line.transition().attr({
			"x1":x1,
			"y1":y1,
			"x2":x2,
			"y2":y2,
			"stroke": "red",
			"stroke-width":5
		});	
}



/*********************************************************
*  データ整形
*********************************************************/

function parseYOLPdata(json){
	//ピクセル座標保存用
	var positions = [];

	console.log("YOLP HIT件数", json.Feature.length);
	
	//位置情報→座標変換
	json.Feature.forEach(function(d) {
		var yolpLatlng = d.Geometry.Coordinates.split(",");
		var latlng = new L.LatLng(yolpLatlng[1], yolpLatlng[0]);
		positions.push({
			"id": d.id,
			"name":d.Name,
			"address": d.Property.Address,
			latlng: latlng
		});
	});
	
	return positions;
	
}

function parseOverpass(json){
	//ピクセル座標保存用
	var positions = [];
	
	//位置情報→座標変換
	json.elements.forEach(function(d) {       		
		if(d.lat && d.lon) {		
			var latlng = new L.LatLng(d.lat, d.lon);
			positions.push({
				"name": "公衆トイレ",
				"address": "not found",
				latlng: latlng
			});
		}
	});	
	
	return positions;	
}