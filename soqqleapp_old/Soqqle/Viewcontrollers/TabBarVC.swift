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
}
