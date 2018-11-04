//
//  TabBarVC.swift
//  Soqqle
//
//  Created by saro on 03/11/18.
//  Copyright © 2018 saro. All rights reserved.
//

import UIKit

class TabBarVC: UITabBarController {

    override func viewDidLoad() {
        super.viewDidLoad()

        

        
        
  //      self.tabBarController?.tabBar.tintColor = UIColor.orange
   //     self.tabBarController?.tabBar.barTintColor = UIColor.green
        
        // Do any additional setup after loading the view.
    }
    

    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        var colors = [UIColor]()
        if let theme = appCurrentTheme{
            colors.append(hexToColor(theme.mainTheme!))
            colors.append(UIColor.black)
        }
        UITabBar.appearance().barTintColor = self.tabBar.getGradient(colors: colors)
        UITabBar.appearance().tintColor = UIColor.white
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
