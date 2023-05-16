
var lh_formatting_tags = ["<br/>", "<b>", "</b>", "&nbsp;"];

function format(str, dict) {
    for (var key in dict) {
        str = str.replace(new RegExp("{"+key+"}", "g"), dict[key]);
    }
    return str;
}

function serialize_to_link_format(graph) {
    var link_tmpl = "&lt;{url}&gt;<br/>&nbsp;; rel=<b>\"{rel}\"</b>";
    var link_headers = {};

    for (var n=0, node; node=graph["nodes"][n]; n++) {
        link_headers[node["id"]] = {};
        //link_headers[node["id"]]["url"] =  format(node["url"], {"id": article_id});
        link_headers[node["id"]]["url"] =  node["url"];
        link_headers[node["id"]]["role"] = node["role"];
        link_headers[node["id"]]["label"] = node["label"];
        link_headers[node["id"]]["headers"] = {};
        link_headers[node["id"]]["headers"]["all"] = [];
    }

    for (var e=0, edge; edge=graph["edges"][e]; e++) {
        var target_url = link_headers[edge["target"]]["url"];
        var rel = edge["rel"];
        var source_url = link_headers[edge["source"]]["url"];
        var role = edge["role"];
        if (!link_headers[edge["source"]]["headers"][role]) {
            link_headers[edge["source"]]["headers"][role] = [];
        }

        if (rel == "HTTP_redirect") {
            continue;
        }

        lh = format(link_tmpl, {"url": target_url, "rel": rel});
        if (edge["metadata"]) {
            $(edge["metadata"]["attributes"]).each( function(i, md) {
                lh += "<br/>&nbsp;; {key}=<b>\"{value}\"</b>";
                lh = format(lh, {
                    "key": md["label"],
                    "value": md["value"]
                });
            });
        }
        link_headers[edge["source"]]["headers"]["all"].push(lh);
        link_headers[edge["source"]]["headers"][role].push(lh);
    }
    return link_headers;
}

function create_link_header_table(lp_graph) {

    var table = ["<table class=\"table\" style=\"\">",
    "<tr>", 
    "<th>Resource</th>",
    "<th>Link Header</th>",
    "</tr>"];

    for (i in Object.keys(lh)) {
        var k = parseInt(i) + 1;
        if (lh[k]["role"] == "type") {
            continue;
        }
        table.push("<tr>");
        table.push("<td style=\"word-wrap: break-word;\">");
        table.push("<b>" + lh[k]["label"] + "<br/><a href=\"" + lh[k]["url"] + "\" target=\"_blank\">");
        table.push(lh[k]["url"] + "</a></b></td>");

        table.push("<td style=\"\">");
        if (lh[k]["headers"]["all"].length > 0) {
            table.push("<ul><li>" + lh[k]["headers"]["all"].join(",</li><li>") + "</li></ul>");
        }
        table.push("</td>");
        table.push("</tr>");
    }
    table.push("</table>");
    return table.join("");
}

function create_link_header_textarea(lh) {
    var links = [];
    links.push("<div>");

    for (i in Object.keys(lh)) {
        var k = parseInt(i) + 1;
        if (lh[k]["role"] == "type") {
            continue;
        }
        var l = lh[k]["headers"]["all"].join(",\n");
        for (var t=0, tag; tag=lh_formatting_tags[t]; t++) {
            l = l.replace(new RegExp(tag, "g"), "");
        }
        links.push("<p>");
        links.push("<b>" + lh[k]["label"] + "</b>");
        links.push("<br/>");
        links.push("<tt style=\"font-size: 0.8em;\">curl -I " + lh[k]["url"] + "</tt>");
        links.push("<br/>");
        links.push("<label for=\"textarea\" style=\"font-weight: normal; font-family: monospace; font-size: 0.8em; display: block; float: left; padding-top: 30px; padding-right: 15px;\">Link:</label>");
        links.push("<textarea name=\"textarea\" rows=\"5\" cols=\"43\" style=\"font-family: monospace; font-size: 0.8em;\">" + l + "</textarea>");
        links.push("</p>");
    }
    links.push("</div>");
    return links.join("");
}

var role_message = {
    "identifier": "The HTTP Link header to express identity for the ",
    "boundary": "The HTTP Link header to express boundary for the ",
    "type": "The HTTP Link header to express the nature of the ",
    "bibliographic": {
        "describes": "The HTTP Link header to link from the ",
        "doi-describedby": "The HTTP Link Header to link to metadata that describes the publication with ",
        "describedby": "The HTTP Link Header to link to metadata from the "
    }
};

function create_link_headers_for_role(lh, role) {

    var li_tmpl = "<div style=\"padding-bottom: 10px;border-bottom: 1px solid #ddd;\">{role_message}<b>{label}</b><br /> <tt>{url}</tt> is:<br/>";
    li_tmpl += "<div style=\"background: #fff; margin: 0 10px;\"><code>{link_header}</code></div></div>";

    var div = [];
    div.push("<div>");
    div.push("<br/>");
    div.push("<br/>");

    var label;

    for (i in Object.keys(lh)) {
        var k = parseInt(i) + 1;

        if (lh[k]["role"] == "type" || !lh[k]["headers"][role] || lh[k]["headers"][role].length == 0) {
            continue;
        }
        div.push("<p>");

        label = lh[k]["label"];

        if (label == "Metadata CrossRef") {
            label = "CrossRef Metadata";
        }
        if (label.includes("URI") === false) {
            label = label + ' URI';
        }

        if (role_message[role] !== undefined ) {
            if (role == "bibliographic") {

                if (lh[k]["headers"][role][0].includes('rel=<b>"describes"</b>')) {
                    individual_role_msg = role_message[role]["describes"];
                } else if (label.includes("DOI URI")) {
                    individual_role_msg = role_message[role]["doi-describedby"];
                } else {
                    individual_role_msg = role_message[role]["describedby"];
                }

            } else {
                individual_role_msg = role_message[role];
            }
        } else {
            individual_role_msg = "The " + role + " HTTP Link Headers for the ";
        }

        div.push(format(li_tmpl, {
            "role_message": individual_role_msg,
            "label": label,
            "url": lh[k]["url"],
            "link_header": lh[k]["headers"][role].join(",<br/><br/>")
        }));
        div.push("</p>");
    }
    div.push("</div>");
    return div.join("");
} 

function get_model_file_path(loc) {
    //TODO: avoid hardcoding paths, file names, etc here. may be use a global?
    if (!loc) {
        loc = document.location.href;
    }

    if (loc.lastIndexOf("/") == loc.length-1) {
        loc = loc.slice(0, -1);
    }
    var mf = loc.split("/");
    var model_file = mf[mf.length-1];

    if (!model_file) {
        return;
    }
    return "/models/" + model_file + ".json";
}

function show_publisher_description(lp_graph) {

    $("#publisher-name").append(lp_graph["label"]);
    $("#pattern-sub-heading").append(lp_graph["sub_heading"]);
    // $("#publisher-description").append(lp_graph["description"]);

    /*
    if (lp_graph["citation-uri"] !== undefined) {

        $.ajax( {
            url: lp_graph["citation-uri"], 
            success: function(data) {
                $("#citation").append(data);
            },
            cache: false
        })
        .fail(function() {
            console.log("get failed for " + lp_graph["citation-uri"]);
        });

    }

    if (lp_graph["summary-uri"] !== undefined) {

        $.ajax( {
            url: lp_graph["summary-uri"], 
            success: function(summarydata) {
                $("#summary").append(summarydata);
            },
            cache: false
        })
        .fail(function() {
            console.log("get failed for " + lp_graph["citation-uri"]);
        });
    }
    */
}

function create_page_from_model(data, type) {

        var lp_graph = data;
        show_publisher_description(lp_graph);

        lh = serialize_to_link_format(lp_graph);
        //lh_table = create_link_header_table(lh);
        var lh_div = create_link_header_textarea(lh);

        $("#lp_table").append(lh_div);

        if (type == "landing") {
            var id_html = create_link_headers_for_role(lh, "identifier");
            $("#identifierheaders").append(id_html);
        }
        if (type == "boundary") {
            var bd_html = create_link_headers_for_role(lh, "boundary");
            $("#boundaryheaders").append(bd_html);
        }
        else if (type == "bibliographic") {
            var bd_html = create_link_headers_for_role(lh, "bibliographic");
            $("#metadataheaders").append(bd_html);
        }
        var tp_html = create_link_headers_for_role(lh, "type");
        $("#typeheaders").append(tp_html);
}


function enable_graph_touch_scrolling(element) {

    var gele = $(element);
    var evtIn = window.navigator.msPointerEnabled ? "MSPointerDown" : "touchstart";
    var evtOut = window.navigator.msPointerEnabled ? "MSPointerUp" : "touchend";

    $(gele).each( function(i, ele) {

        ele.addEventListener(evtIn, function() {
            ele.setAttribute("style", "pointer-events: all");
            document.body.style.overflow =  "hidden";
        }, false);

        ele.addEventListener(evtOut, function() {
            ele.setAttribute("style", "pointer-events: none");
            document.body.style.overflow = "auto";
        }, false);
    });
}

function load_header_footer() {

    $.get("/static/menu.html", function(data) {
        $("#signposting-menu").html(data);
    });

    $.get("/static/footer.html", function(data) {
        $("#footer").html(data);
    });
}

SVGElement.prototype.getTransformToElement = SVGElement.prototype.getTransformToElement || function(toElement) {
    return toElement.getScreenCTM().inverse().multiply(this.getScreenCTM());
};

