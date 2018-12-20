//
//  RootViewController.swift
//  Soqqle
//
//  Created by Duc Nguyen on 11/19/18.
//  Copyright © 2018 saro. All rights reserved.
//

import Foundation


class RootViewController: UIViewController {
    
    var indicatorView: RootIndicatorView?
    
    // showloading
    func showLoading(){
        if indicatorView == nil{
            indicatorView = RootIndicatorView()
        }
        indicatorView!.show()
    }
    
    // hide loading
    func hideLoading() {
        if let indicatorView = indicatorView{
            indicatorView.dismiss()
            self.indicatorView = nil
        }
    }
    
    
}
