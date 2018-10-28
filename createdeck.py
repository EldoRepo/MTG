
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
    targetdb=client['MTG_CARDS'].Grenzo

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
    collection_config={
                        'Battle Squadron':1,
                        'Beetleback Chief':1,
                        'Boggart Birth Rite':1,
                        'Boggart Harbinger':1,
                        'Boggart Mob':1,
                        'Boggart Shenanigans':1,
                        'Caterwauling Boggart':1,
                        'Command Tower':1,
                        'Dragon Fodder':1,
                        'Dragonskull Summit':1,
                        'Empty the Warrens':1,
                        'Fodder Launch':1,
                        'Foundry Street Denizen':1,
                        'Frogtosser Banneret':1,
                        'Gempalm Incinerator':1,
                        'Goblin Chieftain':1,
                        'Goblin Diplomats':1,
                        'Goblin Grenade':1,
                        'Goblin King':1,
                        'Goblin Lackey':1,
                        'Goblin Matron':1,
                        'Goblin Piledriver':1,
                        'Goblin Rabblemaster':1,
                        'Goblin Ringleader':1,
                        'Goblin Sledder':1,
                        'Goblin Spymaster':1,
                        'Goblin Warchief':1,
                        'Goblin Welder':1,
                        'Graven Cairns':1,
                        'Grenzo, Dungeon Warden':1,
                        'Grenzo, Havoc Raiser':1,
                        'Heartstone':1,
                        'Horde of Boggarts':1,
                        'Hordeling Outburst':1,
                        'Ib Halfheart, Goblin Tactician':1,
                        'Ignition Team':1,
                        'Impact Tremors':1,
                        'Kiki-Jiki, Mirror Breaker':1,
                        'Knucklebone Witch':1,
                        'Krenko, Mob Boss':1,
                        'Legion Loyalist':1,
                        'Lightning Crafter':1,
                        'Lightning Greaves':1,
                        'Mad Auntie':1,
                        'Mana Echoes':1,
                        'Mindmoil':1,
                        'Mogg War Marshal':1,
                        'Mountain':14,
                        'Murderous Redcap':1,
                        'Outrage Shaman':1,
                        'Pyrewild Shaman':1,
                        'Rakdos Carnarium':1,
                        'Reckless One':1,
                        'Reito Lantern':1,
                        'Sensation Gorger':1,
                        'Shadowblood Ridge':1,
                        'Siege-Gang Commander':1,
                        'Skirk Fire Marshal':1,
                        'Skirk Prospector':1,
                        'Smoldering Marsh':1,
                        'Sol Ring':1,
                        'Spike Jester':1,
                        'Squeaking Pie Grubfellows':1,
                        'Swamp':14,
                        'Tuktuk the Explorer':1,
                        'Vial Smasher the Fierce':1,
                        'Warren Instigator':1,
                        'Warren Pilferers':1,
                        'Warren Weirding':1,
                        'Weirding Shaman':1,
                        'Wort, Boggart Auntie':1,
                }
    mydeck=MTG.create_collection(collection_config,masterdb,targetdb)
    decklist=[]
    for i in targetdb.find():
        decklist.append(i)

    mydeck=MTG.clean_collection(decklist)
    mydeck=MTG.add_gameplay_properties(decklist)
    #MTG.serve_firebase(mydeck)