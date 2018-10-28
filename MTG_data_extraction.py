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


########functions retrieving data from mongodb

def get_card_by_field(collection,field,value):
        card=collection.find_one({field:value})
        return(card)

def get_collection(db,collection_id):
        collection = db[collection_id]
        return(collection)

##### function for sending data to firebase

def add_gameplay_properties(collection):
    libraryid=str(bson.objectid.ObjectId())
    for i in collection:
        i['libraryid']=libraryid
        i['uid']= str(bson.objectid.ObjectId())
        i['location']=0
        i['tapped']=False
        i['counter']=0
        i['flipped']=False
    return(collection)

def clean_collection(collection):
    for i in collection:
        remove=['_id','artist','supertypes','multiverse_id','layout','names','variations','watermark','border','timeshifted','hand','release_date','starter','foreign_names','printings','original_text','original_type','legalities','source','id']
        for prop in remove:
            #del card[prop]
            i.pop(prop)
    return(collection)

def serve_firebase(collection):
    try:
        for card in collection:
            r=requests.put('https://mtggame-b3e32.firebaseio.com/cards/'+str(card['uid'])+'.json',json.dumps(card))
            #print(r)    
    except:
        raise
    return()




#functions for creating decks, adding and removing cards

def create_collection(collection_config,masterdb,targetdb):
    
    for card_name in collection_config:
            card=get_card_by_field(masterdb,'name',card_name)
            for n in range(collection_config[card_name]):
                card["_id"]=bson.objectid.ObjectId()
                add_card_to_collection(targetdb,card)

    return()


def remove_card():
    return()
def add_card_to_collection(db,card):
    db.insert_one(card)
    return()

####functions for getting pricing data
def tcg_return_price():

    url = "http://api.tcgplayer.com/v1.5.0/catalog/categories"

    response = requests.request("GET", url)

    return(response.text)

def ck_return_price(mtgcard):
    ##need to figure out how not be a bot
    cardkingdom1=urllib.request.urlretrieve("https://www.cardkingdom.com/catalog/search?search=header&filter%5Bname%5D=Teferi%27s+Care&ac=1")

###functions for pasing raw data from mtgsdk

def parse_set(mtgset):
    set_properties= ['code','name','gatherer_code','old_code','magic_cards_info_code','release_date',
    'border','type','block','online_only','booster','mkm_id','mkm_name']

    post = {"code": mtgset.code,
         "name": mtgset.name,
         "gatherer_code": mtgset.gatherer_code,
         "old_code": mtgset.old_code,
         "magic_cards_info_code":mtgset.magic_cards_info_code,
         "release_date": mtgset.release_date,
         "border": mtgset.border,
         "type": mtgset.type,
         "block": mtgset.block,
         "online_only": mtgset.online_only,
         "booster": mtgset.booster,
         "mkm_id": mtgset.mkm_id,
         "mkm_name": mtgset.mkm_name,
         }
    return(post)

def parse_card(mtgcard):

    post = {"name": mtgcard.name,
            "multiverse_id": mtgcard.multiverse_id,
            "layout": mtgcard.layout,
            "names": mtgcard.names,
            "mana_cost": mtgcard.mana_cost,
            "cmc": mtgcard.cmc,
            "colors": mtgcard.colors,
            "color_identity": mtgcard.color_identity,
            "type": mtgcard.type,
            "supertypes": mtgcard.supertypes,
            "subtypes": mtgcard.subtypes,
            "rarity": mtgcard.rarity,
            "text": mtgcard.text,
            "flavor": mtgcard.flavor,
            "artist": mtgcard.artist,
            "number": mtgcard.number,
            "power": mtgcard.power,
            "toughness": mtgcard.toughness,
            "loyalty": mtgcard.loyalty,
            "variations": mtgcard.variations,
            "watermark": mtgcard.watermark,
            "border": mtgcard.border,
            "timeshifted": mtgcard.timeshifted,
            "hand": mtgcard.hand,
            "life": mtgcard.life,
            #"": mtgcard.reserved,
            "release_date": mtgcard.release_date,
            "starter": mtgcard.starter,
            "rulings": mtgcard.rulings,
            "foreign_names": mtgcard.foreign_names,
            "printings": mtgcard.printings,
            "original_text": mtgcard.original_text,
            "original_type": mtgcard.original_type,
            "legalities": mtgcard.legalities,
            "source": mtgcard.source,
            "image": mtgcard.image_url,
            "set": mtgcard.set,
            "set_name": mtgcard.set_name,
            "id": mtgcard.id,
            }

    return(post)

def insert_firebase(cards):
    try:
        for i in cards:
                card=parse_card(i)
                name=card['name']
                r=requests.put('https://mtggame-b3e32.firebaseio.com/cards/'+name+'.json',json.dumps(card))
                #print(r)    
    except:
        raise
    return()

def insert_to_mongo_collection(db,cards):
    try:
        for i in cards:
                card=parse_card(i)
                db.insert_one(card)
    except:
        raise
    return()

def insert_sets(db):
    try:
        for j in set:
            dbsets.posts.insert_one(parse_set(j))
    except:
        raise
    return()


###### passing collections from mongodb to firebase





if __name__ == "__main__":

    ####GET ALL CARDS FROM MTGDSK API
        #cards=Card.all()
        #cards=SET.all()
##connect to local db
    client = MongoClient('localhost', 27017)
    masterdb = client['MTG_CARDS'].cards
    targetdb=client['MTG_CARDS'].test_deck
###upload all card from mtgsdk and inser to database
    #cards = Card.all()
    #cards = Card.where(set='ktk').where(subtypes='warrior,human').all()
    #insert_to_mongo_collection(masterdb,cards)
   # insert_firebase(cards)
    #card = get_card(collection,'Chivalrous Chevalier')
    collection_config={

            'Sen Triplets':1,
            'Swamp':20,
            'Island':20,
            'Plains':20,
    }


#create_collection(collection_config,masterdb,targetdb)
decklist=[]
for i in targetdb.find():
        decklist.append(i)

mydeck=clean_collection(decklist)
mydeck=add_gameplay_properties(decklist)
serve_firebase(mydeck)

