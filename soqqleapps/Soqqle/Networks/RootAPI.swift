//
//  FitnessAPI.swift
//  Fitness
//
//  Created by Thinh Truong on 10/25/16.
//  Copyright © 2016 Reflect Apps Inc. All rights reserved.
//

import Foundation
import Alamofire
import AlamofireObjectMapper
import ObjectMapper
import UIKit


typealias GetAllStoriesFinishedHandler = ([StoryMappingResponse]?) -> Void


class RootAPI: NSObject {
    
    public struct Soqqle{
        static let baseURL = "https://stgapi.soqqle.com"
   
        struct Story {
            static let getAllStories =  baseURL + "/storiesGetAll"
        }
    }
    
    
    class var shared: RootAPI {
        struct Singleton {
            static let instance = RootAPI()
        }
        
        return Singleton.instance
    }
    
    func handleResponse<T>(response: DataResponse<GenericResponse<T>>) -> GenericResponse<T>{
        
        if let error = response.result.error {
            
            let result = GenericResponse<T>()
            result.status = false
            result.message = "An error has occurred. Error: " + error.localizedDescription
            
            return result
            
        }
        else if let result = response.result.value{
            
            return result
            
        }
        else {
            
            let result = GenericResponse<T>()
            result.status = false
            result.message = "Response is empty"
            
            return result
            
        }
        
    }
    
    func handleResponse<T>(response: DataResponse<GenericObjectResponse<T>>) -> GenericObjectResponse<T>{
        
        if let error = response.result.error {
            
            let result = GenericObjectResponse<T>()
            result.status = false
            result.message = "An error has occurred. Error: " + error.localizedDescription
            
            return result
            
        }
        else if let result = response.result.value{
            
            return result
            
        }
        else {
            
            let result = GenericObjectResponse<T>()
            result.status = false
            result.message = "Response is empty"
            
            return result
            
        }
    }
}

extension RootAPI {
    @discardableResult func getAllStories(resultHandler: GetAllStoriesFinishedHandler?) -> DataRequest{
   
        return Alamofire.request(Soqqle.Story.getAllStories, parameters: nil)
            .responseArray(queue: nil, context: nil) { (response: DataResponse<[StoryMappingResponse]>) in
                resultHandler?(response.result.value)
        }
    }
}





