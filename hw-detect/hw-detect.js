var TOutFct;	//Contiendra la fonction timeout
var TOutFlag = true;	/*drapeau d'état du timeout :
								- true => timeout actif, mot clé SARAH requit
								- false => timeout inactif, mot clé SARAH facultatif */

module.exports = function (RED) {
    var request = require ('request');
	const nodeRED = require ('node-red');

    function hwdetect (config) {
        RED.nodes.createNode(this, config);
        this.timeout = config.timeout * 1000;
        var hotword = "";
        var node = this;
        //initialise le status du node en rouge
        node.status({fill:"red",shape:"ring",text:"hotword requit !"});

        node.on ('input', function (msg) {
        	//Réccupère le hotword définie dans les options du node win-listen
            let nl = nodeRED.nodes.getFlows();
            hotword = nl.flows.find(function IsListenCfg(NodeList) {
  				return NodeList.type === 'win-listen-config';
			}).hotword; 

            //détermine depuis combien de temps une commande n'a pas été prononcée.

            //Découpe la phrase aux espaces
            var text_Msg = msg.payload.text;
            var cmdarr = text_Msg.split(" ");

            //Si présence du mot clé ou timout non dépassé on retransmer le msg
            if ((cmdarr[0].toLowerCase() == hotword.toLowerCase())||(!TOutFlag)) {
          		//retransmet le msg en sortie
	            node.send(msg);
	        	
	        	//indique le status en vert, les commandes ne nécessitent pas le mot clé
	            node.status({fill:"green",shape:"dot",text:"commandes libres"});
	            TOutFlag=false;	//baisse le drapeau timeout pour permettre les commandes sans mot clé

	            //désactive toute fonction timeout d'une précédente commande puis relance un nouveau timeout.
	            clearTimeout(TOutFct);
	            TOutFct = setTimeout(function(){
	            				node.status({fill:"red",shape:"ring",text:"hotword requit !"});
	            				TOutFlag=true;
	            			}, node.timeout);
            }
        });
    }
    RED.nodes.registerType ("hw-detect", hwdetect);
}
