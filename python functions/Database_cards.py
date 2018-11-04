from mtgsdk import Set
from mtgsdk import Card
from mtgsdk import Type
from mtgsdk import Supertype
from mtgsdk import Subtype
from mtgsdk import Changelog
import MTG_data_extraction as MTG
import pymongo
from pymongo import MongoClient
import requests
import json
import bson
import urllib3 as urllib


if __name__ == "__main__":

    ####GET ALL CARDS FROM MTGDSK API
    cards=Card.all()
    client = MongoClient('localhost', 27017)
    masterdb = client['MTG_CARDS'].cards
    MTG.insert_to_mongo_collection(masterdb,cards)
  
