//
//  Constants.swift
//  Soqqle
//
//  Created by saro on 04/11/18.
//  Copyright © 2018 saro. All rights reserved.
//

import Foundation
var appCurrentTheme : AppTheme?


//Getting theme colors based on type
func getTheme(themeType : String){

    if let path = Bundle.main.path(forResource: "Theme", ofType: "plist"),
        let myDict = NSDictionary(contentsOfFile: path){
        
        if let dictSelectTheme = myDict[themeType] as? NSDictionary{
            appCurrentTheme = AppTheme(dictTheme: dictSelectTheme)
        }
    }
}


//Coverty hexstring to uicolor
func hexToColor (_ hexStr:String) -> UIColor {
    let hex = "#\(hexStr)"
    var cString:String = hex.trimmingCharacters(in: .whitespacesAndNewlines).uppercased()
    
    if (cString.hasPrefix("#")) {
        cString.remove(at: cString.startIndex)
    }
    
    if ((cString.count) != 6) {
        return UIColor.gray
    }
    
    var rgbValue:UInt32 = 0
    Scanner(string: cString).scanHexInt32(&rgbValue)
    
    return UIColor(
        red: CGFloat((rgbValue & 0xFF0000) >> 16) / 255.0,
        green: CGFloat((rgbValue & 0x00FF00) >> 8) / 255.0,
        blue: CGFloat(rgbValue & 0x0000FF) / 255.0,
        alpha: CGFloat(1.0)
    )
}
