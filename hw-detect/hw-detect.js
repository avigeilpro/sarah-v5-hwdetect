module.exports = function (RED) {
    function hwdetect (config) {
        RED.nodes.createNode (this, config);
        // Configuration options passed by Node Red
        this.name = config.name;
        this.timeout = config.timeout * 1000;
        // locals var's
        var node = this;
        var nodeList = require ('node-red').nodes.getFlows().flows; // using node-red API function for retriving the flow-list
        var TOutFct = null;

        // Find hotword in node list with type = 'win-listen-config', if not find => setting "SARAH" by default
        hotword = nodeList.find(function IsListenCfg(NodeList) {return NodeList.type === 'win-listen-config';}).hotword||"SARAH"; 

        //set défault status red
        node.status ({fill:"red", shape:"ring", text:"hotword requit !"});

        node.on ('input', function (msg) {
            // Testing : hotword in message object OR active timeout ?
            if (RegExp (hotword, 'i').test (msg.payload.text) || TOutFct) {
                node.status({fill:"green",shape:"dot",text:"commandes libres"});
                // Passing througt message
                node.send (msg);
                node.warn ('Commande envoyée !'); // must be removed !
                // clearing previous timeout
                clearTimeout (TOutFct);
                // starting new timeout
                TOutFct = setTimeout (function () {
                    // After timeout events
                    node.status ({fill:"red", shape:"ring", text:"hotword requit !"});
                    TOutFct = null; // set timeout to null for future test
                }, node.timeout);
            } else {
                node.status ({fill: "blue", shape: 'ring', text: 'hotword: ' + hotword});
                node.warn ('Commande bloquée !'); // must be removed !
            }
        });
    }
    RED.nodes.registerType ("hw-detect", hwdetect);
}