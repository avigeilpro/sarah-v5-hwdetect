var lastcall = 0;

module.exports = function (RED) {
    var request = require ('request');
	const nodeRED = require ('node-red');

    function hwdetect (config) {
        RED.nodes.createNode(this, config);
        var tout = config.timeout;
        var hotword = "";
        var node = this;

        node.on ('input', function (msg) {
        	//Réccupère le hotword définie dans les options du node win-listen
            let nl = nodeRED.nodes.getFlows();
            hotword = nl.flows.find(function IsListenCfg(NodeList) {
  				return NodeList.type === 'win-listen-config';
			}).hotword; 

            //détermine depuis combien de temps une commande n'a pas été prononcée.
            var timedif = Math.floor((Date.now() - lastcall)/1000);

            //Découpe la phrase aux espaces
            var text_Msg = msg.payload.text;
            var cmdarr = text_Msg.split(" ");

            //Si présence du mot clé ou timout non dépassé on retransmer le msg
            if ((cmdarr[0].toLowerCase() == hotword.toLowerCase())||(timedif<=tout)) {
            node.send(msg);
            lastcall = Date.now();
            }
        });
    }
    RED.nodes.registerType ("hw-detect", hwdetect);
}
