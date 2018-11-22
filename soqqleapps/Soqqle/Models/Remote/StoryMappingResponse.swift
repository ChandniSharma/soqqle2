//
//  StoryMappingResponse.swift
//  Soqqle
//
//  Created by Duc Nguyen on 11/19/18.
//  Copyright © 2018 saro. All rights reserved.
//

import Foundation
import Alamofire
import AlamofireObjectMapper
import ObjectMapper


class RewardMappingResponse: Mappable {
    var type: String?
    var value: Int?
    
    required init?(map: Map) {
    }
    
    func mapping(map: Map) {
        type <- map["type"]
        value <- map["value"]
    }
}
class ObjectiveMappingResponse: Mappable {
    
    var name: String?
    var value: String?
    var __v: Int?
    
    
    required init?(map: Map) {
    
    }
    
    func mapping(map: Map) {
        name <- map["name"]
        value <- map["value"]
        __v <- map["__v"]
    }
}

// This is mapping for url https://stgapi.soqqle.com/storiesGetAll
class StoryMappingResponse: Mappable {
    
    var _id: String?
    var image: String?
    var description: String?
    var objective: ObjectiveMappingResponse?
    var objectiveValue: String?
    var refresh: String?
    var quota: Int?
    var reward: RewardMappingResponse?
 
    
    required init?(map: Map) {
        
    }
    
    func mapping(map: Map) {
        _id <- map["_id"]
        description <- map["description"]
        objective <- map["_objective"]
        objectiveValue <- map["objectiveValue"]
        refresh <- map["refresh"]
        quota <- map["quota"]
        reward <- map["reward"]
        
    }
}
