# Webware Final Project ---- Moene's Clipboard
## Project Link  
Due to our policy, We are actively blocking access from some countries. Please use a VPN if your country got blocked by me.

No illeagal content is allowed on this service. Database will get randomly cleaned from time to time.

https://clip.kmoene.com  
## Team members
Hao Chen, Sizhe Li, Shen Fang, Kawane Moene

## 1.General description
We are making an online content-hosting and content-sharing service just like pastebin or any other text storage sites where the users can store plain text or share texts to other people. However the sender will be asked to input a secret key or password for sharing and the receiver has to provide the same secret key or password to view the text content. 

All encryption will be done at the client so that no plaintext would be shown throughout the commication. Only the registered user can send messages, but receiver doesn't have to be a registered user. All information will be store in mongodb and will be hosted on Heroku.   

## 2.Additional Instructions 
To prevent dummy accounts from unnecessarily burdening the server, we decided to let users log in only through GitHub Oauth.
Please adjust your monitor resolution to 100% for the best browsing experience. The sender can choose to be anonymous or have their Github username to be displayed along with the message.   
## 3.Technologies 
Listed below are some of the technologies we used in the development process:

 - Mongodb (M)  
 - express.js (E)  
 - Node.js (N)  
 - CryptoJS  
 - javascript  

## 4.Challenges   
Overall for backend, the major challenges are the communication between clients and server as well as the client side encryption/decryption.    
The integration of front-end and back-end was once a very big challenge. At the same time, it is also very interesting and challenging not to use passport.js to implement Oauth to help users authenticate. To avoid spam-messaging, we all agreed on using Oauth via Github. 

The encrypted string array size is also problematic since the default size of express json middleware is 1 mb, and it took us a while to find the right way to expand the size.   

For front end, to ensure that website visitors can easily interact with the page and also the visual style of the website looks modern enough, we did a lot of adjustments comparing with the first version through the combination of design, technology and programming to code our website's appearance, as well as taking care of debugging.


## 5.Team Contribution

**Hao Chen**:  Message encryption, decryption, client server communication, link generation, client-sending and client-viewing routing set up  
**Sizhe Li**:  Frontend Design, include Animation generation, Logo design. Main CSS coding, desgin the UI appearance to make it looks like a modern website  
**Kawane Moene**: Backend, MongoDB, message auto-decrypt, misc UI-tweaks, project management  
**Shen Fang**: Image encryption, decryption, storage and display. CSS. Link copy button


