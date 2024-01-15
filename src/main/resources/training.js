db.imdb.find({title : /acksm/i}).explain("executionStats")
db.imdb.find({title : {$regex : /acksm/,$options:"i" } }).limit(10)

db.imdb.find({title : /^Blacksm/}).explain("executionStats")
db.imdb.find({title : "Blacksmith Scene"}).explain("executionStats")


db.imdb.getIndexes()
db.imdb.dropIndex("title_1")
db.imdb.createIndex({title:1})

db.imdb.createIndex({title:1,year:1})

db.imdb.updateOne({title : "Blacksmith Scene"},{$set : {runtime:13333}})
db.imdb.updateOne({},{$set : {runtime:13333}})

db.imdb.updateOne({title : "Blacksmith Scene"},{$set : {"imdb.rating":6.3}})
db.imdb.updateOne({title : "Blacksmith Scene"},{$inc : {"imdb.votes":1}})
db.imdb.updateOne({title : "Blacksmith Scene"},{$inc : {"imdb.votes":-1}})
db.imdb.updateOne({title : "Blacksmith Scene"},{$set : {"awards.text":"2 kazan"}})

db.imdb.updateMany({},{$set : {"awards.test":"test kazan"}})
db.imdb.updateMany({},{$unset : {"awards.test":''}})
db.imdb.updateMany({},{$rename : {type:'tip'}})

db.imdb.find({_id : ObjectId('573a1390f29313caabcd548c')})


db.imdb.aggregate(
    [
        {$match : {title : "Blacksmith Scene"}},
        {$addFields: {myField: { $round:  {$multiply : ["$imdb.rating","$tomatoes.viewer.rating"]}}}},
        {$project: {genres:1,myField:1,awards:1,_id:0}}
    ]
)

db.imdb.aggregate(
    [
        {$match : {_id:ObjectId('573a1390f29313caabcd4135')}},
        {$unwind : "$cast"}
    ]
)


db.imdb.aggregate(
    [
        {$match : {title : /^black/i}},
        {$project: {genres:1,awards:1,cast:1,title:1,imdb:1,tomatoes:1}},
        {$unwind : "$cast"},
        {$addFields: {castLength : {$strLenBytes : "$cast" }}},
        {$match : {castLength : {$gt : 15}}},
        {$addFields: {myField: { $trunc: [{$multiply : ["$imdb.rating","$tomatoes.viewer.rating"]},1]}}},
        {$project: {genres:1,myField:1,awards:1,_id:0,castLength:1,cast:1,title:1}}
    ]
)

db.car.aggregate (
    [
        {
            $lookup : {
                from: "orders",
                localField: "_id",
                foreignField: "car_id",
                as: "order"
            }
        },
        {
            $limit:5
        },
        {
            $out : {db: "test",coll : "car_orders"}
        }
    ]
)

db.car.aggregate (
    [
        {
            $lookup : {
                from: "orders",
                localField: "_id",
                foreignField: "car_id",
                as: "order"
            }
        },
        {
            $limit:10
        },
        {
            $merge :{
                into: {db: "test",coll : "car_orders"},
                on : "_id",
                whenMatched: "replace",
                whenNotMatched: "insert"
            }
        }
    ]
)

db.car.aggregate (
    [
        {
            $group : {
                _id: "$year",
                car_count : {$sum :1},
                avg_price: {$avg : "$price"}
            }
        },
        {
            $sort: {_id:1}
        },
        {
            $project: {
                year: "$_id",
                car_count:1,
                avg:{$trunc: ["$avg_price",1]},
                _id:0
            }
        }

    ]
)

db.car.aggregate (
    [
        {
            $bucket : {
                groupBy: "$year",
                boundaries: [1960,1970,1980,1990,2000,2010,2020],
                default: "other",
                output: {
                    count : {$sum : 1},
                    avg_price: {$avg : "$price"}
                }
            }
        },
        {
            $project: {
                year: "$_id",
                count:1,
                avg:{$trunc: ["$avg_price",1]},
                _id:0
            }
        }
    ]
)

db.car.aggregate (
    [
        {
            $bucketAuto : {
                groupBy: "$year",
                buckets: 10,
                output: {
                    count : {$sum : 1},
                    avg_price: {$avg : "$price"}
                }
            }
        },
        {
            $project: {
                year: "$_id",
                count:1,
                avg:{$trunc: ["$avg_price",1]},
                _id:0
            }
        }
    ]
)

db.movies.find({ _id: ObjectId('659fd45eba46cfc796f20330') }, { deneme: { $concatArrays: ["$genres", "$actors"] } } )
db.movies.find({_id: ObjectId('659fd45eba46cfc796f20330')},{deneme: {$concatArrays : ["$genres",["$actors"]]}})
db.imdb.find({"imdb.rating" : {$gt:6}})

db.movies.find({ _id: ObjectId('659fd45eba46cfc796f20330') }, { deneme: { $zip: { inputs: ["$genres", "$actors"] }} } )

db.movies.find({ _id: ObjectId('659fd45eba46cfc796f20330') }, { deneme: { $sum: ["$ratings.mndb","$soft_avocados"] }})
db.movies.find({ _id: ObjectId('659fd45eba46cfc796f20330') }, { deneme: { $sum: ["$ratings.mndb","$ratings.soft_avocados"] },ratings:1,title:1,_id:0})

db.imdb.find({fullplot: /anvil/}).count()
db.imdb.find({fullplot: /anvil/}).
explain("executionStats")

db.imdb.find( {$text : {$search :"anvil"} })

db.imdb.find( {$text : {$search :'"Snowflake plans"',$caseSensitive:false} }).count()
db.imdb.createIndex({"$**":"text"})

db.imdb.find({$expr : {$lt : ["$imdb.votes","$tomatoes.viewer.numReviews"]}})

db.imdb.find({$expr : {$lt : ["$imdb.votes","$tomatoes.viewer.numReviews"]}},
    {total : {$sum : ["$imdb.votes","$tomatoes.viewer.numReviews"]}}).limit(10)

db.imdb.find({$expr : {$lt : ["$imdb.votes","$tomatoes.viewer.numReviews"]}},
    {   total : {$sum : ["$imdb.votes","$tomatoes.viewer.numReviews"]},
        zaman : { $cond: {
                if: {$gte : ["$runtime",85]},
                then: "long",
                else :"short"
            }},
        runtime:1
    }
).limit(10)

db.createCollection("customer", {
        validator: {
            $jsonSchema: {
                bsonType: "object",
                required : ["name","surname","age","isActive","gender","email"],
                properties: {
                    name : {
                        bsonType: "string",
                        description: "name must be string and required"
                    },
                    surname: {
                        bsonType: "string",
                        description: "surname must be string and required"
                    },
                    age : {
                        bsonType: "int",
                        description: "age must be int and required"
                    },
                    isActive: {
                        bsonType: "bool",
                        description: "isActive must be bool and required"
                    },
                    gender: {
                        enum: ["M","F"],
                        description: "gender must be enum [M,F] and required"
                    },
                    nickNames: {
                        bsonType: "array",
                        description: "gender must be array"
                    },
                    email: {
                        bsonType: "string",
                        pattern: ".*\\.com$",
                        description: "surname must be string and required"
                    }
                }
            }
        }
    }
)

db.movies.aggregate(
    [
        {
            $match : {
                release_year: {
                    $gt : ISODate("2000-01-02T00:00:00.000Z")
                }
            }
        },
        {
            $project : {
                year : { $year : "$release_year" },
                title : 1,
                director : 1,
                runtime_min :1,
                level : {
                    $switch : {
                        branches : [
                            {case : {$gt: ["$runtime_min",120]}, then : "çok uzun metraj" },
                            {case : {$gt: ["$runtime_min",100]}, then : "uzun metraj" },
                            {case : {$gt: ["$runtime_min",70]}, then : "orta metraj" }
                        ],
                        default: "kısa metraj"
                    }
                },
                jtest : {
                    $function : {
                        body : function(abc,xyz) {
                            if (abc == null) {
                                return "null"
                            } else {
                                return "deneme : " + abc + " " + xyz;
                            }
                        },
                        args : ["$director","$gross"],
                        lang: "js"
                    }
                }
            }
        },
        {
            $limit : 10
        }
    ]
)


db.movies.aggregate(
    [
        {
            $match : {
                release_year: {
                    $gt : ISODate("2000-01-02T00:00:00.000Z")
                }
            }
        },
        {
            $project : {
                year : { $year : "$release_year" },
                title : 1,
                director : 1,
                runtime_min :1,
                level : {
                    $switch : {
                        branches : [
                            {case : {$gt: ["$runtime_min",120]}, then : "çok uzun metraj" },
                            {case : {$gt: ["$runtime_min",100]}, then : "uzun metraj" },
                            {case : {$gt: ["$runtime_min",70]}, then : "orta metraj" }
                        ],
                        default: "kısa metraj"
                    }
                },
                jtest : {
                    $concat : ["deneme : ","$director"," ", "$title"]
                }
            }
        },
        {
            $limit : 10
        }
    ]
)

db.imdb.updateOne({ _id: ObjectId('573a1390f29313caabcd548c') }, { $set: { countries: ["TR","USA","ESP","GR","JP"] } } )
db.imdb.updateOne({ _id: ObjectId('573a1390f29313caabcd548c') }, { $set: { "countries.3": "TR" } } )
db.imdb.updateOne({ _id: ObjectId('573a1390f29313caabcd548c') }, { $push: { "countries": "TEST" }})
db.imdb.updateOne({ _id: ObjectId('573a1390f29313caabcd548c') }, { $pop: { "countries": 1 }})
db.imdb.updateOne({ _id: ObjectId('573a1390f29313caabcd548c') }, { $pop: { "countries": -1 }})
db.imdb.updateOne({ _id: ObjectId('573a1390f29313caabcd548c') }, { $pull: { "countries": "TR" }})
db.imdb.updateOne({ _id: ObjectId('573a1390f29313caabcd548c') }, { $addToSet: { "countries": "TR" }})
db.imdb.updateOne({ _id: ObjectId('573a1390f29313caabcd548c') }, { $push: { "countries": {$each : ["ESP","DE","PO"],$slice:2}}})




