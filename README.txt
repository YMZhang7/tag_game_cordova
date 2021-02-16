Tag Game created by Yumeng Zhang (a1770710)

Thank you for viewing my project!

Before running the app, please start the server by using 

    node server.js

inside project/www.

When the app is launched, it will first prompt you to enter a server address. The address 192.168.0.13 worked on my device. If you see "connected!", then the app is good to go; if not, the IP address you entered may be invalid, please relaunch the app and try another one.

If you are using the apk to test the app, application error "the connection to the server was unsuccessful" might occur. When that happens, please relaunch the app a few times, it will eventually start working.

===========

Game Rules:

H: players who hide
C: players who chase and catch

[Typical Round of Game]
 * !!! This is multi-player game! Single player is technically supported, but it is boring.
 * Registration first: set your nickname and whether you want to chase or hide. The nickname cannot be empty or the same as other players present in the game room.
 * If H is within 5% distance from C, C can catch H, C's button will turn green, and H will be warned of the danger.

 Level 1:
  C:
   * Level up if C catches 1 player

  H:
   * Level up if H remains uncaught for 60 seconds.
   * If H is caught, the timer will restart.

 Level 2:
  C:
   * Tool: 2 Ice cubes => randomly choose 1 player to freeze for 10 seconds.
   * Level up if C catches 2 players (or catch the same player twice)

  H:
  * Tools: 2 shields => when being frozen, a shield can be used to unfreeze
  * Level up if H remains not caught for 2 minutes.
  * If H is caught, the timer will restart (back to 2 minutes).

 Level 3:
  C:
   * Tools: 2 rockets => gain faster speed for 10 seconds
   * Gain 2 more rockets after C catches 3 players

  H:
   * Tools: 2 invisibility cloaks => disappear from the playground for 10 seconds (however, C can still detect the invisible H)
   * Gain 2 more invisibility cloak if H remains uncaught for 3 minutes.
   * If H is caught, the timer will restart (3 minutes).