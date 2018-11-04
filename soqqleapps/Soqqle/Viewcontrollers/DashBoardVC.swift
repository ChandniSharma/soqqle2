//
//  DashBoardVC.swift
//  Soqqle
//
//  Created by saro on 03/11/18.
//  Copyright © 2018 saro. All rights reserved.
//

import UIKit

class DashBoardVC: UIViewController {

   
    @IBOutlet weak var btnUnlike: UIButton!
    @IBOutlet weak var btnLike: UIButton!
    @IBOutlet weak var iCarouselVW: iCarousel!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        self.navigationController?.isNavigationBarHidden = false
        loadCarouselVW()
        
        // Do any additional setup after loading the view.
    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        showThemeColor()
    }
    
    func showThemeColor(){
        
        if let theme = appCurrentTheme{
            theme.setNavigationGraditent(nav: self.navigationController!)
            btnLike.backgroundColor = hexToColor(theme.carousel_lbl_text!)
            btnLike.layer.cornerRadius = btnUnlike.frame.height / 2
            btnLike.layer.masksToBounds = true
            
            btnUnlike.backgroundColor = .clear
            btnUnlike.layer.cornerRadius = btnUnlike.frame.height / 2
            btnUnlike.layer.masksToBounds = true
            btnUnlike.layer.borderWidth = 1.0
            btnUnlike.layer.borderColor = hexToColor(theme.downArrow_bg!).cgColor
            
        }
    }
    
    //Load CarouselView
    func loadCarouselVW(){
        iCarouselVW.delegate = self
        iCarouselVW.dataSource = self
        iCarouselVW.type = .rotary
        iCarouselVW.decelerationRate = 0.1
         if let theme = appCurrentTheme{
        iCarouselVW.backgroundColor = hexToColor(theme.carousel_bg!)
        }
        iCarouselVW.isPagingEnabled = true
    }
    
    //When meesage icon tapped this method trigger
    @IBAction func onMessage(_ sender: Any) {
        
    }
    
    
    //When menu icon tapped this method trigger
    @IBAction func onMenu(_ sender: Any) {
        
    }
    
    /*
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        // Get the new view controller using segue.destination.
        // Pass the selected object to the new view controller.
    }
    */

}

extension DashBoardVC : iCarouselDelegate, iCarouselDataSource{
    func numberOfItems(in carousel: iCarousel) -> Int {
        return 4
    }
    
    func carousel(_ carousel: iCarousel, viewForItemAt index: Int, reusing view: UIView?) -> UIView {
        
        
        var carouserlVw : CarouselModalVW?
        
        if let crlVw = view as? CarouselModalVW{
            carouserlVw = crlVw
        }else{
            
            carouserlVw = CarouselModalVW.instanceFromNib()
            carouserlVw?.frame = iCarouselVW.frame
            carouserlVw?.frame.origin.x = 0
            
        }
        if let theme = appCurrentTheme{
              theme.setHorizantalGradient(vw: self.view)
             theme.setBg(vw: carouserlVw!)
            
          //  carouserlVw?.backgroundColor = .red
                //hexToColor(theme.carousel_bg!)
            
            carouserlVw?.lblInfo.textColor = hexToColor(theme.general!)
            carouserlVw?.lblToken.textColor = hexToColor(theme.carousel_lbl_text!)
            carouserlVw?.lblToken.backgroundColor = hexToColor(theme.carousel_lbl_bg!)
            
            carouserlVw?.lblilluminates.textColor = hexToColor(theme.carousel_lbl_text!)
            carouserlVw?.lblilluminates.backgroundColor = hexToColor(theme.carousel_lbl_bg!)
            
            carouserlVw?.lblWeekly.textColor = hexToColor(theme.carousel_lbl_text!)
            carouserlVw?.lblWeekly.backgroundColor = hexToColor(theme.carousel_lbl_bg!)
              carouserlVw?.vwOverlay.backgroundColor = hexToColor(theme.mainTheme!).withAlphaComponent(0.5)
        }
      
        carouserlVw?.vwOverlay.isHidden = false
        carouserlVw?.imgVW.image = UIImage(named: "samp_image")
        
        return carouserlVw!
    }
    
    
    func carouselDidEndScrollingAnimation(_ carousel: iCarousel) {

         if let crlVw = carousel.currentItemView as? CarouselModalVW{
            crlVw.vwOverlay.isHidden = true
        }
    }
    
    
    func carousel(_ carousel: iCarousel, didSelectItemAt index: Int) {
        
        if let crlVw =   carousel.itemView(at: index) as? CarouselModalVW{
    
        }
    }
    
}

