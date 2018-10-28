
import MTG_data_extraction as MTG
from mtgsdk import Set
from mtgsdk import Card
from mtgsdk import Type
from mtgsdk import Supertype
from mtgsdk import Subtype
from mtgsdk import Changelog
import pymongo
from pymongo import MongoClient
import requests
import json
import bson
import urllib3 as urllib
import pandas as pd



if __name__ == "__main__":

    client = MongoClient('localhost', 27017)
    masterdb = client['MTG_CARDS'].cards
    targetdb=client['MTG_CARDS'].Leovold


    collection_config={
                        'Academy Ruins':1,
                        'Aetherflux Reservoir':1,
                        'Ancient Excavation':1,
                        'Basalt Monolith':1,
                        'Beast Within':1,
                        'Boseiju, Who Shelters All':1,
                        'Breeding Pool':1,
                        'Burgeoning':1,
                        'Chromatic Lantern':1,
                        'Command Tower':1,
                        'Consuming Aberration':1,
                        'Counterspell':1,
                        'Creakwood Liege':1,
                        'Cyclonic Rift':1,
                        'Dakmor Salvage':1,
                        'Dark Deal':1,
                        'Dark Petition':1,
                        'Dark Ritual':1,
                        'Demonic Tutor':1,
                        'Drowned Catacomb':1,
                        'Entomb':1,
                        'Expedition Map':1,
                        'Fabricate':1,
                        'Far Wanderings':1,
                        'Fellwar Stone':1,
                        'Font of Mythos':1,
                        'Forest':8,
                        'Harrow':1,
                        'Hinterland Harbor':1,
                        'Horn of Greed':1,
                        'Island':8,
                        'Kozilek, Butcher of Truth':1,
                        'Krosan Grip':1,
                        'Kydele, Chosen of Kruphix':1,
                        'Laboratory Maniac':1,
                        'Leovold, Emissary of Trest':1,
                        'Life from the Loam':1,
                        'Lotus Petal':1,
                        'Mana Crypt':1,
                        'Mesmeric Orb':1,
                        'Mind Stone':1,
                        'Mox Opal':1,
                        'Mystical Tutor':1,
                        'Negate':1,
                        'Overgrown Tomb':1,
                        'Pact of Negation':1,
                        'Polluted Delta':1,
                        'Prismatic Lens':1,
                        'Psychosis Crawler':1,
                        'Reflecting Pool':1,
                        'Reshape':1,
                        'Sculpting Steel':1,
                        'Sewer Nemesis':1,
                        'Sol Ring':1,
                        'Spellskite':1,
                        'Swamp':8,
                        'The Gitrog Monster':1,
                        'Thoughtseize':1,
                        'Time Reversal':1,
                        'Undermine':1,
                        'Vampiric Tutor':1,
                        'Villainous Wealth':1,
                        'Voidslime':1,
                        'Watery Grave':1,
                        'Whispering Madness':1,
                        'Windfall':1,
                        'Worm Harvest':1,
                    }

    mydeck=MTG.create_collection(collection_config,masterdb,targetdb)
    decklist=[]
    for i in targetdb.find():
        decklist.append(i)

    mydeck=MTG.clean_collection(decklist)
    mydeck=MTG.add_gameplay_properties(decklist)
    #MTG.serve_firebase(mydeck)