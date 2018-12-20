//
//  AppTheme.swift
//  Soqqle
//
//  Created by saro on 04/11/18.
//  Copyright © 2018 saro. All rights reserved.
//

import UIKit

class AppTheme: Codable {
    
    var logoText : String?
    var iamText : String?
    var chooseHero : String?
    var chooseHeroList : String?
    var mainTheme : String?
    var downArrow_bg : String?
    var chooseHero_bg : String?
    var txt_bg : String?
    var txtField : String?
    var carousel_bg : String?
    var carousel_lbl_bg : String?
    var carousel_lbl_text : String?
    var like : String?
    var dislike : String?
    var bg_top : String?
    var bg_bottom : String?
    var general : String?
    
    init(dictTheme : NSDictionary){
       logoText = getValue(key: "logoText", dictTheme: dictTheme)
       iamText = getValue(key: "iamText", dictTheme: dictTheme)
       chooseHero = getValue(key: "chooseHero", dictTheme: dictTheme)
       chooseHeroList = getValue(key: "chooseHeroList", dictTheme: dictTheme)
       mainTheme = getValue(key: "mainTheme", dictTheme: dictTheme)
       downArrow_bg = getValue(key: "downArrow_bg", dictTheme: dictTheme)
       chooseHero_bg = getValue(key: "chooseHero_bg", dictTheme: dictTheme)
       txt_bg = getValue(key: "txt_bg", dictTheme: dictTheme)
       txtField = getValue(key: "txtField", dictTheme: dictTheme)
       carousel_bg = getValue(key: "carousel_bg", dictTheme: dictTheme)
       carousel_lbl_bg = getValue(key: "carousel_lbl_bg", dictTheme: dictTheme)
       carousel_lbl_text = getValue(key: "carousel_lbl_text", dictTheme: dictTheme)
       like = getValue(key: "like", dictTheme: dictTheme)
       dislike = getValue(key: "dislike", dictTheme: dictTheme)
       bg_top = getValue(key: "bg_top", dictTheme: dictTheme)
       bg_bottom = getValue(key: "bg_bottom", dictTheme: dictTheme)
        general = getValue(key: "general", dictTheme: dictTheme)
        
    }
    
    func getValue (key : String, dictTheme : NSDictionary)->String{
        if let strValue = dictTheme[key] as? String{
            return strValue
        }
        return ""
    }
    
    func setNavigationGraditent(nav : UINavigationController){
        var colors = [UIColor]()
        colors.append(hexToColor(self.mainTheme!))
        colors.append(hexToColor("5f0070"))
        nav.navigationBar.setGradientBackground(colors: colors)
    }
    
    func setBg(vw : UIView){
       
        let colors = [hexToColor("161616"), hexToColor("3239c2")]
        vw.setGradientVertical(colors: colors)
        
    }
    func setHorizantalGradient(vw : UIView){
        
   
       let colors = [hexToColor("161616"),hexToColor("3239c2")]
        vw.setGradient(colors: colors)
        
    }
    
    
    func getImageFrom(gradientLayer:CAGradientLayer) -> UIImage? {
        var gradientImage:UIImage?
        UIGraphicsBeginImageContext(gradientLayer.frame.size)
        if let context = UIGraphicsGetCurrentContext() {
            gradientLayer.render(in: context)
            gradientImage = UIGraphicsGetImageFromCurrentImageContext()?.resizableImage(withCapInsets: UIEdgeInsets.zero, resizingMode: .stretch)
        }
        UIGraphicsEndImageContext()
        return gradientImage
    }
    
}
