//
//  CarouselModalVW.swift
//  Soqqle
//
//  Created by saro on 03/11/18.
//  Copyright © 2018 saro. All rights reserved.
//

import UIKit
import SDWebImage

class CarouselModalVW: UIView {

    var imageBasedURL = "https://s3.us-east-2.amazonaws.com/admin.soqqle.com/storyImages/{id}"
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
    
    
    func binding(story : StoryMappingResponse?) {
        
        // load images
        let placeHolderImage = UIImage(named: "samp_image")
        let imageURL = imageBasedURL.replacingOccurrences(of: "{id}", with: story?._id ?? "")
        if let urlImage = URL(string: imageURL) {
            self.imgVW.sd_setImage(with: urlImage, placeholderImage: placeHolderImage)
        } else {
            self.imgVW.image = placeHolderImage
        }
        
        // load description
        self.lblInfo.text = story?.description ?? ""
        
        // load objective
        let objectiveValue = story?.objectiveValue ?? "0"
        let objectiveName = story?.objective?.name ?? ""
        self.lblilluminates.text = "\(objectiveValue) \(objectiveName.uppercased())"
        
        // load daily completed
        let refresh = story?.refresh ?? ""
        let quota = story?.quota ?? 0
        self.lblWeekly.text = "\(0)/\(quota) \(refresh.uppercased())"
        
        // load token receivecd
        let rewardName = story?.reward?.type ?? ""
        let rewardValue = story?.reward?.value ?? 0
        self.lblToken.text = "\(rewardValue) \(rewardName.uppercased())"
    
    }

}
