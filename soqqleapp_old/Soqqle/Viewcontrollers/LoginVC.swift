//
//  LoginVC.swift
//  Soqqle
//
//  Created by saro on 03/11/18.
//  Copyright © 2018 saro. All rights reserved.
//

import UIKit

class LoginVC: UIViewController {

    @IBOutlet weak var lblLogoText: UILabel!
    @IBOutlet weak var btnLogin: UIButton!
    @IBOutlet weak var txtPassword: UITextField!
    @IBOutlet weak var txtEmail: UITextField!
    @IBOutlet weak var btnFacebook: UIButton!
    @IBOutlet weak var btnLinkedIn: UIButton!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        txtEmail.setLeftPaddingPoints(20)
        txtPassword.setLeftPaddingPoints(20)
        // Do any additional setup after loading the view.
    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        showThemeColor()
    }
    

    func showThemeColor(){
        
        if let theme = appCurrentTheme{
            theme.setHorizantalGradient(vw: self.view)
            lblLogoText.textColor = hexToColor(theme.logoText!)
            btnLogin.setTitleColor(hexToColor(theme.general!), for: .normal)
            btnLogin.backgroundColor = hexToColor(theme.mainTheme!)
            txtEmail.textColor = hexToColor(theme.txtField!)
            txtPassword.textColor = hexToColor(theme.txtField!)
            txtEmail.backgroundColor = hexToColor(theme.txt_bg!)
            txtPassword.backgroundColor = hexToColor(theme.txt_bg!)
            
            txtEmail.attributedPlaceholder = NSAttributedString(string: "Email",
                                                                attributes: [NSAttributedString.Key.foregroundColor: hexToColor(theme.general!)])
            
            txtPassword.attributedPlaceholder = NSAttributedString(string: "Password",
                                                                   attributes: [NSAttributedString.Key.foregroundColor: hexToColor(theme.general!)])
            
            btnFacebook.setTitleColor(hexToColor(theme.general!), for: .normal)
            btnLinkedIn.setTitleColor(hexToColor(theme.general!), for: .normal)
            
            var colors = [UIColor]()
            if let theme = appCurrentTheme{
                colors.append(hexToColor(theme.mainTheme!))
                colors.append(UIColor.black)
            }
            
            btnLogin.setGradient(colors: colors)
            
        }
    }
    
    @IBAction func onSocialLogin(_ sender: UIButton) {
        if sender.tag == 1{
            //facebook
        }else{
            //Linkedin
        }
        
    }
    
    @IBAction func onLogin(_ sender: Any) {
        if let tapVC = self.storyboard?.instantiateViewController(withIdentifier: "TabBarVC") as? TabBarVC{
            self.navigationController?.pushViewController(tapVC, animated: false)
        }
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


