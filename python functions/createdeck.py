
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
    targetdb=client['MTG_CARDS'].Sig

    sig={       
                'Sygg, River Guide':1,
                'Acquire':1,
                'Ajani, Caller of the Pride':1,
                'Aquitect\'s Will':1,
                'Austere Command':1,
                'Azorius Chancery':1,
                'Azorius Signet':1,
                'Bant Panorama':1,
                'Calciform Pools':1,
                'Capsize':1,
                'Clone':1,
                'Coastal Tower':1,
                'Coat of Arms':1,
                'Condemn':1,
                'Crib Swap':1,
                'Cryptic Command':1,
                'Deepchannel Mentor':1,
                'Dismantling Blow':1,
                'Distant Melody':1,
                'Diviner\'s Wand':1,
                'Dominating Licid':1,
                'Door of Destinies':1,
                'Drowner of Secrets':1,
                'Enlightened Tutor':1,
                'Esper Panorama':1,
                'Faerie Conclave':1,
                'Fallowsage':1,
                'Followed Footsteps':1,
                'Glen Elendra Archmage':1,
                'Hallowed Fountain':1,
                'Harpoon Sniper':1,
                'Hinder':1,
                'Infinite Reflection':1,
                'Intruder Alarm':1,
                'Inundate':1,
                'Island':10,
                'Jace Beleren':1,
                'Judge of Currents':1,
                'Lord of Atlantis':1,
                'Lullmage Mentor':1,
                'Merrow Commerce':1,
                'Merrow Harbinger':1,
                'Merrow Reejerey':1,
                'Mind Stone':1,
                'Mind\'s Eye':1,
                'Mirror Entity':1,
                'Mistveil Plains':1,
                'Mystical Tutor':1,
                'Nimbus Maze':1,
                'Oblivion Ring':1,
                'Ocular Halo':1,
                'Paradise Mantle':1,
                'Plains':5,
                'Prahv, Spires of Order':1,
                'Quicksilver Fountain':1,
                'Reliquary Tower':1,
                'Rhystic Study':1,
                'Rite of Replication':1,
                'Rootwater Hunter':1,
                'Rootwater Thief':1,
                'Sage of Fables':1,
                'Sage\'s Dousing':1,
                'Sea Scryer':1,
                'Seahunter':1,
                'Seal of Cleansing':1,
                'Seasinger':1,
                'Sigil Tracer':1,
                'Silvergill Adept':1,
                'Sky Hussar':1,
                'Sol Ring':1,
                'Spin into Myth':1,
                'Stonybrook Banneret':1,
                'Stonybrook Schoolmaster':1,
                'Streambed Aquitects':1,
                'Summon the School':1,
                'Surgespanner':1,
                'Sygg, River Guide':1,
                'Teferi\'s Moat':1,
                'Teferi, Mage of Zhalfir':1,
                'Terramorphic Expanse':1,
                'Tidal Warrior':1,
                'Tideshaper Mystic':1,
                'Sharding Sphinx':1,
                'Vivid Creek':1,
                'Vivid Meadow':1,
                'Voidmage Prodigy':1,
                'Wake Thrasher':1,
                'Wanderwine Hub':1,
                'Wanderwine Prophets':1,
                'Wash Out':1,
                'Windbrisk Heights':1,
                'Winding Canyons':1,
        }


    #mydeck=MTG.create_collection(sig,masterdb,targetdb)
    #decklist=[]
    #for i in targetdb.find():
    #    decklist.append(i)

    #mydeck=MTG.clean_collection(decklist)
    #mydeck=MTG.add_gameplay_properties(decklist)

    card=MTG.get_card_by_field(masterdb,'name','Capsize')
    #cards_to_add=['Sensei\'s Divinging Top','Teferi\'s Puzzle Box','Darksteel Citadel']
    #for i in cards_to_add:
     #   MTG.add_card_to_collection(targetdb,MTG.get_card_by_field(masterdb,'name',i))
    #MTG.serve_firebase(mydeck)