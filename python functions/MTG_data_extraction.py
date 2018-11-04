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
    index=0
    for i in collection:
        i['libraryid']=libraryid
        i['uid']= str(bson.objectid.ObjectId())
        i['location']=0
        i['tapped']=False
        i['counter']=0
        i['flipped']=False
        i['libraryindex']=index
        index+=1
    return(collection)

def clean_collection(collection):
    for i in collection:
        remove=['_id','artist','supertypes','multiverse_id','layout','names','variations','watermark','border','timeshifted','hand','release_date','starter','foreign_names','printings','original_text','original_type','legalities','source','id']
        for prop in remove:
            #del card[prop]
            try:
                i.pop(prop)
            except:
                pass
    return(collection)

def serve_firebase(collection):
    try:
        for card in collection:
            requests.put('https://mtggame-b3e32.firebaseio.com/cards/'+str(card['uid'])+'.json',json.dumps(card))
                
    except:
        raise
    return()

###create player object####

def createplayer(deck):
    playerid=str(bson.objectid.ObjectId())
    playerproperties={'playerid':playerid,
                      'life':40,
                      'poison_counters':0,
                      'libraryid':deck[1]['libraryid']
                    }
    return(playerproperties)

def create_game(decks):

    gameid=str(bson.objectid.ObjectId())
    gameproperties={'gameid':gameid,
                    'turn_possession':'',
                    'turn_count':0,
                    }
    eventlog={'eventlogs':['game_start'],
                }
    r=requests.put('https://mtggame-b3e32.firebaseio.com/Eventlogs/.json',json.dumps(eventlog))
    ### add library ids to game
    for i in decks:
        count=1
        gameproperties['libraryid_'+str(count)]=decks[count-1][1]['libraryid']
    ###create players 
    count=1
    for k in decks:
        player=createplayer(k) 
        gameproperties['playerid_'+str(count)]=player['playerid']
        for card in k:
                r=requests.put('https://mtggame-b3e32.firebaseio.com/Cards/'+str(card['uid'])+'.json',json.dumps(card))
        for playerproperty in player:
            r=requests.put('https://mtggame-b3e32.firebaseio.com/players/'+str(player['playerid'])+'/'+str(playerproperty)+'.json',json.dumps(player[playerproperty]))
        count+=1
    ###send game properties
    for j in gameproperties:
        r=requests.put('https://mtggame-b3e32.firebaseio.com/Game/'+str(j)+'.json',json.dumps(gameproperties[j]))
    return(gameid)

#######functions for creating decks, adding and removing cards

def create_collection(collection_config,masterdb,targetdb):
    count=0
    for card_name in collection_config:
            card=get_card_by_field(masterdb,'name',card_name)
            print(card_name+ " added")
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

###functions for passing raw data from mtgsdk

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
  ###best effort, itterate through cards to try to find an image
    if mtgcard.image_url == None:
        cards=Card.where(name=mtgcard.name).all()
        for i in range(len(cards)):
            if cards[i].image_url!=None:
                mtgcard=cards[i]
                break

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

def insert_to_mongo_collection(db,cards):
    try:
        for i in cards:
                card=parse_card(i)
                db.insert_one(card)
    except:
        raise
    return()

def insert_sets(db,sets):
    try:
        for j in sets:
            db.posts.insert_one(parse_set(j))
    except:
        raise
    return()