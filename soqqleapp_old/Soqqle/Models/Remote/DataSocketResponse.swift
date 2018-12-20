//
//  CPSocket.swift
//  Cinema Popcorn
//
//  Created by Duc Nguyen on 11/14/18.
//  Copyright © 2018 Scoville Bilodeau. All rights reserved.
//

import Foundation
import ObjectMapper

class ProviderSocketResponse: Mappable {
    
    public var name: String = ""
    public var url: String = ""
    
    required init?(map: Map) {
        
    }
    
    public func mapping(map: Map) {
        name <- map["name"]
        url <- map["url"]
    }
}


class HotSocketResponse: Mappable {
    
    public var name: String = ""
    public var url: String = ""
    
    required init?(map: Map) {
        
    }
    
    public func mapping(map: Map) {
        name <- map["name"]
        url <- map["url"]
    }
}


class ResultSocketResponse: Mappable {
    
    public var fFile: String = ""
    public var fSize: String = ""
    public var fType: String = "direct"
    public var fLabel: String = ""
    
    required init?(map: Map) {
        
    }
    
    public func mapping(map: Map) {
        fFile <- map["file"]
        fLabel <- map["label"]
        fSize <- map["size"]
        fType <- map["type"]
    }
}

class DataSocketResponse: Mappable {
    
    public var status: Int = 0
    public var message: String = ""
    public var host: HotSocketResponse?
    public var provider: ProviderSocketResponse?
    public var results: [ResultSocketResponse]?
    
    required init?(map: Map) {
        
    }
    
    public func mapping(map: Map) {
        status <- map["status"]
        message <- map["message"]
        host <- map["data.host"]
        provider <- map["data.provider"]
        results <- map["data.result"]

    }

}

