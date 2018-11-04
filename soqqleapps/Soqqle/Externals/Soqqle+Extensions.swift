//
//  Soqqle+Extensions.swift
//  Soqqle
//
//  Created by saro on 04/11/18.
//  Copyright © 2018 saro. All rights reserved.
//

import Foundation


//Getting GradientImage based on colors
extension CAGradientLayer {
    
    convenience init(frame: CGRect, colors: [UIColor],_ isHorizantal : Bool = true) {
        self.init()
        self.frame = frame
        self.colors = []
        for color in colors {
            self.colors?.append(color.cgColor)
        }
        startPoint = CGPoint(x: 0.0, y: 0.0)
        endPoint = CGPoint(x: 2.5, y: 0)
        if isHorizantal == true{
             startPoint = CGPoint(x: 0.5, y: 0.3)
             endPoint = CGPoint(x: 1, y: 3)
        }
        
       
    }
    
    func createGradientImage() -> UIImage? {
        
        var image: UIImage? = nil
        UIGraphicsBeginImageContext(bounds.size)
        if let context = UIGraphicsGetCurrentContext() {
            render(in: context)
            image = UIGraphicsGetImageFromCurrentImageContext()
        }
        UIGraphicsEndImageContext()
        return image
    }
    
}


//Gradient background for navigation controller
extension UINavigationBar {
    
    func setGradientBackground(colors: [UIColor]) {
        
        var updatedFrame = bounds
        updatedFrame.size.height += self.frame.origin.y//250//
        let gradientLayer = CAGradientLayer(frame: updatedFrame, colors: colors)
        setBackgroundImage(gradientLayer.createGradientImage(), for: UIBarMetrics.default)
    }
}


//Gradient for uiview
extension UIView{
    func setGradient(colors: [UIColor]) {
        var updatedFrame = bounds
        updatedFrame.size.height += self.frame.origin.y//250//
        let gradientLayer = CAGradientLayer(frame: updatedFrame, colors: colors)
        self.backgroundColor = UIColor(patternImage: gradientLayer.createGradientImage() ?? UIImage())
    }
    
    func setGradientVertical(colors: [UIColor]) {
        var updatedFrame = bounds
        updatedFrame.size.height += self.frame.origin.y
        let gradientLayer = CAGradientLayer(frame: updatedFrame, colors: colors, false)
        //(frame: updatedFrame, colors: colors)
        self.backgroundColor = UIColor(patternImage: gradientLayer.createGradientImage() ?? UIImage())
    }
    
    
    func getGradient(colors: [UIColor]) ->UIColor{
        let updatedFrame = bounds
        // updatedFrame.size.height
        let gradientLayer = CAGradientLayer(frame: updatedFrame, colors: colors)
        return UIColor(patternImage: gradientLayer.createGradientImage() ?? UIImage())
    }
    
}

//Set padding in uitexfield
extension UITextField {
    func setLeftPaddingPoints(_ amount:CGFloat){
        let paddingView = UIView(frame: CGRect(x: 0, y: 0, width: amount, height: self.frame.size.height))
        self.leftView = paddingView
        self.leftViewMode = .always
    }
    func setRightPaddingPoints(_ amount:CGFloat) {
        let paddingView = UIView(frame: CGRect(x: 0, y: 0, width: amount, height: self.frame.size.height))
        self.rightView = paddingView
        self.rightViewMode = .always
    }
}
