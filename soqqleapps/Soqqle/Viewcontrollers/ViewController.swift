//
//  ViewController.swift
//  Soqqle
//
//  Created by saro on 03/11/18.
//  Copyright © 2018 saro. All rights reserved.
//

import UIKit

class ViewController: UIViewController {
    @IBOutlet weak var lblUnderLine: UILabel!
    @IBOutlet weak var btnDownArro: UIButton!
    @IBOutlet weak var vwChooseHero: UIView!
    @IBOutlet weak var lblLogoText: UILabel!
    @IBOutlet weak var lblIam: UILabel!
    @IBOutlet weak var btnHaveAnAccount: UIButton!
    @IBOutlet weak var tblVw: UITableView!
    @IBOutlet weak var lblChooseHero: UILabel!
    private var arrHeroList : [String]?
    
    override func viewDidLoad() {
        super.viewDidLoad()
        arrHeroList = ["superhero with #mad robot and Al skills","superhero with #cybergenetic biotech powers","superhero with unique business analystical abilities","superhero with unique business analystical abilities"]
        tblVw.tableFooterView = UIView()
        tblVw.isHidden = false
        // Do any additional setup after loading the view, typically from a nib.
    }
  
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        showThemeColor()
    }
    
    
    //Change Themecolor
    func showThemeColor(){
        
        if let theme = appCurrentTheme{
            theme.setHorizantalGradient(vw: self.view)
            lblLogoText.textColor =  hexToColor(theme.logoText!)
            lblIam.textColor = hexToColor(theme.iamText!)
            btnHaveAnAccount.setTitleColor(hexToColor(theme.mainTheme!), for: .normal)
            lblChooseHero.textColor = hexToColor(theme.chooseHero!)
            vwChooseHero.backgroundColor =  hexToColor(theme.chooseHero_bg!)
            btnDownArro.backgroundColor = hexToColor(theme.downArrow_bg!)
            
            lblUnderLine.backgroundColor =  hexToColor(theme.mainTheme!)
        }
        
    }
    
    @IBAction func onHaveOnAccount(_ sender: Any) {
        if let loginVc = self.storyboard?.instantiateViewController(withIdentifier: "LoginVC") as? LoginVC{
         self.navigationController?.pushViewController(loginVc, animated: false)
        }
        
    }
    
    @IBAction func onChooseYourHero(_ sender: UIButton) {
        tblVw.isHidden = !tblVw.isHidden
    }
    
    
}
extension ViewController : UITableViewDataSource, UITableViewDelegate{
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return arrHeroList?.count ?? 0
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        if let cell = tableView.dequeueReusableCell(withIdentifier: "TCellChooseHero") as? TCellChooseHero{
            cell.lblHero.text = arrHeroList?[indexPath.row]
              if let theme = appCurrentTheme{
                cell.lblHero.textColor = hexToColor(theme.chooseHeroList!)
                cell.cellbg.backgroundColor = hexToColor(theme.chooseHero_bg!)
            }

            return cell
        }
        return UITableViewCell()
    }
    
    func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        return tblVw.frame.height / 4
    }
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        lblChooseHero.text = arrHeroList?[indexPath.row]

        tblVw.isHidden = true
    }
    
}



