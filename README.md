# hw-detect
Simple node qui détecte le mot clé en début de phrase.

Installation :
  - Télécharger, extraire puis copier le repertoire hw-detect dans le dossier \sarah\viseo-bot-framework\node_modules\.
  - placer le node hw-detect juste a la sortie du node sarah (win-listen) comme sur l'image. le node hw-detect filtrera les commandes qui ne répondent pas aux critères suivant :
        - présence du mot clé (hotword) en début de phrase
        - si pas de hotword, commande valide passée dans les X dernières secondes, X étant le paramètre timeout du node (défaut 120)
  
  
![hw-detect](https://user-images.githubusercontent.com/9353723/36108331-e402c182-101c-11e8-87a0-223cb2066d69.png)
