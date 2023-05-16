var relcolors = {
    'item': '#999999',
    'collection': '#4257D3',
    'identifier': '#C84945',
    'type': '#18A447',
    'describes': '#999999',
    'describedby': '#C84945',
    'HTTP_redirect': '#000000'
}

var reldashes = {
    'item': '',
    'collection': '',
    'identifier': '',
    'type': '',
    'describedby': '',
    'describes': '',
    'HTTP_redirect': '5,5'
}

var rel_legend_text = {
    'item': 'rel="item"',
    'collection': 'rel="collection"',
    'identifier': 'rel="identifier"',
    'alternate': 'rel="alternate"',
    'describedby': 'rel="describedby"',
    'describes': 'rel="describes"',
    'type': 'rel="type"',
    'HTTP_redirect': 'HTTP redirect'
}

var node_data = {
    'metadata': {
        'doi': {
            'position': [ 190, 11 ],
        },
        'entry': {
            'position': [ 190, 91 ]
        },
        'landing': {
            'position': [ 190, 91 ]
        },
        'type' : {
            'position': [ 28, 231 ]
        },
        'bibliographic' : {
            'position': [ 190, 161 ]
        }
    },
    'identifier': {
        'doi': {
            'position': [ 190, 11 ],
        },
        'entry': {
            'position': [ 190, 91 ]
        },
        'landing': {
            'position': [ 190, 91 ]
        },
        'publication': {
            'position': [ 190, 161 ]
        },
        'supplemental': {
            'position': [ 180, 161 ]
        }
    },
    'boundary': {
        'entry': {
            'position': [ 190, 11 ]
        },
        'landing': {
            'position': [ 190, 11 ]
        },
        'publication': {
            'position': [ 190, 91 ]
        },
        'supplemental': {
            'position': [ 180, 91 ]
        }
    }    
}

var graph_to_relations = {
    'landing_all': [ 'HTTP_redirect', 'identifier', 'item', 
        'collection', 'type'],
    'bibliographic_all': [ 'HTTP_redirect', 'identifier', 'item', 
        'collection', 'type'],
    'identifier': [ 'HTTP_redirect', 'identifier', ],
    'boundary': [ 'HTTP_redirect', 'item', 'collection' ],
    'alternate' : [ 'HTTP_redirect', 'alternate' ],
    'type': [ 'HTTP_redirect', 'type' ],
    'metadata': [ 'HTTP_redirect', 'describes', 'describedby' ],
    'nodesonly': [ 'HTTP_redirect']
}

var graphtype_node_roles_to_skip = {
    'nodesonly': [ 'type' ]
}

var graphtype_draw_legend = {
    'identifier': true,
    'boundary': true,
    'alternate': true,
    'type': true,
    'metadata': true,
    'nodesonly': true
}

var reltype_to_positions = {
    'HTTP_redirect': [ 'bottom', 'top' ],
    'identifier': [ 'bottom', 'right' ],
    'item': [ 'left', 'top' ],
    'collection': [ 'bottom', 'right' ],
    'alternate': [ 'top', 'top' ],
    'describes': ['top', 'right'],
    'describedby': ['left', 'bottom'],
    'type':  {
        'info:eu-repo/semantics/humanStartPage': [ 'right', 'right' ],
        'http://purl.org/eprint/type/ScholarlyText': [ 'bottom', 'top' ],
        'info:eu-repo/semantics/objectFile': [ 'top', 'left' ],
        'info:eu-repo/semantics/dataset': [ 'top', 'left' ],        
        'info:eu-repo/semantics/descriptiveMetadata': [ 'bottom', 'top' ]
     }
}

var sidelabel_data = {
    'boundary' : {
        'Entry Page\nURI' : {
            'position': [ 300, 25 ],
            'font-size': 13
        },    
        'Publication\nResources' : {
            'position': [ 300, 106 ],
            'font-size': 13
        },
    },
    'metadata' : {
        'Identifying\nURI': {
            'position': [ 300, 25 ],
            'font-size': 13
        },    
        'Entry Page\nURI' : {
            'position': [ 300, 106 ],
            'font-size': 13
        },    
        'Bibliographic\nResources' : {
            'position': [ 300, 176 ],
            'font-size': 13
        }
    },
    'identifier': {
        'Identifying\nURI': {
            'position': [ 300, 25 ],
            'font-size': 13
        },    
        'Entry Page\nURI' : {
            'position': [ 300, 106 ],
            'font-size': 13
        },    
        'Publication\nResources' : {
            'position': [ 300, 176 ],
            'font-size': 13
        }
    },
    'types' : {
        'Resource\nTypes': {
            'position': [ 292, 250 ],
            'font-size': 13
        }
    }

}

var graphtype_legend_position_override = {
    'nodesonly': [ 92, 200 ]
}

var legend_position = {
    'identifier': [ 92, 230 ],
    'metadata': [ 92, 230 ],
    'boundary': [ 92, 160 ]
}

var graphtype_size = {
    'identifier': [ 376, 300 ],
    'boundary': [ 376, 200 ],
    'type': [ 367, 420 ],
    'metadata': [ 376, 300 ]
}

function createRelationLink(sourceid, targetid, startDirection, endDirection, 
    fillcolor, dasharray) {

    return new joint.dia.Link({
        source: { id: sourceid },
        target: { id: targetid },
        router: {
                name: 'manhattan',
                args: {
                        'startDirections': [ startDirection ],
                        'endDirections': [ endDirection ]
                }
        },
        connector: { name: 'rounded' },
        attrs: {
            '.connection': {
                stroke: fillcolor,
                'stroke-width': 3,
                'stroke-dasharray': dasharray
            },
            '.marker-target': {
                fill: fillcolor,
                stroke: fillcolor,
                d: 'M 10 0 L 0 5 L 10 10 z'
            }
        }
    });

}

function createLine(x1, y1, x2, y2, fillcolor, dasharray, linewidth) {

    return new joint.dia.Link({
        source: {
                x: x1,
                y: y1
        },
        target: {
                x: x2,
                y: y2
        },
        attrs: {
            '.connection': {
                stroke: fillcolor,
                'stroke-width': linewidth,
                'stroke-dasharray': dasharray
            }
        }
    });

}
        

function createNode(posx, posy, text, role) {
    if (role == 'type') {
        return createTypeNode(posx, posy, text);
    } else {
        return createRegularNode(posx, posy, text);
    }
}


function createRegularNode(posx, posy, text) {

    return new joint.shapes.basic.Rect({
        position: { x: posx, y: posy },
        size: { width: 68, height: 30 },
        attrs: {
            rect: {
                fill: '#ffffff',
                stroke: '#d0d0d0',
                'stroke-width': 2,
                rx: 0,
                ry: 0
            },
            text: {
                text: text,
                fill: '#000000',
                'font-size': 10,
                'font-weight': 'normal',
                'font-family': 'Arial, Helvetica, Sans-Serif'
            }
        }
    });

}

function createTypeNode(posx, posy, text) {

    return new joint.shapes.basic.Rect({
        position: { x: posx, y: posy },
        size: { width: 220, height: 20 },
        attrs: {
            rect: {
                fill: '#ffffff',
                stroke: '#d0d0d0',
                'stroke-width': 2
            },
            text: {
                text: text,
                fill: '#000000',
                'font-size': 10,
                'font-weight': 'normal',
                'font-family': 'Arial, Helvetica, Sans-Serif'
            }
        }
    });

}

function createLegendBox(posx, posy, numentries) {

    if (numentries == 1) {
        var height = 45;
    } else {
        var height = 84;
    }

    return new joint.shapes.basic.Rect({
        position: { x: posx, y: posy },
        size: { width: 155, height: height  },
        attrs: {
            rect: {
                fill: '#ffffff',
                //stroke: '#d0d0d0',
                stroke: '#ffffff',
                'stroke-width': 1,
                rx: 0,
                ry: 0
            },
            text: {
                fill: '#000000',
                'font-size': 10,
                'font-weight': 'normal',
                'font-family': 'Arial, Helvetica, Sans-Serif'
            }
        }
    });
}


function createText(posx, posy, text, size) {

    /* weird, but is easier than joint.shapes.basic.text */
    return new joint.shapes.basic.Rect({
        position: { x: posx, y: posy },
        attrs: {
            rect: {
                fill: '#ffffff',
                stroke: '#ffffff'
            },
                text: {
                    text: text,
                    fill: '#000000',
                    'font-size': size,
                    'font-family': 'Arial, Helvetica, Sans-Serif',
                    'text-anchor': 'start',
                    'font-weight': 'normal'
                }
        }
    });

}

function addSideLabels(graph, patterntype, graphtype) {
    
    var drawsidelabel;
    //console.log(patterntype);

    //console.log(sidelabel_data[patterntype]);

    for (sidelabel in sidelabel_data[patterntype]) {
        posx = sidelabel_data[patterntype][sidelabel]['position'][0];
        posy = sidelabel_data[patterntype][sidelabel]['position'][1];
        fontsize = sidelabel_data[patterntype][sidelabel]['font-size'];
        graph.addCell(createText(posx, posy, sidelabel, fontsize));
    }

}

function addLegend(x, y, graph, relations_used) {

    var relations_used = uniqArray(relations_used);

    if (relations_used.length > 0) {
        var originx = x + 1;
        var originy = y + 1;

        graph.addCell(createLegendBox(originx, originy, relations_used.length));

        //graph.addCell(createText(originx + 4, originy + 12, "Legend", 14));

        graph.addCell(createLine(originx - 80, originy, originx + 300, originy, '#d7d7d7', 
            undefined, 1));

        ypos = originy + 15;

        for ( relation of relations_used ) {
            graph.addCell(createLine(originx + 7, ypos, originx + 50, 
                                    ypos, relcolors[relation], 
                                    reldashes[relation], 3));
            graph.addCell(createText(originx + 70, ypos, 
                                    rel_legend_text[relation], 10));
            ypos = ypos + 20;
        };
    }

}

function addNodesAndGenerateNodeList(graph, graphdata, graphtype, patterntype) {

    var publications = 0;
    var types = 0;

    var nodelist = {};

    var role;
    var roles;
    var nodeid;
    var posx;
    var posy;
    var newnode;
    var newnodedata;
    var newnodetext;

    console.log(graphdata);
    //console.log(patterntype);
    //console.log(graphtype);

    for (var node of graphdata["nodes"]) {
        roles = node['role'];
        nodeid = node['id'];

        posx = 0;
        posy = 0;
        entrypage = false;

        //console.log(node_data[patterntype]);

        if ( roles.length == 2 ) {
            if (isInArray("entry", roles)) {
                posx = node_data[patterntype]['entry']['position'][0];
                posy = node_data[patterntype]['entry']['position'][1];

                entrypage = true;

                // quick and dirty, there must be another way
                if (roles[0] == "entry") {
                    role = roles[1];
                } else {
                    role = roles[0];
                }

            } else {
                window.alert("Multiple roles not supported outside of entry page!");
            }
        } else {
            role = roles[0];

            if ( keyIsInDict(role, node_data[patterntype]) ) {
                posx = node_data[patterntype][role]['position'][0];
                posy = node_data[patterntype][role]['position'][1];
            } else {
                console.warn("Refusing to position unknown node of type " + role);
                node['required'] = false;
            }
        }

        if ( role == 'publication' ) {

            if ( ! entrypage ) {
                   	posx = posx - (publications * 75);
                   	publications++;
            }

        } else if ( role == 'supplemental' ) {

            // publications and supplemental appear at the same layer
            posx = posx - (publications * 75);
            publications++;

        } else if ( role == 'bibliographic' ) {

            // bibliographic appears at the publication layer
            posx = posx - (publications * 75);
            publications++;

        } else if ( role == 'type' ) {

            // types appear at the same layer but different y-coordinates
            posy = posy + (types * 30);
            types++;

        } else {
            $.noop();
        }

        /* empty lists are undefined */
        if ( typeof graphtype_node_roles_to_skip[graphtype] 
                    !== 'undefined' ) {

            if ( isInArray(role, graphtype_node_roles_to_skip[graphtype]) ) {
                node['required'] = false;
            }
        }

        if ( node['required'] == true ) {
            newnodetext =  node['label'].replace(' ', '\n');
            newnode = createNode(posx, posy, newnodetext, role);
            graph.addCell(newnode);

            newnode.prop('role', role);
            newnode.prop('url', node['url']);
            nodelist[nodeid] = newnode;
        }

    }
    return nodelist;
}

function addEdgesAndGenerateRelationsList(graph, graphdata, graphtype, nodelist) {

    var relations_used = [];

    var source;
    var target; 
    var sourceid;
    var targetid;
    var start;
    var end;
    var typestarts = [ 'left', 'right' ];

    for (var edge of graphdata["edges"]) {

        var start = undefined;
        var end = undefined;

        for (var relation of graph_to_relations[graphtype] ) {

            if ( edge['rel'] == relation ) {

                // not all nodes are drawn, hence we don't need their edges either
                if ( keyIsInDict(edge['source'], nodelist) ) {

                    if ( keyIsInDict(edge['source'], nodelist) &&
                         keyIsInDict(edge['target'], nodelist) ) {

                        source = nodelist[edge['source']];
                        target = nodelist[edge['target']];
    
                        relations_used.push(relation);

                        if (edge['override_edge_positions'] !== undefined) {
                            start = edge['override_edge_positions']['start'];
                            end = edge['override_edge_positions']['end'];
                        }

                        if ( relation == 'type' ) {
                            url = target.attributes.url;

                            if (start == undefined && end === undefined) {
                                start = reltype_to_positions[relation][url][0];
                                end = reltype_to_positions[relation][url][1];
                            }

                            typestarts.shift(); // first element removed
                        } else {

                            if (start === undefined && end === undefined) {
                                start = reltype_to_positions[relation][0];
                                end = reltype_to_positions[relation][1];
                            }

                        }

                        graph.addCell(createRelationLink(
                               source.id, target.id, start, end, relcolors[relation],
                               reldashes[relation]
                               ));                        

                    } else {
                        console.warn("Refusing to draw edge to unknown node");
                    }
                }
            }
        }
    }

    return relations_used;
}

/*
 * Thanks Stack Overflow, for confirming that JavaScript still doesn't have
 * useful utility functions like Python, Ruby, etc.
 * http://stackoverflow.com/questions/7378228/check-if-an-element-is-present-in-an-array
 */
function isInArray(value, array) {

    for ( var item of array ) {
        if ( item == value ) { return true; }
    }
    return false;
}

/*
 * Thanks Stack Overflow, for confirming that JavaScript still doesn't have
 * useful utility functions like Python, Ruby, etc.
 * http://stackoverflow.com/questions/10654992/how-to-get-collection-of-keys-in-javascript-dictionary
 */
function keyIsInDict(key, dict) {
    var keys = [];

    for (var keyname in dict) {
        if (dict.hasOwnProperty(keyname)) {
            keys.push(keyname);
        }
    }

    return isInArray(key, keys);
}

function uniqArray(startarray) {
    var uniqArray = [];

    for ( item of startarray ) {
        if ( ! isInArray(item, uniqArray) ) {
            uniqArray.push(item);
        }
    }

    return uniqArray;
}

function startGraphing(divid, patterntype, graphtype, data) {

    var myElem = document.getElementById(divid);
    if (myElem === null) {
        console.error('element id ' + divid + ' does not exist!');
    } else {
        var graph = new joint.dia.Graph();

        var paper = new joint.dia.Paper({
            el: $('#' + divid),
            width: graphtype_size[graphtype][0],
            height: graphtype_size[graphtype][1],
            gridSize: 10,
            model: graph,
            interactive: false
        });

        var foundpattern = false;

        graphdata = data;

        // 1. add side labels
        addSideLabels(graph, patterntype, graphtype);

        // 2. create nodes
        var nodelist = addNodesAndGenerateNodeList(graph, graphdata, 
            graphtype, patterntype);

        // 3. create edges and store relation types for legend
        var relations_used = addEdgesAndGenerateRelationsList(
                        graph, graphdata, graphtype, nodelist);

        // 4. draw legend
        if ( graphtype_draw_legend[graphtype] ) {

            if (typeof(graphtype_legend_position_override[graphtype])
                     !== 'undefined') {
                var x = graphtype_legend_position_override[graphtype][0];
                var y = graphtype_legend_position_override[graphtype][1];
            } else {
                var x = legend_position[patterntype][0];
                var y = legend_position[patterntype][1];
            }

            addLegend(x, y, graph, relations_used);
        }
    }
}
