//
//  CarouselModalVW.swift
//  Soqqle
//
//  Created by saro on 03/11/18.
//  Copyright © 2018 saro. All rights reserved.
//

import UIKit

class CarouselModalVW: UIView {

    @IBOutlet weak var imgVW: UIImageView!
    @IBOutlet weak var lblInfo: UILabel!
    @IBOutlet weak var lblToken: UILabel!
    
    @IBOutlet weak var vwOverlay: UIView!
    @IBOutlet weak var lblilluminates: UILabel!
    
    @IBOutlet weak var lblWeekly: UILabel!
    /*
    // Only override draw() if you perform custom drawing.
    // An empty implementation adversely affects performance during animation.
    override func draw(_ rect: CGRect) {
        // Drawing code
    }
    */
    
    class func instanceFromNib() -> CarouselModalVW {
        
        let vw = UINib(nibName: "CarouselModalVW", bundle: nil).instantiate(withOwner: nil, options: nil)[0] as! CarouselModalVW
   
        return vw
    }
    

}
