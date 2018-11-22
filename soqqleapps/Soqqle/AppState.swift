//
//  AppState
//  Fitness
//
//  Created by Duc Nguyen on 10/1/16.
//  Copyright © 2016 Reflect Apps Inc. All rights reserved.
//

import Foundation

class AppState: NSObject {
    
    static var shared = AppState()
    
    // current selecte tab bar where user is doing
    var stories : [StoryMappingResponse]?

    // Init view
    override init() {
        
    }
}

