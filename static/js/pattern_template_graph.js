function draw_all_landing_page_pattern_links(datafile) {
	$.getJSON( datafile, function( data ) {
		role = "all";
		cssid = role + "links";
		document.getElementById(cssid).innerHTML = 
			"<h3 style='text-transform: capitalize;'>Landing Page pattern: " + role + " Links</h3>";
		graph_elements = generate_landing_page_graph_elements(data, role);
		draw_landing_page_pattern(graph_elements, cssid);
	});

}

function draw_all_separate_landing_page_patterns(data) {
	/*$.getJSON( datafile, function( data ) {*/
	
		var roles = [ "identifier", "collection", "lateral", "type" ];
	
		for (role of roles) {
			cssid = role + "links";
	
			document.getElementById(cssid).innerHTML = 
				"<h3 style='text-transform: capitalize;'>" + role + " Links</h3>";
	
			graph_elements = generate_landing_page_graph_elements(data, role);
			draw_landing_page_pattern(graph_elements, cssid);
	
		}
	
	
	/*});*/
}

function draw_landing_page_pattern(elements, domid) {
	var cy = cytoscape({
		container: document.getElementById(domid),

    		boxSelectionEnabled: false,
    		autounselectify: true,

		layout: {
			name: 'preset',
			padding: 5
		},

		style: cytoscape.stylesheet()
			.selector('node')
				.css({
					'content': 'data(label)',
					'text-valign': 'center',
					'text-halign': 'center',
					'padding-top': '10px',
					'padding-bottom': '10px',
					'padding-left': '10px',
					'padding-right': '10px',
					'background-color': 'data(nodeColor)',
					'color': 'data(nodeTextColor)',
					'shape': 'ellipse',
					'width': 'data(nodeWidth)'
				})
			.selector('edge')
				.css({
					'width': 2,
					'target-arrow-shape': 'triangle',
					'line-color': 'data(edgeColor)',
					'target-arrow-color': 'data(edgeColor)'
				})
			.selector('edge.unbundled-bezier')
				.css({
					'curve-style': 'data(curveStyle)',
					'control-point-distances': 'data(curveDist)',
					'control-point-weights': 'data(curveWeight)'
				}),

		elements: elements,

	});

	cy.zoomingEnabled(false);

	//cy.resize();

}

function generate_landing_page_graph_elements(data, graphtype) {

	var graph_elements = {
		nodes: [],
		edges: []
	}

	var y_position_map = {
		"doi" : 0,
		"canonical": 150,
		"landing": 300,
		"publication": 300,
		"type": 450
	}

	var x_position_map = {
		"doi": 100,
		"canonical": 100,
		"landing": 0,
		"publication": 100,
		"type": 100
	}

	var labels = {
		"doi": "DOI",
		"canonical": "CAN",
		"landing": "LP",
		"publication": "PUB"
	}

	var nodecolors = {
		"doi": "#D7D27F",
		"canonical": "#FE817E",
		"landing": "#CC3A34",
		"publication": "#BFC1C1",
		"type": "#C4FEFF"
	}

	var nodetextcolors = {
		"doi": "#000000",
		"canonical": "#000000",
		"landing": "#ffffff",
		"publication": "#000000",
		"type": "#000000"
	}

	var nodewidth = {
		"doi": "50px",
		"canonical": "50px",
		"landing": "50px",
		"publication": "50px",
		"type": "300px"
	}

	var edgecolors = {
		"type": "#18A447",
		"collection": "#4257D3",
		"identifier": "#C84945",
		"lateral": "#000000"
	}

	var curvestyle = {
		"type": "unbundled-bezier",
		"collection": "unbundled-bezier",
		"identifier": "unbundled-bezier",
		"lateral": "unbundled-bezier"
	}

	var curveweights = {
		"identifier": 2.1,
		"type": -0.9,
		"collection": -0.1,
		"lateral": 0.0
	}

	var curvedist = {
		"identifier": 188,
		"type": 120,
		"collection": 120,
		"lateral": 120
	}

	var graphdata = null;

	for (item of data["graph"]) {
		if (item["type"] == "landing") {
			graphdata = item;
			break;
		}
	}

	rolecounter = {};

	for ( node of graphdata["nodes"] ) {
		role = node["role"]

		if ( role in rolecounter ) {
			rolecounter[role]++;
		} else {
			rolecounter[role] = 1;
		}
	}

	roleinc = {};

	for (role in rolecounter) {
		roleinc[role] = 200 / rolecounter[role];
	}

	for ( node of graphdata["nodes"] ) {

		role = node["role"];

		width = nodewidth[role];

		posy = y_position_map[role];

		/* 
		 * if there is more than one item at this layer, we need to space them out
		 * we leave space for the landing page, even though it may not be there
		 */

		if ( role == "type" ) {
			if (roleinc[role]== 200) {
				posx = x_position_map[role];
			} else {
				posx = 120 * rolecounter[role];
				console.log(rolecounter[role]);
				console.log(posy);
				/* messy, I know there are only 2 possible types, hence the 3 */
				posy = posy + (50 * Math.abs(3 - rolecounter[role]));
				console.log(posy);

				rolecounter[role]--;
			}
			
		} else {
			if (roleinc[role]== 200) {
				posx = x_position_map[role];
			} else {
				posx = 120 * rolecounter[role];

				rolecounter[role]--;
			}
		}


		if ( role == "type" ) {
			label = node["url"];
		} else {
			label = labels[role];
		}

		nodedata = {
			data: {
				id: node["id"], 
				label: label,
			        nodeColor: nodecolors[role],
				nodeTextColor: nodetextcolors[role],
				nodeWidth: nodewidth[role]
				},
			position: {
				x: posx,
				y: posy
			},
	       		type: 'unbundled-bezier'
		};

		graph_elements["nodes"].push(nodedata);
	}

	for ( edge of graphdata["edges"] ) {

		role = edge["role"];

		if ( ( role == graphtype ) || ( graphtype == "all" ) ) {

			edgeid = edge["source"] + edge["target"]
	
			edgedata = {
			       	data: {
					id: edgeid, 
					source: edge["source"], 
					target: edge["target"],
					edgeColor: edgecolors[role],
					curveStyle: curvestyle[role],
					curveWeight: curveweights[role],
					curveDist: curvedist[role]
			       	},
				classes: 'unbundled-bezier'
		       	};
	
			graph_elements["edges"].push(edgedata);
		}
	}

	console.log(graph_elements);

	return graph_elements;

}


